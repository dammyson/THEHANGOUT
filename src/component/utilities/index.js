import { AsyncStorage } from 'react-native';


export const getSaveRestaurant = async () => {
  return AsyncStorage.getItem('currentRES')
};

export const getData = async () => {
  return AsyncStorage.getItem('data')
};



