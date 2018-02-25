import { AppRegistry } from 'react-native';
import App from './src/App';

import BackgroundGeolocation from "./src/react-native-background-geolocation";
import PushNotifications from './notifications.js';

AppRegistry.registerComponent('RemindMeThere', () => App);
AppRegistry.registerComponent('PushNotification', () => PushNotification);

let HeadlessTask = async (event) => {
  let params = event.params;
  console.log('[BackgroundGeolocation HeadlessTask] -', event.name, params);
    PushNotification.localNotificationSchedule({
        message: 'Here you go from Headless' || '',
        date: new Date(Date.now())
      });

  switch (event.name) {
    case 'heartbeat':
      // Use await for async tasks
      let location = await getCurrentPosition();
      console.log('[BackgroundGeolocation HeadlessTask] - getCurrentPosition:', location);
      break;

    PushNotification.localNotificationSchedule({
        message: 'Here you go from Headless' || '',
        date: new Date(Date.now())
    });
  }


}

global.BackgroundGeolocation = BackgroundGeolocation;

let getCurrentPosition = () => {
  console.log('Tes');
  return new Promise((resolve) => {
    BackgroundGeolocation.getCurrentPosition((location) => {
      resolve(location);
    }, (error) => {
      resolve(error);
    }, {
      samples: 1,
      persist: false
    });
  });
};

BackgroundGeolocation.registerHeadlessTask(HeadlessTask);
