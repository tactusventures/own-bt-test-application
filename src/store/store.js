import { configureStore } from '@reduxjs/toolkit';
import shoeSlice from './shoeSlice';


export const store = configureStore({
    reducer: {
        shoes: shoeSlice,
    }
});