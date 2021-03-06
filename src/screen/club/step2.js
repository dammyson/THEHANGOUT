import React, { Component } from "react";
import { Alert, Dimensions, TouchableOpacity, TextInput, StyleSheet, } from "react-native";
import { Container, Content, View, Text, Button, Left, Right, Body, Title, List, ListItem, } from 'native-base';
import { Avatar, Badge, } from 'react-native-elements';
import { Card, Icon, SocialIcon } from 'react-native-elements'
import Carousel, { Pagination, ParallaxImage } from 'react-native-snap-carousel';
import { Actions } from 'react-native-router-flux';
const deviceHeight = Dimensions.get("window").height;

import color from '../../component/color';
const { width: screenWidth } = Dimensions.get('window')
import Navbar from '../../component/Navbar';

export default class step2 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      descriptionText: '',
      data: '',
      count: 140,
      title: '',
    };
  }

  nextStep = () => {
    const { data, descriptionText } = this.state;
    if (descriptionText == "") {
      Alert.alert('Validation failed', "All fields are requried", [{ text: 'Okay' }])
      return
    }
    const data_moving = data;
    data_moving['description'] = descriptionText
    this.props.navigation.navigate('Club3', { data_moving: data_moving });

  };

  goBack() {
    const { goBack } = this.props.navigation;
    goBack(null)
  }

  componentDidMount() {
    const { data_moving } = this.props.route.params;
    this.setState({ data: data_moving })

  }


  countChange(text) {
    this.setState({ count: 140 - text.length })

  }

  render() {

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


    return (
      <Container style={{ backgroundColor: "#010113" }}>
        <Navbar left={left} title={this.state.data.title} bg='#101023' />
        <Content>
          <View style={styles.container}>
            <View >

              <Text style={styles.titleText}>DESCRIBE YOUR CLUB</Text>
            </View>
            <Text style={styles.titlesubText}>Enter a brief summary for your club. Make it informative </Text>
            <View style={styles.item}>

              <TextInput
                placeholder="Enter Club Description"
                placeholderTextColor='#8d96a6'
                returnKeyType="next"
                onSubmitEditing={() => this.nextStep()}
                defaultValue={this.state.descriptionText}
                keyboardType='default'
                autoCapitalize="none"
                autoCorrect={false}
                style={styles.menu}
                onChangeText={text => [this.countChange(text), this.setState({ descriptionText: text })]}
              />
            </View>
            <View style={{ marginLeft: 20, marginRight: 20, justifyContent: 'flex-end', alignItems: 'flex-end' }}>
              <View style={{ height: 30, width: 30, borderRadius: 15, justifyContent: 'center', alignItems: 'center', borderColor: '#8d96a6', borderWidth: 1.9 }}>
                <Text style={{ fontSize: 12, color: '#8d96a6' }}>{this.state.count}</Text>
              </View>
            </View>

            <View style={styles.nextContainer}>


              <TouchableOpacity onPress={this.nextStep} style={styles.qrbuttonContainer} block iconLeft>
                <Icon
                  active
                  name="arrowright"
                  type='antdesign'
                  color={color.button_blue}
                />
              </TouchableOpacity>

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
    height: Dimensions.get('window').height - 80,
  },
  btnContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: "6%"
  },
  titleText: {
    fontSize: 21,
    color: '#ffffff',
    marginTop: 25,
    marginLeft: 15,
    fontFamily: 'NunitoSans-Bold'
  },
  titlesubText: {
    fontSize: 15,
    color: '#8d96a6',
    marginTop: 25,
    marginLeft: 15,
    fontFamily: 'NunitoSans-Bold'
  },
  item: {
    flexDirection: 'row',
    marginTop: 2,
    margin: 15,
    borderColor: 'red',
    borderBottomWidth: 2,
    alignItems: 'center',
    paddingRight: 15,
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
  qrbuttonContainer: {
    flexDirection: 'row',
    backgroundColor: color.white,
    marginTop: 1,
    borderRadius: 40,
    padding: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,

  },
  nextContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',

    paddingBottom: 20
  }
});