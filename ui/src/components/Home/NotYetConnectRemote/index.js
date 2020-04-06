import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Input } from 'antd'
import './style.scss'
import ApiOutlined from '@ant-design/icons/es/icons/ApiOutlined'
import { updateUIState } from '../../../store/ui/actions'

const NotYetConnectRemote = () => {
  const uiState = useSelector(({ ui }) => ui)
  const dispatch = useDispatch()

  const updateState = newUIStateValues => {
    dispatch(updateUIState(newUIStateValues))
  }

  function connectRemote() {
    uiState.socket.emit('get-signal', uiState.peerId)
  }

  if (!uiState.peerConnected) {
    return (
      <div className={'scan-block'}>
        <Input
          className={'peer-id-input'}
          placeholder={'Enter code'}
          onChange={e => updateState({ peerId: e.target.value })}
          style={{ fontSize: '30px' }}
        />

        <p>
          <Button
            className={'btn-connect'}
            icon={<ApiOutlined />}
            size={'large'}
            type={'primary'}
            disabled={!uiState.peerId}
            onClick={connectRemote}
          >
            Connect
          </Button>
        </p>
      </div>
    )
  }

  return null
}
export default NotYetConnectRemote
