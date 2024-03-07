import React from 'react';
import {
  View,
  Image,
  StatusBar,
  ScrollView,
  Text,
} from 'react-native';
import { Header} from '../../component/index';
import {useNavigation} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import {ms, s} from '../../utils/sizeMatters';
import CustomButton from '../../component/CustomButton';
import images from '../../../assets/images';
import colors from '../../utils/color';
import {styles} from './styles';
import data from './data';
import fonts from '../../utils/fonts';
import {labels} from '../../config/language';

const HealthAnalyzer = () => {
  const buttons = [
    {
      key: 'pluseRate',
      title: 'pluseRate',
    },
    {
      key: 'spo2',
      title: 'spo2',
    },
    {
      key: 'temprature',
      title: 'temprature',
    },
    {
      key: 'Weight',
      title: 'weight',
    },
  ];

  const navigation = useNavigation();
  const handleNavigation = title => {
    const selectedItem = data.find(dataItem => dataItem.title === title);
    if (selectedItem) {
      console.log(selectedItem);
      // navigation.navigate('MeasureBpm', {selectedItem});
      // navigation.navigate('MonitorMesurement', {selectedItem});
    } else {
      console.log(`Data not found for ${title}`);
    }
  };

  return (
    <>
      <StatusBar backgroundColor="#000" barStyle="light-content" />
      <LinearGradient
        start={{x: 1, y: 0}}
        end={{x: 1, y: 1}}
        colors={['#171717cc', '#171717cc', '#171717']}
        style={{flex: 1}}>
        <Header showBack />
        <ScrollView contentContainerStyle={styles.wrapper}>
          <Image
            source={images.mindWellnessBackground}
            style={styles.backgroundImage}
          />
          <View style={styles.container}>
            <Text
              style={{
                color: colors.white,
                fontSize: 30,
                fontFamily: fonts.semiBold,
              }}>
              {labels.analyzer}
            </Text>
            <View style={styles.itemsContainer}>
              {buttons.map(item => (
                <CustomButton
                  key={item.key}
                  label={item.title}
                  style={{width: s(260)}}
                  onPress={() => handleNavigation(item.title)}
                />
              ))}
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </>
  );
};

export default HealthAnalyzer;
