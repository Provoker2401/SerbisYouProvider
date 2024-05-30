import React from "react";
import { View, StyleSheet, Text, Pressable } from "react-native";
import { Image } from "expo-image";
import { Padding, Border, FontSize, FontFamily, Color } from "../GlobalStyles";

const CancelActiveBookingPrompt = ({ onClose, onConfirm }) => {
  return (
    <>
      <View style={styles.cancelBookingPrompt}>
        <Image
          style={styles.cancel11Icon}
          contentFit="cover"
          source={require("../assets/cancel-1-1.png")}
        />
        <View style={styles.content}>
          <View style={styles.text}>
            <Text style={styles.cancelBooking}>cancel Booking</Text>
            <Text style={styles.areYouSure}>{`Are you sure you want to cancel 
the booking?`}</Text>
          </View>
          <View style={styles.button}>
            <View style={styles.btn}>
              <Pressable
                style={[styles.noBtn, styles.btnSpaceBlock]}
                onPress={onClose}              >
                <Text style={[styles.no, styles.noTypo]}>No</Text>
              </Pressable>
              <Pressable
                style={[styles.yesBtn, styles.btnSpaceBlock]}
                onPress={() => {
                  onConfirm(); // Call the onConfirm function passed as a prop
                }}
              >
                <Text style={[styles.yes, styles.noTypo]}>Yes</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  btnSpaceBlock: {
    paddingVertical: Padding.p_smi,
    paddingHorizontal: Padding.p_3xs,
    width: 134,
    borderRadius: Border.br_5xs,
    justifyContent: "center",
    flexDirection: "row",
  },
  noTypo: {
    textAlign: "left",
    fontSize: FontSize.bodyLgBodyLgRegular_size,
    fontFamily: FontFamily.workSansMedium,
    fontWeight: "500",
  },
  cancel11Icon: {
    width: 150,
    height: 150,
  },
  cancelBooking: {
    fontSize: FontSize.size_3xl,
    textTransform: "capitalize",
    fontWeight: "600",
    fontFamily: FontFamily.workSansSemiBold,
    color: "#df2b2b",
    textAlign: "center",
  },
  areYouSure: {
    fontSize: 14,
    lineHeight: 20,
    color: Color.bg,
    marginTop: 12,
    fontFamily: FontFamily.workSansMedium,
    fontWeight: "500",
    textAlign: "center",
  },
  text: {
    alignItems: "center",
  },
  no: {
    color: Color.heading,
  },
  noBtn: {
    backgroundColor: Color.colorGainsboro_300,
  },
  yesBtnOverlay: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 48, 0.29)",
  },
  yesBtnBg: {
    position: "absolute",
    width: "100%",
    height: "100%",
    left: 0,
    top: 0,
  },
  yes: {
    color: Color.m3White,
  },
  yesBtn: {
    backgroundColor: Color.colorDarkslateblue_100,
    marginLeft: 20,
  },
  btn: {
    flexDirection: "row",
  },
  button: {
    width: 287,
    marginTop: 40,
    justifyContent: "center",
    flexDirection: "row",
    borderRadius: Border.br_xs,
  },
  content: {
    marginTop: 20,
    alignItems: "center",
  },
  cancelBookingPrompt: {
    backgroundColor: Color.m3White,
    paddingHorizontal: Padding.p_5xl,
    paddingVertical: Padding.p_21xl,
    maxWidth: "100%",
    maxHeight: "100%",
    alignItems: "center",
    borderRadius: Border.br_xs,
  },
});

export default CancelActiveBookingPrompt;
