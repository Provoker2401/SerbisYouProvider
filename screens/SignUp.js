import * as React from "react";
import {
  StatusBar,
  StyleSheet,
  ScrollView,
  View,
  Pressable,
  Text,
  TextInput,
  TouchableWithoutFeedback
} from "react-native";
import { useState } from "react";
import { FontSize, FontFamily, Color, Padding, Border } from "../GlobalStyles";
import { useNavigation } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import { Image } from "expo-image";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  getDocs,
  docs,
  addDoc,
  collection, // Import getDoc for checking if a user with the same phone number exists
} from "firebase/firestore";

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();

  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const eyeIconSource = showPassword
    ? require("../assets/hide-pass.png")
    : require("../assets/-icon-eye-empty.png");

  const isValidPhilippinePhoneNumber = (phoneNumber) => {
    // Clean the input by removing non-digit characters
    const cleanedPhoneNumber = phoneNumber.replace(/\D/g, "");

    // Check if the cleaned phone number is exactly 10 digits
    if (cleanedPhoneNumber.length !== 10) {
      return false;
    }

    // Check if the first digit is 9
    if (cleanedPhoneNumber.charAt(0) !== "9") {
      return false;
    }

    return true;
  };

  const handleSignUp = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (name === "" || email === "" || password === "" || phone === "") {
      Toast.show({
        type: "error",
        position: "top",
        text1: "Error",
        text2: "Please fill in all required fields❗",
        visibilityTime: 5000,
      });
      return;
    }
    if (!isValidPhilippinePhoneNumber(phone)) {
      Toast.show({
        type: "error",
        position: "top",
        text1: "Error",
        text2: "Enter a valid 10-digit phone number starting with 9❗",
        visibilityTime: 5000,
      });
      return;
    }

    // Check if email format is valid
    if (!emailRegex.test(email)) {
      Toast.show({
        type: "error",
        position: "top",
        text1: "Error",
        text2: "Enter a valid email address❗",
        visibilityTime: 5000,
      });
      return;
    }

    const auth = getAuth();

    try {
      const db = getFirestore();
      const querySnapshot = await getDocs(collection(db, "providerProfiles"));
      let duplicatePhone = false;
      let duplicateEmail = false;

      // querySnapshot.forEach((doc) => {
      //   const data = doc.data();
      //   if (data.phone === `+63${phone}`) {
      //     duplicatePhone = true;
      //   }
      // });

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.email === email) {
          duplicateEmail = true;
        }
      });

      if (duplicateEmail) {
        Toast.show({
          type: "error",
          position: "top",
          text1: "Error",
          text2: "A provider with this Email already exists❗",
          visibilityTime: 5000,
        });
        return;
      }

      if (duplicatePhone) {
        Toast.show({
          type: "error",
          position: "top",
          text1: "Error",
          text2: "A provider with this phone number already exists❗",
          visibilityTime: 5000,
        });
        return;
      }
    } catch (error) {

      console.log("Eror Sign Up:", error);
    }

    navigation.navigate("Authentication", {
      name: name,
      phone: `+63${phone}`,
      email: email,
      password: password,
    });

    // Check if email already exists

    // const auth = getAuth();

    // try {
    //   // Check if a document with the same phone number already exists
    //   const db = getFirestore();
    //   const querySnapshot = await getDocs(collection(db, "providerProfiles"));
    //   let duplicatePhone = false;

    //   querySnapshot.forEach((doc) => {
    //     const data = doc.data();
    //     if (data.phone === `+63${phone}`) {
    //       duplicatePhone = true;
    //     }
    //   });

    //   if (duplicatePhone) {
    //     // Provider with the same phone number already exists
    //     Toast.show({
    //       type: "error",
    //       position: "top",
    //       text1: "Error",
    //       text2: "A provider with this phone number already exists❗",
    //       visibilityTime: 5000,
    //     });
    //     return;
    //   }

    //   // Create the provider with email and password
    //   const providerCredential = await createUserWithEmailAndPassword(
    //     auth,
    //     email,
    //     password
    //   );
    //   const provider = providerCredential.user;

    //   // Get the user's UID
    //   const providerUid = provider.uid;

    //   // Initialize Firestore and reference the 'providerProfiles' collection
    //   const providerDocRef = doc(db, "providerProfiles", providerUid);

    //   // Save provider data to Firestore using the UID as the document ID
    //   await setDoc(providerDocRef, {
    //     name: name,
    //     email: email,
    //     phone: `+63${phone}`,
    //     availability: "available", // Set default availability to false
    //     blackListed: [], // Initialize blackListed array with no values yet
    //     bookingID: "",
    //     bookingMatched: false,
    //     bookingIndex: 0,
    //     coordinates: {
    //       latitude: "",
    //       longitude: "",
    //     },
    //   });
    //   // Create subcollections with empty fields
    //   const appForm1Ref = collection(providerDocRef, "appForm1"); // Replace 'subcollection_name' with your desired subcollection name
    //   await addDoc(appForm1Ref, {
    //     name: name,
    //     email: email,
    //     phone: `+63${phone}`,
    //     city: "",
    //   });

    //   const appForm2Ref = collection(providerDocRef, "appForm2"); // Replace 'subcollection_name' with your desired subcollection name
    //   await addDoc(appForm2Ref, {
    //     idType: "",
    //     idProofimg: "",
    //   });

    //   const appForm3Ref = collection(providerDocRef, "appForm3"); // Replace 'subcollection_name' with your desired subcollection name
    //   await addDoc(appForm3Ref, {
    //     categories: "",
    //     subcategories: "",
    //     services: "",
    //   });

    //   const userWalletRef = collection(providerDocRef, "userWallet"); // Replace 'subcollection_name' with your desired subcollection name
    //   await addDoc(userWalletRef, {
    //     wallet: 0,
    //   });

    //   const activeBookings = collection(providerDocRef, "activeBookings"); // Replace 'subcollection_name' with your desired subcollection name
    //   await addDoc(activeBookings, {});

    //   const historyBookings = collection(providerDocRef, "historyBookings"); // Replace 'subcollection_name' with your desired subcollection name
    //   await addDoc(historyBookings, {});

    //   // User signed up successfully
    //   console.log("Sign Up Successful!");

    //   // Clear input fields and show success toast
    //   setName("");
    //   setEmail("");
    //   setPassword("");
    //   setPhone("");

    //   Toast.show({
    //     type: "success",
    //     position: "top",
    //     text1: "Sign Up Successful",
    //     text2: "You have successfully signed up✅",
    //     visibilityTime: 3000,
    //   });
    // } catch (error) {
    //   console.error("Sign-up error:", error);

    //   Toast.show({
    //     type: "error",
    //     position: "top",
    //     text1: "Error",
    //     text2: error.message || "An error occurred while signing up",
    //     visibilityTime: 5000,
    //   });
    // }
  };

  return (
    <View style={styles.signUp}>
      <StatusBar barStyle="default" />
      <ScrollView
        style={styles.body}
        showsVerticalScrollIndicator={true}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.bodyScrollViewContent}
      >
        <View style={styles.frame}>
          <View style={styles.componentstopNavigation}>
            <View
              style={[styles.componentstopNavigationChild, styles.iconLayout]}
            />
            <View style={styles.menuWrapper}>
              <View style={styles.menu}>
                <View
                  style={[
                    styles.uiIconarrowBackwardfilled,
                    styles.image2354IconLayout,
                  ]}
                >
                  <Pressable
                    style={styles.union}
                    onPress={() => navigation.goBack()}
                  >
                    <Image
                      style={[styles.icon, styles.iconLayout]}
                      contentFit="cover"
                      source={require("../assets/union.png")}
                    />
                  </Pressable>
                </View>
              </View>
            </View>
          </View>
          <Image
            style={styles.frameIcon}
            contentFit="cover"
            source={require("../assets/frame.png")}
          />
        </View>
        <View style={styles.signInWrapper}>
          <View style={styles.signIn}>
            <View style={styles.content}>
              <Text style={styles.signUp1}>Sign Up</Text>
              <View style={styles.componentsinputFieldParent}>
                <View style={styles.componentsinputField}>
                  <Text style={[styles.phoneNumber, styles.mrTypo]}>
                    Full Name
                  </Text>
                  <View style={styles.fullNameInputWrapper}>
                    <TextInput
                      style={[styles.fullNameInput, styles.inputTypo]}
                      placeholder="Full Name"
                      placeholderTextColor="#d1d3d4"
                      value={name}
                      onChangeText={(text) => setName(text)}
                    />
                  </View>
                </View>
                <View style={styles.frame1SpaceBlock}>
                  <Text style={[styles.phoneNumber, styles.mrTypo]}>Email</Text>
                  <View style={styles.fullNameInputWrapper}>
                    <TextInput
                      style={[styles.fullNameInput, styles.inputTypo]}
                      placeholder="Email"
                      keyboardType="email-address"
                      placeholderTextColor="#d1d3d4"
                      value={email}
                      onChangeText={(text) => setEmail(text)}
                    />
                  </View>
                </View>
                <View style={styles.frame1SpaceBlock}>
                  <Text style={[styles.phoneNumber, styles.mrTypo]}>
                    Phone Number
                  </Text>
                  <View style={styles.fullNameInputWrapper}>
                    <View style={styles.leftNumberParent}>
                      <View style={styles.leftNumber}>
                        <Image
                          style={[
                            styles.image2354Icon,
                            styles.image2354IconLayout,
                          ]}
                          contentFit="cover"
                          source={require("../assets/image-2354.png")}
                        />
                        <Text style={styles.text}>+63</Text>
                        <Image
                          style={[
                            styles.leftNumberChild,
                            styles.leftChildLayout,
                          ]}
                          contentFit="cover"
                          source={require("../assets/vector-3.png")}
                        />
                      </View>
                      <View style={styles.leftName}>
                        <Text style={[styles.mr, styles.mrTypo]}>Mr.</Text>
                        <Image
                          style={styles.leftChildLayout}
                          contentFit="cover"
                          source={require("../assets/vector-3.png")}
                        />
                      </View>
                      <View style={styles.right}>
                        <View style={styles.rightChild} />
                        <TextInput
                          style={styles.phoneNumber3}
                          placeholder="  Phone Number"
                          keyboardType="numeric"
                          placeholderTextColor="#d1d3d4"
                          value={phone}
                          onChangeText={(text) => setPhone(text)}
                        />
                      </View>
                    </View>
                  </View>
                </View>
                <View style={styles.frame1SpaceBlock}>
                  <Text style={[styles.phoneNumber, styles.mrTypo]}>
                    Password
                  </Text>
                  <View style={styles.fullNameInputWrapper}>
                    <View style={styles.leftNumberGroup}>
                      {/* <View style={styles.leftNumber1}>
                        <Image
                          style={[
                            styles.image2354Icon,
                            styles.image2354IconLayout,
                          ]}
                          contentFit="cover"
                          source={require("../assets/image-23541.png")}
                        />
                        <Text style={styles.text}>+1</Text>
                        <Image
                          style={styles.leftChildLayout}
                          contentFit="cover"
                          source={require("../assets/vector-3.png")}
                        />
                      </View>
                      <View style={[styles.leftName1, styles.leftName1FlexBox]}>
                        <Text style={[styles.mr, styles.mrTypo]}>Mr.</Text>
                        <Image
                          style={styles.leftChildLayout}
                          contentFit="cover"
                          source={require("../assets/vector-31.png")}
                        />
                      </View> */}
                      <TextInput
                        style={[styles.passwordInput, styles.leftName1FlexBox]}
                        placeholder="Password"
                        keyboardType="default"
                        secureTextEntry={!showPassword}
                        placeholderTextColor="#d1d3d4"
                        value={password}
                        onChangeText={(text) => setPassword(text)}
                      />
                      <TouchableWithoutFeedback
                        onPress={togglePasswordVisibility}
                      >
                        <View style={styles.leftNumber}>
                          <Image
                            style={styles.iconEyeEmpty}
                            contentFit="cover"
                            source={eyeIconSource}
                          />
                        </View>
                      </TouchableWithoutFeedback>
                    </View>
                  </View>
                </View>
              </View>
            </View>
            <View style={styles.signUpButtonParent}>
              <Pressable
                style={styles.signUpButton}
                onPress={handleSignUp}
                // onPress={() => navigation.navigate("ApplicationForm1")}
              >
                <Text style={styles.signIn1}>Sign Up</Text>
              </Pressable>
              <View
                style={[
                  styles.bySigningUpYouAgreeToOuParent,
                  styles.frame1SpaceBlock,
                ]}
              >
                <Text
                  style={[styles.bySigningUpContainer, styles.signIn1FlexBox]}
                >
                  <Text
                    style={styles.text2Clr}
                  >{`By signing up, you agree to our
`}</Text>
                  <View style={styles.termsOfServiceContainer}>
                    <Pressable onPress={() => navigation.navigate("TermsAndConditions")}>
                      <Text
                        style={[styles.termsOfServiceTypo]}
                      >
                        Terms of Service
                      </Text>
                    </Pressable>
                    <Text style={styles.bySigningUp}>{`, and `}</Text>
                    <Pressable onPress={() => navigation.navigate("PrivacyPolicy")}>
                      <Text
                        style={[styles.termsOfServiceTypo]}
                      >
                      Privacy Policy
                      </Text>
                    </Pressable>
                  </View>
                </Text>
              </View>
              <View style={[styles.frame1, styles.frame1SpaceBlock]}>
                <View style={styles.alreadyHaveAnAccountParent}>
                  <Text style={[styles.alreadyHaveAn, styles.text6Typo]}>
                    Already have an Account?
                  </Text>
                  <Pressable
                    style={styles.signIn2}
                    onPress={() => navigation.navigate("SignIn")}
                  >
                    <Text style={[styles.text5, styles.text5Layout]}>
                      <Text style={styles.text6Typo}>{` `}</Text>
                      <Text style={styles.signIn3}>Sign in</Text>
                    </Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  bodyScrollViewContent: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  iconLayout: {
    height: "100%",
    width: "100%",
  },
  image2354IconLayout: {
    height: 24,
    width: 24,
  },
  mrTypo: {
    lineHeight: 24,
    fontSize: FontSize.paragraphMedium15_size,
    letterSpacing: -0.1,
    textAlign: "left",
    fontFamily: FontFamily.levelSemibold14,
    fontWeight: "600",
  },
  inputTypo: {
    fontSize: FontSize.levelSemibold14_size,
    fontFamily: FontFamily.levelSemibold14,
    fontWeight: "600",
  },
  leftChildLayout: {
    height: 4,
    width: 8,
    marginLeft: 8,
  },
  leftName1FlexBox: {
    marginLeft: 12,
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  frame1SpaceBlock: {
    marginTop: 20,
    alignSelf: "stretch",
  },
  text2Clr: {
    color: Color.lightLabelPrimary,
    fontFamily: FontFamily.m3BodyLarge,
  },
  privacyPolicyPosition: {
    top: 24,
    letterSpacing: 1,
    textAlign: "center",
    fontSize: FontSize.bodyLgBodyLgRegular_size,
    lineHeight: 24,
    position: "absolute",
  },
  termsOfServiceTypo: {
    fontFamily: FontFamily.robotoBold,
    fontWeight: "600",
    fontSize: 16,
    color: Color.colorDarkslateblue_100,
  },
  bySigningUpContainer: {
    letterSpacing: 1,
    fontSize: FontSize.bodyLgBodyLgRegular_size,
  },
  signIn1FlexBox: {
    textAlign: "center",
  },
  text6Typo: {
    color: Color.neutralShades0475,
    fontSize: FontSize.typographyTaglineSmallRegular_size,
    fontFamily: FontFamily.levelSemibold14,
    fontWeight: "600",
  },
  text5Layout: {
    lineHeight: 16,
    textAlign: "center",
  },
  componentstopNavigationChild: {
    top: "0%",
    right: "0%",
    bottom: "0%",
    left: "0%",
    position: "absolute",
  },
  icon: {
    maxWidth: "100%",
    maxHeight: "100%",
    overflow: "hidden",
  },
  iconEyeEmpty: {
    width: 20,
    height: 17,
  },
  union: {
    left: "12.08%",
    top: "18.75%",
    right: "12.5%",
    bottom: "18.75%",
    width: "75.42%",
    height: "62.5%",
    position: "absolute",
  },
  uiIconarrowBackwardfilled: {
    overflow: "hidden",
  },
  menu: {
    padding: Padding.p_xs,
    flexDirection: "row",
    flex: 1,
  },
  menuWrapper: {
    height: "94.12%",
    width: "91.47%",
    top: "2.94%",
    right: "4.27%",
    bottom: "2.94%",
    left: "4.27%",
    flexDirection: "row",
    position: "absolute",
  },
  componentstopNavigation: {
    height: 51,
    alignSelf: "stretch",
  },
  frameIcon: {
    width: 110,
    height: 108,
    marginTop: -12,
    overflow: "hidden",
  },
  frame: {
    justifyContent: "flex-end",
    overflow: "hidden",
    alignSelf: "stretch",
    alignItems: "center",
  },
  signUp1: {
    fontSize: FontSize.title2Bold32_size,
    letterSpacing: -1,
    lineHeight: 48,
    textAlign: "left",
    fontFamily: FontFamily.levelSemibold14,
    fontWeight: "600",
    color: Color.colorGray_400,
    alignSelf: "stretch",
  },
  phoneNumber: {
    color: Color.neutral07,
    alignSelf: "stretch",
  },
  fullNameInput: {
    flexDirection: "row",
    alignSelf: "stretch",
  },
  fullNameInputWrapper: {
    borderRadius: Border.br_5xs,
    backgroundColor: Color.colorInputDefault,
    marginTop: 8,
    justifyContent: "center",
    padding: Padding.p_xs,
    alignSelf: "stretch",
  },
  componentsinputField: {
    alignSelf: "stretch",
  },
  image2354Icon: {
    borderRadius: Border.br_181xl,
  },
  text: {
    marginLeft: 8,
    fontSize: FontSize.levelSemibold14_size,
    letterSpacing: -0.1,
    textAlign: "left",
    color: Color.colorGray_400,
    fontFamily: FontFamily.levelSemibold14,
    fontWeight: "600",
  },
  leftNumberChild: {
    display: "none",
  },
  leftNumber: {
    flexDirection: "row",
    alignItems: "center",
  },
  mr: {
    color: Color.colorGray_400,
    fontSize: FontSize.paragraphMedium15_size,
  },
  leftName: {
    display: "none",
    flexDirection: "row",
    alignItems: "center",
  },
  rightChild: {
    borderRadius: Border.br_11xs,
    backgroundColor: Color.colorMediumslateblue,
    height: 20,
    display: "none",
    flex: 1,
  },
  phoneNumber3: {
    marginLeft: 1,
    fontSize: FontSize.bodyLgBodyLgRegular_size,
    fontFamily: FontFamily.levelSemibold14,
    fontWeight: "600",
    flex: 1,
  },
  right: {
    paddingLeft: Padding.p_3xs,
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  leftNumberParent: {
    justifyContent: "space-between",
    flexDirection: "row",
    alignSelf: "stretch",
    alignItems: "center",
  },
  leftNumber1: {
    display: "none",
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  leftName1: {
    display: "none",
  },
  passwordInput: {
    fontSize: FontSize.levelSemibold14_size,
    fontFamily: FontFamily.levelSemibold14,
    fontWeight: "600",
  },
  leftNumberGroup: {
    flexDirection: "row",
    alignSelf: "stretch",
  },
  componentsinputFieldParent: {
    marginTop: 24,
    alignSelf: "stretch",
  },
  content: {
    justifyContent: "center",
    alignSelf: "stretch",
  },
  signIn1: {
    color: Color.m3White,
    textAlign: "center",
    fontFamily: FontFamily.title2Bold32,
    fontWeight: "700",
    lineHeight: 24,
    letterSpacing: -0.1,
    fontSize: FontSize.paragraphMedium15_size,
    flex: 1,
  },
  signUpButton: {
    borderRadius: Border.br_xs,
    backgroundColor: Color.colorDarkslateblue_100,
    paddingHorizontal: Padding.p_xl,
    paddingVertical: Padding.p_xs,
    justifyContent: "center",
    flexDirection: "row",
    alignSelf: "stretch",
    alignItems: "center",
  },
  bySigningUp: {
    fontFamily: FontFamily.m3BodyLarge,
    color: Color.lightLabelPrimary,
  },
  termsOfService: {
    color: Color.colorDarkslateblue_100,
  },
  termsOfServiceContainer: {
    // left: 27,
    // zIndex: 1,
    justifyContent: "center",
    flexDirection: "row",
    alignItems: "center",
  },
  text4: {
    fontWeight: "500",
    fontFamily: FontFamily.robotoMedium,
  },
  privacyPolicy1: {
    color: Color.colorDarkslateblue_100,
  },
  privacyPolicy: {
    left: 171,
    width: 165,
    zIndex: 2,
  },
  bySigningUpYouAgreeToOuParent: {
    justifyContent: "center",
    flexDirection: "row",
    alignItems: "center",
  },
  alreadyHaveAn: {
    width: 275,
    lineHeight: 16,
    textAlign: "center",
    letterSpacing: -0.1,
    fontSize: FontSize.typographyTaglineSmallRegular_size,
  },
  signIn3: {
    fontSize: FontSize.level2Medium12_size,
    color: Color.colorDarkslateblue_100,
    fontFamily: FontFamily.title2Bold32,
    fontWeight: "700",
  },
  text5: {
    width: 173,
  },
  signIn2: {
    marginLeft: -116,
  },
  alreadyHaveAnAccountParent: {
    justifyContent: "center",
    flexDirection: "row",
    alignSelf: "stretch",
    alignItems: "center",
  },
  frame1: {
    alignItems: "center",
  },
  signUpButtonParent: {
    marginTop: 39,
    justifyContent: "center",
    alignSelf: "stretch",
    alignItems: "center",
  },
  signIn: {
    justifyContent: "center",
    flex: 1,
  },
  signInWrapper: {
    paddingHorizontal: Padding.p_lg,
    paddingTop: Padding.p_3xs,
    paddingBottom: Padding.p_6xl,
    justifyContent: "center",
    flexDirection: "row",
    alignSelf: "stretch",
    alignItems: "center",
  },
  body: {
    alignSelf: "stretch",
    flex: 1,
    backgroundColor: Color.m3White,
  },
  signUp: {
    height: 812,
    alignItems: "center",
    width: "100%",
    flex: 1,
    backgroundColor: Color.m3White,
  },
});

export default SignUp;

//////////////////////////////////////////////////////
// import * as React from "react";
// import {
//   StatusBar,
//   StyleSheet,
//   ScrollView,
//   View,
//   Pressable,
//   Text,
//   TextInput,
// } from "react-native";
// import { useState } from "react";
// import { FontSize, FontFamily, Color, Padding, Border } from "../GlobalStyles";
// import { useNavigation } from "@react-navigation/native";
// import Toast from "react-native-toast-message";
// import { Image } from "expo-image";
// import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
// import {
//   getFirestore,
//   doc,
//   setDoc,
//   getDoc,
//   getDocs,
//   docs,
//   addDoc,
//   collection, // Import getDoc for checking if a user with the same phone number exists
// } from "firebase/firestore";

// const SignUp = () => {
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [phone, setPhone] = useState("");
//   const [password, setPassword] = useState("");
//   const navigation = useNavigation();

//   const isValidPhilippinePhoneNumber = (phoneNumber) => {
//     // Clean the input by removing non-digit characters
//     const cleanedPhoneNumber = phoneNumber.replace(/\D/g, "");

//     // Check if the cleaned phone number is exactly 10 digits
//     if (cleanedPhoneNumber.length !== 10) {
//       return false;
//     }

//     // Check if the first digit is 9
//     if (cleanedPhoneNumber.charAt(0) !== "9") {
//       return false;
//     }

//     return true;
//   };

//   const handleSignUp = async () => {
//     if (name === "" || email === "" || password === "" || phone === "") {
//       Toast.show({
//         type: "error",
//         position: "top",
//         text1: "Error",
//         text2: "Please fill in all required fields❗",
//         visibilityTime: 5000,
//       });
//       return;
//     }
//     if (!isValidPhilippinePhoneNumber(phone)) {
//       Toast.show({
//         type: "error",
//         position: "top",
//         text1: "Error",
//         text2: "Enter a valid 10-digit phone number starting with 9❗",
//         visibilityTime: 5000,
//       });
//       return;
//     }
//     const auth = getAuth();

//     try {
//       // Check if a document with the same phone number already exists
//       const db = getFirestore();
//       const querySnapshot = await getDocs(collection(db, "providerProfiles"));
//       let duplicatePhone = false;

//       querySnapshot.forEach((doc) => {
//         const data = doc.data();
//         if (data.phone === `+63${phone}`) {
//           duplicatePhone = true;
//         }
//       });

//       if (duplicatePhone) {
//         // Provider with the same phone number already exists
//         Toast.show({
//           type: "error",
//           position: "top",
//           text1: "Error",
//           text2: "A provider with this phone number already exists❗",
//           visibilityTime: 5000,
//         });
//         return;
//       }

//       // Create the provider with email and password
//       const providerCredential = await createUserWithEmailAndPassword(
//         auth,
//         email,
//         password
//       );
//       const provider = providerCredential.user;

//       // Get the user's UID
//       const providerUid = provider.uid;

//       // Initialize Firestore and reference the 'providerProfiles' collection
//       const providerDocRef = doc(db, "providerProfiles", providerUid);

//       // Save provider data to Firestore using the UID as the document ID
//       await setDoc(providerDocRef, {
//         name: name,
//         email: email,
//         phone: `+63${phone}`,
//         availability: "available", // Set default availability to false
//         blackListed: [], // Initialize blackListed array with no values yet
//         bookingID: "",
//         bookingMatched: false,
//         bookingIndex: 0,
//         coordinates: {
//           latitude: "",
//           longitude: "",
//         },
//       });
//       // Create subcollections with empty fields
//       const appForm1Ref = collection(providerDocRef, "appForm1"); // Replace 'subcollection_name' with your desired subcollection name
//       await addDoc(appForm1Ref, {
//         name: name,
//         email: email,
//         phone: `+63${phone}`,
//         city: "",
//       });

//       const appForm2Ref = collection(providerDocRef, "appForm2"); // Replace 'subcollection_name' with your desired subcollection name
//       await addDoc(appForm2Ref, {
//         idType: "",
//         idProofimg: "",
//       });

//       const appForm3Ref = collection(providerDocRef, "appForm3"); // Replace 'subcollection_name' with your desired subcollection name
//       await addDoc(appForm3Ref, {
//         categories: "",
//         subcategories: "",
//         services: "",
//       });

//       const userWalletRef = collection(providerDocRef, "userWallet"); // Replace 'subcollection_name' with your desired subcollection name
//       await addDoc(userWalletRef, {
//         wallet: 0,
//       });

//       const ActiveHistory = collection(providerDocRef, "ActiveHistory"); // Replace 'subcollection_name' with your desired subcollection name
//       await addDoc(ActiveHistory, {});

//       // User signed up successfully
//       console.log("Sign Up Successful!");

//       // Clear input fields and show success toast
//       setName("");
//       setEmail("");
//       setPassword("");
//       setPhone("");

//       Toast.show({
//         type: "success",
//         position: "top",
//         text1: "Sign Up Successful",
//         text2: "You have successfully signed up✅",
//         visibilityTime: 3000,
//       });
//     } catch (error) {
//       console.error("Sign-up error:", error);

//       Toast.show({
//         type: "error",
//         position: "top",
//         text1: "Error",
//         text2: error.message || "An error occurred while signing up",
//         visibilityTime: 5000,
//       });
//     }
//   };

//   return (
//     <View style={styles.signUp}>
//       <StatusBar barStyle="default" />
//       <ScrollView
//         style={styles.body}
//         showsVerticalScrollIndicator={true}
//         showsHorizontalScrollIndicator={false}
//         contentContainerStyle={styles.bodyScrollViewContent}
//       >
//         <View style={styles.frame}>
//           <View style={styles.componentstopNavigation}>
//             <View
//               style={[styles.componentstopNavigationChild, styles.iconLayout]}
//             />
//             <View style={styles.menuWrapper}>
//               <View style={styles.menu}>
//                 <View
//                   style={[
//                     styles.uiIconarrowBackwardfilled,
//                     styles.image2354IconLayout,
//                   ]}
//                 >
//                   <Pressable
//                     style={styles.union}
//                     onPress={() => navigation.goBack()}
//                   >
//                     <Image
//                       style={[styles.icon, styles.iconLayout]}
//                       contentFit="cover"
//                       source={require("../assets/union.png")}
//                     />
//                   </Pressable>
//                 </View>
//               </View>
//             </View>
//           </View>
//           <Image
//             style={styles.frameIcon}
//             contentFit="cover"
//             source={require("../assets/frame.png")}
//           />
//         </View>
//         <View style={styles.signInWrapper}>
//           <View style={styles.signIn}>
//             <View style={styles.content}>
//               <Text style={styles.signUp1}>Sign Up</Text>
//               <View style={styles.componentsinputFieldParent}>
//                 <View style={styles.componentsinputField}>
//                   <Text style={[styles.phoneNumber, styles.mrTypo]}>
//                     Full Name
//                   </Text>
//                   <View style={styles.fullNameInputWrapper}>
//                     <TextInput
//                       style={[styles.fullNameInput, styles.inputTypo]}
//                       placeholder="Full Name"
//                       placeholderTextColor="#d1d3d4"
//                       value={name}
//                       onChangeText={(text) => setName(text)}
//                     />
//                   </View>
//                 </View>
//                 <View style={styles.frame1SpaceBlock}>
//                   <Text style={[styles.phoneNumber, styles.mrTypo]}>Email</Text>
//                   <View style={styles.fullNameInputWrapper}>
//                     <TextInput
//                       style={[styles.fullNameInput, styles.inputTypo]}
//                       placeholder="Email"
//                       keyboardType="email-address"
//                       placeholderTextColor="#d1d3d4"
//                       value={email}
//                       onChangeText={(text) => setEmail(text)}
//                     />
//                   </View>
//                 </View>
//                 <View style={styles.frame1SpaceBlock}>
//                   <Text style={[styles.phoneNumber, styles.mrTypo]}>
//                     Phone Number
//                   </Text>
//                   <View style={styles.fullNameInputWrapper}>
//                     <View style={styles.leftNumberParent}>
//                       <View style={styles.leftNumber}>
//                         <Image
//                           style={[
//                             styles.image2354Icon,
//                             styles.image2354IconLayout,
//                           ]}
//                           contentFit="cover"
//                           source={require("../assets/image-2354.png")}
//                         />
//                         <Text style={styles.text}>+63</Text>
//                         <Image
//                           style={[
//                             styles.leftNumberChild,
//                             styles.leftChildLayout,
//                           ]}
//                           contentFit="cover"
//                           source={require("../assets/vector-3.png")}
//                         />
//                       </View>
//                       <View style={styles.leftName}>
//                         <Text style={[styles.mr, styles.mrTypo]}>Mr.</Text>
//                         <Image
//                           style={styles.leftChildLayout}
//                           contentFit="cover"
//                           source={require("../assets/vector-3.png")}
//                         />
//                       </View>
//                       <View style={styles.right}>
//                         <View style={styles.rightChild} />
//                         <TextInput
//                           style={styles.phoneNumber3}
//                           placeholder="  Phone Number"
//                           keyboardType="numeric"
//                           placeholderTextColor="#d1d3d4"
//                           value={phone}
//                           onChangeText={(text) => setPhone(text)}
//                         />
//                       </View>
//                     </View>
//                   </View>
//                 </View>
//                 <View style={styles.frame1SpaceBlock}>
//                   <Text style={[styles.phoneNumber, styles.mrTypo]}>
//                     Password
//                   </Text>
//                   <View style={styles.fullNameInputWrapper}>
//                     <View style={styles.leftNumberGroup}>
//                       <View style={styles.leftNumber1}>
//                         <Image
//                           style={[
//                             styles.image2354Icon,
//                             styles.image2354IconLayout,
//                           ]}
//                           contentFit="cover"
//                           source={require("../assets/image-23541.png")}
//                         />
//                         <Text style={styles.text}>+1</Text>
//                         <Image
//                           style={styles.leftChildLayout}
//                           contentFit="cover"
//                           source={require("../assets/vector-3.png")}
//                         />
//                       </View>
//                       <View style={[styles.leftName1, styles.leftName1FlexBox]}>
//                         <Text style={[styles.mr, styles.mrTypo]}>Mr.</Text>
//                         <Image
//                           style={styles.leftChildLayout}
//                           contentFit="cover"
//                           source={require("../assets/vector-31.png")}
//                         />
//                       </View>
//                       <TextInput
//                         style={[styles.passwordInput, styles.leftName1FlexBox]}
//                         placeholder="Password"
//                         keyboardType="default"
//                         secureTextEntry={true}
//                         placeholderTextColor="#d1d3d4"
//                         value={password}
//                         onChangeText={(text) => setPassword(text)}
//                       />
//                     </View>
//                   </View>
//                 </View>
//               </View>
//             </View>
//             <View style={styles.signUpButtonParent}>
//               <Pressable
//                 style={styles.signUpButton}
//                 onPress={handleSignUp}
//                 // onPress={() => navigation.navigate("ApplicationForm1")}
//               >
//                 <Text style={styles.signIn1}>Sign Up</Text>
//               </Pressable>
//               <View
//                 style={[
//                   styles.bySigningUpYouAgreeToOuParent,
//                   styles.frame1SpaceBlock,
//                 ]}
//               >
//                 <Text
//                   style={[styles.bySigningUp, styles.text2Clr]}
//                 >{`By signing up, you agree to our
//   and`}</Text>
//                 <Text
//                   style={[
//                     styles.termsOfServiceContainer,
//                     styles.privacyPolicyPosition,
//                   ]}
//                 >
//                   <Text style={styles.text2Clr}>{` `}</Text>
//                   <Text
//                     style={[styles.termsOfService, styles.termsOfServiceTypo]}
//                   >
//                     Terms of Service
//                   </Text>
//                   <Text style={styles.text2Clr}>,</Text>
//                 </Text>
//                 <Text
//                   style={[styles.privacyPolicy, styles.privacyPolicyPosition]}
//                 >
//                   <Text style={styles.text2Clr}>{`        `}</Text>
//                   <Text style={styles.privacyPolicy1}>
//                     <Text style={styles.termsOfServiceTypo}>
//                       Privacy Policy
//                     </Text>
//                     <Text style={styles.text4}>.</Text>
//                   </Text>
//                 </Text>
//               </View>
//               <View style={[styles.frame1, styles.frame1SpaceBlock]}>
//                 <View style={styles.alreadyHaveAnAccountParent}>
//                   <Text style={[styles.alreadyHaveAn, styles.text6Typo]}>
//                     Already have an Account?
//                   </Text>
//                   <Pressable
//                     style={styles.signIn2}
//                     onPress={() => navigation.navigate("SignIn")}
//                   >
//                     <Text style={[styles.text5, styles.text5Layout]}>
//                       <Text style={styles.text6Typo}>{` `}</Text>
//                       <Text style={styles.signIn3}>Sign in</Text>
//                     </Text>
//                   </Pressable>
//                 </View>
//               </View>
//             </View>
//           </View>
//         </View>
//       </ScrollView>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   bodyScrollViewContent: {
//     flexDirection: "column",
//     alignItems: "center",
//     justifyContent: "flex-start",
//   },
//   iconLayout: {
//     height: "100%",
//     width: "100%",
//   },
//   image2354IconLayout: {
//     height: 24,
//     width: 24,
//   },
//   mrTypo: {
//     lineHeight: 24,
//     fontSize: FontSize.paragraphMedium15_size,
//     letterSpacing: -0.1,
//     textAlign: "left",
//     fontFamily: FontFamily.levelSemibold14,
//     fontWeight: "600",
//   },
//   inputTypo: {
//     fontSize: FontSize.levelSemibold14_size,
//     fontFamily: FontFamily.levelSemibold14,
//     fontWeight: "600",
//   },
//   leftChildLayout: {
//     height: 4,
//     width: 8,
//     marginLeft: 8,
//   },
//   leftName1FlexBox: {
//     marginLeft: 12,
//     flexDirection: "row",
//     alignItems: "center",
//     flex: 1,
//   },
//   frame1SpaceBlock: {
//     marginTop: 20,
//     alignSelf: "stretch",
//   },
//   text2Clr: {
//     color: Color.lightLabelPrimary,
//     fontFamily: FontFamily.m3BodyLarge,
//   },
//   privacyPolicyPosition: {
//     top: 24,
//     letterSpacing: 1,
//     textAlign: "center",
//     fontSize: FontSize.bodyLgBodyLgRegular_size,
//     lineHeight: 24,
//     position: "absolute",
//   },
//   termsOfServiceTypo: {
//     fontFamily: FontFamily.robotoBold,
//     fontWeight: "600",
//   },
//   text6Typo: {
//     color: Color.neutralShades0475,
//     fontSize: FontSize.typographyTaglineSmallRegular_size,
//     fontFamily: FontFamily.levelSemibold14,
//     fontWeight: "600",
//   },
//   text5Layout: {
//     lineHeight: 16,
//     textAlign: "center",
//   },
//   componentstopNavigationChild: {
//     top: "0%",
//     right: "0%",
//     bottom: "0%",
//     left: "0%",
//     position: "absolute",
//   },
//   icon: {
//     maxWidth: "100%",
//     maxHeight: "100%",
//     overflow: "hidden",
//   },
//   union: {
//     left: "12.08%",
//     top: "18.75%",
//     right: "12.5%",
//     bottom: "18.75%",
//     width: "75.42%",
//     height: "62.5%",
//     position: "absolute",
//   },
//   uiIconarrowBackwardfilled: {
//     overflow: "hidden",
//   },
//   menu: {
//     padding: Padding.p_xs,
//     flexDirection: "row",
//     flex: 1,
//   },
//   menuWrapper: {
//     height: "94.12%",
//     width: "91.47%",
//     top: "2.94%",
//     right: "4.27%",
//     bottom: "2.94%",
//     left: "4.27%",
//     flexDirection: "row",
//     position: "absolute",
//   },
//   componentstopNavigation: {
//     height: 51,
//     alignSelf: "stretch",
//   },
//   frameIcon: {
//     width: 110,
//     height: 108,
//     marginTop: -12,
//     overflow: "hidden",
//   },
//   frame: {
//     justifyContent: "flex-end",
//     overflow: "hidden",
//     alignSelf: "stretch",
//     alignItems: "center",
//   },
//   signUp1: {
//     fontSize: FontSize.title2Bold32_size,
//     letterSpacing: -1,
//     lineHeight: 48,
//     textAlign: "left",
//     fontFamily: FontFamily.levelSemibold14,
//     fontWeight: "600",
//     color: Color.colorGray_400,
//     alignSelf: "stretch",
//   },
//   phoneNumber: {
//     color: Color.neutral07,
//     alignSelf: "stretch",
//   },
//   fullNameInput: {
//     flexDirection: "row",
//     alignSelf: "stretch",
//   },
//   fullNameInputWrapper: {
//     borderRadius: Border.br_5xs,
//     backgroundColor: Color.colorInputDefault,
//     marginTop: 8,
//     justifyContent: "center",
//     padding: Padding.p_xs,
//     alignSelf: "stretch",
//   },
//   componentsinputField: {
//     alignSelf: "stretch",
//   },
//   image2354Icon: {
//     borderRadius: Border.br_181xl,
//   },
//   text: {
//     marginLeft: 8,
//     fontSize: FontSize.levelSemibold14_size,
//     letterSpacing: -0.1,
//     textAlign: "left",
//     color: Color.colorGray_400,
//     fontFamily: FontFamily.levelSemibold14,
//     fontWeight: "600",
//   },
//   leftNumberChild: {
//     display: "none",
//   },
//   leftNumber: {
//     flexDirection: "row",
//     alignItems: "center",
//   },
//   mr: {
//     color: Color.colorGray_400,
//     fontSize: FontSize.paragraphMedium15_size,
//   },
//   leftName: {
//     display: "none",
//     flexDirection: "row",
//     alignItems: "center",
//   },
//   rightChild: {
//     borderRadius: Border.br_11xs,
//     backgroundColor: Color.colorMediumslateblue,
//     height: 20,
//     display: "none",
//     flex: 1,
//   },
//   phoneNumber3: {
//     marginLeft: 1,
//     fontSize: FontSize.bodyLgBodyLgRegular_size,
//     fontFamily: FontFamily.levelSemibold14,
//     fontWeight: "600",
//     flex: 1,
//   },
//   right: {
//     paddingLeft: Padding.p_3xs,
//     flexDirection: "row",
//     alignItems: "center",
//     flex: 1,
//   },
//   leftNumberParent: {
//     justifyContent: "space-between",
//     flexDirection: "row",
//     alignSelf: "stretch",
//     alignItems: "center",
//   },
//   leftNumber1: {
//     display: "none",
//     flexDirection: "row",
//     alignItems: "center",
//     flex: 1,
//   },
//   leftName1: {
//     display: "none",
//   },
//   passwordInput: {
//     fontSize: FontSize.levelSemibold14_size,
//     fontFamily: FontFamily.levelSemibold14,
//     fontWeight: "600",
//   },
//   leftNumberGroup: {
//     flexDirection: "row",
//     alignSelf: "stretch",
//   },
//   componentsinputFieldParent: {
//     marginTop: 24,
//     alignSelf: "stretch",
//   },
//   content: {
//     justifyContent: "center",
//     alignSelf: "stretch",
//   },
//   signIn1: {
//     color: Color.m3White,
//     textAlign: "center",
//     fontFamily: FontFamily.title2Bold32,
//     fontWeight: "700",
//     lineHeight: 24,
//     letterSpacing: -0.1,
//     fontSize: FontSize.paragraphMedium15_size,
//     flex: 1,
//   },
//   signUpButton: {
//     borderRadius: Border.br_xs,
//     backgroundColor: Color.colorDarkslateblue_100,
//     paddingHorizontal: Padding.p_xl,
//     paddingVertical: Padding.p_xs,
//     justifyContent: "center",
//     flexDirection: "row",
//     alignSelf: "stretch",
//     alignItems: "center",
//   },
//   bySigningUp: {
//     zIndex: 0,
//     letterSpacing: 1,
//     fontFamily: FontFamily.m3BodyLarge,
//     textAlign: "center",
//     fontSize: FontSize.bodyLgBodyLgRegular_size,
//     lineHeight: 24,
//     flex: 1,
//   },
//   termsOfService: {
//     color: Color.colorDarkslateblue_100,
//   },
//   termsOfServiceContainer: {
//     left: 27,
//     zIndex: 1,
//   },
//   text4: {
//     fontWeight: "500",
//     fontFamily: FontFamily.robotoMedium,
//   },
//   privacyPolicy1: {
//     color: Color.colorDarkslateblue_100,
//   },
//   privacyPolicy: {
//     left: 171,
//     width: 165,
//     zIndex: 2,
//   },
//   bySigningUpYouAgreeToOuParent: {
//     justifyContent: "center",
//     flexDirection: "row",
//     alignItems: "center",
//   },
//   alreadyHaveAn: {
//     width: 275,
//     lineHeight: 16,
//     textAlign: "center",
//     letterSpacing: -0.1,
//     fontSize: FontSize.typographyTaglineSmallRegular_size,
//   },
//   signIn3: {
//     fontSize: FontSize.level2Medium12_size,
//     color: Color.colorDarkslateblue_100,
//     fontFamily: FontFamily.title2Bold32,
//     fontWeight: "700",
//   },
//   text5: {
//     width: 173,
//   },
//   signIn2: {
//     marginLeft: -116,
//   },
//   alreadyHaveAnAccountParent: {
//     justifyContent: "center",
//     flexDirection: "row",
//     alignSelf: "stretch",
//     alignItems: "center",
//   },
//   frame1: {
//     alignItems: "center",
//   },
//   signUpButtonParent: {
//     marginTop: 39,
//     justifyContent: "center",
//     alignSelf: "stretch",
//     alignItems: "center",
//   },
//   signIn: {
//     justifyContent: "center",
//     flex: 1,
//   },
//   signInWrapper: {
//     paddingHorizontal: Padding.p_lg,
//     paddingTop: Padding.p_3xs,
//     paddingBottom: Padding.p_6xl,
//     justifyContent: "center",
//     flexDirection: "row",
//     alignSelf: "stretch",
//     alignItems: "center",
//   },
//   body: {
//     alignSelf: "stretch",
//     flex: 1,
//     backgroundColor: Color.m3White,
//   },
//   signUp: {
//     height: 812,
//     alignItems: "center",
//     width: "100%",
//     flex: 1,
//     backgroundColor: Color.m3White,
//   },
// });

// export default SignUp;
