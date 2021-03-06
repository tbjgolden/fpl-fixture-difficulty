import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

ReactDOM.render(
  <React.StrictMode>
    <App />
    <style
      dangerouslySetInnerHTML={{
        __html: `
          body {
            margin: 0;
            padding: 36px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
              'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
              sans-serif;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
            font-size: 16px;
            line-height: 1.4;
          }

          code {
            font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
              monospace;
          }

          :first-child {
            margin-top: 0;
          }
          :last-child {
            margin-bottom: 0;
          }

          .table {
            display: grid;
            grid-template-columns: 36px repeat(20, 22px);
            grid-template-rows: 40px repeat(20, 22px);
          }

          .cell {
            position: relative;
            text-align: center;
            background: #f7f7f7;
            border: 1px solid #eee;
          }
          .null {
            background: #ddd;
          }

          .hh,
          .vh {
            font-size: 0.8em;
            font-weight: bold;
            text-align: right;
            background: #fff;
            padding-right: 4px;
            border: 0;
          }
          .vh {
            line-height: 22px;
          }

          .rotate {
            position: absolute;
            bottom: 2px;
            right: 16px;
            transform: rotate(60deg);
            transform-origin: bottom right;
          }

          .popup {
            display: none;
            position: absolute;
            bottom: 99%;
            left: 50%;
            height: 100px;
            padding: 4px;
            transform: translate(-50%, 0);
            background: #eee;
            width: 80px;
            z-index: 10;
            border: 2px solid #111;
            overflow: auto;
            font-size: 0.8em;
          }
          .cell:hover {
            border: 2px solid #111;
          }
          .cell.vh:hover,
          .cell.hh:hover {
            border: 0;
          }
          .cell.null:hover {
            border: 0;
          }
          .cell:hover .popup,
          .popup:hover {
            display: block;
          }
          .cell-title {
            font-weight: bold;
          }
          .label {
            font-size: 0.8em;
            line-height: 1.2;
            margin-top: 4px;
          }
          .values {
            display: flex;
            padding: 0 2px;
          }
          .value {
            flex: 1 1 50%;
            font-weight: bold;
          }

          .row {
            display: flex;
            align-items: center;
          }
          .spacer {
            flex: 0 0 36px;
          }
          .home,
          .away {
            text-transform: uppercase;
            font-size: 0.8em;
            font-weight: bold;
          }
          .home {
            width: 24px;
            position: relative;
          }
          .home-label {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, 50%) rotate(-90deg);
          }
          .away {
            flex: 1 1 auto;
            text-align: center;
          }
          .bigboi {
            display: inline-block;
            padding-right: 48px;
          }
          .fixtures {
            margin-top: 32px;
            max-width: 500px;
          }
          .buttons {
            display: flex;
            margin-bottom: 16px;
          }
          .buttons button {
            flex: 0 0 40px;
          }
          .buttons .grow {
            flex: 1 1 0;
            text-align: center;
            padding: 0 16px;
          }
          .three-cols {
            display: flex;
            gap: 16px;
          }
          .time {
            font-size: 0.7em;
          }
          .col {
            flex: 1 1 50%;
            text-align: center;
            font-family: Menlo, Consolas, Monaco, Liberation Mono, Lucida Console,
              monospace;
          }
        `,
      }}
    />
  </React.StrictMode>,
  document.getElementById('root'),
);

if (import.meta.hot) {
  import.meta.hot.accept();
}
