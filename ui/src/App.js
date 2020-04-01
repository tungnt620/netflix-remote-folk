import React, { Component, Suspense } from 'react'
import { Route, Switch } from 'react-router-dom'
import 'App.scss'
import Home from './components/Home'

class App extends Component {
  render () {
    return (
      <Suspense
        fallback={
          <div type={'loading'} size={'lg'}/>
        }
      >
        <Switch>
          <Route path="/" exact component={Home}/>
        </Switch>
      </Suspense>
    )
  }
}

export default App
