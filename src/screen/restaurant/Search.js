
import React, { Component } from 'react';
import { TextInput, StyleSheet, ScrollView, TouchableOpacity, Image, AsyncStorage, Dimensions, StatusBar } from 'react-native';
import { Container, Content, View, Text, Button, Left, Right, Toast, Title, List, ListItem, Thumbnail, Grid, Col, Separator } from 'native-base';
import { Avatar, Badge, } from 'react-native-elements';
import { Card, Icon, SocialIcon } from 'react-native-elements'
import Carousel, { Pagination, ParallaxImage } from 'react-native-snap-carousel';
const URL = require("../../component/server");

import color from '../../component/color';
const { width: screenWidth } = Dimensions.get('window')
import Navbar from '../../component/Navbar';
import {
    BarIndicator,
} from 'react-native-indicators';

import Moment from 'moment';

export default class Search extends Component {

    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            searchResult: [
            ],
            searchText: '',
            data: '',
            nodata: false,
            slider1ActiveSlide: 0,
            selected: null, 
            user:{profilePicture:'jjjjjjj'},
        };
    }




    componentDidMount() {
        AsyncStorage.getItem('data').then((value) => {
            if (value == '') { } else {
                this.setState({ data: JSON.parse(value) })
                this.setState({ user: JSON.parse(value).user })
            }

        })
    }


    search() {
        const { data, user, searchText } = this.state
        

        this.setState({
            loading: true
        })
        fetch(URL.url + 'restaurants/search?Location='+ searchText, {
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
                        searchResult: res.data,
                        loading: false
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

   


    onEventPress(data) {
        this.setState({ selected: data })
    }
    render() {


        if (this.state.loading) {
            return (
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#000000' }}>
                    <View style={styles.welcome}>
                        <Text style={{ fontSize: 15, color: '#fff' }}>Fetching all restaurants</Text>
                        <BarIndicator count={4} color={color.primary_color} />
                        <Text style={{ fontSize: 13, flex: 1, color: '#fff' }}>Please wait...</Text>
                    </View>
                </View>
            );
        }

        if (this.state.nodata) {
            return (
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#000000' }}>
                    <View style={styles.welcome}>
                        <Text style={{ fontSize: 15, color: '#fff' }}>No restaurant at the moment </Text>

                    </View>
                </View>
            );
        }
        if (this.state.nodata) {
            return (
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#000000' }}>
                    <View style={styles.welcome}>
                        <Text style={{ fontSize: 15, color: '#fff' }}>No restaurant at the moment </Text>

                    </View>
                </View>
            );
        }

        var left = (
            <Left style={{ flex: 1 }}>
                <Button transparent onPress={() => this.props.navigation.goBack()}>
                    <Avatar
                        rounded
                        source={{
                             uri:this.state.user.profilePicture,
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
               
                <Navbar left={left} right={right} title="Search" bg='#101023' />
                <Content>
                    <View style={styles.container}>
                    <StatusBar barStyle="dark-content" hidden={false} backgroundColor="transparent" />
                        <View style={styles.header}>
                            <View style={styles.item}>
                                <Icon active name="enviroment" type='antdesign' color='red'
                                />
                                <TextInput
                                    placeholder="Location"
                                    placeholderTextColor='#fff'
                                    returnKeyType="next"
                                    onSubmitEditing={() => this.search()}
                                    keyboardType="default"
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    style={styles.menu}
                                    onChangeText={text => this.setState({ searchText: text })}
                                />
                                        <TouchableOpacity onPress={() => this.search()} style={{ height: 30, width: 30, justifyContent: 'center', alignItems: 'center', backgroundColor: '#DD352E' }}>
                                                    <Icon active name="search" type='feather' color='#fff' />
                                                </TouchableOpacity>

                            </View>

                        </View>


                        {this.renderItem(this.state.searchResult)}
                       
                    </View>
                </Content>
               
            </Container>
        );
    }

    renderItem(tickets) {
        Moment.locale('en');

        let items = [];
        for (let i = 0; i < tickets.length; i++) {
            items.push(
                <TouchableOpacity onPress={() => this.props.navigation.navigate('restaurantD',{id: tickets[i].id})} style={styles.oneRow}>
                    <View style={{ marginRight: 20 , marginLeft:20}}>
            <Text style={styles.title}> {tickets[i].name}     {tickets[i].id}</Text>
                        <Text style={{ marginLeft: 2, textAlign: 'left', color: '#fff', fontSize: 12, fontWeight: '100', marginRight: 40, opacity: 0.59 }}> {tickets[i].description} </Text>
                       
                        <View style={{  backgroundColor: '#111123', marginTop: 10, opacity: 0.5 }}>
                            <View style={{  flexDirection: 'row',}}>
                                <Icon
                                    active
                                    name="source-commit-start-next-local"
                                    type='material-community'
                                    color='#FFF'
                                    size={16}
                                />
                                <Text style={{ marginLeft: 2, color: '#fff', fontSize: 13, fontWeight: '100' }}>{tickets[i].location} </Text>
                            </View>

                            <View style={{  flexDirection: 'row' }}>
                                <Icon
                                    active
                                    name="update"
                                    type='material-community'
                                    color='#FFF'
                                    size={16}
                                />
                                <Text style={{ marginLeft: 2, color: '#fff', fontSize: 13, fontWeight: '100' }}>{Moment(tickets[i].startDate).format('llll')} </Text>
                            </View>

                        </View>
                        <View style={{backgroundColor: '#111123', flexDirection: 'row', marginTop: 15, opacity: 0.5 }}>
                            <View style={{flexDirection: 'row', marginRight: 15 }}>
                                <Icon
                                    active
                                    name="timer-sand"
                                    type='material-community'
                                    color='#FFF'
                                    size={16}
                                />
                                <Text style={{ marginLeft: 2, color: '#fff', fontSize: 13, fontWeight: '100' }}>{tickets[i].category} </Text>
                            </View>

                            <View style={{justifyContent: 'center', flexDirection: 'row' }}>
                                <Icon
                                    active
                                    name="ticket"
                                    type='font-awesome'
                                    color='#FFF'
                                    size={16}
                                />
                                <Text style={{ marginLeft: 2, color: '#fff', fontSize: 13, fontWeight: '100' }}> {tickets[i].type} </Text>
                            </View>

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
    paginationDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginHorizontal: 4,
        backgroundColor: 'rgba(255, 255, 255, 0.92)'
    },
    welcome: {
        height: 90,
        alignItems: 'center',
        justifyContent: 'center',
    },
    item: {
        flexDirection: 'row',
        marginLeft: 15,
        borderColor: 'red',
        borderBottomWidth: 2,
        alignItems: 'center',
        paddingRight: 15
    },
    menu: {
        flex: 1,
        marginRight: 13,
        marginLeft: 13,
        fontSize: 20,
        color: '#ffffff',
        textAlign: 'left',
        fontFamily: 'NunitoSans-Bold'
    },
  

  
    list: {
        flex: 1,
        marginTop: 20,
        paddingTop: 5
    },
    oneRow: {
        marginTop: 20,
        flexDirection: 'row',
        backgroundColor: '#111124',
        borderLeftWidth: 4,
        paddingBottom: 15,
        marginRight: 20,
        marginLeft: 20,
    },
    title: {
        marginTop: 16,
        color: '#fff',
        fontSize: 16,
        fontWeight: '600'
    },
   
    image: {
        width: 50,
        height: 50,
        borderRadius: 25
    },
   
   
});
