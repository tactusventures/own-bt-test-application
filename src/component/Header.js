import React from 'react';
import {View, Text, Image, Pressable, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {ScaledSheet} from 'react-native-size-matters';
import colors from '../utils/color';
import images from '../../assets/images';
import {s, vs} from '../utils/sizeMatters';
import Icon from 'react-native-vector-icons/MaterialIcons';
const Header = ({
  showIcon = true,
  rightIcon = null,
  showBack = true,
  size = 40,
  onPress,
}) => {
  const navigation = useNavigation();

  const handleBackPress = () => {
    if (onPress) {
      onPress();
    } else {
      navigation.goBack();
    }
  };

  const handleNavigateToHome = () => {
    navigation.popToTop('Home');
  };

  return (
    <View style={styles.header}>
      {showBack ? (
        <TouchableOpacity onPress={handleBackPress}>
          <Icon name="arrow-back-ios" color={colors.backIconColor} size={40} />
        </TouchableOpacity>
      ) : (
        <View />
      )}
      {showIcon &&
        (rightIcon ? (
          rightIcon
        ) : (
          <Pressable onPress={handleNavigateToHome} style={styles.container}>
            <Image
              source={images.logoWhite}
              style={[styles.logo, {height: vs(size), width: s(size)}]}
            />
          </Pressable>
        ))}
    </View>
  );
};

export default Header;

const styles = ScaledSheet.create({
  header: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 20,
  },
});
