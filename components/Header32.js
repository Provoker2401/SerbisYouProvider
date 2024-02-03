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

const Header32 = ({ style }) => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={[styles.header, style]}>
      <View style={[styles.view, styles.viewFlexBox22]}>
        <View style={styles.backBtnWrapper}>
          <Pressable style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Image
              style={styles.icon}
              contentFit="cover"
              source={require("../assets/back-btn.png")}
            />
          </Pressable>
        </View>
        <View style={[styles.serviceDetailsWrapper, styles.viewFlexBox22]}>
          <Text style={styles.serviceDetails}>Service Details</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: Color.colorDarkslateblue_100,
  },
  viewFlexBox22: {
    justifyContent: "center",
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
    paddingLeft: Padding.p_xs,
    paddingTop: Padding.p_7xs,
    paddingBottom: Padding.p_7xs,
  },
  serviceDetails: {
    fontSize: FontSize.title3Bold20_size,
    letterSpacing: 0.5,
    fontWeight: "700",
    fontFamily: FontFamily.title2Bold32,
    color: Color.white,
    textAlign: "center",
  },
  serviceDetailsWrapper: {
    flex: 1,
    paddingRight: Padding.p_4xl,
  },
  view: {
    alignSelf: "stretch",
    height: 72,
    paddingTop: Padding.p_5xs,
    paddingRight: Padding.p_smi,
    paddingBottom: Padding.p_5xs,
  },
});

export default Header32;
