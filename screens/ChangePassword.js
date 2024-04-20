import * as React from "react";
import {
  StatusBar,
  StyleSheet,
  Pressable,
  View,
  Text,
  ScrollView,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { useNavigation } from "@react-navigation/native";
import { Color, Padding, Border, FontFamily, FontSize } from "../GlobalStyles";
import {
  getAuth,
  onAuthStateChanged,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from "firebase/auth";
import {
  getFirestore,
  collection,
  getDoc,
  doc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";

const ChangePassword = () => {
  const navigation = useNavigation();

  //for text inputs
  const [textInputNewPass, setTextInputNewPass] = React.useState("");
  const [textInputConfirmPass, settextInputConfirmPass] = React.useState("");
  const [textInputCurrentPass, settextInputCurrentPass] = React.useState("");
  const [errorMessageVisible, setErrorMessageVisible] = React.useState(false); // for current password

  const newPassword = textInputNewPass;
  const confirmPassword = textInputConfirmPass;
  const currentPassword = textInputCurrentPass;

  //for password change
  const handleLengthPass = (text) => {
    setTextInputNewPass(text); // Update the state when the text input changes
  };

  const handleCurrentPass = (text) => {
    settextInputCurrentPass(text); // Update the state when the text input changes
  };

  const saveChangesHandle = async () => {
    const auth = getAuth();
    const user = auth.currentUser;
    const providerUID = auth.currentUser.uid;

    if (textInputNewPass.length < 8) {
      console.log("Password not strong enough");
      return;
    }

    // Check if the new password matches the confirmation password
    if (newPassword !== confirmPassword) {
      console.log("Passwords do not match");
      return;
    }

    const credential = EmailAuthProvider.credential(
      user.email,
      currentPassword
    );

    try {
      // Reauthenticate the user with their current password
      await reauthenticateWithCredential(user, credential);

      // If reauthentication is successful, proceed with the password update
      await updatePassword(user, newPassword);

      const db = getFirestore();
      const notifDocRef = doc(db, "providerProfiles", providerUID);
      const notifCollection = collection(notifDocRef, "notifications");

      const today = new Date();
      const options = {
        year: "numeric",
        month: "long",
        day: "numeric",
      };
      const formattedDate = today.toLocaleDateString("en-US", options); // Adjust locale as needed

      const bookingDataNotif = {
        [generateRandomBookingIDWithNumbers()]: {
          subTitle: `Your password has been updated`,
          title: "Password Changed Successfully",
          createdAt: serverTimestamp(),
        },
        date: serverTimestamp(),
      };

      const notificationDocRef = doc(notifCollection, formattedDate);

      try {
        const notificationDoc = await getDoc(notificationDocRef);
        if (notificationDoc.exists()) {
          // Document exists, update it
          await setDoc(notificationDocRef, bookingDataNotif, {
            merge: true,
          });
          console.log("Notification updated successfully!");
        } else {
          // Document doesn't exist, create it
          await setDoc(notificationDocRef, bookingDataNotif);
          console.log("New notification document created!");
        }
      } catch (error) {
        console.error("Error updating notification:", error);
      }
      console.log("Password updated successfully");
      navigation.navigate("ChangePasswordUpdated");
    } catch (error) {
      console.error("Error:", error);
      setErrorMessageVisible(true);
    }
  };

  function generateRandomBookingIDWithNumbers(length = 8) {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let bookingID = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      bookingID += characters.charAt(randomIndex);
    }
    return bookingID;
  }

  return (
    <View style={styles.changePassword}>
      <StatusBar barStyle="default" />
      <ScrollView
        style={styles.body}
        showsVerticalScrollIndicator={true}
        showsHorizontalScrollIndicator={true}
        contentContainerStyle={styles.bodyScrollViewContent}
      >
        <View style={[styles.textWrapper, styles.textFlexBox]}>
          <View style={[styles.text, styles.textFlexBox]}>
            <View style={styles.setYourNewPasswordWrapper}>
              <Text style={styles.setYourNew}>Set your new password</Text>
            </View>
            <View
              style={[
                styles.yourNewPasswordMustBeDiffWrapper,
                styles.vectorParentSpaceBlock,
              ]}
            >
              <Text style={styles.yourNewPassword}>
                Your new password must be different from previous used password
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.bodySpaceBlock}>
          <View style={styles.frameParent}>
            <View style={styles.inputParent}>
              <View style={[styles.input, styles.inputLayout]}>
                <TextInput
                  style={styles.currentPasswordInput}
                  placeholder="Current Password"
                  placeholderTextColor="#d0d0d0"
                  value={textInputCurrentPass}
                  onChangeText={handleCurrentPass}
                />
                <View style={styles.eyeOffWrapper}>
                  <Image
                    style={styles.eyeOffIcon}
                    contentFit="cover"
                    source={require("../assets/eye-off.png")}
                    testID="eye-off-icon"

                  />
                </View>
              </View>
              {errorMessageVisible && (
                <View style={styles.doesNotMatchTheCurrentPasWrapper}>
                  <Text style={styles.doesNotMatchCurrentPass}>
                    Does not match the current password
                  </Text>
                </View>
              )}
            </View>
            <View style={styles.inputGroup}>
              <View style={[styles.input, styles.inputLayout]}>
                <TextInput
                  style={styles.currentPasswordInput}
                  placeholder="Enter Your New Password"
                  placeholderTextColor="#d0d0d0"
                  value={textInputNewPass}
                  onChangeText={handleLengthPass}
                />
                <View style={styles.eyeOffWrapper}>
                  <Image
                    style={styles.eyeOffIcon}
                    contentFit="cover"
                    testID="eye-off-icon2"
                    source={require("../assets/eye-off.png")}
                  />
                </View>
              </View>
              <View style={styles.doesNotMatchTheCurrentPasWrapper}>
                {textInputNewPass.length < 8 ? (
                  <Text style={styles.doesNotMatchLength}>
                    Password must be at least 8 characters
                  </Text>
                ) : null}
              </View>
            </View>
            <View style={styles.inputGroup}>
              <View style={[styles.input, styles.inputLayout]}>
                <TextInput
                  style={styles.currentPasswordInput}
                  placeholder="Confirm New Password"
                  placeholderTextColor="#d0d0d0"
                  value={textInputConfirmPass}
                  onChangeText={(text) => settextInputConfirmPass(text)} // Update the state when the text input changes
                />
                <View style={styles.eyeOffWrapper}>
                  <Image
                    style={styles.eyeOffIcon}
                    contentFit="cover"
                    testID="eye-off-icon3"
                    source={require("../assets/eye-off.png")}
                  />
                </View>
              </View>
              <View style={styles.doesNotMatchTheCurrentPasWrapper}>
                {newPassword !== confirmPassword && (
                  <Text style={styles.doesNotMatch}>
                    Both passwords must match❗
                  </Text>
                )}
              </View>
            </View>
          </View>
        </View>
        <View style={[styles.bodyChild, styles.bodySpaceBlock]}>
          <View style={styles.frameGroup}>
            <View style={styles.frameContainer}>
              <View style={styles.titleLabelWrapper}>
                <Text style={styles.titleLabel}>Password Strength:</Text>
              </View>
              <View style={styles.weakParent}>
                {textInputNewPass.length >= 8 ? (
                  /[A-Z]/.test(textInputNewPass) ? (
                    /[!@#$%^&*()_+{}\[\]:;<>,.?~\\-]/.test(textInputNewPass) ? (
                      <Text style={[styles.strong, styles.strongPosition]}>
                        STRONG
                      </Text>
                    ) : (
                      <Text style={[styles.average, styles.badgePosition]}>
                        AVERAGE
                      </Text>
                    )
                  ) : (
                    <Text style={[styles.weak, styles.weakTypo]}>WEAK</Text>
                  )
                ) : null}

                {/* <Text style={[styles.weak, styles.weakTypo]}>WEAK</Text>
                <Text style={[styles.average, styles.badgePosition]}>
                  AVERAGE
                </Text>
                <Text style={[styles.strong, styles.strongPosition]}>
                  STRONG
                </Text> */}
              </View>
            </View>
            <View style={styles.vectorParentSpaceBlock}>
              <Image
                style={[styles.frameChild, styles.barLayout]}
                contentFit="cover"
                source={require("../assets/rectangle-4408.png")}
              />
              {textInputNewPass.length >= 8 ? (
                /[A-Z]/.test(textInputNewPass) ? (
                  /[!@#$%^&*()_+{}\[\]:;<>,.?~\\-]/.test(textInputNewPass) ? (
                    <View style={[styles.strongBar, styles.barLayout]} />
                  ) : (
                    <View style={[styles.averageBar, styles.barLayout]} />
                  )
                ) : (
                  <View style={[styles.weakBar, styles.barLayout]} />
                )
              ) : null}

              {/* <View style={[styles.weakBar, styles.barLayout]} />
              <View style={[styles.averageBar, styles.barLayout]} />
              <View style={[styles.strongBar, styles.barLayout]} /> */}
            </View>
          </View>
        </View>
        <View style={styles.bodySpaceBlock}>
          <View style={styles.changeBtnWrapper}>
            <Pressable
              style={styles.frameParent}
              // onPress={() => navigation.navigate("ChangePasswordUpdated")}
              onPress={saveChangesHandle}
            >
              <View style={[styles.button, styles.buttonFlexBox]}>
                <Text style={[styles.button1, styles.button1Typo]}>Change</Text>
              </View>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#1a244d",
  },
  bodyScrollViewContent: {
    flexDirection: "column",
    paddingHorizontal: 0,
    paddingVertical: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  button1Typo: {
    color: Color.m3White,
    textAlign: "center",
    fontWeight: "700",
  },
  textFlexBox: {
    paddingHorizontal: Padding.p_3xl,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "stretch",
  },
  vectorParentSpaceBlock: {
    marginTop: 5,
    alignSelf: "stretch",
  },
  inputLayout: {
    borderRadius: Border.br_5xs,
    justifyContent: "center",
  },
  bodySpaceBlock: {
    marginTop: 40,
    paddingVertical: 0,
    paddingHorizontal: Padding.p_3xl,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "stretch",
  },
  weakTypo: {
    fontFamily: FontFamily.interExtraBold,
    fontWeight: "800",
    textAlign: "justify",
    lineHeight: 25,
    letterSpacing: 0,
    fontSize: FontSize.level2Medium12_size,
  },
  badgePosition: {
    zIndex: 1,
    position: "absolute",
  },
  strongPosition: {
    zIndex: 2,
    left: 0,
    top: 0,
    position: "absolute",
  },
  barLayout: {
    height: 11,
    borderRadius: Border.br_7xs,
  },
  buttonFlexBox: {
    paddingHorizontal: Padding.p_5xs,
    flexDirection: "row",
    alignSelf: "stretch",
  },
  labelTypo: {
    marginTop: 4,
    fontFamily: FontFamily.m3LabelLarge,
    lineHeight: 16,
    letterSpacing: 1,
    fontSize: FontSize.level2Medium12_size,
    fontWeight: "500",
    textAlign: "center",
    alignSelf: "stretch",
  },
  segmentSpaceBlock: {
    opacity: 0.8,
    paddingBottom: Padding.p_base,
    paddingTop: Padding.p_xs,
    width: 90,
    justifyContent: "center",
    alignItems: "center",
  },
  iconContainerFlexBox: {
    borderRadius: Border.br_base,
    justifyContent: "center",
    overflow: "hidden",
    alignItems: "center",
  },
  iconLayout: {
    height: 30,
    width: 26,
    overflow: "hidden",
  },
  setYourNew: {
    lineHeight: 30,
    fontFamily: FontFamily.poppinsBold,
    color: Color.textColorContentSecondary,
    textAlign: "center",
    fontWeight: "700",
    fontSize: FontSize.title3Bold20_size,
  },
  setYourNewPasswordWrapper: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    alignSelf: "stretch",
  },
  yourNewPassword: {
    fontSize: FontSize.m3LabelLarge_size,
    lineHeight: 22,
    fontFamily: FontFamily.bodyLgBodyLgRegular,
    color: Color.neutralGray400,
    textAlign: "center",
    flex: 1,
  },
  yourNewPasswordMustBeDiffWrapper: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  text: {
    paddingVertical: 0,
  },
  textWrapper: {
    paddingTop: Padding.p_11xl,
  },
  currentPasswordInput: {
    fontFamily: FontFamily.poppinsMedium,
    fontSize: FontSize.bodyLgBodyLgRegular_size,
    fontWeight: "500",
    flexDirection: "row",
    flex: 1,
  },
  eyeOffIcon: {
    width: 22,
    opacity: 0.9,
    height: 24,
  },
  eyeOffWrapper: {
    marginLeft: 20,
    justifyContent: "center",
    flexDirection: "row",
  },
  input: {
    borderStyle: "solid",
    borderColor: Color.colorSilver_300,
    borderWidth: 1,
    paddingHorizontal: Padding.p_2xs,
    paddingVertical: Padding.p_mid,
    overflow: "hidden",
    flexDirection: "row",
    alignSelf: "stretch",
  },
  doesNotMatchCurrentPass: {
    fontFamily: FontFamily.workSansMedium,
    color: Color.colorCrimson_100,
    textAlign: "left",
    fontSize: FontSize.level2Medium12_size,
    fontWeight: "500",
  },
  doesNotMatch: {
    fontFamily: FontFamily.workSansMedium,
    color: Color.colorCrimson_100,
    textAlign: "left",
    fontSize: FontSize.level2Medium12_size,
    fontWeight: "500",
  },
  doesNotMatchLength: {
    fontFamily: FontFamily.workSansMedium,
    color: Color.colorCrimson_100,
    textAlign: "left",
    fontSize: FontSize.level2Medium12_size,
    fontWeight: "500",
  },
  doesNotMatchTheCurrentPasWrapper: {
    marginTop: 2,
    flexDirection: "row",
  },
  inputParent: {
    justifyContent: "center",
    alignSelf: "stretch",
  },
  inputGroup: {
    marginTop: 20,
    justifyContent: "center",
    alignSelf: "stretch",
  },
  frameParent: {
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "stretch",
  },
  titleLabel: {
    fontFamily: FontFamily.level2Medium12,
    color: Color.colorGray_1000,
    width: 118,
    textAlign: "justify",
    lineHeight: 25,
    letterSpacing: 0,
    fontSize: FontSize.level2Medium12_size,
    fontWeight: "500",
    height: 24,
  },
  titleLabelWrapper: {
    flexDirection: "row",
  },
  weak: {
    color: Color.colorRed_300,
    width: 217,
    zIndex: 0,
    left: 0,
    top: 0,
    position: "absolute",
  },
  average: {
    color: Color.colorOrange_100,
    fontFamily: FontFamily.interExtraBold,
    fontWeight: "800",
    textAlign: "justify",
    lineHeight: 25,
    letterSpacing: 0,
    fontSize: FontSize.level2Medium12_size,
    left: 0,
    top: 0,
  },
  strong: {
    color: Color.colorLime,
    fontFamily: FontFamily.interExtraBold,
    fontWeight: "800",
    textAlign: "justify",
    lineHeight: 25,
    letterSpacing: 0,
    fontSize: FontSize.level2Medium12_size,
    left: 0,
    top: 0,
  },
  weakParent: {
    flexDirection: "row",
    flex: 1,
  },
  frameContainer: {
    flexDirection: "row",
    alignSelf: "stretch",
  },
  frameChild: {
    maxWidth: "100%",
    zIndex: 0,
    overflow: "hidden",
    alignSelf: "stretch",
    width: "100%",
  },
  weakBar: {
    backgroundColor: Color.colorRed_300,
    width: 110,
    zIndex: 1,
    position: "absolute",
    left: 0,
    top: 0,
  },
  averageBar: {
    backgroundColor: Color.colorOrange_100,
    width: 220,
    zIndex: 2,
    left: 0,
    top: 0,
    position: "absolute",
  },
  strongBar: {
    backgroundColor: Color.colorLime,
    width: 331,
    zIndex: 3,
    left: 0,
    top: 0,
    position: "absolute",
  },
  frameGroup: {
    alignSelf: "stretch",
  },
  bodyChild: {
    overflow: "hidden",
  },
  button1: {
    fontFamily: FontFamily.georamaBold,
    fontSize: FontSize.bodyLgBodyLgRegular_size,
    textAlign: "center",
  },
  button: {
    paddingVertical: Padding.p_xl,
    borderRadius: Border.br_5xs,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Color.colorDarkslateblue_100,
  },
  changeBtnWrapper: {
    paddingHorizontal: 0,
    paddingVertical: Padding.p_21xl,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "stretch",
  },
  body: {
    backgroundColor: Color.colorWhitesmoke_100,
    alignSelf: "stretch",
    flex: 1,
  },
  stateFlexBox: {
    paddingVertical: Padding.p_9xs,
    paddingHorizontal: Padding.p_xl,
    height: 32,
    width: 64,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  labelText: {
    color: Color.colorDimgray_200,
  },
  segment1: {
    paddingBottom: Padding.p_base,
    paddingTop: Padding.p_xs,
    width: 90,
    justifyContent: "center",
    alignItems: "center",
  },
  icon2: {
    height: 26,
    overflow: "hidden",
    width: 24,
  },
  labelText1: {
    color: Color.colorDarkslategray_100,
  },
  segment2: {
    height: 80,
  },
  icon4: {
    zIndex: 0,
  },
  badgeLabel: {
    marginTop: -7,
    marginLeft: -7,
    top: "50%",
    left: "50%",
    fontSize: FontSize.size_2xs,
    display: "flex",
    width: 14,
    height: 14,
    fontFamily: FontFamily.m3LabelLarge,
    lineHeight: 16,
    letterSpacing: 1,
    position: "absolute",
    fontWeight: "500",
    textAlign: "center",
    color: Color.white,
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
    overflow: "hidden",
  },
  iconContainer3: {
    backgroundColor: Color.colorLightblue,
  },
  labelText3: {
    color: Color.colorDarkslateblue_200,
  },
  navigationBarHome: {
    borderTopLeftRadius: Border.br_9xs,
    borderTopRightRadius: Border.br_9xs,
    justifyContent: "space-between",
    paddingVertical: 0,
    backgroundColor: Color.white,
  },
  changePassword: {
    height: 812,
    width: "100%",
    flex: 1,
    backgroundColor: Color.white,
  },
});

export default ChangePassword;
