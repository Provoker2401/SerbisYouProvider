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
import Header from "./components/Header";
import Header1 from "./components/Header1";
import Header2 from "./components/Header2";
import Header3 from "./components/Header3";
import Header4 from "./components/Header4";
import Header5 from "./components/Header5";
import Header6 from "./components/Header6";
import Header7 from "./components/Header7";
import Header8 from "./components/Header8";
import Header9 from "./components/Header9";
import Header10 from "./components/Header10";
import Header11 from "./components/Header11";
import Header12 from "./components/Header12";
import Header13 from "./components/Header13";
import Header14 from "./components/Header14";
import Header15 from "./components/Header15";
import Header16 from "./components/Header16";
import Header17 from "./components/Header17";
import Header18 from "./components/Header18";
import Header19 from "./components/Header19";
import Header20 from "./components/Header20";
import Header21 from "./components/Header21";
import Header22 from "./components/Header22";
import Header23 from "./components/Header23";
import Header24 from "./components/Header24";
import Header25 from "./components/Header25";
import Header26 from "./components/Header26";
import Header27 from "./components/Header27";
import Header28 from "./components/Header28";
import Header29 from "./components/Header29";
import Header30 from "./components/Header30";
import Header31 from "./components/Header31";
import Header32 from "./components/Header32";
import Header33 from "./components/Header33";
import Header34 from "./components/Header34";


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
// import BookingCard from "./components/BookingCard";

import CancelBookingPrompt from "./components/CancelBookingPrompt";
import CountDownBooking from "./components/CountDownBooking";
import BookingNotFound from "./components/BookingNotFound";
import SwipeButton2 from "./components/SwipeButton2";
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
import NotificationsEmpty from "./screens/NotificationsEmpty";
import UserProfile from "./screens/UserProfile";
import EditService from "./screens/EditService";

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
import ConfirmServiceWithPhoto from "./screens/ConfirmServiceWithPhoto";
import ConfirmNavigation from "./screens/ConfirmNavigation";

import HelpCenterFAQ from "./screens/HelpCenterFAQ";
import PrivacyPolicy from "./screens/PrivacyPolicy";

import TermsAndConditions from "./screens/TermsAndConditions";
import Authentication from "./screens/Authentication";
import AuthenticationResendCode from "./screens/AuthenticationResendCode";
import AddCard from "./screens/AddCard";
import ForgotPasswordCode from "./screens/ForgotPasswordCode";
import ForgotPasswordConfirmation from "./screens/ForgotPasswordConfirmation";
import ForgotPasswordConfirmation1 from "./screens/ForgotPasswordConfirmation1";
import ForgotPasswordResendCode from "./screens/ForgotPasswordResendCode";
import ForgotPasswordUpdated from "./screens/ForgotPasswordUpdated";
// import HelpCenterAboutUs from "./screens/HelpCenterAboutUs";
import PaymentOptions from "./screens/PaymentOptions";

