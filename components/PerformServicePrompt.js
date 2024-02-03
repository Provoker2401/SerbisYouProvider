import React, { useState, useCallback } from "react";
import { View, StyleSheet, Text, Pressable, Modal } from "react-native";
import { Image } from "expo-image";
import { useNavigation } from "@react-navigation/native";
import { Padding, Border, FontSize, FontFamily, Color } from "../GlobalStyles";
import {
    getFirestore,
    collection,
    doc,
    getDoc,
    updateDoc,
    where,
    getDocs,
    query,
  } from "firebase/firestore"; // Updated imports
  import { getAuth, onAuthStateChanged, updateEmail } from "firebase/auth";

const PerformServicePrompt = ({ onClose, itemID, matchedBookingID, customerUID, onProgress}) => {
  const navigation = useNavigation();
  const [yesBtnVisible, setYesBtnVisible] = useState(false);

  const serviceIsPerformed = async (itemID) => {
    try {
      console.log("Item ID: " + itemID);

      const db = getFirestore();
      const auth = getAuth();
      const providerUID = auth.currentUser.uid;
      const bookingRef = collection(db, "serviceBookings", customerUID, "activeBookings");
      const userBookingDocRef = doc(db, "providerProfiles", providerUID, "activeBookings", itemID);

      console.log("Passed Item ID" , itemID);
      console.log("Passed Matched Booking ID" , matchedBookingID);
      console.log("Passed Customer UID" , customerUID);

      const q = query(bookingRef, where("bookingID", "==", matchedBookingID));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((document) => {
        const bookingDocRef = doc(db, "serviceBookings", customerUID, "activeBookings", document.id);
        updateDoc(bookingDocRef, {
          status: "In Progress"
        });
      });

      // Update the status in Firestore
      await updateDoc(userBookingDocRef, {
        status: "In Progress"
      });
  
      console.log("Status updated to 'In Progress'");
  
      // Navigate to PerformTheService screen with itemId
      onProgress();
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const openYesBtn = useCallback(() => {
    setYesBtnVisible(true);
    navigation.navigate("PerformTheService", { itemID: itemID });
  }, []);

  const closeYesBtn = useCallback(() => {
    setYesBtnVisible(false);
  }, []);

  return (
    <>
      <View style={styles.cancelBookingPrompt}>
        <Image
          style={styles.cancel11Icon}
          contentFit="cover"
          source={require("../assets/customer-service.png")}
        />
        <View style={styles.content}>
          <View style={styles.text}>
            <Text style={styles.cancelBooking}>Perform Service</Text>
            <Text style={styles.areYouSure}>{`Are you ready to perform 
the service?`}</Text>
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
                onPress={() => serviceIsPerformed(itemID)}
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
    fontSize: FontSize.m3LabelLarge_size,
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

export default PerformServicePrompt;
