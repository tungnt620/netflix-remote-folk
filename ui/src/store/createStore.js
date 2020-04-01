import { createLogger } from 'redux-logger'
import thunk from 'redux-thunk'
import { createStore, applyMiddleware, combineReducers, compose } from 'redux'
import uiReducer from 'store/ui/reducers'

const rootReducer = combineReducers({
  ui: uiReducer,
})

const middlewares = [thunk]
let composeEnhancers = compose
if (process.env.NODE_ENV === 'development') {
  const loggerMiddleware = createLogger()
  middlewares.push(loggerMiddleware)
  composeEnhancers = (typeof window != 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose
}

export default preloadState => createStore(rootReducer, preloadState, composeEnhancers(applyMiddleware(...middlewares)))
