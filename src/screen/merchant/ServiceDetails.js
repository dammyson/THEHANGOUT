
import React, { Component } from 'react';
import { TextInput, StyleSheet, TouchableOpacity, StatusBar, Alert, Dimensions, ImageBackground, ScrollView } from 'react-native';
import { Container, Content, View, Text, Button, Left, Right, Body, Title, List, ListItem, Thumbnail, Grid, Col, Separator } from 'native-base';
import { Avatar, Badge, } from 'react-native-elements';
import { Card, Icon, SocialIcon } from 'react-native-elements'
import Carousel, { Pagination, ParallaxImage } from 'react-native-snap-carousel';
import {
    BarIndicator,
} from 'react-native-indicators';
import { getBalance, getData } from '../../component/utilities';


import color from '../../component/color';
const { width: screenWidth } = Dimensions.get('window')
import Navbar from '../../component/Navbar';
const URL = require("../../component/server");
import Moment from 'moment';
import Balance from '../../component/views/Balance';

export default class ServiceDetails extends Component {

    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            data: '',
            agent_list: [],
            nodata: false,
            slider1ActiveSlide: 0,
            selected: null,
            user: {},
            details: {},
            bal: 0,
            id: '',
        };
    }






    componentWillUnmount() {
        this._unsubscribe();
    }



    async componentDidMount() {
        const { id } = this.props.route.params;
        
        this.setState({ id: id });
        this.setState({
            data: JSON.parse(await getData()),
            user: JSON.parse(await getData()).user,
            bal: await getBalance()
        })



        this.getEventsRequest()
        this._unsubscribe = this.props.navigation.addListener('focus', () => {
            this.getEventsRequest()
        });
    }


    currencyFormat(n) {
        return n.toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
    }

    getEventsRequest() {
        const { data, user, id } = this.state
        console.warn(user)


        fetch(URL.url + 'merchant/dashboard/' + id + '/Event', {
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
                        details: res.data,
                        loading: false,
                        agent_list: res.data.agentList,
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

    deleteAgent(data) {
        console.warn(data)
        Alert.alert(
            'Delete Agent',
            'Are you sure you want to delete ' + data.agentName + ' from your list of agents',
            [
                { text: 'Cancel', onPress: () => console.log('Cancel Pressed!') },
                { text: 'OK', onPress: () => this.processDeleteAgent(data.agentId) },
            ],
            { cancelable: false }
        )
        return

    }

    processDeleteAgent(i) {
        console.warn(i)
        const { data } = this.state
        this.setState({
            loading: true,
        })

        fetch(URL.url + 'agent/' + i, {
            method: 'DELETE', headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'Authorization': 'Bearer ' + data.token,
            }
        })
            .then(res => res.json())
            .then(res => {
                console.warn(res);
                this.setState({ loading: false })
                if (res.status) {
                    Alert.alert('Process Successfull', "Agent Deleted", [{ text: 'Okay' }])
                    this.getEventsRequest()
                } else {
                    Alert.alert('Process Failed', "Agent not Deleted", [{ text: 'Okay' }])
                }
            })
            .catch(error => {
                this.setState({ loading: false })
                alert(error.message);
                console.warn(error);

            });


    }

    onStopTickerSales(){
        const { details, data } = this.state
        this.setState({
            loading: true,
        })

        fetch(URL.url + 'events/stop?eventId='+details.id+'&isStop=false', {
            method: 'GET', headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'Authorization': 'Bearer ' + data.token,
            }
        })
            .then(res => res.json())
            .then(res => {
                console.warn(res);
                this.setState({ loading: false })
                if (res.status) {
                    Alert.alert(
                        'Process Successfull',
                        'Event was stoped, click ok to go back',
                        [
                            { text: 'Cancel', onPress: () => console.warn('no action')},
                            { text: 'OK', onPress: () => this.goBack() },
                        ],
                        { cancelable: false }
                    )
                } else {
                    Alert.alert('Process Failed', "Event was not stoped", [{ text: 'Okay' }])
                }
            })
            .catch(error => {
                this.setState({ loading: false })
                alert(error.message);
                console.warn(error);

            });

    }

    goBack() {
        const { goBack } = this.props.navigation;
        goBack(null)
    }


    render() {


        if (this.state.loading) {
            return (
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#000000' }}>
                    <View style={styles.welcome}>
                        <Text style={{ fontSize: 15, color: '#fff' }}>Fetching all your goodies</Text>
                        <BarIndicator count={4} color={color.primary_color} />
                        <Text style={{ fontSize: 13, flex: 1, color: '#fff' }}>Please wait...</Text>
                    </View>
                </View>
            );
        }


        const { details } = this.state
        var left = (
            <Left style={{ flex: 1 }}>
                <Button transparent onPress={() => this.goBack()}>
                    <Icon
                        active
                        name="ios-arrow-back"
                        type='ionicon'
                        color='#FFF'
                    />
                </Button>
            </Left>
        );
        var right = (
            <Right>
                <Button transparent>
                    <Icon
                        active
                        name="dots-three-vertical"
                        type='entypo'
                        color='#FFF'
                    />
                </Button>
            </Right>
        );

        return (
            <Container style={{ backgroundColor: color.secondary_color }}>

                <Navbar left={left} right={right} title={details.title} bg='#101023' />
                <Content>
                    <View style={styles.container}>
                        <StatusBar barStyle="dark-content" hidden={false} backgroundColor="transparent" />
                        <View >
                            <Balance
                                OnButtonPress={() => this.props.navigation.navigate('withdraw')}
                                buttonColor={'#139F2A'}
                                textColor={'#fff'}
                                buttonText={'Withdraw Funds'}
                                textColor={'#fff'}
                                balTextColor={'#000'}
                                commentTextColor={'#000'}
                                backgroundColor={'#fff'}
                            />
                            <View style={{ backgroundColor: '#FFF', marginTop: 10, marginLeft: 20, marginRight: 20, opacity: 0.77, height: 0.6 }}></View>
                            <View style={{ marginLeft: 25, marginRight: 7, marginTop: 10, alignItems: 'flex-start' }}>
                                <View style={{flexDirection:'row'}}>
                                    <Text style={[styles.titleText,{flex:1}]}>DASHBOARD</Text>
                                    <TouchableOpacity  onPress={() => this.props.navigation.navigate('scan_tickets')}>
                                    <Text style={[styles.titleText,{color: 'red', marginRight:10, fontSize:15}]}>Scan Tickets</Text>
                                    </TouchableOpacity>
                                   
                                </View>
                                <View style={{}}>
                                    <Text style={{ marginLeft: 2, color: '#F7A400', fontSize: 10, fontWeight: '500' }}> {details.organizerName}</Text>
                                    <Text style={{ marginLeft: 2, color: '#fff', fontSize: 12, fontWeight: '200', opacity: 0.6, }}> See your summary </Text>
                                </View>
                            </View>
                        </View>
                        <View style={styles.main_content}>
                            <View style={{ flexDirection: 'row', marginTop: 20, marginLeft: 10, marginRight: 15 }}>
                                <View style={{ flex: 1.4, }}>
                                    <Text style={{ marginLeft: 2, color: '#fff', fontSize: 12, fontWeight: '200', opacity: 0.67, }}>Gross Sale </Text>
                                    <Text style={{ color: '#fff', fontSize: 24, fontWeight: '200', fontFamily: 'NunitoSans-Bold', marginTop: 10 }}>₦{this.currencyFormat(details.dashboard.grossSale)}</Text>

                                    <Text style={{ marginLeft: 2, color: '#fff', fontSize: 10, fontWeight: '200', opacity: 0.67, marginTop: 35 }}>Your Money </Text>
                                    <Text style={{ color: '#fff', fontSize: 16, fontWeight: '200', fontFamily: 'NunitoSans-Bold', marginTop: 10 }}>₦{this.currencyFormat(details.dashboard.amount)}</Text>
                                </View>
                                <View style={{ flex: 1, borderLeftWidth: 1, paddingLeft: 10, borderLeftColor: '#808080' }}>

                                    <Text style={{ marginLeft: 2, color: '#fff', fontSize: 12, fontWeight: '200', opacity: 0.67, }}>Tickets Sold (pcs) </Text>
                                    <Text style={{ color: '#fff', fontSize: 24, fontWeight: '200', fontFamily: 'NunitoSans-Bold', marginTop: 10 }}>{details.dashboard.ticketsSold}</Text>

                                    <Text style={{ marginLeft: 2, color: '#fff', fontSize: 10, fontWeight: '200', opacity: 0.67, marginTop: 35 }}>Tickets Left </Text>
                                    <Text style={{ color: '#fff', fontSize: 16, fontWeight: '200', fontFamily: 'NunitoSans-Bold', marginTop: 10 }}>{details.dashboard.ticketsLeft}</Text>
                                </View>
                            </View>
                            <View style={{ flexDirection: 'row', marginLeft: 10, marginRight: 15, justifyContent: 'center' }}>
                                <TouchableOpacity onPress={()=> this.onStopTickerSales()} style={{ margin: 30, alignItems: 'center', borderRadius: 7, borderWidth: 1, borderColor: 'red' }}>
                                    <Text style={{ fontSize: 15, margin: 10, fontWeight: '300', color: 'red' }}>Stop Event</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        {this.state.agent_list.length ?
                            <View style={{ marginLeft: 25, marginRight: 7, marginTop: 10, alignItems: 'flex-start' }}>
                                <Text style={styles.titleText}>AGENTS</Text>
                            </View>
                            : null}
                        <View style={styles.agent_content}>

                            <ScrollView  >

                                {this.renderItem(this.state.agent_list)}

                            </ScrollView>
                        </View>

                    </View>
                </Content>
                <View style={styles.fab} onPress={() => this.props.navigation.navigate('createRestaurant')}>

                    <View style={{ flexDirection: 'row', flex: 1 }}>
                        <TouchableOpacity onPress={() => this.props.navigation.navigate('agent_create')} style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                            <Icon
                                active
                                name="pluscircleo"
                                type='antdesign'
                                color='#DD352E'
                                size={25}
                            />
                            <Text style={{ fontSize: 12, margin: 10, fontWeight: '300', color: '#1E1E1E' }}>New Agent</Text>
                        </TouchableOpacity>
                        <View style={{ width: 0.6, marginTop: 3, marginBottom: 3, backgroundColor: 'rgba(128,128,128,0.4)' }} ></View>
                        <TouchableOpacity onPress={() => this.props.navigation.navigate('agent_pay')} style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                            <Icon
                                active
                                name="ios-wallet"
                                type='ionicon'
                                color='#139F2A'
                                size={25}
                            />
                            <Text style={{ fontSize: 12, margin: 10, fontWeight: '300', color: '#1E1E1E' }}>Pay Agents</Text>
                        </TouchableOpacity>
                    </View>
                </View>

            </Container>
        );
    }

    renderItem(tickets) {

        let items = [];
        for (let i = 0; i < tickets.length; i++) {
            let r = i;

            items.push(
                <TouchableOpacity style={styles.oneRow}>

                    <View style={{ flex: 1, padding: 10 }}>
                        <Avatar
                            size="large"
                            source={{
                                uri: tickets[i].imageUrl

                            }}
                        />
                    </View>
                    <View style={{ flex: 3, paddingLeft: 12, justifyContent: 'center', }}>
                        <View style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'flex-end', marginLeft: 20 }}>
                            <Text style={{ marginLeft: 2, textAlign: 'left', color: '#fff', fontSize: 8, color: '#139F2A', }}> active </Text>
                            <View style={{ height: 8, width: 24, backgroundColor: '#139F2A' }} />

                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'flex-end', marginLeft: 20 }}>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.title}>{tickets[i].agentName}</Text>
                                <Text style={{ marginLeft: 2, marginTop: 10, textAlign: 'left', color: '#1E1E1E', fontSize: 14, fontWeight: '100', }}> {tickets[i].agentAmount} </Text>
                                <Text style={{ marginLeft: 2, marginTop: 5, textAlign: 'left', color: 'gba(30,30,30,0.7)', fontSize: 14, fontWeight: '100', }}> Sales so far </Text>
                            </View>
                            <TouchableOpacity onPress={() => this.deleteAgent(tickets[r])} style={{ width: 30 }}>
                                <Icon
                                    active
                                    name="delete"
                                    type='materia-community'
                                    color='#EA3C1780'
                                />
                            </TouchableOpacity>
                        </View>

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
        fontSize: 19,
        color: '#ffffff',
        marginTop: 10,
        marginBottom: 10,
        fontFamily: 'NunitoSans-Bold'
    },
    main_content: {
        marginTop: 20,
        marginRight: 20,
        marginLeft: 20,
        paddingLeft: 10,
        paddingRight: 10,
        backgroundColor: '#101023',

    },
    agent_content: {
        marginTop: 20,
        paddingLeft: 10,
        paddingRight: 10,
        backgroundColor: '#fff',
        borderRadius: 20

    },
    fab: {
        height: 45,
        width: Dimensions.get('window').width - 100,
        borderRadius: 200,
        position: 'absolute',
        bottom: 20,
        right: 50,
        backgroundColor: '#fff',
        elevation: 5
    },
    oneRow: {
        marginTop: 20,
        flexDirection: 'row',
        backgroundColor: '#F2F1FF',
        borderLeftWidth: 4,
        paddingBottom: 2,
        borderRadius: 10,
        marginBottom: 20,
    },
    title: {
        marginTop: 1,
        color: '#1E1E1E',
        fontSize: 14,
        fontWeight: '600'
    },

});
