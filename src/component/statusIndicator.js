import { View, Text, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import { useSelector } from 'react-redux';

const StatusIndicator = () => {
    const devices = useSelector(state => state.shoes);
    // const [leftConnect, setLeftConnect] = useState(devices.left.connected)



    return (
        <View style={style.container}>
            <View style={style.component}>
                <View style={{ width: 10, height: 10,padding:5, borderRadius: 5, backgroundColor: devices.right.connected ? 'green' : 'red' }}></View>
                <Text style={style.font}>
                    RIGHT
                </Text>
            </View>
            <View style={style.component}>
                <Text style={style.font}>
                    LEFT
                </Text>
                <View style={{ width: 10, height: 10,padding:5, borderRadius: 5, backgroundColor: devices.left.connected ? 'green' : 'red', }}></View>
            </View>
        </View>
    )
}

const style = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgb(2, 0, 36)',
        width: 200,
        height: 50,
        borderBottomLeftRadius: 50,
        borderTopLeftRadius: 50
    },
    component: {
        padding: 6,
        flex: 1, 
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        
    },
    font: {
        fontWeight: '600',
        padding:5
    }
})

export default StatusIndicator