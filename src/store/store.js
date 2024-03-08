import { combineReducers, configureStore } from '@reduxjs/toolkit';
import shoeSlice from './shoeSlice';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';


const persistConfig = {
    key: 'root', // Key for AsyncStorage
    storage: AsyncStorage, // Storage engine for persistence
};


const persistedReducer = persistReducer(persistConfig, shoeSlice);


const rootReducer = combineReducers({ 
    shoes: persistedReducer
})

export const store = configureStore({
    reducer: rootReducer, 

    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        immutableCheck: { warnAfter: 128 },
        serializableCheck: false,
    })
});

export const persistor = persistStore(store);