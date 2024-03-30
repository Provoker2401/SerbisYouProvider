import * as React from "react";
import {
  View,
  StyleProp,
  ViewStyle,
  Text,
  StyleSheet,
  Pressable,
  TouchableOpacity
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { useNavigation } from "@react-navigation/native";
import { Color, FontSize, FontFamily, Padding } from "../GlobalStyles";
// import { TouchableOpacity } from "react-native-gesture-handler";

const ConfirmServiceHeader = ({ style }) => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={[styles.header, style]}>
      <View style={[styles.view, styles.wrapperFlexBox]}>
        <View style={styles.frameParent}>
          <View
            style={[
              styles.confirmCompletedServiceWrapper,
              styles.wrapperFlexBox,
            ]}
          >
            <Text
              style={[
                styles.confirmCompletedService,
                styles.confirmCompletedServiceFlexBox,
              ]}
            >
              Confirm Completed Service
            </Text>
          </View>
        </View>
        <TouchableOpacity style={[styles.vectorWrapper, styles.wrapperFlexBox]} onPress={() => navigation.navigate("BottomTabsRoot", { screen: "Homepage" })}>
          <Image
            style={styles.vectorIcon}
            contentFit="cover"
            source={require("../assets/vector6.png")}
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: Color.colorDarkslateblue_100,
  },
  wrapperFlexBox: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  confirmCompletedServiceFlexBox: {
    textAlign: "center",
    color: Color.m3White,
    flex: 1,
  },
  confirmCompletedService: {
    fontSize: FontSize.size_lg,
    letterSpacing: 0.5,
    fontWeight: "700",
    fontFamily: FontFamily.title2Bold32,
  },
  confirmCompletedServiceWrapper: {
    paddingLeft: Padding.p_xl,
    alignSelf: "stretch",
    alignItems: "center",
    flexDirection: "row",
  },
  bookingOrder: {
    fontWeight: "500",
    fontFamily: FontFamily.level2Medium12,
  },
  ljkh: {
    fontFamily: FontFamily.interRegular,
  },
  bookingOrder123456789ljkhContainer: {
    fontSize: FontSize.paragraphMedium15_size,
    letterSpacing: 0.4,
  },
  frameParent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  vectorIcon: {
    width: 15,
    height: 15,
  },
  vectorWrapper: {
    paddingRight: Padding.p_xl,
  },
  view: {
    height: 72,
    paddingHorizontal: 0,
    paddingVertical: Padding.p_5xs,
    alignSelf: "stretch",
    alignItems: "center",
    flexDirection: "row",
  },
});

export default ConfirmServiceHeader;
