
import React, { Component } from 'react';
import { TextInput, StyleSheet, TouchableOpacity, StatusBar, Image, AsyncStorage, Dimensions, ImageBackground } from 'react-native';
import { Container, Content, View, Text, Button, Left, Right, Body, Title, List, ListItem, Thumbnail, Grid, Col, Separator } from 'native-base';
import { Avatar, Badge, } from 'react-native-elements';
import { Card, Icon, SocialIcon } from 'react-native-elements'
import Carousel, { Pagination, ParallaxImage } from 'react-native-snap-carousel';
import {
    BarIndicator,
} from 'react-native-indicators';

import SvgUri from 'react-native-svg-uri';

import color from '../../component/color';
const { width: screenWidth } = Dimensions.get('window')
import Navbar from '../../component/Navbar';
const URL = require("../../component/server");
import Moment from 'moment';

import { getSaveRestaurant, getData } from '../../component/utilities';

export default class Dashboard extends Component {

    constructor(props) {
        super(props);

        this.onEventPress = this.onEventPress.bind(this)
        this.likeUnlikeRequest = this.likeUnlikeRequest.bind(this);

        this.state = {
            loading: true,
            dataone: [
            ],
            datatwo: [
            ],
            data: '',
            nodata: false,
            slider1ActiveSlide: 0,
            selected: null,
            user: { profilePicture: '' },
            searchText: ''
        };
    }



    componentWillUnmount() {
        this._unsubscribe();
    }



    async componentDidMount() {
        this.setState({
            data: JSON.parse(await getData()),
            user: JSON.parse(await getData()).user
        })


        this.getEventsRequest()
        this._unsubscribe = this.props.navigation.addListener('focus', () => {
            this.getEventsRequest()
        });
    }


