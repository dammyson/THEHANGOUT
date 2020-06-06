import React, { Component } from "react";
import { Image, Dimensions, TouchableOpacity, TextInput, StyleSheet, } from "react-native";
import { Container, Content, View, Text, Button, Left, Right, Body, Title, List, ListItem, } from 'native-base';
import { Avatar, Badge, } from 'react-native-elements';
import { Card, Icon, SocialIcon } from 'react-native-elements'
import DatePicker from 'react-native-datepicker'
const deviceHeight = Dimensions.get("window").height;

import color from '../../component/color';
const { width: screenWidth } = Dimensions.get('window')
import Navbar from '../../component/Navbar';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Moment from 'moment';



export default class step3 extends Component {

  constructor(props) {
    super(props);
    this.state = {
      titleText: '',
      data: '',
      count: 140,
      title: '',
      startdate: new Date(),
      enddate: new Date(),
      todate: "2019-06-11",
      show_from_picker: false,
      show_to_picker: false,

    };
  }


  showMode = currentMode => {
    setShow(true);
    setMode(currentMode);
  };

  showDatepicker = () => {
    showMode('date');
  };

  showTimepicker = () => {
    showMode('time');
  };




  nextStep = () => {
    Moment.locale('en');
    const { next, saveState } = this.props;
    // Save state for use in other steps

    console.warn(this.state.startdate, this.state.enddate)
    saveState({
      startdate: Moment(this.state.startdate).format('llll'),
      enddate: Moment(this.state.enddate).format('llll')
    });
    // Go to next step
     next();
  };

  goBack() {
    const { back } = this.props;
    // Go to previous step
    back();
  }

  componentDidMount() {
    const { getState } = this.props;
    const state = getState();
    this.setState({ data: state })
    this.setState({
      today: new Date(),
    });


  }


  countChange(text) {
    this.setState({ count: 140 - text.length })

  }



  render() {
    Moment.locale('en');
    var left = (
      <Left style={{ flex: 1 }}>
        <Button transparent onPress={this.props.back}>
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
      <Container style={{ backgroundColor: 'transparent' }}>
        <Navbar left={left} title={this.state.data.title} bg='#101023' />
        <Content>
          <View style={styles.container}>
            <View >

              <Text style={styles.titleText}>SET EVENT DATE</Text>
            </View>
            <Text style={styles.titlesubText}>From </Text>
            <View style={styles.item}>
              <Icon
                active
                name="calendar"
                type='entypo'
                color="#fff"
                size={30}
              />

              <TouchableOpacity onPress={()=> this.setState({ show_from_picker: true })}>
              <Text style={styles.date_text}>{Moment(this.state.startdate).format('llll')} </Text>
              </TouchableOpacity>
            
              <DateTimePickerModal
                isVisible={this.state.show_from_picker}
                mode="datetime"
                onConfirm={(date) => this.setState({ show_from_picker: false, startdate: date })}
                onCancel={() => this.setState({ show_from_picker: false })}
              />

            </View>

            <Text style={styles.titlesubText}>To </Text>
            <View style={styles.item}>
              <Icon
                active
                name="calendar"
                type='entypo'
                color="#fff"
                size={30}
              />
               <TouchableOpacity onPress={()=> this.setState({ show_to_picker: true })}>
              <Text style={styles.date_text}>{Moment(this.state.enddate).format('llll')} </Text>
              </TouchableOpacity>
            
              <DateTimePickerModal
                isVisible={this.state.show_to_picker}
                mode="datetime"
                onConfirm={(date) => this.setState({ show_to_picker: false, enddate: date })}
                onCancel={() => this.setState({ show_to_picker: false })}
              />



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
    marginLeft: 20,
    fontFamily: 'NunitoSans-Bold'
  },
  titlesubText: {
    fontSize: 15,
    color: '#8d96a6',
    marginTop: 15,
    marginLeft: 20,
    fontFamily: 'NunitoSans-Bold'
  },
  item: {
    flexDirection: 'row',
    marginTop: 2,
    margin: 15,
    alignItems: 'center',
    paddingRight: 15,
    marginLeft: 20,
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
  },
  date_text:{
    color: '#fff',
    fontSize: 20,
    marginLeft:20
  }
});