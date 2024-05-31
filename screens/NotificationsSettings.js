import React, { isValidElement, useState, useEffect } from "react";
import {
  StatusBar,
  StyleSheet,
  Pressable,
  View,
  Text,
  ScrollView,
  Switch,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { FontSize, FontFamily, Padding, Border, Color } from "../GlobalStyles";
import messaging from '@react-native-firebase/messaging';

const NotificationsSettings = () => {
  const [toggleSwitchValue, setToggleSwitchValue] = useState(false);
  const [toggleSwitch1SwitchValueState, setToggleSwitch1SwitchValueState] =
    useState(false);
  const [toggleSwitch2SwitchValueState, setToggleSwitch2SwitchValueState] =
    useState(true);

  const [isEmailEnabled, setIsEmailEnabled] = useState(false);
  const [isSMSEnabled, setIsSMSEnabled] = useState(false);
  const [isOrderEnabled, setIsOrderEnabled] = useState(false);
  const [isChatEnabled, setIsChatEnabled] = useState(false);

  const toggleEmailSwitch = () => {
    setIsEmailEnabled((previousState) => !previousState);
  };
  const toggleSMSSwitch = () => {
    setIsSMSEnabled((previousState) => !previousState);
  };
  const toggleOrderSwitch = () => {
    setIsOrderEnabled((previousState) => !previousState);
  };
  const toggleChatSwitch = () => {
    setIsChatEnabled((previousState) => !previousState);
  };

  const requestUserPermission = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log("Authorization status:", authStatus);
    }
  };

  useEffect(() => {
    if (requestUserPermission()) {
      // return fcm token for the device
      messaging()
        .getToken()
        .then((token) => {
          console.log("Token: ", token);
        });
    } else {
      console.log("Failed token status", authStatus);
    }

    // Check whether an initial notification is available
    messaging()
      .getInitialNotification()
      .then((remoteMessage) => {
        if (remoteMessage) {
          console.log(
            "Notification caused app to open from quit state:",
            remoteMessage.notification
          );
          //setInitialRoute(remoteMessage.data.type);  e.g. "Settings"
        }
        //setLoading(false);
      });

    // When the app is running, but in the background
    // Assume a message-notification contains a "type" property in the data payload of the screen to open

    messaging().onNotificationOpenedApp(async (remoteMessage) => {
      console.log(
        "Notification caused app to open from background state:",
        remoteMessage.notification
      );
      // navigation.navigate(remoteMessage.data.type);
    });

    // Register background handler
    messaging().setBackgroundMessageHandler(async (remoteMessage) => {
      console.log("Message handled in the background!", remoteMessage);
    });

    // To listen to messages in the foreground
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
    });

    return unsubscribe;
  }, []);

  return (
    <View style={styles.notificationsSettings}>
      <StatusBar barStyle="default" />
      <ScrollView
        style={styles.body}
        showsVerticalScrollIndicator={true}
        showsHorizontalScrollIndicator={true}
        contentContainerStyle={styles.bodyScrollViewContent}
      >
        <View style={[styles.masterComponentsWrapper, styles.masterSpaceBlock]}>
          <View style={styles.masterComponents}>
            <View style={styles.masterComponentsInner}>
              <View
                style={[
                  styles.emailNotificationsIconWrapper,
                  styles.notificationsWrapperFlexBox,
                ]}
              >
                <View
                  style={[styles.emailNotificationsIcon, styles.iconLayout1]}
                >
                  <Image
                    style={[
                      styles.vuesaxtwotonemessageTextIcon,
                      styles.iconLayout1,
                    ]}
                    contentFit="cover"
                    source={require("../assets/vuesaxtwotonemessagetext.png")}
                  />
                </View>
              </View>
            </View>
            <View style={[styles.frameParent, styles.frameParentSpaceBlock]}>
              <View
                style={[
                  styles.emailNotificationsWrapper,
                  styles.notificationsWrapperFlexBox,
                ]}
              >
                <Text
                  style={[
                    styles.emailNotifications,
                    styles.notificationsFlexBox,
                  ]}
                >
                  Email Notifications
                </Text>
              </View>
              <View
                style={[
                  styles.pushNotificationsToEmailWrapper,
                  styles.notificationsWrapperFlexBox,
                ]}
              >
                <Text
                  style={[
                    styles.pushNotificationsTo,
                    styles.notificationsFlexBox,
                  ]}
                >
                  Push notifications to email
                </Text>
              </View>
            </View>
            <View
              style={[styles.toggleSwitchWrapper, styles.frameParentSpaceBlock]}
            >
              <Switch
                trackColor={{ false: "#979797", true: "#1A244D" }}
                thumbColor={isEmailEnabled ? "#F4F3F4" : "F4F3F4"}
                ios_backgroundColor="grey"
                onValueChange={toggleEmailSwitch}
                value={isEmailEnabled}
              />
              {/* <RNESwitch
                style={styles.toggleSwitch}
                name="Email"
                checked={false}
                disabled={false}
                required={false}
                value={toggleSwitchValue}
                onValueChange={setToggleSwitchValue}
                color="#fff"
              >
                <View style={styles.toggleOff}>
                  <View style={styles.rectangle} />
                  <View style={styles.rectangleShadowBox} />
                </View>
              </RNESwitch> */}
            </View>
          </View>
        </View>
        <View
          style={[styles.masterComponentsContainer, styles.masterSpaceBlock]}
        >
          <View style={styles.masterComponents}>
            <View style={styles.masterComponentsInner}>
              <View
                style={[
                  styles.emailNotificationsIconWrapper,
                  styles.notificationsWrapperFlexBox,
                ]}
              >
                <Image
                  style={[
                    styles.vuesaxtwotonemessageTextIcon,
                    styles.iconLayout1,
                  ]}
                  contentFit="cover"
                  source={require("../assets/sms-notifications-icon.png")}
                />
              </View>
            </View>
            <View style={[styles.frameParent, styles.frameParentSpaceBlock]}>
              <View
                style={[
                  styles.emailNotificationsWrapper,
                  styles.notificationsWrapperFlexBox,
                ]}
              >
                <Text
                  style={[
                    styles.emailNotifications,
                    styles.notificationsFlexBox,
                  ]}
                >
                  SMS Notifications
                </Text>
              </View>
              <View
                style={[
                  styles.pushNotificationsToEmailWrapper,
                  styles.notificationsWrapperFlexBox,
                ]}
              >
                <Text
                  style={[
                    styles.pushNotificationsTo,
                    styles.notificationsFlexBox,
                  ]}
                >
                  Push notifications to phone
                </Text>
              </View>
            </View>
            <View
              style={[styles.toggleSwitchWrapper, styles.frameParentSpaceBlock]}
            >
              <Switch
                trackColor={{ false: "#979797", true: "#1A244D" }}
                thumbColor={isSMSEnabled ? "#F4F3F4" : "F4F3F4"}
                ios_backgroundColor="grey"
                onValueChange={toggleSMSSwitch}
                value={isSMSEnabled}
              />
              {/* <Switch
                style={styles.toggleSwitch}
                value={toggleSwitch1SwitchValueState}
                onValueChange={setToggleSwitch1SwitchValueState}
                trackColor={{ false: "#939393", true: "#fff" }}
              /> */}
            </View>
          </View>
        </View>
        <View
          style={[styles.masterComponentsContainer, styles.masterSpaceBlock]}
        >
          <View style={styles.masterComponents}>
            <View style={styles.masterComponentsInner}>
              <View
                style={[
                  styles.emailNotificationsIconWrapper,
                  styles.notificationsWrapperFlexBox,
                ]}
              >
                <Image
                  style={[
                    styles.vuesaxtwotonemessageTextIcon,
                    styles.iconLayout1,
                  ]}
                  contentFit="cover"
                  source={require("../assets/order-notifications-icon.png")}
                />
              </View>
            </View>
            <View style={[styles.frameParent, styles.frameParentSpaceBlock]}>
              <View
                style={[
                  styles.emailNotificationsWrapper,
                  styles.notificationsWrapperFlexBox,
                ]}
              >
                <Text
                  style={[
                    styles.emailNotifications,
                    styles.notificationsFlexBox,
                  ]}
                >
                  Order Notifications
                </Text>
              </View>
              <View
                style={[
                  styles.pushNotificationsToEmailWrapper,
                  styles.notificationsWrapperFlexBox,
                ]}
              >
                <Text
                  style={[
                    styles.pushNotificationsTo,
                    styles.notificationsFlexBox,
                  ]}
                >
                  Receive orders notifications
                </Text>
              </View>
            </View>
            <View
              style={[styles.toggleSwitchWrapper, styles.frameParentSpaceBlock]}
            >
              <Switch
                trackColor={{ false: "#979797", true: "#1A244D" }}
                thumbColor={isOrderEnabled ? "#F4F3F4" : "F4F3F4"}
                ios_backgroundColor="grey"
                onValueChange={toggleOrderSwitch}
                value={isOrderEnabled}
              />
              {/* <Switch
                style={styles.toggleSwitch}
                value={toggleSwitch2SwitchValueState}
                onValueChange={setToggleSwitch2SwitchValueState}
                trackColor={{ false: "#939393", true: "#fff" }}
              /> */}
            </View>
          </View>
        </View>
        <View
          style={[styles.masterComponentsContainer, styles.masterSpaceBlock]}
        >
          <View style={styles.masterComponents}>
            <View style={styles.masterComponentsInner}>
              <View
                style={[
                  styles.emailNotificationsIconWrapper,
                  styles.notificationsWrapperFlexBox,
                ]}
              >
                <Image
                  style={[
                    styles.vuesaxtwotonemessageTextIcon,
                    styles.iconLayout1,
                  ]}
                  contentFit="cover"
                  source={require("../assets/chat-notifications-icon.png")}
                />
              </View>
            </View>
            <View style={[styles.frameParent, styles.frameParentSpaceBlock]}>
              <View
                style={[
                  styles.emailNotificationsWrapper,
                  styles.notificationsWrapperFlexBox,
                ]}
              >
                <Text
                  style={[
                    styles.emailNotifications,
                    styles.notificationsFlexBox,
                  ]}
                >
                  Chat Notifications
                </Text>
              </View>
              <View
                style={[
                  styles.pushNotificationsToEmailWrapper,
                  styles.notificationsWrapperFlexBox,
                ]}
              >
                <Text
                  style={[
                    styles.pushNotificationsTo,
                    styles.notificationsFlexBox,
                  ]}
                >
                  Receive chat or call notifications
                </Text>
              </View>
            </View>
            <View
              style={[styles.toggleSwitchWrapper, styles.frameParentSpaceBlock]}
            >
              <Switch
                trackColor={{ false: "#979797", true: "#1A244D" }}
                thumbColor={isChatEnabled ? "#F4F3F4" : "F4F3F4"}
                ios_backgroundColor="grey"
                onValueChange={toggleChatSwitch}
                value={isChatEnabled}
              />
            </View>
          </View>
        </View>
      </ScrollView>
      {/* <View style={[styles.navigationBarHome, styles.masterSpaceBlock]}>
        <View style={styles.segment1}>
          <View style={styles.iconContainerFlexBox}>
            <View style={styles.stateFlexBox}>
              <Image
                style={styles.iconLayout}
                contentFit="cover"
                source={require("../assets/icon1.png")}
              />
            </View>
          </View>
          <Text style={[styles.labelText, styles.labelTypo]}>Home</Text>
        </View>
        <View style={[styles.segment2, styles.segmentSpaceBlock]}>
          <View style={styles.iconContainerFlexBox}>
            <View style={styles.stateFlexBox}>
              <Image
                style={styles.icon2}
                contentFit="cover"
                source={require("../assets/icon2.png")}
              />
            </View>
          </View>
          <Text style={[styles.labelText1, styles.labelTypo]}>Bookings</Text>
        </View>
        <View style={styles.segmentSpaceBlock}>
          <View style={styles.iconContainerFlexBox}>
            <View style={styles.stateFlexBox}>
              <Image
                style={styles.iconLayout}
                contentFit="cover"
                source={require("../assets/icon3.png")}
              />
            </View>
          </View>
          <Text style={[styles.labelText1, styles.labelTypo]}>
            Notifications
          </Text>
        </View>
        <View style={styles.segment1}>
          <View style={[styles.iconContainer3, styles.iconContainerFlexBox]}>
            <View style={styles.stateFlexBox}>
              <Image
                style={[styles.icon4, styles.iconLayout]}
                contentFit="cover"
                source={require("../assets/icon4.png")}
              />
              <View style={styles.badge}>
                <Text style={styles.badgeLabel}>3</Text>
              </View>
            </View>
          </View>
          <Text style={[styles.labelText3, styles.labelTypo]}>Account</Text>
        </View>
      </View> */}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#1a244d",
  },
  bodyScrollViewContent: {
    flexDirection: "column",
    paddingTop: 20,
    paddingBottom: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  notificationsWrapperFlexBox: {
    justifyContent: "center",
    flexDirection: "row",
  },
  masterSpaceBlock: {
    paddingVertical: 0,
    alignSelf: "stretch",
  },
  iconLayout1: {
    width: 20,
    height: 20,
  },
  frameParentSpaceBlock: {
    marginLeft: 10,
    justifyContent: "center",
  },
  notificationsFlexBox: {
    textAlign: "left",
    flex: 1,
  },
  labelTypo: {
    marginTop: 4,
    fontSize: FontSize.level2Medium12_size,
    fontFamily: FontFamily.m3LabelLarge,
    lineHeight: 16,
    letterSpacing: 1,
    fontWeight: "500",
    textAlign: "center",
    alignSelf: "stretch",
  },
  segmentSpaceBlock: {
    opacity: 0.8,
    paddingBottom: Padding.p_base,
    paddingTop: Padding.p_xs,
    width: 90,
    justifyContent: "center",
    alignItems: "center",
  },
  iconContainerFlexBox: {
    borderRadius: Border.br_base,
    justifyContent: "center",
    overflow: "hidden",
    alignItems: "center",
  },
  iconLayout: {
    height: 30,
    width: 26,
    overflow: "hidden",
  },
  vuesaxtwotonemessageTextIcon: {
    height: 20,
  },
  emailNotificationsIcon: {
    height: 20,
    justifyContent: "center",
    flexDirection: "row",
    alignItems: "center",
  },
  emailNotificationsIconWrapper: {
    borderRadius: Border.br_11xl,
    backgroundColor: Color.colorWhitesmoke_600,
    width: 34,
    height: 34,
    alignItems: "center",
  },
  masterComponentsInner: {
    padding: Padding.p_6xs,
    alignItems: "center",
    flexDirection: "row",
  },
  emailNotifications: {
    fontSize: FontSize.bodyLgBodyLgRegular_size,
    fontFamily: FontFamily.typographyParagraphSmallMedium,
    color: Color.colorGray90,
    fontWeight: "500",
    textAlign: "left",
  },
  emailNotificationsWrapper: {
    alignSelf: "stretch",
  },
  pushNotificationsTo: {
    fontSize: FontSize.typographyTaglineSmallRegular_size,
    fontFamily: FontFamily.typographyTaglineSmallRegular,
    color: Color.colorGray60,
  },
  pushNotificationsToEmailWrapper: {
    marginTop: 2,
    alignSelf: "stretch",
  },
  frameParent: {
    flex: 1,
  },
  rectangle: {
    backgroundColor: Color.colorGray50,
    borderRadius: Border.br_lg,
    left: "0%",
    bottom: "0%",
    right: "0%",
    top: "0%",
    position: "absolute",
    height: "100%",
    width: "100%",
  },
  rectangleShadowBox: {
    shadowOpacity: 1,
    elevation: 5,
    shadowRadius: 5,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowColor: "rgba(0, 0, 0, 0.08)",
    left: "8.33%",
    bottom: "15%",
    right: "52.78%",
    top: "15%",
    width: "38.89%",
    height: "70%",
    borderRadius: Border.br_lg,
    position: "absolute",
    backgroundColor: Color.white,
  },
  toggleOff: {
    left: "0%",
    bottom: "0%",
    right: "0%",
    top: "0%",
    position: "absolute",
    height: "100%",
    width: "100%",
  },
  toggleSwitch: {
    width: 36,
    height: 20,
  },
  toggleSwitchWrapper: {
    padding: Padding.p_8xs,
    alignItems: "flex-end",
  },
  masterComponents: {
    paddingHorizontal: Padding.p_8xs,
    paddingVertical: Padding.p_xs,
    alignItems: "center",
    flexDirection: "row",
    alignSelf: "stretch",
    backgroundColor: Color.white,
  },
  masterComponentsWrapper: {
    paddingHorizontal: Padding.p_3xl,
    paddingVertical: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  masterComponentsContainer: {
    marginTop: 15,
    paddingHorizontal: Padding.p_3xl,
    paddingVertical: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  body: {
    backgroundColor: Color.colorWhitesmoke_100,
    alignSelf: "stretch",
    flex: 1,
  },
  stateFlexBox: {
    paddingVertical: Padding.p_9xs,
    paddingHorizontal: Padding.p_xl,
    height: 32,
    width: 64,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  labelText: {
    color: Color.colorDimgray_200,
  },
  segment1: {
    paddingBottom: Padding.p_base,
    paddingTop: Padding.p_xs,
    width: 90,
    justifyContent: "center",
    alignItems: "center",
  },
  icon2: {
    height: 26,
    overflow: "hidden",
    width: 24,
  },
  labelText1: {
    color: Color.colorDarkslategray_100,
  },
  segment2: {
    height: 80,
  },
  icon4: {
    zIndex: 0,
  },
  badgeLabel: {
    marginTop: -7,
    marginLeft: -7,
    top: "50%",
    left: "50%",
    fontSize: FontSize.size_2xs,
    display: "flex",
    width: 14,
    height: 14,
    fontFamily: FontFamily.m3LabelLarge,
    lineHeight: 16,
    letterSpacing: 1,
    position: "absolute",
    fontWeight: "500",
    textAlign: "center",
    color: Color.white,
    justifyContent: "center",
    alignItems: "center",
  },
  badge: {
    top: 2,
    left: 35,
    borderRadius: Border.br_81xl,
    backgroundColor: Color.colorFirebrick_100,
    width: 12,
    height: 12,
    display: "none",
    zIndex: 1,
    position: "absolute",
    overflow: "hidden",
  },
  iconContainer3: {
    backgroundColor: Color.colorLightblue,
  },
  labelText3: {
    color: Color.colorDarkslateblue_200,
  },
  navigationBarHome: {
    borderTopLeftRadius: Border.br_9xs,
    borderTopRightRadius: Border.br_9xs,
    paddingHorizontal: Padding.p_5xs,
    justifyContent: "space-between",
    flexDirection: "row",
    backgroundColor: Color.white,
  },
  notificationsSettings: {
    height: 812,
    width: "100%",
    flex: 1,
    backgroundColor: Color.white,
  },
});

export default NotificationsSettings;
