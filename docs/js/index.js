'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// =====================================================================
//
// FreeCodeCamp Challange: Game Of Life
//
// This implements John Horton Conway's cellular automaton called
// "The Game of life". It is built with just one Rect.Component, the
// playground is a SVG image. The data structure contains the
// generation's counter and two planes of states the cells are in.
// The first one being the source of the calculation and the second one
// the sink. After calculation the planes are swapped and the former
// destination will be displayed. After that the next generation is
// is triggered by a timer. Actions like 'stop', 'clear', 'random'
// and changing the cells stop this so one has to start the game again.
//

// =====================================================================
//
// Main React component
//

var GameOfLife = function (_React$Component) {
  _inherits(GameOfLife, _React$Component);

  function GameOfLife(props) {
    _classCallCheck(this, GameOfLife);

    // =====================================================================
    //
    // Constants and datastructures
    //

    var _this = _possibleConstructorReturn(this, (GameOfLife.__proto__ || Object.getPrototypeOf(GameOfLife)).call(this, props));

    _this.START = 0;
    _this.STOP = 1;
    _this.CLEAR = 2;
    _this.RANDOM = 3;
    _this.RESTART = 4;

    _this.flags = [[false, true, true, true], [true, false, true, true], [true, false, false, true], [true, false, true, false], [false, false, true, true]];

    _this.flSel = _this.START;

    // =====================================================================
    //
    // Set this bindings
    //

    _this.sta = _this.sta.bind(_this);
    _this.sto = _this.sto.bind(_this);
    _this.clr = _this.clr.bind(_this);
    _this.rnd = _this.rnd.bind(_this);

    _this.init = _this.init.bind(_this);
    _this.setRandom = _this.setRandom.bind(_this);
    _this.calc = _this.calc.bind(_this);
    _this.start = _this.start.bind(_this);
    _this.stop = _this.stop.bind(_this);
    _this.random = _this.random.bind(_this);
    _this.clear = _this.clear.bind(_this);
    _this.boardClick = _this.boardClick.bind(_this);

    // =====================================================================
    //
    // Sets the initial state, this is the end of the constructor
    //

    _this.flSel = _this.START;
    _this.block = false;
    _this.state = {
      field: _this.init(),
      cnt: 0
    };
    return _this;
  }

  // =====================================================================
  //
  // Helper functions to display the buttons
  //

  _createClass(GameOfLife, [{
    key: 'sta',
    value: function sta() {
      return this.flags[this.flSel][this.START] ? 'act' : 'pass';
    }
  }, {
    key: 'sto',
    value: function sto() {
      return this.flags[this.flSel][this.STOP] ? 'act' : 'pass';
    }
  }, {
    key: 'clr',
    value: function clr() {
      return this.flags[this.flSel][this.CLEAR] ? 'act' : 'pass';
    }
  }, {
    key: 'rnd',
    value: function rnd() {
      return this.flags[this.flSel][this.RANDOM] ? 'act' : 'pass';
    }

    // =====================================================================
    //
    // Create and clear both planes
    //

  }, {
    key: 'init',
    value: function init() {
      var te = new Array(2);
      var my = Number.parseInt(this.props.y);
      var mx = Number.parseInt(this.props.x);
      var z = void 0,
          y = void 0,
          x = void 0;

      for (z = 0; z < 2; z++) {
        te[z] = new Array(my);
        for (y = 0; y < my; y++) {
          te[z][y] = new Array(mx);
          for (x = 0; x < mx; x++) {
            te[z][y][x] = 0;
          }
        }
      }

      return te;
    }

    // =====================================================================
    //
    // Set the source plane with random ones / zeroes
    //

  }, {
    key: 'setRandom',
    value: function setRandom() {
      var border = 0;
      var mx = this.props.x - border;
      var my = this.props.y - border;
      var m0 = this.state.field[0];
      var m1 = this.state.field[1];

      m0 = m0.map(function (row, y) {
        return row.map(function (val, x) {
          var res = void 0;
          if (y >= border && y < my && x >= border && x < mx) {
            res = Math.floor(Math.random() + 0.3);
          }
          return res;
        });
      });

      this.setState({
        cnt: 0,
        field: [m0, m1]
      });
    }

    // =====================================================================
    //
    // Calculate the next generation
    //

  }, {
    key: 'calc',
    value: function calc() {
      if (this.block) {
        return;
      }

      var mx = this.props.x;
      var my = this.props.y;
      // let max = mx * my
      var gn = this.state.cnt;
      var m0 = this.state.field[0];
      var m1 = this.state.field[1];
      var res = void 0,
          cnt = void 0;
      var chnd = 0;
      var ya = void 0,
          yb = void 0,
          xa = void 0,
          xb = void 0;

      m1 = m0.map(function (row, y) {
        ya = y - 1 < 0 ? my - 1 : y - 1;
        yb = y + 1 >= my ? 0 : y + 1;

        return row.map(function (val, x) {
          xa = x - 1 < 0 ? mx - 1 : x - 1;
          xb = x + 1 >= mx ? 0 : x + 1;

          cnt = m0[ya][xa] + m0[ya][x] + m0[ya][xb] + m0[y][xa] + m0[y][xb] + m0[yb][xa] + m0[yb][x] + m0[yb][xb];

          if (val === 1) {
            if (cnt < 2 || cnt > 3) {
              res = 0;
            } else {
              res = 1;
            }
          } else {
            if (cnt === 3) {
              res = 1;
            } else {
              res = 0;
            }
          }

          if (val !== res) {
            chnd++;
          }

          return res;
        });
      });

      if (chnd === 0) {
        this.flSel = this.STOP;
        this.block = true;
        this.forceUpdate();
      } else {
        this.setState({
          cnt: gn + 1,
          field: [m1, m0]
        });
      }
    }

    // =====================================================================
    //
    // Eventhandlers
    //

    // =====================================================================
    //
    // Start button
    //

  }, {
    key: 'start',
    value: function start() {
      if (this.flSel !== this.START) {
        this.flSel = this.START;
        this.block = false;
        setTimeout(this.calc, 100);
      }
    }

    // =====================================================================
    //
    // Stop button
    //

  }, {
    key: 'stop',
    value: function stop() {
      if (this.flSel !== this.STOP) {
        this.flSel = this.STOP;
        this.block = true;
        this.forceUpdate();
      }
    }

    // =====================================================================
    //
    // Random button
    //

  }, {
    key: 'random',
    value: function random() {
      if (this.flSel !== this.RANDOM) {
        this.flSel = this.RANDOM;
        this.block = true;
        this.setRandom();
      }
    }

    // =====================================================================
    //
    // Clear button
    //

  }, {
    key: 'clear',
    value: function clear() {
      if (this.flSel !== this.CLEAR) {
        this.flSel = this.CLEAR;
        this.block = true;
        this.setState({
          cnt: 0,
          field: this.init()
        });
      }
    }

    // =====================================================================
    //
    // Sets / resets one field in the source plane
    //

  }, {
    key: 'boardClick',
    value: function boardClick(e) {
      var d = e.target.id.split('_');
      var x = Number.parseInt(d[0]);
      var y = Number.parseInt(d[1]);
      var m0 = this.state.field[0];
      var m1 = this.state.field[1];

      m0[y][x] ^= 1;

      this.flSel = this.STOP;
      this.block = true;
      this.setState({
        field: [m0, m1]
      });
    }

    // =====================================================================
    //
    // Lifecycle method: before the component is rendered the first time
    //

  }, {
    key: 'componentWillMount',
    value: function componentWillMount() {
      this.setRandom();
    }

    // =====================================================================
    //
    // The render method:
    //

  }, {
    key: 'render',
    value: function render() {
      var mx = this.props.x;
      var my = this.props.y;
      var ym = [];
      var y = 0;
      var f = 6;

      if (!this.block) {
        setTimeout(this.calc, 100);
      }

      while (y < my) {
        var x = 0;
        var xm = [];
        while (x < mx) {
          var c = this.state.field[0][y][x] === 0 ? 'dead' : 'alive';
          xm.push(React.createElement('rect', { id: x + '_' + y, className: c, x: x * f, y: y * f, width: f, height: f }));
          x++;
        }
        ym.push(xm);
        y++;
      };

      return React.createElement(
        'svg',
        {
          id: 'board',
          width: mx * f, height: my * f,
          viewBox: '0 0 ' + mx * f + ' ' + (my * f + 100)
        },
        React.createElement(
          'foreignObject',
          {
            width: '100%', height: '100' },
          React.createElement(
            'div',
            { className: 'head' },
            'Arthur Conways Game of Life'
          ),
          React.createElement(
            'div',
            null,
            React.createElement(
              'button',
              { onClick: this.start, className: this.sta() },
              'start'
            ),
            React.createElement(
              'button',
              { onClick: this.stop, className: this.sto() },
              'stop'
            ),
            React.createElement(
              'button',
              { onClick: this.clear, className: this.clr() },
              'clear'
            ),
            React.createElement(
              'button',
              { onClick: this.random, className: this.rnd() },
              'random'
            ),
            React.createElement(
              'span',
              null,
              this.state.cnt + ' Generations'
            )
          )
        ),
        React.createElement(
          'g',
          { onClick: this.boardClick },
          ym
        )
      );
    }
  }]);

  return GameOfLife;
}(React.Component);

ReactDOM.render(React.createElement(GameOfLife, { x: '100', y: '72' }), document.getElementById('root'));