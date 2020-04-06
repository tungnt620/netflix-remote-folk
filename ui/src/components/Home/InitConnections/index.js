import React, { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Peer from 'simple-peer'
import io from 'socket.io-client'
import './style.scss'
import { updateUIState } from '../../../store/ui/actions'

const InitConnections = () => {
  const uiState = useSelector(({ ui }) => ui)
  const uiStateRef = useRef(uiState)
  const dispatch = useDispatch()

  useEffect(() => {
    uiStateRef.current = uiState
  }, [uiState])

  useEffect(() => {
    const peer = new Peer({ initiator: false, trickle: false })
    const socket = io.connect(process.env.REACT_APP_BROKER_URL, {
      path: '/netflix-broker/socket.io',
      transports: ['websocket'],
    })
    updateState({ socket, peer })

    socket.on('incoming-signal', data => {
      if (data) peer.signal(data)
    })
    peer.on('signal', data => {
      socket.emit('set-answer', { signal: data, id: uiStateRef.current.peerId })
    })
    peer.on('connect', () => {
      updateState({ peerConnected: true })
      socket.disconnect()
    })
    peer.on('data', data => {
      handleIncoming(data.toString())
    })
    peer.on('error', e => {
      showError(e.message)
      refreshWindow()
    })
    peer.on('close', function(err) {
      refreshWindow()
      updateState({ peerConnected: false })
    })

    return () => {
      peer.destroy()
      socket.disconnect()
    }
  }, [])

  const updateState = newUIStateValues => {
    dispatch(updateUIState(newUIStateValues))
  }

  function showError(message) {
    updateState({
      error: {
        show: true,
        message,
      },
    })
  }

  function handleIncoming(dataString) {
    const data = JSON.parse(dataString)
    console.log(data)

    if (Object.keys(data).includes('error')) {
      showError(data.error)
    } else if (Object.keys(data).includes('success')) {
      updateState({
        error: {
          show: false,
          message: uiState.message,
        },
      })
    } else {
      updateState(data)
    }
  }

  function refreshWindow() {
    window.location.reload()
  }

  return null
}
export default InitConnections
