import React from 'react'
import { Button, Layout } from 'antd'
import './style.scss'
const { Footer } = Layout

const AppFooter = () => {
  return (
    <Footer style={{ textAlign: 'center', padding: 0, marginTop: '50px' }}>
      <Button
        type="link"
        href={
          'https://chrome.google.com/webstore/detail/%C4%91i%E1%BB%81u-khi%E1%BB%83n-t%E1%BB%AB-xa-cho-netf/dlocmpllaehjceikkcilecdffmjmlgfe'
        }
        target={'_blank'}
      >
        Download chrome extension
      </Button>
      <p>
        Recommend:
        <Button
          type="link"
          href={'https://chrome.google.com/webstore/detail/language-learning-with-ne/hoombieeljmmljlkjmnheibnpciblicm'}
          target={'_blank'}
        >
          Language learning with Netflix
        </Button>
      </p>

      <p>Netflix remote control ©2020</p>
    </Footer>
  )
}
export default AppFooter
