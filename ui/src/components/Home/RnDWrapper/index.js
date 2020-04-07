import React, { useEffect, useState } from 'react'
import './style.scss'
import { Rnd } from 'react-rnd'
import { useDispatch, useSelector } from 'react-redux'
import { updateRnDState } from '../../../store/rnd/actions'
import { useDebounce } from '../../../shared/hooks'

const SouthEastArrow = () => (
  <svg width="20px" height="20px" version="1.1" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <path d="m70.129 67.086l1.75-36.367c-0.035156-2.6523-2.9414-3.6523-4.8164-1.7773l-8.4531 8.4531-17.578-17.574c-2.3438-2.3438-5.7188-1.5625-8.0586 0.78125l-13.078 13.078c-2.3438 2.3438-2.4141 5.0117-0.074219 7.3516l17.574 17.574-8.4531 8.4531c-1.875 1.875-0.83594 4.8203 1.8164 4.8555l36.258-1.8594c1.6836 0.019531 3.1328-1.2812 3.1133-2.9688z" />
  </svg>
)
const CustomHandle = props => (
  <div
    style={{
      background: '#fff',
      borderRadius: '2px',
      border: '1px solid #ddd',
      height: '100%',
      width: '100%',
      padding: 0,
    }}
    className={'SomeCustomHandle'}
    {...props}
  />
)
const BottomRightHandle = () => (
  <CustomHandle>
    <SouthEastArrow />
  </CustomHandle>
)

const RnDWrapper = ({ children, boundSelector = 'parent', eleKey }) => {
  const rndState = useSelector(({ rnd }) => rnd)
  const dispatch = useDispatch()
  const [size, setSize] = useState(undefined)
  const [position, setPosition] = useState(undefined)
  const debouncedSize = useDebounce(size, 300)
  const debouncedPosition = useDebounce(position, 300)

  const { disabled, sizes, positions, editing } = rndState

  useEffect(() => {
    setSize(sizes[eleKey])
    setPosition(positions[eleKey])
  }, [])

  useEffect(() => {
    if (eleKey && (debouncedSize || debouncedPosition)) {
      dispatch(
        updateRnDState({
          positions: {
            ...positions,
            [eleKey]: debouncedPosition,
          },
          sizes: {
            ...sizes,
            [eleKey]: debouncedSize,
          },
        }),
      )
    }
  }, [debouncedSize, debouncedPosition])

  const updatePosition = d => {
    const newPositions = { ...positions }
    newPositions[eleKey] = setPosition({ x: d.x, y: d.y })
  }

  const updateSize = ref => {
    setSize({ width: ref.offsetWidth, height: ref.offsetHeight })
  }

  if (disabled) return children

  return (
    <Rnd
      className={'rnd-wrapper'}
      bounds={boundSelector}
      size={size}
      position={position}
      onDragStop={(e, d) => {
        updatePosition(d)
      }}
      onResize={(e, direction, ref, delta, position) => {
        updateSize(ref)
      }}
      resizeHandleComponent={editing ? { bottomRight: <BottomRightHandle /> } : undefined}
    >
      {children}
    </Rnd>
  )
}
export default RnDWrapper
