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
import { Image } from "expo-image";
import { Padding, FontFamily, FontSize, Color, Border } from "../GlobalStyles";

const Notifications = () => {
  return (
    <View style={styles.notifications}>
      <StatusBar barStyle="default" />
      <ScrollView
        style={styles.body}
        showsVerticalScrollIndicator={true}
        showsHorizontalScrollIndicator={true}
        contentContainerStyle={styles.bodyScrollViewContent}
      >
        <View style={styles.notification}>
          <View style={styles.tag} />
          <Text style={[styles.notification1, styles.serbisyouTypo]}>
            Notification
          </Text>
          <View style={styles.right}>
            <Pressable style={[styles.recentBtn, styles.viewFlexBox]}>
              <Text style={styles.recent}>Recent</Text>
              <Image
                style={[styles.iconOutline, styles.iconLayout1]}
                contentFit="cover"
                source={require("../assets/icon-outline.png")}
              />
            </Pressable>
          </View>
        </View>
        <View style={styles.bodyInner}>
          <View style={styles.frameGroup}>
            <View style={styles.todayWrapper}>
              <Text style={[styles.today, styles.todayClr]}>Today</Text>
            </View>
            <View style={[styles.orderAccepted, styles.orderSpaceBlock]}>
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
                  You have accepted a service request by Dummy Customer 1
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
            </View>
            <View style={[styles.orderAccepted, styles.orderSpaceBlock]}>
              <View style={styles.iconWrapper}>
                <Image
                  style={styles.iconLayout1}
                  contentFit="cover"
                  source={require("../assets/icon9.png")}
                />
              </View>
              <View style={styles.bookingAcceptedParent}>
                <Text style={[styles.bookingAccepted, styles.todayTypo]}>
                  Booking Cancelled
                </Text>
                <Text style={styles.youHaveAccepted}>
                  Dummy Customer 2 has cancelled the booking (Booking ID:
                  #FS123FHJ)
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
            </View>
            <View style={[styles.orderAccepted, styles.orderSpaceBlock]}>
              <View style={styles.iconWrapper}>
                <Image
                  style={styles.iconLayout1}
                  contentFit="cover"
                  source={require("../assets/icon9.png")}
                />
              </View>
              <View style={styles.bookingAcceptedParent}>
                <Text style={[styles.bookingAccepted, styles.todayTypo]}>
                  Booking Completed
                </Text>
                <Text style={styles.youHaveAccepted}>
                  You have completed the service request for Dummy Customer 3.
                  Please wait for their rating and review.
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
            </View>
            <View style={[styles.yesterdayWrapper, styles.orderSpaceBlock]}>
              <Text style={[styles.yesterday, styles.todayClr]}>Yesterday</Text>
            </View>
            <View style={[styles.orderCanceled, styles.orderSpaceBlock]}>
              <View style={styles.iconWrapper}>
                <Image
                  style={styles.iconLayout1}
                  contentFit="cover"
                  source={require("../assets/icon9.png")}
                />
              </View>
              <View style={styles.bookingAcceptedParent}>
                <Text style={[styles.creditCardConnected, styles.todayClr]}>
                  Credit Card Connected
                </Text>
                <Text style={styles.youHaveAccepted}>
                  Credit Card has been linked
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
            </View>
            <View style={[styles.orderCanceled, styles.orderSpaceBlock]}>
              <View style={styles.iconWrapper}>
                <Image
                  style={styles.iconLayout1}
                  contentFit="cover"
                  source={require("../assets/icon9.png")}
                />
              </View>
              <View style={styles.bookingAcceptedParent}>
                <Text style={[styles.creditCardConnected, styles.todayClr]}>
                  Account Setup Fully Verified
                </Text>
                <Text style={styles.youHaveAccepted}>
                  Your account has been fully verified
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
            </View>
          </View>
        </View>
        <View style={[styles.orderAccepted3, styles.orderFlexBox]}>
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
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
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
    paddingVertical: Padding.p_3xs,
    paddingHorizontal: Padding.p_base,
    alignItems: "center",
    flexDirection: "row",
    alignSelf: "stretch",
  },
  today: {
    width: 55,
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
    fontFamily: FontFamily.typographyParagraphSmallMedium,
    color: Color.colorGray90,
    fontWeight: "500",
    fontSize: FontSize.bodyLgBodyLgRegular_size,
    alignSelf: "stretch",
  },
  orderCanceled: {
    padding: Padding.p_xs,
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
