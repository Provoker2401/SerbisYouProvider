import React, { useState, useCallback } from "react";
import {
  View,
  StyleProp,
  ViewStyle,
  StyleSheet,
  Text,
  Pressable,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";
// import OriginalLocationModal from "./OriginalLocationModal";
import { Color, Padding, FontSize, FontFamily, Border } from "../GlobalStyles";

const Header30 = ({ style }) => {
  const [locationBtnVisible, setLocationBtnVisible] = useState(false);

  const openLocationBtn = useCallback(() => {
    setLocationBtnVisible(true);
  }, []);

  const closeLocationBtn = useCallback(() => {
    setLocationBtnVisible(false);
  }, []);

  return (
    <>
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
          <View style={[styles.frame, styles.locationWrapperFlexBox]}>
            <Pressable style={styles.locationBtn} onPress={openLocationBtn}>
              <View
                style={[
                  styles.currentLocationWrapper,
                  styles.locationWrapperFlexBox,
                ]}
              >
                <Text
                  style={[
                    styles.currentLocation,
                    styles.currentLocationFlexBox,
                  ]}
                >
                  Current Location
                </Text>
              </View>
              <View
                style={[styles.locationBtn1, styles.locationWrapperFlexBox]}
              >
                <View
                  style={[
                    styles.talambanCebuCityWrapper,
                    styles.locationWrapperFlexBox,
                  ]}
                >
                  <Text
                    style={[
                      styles.talambanCebuCity,
                      styles.currentLocationFlexBox,
                    ]}
                  >
                    Talamban, Cebu City
                  </Text>
                </View>
                <View
                  style={[
                    styles.locationBtnInner,
                    styles.locationWrapperFlexBox,
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

      <Modal animationType="fade" transparent visible={locationBtnVisible}>
        <View style={styles.locationBtnOverlay}>
          <Pressable style={styles.locationBtnBg} onPress={closeLocationBtn} />
          {/* <OriginalLocationModal onClose={closeLocationBtn} /> */}
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: Color.colorDarkslateblue_100,
  },
  locationWrapperFlexBox: {
    justifyContent: "flex-end",
    alignItems: "center",
  },
  currentLocationFlexBox: {
    textAlign: "right",
    flex: 1,
    color: Color.white,
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
    color: Color.white,
    alignSelf: "stretch",
  },
  locationBtnOverlay: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(113, 113, 113, 0.3)",
  },
  locationBtnBg: {
    position: "absolute",
    width: "100%",
    height: "100%",
    left: 0,
    top: 0,
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
    paddingHorizontal: 0,
    paddingVertical: Padding.p_5xs,
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    alignSelf: "stretch",
  },
});

export default Header30;
