import React, { Component } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Alert,
  Image, TouchableOpacity, NativeModules, Dimensions
} from 'react-native';


import RNPickerSelect from 'react-native-picker-select';
var ImagePicker = NativeModules.ImageCropPicker;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  button: {
    backgroundColor: 'blue',
    marginBottom: 10
  },
  text: {
    color: 'white',
    fontSize: 20,
    textAlign: 'center'
  }
});



const sports = [
  {
    label: 'Football',
    value: 'football',
  },
  {
    label: 'Baseball Baseball Baseball Baseball',
    value: 'baseball',
  },
  {
    label: 'Hockey',
    value: 'hockey',
  },
];


export default class test extends Component {

  constructor() {
    super();
    this.state = {
      image: null,
      displa_url: null,
      TextHolder: "Resources\\Banners\\12_021020200444AM.png",
      numbers: [
        {
          label: '1',
          value: 1,
          color: 'orange',
        },
        {
          label: '2',
          value: 2,
          color: 'green',
        },
      ],
      favSport0: undefined,
      favSport1: undefined,
      favSport2: undefined,
      favSport3: undefined,
      favSport4: 'baseball',
      previousFavSport5: undefined,
      favSport5: null,
      favNumber: undefined,
    };
  }


  componentDidMount() {

    this.ReplaceTextFunction();

  }


  ReplaceTextFunction = () => {

    var SampleText = this.state.TextHolder.toString();

    var NewText = SampleText.replace("Resources", "assets");

    this.setState({ TextHolder: NewText });

  }

  pickSingleWithCamera(cropping, mediaType = 'photo') {
    ImagePicker.openCamera({
      cropping: cropping,
      width: 500,
      height: 350,
      includeExif: true,
      mediaType,
    }).then(image => {
      console.log('received image', image);
      this.setState({
        image: { uri: image.path, width: image.width, height: image.height, mime: image.mime },
      });
      this.uploadPhoto('http://hg.freewave.ng/api/events/upload-banner', image)
    }).catch(e => alert(e));
  }



  pickSingle(cropit, circular = false, mediaType) {
    ImagePicker.openPicker({
      width: 500,
      height: 350,
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
      this.uploadPhoto('http://hg.freewave.ng/api/events/upload-banner', image);
    }).catch(e => {
      console.log(e);
      Alert.alert(e.message ? e.message : e);
    });
  }


  uploadPhoto = (url, photo_uri) => {
    console.warn('url', photo_uri.mime);

    const data = new FormData();

    data.append('uploadedFile', {
      uri: photo_uri.path,
      type: photo_uri.mime,
      name: 'uploadedFile',
    });
    data.append('Content-Type', 'image/png');

    //build payload packet
    var postData = {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1bmlxdWVfbmFtZSI6IjEyIiwicm9sZSI6IkN1c3RvbWVyIiwibmJmIjoxNTgxMDY4NjMyLCJleHAiOjE1ODE2NzM0MzIsImlhdCI6MTU4MTA2ODYzMn0.eqC79eKWHAK8eouOJ5tM_J_jHPnxrYZ54OZQnmtX1tY',
      },
      body: data,
    }

    return fetch(url, postData)
      .then((response) => response.json())
      .then((responseJson) => {

        console.warn('responseJson', responseJson.data);
        this.setState({
          displa_url: 'http://hg.freewave.ng/'+ responseJson.data.replace("Resources", "assets"),
        });


      })
      .catch((error) => {
        // Alert.alert('Login failed',  "Something went wrong pls try again", [{ text: 'Okay' }])
        console.warn('error', error);

      });


  }

 

  render() {

    const placeholder = {
      label: 'Select a sport...',
      value: null,
      color: '#9EA0A4',
    };
    const { displa_url } = this.state;

    return (
      <View style={styles.container}>
        <View>
          {displa_url && (
            <Image
              source={{ uri: displa_url }}
              style={{ width: 300, height: 300 }}
            />
          )}
        </View>

        <View>
          <Text style={{ fontSize: 20, textAlign: 'center', marginBottom: 20 }}> {this.state.TextHolder}</Text>
          <Text>{this.state.displa_url}</Text>
          
          <Text>set useNativeAndroidPickerStyle to false</Text>
          <RNPickerSelect
            placeholder={placeholder}
            items={sports}
            onValueChange={value => {
              this.setState({
                favSport1: value,
              });
            }}
            style={pickerSelectStyles}
            value={this.state.favSport1}
            useNativeAndroidPickerStyle={false}

          />
        </View>
        <TouchableOpacity onPress={() => this.pickSingleWithCamera(true)} style={styles.button}>
          <Text style={styles.text}>Select Single With Camera With Cropping</Text>
        </TouchableOpacity>


        <TouchableOpacity onPress={() => this.pickSingle(true)} style={styles.button}>
          <Text style={styles.text}>Select Single With Cropping</Text>
        </TouchableOpacity>



      </View>);
  }
}
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
    borderWidth: 0.5,
    borderColor: 'purple',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
});