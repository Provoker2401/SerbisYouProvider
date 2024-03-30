import * as React from "react";
import {
  StatusBar,
  StyleSheet,
  View,
  Text,
  Pressable,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useState } from "react";
import { Image } from "expo-image";
import { Padding, FontFamily, FontSize, Color, Border } from "../GlobalStyles";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  doc,
  onSnapshot
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { useNavigation } from "@react-navigation/native";

const Notifications = () => {
  const navigation = useNavigation();
  const db = getFirestore();
  const auth = getAuth();
  const [notifications, setNotifications] = useState([]);

  const providerAuth = auth.currentUser.uid;

  useEffect(() => {
    const getNotifications = async () => {
      try {
        const userDocRef = doc(db, "providerProfiles", providerAuth);

        // Reference to the notifications collection within the user's document
        const notificationsCollectionRef = collection(
          userDocRef,
          "notifications"
        );

        // Set up a real-time listener for the notifications collection
        const unsubscribe = onSnapshot(notificationsCollectionRef, (snapshot) => {
          const notificationsData = [];

          // Iterate over each document in the notifications collection
          snapshot.forEach((doc) => {
            console.log("Notification Document ID:", doc.id);
            console.log("Notification Document Data:", doc.data());

            notificationsData.push({
              id: doc.id,
              data: doc.data(),
            });
          });

          // Update the state with the new notifications data
          setNotifications(notificationsData);
        });

        // Return a cleanup function to unsubscribe from the listener when component unmounts
        return () => unsubscribe();
      } catch (error) {
        console.log("Error fetching notifications:", error);
      }
    };

    getNotifications();
  }, []);

  return (
    <View style={styles.notifications}>
      <StatusBar barStyle="default" />
      <View style={styles.notification}>
        <View style={styles.tag} />
        <Text style={[styles.notification1, styles.serbisyouTypo]}>
          Notification
        </Text>
      </View>
      <ScrollView
        style={styles.body}
        showsVerticalScrollIndicator={true}
        showsHorizontalScrollIndicator={true}
        contentContainerStyle={styles.bodyScrollViewContent}
      >
        {notifications?.length === 0 ? (
          <View
          style={[styles.noNotifications, styles.noNotificationsSpaceBlock]}
          >
            <View style={styles.viewParentFlexBox}>
              <Image
                style={styles.frameItem}
                contentFit="cover"
                source={require("../assets/frame-34615.png")}
              />
              <View
                style={[styles.noNotificationsParent, styles.viewParentFlexBox]}
              >
                <Text style={styles.noNotifications1}>No Notifications!</Text>
                <View
                  style={[
                    styles.youDontHaveAnyNotificatioWrapper,
                    styles.navigationBarHomeFlexBox,
                  ]}
                >
                  <Text style={[styles.youDontHave, styles.youDontHaveLayout]}>
                    You don’t have any notification yet. Start accepting bookings to get started.
                  </Text>
                </View>
              </View>
            </View>
            <View
              style={[styles.viewAllServicesBtnWrapper, styles.viewParentFlexBox]}
            >
              <Pressable style={styles.viewAllServicesBtn} onPress={() =>navigation.navigate("BottomTabsRoot", { screen: "Homepage" })}>
                <Text style={[styles.viewAllServices, styles.youDontHaveLayout]}>
                  View all services
                </Text>
              </Pressable>
            </View>
          </View>
        ) : (
          <View style={styles.bodyInner}>
            {notifications.map((notification) => (
              <View 
                key={notification.id}
                style={styles.frameGroup}
              >
                <View style={styles.todayWrapper}>
                  <Text style={[styles.today, styles.todayClr]}>{notification.id}</Text>
                </View>
                {Object.keys(notification.data).map((key) => (
                  <View 
                    style={[styles.orderCanceled, styles.orderSpaceBlock]}
                    key={key}
                  >
                    <View style={styles.iconWrapper}>
                      <Image
                        style={styles.iconLayout1}
                        contentFit="cover"
                        source={require("../assets/icon9.png")}
                      />
                    </View>
                    <View style={styles.bookingAcceptedParent}>
                      <Text style={[styles.creditCardConnected, styles.todayClr]}>
                        {notification.data[key].title}{" "}
                      </Text>
                      <Text style={styles.youHaveAccepted}>
                        {notification.data[key].subTitle}{" "}
                      </Text>
                    </View>
                  </View>
                ))} 
              </View>
            ))}

          </View>
        )}
        {/* <View style={[styles.orderAccepted3, styles.orderFlexBox]}>
          <View style={styles.iconWrapper}>
            <Image
              style={styles.iconLayout1}
              contentFit="cover"
              source={require("../assets/icon9.png")}
            />
          </View>
          <View style={styles.bookingAcceptedParent}>
            <Text style={[styles.bookingAccepted, styles.todayTypo]}>
              Booking Accepted
            </Text>
            <Text style={styles.youHaveAccepted}>
              You have accepted a service request by Dummy Customer 5
            </Text>
          </View>
          <Pressable style={styles.tripleDotBtn}>
            <View style={styles.ellipseParent}>
              <Image
                style={styles.frameLayout}
                contentFit="cover"
                source={require("../assets/ellipse-19.png")}
              />
              <Image
                style={[styles.frameInner, styles.frameLayout]}
                contentFit="cover"
                source={require("../assets/ellipse-19.png")}
              />
              <Image
                style={[styles.frameInner, styles.frameLayout]}
                contentFit="cover"
                source={require("../assets/ellipse-19.png")}
              />
            </View>
          </Pressable>
        </View> */}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  // No Notification styles
  noNotifications: {
    paddingVertical: 135,
    marginTop: 15,
    borderRadius: Border.br_5xs,
    justifyContent: "center",
    alignSelf: "stretch",
    backgroundColor: Color.white,
  },
  noNotifications1: {
    lineHeight: 26,
    textAlign: "center",
    color: Color.neutral07,
    fontFamily: FontFamily.title2Bold32,
    fontWeight: "700",
    fontSize: FontSize.title3Bold20_size,
  },
  noNotificationsSpaceBlock: {
    paddingHorizontal: Padding.p_xl,
    alignItems: "center",
  },
  viewParentFlexBox: {
    alignItems: "center",
    alignSelf: "stretch",
  },
  frameItem: {
    height: 95,
    width: 90,
  },
  noNotificationsParent: {
    marginTop: 32,
    overflow: "hidden",
  },
  youDontHaveAnyNotificatioWrapper: {
    marginTop: 10,
    paddingHorizontal: Padding.p_xl,
    alignItems: "center",
  },
  navigationBarHomeFlexBox: {
    paddingVertical: 0,
    flexDirection: "row",
    alignSelf: "stretch",
  },
  youDontHave: {
    fontSize: FontSize.m3LabelLarge_size,
    color: "#b0b0b0",
    fontFamily: FontFamily.level2Medium12,
    fontWeight: "500",
    flex: 1,
  },
  youDontHaveLayout: {
    lineHeight: 24,
    letterSpacing: -0.1,
    textAlign: "center",
  },
  viewAllServicesBtnWrapper: {
    marginTop: 40,
    justifyContent: "center",
  },
  viewAllServicesBtn: {
    backgroundColor: Color.colorDarkslategray_600,
    paddingHorizontal: Padding.p_3xl,
    paddingVertical: Padding.p_xs,
    borderRadius: Border.br_5xs,
    flexDirection: "row",
  },
  viewAllServices: {
    fontSize: FontSize.body1Semibold_size,
    color: Color.neutral01,
    width: 122,
    fontFamily: FontFamily.title2Bold32,
    fontWeight: "700",
    lineHeight: 24,
    letterSpacing: -0.1,
  },



  header: {
    backgroundColor: "#1a244d",
  },
  bodyScrollViewContent: {
    flexDirection: "column",
    paddingHorizontal: 0,
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  viewFlexBox: {
    paddingVertical: Padding.p_5xs,
    flexDirection: "row",
    alignSelf: "stretch",
  },
  serbisyouTypo: {
    fontFamily: FontFamily.title2Bold32,
    fontWeight: "700",
    textAlign: "left",
    flex: 1,
  },
  providerTypo: {
    fontSize: FontSize.bodyLgBodyLgRegular_size,
    textAlign: "left",
  },
  locationWrapperFlexBox: {
    justifyContent: "flex-end",
    alignItems: "center",
  },
  currentLocationFlexBox: {
    textAlign: "right",
    color: Color.m3White,
    flex: 1,
  },
  iconLayout1: {
    maxHeight: "100%",
    maxWidth: "100%",
    overflow: "hidden",
    alignSelf: "stretch",
    width: "100%",
    flex: 1,
  },
  todayClr: {
    color: Color.colorGray90,
    textAlign: "left",
    alignSelf: "stretch",
  },
  orderSpaceBlock: {
    marginTop: 8,
    alignSelf: "stretch",
  },
  todayTypo: {
    fontFamily: FontFamily.georamaSemiBold,
    fontWeight: "600",
  },
  frameLayout: {
    height: 2,
    width: 2,
  },
  orderFlexBox: {
    padding: Padding.p_xs,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  labelTypo: {
    marginTop: 4,
    textAlign: "center",
    fontFamily: FontFamily.robotoMedium,
    lineHeight: 16,
    letterSpacing: 1,
    fontSize: FontSize.level2Medium12_size,
    fontWeight: "500",
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
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
  iconLayout: {
    height: 30,
    width: 26,
    overflow: "hidden",
  },
  tag: {
    borderRadius: Border.br_9xs,
    backgroundColor: Color.colorSteelblue,
    width: 4,
    justifyContent: "center",
    alignSelf: "stretch",
  },
  notification1: {
    fontSize: FontSize.size_5xl,
    letterSpacing: -0.5,
    color: Color.neutral07,
    marginLeft: 10,
    textAlign: "left",
  },
  recent: {
    letterSpacing: -0.2,
    lineHeight: 17,
    color: Color.colorSteelblue,
    fontSize: FontSize.level2Medium12_size,
    fontFamily: FontFamily.level2Medium12,
    fontWeight: "500",
    textAlign: "left",
  },
  iconOutline: {
    marginLeft: 4,
  },
  recentBtn: {
    paddingHorizontal: Padding.p_3xs,
    borderRadius: Border.br_81xl,
    alignItems: "flex-end",
    backgroundColor: Color.m3White,
  },
  right: {
    width: 77,
    marginLeft: 10,
    alignItems: "flex-end",
  },
  notification: {
    paddingTop: Padding.p_3xs,
    paddingHorizontal: Padding.p_base,
    alignItems: "center",
    flexDirection: "row",
    alignSelf: "stretch",
    marginTop: 20,
  },
  today: {
    fontFamily: FontFamily.georamaSemiBold,
    fontWeight: "600",
    letterSpacing: 0.9,
    fontSize: FontSize.size_lg,
    color: Color.colorGray90,
  },
  todayWrapper: {
    paddingBottom: Padding.p_3xs,
    alignSelf: "stretch",
  },
  iconWrapper: {
    borderRadius: Border.br_xl,
    backgroundColor: Color.colorWhitesmoke_300,
    width: 34,
    height: 34,
    padding: Padding.p_6xs,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  bookingAccepted: {
    color: Color.lightLabelPrimary,
    fontSize: FontSize.bodyLgBodyLgRegular_size,
    textAlign: "left",
    alignSelf: "stretch",
  },
  youHaveAccepted: {
    fontFamily: FontFamily.typographyTaglineSmallRegular,
    color: Color.colorGray60,
    marginTop: 2,
    fontSize: FontSize.typographyTaglineSmallRegular_size,
    textAlign: "left",
    alignSelf: "stretch",
  },
  bookingAcceptedParent: {
    marginLeft: 16,
    justifyContent: "center",
    flex: 1,
  },
  frameInner: {
    marginTop: 2,
  },
  ellipseParent: {
    justifyContent: "center",
    alignItems: "flex-end",
  },
  tripleDotBtn: {
    paddingVertical: Padding.p_9xs,
    paddingHorizontal: Padding.p_5xs,
    marginLeft: 16,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  orderAccepted: {
    padding: Padding.p_xs,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    backgroundColor: Color.colorLightskyblue,
  },
  yesterday: {
    fontFamily: FontFamily.georamaSemiBold,
    fontWeight: "600",
    letterSpacing: 0.9,
    fontSize: FontSize.size_lg,
    color: Color.colorGray90,
    alignSelf: "stretch",
  },
  yesterdayWrapper: {
    paddingVertical: Padding.p_3xs,
    paddingHorizontal: 0,
  },
  creditCardConnected: {
    fontFamily: FontFamily.georamaSemiBold,
    color: Color.colorGray90,
    fontWeight: "500",
    fontSize: FontSize.bodyLgBodyLgRegular_size,
    // alignSelf: "stretch",
  },
  orderCanceled: {
    paddingHorizontal: Padding.p_xs,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    backgroundColor: Color.m3White,
  },
  frameGroup: {
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "stretch",
  },
  bodyInner: {
    marginTop: 15,
    paddingVertical: 0,
    paddingHorizontal: Padding.p_base,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "stretch",
  },
  orderAccepted3: {
    width: 343,
    marginTop: 15,
    backgroundColor: Color.m3White,
  },
  body: {
    alignSelf: "stretch",
    flex: 1,
  },
  notifications: {
    height: 812,
    width: "100%",
    flex: 1,
    backgroundColor: Color.m3White,
  },
});

export default Notifications;
