import React, { Component } from 'react';
import { Platform, Text, View, StyleSheet } from 'react-native';
import { Constants, Location, Permissions } from 'expo';

// You can import from local files
import AssetExample from './components/AssetExample';

// or any pure javascript modules available in npm
import { Card } from 'react-native-elements'; // 0.18.5
import BackgroundGeolocation from "react-native-background-geolocation";

export default class App extends Component {
  state = {
    location: null,
    errorMessage: null,
    results: []
  };

  componentWillMount() {
    if (Platform.OS === 'android' && !Constants.isDevice) {
      this.setState({
        errorMessage: 'Oops, this will not work on Sketch in an Android emulator. Try it on your device!',
      });
    } else {
      this._getLocationAsync();
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
    } else if (this.state.location) {
      text = JSON.stringify(this.state.location);
      console.log(this.state.location);
      console.log('HERE!!!!!!!!!');
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
    console.log(test1);
    this.setState({results: test1});
    console.log(this.state.results);
    console.log('qwertyuiuytrewertyuiuytrewertyuioi');
  };

test = async() =>{
  return fetch('https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=28.5032837,77.0859498&radius=5000&type=ATM&keyword=HDFC&key=AIzaSyCXt5crZnOkyCx52RECUnDxWTtOxG6uXi0')
   .then((response) => response.json())
   .then((responseData) =>
   {
       // console.log(this);
       return JSON.stringify(responseData.results);
       // console.log($this.state.results);
    }).catch((error) => {
    console.log('In ERROR');
    console.error(error);
  });
};

  render() {
    return (
      <View style={styles.container}>
        <Text>{this.state.results}</Text>

        <MapView
           style={{ alignSelf: 'stretch', height: 200 }}
           region={this.state.mapRegion}
           onRegionChange={this._handleMapRegionChange}
         />
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
