import { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Pressable,
  StyleSheet,
  View,
  Text,
  ScrollView,
  TextInput,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Color, Border, Padding, FontFamily, FontSize } from "../GlobalStyles";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";
import Toast from "react-native-toast-message";
import Spinner from "react-native-loading-spinner-overlay";

const ApplicationForm1 = () => {
  const navigation = useNavigation();

  const [user, setUser] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [phone, setPhone] = useState(""); // Added phone state
  const [loading, setLoading] = useState(true); // Initialize loading state as true
  
  const fetchUserData = async () => {
    const auth = getAuth();
    const unsubscribeReference = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        setName("");
        setEmail("");
        return;
      }

      setUser(currentUser);

      try {
        const email = currentUser.email;
        setEmail(email);

        const db = getFirestore();
        const userProfilesCollection = collection(db, "providerProfiles");
        const userDocRef = doc(userProfilesCollection, currentUser.uid);
        const userDocSnapshot = await getDoc(userDocRef);

        if (userDocSnapshot.exists()) {
          const userData = userDocSnapshot.data();
          const { name } = userData;
          setName(name);
          console.log("Name:", name);
        } else {
          console.log("No user data found for the given UID.");
        }

        // Fetch data from the single document inside appForm1
        const appForm1Collection = collection(userDocRef, "appForm1");
        const appForm1Query = query(appForm1Collection);
        const appForm1Docs = await getDocs(appForm1Query);

        if (appForm1Docs.size === 1) {
          const appForm1Doc = appForm1Docs.docs[0];
          const appForm1Data = appForm1Doc.data();
          const { city, name, email, phone } = appForm1Data;
          setCity(city);
          setName(name);
          setEmail(email);
          setPhone(phone);
        } else {
          console.log("No or multiple documents found in appForm1.");
        }
        setLoading(false);
      } catch (error) {
        console.error("Error retrieving user data:", error);
        setLoading(false);
      }
    });

    return unsubscribeReference;
  };

  useEffect(() => {
    const unsubscribe = fetchUserData();
    return () => {
      unsubscribe();
    };
  }, []);

  const areInputsNotEmpty = () => {
    // Check if all required inputs are not empty
    return name !== '' && email !== '' && city !== '' && phone !== '';
  };

  const updateFirestoreData = async () => {
    try {
      const db = getFirestore();
      const userProfilesCollection = collection(db, "providerProfiles");
      const userDocRef = doc(userProfilesCollection, user.uid);
  
      // Fetch data from the "appForm1" subcollection
      const appForm1Collection = collection(userDocRef, "appForm1");
      const appForm1Query = query(appForm1Collection);
      const appForm1Docs = await getDocs(appForm1Query);
  
      if (appForm1Docs.size === 1) {
        const appForm1Doc = appForm1Docs.docs[0]; // Get the first document
        const appForm1DocRef = doc(appForm1Collection, appForm1Doc.id); // Construct the reference using the document's ID
        await setDoc(appForm1DocRef, {
          name,
          email,
          city,
          phone,
        });
        console.log("Data updated in Firestore.");
      } else {
        console.log("No or multiple documents found in appForm1.");
      }
    } catch (error) {
      console.error("Error updating Firestore data:", error);
    }
  };

  const isValidPhilippinePhoneNumber = (phoneNumber) => {
    // Clean the input by removing non-digit characters
    //const cleanedPhoneNumber = phoneNumber.replace(/\D/g, "");

    // Check if the cleaned phone number is exactly 10 digits
    if (phoneNumber.length !== 13) {
      return false;
    }

    // Check if the first digit is 9
    if (
      phoneNumber.charAt(0) !== "+" &&
      phoneNumber.charAt(1) !== "6" &&
      phoneNumber.charAt(2) !== "3"
    ) {
      return false;
    }

    return true;
  };
  

  return (
    <View style={[styles.applicationForm1, styles.applicationForm1Bg]}>
      <ScrollView
        style={styles.frame}
        showsVerticalScrollIndicator={true}
        showsHorizontalScrollIndicator={true}
        contentContainerStyle={styles.frameScrollViewContent}
      >
        <View
          style={[styles.componentsserviceList, styles.componentsbutton3Layout]}
        >
          {loading ? (
            <Spinner visible={true} textContent={"Loading..."} />
          ) : (
            <View style={styles.appFormStyle}>
              <View
                style={[
                  styles.personalDetailsFrameParent,
                  styles.detailsParentSpaceBlock,
                ]}
              >
                <Pressable style={styles.personalDetailsFrame}>
                  <Text style={[styles.personalDetails, styles.detailsTypo]}>
                    Personal Details
                  </Text>
                  <View
                    style={[
                      styles.componentsbutton,
                      styles.componentsbuttonSpaceBlock,
                    ]}
                  >
                    <Text style={styles.viewTypo} />
                  </View>
                </Pressable>
                <Pressable style={styles.idProofFrame}>
                  <Text style={[styles.idProof, styles.nameTypo]}>ID Proof</Text>
                  <View
                    style={[
                      styles.componentsbutton1,
                      styles.componentsbuttonSpaceBlock,
                    ]}
                  >
                    <Text style={styles.viewTypo} />
                  </View>
                </Pressable>
                <Pressable style={styles.idProofFrame}>
                  <Text style={[styles.idProof, styles.nameTypo]}>
                    Service Details
                  </Text>
                  <View
                    style={[
                      styles.componentsbutton1,
                      styles.componentsbuttonSpaceBlock,
                    ]}
                  >
                    <Text style={styles.viewTypo} />
                  </View>
                </Pressable>
              </View>
              <View
                style={[
                  styles.enterYouDetailsParent,
                  styles.enterYouDetailsParentFlexBox,
                ]}
              >
                <Text style={[styles.enterYouDetails, styles.detailsTypo]}>
                  Enter you Details
                </Text>
                <View style={[styles.frameParent, styles.frameSpaceBlock]}>
                  <View style={styles.frameGroup}>
                    <View style={styles.nameWrapper}>
                      <Text style={[styles.name, styles.nameTypo]}>Name</Text>
                    </View>
                    <View
                      style={[
                        styles.frameWrapper,
                        styles.componentsbuttonSpaceBlock,
                      ]}
                    >
                      <TextInput
                        style={styles.frameTypo}
                        placeholder="Name"
                        placeholderTextColor="#1a1b2d"
                        //value = {name}
                        value={name} // Set the value of the text input to the 'name' state
                        onChangeText={(text) => setName(text)} // This allows you to edit the name
                      />
                    </View>
                  </View>
                  <View style={styles.frameSpaceBlock}>
                    <View style={styles.nameWrapper}>
                      <Text style={[styles.mobileNumber, styles.nameTypo]}>
                        Mobile Number
                      </Text>
                    </View>
                    <View
                      style={[
                        styles.frameWrapper,
                        styles.componentsbuttonSpaceBlock,
                      ]}
                    >
                      <TextInput
                        style={[styles.frameItem, styles.frameTypo]}
                        value={phone} // Set the value of the text input to the 'name' state
                        onChangeText={(text) => setPhone(text)} // This allows you to edit the name
                        placeholderTextColor="#1a1b2d"
                      />
                    </View>
                  </View>
                  <View style={styles.frameSpaceBlock}>
                    <View style={styles.nameWrapper}>
                      <Text style={[styles.name, styles.nameTypo]}>Email</Text>
                    </View>
                    <View
                      style={[
                        styles.frameWrapper,
                        styles.componentsbuttonSpaceBlock,
                      ]}
                    >
                      <TextInput
                        style={styles.frameTypo}
                        value={email} // Set the value of the text input to the 'name' state
                        onChangeText={(text) => setEmail(text)} // This allows you to edit the name
                        placeholderTextColor="#1a1b2d"
                      />
                    </View>
                  </View>
                  <View style={styles.frameSpaceBlock}>
                    <View style={styles.nameWrapper}>
                      <Text style={[styles.name, styles.nameTypo]}>City</Text>
                    </View>
                    <View
                      style={[
                        styles.frameWrapper,
                        styles.componentsbuttonSpaceBlock,
                      ]}
                    >
                      <TextInput
                        style={styles.frameTypo}
                        value={city} // Set the value of the text input to the 'name' state
                        onChangeText={(text) => setCity(text)} // This allows you to edit the name
                        placeholderTextColor="#1a1b2d"
                      />
                    </View>
                  </View>
                </View>
              </View>
              <View
                style={[
                  styles.componentsbuttonWrapper,
                  styles.enterYouDetailsParentFlexBox,
                ]}
              >
                <Pressable
                  style={[
                    styles.componentsbutton3,
                    styles.componentsbuttonSpaceBlock1,
                  ]}
                  onPress={async () => {
                    if (!isValidPhilippinePhoneNumber(phone)) {
                      Toast.show({
                        type: "error",
                        position: "top",
                        text1: "Error",
                        text2: "Enter a valid  phone number with format +63❗",
                        visibilityTime: 5000,
                      });
                      return;
                    }
                    if (areInputsNotEmpty()) {
                      // All inputs are not empty, navigate to "ApplicationForm2"
                      await updateFirestoreData();
                      navigation.navigate("ApplicationForm2");
                    } else {
                      Toast.show({
                        type: "error",
                        position: "top",
                        text1: "Error",
                        text2: "Form Incomplete",
                        visibilityTime: 5000,
                      });
                      return;
                    }
                  }}            >
                  <Text style={[styles.viewAllServices3, styles.viewTypo]}>
                    Next
                  </Text>
                </Pressable>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  appFormStyle: {
    justifyContent: "center",
    alignSelf: "stretch",
  },
  header: {
    backgroundColor: "#1a244d",
  },
  frameScrollViewContent: {
    flexDirection: "column",
    paddingHorizontal: 0,
    paddingVertical: 20,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  applicationForm1Bg: {
    backgroundColor: Color.m3White,
    alignItems: "center",
  },
  componentsbutton3Layout: {
    borderRadius: Border.br_5xs,
    alignSelf: "stretch",
  },
  detailsParentSpaceBlock: {
    paddingVertical: Padding.p_3xs,
    paddingHorizontal: 0,
  },
  detailsTypo: {
    textAlign: "left",
    color: Color.neutral07,
    fontFamily: FontFamily.levelSemibold14,
    fontWeight: "600",
  },
  componentsbuttonSpaceBlock: {
    marginTop: 8,
    borderRadius: Border.br_5xs,
    flexDirection: "row",
  },
  nameTypo: {
    color: Color.colorGray_100,
    textAlign: "left",
    fontFamily: FontFamily.levelSemibold14,
    fontWeight: "600",
    letterSpacing: -0.3,
  },
  enterYouDetailsParentFlexBox: {
    marginTop: 20,
    justifyContent: "center",
    alignSelf: "stretch",
  },
  frameSpaceBlock: {
    marginTop: 25,
    alignSelf: "stretch",
  },
  frameTypo: {
    fontSize: FontSize.levelSemibold14_size,
    fontFamily: FontFamily.levelSemibold14,
    fontWeight: "600",
    flexDirection: "row",
    flex: 1,
  },
  componentsbuttonSpaceBlock1: {
    paddingVertical: Padding.p_xs,
    paddingHorizontal: Padding.p_3xl,
  },
  viewTypo: {
    color: Color.neutral01,
    lineHeight: 24,
    letterSpacing: -0.1,
    fontSize: FontSize.paragraphMedium15_size,
    textAlign: "center",
    fontFamily: FontFamily.title2Bold32,
    fontWeight: "700",
  },
  personalDetails: {
    letterSpacing: -0.3,
    textAlign: "left",
    color: Color.neutral07,
    fontFamily: FontFamily.levelSemibold14,
    fontWeight: "600",
    fontSize: FontSize.typographyTaglineSmallRegular_size,
  },
  componentsbutton: {
    backgroundColor: Color.colorDarkslateblue_200,
    paddingVertical: Padding.p_xs,
    paddingHorizontal: Padding.p_3xl,
    height: 14,
    width: 91,
    marginTop: 8,
  },
  personalDetailsFrame: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  idProof: {
    color: Color.colorGray_100,
    fontSize: FontSize.typographyTaglineSmallRegular_size,
  },
  componentsbutton1: {
    backgroundColor: Color.colorLightgray_100,
    paddingVertical: Padding.p_xs,
    paddingHorizontal: Padding.p_3xl,
    height: 14,
    width: 91,
    marginTop: 8,
  },
  idProofFrame: {
    marginLeft: 10,
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  personalDetailsFrameParent: {
    overflow: "hidden",
    justifyContent: "center",
    flexDirection: "row",
    alignSelf: "stretch",
    alignItems: "center",
  },
  enterYouDetails: {
    letterSpacing: -0.4,
    textAlign: "left",
    color: Color.neutral07,
    fontFamily: FontFamily.levelSemibold14,
    fontWeight: "600",
    fontSize: FontSize.title3Bold20_size,
  },
  name: {
    fontSize: FontSize.paragraphMedium15_size,
    color: Color.colorGray_100,
  },
  nameWrapper: {
    flexDirection: "row",
    alignSelf: "stretch",
  },
  frameWrapper: {
    backgroundColor: Color.colorInputDefault,
    padding: Padding.p_xs,
    alignSelf: "stretch",
    alignItems: "center",
  },
  frameGroup: {
    alignSelf: "stretch",
  },
  mobileNumber: {
    fontSize: FontSize.paragraphMedium15_size,
    color: Color.colorGray_100,
    flex: 1,
  },
  frameItem: {
    justifyContent: "center",
    alignItems: "center",
  },
  frameParent: {
    justifyContent: "center",
  },
  enterYouDetailsParent: {
    paddingVertical: Padding.p_3xs,
    paddingHorizontal: 0,
  },
  viewAllServices3: {
    flex: 1,
  },
  componentsbutton3: {
    backgroundColor: Color.colorDarkslategray_600,
    borderRadius: Border.br_5xs,
    alignSelf: "stretch",
    flexDirection: "row",
  },
  componentsbuttonWrapper: {
    paddingTop: 20,
    alignItems: "center",
  },
  componentsserviceList: {
    padding: Padding.p_base,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Color.m3White,
  },
  frame: {
    alignSelf: "stretch",
    flex: 1,
  },
  applicationForm1: {
    height: 812,
    alignItems: "center",
    width: "100%",
    flex: 1,
  },
});

export default ApplicationForm1;

