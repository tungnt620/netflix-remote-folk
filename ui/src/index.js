import React from 'react'
import ReactDOM from 'react-dom'
import { HashRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import App from 'App'
import * as serviceWorker from 'serviceWorker'
import createStore from 'store/createStore'

const app = (
  <Provider store={createStore()}>
    <HashRouter>
      <App />
    </HashRouter>
  </Provider>
)

ReactDOM.render(app, document.getElementById('root'))
serviceWorker.unregister()
