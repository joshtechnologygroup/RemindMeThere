import React, {Component} from 'react';
import {
    StyleSheet, View, PixelRatio, Platform, Dimensions, Text, LayoutAnimation, Keyboard,
    TextInput, TouchableOpacity, AsyncStorage
} from 'react-native';

import {
  Container,
  Button, Icon,
  Header, Footer, Title,
  Content,
  Left, Body, Right,
  Switch
} from 'native-base';

import PushController from './PushController'

let TEXT_SIZE = (PixelRatio.get() <= 2) ? 17 : 19;
let NAVBAR_HEIGHT = (Platform.OS === 'ios') ? 64 : 54;

let {width: windowWidth, height: windowHeight} = Dimensions.get('window');
let HEIGHT = windowHeight - NAVBAR_HEIGHT;

import App from './App';

export default class ReminderController extends Component {
    static navigationOptions = {
        title: 'Add a Reminder!',
    };

    constructor(props) {
        super(props);
        this.state = {
            reminderTitle: '',
            reminderContent: '',
            reminders: {}
        };

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
                </Header>

                <View style={{flex:1, paddingLeft:10, paddingRight:10}}>
                    <TextInput
                        onChangeText={(text) => this.setState({reminderTitle: text})}
                        placeholder={"Title"}
                        autoFocus={true}
                        style={[styles.title]}
                        value={this.state.reminderTitle}
                    />
                    <TextInput
                        onChangeText={(text) => this.setState({reminderContent: text})}
                        placeholder={"Description"}
                        style={[styles.reminder]}
                        value={this.state.reminderContent}
                    />
                </View>

                <TouchableOpacity style={[styles.saveBtn]}
                                  disabled={(!(this.state.reminderTitle.length > 0 && this.state.reminderContent.length > 0))}
                                  onPress={this.addReminder.bind(this)}>
                    <Text style={[{
                            fontWeight: "500",
                            color: (this.state.reminderTitle.length > 0 && this.state.reminderContent.length > 0) ? "#FFF" : "rgba(255,255,255,.5)"
                        }]}>
                        Save
                    </Text>
                </TouchableOpacity>

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

    async addReminder() {
        var reminder = {
            "id": this.generateID(),
            "reminderTitle": this.state.reminderTitle,
            "reminderContent": this.state.reminderContent
        };

        var reminders = [];

        console.log(' ');
        console.log(' ');
        console.log('NEW REMINDER: ' + JSON.stringify(reminder));
        console.log(' ');
        console.log(' ');

        try {
//            await AsyncStorage.clear();
            reminders_from_storage = await AsyncStorage.getItem('data');
            console.log('the reminders i got are: ' + reminders_from_storage);
            if (!this.isEmpty(reminders_from_storage)) {
                console.log("Creating...");
                reminders = JSON.parse(reminders_from_storage);

//                reminder = JSON.parse('{' + '\"id' + reminder.id + '":' + JSON.stringify(reminder) + '}');

//                reminders = {
//                    ...reminders,
//                    ...reminder
//                };
                reminders.push(reminder);
                await AsyncStorage.setItem('data', JSON.stringify(reminders));

            } else {
                console.log("Creating for the first time....");
                console.log(reminders);
                console.log(reminder);
                reminders.push(reminder);
                await AsyncStorage.setItem('data', JSON.stringify(reminders));
            }
        } catch (error) {
            // Error retrieving data
            console.log(error);
        }
    }

    cloneObject(object){
        return JSON.parse(JSON.stringify(object));
    }

    isEmpty(obj) {
        if (obj === null) return true;
        if (Array.isArray(obj) || typeof(obj) === "string") return obj.length === 0;
        for (let key in obj) if (obj.hasOwnProperty(key)) return false;
        return true;
    };

    generateID() {
        let d = new Date().getTime();
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            let r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(5);
        });
    }

    // _keyboardWillShow(e) {
    //     LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    //
    //     let newHeight = HEIGHT - e.endCoordinates.height;
    //     this.setState({height: newHeight})
    // }
    //
    // _keyboardWillHide(e) {
    //     LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    //     this.setState({height: HEIGHT})
    // }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 15,
        backgroundColor: '#fff',
    },
    saveBtn:{
        width: windowWidth,
        height: 44,
        justifyContent: "center",
        alignItems: 'center',
        backgroundColor:"#6B9EFA"
    },
    reminder: {
        fontSize: TEXT_SIZE,
        lineHeight: 38,
        color: "#333333",
        padding: 16,
        paddingLeft:0,
        flex:1,
        height: 200,
        borderTopWidth: 1,
        borderColor: "rgba(212,211,211, 0.3)",
    },
    title: {
        fontWeight: "400",
        lineHeight: 22,
        fontSize: 16,
        height:25+32,
        padding: 16,
        paddingLeft:0
    },
});