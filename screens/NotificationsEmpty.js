import * as React from "react";
import { Image } from "expo-image";
import { StyleSheet, Text, View, Pressable, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Padding, Color, FontFamily, FontSize, Border } from "../GlobalStyles";

const NotificationsEmpty = () => {
  return (
    <View style={[styles.notificationsEmpty, styles.iconOutlineLayout]}>
      <View style={styles.statusBarLight}>
        <Image
          style={styles.icons}
          contentFit="cover"
          source={require("../assets/icons.png")}
        />
        <Text style={styles.time}>9:41</Text>
      </View>
      <ScrollView
        style={styles.body}
        showsVerticalScrollIndicator={true}
        showsHorizontalScrollIndicator={true}
        contentContainerStyle={styles.bodyScrollViewContent}
      >
        <View style={styles.notification}>
          <View style={styles.tag} />
          <Text style={styles.notification1}>Notification</Text>
          <View style={styles.right}>
            <Pressable style={[styles.recentBtn, styles.viewFlexBox]}>
              <Text style={styles.recent}>Recent</Text>
              <Image
                style={[styles.iconOutline, styles.iconOutlineLayout]}
                contentFit="cover"
                source={require("../assets/icon-outline.png")}
              />
            </Pressable>
          </View>
        </View>
        <View
          style={[styles.noNotifications, styles.noNotificationsSpaceBlock]}
        >
          <View style={styles.frameParent}>
            <Image
              style={styles.frameItem}
              contentFit="cover"
              source={require("../assets/frame-34615.png")}
            />
            <View style={styles.noNotificationsParent}>
              <Text style={styles.noNotifications1}>No Notifications!</Text>
              <View
                style={[
                  styles.youDontHaveAnyNotificatioWrapper,
                  styles.navigationBarHomeFlexBox,
                ]}
              >
                <Text style={[styles.youDontHave, styles.youDontHaveLayout]}>
                  You don’t have any notification yet. Please place order
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.viewAllServicesBtnWrapper}>
            <Pressable style={styles.viewAllServicesBtn}>
              <Text style={[styles.viewAllServices, styles.youDontHaveLayout]}>
                View all services
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
      <View style={[styles.navigationBarHome, styles.navigationBarHomeFlexBox]}>
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
                style={styles.icon1}
                contentFit="cover"
                source={require("../assets/icon2.png")}
              />
            </View>
          </View>
          <Text style={[styles.labelText1, styles.labelTypo]}>Bookings</Text>
        </View>
        <View style={styles.segment1}>
          <View style={[styles.iconContainer2, styles.iconContainerFlexBox]}>
            <View style={styles.stateFlexBox}>
              <Image
                style={styles.iconLayout}
                contentFit="cover"
                source={require("../assets/icon10.png")}
              />
            </View>
          </View>
          <Text style={[styles.labelText2, styles.labelTypo]}>
            Notifications
          </Text>
        </View>
        <View style={styles.segmentSpaceBlock}>
          <View style={styles.iconContainerFlexBox}>
            <View style={styles.stateFlexBox}>
              <Image
                style={[styles.icon3, styles.iconLayout]}
                contentFit="cover"
                source={require("../assets/icon.png")}
              />
              <View style={styles.badge}>
                <Text style={styles.badgeLabel}>3</Text>
              </View>
            </View>
          </View>
          <Text style={[styles.labelText1, styles.labelTypo]}>Account</Text>
        </View>
      </View>
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
  iconOutlineLayout: {
    width: "100%",
    flex: 1,
  },
  viewFlexBox: {
    paddingVertical: Padding.p_5xs,
    flexDirection: "row",
    alignSelf: "stretch",
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
  noNotificationsSpaceBlock: {
    paddingHorizontal: Padding.p_xl,
    alignItems: "center",
  },
  navigationBarHomeFlexBox: {
    paddingVertical: 0,
    flexDirection: "row",
    alignSelf: "stretch",
  },
  youDontHaveLayout: {
    lineHeight: 24,
    letterSpacing: -0.1,
    textAlign: "center",
  },
  labelTypo: {
    marginTop: 4,
    fontFamily: FontFamily.robotoMedium,
    lineHeight: 16,
    letterSpacing: 1,
    textAlign: "center",
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
  icons: {
    top: 18,
    right: 14,
    width: 67,
    height: 11,
    position: "absolute",
  },
  time: {
    marginTop: -8,
    left: 32,
    letterSpacing: 0,
    lineHeight: 20,
    fontWeight: "600",
    fontFamily: FontFamily.robotoBold,
    color: Color.lightLabelPrimary,
    textAlign: "left",
    fontSize: FontSize.paragraphMedium15_size,
    top: "50%",
    position: "absolute",
  },
  statusBarLight: {
    width: 375,
    height: 44,
    backgroundColor: Color.m3White,
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
    marginLeft: 10,
    color: Color.neutral07,
    fontFamily: FontFamily.title2Bold32,
    fontWeight: "700",
    textAlign: "left",
    flex: 1,
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
    maxWidth: "100%",
    maxHeight: "100%",
    marginLeft: 4,
    overflow: "hidden",
    alignSelf: "stretch",
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
    paddingHorizontal: Padding.p_base,
    paddingVertical: Padding.p_3xs,
    alignItems: "center",
    flexDirection: "row",
    alignSelf: "stretch",
  },
  frameItem: {
    height: 95,
    width: 90,
  },
  noNotifications1: {
    lineHeight: 26,
    textAlign: "center",
    color: Color.neutral07,
    fontFamily: FontFamily.title2Bold32,
    fontWeight: "700",
    fontSize: FontSize.title3Bold20_size,
  },
  youDontHave: {
    fontSize: FontSize.levelSemibold14_size,
    color: "#b0b0b0",
    fontFamily: FontFamily.level2Medium12,
    fontWeight: "500",
    flex: 1,
  },
  youDontHaveAnyNotificatioWrapper: {
    marginTop: 10,
    paddingHorizontal: Padding.p_xl,
    alignItems: "center",
  },
  noNotificationsParent: {
    marginTop: 32,
    overflow: "hidden",
    alignItems: "center",
    alignSelf: "stretch",
  },
  frameParent: {
    alignItems: "center",
    alignSelf: "stretch",
  },
  viewAllServices: {
    color: Color.neutral01,
    width: 122,
    fontFamily: FontFamily.title2Bold32,
    fontWeight: "700",
    lineHeight: 24,
    letterSpacing: -0.1,
    fontSize: FontSize.paragraphMedium15_size,
  },
  viewAllServicesBtn: {
    backgroundColor: Color.colorDarkslategray_600,
    paddingHorizontal: Padding.p_3xl,
    paddingVertical: Padding.p_xs,
    borderRadius: Border.br_5xs,
    flexDirection: "row",
  },
  viewAllServicesBtnWrapper: {
    marginTop: 40,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "stretch",
  },
  noNotifications: {
    paddingVertical: 135,
    marginTop: 15,
    borderRadius: Border.br_5xs,
    justifyContent: "center",
    alignSelf: "stretch",
    backgroundColor: Color.m3White,
  },
  body: {
    alignSelf: "stretch",
    flex: 1,
  },
  stateFlexBox: {
    paddingVertical: Padding.p_9xs,
    height: 32,
    width: 64,
    paddingHorizontal: Padding.p_xl,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  labelText: {
    color: Color.colorDimgray_100,
  },
  segment1: {
    paddingBottom: Padding.p_base,
    paddingTop: Padding.p_xs,
    width: 90,
    justifyContent: "center",
    alignItems: "center",
  },
  icon1: {
    width: 24,
    height: 26,
    overflow: "hidden",
  },
  labelText1: {
    color: Color.colorDarkslategray_100,
  },
  segment2: {
    height: 80,
  },
  iconContainer2: {
    backgroundColor: Color.colorLightskyblue,
  },
  labelText2: {
    color: Color.colorDarkslateblue_200,
  },
  icon3: {
    zIndex: 0,
  },
  badgeLabel: {
    marginTop: -7,
    marginLeft: -7,
    left: "50%",
    fontSize: FontSize.size_2xs,
    display: "flex",
    width: 14,
    height: 14,
    fontFamily: FontFamily.robotoMedium,
    lineHeight: 16,
    letterSpacing: 1,
    textAlign: "center",
    fontWeight: "500",
    justifyContent: "center",
    color: Color.m3White,
    alignItems: "center",
    top: "50%",
    position: "absolute",
  },
  badge: {
    top: 2,
    left: 35,
    backgroundColor: Color.colorFirebrick_100,
    width: 12,
    height: 12,
    display: "none",
    zIndex: 1,
    overflow: "hidden",
    borderRadius: Border.br_81xl,
    position: "absolute",
  },
  navigationBarHome: {
    borderTopLeftRadius: Border.br_9xs,
    borderTopRightRadius: Border.br_9xs,
    paddingHorizontal: Padding.p_5xs,
    justifyContent: "space-between",
    backgroundColor: Color.m3White,
  },
  notificationsEmpty: {
    height: 812,
    backgroundColor: Color.m3White,
  },
});

export default NotificationsEmpty;
