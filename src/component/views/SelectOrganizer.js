// React native and others libraries imports
import React, { Component } from 'react';
import { AsyncStorage, Platform, FlatList, Dimensions, Image, StyleSheet, TouchableOpacity, StatusBar, ImageBackground } from 'react-native';
import { Container, Content, View, Text } from 'native-base';
import { Icon } from 'react-native-elements'
import Carousel, { Pagination, ParallaxImage } from 'react-native-snap-carousel';
import color from '../color';
import ActivityIndicator from './ActivityIndicator'
import CreateOrganizers from './CreateOrganizers';
const URL = require("../../component/server");


export default class SelectOrganizer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      merchant: 'ay345',
      card_list: [],
      bank_list: [],
      visible: false,
      show_create: false,
      view_balance: false,
      loading: true,
      nodata: false,
      auth: '',
      card_name: '',
      selected_category: 0,
      search: '',
    };
    this.arrayholder = [];
  }

  async componentWillMount() {
    AsyncStorage.getItem('data').then((value) => {
      if (value == '') { } else {
        this.setState({ data: JSON.parse(value) })
        this.setState({ user: JSON.parse(value).user })
      }

      this.getOrganizersRequest()
    })

  }


  getOrganizersRequest() {
    const { data } = this.state
    fetch(URL.url + 'organizers', {
      method: 'GET', headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'Authorization': 'Bearer ' + data.token,
      }
    })
      .then(res => res.json())
      .then(res => {
        this.setState({ loading: false })
        if (res.status) {
          this.setState({
            details: res.data,
            loading: false
          })
        } else {
          this.setState({
            nodata: true,
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

  refreshOrganizersRequest() {
    const { data } = this.state
    console.warn(URL.url + 'organizers');

    fetch(URL.url + 'organizers', {
      method: 'GET', headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'Authorization': 'Bearer ' + data.token,
      }
    })
      .then(res => res.json())
      .then(res => {
        console.warn(res);
        this.setState({ loading: false })
        if (res.status) {
          this.setState({
            details: res.data,
          })
        } else {
          this.setState({
            nodata: true,
            loading: false
          })
        }
      })
      .catch(error => {
        console.warn(error);
        this.setState({ loading: false })
      });
  };




  searchFilterFunction = search => {
    this.setState({ search });
    const newData = this.arrayholder.filter(item => {
      const itemData = `${item.name.toUpperCase()}`;
      const textData = search.toUpperCase();
      return itemData.indexOf(textData) > -1;
    });
    this.setState({
      bank_list: newData,
    });

  };

  render() {
    const { onClose, items } = this.props;

    return (
      <>
        <View style={styles.container}>
          <View style={{ flexDirection: 'row', alignItems: 'center', paddingTop: 1, paddingBottom: 10 }}>
            <TouchableOpacity onPress={() => onClose()} style={{ marginLeft: 10, backgroundColor: '#000' }}>
              <Icon
                name="close"
                size={20}
                type='antdesign'
                color="#fff"
              />
            </TouchableOpacity>
            <View style={{ paddingTop: 1, paddingBottom: 10, flex: 1, alignItems: 'center' }}>
              <Text style={{ fontFamily: 'Montserrat-Bold', color: '#fff', fontSize: 17, textAlign: 'left', paddingBottom: 10, marginTop: 25, }}>All Organizers </Text>
            </View>
            <TouchableOpacity style={{ marginLeft: 10, marginRight: 20, backgroundColor: '#000' }}>

            </TouchableOpacity>

          </View>

          <View style={{ paddingTop: 1, paddingBottom: 10, flex: 1, }}>
            {!this.state.nodata ? <FlatList
              style={{ paddingBottom: 5 }}
              data={this.state.details}
              renderItem={this.renderItem}
              keyExtractor={item => item.id}
              ItemSeparatorComponent={this.renderSeparator}
              ListHeaderComponent={this.renderHeader}
            />
              :
              <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#000' }}>
                <View style={styles.welcome}>
                  <Image
                    style={styles.logo}
                    source={require('../../assets/empty.png')} />
                  <Text style={{ fontSize: 15, color: '#fff' }}>You dont have any organizer at the moment </Text>

                </View>
              </View>
            }
            <TouchableOpacity style={styles.fab} onPress={() => [this.setState({ show_create: true })]}>
              <Icon
                active
                name="plus"
                type='feather'
                color='green'
                size={25}
              />
            </TouchableOpacity>
          </View>


        </View>
        {this.state.show_create ? this.renderCreateOrganizers() : null}
        {this.state.loading ? <ActivityIndicator message={'getting organizers'} color={color.primary_color} /> : null}
      </>

    );
  }




  _handleCategorySelect = (index) => {
    const { onSelect, } = this.props;
    onSelect(index);
  }

  renderItem = ({ item, }) => {
    return (
      <TouchableOpacity style={{ marginLeft: 20, marginRight: 20, marginBottom: 10 }}
        onPress={() => this._handleCategorySelect(item)} underlayColor="red">
        <View style={{ flex: 1, flexDirection: 'row' }}>
          <Text style={styles.nameList}>{item.name}</Text>
          <Icon
            active
            name="dots-vertical"
            type='material-community'
            color='#FFF'
          />
        </View>

      </TouchableOpacity>

    )

  }


  onSelect(operation) {
    this.setState({ show_create: false, details: operation })
  }

  renderCreateOrganizers() {
    return (
      <CreateOrganizers
        onSelect={(operation) => this.onSelect(operation)}
        onClose={() => this.setState({ show_create: false })} />
    )
  }
}


SelectOrganizer;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    position: 'absolute',
    backgroundColor: '#000'


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
    paddingRight: 30, // to ensure the text is never behind the icon
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
    bottom: 30,
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