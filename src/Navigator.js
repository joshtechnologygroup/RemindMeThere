import React, { Component } from 'react';
import {
  AsyncStorage,
  View,
  Text,
  StyleSheet
} from 'react-native';

import { StackNavigator, NavigationActions } from 'react-navigation';

import Home from './home/Home';
import LocationController from './LocationController.js';
import ReminderController from './ReminderController.js';

class Root extends Component<{}> {  
  componentDidMount() {
    let navigation = this.props.navigation;

    AsyncStorage.getItem("@transistorsoft:initialRouteName", (err, page) => {
      let params = {username: undefined};
      if (!page) {
        // Default route:  Home
        page = "Home";
        AsyncStorage.setItem("@transistorsoft:initialRouteName", page);
      }
      // Append username to route params.
      AsyncStorage.getItem("@transistorsoft:username", (err, username) => {
        // Append username to route-params
        if (username) { params.username = username; }
        navigation.dispatch(NavigationActions.reset({
          index: 0,
          key: null,
          actions: [
            NavigationActions.navigate({ routeName: page, params: params})
          ]
        }));        
      });
    });

//    BackAndroid.addEventListener("hardwareBackPress", () => {
//      if (navigator.getCurrentRoutes().length > 1) {
//        navigator.pop()
//        return true // do not exit app
//      } else {
//        return false // exit app
//      }
//    })
  }
  render() {
    return (<View></View>);
  }
}

export default Navigator = StackNavigator({
  Root: {
    screen: Root,
  },
  Home: {
    screen: Home
  },
  LocationController: {
    screen: LocationController
  },
  ReminderController: {
    screen: ReminderController
  }
}, {
  initialRouteName: 'Root',
  headerMode: 'none',
  onTransitionStart: (transition) => {
    let routeName = transition.scene.route.routeName;
    AsyncStorage.setItem("@transistorsoft:initialRouteName", routeName);
  }
});
