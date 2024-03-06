import { configureStore } from '@reduxjs/toolkit';
import deviceSlice from './deviceSlice';


export const store =configureStore({
    reducer:{
        shoes: deviceSlice
    }
});