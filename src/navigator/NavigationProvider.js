import {View, Text} from 'react-native';
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {useDispatch} from 'react-redux';
import {manager} from '../utils/bluetooth/bluetoothManager';
import AddDevice from '../screens/AddDevice';
import HealthAnalyzer from '../screens/HealthAnalyzer';
import RawData from '../screens/RawData';
import MeasureBpm from '../screens/MeasureBpm';
import {disconnectLeft, disconnectRight} from '../store/shoeSlice';
const Stack = createStackNavigator();

const NavigationProvider = () => {
  const dispatch = useDispatch();

  manager.onStateChange(async state => {
    console.log(state);
    if (state === 'PoweredOff') {
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

  manager.onDeviceDisconnected(async deviceId => {
    try {
      let data = await AsyncStorage.getItem('shoes');
      data = JSON.parse(data);
      if (data == null) return;
      if (data.left.device === deviceId) {
        data.left.connected = false;
        dispatch(disconnectLeft());
      } else if (data.right.device === deviceId) {
        data.right.connected = false;
        dispatch(disconnectRight());
      }

      // set again
      await AsyncStorage.setItem('shoes', JSON.stringify(data));
    } catch (e) {
      // navigate to something went wrong's page
      // <ErrorHandling errorType='global' />
    }
  });

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="AddDevice">
        <Stack.Screen
          name="AddDevice"
          component={AddDevice}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="HealthAnalyzer"
          component={HealthAnalyzer}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="MeasureBpm"
          component={MeasureBpm}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="rawData"
          component={RawData}
          options={{headerShown: true}}></Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default NavigationProvider;
