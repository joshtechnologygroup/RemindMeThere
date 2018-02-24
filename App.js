import React, { Component } from 'react';
import { Platform, Text, View, StyleSheet, Image } from 'react-native';
import { Constants, Location, Permissions, MapView } from 'expo';

// You can import from local files
import AssetExample from './components/AssetExample';

// or any pure javascript modules available in npm
import { Card } from 'react-native-elements'; // 0.18.5
import BackgroundGeolocation from "react-native-background-geolocation"; // 2.11.0

import "@expo/vector-icons"; // 6.3.1

export default class App extends Component {
  state = {
    location: null,
    errorMessage: null,
    results: "[]",
    mapRegion: { latitude: 37.78825, longitude: -122.4324, latitudeDelta: 0.0922, longitudeDelta: 0.0421 }
  };

  componentWillMount() {
    if (Platform.OS === 'android' && !Constants.isDevice) {
      this.setState({
        errorMessage: 'Oops, this will not work on Sketch in an Android emulator. Try it on your device!',
      });
    } else {
      // this._getLocationAsync();
      this._getResults();
    }
  }

  _getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      this.setState({
        errorMessage: 'Permission to access location was denied',
      });
    }

    let location = await Location.getCurrentPositionAsync({});
    this.setState({ location });
    let text = 'Waiting..';
    let response = [];
    if (this.state.errorMessage) {
      text = this.state.errorMessage;
      console.log('test');
    } else if (this.state.location) {
      text = JSON.stringify(this.state.location);
      console.log(this.state.location);
      console.log('HERE!!!!!!!hgdh!!');
      console.log(location);
      // let lat = '';
      // let long = '';
      // lat = location.coords.latitude;
      // long = location.coords.longitude;
      // return fetch('https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=28.5032837,77.0859498&radius=5000&type=ATM&keyword=HDFC&key=AIzaSyCXt5crZnOkyCx52RECUnDxWTtOxG6uXi0')
      //  .then((response) => response.json())
      //  .then((responseData) =>
      //  {
      //      this.setState({results: JSON.stringify(responseData.results)});
      //      console.log(this.state.results);
      //   }).catch((error) => {
      //   console.log('In ERROR');
      //   console.error(error);
      // });

      // this.setState({results: searchAtLocation(this.state.location)});
      // console.log(
      //   'sdfghjk'
      // );
      // console.log(this.state.results);
    }
  };

  _getResults = async (location) => {
    // console.log('HERE!!!!!!!!!');
    // console.log(location);
    let lat = '';
    let long = '';
    // let $this = this;
    // lat = location.coords.latitude;
    // long = location.coords.longitude;
    // return fetch('https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=28.5032837,77.0859498&radius=5000&type=ATM&keyword=HDFC&key=AIzaSyCXt5crZnOkyCx52RECUnDxWTtOxG6uXi0')
    //  .then((response) => response.json())
    //  .then((responseData) =>
    //  {
    //      // console.log(this);
    //      this.setState({results: JSON.stringify(responseData.results) } );
    //      console.log($this.state.results);
    //   }).catch((error) => {
    //   console.log('In ERROR');
    //   console.error(error);
    // });
    let test1 = await this.test();
    this.setState({results: test1});
    // console.log(this.state.results);
    // console.log('qwertyuiuytrewertyuiuytrewertyuioi');
  };

  test = async() =>{
    return fetch('https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=28.5032837,77.0859498&radius=500&type=ATM&keyword=SBI&key=AIzaSyCXt5crZnOkyCx52RECUnDxWTtOxG6uXi0')
     .then((response) => response.json())
     .then((responseData) =>
     {
         return(JSON.stringify(responseData.results));
      }).catch((error) => {
      console.log('In ERROR');
      console.error(error);
    });
  };

  _handleMapRegionChange = mapRegion => {
    this.setState({ mapRegion });
  };

  render() {
    console.log('##########')
    // console.log(JSON.parse(this.state.results));
    console.log(typeof(this.state.results));
    console.log('**********');
    // var test = JSON.parse(this.state.results);
    // console.log(test.geometry);
    // JSON.parse(this.state.results).forEach(function(object){
    //   console.log(object);
    // });
    // var test = JSON.stringify(JSON.parse(this.state.results)[0]);


      // <MapView
      //   style={{ alignSelf: 'stretch', height: 200 }}
      //   region={this.state.mapRegion}
      //   onRegionChange={this._handleMapRegionChange}
      // />


    return (
      <View>
          {

            JSON.parse(this.state.results).map(function(object, i){
            var t1 = object.geometry.location.lat || 37.78825;
            var t2 = object.geometry.location.lng || 37.78825;

            // var t3 = JSON.stringify(object.name) || '';
            // var t4 = JSON.stringify(object.vicinity) || '';
            return(
              <View>
            <MapView key={i}
              style={{ alignSelf: 'stretch', height: 200 }}
              region={{latitude: t1, longitude:t2, latitudeDelta: 0.0922, longitudeDelta: 0.0421 }}
              showsUserLocation="true"
              showsPointsOfInterest="true"
              zoom={200}
            >

            <MapView.Marker key={i}
              coordinate={{latitude: t1, longitude:t2, latitudeDelta: 0.0922, longitudeDelta: 0.0421}}
              // title={t3}
              // description={t4}
            />
            </MapView>

            </View>
          )})}
      </View>
    );
  }
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#ecf0f1',
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#34495e',
  },
});
