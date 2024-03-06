import { createSlice } from '@reduxjs/toolkit'


const deviceSlice = createSlice({ 
    name: "shoes", 
    initialState: {
        left: { 
            connected: false, 
            device: null
        }, 

        right: { 
            connected: false, 
            device: null
        }
    }, 

    reducers: { 
        setLeftDevice(state, action){ 

        }
    }
}); 


export const {setLeftDevice}  = deviceSlice.actions; 
export default deviceSlice.reducer; 