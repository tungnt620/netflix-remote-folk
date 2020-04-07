import React from 'react'
import './style.scss'
import AppLayout from '../AppLayout'
import NotYetConnectRemote from './NotYetConnectRemote'
import ConnectedRemote from './ConnectedRemote'
import InitConnections from './InitConnections'

const Home = () => {
  return (
    <AppLayout>
      <InitConnections />
      <ConnectedRemote />
      <NotYetConnectRemote />
    </AppLayout>
  )
}
export default Home
