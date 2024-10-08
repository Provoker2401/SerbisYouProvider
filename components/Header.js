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

const Header = ({ style }) => {
  return (
    <SafeAreaView style={[styles.header, style]}>
      <View style={[styles.view, styles.viewFlexBox]}>
        <View style={styles.serbisyouwhite2Wrapper}>
          <Image
            style={styles.serbisyouwhite2Icon}
            contentFit="cover"
            source={require("../assets/serbisyouwhite-2.png")}
          />
        </View>
        <Text style={[styles.profile, styles.profileTypo]}>Profile</Text>
        <Pressable style={[styles.logoutButton, styles.viewFlexBox]}>
          <View style={styles.headlineWrapper}>
            <Text style={[styles.headline, styles.profileTypo]}>Log Out</Text>
          </View>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: Color.colorDarkslateblue_100,
  },
  viewFlexBox: {
    justifyContent: "space-between",
    alignItems: "center",
  },
  profileTypo: {
    textAlign: "center",
    color: Color.m3White,
    fontWeight: "700",
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
  profile: {
    fontSize: FontSize.title3Bold20_size,
    letterSpacing: 0.5,
    fontFamily: FontFamily.title2Bold32,
    width: 131,
  },
  headline: {
    fontSize: FontSize.bodyLgBodyLgRegular_size,
    lineHeight: 28,
    fontFamily: FontFamily.robotoBold,
  },
  headlineWrapper: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  logoutButton: {
    borderRadius: Border.br_5xs,
    backgroundColor: Color.colorRed_100,
    height: 29,
    overflow: "hidden",
    paddingHorizontal: Padding.p_sm,
    paddingVertical: 0,
  },
  view: {
    alignSelf: "stretch",
    paddingTop: Padding.p_5xs,
    paddingRight: Padding.p_2xs,
    paddingBottom: Padding.p_5xs,
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

export default Header;
