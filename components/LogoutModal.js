import * as React from "react";
import { View, StyleSheet, Text, Pressable } from "react-native";
import { Image } from "expo-image";
import { Padding, Border, FontFamily, FontSize, Color } from "../GlobalStyles";
import { getAuth, signOut } from "firebase/auth";
import { useNavigation } from '@react-navigation/native';
import {
  getFirestore,
  doc,
  updateDoc,
  query,
} from "firebase/firestore"; // Updated imports

const LogoutModal = ({ onClose }) => {
  const navigation = useNavigation();

  const handleLogout = async () => {
    const db = getFirestore();
    const auth = getAuth();

    if (!auth.currentUser) {
      console.error('No user is currently logged in.');
      return;
    }

    try {
      const providerUID = auth.currentUser.uid;

      const providerDocRef = doc(db, "providerProfiles", providerUID);
      await updateDoc(providerDocRef, {
        availability: "unavailable",
      });

      await signOut(auth);

      navigation.navigate('SignIn'); // Navigate to the SignIn screen
    } catch (error) {
      // Handle error
      console.error(error);
    }
  };

  return (
    <View style={styles.logoutModal}>
      <View style={styles.image}>
        <Image
          style={styles.imageIcon}
          contentFit="cover"
          source={require("../assets/image.png")}
        />
      </View>
      <View style={styles.content}>
        <View style={styles.text}>
          <Text style={styles.ohNoYou}>Oh No, You are leaving</Text>
          <Text style={styles.areYouSure}>
            Are you sure you want to logout?
          </Text>
        </View>
        <View style={styles.btn}>
          <Pressable style={[styles.cancel, styles.nextSpaceBlock]} onPress={onClose}>
            <Text style={[styles.no, styles.noTypo]}>No</Text>
          </Pressable>
          <Pressable style={[styles.next, styles.nextSpaceBlock]} onPress={handleLogout} >
            <Text style={[styles.yes, styles.noTypo]}>Yes</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  logoutButtonOverlay: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(113, 113, 113, 0.3)",
  },
  logoutButtonBg: {
    position: "absolute",
    width: "100%",
    height: "100%",
    left: 0,
    top: 0,
  },
  nextSpaceBlock: {
    paddingVertical: Padding.p_base,
    paddingHorizontal: Padding.p_3xs,
    width: 137,
    flexDirection: "row",
    justifyContent: "center",
    borderRadius: Border.br_xs,
  },
  noTypo: {
    fontFamily: FontFamily.title2Bold32,
    fontWeight: "700",
    fontSize: FontSize.title3Bold20_size,
    textAlign: "left",
  },
  imageIcon: {
    width: 275,
    height: 170,
  },
  image: {
    justifyContent: "center",
    alignItems: "center",
  },
  ohNoYou: {
    fontSize: FontSize.size_3xl,
    textTransform: "capitalize",
    textAlign: "left",
    color: Color.black,
    fontFamily: FontFamily.workSansMedium,
    fontWeight: "500",
  },
  areYouSure: {
    fontSize: FontSize.levelSemibold14_size,
    lineHeight: 20,
    color: Color.bg,
    textAlign: "center",
    width: 287,
    marginTop: 12,
    fontFamily: FontFamily.workSansMedium,
    fontWeight: "500",
  },
  text: {
    alignItems: "center",
  },
  no: {
    color: Color.black,
    fontFamily: FontFamily.title2Bold32,
    fontWeight: "700",
    fontSize: FontSize.title3Bold20_size,
  },
  cancel: {
    backgroundColor: "rgba(255, 255, 255, 0)",
    borderStyle: "solid",
    borderColor: Color.colorDarkslategray_600,
    borderWidth: 3,
  },
  yes: {
    color: Color.m3White,
  },
  next: {
    backgroundColor: Color.colorDarkslateblue_100,
    marginLeft: 20,
  },
  btn: {
    marginTop: 32,
    flexDirection: "row",
  },
  content: {
    marginTop: 48,
    alignItems: "center",
  },
  logoutModal: {
    backgroundColor: Color.m3White,
    paddingHorizontal: Padding.p_5xl,
    paddingVertical: 25,
    maxWidth: "100%",
    maxHeight: "100%",
    alignItems: "center",
    borderRadius: Border.br_xs,
  },
});

export default LogoutModal;

