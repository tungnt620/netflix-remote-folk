import { createLogger } from 'redux-logger'
import thunk from 'redux-thunk'
import { createStore, applyMiddleware, combineReducers, compose } from 'redux'
import uiReducer from 'store/ui/reducers'
import rndReducer from 'store/rnd/reducers'

const rootReducer = combineReducers({
  ui: uiReducer,
  rnd: rndReducer,
})

const middlewares = [thunk]
let composeEnhancers = compose
if (process.env.NODE_ENV === 'development') {
  const loggerMiddleware = createLogger()
  middlewares.push(loggerMiddleware)
  composeEnhancers = (typeof window != 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose
}

export default preloadState => createStore(rootReducer, preloadState, composeEnhancers(applyMiddleware(...middlewares)))
