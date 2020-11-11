import Geocoder from 'react-native-geocoding';
navigator.geolocation = require('@react-native-community/geolocation');
Geocoder.init("AIzaSyBuEYeKLbJ0xnFwHKT-z2Kq174a3f7u4ac");

export const getLocation = () => {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (data) => resolve(data.coords),
      (err) => reject(err),
    );
  });
};

export const geocodeLocationByName = (locationName) => {
  return new Promise((resolve, reject) => {
    Geocoder.from(locationName)
      .then((json) => {
        const addressComponent = json.results[0].geometry.location;
        resolve(addressComponent);
      })
      .catch((error) => reject(error));
  });
};

export const geocodeAddressByName = (locationName) => {
  return new Promise((resolve, reject) => {
    Geocoder.from(locationName)
      .then((json) => {
        const addressComponent = json.results[0].geometry.location;
        resolve(addressComponent);
      })
      .catch((error) => reject(error));
  });
};

export const geocodeLocationByCoords = (lat, long) => {
  return new Promise((resolve, reject) => {
    Geocoder.from(lat, long)
      .then((json) => {
        const addressComponent = json.results[0].address_components[0];
        resolve(addressComponent);
      })
      .catch((error) => reject(error));
  });
};

export const geocodeLocationByName_ = async (location) => {
  Geocoder.from(location)
    .then((json) => {
      const addressComponent = json.results[0].geometry.location;
      return addressComponent
    })
    .catch((error)=>{
      return error
    })
};
