import React, {Component} from 'react';
import {
    StyleSheet, View, PixelRatio, Platform, Dimensions, Text, LayoutAnimation, Keyboard,
    TextInput, TouchableOpacity, AsyncStorage
} from 'react-native';

let TEXT_SIZE = (PixelRatio.get() <= 2) ? 17 : 19;
let NAVBAR_HEIGHT = (Platform.OS === 'ios') ? 64 : 54;

let {width: windowWidth, height: windowHeight} = Dimensions.get('window');
let HEIGHT = windowHeight - NAVBAR_HEIGHT;

export default class LinksScreen extends React.Component {
    static navigationOptions = {
        title: 'Create a Reminder!',
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
        console.log("Links!");
        return (
            <View style={{flex: 1, backgroundColor: '#fff'}}>
                <View style={{flex:1, paddingLeft:10, paddingRight:10}}>
                    <TextInput
                        onChangeText={(text) => this.setState({reminderTitle: text})}
                        placeholder={"Reminder Title"}
                        autoFocus={true}
                        style={[styles.title]}
                        value={this.state.reminderTitle}
                    />
                    <TextInput
                        multiline={true}
                        onChangeText={(text) => this.setState({reminderContent: text})}
                        placeholder={"Enter Reminder Content"}
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
            </View>
        );
    }

    async addReminder() {
        let reminder = {
            "id": this.generateID(),
            "reminderTitle": this.state.reminderTitle,
            "reminderContent": this.state.reminderContent
        };

        console.log(' ');
        console.log(' ');
        console.log('NEW REMINDER: ' + JSON.stringify(reminder));
        console.log(' ');
        console.log(' ');

        try {
            // await AsyncStorage.clear();
            let reminders = await AsyncStorage.getItem('data');
            console.log('the reminders i got are: ' + reminders);
            if (!this.isEmpty(reminders)) {
                console.log("Creating...");

                reminders = JSON.parse(reminders);
                reminder = JSON.parse('{' + '\"id' + reminder.id + '":' + JSON.stringify(reminder) + '}');

                reminders = {
                    ...reminders,
                    ...reminder
                };

                await AsyncStorage.setItem('data', JSON.stringify(reminders));

            } else {
                console.log("Creating for the first time....");
                await AsyncStorage.setItem('data', '{' + '\"id' + reminder.id + '":' + JSON.stringify(reminder) + '}');
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
        marginBottom:50,
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
