import React from 'react';
import {View, Pressable, StyleSheet, Image, Text} from 'react-native';
import {s, vs} from '../utils/sizeMatters';
import images from '../../assets/images';
import fonts from '../utils/fonts';
import Loader from './Loader';

const CustomButton = ({
  onPress,
  label = 'Label',
  style,
  type = 'shadow',
  isLoading = false,
  textStyle ,
}) => {
  return (
    <Pressable
      style={[styles.btnContainer, style]}
      activeOpacity={0.7}
      onPress={onPress}>
      <View
        style={{
          width: '100%',
          height: '100%',
          position: 'absolute',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Image
          source={
            type === 'shadow'
              ? images.gradientShadowEmptyButton
              : type === 'gradient'
              ? images.gradientBorderColorButton
              : images.gradientNoBorderButton
          }
          style={{width: '100%', height: '100%', position: 'absolute'}}
          resizeMode="cover"
        />
        {isLoading ? (
          <Loader />
        ) : (
          <Text
            style={{
              ...textStyle,
              color: 'white',
              fontFamily: fonts.extraBold,
              fontSize: 18,
              transform: [{translateY: -2}],
            }}>
            {label}
          </Text>
        )}
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  btnContainer: {
    width: s(240),
    height: vs(80),
    marginBottom: 6,
    position: 'relative',
    borderRadius: 10,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  button: {
    height: '100%',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
});
export default CustomButton;