import CalendarStrips from "./screens/CalendarStrips";

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
          header: () => <Header14 />,
        })}
      />
      <Tab.Screen
        name="BookingsActive"
        component={BookingsActive}
        options={(props) => ({
          headerShown: true,
          header: () => <Header10 />,
        })}
      />
      <Tab.Screen
        name="Notifications"
        component={Notifications}
        options={(props) => ({
          headerShown: true,
          header: () => <Header9 />,
        })}
      />
      <Tab.Screen
        name="UserProfile"
        component={UserProfile}
        options={(props) => ({
          headerShown: true,
          header: () => <Header />,
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
    }, 5000);
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
                name="Header"
                component={Header}
                options={(props) => ({
                  headerShown: true,
                  header: () => <Header />,
                })}
              />
              <Stack.Screen
                name="Header1"
                component={Header1}
                options={(props) => ({
                  headerShown: true,
                  header: () => <Header1 />,
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
                options={(props) => ({
                  headerShown: true,
                  header: () => <Header1 />,
                })}
              />
              <Stack.Screen
                name="Header2"
                component={Header2}
                options={(props) => ({
                  headerShown: true,
                  header: () => <Header2 />,
                })}
              />
              <Stack.Screen
                name="Header3"
                component={Header3}
                options={(props) => ({
                  headerShown: true,
                  header: () => <Header3 />,
                })}
              />
              <Stack.Screen
                name="ChangePasswordUpdated"
                component={ChangePasswordUpdated}
                options={(props) => ({
                  headerShown: true,
                  header: () => <Header3 />,
                })}
              />
              <Stack.Screen
                name="ChangePassword"
                component={ChangePassword}
                options={(props) => ({
                  headerShown: true,
                  header: () => <Header2 />,
                })}
              />
              <Stack.Screen
                name="EditService"
                component={EditService}
                options={(props) => ({
                  headerShown: true,
                  header: () => <Header13 />,
                })}
              />
              <Stack.Screen
                name="Header4"
                component={Header4}
                options={(props) => ({
                  headerShown: true,
                  header: () => <Header4 />,
                })}
              />
              <Stack.Screen
                name="Header5"
                component={Header5}
                options={(props) => ({
                  headerShown: true,
                  header: () => <Header5 />,
                })}
              />
              <Stack.Screen
                name="CashOutBalance"
                component={CashOutBalance}
                options={(props) => ({
                  headerShown: true,
                  header: () => <Header5 />,
                })}
              />
              <Stack.Screen
                name="Wallet"
                component={Wallet}
                options={(props) => ({
                  headerShown: true,
                  header: () => <Header4 />,
                })}
              />
              <Stack.Screen
                name="Header6"
                component={Header6}
                options={(props) => ({
                  headerShown: true,
                  header: () => <Header6 />,
                })}
              />
              <Stack.Screen
                name="NotificationsSettings"
                component={NotificationsSettings}
                options={(props) => ({
                  headerShown: true,
                  header: () => <Header6 />,
                })}
              />
              <Stack.Screen
                name="Header7"
                component={Header7}
                options={(props) => ({
                  headerShown: true,
                  header: () => <Header7 />,
                })}
              />
              <Stack.Screen
                name="HelpCenterFAQ"
                component={HelpCenterFAQ}
                options={(props) => ({
                  headerShown: true,
                  header: () => <Header7 />,
                })}
              />
              <Stack.Screen
                name="Header8"
                component={Header8}
                options={(props) => ({
                  headerShown: true,
                  header: () => <Header8 />,
                })}
              />
              <Stack.Screen
                name="PrivacyPolicy"
                component={PrivacyPolicy}
                options={(props) => ({
                  headerShown: true,
                  header: () => <Header8 />,
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
                name="Header9"
                component={Header9}
                options={(props) => ({
                  headerShown: true,
                  header: () => <Header9 />,
                })}
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
                name="Header10"
                component={Header10}
                options={(props) => ({
                  headerShown: true,
                  header: () => <Header10 />,
                })}
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
                options={(props) => ({
                  headerShown: true,
                  header: () => <Header34 />,
                })}
              />
              <Stack.Screen
                name="ConfirmNavigation"
                component={ConfirmNavigation}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="SwipeButton2"
                component={SwipeButton2}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="PerformServicePrompt"
                component={PerformServicePrompt}
                options={{ headerShown: false }}
              />
              {/* <Stack.Screen
                name="BookingCard"
                component={BookingCard}
                options={{ headerShown: false }}
              /> */}
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
                name="Header11"
                component={Header11}
                options={(props) => ({
                  headerShown: true,
                  header: () => <Header11 />,
                })}
              />
              <Stack.Screen
                name="Header12"
                component={Header12}
                options={(props) => ({
                  headerShown: true,
                  header: () => <Header12 />,
                })}
              />
              <Stack.Screen
                name="Header13"
                component={Header13}
                options={(props) => ({
                  headerShown: true,
                  header: () => <Header13 />,
                })}
              />
              <Stack.Screen
                name="Header14"
                component={Header14}
                options={(props) => ({
                  headerShown: true,
                  header: () => <Header14 />,
                })}
              />
              <Stack.Screen
                name="ApplicationForm3"
                component={ApplicationForm3}
                options={(props) => ({
                  headerShown: true,
                  header: () => <Header13 />,
                })}
              />
              <Stack.Screen
                name="ApplicationForm2"
                component={ApplicationForm2}
                options={(props) => ({
                  headerShown: true,
                  header: () => <Header12 />,
                })}
              />
              <Stack.Screen
                name="ApplicationForm1"
                component={ApplicationForm1}
                options={(props) => ({
                  headerShown: true,
                  header: () => <Header11 />,
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
                  header: () => <Header22 />,
                })}
              />
              <Stack.Screen
                name="ConfirmServiceWithPhoto"
                component={ConfirmServiceWithPhoto}
                options={(props) => ({
                  headerShown: true,
                  header: () => <Header19 />,
                })}
              />
              <Stack.Screen
                name="PerformTheService"
                component={PerformTheService}
                options={(props) => ({
                  headerShown: true,
                  header: () => <Header21 />,
                })}
              />
              <Stack.Screen
                name="GoToCustomer"
                component={GoToCustomer}
                options={(props) => ({
                  headerShown: true,
                  header: () => <Header20 />,
                })}
              />
              <Stack.Screen
                name="NewBooking"
                component={NewBooking}
                options={(props) => ({
                  headerShown: true,
                  header: () => <Header23 />,
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
                options={(props) => ({
                  headerShown: true,
                  header: () => <Header />,
                })}
              />
              <Stack.Screen
                name="Authentication"
                component={Authentication}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="AuthenticationResendCode"
                component={AuthenticationResendCode}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="AddCard"
                component={AddCard}
                options={(props) => ({
                  headerShown: true,
                  header: () => <Header24 />,
                })}
              />
              <Stack.Screen
                name="ForgotPasswordCode"
                component={ForgotPasswordCode}
                options={(props) => ({
                  headerShown: true,
                  header: () => <Header25 />,
                })}
              />
              <Stack.Screen
                name="ForgotPasswordConfirmation"
                component={ForgotPasswordConfirmation}
                options={(props) => ({
                  headerShown: true,
                  header: () => <Header26 />,
                })}
              />
              <Stack.Screen
                name="ForgotPasswordConfirmation1"
                component={ForgotPasswordConfirmation1}
                options={(props) => ({
                  headerShown: true,
                  header: () => <Header27 />,
                })}
              />
              <Stack.Screen
                name="ForgotPasswordResendCode"
                component={ForgotPasswordResendCode}
                options={(props) => ({
                  headerShown: true,
                  header: () => <Header28 />,
                })}
              />
              <Stack.Screen
                name="ForgotPasswordUpdated"
                component={ForgotPasswordUpdated}
                options={(props) => ({
                  headerShown: true,
                  header: () => <Header29 />,
                })}
              />
              {/* <Stack.Screen
                name="HelpCenterAboutUs"
                component={HelpCenterAboutUs}
                options={(props) => ({
                  headerShown: true,
                  header: () => <Header30 />,
                })}
              /> */}
              <Stack.Screen
                name="PaymentOptions"
                component={PaymentOptions}
                options={(props) => ({
                  headerShown: true,
                  header: () => <Header31 />,
                })}
              />
              <Stack.Screen
                name="CalendarStrips"
                component={CalendarStrips}
                options={(props) => ({
                  headerShown: true,
                  header: () => <Header31 />,
                })}
              />
              {/* <Stack.Screen
                name="EditProfile"
                component={EditProfile}
                options={(props) => ({
                  headerShown: true,
                  header: () => <Header32 />,
                })}
              /> */}
              {/* <Stack.Screen
                name="NotificationsSettings"
                component={NotificationsSettings}
                options={(props) => ({
                  headerShown: true,
                  header: () => <Header33 />,
                })}
              /> */}
              <Stack.Screen
                name="Header15"
                component={Header15}
                options={(props) => ({
                  headerShown: true,
                  header: () => <Header15 />,
                })}
              />
              <Stack.Screen
                name="Header16"
                component={Header16}
                options={(props) => ({
                  headerShown: true,
                  header: () => <Header16 />,
                })}
              />
              <Stack.Screen
                name="Header17"
                component={Header17}
                options={(props) => ({
                  headerShown: true,
                  header: () => <Header17 />,
                })}
              />
              <Stack.Screen
                name="Header18"
                component={Header18}
                options={(props) => ({
                  headerShown: true,
                  header: () => <Header18 />,
                })}
              />
              <Stack.Screen
                name="Header19"
                component={Header19}
                options={(props) => ({
                  headerShown: true,
                  header: () => <Header19 />,
                })}
              />
              <Stack.Screen
                name="Header20"
                component={Header20}
                options={(props) => ({
                  headerShown: true,
                  header: () => <Header20 />,
                })}
              />
              <Stack.Screen
                name="Header21"
                component={Header21}
                options={(props) => ({
                  headerShown: true,
                  header: () => <Header21 />,
                })}
              />
              <Stack.Screen
                name="Header22"
                component={Header22}
                options={(props) => ({
                  headerShown: true,
                  header: () => <Header22 />,
                })}
              />
              <Stack.Screen
                name="Header23"
                component={Header23}
                options={(props) => ({
                  headerShown: true,
                  header: () => <Header23 />,
                })}
              />
              <Stack.Screen
                name="Header24"
                component={Header24}
                options={(props) => ({
                  headerShown: true,
                  header: () => <Header24 />,
                })}
              />
              <Stack.Screen
                name="Header25"
                component={Header25}
                options={(props) => ({
                  headerShown: true,
                  header: () => <Header25 />,
                })}
              />
              <Stack.Screen
                name="Header26"
                component={Header26}
                options={(props) => ({
                  headerShown: true,
                  header: () => <Header26 />,
                })}
              />
              <Stack.Screen
                name="Header27"
                component={Header27}
                options={(props) => ({
                  headerShown: true,
                  header: () => <Header27 />,
                })}
              />
              <Stack.Screen
                name="Header28"
                component={Header28}
                options={(props) => ({
                  headerShown: true,
                  header: () => <Header28 />,
                })}
              />
              <Stack.Screen
                name="Header29"
                component={Header29}
                options={(props) => ({
                  headerShown: true,
                  header: () => <Header29 />,
                })}
              />
              {/* <Stack.Screen
                name="Header30"
                component={Header30}
                options={(props) => ({
                  headerShown: true,
                  header: () => <Header30 />,
                })}
              /> */}
              <Stack.Screen
                name="Header31"
                component={Header31}
                options={(props) => ({
                  headerShown: true,
                  header: () => <Header31 />,
                })}
              />
              <Stack.Screen
                name="Header32"
                component={Header32}
                options={(props) => ({
                  headerShown: true,
                  header: () => <Header32 />,
                })}
              />
              <Stack.Screen
                name="NotificationsEmpty"
                component={NotificationsEmpty}
                options={(props) => ({
                  headerShown: true,
                  header: () => <Header16 />,
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
