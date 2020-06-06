import React, { Component } from "react";
import { Alert, Dimensions, TouchableOpacity, ImageBackground, StyleSheet, AsyncStorage, StatusBar, ScrollView, } from "react-native";
import { Container, Content, View, Text, Button, Left, Right, Toast, Title, List, ListItem, } from 'native-base';
import { Avatar, Icon, } from 'react-native-elements';
import { Actions } from 'react-native-router-flux';
const deviceHeight = Dimensions.get("window").height;
const URL = require("../../component/server");

import color from '../../component/color';

import {
    BarIndicator,
} from 'react-native-indicators';
import Moment from 'moment';

import Navbar from '../../component/Navbar';


export default class Details extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            data: '',
            name: '',
            id: '1',
            details: {}


        };
    }



    componentWillMount() {
        this.setState({ id: this.props.id });
        AsyncStorage.getItem('data').then((value) => {
            if (value == '') { } else {
                this.setState({ data: JSON.parse(value) })
                this.setState({ user: JSON.parse(value).user })
            }
            this.processGetEvent();
        })


    }




    processGetEvent() {
        const { data, id, } = this.state

        this.setState({ loading: true })
        fetch(URL.url + 'restaurants/' + id, {
            method: 'GET', headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'Authorization': 'Bearer ' + data.token,
            },
        })
            .then(res => res.json())
            .then(res => {
                console.warn(res);
                if (res.status) {
                    this.setState({
                        loading: false,
                        details: res.data,
                    })
                } else {
                    Alert.alert('Action failed', res.message, [{ text: 'Okay' }])
                    this.setState({ loading: false })
                }
            }).catch((error) => {
                this.setState({ loading: false })
                console.warn(error);
                alert(error.message);
            });


    }








    render() {
        const { details, } = this.state
        const ticketVisibility = {
            label: 'Select visibility',
            value: null,
            color: '#000',
        };


        var left = (
            <Left style={{ flex: 1 }}>
                <Button transparent onPress={() => Actions.pop()}>
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
            <Right style={{ flex: 1 }}>
                <Button transparent onPress={() => Actions.pop()}>
                    <Icon
                        active
                        name="md-more"
                        type='ionicon'
                        color='#FFF'
                    />
                </Button>
            </Right>
        );
        if (this.state.loading) {
            return (
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#000000' }}>
                    <View style={styles.welcome}>
                        <Text style={{ fontSize: 12, color: '#fff' }}>Getting details </Text>
                        <BarIndicator count={4} color={color.primary_color} />
                        <Text style={{ fontSize: 10, flex: 1, color: '#fff', opacity: 0.6 }}>Please wait...</Text>
                    </View>
                </View>
            );
        }

        return (
            <Container style={{ backgroundColor: '#101023' }}>
                <StatusBar barStyle="light-content" hidden={false} backgroundColor="transparent" translucent/>
                <Content>
                    <View style={styles.container}>


                        <View style={{ flex: 1, }}>
                            <ScrollView style={{ flex: 1, }}>
                                <View style={{ flex: 1, }}>
                                    <ImageBackground
                                        opacity={0.8}
                                        style={{ height: Dimensions.get('window').height / 3 }}
                                        source={{ uri: details.banner }}
                                        imageStyle={{ backgroundColor: 'blue', alignItems: 'flex-end', justifyContent: 'flex-end' }}
                                    >
                                        <View style={{ flex: 1, alignItems: 'flex-start', justifyContent: 'flex-end' }}>
                                            <View style={styles.details} >
                                                <Text style={styles.date}>Opens {details.openingTime}</Text>
                                                <Text style={styles.tittle}>{details.name}</Text>

                                                <View style={styles.piceContainer}>
                                                    <View style={{ flex: 1, flexDirection: 'row', marginTop: 3, marginLeft: 15 }}>
                                                        <Icon
                                                            active
                                                            name="location-pin"
                                                            type='entypo'
                                                            color='#fff'
                                                            size={15}
                                                        />
                                                        <Text style={styles.price}>{'40 mins away'}</Text>

                                                    </View>

                                                </View>

                                            </View>
                                        </View>


                                    </ImageBackground>

                                    <View style={{ backgroundColor: '#111123', marginLeft: 20, marginRight: 20 }}>


                                        <View style={{ alignItems: 'center', flexDirection: 'row', marginTop: 15, opacity: 0.8, marginLeft: 10 }}>
                                            <Icon
                                                active
                                                name="location-pin"
                                                type='simple-line-icon'
                                                color='#FFF'
                                            />
                                            <Text style={{ marginLeft: 2, color: '#fff', fontSize: 13, fontWeight: '200' }}> {details.location} </Text>
                                        </View>

                                        <View style={styles.lineStyle} />


                                        <Text style={styles.headings}> LOCATION </Text>
                                        <Text style={{ marginLeft: 2, color: '#fff', fontSize: 13, fontWeight: '200', opacity: 0.6, marginTop: 15, }}>  {details.location}  </Text>
                                        <View style={styles.map}>
                                        </View>

                                        <Text style={styles.headings}> EVENT DETAILS </Text>
                                        <Text style={{ marginLeft: 2, color: '#fff', fontSize: 13, fontWeight: '200', opacity: 0.6, marginTop: 15, }}>  {details.description} </Text>
                                        <Text style={{ marginLeft: 2, color: color.primary_color, fontSize: 13, fontWeight: '200', opacity: 0.6, marginTop: 15, }}> Read more</Text>



                                        <Text style={styles.headings}> GALLERY </Text>

                                      {this.renderGallery(details.gallery)}



                                    </View>

                                </View>


                            </ScrollView>
                        </View>

                        <View style={{ alignItems: 'center', justifyContent: 'center', backgroundColor: '#111123', flexDirection: 'row' }}>

                            <TouchableOpacity onPress={() => Actions.reserveT({ resturant: details, type: 'replace' })} style={{ height: 45, flexDirection: 'row', paddingRight:30, paddingLeft:30, marginTop: 20, marginBottom: 20, margin: 10, alignItems: 'center', justifyContent: 'center', borderRadius: 5, backgroundColor: 'red' }}>
                                <Text style={{ color: '#fff', fontSize: 15, fontWeight: '600' }}>RESERVE NOW</Text>
                            </TouchableOpacity>
                        </View>


                    </View>


                </Content>
            </Container>
        );
    }


    renderGallery(data){
        return(
            <View style={styles.table}>
            {data.map((data, id) => (
              <View style={styles.cell} key={id}>
                <ImageBackground    
                    source={{ uri: data }}
                    style={{ height: 100, margin:5}}
                    imageStyle={{ borderRadius: 2, }}
                    >

                </ImageBackground>

              </View>
            ))}
          </View>
          
        );
    }
}
const styles = StyleSheet.create({
    container: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height ,

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
    title: {
        fontSize: 16,
        fontWeight: 'bold'
    },
    details: {
        marginTop: 100,
        marginBottom: 25,
    },
    headings: {
        marginTop: 22,
        color: '#fff',
        fontSize: 14,
        fontWeight: '600'
    },
    lineStyle: {
        height: 0.8,
        marginTop: 20,
        opacity: 0.5,
        backgroundColor: '#fff',

    },
    map: {
        height: 100,
        marginTop: 15,
        backgroundColor: '#fff'
    },
    welcome: {
        height: 90,
        alignItems: 'center',
        justifyContent: 'center',
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
        fontSize: 22,
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
    table: {
        marginTop:15,
        flexWrap: 'wrap',
        flexDirection: 'row'
      },
      cell: {
        flexBasis: '50%',
        flex: 1,
      }
});