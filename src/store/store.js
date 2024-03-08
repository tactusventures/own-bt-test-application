import { configureStore } from '@reduxjs/toolkit';
import shoeSlice from './shoeSlice';



export const store = configureStore({
    reducer: {
        shoes: shoeSlice,
    },

    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        immutableCheck: { warnAfter: 128 },
        serializableCheck: false,
    })
});