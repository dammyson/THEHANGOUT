
import React, { Component } from 'react';
import { Platform, StyleSheet, AsyncStorage, Image, Dimensions, ImageBackground } from 'react-native';
import { Container, Content, View, Text, Icon, Button, Left, Right, Body, Title, List, ListItem, Thumbnail, Grid, Col } from 'native-base';
import { Actions } from 'react-native-router-flux';


import color from '../../component/color';

export default class EngagementStart extends Component {

    constructor(props) {
        super(props);

        this.state = {

        };
    }

    async componentDidMount() {
        if (data !== null) {
            Actions.pop();
            Actions.login({ email: "jesus" });
        }
    }

    render() {

        var left = (
            <Left style={{ flex: 1 }}>
                <Button transparent onPress={() => Actions.pop()}>
                    <Icon name="ios-arrow-back" size={30} style={{ fontSize: 30 }} />
                </Button>
            </Left>
        );
        return (
            <Container style={{ backgroundColor: color.secondary_color }}>
                <Content>
                    <View style={styles.header}>
                        <Text style={{ fontSize: 21, margin: 15, textAlign: 'center', fontWeight: '500', color: color.primary_color, }}>WHAT WOULD YOU LIKE TO DO TODAY?</Text>
                        <Text style={{ fontSize: 14, margin: 15, marginTop: 40, textAlign: 'center', fontWeight: '400', color: "#ffffff", }}>Do you have an event you want to organize?</Text>
                    </View>

                    <View style={styles.multipleContainer}>

                    </View>

                    <View style={styles.buttonview}>

                        <View style={styles.buttons}>
                            <Button onPress={() => this.checkout()} style={styles.transButtonContainer} block iconLeft>
                                <Icon name='ios-add' style={{ color: color.primary_color }} />
                                <Text style={{ color: color.primary_color, fontWeight: '400' }}>CREATE EVENT</Text>
                            </Button>
                        </View>


                        <View style={styles.inputContainer}>
                            <View style={styles.lineStyle} />
                            <Text style={{ color: 'white', margin: 10, fontWeight: '200' }}>or</Text>
                            <View style={styles.lineStyle} />
                        </View>
                    </View>


                    <View style={styles.buttonviewtwo}>
                        <View style={styles.buttonstwo}> 
                        <Text style={{ fontSize: 14, textAlign:'center', marginTop: 10, marginBottom: 30, textAlign: 'left', fontWeight: '400', color: "#ffffff", }}>Browse to see all event available</Text>
                            <Button  onPress={() => Actions.category()} category style={ styles.enablebutton} block iconLeft >
                                <Text style={{ color: color.secondary_color }}>BROWSE EVENTS</Text>
                            </Button>
                           
                        </View>
                    </View>
                </Content>
            </Container>
        );
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
        paddingTop: 80
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
        justifyContent: 'center',

    },
    buttons: {
    },
    transButtonContainer: {
        backgroundColor: 'transparent',
        marginLeft: 55,
        marginRight: 55,
        marginTop: 15,
        borderRadius: 1,
        borderColor: color.primary_color,
        borderWidth: 1,
    },
    inputContainer: {
        flexDirection: "row",
        flex: 1,
        marginTop: 40,
        justifyContent: 'center',
        marginLeft: 40,
        marginRight: 40,
    },
    countryCode: {
        borderBottomColor: '#3E3E3E',
        borderBottomWidth: 1,
        flexDirection: "row",
    },
    lineStyle: {
        height: 0.2,
        flex: 1,
        marginTop: 20,
        backgroundColor: 'white',

    },
    buttonviewtwo: {
        justifyContent: 'center',
        marginTop: 20,
        alignItems: 'center',

    },
    buttonstwo: {
        
    },
    enablebutton: {
        backgroundColor: color.primary_color,
        width: 200,
        borderRadius: 5,
        alignItems: 'center',
        alignContent: 'space-around'
    },
});