    getEventsRequest() {
        const { data, user } = this.state
        console.warn(user)
        // 


        fetch(URL.url + 'customer/dashboard', {
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
                    this.setState({
                        dataone: res.data

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

    RgetEventsRequest() {
        const { data } = this.state
        fetch(URL.url + 'events', {
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
                        dataone: res.data.trending,

                        loading: false
                    })
                } else {

                }
            })
            .catch(error => {
                alert(error.message);
                console.warn(error);
            });


    };

    likeUnlikeRequest(id, pos) {
        const { data, } = this.state
        fetch(URL.url + 'events/like/' + id, {
            method: 'GET', headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'Authorization': 'Bearer ' + data.token,
            }
        })
            .then(res => res.json())
            .then(res => {
                if (res.status) {
                    if (pos) {
                        Toast.show({
                            text: 'Event remove from favorite !',
                            position: 'bottom',
                            type: 'success',
                            buttonText: 'Dismiss',
                            duration: 2000
                        });
                    } else {
                        Toast.show({
                            text: 'Event Added to favorite !',
                            position: 'bottom',
                            type: 'success',
                            buttonText: 'Dismiss',
                            duration: 2000
                        });
                    }

                    this.RgetEventsRequest()
                } else {

                }
            })
            .catch(error => {
                alert(error.message);
                console.warn(error);

            });
    };

    getDetails(data){
        if(data.type =='Event'){
            this.props.navigation.navigate('eventD', { id: data.id })
        }else  if(data.type =='Restaurant'){
            this.props.navigation.navigate('restaurantD', { id: data.id })
        }
    }

    _renderItem = ({ item, index }, parallaxProps) => {
        Moment.locale('en');
        return (
            <TouchableOpacity onPress={() => this.getDetails(item)} >
                <ImageBackground
                    opacity={0.5}
                    style={{ borderRadius: 12 }}
                    source={{ uri: item.bannerUrl }}
                    imageStyle={{ borderRadius: 20, backgroundColor: 'blue' }}

                >
                    <View style={styles.details} >
                        <Text style={styles.date}>{Moment(item.startDate).format('llll')}</Text>
                        <Text style={styles.tittle}>{item.title}</Text>
                        <View style={styles.piceContainer}>
                            <View style={{ flex: 1, flexDirection: 'row', marginTop: 3, marginLeft: 15 }}>
                                <View style={{ flex: 1, }}>

                                </View>

                                {item.type == 'Event' ?
                                    <View style={[styles.small_circle, { backgroundColor: '#fff7e7', }]}>
                                        <Image
                                            style={{ resizeMode: 'contain', height: 20, width: 20 }}
                                            source={require('../../assets/icons/events.png')} />

                                    </View>
                                    :
                                   
                                    <View  style={[styles.small_circle, { backgroundColor: '#ffcccd', }]}>

                                    <Image
                                        style={{ resizeMode: 'contain', height: 20, width: 20 }}
                                        source={require('../../assets/icons/restaurant.png')} />
                                   </View>
                                
                                }

                                <View style={{ width: 20 }}>

                                </View>
                            </View>
                        </View>

                    </View>


                </ImageBackground>
            </TouchableOpacity>
        );
    }


    onEventPress(data) {
        this.setState({ selected: data })
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


        const { slider1ActiveSlide } = this.state;
        var left = (
            <Left style={{ flex: 1 }}>
                <Button transparent onPress={() => this.props.navigation.navigate('Manage')}>
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

                <Navbar left={left} right={right} title="Home" bg='#101023' />
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
                                    keyboardType="default"
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    style={styles.menu}
                                    onChangeText={text => this.setState({ searchText: text })}
                                />

                            </View>
                        </View>


                        <View style={styles.header}>

                            <Carousel
                                ref={(c) => { this._carousel = c; }}
                                data={this.state.dataone}
                                renderItem={this._renderItem}
                                sliderWidth={Dimensions.get('window').width}
                                itemWidth={Dimensions.get('window').width / 1.3}
                                onSnapToItem={(index) => this.setState({ slider1ActiveSlide: index })}
                                hasParallaxImages={true}


                            />
                            <Pagination
                                dotsLength={this.state.dataone.length}
                                activeDotIndex={slider1ActiveSlide}
                                containerStyle={styles.paginationContainer}
                                dotStyle={styles.paginationDot}
                                inactiveDotOpacity={0.4}
                                inactiveDotScale={0.6}
                            />
                        </View>

                        <View style={styles.cat}>
                            <Text style={styles.catTitle}>CATEGORIES</Text>
                            <View style={styles.row}>
                                <View style={styles.rowchild}>


                                    <TouchableOpacity onPress={() => this.props.navigation.navigate('events')} style={[styles.circle, { backgroundColor: '#fff7e7', }]}>
                                        <Image
                                            style={{ resizeMode: 'contain', height: 30, width: 30 }}
                                            source={require('../../assets/icons/events.png')} />

                                    </TouchableOpacity>

                                    <Text style={styles.catName}>Events</Text>

                                    <TouchableOpacity style={[styles.circle, { backgroundColor: '#cee7ff', }]}>

                                        <Image
                                            style={{ resizeMode: 'contain', height: 30, width: 30 }}
                                            source={require('../../assets/icons/movies.png')} />
                                    </TouchableOpacity>

                                    <Text style={styles.catName}>Movies</Text>


                                </View>
                                <View style={styles.rowchild}>

                                    <TouchableOpacity style={[styles.circle, { backgroundColor: '#ebd5ff', }]}>

                                        <Image
                                            style={{ resizeMode: 'contain', height: 30, width: 30 }}
                                            source={require('../../assets/icons/club.png')} />
                                    </TouchableOpacity>

                                    <Text style={styles.catName}>Clubs & lounge</Text>

                                    <TouchableOpacity onPress={() => this.props.navigation.navigate('restaurants')} style={[styles.circle, { backgroundColor: '#ffcccd', }]}>

                                        <Image
                                            style={{ resizeMode: 'contain', height: 30, width: 30 }}
                                            source={require('../../assets/icons/restaurant.png')} />
                                    </TouchableOpacity>

                                    <Text style={styles.catName}>Resturants</Text>
                                </View>

                                <View style={styles.rowchild}>

                                    <TouchableOpacity style={[styles.circle, { backgroundColor: '#d3ffdb', }]}>

                                        <Image
                                            style={{ resizeMode: 'contain', height: 30, width: 30 }}
                                            source={require('../../assets/icons/parks.png')} />

                                    </TouchableOpacity>

                                    <Text style={styles.catName}>Parks & plays</Text>

                                    <TouchableOpacity style={[styles.circle, { backgroundColor: '#ffcccd', }]}>
                                        <Image
                                            style={{ resizeMode: 'contain', height: 30, width: 30 }}
                                            source={require('../../assets/icons/club.png')} />
                                    </TouchableOpacity>

                                    <Text style={styles.catName}>My corners</Text>


                                </View>
                            </View>
                        </View>
                    </View>
                </Content>
            </Container>
        );
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
    item: {
        flexDirection: 'row',
        margin: 15,
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
    details: {
        marginTop: 100,
        marginBottom: 25,
    },
    date: {
        marginRight: 13,
        marginLeft: 13,
        fontSize: 12,
        color: '#ffffff',
        textAlign: 'left',
        fontFamily: 'NunitoSans-Bold'
    },
    tittle: {
        marginRight: 13,
        marginLeft: 13,
        fontSize: 16,
        color: '#ffffff',
        textAlign: 'left',
        fontWeight: '600',
        fontFamily: 'NunitoSans-Bold'
    },
    price: {

        marginRight: 13,
        marginLeft: 13,
        fontSize: 10,
        color: '#ffffff',
        textAlign: 'left',
        fontFamily: 'NunitoSans-Bold'
    },
    piceContainer: {
        flexDirection: 'row'
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
    },
    circle: {
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 20,
        paddingBottom: 20,
        borderRadius: 40
    },
    small_circle: {
        height: 35,
        width: 35,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center'
    },
    catName: {
        marginRight: 13,
        marginLeft: 13,
        fontSize: 12,
        paddingTop: 20,
        paddingBottom: 20,
        color: '#ffffff',
        textAlign: 'left',
        fontFamily: 'NunitoSans-Bold'
    },
    calendar: {
        height: 400
    },
    list: {
        flex: 1,
        marginTop: 20,
        paddingTop: 5
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold'
    },
    descriptionContainer: {
        flexDirection: 'row',
        paddingRight: 50
    },
    image: {
        width: 50,
        height: 50,
        borderRadius: 25
    },
    textDescription: {
        marginLeft: 10,
        color: 'gray'
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
});
