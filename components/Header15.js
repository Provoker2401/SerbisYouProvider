import * as React from "react";
import {
  View,
  StyleProp,
  ViewStyle,
  StyleSheet,
  Text,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { Color, Padding, FontSize, FontFamily, Border } from "../GlobalStyles";

const Header15 = ({ style }) => {
  return (
    <SafeAreaView style={[styles.header, style]}>
      <View style={styles.view}>
        <View style={styles.serbisyouwhite2Wrapper}>
          <Image
            style={styles.serbisyouwhite2Icon}
            contentFit="cover"
            source={require("../assets/serbisyouwhite-2.png")}
          />
        </View>
        <View style={styles.frameParent}>
          <View
            style={[styles.serbisyouWrapper, styles.locationWrapperFlexBox7]}
          >
            <Text style={[styles.serbisyou, styles.providerFlexBox3]}>
              SerbisYou
            </Text>
          </View>
          <View
            style={[styles.providerWrapper, styles.locationWrapperFlexBox7]}
          >
            <Text style={[styles.provider, styles.providerFlexBox3]}>
              Provider
            </Text>
          </View>
        </View>
        <View style={[styles.frame, styles.locationWrapperFlexBox6]}>
          <Pressable style={styles.locationBtn}>
            <View
              style={[
                styles.currentLocationWrapper,
                styles.locationWrapperFlexBox6,
              ]}
            >
              <Text
                style={[styles.currentLocation, styles.currentLocationFlexBox3]}
              >
                Current Location
              </Text>
            </View>
            <Pressable
              style={[styles.locationBtn1, styles.locationWrapperFlexBox6]}
            >
              <View
                style={[
                  styles.talambanCebuCityWrapper,
                  styles.locationWrapperFlexBox6,
                ]}
              >
                <Text
                  style={[
                    styles.talambanCebuCity,
                    styles.currentLocationFlexBox3,
                  ]}
                >
                  Talamban, Cebu City
                </Text>
              </View>
              <View
                style={[
                  styles.locationBtnInner,
                  styles.locationWrapperFlexBox6,
                ]}
              >
                <Image
                  style={styles.frameChild}
                  contentFit="cover"
                  source={require("../assets/vector-4.png")}
                />
              </View>
            </Pressable>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: Color.colorDarkslateblue_100,
  },
  locationWrapperFlexBox7: {
    alignSelf: "stretch",
    flexDirection: "row",
  },
  providerFlexBox3: {
    textAlign: "left",
    color: Color.m3White,
  },
  locationWrapperFlexBox6: {
    justifyContent: "flex-end",
    alignItems: "center",
  },
  currentLocationFlexBox3: {
    textAlign: "right",
    color: Color.m3White,
    flex: 1,
  },
  serbisyouwhite2Icon: {
    width: 63,
    height: 49,
  },
  serbisyouwhite2Wrapper: {
    paddingLeft: Padding.p_xs,
    paddingTop: Padding.p_7xs,
    paddingBottom: Padding.p_7xs,
  },
  serbisyou: {
    fontSize: FontSize.title3Bold20_size,
    letterSpacing: 0.5,
    lineHeight: 20,
    fontWeight: "700",
    fontFamily: FontFamily.title2Bold32,
    flex: 1,
  },
  serbisyouWrapper: {
    flexDirection: "row",
  },
  provider: {
    fontSize: FontSize.bodyLgBodyLgRegular_size,
    letterSpacing: 0.4,
    lineHeight: 15,
    fontFamily: FontFamily.interRegular,
  },
  providerWrapper: {
    paddingLeft: Padding.p_mini,
    flexDirection: "row",
  },
  frameParent: {
    flex: 1,
  },
  currentLocation: {
    fontSize: FontSize.size_4xs,
    letterSpacing: 0.6,
    lineHeight: 12,
    textTransform: "uppercase",
    fontWeight: "500",
    fontFamily: FontFamily.level2Medium12,
  },
  currentLocationWrapper: {
    flexDirection: "row",
    alignSelf: "stretch",
  },
  talambanCebuCity: {
    fontSize: FontSize.typographyTaglineSmallRegular_size,
    fontFamily: FontFamily.abhayaLibreExtraBold,
  },
  talambanCebuCityWrapper: {
    flex: 1,
    flexDirection: "row",
  },
  frameChild: {
    borderRadius: Border.br_12xs,
    width: 11,
    height: 6,
  },
  locationBtnInner: {
    marginLeft: 1,
  },
  locationBtn1: {
    marginTop: 1,
    flexDirection: "row",
    alignSelf: "stretch",
  },
  locationBtn: {
    alignItems: "flex-end",
    justifyContent: "center",
    flex: 1,
  },
  frame: {
    paddingRight: Padding.p_smi,
    flex: 1,
    flexDirection: "row",
  },
  view: {
    paddingHorizontal: 0,
    paddingVertical: Padding.p_5xs,
    alignItems: "center",
    flexDirection: "row",
    alignSelf: "stretch",
  },
});

export default Header15;
