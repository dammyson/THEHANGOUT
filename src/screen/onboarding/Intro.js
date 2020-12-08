
import React, { Component } from 'react';
import { Image, StyleSheet, View, Dimensions, TouchableOpacity, ImageBackground } from 'react-native';
import { Container, Content, Text, Icon, Button, Left, Right, Body, Title, List, ListItem, Thumbnail, Grid, Col } from 'native-base';
import { Icon as Fil } from 'react-native-elements'
import {
    BarIndicator,
} from 'react-native-indicators';
import AppIntroSlider from 'react-native-app-intro-slider';
import color from '../../component/color';


const slides = [
    {
        key: 'somethun',
        title: 'ONE-STOP SHOP FOR ALL SOCIAL HANGOUT, FUN AND RELAXATION',
        text: 'Buy event tickets without hassle directly from vendors you trust',
        backgroundColor: '#59b2ab',
    },
    {
        key: 'somethun-dos',
        title: 'ONE-STOP SHOP FOR ALL \n EVENT TICKETS',
        text: 'Buy event tickets without hassle directly from vendors you trust',
        backgroundColor: '#febe29',
    },
    {
        key: 'somethun-dos',
        title: 'ONE-STOP SHOP FOR ALL \n EVENT TICKETS',
        text: 'Buy event tickets without hassle directly from vendors you trust',
        backgroundColor: '#febe29',
    }
];

export default class Intro extends Component {


    async componentDidMount() {
       
    }

    _renderItem = ({ item }) => {
        return (

            <View style={styles.mainContent}>
                <Text style={{ color: '#FFF', margin: 20, fontWeight: '700', fontSize: 27, textAlign: 'center' }}>{item.title}</Text>
                <Text style={{ color: '#FFF', margin: 20, fontWeight: '400', fontSize: 15, textAlign: 'center' }}>{item.text}</Text>
            </View>

        );
    }
    _renderSkipButton = () => {
        return (
            <TouchableOpacity>

            </TouchableOpacity>
        );
    };
    _renderDoneButton = () => {
        return (
            <TouchableOpacity >
            </TouchableOpacity>

        );
    };

    render() {
        return (
            <ImageBackground
                opacity={0.3}
                source={require('../../assets/background.png')}
                style={styles.backgroundImage}
                resizeMode="cover"
            >
                <Container style={{ backgroundColor: 'transparent' }}>
                    <Content>
                        <View style={styles.body}>
                            <View style={styles.top}>
                                <Image
                                    style={styles.logo}
                                    source={require('../../assets/logo.png')} />
                            </View>
                            <View style={styles.mid}>
                                <AppIntroSlider
                                    renderItem={this._renderItem}
                                    slides={slides}
                                    showSkipButton={false}
                                    showDoneButton={false}
                                    showNextButton={false}
                                    activeDotStyle={{ backgroundColor: color.primary_color }}
                                />
                            </View>
                            <View style={{ alignItems: 'center', }}>
                                <Fil
                                    active
                                    name="gesture-swipe-horizontal"
                                    type='material-community'
                                    color='#FFF'
                                />
                                <Text style={{ color: '#FFF', fontWeight: '300', fontSize: 14 }}>swipe left to learn more </Text>
                            </View>

                            <View style={styles.bottom}>

                                <Button onPress={() => this.props.navigation.navigate('reg')} style={styles.buttonContainer} block iconLeft>
                                    <Text style={{ color: '#000000', fontWeight: '600', borderRadius: 3, }}>GET STARTED</Text>
                                </Button>
                                <View
                                    style={styles.loginButtonContainer}
                                >
                                    <Text style={{ color: color.primary_color, fontWeight: '600', fontSize: 20 }}>Or   </Text>
                                </View>

                                <TouchableOpacity onPress={() =>  this.props.navigation.navigate('login')}
                                    style={styles.loginButtonContainer}
                                >
                                    <Text style={{ color: color.primary_color, fontWeight: '300', fontFamily: 'NunitoSans-Bold', fontSize: 17 }}>LOGIN  </Text>
                                </TouchableOpacity>
                            </View>

                        </View>

                    </Content>
                </Container>
            </ImageBackground>
        );
    }
}

const styles = StyleSheet.create({
    backgroundImage: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
        backgroundColor: '#000'
    },
    logo: {
        width: 120,
        height: 120,
        justifyContent: 'center',
        resizeMode: 'contain'
    },
    body: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    },
    buttonContainer: {
        backgroundColor: color.primary_color,
        marginLeft: 20,
        marginRight: 20,
        borderRadius: 4,
        marginTop: 20,
    },
    whiteButtonContainer: {
        backgroundColor: '#FFFFFF',
        marginLeft: 20,
        marginRight: 20,
        marginTop: 20,
        borderRadius: 1,
    },
    top: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    bottom: {
        paddingTop: 20,
        flex: 2,
        backgroundColor: 'transparent'
    },
    mid: {
        flex: 2,
        backgroundColor: 'transparent'
    },
    instruction: {
        alignItems: 'center',
    },
    loginButtonContainer: {
        height: 50,
        marginHorizontal: 2,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 10,
        shadowOffset: { width: 2, height: 2 },
        shadowColor: 'black',
        shadowOpacity: 0.2,
        marginBottom: 5

    },
});
