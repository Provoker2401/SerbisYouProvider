import * as React from "react";
import { Image } from "expo-image";
import { StyleSheet, Text, View, TextInput, Pressable } from "react-native";
import { FontFamily, FontSize, Padding, Border, Color } from "../GlobalStyles";

const AuthenticationResendCode = () => {
  return (
    <View style={[styles.authenticationResendCode, styles.frameFlexBox]}>
      <View style={[styles.frame, styles.frameFlexBox]}>
        <View style={styles.statusBarLight}>
          <Image
            style={styles.icons}
            contentFit="cover"
            source={require("../assets/icons.png")}
          />
          <Text style={styles.time}>9:41</Text>
        </View>
        <View style={[styles.frame1, styles.frameFlexBox]}>
          <View style={[styles.body, styles.frameFlexBox]}>
            <View style={[styles.body, styles.frameFlexBox]}>
              <View style={styles.frameFlexBox}>
                <View style={styles.frame3}>
                  <Text
                    style={[styles.authentication, styles.signInTypo]}
                  >{`    Authentication `}</Text>
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
                <Text
                  style={[styles.weveSentA, styles.weveSentATypo]}
                >{`We’ve sent a code to the phone number provided.
Enter the code in that message to continue.`}</Text>
              </View>
              <View
                style={[styles.group34600buttonprimary, styles.frameFlexBox]}
              >
                <Pressable style={styles.componentsbutton}>
                  <Text style={[styles.signIn, styles.signInLayout]}>
                    Verify
                  </Text>
                </Pressable>
              </View>
            </View>
            <View style={[styles.group34600reSendCodeIn0, styles.frameFlexBox]}>
              <Text
                style={[styles.reSendCodeInContainer, styles.weveSentATypo]}
              >
                <Text style={styles.reSendCodeIn}>{`Re-send code in  `}</Text>
                <Text style={styles.text}>0:20</Text>
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  frameFlexBox: {
    justifyContent: "center",
    alignItems: "center",
  },
  signInTypo: {
    textAlign: "center",
    fontFamily: FontFamily.title2Bold32,
    fontWeight: "700",
  },
  codeFlexBox: {
    fontSize: FontSize.size_19xl,
    fontFamily: FontFamily.level2Semibold12,
    paddingHorizontal: Padding.p_5xs,
    height: 64,
    paddingVertical: Padding.p_xs,
    borderRadius: Border.br_xs,
    flexDirection: "row",
    fontWeight: "600",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    flex: 1,
  },
  weveSentATypo: {
    fontFamily: FontFamily.level2Medium12,
    fontWeight: "500",
    textAlign: "center",
  },
  signInLayout: {
    lineHeight: 24,
    letterSpacing: -0.1,
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
    top: "50%",
    left: 32,
    letterSpacing: 0,
    lineHeight: 20,
    fontFamily: FontFamily.robotoBold,
    color: Color.colorBlack,
    textAlign: "left",
    fontWeight: "600",
    fontSize: FontSize.body1Semibold_size,
    position: "absolute",
  },
  statusBarLight: {
    width: 375,
    height: 44,
    backgroundColor: Color.white,
  },
  authentication: {
    fontSize: FontSize.m3HeadlineLarge_size,
    letterSpacing: -1,
    lineHeight: 41,
    color: Color.neutral07,
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
    marginTop: 81,
    flexDirection: "row",
    alignSelf: "stretch",
  },
  frame3: {
    zIndex: 0,
    width: 335,
    justifyContent: "center",
    alignItems: "center",
  },
  weveSentA: {
    height: "24.85%",
    marginLeft: -178.5,
    top: "29.03%",
    left: "50%",
    fontSize: FontSize.m3LabelLarge_size,
    color: Color.colorTypographyContentIconsBlack02,
    width: 357,
    zIndex: 1,
    lineHeight: 24,
    letterSpacing: -0.1,
    position: "absolute",
  },
  signIn: {
    color: Color.white,
    textAlign: "center",
    fontFamily: FontFamily.title2Bold32,
    fontWeight: "700",
    fontSize: FontSize.body1Semibold_size,
    letterSpacing: -0.1,
    flex: 1,
  },
  componentsbutton: {
    backgroundColor: Color.colorDarkslateblue_200,
    paddingHorizontal: Padding.p_xl,
    paddingVertical: Padding.p_xs,
    borderRadius: Border.br_xs,
    flexDirection: "row",
    width: 335,
    justifyContent: "center",
    alignItems: "center",
  },
  group34600buttonprimary: {
    marginTop: 60,
    flexDirection: "row",
  },
  body: {
    alignSelf: "stretch",
  },
  reSendCodeIn: {
    color: Color.colorGray_1100,
  },
  text: {
    color: Color.colorSteelblue_100,
  },
  reSendCodeInContainer: {
    fontSize: FontSize.bodyLgBodyLgRegular_size,
    letterSpacing: -0.3,
    lineHeight: 22,
  },
  group34600reSendCodeIn0: {
    paddingHorizontal: Padding.p_10xs,
    paddingVertical: Padding.p_12xs,
    marginTop: 24,
    flexDirection: "row",
  },
  frame1: {
    alignSelf: "stretch",
    flex: 1,
    alignItems: "center",
  },
  frame: {
    alignSelf: "stretch",
    overflow: "hidden",
    alignItems: "center",
    flex: 1,
  },
  authenticationResendCode: {
    width: "100%",
    height: 812,
    overflow: "hidden",
    alignItems: "center",
    flex: 1,
    backgroundColor: Color.white,
  },
});

export default AuthenticationResendCode;
