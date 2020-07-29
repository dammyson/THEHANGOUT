
import React, { Component } from 'react';
import { Platform, StyleSheet, AsyncStorage, Image, Dimensions, StatusBar } from 'react-native';
import { Container, Content, View, Text, Icon, Button, Left, Right, Body, Title, List, ListItem, Thumbnail, Grid, Col } from 'native-base';
import { Actions } from 'react-native-router-flux';
const URL = require("../../component/server");
import _ from "lodash";
import Navbar from '../../component/Navbar';
import {
    SelectMultipleButton,
    SelectMultipleGroupButton
} from "react-native-selectmultiple-button";
import color from '../../component/color';
import {
    BarIndicator,
} from 'react-native-indicators';


export default class Category extends Component {

    constructor(props) {
        super(props);

        this.state = {
            multipleSelectedData: [],
            multipleSelectedDataLimited: [],
            multipleData:[],
            loading: true,
            dataone: [
            ], 
            data: '',
        };
    }

  
    componentDidMount() {
        AsyncStorage.getItem('data').then((value) => {
            if (value == '') { } else {
                this.setState({ data: JSON.parse(value) })
            }

            this.getEventsRequest()
        })

    }

    pluck(arr, key) { 
        return arr.reduce(function(p, v) { 
          return p.concat(v[key]); 
        }, []); 
    }


    addCategotyRequest(){
        this.setState({ loading: true })
        const { data, dataone, multipleSelectedData} = this.state
       var serverarray=[];

        for (let i = 0; i < multipleSelectedData.length; i++) {
            serverarray.push(
                dataone[this.state.dataone.map(function(e) { 
                    return e.name; 
                }).indexOf(multipleSelectedData[i])].id

            )
        }
        fetch(URL.url + 'categories/addUserCategory', {
          method: 'POST', headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            'Authorization': 'Bearer ' + data.token,
          }, body:  JSON.stringify(serverarray)
         
        })
          .then(res => res.json())
          .then(res => {
            console.warn(res);
            if (res.status) {
              this.setState({ 
                loading: false,
               
              })
            this.goHome();
            } else {
              Alert.alert('Process failed', res.message, [{ text: 'Okay' }])
              this.setState({ loading: false })
            }
          }).catch((error) => {
            console.warn(error);
            alert(error.message);
          });

        

    }


    goHome(){
        AsyncStorage.getItem('role').then((value) => {
          if (value == '') { } else {
             if(value == 'Customer'){
              Actions.home({type: 'replace'});
             }else{
              Actions.merchant_home({type: 'replace'});
             }
          }
  
         
      })
       } 


    getEventsRequest() {
        const { data} = this.state
      console.warn(data)
        fetch(URL.url + 'categories/Events', {
            method: 'GET', headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'Authorization': 'Bearer ' + data.token,
            }
        })
            .then(res => res.json())
            .then(res => {
              
                if (res.status) {
                    this.setState({
                        multipleData:this.pluck(res.data, 'name'),
                        dataone: res.data,
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

  

    render() {
        if (this.state.loading) {
            return (
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#000000' }}>
                    <View style={{ height: 90, alignItems: 'center', justifyContent: 'center',}}>
                        <Text style={{ fontSize: 15, color: '#fff' }}>processing categories</Text>
                        <BarIndicator count={4} color={color.primary_color} />
                        <Text style={{ fontSize: 13, flex: 1, color: '#fff' }}>Please wait...</Text>
                    </View>
                </View>
            );
        }

        var left = (
            <Left style={{ flex: 1 }}>
                <Button transparent onPress={() => Actions.pop()}>
                    <Icon name="ios-arrow-back" size={30} style={{ fontSize: 30 }} />
                </Button>
            </Left>
        );
        return (
            <Container style={{ backgroundColor: color.secondary_color }}>
                 <StatusBar barStyle="dark-content" hidden={false} backgroundColor="transparent" />
                <Navbar left={left} title="" />
                <Content>
                    <View style={styles.header}>
                        <Text style={{ fontSize: 20, margin: 25, textAlign:'center', fontWeight: '800', color: color.primary_color, }}>LET US KNOW WHAT YOUR INTERESTS ARE</Text>
                        <Text style={{ fontSize: 14, margin: 15, marginTop: 40,  textAlign: 'left', fontWeight: '800', color: "#ffffff", }}>Select at least 3 Categories </Text>
                    </View>
                    <View style={styles.multipleContainer}>
                        {this.state.multipleData.map(interest => (
                            <SelectMultipleButton
                                key={interest}
                                buttonViewStyle={{
                                    borderRadius: 4,
                                    height: 40,
                                }}
                                textStyle={{
                                    fontSize: 15,
                                    margin: 20
                                }}
                                highLightStyle={{
                                    borderColor: "white",
                                    backgroundColor: "transparent",
                                    textColor: "white",
                                    borderTintColor: color.primary_color,
                                    backgroundTintColor: color.primary_color,
                                    textTintColor: color.secondary_color
                                }}
                                value={interest}
                                selected={this.state.multipleSelectedData.includes(interest)}
                                singleTap={valueTap =>
                                    this._singleTapMultipleSelectedButtons(interest)
                                }
                            />
                        ))}
                    </View>
                    <View style={styles.buttonview}>
                        <View style={styles.buttons}>
                            <Button  style={ this.state.multipleSelectedData.length > 2 ? styles.enablebutton : styles.disablebutton } block iconLeft  onPress={()=> this.state.multipleSelectedData.length > 2 ? this.addCategotyRequest() : null } >
                                <Text style={{ color: color.secondary_color }}>Done</Text>
                            </Button>
                            <Button  onPress={()=> Actions.home()} style={{ backgroundColor: 'transparent', width: 200 }} block iconLeft>
                                <Text style={{ color: color.white }}>Skip</Text>
                            </Button>
                        </View>
                    </View>
                </Content>
            </Container>
        );
    }


    _singleTapMultipleSelectedButtons(interest) {

        if (this.state.multipleSelectedData.includes(interest)) {

            _.remove(this.state.multipleSelectedData, ele => {
                return ele === interest;
            });

        } else {
            this.state.multipleSelectedData.push(interest);
        }

        this.setState({
            multipleSelectedData: this.state.multipleSelectedData
        });  
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: color.secondary_color
    },
    multipleContainer: {
        flexWrap: "wrap",
        flexDirection: "row",
        justifyContent: "center",
        flex: 6,
    },
    header: {
        flex: 1,
        paddingTop: 20
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    backgroundImage: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    },
    logo: {
        width: 300,
        height: 100,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonview: {
        alignItems: 'center',
        justifyContent: 'center',
       
    },
    buttons: {
       marginTop: 60,
    },
    enablebutton:{
        backgroundColor: color.primary_color, 
        width: 200, 
        alignItems: 'center', 
        alignContent: 'space-around'
    },
    disablebutton:{
        backgroundColor: "#6e5a32", 
        width: 200, 
        alignItems: 'center', 
        alignContent: 'space-around'
    }
});
