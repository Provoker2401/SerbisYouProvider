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
import { FontFamily, FontSize, Padding, Border, Color } from "../GlobalStyles";

const ForgotPasswordCode = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.forgotPasswordCode}>
      <StatusBar barStyle="default" />
      <ScrollView
        style={styles.body}
        showsVerticalScrollIndicator={true}
        showsHorizontalScrollIndicator={true}
        contentContainerStyle={styles.bodyScrollViewContent}
      >
        <View style={[styles.frame, styles.codeFlexBox1]}>
          <View style={[styles.group34600default, styles.codeFlexBox1]}>
            <View style={[styles.group34600default, styles.codeFlexBox1]}>
              <Text
                style={[styles.phoneVerification, styles.forgotPasswordTypo]}
              >{`Phone Verification `}</Text>
              <Text style={styles.enterYourOtp}>Enter your OTP code</Text>
            </View>
            <View style={styles.code1Parent}>
              <TextInput
                style={[styles.code1, styles.codeTypo1]}
                keyboardType="number-pad"
                autoCapitalize="none"
                placeholderTextColor="#1a1d1f"
              />
              <TextInput
                style={[styles.code2, styles.codeFlexBox]}
                keyboardType="number-pad"
                autoCapitalize="none"
                placeholderTextColor="#1a1d1f"
              />
              <TextInput
                style={[styles.code2, styles.codeFlexBox]}
                keyboardType="number-pad"
                autoCapitalize="none"
                placeholderTextColor="#1a1d1f"
              />
              <TextInput
                style={[styles.code2, styles.codeFlexBox]}
                keyboardType="number-pad"
                autoCapitalize="none"
                placeholderTextColor="#1a1d1f"
              />
              <TextInput
                style={[styles.code2, styles.codeFlexBox]}
                keyboardType="number-pad"
                autoCapitalize="none"
                placeholderTextColor="#1a1d1f"
              />
              <TextInput
                style={[styles.code2, styles.codeFlexBox]}
                keyboardType="number-pad"
                autoCapitalize="none"
                placeholderTextColor="#1a1d1f"
              />
            </View>
          </View>
          <Pressable
            style={[styles.verifyBtn, styles.codeFlexBox1]}
            testID="verify-button"
            onPress={() => navigation.navigate("ForgotPasswordResendCode")}
          >
            <View style={styles.button}>
              <Text style={styles.button1}>Verify</Text>
            </View>
          </Pressable>
        </View>
        <View style={[styles.group34600reSendCodeIn0, styles.codeFlexBox1]}>
          <Text
            style={[styles.didntReceiveCode, styles.codeTypo]}
          >{`Didn’t receive code? `}</Text>
          <Pressable
            style={styles.codeFlexBox}
            testID="resend-button"
            onPress={() => navigation.navigate("ForgotPasswordResendCode")}
          >
            <Text style={[styles.resendCode, styles.codeTypo]}>
              Resend code
            </Text>
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
    paddingTop: 20,
    paddingBottom: 100,
    alignItems: "center",
    justifyContent: "center",
  },
  codeFlexBox1: {
    justifyContent: "center",
    alignItems: "center",
  },
  forgotPasswordTypo: {
    textAlign: "center",
    fontFamily: FontFamily.title2Bold32,
    fontWeight: "700",
  },
  codeTypo1: {
    fontSize: FontSize.size_19xl,
    fontFamily: FontFamily.level2Semibold12,
    fontWeight: "600",
    paddingVertical: Padding.p_xs,
    height: 64,
    paddingHorizontal: Padding.p_5xs,
    borderRadius: Border.br_xs,
    overflow: "hidden",
    flex: 1,
  },
  codeFlexBox: {
    marginLeft: 10,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  codeTypo: {
    lineHeight: 22,
    letterSpacing: -0.3,
    fontSize: FontSize.bodyLgBodyLgRegular_size,
    fontFamily: FontFamily.level2Medium12,
    fontWeight: "500",
    textAlign: "center",
  },
  phoneVerification: {
    fontSize: FontSize.m3HeadlineLarge_size,
    letterSpacing: -1,
    lineHeight: 41,
    color: Color.neutral07,
    textAlign: "center",
    fontFamily: FontFamily.title2Bold32,
    fontWeight: "700",
    alignSelf: "stretch",
  },
  enterYourOtp: {
    fontSize: FontSize.m3LabelLarge_size,
    letterSpacing: -0.1,
    lineHeight: 24,
    color: Color.colorTypographyContentIconsBlack02,
    marginTop: 10,
    fontFamily: FontFamily.level2Medium12,
    fontWeight: "500",
    textAlign: "center",
    alignSelf: "stretch",
  },
  group34600default: {
    alignSelf: "stretch",
  },
  code1: {
    backgroundColor: Color.neutral01,
    borderStyle: "solid",
    borderColor: Color.neutralShades0475,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  code2: {
    backgroundColor: Color.neutral03,
    fontSize: FontSize.size_19xl,
    fontFamily: FontFamily.level2Semibold12,
    fontWeight: "600",
    paddingVertical: Padding.p_xs,
    height: 64,
    paddingHorizontal: Padding.p_5xs,
    borderRadius: Border.br_xs,
    overflow: "hidden",
    flex: 1,
  },
  code1Parent: {
    marginTop: 45,
    flexDirection: "row",
    alignSelf: "stretch",
  },
  button1: {
    fontFamily: FontFamily.georamaBold,
    fontSize: FontSize.bodyLgBodyLgRegular_size,
    textAlign: "center",
    color: Color.white,
    fontWeight: "700",
  },
  button: {
    paddingVertical: Padding.p_xl,
    paddingHorizontal: Padding.p_5xs,
    borderRadius: Border.br_xs,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    backgroundColor: Color.colorDarkslateblue_100,
    flex: 1,
  },
  verifyBtn: {
    marginTop: 60,
    flexDirection: "row",
    alignSelf: "stretch",
  },
  frame: {
    paddingHorizontal: Padding.p_3xl,
    paddingTop: Padding.p_121xl,
    alignSelf: "stretch",
  },
  didntReceiveCode: {
    color: Color.colorGray_1100,
  },
  resendCode: {
    color: Color.colorSteelblue_100,
  },
  group34600reSendCodeIn0: {
    paddingHorizontal: Padding.p_10xs,
    paddingVertical: Padding.p_12xs,
    marginTop: 25,
    flexDirection: "row",
  },
  body: {
    backgroundColor: Color.colorWhitesmoke_100,
    alignSelf: "stretch",
    flex: 1,
  },
  forgotPasswordCode: {
    height: 812,
    width: "100%",
    flex: 1,
    backgroundColor: Color.white,
  },
});

export default ForgotPasswordCode;
