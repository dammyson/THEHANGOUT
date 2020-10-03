import React, { Component } from "react";
import { Alert, Dimensions, TouchableOpacity, ImageBackground, StyleSheet, AsyncStorage, StatusBar, ScrollView, } from "react-native";
import { Container, Content, View, Text, Button, Left, Right, Body, Title, List, ListItem, } from 'native-base';
import { Avatar, Icon, } from 'react-native-elements';
const width = Dimensions.get('window').width
import color from '../../component/color';

export default class TicketType extends React.Component {
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
        const { onClose, onSelect } = this.props;
        return (
            <View style={styles.container}>

                <View style={{ flexDirection: 'row', alignItems: 'center', paddingTop: 1, paddingBottom: 10 }}>
                    <Text style={{ fontFamily: 'Montserrat-Bold', fontSize: 17, textAlign: 'left', paddingBottom: 10, marginTop: 25, flex: 1 }}>  </Text>
                    <TouchableOpacity onPress={() => onClose()} style={{ marginLeft: 10, marginRight: 20, }}>
                        <Icon
                            name="close"
                            size={20}
                            type='antdesign'
                            color="#fff"
                        />
                    </TouchableOpacity>
                </View>
                <View style={{ paddingTop: 1, paddingBottom: 10, flex: 1, }}>
                    <View style={{ flexDirection: 'row', marginRight: 20, marginLeft: 20, }}>
                        <TouchableOpacity onPress={() => onSelect('PAID')} style={{ flex: 1, }}>

                            <View elevation={5} style={styles.ticketContainer}>

                                <View style={{ borderRadius: 10, }}>
                                    <Avatar
                                        rounded
                                        size="small"
                                        icon={{ name: 'ticket', type: 'entypo', color: '#FFF' }} ß
                                        overlayContainerStyle={{ backgroundColor: '#F7A400', }}
                                        onPress={() => console.log("Works!")}
                                        activeOpacity={0.7}
                                        containerStyle={{ marginLeft: 10, marginTop: 10, marginBottom: 40 }}
                                    />
                                </View>
                                <View style={{ justifyContent: 'center', alignItems: 'center', }}>
                                    <Text style={{ fontSize: 15, textAlign: 'left', marginBottom: 10, fontWeight: '800', color: "#ffffff", }}>Paid Event</Text>
                                    <Text style={{ fontSize: 12, textAlign: 'center', marginBottom: 5, fontWeight: '200', color: "#ffffff", margin: 5 }}>My event is a paid event and the attenders will purchase tickets</Text>
                                </View>
                                <View style={{ height: 1, margin: 20, backgroundColor: '#5f5c7f', }}></View>

                                <Text style={{ fontSize: 12, textAlign: 'center', marginBottom: 16, fontWeight: '200', color: "#ffffff", margin: 5 }}>{'We charge 2% on every \n Ticket sales'}</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => onSelect('DONATION')} style={{ flex: 1, }}>

                            <View elevation={5} style={styles.ticketContainer}>

                                <View style={{ borderRadius: 10, }}>
                                <Avatar
                                        rounded
                                        size="small"
                                        icon={{ name: 'ticket', type: 'entypo', color: '#FFF' }}
                                        overlayContainerStyle={{ backgroundColor: '#3A9EFD', }}
                                        onPress={() => console.log("Works!")}
                                        activeOpacity={0.7}
                                        containerStyle={{ marginLeft: 10, marginTop: 10, marginBottom: 40 }}
                                    />
                                </View>
                                <View style={{ justifyContent: 'center', alignItems: 'center', }}>
                                    <Text style={{ fontSize: 15, textAlign: 'left', marginBottom: 10, fontWeight: '800', color: "#ffffff", }}>Donation</Text>
                                    <Text style={{ fontSize: 12, textAlign: 'center', marginBottom: 5, fontWeight: '200', color: "#ffffff", margin: 5 }}>My event is a fund-raising event and my attenders will have to bid</Text>
                                </View>
                                <View style={{ height: 1, margin: 20, backgroundColor: '#5f5c7f', }}></View>

                                <Text style={{ fontSize: 12, textAlign: 'center', marginBottom: 16, fontWeight: '200', color: "#ffffff", margin: 5 }}>{'See Pricing within \n '}</Text>
                            </View>

                        </TouchableOpacity>




                    </View>
                 
                </View>
            </View>
        )
    }

}

TicketType;

const styles = StyleSheet.create({
    container: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
        position: 'absolute',
        backgroundColor: '#101023',

    },
    nameList: {
        fontSize: 17,
        color: '#ffffff',
        flex: 1,
        marginLeft: 10
    },
    ticketContainer: {
        backgroundColor: '#111124',
        borderRadius: 4,
        margin: 10,
        borderWidth: 1,
        borderColor: '#5f5c7f',
        shadowRadius: 2,
        shadowOffset: {
            height: 10,
            width: 10
        }
    },
    fab: {
        height: 60,
        width: 60,
        borderRadius: 200,
        position: 'absolute',
        bottom: 10,
        right: 20,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    welcome: {
        height: 90,
        alignItems: 'center',
        justifyContent: 'center',
    },
});

