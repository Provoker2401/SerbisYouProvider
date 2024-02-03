import React, { useState, useEffect } from 'react';
import {
  StatusBar,
  StyleSheet,
  View,
  Text,
  Pressable,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import ActiveBookings from "../components/ActiveBookings";
import HistoryBookings from "../components/HistoryBookings";
import Tab11 from "../components/Tab11";
import Tab1 from "../components/Tab1";
import Tab21 from "../components/Tab21";
import Tab2 from "../components/Tab2";
import { Color, FontFamily, Padding, Border, FontSize } from "../GlobalStyles";

const TopTab = createMaterialTopTabNavigator();
const screenHeight = Dimensions.get('window').height;

const BookingsActive = () => {
  // Get the full screen height
  const [isNavigatorActive, setIsNavigatorActive] = useState(false);
  return (
    <View style={styles.bookingsActive}>
      <StatusBar style={styles.barLayout} barStyle="default" />
      <ScrollView
        style={[styles.body, styles.bodyBg]}
        scrollEnabled={isNavigatorActive}
        showsVerticalScrollIndicator={true}
        showsHorizontalScrollIndicator={false}
        // contentContainerStyle={styles.bodyScrollViewContent}
      >
        <View style={styles.bookings}>
          <View style={styles.tag} />
          <Text style={[styles.bookings1, styles.serbisyouTypo]}>Bookings</Text>
          <Pressable style={[styles.searchBtn, styles.btnWrapperFlexBox]}>
            <Image
              style={styles.vectorIcon}
              contentFit="cover"
              source={require("../assets/vector4.png")}
            />
          </Pressable>
        </View>
        <View style={[styles.activeTabs, styles.activeFlexBox]}>
          <TopTab.Navigator
            style={styles.tabGroupToptabs}
            tabBar={({ state, descriptors, navigation, position }) => {
              const [activeItems] = React.useState([<Tab11 />, <Tab21 />]);
              const [normalItems] = React.useState([<Tab1 />, <Tab2 />]);
              const activeIndex = state.index;

              // Update the state based on tab navigator's activity
              React.useEffect(() => {
                setIsNavigatorActive(activeIndex === 1); // Assuming index 1 is where the tab navigator is active
              }, [activeIndex]);
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
            <TopTab.Screen name="Active Bookings" component={ActiveBookings} />
            <TopTab.Screen
              name="History Bookings"
              component={HistoryBookings}
            />
          </TopTab.Navigator>
          <View style={styles.divider}>
            <View style={styles.divider1} />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#1a244d",
  },
  tabGroupToptabs: {
    width: "100%",
    height: screenHeight * 0.7, // 80% of the screen height
  },
  topTabBarStyle: {
    alignSelf: "stretch",
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "center",
    minHeight: 48,
    zIndex: 1,
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
  serbisyouTypo: {
    textAlign: "left",
    fontFamily: FontFamily.title2Bold32,
    fontWeight: "700",
    flex: 1,
  },
  btnWrapperFlexBox: {
    justifyContent: "flex-end",
    alignItems: "center",
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
  bodyBg: {
    backgroundColor: Color.m3White,

  },
  activeFlexBox: {
    marginTop: 15,
    alignItems: "center",
    alignSelf: "stretch",
    backgroundColor: Color.m3White,
  },
  rectangleFrameShadowBox: {
    padding: Padding.p_3xs,
    shadowOpacity: 1,
    elevation: 4,
    shadowRadius: 4,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowColor: "rgba(0, 0, 0, 0.25)",
    borderRadius: Border.br_3xs,
    alignItems: "center",
    alignSelf: "stretch",
  },
  frameGroupSpaceBlock: {
    marginLeft: 5,
    justifyContent: "center",
  },
  customer1SpaceBlock: {
    marginTop: 9,
    alignSelf: "stretch",
  },
  pendingFlexBox: {
    paddingVertical: Padding.p_7xs,
    paddingHorizontal: Padding.p_3xs,
    borderRadius: Border.br_6xs,
    justifyContent: "center",
    flexDirection: "row",
    alignSelf: "stretch",
  },
  iconPosition: {
    zIndex: 1,
    position: "absolute",
    overflow: "hidden",
  },
  rectangleFrameLayout: {
    maxWidth: "100%",
    overflow: "hidden",
    alignSelf: "stretch",
    width: "100%",
  },
  frameSpaceBlock: {
    paddingTop: Padding.p_xl,
    alignSelf: "stretch",
  },
  dateTimeTypo: {
    color: Color.colorTypographyContentIconsBlack02,
    lineHeight: 24,
    letterSpacing: -0.1,
    fontFamily: FontFamily.interRegular,
    textAlign: "left",
  },
  textTypo: {
    color: Color.colorDarkslategray_300,
    fontFamily: FontFamily.levelSemibold14,
    fontWeight: "600",
    fontSize: FontSize.typographyTaglineSmallRegular_size,
    textAlign: "right",
  },
  dateTimeParentFlexBox: {
    paddingHorizontal: Padding.p_8xs,
    paddingVertical: 0,
    alignItems: "center",
    flexDirection: "row",
    alignSelf: "stretch",
  },
  viewDetailsTypo: {
    textAlign: "center",
    fontSize: FontSize.level2Medium12_size,
    lineHeight: 24,
    letterSpacing: -0.1,
    fontFamily: FontFamily.level2Medium12,
    fontWeight: "500",
  },
  viewBorder: {
    marginLeft: 26,
    borderWidth: 1.6,
    borderColor: Color.colorSteelblue,
    borderRadius: Border.br_xs,
    borderStyle: "solid",
    backgroundColor: Color.colorSteelblue,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    flex: 1,
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
  activeTabs: {
    paddingVertical: 0,
    paddingHorizontal: Padding.p_base,
    justifyContent: "center",
  },
  body: {
    flex: 1,
  },
  bookingsActive: {
    height: 812,
    width: "100%",
    flex: 1,
    backgroundColor: Color.m3White,
  },
});

export default BookingsActive;
