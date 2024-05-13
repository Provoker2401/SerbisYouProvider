import * as React from "react";
import * as eva from "@eva-design/eva";
import MIcon from "react-native-vector-icons/MaterialCommunityIcons";
import { IconRegistry, ApplicationProvider } from "@ui-kitten/components";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {
  View,
  Text,
  Pressable,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { enableLatestRenderer } from "react-native-maps";
import Toast from "react-native-toast-message";
import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

// Components
import ProfileHeader from "./components/ProfileHeader";
import AccountHeader from "./components/AccountHeader";
import CurrentLocationheader from "./components/CurrentLocationheader";
import GoToCustomerHeader from "./components/GoToCustomerHeader";
import PerformTheServiceHeader from "./components/PerformTheServiceHeader";
import ConfirmServiceHeader from "./components/ConfirmServiceHeader";
import NewBookingHeader from "./components/NewBookingHeader";
import LogoutModal from "./components/LogoutModal";

import AboutUsFrame from "./components/AboutUsFrame";
import FAQsFrame from "./components/FAQsFrame";

// Segments
import Segment1 from "./components/Segment1";
import Segment2 from "./components/Segment2";
import Segment3 from "./components/Segment3";
import Segment4 from "./components/Segment4";
import Segment11 from "./components/Segment11";
import Segment21 from "./components/Segment21";
import Segment31 from "./components/Segment31";
import Segment41 from "./components/Segment41";

// Tabs
import Tab1 from "./components/Tab1";
import Tab2 from "./components/Tab2";
import Tab11 from "./components/Tab11";
import Tab21 from "./components/Tab21";

import HistoryBookings from "./components/HistoryBookings";
import ActiveBookings from "./components/ActiveBookings";

import CancelBookingPrompt from "./components/CancelBookingPrompt";
import CountDownBooking from "./components/CountDownBooking";
import BookingNotFound from "./components/BookingNotFound";
import PerformServicePrompt from "./components/PerformServicePrompt";

// Screens
import Splash from "./screens/Splash";
import Onboarding1 from "./screens/Onboarding1";
import Onboarding2 from "./screens/Onboarding2";
import Onboarding3 from "./screens/Onboarding3";
import SignUp from "./screens/SignUp";
import SignIn from "./screens/SignIn";
import ApplicationForm3 from "./screens/ApplicationForm3";
import ApplicationForm2 from "./screens/ApplicationForm2";
import ApplicationForm1 from "./screens/ApplicationForm1";

import Homepage from "./screens/Homepage";
import BookingsActive from "./screens/BookingsActive";
import Notifications from "./screens/Notifications";
import UserProfile from "./screens/UserProfile";

import EditProfile from "./screens/EditProfile";
import ChangePassword from "./screens/ChangePassword";
import ChangePasswordUpdated from "./screens/ChangePasswordUpdated";

import Wallet from "./screens/Wallet";
import CashOutBalance from "./screens/CashOutBalance";
import NotificationsSettings from "./screens/NotificationsSettings";

import NewBooking from "./screens/NewBooking";
import ViewBookingDetails from "./screens/ViewBookingDetails";
import GoToCustomer from "./screens/GoToCustomer";
import PerformTheService from "./screens/PerformTheService";
import ConfirmService from "./screens/ConfirmService";
import ConfirmNavigation from "./screens/ConfirmNavigation";

import HelpCenterFAQ from "./screens/HelpCenterFAQ";
import PrivacyPolicy from "./screens/PrivacyPolicy";

import TermsAndConditions from "./screens/TermsAndConditions";
import Authentication from "./screens/Authentication";
import AddCard from "./screens/AddCard";
import ForgotPasswordCode from "./screens/ForgotPasswordCode";
import ForgotPasswordConfirmation from "./screens/ForgotPasswordConfirmation";
import ForgotPasswordConfirmation1 from "./screens/ForgotPasswordConfirmation1";
import ForgotPasswordResendCode from "./screens/ForgotPasswordResendCode";
import ForgotPasswordUpdated from "./screens/ForgotPasswordUpdated";
import PaymentOptions from "./screens/PaymentOptions";

import EReceipt from "./screens/EReceipt";

enableLatestRenderer();
const firebaseConfig = {
  apiKey: "AIzaSyDWQablgpC3ElsqOQuVhQU2YFsri1VmCss",
  authDomain: "testingauth-9126f.firebaseapp.com",
  projectId: "testingauth-9126f",
  storageBucket: "testingauth-9126f.appspot.com",
  messagingSenderId: "211063140592",
  appId: "1:211063140592:web:6d7047e844df66f1565235",
};

// initialize Firebase App
const app = initializeApp(firebaseConfig);
// initialize Firebase Auth for that app immediately
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function BottomTabsRoot({ navigation }) {
  const [bottomTabItemsNormal] = React.useState([
    <Segment1 />,
    <Segment2 />,
    <Segment3 />,
    <Segment4 />,
  ]);
  const [bottomTabItemsActive] = React.useState([
    <Segment11 />,
    <Segment21 />,
    <Segment31 />,
    <Segment41 />,
  ]);
  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false }}
      tabBar={({ state, descriptors, navigation }) => {
        const activeIndex = state.index;
        return (
          <View
            style={{
              alignSelf: "stretch",
              borderTopLeftRadius: 4,
              borderTopRightRadius: 4,
              backgroundColor: "#fff",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              paddingHorizontal: 8,
              paddingVertical: 0,
              height: 80,
            }}
          >
            {bottomTabItemsNormal.map((item, index) => {
              const isFocused = state.index === index;
              return (
                <Pressable
                  key={index}
                  onPress={() => {
                    navigation.navigate({
                      name: state.routes[index].name,
                      merge: true,
                    });
                  }}
                >
                  {activeIndex === index
                    ? bottomTabItemsActive[index] || item
                    : item}
                </Pressable>
              );
            })}
          </View>
        );
      }}
    >
      <Tab.Screen
        name="Homepage"
        component={Homepage}
        options={(props) => ({
          headerShown: true,
          header: () => <CurrentLocationheader />,
        })}
      />
      <Tab.Screen
        name="BookingsActive"
        component={BookingsActive}
        options={(props) => ({
          headerShown: true,
          header: () => <CurrentLocationheader />,
        })}
      />
      <Tab.Screen
        name="Notifications"
        component={Notifications}
        options={(props) => ({
          headerShown: true,
          header: () => <CurrentLocationheader />,
        })}
      />
      <Tab.Screen
        name="UserProfile"
        component={UserProfile}
        options={(props) => ({
          headerShown: true,
          header: () => <ProfileHeader />,
        })}
      />
    </Tab.Navigator>
  );
}

