const fs = require('fs');
const http = require('http');
const https = require('https');
const path = require('path');

async function download(url, filePath) {
  const proto = !url.charAt(4).localeCompare('s') ? https : http;

  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filePath);
    let fileInfo = null;

    const request = proto.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to get '${url}' (${response.statusCode})`));
        return;
      }

      fileInfo = {
        mime: response.headers['content-type'],
        size: parseInt(response.headers['content-length'], 10),
      };

      response.pipe(file);
    });

    // The destination stream is ended by the time it's called
    file.on('finish', () => resolve(fileInfo));

    request.on('error', (err) => {
      fs.unlink(filePath, () => reject(err));
    });

    file.on('error', (err) => {
      fs.unlink(filePath, () => reject(err));
    });

    request.end();
  });
}

const run = async () => {
  const iso = new Date().toISOString();
  const ymd = iso.slice(0, 10);
  const filePath = path.join(__dirname, `${ymd}.json`);
  if (!fs.existsSync(filePath)) {
    await download(
      'https://fantasy.premierleague.com/api/bootstrap-static/',
      filePath,
    );
  }
  const fixturesPath = path.join(__dirname, `fixtures.json`);
  const THREE_DAYS_MS = 1000 * 60 * 60 * 24 * 3;
  if (
    !fs.existsSync(fixturesPath) ||
    iso >
      new Date(fs.statSync(fixturesPath).mtimeMs + THREE_DAYS_MS).toISOString()
  ) {
    await download(
      'https://fantasy.premierleague.com/api/fixtures/',
      fixturesPath,
    );
  }

  const json = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const fixtures = JSON.parse(fs.readFileSync(fixturesPath, 'utf8'));

  const gameWeeks = json['events'];
  const teams = json['teams'];

  const trimFixture = ({ team_h, team_a, kickoff_time }) => ({
    team_h,
    team_a,
    kickoff_time,
  });

  const fixturesByGameWeek = [];
  let j = 0;
  for (let i = 1; i < gameWeeks.length; i++) {
    fixturesByGameWeek.push({
      fixtures: [],
      deadline_time: gameWeeks[i - 1].deadline_time,
    });
    for (; j < fixtures.length; j++) {
      const fixture = fixtures[j];

      if (fixture.kickoff_time > gameWeeks[i].deadline_time) {
        break;
      }

      fixturesByGameWeek[i - 1].fixtures.push(trimFixture(fixture));
    }
  }
  fixturesByGameWeek.push({
    fixtures: fixtures.slice(j).map(trimFixture),
    deadline_time: gameWeeks[37].deadline_time,
  });

  for (const gameWeekData of fixturesByGameWeek) {
    const data = [];
    for (const fixture of gameWeekData.fixtures) {
      const home = teams[fixture.team_h - 1];
      const home_strength_attack =
        (home.strength_attack_home + home.strength_attack_away) / 2;
      const home_strength_defence =
        (home.strength_defence_home + home.strength_defence_away) / 2;

      const away = teams[fixture.team_a - 1];
      const away_strength_attack =
        (away.strength_attack_home + away.strength_attack_away) / 2;
      const away_strength_defence =
        (away.strength_defence_home + away.strength_defence_away) / 2;

      // console.log(home.short_name + " v " + away.short_name);
      const homeXG =
        (home_strength_attack - away_strength_defence) * 0.00613636364 +
        2.2962963;
      const awayXG =
        (away_strength_attack - home_strength_defence) * 0.00454545455 + 1.5;

      const homePCS = Math.pow(Math.E, -awayXG);
      const awayPCS = Math.pow(Math.E, -homeXG);

      data.push({
        kickoff_time: fixture.kickoff_time,
        home: home.short_name,
        away: away.short_name,
        homeXG,
        awayXG,
        homePCS,
        awayPCS,
      });
    }
    gameWeekData.fixtures = data;
  }

  fs.writeFileSync(
    path.join(__dirname, '..', 'src', 'gameWeeks.json'),
    JSON.stringify(fixturesByGameWeek),
  );
};

run();
