import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import { CircularProgressBase } from 'react-native-circular-progress-indicator';
import { ms, s } from '../utils/sizeMatters';
import colors from '../utils/color';
import fonts from '../utils/fonts';

const CustomCircularProgressBarWithTitle = props => {
  const {
    title = '',
    unit = '',
    unitValue = '',
    value,
    radius = 110,
    onPress,
    image,
  } = props;
  return (
    <View
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <TouchableOpacity activeOpacity={0.5} onPress={onPress}>
        <CircularProgressBase
          radius={radius}
          activeStrokeColor={colors.barColorGreen}
          activeStrokeWidth={12}
          value={value}
          {...props}>
          {image && (
            <Image
              source={image}
              style={styles.heartImg}
              resizeMode="stretch"
            />
          )}
          <View style={styles.textContainer}>
            <View style={styles.textContainerTopSection}>
              <Text style={styles.value}>{unitValue}</Text>
              <Text style={styles.unit}>{unit}</Text>
            </View>
            <Text style={styles.title}>{title}</Text>
          </View>
        </CircularProgressBase>
      </TouchableOpacity>
    </View>
  );
};

export default CustomCircularProgressBarWithTitle;

const styles = StyleSheet.create({
  textContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainerTopSection: { flexDirection: 'row' },
  value: {
    fontSize: ms(60),
    color: colors.white,
    textTransform: 'capitalize',
  },
  unit: { color: colors.white, fontSize: ms(20), textTransform: 'capitalize' },
  title: {
    fontSize: ms(20),
    textTransform: 'capitalize',
    fontFamily: fonts.light,
    color: colors.white,
  },
  heartImg: {
    width: 40,
    height: 40,
  },
});
