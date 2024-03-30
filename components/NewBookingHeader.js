import * as React from "react";
import { View, StyleProp, ViewStyle, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Color, FontSize, FontFamily, Padding } from "../GlobalStyles";

const NewBookingHeader = ({ style }) => {
  return (
    <SafeAreaView style={[styles.header, style]}>
      <View style={[styles.view, styles.viewFlexBox]}>
        <View style={[styles.newBookingWrapper, styles.viewFlexBox]}>
          <Text style={styles.newBooking}>New Booking</Text>
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
  newBooking: {
    fontSize: FontSize.title3Bold20_size,
    letterSpacing: 0.5,
    fontWeight: "700",
    fontFamily: FontFamily.title2Bold32,
    color: Color.m3White,
    textAlign: "center",
  },
  newBookingWrapper: {
    flex: 1,
  },
  view: {
    alignSelf: "stretch",
    height: 72,
    paddingHorizontal: 0,
    paddingVertical: Padding.p_5xs,
  },
});

export default NewBookingHeader;
