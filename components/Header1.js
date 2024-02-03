import * as React from "react";
import {
  View,
  StyleProp,
  ViewStyle,
  Pressable,
  StyleSheet,
  Text,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { useNavigation } from "@react-navigation/native";
import { Color, Padding, FontSize, FontFamily } from "../GlobalStyles";

const Header1 = ({ style }) => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={[styles.header, style]}>
      <View style={[styles.view, styles.viewFlexBox1]}>
        <View style={styles.backBtnWrapper}>
          <Pressable style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Image
              style={styles.icon}
              contentFit="cover"
              source={require("../assets/back-btn.png")}
            />
          </Pressable>
        </View>
        <View style={[styles.editProfileWrapper, styles.viewFlexBox1]}>
          <Text style={styles.editProfile}>Edit Profile</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: Color.colorDarkslateblue_100,
  },
  viewFlexBox1: {
    alignItems: "center",
    flexDirection: "row",
  },
  icon: {
    width: "100%",
    height: "100%",
    overflow: "hidden",
  },
  backBtn: {
    width: 24,
    height: 24,
  },
  backBtnWrapper: {
    paddingLeft: Padding.p_3xl,
    paddingTop: Padding.p_7xs,
    paddingBottom: Padding.p_7xs,
  },
  editProfile: {
    fontSize: FontSize.title3Bold20_size,
    letterSpacing: 0.5,
    fontWeight: "700",
    fontFamily: FontFamily.title2Bold32,
    color: Color.m3White,
    textAlign: "center",
    width: 131,
  },
  editProfileWrapper: {
    flex: 1,
    justifyContent: "center",
  },
  view: {
    alignSelf: "stretch",
    height: 72,
    paddingTop: Padding.p_5xs,
    paddingRight: Padding.p_3xl,
    paddingBottom: Padding.p_5xs,
  },
});

export default Header1;
