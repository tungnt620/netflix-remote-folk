import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Alert, Button, Col, Row, Select, Slider, Space } from 'antd'
import { updateUIState } from '../../../store/ui/actions'
import './style.scss'
import PlayCircleOutlined from '@ant-design/icons/es/icons/PlayCircleOutlined'
import PauseCircleOutlined from '@ant-design/icons/es/icons/PauseCircleOutlined'
import UndoOutlined from '@ant-design/icons/es/icons/UndoOutlined'
import RedoOutlined from '@ant-design/icons/es/icons/RedoOutlined'
import StepForwardOutlined from '@ant-design/icons/es/icons/StepForwardOutlined'
import debounce from 'lodash.debounce'
import DoubleRightOutlined from '@ant-design/icons/es/icons/DoubleRightOutlined'
import RnDWrapper from '../RnDWrapper'

const ConnectedRemote = () => {
  const uiState = useSelector(({ ui }) => ui)
  const dispatch = useDispatch()
  const rndDisabled = useSelector(({ rnd }) => rnd.disabled)
  const rndEditing = useSelector(({ rnd }) => rnd.editing)

  const updateState = newUIStateValues => {
    dispatch(updateUIState(newUIStateValues))
  }

  function sendPeer(data) {
    uiState.peer.send(JSON.stringify(data))
  }

  function videoAction(action, payload = {}) {
    sendPeer({
      namespace: 'video_action',
      payload: {
        action,
        ...payload,
      },
    })
  }

  function getPauseBtn() {
    const pause = () => {
      videoAction('pause_video')
      updateState({
        playing: false,
      })
    }

    return <Button onClick={pause} icon={<PauseCircleOutlined />} size={'large'} />
  }

  function getPlayBtn() {
    const play = () => {
      videoAction('play_video')
      updateState({
        playing: true,
      })
    }

    return <Button onClick={play} icon={<PlayCircleOutlined />} size={'large'} />
  }

  const onChangeSelectSubtitle = value => {
    videoAction('set_subtitle', {
      selectedSubtitleDataUia: value,
    })
  }

  const onOffLLNTranslation = () => {
    videoAction('lln_toggle_translation')
  }

  const debounceViewDefinition = debounce(sliderValue => {
    viewDefinition(sliderValue)
  }, 100)

  const viewDefinition = sliderValue => {
    videoAction('lln_view_definition', {
      sliderValue,
    })
  }

  const defaultSubtitleDataUia = uiState.subtitlesData.find(subtitle => subtitle.selected)?.subtitleDataUia

  if (uiState.peerConnected) {
    return (
      <div className={`${rndDisabled ? '' : `rnd ${rndEditing ? 'editing' : ''}`}`}>
        <div className={`controls`}>
          <RnDWrapper eleKey={'pause-play-btn'} boundSelector={'.rnd'}>
            {uiState.playing ? getPauseBtn() : getPlayBtn()}
          </RnDWrapper>
          <RnDWrapper eleKey={'replay-video-btn'} boundSelector={'.rnd'}>
            <Button onClick={() => videoAction('replay_video')} icon={<UndoOutlined />} size={'large'} />
          </RnDWrapper>
          <RnDWrapper eleKey={'forward-video-btn'} boundSelector={'.rnd'}>
            <Button onClick={() => videoAction('forward_video')} icon={<RedoOutlined />} size={'large'} />
          </RnDWrapper>

          <RnDWrapper eleKey={'next-episode-btn'} boundSelector={'.rnd'}>
            <Button onClick={() => videoAction('next_episode')} icon={<StepForwardOutlined />} size={'large'}>
              Next Episode
            </Button>
          </RnDWrapper>

          <RnDWrapper eleKey={'skip-intro-btn'} boundSelector={'.rnd'}>
            <Button
              disabled={!uiState.playing}
              onClick={() => videoAction('skip_intro')}
              icon={<DoubleRightOutlined />}
              size={'large'}
            >
              Skip intro
            </Button>
          </RnDWrapper>

          <RnDWrapper eleKey={'change-subtitle-select'} boundSelector={'.rnd'}>
            {uiState.subtitlesData?.length > 0 && (
              <Select defaultValue={defaultSubtitleDataUia} onChange={onChangeSelectSubtitle} size={'large'}>
                {uiState.subtitlesData.map((subtitle, index) => (
                  <Select.Option key={index} value={subtitle.subtitleDataUia}>
                    {subtitle.subtitleText}
                  </Select.Option>
                ))}
              </Select>
            )}
          </RnDWrapper>

          {uiState.isHaveLLN && (
            <div className={'lln'}>
              <RnDWrapper eleKey={'lln-on-off-translation-btn'} boundSelector={'.rnd'}>
                <Button className={'lln-on-off-translation'} onClick={onOffLLNTranslation}>
                  LLN On/Of translation
                </Button>
              </RnDWrapper>

              <RnDWrapper eleKey={'lln-world-definition'} boundSelector={'.rnd'}>
                <div className={'lln-word-definition'}>
                  <h4 className={'header'}>LLN world definition</h4>
                  <Slider tooltipVisible={false} size={'large'} min={0} max={100} onChange={debounceViewDefinition} />
                </div>
              </RnDWrapper>
            </div>
          )}
        </div>
      </div>
    )
  }

  return null
}
export default ConnectedRemote
