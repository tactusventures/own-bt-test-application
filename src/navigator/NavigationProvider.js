import { View, Text } from 'react-native'
import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack';
import { useDispatch, useSelector } from 'react-redux';
import { manager } from '../utils/bluetooth/bluetoothManager';
import AddDevice from '../screens/AddDevice';
import HealthAnalyzer from '../screens/HealthAnalyzer';
import RawData from '../screens/RawData';
import MeasureBpm from '../screens/MeasureBpm';
import { disconnectLeft, disconnectRight } from '../store/shoeSlice';
const Stack = createStackNavigator();


const NavigationProvider = () => {
    const dispatch = useDispatch();
    const devices = useSelector(state => state.shoes); 

    manager.onStateChange(async (state) => {
        console.log(state); 
        if (state === "PoweredOff") {
            // disconnecting all the devices
            try {
                dispatch(disconnectLeft());
                dispatch(disconnectRight());
            } catch (e) {
                // navigate to something went wrong's page
                // <ErrorHandling errorType='global' />
            }
        }
    });


    manager.onDeviceDisconnected(async (deviceId) => {
        console.log('disconnected', deviceId); 
        try {
            
            if (devices.left && devices.left.connected && devices.left.device.id === deviceId) {

                dispatch(disconnectLeft()); 
            }
            else if (devices.right && devices.right.connected && devices.right.device.id === deviceId) {
               
                dispatch(disconnectRight());
            }


        } catch (e) {
            // navigate to something went wrong's page
            // <ErrorHandling errorType='global' />
        }
    })

    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName='AddDevice'>
                <Stack.Screen name="AddDevice"
                    component={AddDevice}
                    options={{ headerShown: false}} />

                <Stack.Screen name="HealthAnalyzer"
                    component={HealthAnalyzer}
                    options={{ headerShown: false }} />
                <Stack.Screen name="MeasureBpm"
                    component={MeasureBpm}
                    options={{ headerShown: false }} />

                <Stack.Screen name='rawData' component={RawData}  options={{ headerShown: true }}>
                </Stack.Screen>

            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default NavigationProvider