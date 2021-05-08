
import React, { Component } from 'react';
import { TextInput, StyleSheet, TouchableOpacity, StatusBar, AsyncStorage, Dimensions, Image, ScrollView } from 'react-native';
import { Container, Content, View, Text, Button, Left, Right, Toast, Title, List, ListItem, Thumbnail, Grid, Col, Separator } from 'native-base';
import { Avatar, Badge, } from 'react-native-elements';
import { Card, Icon, SocialIcon } from 'react-native-elements'
import Carousel, { Pagination, ParallaxImage } from 'react-native-snap-carousel';
import {
    BarIndicator,
} from 'react-native-indicators';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import Modal, { SlideAnimation, ModalContent } from 'react-native-modals';

import color from '../../component/color';
const { width: screenWidth } = Dimensions.get('window')
import Navbar from '../../component/Navbar';
const URL = require("../../component/server");
import Moment from 'moment';
import Balance from '../../component/views/Balance';

export default class MerchantDashboard extends Component {

    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            dataone: [],
            datatwo: [],
            data: '',
            nodata: false,
            slider1ActiveSlide: 0,
            selected: null,
            user: {},
            searchText: '',
            bal: 0,
            view_create: false
        };
    }




    componentDidMount() {
        console.warn('res');
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
        return n.toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
    }

    getEventsRequest() {
        const { data, user } = this.state
        console.warn(data.token)


        fetch(URL.url + 'merchant/dashboard', {
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
                        bal: this.currencyFormat(res.data.balance),
                        datatwo: res.data.items
                    })
                    AsyncStorage.setItem('bal', this.currencyFormat(res.data.balance));

                } else {
                    this.setState({
                        nodata: true,
                        loading: false
                    })
                }
            })
            .catch(error => {
                alert(error.message);
                console.warn(error);
                this.setState({ loading: false, nodata: true, })
            });


    };





    render() {

        if (this.state.loading) {
            return (
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#000000' }}>
                     <StatusBar translucent barStyle="light-content" hidden={false} backgroundColor="#000000" />
                    <View style={styles.welcome}>
                        <Text style={{ fontSize: 15, color: '#fff' }}>Fetching all your goodies</Text>
                        <BarIndicator count={4} color={color.primary_color} />
                        <Text style={{ fontSize: 13, flex: 1, color: '#fff' }}>Please wait...</Text>
                    </View>
                </View>
            );
        }


        var left = (
            <Left style={{ flex: 1 }}>
                <Button transparent onPress={()=> this.props.navigation.navigate('profile') }>
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
  <StatusBar translucent barStyle="light-content" hidden={false} backgroundColor="#101023" />
                <Navbar left={left} right={right} title="Home" bg='#101023' />
                <Content>
                    {!this.state.nodata ?
                        <View style={styles.container}>
                          
                            <View >

                                <Balance 
                                OnButtonPress={()=> this.props.navigation.navigate('withdraw')} 
                                buttonColor={'#139F2A'} 
                                textColor={'#fff'}
                                buttonText={'Withdraw Funds'}
                                textColor={'#fff'}
                                balTextColor={'#000'}
                                commentTextColor={'#000'}
                                backgroundColor={'#fff'}
                                />

                                <View style={{ backgroundColor: '#FFF', marginTop: 10, marginLeft: 20, marginRight: 20, opacity: 0.77, height: 0.6 }}></View>
                                <View style={{ marginLeft: 10, marginRight: 7, marginTop: 10, flexDirection: 'row', alignItems: 'center' }}>
                                    <Text style={styles.titleText}>RUNNING SERVICES</Text>
                                    <TouchableOpacity onPress={() => this.props.navigation.navigate('services')} style={{ marginLeft: 10, marginRight: 20, flexDirection: 'row', alignItems: 'center' }}>
                                        <Text style={{ fontSize: 12, color: '#188EFF', }}>View All </Text>
                                        <Icon
                                            active
                                            name="ios-arrow-forward"
                                            type='ionicon'
                                            color='#188EFF'
                                        /></TouchableOpacity>
                                </View>
                            </View>
                            <View style={{ flex: 1, marginTop: 1, marginLeft: 20, marginRight: 20, }}>
                                <ScrollView  >

                                    {this.renderItem(this.state.datatwo)}

                                </ScrollView>
                            </View>

                        </View>
                        :
                        <View style={{
                            width: Dimensions.get('window').width,
                            height: Dimensions.get('window').height, alignItems: 'center', justifyContent: 'center', backgroundColor: '#000'
                        }}>
                            <View style={styles.welcome}>
                                <Image
                                    style={styles.logo}
                                    source={require('../../assets/empty.png')} />
                                <Text style={{ fontSize: 15, color: '#fff' }}>No data at the moment </Text>

                            </View>
                        </View>
                    }

                </Content>
                <TouchableOpacity style={styles.fab} onPress={() => this.setState({ view_create: true })}>
                    <Icon
                        active
                        name="plus"
                        type='entypo'
                        color='#000'
                        size={25}
                    />
                </TouchableOpacity>

                <Modal
                    visible={this.state.view_create}
                    modalAnimation={new SlideAnimation({
                        slideFrom: 'right',
                    })}
                    rounded={false}
                >
                    <ModalContent style={styles.modal}>
                        <View style={{ flex: 1 }}>

                            <View style={{ flexDirection: 'row', alignItems: 'center', paddingTop: 1, paddingBottom: 10 }}>
                                <Text style={{ fontFamily: 'NunitoSans-Black', color: '#fff', fontSize: 15, textAlign: 'left', paddingBottom: 10, marginTop: 1, flex: 1 }}> Choose Service Type </Text>
                                <TouchableOpacity onPress={() => this.setState({ view_create: false })} style={{ marginLeft: 10, height:30, width:20, backgroundColor: '#000' }}>
                                    <Icon
                                        name="close"
                                        size={20}
                                        type='antdesign'
                                        color="red"
                                    />
                                </TouchableOpacity>
                            </View>
                            <View style={{ paddingTop: 1, marginTop: 15, paddingBottom: 10, flex: 1, }}>
                                <View style={{ flexDirection: 'row', marginRight: 20, marginLeft: 20, }}>
                                    <View style={styles.rowchild}>
                                        <TouchableOpacity onPress={() => [this.setState({ view_create: false }), this.goTopage('createevent')]} style={[styles.circle, { backgroundColor: '#fff7e7', }]}>
                                        <Image
                                            style={{ resizeMode: 'contain', height: 30, width: 30 }}
                                            source={require('../../assets/icons/events.png')} />
                                        </TouchableOpacity>
                                        <Text style={styles.catName}> Events</Text>
                                    </View>
                                    <View style={styles.rowchild}>
                                        <TouchableOpacity onPress={() => [this.setState({ view_create: false }), this.goTopage('createRestaurant')]} style={[styles.circle, { backgroundColor: '#cee7ff', }]}>
                                          
                                        <Image
                                            style={{ resizeMode: 'contain', height: 30, width: 30 }}
                                            source={require('../../assets/icons/restaurant.png')} />
                                        </TouchableOpacity>

                                        <Text style={styles.catName}>Food</Text>
                                    </View>


                                    <View style={styles.rowchild}>
                                        <TouchableOpacity onPress={() => [this.setState({ view_create: false }), this.goTopage('createClub')]} style={[styles.circle, { backgroundColor: '#cee7ff', }]}>
                                        <Image
                                            style={{ resizeMode: 'contain', height: 30, width: 30 }}
                                            source={require('../../assets/icons/club.png')} />
                                        </TouchableOpacity>

                                        <Text style={styles.catName}>Clubs</Text>


                                    </View>



                                </View>

                            </View>
                        </View>
                    </ModalContent>
                </Modal>

            </Container>
        );
    }

    goTopage(data){

        this.setState({ view_create: false })
        this.props.navigation.navigate(data)
      /*  if(data == 'createevent'){
            this.props.navigation.navigate(data)
        }else{
            Toast.show({
                text: 'This feature is not available at the moment !',
                position: 'top',
                type: 'success',
                buttonText: 'Dismiss',
                duration: 3000
            });
          
        }*/
       
    }
