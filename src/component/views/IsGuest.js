// React native and others libraries imports
import React, { Component } from 'react';
import { FlatList, Dimensions, View, Text, Image, StyleSheet, TouchableOpacity, Animated, Easing, ImageBackground } from 'react-native';
import { Icon } from 'react-native-elements'
import * as Animatable from 'react-native-animatable';
import colors from '../color';
import { Button } from 'native-base';



export default class IsGuest extends Component {
    constructor(props) {
        super(props);
        this.state = {
            progress: new Animated.Value(0),
            merchant: 'ay345',
            shippingmethod: [
                { id: 1, name: 'Home' },
               
            ],


        };

    }

    componentDidMount() {
        Animated.timing(this.state.progress, {
            toValue: 1,
            duration: 2000,
            easing: Easing.linear,
        }).start();

    }



    render() {
        const { onPress, onBack } = this.props;
        return (
            <>
                <View
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        bottom: 0,
                        right: 0,
                        backgroundColor:'#000',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}

                >

                    <Animatable.View style={{ height: Dimensions.get('window').height / 2, alignItems: 'center', justifyContent: 'center', borderRadius:20 }} animation="fadeInUpBig" >

                        <View style={{ height: Dimensions.get('window').height / 2, justifyContent:'center', width: Dimensions.get('window').width - 50, backgroundColor: colors.primary_color, borderRadius:20 }} >
                            <View style={{justifyContent:'center',  alignItems: 'center',}}>
                            <Image source={require('../../assets/userv.png')} style={styles.image_profile} />
                            <Text style={{ color: '#000', fontFamily: 'NunitoSans-Bold', textAlign:'center', marginTop:10, marginHorizontal:20 }}>You need to have a user account to use this feature</Text>
                            </View>

                                <Button onPress={() => onPress()} style={styles.buttonContainer} block iconLeft>
                                    <Text style={{ color: '#FFF', fontFamily: 'NunitoSans-Bold', }}>Become a User</Text>
                                </Button>
                        </View>
                    </Animatable.View>

                </View>
            </>
        )
    }



   
}


IsGuest;

const styles = StyleSheet.create({
    container: {
        height: Dimensions.get('window').height,
        width: Dimensions.get('window').width,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'red',
        position: "absolute",
        top: 40,
        left: 30,
        bottom: 0,
        right: 0,
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    body_top: {
        backgroundColor: colors.primary_color,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        flexDirection: 'row'

    },

    buttonContainer: {
        backgroundColor: "#000",
        marginLeft: 20,
        marginRight: 20,
        borderRadius: 4,
        marginTop: 20,
    },

    image_profile: {
        width: 120,
        height: 120,
        borderRadius: 150,
        shadowColor: 'gray',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.8,
        shadowRadius: 1,
        elevation: 5
    },
    body: {
        flex: 1,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        backgroundColor: '#fff'
    },

});

