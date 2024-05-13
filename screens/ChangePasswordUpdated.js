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
import { useNavigation } from "@react-navigation/native";
import { Padding, FontSize, FontFamily, Border, Color } from "../GlobalStyles";

const ChangePasswordUpdated = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.changePasswordUpdated}>
      <StatusBar barStyle="default" />
      <ScrollView
        style={styles.body}
        showsVerticalScrollIndicator={true}
        showsHorizontalScrollIndicator={true}
        contentContainerStyle={styles.bodyScrollViewContent}
      >
        <View style={styles.congratulationsComponentWrapper}>
          <View
            style={[styles.congratulationsComponent, styles.buttonSpaceBlock]}
          >
            <Image
              style={styles.congratulationsComponentChild}
              contentFit="cover"
              source={require("../assets/group-6476.png")}
            />
            <View style={styles.yourPasswordHasBeenUpdatedParent}>
              <Text style={[styles.yourPasswordHas, styles.button1Typo]}>
                Your password has been updated!
              </Text>
              <Text style={styles.congratulations}>Congratulations</Text>
            </View>
          </View>
        </View>
        <View style={styles.bodyInner}>
          <View style={styles.signInBtnWrapper}>
            <Pressable
              style={styles.signInBtn}
              onPress={() => navigation.navigate("SignIn")}
            >
              <View style={[styles.button, styles.buttonFlexBox]}>
                <Text style={[styles.button1, styles.button1Typo]}>
                  Sign In
                </Text>
              </View>
            </Pressable>
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
  bodyScrollViewContent: {
    flexDirection: "column",
    paddingHorizontal: 0,
    paddingVertical: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  viewFlexBox: {
    flexDirection: "row",
    alignItems: "center",
  },
  buttonSpaceBlock: {
    paddingVertical: Padding.p_xl,
    alignItems: "center",
  },
  button1Typo: {
    fontSize: FontSize.bodyLgBodyLgRegular_size,
    textAlign: "center",
  },
  buttonFlexBox: {
    paddingHorizontal: Padding.p_5xs,
    flexDirection: "row",
    alignSelf: "stretch",
  },
  labelTypo: {
    marginTop: 4,
    fontSize: FontSize.level2Medium12_size,
    fontFamily: FontFamily.m3LabelLarge,
    fontWeight: "500",
    lineHeight: 16,
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
  congratulationsComponentChild: {
    width: 124,
    height: 124,
  },
  yourPasswordHas: {
    top: 49,
    left: 0,
    lineHeight: 24,
    fontFamily: FontFamily.bodyLgBodyLgRegular,
    color: Color.neutralGray400,
    position: "absolute",
    width: 331,
  },
  congratulations: {
    top: "0%",
    left: "0%",
    fontSize: FontSize.size_11xl,
    letterSpacing: -0.9,
    lineHeight: 41,
    color: Color.neutral07,
    alignItems: "flex-end",
    display: "flex",
    position: "absolute",
    textAlign: "center",
    fontFamily: FontFamily.title2Bold32,
    fontWeight: "700",
    justifyContent: "center",
    width: "100%",
  },
  yourPasswordHasBeenUpdatedParent: {
    height: 83,
    marginTop: 33,
    width: 331,
  },
  congratulationsComponent: {
    paddingHorizontal: 0,
    backgroundColor: Color.colorWhitesmoke_100,
  },
  congratulationsComponentWrapper: {
    paddingVertical: 105,
    paddingHorizontal: 0,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "stretch",
  },
  button1: {
    fontFamily: FontFamily.georamaBold,
    color: Color.white,
    fontWeight: "700",
    fontSize: FontSize.bodyLgBodyLgRegular_size,
  },
  button: {
    borderRadius: Border.br_5xs,
    paddingVertical: Padding.p_xl,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Color.colorDarkslateblue_100,
  },
  signInBtn: {
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "stretch",
  },
  signInBtnWrapper: {
    paddingVertical: Padding.p_21xl,
    paddingHorizontal: 0,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "stretch",
  },
  bodyInner: {
    paddingHorizontal: Padding.p_3xl,
    marginTop: 40,
    paddingVertical: 0,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "stretch",
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
    width: 14,
    height: 14,
    fontFamily: FontFamily.m3LabelLarge,
    fontWeight: "500",
    lineHeight: 16,
    letterSpacing: 1,
    display: "flex",
    position: "absolute",
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
    justifyContent: "space-between",
    paddingVertical: 0,
    backgroundColor: Color.white,
  },
  changePasswordUpdated: {
    height: 812,
    width: "100%",
    flex: 1,
    backgroundColor: Color.white,
  },
});

export default ChangePasswordUpdated;
