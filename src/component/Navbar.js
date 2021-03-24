/**
* This is the navbar component
* example of usage:
*   var left = (<Left><Button transparent><Icon name='menu' /></Button></Left>);
*   var right = (<Right><Button transparent><Icon name='menu' /></Button></Right>);
*   <Navbar left={left} right={right} title="My Navbar" />
**/

// React native and others libraries imports
import React, { Component } from 'react';
import { Header, Body, Title, Left, Right, Icon } from 'native-base';
import { View, Text, TouchableOpacity } from 'react-native';
// Our custom files and classes import

import colors from '../component/color';

export default class Navbar extends Component {
  render() {
    const { title, left, right, bg } = this.props
    return(
      <View style={{ backgroundColor: bg }}>
        <View style={styles.header}>
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginRight: 15,
            marginLeft: 15,
          }}>
            {left}
            <View style={{ justifyContent: 'flex-start', alignItems: 'flex-start', flex:1 }}>
              <Text style={styles.title}>{title}</Text>
            </View>

            {right}
          </View>
        </View>
      </View>
    );
  }
}

const styles = {
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 80,
  },
  title: {
    marginTop: 2,
    marginBottom: 2,
    marginRight: 13,
    marginLeft: 20,
    fontSize: 18,
    color: '#FFF',
    textAlign: 'center',
    fontWeight: '400',
    fontFamily: 'NunitoSans-Bold'
  },
};

