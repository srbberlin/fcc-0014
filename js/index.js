'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

//=====================================================================
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

//=====================================================================
//
// Main React component
//

var GameOfLife = function (_React$Component) {
  _inherits(GameOfLife, _React$Component);

  function GameOfLife(props) {
    _classCallCheck(this, GameOfLife);

    //=====================================================================
    //
    // Constants and datastructures
    //

    var _this = _possibleConstructorReturn(this, _React$Component.call(this, props));

    _this.START = 0;
    _this.STOP = 1;
    _this.CLEAR = 2;
    _this.RANDOM = 3;
    _this.RESTART = 4;

    _this.flags = [[false, true, true, true], [true, false, true, true], [true, false, false, true], [true, false, true, false], [false, false, true, true]];

    _this.flSel = _this.START;

    //=====================================================================
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

    //=====================================================================
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

  //=====================================================================
  //
  // Helper functions to display the buttons
  //

  GameOfLife.prototype.sta = function sta() {
    return this.flags[this.flSel][this.START] ? 'act' : 'pass';
  };

  GameOfLife.prototype.sto = function sto() {
    return this.flags[this.flSel][this.STOP] ? 'act' : 'pass';
  };

  GameOfLife.prototype.clr = function clr() {
    return this.flags[this.flSel][this.CLEAR] ? 'act' : 'pass';
  };

  GameOfLife.prototype.rnd = function rnd() {
    return this.flags[this.flSel][this.RANDOM] ? 'act' : 'pass';
  };

  //=====================================================================
  //
  // Create and clear both planes
  //

  GameOfLife.prototype.init = function init() {
    var te = new Array(2);
    var my = Number.parseInt(this.props.y);
    var mx = Number.parseInt(this.props.x);
    var z = undefined,
        y = undefined,
        x = undefined;

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
  };

  //=====================================================================
  //
  // Set the source plane with random ones / zeroes
  //

  GameOfLife.prototype.setRandom = function setRandom() {

    var border = 0;
    var mx = this.props.x - border;
    var my = this.props.y - border;
    var m0 = this.state.field[0];
    var m1 = this.state.field[1];

    m0 = m0.map(function (row, y) {
      return row.map(function (val, x) {
        var res = undefined;
        if (y >= border && y < my && x >= border && x < mx) {
          res = Math.floor(Math.random() + 0.3);
        } else {
          res = act3;
        }
        return res;
      });
    });

    this.setState({
      cnt: 0,
      field: [m0, m1]
    });
  };

  //=====================================================================
  //
  // Calculate the next generation
  //

  GameOfLife.prototype.calc = function calc() {

    if (this.block) {
      return;
    }

    var mx = this.props.x;
    var my = this.props.y;
    var max = mx * my;
    var gn = this.state.cnt;
    var m0 = this.state.field[0];
    var m1 = this.state.field[1];
    var res = undefined,
        cnt = undefined,
        chnd = 0,
        ya = undefined,
        yb = undefined,
        xa = undefined,
        xb = undefined;

    m1 = m0.map(function (row, y) {
      ya = y - 1 < 0 ? my - 1 : y - 1;
      yb = y + 1 >= my ? 0 : y + 1;

      return row.map(function (val, x) {
        xa = x - 1 < 0 ? mx - 1 : x - 1;
        xb = x + 1 >= mx ? 0 : x + 1;

        cnt = m0[ya][xa] + m0[ya][x] + m0[ya][xb] + m0[y][xa] + m0[y][xb] + m0[yb][xa] + m0[yb][x] + m0[yb][xb];

        if (val == 1) {
          if (cnt < 2 || cnt > 3) {
            res = 0;
          } else {
            res = 1;
          }
        } else {
          if (cnt == 3) {
            res = 1;
          } else {
            res = 0;
          }
        }

        if (val != res) {
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
  };

  //=====================================================================
  //
  // Eventhandlers
  //

  //=====================================================================
  //
  // Start button
  //

  GameOfLife.prototype.start = function start() {
    if (this.flSel != this.START) {
      this.flSel = this.START;
      this.block = false;
      setTimeout(this.calc, 100);
    }
  };

  //=====================================================================
  //
  // Stop button
  //

  GameOfLife.prototype.stop = function stop() {
    if (this.flSel != this.STOP) {
      this.flSel = this.STOP;
      this.block = true;
      this.forceUpdate();
    }
  };

  //=====================================================================
  //
  // Random button
  //

  GameOfLife.prototype.random = function random() {
    if (this.flSel != this.RANDOM) {
      this.flSel = this.RANDOM;
      this.block = true;
      this.setRandom();
    }
  };

  //=====================================================================
  //
  // Clear button
  //

  GameOfLife.prototype.clear = function clear() {
    if (this.flSel != this.CLEAR) {
      this.flSel = this.CLEAR;
      this.block = true;
      this.setState({
        cnt: 0,
        field: this.init()
      });
    }
  };

  //=====================================================================
  //
  // Sets / resets one field in the source plane
  //

  GameOfLife.prototype.boardClick = function boardClick(e) {
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
  };

  //=====================================================================
  //
  // Lifecycle method: before the component is rendered the first time
  //

  GameOfLife.prototype.componentWillMount = function componentWillMount() {
    this.setRandom();
  };

  //=====================================================================
  //
  // The render method:
  //

  GameOfLife.prototype.render = function render() {
    var mx = this.props.x;
    var my = this.props.y;
    var ym = [];
    var y = 0;
    var f = 5;

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
        viewBox: '0 0 ' + mx * f + ' ' + my * f
      },
      React.createElement(
        'foreignObject',
        {
          width: '100%', height: '50',
          requiredExtensions: 'http://www.w3.org/1999/xhtml' },
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
  };

  return GameOfLife;
}(React.Component);

ReactDOM.render(React.createElement(GameOfLife, { x: '100', y: '72' }), document.getElementById('root'));