import React, { useState } from 'react';
import {
    View,
    StyleSheet,
    Text,
    Image,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
} from 'react-native';
import colors from '../utils/color';
import LinearGradient from 'react-native-linear-gradient';
import { s, vs } from '../utils/sizeMatters';
import images from '../../assets/images';

import { useDispatch, useSelector } from 'react-redux';
import { setLeftDevice, setRightDevice, disconnectLeft, disconnectRight } from '../store/shoeSlice';
import { useNavigation } from '@react-navigation/native';
import { manager } from '../utils/bluetooth/bluetoothManager';
import { decode } from 'base-64';
import AsyncStorage from '@react-native-async-storage/async-storage';
import requestBluetoothPermission from '../utils/bluetooth/requestBluetoothPermission';
import { CustomButton, Header, Loader } from '../component';

const AddDevice = () => {
    let devices = useSelector((state) => state.shoes);
    // initializing the dispatch
    const dispatch = useDispatch();

    const [isDeviceScanning, setIsDeviceScanning] = useState(false);
    const [allDevices, setAllDevices] = useState([]);
    const [connectingDevice, setConnectingDevice] = useState({
        connectionStatus: null,
        deviceId: null
    });

    const [leftShoe, setLeftShoe] = useState(devices.left);
    const [rightShoe, setRightShoe] = useState(devices.right);
    const [bleStatus, setBleStatus] = useState(null);

    const navigation = useNavigation();

    const handleEnableBluetoothAndScan = () => {
        let granted = requestBluetoothPermission();

        setAllDevices([]);

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
console.log({deviceId});
        // connect the device here
        setConnectingDevice({
            connectionStatus: 'connecting',
            deviceId: deviceId
        });

        // get device from all devices with id
        let filterDevices = allDevices.filter(device => device.id === deviceId);
        let currentDevice = filterDevices[0];
        console.log(currentDevice);
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
            let parsedData;
            let shoesData;

            try {
                shoesData = await AsyncStorage.getItem('shoes');
                shoesData = JSON.parse(shoesData);
            } catch (e) {
                // navigate to error page or popup error
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
                // show alert to them
            }

            let isSeted = false;
            await manager.requestMTUForDevice(deviceId, 517);
            subscription = currentDevice.monitorCharacteristicForService("6e400001-b5a3-f393-e0a9-e50e24dcca9e", "6e400003-b5a3-f393-e0a9-e50e24dcca9e", async (err, characterstic) => {
                if (err) {
                    setConnectingDevice({
                        connectionStatus: null,
                        deviceId: null
                    })
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
                            true;
                        }

                        subscription.remove();
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
                            true;
                        }
                        subscription.remove();

                    }

                    setConnectingDevice({
                        connectionStatus: null,
                        deviceId: null
                    });

                    setAllDevices((devices) => devices.filter((device) => device.id !== currentDevice.id))
                } catch (e) {
                    console.log(e);

                    setConnectingDevice({
                        connectionStatus: null,
                        deviceId: null
                    })
                }


            });

        } catch (error) {
            setConnectingDevice({
                connectionStatus: null,
                deviceId: null
            })
        }
    };

    const handleDisconnectDevice = async deviceId => {
        manager.cancelDeviceConnection(deviceId).then(async () => {
            try {
                let data = await AsyncStorage.getItem('shoes');
                data = JSON.parse(data);

                // if(data == null) return;


                if (devices?.left?.device?.id === deviceId) {
                    // data.left.connected = false;
                    dispatch(disconnectLeft());
                }

                else if (devices?.right?.device?.id === deviceId) {
                    // data.right.connected = false;
                    dispatch(disconnectRight());
                }

                await AsyncStorage.setItem('shoes', JSON.stringify(data));

            } catch (error) {
                // navigate to something went wrong's page
            }
        }).catch((error) => {
            console.log(error);
            console.log('something went wrong');
        })
    }

    // function getData() {
    //     console.log(devices.right);
    //   }

    return (
        <>
            <LinearGradient
                start={{ x: 1, y: 0 }}
                end={{ x: 1, y: 1 }}
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
                    <ScrollView contentContainerStyle={{ flex: 1, paddingHorizontal: 8 }}>

                        <Text style={{ color: 'white', fontSize: 15 }}>Connected Devices: </Text>

                        {
                            devices.left.connected === true ? <TouchableOpacity
                                style={styles.container}
                                pointerEvents="auto">
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', backgroundColor: colors.glassEffect, borderRadius: 4, paddingHorizontal: 10 }}>
                                    <Text style={styles.deviceNames}>{devices.left.device.name}</Text>

                                    <TouchableOpacity style={{ flex: 1, justifyContent: "center", alignItems: "flex-end", color: 'white' }}
                                        onPress={e => handleDisconnectDevice(devices.left.device.id)}
                                    >
                                        <Text style={{ backgroundColor: colors.chatBubbleLeftBgColor, paddingHorizontal: 10, paddingVertical: 2, borderRadius: 10, color: 'white' }}> Disconnect</Text>
                                    </TouchableOpacity>
                                </View>
                            </TouchableOpacity> : ""
                        }

                        {
                            devices.right.connected === true ?
                                <TouchableOpacity
                                    style={styles.container}
                                    pointerEvents="auto">
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', backgroundColor: colors.glassEffect, borderRadius: 4, paddingHorizontal: 10 }}>
                                        <Text style={styles.deviceNames}>{devices.right.device.name} </Text>

                                        <TouchableOpacity style={{ flex: 1, justifyContent: "center", alignItems: "flex-end", color: 'white' }}
                                            onPress={e => handleDisconnectDevice(devices.right.device.id)}
                                        >
                                            <Text style={{ backgroundColor: colors.chatBubbleLeftBgColor, paddingHorizontal: 10, paddingVertical: 2, borderRadius: 10, color: 'white' }}> Disconnect</Text>
                                        </TouchableOpacity>
                                    </View>
                                </TouchableOpacity>
                                : ""
                        }




                        <Text style={{ color: 'white', fontSize: 15, marginTop: 30, marginBottom: 5 }}>Devices Found: </Text>
                        {allDevices.map(item => (
                            <BluetoothDeviceListItem
                                key={item.id}
                                device={item}
                                connectingDevice={connectingDevice}
                                handleConnect={handleConnectDevice}
                                handleDisconnect={handleDisconnectDevice}
                            />
                        ))}
                        {
                            (rightShoe && leftShoe) && (<TouchableOpacity style={{ backgroundColor: 'green', flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 100 }}
                                onPress={() => navigation.navigate('HealthAnalyzer')}>
                                <Text style={{ color: 'white', padding: 10 }}>
                                    GET DATA
                                </Text>
                            </TouchableOpacity>)
                        }


                    </ScrollView>
                </ScrollView>
            </LinearGradient>
        </>
    );
};

const ShoeStatusItem = ({ status, name }) => {
    return (
        <View style={styles.shoeContainer}>

            <Text
                style={{ textAlign: 'center', fontWeight: '600', marginTop: 15, fontSize: 14, color: status ? "green" : "red" }}
            >
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
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', backgroundColor: colors.glassEffect, borderRadius: 4, paddingHorizontal: 10 }}>
                <Text style={styles.deviceNames}>{device.name}</Text>
                {
                    connectingDevice.deviceId === device.id ? <Loader /> : ""
                }
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
    text: { fontSize: 14, fontWeight: 800, marginVertical: 10 },
    title: { fontSize: 16, fontWeight: '600' },
    statusText: { fontWeight: '800', marginTop: 15, fontSize: 15 },
    confirmCancelBtnContainer: {
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        flexDirection: 'row',
    },
    btn: { width: s(190), height: vs(66) },
    deviceNames: {
        color: 'white',
        paddingHorizontal: 10,
        paddingVertical: 10,
        borderRadius: 1
    }
});


export default AddDevice;
