import * as React from "react";
import {
  StatusBar,
  StyleSheet,
  Pressable,
  View,
  Text,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { Padding, FontFamily, FontSize, Color, Border } from "../GlobalStyles";

const HelpCenterAboutUs = () => {
  return (
    <View style={styles.helpCenterAboutUs}>
      <StatusBar barStyle="default" />
      <ScrollView
        style={styles.body}
        showsVerticalScrollIndicator={true}
        showsHorizontalScrollIndicator={true}
        contentContainerStyle={styles.bodyScrollViewContent}
      >
        <View style={[styles.activeTabs, styles.activeTabsSpaceBlock]}>
          <View style={styles.tabGroup} />
          <View style={styles.divider}>
            <Image
              style={styles.dividerIcon}
              contentFit="cover"
              source={require("../assets/divider.png")}
            />
          </View>
        </View>
      </ScrollView>
      <View style={[styles.navigationBarHome, styles.activeTabsSpaceBlock]}>
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
    paddingVertical: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  activeTabsSpaceBlock: {
    paddingVertical: 0,
    alignSelf: "stretch",
  },
  stateSpaceBlock: {
    paddingHorizontal: Padding.p_base,
    paddingVertical: 0,
    alignSelf: "stretch",
  },
  tabSpaceBlock: {
    paddingVertical: Padding.p_sm,
    paddingHorizontal: 0,
    alignSelf: "stretch",
  },
  tabFlexBox: {
    justifyContent: "flex-end",
    alignItems: "center",
  },
  descriptionTypo: {
    textAlign: "justify",
    fontFamily: FontFamily.title4Regular18,
    lineHeight: 14,
    fontSize: FontSize.typographyTaglineSmallRegular_size,
    color: Color.colorGray_1000,
    letterSpacing: 0,
    alignSelf: "stretch",
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
  tabGroup: {
    justifyContent: "center",
    flexDirection: "row",
    alignSelf: "stretch",
  },
  dividerIcon: {
    maxWidth: "100%",
    height: 2,
    overflow: "hidden",
    alignSelf: "stretch",
    width: "100%",
  },
  divider: {
    justifyContent: "center",
    alignSelf: "stretch",
  },
  activeTabs: {
    paddingHorizontal: Padding.p_3xl,
    backgroundColor: Color.colorWhitesmoke_100,
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
    position: "absolute",
    fontFamily: FontFamily.m3LabelLarge,
    lineHeight: 16,
    letterSpacing: 1,
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
  helpCenterAboutUs: {
    height: 812,
    width: "100%",
    flex: 1,
    backgroundColor: Color.white,
  },
});

export default HelpCenterAboutUs;
