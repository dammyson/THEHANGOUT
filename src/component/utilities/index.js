import { AsyncStorage } from 'react-native';


export const getSaveRestaurant = async () => {
  return AsyncStorage.getItem('currentRES')
};

export const getData = async () => {
  return AsyncStorage.getItem('data')
};


export const getUser = async () => {
  return AsyncStorage.getItem('user')
};

export const getBalance = async () => {
  return AsyncStorage.getItem('bal')
};

export const getToken = async () => {
  return AsyncStorage.getItem('fcmToken')
};



export const getIsGuest = async () => {
  return AsyncStorage.getItem('is_guest')
};

export const getHeaders = (is_guest, token) => {

  let autorised_headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'Authorization': 'Bearer ' + token,
  }
  
  let normal_headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  }

  let headers = is_guest ? normal_headers : autorised_headers

  return headers

};



