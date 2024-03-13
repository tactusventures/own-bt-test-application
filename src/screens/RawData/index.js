import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';
import { UseSelector, useSelector } from 'react-redux';
import { decode } from 'base-64';
import { useNavigation, useRoute } from '@react-navigation/native';
import StatusIndicator from '../../component/statusIndicator';


const Index = () => {
    const route = useRoute();
    const { shoe } = route.params;
    const navigation = useNavigation();
    const [rawData, setRawData] = useState("");

    const devices = useSelector(state => state.shoes);


    useEffect(() => {
        if (!devices[shoe].connected) {
            navigation.navigate("AddDevice");
        }
    }, [devices])

    useEffect(() => {
        let subscription = null;
        let parsedData;
        if (shoe === "left") {

            subscription = devices.left.device.monitorCharacteristicForService("6e400001-b5a3-f393-e0a9-e50e24dcca9e", "6e400003-b5a3-f393-e0a9-e50e24dcca9e", async (err, characterstic) => {
                if (err) {
                    return err;
                }

                let data = decode(characterstic.value);

                setRawData(data);
            });

        } else if (shoe === "right") {
            subscription = devices.right.device.monitorCharacteristicForService("6e400001-b5a3-f393-e0a9-e50e24dcca9e", "6e400003-b5a3-f393-e0a9-e50e24dcca9e", async (err, characterstic) => {
                if (err) {
                    return err;
                }

                let data = decode(characterstic.value);
                setRawData(data);
            });
        }



        return () => {
            if (subscription) {
                subscription.remove();
            }
        }
    })


    return (
        <LinearGradient
            start={{ x: 1, y: 0 }}
            end={{ x: 1, y: 1 }}
            colors={['#171717cc', '#171717cc', '#171717']}
            style={{ flex: 1 }}>
            <ScrollView>
                <View style={styles.mainContainer}>
                    <Text style={{ color: 'white', fontSize: 30, marginBottom: 20 }}>{shoe} shoe raw data: </Text>

                    <Text style={{ color: 'white', fontSize: 17 }}>{rawData} </Text>
                </View>
            </ScrollView>
            <View style={{ position: 'absolute', right: 0, top: 650 }}>
                <StatusIndicator />
            </View>

        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        paddingHorizontal: 20,
        paddingVertical: 20
    },
})

export default Index;
