import React from 'react'
import { Layout } from 'antd'
import './style.scss'
import AppHeader from '../AppHeader'
import AppFooter from '../AppFooter'

const AppLayout = ({ children }) => {
  return (
    <>
      <Layout className="layout">
        <AppHeader />
        <Layout.Content className={'content'}>{children}</Layout.Content>
        <AppFooter />
      </Layout>
    </>
  )
}
export default AppLayout
