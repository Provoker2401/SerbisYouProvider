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
import { Color, FontFamily, FontSize, Padding, Border } from "../GlobalStyles";

const ForgotPasswordResendCode = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.forgotPasswordResendCode}>
      <StatusBar barStyle="default" />
      <ScrollView
        style={styles.body}
        showsVerticalScrollIndicator={true}
        showsHorizontalScrollIndicator={true}
        contentContainerStyle={styles.bodyScrollViewContent}
      >
        <View style={[styles.frame, styles.frameFlexBox]}>
          <View style={[styles.group34600default, styles.frameFlexBox]}>
            <View style={[styles.group34600default, styles.frameFlexBox]}>
              <Text
                style={[styles.phoneVerification, styles.forgotPasswordTypo]}
              >{`Phone Verification `}</Text>
              <Text style={[styles.codeHasBeen, styles.codeTypo]}>
                Code has been sent to 09** *** ****
              </Text>
            </View>
            <View style={styles.code1Parent}>
              <TextInput
                style={[styles.code1, styles.codeFlexBox]}
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
            style={[styles.verifyBtn, styles.frameFlexBox]}
            onPress={() => navigation.navigate("SetNewPassword")}
          >
            <View style={styles.button}>
              <Text style={[styles.button1, styles.button1Typo]}>Verify</Text>
            </View>
          </Pressable>
        </View>
        <View style={[styles.group34600reSendCodeIn0, styles.frameFlexBox]}>
          <Text style={[styles.reSendCodeInContainer, styles.button1Typo]}>
            <Text style={styles.reSendCodeIn}>{`Re-send code in  `}</Text>
            <Text style={styles.text}>0:20</Text>
          </Text>
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
  frameFlexBox: {
    justifyContent: "center",
    alignItems: "center",
  },
  button1Clr: {
    color: Color.white,
    fontWeight: "700",
  },
  forgotPasswordTypo: {
    fontFamily: FontFamily.title2Bold32,
    textAlign: "center",
  },
  codeTypo: {
    fontFamily: FontFamily.level2Medium12,
    fontWeight: "500",
  },
  codeFlexBox: {
    fontSize: FontSize.size_19xl,
    fontFamily: FontFamily.level2Semibold12,
    fontWeight: "600",
    paddingVertical: Padding.p_xs,
    height: 64,
    paddingHorizontal: Padding.p_5xs,
    borderRadius: Border.br_xs,
    justifyContent: "center",
    overflow: "hidden",
    alignItems: "center",
    flexDirection: "row",
    flex: 1,
  },
  button1Typo: {
    fontSize: FontSize.bodyLgBodyLgRegular_size,
    textAlign: "center",
  },
  phoneVerification: {
    fontSize: FontSize.m3HeadlineLarge_size,
    letterSpacing: -1,
    lineHeight: 41,
    color: Color.neutral07,
    textAlign: "center",
    fontWeight: "700",
    fontFamily: FontFamily.title2Bold32,
    alignSelf: "stretch",
  },
  codeHasBeen: {
    fontSize: FontSize.m3LabelLarge_size,
    letterSpacing: -0.1,
    lineHeight: 24,
    color: Color.colorTypographyContentIconsBlack02,
    marginTop: 10,
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
  },
  code2: {
    backgroundColor: Color.neutral03,
    marginLeft: 10,
  },
  code1Parent: {
    marginTop: 45,
    flexDirection: "row",
    alignSelf: "stretch",
  },
  button1: {
    fontFamily: FontFamily.georamaBold,
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
  reSendCodeIn: {
    color: Color.colorGray_1100,
  },
  text: {
    color: Color.colorSteelblue_100,
  },
  reSendCodeInContainer: {
    letterSpacing: -0.3,
    lineHeight: 22,
    fontFamily: FontFamily.level2Medium12,
    fontWeight: "500",
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
  forgotPasswordResendCode: {
    height: 812,
    width: "100%",
    flex: 1,
    backgroundColor: Color.white,
  },
});

export default ForgotPasswordResendCode;
