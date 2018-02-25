import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  View,
  AsyncStorage
} from 'react-native';

import App from './App';

import DeviceInfo from 'react-native-device-info';
import PushNotification from 'react-native-push-notification';

import PushController from './PushController'

import {
  Container,
  Button, Icon,
  Text,
  Header, Footer, Title,
  Content,
  Left, Body, Right,
  Switch
} from 'native-base';

import { MapView } from 'react-native-maps';

import { Row } from 'react-native-easy-grid';

import BackgroundGeolocation from "./react-native-background-geolocation";

export default class LocationController extends Component<{}> {

  constructor(props) {
    super(props);

    this.eventId = 1;

    this.state = {
      enabled: false,
      isMoving: false,
      username: props.navigation.state.params.username,
      results: '[]',
      events: []
    };
  }

  componentDidMount() {
    BackgroundGeolocation.on('location', this.onLocation.bind(this));
//    BackgroundGeolocation.on('motionchange', this.onLocation.bind(this));

    BackgroundGeolocation.configure({
      distanceFilter: 10,
      stopOnTerminate: false,
      startOnBoot: true,
      foregroundService: true,
      heartbeatInterval: 60,
      url: '',
      params: {
      },
      autoSync: true,
      debug: true,
      logLevel: BackgroundGeolocation.LOG_LEVEL_VERBOSE,
      enableHeadless: true
    }, (state) => {
      console.log('- Configure success: ', state);
      this.setState({
        enabled: state.enabled,
        isMoving: state.isMoving
      });
    });
  }

  /**
  * @event location
  */
  async onLocation(location) {
    console.log('[event] location: ', location);
    // console.log('');
    location_json = await this.fetchSearchResults(location.coords.latitude, location.coords.longitude);
    this.addEvent('location', new Date(location.timestamp), location_json);
    this.setState({results: location_json});
    console.log(notification_json)
    console.log('Where!')
//    PushNotification.localNotificationSchedule({
//        message: 'Believe you me' || '',
//        date: new Date(Date.now())
//      });
  }

  onClickGetCurrentPosition() {
    BackgroundGeolocation.getCurrentPosition((location) => {
      console.log('- getCurrentPosition success: ', location);
    }, (error) => {
      console.warn('- getCurrentPosition error: ', error);
    }, {
      persist: true,
      samples: 1,
      maximumAge: 5000
    });
  }

  onClickChangePace() {
    console.log('- onClickChangePace');
    let isMoving = !this.state.isMoving;
    this.setState({isMoving: isMoving});
    BackgroundGeolocation.changePace(isMoving);
  }

  onClickClear() {
    this.setState({events: []});
  }

  /**
  * Add an event to list
  */
  addEvent(name, date, object) {
    let event = {
      key: this.eventId++,
      name: name,
      timestamp: date.toLocaleTimeString(),
      json: JSON.stringify(object, null, 2)
    };
    let rs = this.state.events;
    rs.unshift(event);
    this.setState({
      events: rs
    });
  }

  onToggleEnabled(value) {
    let enabled = !this.state.enabled;
    this.setState({
      enabled: enabled,
      isMoving: false
    });
    if (enabled) {
      BackgroundGeolocation.start();
    } else {
      BackgroundGeolocation.stop();
    }
  }


  renderEvents() {
    return JSON.parse(this.state.results).map(function(object, i){
      var t1 = object.geometry.location.lat || 37.78825;
      var t2 = object.geometry.location.lng || 37.78825;
      PushNotification.localNotificationSchedule({
        message: object.name || '',
        date: new Date(Date.now())
      });

      <View key={i} style={styles.listItem}>
        <Row style={styles.itemHeader}>
          <Left style={{flex:1}}><Text style={styles.eventName}>{object.name}</Text></Left>
        </Row>
        <Row>
        {object.vicinity}
        </Row>
      </View>
    }
    );
  }

  render() {
    return (
      <Container style={styles.container}>
        <Header style={styles.header}>
          <Left>
            <Button small transparent onPress={this.onClickHome.bind(this)}>
              <Icon active name="arrow-back" style={{color: '#000'}}/>
            </Button>
          </Left>
          <Body>
            <Title style={styles.title}>RemindMeThere</Title>
          </Body>
          <Right>
            <Switch onValueChange={() => this.onToggleEnabled()} value={this.state.enabled} />
          </Right>
        </Header>

        <Content style={styles.content}>
          <View style={styles.list}>
            {this.renderEvents()}
          </View>
        </Content>

        <Footer style={styles.footer}>
          <Left style={{flex:0.3}}>
            <Button small info>
              <Icon active name="md-navigate" style={styles.icon} onPress={this.onClickGetCurrentPosition.bind(this)} />
            </Button>
          </Left>
          <Body style={styles.footerBody}>
            <Button small danger bordered onPress={this.onClickClear.bind(this)}><Icon name="trash" /></Button>
          </Body>
          <Right style={{flex:0.3}}>
            <Button small danger={this.state.isMoving} success={!this.state.isMoving} onPress={this.onClickChangePace.bind(this)}>
              <Icon active name={(this.state.isMoving) ? 'pause' : 'play'} style={styles.icon}/>
            </Button>
          </Right>
        </Footer>
        <PushController/>
      </Container>
    );
  }

  /**
  * Navigate back to home-screen app-switcher
  */
  onClickHome() {
    App.goHome(this.props.navigation);
  }

  async fetchSearchResults(lat, long) {
    reminders_from_storage = await AsyncStorage.getItem('data');
    console.log('In location');
//    console.log(reminders_from_storage[0]);
    reminder = JSON.stringify(JSON.parse(reminders_from_storage)[0].reminderTitle);
    console.log(reminder);
    return fetch('https://maps.googleapis.com/maps/api/place/nearbysearch/json?location='+lat+','+long+'8&radius=100&keyword='+reminder+'&key=AIzaSyCXt5crZnOkyCx52RECUnDxWTtOxG6uXi0')
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

}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#2F4F4F'
  },
  header: {
    backgroundColor: '#008B8B'
  },
  title: {
    color: '#000'
  },
  listItem: {
    marginBottom: 10
  },
  itemHeader: {
    backgroundColor: '#D5B601',
    padding: 5
  },
  eventName: {
    fontSize: 12,
    fontWeight: 'bold'
  },
  eventTimestamp: {
    fontSize: 12
  },
  eventJson: {
    fontFamily: 'Courier New',
    fontSize: 12,
    color: '#e6db74'
  },
  footer: {
    backgroundColor: '#008B8B',
    paddingLeft: 10,
    paddingRight: 10
  },
  footerBody: {
    justifyContent: 'center'
  },
  icon: {
    color: '#fff'
  }
});
