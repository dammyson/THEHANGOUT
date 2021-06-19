
import React, { Component } from 'react';
import { TextInput, StyleSheet, TouchableOpacity, StatusBar, Image, AsyncStorage, Dimensions, ImageBackground } from 'react-native';
import { Container, Content, View, Text, Button, Left, Right, Toast, Title, List, ListItem, Thumbnail, Grid, Col, Separator } from 'native-base';
import { Avatar, Badge, } from 'react-native-elements';
import { Card, Icon, SocialIcon } from 'react-native-elements'
import Carousel, { Pagination, ParallaxImage } from 'react-native-snap-carousel';
import {
    BarIndicator,
} from 'react-native-indicators';
import color from '../../component/color';
import Navbar from '../../component/Navbar';
const URL = require("../../component/server");
import Moment from 'moment';
import {
    getLocation,
} from '../../component/utilities/locationService';
import { getSaveRestaurant, getData } from '../../component/utilities';

export default class Dashboard extends Component {

    constructor(props) {
        super(props);

        this.onEventPress = this.onEventPress.bind(this)

        this.state = {
            loading: true,
            latitude: 6.5244,
            longitude: 3.3792,
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

        var cordinates = getLocation();
        cordinates.then((result) => {
            this.setState({
                latitude: result.latitude,
                longitude: result.longitude
            });
            console.log(result);
            this.updateProfileRequest()
        }, err => {
            console.log(err);
        });

        this.getEventsRequest()
        this._unsubscribe = this.props.navigation.addListener('focus', () => {
            this.getEventsRequest()
        });
    }


    getEventsRequest() {
        const { data, user } = this.state
        console.warn(user)
    
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


    updateProfileRequest() {
        const { latitude, longitude, data } = this.state
        console.warn(latitude, longitude,);
        fetch(URL.url + 'users/', {
            method: 'PUT', headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            }, body: JSON.stringify({
                latitude: latitude,
                longitude: longitude,
            }),
        })
            .then(res => res.json())
            .then(res => {
                console.warn(res);
            }).catch((error) => {
                console.warn(error);
            });
    }



    getDetails(data) {
        if (data.type == 'Event') {
            this.props.navigation.navigate('eventD', { id: data.id })
        } else if (data.type == 'Restaurant') {
            this.props.navigation.navigate('restaurantD', { id: data.id })
        } else if (data.type == 'Club') {
            this.props.navigation.navigate('clubD', { id: data.id })
        }
    }

    _renderItem = ({ item, index }, parallaxProps) => {
        Moment.locale('en');
        return (
            <TouchableOpacity onPress={() => this.getDetails(item)} >
                <ImageBackground
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
                                    : item.type == 'Club' ?

                                        <View style={[styles.small_circle, { backgroundColor: '#ffcccd', }]}>

                                            <Image
                                                style={{ resizeMode: 'contain', height: 20, width: 20 }}
                                                source={require('../../assets/icons/club.png')} />
                                        </View>
                                        :

                                        <View style={[styles.small_circle, { backgroundColor: '#ffcccd', }]}>

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
                    <StatusBar barStyle="light-content" hidden={false} backgroundColor="#101023" />
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
                        <StatusBar barStyle="light-content" hidden={false} backgroundColor="#101023" />

                        {/** 
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
                        */}
                        <View style={{ height: 15 }} />
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
                        <Text style={styles.catTitle}>Categories </Text>
                        </View>

                        <View style={{}}>

                            <View style={{ flexDirection: 'row', marginHorizontal: 10, marginVertical: 10 }}>

                                <TouchableOpacity  onPress={() => this.goTopage('events')}  style={[styles.cat_box, { borderWidth: 1, borderColor: '#FFDB4340' }]}>
                                    <View style={{ flexDirection: 'row', marginTop: 5, }}>
                                        <View style={{ flex: 1 }}>
                                            <Text style={{ color: '#FFDB43', fontFamily: 'NunitoSans-Bold' }}>Events</Text>
                                        </View>

                                        <Image
                                            style={{ resizeMode: 'contain', height: 20, width: 20 }}
                                            source={require('../../assets/icons/events.png')} />
                                    </View>
                                    <View style={{ marginTop: 5, height: 35 }}>
                                        <Text numberOfLines={2} style={{ color: '#fff7e7', fontFamily: 'NunitoSans-Regular', fontSize: 12 }}>See Upcoming events and book tickets  </Text>
                                    </View>
                                </TouchableOpacity>

                                <TouchableOpacity onPress={() => this.goTopage('corner')} style={[styles.cat_box, { borderWidth: 1, borderColor: '#58FFAC40' }]}>
                                    <View style={{ flexDirection: 'row', marginTop: 5, }}>
                                        <View style={{ flex: 1 }}>
                                            <Text style={{ color: '#58FFAC', fontFamily: 'NunitoSans-Bold' }}>Photos </Text>
                                        </View>

                                        <Image
                                            style={{ resizeMode: 'contain', height: 20, width: 20 }}
                                            source={require('../../assets/icons/package.png')} />
                                    </View>
                                    <View style={{ marginTop: 5, height: 35 }}>
                                        <Text numberOfLines={2} style={{ color: '#fff7e7', fontFamily: 'NunitoSans-Regular', fontSize: 12 }}>See recommended hangout spots through your history.</Text>
                                    </View>
                                </TouchableOpacity>

                              


                            </View>


                            <View style={{ flexDirection: 'row', marginHorizontal: 10, marginVertical: 10 }}>

                                <TouchableOpacity  onPress={() => this.goTopage('play')}  style={[styles.cat_box, { borderWidth: 1, borderColor: '#FF993440' }]}>
                                    <View style={{ flexDirection: 'row', marginTop: 5, }}>
                                        <View style={{ flex: 1 }}>
                                            <Text style={{ color: '#FF9934', fontFamily: 'NunitoSans-Bold' }}>Parks & plays </Text>
                                        </View>

                                        <Image
                                            style={{ resizeMode: 'contain', height: 20, width: 20 }}
                                            source={require('../../assets/icons/parks.png')} />
                                    </View>
                                    <View style={{ marginTop: 5, height: 35 }}>
                                        <Text numberOfLines={2} style={{ color: '#fff7e7', fontFamily: 'NunitoSans-Regular', fontSize: 12 }}>Get the best seats to dramas. Buy tickets now  </Text>
                                    </View>
                                </TouchableOpacity>

                                <TouchableOpacity onPress={() => this.goTopage('movies')} style={[styles.cat_box, { borderWidth: 1, borderColor: '#45A1FF40' }]}>
                                    <View style={{ flexDirection: 'row', marginTop: 5, }}>
                                        <View style={{ flex: 1 }}>
                                            <Text style={{ color: '#45A1FF', fontFamily: 'NunitoSans-Bold' }}>Movies  </Text>
                                        </View>

                                        <Image
                                            style={{ resizeMode: 'contain', height: 20, width: 20 }}
                                            source={require('../../assets/icons/movies.png')} />
                                    </View>
                                    <View style={{ marginTop: 5, height: 35 }}>
                                        <Text numberOfLines={2} style={{ color: '#fff7e7', fontFamily: 'NunitoSans-Regular', fontSize: 12 }}>Book movie tickets for the movies you love. </Text>
                                    </View>
                                </TouchableOpacity>



                            </View>


                            <View style={{ flexDirection: 'row', marginHorizontal: 10, marginVertical: 10 }}>

                                <TouchableOpacity onPress={() => this.goTopage('restaurants')}  style={[styles.cat_box, { borderWidth: 1, borderColor: '#FF3C3440' }]}>
                                    <View style={{ flexDirection: 'row', marginTop: 5, }}>
                                        <View style={{ flex: 1 }}>
                                            <Text style={{ color: '#FF3C34', fontFamily: 'NunitoSans-Bold' }}>Food</Text>
                                        </View>

                                        <Image
                                            style={{ resizeMode: 'contain', height: 20, width: 20 }}
                                            source={require('../../assets/icons/restaurant.png')} />
                                    </View>
                                    <View style={{ marginTop: 5, height: 35 }}>
                                        <Text numberOfLines={2} style={{ color: '#fff7e7', fontFamily: 'NunitoSans-Regular', fontSize: 12 }}>Reserve tables at a restaurant or buy a meal</Text>
                                    </View>
                                </TouchableOpacity>

                              



                                <TouchableOpacity onPress={() => this.goTopage('clubs')}  style={[styles.cat_box, { borderWidth: 1, borderColor: '#BE41FF40' }]}>
                                    <View style={{ flexDirection: 'row', marginTop: 5, }}>
                                        <View style={{ flex: 1 }}>
                                            <Text style={{ color: '#BE41FF', fontFamily: 'NunitoSans-Bold' }}>Clubs & lounge </Text>
                                        </View>

                                        <Image
                                            style={{ resizeMode: 'contain', height: 20, width: 20 }}
                                            source={require('../../assets/icons/club.png')} />
                                    </View>
                                    <View style={{ marginTop: 5, height: 35 }}>
                                        <Text numberOfLines={2} style={{ color: '#fff7e7', fontFamily: 'NunitoSans-Regular', fontSize: 12 }}>EReserved your spot at the best clubs </Text>
                                    </View>
                                </TouchableOpacity>


                            </View>





                        </View>


                    </View>
                </Content>
            </Container>
        );
    }


    goTopage(data) {

        if (data == 'events') {
            this.props.navigation.navigate(data)
        }
        else if (data == 'movies') {
            Toast.show({
                text: 'This feature is not available at the moment !',
                position: 'top',
                type: 'success',
                buttonText: 'Dismiss',
                duration: 3000
            });
        }
        else if (data == 'clubs') {
            //this.props.navigation.navigate(data)
            Toast.show({
                text: 'This feature is not available at the moment !',
                position: 'top',
                type: 'success',
                buttonText: 'Dismiss',
                duration: 3000
            });
        }
        else if (data == 'restaurants') {
           // this.props.navigation.navigate(data)
           Toast.show({
            text: 'This feature is not available at the moment !',
            position: 'top',
            type: 'success',
            buttonText: 'Dismiss',
            duration: 3000
        });
        }
        else if (data == 'play') {
            Toast.show({
                text: 'This feature is not available at the moment !',
                position: 'top',
                type: 'success',
                buttonText: 'Dismiss',
                duration: 3000
            });
        }
        else {
            Toast.show({
                text: 'This feature is not available at the moment !',
                position: 'top',
                type: 'success',
                buttonText: 'Dismiss',
                duration: 3000
            });
        }

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
        width: 5,
        height: 5,
        borderRadius: 4,
        marginHorizontal: 1,
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
    //new
    cat_box: {
        padding: 10,
        flex: 1,
        marginHorizontal: 5,
        backgroundColor: '#101023',
        borderRadius: 5
    },

});
