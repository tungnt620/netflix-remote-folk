import ReducerBase from '../../shared/ReducerBase'
import * as actionTypes from './actionTypes'

class ReducerWithPersist extends ReducerBase {
  success(state, payload) {
    const newState = super.success(state, payload)

    localStorage.setItem('rnd-state', JSON.stringify(newState))
    return newState
  }
}

let preSaveRnd = localStorage.getItem('rnd-state')
if (preSaveRnd) {
  preSaveRnd = JSON.parse(preSaveRnd)
  preSaveRnd.editing = false
}

const RnD = new ReducerWithPersist(
  actionTypes.UPDATE_RND_STATE,
  preSaveRnd ?? {
    editing: false,
    disabled: true,
    positions: {
      'lln-on-off-translation-btn': {
        x: 200,
        y: 300,
      },
    },
    sizes: {
      'lln-on-off-translation-btn': {
        // width, height,
      },
    },
  },
)

export default (state, action) => RnD.reducer(state, action)
