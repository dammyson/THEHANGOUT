import React, { Component } from "react";
import { Image, Dimensions, ImageBackground, NativeModules, TouchableOpacity, TextInput, AsyncStorage, StyleSheet, Alert, ScrollView } from "react-native";
import { Container, Content, View, Text, Button, Left, Right, Body, Toast, List, ListItem, } from 'native-base';
import { Icon, } from 'react-native-elements'
import { Actions } from 'react-native-router-flux';
import { getSaveRestaurant, getData } from '../../component/utilities';
import { BarIndicator, } from 'react-native-indicators';


import color from '../../component/color';
const { width: screenWidth } = Dimensions.get('window')
const URL = require("../../component/server");

import RNPickerSelect from 'react-native-picker-select';
var ImagePicker = NativeModules.ImageCropPicker;
import Navbar from '../../component/Navbar';
import AddOn from "./AddOn";



export default class step5 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      show_add_on: false,
      add_ons: [],
      cat_list: [],
      details: '',
      data: '',
      name: '',
      description: '',
      price: '',
      delivery: '',
      min: '',
      max: '',
      img_url: null,
      image: null,
      type: '',
      cat: '',
      restaurant: null
    };
  }



  goBack() {
    const { goBack } = this.props.navigation;
    goBack(null)
  }


  countChange(text) {
    this.setState({ count: 140 - text.length })
  }

  async componentWillMount() {
    this.setState({
      data: JSON.parse(await getData()),
      user: JSON.parse(await getData()).data
    })

    const { data_moving } = this.props.route.params;
    console.warn(data_moving)

    this.setState({
      name: data_moving.name,
      description: data_moving.description,

    })
    this.setState({
      restaurant: JSON.parse(await getSaveRestaurant())
    })

    this.getCatRequest()

  }




  pickSingle(cropit, circular = false, mediaType) {
    ImagePicker.openPicker({
      width: 500,
      height: 300,
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


    const { image, data, name } = this.state

    if (image == null || name == "") {
      Alert.alert('Validation failed', 'Select atleast a picture and enter name', [{ text: 'Okay' }])
      return
    }
    Toast.show({
      text: 'uploading picture... !',
      position: 'bottom',
      type: 'warning',
      buttonText: 'Dismiss',
      duration: 2500
    });
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

        console.warn('responseJson', responseJson.data);
        this.setState({
          img_url: 'http://hg.freewave.ng/' + responseJson.data.replace("Resources", "assets"),
        });
        Toast.show({
          text: 'Picture uploaded sucessfully !',
          position: 'bottom',
          type: 'success',
          buttonText: 'Dismiss',
          duration: 2500
        });
      })
      .catch((error) => {
        Alert.alert('Login failed', "Something went wrong pls try again", [{ text: 'Okay' }])
        console.warn('error', error);

      });

  }

  pluck(arr, key) {
    return arr.reduce(function (p, v) {
      return p.concat(v[key]);
    }, []);
  }



  getCatRequest() {
    const { data } = this.state
    this.setState({
      loading: true,
    })
    fetch(URL.url + 'categories/Restaurants', {
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
            loading: false,
          })
          this.sortCat(res.data);
        } else {
          this.setState({
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



  sortCat(list) {
    const { restaurant } = this.state
    let instant_array = [];
    let ids = restaurant.cat_id;
    for (let i = 0; i < list.length; i++) {
      if (ids.includes(list[i].id)) {

        instant_array.push(
          {
            label: list[i].name,
            value: list[i].id,
          }
        )
      }
    }
    this.setState({ cat_list: instant_array })
  }

  async processCreateMenu() {

    const { data, name, description, price, max, min, add_ons, delivery, img_url, cat, image, restaurant } = this.state

    if (name == "" || description == '' || price == '' || max == '' || min == '' || delivery == '') {
      Alert.alert('Validation failed', 'field(s) cannot be empty', [{ text: 'Okay' }])
      return;
    }
    if (image == null) {
      Alert.alert('Validation failed', 'Please select and image for the menu', [{ text: 'Okay' }])
      return;
    } else {
      if (img_url == "") {
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
    if (add_ons.length > 1) {
      var add_ons_id = this.pluck(add_ons, 'id')
    } else {

    }


    var request_body = JSON.stringify({
      Name: name,
      Description: description,
      Amount: price,
      AddOns: add_ons_id,
      DeliveryFee: delivery,
      MinOrder: min,
      MaxOrder: max,
      BannerUrl: img_url,
      RestaurantId: restaurant.id,
      CategoryId: cat,
    })


    this.setState({ loading: true })
    fetch(URL.url + 'food/menu/add', {
      method: 'POST', headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'Authorization': 'Bearer ' + data.token,
      }, body: request_body,
    })
      .then(res => res.json())
      .then(res => {
        console.warn("kaikkk", res);
        if (res.status) {
          this.setState({ loading: false })
          Toast.show({
            text: 'Event added sucessfully !',
            position: 'bottom',
            type: 'success',
            buttonText: 'Dismiss',
            duration: 3000
          });
          this.props.navigation.replace('res_service_details', { id: restaurant.id })
        } else {
          Alert.alert('Operation failed', res.message, [{ text: 'Okay' }])
          this.setState({ loading: false })
        }
      }).catch((error) => {
        console.warn(error);
        this.setState({ loading: false })
        alert(error.message);
      });
  }

  render() {
    if (this.state.loading) {
      return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#000000' }}>
          <View style={styles.welcome}>
            <Text style={{ fontSize: 15, color: '#fff' }}>Processing For Restaurant</Text>
            <BarIndicator count={4} color={color.primary_color} />
            <Text style={{ fontSize: 13, flex: 1, color: '#fff' }}>Please wait...</Text>
          </View>
        </View>
      );
    }

    return (
      <View style={{ flex: 1 }} >

        {this.state.show_add_on ?
          this.add_add_on()
          : this.step3Content()
        }
      </View>

    );
  }

  step3Content() {

    const catPlaceholder = {
      label: 'Select a category...',
      value: null,
      color: '#000',
    };
    const typePlaceholder = {
      label: 'Select type...',
      value: null,
      color: '#000',
    };

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
        <Navbar left={left} title={this.state.name} bg='#101023' />
        <Content>
          <View style={styles.container}>
            <View >

              <Text style={styles.titleText}>CONFIRM MENU DETAILS</Text>
            </View>

            {this.state.image == null ?
              <ImageBackground
                style={styles.pictureContainer}>
                <Button transparent onPress={() => this.pickSingle(true)}>
                  <Icon
                    active
                    name="camera"
                    type='feather'
                    color='#000'
                    size={40}
                  />
                </Button>

                <Text style={{ fontSize: 14, color: '#000', }}>Add Menu Poster/Image </Text>
              </ImageBackground>
              :
              <ImageBackground
                opacity={this.state.img_url != null ? 1 : 0.5}
                source={this.state.img_url != null ? { uri: this.state.img_url } : this.state.image}
                style={[styles.pictureContainer, { backgroundColor: "#000" }]}>
                <Button transparent onPress={() => this.pickSingle(true)}>
                  <Icon
                    active
                    name="camera"
                    type='feather'
                    color='#000'
                    size={40}
                  />
                </Button>

                <Text style={{ fontSize: 14, color: '#000', }}>Add Menu Poster/Image </Text>
              </ImageBackground>
            }

            <View style={[styles.oneRow, { marginTop: 20 }]}>
              <View style={{ margin: 20, }}>
                <Icon
                  active
                  name="align-left"
                  type='feather'
                  color='#FFF'
                  size={30}
                />
              </View>
              <View style={{ flex: 1 }}>
                <View>
                  <Text style={styles.hintText}> Event Name </Text>
                </View>
                <View style={styles.item}>
                  <TextInput
                    placeholder="Enter Menu name"
                    placeholderTextColor='#fff'
                    returnKeyType="next"
                    keyboardType='default'
                    autoCapitalize="none"
                    autoCorrect={false}
                    style={styles.menu}
                    defaultValue={this.state.name}
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
                    placeholderTextColor='#fff'
                    returnKeyType="next"
                    keyboardType='default'
                    autoCapitalize="none"
                    autoCorrect={false}
                    style={styles.menu}
                    defaultValue={this.state.description}
                    onChangeText={text => this.setState({ description: text })}
                  />
                </View>
              </View>
            </View>

            <View style={styles.oneRow}>

              <View style={{ marginLeft: 75, flex: 1 }}>
                <View>
                  <Text style={styles.hintText}>Menu Category </Text>
                </View>
                <View style={styles.item}>
                  <RNPickerSelect
                    placeholder={catPlaceholder}
                    items={this.state.cat_list}

                    onValueChange={value => {
                      this.setState({
                        cat: value,
                      });
                    }}
                    style={pickerSelectStyles}
                    value={this.state.cat}
                    useNativeAndroidPickerStyle={false}

                  />
                </View>
              </View>
            </View>

            <View style={styles.oneRow}>

              <View style={{ marginLeft: 75, flex: 1, }}>
                <View>
                  <Text style={styles.hintText}>Price </Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <View style={styles.item}>
                    <TextInput
                      placeholder="5000"
                      placeholderTextColor='#ffffff60'
                      returnKeyType="next"
                      keyboardType='default'
                      autoCapitalize="none"
                      autoCorrect={false}
                      style={styles.menu}
                      defaultValue={this.state.price}
                      onChangeText={text => this.setState({ price: text })}
                    />

                  </View>
                  <View style={{ flex: 1, }}></View>
                </View>
              </View>
            </View>
            <View style={styles.oneRow}>

              <View style={{ marginLeft: 75, flex: 1, }}>
                <View>
                  <Text style={styles.hintText}>Delivery Price</Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <View style={styles.item}>
                    <TextInput
                      placeholder="5000"
                      placeholderTextColor='#ffffff60'
                      returnKeyType="next"
                      keyboardType='default'
                      autoCapitalize="none"
                      autoCorrect={false}
                      style={styles.menu}
                      defaultValue={this.state.delivery}
                      onChangeText={text => this.setState({ delivery: text })}
                    />

                  </View>
                  <View style={{ flex: 1, }}></View>
                </View>
              </View>
            </View>
            <View style={styles.oneRow}>
              <View style={{ marginLeft: 75, flex: 1 }}>
                <View style={{ flexDirection: 'row', marginRight: 55, marginBottom: 10 }}>
                  <View style={{ flex: 1, }}>
                    <Text style={styles.hintText}>Add-Ons </Text>
                  </View>
                  <TouchableOpacity onPress={() => this.setState({ show_add_on: true })} ><Icon
                    active
                    name="pluscircle"
                    type='antdesign'
                    color='#fff'

                  /></TouchableOpacity>
                </View>

                <ScrollView horizontal style={{}}>

                  {this.renderResuts(this.state.add_ons)}

                </ScrollView>
              </View>
            </View>

            <View style={styles.oneRow}>

              <View style={{ marginLeft: 75, flex: 1, }}>
                <Text style={[styles.hintText]}>Number of Orders </Text>
                <View>
                  <Text style={[styles.hintText, { color: color.primary_color }]}>Minimum </Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <View style={styles.item}>
                    <TextInput
                      placeholder="1"
                      placeholderTextColor='#ffffff60'
                      returnKeyType="next"
                      keyboardType='default'
                      autoCapitalize="none"
                      autoCorrect={false}
                      style={styles.menu}
                      defaultValue={this.state.min}
                      onChangeText={text => this.setState({ min: text })}
                    />

                  </View>
                  <View style={{ flex: 1, }}></View>
                </View>
              </View>
            </View>

            <View style={styles.oneRow}>

              <View style={{ marginLeft: 75, flex: 1, }}>
                <View>
                  <Text style={[styles.hintText, { color: color.primary_color }]}>Maximum </Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <View style={styles.item}>
                    <TextInput
                      placeholder="2"
                      placeholderTextColor='#ffffff60'
                      returnKeyType="next"
                      keyboardType='default'
                      autoCapitalize="none"
                      autoCorrect={false}
                      style={styles.menu}
                      defaultValue={this.state.max}
                      onChangeText={text => this.setState({ max: text })}
                    />

                  </View>
                  <View style={{ flex: 1, }}></View>
                </View>
              </View>
            </View>

            <View>
            </View>


          </View>
        </Content>
        <TouchableOpacity style={styles.fab} onPress={() => this.processCreateMenu()}>
          <Icon
            active
            name="check"
            type='feather'
            color='green'
            size={25}
          />
        </TouchableOpacity>
      </Container>


    )
  }



  add_add_on() {
    return (
      <AddOn
        onSuccess={(data) => this.handleSuccessAddAddON(data)}
        onClose={() => this.setState({ show_add_on: false })} />
    )
  }

  handleSuccessAddAddON(data) {
    this.setState({ show_add_on: false })
    var instant_array = []
    instant_array = this.state.add_ons
    instant_array.push(data)
    this.setState({ add_ons: instant_array })

  }
  _handleCategorySelect = (index) => {
    this.setState({ org: index.id, org_name: index.name, view_organizer: false });

  }
  renderResuts(data) {

    let cat = [];
    for (var i = 0; i < data.length; i++) {
      cat.push(
        <View style={[styles.terms_container]}>
          {!this.state.agree ?
            <TouchableOpacity onPress={() => this.setState({ agree: true })} style={[{
            }]}>
              <Icon
                name="check-square"
                type='feather'
                size={18}
                color={color.white}
              />
            </TouchableOpacity>
            :
            <TouchableOpacity onPress={() => this.setState({ agree: false })} style={[{
            }]}>

              <Icon
                name="check-square"
                type='feather'
                size={18}
                color={color.green}
              />
            </TouchableOpacity>

          }

          <Text style={{ color: color.white, fontSize: 12, fontWeight: '200', marginLeft: 5 }}>{data[i].name} </Text>

        </View>

      );
    }
    return cat;
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
  pictureContainer: {
    height: Dimensions.get('window').height / 4,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#8d96a6',
    margin: 10,
  },
  oneRow: {
    flexDirection: "row",
    marginBottom: 15,
    width: Dimensions.get('window').width,
  },
  hintText: {
    fontSize: 12,
    color: '#ffffff',
    opacity: 0.6
  },
  importText: {
    fontSize: 12,
    color: '#8d96a6',
  },
  item: {
    flexDirection: 'row',
    borderColor: '#8d96a6',
    borderBottomWidth: 0.6,
    alignItems: 'center',
    marginRight: 30,
    flex: 1,

  },
  menu: {
    flex: 1,
    fontSize: 15,
    color: '#ffffff',
    textAlign: 'left',
    fontFamily: 'NunitoSans-Bold',
  },
  itemTwo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 30,

  },
  inputPicker: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: 'purple',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30,
  },
  modal: {
    width: Dimensions.get('window').width,
    height: URL.height,
    backgroundColor: "#010113"

  },
  nameList: {
    fontSize: 17,
    color: '#ffffff',
    flex: 1,
    marginLeft: 10
  },
  ticketContainer: {
    backgroundColor: '#111124',
    borderRadius: 4,
    margin: 10,
    borderWidth: 1,
    borderColor: '#5f5c7f',
    shadowRadius: 2,
    shadowOffset: {
      height: 10,
      width: 10
    }
  },
  fab: {
    height: 60,
    width: 60,
    borderRadius: 200,
    position: 'absolute',
    bottom: 10,
    right: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  welcome: {
    height: 90,
    alignItems: 'center',
    justifyContent: 'center',
  },
  terms_container: {
    flexDirection: 'row',

    marginRight: 10,
    marginTop: 10,
    marginBottom: 10,
  },
});
const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
    color: '#fff',
    paddingRight: 30, // to ensure the text is never behind the icon
  },

});

