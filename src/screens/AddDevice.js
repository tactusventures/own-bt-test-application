import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  Button,
} from 'react-native';
import colors from '../utils/color';
import LinearGradient from 'react-native-linear-gradient';
import {s, vs} from '../utils/sizeMatters';
import images from '../../assets/images';

import {useDispatch, useSelector} from 'react-redux';
import {
  setLeftDevice,
  setRightDevice,
  disconnectLeft,
  disconnectRight,
} from '../store/shoeSlice';
import {useNavigation} from '@react-navigation/native';
import {manager} from '../utils/bluetooth/bluetoothManager';
import {decode} from 'base-64';
import AsyncStorage from '@react-native-async-storage/async-storage';
import requestBluetoothPermission from '../utils/bluetooth/requestBluetoothPermission';
import {CustomButton, Header, Loader} from '../component';
import {showToastSuccess} from '../utils/toast';
import fonts from '../utils/fonts';

const AddDevice = () => {
  const [showBluetoothEnablePrompt, setShowBluetoothEnablePrompt] =
    useState(false);

    let devices = useSelector((state) => state.shoes);
    // initializing the dispatch
    const dispatch = useDispatch();

    const [isDeviceScanning, setIsDeviceScanning] = useState(false);
    const [allDevices, setAllDevices] = useState([]);
    const [connctingDevices, setConnectingDevices] = useState([]); 



//   const [connectingDevice, setConnectingDevice] = useState({
//     connectionStatus: null,
//     deviceId: null,
//   });

  const [leftShoe, setLeftShoe] = useState(devices.left);
  const [rightShoe, setRightShoe] = useState(devices.right);
  const [bleStatus, setBleStatus] = useState(null);

  const navigation = useNavigation();

  const handleEnableBluetoothAndScan = async () => {
    let granted = requestBluetoothPermission();
    setAllDevices([]);
    setConnectingDevices([]); 
    // stop scanning if already scanning 
    const isEnabled = await manager.state();
    if (isEnabled !== 'PoweredOn') {
      // Bluetooth is not enabled, show a modal to prompt the user to enable it
      setShowBluetoothEnablePrompt(true);
      return;
    }
    if(isDeviceScanning){  
        setIsDeviceScanning(false); 
        manager.stopDeviceScan(); 
        return; 
    }


    setIsDeviceScanning(true);
    let uniqueDeviceIds = new Set();

    // start Scanning for devices
    manager.startDeviceScan(null, null, (error, device) => {
        if (error) {
            // Navigate to the ble Error Screen or Error Screen
            console.log("Error Occured", error);
            setIsDeviceScanning(false);
            return
        }

        // filter and show only unique devices here
        if (!uniqueDeviceIds.has(device.id) && device.name !== null) {
            uniqueDeviceIds.add(device.id);
            setAllDevices((devices) => [...devices, device]);
        }
    });


}

const handleConnectDevice = async (deviceId) => {
  

    setConnectingDevices(() => [...connctingDevices, deviceId]); 

    // get device from all devices with id
    let filterDevices = allDevices.filter(device => device.id === deviceId);
    let currentDevice = filterDevices[0];
  
    try {
        await currentDevice.connect();
        await currentDevice.discoverAllServicesAndCharacteristics();
        const discoveredServices = await currentDevice.services();

        for (const service of discoveredServices) {
            console.log('Service UUID:', service.uuid);
            
            const characteristics = await service.characteristics();
            for (const characteristic of characteristics) {

            }
        }

        let data;
        let shoesData;

        try {
            shoesData = await AsyncStorage.getItem('shoes');
            shoesData = JSON.parse(shoesData);
        } catch (e) {
           
        }

        if (!shoesData) {
            shoesData = {
                left: {
                    connected: false,
                    device: null
                },

                right: {
                    connected: false,
                    device: null
                }
            }
        }

        if (shoesData.left.connected && shoesData.right.connected) {
           
        }

        let isSeted = false;
        await manager.requestMTUForDevice(deviceId, 517);
        subscription = currentDevice.monitorCharacteristicForService("6e400001-b5a3-f393-e0a9-e50e24dcca9e", "6e400003-b5a3-f393-e0a9-e50e24dcca9e", async (err, characterstic) => {
            if (err) {
            setConnectingDevices((prevDevices) => prevDevices.filter((device) => device != currentDevice.id)); 
                
                return;
            }

            // base 64 decoding
            data = decode(characterstic.value);

            try {
                data = JSON.parse(data);
                console.log({data});

                if (data && data["Data"] && data["Data"]["Spo2"] === undefined) {
                    // if (shoesData.right.connected) {
                    //   console.log('shoes already connected');
                    //   handleDisconnectDevice(currentDevice.id);
                    //   return
                    // };

                    if (!isSeted) {
                        shoesData.right.connected = true;
                        shoesData.right.device = currentDevice;
                        dispatch(setRightDevice({ status: true, device: currentDevice }));
                        subscription.remove();
                        setConnectingDevices((prevDevices) => prevDevices.filter((device) => device != currentDevice.id)); 
                        isSeted = true; 
                    }

                }
                else {
                    // if (shoesData.left.connected) {
                    //   console.log('shoes already connected');
                    //   handleDisconnectDevice(currentDevice.id);
                    //   return
                    // };


                    if (!isSeted) {
                        shoesData.left.connected = true;
                        shoesData.left.device = currentDevice;
                        dispatch(setLeftDevice({ status: true, device: currentDevice }));
                        subscription.remove();    

                       

                        isSeted = true;
                    }

                }

               if(isSeted){ 
                    currentDevice.onDisconnected((err, disconnectedDevice) => { 
                        if(err) return; 

                        if (devices?.left?.device?.id === disconnectedDevice.id) {
                            // data.left.connected = false;
                            dispatch(disconnectLeft());
                            showToastError({
                                message: "Left Shoe Disconnected"
                            })
                        }
        
                        else if (devices?.right?.device?.id === disconnectedDevice.id) {
                            // data.right.connected = false;
                            dispatch(disconnectRight());
                        }

                    }); 
               }
                setAllDevices((devices) => devices.filter((device) => device.id !== currentDevice.id))
            } catch (e) {
                console.log(e);
            }


        });

    } catch (error) {
        setConnectingDevices((prevDevices) => prevDevices.filter((device) => device != currentDevice.id)); 
    }
};

const handleDisconnectDevice = async deviceId => {
    manager.cancelDeviceConnection(deviceId).then(async () => {
        try {
          

            // if (devices?.left?.device?.id === deviceId) {
            //     // data.left.connected = false;
            //     dispatch(disconnectLeft());
            // }

            // else if (devices?.right?.device?.id === deviceId) {
            //     // data.right.connected = false;
            //     dispatch(disconnectRight());
            // }


        } catch (error) {
           
        }
    })
}

  // function getData() {
  //     console.log(devices.right);
  //   }

  const cancelScanning = () => {
    setIsDeviceScanning(false);
    setShowBluetoothEnablePrompt(false);
    manager.stopDeviceScan();
  };

  const handleAllowBluetooth = async () => {
    setShowBluetoothEnablePrompt(false);
    await manager.enable();
    handleEnableBluetoothAndScan();
  };
  return (
    <>
      <LinearGradient
        start={{x: 1, y: 0}}
        end={{x: 1, y: 1}}
        colors={['#171717cc', '#171717cc', '#171717']}
        style={styles.mainContent}>
        <Header />
        <ScrollView contentContainerStyle={styles.mainContainer}>
          <View
            style={{
              ...styles.container,
              alignItems: 'center',
              flexDirection: 'row',
            }}>
            <View
              style={{
                width: '50%',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Image
                source={images.leftShoe}
                style={styles.shoeImg}
                resizeMode="contain"
              />
              <ShoeStatusItem status={devices.left.connected} name="left" />
            </View>
            <View
              style={{
                width: '50%',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Image
                source={images.rightShoe}
                style={styles.shoeImg}
                resizeMode="contain"
              />
              <ShoeStatusItem status={devices.right.connected} name="right" />
            </View>
          </View>
          {/* <VerticalSpacer /> */}
          <View style={styles.confirmCancelBtnContainer}>
            <CustomButton
              style={styles.btn}
              label="Scan"
              onPress={handleEnableBluetoothAndScan}
              isLoading={isDeviceScanning}
            />
          </View>
          <ScrollView contentContainerStyle={{flex: 1, paddingHorizontal: 8}}>
            <Text style={{color: 'white', fontSize: 15}}>
              Connected Devices:{' '}
            </Text>

            {devices.left.connected === true ? (
              <TouchableOpacity style={styles.container} pointerEvents="auto">
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    backgroundColor: colors.glassEffect,
                    borderRadius: 4,
                    paddingHorizontal: 10,
                  }}>
                  <Text style={styles.deviceNames}>
                    {devices.left.device.name}
                  </Text>

                  <TouchableOpacity
                    style={{
                      flex: 1,
                      justifyContent: 'center',
                      alignItems: 'flex-end',
                      color: 'white',
                    }}
                    onPress={e =>
                      handleDisconnectDevice(devices.left.device.id)
                    }>
                    <Text
                      style={{
                        backgroundColor: colors.chatBubbleLeftBgColor,
                        paddingHorizontal: 10,
                        paddingVertical: 2,
                        borderRadius: 10,
                        color: 'white',
                      }}>
                      {' '}
                      Disconnect
                    </Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ) : (
              ''
            )}

            {devices.right.connected === true ? (
              <TouchableOpacity style={styles.container} pointerEvents="auto">
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    backgroundColor: colors.glassEffect,
                    borderRadius: 4,
                    paddingHorizontal: 10,
                  }}>
                  <Text style={styles.deviceNames}>
                    {devices.right.device.name}{' '}
                  </Text>

                  <TouchableOpacity
                    style={{
                      flex: 1,
                      justifyContent: 'center',
                      alignItems: 'flex-end',
                      color: 'white',
                    }}
                    onPress={e =>
                      handleDisconnectDevice(devices.right.device.id)
                    }>
                    <Text
                      style={{
                        backgroundColor: colors.chatBubbleLeftBgColor,
                        paddingHorizontal: 10,
                        paddingVertical: 2,
                        borderRadius: 10,
                        color: 'white',
                      }}>
                      {' '}
                      Disconnect
                    </Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ) : (
              ''
            )}

            <Text
              style={{
                color: 'white',
                fontSize: 15,
                marginTop: 30,
                marginBottom: 5,
              }}>
              Devices Found:{' '}
            </Text>
            {allDevices.map(item => (
              <BluetoothDeviceListItem
                key={item.id}
                device={item}
                connectingDevice={connctingDevices}
                handleConnect={handleConnectDevice}
                handleDisconnect={handleDisconnectDevice}
              />
            ))}

            <View style={{marginTop: 100}}>
              {devices.left.connected ? (
                <TouchableOpacity
                  style={{
                    backgroundColor: colors.glassEffect,
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: 10,
                  }}
                  onPress={() =>
                    navigation.navigate('rawData', {shoe: 'left'})
                  }>
                  <Text style={{color: 'white', padding: 10}}>
                    Left Raw Data
                  </Text>
                </TouchableOpacity>
              ) : (
                ''
              )}

              {devices.right.connected ? (
                <TouchableOpacity
                  style={{
                    backgroundColor: colors.glassEffect,
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: 10,
                  }}
                  onPress={() =>
                    navigation.navigate('rawData', {shoe: 'right'})
                  }>
                  <Text style={{color: 'white', padding: 10}}>
                    Right Raw Data
                  </Text>
                </TouchableOpacity>
              ) : (
                ''
              )}

              {devices.left.connected && devices.right.connected ? (
                <TouchableOpacity
                  style={{
                    backgroundColor: colors.glassEffect,
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: 10,
                  }}
                  onPress={() => navigation.navigate('HealthAnalyzer')}>
                  <Text style={{color: 'white', padding: 10}}>Get Data</Text>
                </TouchableOpacity>
              ) : (
                ''
              )}
            </View>

            <Modal
              visible={showBluetoothEnablePrompt}
              animationType="slide"
              transparent={true}
              onRequestClose={() => setShowBluetoothEnablePrompt(false)}>
              <View style={styles.centeredView}>
                <View style={styles.modalView}>
                  <Text style={styles.modalTitle}>
                    Please enable Bluetooth to continue
                  </Text>
                  <View style={styles.btnRow}>
                    <TouchableOpacity
                      style={styles.inactiveBtn}
                      onPress={cancelScanning}>
                      <Text style={styles.inActiveBtnStyle}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.activeBtn}
                      onPress={handleAllowBluetooth}>
                      <Text style={styles.activeBtnStyle}>Allow</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Modal>
          </ScrollView>
        </ScrollView>
      </LinearGradient>
    </>
  );
};

