import React from 'react';
import {View, StyleSheet} from 'react-native';
import {vs} from './sizeMatters';

const VerticalSpacer = ({height = 20}) => {
  return <View style={[styles.container, {height: vs(height)}]}></View>;
};

export default VerticalSpacer;

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
});
