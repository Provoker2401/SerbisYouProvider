import * as React from "react";
import { Image } from "expo-image";
import { StyleSheet, Text, View, Pressable, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Color, Padding, FontFamily, FontSize, Border } from "../GlobalStyles";

const EmptyBookingsActive = () => {
  return (
    <View style={styles.emptyBookingsActive}>
      <View style={[styles.statusBarLight, styles.barLayout]}>
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
        <View style={[styles.bookings, styles.stateFlexBox1]}>
          <View style={styles.tag} />
          <Text style={[styles.bookings1, styles.bookingsTypo]}>Bookings</Text>
          <View style={styles.vectorWrapper}>
            <Image
              style={styles.vectorIcon}
              contentFit="cover"
              source={require("../assets/vector4.png")}
            />
          </View>
        </View>
        <View style={[styles.activeTabs, styles.activeTabsSpaceBlock]}>
          <View style={styles.tabGroup}>
            <View style={styles.tab1}>
              <View style={[styles.stateLayer, styles.stateFlexBox1]}>
                <View style={[styles.tabContents, styles.tabSpaceBlock]}>
                  <Text style={styles.label}>Active</Text>
                </View>
                <View style={[styles.indicator, styles.badgePosition]} />
              </View>
            </View>
            <View style={styles.tab1}>
              <View style={[styles.stateLayer1, styles.stateFlexBox1]}>
                <View style={[styles.tabContents1, styles.tabSpaceBlock]}>
                  <Text style={[styles.label1, styles.label1Typo]}>
                    History
                  </Text>
                </View>
              </View>
            </View>
          </View>
          <View style={styles.divider}>
            <View style={styles.divider1} />
          </View>
        </View>
        <View style={styles.activeTabsSpaceBlock}>
          <View style={styles.componentsBookingsInner}>
            <View style={styles.frameParent}>
              <View style={styles.componentsBookingsInner}>
                <Image
                  style={styles.component13Icon}
                  contentFit="cover"
                  source={require("../assets/component-132.png")}
                />
              </View>
              <View style={styles.frameWrapperFlexBox}>
                <Text style={[styles.noUpcomingBookings, styles.bookingsTypo]}>
                  No Upcoming Bookings
                </Text>
                <Text
                  style={[
                    styles.currentlyYouDont,
                    styles.viewAllServicesLayout,
                  ]}
                >
                  Currently you don’t have any upcoming order. Place and track
                  your orders from here.
                </Text>
              </View>
              <View style={[styles.frameWrapper, styles.frameWrapperFlexBox]}>
                <View style={styles.componentsbuttonWrapper}>
                  <Pressable style={styles.componentsbutton}>
                    <Text
                      style={[
                        styles.viewAllServices,
                        styles.viewAllServicesLayout,
                      ]}
                    >
                      Make a Booking
                    </Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
      <View style={[styles.navigationBar, styles.barLayout]}>
        <View style={[styles.segment1, styles.segmentFlexBox]}>
          <View style={styles.iconContainerFlexBox}>
            <View style={styles.stateFlexBox}>
              <Image
                style={styles.icon}
                contentFit="cover"
                source={require("../assets/icon16.png")}
              />
            </View>
          </View>
          <Text style={[styles.labelText, styles.labelTypo]}>Home</Text>
        </View>
        <View style={styles.segmentFlexBox}>
          <View style={styles.iconContainer1}>
            <View style={[styles.stateLayer3, styles.stateFlexBox]}>
              <Image
                style={[styles.iconOutline, styles.iconOutlineLayout]}
                contentFit="cover"
                source={require("../assets/icon-outline1.png")}
              />
            </View>
          </View>
          <Text style={[styles.labelText1, styles.labelTypo]}>Bookings</Text>
        </View>
        <View style={[styles.segment1, styles.segmentFlexBox]}>
          <View style={styles.iconContainerFlexBox}>
            <View style={styles.stateFlexBox}>
              <Image
                style={[styles.icon24pxnotification, styles.iconOutlineLayout]}
                contentFit="cover"
                source={require("../assets/icon24pxnotification.png")}
              />
            </View>
          </View>
          <Text style={[styles.labelText, styles.labelTypo]}>
            Notifications
          </Text>
        </View>
        <View style={[styles.segment1, styles.segmentFlexBox]}>
          <View style={styles.iconContainerFlexBox}>
            <View style={[styles.stateLayer5, styles.stateFlexBox]}>
              <Image
                style={[styles.icon24pxnotification, styles.iconOutlineLayout]}
                contentFit="cover"
                source={require("../assets/icon17.png")}
              />
            </View>
            <View style={[styles.badge, styles.badgePosition]}>
              <Text style={styles.badgeLabel}>3</Text>
            </View>
          </View>
          <Text style={[styles.labelText, styles.labelTypo]}>Account</Text>
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
  barLayout: {
    width: 375,
    backgroundColor: Color.m3White,
  },
  locationBtnFlexBox: {
    alignItems: "flex-end",
    justifyContent: "center",
  },
  currentLocationFlexBox: {
    textAlign: "right",
    color: Color.m3White,
    flex: 1,
  },
  stateFlexBox1: {
    paddingHorizontal: Padding.p_base,
    alignItems: "center",
    alignSelf: "stretch",
  },
  bookingsTypo: {
    color: Color.neutral07,
    fontFamily: FontFamily.title2Bold32,
    fontWeight: "700",
  },
  activeTabsSpaceBlock: {
    marginTop: 15,
    paddingVertical: 0,
    paddingHorizontal: Padding.p_base,
    alignItems: "center",
    alignSelf: "stretch",
  },
  tabSpaceBlock: {
    paddingVertical: Padding.p_sm,
    paddingHorizontal: 0,
    alignSelf: "stretch",
  },
  badgePosition: {
    zIndex: 1,
    position: "absolute",
  },
  label1Typo: {
    color: Color.colorTypographyContentIconsBlack02,
    fontSize: FontSize.levelSemibold14_size,
    fontWeight: "500",
  },
  viewAllServicesLayout: {
    lineHeight: 24,
    letterSpacing: -0.1,
    textAlign: "center",
  },
  frameWrapperFlexBox: {
    marginTop: 32,
    alignItems: "center",
    alignSelf: "stretch",
  },
  segmentFlexBox: {
    paddingBottom: Padding.p_base,
    paddingTop: Padding.p_xs,
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  labelTypo: {
    marginTop: 4,
    fontSize: FontSize.level2Medium12_size,
    lineHeight: 16,
    letterSpacing: 1,
    fontFamily: FontFamily.robotoMedium,
    textAlign: "center",
    fontWeight: "500",
    alignSelf: "stretch",
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
  iconOutlineLayout: {
    width: 24,
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
    fontWeight: "600",
    fontFamily: FontFamily.robotoBold,
    color: Color.lightLabelPrimary,
    textAlign: "left",
    lineHeight: 20,
    letterSpacing: 0,
    fontSize: FontSize.paragraphMedium15_size,
    top: "50%",
    position: "absolute",
  },
  statusBarLight: {
    height: 44,
  },
  tag: {
    borderRadius: Border.br_9xs,
    width: 4,
    backgroundColor: Color.colorSteelblue,
    justifyContent: "center",
    alignSelf: "stretch",
  },
  bookings1: {
    fontSize: FontSize.size_5xl,
    letterSpacing: -0.5,
    marginLeft: 10,
    textAlign: "left",
    flex: 1,
  },
  vectorIcon: {
    width: 20,
    height: 20,
  },
  vectorWrapper: {
    marginLeft: 10,
    justifyContent: "flex-end",
    alignItems: "center",
    flexDirection: "row",
    alignSelf: "stretch",
  },
  bookings: {
    paddingVertical: Padding.p_3xs,
    flexDirection: "row",
  },
  label: {
    fontWeight: "800",
    fontFamily: FontFamily.robotoBlack,
    color: Color.colorSteelblue,
    textAlign: "center",
    fontSize: FontSize.levelSemibold14_size,
    lineHeight: 20,
    letterSpacing: 0,
  },
  tabContents: {
    zIndex: 0,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  indicator: {
    right: 0,
    bottom: 0,
    left: 0,
    height: 2,
    backgroundColor: Color.colorSteelblue,
  },
  stateLayer: {
    paddingVertical: 0,
    justifyContent: "flex-end",
  },
  tab1: {
    overflow: "hidden",
    justifyContent: "flex-end",
    alignItems: "center",
    flex: 1,
    backgroundColor: Color.m3White,
  },
  label1: {
    fontFamily: FontFamily.robotoMedium,
    color: Color.colorTypographyContentIconsBlack02,
    textAlign: "center",
    lineHeight: 20,
    letterSpacing: 0,
  },
  tabContents1: {
    justifyContent: "center",
    alignItems: "flex-end",
    flexDirection: "row",
  },
  stateLayer1: {
    paddingVertical: 0,
    justifyContent: "flex-end",
  },
  tabGroup: {
    flexDirection: "row",
    alignSelf: "stretch",
  },
  divider1: {
    borderStyle: "solid",
    borderColor: Color.colorLavender_100,
    borderTopWidth: 1,
    height: 1,
    alignSelf: "stretch",
  },
  divider: {
    justifyContent: "center",
    alignSelf: "stretch",
  },
  activeTabs: {
    justifyContent: "center",
    backgroundColor: Color.m3White,
  },
  component13Icon: {
    width: 93,
    height: 90,
  },
  componentsBookingsInner: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    alignSelf: "stretch",
  },
  noUpcomingBookings: {
    lineHeight: 26,
    textAlign: "center",
    fontSize: FontSize.title3Bold20_size,
    color: Color.neutral07,
    alignSelf: "stretch",
  },
  currentlyYouDont: {
    marginTop: 10,
    color: Color.colorTypographyContentIconsBlack02,
    fontSize: FontSize.levelSemibold14_size,
    fontWeight: "500",
    fontFamily: FontFamily.level2Medium12,
    alignSelf: "stretch",
  },
  viewAllServices: {
    color: Color.neutral01,
    width: 122,
    fontFamily: FontFamily.title2Bold32,
    fontWeight: "700",
    letterSpacing: -0.1,
    fontSize: FontSize.paragraphMedium15_size,
  },
  componentsbutton: {
    backgroundColor: Color.colorDarkslategray_600,
    paddingHorizontal: Padding.p_3xl,
    paddingVertical: Padding.p_xs,
    borderRadius: Border.br_5xs,
    flexDirection: "row",
  },
  componentsbuttonWrapper: {
    justifyContent: "center",
    alignItems: "center",
  },
  frameWrapper: {
    paddingHorizontal: Padding.p_51xl,
    paddingVertical: 0,
    justifyContent: "center",
  },
  frameParent: {
    paddingVertical: Padding.p_121xl,
    paddingHorizontal: Padding.p_xl,
    borderRadius: Border.br_5xs,
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    backgroundColor: Color.m3White,
  },
  body: {
    alignSelf: "stretch",
    flex: 1,
  },
  icon: {
    width: 26,
    height: 30,
    overflow: "hidden",
  },
  iconContainerFlexBox: {
    width: 32,
    borderRadius: Border.br_base,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  labelText: {
    color: Color.colorDarkslategray_100,
  },
  segment1: {
    opacity: 0.8,
  },
  iconOutline: {
    height: 26,
  },
  stateLayer3: {
    backgroundColor: Color.colorLightskyblue,
  },
  iconContainer1: {
    backgroundColor: Color.m3SysLightSecondaryContainer,
    borderRadius: Border.br_base,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
  labelText1: {
    color: Color.colorDarkslateblue_200,
  },
  icon24pxnotification: {
    height: 24,
  },
  stateLayer5: {
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
    lineHeight: 16,
    letterSpacing: 1,
    fontFamily: FontFamily.robotoMedium,
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
    left: 16,
    borderRadius: Border.br_81xl,
    backgroundColor: Color.colorFirebrick_100,
    width: 16,
    height: 16,
    display: "none",
    overflow: "hidden",
  },
  navigationBar: {
    borderTopLeftRadius: Border.br_9xs,
    borderTopRightRadius: Border.br_9xs,
    paddingHorizontal: Padding.p_5xs,
    paddingVertical: 0,
    flexDirection: "row",
  },
  emptyBookingsActive: {
    width: "100%",
    height: 812,
    flex: 1,
    backgroundColor: Color.m3White,
  },
});

export default EmptyBookingsActive;
