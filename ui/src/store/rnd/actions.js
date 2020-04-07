import * as actionTypes from './actionTypes'
import ActionBase from '../../shared/ActionBase'

const RnDAction = new ActionBase(actionTypes.UPDATE_RND_STATE)

export const resetRnDState = () => RnDAction.reset()

export const updateRnDState = newValues => {
  return RnDAction.success(newValues)
}
