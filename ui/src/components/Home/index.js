import React, { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Alert, Button, Input, Layout } from 'antd'
import { updateUIState } from '../../store/ui/actions'
import Peer from 'simple-peer'
import io from 'socket.io-client'
import logo from 'assets/netflix.svg'
import { ReloadOutlined } from '@ant-design/icons'
import './style.scss'
import ApiOutlined from '@ant-design/icons/es/icons/ApiOutlined'
import PlayCircleOutlined from '@ant-design/icons/es/icons/PlayCircleOutlined'
import PauseCircleOutlined from '@ant-design/icons/es/icons/PauseCircleOutlined'
import UndoOutlined from '@ant-design/icons/es/icons/UndoOutlined'
import RedoOutlined from '@ant-design/icons/es/icons/RedoOutlined'
import StepForwardOutlined from '@ant-design/icons/es/icons/StepForwardOutlined'

const { Header, Content, Footer } = Layout

const Home = () => {
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

  function sendPeer(data) {
    uiState.peer.send(JSON.stringify(data))
  }

  function showError(message) {
    updateState({
      error: {
        show: true,
        message,
      },
    })
  }

  function connectRemote() {
    uiState.socket.emit('get-signal', uiState.peerId)
  }

  function videoAction(action) {
    sendPeer({
      action: 'video_action',
      payload: {
        action,
      },
    })
  }

  function handleIncoming(dataString) {
    const data = JSON.parse(dataString)

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

  function getPauseBtn() {
    const pause = () => {
      videoAction('pause_video')
      updateState({
        playing: false,
      })
    }

    return (
      <Button
        style={{ fontSize: '30px', height: 'auto' }}
        onClick={pause}
        icon={<PauseCircleOutlined />}
        size={'large'}
      >
        Pause
      </Button>
    )
  }

  function getPlayBtn() {
    const play = () => {
      videoAction('play_video')
      updateState({
        playing: true,
      })
    }

    return (
      <Button style={{ fontSize: '30px', height: 'auto' }} onClick={play} icon={<PlayCircleOutlined />} size={'large'}>
        Play
      </Button>
    )
  }

  return (
    <>
      <Layout className="layout">
        <Header className={'header'}>
          <a href={'/'}>
            <img width={50} src={logo} alt={'logo'} />
          </a>

          <Button
            type="primary"
            onClick={refreshWindow}
            ghost={true}
            icon={<ReloadOutlined style={{ color: '#52c41a' }} />}
            size={'large'}
          />
        </Header>
        <Content className={'content'}>
          {uiState.peerConnected && <Alert showIcon message="Connected" type="success" closable />}

          {uiState.peerConnected && (
            <div className={'controls'}>
              {uiState.playing ? getPauseBtn() : getPlayBtn()}
              <br />
              <Button
                style={{ fontSize: '30px', height: 'auto' }}
                onClick={() => videoAction('replay_video')}
                icon={<UndoOutlined />}
                size={'large'}
              >
                Replay 10s
              </Button>
              <Button
                style={{ fontSize: '30px', height: 'auto' }}
                onClick={() => videoAction('forward_video')}
                icon={<RedoOutlined />}
                size={'large'}
              >
                Forward 10s
              </Button>
              <hr />
              <Button onClick={() => videoAction('next_episode')} icon={<StepForwardOutlined />} size={'large'}>
                Next Episode
              </Button>
              <Button
                disabled={!uiState.playing}
                onClick={() => videoAction('skip_intro')}
                icon={<StepForwardOutlined />}
                size={'large'}
              >
                Skip intro
              </Button>
            </div>
          )}

          {!uiState.peerConnected && (
            <>
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
            </>
          )}
        </Content>
        <Footer style={{ textAlign: 'center', padding: 0 }}>
          <Button
            type="link"
            href={
              'https://chrome.google.com/webstore/detail/%C4%91i%E1%BB%81u-khi%E1%BB%83n-t%E1%BB%AB-xa-cho-netf/dlocmpllaehjceikkcilecdffmjmlgfe'
            }
            target={'_blank'}
          >
            Chrome extension
          </Button>
          <p>
            Recommend:
            <Button
              type="link"
              href={
                'https://chrome.google.com/webstore/detail/language-learning-with-ne/hoombieeljmmljlkjmnheibnpciblicm'
              }
              target={'_blank'}
            >
              Language learning with Netflix
            </Button>
          </p>

          <p>Netflix remote control ©2020</p>
        </Footer>
      </Layout>
    </>
  )
}
export default Home
