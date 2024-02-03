// import { useEffect, useState } from "react";
// import {
//   StatusBar,
//   StyleSheet,
//   Pressable,
//   View,
//   Text,
//   ScrollView,
//   TextInput,
// } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";
// import { Image } from "expo-image";
// import { Datepicker as RNKDatepicker, Icon } from "@ui-kitten/components";
// import { Color, FontFamily, FontSize, Padding, Border } from "../GlobalStyles";
// import { getAuth, onAuthStateChanged, updateEmail } from "firebase/auth";
// import {
//   getFirestore,
//   collection,
//   query,
//   where,
//   getDoc,
//   doc,
//   updateDoc,
// } from "firebase/firestore";
// import { useNavigation } from "@react-navigation/native";
// import * as ImagePicker from "expo-image-picker";
// import MaskedView from "@react-native-masked-view/masked-view";
// import { Svg, Circle } from "react-native-svg";
// import { app, firebaseConfig } from "../App"; // Update the path as needed
// import {
//   getStorage,
//   ref,
//   uploadString,
//   getDownloadURL,
//   uploadBytes,
// } from "firebase/storage";

// const EditProfile = () => {
//   const navigation = useNavigation();
//   const [fieldDatePicker, setFieldDatePicker] = useState(undefined);
//   const [user, setUser] = useState(null);
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [phoneNumber, setphoneNumber] = useState("");

//   //handle text inputs
//   const [textInputName, settextInputName] = useState("");
//   const [textInputEmail, settextInputEmail] = useState("");
//   const [textInputPhone, settextInputPhone] = useState("");
//   const [imageURI, setImageURI] = useState(null);


//   const [profileImage, setProfileImage] = useState(null);


  
//   useEffect(() => {
//     const auth = getAuth();

//     (async () => {
//       const { status } =
//         await ImagePicker.requestMediaLibraryPermissionsAsync();
//       if (status !== "granted") {
//         alert("Permission to access the camera roll is required!");
//       }
//     })();

//     const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
//       setUser(currentUser);

//       if (!currentUser) {
//         // Handle the case when the user is not signed in
//         // You can navigate to the login screen or show a message
//         // For now, let's set name and email to empty strings
//         setName("");
//         setEmail("");
//         return;
//       }

//       try {
//         const db = getFirestore(); // Use getFirestore() to initialize Firestore
//         const userProfilesCollection = collection(db, "userProfiles");

//         // Get a reference to the document with the user's UID
//         const userDocRef = doc(userProfilesCollection, currentUser.uid);

//         // Check if the document with the user's UID exists
//         const userDocSnapshot = await getDoc(userDocRef);

//         const email = currentUser.email;
//         setEmail(email);

//         if (userDocSnapshot.exists()) {
//           // Document with matching UID found, get the data
//           const userData = userDocSnapshot.data();
//           const { name, phone } = userData;
//           setName(name);
//           setphoneNumber(phone);
//           // Display the user's UID using console.log
//           // console.log("User UID:", currentUser.uid);
        
//           fetchProfileImage(currentUser.uid);

//         } else {
//           console.log("No user data found for the given UID.");

//           // Handle this case, e.g., display a message to the user
//         }
//       } catch (error) {
//         console.error("Error retrieving user data:", error);
//         // Handle the error, e.g., display an error message to the user
//       }
//     });

//     // Return the unsubscribe function to clean up the listener when needed
//     return unsubscribe;
//   }, []);

  
//   const fetchProfileImage = async (uid) => {
//     const storage = getStorage();
//     const imageRef = ref(storage, `ProfilePictures/${uid}`);

//     try {
//       const imageUrl = await getDownloadURL(imageRef);
//       setProfileImage(imageUrl);
//     } catch (error) {
//       console.error("Error fetching profile image:", error);
//       // Set a default image URL if the image doesn't exist
//       setProfileImage(require("../assets/serviceProviderIcon.png"));
//     }
//   };

//   const saveChangesHandle = async () => {
//     try {
//       const db = getFirestore(); // Initialize Firestore
//       const userProfilesCollection = collection(db, "userProfiles");
//       const auth = getAuth();
//       updateEmail(auth.currentUser, textInputEmail)
//         .then(() => {
//           // Email updated!
//           // ...
//           console.log("Email Updated!");
//         })
//         .catch((error) => {
//           // An error occurred
//           // ...
//         });
//       // Get a reference to the document with the user's UID
//       const userDocRef = doc(userProfilesCollection, user.uid);

