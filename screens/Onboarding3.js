import * as React from "react";
import {
  StatusBar,
  StyleSheet,
  ScrollView,
  Pressable,
  Text,
  View,
} from "react-native";
import { Image } from "expo-image";
import { useNavigation } from "@react-navigation/native";
import { FontFamily, Padding, FontSize, Color, Border } from "../GlobalStyles";

const Onboarding3 = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.onboarding3}>
      <StatusBar barStyle="default" />
      <ScrollView
        style={styles.body}
        showsVerticalScrollIndicator={true}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.bodyScrollViewContent}
      >
        <View style={styles.frame}>
          <View style={styles.frame1}>
            <Pressable style={styles.skipBtn}>
              <Text style={[styles.skip, styles.skipTypo]}>Skip</Text>
            </Pressable>
            <View style={[styles.frameInner, styles.frameInnerPosition]}>
              <Image
                style={styles.frameChild}
                contentFit="cover"
                source={require("../assets/ellipse-229.png")}
              />
            </View>
          </View>
        </View>
        <View style={[styles.bodyInner, styles.bodyFlexBox]}>
          <View style={styles.vectorParent}>
            <Image
              style={styles.vectorIcon}
              contentFit="cover"
              source={require("../assets/vector5.png")}
            />
            <Image
              style={[styles.dogSetting41, styles.frameInnerPosition]}
              contentFit="cover"
              source={require("../assets/dog-setting-4-1.png")}
            />
          </View>
        </View>
        <View style={styles.bodyFlexBox}>
          <View style={styles.frameParent}>
            <View style={styles.frame2}>
              <View style={styles.frameGroup}>
                <View style={styles.frameGroup}>
                  <Image
                    style={styles.frameItem}
                    contentFit="cover"
                    source={require("../assets/ellipse-139.png")}
                  />
                </View>
                <View style={styles.ellipseContainer}>
                  <Image
                    style={styles.frameItem}
                    contentFit="cover"
                    source={require("../assets/ellipse-139.png")}
                  />
                </View>
                <View style={styles.ellipseContainer}>
                  <Image
                    style={styles.frameItem}
                    contentFit="cover"
                    source={require("../assets/ellipse-138.png")}
                  />
                </View>
              </View>
              <View style={styles.frameContainer}>
                <View style={styles.frame3}>
                  <Text style={[styles.yourKeyTo, styles.yourKeyToTypo]}>
                    Your key to home service success
                  </Text>
                </View>
                <View style={styles.wereMoreThanJustAnAppWWrapper}>
                  <Text style={[styles.wereMoreThan, styles.getStartedTypo]}>
                    We're more than just an app; we're your pathway to success.
                  </Text>
                </View>
              </View>
            </View>
            <View style={styles.buttons}>
              <Pressable
                style={styles.getStartedBtn}
                onPress={() => navigation.navigate("SignIn")}
              >
                <Text style={[styles.getStarted, styles.getStartedTypo]}>
                  Get Started
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  bodyScrollViewContent: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  skipTypo: {
    fontFamily: FontFamily.level2Medium12,
    fontWeight: "500",
  },
  frameInnerPosition: {
    zIndex: 1,
    position: "absolute",
  },
  bodyFlexBox: {
    paddingBottom: Padding.p_xl,
    alignSelf: "stretch",
    alignItems: "center",
  },
  yourKeyToTypo: {
    fontFamily: FontFamily.title2Bold32,
    fontWeight: "700",
  },
  getStartedTypo: {
    fontSize: FontSize.paragraphMedium15_size,
    textAlign: "center",
    flex: 1,
  },
  skip: {
    fontSize: FontSize.levelSemibold14_size,
    color: Color.colorGray_200,
    textAlign: "center",
  },
  skipBtn: {
    borderRadius: Border.br_xl,
    backgroundColor: Color.colorDeepskyblue_100,
    paddingHorizontal: Padding.p_base,
    paddingVertical: Padding.p_5xs,
    display: "none",
    zIndex: 0,
    justifyContent: "center",
    flexDirection: "row",
    alignItems: "center",
  },
  frameChild: {
    width: 80,
    height: 80,
  },
  frameInner: {
    top: -48,
    left: -40,
    flexDirection: "row",
  },
  frame1: {
    alignItems: "flex-end",
    paddingRight: Padding.p_mini,
    justifyContent: "center",
    flex: 1,
  },
  frame: {
    paddingTop: Padding.p_4xl,
    justifyContent: "center",
    flexDirection: "row",
    alignSelf: "stretch",
    backgroundColor: Color.m3White,
  },
  vectorIcon: {
    width: 356,
    height: 367,
    zIndex: 0,
  },
  dogSetting41: {
    top: 26,
    left: 19,
    width: 320,
    height: 276,
  },
  vectorParent: {
    justifyContent: "center",
    flexDirection: "row",
    alignItems: "center",
  },
  bodyInner: {
    paddingHorizontal: Padding.p_5xs,
    paddingTop: 95,
    justifyContent: "center",
    flexDirection: "row",
  },
  frameItem: {
    width: 16,
    height: 16,
  },
  frameGroup: {
    flexDirection: "row",
  },
  ellipseContainer: {
    marginLeft: 10,
    flexDirection: "row",
  },
  yourKeyTo: {
    fontSize: FontSize.title2Bold32_size,
    letterSpacing: -1,
    lineHeight: 41,
    color: Color.neutral07,
    width: 322,
    textAlign: "center",
  },
  frame3: {
    overflow: "hidden",
    justifyContent: "flex-end",
    alignSelf: "stretch",
    alignItems: "center",
  },
  wereMoreThan: {
    lineHeight: 26,
    color: Color.colorTypographyContentIconsBlack02,
    fontFamily: FontFamily.level2Medium12,
    fontWeight: "500",
  },
  wereMoreThanJustAnAppWWrapper: {
    marginTop: 15,
    justifyContent: "center",
    flexDirection: "row",
    alignSelf: "stretch",
    alignItems: "center",
  },
  frameContainer: {
    marginTop: 25,
    justifyContent: "center",
    alignSelf: "stretch",
    alignItems: "center",
  },
  frame2: {
    alignSelf: "stretch",
    alignItems: "center",
  },
  getStarted: {
    letterSpacing: -0.1,
    lineHeight: 24,
    color: Color.neutral01,
    fontFamily: FontFamily.title2Bold32,
    fontWeight: "700",
  },
  getStartedBtn: {
    borderRadius: Border.br_5xs,
    backgroundColor: Color.colorDarkslategray_600,
    width: 167,
    paddingHorizontal: Padding.p_3xl,
    paddingVertical: Padding.p_xs,
    flexDirection: "row",
  },
  buttons: {
    paddingTop: Padding.p_7xl,
    marginTop: 20,
    justifyContent: "center",
    flexDirection: "row",
    alignSelf: "stretch",
    alignItems: "center",
  },
  frameParent: {
    paddingHorizontal: Padding.p_11xl,
    paddingVertical: 0,
    alignSelf: "stretch",
    alignItems: "center",
  },
  body: {
    alignSelf: "stretch",
    flex: 1,
    backgroundColor: Color.m3White,
  },
  onboarding3: {
    width: "100%",
    height: 812,
    alignItems: "center",
    flex: 1,
    backgroundColor: Color.m3White,
  },
});

export default Onboarding3;
