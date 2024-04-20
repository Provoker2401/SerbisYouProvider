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
import { FontFamily, Padding, FontSize, Color, Border } from "../GlobalStyles";

const ForgotPasswordUpdated = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.forgotPasswordUpdated}>
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
                Your password has been changed! You can now login your account.
              </Text>
              <Text style={[styles.congratulations, styles.forgotPasswordTypo]}>
                Congratulations
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.bodyInner}>
          <View style={styles.signInBtnWrapper}>
            <Pressable
              style={styles.signInBtn}
              onPress={() => navigation.navigate("SignIn")}
              testID="sign-in-button"
            >
              <View style={[styles.button, styles.buttonSpaceBlock]}>
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
    paddingTop: 20,
    paddingBottom: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  forgotPasswordTypo: {
    textAlign: "center",
    fontFamily: FontFamily.title2Bold32,
    fontWeight: "700",
  },
  buttonSpaceBlock: {
    paddingVertical: Padding.p_xl,
    alignItems: "center",
  },
  button1Typo: {
    fontSize: FontSize.bodyLgBodyLgRegular_size,
    textAlign: "center",
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
    display: "flex",
    alignItems: "flex-end",
    position: "absolute",
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
    paddingVertical: Padding.p_51xl,
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
    borderRadius: Border.br_xs,
    height: 50,
    paddingHorizontal: Padding.p_5xs,
    justifyContent: "center",
    flexDirection: "row",
    alignSelf: "stretch",
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
    paddingVertical: 0,
    marginTop: 40,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "stretch",
  },
  body: {
    backgroundColor: Color.colorWhitesmoke_100,
    alignSelf: "stretch",
    flex: 1,
  },
  forgotPasswordUpdated: {
    height: 812,
    width: "100%",
    flex: 1,
    backgroundColor: Color.white,
  },
});

export default ForgotPasswordUpdated;
