import React, { Component } from "react";
import { Alert, Dimensions, TouchableOpacity, TextInput, StyleSheet, AsyncStorage,ActivityIndicator, NativeModules,} from "react-native";
import { Container, Content, View, Text, Button, Left, Toast, Body, Title, List, ListItem, } from 'native-base';
import { Avatar, Badge, } from 'react-native-elements';
import { Card, Icon, SocialIcon } from 'react-native-elements'
import Carousel, { Pagination, ParallaxImage } from 'react-native-snap-carousel';
import { Actions } from 'react-native-router-flux';
const deviceHeight = Dimensions.get("window").height;
const URL = require("../../component/server");
import {
  BarIndicator,
} from 'react-native-indicators';

import color from '../../component/color';
const { width: screenWidth } = Dimensions.get('window')
import Navbar from '../../component/Navbar';
var ImagePicker = NativeModules.ImageCropPicker;
export default class step2 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data:'',
      name: '',
      description: '',
      website: '',
      twitter: '',
      facebook: '',
      img_url:'',
      image: null,
    };
  }



  componentWillMount() {
    AsyncStorage.getItem('data').then((value) => {
      if (value == '') { } else {
        this.setState({ data: JSON.parse(value) })
        this.setState({ user: JSON.parse(value).user })
      }
      console.warn(this.state.data.user);
    })
 

  }

  pickSingle(cropit, circular = false, mediaType) {
    ImagePicker.openPicker({
      width: 400,
      height: 400,
      cropping: cropit,
      cropperCircleOverlay: circular,
      sortOrder: 'none',
      compressImageMaxWidth: 1000,
      compressImageMaxHeight: 1000,
      compressImageQuality: 1,
      includeExif: true,
    }).then(image => {
      console.log('received image', image);
      this.setState({
        image: { uri: image.path, width: image.width, height: image.height, mime: image.mime },
      });
     this.uploadPhoto();
    }).catch(e => {
      console.log(e);
      Alert.alert(e.message ? e.message : e);
    });
  }


  uploadPhoto = () => {
    const { image, data, name} = this.state
   
    if (image == null) {
      Alert.alert('Validation failed', 'Select atleast a picture and enter name', [{ text: 'Okay' }])
      return
    }

    const datab = new FormData();

    datab.append('uploadedFile', {
      uri: image.uri,
      type: image.mime,
      name: 'uploadedFile',
    });
    datab.append('Content-Type', image.mime);
   
    //build payload packet
    var postData = {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': 'Bearer ' + data.token,
      },
      body: datab,
    }

    return fetch(URL.url + 'events/upload-banner', postData)
      .then((response) => response.json())
      .then((responseJson) => {

        Toast.show({
          text: 'Picture uploaded sucessfully !',
          position: 'bottom',
          type: 'success',
          buttonText: 'Dismiss',
          duration: 2500
      });
        this.setState({
          img_url: 'http://hg.freewave.ng/'+ responseJson.data.replace("Resources", "assets"),
        });
       
      })
      .catch((error) => {
        Alert.alert('Login failed',  "Something went wrong pls try again", [{ text: 'Okay' }])
        console.warn('error', error);

      });


  }

  processAddOrganizer() {

    const { data, name,image, description, website, twitter, facebook, img_url} = this.state
    if (name == "" ) {
      Alert.alert('Validation failed', 'field(s) cannot be empty', [{ text: 'Okay' }])
      return;
    }

    if (image == null ) {
      Alert.alert('Validation failed', 'Please select and image for the organizer', [{ text: 'Okay' }])
      return;
    }else{
      if (img_url == "" ) {
        Toast.show({
          text: 'Please wait forimage to upload !',
          position: 'bottom',
          type: 'error',
          buttonText: 'Dismiss',
          duration: 2500
      });
        return;
      }
    }



  
    console.warn(data);
   
    this.setState({ loading: true })
    console.warn(URL.url + 'register');

    fetch(URL.url + 'organizers/create', {
      method: 'POST', headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'Authorization': 'Bearer ' + data.token,
      }, body: JSON.stringify({
        Name:name,
        Description: description,
        Facebook: facebook,
        BannerUrl: img_url,
        Twitter: twitter,
        Website: website,
      }),
    })
      .then(res => res.json())
      .then(res => {
        console.warn(res);
        if (res.status) {
          this.setState({ loading: false })
          Actions.pop();
        } else {
          Alert.alert('Registration failed', res.error, [{ text: 'Okay' }])
          this.setState({ loading: false })
        }
      }).catch((error) => {
        console.warn(error);
        alert(error.message);
      });


  }

  render() {

    if (this.state.loading) {
      return (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#000000' }}>
              <View style={{ height: 90,alignItems: 'center',justifyContent: 'center',}}>
                  <Text style={{ fontSize: 15, color: '#fff' }}>Creating organizer</Text>
                  <BarIndicator count={4} color={color.primary_color} />
                  <Text style={{ fontSize: 13, flex: 1, color: '#fff' }}>Please wait...</Text>
              </View>
          </View>
      );
  }

    var left = (
      <Left style={{ flex: 1 }}>
        <Button transparent onPress={()=>Actions.pop()}>
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
      <Container style={{ backgroundColor: '#101023' }}>
        <Navbar left={left} title='Add Organizer' bg='#101023' />
        <Content>
          <View style={styles.container}>

            <View style={styles.pictureContainer}>

               {this.state.image == null ?
                <Avatar
                rounded
                size="xlarge"
                icon={{ name: 'camera', color: '#000', type: 'feather' }}
                overlayContainerStyle={{ backgroundColor: '#000', }}
                onPress={() => this.pickSingle(true)}
                renderPlaceholderContent={<Icon name="camera" type='feather' color='#fff' size={45} />}
              
              />
              :
              <Avatar
              rounded
              size="xlarge"
              icon={{ name: 'camera', color: '#000', type: 'feather' }}
              source={this.state.img_url != '' ? { uri: this.state.img_url } : this.state.image}
              overlayContainerStyle={{ backgroundColor: '#8d96a6', }}
              onPress={() => this.pickSingle(true)}
              renderPlaceholderContent={<Icon name="camera" type='feather' color='#000' size={45} />}
            />
            }
            </View>

            <View style={styles.oneRow}>
              <View style={{ margin: 20, }}>
                <Icon
                  active
                  name="user"
                  type='feather'
                  color='#FFF'
                  size={35}
                />
              </View>
              <View style={{ flex: 1 }}>
                <View>
                  <Text style={styles.hintText}>Name </Text>
                </View>
                <View style={styles.item}>
                  <TextInput
                    placeholder="Enter Organizer name"
                    placeholderTextColor='#8d96a6'
                    returnKeyType="next"
                    onSubmitEditing={() => this.desinput.focus()}
                    keyboardType='default'
                    autoCapitalize="none"
                    autoCorrect={false}
                    style={styles.menu}
                    onChangeText={text => this.setState({ name: text })}
                    
                  />
                </View>
              </View>
            </View>

            <View style={styles.oneRow}>

              <View style={{ marginLeft: 75, flex: 1 }}>
                <View>
                  <Text style={styles.hintText}>Description </Text>
                </View>
                <View style={styles.item}>
                  <TextInput
                    placeholder="Enter description"
                    placeholderTextColor='#8d96a6'
                    returnKeyType="next"
                    onSubmitEditing={() => this.webInput.focus()}
                    keyboardType='default'
                    autoCapitalize="none"
                    autoCorrect={false}
                    style={styles.menu}
                    onChangeText={text => this.setState({ description: text })}
                    ref={(input)=> this.desinput = input}
                  />
                </View>
                <Text style={styles.importText}>optional </Text>
              </View>
            </View>


            <View style={[styles.oneRow, { marginTop: 40 }]}>
              <View style={{ margin: 20, }}>
                <Icon
                  active
                  name="link"
                  type='feather'
                  color='#FFF'
                  size={35}
                />
              </View>
              <View style={{ flex: 1 }}>
                <View>
                  <Text style={styles.hintText}>Website </Text>
                </View>
                <View style={styles.item}>
                  <TextInput
                    placeholder="Enter website link"
                    placeholderTextColor='#8d96a6'
                    returnKeyType="next"
                    onSubmitEditing={() => this.twitterInput.focus()}
                    keyboardType='default'
                    autoCapitalize="none"
                    autoCorrect={false}
                    style={styles.menu}
                    onChangeText={text => this.setState({ website: text })}
                    ref={(input)=> this.webInput = input}
                  />
                </View>
                <Text style={styles.importText}>optional </Text>
              </View>
            </View>

            <View style={styles.oneRow}>

              <View style={{ marginLeft: 75, flex: 1 }}>
                <View>
                  <Text style={styles.hintText}>Twitter </Text>
                </View>
                <View style={styles.item}>
                  <TextInput
                    placeholder="Enter your twitter handle"
                    placeholderTextColor='#8d96a6'
                    returnKeyType="next"
                    onSubmitEditing={() => this.faceInput.focus()}
                    keyboardType='default'
                    autoCapitalize="none"
                    autoCorrect={false}
                    style={styles.menu}
                    onChangeText={text => this.setState({ twitter: text })}
                    ref={(input)=> this.twitterInput = input}
                  />
                </View>
                <Text style={styles.importText}>optional </Text>
              </View>
            </View>

            <View style={styles.oneRow}>

              <View style={{ marginLeft: 75, flex: 1 }}>
                <View>
                  <Text style={styles.hintText}>Facebook</Text>
                </View>
                <View style={styles.item}>
                  <TextInput
                    placeholder="Enter your facebook page"
                    placeholderTextColor='#8d96a6'
                    returnKeyType="next"
                    onSubmitEditing={() => this.processAddOrganizer()}
                    keyboardType='default'
                    autoCapitalize="none"
                    autoCorrect={false}
                    style={styles.menu}
                    onChangeText={text => this.setState({ facebook: text })}
                    ref={(input)=> this.faceInput = input}
                  />
                </View>
                <Text style={styles.importText}>optional </Text>
              </View>
            </View>

    <TouchableOpacity style={styles.fab} onPress={()=>  this.processAddOrganizer()}>
    <Icon
                  active
                  name="check"
                  type='feather'
                  color='green'
                  size={25}
                />
          </TouchableOpacity>
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
  btnContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: "6%"
  },
  item: {
    flexDirection: 'row',
    borderColor: '#8d96a6',
    borderBottomWidth: 0.6,
    alignItems: 'center',
    marginRight: 30,

  },
  menu: {
    flex: 1,
    fontSize: 14,
    color: '#ffffff',
    textAlign: 'left',
    fontFamily: 'NunitoSans-Bold',
  },
  oneRow: {
    flexDirection: "row",
    marginBottom: 10,
    width: Dimensions.get('window').width,
  },
  hintText: {
    fontSize: 13,
    color: '#ffffff',
  },
  importText: {
    fontSize: 12,
    color: '#8d96a6',
  },
  pictureContainer: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height / 4,
    alignItems: 'center',
    justifyContent: 'center'
  },
  fab:{
    height: 60,
    width: 60,
    borderRadius: 200,
    position: 'absolute',
    bottom: 60,
    right: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:'#fff',
  },
  text:{
    fontSize:30,
    color:'white'
  },
});