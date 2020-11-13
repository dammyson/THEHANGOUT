
import React, { Component } from 'react';
import { TextInput, StyleSheet, ScrollView, TouchableOpacity, StatusBar, AsyncStorage, Dimensions, ImageBackground } from 'react-native';
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
import { getSaveRestaurant, getData } from '../../component/utilities';
import IonIcon from 'react-native-vector-icons/Ionicons';


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
                        datatwo: res.data.upComing,
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
                        datatwo: res.data.upComing,
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
                            text: 'Event removed from favorite !',
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
            <TouchableOpacity onPress={() =>   this.props.navigation.navigate('eventD', { id: item.id })} >
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
goToMore(params){
    this.props.navigation.navigate('more',{ prams: params})
}
    _renderMenu() {
        return (
            <View style={{ flexDirection: 'row', }}>
                <ImageBackground
                    opacity={0.5}
                    style={{ alignItems: 'flex-start', borderRadius: 3, margin: 8, flex: 1 }}
                    source={{ uri: 'https://cloud.githubusercontent.com/assets/21040043/24240405/0ba41234-0fe4-11e7-919b-c3f88ced349c.jpg' }}
                    imageStyle={{ borderRadius: 5, backgroundColor: color.secondary_color }}
                >


                        <TouchableOpacity   onPress={() => this.goToMore("eventListing/Likes/7") }  style={styles.hangoutDetails} >

                        <View style={styles.iconContainer}>

                            <Icon
                                active
                                name="heart"
                                type='antdesign'
                                color='red'
                                size={15}
                            />

                        </View>
                        <Text style={styles.date}>My Likes</Text>

                    </TouchableOpacity>


                </ImageBackground>

                <ImageBackground
                    opacity={0.5}
                    style={{ alignItems: 'flex-start', borderRadius: 3, margin: 5, flex: 1 }}
                    source={{ uri: 'https://cloud.githubusercontent.com/assets/21040043/24240405/0ba41234-0fe4-11e7-919b-c3f88ced349c.jpg' }}
                    imageStyle={{ borderRadius: 5, backgroundColor: color.secondary_color }}
                >


<TouchableOpacity    onPress={() => this.goToMore("eventListing/Categories/7") }  style={styles.hangoutDetails} >

                        <View style={styles.iconContainer}>

                            <Icon
                                active
                                name="calendar"
                                type='entypo'
                                color='red'
                                size={15}
                            />

                        </View>
                        <Text style={styles.date}>My calender</Text>

                    </TouchableOpacity>


                </ImageBackground>
                <ImageBackground
                    opacity={0.5}
                    style={{ alignItems: 'flex-start', borderRadius: 3, margin: 5, flex: 1 }}
                    source={{ uri: 'https://cloud.githubusercontent.com/assets/21040043/24240405/0ba41234-0fe4-11e7-919b-c3f88ced349c.jpg' }}
                    imageStyle={{ borderRadius: 5, backgroundColor: color.secondary_color }}
                >


                    <TouchableOpacity  onPress={() => this.goToMore("eventListing/Categories/7") }  style={styles.hangoutDetails} >

                        <View style={styles.iconContainer}>

                            <Icon
                                active
                                name="indent-more"
                                type='foundation'
                                color='red'
                                size={15}
                            />

                        </View>
                        <Text style={styles.date}>Categories</Text>

                    </TouchableOpacity>


                </ImageBackground>

            </View>
        );
    }

    renderTrending() {
        const { slider1ActiveSlide } = this.state;
        return (
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
                        <Text style={{ fontSize: 15, color: '#fff' }}>Fetching all events</Text>
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
                        <Text style={{ fontSize: 15, color: '#fff' }}>No event at the moment </Text>

                    </View>
                </View>
            );
        }

        var left = (
            <Left style={{ flex: 1 }}>
                <Button transparent onPress={() =>  this.props.navigation.reset({
                      index: 0,
                      routes: [{ name: 'home' }],
                    })}>
            <View style={{ transform:[{ rotateY: "180deg"}]}}>
                <Icon  type='material-icons' name='exit-to-app' size={30} color='#FFF' />

                    </View>
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
                <Navbar left={left} right={right} title="All Events" bg='#101023' />
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

                            <View style={{ marginLeft: 10, marginRight: 7, flexDirection: 'row', alignItems: 'center' }}>
                                {this.state.dataone.length > 0?  <Text style={styles.titleText}>TRENDING</Text>:<View style={{flex: 1}} />} 
                                <TouchableOpacity    onPress={() => this.goToMore('eventListing/Trending/50')}   style={{ marginLeft: 10, marginRight: 20, flexDirection: 'row', alignItems: 'center' }}>
                                    <Text style={{ fontSize: 12, color: 'orange', }}>Full List </Text>
                                    <Icon
                                        active
                                        name="ios-arrow-forward"
                                        type='ionicon'
                                        color='orange'
                                    /></TouchableOpacity>
                            </View>
                        </View>


                        {this.renderTrending()}

                        <View style={{ marginLeft: 10, marginRight: 7, flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={styles.titleText}>For You</Text>
                            <TouchableOpacity    onPress={() => this.goToMore('eventListing/Upcoming/7')}  style={{ marginLeft: 10, marginRight: 20, flexDirection: 'row', alignItems: 'center' }}>
                                <Icon
                                    active
                                    name="ios-arrow-forward"
                                    type='ionicon'
                                    color='orange'
                                /></TouchableOpacity>
                        </View>
                        {this._renderMenu()}

                        <View style={{ marginLeft: 10, marginRight: 7, marginBottom: 15, flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={styles.titleText}>UPCOMING</Text>
                        </View>

                        <ScrollView style={styles.scrollView}>
                            {this.renderUpcomming()}
                        </ScrollView>




                        <TouchableOpacity  onPress={() => this.goToMore('eventListing/Upcoming/50')}  style={{ margin: 30, alignItems: 'center', borderRadius: 10, borderWidth: 1, borderColor: '#F7A400' }}>
                            <Text style={{ fontSize: 15, margin: 10, fontWeight: '300', color: '#F7A400' }}>View all upcomning events</Text>
                        </TouchableOpacity>
                    </View>
                </Content>
               
            </Container>
        );
    }
    renderUpcomming() {
        let items = [];
        this.state.datatwo.map((item, i) => {
            items.push(
                <View>
                    <View style={styles.upcomingContainer}>
                        <View style={{ alignItems: 'center' }}>
                            <Text style={{ fontWeight: '300', fontSize: 14, color: 'red' }}>{ Moment(item.startDate).format('MMM')}</Text>
                            <View style={{ marginLeft: 10, marginRight: 7, padding: 10, borderRadius: 10, backgroundColor: '#5F5C7F', alignItems: 'center' }}>
                                <Text style={{ fontWeight: '600', color: '#fff' }}>{ Moment(item.startDate).format('D')}</Text>
                                <Text style={{ fontWeight: '300', color: '#fff' }}>{ Moment(item.startDate).format('ddd')}</Text>
                            </View>
                            <View style={{ borderColor: '#5F5C7F', borderStyle: 'dotted', borderWidth: 2, borderRadius: 1, marginTop: 10, flex: 1 }}>

                            </View>

                        </View>
                        <View style={{ flex: 1, }}>
                            <TouchableOpacity onPress={() =>  this.props.navigation.navigate('eventD',{ id: item.id })}>
                                <ImageBackground
                                    opacity={0.5}
                                    style={{ borderRadius: 12, flex: 1, margin: 10, marginTop: 0 }}
                                    source={{ uri: item.banner, }}
                                    imageStyle={{ borderRadius: 20, backgroundColor: 'blue' }}
                                >


                                    <View style={styles.details} >
                                        <Text style={styles.date}>{ Moment(item.startDate).format('llll')}</Text>
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

                            <ImageBackground
                                opacity={0.5}
                                style={{ alignItems: 'flex-start', borderRadius: 3, margin: 8, marginBottom: 15, flex: 1 }}
                                source={{ uri: 'https://cloud.githubusercontent.com/assets/21040043/24240405/0ba41234-0fe4-11e7-919b-c3f88ced349c.jpg' }}
                                imageStyle={{ borderRadius: 5, backgroundColor: color.secondary_color }}
                            >


                                <TouchableOpacity   onPress={() =>  this.props.navigation.navigate('more',{ prams: "eventCategoryListing/"+ item.category+"/7" })} style={styles.hangoutDetails} >

                                    <Text style={{ fontWeight: '600', color: '#fff', flex: 1, marginLeft: 10 }}>{item.more} More Events</Text>
                                    <Icon
                                        active
                                        name="keyboard-arrow-right"
                                        type='material-icon'
                                        color='#fff'
                                        size={35}
                                    />

                                </TouchableOpacity>


                            </ImageBackground>
                        </View>

                    </View>
                </View>
            );
        });
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
    details: {
        marginTop: 140,
        marginBottom: 25,
    },
    hangoutDetails: {
        marginTop: 25,
        marginBottom: 25,
        flexDirection: 'row',
    },
    upcommingDetails: {
        marginTop: 30,
        marginBottom: 30,
        flexDirection: 'row',
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
        marginRight: 5,
        marginLeft: 5,
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
    titleText: {
        flex: 1,
        fontSize: 19,
        color: '#ffffff',
        marginTop: 10,
        marginBottom: 10,
        marginLeft: 15,
        fontFamily: 'NunitoSans-Bold'
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
    upcomingContainer: {
        margin: 10,
        marginTop: 0,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
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