getDetails(data){
    if(data.type =='EVENTS'){
        this.props.navigation.navigate('service_details', { id: data.id })
    }else  if(data.type =='RESTURANTS'){
        this.props.navigation.navigate('res_service_details', { id: data.id })
    }else if(data.type =='CLUBS'){
        this.props.navigation.navigate('club_service_details', { id: data.id })
    }
}
    renderItem(tickets) {

        let items = [];
        for (let i = 0; i < tickets.length; i++) {
            var filled = (tickets[i].ticketsSold / tickets[i].totalTickets) * 100;
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
                    <View style={{ flex: 3, paddingLeft: 12, justifyContent: 'center', }}>
                        <View style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'flex-end', marginLeft: 20 }}>
                            <Text style={{ marginLeft: 2, textAlign: 'left', color: '#fff', fontSize: 8, color: tickets[i].color, }}> {tickets[i].type} </Text>
                            <View style={{ height: 8, width: 24, backgroundColor: tickets[i].color }} />
                        </View>
                        <Text style={styles.title}> {tickets[i].name}</Text>
                        <Text style={{ marginLeft: 2, marginTop: 10, textAlign: 'left', color: '#fff', fontSize: 14, fontWeight: '100', }}> ₦{this.currencyFormat(tickets[i].amount)} </Text>
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
        height: Dimensions.get('window').height,
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
        fontSize: 16,
        fontFamily: 'NunitoSans-Bold'
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
    modal: {
        width: Dimensions.get('window').width,
        height: 170,
        justifyContent: 'flex-end',
        margin: 0,
        backgroundColor: "#010113"

    },
    catTitle: {
        marginRight: 13,
        marginLeft: 13,
        fontSize: 18,
        color: '#ffffff',
        textAlign: 'left',
        fontWeight: '600',
        fontFamily: 'NunitoSans-Bold'
    },
    row: {
        flex: 1,
        flexDirection: "row",
        marginTop: 20,

    },
    rowchild: {
        flex: 1,
        margin: 5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    circle: {
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 20,
        paddingBottom: 20,
        borderRadius: 40
    },
    catName: {
        marginRight: 13,
        marginLeft: 13,
        fontSize: 12,
        paddingTop: 5,
        paddingBottom: 20,
        color: '#ffffff',
        textAlign: 'left',
        fontFamily: 'NunitoSans-Bold'
    },

});
