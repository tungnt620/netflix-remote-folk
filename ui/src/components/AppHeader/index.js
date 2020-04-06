import React from 'react'
import { Button, Layout } from 'antd'
import logo from 'assets/netflix.svg'
import { ReloadOutlined } from '@ant-design/icons'
import './style.scss'
const { Header } = Layout

const AppHeader = () => {
  function refreshWindow() {
    window.location.reload()
  }

  return (
    <Header className={'header'}>
      <a href={'/'}>
        <img width={50} src={logo} alt={'logo'} />
      </a>

      <Button type="primary" onClick={refreshWindow} ghost={true} icon={<ReloadOutlined />} size={'large'} />
    </Header>
  )
}
export default AppHeader
