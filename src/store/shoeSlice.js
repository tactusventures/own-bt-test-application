import { createSlice } from '@reduxjs/toolkit'

const initialState = {
   left: { 
    connected: false, 
    device: null
   }, 

   right: { 
    connected: false, 
    device: null
   }
}

export const shoeSlice = createSlice({ 
    name: 'shoes', 
    initialState, 

    reducers: { 
        setLeftDevice: (state, action) => { 
           
            state.left.connected = action.payload.status;
            state.left.device = action.payload.device;
        }, 

        setRightDevice: (state, action) => {
            state.right.connected = action.payload.status;
            state.right.device = action.payload.device;
        }, 

        disconnectRight: (state, action) => { 
            state.right.connected = false; 
        }, 

        disconnectLeft:  (state, action)  => { 
            state.left.connected = false; 

        }
    }
});

export const {setLeftDevice, setRightDevice, disconnectLeft, disconnectRight} = shoeSlice.actions; 
export default shoeSlice.reducer;