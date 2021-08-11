import React, { useMemo, useState } from 'react';
import matchData from './matches';
import gameWeeks from './gameWeeks';

const { matchMap, teams } = matchData;

function App() {
  const [gameWeek, setGameWeek] = useState(
    Math.max(
      gameWeeks.findIndex(
        ({ deadline_time }) => deadline_time >= new Date().toISOString(),
      ),
      0,
    ),
  );

  const { att, def } = useMemo(() => {
    const teams = [];
    for (let i = 0; i < gameWeeks[gameWeek].fixtures.length; i++) {
      const { home, away, homeXG, awayXG, homePCS, awayPCS } =
        gameWeeks[gameWeek].fixtures[i];
      teams.push({
        team: home,
        xg: homeXG,
        pcs: homePCS,
      });
      teams.push({
        team: away,
        xg: awayXG,
        pcs: awayPCS,
      });
    }
    return {
      att: [...teams.sort(({ xg: a }, { xg: b }) => b - a)],
      def: [...teams.sort(({ pcs: a }, { pcs: b }) => b - a)],
    };
  }, [gameWeek]);

  return (
    <div>
      <header>
        <h1>fpl-fixture-difficulty 2021-22</h1>
      </header>
      <main>
        <div className="bigboi">
          <div className="row">
            <div className="spacer" />
            <div className="away">Away</div>
          </div>
          <div className="row">
            <div className="home">
              <div className="home-label">Home</div>
            </div>
            <div className="table">
              <div className="cell vh hh" />
              {teams.map((team) => (
                <div className="cell hh">
                  <div className="rotate">{team.short_name}</div>
                </div>
              ))}
              {teams.map((hometeam, i) => (
                <React.Fragment key={hometeam.id}>
                  <div className="cell vh">{hometeam.short_name}</div>
                  {teams.map((awayteam, j) => {
                    const match = matchMap[i][j];
                    if (match === null)
                      return (
                        <div
                          className="cell null"
                          key={`${hometeam.id}-${awayteam.id}`}
                        />
                      );
                    const { homeXG, awayXG, homePCS, awayPCS } = match;

                    const xgDiff = Math.max(-4, Math.min(homeXG - awayXG, 4));
                    const green = 135 + Math.round(xgDiff * 30);
                    const red = 135 + Math.round(xgDiff * -30);

                    return (
                      <div
                        className="cell"
                        key={`${hometeam.id}-${awayteam.id}`}
                        style={{ background: `rgb(${red},${green},20)` }}
                      >
                        <div className="popup">
                          <div className="cell-title">
                            {hometeam.short_name} v {awayteam.short_name}
                          </div>
                          <div className="label">expected goals</div>
                          <div className="values">
                            <div className="value">{homeXG.toFixed(2)}</div>
                            <div className="value">{awayXG.toFixed(2)}</div>
                          </div>
                          <div className="label">
                            probability of a clean sheet
                          </div>
                          <div className="values">
                            <div className="value">
                              {Math.round(homePCS * 100)}%
                            </div>
                            <div className="value">
                              {Math.round(awayPCS * 100)}%
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
        <div className="fixtures">
          <div className="buttons">
            <button
              disabled={gameWeek < 1}
              onClick={() => setGameWeek(gameWeek - 1)}
            >
              {'<'}
            </button>
            <div className="grow">
              Gameweek {gameWeek + 1}
              <br />
              <small>{gameWeeks[gameWeek].deadline_time}</small>
            </div>
            <button
              disabled={gameWeek > 36}
              onClick={() => setGameWeek(gameWeek + 1)}
            >
              {'>'}
            </button>
          </div>
          <div className="three-cols">
            <div className="col">
              <h3>Fixtures</h3>
              {gameWeeks[gameWeek].fixtures.map(
                ({ kickoff_time, home, away }) => {
                  return (
                    <div key={`${home}-${away}`} style={{ marginBottom: 8 }}>
                      <div className="time">{kickoff_time}</div>
                      {home} v {away}
                    </div>
                  );
                },
              )}
            </div>
            <div className="col">
              <h3>Best for GKP & DEF</h3>
              <p>Chances of clean sheet</p>
              {def.map(({ team, pcs }, j) => (
                <pre key={j} style={{ margin: 0 }}>
                  {team} {(pcs * 100).toFixed(0).padStart(3, ' ')}%
                </pre>
              ))}
            </div>
            <div className="col">
              <h3>Best for MID & FWD</h3>
              <p>Expected goals scored</p>
              {att.map(({ team, xg }, j) => (
                <pre key={j} style={{ margin: 0 }}>
                  {team} {xg.toFixed(1).padStart(4, ' ')}
                </pre>
              ))}
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <pre style={{ margin: '32px auto 0' }}></pre>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
