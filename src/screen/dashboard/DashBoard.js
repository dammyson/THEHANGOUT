
import React, { Component } from 'react';
import { TextInput, StyleSheet, TouchableOpacity, StatusBar, AsyncStorage, Dimensions, ImageBackground } from 'react-native';
import { Container, Content, View, Text, Button, Left, Right, Body, Title, List, ListItem, Thumbnail, Grid, Col, Separator } from 'native-base';
import { Avatar, Badge, } from 'react-native-elements';
import { Card, Icon, SocialIcon } from 'react-native-elements'
import Carousel, { Pagination, ParallaxImage } from 'react-native-snap-carousel';
import {
    BarIndicator,
} from 'react-native-indicators';

import color from '../../component/color';
const { width: screenWidth } = Dimensions.get('window')
import Navbar from '../../component/Navbar';
const URL = require("../../component/server");
import Moment from 'moment';

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
            user:null,
            searchText:''
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
    }


    getEventsRequest() {
        const { data, user } = this.state
        console.warn(user)


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

    likeUnlikeRequest(id, pos){
        const { data,} = this.state
        fetch(URL.url + 'events/like/'+ id, {
            method: 'GET', headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'Authorization': 'Bearer ' + data.token,
            }
        })
            .then(res => res.json())
            .then(res => {
                if (res.status) {
                    if(pos){
                        Toast.show({
                            text: 'Event remove from favorite !',
                            position: 'bottom',
                            type: 'success',
                            buttonText: 'Dismiss',
                            duration: 2000
                        });
                    }else{
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



    _renderItem = ({ item, index }, parallaxProps)  =>{
        Moment.locale('en');
        return (
            <TouchableOpacity onPress={() =>   this.props.navigation.naviagete('eventD', { id: item.id })} >
                <ImageBackground
                    opacity={0.5}
                    style={{ borderRadius: 12 }}
                    source={{ uri: item.banner }}
                    imageStyle={{ borderRadius: 20, backgroundColor: 'blue' }}

                >


                    <View style={styles.details} >
                        <Text style={styles.date}>{Moment(item.startDate).format('llll')}</Text>
                        <Text style={styles.tittle}>{item.title}</Text>
                        <View style={styles.piceContainer}>
                            <View style={{ flex: 1, flexDirection: 'row', marginTop: 3, marginLeft: 15 }}>
                                <Icon
                                    active
                                    name="ticket"
                                    type='entypo'
                                    color='#fff'
                                    size={15}
                                />
                                <Text style={styles.price}>{item.type}</Text>
                                <Icon
                                    active
                                    name="music"
                                    type='foundation'
                                    color='#fff'
                                    size={15}
                                />
                                <Text style={styles.price}>{item.category}</Text>
                            </View>

                            <View style={[styles.iconContainer, { marginRight: 15 }]}>

                                {item.isLike ? 
                                 <TouchableOpacity onPress={()=> this.likeUnlikeRequest(item.id, item.isLike) }>

                                 <Icon
                                     active
                                     name="heart"
                                     type='antdesign'
                                     color='red'
                                     size={15}
                                 />
                             </TouchableOpacity>
                                
                                : 
                                
                                <TouchableOpacity onPress={()=> this.likeUnlikeRequest(item.id , item.isLike) }>

                                <Icon
                                    active
                                    name="hearto"
                                    type='antdesign'
                                    color='red'
                                    size={15}
                                />
                            </TouchableOpacity>
                                
                                }
                               
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
                <Text style={{ fontSize:15, color: '#fff'}}>Fetching all your goodies</Text>
                <BarIndicator count={4} color={color.primary_color} />
                <Text style={{fontSize:13,  flex: 1, color: '#fff'}}>Please wait...</Text>
                </View>
                </View>
           );
        }


        const { slider1ActiveSlide } = this.state;
        var left = (
            <Left style={{ flex: 1 }}>
                <Button transparent onPress={() =>  this.props.navigation.naviagete('profile')}>
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

                                    <TouchableOpacity onPress={() =>  this.props.navigation.navigate('events')} style={[styles.circle, { backgroundColor: '#fff7e7', }]}>

                                        <Icon
                                            active
                                            name="calendar-clock"
                                            type='material-community'
                                            color='#f9ba3f'

                                        />
                                    </TouchableOpacity>

                                    <Text style={styles.catName}>Events</Text>

                                    <TouchableOpacity style={[styles.circle, { backgroundColor: '#cee7ff', }]}>

                                        <Icon
                                            active
                                            name="movie"
                                            type='material-community'
                                            color='#2d98ff'

                                        />
                                    </TouchableOpacity>

                                    <Text style={styles.catName}>Tickets</Text>


                                </View>
                                <View style={styles.rowchild}>

                                    <TouchableOpacity style={[styles.circle, { backgroundColor: '#ebd5ff', }]}>

                                        <Icon
                                            active
                                            name="cards-club"
                                            type='material-community'
                                            color='#b057ff'

                                        />
                                    </TouchableOpacity>

                                    <Text style={styles.catName}>Clubs & lounge</Text>

                                    <TouchableOpacity onPress={() =>  this.props.navigation.navigate('restaurants')} style={[styles.circle, { backgroundColor: '#ffcccd', }]}>

                                        <Icon
                                            active
                                            name="restaurant"
                                            type='material-icon'
                                            color='#24a83a'

                                        />
                                    </TouchableOpacity>

                                    <Text style={styles.catName}>Resturants</Text>
                                </View>

                                <View style={styles.rowchild}>

                                    <TouchableOpacity style={[styles.circle, { backgroundColor: '#d3ffdb', }]}>

                                        <Icon
                                            active
                                            name="gamepad"
                                            type='material-icon'
                                            color='#644e5e'

                                        />
                                    </TouchableOpacity>

                                    <Text style={styles.catName}>Parks & plays</Text>

                                    <TouchableOpacity style={[styles.circle, { backgroundColor: '#ffcccd', }]}>

                                        <Icon
                                            active
                                            name="wifi"
                                            type='font-awesome'
                                            color='#644e5e'

                                        />
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
