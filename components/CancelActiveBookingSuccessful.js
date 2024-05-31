import * as React from "react";
import { View, StyleSheet, Text, Pressable } from "react-native";
import { Image } from "expo-image";
import { FontFamily, Color, FontSize, Padding, Border } from "../GlobalStyles";

const CancelActiveBookingSuccessful = ({ onClose }) => {

  return (
    <View style={styles.cancelBookingSuccessful}>
      <View style={styles.checkWrapper}>
        <Image
          style={styles.checkIcon}
          contentFit="cover"
          source={require("../assets/check.png")}
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
              Cancel Booking Successful!
            </Text>
            <Text
              style={[
                styles.youHaveSuccessfully,
                styles.youHaveSuccessfullyFlexBox,
              ]}
            >
              You have successfully cancelled your service booking. Please be
              mindful of how frequently you cancel bookings, as this can
              decrease your acceptance rate.
            </Text>
          </View>
          <Pressable
            style={styles.okBtn}
            onPress={onClose}
          >
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
    width: 105,
    height: 105,
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
    fontSize: 14,
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
    color: Color.m3White,
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
  },
  content: {
    marginTop: 25,
    alignSelf: "stretch",
    alignItems: "center",
  },
  cancelBookingSuccessful: {
    backgroundColor: Color.m3White,
    width: 335,
    paddingHorizontal: Padding.p_xl,
    paddingTop: Padding.p_21xl,
    paddingBottom: 33,
    maxWidth: "100%",
    maxHeight: "100%",
    alignItems: "center",
    borderRadius: Border.br_xs,
  },
});

export default CancelActiveBookingSuccessful;
