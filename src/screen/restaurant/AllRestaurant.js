
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
export default class Dashboard extends Component {

    constructor(props) {
        super(props);

        this.onEventPress = this.onEventPress.bind(this)

        this.state = {
            loading: true,
            dataone: [
            ],
            datatwo: [
            ],
            special_offers: [
            ],
            data: '',
            nodata: false,
            slider1ActiveSlide: 0,
            selected: null,
            user: null,
            searchText: '',
            cat:[]
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
        this.getSpecialOffer()
        this._unsubscribe = this.props.navigation.addListener('focus', () => {
            this.getEventsRequest()
        });
    }


    getEventsRequest() {
        const { data, user } = this.state



        fetch(URL.url + 'restaurants', {
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
                        dataone: res.data.nearby,
                        datatwo: res.data.popular,
                        cat: res.data.categories,
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

    getSpecialOffer() {
        const { data, user } = this.state

        fetch(URL.url + 'food/special-offers', {
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
                        special_offers:res.data,
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


    currencyFormat(n) {
        return n.toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
    }

    _renderItem = ({ item, index }, parallaxProps) => {
        Moment.locale('en');
        return (
            <TouchableOpacity onPress={() =>  this.props.navigation.navigate('place_order', {restaurant: item.restaurant, res_id: item.restaurantId, menu_id: item.menuId,  })}  >
                <ImageBackground
                    opacity={0.5}
                    style={{ borderRadius: 12 }}
                    source={{ uri: item.bannerUrl }}
                    imageStyle={{ borderRadius: 5, backgroundColor: 'blue' }}

                >


                    <View style={{ marginTop: 120, paddingTop:5,  backgroundColor:'#fff'}} >
                        <Text style={{ marginRight: 13,marginTop: 7, marginLeft: 13,fontSize: 13,color: '#000', textAlign: 'left',fontFamily: 'NunitoSans-SemiBold'}}>{item.menuName}</Text>
                        <Text style={ { marginRight: 5, marginLeft: 13,fontSize: 13, color: '#000', textAlign: 'left', fontFamily: 'NunitoSans-Bold'}}>₦{this.currencyFormat(item.amount)}</Text>

                        <View style={styles.piceContainer}>
                            <View style={{ flex: 1, flexDirection: 'row', marginTop: 3, marginLeft: 1, marginBottom:15 }}>
                            <Text style={{ marginRight: 5,marginLeft: 13,fontSize: 10,color: '#000',textAlign: 'left', fontFamily: 'NunitoSans-light'}}>{item.restaurant}</Text>
                                <Icon
                                    active
                                    name="location-pin"
                                    type='entypo'
                                    color='#000'
                                    size={15}
                                />
                                <Text style={{ marginRight: 5,marginLeft: 13,fontSize: 10,color: '#000',textAlign: 'left', fontFamily: 'NunitoSans-light'}}>{Moment(item.startDate).format('llll')}</Text>

                            </View>

                        </View>

                    </View>


                </ImageBackground>
            </TouchableOpacity>
        );
    }

    _renderCategory() {
        const { cat } = this.state;
        return (
            <ScrollView horizontal style={{ marginRight: 20, marginLeft: 20, }}>
               {this.renderCatItem(cat)}
            </ScrollView>
        );
    }

    renderPopular() {
        const { slider1ActiveSlide } = this.state;
        return (
            <View style={styles.header}>

                <Carousel
                    ref={(c) => { this._carousel = c; }}
                    data={this.state.special_offers}
                    renderItem={this._renderItem}
                    sliderWidth={Dimensions.get('window').width}
                    itemWidth={Dimensions.get('window').width / 1.4}
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
                        <Text style={{ fontSize: 15, color: '#fff' }}>No event at the moment </Text>

                    </View>
                </View>
            );
        }

        var left = (
            <Left style={{ flex: 1 }}>
            <Button transparent onPress={() =>this.props.navigation.goBack()}>
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
                <Navbar left={left} right={right} title="All Restaurants" bg='#101023' />
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
                                <Text style={styles.titleText}>SPECIAL OFFERS</Text>
                                <TouchableOpacity onPress={() => this.props.navigation.navigate('moreR',{ prams: 'all' })}style={{ marginLeft: 10, marginRight: 20, flexDirection: 'row', alignItems: 'center' }}>
                                    <Text style={{ fontSize: 12, color: 'red', }}>View all </Text>
                                    <Icon
                                        active
                                        name="ios-arrow-forward"
                                        type='ionicon'
                                        color='red'
                                    /></TouchableOpacity>
                            </View>
                        </View>


                        {this.renderPopular()}

                        <View style={{ marginLeft: 10, marginRight: 7, flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={styles.titleText}>CATEGORIES</Text>
                        </View>
                        {this._renderCategory()}

                        <View style={{ marginLeft: 10, marginRight: 7, marginBottom: 15, flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={styles.titleText}>CLOSE TO YOU</Text>
                        </View>

                        <ScrollView style={styles.scrollView}>
                            {this.renderUpcomming()}
                        </ScrollView>




                        <TouchableOpacity onPress={() => this.props.navigation.navigate('moreR',{ prams: 'all' })} style={{ margin: 30, alignItems: 'center', borderRadius: 10, borderWidth: 1, borderColor: 'red' }}>
                            <Text style={{ fontSize: 15, margin: 10, fontWeight: '300', color: 'red' }}>View all restaurants</Text>
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
                        <View style={{ flex: 1, }}>
                            <TouchableOpacity onPress={() => this.props.navigation.navigate('restaurantD',{ id: item.id }) }   >
                                <ImageBackground
                                    opacity={0.5}
                                    style={{ borderRadius: 12, flex: 1, margin: 10, marginTop: 0 }}
                                    source={{ uri: item.banner, }}
                                    imageStyle={{ borderRadius: 20, backgroundColor: 'blue' }}
                                >


                                    <View style={styles.details} >
                                        <Text style={styles.date}>Opens {item.openingTime}</Text>
                                        <Text style={styles.tittle}>{item.name}</Text>
                                        <View style={styles.piceContainer}>
                                            <View style={{ flex: 1, flexDirection: 'row', marginTop: 3, marginLeft: 15 }}>
                                                <Icon
                                                    active
                                                    name="location-pin"
                                                    type='entypo'
                                                    color='#fff'
                                                    size={15}
                                                />
                                                <Text style={styles.price}>{item.location}</Text>
                                            </View>

                                        </View>

                                    </View>


                                </ImageBackground>

                            </TouchableOpacity>

                        </View>

                    </View>
                </View>
            );
        });
        return items;
    }

    renderCatItem(data){

        let cat = [];
        for (var i = 0; i < data.length; i++) {
            const link = "category/"+ data[i].id+'/'+10
            cat.push(

                <View style={styles.rowchild}>

                <TouchableOpacity onPress={() => this.props.navigation.navigate('moreR',{ prams: link })}  style={[styles.circle]}>

                    <Icon
                        active
                        name={data[i].iconName}
                        type={data[i].iconType}
                        color='red'

                    />
                </TouchableOpacity>

            <Text style={styles.catName}>{data[i].name}</Text>


            </View>



            );
        }
        return cat;
    }

}

const data = [
{
    name:'African',
    icon: 'location',
    type: 'entypo',
},
{
    name:'African',
    icon: 'location',
    type: 'entypo',
},
{
    name:'African',
    icon: 'location',
    type: 'entypo',
},
{
    name:'African',
    icon: 'location',
    type: 'entypo',
},
{
    name:'African',
    icon: 'location',
    type: 'entypo',
},
{
    name:'African',
    icon: 'location',
    type: 'entypo',
},


];

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
        marginTop: 100,
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
    title: {
        fontSize: 16,
        fontWeight: 'bold'
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
    rowchild: {
        flex: 1,
        margin: 10,
        marginLeft:10,
        marginRight:10,
        alignItems: 'center',
    },
    circle: {
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 20,
        paddingBottom: 20,
        borderRadius: 40,
        backgroundColor: '#fff',
    },
    catName: {
        marginRight: 13,
        marginLeft: 13,
        fontSize: 12,
        paddingTop: 10,
        paddingBottom: 20,
        color: '#ffffff',
        textAlign: 'left',
        fontFamily: 'NunitoSans-Bold'
    },
});
