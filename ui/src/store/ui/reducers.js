import ReducerBase from '../../shared/ReducerBase'
import * as actionTypes from './actionTypes'

const ui = new ReducerBase(actionTypes.UPDATE_UI_STATE, {
  playing: false,
  isConnected: false,
  isCamera: false,
  peerId: '',
  error: {
    show: false,
    message: '',
  },
  qr: {
    output: false,
    data: false,
  },
  stream: false,
  video: false,
  log: [],
  socket: false,
  peer: false,
  peerConnected: false,
  searchText: '',
})

export default (state, action) => ui.reducer(state, action)
