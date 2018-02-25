package remind.me.there;

import android.app.Application;

import com.facebook.react.ReactApplication;

import com.transistorsoft.rnbackgroundgeolocation.RNBackgroundGeolocation;
import com.transistorsoft.rnbackgroundfetch.RNBackgroundFetchPackage;
import im.shimo.react.prompt.RNPromptPackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.airbnb.android.react.maps.MapsPackage;

import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import java.util.Arrays;
import java.util.List;

import com.dieam.reactnativepushnotification.ReactNativePushNotificationPackage;

public class MainApplication extends Application implements ReactApplication {


  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
              new MainReactPackage(),
              new RNBackgroundGeolocation(),
              new RNBackgroundFetchPackage(),
              new RNPromptPackage(),
              new RNDeviceInfo(),
              new MapsPackage(),
              new ReactNativePushNotificationPackage() // <---- Add the Package
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }
}
