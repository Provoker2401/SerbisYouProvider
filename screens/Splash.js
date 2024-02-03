import * as React from "react";
import { Image } from "expo-image";
import { StyleSheet, Text, View } from "react-native";
import { Color, FontFamily, FontSize, Padding } from "../GlobalStyles";

const Splash = () => {
  return (
    <View style={[styles.splash, styles.splashFlexBox]}>
      <View style={[styles.serbisyouwhite1Parent, styles.splashFlexBox]}>
        <Image
          style={[styles.serbisyouwhite1Icon, styles.splashLayout]}
          contentFit="cover"
          source={require("../assets/serbisyouwhite-1.png")}
        />
        <Text style={[styles.serbisyou, styles.providerTypo]}>SerbisYou</Text>
        <Text style={[styles.provider, styles.providerTypo]}>PROVIDER</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  splashFlexBox: {
    justifyContent: "center",
    alignItems: "center",
  },
  splashLayout: {
    overflow: "hidden",
    width: "100%",
  },
  providerTypo: {
    color: Color.m3White,
    fontFamily: FontFamily.title2Bold32,
    fontWeight: "700",
  },
  serbisyouwhite1Icon: {
    maxWidth: "100%",
    height: 150,
    alignSelf: "stretch",
  },
  serbisyou: {
    fontSize: 36,
    letterSpacing: 0.9,
    textAlign: "center",
    alignSelf: "stretch",
  },
  provider: {
    fontSize: FontSize.title3Bold20_size,
    letterSpacing: 0.5,
    textAlign: "left",
  },
  serbisyouwhite1Parent: {
    width: 190,
    height: 254,
    paddingHorizontal: 0,
    paddingVertical: Padding.p_11xl,
  },
  splash: {
    backgroundColor: Color.colorDarkslategray_600,
    flex: 1,
    height: 812,
    flexDirection: "row",
    paddingLeft: Padding.p_73xl,
    paddingRight: 93,
    overflow: "hidden",
    width: "100%",
  },
});

export default Splash;
