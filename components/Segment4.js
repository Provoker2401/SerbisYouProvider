import * as React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Image } from "expo-image";
import { FontFamily, FontSize, Color, Border, Padding } from "../GlobalStyles";

const Segment4 = ({ style }) => {
  return (
    <View style={[styles.segment4, style, styles.segment4FlexBox]}>
      <View style={[styles.iconContainer, styles.segment4FlexBox]}>
        <View style={[styles.stateLayer, styles.segment4FlexBox]}>
          <Image
            style={styles.icon}
            contentFit="cover"
            source={require("../assets/icon.png")}
          />
          <View style={styles.badge}>
            <Text style={[styles.badgeLabel, styles.labelTypo]}>3</Text>
          </View>
        </View>
      </View>
      <Text style={[styles.labelText, styles.labelTypo]}>Account</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  segment4FlexBox: {
    justifyContent: "center",
    alignItems: "center",
  },
  labelTypo: {
    textAlign: "center",
    fontFamily: FontFamily.robotoMedium,
    fontWeight: "500",
    lineHeight: 16,
    letterSpacing: 1,
  },
  icon: {
    width: 26,
    height: 30,
    zIndex: 0,
    overflow: "hidden",
  },
  badgeLabel: {
    marginTop: -7,
    marginLeft: -7,
    top: "50%",
    left: "50%",
    fontSize: FontSize.size_2xs,
    color: Color.m3White,
    display: "flex",
    width: 14,
    height: 14,
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
  },
  badge: {
    top: 2,
    left: 35,
    borderRadius: Border.br_81xl,
    backgroundColor: Color.colorFirebrick_100,
    width: 12,
    height: 12,
    display: "none",
    zIndex: 1,
    position: "absolute",
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
    color: Color.colorDarkslategray_100,
    marginTop: 4,
  },
  segment4: {
    width: 90,
    paddingTop: Padding.p_xs,
    paddingBottom: Padding.p_base,
    opacity: 0.8,
  },
});

export default Segment4;
