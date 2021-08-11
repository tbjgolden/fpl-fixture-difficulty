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
  const allFixtures = JSON.parse(fs.readFileSync(fixturesPath, 'utf8'));

  const teams = json['teams'];
  const fixtures = allFixtures;

  const matchMap = new Array(20).fill(null).map(() => new Array(20).fill(null));

  for (const fixture of fixtures) {
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

    matchMap[fixture.team_h - 1][fixture.team_a - 1] = {
      homeXG,
      awayXG,
      homePCS,
      awayPCS,
    };
  }

  fs.writeFileSync(
    path.join(__dirname, '..', 'src', 'matches.json'),
    JSON.stringify({
      matchMap,
      teams,
    }),
  );
};

run();
