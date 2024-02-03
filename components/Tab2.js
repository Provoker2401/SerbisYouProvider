import * as React from "react";
import { StyleProp, ViewStyle, Text, StyleSheet, View } from "react-native";
import { FontSize, FontFamily, Color, Padding } from "../GlobalStyles";

const Tab2 = ({ style }) => {
  return (
    <View style={[styles.tab2, style, styles.tab2FlexBox]}>
      <View style={[styles.stateLayer, styles.tab2FlexBox]}>
        <View style={styles.tabContents}>
          <Text style={styles.label}>History</Text>
        </View>
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
    fontWeight: "500",
    fontFamily: FontFamily.robotoMedium,
    color: Color.colorTypographyContentIconsBlack02,
    textAlign: "center",
  },
  tabContents: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "center",
    paddingHorizontal: 0,
    paddingVertical: Padding.p_sm,
    alignSelf: "stretch",
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

export default Tab2;
