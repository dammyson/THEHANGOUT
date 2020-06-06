
import React, { Component } from 'react';
import { Platform, StyleSheet, AsyncStorage, View, Text, Dimensions, ImageBackground } from 'react-native';
import { Actions } from 'react-native-router-flux';
import SVGImage from 'react-native-svg-image';
import {
    BarIndicator,
} from 'react-native-indicators';

import color from '../../component/color';

export default class Sorting extends Component {


    async componentDidMount() {
        if (data !== null) {
            Actions.pop();
            Actions.sorting({ email: "jesus" });
        }
    }

    render() {
        return (
             <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#000000' }}>
             <View style={styles.welcome}>
             <Text style={{ fontSize:15, color: '#fff'}}>Fetching all your goodies</Text>
             <BarIndicator count={4} color={color.primary_color} />
             <Text style={{fontSize:13,  flex: 1, color: '#fff'}}>Please wait...</Text>
             </View>
            
             </View>
        );
    }
}

const styles = StyleSheet.create({
    welcome: {
        height: 90,
        alignItems: 'center',
        justifyContent: 'center',
    },
    backgroundImage: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    },
    logo: {
        width: 300,
        height: 100,
        alignItems: 'center',
        justifyContent: 'center',


    }
    ,
});
