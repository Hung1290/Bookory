import { combineReducers, configureStore } from '@reduxjs/toolkit'
import accountReducer from './account/accountSlice'
import orderReducer from './order/orderSlice'
import {
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from 'redux-persist'
import storage from 'redux-persist/lib/storage'
// import thunk from 'redux-thunk'

const persistConfig = {
    key: 'root',
    storage,
}

const reducer = combineReducers({
    account: accountReducer,
    order: orderReducer,
});

const persistedReducer = persistReducer(persistConfig, reducer)

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }),
})

export default store;