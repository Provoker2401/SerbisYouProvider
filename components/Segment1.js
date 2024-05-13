import * as React from "react";
import { StyleSheet, View, Text } from "react-native";
import { Image } from "expo-image";
import { Padding, Border, FontSize, FontFamily, Color } from "../GlobalStyles";

const Segment1 = ({ style }) => {
  return (
    <View style={[styles.segment1, style, styles.segment1FlexBox]}>
      <View style={[styles.iconContainer, styles.segment1FlexBox]}>
        <View style={[styles.stateLayer, styles.segment1FlexBox]}>
          <Image
            style={styles.icon}
            contentFit="cover"
            source={require("../assets/icon1.png")}
          />
        </View>
      </View>
      <Text style={styles.labelText}>Home</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  segment1FlexBox: {
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
  },
  labelText: {
    alignSelf: "stretch",
    fontSize: FontSize.level2Medium12_size,
    letterSpacing: 1,
    lineHeight: 16,
    fontWeight: "500",
    fontFamily: FontFamily.robotoMedium,
    color: Color.colorDimgray_100,
    textAlign: "center",
    marginTop: 4,
  },
  segment1: {
    width: 90,
    paddingTop: Padding.p_xs,
    paddingBottom: Padding.p_base,
  },
});

export default Segment1;