//       // Update the document with new data
//       await updateDoc(userDocRef, {
//         name: textInputName, // Assuming newName is a state variable containing the updated name
//         phone: textInputPhone, // Assuming newPhone is a state variable containing the updated phone
//       });

//       console.log("User data updated successfully!");
//       navigation.navigate("BottomTabsRoot", { screen: "Homepage" });
//     } catch (error) {
//       console.error("Error updating user data:", error);
//       // Handle the error, e.g., display an error message to the user
//     }
//   };

//   const pickImage = async () => {
//     let result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Images,
//       allowsEditing: true,
//       aspect: [1, 1],
//       quality: 1,
//     });

//     if (result.canceled) {
//       return;
//     }

//     if (result.assets && result.assets.length > 0) {
//       const selectedAsset = result.assets[0];
//       const selectedImageURI = selectedAsset.uri;

//       // Create a reference to the storage location using the imported app
//       const storage = getStorage(app);

//       // Create a reference to the profile picture in the "ProfilePictures" folder
//       const storageRef = ref(storage, `ProfilePictures/${user.uid}`);

//       try {
//         // Read the image file as a blob
//         const response = await fetch(selectedImageURI);
//         const blob = await response.blob();

//         // Upload the image blob to Firebase Storage
//         const snapshot = await uploadBytes(storageRef, blob);

//         // Get the download URL of the uploaded image
//         const downloadURL = await getDownloadURL(snapshot.ref);

//         // Now you can use `downloadURL` to display or save the image URL in Firestore if needed.
//         setImageURI(downloadURL);

//         console.log("Image uploaded successfully:", downloadURL);
//       } catch (error) {
//         console.error("Error uploading image to Firebase Storage:", error);
//       }
//     }
//   };

//   return (
//     <View style={styles.editProfile}>
//       <StatusBar barStyle="default" />
//       <ScrollView
//         style={styles.body}
//         showsVerticalScrollIndicator={true}
//         showsHorizontalScrollIndicator={true}
//         contentContainerStyle={styles.bodyScrollViewContent}
//       >
//         <View style={[styles.profile, styles.profileFlexBox]}>
//           <View style={[styles.ellipseParent, styles.profileFlexBox]}>
//             {imageURI ? (
//               <MaskedView
//                 style={styles.circularImageContainer}
//                 maskElement={
//                   <Svg height={150} width={150}>
//                     <Circle cx={75} cy={75} r={75} fill="white" />
//                   </Svg>
//                 }
//               >
//                 <Image
//                   style={styles.circularImage}
//                   contentFit="cover"
//                   source={{ uri: imageURI }}
//                 />
//               </MaskedView>
//             ) : (
//               <Image
//                 style={styles.frameChild}
//                 contentFit="cover"
//                 source={{ uri: profileImage }} // Set the profile image source

//               />
//             )}
//             <Image
//               style={[styles.vectorIcon, styles.badgePosition]}
//               contentFit="cover"
//               source={require("../assets/vector.png")}
//             />
//           </View>

