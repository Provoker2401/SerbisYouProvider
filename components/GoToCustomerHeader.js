import * as React from "react";
import {
  View,
  Pressable,
  StyleSheet,
  Text,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { useNavigation } from "@react-navigation/native";
import { Color, Padding, FontSize, FontFamily } from "../GlobalStyles";

const GoToCustomerHeader = ({ style }) => {
  const navigation = useNavigation();
  
  return (
    <SafeAreaView style={[styles.header, style]}>
      <View style={[styles.view, styles.viewFlexBox]}>
        <View style={styles.backBtnWrapper}>
          <Pressable style={styles.backBtn} onPress={() => navigation.navigate("BottomTabsRoot", { screen: "Homepage" })}>
            <Image
              style={styles.icon}
              contentFit="cover"
              source={require("../assets/back-btn.png")}
            />
          </Pressable>
        </View>
        <View style={[styles.goToCustomerWrapper, styles.viewFlexBox]}>
          <Text style={styles.goToCustomer}>Go to Customer</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: Color.colorDarkslateblue_100,
  },
  viewFlexBox: {
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
    paddingLeft: Padding.p_3xl,
    paddingTop: Padding.p_7xs,
    paddingBottom: Padding.p_7xs,
  },
  goToCustomer: {
    fontSize: FontSize.title3Bold20_size,
    letterSpacing: 0.5,
    fontWeight: "700",
    fontFamily: FontFamily.title2Bold32,
    color: Color.m3White,
    textAlign: "center",
    flex: 1,
  },
  goToCustomerWrapper: {
    paddingRight: Padding.p_27xl,
    flex: 1,
  },
  view: {
    alignSelf: "stretch",
    height: 72,
    paddingHorizontal: 0,
    paddingVertical: Padding.p_5xs,
  },
});

export default GoToCustomerHeader;
