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

const Header17 = ({ style }) => {
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
        <View>
          <Text style={styles.serbisyou}>SerbisYou</Text>
        </View>
        <View style={[styles.frame, styles.locationWrapperFlexBox10]}>
          <Pressable style={styles.locationBtn}>
            <View
              style={[
                styles.currentLocationWrapper,
                styles.locationWrapperFlexBox10,
              ]}
            >
              <Text
                style={[styles.currentLocation, styles.currentLocationFlexBox5]}
              >
                Current Location
              </Text>
            </View>
            <View
              style={[styles.locationBtn1, styles.locationWrapperFlexBox10]}
            >
              <View
                style={[
                  styles.talambanCebuCityWrapper,
                  styles.locationWrapperFlexBox10,
                ]}
              >
                <Text
                  style={[
                    styles.talambanCebuCity,
                    styles.currentLocationFlexBox5,
                  ]}
                >
                  Talamban, Cebu City
                </Text>
              </View>
              <View
                style={[
                  styles.locationBtnInner,
                  styles.locationWrapperFlexBox10,
                ]}
              >
                <Image
                  style={styles.frameChild}
                  contentFit="cover"
                  source={require("../assets/vector-4.png")}
                />
              </View>
            </View>
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
  locationWrapperFlexBox10: {
    justifyContent: "flex-end",
    alignItems: "center",
  },
  currentLocationFlexBox5: {
    textAlign: "right",
    flex: 1,
    color: Color.m3White,
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
    fontWeight: "700",
    fontFamily: FontFamily.title2Bold32,
    textAlign: "left",
    color: Color.m3White,
    alignSelf: "stretch",
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
    justifyContent: "flex-end",
    alignSelf: "stretch",
  },
  talambanCebuCity: {
    fontSize: FontSize.typographyTaglineSmallRegular_size,
    fontFamily: FontFamily.abhayaLibreExtraBold,
  },
  talambanCebuCityWrapper: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
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
    justifyContent: "flex-end",
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
    justifyContent: "flex-end",
  },
  view: {
    justifyContent: "space-between",
    paddingHorizontal: 0,
    paddingVertical: Padding.p_5xs,
    alignItems: "center",
    flexDirection: "row",
    alignSelf: "stretch",
  },
});

export default Header17;
