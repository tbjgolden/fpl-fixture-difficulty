import React, {useMemo, useState} from "../_snowpack/pkg/react.js";
import matchData from "./matches.json.proxy.js";
import gameWeeks from "./gameWeeks.json.proxy.js";
const {matchMap, teams} = matchData;
function App() {
  const [gameWeek, setGameWeek] = useState(0);
  const {att, def} = useMemo(() => {
    const teams2 = [];
    for (let i = 0; i < gameWeeks[gameWeek].fixtures.length; i++) {
      const {home, away, homeXG, awayXG, homePCS, awayPCS} = gameWeeks[gameWeek].fixtures[i];
      teams2.push({
        team: home,
        xg: homeXG,
        pcs: homePCS
      });
      teams2.push({
        team: away,
        xg: awayXG,
        pcs: awayPCS
      });
    }
    return {
      att: [...teams2.sort(({xg: a}, {xg: b}) => b - a)],
      def: [...teams2.sort(({pcs: a}, {pcs: b}) => b - a)]
    };
  }, [gameWeek]);
  return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("header", null, /* @__PURE__ */ React.createElement("h1", null, "fpl-fixture-difficulty 2021-22")), /* @__PURE__ */ React.createElement("main", null, /* @__PURE__ */ React.createElement("div", {
    className: "bigboi"
  }, /* @__PURE__ */ React.createElement("div", {
    className: "row"
  }, /* @__PURE__ */ React.createElement("div", {
    className: "spacer"
  }), /* @__PURE__ */ React.createElement("div", {
    className: "away"
  }, "Away")), /* @__PURE__ */ React.createElement("div", {
    className: "row"
  }, /* @__PURE__ */ React.createElement("div", {
    className: "home"
  }, /* @__PURE__ */ React.createElement("div", {
    className: "home-label"
  }, "Home")), /* @__PURE__ */ React.createElement("div", {
    className: "table"
  }, /* @__PURE__ */ React.createElement("div", {
    className: "cell vh hh"
  }), teams.map((team) => /* @__PURE__ */ React.createElement("div", {
    className: "cell hh"
  }, /* @__PURE__ */ React.createElement("div", {
    className: "rotate"
  }, team.short_name))), teams.map((hometeam, i) => /* @__PURE__ */ React.createElement(React.Fragment, {
    key: hometeam.id
  }, /* @__PURE__ */ React.createElement("div", {
    className: "cell vh"
  }, hometeam.short_name), teams.map((awayteam, j) => {
    const match = matchMap[i][j];
    if (match === null)
      return /* @__PURE__ */ React.createElement("div", {
        className: "cell null",
        key: `${hometeam.id}-${awayteam.id}`
      });
    const {homeXG, awayXG, homePCS, awayPCS} = match;
    const xgDiff = Math.max(-4, Math.min(homeXG - awayXG, 4));
    const green = 135 + Math.round(xgDiff * 30);
    const red = 135 + Math.round(xgDiff * -30);
    return /* @__PURE__ */ React.createElement("div", {
      className: "cell",
      key: `${hometeam.id}-${awayteam.id}`,
      style: {background: `rgb(${red},${green},20)`}
    }, /* @__PURE__ */ React.createElement("div", {
      className: "popup"
    }, /* @__PURE__ */ React.createElement("div", {
      className: "cell-title"
    }, hometeam.short_name, " v ", awayteam.short_name), /* @__PURE__ */ React.createElement("div", {
      className: "label"
    }, "expected goals"), /* @__PURE__ */ React.createElement("div", {
      className: "values"
    }, /* @__PURE__ */ React.createElement("div", {
      className: "value"
    }, homeXG.toFixed(2)), /* @__PURE__ */ React.createElement("div", {
      className: "value"
    }, awayXG.toFixed(2))), /* @__PURE__ */ React.createElement("div", {
      className: "label"
    }, "probability of a clean sheet"), /* @__PURE__ */ React.createElement("div", {
      className: "values"
    }, /* @__PURE__ */ React.createElement("div", {
      className: "value"
    }, Math.round(homePCS * 100), "%"), /* @__PURE__ */ React.createElement("div", {
      className: "value"
    }, Math.round(awayPCS * 100), "%"))));
  })))))), /* @__PURE__ */ React.createElement("div", {
    className: "fixtures"
  }, /* @__PURE__ */ React.createElement("div", {
    className: "buttons"
  }, /* @__PURE__ */ React.createElement("button", {
    disabled: gameWeek < 1,
    onClick: () => setGameWeek(gameWeek - 1)
  }, "<"), /* @__PURE__ */ React.createElement("div", {
    className: "grow"
  }, "Gameweek ", gameWeek + 1, /* @__PURE__ */ React.createElement("br", null), /* @__PURE__ */ React.createElement("small", null, gameWeeks[gameWeek].deadline_time)), /* @__PURE__ */ React.createElement("button", {
    disabled: gameWeek > 36,
    onClick: () => setGameWeek(gameWeek + 1)
  }, ">")), /* @__PURE__ */ React.createElement("div", {
    className: "three-cols"
  }, /* @__PURE__ */ React.createElement("div", {
    className: "col"
  }, /* @__PURE__ */ React.createElement("h3", null, "Fixtures"), gameWeeks[gameWeek].fixtures.map(({kickoff_time, home, away}) => {
    return /* @__PURE__ */ React.createElement("div", {
      key: `${home}-${away}`,
      style: {marginBottom: 8}
    }, /* @__PURE__ */ React.createElement("div", {
      className: "time"
    }, kickoff_time), home, " v ", away);
  })), /* @__PURE__ */ React.createElement("div", {
    className: "col"
  }, /* @__PURE__ */ React.createElement("h3", null, "Best for GKP & DEF"), /* @__PURE__ */ React.createElement("p", null, "Chances of clean sheet"), def.map(({team, pcs}, j) => /* @__PURE__ */ React.createElement("pre", {
    key: j,
    style: {margin: 0}
  }, team, " ", (pcs * 100).toFixed(0).padStart(3, " "), "%"))), /* @__PURE__ */ React.createElement("div", {
    className: "col"
  }, /* @__PURE__ */ React.createElement("h3", null, "Best for MID & FWD"), /* @__PURE__ */ React.createElement("p", null, "Expected goals scored"), att.map(({team, xg}, j) => /* @__PURE__ */ React.createElement("pre", {
    key: j,
    style: {margin: 0}
  }, team, " ", xg.toFixed(1).padStart(4, " "))))), /* @__PURE__ */ React.createElement("div", {
    style: {textAlign: "center"}
  }, /* @__PURE__ */ React.createElement("pre", {
    style: {margin: "32px auto 0"}
  })))));
}
export default App;