//           <Pressable style={styles.changePictureBtn} onPress={pickImage}>
//             <Text style={[styles.changePicture, styles.nameTypo]}>
//               Change Picture
//             </Text>
//           </Pressable>
//         </View>
//         <View style={[styles.profileSettings, styles.bodyInnerSpaceBlock1]}>
//           <View style={styles.singleLineInput}>
//             <View style={styles.nameWrapper}>
//               <Text style={[styles.name, styles.nameTypo]}>Name</Text>
//             </View>
//             <View style={[styles.field, styles.fieldSpaceBlock]}>
//               <TextInput
//                 style={styles.addressInput}
//                 placeholder={name}
//                 placeholderTextColor="#c1c1c1"
//                 value={textInputName}
//                 onChangeText={(text) => settextInputName(text)} // Update the state when the text input changes
//               />
//             </View>
//             <View style={styles.leftIconParent}>
//               <Image
//                 style={styles.leftIcon}
//                 contentFit="cover"
//                 source={require("../assets/-left-icon.png")}
//               />
//               <Text style={styles.weAllWanna}>
//                 We all wanna make money, let’s do this
//               </Text>
//             </View>
//           </View>
//           <View style={styles.singleLineInput1}>
//             <View style={styles.nameWrapper}>
//               <Text style={[styles.email, styles.nameTypo]}>Email</Text>
//             </View>
//             <View style={[styles.field1, styles.fieldSpaceBlock]}>
//               <TextInput
//                 style={styles.addressInput}
//                 placeholder={email}
//                 placeholderTextColor="#c1c1c1"
//                 value={textInputEmail}
//                 onChangeText={(text) => settextInputEmail(text)} // Update the state when the text input changes
//               />
//             </View>
//             <View style={styles.leftIconParent}>
//               <Image
//                 style={styles.leftIcon}
//                 contentFit="cover"
//                 source={require("../assets/-left-icon.png")}
//               />
//               <Text style={styles.weAllWanna}>
//                 We all wanna make money, let’s do this
//               </Text>
//             </View>
//           </View>
//           <View style={styles.singleLineInput1}>
//             <View style={styles.nameWrapper}>
//               <Text style={[styles.name, styles.nameTypo]}>Address</Text>
//             </View>
//             <View style={[styles.field, styles.fieldSpaceBlock]}>
//               <TextInput
//                 style={styles.addressInput}
//                 placeholder="Nasipit, Talamban, Cebu City, Cebu"
//                 placeholderTextColor="#c1c1c1"
//               />
//             </View>
//             <View style={styles.leftIconParent}>
//               <Image
//                 style={styles.leftIcon}
//                 contentFit="cover"
//                 source={require("../assets/-left-icon.png")}
//               />
//               <Text style={styles.weAllWanna}>
//                 We all wanna make money, let’s do this
//               </Text>
//             </View>
//           </View>
//           <View style={styles.singleLineInput1}>
//             <View style={styles.nameWrapper}>
//               <Text style={[styles.name, styles.nameTypo]}>Contact Number</Text>
//             </View>
//             <View style={[styles.field, styles.fieldSpaceBlock]}>
//               <TextInput
//                 style={styles.addressInput}
//                 placeholder={phoneNumber}
//                 placeholderTextColor="#c1c1c1"
//                 value={textInputPhone}
//                 onChangeText={(text) => settextInputPhone(text)} // Update the state when the text input changes
//               />
//             </View>
//             <View style={styles.leftIconParent}>
//               <Image
//                 style={styles.leftIcon}
//                 contentFit="cover"
//                 source={require("../assets/-left-icon.png")}
//               />
//               <Text style={styles.weAllWanna}>
//                 We all wanna make money, let’s do this
//               </Text>
//             </View>
//           </View>
//         </View>
//         <View style={[styles.bodyInner, styles.bodyInnerSpaceBlock]}>
//           <View style={[styles.saveChangesBtnWrapper, styles.buttonFlexBox]}>
//             <Pressable
//               style={[styles.profile, styles.profileFlexBox]}
//               onPress={saveChangesHandle}
//             >
//               <View style={[styles.button, styles.buttonFlexBox]}>
//                 <Text style={[styles.button1, styles.button1Typo]}>
//                   Save Changes
//                 </Text>
//               </View>
//             </Pressable>
//           </View>
//         </View>
//       </ScrollView>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   circularImageContainer: {
//     width: 150, // Adjust the width and height as needed for your design
//     height: 150,
//   },
//   circularImage: {
//     position: "absolute",
//     width: "100%",
//     height: "100%",
//   },
//   header: {
//     backgroundColor: "#1a244d",
//   },
//   fieldDatePickerPlaceHolder: {
//     fontWeight: "500",
//     fontFamily: "Georama-Medium",
//     color: "#c1c1c1",
//     fontSize: 13,
//   },
//   fieldDatePickerValue: {},
//   bodyScrollViewContent: {
//     flexDirection: "column",
//     paddingHorizontal: 0,
//     paddingVertical: 15,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   viewFlexBox: {
//     alignItems: "center",
//     flexDirection: "row",
//   },
//   profileFlexBox: {
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   button1Typo: {
//     textAlign: "center",
//     color: Color.white,
//     fontWeight: "700",
//   },
//   badgePosition: {
//     zIndex: 1,
//     position: "absolute",
//     overflow: "hidden",
//   },
//   nameTypo: {
//     textAlign: "left",
//     fontFamily: FontFamily.typographyParagraphSmallMedium,
//     fontWeight: "500",
//     fontSize: FontSize.typographyTaglineSmallRegular_size,
//   },
//   bodyInnerSpaceBlock1: {
//     paddingHorizontal: Padding.p_3xl,
//     marginTop: 15,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   fieldSpaceBlock: {
//     paddingVertical: Padding.p_base,
//     borderWidth: 1,
//     borderStyle: "solid",
//     marginTop: 8,
//     paddingHorizontal: Padding.p_5xs,
//     borderRadius: Border.br_5xs,
//     overflow: "hidden",
//     alignItems: "center",
//     flexDirection: "row",
//     alignSelf: "stretch",
//   },
//   bodyInnerSpaceBlock: {
//     paddingVertical: 0,
//     alignSelf: "stretch",
//   },
//   buttonFlexBox: {
//     paddingVertical: Padding.p_xl,
//     justifyContent: "center",
//     alignItems: "center",
//     alignSelf: "stretch",
//   },
//   labelTypo: {
//     marginTop: 4,
//     fontFamily: FontFamily.m3LabelLarge,
//     lineHeight: 16,
//     letterSpacing: 1,
//     fontSize: FontSize.level2Medium12_size,
//     fontWeight: "500",
//     textAlign: "center",
//     alignSelf: "stretch",
//   },
//   segmentSpaceBlock: {
//     opacity: 0.8,
//     paddingBottom: Padding.p_base,
//     paddingTop: Padding.p_xs,
//     width: 90,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   iconContainerFlexBox: {
//     borderRadius: Border.br_base,
//     justifyContent: "center",
//     overflow: "hidden",
//     alignItems: "center",
//   },
//   iconLayout: {
//     height: 30,
//     width: 26,
//     overflow: "hidden",
//   },
//   frameChild: {
//     width: 147,
//     height: 147,
//     borderRadius: 73.5,
//   },
//   vectorIcon: {
//     height: "11.03%",
//     width: "11.03%",
//     top: "86.21%",
//     right: "17.93%",
//     bottom: "2.76%",
//     left: "71.03%",
//     maxWidth: "100%",
//     maxHeight: "100%",
//   },
//   ellipseParent: {
//     flexDirection: "row",
//   },
//   changePicture: {
//     color: "#4eb5ff",
//   },
//   changePictureBtn: {
//     marginTop: 15,
//     justifyContent: "center",
//     alignItems: "center",
//     flexDirection: "row",
//   },
//   profile: {
//     alignSelf: "stretch",
//   },
//   name: {
//     color: Color.colorGray80,
//     flex: 1,
//   },
//   nameWrapper: {
//     flexDirection: "row",
//     alignSelf: "stretch",
//   },
//   addressInput: {
//     fontFamily: FontFamily.typographyParagraphSmallMedium,
//     fontWeight: "500",
//     fontSize: FontSize.typographyTaglineSmallRegular_size,
//     alignItems: "center",
//     flexDirection: "row",
//     flex: 1,
//   },
//   field: {
//     borderColor: Color.colorDarkslategray_200,
//     marginTop: 8,
//   },
//   leftIcon: {
//     width: 13,
//     height: 13,
//   },
//   weAllWanna: {
//     fontFamily: FontFamily.typographyTaglineSmallRegular,
//     color: Color.colorGray60,
//     marginLeft: 8,
//     fontSize: FontSize.level2Medium12_size,
//     textAlign: "left",
//   },
//   leftIconParent: {
//     display: "none",
//     marginTop: 8,
//     flexDirection: "row",
//   },
//   singleLineInput: {
//     alignSelf: "stretch",
//   },
//   email: {
//     color: Color.colorGray50,
//     flex: 1,
//   },
//   field1: {
//     borderColor: Color.colorGray50,
//     marginTop: 8,
//   },
//   singleLineInput1: {
//     marginTop: 21,
//     alignSelf: "stretch",
//   },
//   vuesaxbrokencalendarIcon: {
//     width: 18,
//     height: 18,
//   },
//   leftIcon4: {
//     marginLeft: 8,
//   },
//   field5: {
//     marginTop: 8,
//   },
//   profileSettings: {
//     paddingBottom: Padding.p_8xs,
//     alignSelf: "stretch",
//   },
//   button1: {
//     fontSize: FontSize.bodyLgBodyLgRegular_size,
//     fontFamily: FontFamily.georamaBold,
//   },
//   button: {
//     paddingHorizontal: Padding.p_5xs,
//     flexDirection: "row",
//     borderRadius: Border.br_5xs,
//     paddingVertical: Padding.p_xl,
//     backgroundColor: Color.colorDarkslateblue_100,
//   },
//   saveChangesBtnWrapper: {
//     paddingHorizontal: 0,
//   },
//   bodyInner: {
//     paddingHorizontal: Padding.p_3xl,
//     marginTop: 15,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   body: {
//     backgroundColor: Color.colorWhitesmoke_100,
//     alignSelf: "stretch",
//     flex: 1,
//   },
//   editProfile: {
//     height: 812,
//     width: "100%",
//     flex: 1,
//     backgroundColor: Color.white,
//   },
// });

// export default EditProfile;

import { useEffect, useState } from "react";
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
import { Datepicker as RNKDatepicker, Icon } from "@ui-kitten/components";
import { Color, FontFamily, FontSize, Padding, Border } from "../GlobalStyles";
import { getAuth, onAuthStateChanged, updateEmail } from "firebase/auth";
import {
  getFirestore,
  collection,
  query,
  where,
  getDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import MaskedView from "@react-native-masked-view/masked-view";
import { Svg, Circle } from "react-native-svg";
import { app, firebaseConfig } from "../App"; // Update the path as needed
import {
  getStorage,
  ref,
  uploadString,
  getDownloadURL,
  uploadBytes,
} from "firebase/storage";
import Toast from "react-native-toast-message";

const EditProfile = () => {
  const navigation = useNavigation();
  const [fieldDatePicker, setFieldDatePicker] = useState(undefined);
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setphoneNumber] = useState("");

  //handle text inputs
  const [textInputName, settextInputName] = useState("name");
  const [textInputEmail, settextInputEmail] = useState("email");
  const [textInputPhone, settextInputPhone] = useState("phoneNumber");
  const [imageURI, setImageURI] = useState(null);

  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
    const auth = getAuth();

    (async () => {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        alert("Permission to access the camera roll is required!");
      }
    })();

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (!currentUser) {
        // Handle the case when the user is not signed in
        // You can navigate to the login screen or show a message
        // For now, let's set name and email to empty strings
        setName("");
        setEmail("");
        return;
      }

      try {
        const db = getFirestore(); // Use getFirestore() to initialize Firestore
        const userProfilesCollection = collection(db, "providerProfiles");

        // Get a reference to the document with the user's UID
        const userDocRef = doc(userProfilesCollection, currentUser.uid);

        // Check if the document with the user's UID exists
        const userDocSnapshot = await getDoc(userDocRef);

        const email = currentUser.email;
        setEmail(email);

        if (userDocSnapshot.exists()) {
          // Document with matching UID found, get the data
          const userData = userDocSnapshot.data();
          const { name, phone, email } = userData;
          setName(name);
          setphoneNumber(phone);
          setEmail(email);
          settextInputEmail(email);
          settextInputName(name);
          settextInputPhone(phone);

          // Display the user's UID using console.log
          // console.log("User UID:", currentUser.uid);

          fetchProfileImage(currentUser.uid);
        } else {
          console.log("No user data found for the given UID.");

          // Handle this case, e.g., display a message to the user
        }
      } catch (error) {
        console.error("Error retrieving user data:", error);
        // Handle the error, e.g., display an error message to the user
      }
    });

    // Return the unsubscribe function to clean up the listener when needed
    return unsubscribe;
  }, []);

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

  const isValidEmail = (email) => {
    const emailPattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

    // Check if the email matches the pattern
    return emailPattern.test(email);
  };

  const saveChangesHandle = async () => {
    try {
      const db = getFirestore(); // Initialize Firestore
      const userProfilesCollection = collection(db, "providerProfiles");
      const auth = getAuth();
      updateEmail(auth.currentUser, textInputEmail)
        .then(() => {
          // Email updated!
          // ...
          console.log("Email Updated!");
        })
        .catch((error) => {
          // An error occurred
          // ...
        });

      if (
        textInputName === "" ||
        textInputEmail === "" ||
        textInputPhone === ""
      ) {
        Toast.show({
          type: "error",
          position: "top",
          text1: "Error",
          text2: "Please fill in all required fields❗",
          visibilityTime: 5000,
        });
        return;
      }
      if (!isValidPhilippinePhoneNumber(textInputPhone)) {
        Toast.show({
          type: "error",
          position: "top",
          text1: "Error",
          text2: "Enter a valid  phone number with format +63❗",
          visibilityTime: 5000,
        });
        return;
      }
      if (!isValidEmail(textInputEmail)) {
        Toast.show({
          type: "error",
          position: "top",
          text1: "Error",
          text2: "Enter a valid email❗",
          visibilityTime: 5000,
        });
        return;
      } else {
        const userDocRef = doc(userProfilesCollection, user.uid);

        // Update the document with new data
        await updateDoc(userDocRef, {
          name: textInputName, // Assuming newName is a state variable containing the updated
          email: textInputEmail,
          phone: textInputPhone, // Assuming newPhone is a state variable containing the updated phone
        });

        Toast.show({
          type: "success",
          position: "top",
          text1: "Save Successfully ✅",
          //text2: "You have successfully signed up✅",
          visibilityTime: 3000,
        });

        navigation.navigate("UserProfile");
      }
      // Get a reference to the document with the user's UID

      console.log("User data updated successfully!");
      //navigation.navigate("BottomTabsRoot", { screen: "Homepage" });
    } catch (error) {
      console.error("Error updating user data:", error);
      // Handle the error, e.g., display an error message to the user
    }
  };

  const fetchProfileImage = async (uid) => {
    const storage = getStorage();
    const imageRef = ref(storage, `ProfilePictures/${uid}`);
    const defaultImage = ref(
      storage,
      "ProfilePictures/serviceProviderIcon.png"
    );

    try {
      const imageUrl = await getDownloadURL(imageRef);
      setProfileImage(imageUrl);
    } catch (error) {
      //console.error("Error fetching profile image:", error);
      // Set a default image URL if the image doesn't exist
      const imageUrl = await getDownloadURL(defaultImage);

      setProfileImage(imageUrl);
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (result.canceled) {
      return;
    }

    if (result.assets && result.assets.length > 0) {
      const selectedAsset = result.assets[0];
      const selectedImageURI = selectedAsset.uri;

      // Create a reference to the storage location using the imported app
      const storage = getStorage(app);

      // Create a reference to the profile picture in the "ProfilePictures" folder
      const storageRef = ref(storage, `ProfilePictures/${user.uid}`);

      try {
        // Read the image file as a blob
        const response = await fetch(selectedImageURI);
        const blob = await response.blob();

        // Upload the image blob to Firebase Storage
        const snapshot = await uploadBytes(storageRef, blob);

        // Get the download URL of the uploaded image
        const downloadURL = await getDownloadURL(snapshot.ref);

        // Now you can use `downloadURL` to display or save the image URL in Firestore if needed.
        setImageURI(downloadURL);

        console.log("Image uploaded successfully:", downloadURL);
      } catch (error) {
        console.error("Error uploading image to Firebase Storage:", error);
      }
    }
  };

  return (
    <View style={styles.editProfile}>
      <StatusBar barStyle="default" />
      <ScrollView
        style={styles.body}
        showsVerticalScrollIndicator={true}
        showsHorizontalScrollIndicator={true}
        contentContainerStyle={styles.bodyScrollViewContent}
      >
        <View style={[styles.profile, styles.profileFlexBox]}>
          <View style={[styles.ellipseParent, styles.profileFlexBox]}>
            {imageURI ? (
              <MaskedView
                style={styles.circularImageContainer}
                maskElement={
                  <Svg height={150} width={150}>
                    <Circle cx={75} cy={75} r={75} fill="white" />
                  </Svg>
                }
              >
                <Image
                  style={styles.circularImage}
                  contentFit="cover"
                  source={{ uri: imageURI }}
                />
              </MaskedView>
            ) : (
              <Image
                style={styles.frameChild}
                contentFit="cover"
                source={{ uri: profileImage }} // Set the profile image source
              />
            )}
            <Image
              style={[styles.vectorIcon, styles.badgePosition]}
              contentFit="cover"
              source={require("../assets/Vector.png")}
            />
          </View>

          <Pressable style={styles.changePictureBtn} onPress={pickImage}>
            <Text style={[styles.changePicture, styles.nameTypo]}>
              Change Picture
            </Text>
          </Pressable>
        </View>
        <View style={[styles.profileSettings, styles.bodyInnerSpaceBlock1]}>
          <View style={styles.singleLineInput}>
            <View style={styles.nameWrapper}>
              <Text style={[styles.name, styles.nameTypo]}>Name</Text>
            </View>
            <View style={[styles.field, styles.fieldSpaceBlock]}>
              <TextInput
                style={styles.addressInput}
                placeholder="Name"
                placeholderTextColor="#c1c1c1"
                value={textInputName}
                onChangeText={(text) => settextInputName(text)} // Update the state when the text input changes
              />
            </View>
            <View style={styles.leftIconParent}>
              <Image
                style={styles.leftIcon}
                contentFit="cover"
                source={require("../assets/-left-icon.png")}
              />
              <Text style={styles.weAllWanna}>
                We all wanna make money, let’s do this
              </Text>
            </View>
          </View>
          <View style={styles.singleLineInput1}>
            <View style={styles.nameWrapper}>
              <Text style={[styles.name, styles.nameTypo]}>Email</Text>
            </View>
            <View style={[styles.field, styles.fieldSpaceBlock]}>
              <TextInput
                style={styles.addressInput}
                placeholder="Email"
                placeholderTextColor="#c1c1c1"
                value={textInputEmail}
                onChangeText={(text) => settextInputEmail(text)} // Update the state when the text input changes
              />
            </View>
            <View style={styles.leftIconParent}>
              <Image
                style={styles.leftIcon}
                contentFit="cover"
                source={require("../assets/-left-icon.png")}
              />
              <Text style={styles.weAllWanna}>
                We all wanna make money, let’s do this
              </Text>
            </View>
          </View>
          {/* <View style={styles.singleLineInput1}>
            <View style={styles.nameWrapper}>
              <Text style={[styles.name, styles.nameTypo]}>Address</Text>
            </View>
            <View style={[styles.field, styles.fieldSpaceBlock]}>
              <TextInput
                style={styles.addressInput}
                placeholder="Nasipit, Talamban, Cebu City, Cebu"
                placeholderTextColor="#c1c1c1"
              />
            </View>
            <View style={styles.leftIconParent}>
              <Image
                style={styles.leftIcon}
                contentFit="cover"
                source={require("../assets/-left-icon.png")}
              />
              <Text style={styles.weAllWanna}>
                We all wanna make money, let’s do this
              </Text>
            </View>
          </View> */}
          <View style={styles.singleLineInput1}>
            <View style={styles.nameWrapper}>
              <Text style={[styles.name, styles.nameTypo]}>Contact Number</Text>
            </View>
            <View style={[styles.field, styles.fieldSpaceBlock]}>
              <TextInput
                style={styles.addressInput}
                placeholder="+63***********"
                placeholderTextColor="#c1c1c1"
                value={textInputPhone}
                onChangeText={(text) => settextInputPhone(text)} // Update the state when the text input changes
              />
            </View>
            <View style={styles.leftIconParent}>
              <Image
                style={styles.leftIcon}
                contentFit="cover"
                source={require("../assets/-left-icon.png")}
              />
              <Text style={styles.weAllWanna}>
                We all wanna make money, let’s do this
              </Text>
            </View>
          </View>
        </View>
        <View style={[styles.bodyInner, styles.bodyInnerSpaceBlock]}>
          <View style={[styles.saveChangesBtnWrapper, styles.buttonFlexBox]}>
            <Pressable
              style={[styles.profile, styles.profileFlexBox]}
              onPress={saveChangesHandle}
            >
              <View style={[styles.button, styles.buttonFlexBox]}>
                <Text style={[styles.button1, styles.button1Typo]}>
                  Save Changes
                </Text>
              </View>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  circularImageContainer: {
    width: 150, // Adjust the width and height as needed for your design
    height: 150,
  },
  circularImage: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  header: {
    backgroundColor: "#1a244d",
  },
  fieldDatePickerPlaceHolder: {
    fontWeight: "500",
    fontFamily: "Georama-Medium",
    color: "#c1c1c1",
    fontSize: 13,
  },
  fieldDatePickerValue: {},
  bodyScrollViewContent: {
    flexDirection: "column",
    paddingHorizontal: 0,
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  viewFlexBox: {
    alignItems: "center",
    flexDirection: "row",
  },
  profileFlexBox: {
    justifyContent: "center",
    alignItems: "center",
  },
  button1Typo: {
    textAlign: "center",
    color: "white",
    fontWeight: "700",
  },
  badgePosition: {
    // zIndex: 2,
    position: "absolute",
    // overflow: "hidden",
  },
  nameTypo: {
    textAlign: "left",
    fontFamily: FontFamily.typographyParagraphSmallMedium,
    fontWeight: "500",
    fontSize: FontSize.typographyTaglineSmallRegular_size,
  },
  bodyInnerSpaceBlock1: {
    paddingHorizontal: Padding.p_3xl,
    marginTop: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  fieldSpaceBlock: {
    paddingVertical: Padding.p_base,
    borderWidth: 1,
    borderStyle: "solid",
    marginTop: 8,
    paddingHorizontal: Padding.p_5xs,
    borderRadius: Border.br_5xs,
    overflow: "hidden",
    alignItems: "center",
    flexDirection: "row",
    alignSelf: "stretch",
  },
  bodyInnerSpaceBlock: {
    paddingVertical: 0,
    alignSelf: "stretch",
  },
  buttonFlexBox: {
    paddingVertical: Padding.p_xl,
    justifyContent: "center",
    alignItems: "center",
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
  frameChild: {
    width: 147,
    height: 147,
    borderRadius: 73.5,
  },
  vectorIcon: {
    height: "100",
    width: "100",
    top: "100",
    right: "100",
    maxWidth: "100%",
    maxHeight: "100%",
  },
  ellipseParent: {
    flexDirection: "row",
  },
  changePicture: {
    color: "#4eb5ff",
  },
  changePictureBtn: {
    marginTop: 15,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  profile: {
    alignSelf: "stretch",
  },
  name: {
    color: Color.colorGray80,
    flex: 1,
  },
  nameWrapper: {
    flexDirection: "row",
    alignSelf: "stretch",
  },
  addressInput: {
    fontFamily: FontFamily.typographyParagraphSmallMedium,
    fontWeight: "500",
    fontSize: FontSize.typographyTaglineSmallRegular_size,
    alignItems: "center",
    flexDirection: "row",
    flex: 1,
  },
  field: {
    borderColor: Color.colorDarkslategray_200,
    marginTop: 8,
  },
  leftIcon: {
    width: 13,
    height: 13,
  },
  weAllWanna: {
    fontFamily: FontFamily.typographyTaglineSmallRegular,
    color: Color.colorGray60,
    marginLeft: 8,
    fontSize: FontSize.level2Medium12_size,
    textAlign: "left",
  },
  leftIconParent: {
    display: "none",
    marginTop: 8,
    flexDirection: "row",
  },
  singleLineInput: {
    alignSelf: "stretch",
  },
  email: {
    color: Color.colorGray50,
    flex: 1,
  },
  field1: {
    borderColor: Color.colorGray50,
    marginTop: 8,
  },
  singleLineInput1: {
    marginTop: 21,
    alignSelf: "stretch",
  },
  vuesaxbrokencalendarIcon: {
    width: 18,
    height: 18,
  },
  leftIcon4: {
    marginLeft: 8,
  },
  field5: {
    marginTop: 8,
  },
  profileSettings: {
    paddingBottom: Padding.p_8xs,
    alignSelf: "stretch",
  },
  button1: {
    fontSize: FontSize.bodyLgBodyLgRegular_size,
    fontFamily: FontFamily.georamaBold,
  },
  button: {
    paddingHorizontal: Padding.p_5xs,
    flexDirection: "row",
    borderRadius: Border.br_5xs,
    paddingVertical: Padding.p_xl,
    backgroundColor: Color.colorDarkslateblue_100,
  },
  saveChangesBtnWrapper: {
    paddingHorizontal: 0,
  },
  bodyInner: {
    paddingHorizontal: Padding.p_3xl,
    marginTop: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  body: {
    backgroundColor: Color.colorWhitesmoke_100,
    alignSelf: "stretch",
    flex: 1,
  },
  editProfile: {
    height: 812,
    width: "100%",
    flex: 1,
    backgroundColor: Color.white,
  },
});

export default EditProfile;

