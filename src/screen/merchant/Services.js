
import React, { Component } from 'react';
import { TextInput, StyleSheet, TouchableOpacity, StatusBar, AsyncStorage, Dimensions, ImageBackground, ScrollView } from 'react-native';
import { Container, Content, View, Text, Button, Left, Right, Body, Title, List, ListItem, Thumbnail, Grid, Col, Separator } from 'native-base';
import { Actions } from 'react-native-router-flux';
import { Avatar, Badge, } from 'react-native-elements';
import { Card, Icon, SocialIcon } from 'react-native-elements'
import Carousel, { Pagination, ParallaxImage } from 'react-native-snap-carousel';
import {
    BarIndicator,
} from 'react-native-indicators';
import { AnimatedCircularProgress } from 'react-native-circular-progress';


import color from '../../component/color';
const { width: screenWidth } = Dimensions.get('window')
import Navbar from '../../component/Navbar';
const URL = require("../../component/server");
import Moment from 'moment';

export default class Services extends Component {

    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            datatwo: [],
            data: '',
            nodata: false,
            user: {},
            searchText: '',
            bal: 0
        };
    }




    componentDidMount() {
        AsyncStorage.getItem('data').then((value) => {
            if (value == '') { } else {
                this.setState({ data: JSON.parse(value) })
                this.setState({ user: JSON.parse(value).user })
            }

             this.getEventsRequest()
        })

        AsyncStorage.getItem('bal').then((value) => {
            if (value == '') { } else {
                this.setState({ bal: value })
            }
        })
    }
    currencyFormat(n) {
        return  n.toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
     }

    getEventsRequest() {
        const { data, user } = this.state
        console.warn(user)


        fetch(URL.url + 'merchant/services', {
            method: 'GET', headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'Authorization': 'Bearer ' + data.token,
            }
        })
            .then(res => res.json())
            .then(res => {
                console.warn(res);
                if (res.status) {
                   
                    this.setState({
                        loading: false,
                        datatwo:res.data
                    })
                } else {
                    this.setState({
                        nodate: true,
                        loading: false
                    })
                }
            })
            .catch(error => {
                alert(error.message);
                console.warn(error);
                this.setState({ loading: false })
            });


    };





    render() {

        if (this.state.loading) {
            return (
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#000000' }}>
                    <View style={styles.welcome}>
                        <Text style={{ fontSize: 15, color: '#fff' }}>Fetching all your services</Text>
                        <BarIndicator count={4} color={color.primary_color} />
                        <Text style={{ fontSize: 13, flex: 1, color: '#fff' }}>Please wait...</Text>
                    </View>
                </View>
            );
        }


        var left = (
            <Left style={{ flex: 1 }}>
                <Button transparent onPress={() => Actions.profile()}>
                    <Avatar
                        rounded
                        source={{
                            uri: this.state.user.profilePicture

                        }}
                    />
                </Button>
            </Left>
        );
        var right = (
            <Right>
                <Button transparent>
                    <Icon
                        active
                        name="notifications-active"
                        type='material-icons'
                        color='#FFF'
                    />
                </Button>
            </Right>
        );

        return (
            <Container style={{ backgroundColor: color.secondary_color }}>

                <Navbar left={left} right={right} title="Services" bg='#101023' />
                <Content>
                    <View style={styles.container}>
                        <StatusBar barStyle="dark-content" hidden={false} backgroundColor="transparent" />
                        <View >
                

                            <View style={{ backgroundColor: '#FFF', marginTop: 10, marginLeft: 20, marginRight: 20, opacity: 0.77, height: 0.6 }}></View>
                        </View>
                        <View style={{ flex: 1, marginTop: 1, marginLeft: 20, marginRight: 20, }}>
                            <ScrollView  >

                                {this.renderItem(this.state.datatwo)}

                            </ScrollView>
                        </View>

                    </View>
                </Content>
            </Container>
        );
    }
    getDetails(data){
        if(data.type =='EVENTS'){
            Actions.service_details({ id: data.id })
        }else  if(data.type =='RESTURANTS'){
            Actions.res_service_details({ id: data.id })
        }
    }
    renderItem(tickets) {
      
        let items = [];
        for (let i = 0; i < tickets.length; i++) {
            var filled = (tickets[i].ticketsSold/tickets[i].totalTickets) * 100;
            items.push(
                <TouchableOpacity style={styles.oneRow} onPress={()=> this.getDetails(tickets[i])}>

                    <View style={{ flex: 1, padding: 10 }}>
                        <AnimatedCircularProgress
                            size={100}
                            width={8}
                            fill={filled}
                            tintColor="#139F2A"
                            rotation={0}
                            backgroundColor="#3d5875">
                            {
                                (fill) => (
                                    <View style={{}} >
                                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', }}>
                                        <Text style={{ marginLeft: 2, textAlign: 'left', color: '#fff', fontSize: 13, fontWeight: '500', }}> {tickets[i].ticketsSold}/</Text>
                                        <Text style={{ textAlign: 'left', color: '#fff', fontSize: 10, fontWeight: '100', opacity: 0.59 }}>{tickets[i].totalTickets} </Text>
                                        </View>
                                        <Text style={{ marginLeft: 2, textAlign: 'left', color: '#fff', fontSize: 10, fontWeight: '100', opacity: 0.59 }}> Tickets Sold </Text>
                                    </View>
                                )
                            }
                        </AnimatedCircularProgress>
                    </View>
                    <View style={{ flex: 3, paddingLeft:12, justifyContent: 'center',}}>
                    <View style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'flex-end', marginLeft: 20 }}>
                            <Text style={{ marginLeft: 2, textAlign: 'left', color: '#fff', fontSize: 8, color: tickets[i].color, }}> {tickets[i].type} </Text>
                            <View style={{ height: 8, width: 24, backgroundColor:  tickets[i].color }} />
                        </View>
                        <Text style={styles.title}> {tickets[i].name}</Text>
                        <Text style={{ marginLeft: 2, marginTop:10, textAlign: 'left', color: '#fff', fontSize: 14, fontWeight: '100', }}> ₦{this.currencyFormat(tickets[i].amount) } </Text>


                    </View>

                </TouchableOpacity>
            )

        };
        return items;
    }

}


const styles = StyleSheet.create({
    container: {
        width: Dimensions.get('window').width,
    },
    slider: {
        backgroundColor: '#fff'
    },
    paginationContainer: {
        paddingVertical: 8
    },
    welcome: {
        height: 90,
        alignItems: 'center',
        justifyContent: 'center',
    },
    paginationDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginHorizontal: 4,
        backgroundColor: 'rgba(255, 255, 255, 0.92)'
    },
    titleText: {
        flex: 1,
        fontSize: 19,
        color: '#ffffff',
        marginTop: 10,
        marginBottom: 10,
        marginLeft: 15,
        fontFamily: 'NunitoSans-Bold'
    },
    oneRow: {
        marginTop: 20,
        flexDirection: 'row',
        backgroundColor: '#111124',
        borderLeftWidth: 4,
        paddingBottom: 2,
        borderRadius: 10
    },
    title: {
        marginTop: 1,
        color: '#fff',
        fontSize: 18,
        fontWeight: '600'
    },
    fab: {
        height: 60,
        width: 60,
        borderRadius: 200,
        position: 'absolute',
        bottom: 30,
        right: 20,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F7A400',
    },

});
