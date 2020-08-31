import React, { Component } from "react";
import { Alert, Dimensions, TouchableOpacity, ImageBackground, StyleSheet, AsyncStorage, StatusBar, ScrollView, } from "react-native";
import { Container, Content, View, Text, Button, Left, Right, Body, Title, List, ListItem, } from 'native-base';
import { Avatar, Icon, } from 'react-native-elements';
const width = Dimensions.get('window').width
import color from '../../component/color';

export default class Success extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            code: [],
            auth: '',
            loading: false,
            lname: '',
            fname: ''

        };
    }

    async componentWillMount() {

    }

    render() {
        const { title, message, onPress, button_color, message_color, button_text, button_text_color, icon_bg } = this.props;
        return (
            <Container style={{ backgroundColor: '#000' }}>
                <StatusBar barStyle="dark-content" hidden={false} backgroundColor="transparent" translucent={true} />
                <Content>
                    <View style={styles.container}>


                        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>

                            <View style={{ alignItems: 'center', margin: 20, }}>
                                <TouchableOpacity style={{ backgroundColor: icon_bg, height: 74, width: 74, borderRadius: 37, justifyContent: 'center', alignItems: 'center', }}>
                                    <Icon
                                        active
                                        name="md-checkmark"
                                        type='ionicon'
                                        color='#fff'
                                        size={34}
                                    />
                                </TouchableOpacity>

                                <Text style={{ color: '#fff', fontSize: 22, fontWeight: '200', fontFamily: 'NunitoSans-Bold', }}>{title}</Text>
                                <Text style={{ textAlign: 'center', color: message_color, fontSize: 12, fontWeight: '200', fontFamily: 'NunitoSans', opacity: 0.8 }}>{message}</Text>
                            </View>




                            <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 20, marginBottom: 20, }}>
                                <TouchableOpacity onPress={() => onPress()} style={[styles.enablebutton, { backgroundColor: button_color }]} block iconLeft>
                                    <Text style={{ color: button_text_color, marginTop: 15, marginBottom: 15, fontSize: 16, fontWeight: '200', fontFamily: 'NunitoSans', }}>{button_text}</Text>
                                </TouchableOpacity>
                            </View>


                        </View>



                    </View>


                </Content>
            </Container>
        )
    }

}

Success;

const styles = StyleSheet.create({
    container: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,

    },
    iconContainer: {
        height: 28,
        width: 28,
        borderRadius: 14,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 10
    },
    title: {
        marginTop: 22,
        color: '#fff',
        fontSize: 16,
        fontFamily: 'NunitoSans-Bold',
    },
    headings: {
        marginTop: 22,
        color: '#fff',
        fontSize: 14,
        fontWeight: '600'
    },
    lineStyle: {
        height: 0.8,
        marginTop: 20,
        opacity: 0.5,
        backgroundColor: '#fff',

    },
    map: {
        height: 100,
        marginTop: 15
    },
    welcome: {
        height: 90,
        alignItems: 'center',
        justifyContent: 'center',
    },
    inputView: {
        backgroundColor: 'rgba(247,164,0,0.3)',
        marginTop: 10,
        marginBottom: 10,
        justifyContent: "flex-start",
        borderColor: '#F7A400',
        borderWidth: 1,
        borderRadius: 5,


    },
    item: {
        flexDirection: 'row',
        borderColor: '#8d96a6',
        borderBottomWidth: 0.6,
        alignItems: 'center',
        justifyContent: 'flex-start',
        borderColor: '#F7A400',
        borderWidth: 1,
        borderRadius: 5,
        flex: 1
    },
    enablebutton: {
        backgroundColor: color.primary_color,
        alignItems: 'center',
        alignContent: 'space-around',
        paddingLeft: 53,
        paddingRight: 53,
        borderRadius: 5,
    },
});

const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        fontSize: 12,
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 4,
        color: 'black',
        paddingRight: 30,
        fontFamily: 'NunitoSans-Bold', // to ensure the text is never behind the icon
    },
    inputAndroid: {
        fontSize: 12,
        paddingHorizontal: 10,
        paddingVertical: 2,
        borderRadius: 8,
        color: '#fff',
        paddingRight: 30,
        fontFamily: 'NunitoSans-Bold', // to ensure the text is never behind the icon
    },

});
