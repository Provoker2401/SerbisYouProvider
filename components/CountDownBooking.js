import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text, Pressable } from "react-native";
import { Image } from "expo-image";
import { useNavigation } from "@react-navigation/native";
import { FontFamily, Color, FontSize, Padding, Border } from "../GlobalStyles";

const CountDownBooking = ({ onClose }) => {
  const navigation = useNavigation();

  return (
    <View style={styles.CountDownBooking}>
      <View style={styles.checkWrapper}>
        <Image
          style={styles.checkIcon}
          contentFit="cover"
          source={require("../assets/clock_countdown.png")}
        />
      </View>
      <View style={styles.content}>
        <View style={styles.text}>
          <View style={styles.text}>
            <Text
              style={[
                styles.cancelBookingSuccessful1,
                styles.youHaveSuccessfullyFlexBox,
              ]}
            >
              Booking Alert!
            </Text>
            <Text
              style={[
                styles.youHaveSuccessfully,
                styles.youHaveSuccessfullyFlexBox,
              ]}
            >
              You have received a booking request. Please accept or reject
              within the next 15 seconds or else the booking will be cancelled
            </Text>
          </View>
          <Pressable style={styles.okBtn} onPress={onClose}>
            <View style={styles.button}>
              <Text style={[styles.buttonText, styles.buttonTextTypo]}>OK</Text>
            </View>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  youHaveSuccessfullyFlexBox: {
    textAlign: "center",
    alignSelf: "stretch",
  },
  buttonTextTypo: {
    fontFamily: FontFamily.workSansMedium,
    fontWeight: "500",
  },
  checkIcon: {
    width: 200,
    height: 200,
  },
  checkWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  cancelBookingSuccessful1: {
    fontSize: 21,
    textTransform: "capitalize",
    color: Color.heading,
    fontFamily: FontFamily.workSansMedium,
    fontWeight: "500",
  },
  youHaveSuccessfully: {
    fontSize: FontSize.m3LabelLarge_size,
    lineHeight: 20,
    fontFamily: FontFamily.workSansRegular,
    color: Color.bg,
    marginTop: 12,
  },
  text: {
    alignSelf: "stretch",
    alignItems: "center",
  },
  buttonText: {
    fontSize: FontSize.bodyLgBodyLgRegular_size,
    color: "white",
    textAlign: "left",
  },
  button: {
    backgroundColor: Color.colorDarkslateblue_100,
    paddingHorizontal: Padding.p_3xs,
    paddingVertical: Padding.p_smi,
    justifyContent: "center",
    alignSelf: "stretch",
    flexDirection: "row",
    borderRadius: Border.br_xs,
  },
  okBtn: {
    marginTop: 45,
    alignSelf: "stretch",
    alignItems: "center",
    marginBottom: 12,
  },
  content: {
    marginTop: 25,
    alignSelf: "stretch",
    alignItems: "center",
  },
  CountDownBooking: {
    backgroundColor: Color.white,
    width: 335,
    paddingHorizontal: Padding.p_xl,
    paddingTop: Padding.p_21xl,
    paddingBottom: Padding.p_14xl,
    maxWidth: "100%",
    maxHeight: "100%",
    alignItems: "center",
    borderRadius: Border.br_xs,
  },
});

export default CountDownBooking;
