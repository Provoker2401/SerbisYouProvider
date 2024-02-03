import * as React from "react";
import { StyleProp, ViewStyle, StyleSheet, View, Text } from "react-native";
import { Image } from "expo-image";
import { Padding, Border, FontSize, FontFamily, Color } from "../GlobalStyles";

const Segment2 = ({ style }) => {
  return (
    <View style={[styles.segment2, style, styles.segment2FlexBox]}>
      <View style={[styles.iconContainer, styles.segment2FlexBox]}>
        <View style={[styles.stateLayer, styles.segment2FlexBox]}>
          <Image
            style={styles.icon}
            contentFit="cover"
            source={require("../assets/icon2.png")}
          />
        </View>
      </View>
      <Text style={styles.labelText}>Bookings</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  segment2FlexBox: {
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    width: 24,
    height: 26,
    overflow: "hidden",
  },
  stateLayer: {
    width: 64,
    height: 32,
    flexDirection: "row",
    paddingHorizontal: Padding.p_xl,
    paddingVertical: Padding.p_9xs,
  },
  iconContainer: {
    borderRadius: Border.br_base,
    overflow: "hidden",
  },
  labelText: {
    alignSelf: "stretch",
    fontSize: FontSize.level2Medium12_size,
    letterSpacing: 1,
    lineHeight: 16,
    fontWeight: "500",
    fontFamily: FontFamily.robotoMedium,
    color: Color.colorDarkslategray_100,
    textAlign: "center",
    marginTop: 4,
  },
  segment2: {
    width: 90,
    paddingTop: Padding.p_xs,
    paddingBottom: Padding.p_base,
    opacity: 0.8,
  },
});

export default Segment2;
