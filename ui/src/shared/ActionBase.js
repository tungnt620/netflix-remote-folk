import axios from 'axios-settings'
import { API_SUCCESS } from './constants'

export default class ActionBase {
  constructor(actionType) {
    this.actionType = actionType
  }

  start = () => {
    return {
      type: this.actionType.start(),
    }
  }

  success = payload => {
    return {
      type: this.actionType.success(),
      payload,
    }
  }

  fail = payload => {
    return {
      type: this.actionType.fail(),
      payload,
    }
  }

  reset = () => {
    return {
      type: this.actionType.reset(),
    }
  }

  defaultOnRequestSuccessCallback = (dispatch, respData) => {
    const { code, data, msg } = respData

    if (code === API_SUCCESS) {
      dispatch(this.success({ data }))
    } else {
      dispatch(this.fail({ error: msg }))
    }
  }

  makeAction = ({
    url,
    method = 'get',
    requestData = {},
    onRequestSuccessCallback = undefined,
    onRequestFailCallback = undefined,
  }) => {
    return dispatch => {
      dispatch(this.start())

      const requestOption = {
        method,
        url,
      }
      if (method === 'get') {
        requestOption['params'] = requestData
      } else {
        requestOption['data'] = requestData
      }

      axios(requestOption)
        .then(res => {
          const respData = res.data
          const { code, data, msg } = respData

          if (onRequestSuccessCallback) {
            onRequestSuccessCallback(dispatch, respData)
          } else {
            if (code === API_SUCCESS) {
              dispatch(this.success({ data }))
            } else {
              dispatch(this.fail({ error: msg }))
            }
          }
        })
        .catch(err => {
          dispatch(this.fail({ error: err.toString() }))
          if (onRequestFailCallback) onRequestFailCallback(dispatch, err)
        })
    }
  }
}
