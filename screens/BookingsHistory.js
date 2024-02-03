import * as React from "react";
import { Image } from "expo-image";
import { StyleSheet, Text, View, Pressable, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Color, FontSize, FontFamily, Padding, Border } from "../GlobalStyles";

const BookingsHistory = () => {
  return (
    <View style={[styles.bookingsHistory, styles.bodyBg]}>
      <View style={[styles.statusBarLight, styles.barLayout]}>
        <Image
          style={styles.icons}
          contentFit="cover"
          source={require("../assets/icons.png")}
        />
        <Text style={[styles.time, styles.timeTypo]}>9:41</Text>
      </View>
      <ScrollView
        style={[styles.body, styles.bodyBg]}
        showsVerticalScrollIndicator={true}
        showsHorizontalScrollIndicator={true}
        contentContainerStyle={styles.bodyScrollViewContent}
      >
        <View style={styles.bookings}>
          <View style={styles.tag} />
          <Text style={[styles.bookings1, styles.johnDoeTypo1]}>Bookings</Text>
          <Pressable style={[styles.searchBtn, styles.tabWrapperFlexBox]}>
            <Image
              style={styles.vectorIcon}
              contentFit="cover"
              source={require("../assets/vector4.png")}
            />
          </Pressable>
        </View>
        <View style={[styles.historyTabs, styles.historySpaceBlock]}>
          <View style={styles.serbisyouWrapper} />
          <View style={styles.divider}>
            <View style={styles.divider1} />
          </View>
        </View>
      </ScrollView>
      <View style={[styles.navigationBarHome, styles.barLayout]}>
        <View style={styles.segmentSpaceBlock}>
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
          <View style={[styles.iconContainer1, styles.iconContainerFlexBox]}>
            <View style={styles.stateFlexBox}>
              <Image
                style={styles.icon1}
                contentFit="cover"
                source={require("../assets/icon11.png")}
              />
            </View>
          </View>
          <Text style={[styles.labelText1, styles.labelTypo]}>Bookings</Text>
        </View>
        <View style={[styles.segment3, styles.segmentSpaceBlock]}>
          <View style={[styles.iconContainer2, styles.iconContainerFlexBox]}>
            <View style={styles.stateFlexBox}>
              <Image
                style={styles.iconLayout}
                contentFit="cover"
                source={require("../assets/icon3.png")}
              />
            </View>
          </View>
          <Text style={[styles.labelText2, styles.labelTypo]}>
            Notifications
          </Text>
        </View>
        <View style={[styles.segment3, styles.segmentSpaceBlock]}>
          <View style={[styles.iconContainer2, styles.iconContainerFlexBox]}>
            <View style={styles.stateFlexBox}>
              <Image
                style={[styles.icon3, styles.iconLayout]}
                contentFit="cover"
                source={require("../assets/icon.png")}
              />
              <View style={[styles.badge, styles.indicatorPosition]}>
                <Text style={styles.badgeLabel}>3</Text>
              </View>
            </View>
          </View>
          <Text style={[styles.labelText2, styles.labelTypo]}>Account</Text>
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
  bodyBg: {
    backgroundColor: Color.m3White,
    flex: 1,
  },
  barLayout: {
    width: 375,
    backgroundColor: Color.m3White,
  },
  timeTypo: {
    color: Color.lightLabelPrimary,
    fontSize: FontSize.paragraphMedium15_size,
    textAlign: "left",
  },
  johnDoeTypo1: {
    fontFamily: FontFamily.title2Bold32,
    fontWeight: "700",
    flex: 1,
  },
  text2Typo: {
    fontSize: FontSize.bodyLgBodyLgRegular_size,
    textAlign: "left",
  },
  tabWrapperFlexBox: {
    justifyContent: "flex-end",
    alignItems: "center",
  },
  amTypo: {
    fontFamily: FontFamily.level2Medium12,
    fontWeight: "500",
  },
  historySpaceBlock: {
    marginTop: 15,
    alignSelf: "stretch",
    backgroundColor: Color.m3White,
  },
  tabSpaceBlock: {
    paddingVertical: Padding.p_sm,
    zIndex: 0,
    paddingHorizontal: 0,
    alignSelf: "stretch",
  },
  indicatorPosition: {
    zIndex: 1,
    position: "absolute",
  },
  timeLayout: {
    letterSpacing: 0,
    lineHeight: 20,
  },
  frameSpaceBlock: {
    paddingLeft: Padding.p_8xs,
    flex: 1,
  },
  uscTypo: {
    fontFamily: FontFamily.levelSemibold14,
    fontWeight: "600",
  },
  cancelledFlexBox: {
    paddingVertical: Padding.p_7xs,
    borderRadius: Border.br_6xs,
    paddingHorizontal: Padding.p_3xs,
    justifyContent: "center",
    flexDirection: "row",
    alignSelf: "stretch",
  },
  cancelled1Typo: {
    fontSize: FontSize.level2Medium12_size,
    color: Color.m3White,
  },
  frameLayout: {
    maxWidth: "100%",
    overflow: "hidden",
  },
  johnDoeTypo: {
    fontSize: FontSize.size_3xs,
    letterSpacing: -0.1,
    color: Color.colorTypographyContentIconsBlack02,
    textAlign: "left",
  },
  textTypo: {
    width: 95,
    fontFamily: FontFamily.level2Medium12,
    fontWeight: "500",
    color: Color.lightLabelPrimary,
  },
  parentSpaceBlock: {
    marginLeft: 5,
    justifyContent: "center",
  },
  iconLayout1: {
    height: 23,
    width: 23,
    zIndex: 1,
    overflow: "hidden",
    position: "absolute",
  },
  scheduleFrameFlexBox: {
    paddingTop: Padding.p_xl,
    alignItems: "center",
    alignSelf: "stretch",
  },
  parentFlexBox: {
    paddingHorizontal: Padding.p_8xs,
    paddingVertical: 0,
    alignItems: "center",
    flexDirection: "row",
    alignSelf: "stretch",
  },
  buttonsFrameFlexBox: {
    paddingBottom: Padding.p_3xs,
    paddingTop: Padding.p_xl,
    justifyContent: "center",
    alignItems: "flex-end",
    flexDirection: "row",
    alignSelf: "stretch",
  },
  cancelledFrameSpaceBlock: {
    marginTop: 14,
    paddingBottom: Padding.p_7xs,
    alignItems: "center",
    alignSelf: "stretch",
    backgroundColor: Color.m3White,
  },
  btnBorder: {
    borderWidth: 1.6,
    borderColor: Color.colorSteelblue,
    borderRadius: Border.br_xs,
    borderStyle: "solid",
    overflow: "hidden",
    backgroundColor: Color.colorSteelblue,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    flex: 1,
  },
  labelTypo: {
    marginTop: 4,
    lineHeight: 16,
    letterSpacing: 1,
    fontSize: FontSize.level2Medium12_size,
    textAlign: "center",
    fontFamily: FontFamily.robotoMedium,
    fontWeight: "500",
    alignSelf: "stretch",
  },
  segmentSpaceBlock: {
    paddingBottom: Padding.p_base,
    paddingTop: Padding.p_xs,
    width: 90,
    justifyContent: "center",
    alignItems: "center",
  },
  iconContainerFlexBox: {
    borderRadius: Border.br_base,
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
    fontFamily: FontFamily.robotoBold,
    textAlign: "left",
    fontWeight: "600",
    lineHeight: 20,
    letterSpacing: 0,
    top: "50%",
    color: Color.lightLabelPrimary,
    fontSize: FontSize.paragraphMedium15_size,
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
    color: Color.neutral07,
    marginLeft: 10,
    textAlign: "left",
  },
  vectorIcon: {
    width: 20,
    height: 20,
  },
  searchBtn: {
    marginLeft: 10,
    flexDirection: "row",
    alignSelf: "stretch",
  },
  bookings: {
    paddingVertical: Padding.p_3xs,
    paddingHorizontal: Padding.p_base,
    alignItems: "center",
    flexDirection: "row",
    alignSelf: "stretch",
  },
  serbisyouWrapper: {
    flexDirection: "row",
    alignSelf: "stretch",
  },
  divider1: {
    borderColor: Color.colorLavender_100,
    borderTopWidth: 1,
    height: 1,
    borderStyle: "solid",
    alignSelf: "stretch",
  },
  divider: {
    justifyContent: "center",
    alignSelf: "stretch",
  },
  historyTabs: {
    paddingVertical: 0,
    paddingHorizontal: Padding.p_base,
  },
  body: {
    alignSelf: "stretch",
    flex: 1,
  },
  stateFlexBox: {
    paddingHorizontal: Padding.p_xl,
    height: 32,
    width: 64,
    paddingVertical: Padding.p_9xs,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  labelText: {
    color: Color.colorDimgray_100,
  },
  icon1: {
    width: 24,
    height: 26,
    overflow: "hidden",
  },
  iconContainer1: {
    backgroundColor: Color.colorLightskyblue,
  },
  labelText1: {
    color: Color.colorDarkslateblue_200,
  },
  segment2: {
    height: 80,
  },
  iconContainer2: {
    overflow: "hidden",
  },
  labelText2: {
    color: Color.colorDarkslategray_100,
  },
  segment3: {
    opacity: 0.8,
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
    lineHeight: 16,
    letterSpacing: 1,
    textAlign: "center",
    fontFamily: FontFamily.robotoMedium,
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
    borderRadius: Border.br_81xl,
    backgroundColor: Color.colorFirebrick_100,
    width: 12,
    height: 12,
    display: "none",
    overflow: "hidden",
  },
  navigationBarHome: {
    borderTopLeftRadius: Border.br_9xs,
    borderTopRightRadius: Border.br_9xs,
    justifyContent: "space-between",
    paddingHorizontal: Padding.p_5xs,
    paddingVertical: 0,
    flexDirection: "row",
  },
  bookingsHistory: {
    height: 812,
    width: "100%",
    flex: 1,
  },
});

export default BookingsHistory;
