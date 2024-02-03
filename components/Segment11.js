import * as React from "react";
import { StyleProp, ViewStyle, StyleSheet, View, Text } from "react-native";
import { Image } from "expo-image";
import { Padding, Border, Color, FontSize, FontFamily } from "../GlobalStyles";

const Segment11 = ({ style }) => {
  return (
    <View style={[styles.segment1, style, styles.segment1FlexBox1]}>
      <View style={[styles.iconContainer, styles.segment1FlexBox1]}>
        <View style={[styles.stateLayer, styles.segment1FlexBox1]}>
          <Image
            style={styles.icon}
            contentFit="cover"
            source={require("../assets/icon12.png")}
          />
        </View>
      </View>
      <Text style={styles.labelText}>Home</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  segment1FlexBox1: {
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    width: 26,
    height: 30,
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
    overflow: "hidden",
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
  segment1: {
    width: 90,
    paddingTop: Padding.p_xs,
    paddingBottom: Padding.p_base,
  },
});

export default Segment11;