export { firebaseConfig, auth, app };

const App = () => {
  const [hideSplashScreen, setHideSplashScreen] = React.useState(false);

  const [fontsLoaded, error] = useFonts({
    "AbhayaLibre-ExtraBold": require("./assets/fonts/AbhayaLibre-ExtraBold.ttf"),
    "Inter-Light": require("./assets/fonts/Inter-Light.ttf"),
    "Inter-Regular": require("./assets/fonts/Inter-Regular.ttf"),
    "Inter-Medium": require("./assets/fonts/Inter-Medium.ttf"),
    "Inter-SemiBold": require("./assets/fonts/Inter-SemiBold.ttf"),
    "Inter-Bold": require("./assets/fonts/Inter-Bold.ttf"),
    "Inter-ExtraBold": require("./assets/fonts/Inter-ExtraBold.ttf"),
    "Roboto-Regular": require("./assets/fonts/Roboto-Regular.ttf"),
    "Roboto-Medium": require("./assets/fonts/Roboto-Medium.ttf"),
    "Roboto-Bold": require("./assets/fonts/Roboto-Bold.ttf"),
    "Roboto-Black": require("./assets/fonts/Roboto-Black.ttf"),
    "WorkSans-Regular": require("./assets/fonts/WorkSans-Regular.ttf"),
    "WorkSans-Medium": require("./assets/fonts/WorkSans-Medium.ttf"),
    "WorkSans-SemiBold": require("./assets/fonts/WorkSans-SemiBold.ttf"),
    "WorkSans-Bold": require("./assets/fonts/WorkSans-Bold.ttf"),
    "Georama-Light": require("./assets/fonts/Georama-Light.ttf"),
    "Georama-Regular": require("./assets/fonts/Georama-Regular.ttf"),
    "Georama-Medium": require("./assets/fonts/Georama-Medium.ttf"),
    "Georama-SemiBold": require("./assets/fonts/Georama-SemiBold.ttf"),
    "Georama-Bold": require("./assets/fonts/Georama-Bold.ttf"),
    "Poppins-Light": require("./assets/fonts/Poppins-Light.ttf"),
    "Poppins-Regular": require("./assets/fonts/Poppins-Regular.ttf"),
    "Poppins-Medium": require("./assets/fonts/Poppins-Medium.ttf"),
    "Poppins-Bold": require("./assets/fonts/Poppins-Bold.ttf"),
    "Montserrat-Regular": require("./assets/fonts/Montserrat-Regular.ttf"),
    "Montserrat-Medium": require("./assets/fonts/Montserrat-Medium.ttf"),
    "Montserrat-SemiBold": require("./assets/fonts/Montserrat-SemiBold.ttf"),
    "Montserrat-Bold": require("./assets/fonts/Montserrat-Bold.ttf"),
    "Montserrat-Medium": require("./assets/fonts/Montserrat-Medium.ttf"),
  });

  React.useEffect(() => {
    setTimeout(() => {
      setHideSplashScreen(true);
    }, 8000);
  }, []);

  function MaterialIcon({ name, style }) {
    const { height, tintColor, ...iconStyle } = StyleSheet.flatten(style);
    return (
      <MIcon name={name} size={height} color={tintColor} style={iconStyle} />
    );
  }

  const IconProvider = (name) => ({
    toReactElement: (props) => MaterialIcon({ name, ...props }),
  });

  function createIconsMap() {
    return new Proxy(
      {},
      {
        get(target, name) {
          return IconProvider(name);
        },
      }
    );
  }
  const MaterialIconsPack = {
    name: "material",
    icons: createIconsMap(),
  };

  if (!fontsLoaded && !error) {
    return null;
  }

  return (
    <>
      <IconRegistry icons={[MaterialIconsPack]} />
      <ApplicationProvider {...eva} theme={eva.light}>
        <NavigationContainer>
          {hideSplashScreen ? (
            <Stack.Navigator
              initialRouteName="Onboarding1"
              screenOptions={{ headerShown: false }}
            >
              <Stack.Screen name="BottomTabsRoot" component={BottomTabsRoot} />
              <Stack.Screen
                name="Onboarding1"
                component={Onboarding1}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="Segment4"
                component={Segment4}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="LogoutModal"
                component={LogoutModal}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="ProfileHeader"
                component={ProfileHeader}
                options={(props) => ({
                  headerShown: true,
                  header: () => <ProfileHeader />,
                })}
              />
              <Stack.Screen
                name="AboutUsFrame"
                component={AboutUsFrame}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="FAQsFrame"
                component={FAQsFrame}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="EditProfile"
                component={EditProfile}
                options={({ route }) => ({
                  headerShown: true,
                  header: () => <AccountHeader title="Edit Profile"/>,
                })}
              />
              <Stack.Screen
                name="AccountHeader"
                component={AccountHeader}
                options={(props) => ({
                  headerShown: true,
                  header: () => <AccountHeader />,
                })}
              />
              <Stack.Screen
                name="ChangePasswordUpdated"
                component={ChangePasswordUpdated}
                options={({ route }) => ({
                  headerShown: true,
                  header: () => <AccountHeader title="Change Password"/>,
                })}
              />
              <Stack.Screen
                name="ChangePassword"
                component={ChangePassword}
                options={({ route }) => ({
                  headerShown: true,
                  header: () => <AccountHeader title="Change Password"/>,
                })}
              />
              <Stack.Screen
                name="CashOutBalance"
                component={CashOutBalance}
                options={({ route }) => ({
                  headerShown: true,
                  header: () => <AccountHeader title="Cash out"/>,
                })}
              />
              <Stack.Screen
                name="Wallet"
                component={Wallet}
                options={({ route }) => ({
                  headerShown: true,
                  header: () => <AccountHeader title="Wallet"/>,
                })}
              />
              <Stack.Screen
                name="NotificationsSettings"
                component={NotificationsSettings}
                options={({ route }) => ({
                  headerShown: true,
                  header: () => <AccountHeader title="Notifications"/>,
                })}
              />
              <Stack.Screen
                name="HelpCenterFAQ"
                component={HelpCenterFAQ}
                options={({ route }) => ({
                  headerShown: true,
                  header: () => <AccountHeader title="Help Center"/>,
                })}
              />
              <Stack.Screen
                name="PrivacyPolicy"
                component={PrivacyPolicy}
                options={({ route }) => ({
                  headerShown: true,
                  header: () => <AccountHeader title="Privacy Policy"/>,
                })}
              />
              <Stack.Screen
                name="Segment41"
                component={Segment41}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="Segment3"
                component={Segment3}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="Segment31"
                component={Segment31}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="Segment2"
                component={Segment2}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="Tab2"
                component={Tab2}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="HistoryBookings"
                component={HistoryBookings}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="EReceipt"
                component={EReceipt}
                options={({ route }) => ({
                  headerShown: true,
                  header: () => <AccountHeader title="E-Receipt"/>,
                })}
              />
              <Stack.Screen
                name="ConfirmNavigation"
                component={ConfirmNavigation}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="PerformServicePrompt"
                component={PerformServicePrompt}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="Tab21"
                component={Tab21}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="Tab1"
                component={Tab1}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="ActiveBookings"
                component={ActiveBookings}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="Tab11"
                component={Tab11}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="Segment21"
                component={Segment21}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="Segment1"
                component={Segment1}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="Segment11"
                component={Segment11}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="Onboarding2"
                component={Onboarding2}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="Splash"
                component={Splash}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="CurrentLocationheader"
                component={CurrentLocationheader}
                options={(props) => ({
                  headerShown: true,
                  header: () => <CurrentLocationheader />,
                })}
              />
              <Stack.Screen
                name="ApplicationForm3"
                component={ApplicationForm3}
                options={({ route }) => ({
                  headerShown: true,
                  header: () => <AccountHeader title="Application Form"/>,
                })}
              />
              <Stack.Screen
                name="ApplicationForm2"
                component={ApplicationForm2}
                options={({ route }) => ({
                  headerShown: true,
                  header: () => <AccountHeader title="Application Form"/>,
                })}
              />
              <Stack.Screen
                name="ApplicationForm1"
                component={ApplicationForm1}
                options={({ route }) => ({
                  headerShown: true,
                  header: () => <AccountHeader title="Application Form"/>,
                })}
              />
              <Stack.Screen
                name="SignUp"
                component={SignUp}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="SignIn"
                component={SignIn}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="Onboarding3"
                component={Onboarding3}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="ViewBookingDetails"
                component={ViewBookingDetails}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="ConfirmService"
                component={ConfirmService}
                options={(props) => ({
                  headerShown: true,
                  header: () => <ConfirmServiceHeader />,
                })}
              />
              <Stack.Screen
                name="PerformTheService"
                component={PerformTheService}
                options={(props) => ({
                  headerShown: true,
                  header: () => <PerformTheServiceHeader />,
                })}
              />
              <Stack.Screen
                name="GoToCustomer"
                component={GoToCustomer}
                options={(props) => ({
                  headerShown: true,
                  header: () => <GoToCustomerHeader />,
                })}
              />
              <Stack.Screen
                name="NewBooking"
                component={NewBooking}
                options={(props) => ({
                  headerShown: true,
                  header: () => <NewBookingHeader />,
                })}
              />
              <Stack.Screen
                name="CancelBookingPrompt"
                component={CancelBookingPrompt}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="CountDownBooking"
                component={CountDownBooking}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="BookingNotFound"
                component={BookingNotFound}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="TermsAndConditions"
                component={TermsAndConditions}
                options={({ route }) => ({
                  headerShown: true,
                  header: () => <AccountHeader title="Terms and Conditions"/>,
                })}
              />
              <Stack.Screen
                name="Authentication"
                component={Authentication}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="AddCard"
                component={AddCard}
                options={({ route }) => ({
                  headerShown: true,
                  header: () => <AccountHeader title="Add Card"/>,
                })}
              />
              <Stack.Screen
                name="ForgotPasswordCode"
                component={ForgotPasswordCode}
                options={({ route }) => ({
                  headerShown: true,
                  header: () => <AccountHeader title="Forgot Password"/>,
                })}
              />
              <Stack.Screen
                name="ForgotPasswordConfirmation"
                component={ForgotPasswordConfirmation}
                options={({ route }) => ({
                  headerShown: true,
                  header: () => <AccountHeader title="Forgot Password"/>,
                })}
              />
              <Stack.Screen
                name="ForgotPasswordConfirmation1"
                component={ForgotPasswordConfirmation1}
                options={({ route }) => ({
                  headerShown: true,
                  header: () => <AccountHeader title="Forgot Password"/>,
                })}
              />
              <Stack.Screen
                name="ForgotPasswordResendCode"
                component={ForgotPasswordResendCode}
                options={({ route }) => ({
                  headerShown: true,
                  header: () => <AccountHeader title="Forgot Password"/>,
                })}
              />
              <Stack.Screen
                name="ForgotPasswordUpdated"
                component={ForgotPasswordUpdated}
                options={({ route }) => ({
                  headerShown: true,
                  header: () => <AccountHeader title="Forgot Password"/>,
                })}
              />
              <Stack.Screen
                name="PaymentOptions"
                component={PaymentOptions}
                options={({ route }) => ({
                  headerShown: true,
                  header: () => <AccountHeader title="Payment Options"/>,
                })}
              />
              <Stack.Screen
                name="GoToCustomerHeader"
                component={GoToCustomerHeader}
                options={(props) => ({
                  headerShown: true,
                  header: () => <GoToCustomerHeader />,
                })}
              />
              <Stack.Screen
                name="PerformTheServiceHeader"
                component={PerformTheServiceHeader}
                options={(props) => ({
                  headerShown: true,
                  header: () => <PerformTheServiceHeader />,
                })}
              />
              <Stack.Screen
                name="ConfirmServiceHeader"
                component={ConfirmServiceHeader}
                options={(props) => ({
                  headerShown: true,
                  header: () => <ConfirmServiceHeader />,
                })}
              />
              <Stack.Screen
                name="NewBookingHeader"
                component={NewBookingHeader}
                options={(props) => ({
                  headerShown: true,
                  header: () => <NewBookingHeader />,
                })}
              />
            </Stack.Navigator>
          ) : (
            <Splash />
          )}
        </NavigationContainer>
        <Toast ref={(ref) => Toast.setRef(ref)} />
      </ApplicationProvider>
    </>
  );
};
export default App;
