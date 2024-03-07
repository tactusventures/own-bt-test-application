import React from 'react';
import {ActivityIndicator} from 'react-native';

const Loader = ({size = 'small', color = '#FFF'}) => {
  return <ActivityIndicator color={color} size={size} />;
};

export default Loader;
