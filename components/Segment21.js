import * as React from "react";
import { StyleProp, ViewStyle, StyleSheet, View, Text } from "react-native";
import { Image } from "expo-image";
import { Padding, Border, Color, FontSize, FontFamily } from "../GlobalStyles";

const Segment21 = ({ style }) => {
  return (
    <View style={[styles.segment2, style, styles.segment2FlexBox1]}>
      <View style={[styles.iconContainer, styles.segment2FlexBox1]}>
        <View style={[styles.stateLayer, styles.segment2FlexBox1]}>
          <Image
            style={styles.icon}
            contentFit="cover"
            source={require("../assets/icon11.png")}
          />
        </View>
      </View>
      <Text style={styles.labelText}>Bookings</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  segment2FlexBox1: {
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
    backgroundColor: Color.colorLightskyblue,
  },
  labelText: {
    alignSelf: "stretch",
    fontSize: FontSize.level2Medium12_size,
    letterSpacing: 1,
    lineHeight: 16,
    fontWeight: "500",
    fontFamily: FontFamily.robotoMedium,
    color: Color.colorDarkslateblue_200,
    textAlign: "center",
    marginTop: 4,
  },
  segment2: {
    width: 90,
    height: 80,
    paddingTop: Padding.p_xs,
    paddingBottom: Padding.p_base,
  },
});

export default Segment21;
