import * as React from "react";
import {
  StatusBar,
  StyleSheet,
  Pressable,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import FAQsFrame from "../components/FAQsFrame";
import AboutUsFrame from "../components/AboutUsFrame";
import Tab11 from "../components/Tab11";
import Tab1 from "../components/Tab1";
import Tab21 from "../components/Tab21";
import Tab2 from "../components/Tab2";
import { Padding, Border, FontFamily, FontSize, Color } from "../GlobalStyles";

const TopTab = createMaterialTopTabNavigator();
const HelpCenterFAQ = () => {
  return (
    <View style={styles.helpCenterFaq}>
      <StatusBar barStyle="default" />
      <ScrollView
        style={styles.body}
        showsVerticalScrollIndicator={true}
        showsHorizontalScrollIndicator={true}
      >
        <View style={[styles.activeTabs, styles.activeTabsSpaceBlock]}>
          <TopTab.Navigator
            style={styles.tabGroupToptabs}
            tabBar={({ state, descriptors, navigation, position }) => {
              const [activeItems] = React.useState([<Tab11 />, <Tab21 />]);
              const [normalItems] = React.useState([<Tab1 />, <Tab2 />]);
              const activeIndex = state.index;
              return (
                <View style={styles.topTabBarStyle}>
                  {normalItems.map((item, index) => {
                    const isFocused = state.index === index;
                    return (
                      <TouchableOpacity
                        key={index}
                        style={{ flex: 1 }}
                        onPress={() => {
                          navigation.navigate({
                            name: state.routes[index].name,
                            merge: true,
                          });
                        }}
                      >
                        {activeIndex === index ? activeItems[index] : item}
                      </TouchableOpacity>
                    );
                  })}
                </View>
              );
            }}
          >
            <TopTab.Screen
              name="FAQs Frame"
              component={FAQsFrame}
            ></TopTab.Screen>
            <TopTab.Screen
              name="About Us Frame"
              component={AboutUsFrame}
            ></TopTab.Screen>
          </TopTab.Navigator>
          <View style={styles.divider}>
            <Image
              style={[styles.dividerIcon, styles.frameChildLayout]}
              contentFit="cover"
              source={require("../assets/Divider.png")}
            />
          </View>
        </View>
      </ScrollView>
      {/* <View style={[styles.navigationBarHome, styles.stateLayerPosition]}>
        <View style={styles.segment1}>
          <View style={styles.iconContainerFlexBox}>
            <View style={styles.stateFlexBox}>
              <Image
                style={styles.iconLayout}
                contentFit="cover"
                source={require("../assets/icon5.png")}
              />
            </View>
          </View>
          <Text style={[styles.labelText2, styles.labelTypo]}>Home</Text>
        </View>
        <View style={[styles.segment2, styles.segmentSpaceBlock]}>
          <View style={styles.iconContainerFlexBox}>
            <View style={styles.stateFlexBox}>
              <Image
                style={styles.icon2}
                contentFit="cover"
                source={require("../assets/icon6.png")}
              />
            </View>
          </View>
          <Text style={[styles.labelText3, styles.labelTypo]}>Bookings</Text>
        </View>
        <View style={styles.segmentSpaceBlock}>
          <View style={styles.iconContainerFlexBox}>
            <View style={styles.stateFlexBox}>
              <Image
                style={styles.iconLayout}
                contentFit="cover"
                source={require("../assets/icon7.png")}
              />
            </View>
          </View>
          <Text style={[styles.labelText3, styles.labelTypo]}>
            Notifications
          </Text>
        </View>
        <View style={styles.segment1}>
          <View style={[styles.iconContainer3, styles.iconContainerFlexBox]}>
            <View style={styles.stateFlexBox}>
              <Image
                style={[styles.icon4, styles.iconLayout]}
                contentFit="cover"
                source={require("../assets/icon8.png")}
              />
              <View style={[styles.badge, styles.badgePosition]}>
                <Text style={styles.badgeLabel}>3</Text>
              </View>
            </View>
          </View>
          <Text style={[styles.labelText5, styles.labelTypo]}>Account</Text>
        </View>
      </View> */}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#1a244d",
  },
  tabGroupToptabs: {
    width: "100%",
    height: 745,
  },
  topTabBarStyle: {
    alignSelf: "stretch",
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "center",
    minHeight: 51,
    zIndex: 1,
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
  frameChildLayout: {
    maxWidth: "100%",
    overflow: "hidden",
    alignSelf: "stretch",
    width: "100%",
  },
  viewFlexBox: {
    paddingVertical: Padding.p_3xs,
    paddingHorizontal: Padding.p_mini,
    borderRadius: Border.br_13xl,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  generalTypo: {
    textAlign: "left",
    fontFamily: FontFamily.level2Semibold12,
    fontWeight: "600",
    lineHeight: 22,
    fontSize: FontSize.body1Semibold_size,
  },
  firstSpaceBlock: {
    marginTop: 20,
    alignSelf: "stretch",
  },
  stateLayerPosition: {
    borderTopRightRadius: Border.br_9xs,
    borderTopLeftRadius: Border.br_9xs,
  },
  badgeLayout: {
    borderRadius: Border.br_81xl,
    overflow: "hidden",
  },
  polygonIconLayout: {
    height: 15,
    width: 15,
    borderRadius: Border.br_12xs,
  },
  badgePosition: {
    zIndex: 1,
    position: "absolute",
    display: "none",
  },
  answerFrameFlexBox: {
    paddingTop: Padding.p_3xs,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "stretch",
  },
  labelTypo: {
    marginTop: 4,
    fontSize: FontSize.level2Medium12_size,
    fontFamily: FontFamily.m3LabelLarge,
    lineHeight: 16,
    fontWeight: "500",
    letterSpacing: 1,
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
  dividerIcon: {
    height: 2,
    width: 10,
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
  labelText2: {
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
  labelText3: {
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
    fontWeight: "500",
    position: "absolute",
    letterSpacing: 1,
    textAlign: "center",
    color: Color.m3Wite,
    justifyContent: "center",
    alignItems: "center",
  },
  badge: {
    top: 2,
    left: 35,
    backgroundColor: Color.colorFirebrick_100,
    height: 12,
    width: 12,
    borderRadius: Border.br_81xl,
    overflow: "hidden",
  },
  iconContainer3: {
    backgroundColor: Color.colorLightblue,
  },
  labelText5: {
    color: Color.colorDarkslateblue_200,
  },
  navigationBarHome: {
    paddingHorizontal: Padding.p_5xs,
    justifyContent: "space-between",
    paddingVertical: 0,
    alignSelf: "stretch",
    flexDirection: "row",
    backgroundColor: Color.m3White,
  },
  helpCenterFaq: {
    height: 812,
    width: "100%",
    flex: 1,
    backgroundColor: Color.m3White,
  },
});

export default HelpCenterFAQ;
