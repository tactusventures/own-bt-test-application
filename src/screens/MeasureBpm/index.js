import { ScrollView, View, Text, Image } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Header } from '../../component/index';
import { useNavigation } from '@react-navigation/native';
import screenNames from '../../utils/screenNames';
import VerticalSpacer from '../../utils/VerticalSpacer';
import LinearGradient from 'react-native-linear-gradient';
import colors from '../../utils/color';
import images from '../../../assets/images';
import styles from './styles';
import { useDispatch, useSelector } from 'react-redux';
import { decode } from 'base-64';
import { labels } from '../../config/language';
// import CustomCircularProgressBarWithTitle from '../../component/CustomCircularProgressBarWithTitle';

const MeasureBpm = ({ route }) => {
  const dispatch = useDispatch();
  const { selectedItem } = route.params;
  let devices = useSelector(state => state.shoes);
  const [sensorData, setSensorData] = useState(0);
  const [leftWeight, setLeftWeight] = useState(0);
  const [rightWeight, setRightWeight] = useState(0);
  const [totalWeight, setTotalWeight] = useState(0);

  const updateUi = data => {
    // Rounding the decimal values
    let roundedFigure = Math.round(data);
    setSensorData(roundedFigure);
  };

  useEffect(() => {
    let subscription, leftSubscription, rightSubscription;
    const measureParameters = () => {
      console.log('inside fn>>>>');
      if (selectedItem.title === 'weight') {
        let totaWeight;

        leftSubscription = devices.left.device.monitorCharacteristicForService(
          '6e400001-b5a3-f393-e0a9-e50e24dcca9e',
          '6e400003-b5a3-f393-e0a9-e50e24dcca9e',
          async (err, characterstic) => {
            if (err) {
              console.log(err, ':leftSubscription Error');
              return;
            }

            let data = decode(characterstic.value);
            try {
              data = JSON.parse(data);
              console.log('left:', data['Data']['Weight']);
              setLeftWeight(Number(data['Data']['Weight']));
              console.log({ leftWeight });
            } catch (error) {
              console.log(error);
            }
          },
        );

        rightSubscription =
          devices.right.device.monitorCharacteristicForService(
            '6e400001-b5a3-f393-e0a9-e50e24dcca9e',
            '6e400003-b5a3-f393-e0a9-e50e24dcca9e',
            async (err, characterstic) => {
              if (err) {
                console.log(err, ':rightSubscription Error');
                return;
              }

              let data = decode(characterstic.value);
              try {
                data = JSON.parse(data);
                console.log('right:', data['Data']['Weight']);

                setRightWeight(data['Data']['Weight']);

                console.log({ rightWeight });
                setTotalWeight(rightWeight + leftWeight);
                console.log(totaWeight, ':total');
                updateUi(totaWeight);
              } catch (error) {
                console.log(error);
              }
            },
          );

        totaWeight = leftWeight + rightWeight;
      } else {
        subscription = devices.left.device.monitorCharacteristicForService(
          '6e400001-b5a3-f393-e0a9-e50e24dcca9e',
          '6e400003-b5a3-f393-e0a9-e50e24dcca9e',
          async (err, characterstic) => {
            if (err) {
              console.log(err, ':left Error');
              return;
            }

            let data = decode(characterstic.value);

            try {
              data = JSON.parse(data);
              if (selectedItem.title === 'pluseRate') {
                console.log(data['Data']['Pulse']);
                updateUi(data['Data']['Pulse']);
              } else if (selectedItem.title === 'spo2') {
                console.log(data['Data']);
                updateUi(data['Data']['Spo2']);
              } else if (selectedItem.title === 'temprature') {
                updateUi(data['Data']['Temp']);
              }
            } catch (error) {
              console.log(error);
            }
          },
        );
      }
    };

    measureParameters();
    console.log('after>>>>');
    return () => {
      if (leftSubscription && rightSubscription) {
        console.log('let sub');
        leftSubscription.remove();
        rightSubscription.remove();
      } else {
        console.log('normal sub');
        subscription.remove();
      }
    };
  }, []);
  const navigation = useNavigation();
  const { bodyMeasurement } = screenNames;
  const handleNavigation = () => {
    navigation.navigate(bodyMeasurement);
  };

  return (
    <>
      <LinearGradient
        start={{ x: 1, y: 0 }}
        end={{ x: 1, y: 1 }}
        colors={['#171717cc', '#171717cc', '#171717']}
        style={{ flex: 1 }}>
        <Header />
        <ScrollView contentContainerStyle={styles.contentContainerStyle}>
          <View style={styles.monitorTitleInfo}>
            <Text style={styles.monitorText}>{labels.monitorinig}</Text>
            <Text style={styles.monitorTitle}>{selectedItem.title}</Text>
          </View>
          <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 100}}>
            <Text style={{fontWeight:'700'}}>
              Value:{sensorData}
            </Text>
          </View>
          {/* 
          <CustomCircularProgressBarWithTitle
            title={selectedItem.progressTitle}
            unitValue={sensorData}
            value={100}
            primaryColor={colors.barColorGreen}
            secondaryColor={colors.barColorRed}
            onPress={handleNavigation}
            image={selectedItem.progressImg}
          /> */}
          <VerticalSpacer height={40} />

          <View
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <View style={styles.zoneContent}>
              <Image
                source={selectedItem.monitorImg}
                style={styles.heartRateImg}
                resizeMode="contain"
              />
            </View>
            <Image
              source={images.graph}
              style={styles.graphImg}
              resizeMode="contain"
            />
          </View>
        </ScrollView>
      </LinearGradient>
    </>
  );
};

export default MeasureBpm;