const ShoeStatusItem = ({status, name}) => {
  return (
    <View style={styles.shoeContainer}>
      <Text
        style={{
          textAlign: 'center',
          fontWeight: '600',
          marginTop: 15,
          fontSize: 14,
          color: status ? 'green' : 'red',
        }}>
        {status ? 'Connected' : 'Disconnected'}
      </Text>
    </View>
  );
};

const BluetoothDeviceListItem = ({
  device,
  connectingDevice,
  handleConnect,
  handleDisconnect,
}) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => handleConnect(device.id)}
      pointerEvents="auto">
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          backgroundColor: colors.glassEffect,
          borderRadius: 4,
          paddingHorizontal: 10,
        }}>
        <Text style={styles.deviceNames}>{device.name}</Text>
        {connectingDevice.deviceId === device.id ? <Loader /> : ''}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  mainContent: {
    flex: 1,
  },
  mainContainer: {
    position: 'relative',
    paddingHorizontal: s(2),
    paddingVertical: vs(18),
  },
  shoeContainer: {
    width: '50%',
    alignItems: 'center',
  },
  container: {
    width: '100%',
    paddingHorizontal: 0,
    paddingVertical: 8,
    borderRadius: 8,
  },
  shoeImg: {
    width: 400,
    height: 100,
  },
  text: {fontSize: 14, fontWeight: 800, marginVertical: 10},
  title: {fontSize: 16, fontWeight: '600'},
  statusText: {fontWeight: '800', marginTop: 15, fontSize: 15},
  confirmCancelBtnContainer: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    flexDirection: 'row',
  },
  btn: {width: s(190), height: vs(66)},
  deviceNames: {
    color: 'white',
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 1,
  },
  inactiveBtn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    backgroundColor: colors.white,
    margin: 5,
  },
  activeBtn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    backgroundColor: 'blue',
    margin: 5,
  },
  modalTitle: {
    fontFamily: fonts.bold,
    fontSize: 18,
    color: colors.black,
  },
  inActiveBtnStyle: {
    fontFamily: fonts.medium,
    fontSize: 18,
    color: colors.black,
  },
  activeBtnStyle: {
    fontFamily: fonts.medium,
    fontSize: 18,
    color: colors.white,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.black,
    opacity: 0.8,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    paddingHorizontal: 35,
    paddingVertical: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  btnRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
  },
});

export default AddDevice;