import { css, StyleSheet } from 'aphrodite'
import * as html from 'choo/html'

import { ICell } from '../../engine/map'
import Unit from '../../engine/unit'
import unit from '../components/unit'
import { Actions, IState } from './index'

export const cellSize = 20

function hexCenter({ q, r }, radius) {
  return {
    x: radius * (3 / 2) * r,
    y: radius * Math.sqrt(3) * (q + r / 2),
  }
}

function hexCorner(x, y, size, i) {
  const angleDeg = 60 * i
  const angleRad = Math.PI / 180 * angleDeg
  return `${x + size * Math.cos(angleRad)},${y + size * Math.sin(angleRad)}`
}

const HEX_POINTS = [0, 1, 2, 3, 4, 5]
  .map(i => hexCorner(0, 0, cellSize, i))
  .join(' ')

const style = StyleSheet.create({
  main: {
    cursor: 'pointer',
    stroke: 'white',
    margin: '1px',
    strokeWidth: '.1px',
    fillRule: 'evenodd',
    fill: 'transparent',
    fillOpacity: .1,
    transition: '.1s ease-in-out all',

    ':hover': {
      stroke: 'green',
    },
  },

  selected: {
    fill: 'red',
  },
  targeted: {
    fill: 'yellow',
  },
})

function translate(x, y) {
  return `translate(${x},${y})`
}

export default function cell(cell: ICell, state: IState, actions: Actions) {
  const { pos, thing } = cell
  const { selectedCell, targets } = state
  const { x, y } = hexCenter(pos, cellSize)

  let selected = false
  if (selectedCell && pos.toString() ===  selectedCell.pos.toString()) {
    selected = true
  }
  const targeted = targets && targets[pos.toString()] ? true : false

  const polygonClass = css(
    style.main,
    selected && style.selected,
    targeted && style.targeted,
  )

  return html`
    <g transform=${translate(x, y)} onclick=${handleClick}>
      ${thing && thing instanceof Unit && unit(thing)}
      <polygon class=${polygonClass} points=${HEX_POINTS}/>
    </g>
  `

  function handleClick() {
    actions.selectCell(cell)
  }
}