import { createStore, applyMiddleware } from 'redux'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web
import rootReducer from './reducers';
import ReduxThunk from 'redux-thunk';
import { createLogger } from 'redux-logger';

const loggerMiddleware = createLogger();
const persistConfig = {
  key: 'root',
  storage,
}
const persistedReducer = persistReducer(persistConfig, rootReducer)

export default () => {
  let store = createStore(
  	persistedReducer,
  	undefined,
  	applyMiddleware(ReduxThunk, loggerMiddleware)
  )
  let persistor = persistStore(store)
  return { store, persistor }
}