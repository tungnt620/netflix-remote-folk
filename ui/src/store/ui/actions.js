import * as actionTypes from './actionTypes'
import ActionBase from '../../shared/ActionBase'

const uiAction = new ActionBase(actionTypes.UPDATE_UI_STATE)

export const resetUIState = () => uiAction.reset()

export const updateUIState = newValues => {
  return uiAction.success(newValues)
}

