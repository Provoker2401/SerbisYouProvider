import * as React from "react";
import { useState, useEffect, useRef, createRef } from "react";
import { Image } from "expo-image";
import {
  StatusBar,
  StyleSheet,
  Text,
  View,
  TextInput,
  Pressable,
  ActivityIndicator,
  Alert,
  Button,
  TouchableOpacity,
} from "react-native";
import { FontSize, FontFamily, Padding, Border, Color } from "../GlobalStyles";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigation } from "@react-navigation/native";
import {
  getFirestore,
  doc,
  getDoc,
  getDocs,
  setDoc,
  query,
  where,
  collection,
  addDoc,
} from "firebase/firestore";
import Toast from "react-native-toast-message";
// import * as FirebaseRecaptcha from "expo-firebase-recaptcha";
import axios from "axios";

const firebaseConfig = {
  apiKey: "AIzaSyDWQablgpC3ElsqOQuVhQU2YFsri1VmCss",
  authDomain: "testingauth-9126f.firebaseapp.com",
  projectId: "testingauth-9126f",
  storageBucket: "testingauth-9126f.appspot.com",
  messagingSenderId: "211063140592",
  appId: "1:211063140592:web:6d7047e844df66f1565235",
};

try {
  if (firebaseConfig.apiKey) {
    initializeApp(firebaseConfig);
  }
} catch (err) {
  // Ignore app already initialized error on snack
}

