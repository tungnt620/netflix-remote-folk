import React from 'react'
import { Button, Layout, Space, Tooltip } from 'antd'
import logo from 'assets/netflix.svg'
import { ReloadOutlined } from '@ant-design/icons'
import './style.scss'
import AppstoreAddOutlined from '@ant-design/icons/es/icons/AppstoreAddOutlined'
import { useDispatch, useSelector } from 'react-redux'
import { updateRnDState } from '../../store/rnd/actions'
const { Header } = Layout

const AppHeader = () => {
  const rndEditing = useSelector(({ rnd }) => rnd.editing)
  const uiState = useSelector(({ ui }) => ui)
  const dispatch = useDispatch()

  function refreshWindow() {
    window.location.reload()
  }

  const toggleRnd = () => {
    dispatch(
      updateRnDState({
        disabled: false,
        editing: !rndEditing,
      }),
    )
  }

  return (
    <Header className={'header'}>
      <a href={'/'}>
        <img width={50} src={logo} alt={'logo'} />
      </a>

      <Space>
        {uiState.peerConnected && (
          <Tooltip title={'Resize, Drag, Drop control'}>
            <Button type="primary" onClick={toggleRnd} ghost={true} icon={<AppstoreAddOutlined />} size={'large'}>
              {rndEditing ? 'Done' : 'Reorder controls'}
            </Button>
          </Tooltip>
        )}
        <Button type="primary" onClick={refreshWindow} ghost={true} icon={<ReloadOutlined />} size={'large'} />
      </Space>
    </Header>
  )
}

export default AppHeader
