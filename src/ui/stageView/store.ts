import { IAction } from '../../engine/actions/action'
import Hex from '../../engine/hex'
import { ICell } from '../../engine/map'
import Unit from '../../engine/unit'
import BaseStore from '../utils/Store'

import { IState } from './index'

export default class Store extends BaseStore<IState> {
  selectCell = (selectedCell: ICell) => {
    const { pos, thing } = selectedCell
    const targets: {[idx: string]: Hex} = {}
    const prevCell = this.state.selectedCell

    if (thing && thing instanceof Unit
      && thing.factionId === this.state.game.currenFaction.id
    ) {
      thing.moveTargets().forEach(h => targets[h.toString()] = h)
    }
    if (this.state.targets && this.state.targets[pos.toString()] ) {
      // hit targeted cell
      if (this.state.selectedAction) { // do action
        this.state.selectedAction!.execute(pos)
      } else { // if there is no action, it's move
        (prevCell!.thing! as Unit).move(pos)
      }
      this.perform({
        selectedAction: undefined,
        targets: undefined,
        selectedCell: undefined,
      })
    } else {
      this.perform({
        selectedCell,
        selectedAction: undefined,
        targets,
      })
    }
  }

  selectAction = (selectedAction: IAction) => {
    const targets = {}
    selectedAction.targets().forEach(h => targets[h.toString()] = h)
    this.perform({ selectedAction, targets })
  }

  endTurn = () => {
    this.state.game.endTurn()
    this.perform({
      selectedAction: undefined,
      targets: undefined,
      selectedCell: undefined,
    })
  }

}