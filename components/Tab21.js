import * as React from "react";
import { StyleProp, ViewStyle, Text, StyleSheet, View } from "react-native";
import { FontSize, FontFamily, Color, Padding } from "../GlobalStyles";

const Tab21 = ({ style }) => {
  return (
    <View style={[styles.tab2, style, styles.tab2FlexBox]}>
      <View style={[styles.stateLayer, styles.tab2FlexBox]}>
        <View style={styles.tabContents}>
          <Text style={styles.label}>History</Text>
        </View>
        <View style={styles.indicator} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  tab2FlexBox: {
    justifyContent: "flex-end",
    alignItems: "center",
  },
  label: {
    fontSize: FontSize.levelSemibold14_size,
    letterSpacing: 0,
    lineHeight: 20,
    fontWeight: "800",
    fontFamily: FontFamily.robotoBlack,
    color: Color.colorSteelblue,
    textAlign: "center",
  },
  tabContents: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "center",
    paddingHorizontal: 0,
    paddingVertical: Padding.p_sm,
    zIndex: 0,
    alignSelf: "stretch",
  },
  indicator: {
    position: "absolute",
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: Color.colorSteelblue,
    height: 2,
    zIndex: 1,
  },
  stateLayer: {
    paddingHorizontal: Padding.p_base,
    paddingVertical: 0,
    alignSelf: "stretch",
  },
  tab2: {
    flex: 1,
    backgroundColor: Color.m3White,
    overflow: "hidden",
  },
});

export default Tab21;