const Authentication = ({ route }) => {
  // const { name, email, phone, password } = route.params;
  const navigation = useNavigation();

  const [confirmInProgress, setConfirmInProgress] = useState(false);

  const [timer, setTimer] = useState(60);

  // console.log("Name:", name);
  // console.log("Email:", email);
  // console.log("Phone:", phone);
  // console.log("Password:", password);

  const [timerIntervalId, setTimerIntervalId] = useState(null);

  const [showWaitText, setShowWaitText] = useState(true);

  const startTimer = () => {
    const intervalId = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer === 0) {
          clearInterval(intervalId);
          return 0; // Keep the timer at 0 seconds
        } else {
          return prevTimer - 1;
        }
      });
    }, 1000);
    // Save the intervalId in the state
    setTimerIntervalId(intervalId);
  };

  const handleResendCode = () => {
    // Clear the previous interval before starting a new one
    clearInterval(timerIntervalId);
    // Reset the timer
    setTimer(60);
    // Start the new timer
    startTimer();

    sendVerificationCode();
  };

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [enteredOTP, setEnteredOTP] = useState("");
  const inputRefs = Array(6)
    .fill(0)
    .map(() => createRef());

  const handleInputChange = (value, index) => {
    if (/^[0-9]*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      setEnteredOTP(newOtp.join(""));

      if (index < 5 && value !== "") {
        inputRefs[index + 1].current.focus();
      }
    }
  };

  useEffect(() => {
    // Start the countdown timer after sending the verification code

    startTimer();

    // Uncomment the line below if you want to call sendVerificationCode when the component mounts
    sendVerificationCode();
  }, []);

  const sendVerificationCode = async () => {
    console.log("Phone number is: ", phone);
    try {
      const response = await axios.post(
        "https://us-central1-testingauth-9126f.cloudfunctions.net/sendOTP",
        {
          phoneNumber: phone,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      Toast.show({
        type: "success",
        position: "top",
        text1: "Verification",
        text2: "OTP has been sent❗",
        visibilityTime: 5000,
      });

      console.log("Response data:", response.data);
    } catch (error) {
      console.error("Error:", error.message);

      Toast.show({
        type: "error",
        position: "top",
        text1: "Error",
        text2: error,
        visibilityTime: 5000,
      });
    }
  };

  const verifyCode = async () => {
    try {
      const response = await axios.post(
        "https://us-central1-testingauth-9126f.cloudfunctions.net/verifyOTP",

        {
          phoneNumber: phone,
          otp: enteredOTP,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Response data:", response.data);

      const auth = getAuth();

      try {
        // Check if a document with the same phone number already exists
        const db = getFirestore();
        const querySnapshot = await getDocs(collection(db, "providerProfiles"));

        // Create the provider with email and password
        const providerCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        const provider = providerCredential.user;

        // Get the user's UID
        const providerUid = provider.uid;

        // Initialize Firestore and reference the 'providerProfiles' collection
        const providerDocRef = doc(db, "providerProfiles", providerUid);

        // Save provider data to Firestore using the UID as the document ID
        await setDoc(providerDocRef, {
          name: name,
          email: email,
          phone: `+63${phone}`,
          availability: "available", // Set default availability to false
          blackListed: [], // Initialize blackListed array with no values yet
          bookingID: "",
          bookingMatched: false,
          bookingIndex: 0,
          coordinates: {
            latitude: "",
            longitude: "",
          },
        });
        // Create subcollections with empty fields
        const appForm1Ref = collection(providerDocRef, "appForm1"); // Replace 'subcollection_name' with your desired subcollection name
        await addDoc(appForm1Ref, {
          name: name,
          email: email,
          phone: `+63${phone}`,
          city: "",
        });

        const appForm2Ref = collection(providerDocRef, "appForm2"); // Replace 'subcollection_name' with your desired subcollection name
        await addDoc(appForm2Ref, {
          idType: "",
          idProofimg: "",
        });

        const appForm3Ref = collection(providerDocRef, "appForm3"); // Replace 'subcollection_name' with your desired subcollection name
        await addDoc(appForm3Ref, {
          categories: "",
          subcategories: "",
          services: "",
        });

        const userWalletRef = collection(providerDocRef, "userWallet"); // Replace 'subcollection_name' with your desired subcollection name
        await addDoc(userWalletRef, {
          wallet: 0,
        });

        const activeBookings = collection(providerDocRef, "activeBookings"); // Replace 'subcollection_name' with your desired subcollection name
        await addDoc(activeBookings, {});

        const historyBookings = collection(providerDocRef, "historyBookings"); // Replace 'subcollection_name' with your desired subcollection name
        await addDoc(historyBookings, {});

        // User signed up successfully
        console.log("Sign Up Successful!");

        // Clear input fields and show success toast
        setName("");
        setEmail("");
        setPassword("");
        setPhone("");

        Toast.show({
          type: "success",
          position: "top",
          text1: "Sign Up Successful",
          text2: "You have successfully signed up✅",
          visibilityTime: 3000,
        });
      } catch (error) {
        console.error("Sign-up error:", error);

        Toast.show({
          type: "error",
          position: "top",
          text1: "Error",
          text2: error.message || "An error occurred while signing up",
          visibilityTime: 5000,
        });
      }

      navigation.navigate("BottomTabsRoot", { screen: "Homepage" });
    } catch (error) {
      console.error("Error verification:", error.message);

      Toast.show({
        type: "error",
        position: "top",
        text1: "Error Verification",
        text2: error,
        visibilityTime: 5000,
      });
    }
  };

  return (
    <View style={[styles.authentication, styles.frameFlexBox]}>
      <View style={[styles.frame, styles.frameFlexBox]}>
        <StatusBar barStyle="default" />

        <View style={[styles.frame1, styles.frameFlexBox]}>
          <View style={[styles.body, styles.frameFlexBox]}>
            <View style={[styles.body, styles.frameFlexBox]}>
              <View style={styles.frameFlexBox}>
                <View style={styles.frame3}>
                  <Text
                    style={styles.authentication1}
                  >{`    Authentication `}</Text>
                  <Text
                    style={styles.weveSentA}
                  >{`We’ve sent a code to the phone number provided.
Enter the code in that message to continue.`}</Text>
                  <View style={[styles.otpframe]}>
                    {Array(6)
                      .fill(0)
                      .map((_, index) => (
                        <TextInput
                          key={index}
                          ref={inputRefs[index]}
                          style={styles.input}
                          value={otp[index]}
                          onChangeText={(value) =>
                            handleInputChange(value, index)
                          }
                          keyboardType="numeric"
                          maxLength={1}
                        />
                      ))}
                  </View>
                  <Text style={styles.weveSentA}>
                    Entered OTP: {enteredOTP}
                  </Text>
                </View>
              </View>
              <View style={[styles.verifyframe, styles.frameFlexBox]}>
                <Pressable style={styles.componentsbutton} onPress={verifyCode}>
                  <Text style={styles.signIn}>Verify Code</Text>
                </Pressable>
              </View>
            </View>
            <View style={[styles.group34600reSendCodeIn0, styles.frameFlexBox]}>
              <Text style={[styles.didntReceiveCode, styles.codeTypo]}>
                Didn’t receive code?
                {timer > 0 && <Text> Wait for {timer}s</Text>}
              </Text>
              {timer === 0 && (
                <TouchableOpacity onPress={handleResendCode}>
                  <Text style={[styles.codeTypo, styles.resendCode]}>
                    Resend Code
                  </Text>
                </TouchableOpacity>
              )}
            </View>
            {/* <View style={[styles.group34600reSendCodeIn0, styles.frameFlexBox]}>
              {timer > 0 && (
                <Text>Resend code in: {timer} seconds</Text>
              )}
            </View> */}
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  frameFlexBox: {
    justifyContent: "center",
    alignItems: "center",
  },
  codeFlexBox: {
    fontSize: FontSize.size_19xl,
    fontFamily: FontFamily.level2Semibold12,
    paddingHorizontal: Padding.p_5xs,
    height: 64,
    paddingVertical: Padding.p_xs,
    borderRadius: Border.br_xs,
    flexDirection: "row",
    fontWeight: "600",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    flex: 1,
  },
  codeTypo: {
    lineHeight: 22,
    letterSpacing: -0.3,
    fontSize: FontSize.bodyLgBodyLgRegular_size,
    fontFamily: FontFamily.level2Medium12,
    fontWeight: "500",
    textAlign: "center",
  },
  icons: {
    top: 18,
    right: 14,
    width: 67,
    height: 11,
    position: "absolute",
  },
  time: {
    marginTop: -8,
    top: "50%",
    left: 32,
    letterSpacing: 0,
    lineHeight: 20,
    fontFamily: FontFamily.robotoBold,
    color: Color.colorBlack,
    textAlign: "left",
    fontWeight: "600",
    fontSize: FontSize.body1Semibold_size,
    position: "absolute",
  },
  statusBarLight: {
    width: 375,
    height: 44,
    backgroundColor: "white",
  },
  authentication1: {
    fontSize: 40,
    letterSpacing: -1,
    lineHeight: 41,
    color: Color.neutral07,
    textAlign: "center",
    fontFamily: FontFamily.title2Bold32,
    fontWeight: "700",
    alignSelf: "stretch",
  },
  code1: {
    backgroundColor: Color.neutral01,
    borderStyle: "solid",
    borderColor: Color.neutralShades0475,
    borderWidth: 2,
  },
  code2: {
    backgroundColor: Color.neutral03,
    marginLeft: 10,
  },
  code1Parent: {
    marginTop: 81,
    flexDirection: "row",
    alignSelf: "stretch",
  },
  frame3: {
    zIndex: 0,
    width: 335,
    justifyContent: "center",
    alignItems: "center",
  },
  weveSentA: {
    marginTop: 10,
    fontSize: FontSize.m3LabelLarge_size,
    letterSpacing: -0.1,
    lineHeight: 24,
    color: Color.colorTypographyContentIconsBlack02,
    textAlign: "center",
    fontFamily: FontFamily.level2Medium12,
    fontWeight: "500",
    alignSelf: "stretch",
  },
  otpInput: {
    width: "90%",
    height: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  codeInputField: {
    // marginTop: -20,
    fontFamily: "Inter-Bold",
    fontWeight: "semibold",
    width: 45,
    height: 64,
    // borderWidth: 0,
    // borderBottomWidth: 0,
    // borderColor: "gray",
    backgroundColor: Color.neutral03,
    borderRadius: 10,
    color: "black",
    textAlign: "center",
    fontSize: 40,
    // marginHorizontal: -30,
  },
  underlineStyleHighLighted: {
    borderColor: Color.neutralShades0475,
    backgroundColor: Color.neutral01,
  },
  signIn: {
    color: "white",
    lineHeight: 24,
    letterSpacing: -0.1,
    textAlign: "center",
    fontFamily: FontFamily.title2Bold32,
    fontWeight: "700",
    fontSize: FontSize.body1Semibold_size,
    flex: 1,
  },
  componentsbutton: {
    backgroundColor: Color.colorDarkslateblue_200,
    paddingHorizontal: Padding.p_xl,
    paddingVertical: Padding.p_xs,
    borderRadius: Border.br_xs,
    flexDirection: "row",
    width: 335,
    justifyContent: "center",
    alignItems: "center",
  },
  group34600buttonprimary: {
    marginTop: 60,
    flexDirection: "row",
  },
  verifyframe: {
    marginTop: 15,
    flexDirection: "column",
  },
  otpframe: {
    paddingVertical: 15,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statusContainer: {
    marginTop: 20,
  },
  loader: {
    marginTop: 10,
  },
  success: {
    color: "green",
    fontSize: 14,
  },
  error: {
    color: "red",
    fontSize: 14,
  },
  body: {
    alignSelf: "stretch",
  },
  didntReceiveCode: {
    color: Color.colorGray_1100,
  },
  resendCode: {
    color: "#007ea7",
    marginLeft: 10,
  },
  group34600reSendCodeIn0: {
    paddingHorizontal: Padding.p_10xs,
    paddingVertical: Padding.p_12xs,
    marginTop: 24,
    flexDirection: "row",
  },
  frame1: {
    alignSelf: "stretch",
    flex: 1,
    alignItems: "center",
  },
  frame: {
    alignSelf: "stretch",
    overflow: "hidden",
    alignItems: "center",
    flex: 1,
  },
  authentication: {
    width: "100%",
    height: 812,
    overflow: "hidden",
    alignItems: "center",
    flex: 1,
    backgroundColor: Color.white,
  },
  input: {
    height: 50,
    width: 50,
    borderWidth: 1,
    textAlign: "center",
    fontSize: 20,
    marginHorizontal: 5,
    borderRadius: 10,
  },
});

export default Authentication;
