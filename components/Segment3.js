import * as React from "react";
import { StyleSheet, View, Text } from "react-native";
import { Image } from "expo-image";
import { Padding, Border, FontSize, FontFamily, Color } from "../GlobalStyles";

const Segment3 = ({ style }) => {
  return (
    <View style={[styles.segment3, style, styles.segment3FlexBox]}>
      <View style={[styles.iconContainer, styles.segment3FlexBox]}>
        <View style={[styles.stateLayer, styles.segment3FlexBox]}>
          <Image
            style={styles.icon}
            contentFit="cover"
            source={require("../assets/icon3.png")}
          />
        </View>
      </View>
      <Text style={styles.labelText}>Notifications</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  segment3FlexBox: {
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
  segment3: {
    width: 90,
    paddingTop: Padding.p_xs,
    paddingBottom: Padding.p_base,
    opacity: 0.8,
  },
});

export default Segment3;
