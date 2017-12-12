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

class GameOfLife extends React.Component {
  constructor (props) {
    super(props)

// =====================================================================
//
// Constants and datastructures
//

    this.START = 0
    this.STOP = 1
    this.CLEAR = 2
    this.RANDOM = 3
    this.RESTART = 4

    this.flags = [
      [false, true, true, true],
      [true, false, true, true],
      [true, false, false, true],
      [true, false, true, false],
      [false, false, true, true]
    ]

    this.flSel = this.START

// =====================================================================
//
// Set this bindings
//

    this.sta = this.sta.bind(this)
    this.sto = this.sto.bind(this)
    this.clr = this.clr.bind(this)
    this.rnd = this.rnd.bind(this)

    this.init = this.init.bind(this)
    this.setRandom = this.setRandom.bind(this)
    this.calc = this.calc.bind(this)
    this.start = this.start.bind(this)
    this.stop = this.stop.bind(this)
    this.random = this.random.bind(this)
    this.clear = this.clear.bind(this)
    this.boardClick = this.boardClick.bind(this)

// =====================================================================
//
// Sets the initial state, this is the end of the constructor
//

    this.flSel = this.START
    this.block = false
    this.state = {
      field: this.init(),
      cnt: 0
    }
  }

// =====================================================================
//
// Helper functions to display the buttons
//

  sta () { return this.flags[this.flSel][this.START] ? 'act' : 'pass' }
  sto () { return this.flags[this.flSel][this.STOP] ? 'act' : 'pass' }
  clr () { return this.flags[this.flSel][this.CLEAR] ? 'act' : 'pass' }
  rnd () { return this.flags[this.flSel][this.RANDOM] ? 'act' : 'pass' }

// =====================================================================
//
// Create and clear both planes
//

  init () {
    let te = new Array(2)
    let my = Number.parseInt(this.props.y)
    let mx = Number.parseInt(this.props.x)
    let z, y, x

    for (z = 0; z < 2; z++) {
      te[z] = new Array(my)
      for (y = 0; y < my; y++) {
        te[z][y] = new Array(mx)
        for (x = 0; x < mx; x++) {
          te[z][y][x] = 0
        }
      }
    }

    return te
  }

// =====================================================================
//
// Set the source plane with random ones / zeroes
//

  setRandom () {
    let border = 0
    let mx = this.props.x - border
    let my = this.props.y - border
    let m0 = this.state.field[0]
    let m1 = this.state.field[1]

    m0 = m0.map((row, y) => {
      return row.map((val, x) => {
        let res
        if (y >= border && y < my && x >= border && x < mx) {
          res = Math.floor(Math.random() + 0.3)
        }
        return res
      })
    })

    this.setState({
      cnt: 0,
      field: [m0, m1]
    })
  }

// =====================================================================
//
// Calculate the next generation
//

  calc () {
    if (this.block) {
      return
    }

    let mx = this.props.x
    let my = this.props.y
    // let max = mx * my
    let gn = this.state.cnt
    let m0 = this.state.field[0]
    let m1 = this.state.field[1]
    let res, cnt
    let chnd = 0
    let ya, yb, xa, xb

    m1 = m0.map((row, y) => {
      ya = (y - 1) < 0 ? my - 1 : y - 1
      yb = (y + 1) >= my ? 0 : y + 1

      return row.map((val, x) => {
        xa = (x - 1) < 0 ? mx - 1 : x - 1
        xb = (x + 1) >= mx ? 0 : x + 1

        cnt =
          m0[ya][xa] +
          m0[ya][x] +
          m0[ya][xb] +
          m0[y][xa] +
          m0[y][xb] +
          m0[yb][xa] +
          m0[yb][x] +
          m0[yb][xb]

        if (val === 1) {
          if (cnt < 2 || cnt > 3) {
            res = 0
          } else {
            res = 1
          }
        } else {
          if (cnt === 3) {
            res = 1
          } else {
            res = 0
          }
        }

        if (val !== res) {
          chnd++
        }

        return res
      })
    })

    if (chnd === 0) {
      this.flSel = this.STOP
      this.block = true
      this.forceUpdate()
    } else {
      this.setState({
        cnt: gn + 1,
        field: [m1, m0]
      })
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

  start () {
    if (this.flSel !== this.START) {
      this.flSel = this.START
      this.block = false
      setTimeout(this.calc, 100)
    }
  }

// =====================================================================
//
// Stop button
//

  stop () {
    if (this.flSel !== this.STOP) {
      this.flSel = this.STOP
      this.block = true
      this.forceUpdate()
    }
  }

// =====================================================================
//
// Random button
//

  random () {
    if (this.flSel !== this.RANDOM) {
      this.flSel = this.RANDOM
      this.block = true
      this.setRandom()
    }
  }

// =====================================================================
//
// Clear button
//

  clear () {
    if (this.flSel !== this.CLEAR) {
      this.flSel = this.CLEAR
      this.block = true
      this.setState({
        cnt: 0,
        field: this.init()
      })
    }
  }

// =====================================================================
//
// Sets / resets one field in the source plane
//

  boardClick (e) {
    let d = e.target.id.split('_')
    let x = Number.parseInt(d[0])
    let y = Number.parseInt(d[1])
    let m0 = this.state.field[0]
    let m1 = this.state.field[1]

    m0[y][x] ^= 1

    this.flSel = this.STOP
    this.block = true
    this.setState({
      field: [m0, m1]
    })
  }

// =====================================================================
//
// Lifecycle method: before the component is rendered the first time
//

  componentWillMount () {
    this.setRandom()
  }

// =====================================================================
//
// The render method:
//

  render () {
    let mx = this.props.x
    let my = this.props.y
    let ym = []
    let y = 0
    let f = 6

    if (!this.block) {
      setTimeout(this.calc, 100)
    }

    while (y < my) {
      let x = 0
      let xm = []
      while (x < mx) {
        let c = this.state.field[0][y][x] === 0 ? 'dead' : 'alive'
        xm.push(<rect id={x + '_' + y} className={c} x={x * f} y={y * f} width={f} height={f}></rect>)
        x++
      }
      ym.push(xm)
      y++
    };

    return (
      <svg
        id='board'
        width={mx * (f)} height={my * (f)}
        viewBox={'0 0 ' + (mx * (f)) + ' ' + (my * (f) + 100)}
      >
        <foreignObject
          width='100%' height='100'>
          <div className='head'>Arthur Conways Game of Life</div>
          <div>
            <button onClick={this.start} className={this.sta()}>start</button>
            <button onClick={this.stop} className={this.sto()}>stop</button>
            <button onClick={this.clear} className={this.clr()}>clear</button>
            <button onClick={this.random} className={this.rnd()}>random</button>
            <span>{this.state.cnt + ' Generations'}</span>
          </div>
        </foreignObject>
        <g onClick={this.boardClick}>
          {ym}
        </g>
      </svg>
    )
  }
}

ReactDOM.render(
  <GameOfLife x='100' y='72' />,
  document.getElementById('root')
)
