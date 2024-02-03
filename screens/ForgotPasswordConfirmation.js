import * as React from "react";
import {
  StatusBar,
  StyleSheet,
  Pressable,
  View,
  Text,
  ScrollView,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { useNavigation } from "@react-navigation/native";
import { Padding, Border, FontFamily, Color, FontSize } from "../GlobalStyles";

const ForgotPasswordConfirmation = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.forgotPasswordConfirmation}>
      <StatusBar barStyle="default" />
      <ScrollView
        style={styles.body}
        showsVerticalScrollIndicator={true}
        showsHorizontalScrollIndicator={true}
        contentContainerStyle={styles.bodyScrollViewContent}
      >
        <View style={[styles.frameParent, styles.frameParentFlexBox]}>
          <View style={[styles.resetPassword11Wrapper, styles.wrapperFlexBox]}>
            <Image
              style={styles.resetPassword11}
              contentFit="cover"
              source={require("../assets/resetpassword-1-1.png")}
            />
          </View>
          <View style={[styles.textWrapper, styles.wrapperFrameSpaceBlock]}>
            <View style={[styles.text, styles.wrapperFlexBox]}>
              <View
                style={[styles.resetPasswordWrapper, styles.wrapperFlexBox]}
              >
                <Text style={[styles.resetPassword, styles.passwordTypo]}>
                  Reset Password
                </Text>
              </View>
              <View
                style={[
                  styles.toGetYourNewPasswordPleaWrapper,
                  styles.wrapperFlexBox,
                ]}
              >
                <Text style={styles.toGetYour}>
                  To get your new password, please enter your phone number down
                  below and we will send an OTP on that number for confirmation
                </Text>
              </View>
            </View>
          </View>
          <View style={[styles.frameWrapper, styles.wrapperFrameSpaceBlock]}>
            <View style={[styles.text, styles.wrapperFlexBox]}>
              <View style={styles.componentsinputField}>
                <Text style={styles.phoneNumber}>Phone Number</Text>
                <View
                  style={[
                    styles.componentsinputFieldInner,
                    styles.buttonFlexBox,
                  ]}
                >
                  <View style={styles.leftNumberParent}>
                    <View style={styles.viewFlexBox}>
                      <Image
                        style={[styles.image2354Icon, styles.backBtnLayout]}
                        contentFit="cover"
                        source={require("../assets/image-2354.png")}
                      />
                      <Text style={styles.text1}>+63</Text>
                      <Image
                        style={[styles.leftNumberChild, styles.leftChildLayout]}
                        contentFit="cover"
                        source={require("../assets/vector-32.png")}
                      />
                    </View>
                    <View style={[styles.leftName, styles.rightFlexBox]}>
                      <Text style={styles.mr}>Mr.</Text>
                      <Image
                        style={styles.leftChildLayout}
                        contentFit="cover"
                        source={require("../assets/vector-31.png")}
                      />
                    </View>
                    <TextInput
                      style={[styles.right, styles.rightFlexBox]}
                      placeholder="Phone Number"
                      keyboardType="number-pad"
                      placeholderTextColor="#d1d3d4"
                    />
                  </View>
                </View>
                <Pressable
                  style={styles.useEmailBtn}
                  onPress={() =>
                    navigation.navigate("ForgotPasswordConfirmation1")
                  }
                >
                  <Text style={styles.useEmailInstead}>Use email instead?</Text>
                </Pressable>
              </View>
            </View>
          </View>
          <View style={[styles.frameContainer, styles.frameContainerFlexBox]}>
            <View style={[styles.sendBtnWrapper, styles.frameContainerFlexBox]}>
              <Pressable
                style={[styles.text, styles.wrapperFlexBox]}
                onPress={() => navigation.navigate("ForgotPasswordCode")}
              >
                <View style={[styles.button, styles.buttonFlexBox]}>
                  <Text style={[styles.button1, styles.passwordTypo]}>
                    Send
                  </Text>
                </View>
              </Pressable>
            </View>
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
    alignItems: "center",
    flexDirection: "row",
  },
  wrapperFlexBox: {
    justifyContent: "center",
    alignItems: "center",
  },
  passwordTypo: {
    textAlign: "center",
    fontWeight: "700",
  },
  frameParentFlexBox: {
    paddingTop: Padding.p_11xl,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "stretch",
  },
  wrapperFrameSpaceBlock: {
    marginTop: 40,
    paddingHorizontal: Padding.p_3xl,
  },
  buttonFlexBox: {
    borderRadius: Border.br_5xs,
    justifyContent: "center",
    alignSelf: "stretch",
  },
  backBtnLayout: {
    height: 24,
    width: 24,
  },
  leftChildLayout: {
    height: 4,
    width: 8,
    marginLeft: 8,
  },
  rightFlexBox: {
    marginLeft: 10,
    alignItems: "center",
    flexDirection: "row",
  },
  frameContainerFlexBox: {
    paddingTop: Padding.p_21xl,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "stretch",
  },
  resetPassword11: {
    width: 128,
    height: 128,
  },
  resetPassword11Wrapper: {
    flexDirection: "row",
  },
  resetPassword: {
    lineHeight: 30,
    fontFamily: FontFamily.poppinsBold,
    color: Color.textColorContentSecondary,
    textAlign: "center",
    fontWeight: "700",
    fontSize: FontSize.title3Bold20_size,
  },
  resetPasswordWrapper: {
    flexDirection: "row",
    alignSelf: "stretch",
  },
  toGetYour: {
    lineHeight: 22,
    fontFamily: FontFamily.level2Medium12,
    color: Color.colorGray_800,
    textAlign: "justify",
    fontWeight: "500",
    fontSize: FontSize.bodyLgBodyLgRegular_size,
    flex: 1,
  },
  toGetYourNewPasswordPleaWrapper: {
    marginTop: 5,
    flexDirection: "row",
    alignSelf: "stretch",
  },
  text: {
    alignSelf: "stretch",
  },
  textWrapper: {
    paddingTop: Padding.p_11xl,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "stretch",
  },
  phoneNumber: {
    color: Color.neutral07,
    textAlign: "left",
    lineHeight: 24,
    letterSpacing: -0.1,
    fontSize: FontSize.body1Semibold_size,
    fontFamily: FontFamily.level2Semibold12,
    fontWeight: "600",
    alignSelf: "stretch",
  },
  image2354Icon: {
    borderRadius: Border.br_181xl,
    display: "none",
  },
  text1: {
    fontSize: FontSize.m3LabelLarge_size,
    marginLeft: 8,
    color: Color.colorTypographyContentIconsBlack,
    textAlign: "left",
    fontFamily: FontFamily.level2Semibold12,
    fontWeight: "600",
    letterSpacing: -0.1,
  },
  leftNumberChild: {
    display: "none",
  },
  mr: {
    color: Color.colorTypographyContentIconsBlack,
    textAlign: "left",
    fontFamily: FontFamily.level2Semibold12,
    fontWeight: "600",
    lineHeight: 24,
    letterSpacing: -0.1,
    fontSize: FontSize.body1Semibold_size,
  },
  leftName: {
    display: "none",
  },
  right: {
    fontFamily: FontFamily.level2Semibold12,
    fontWeight: "600",
    marginLeft: 10,
    fontSize: FontSize.bodyLgBodyLgRegular_size,
    flex: 1,
  },
  leftNumberParent: {
    flexDirection: "row",
    alignSelf: "stretch",
  },
  componentsinputFieldInner: {
    backgroundColor: Color.colorInputDefault,
    padding: Padding.p_xs,
    marginTop: 8,
  },
  useEmailInstead: {
    fontSize: FontSize.level2Medium12_size,
    fontFamily: FontFamily.workSansMedium,
    color: Color.colorDeepskyblue_200,
    textAlign: "right",
    fontWeight: "500",
  },
  useEmailBtn: {
    justifyContent: "flex-end",
    marginTop: 8,
    flexDirection: "row",
  },
  componentsinputField: {
    alignSelf: "stretch",
  },
  frameWrapper: {
    paddingTop: Padding.p_xl,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "stretch",
  },
  button1: {
    fontFamily: FontFamily.georamaBold,
    fontSize: FontSize.bodyLgBodyLgRegular_size,
    color: Color.white,
    textAlign: "center",
    fontWeight: "700",
  },
  button: {
    height: 50,
    paddingHorizontal: Padding.p_5xs,
    paddingVertical: Padding.p_xl,
    alignItems: "center",
    flexDirection: "row",
    backgroundColor: Color.colorDarkslateblue_100,
  },
  sendBtnWrapper: {
    paddingBottom: Padding.p_xl,
  },
  frameContainer: {
    marginTop: 40,
    paddingHorizontal: Padding.p_3xl,
  },
  frameParent: {
    paddingBottom: Padding.p_xl,
  },
  body: {
    backgroundColor: Color.colorWhitesmoke_100,
    alignSelf: "stretch",
    flex: 1,
  },
  forgotPasswordConfirmation: {
    height: 812,
    width: "100%",
    flex: 1,
    backgroundColor: Color.white,
  },
});

export default ForgotPasswordConfirmation;
