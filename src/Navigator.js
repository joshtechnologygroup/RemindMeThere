import React, { Component } from 'react';
import {
  AsyncStorage,
  View,
  Text,
  StyleSheet
} from 'react-native';

import { StackNavigator, NavigationActions } from 'react-navigation';

import Home from './home/Home';
import ReminderLocator from './ReminderLocator.js';

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
  ReminderLocator: {
    screen: ReminderLocator
  }
}, {
  initialRouteName: 'Root',
  headerMode: 'none',
  onTransitionStart: (transition) => {
    let routeName = transition.scene.route.routeName;
    AsyncStorage.setItem("@transistorsoft:initialRouteName", routeName);
  }
});
