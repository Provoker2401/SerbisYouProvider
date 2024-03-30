import * as React from "react";
import { useState, useEffect } from 'react';
import { SafeAreaView } from "react-native-safe-area-context";
import { Pressable, StyleSheet, View, Text, ScrollView } from "react-native";
import { Image } from "expo-image";
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useNavigation } from "@react-navigation/native";
import { Color, Padding, FontSize, Border, FontFamily } from "../GlobalStyles";
import { getFirestore, collection, doc, getDoc, getDocs, updateDoc } from 'firebase/firestore';
import { launchImageLibrary } from 'react-native-image-picker';
import { PermissionsAndroid } from 'react-native'; // Import PermissionsAndroid for Android permissions
import * as ImagePicker from "expo-image-picker";
import { app, firebaseConfig } from "../App"; // Update the path as needed

import {
  getStorage,
  ref,
  uploadString,
  getDownloadURL,
  uploadBytes,
} from "firebase/storage";

const ApplicationForm2 = () => {
  const navigation = useNavigation();

  const [idType, setIdType] = useState('');
  const [idProofimgFront, setIdProofimgFront] = useState('');
  const [idProofimgBack, setIdProofimgBack] = useState('');
  const [loading, setLoading] = useState(true); // Initialize loading state as true
  const [provider, setProvider] = useState(null);
  const [imageURI, setImageURI] = useState(null);
  


  const [selectedDocumentType, setSelectedDocumentType] = useState(null);

  useEffect(() => {
    const auth = getAuth();

    (async () => {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        alert("Permission to access the camera roll is required!");
      }
    })();

    const unsubscribe = onAuthStateChanged(auth, async (currentProvider) => {
      if (!currentProvider) {
        setLoading(false);
        return;
      }

      setProvider(currentProvider);

      try {
        const email = currentProvider.email;
        //setEmail(email);

        // Fetch the user's profile image based on their UID
       // fetchProfileImage(currentUser.uid);

        const db = getFirestore();
        const providerProfilesCollection = collection(db, "providerProfiles");
        const providerDocRef = doc(providerProfilesCollection, currentProvider.uid);
        const providerDocSnapshot = await getDoc(providerDocRef);

        if (providerDocSnapshot.exists()) {
          const providerData = providerDocSnapshot.data();
          const appForm2Ref = collection(providerDocRef, 'appForm2');
          const appForm2Snapshot = await getDocs(appForm2Ref);

          if (!appForm2Snapshot.empty) {
            // Assuming that there's only one document in 'appForm2'
            const appForm2Data = appForm2Snapshot.docs[0].data();
            const appForm2Id = appForm2Snapshot.docs[0].id;
            setIdType(appForm2Data.idType);
            setIdProofimgFront(appForm2Data.idProofimgFront);
            setIdProofimgBack(appForm2Data.idProofimgBack);

          }
          setLoading(false);
          // console.log("User UID:", currentUser.uid);
        } else {
          console.log("No user data found for the given UID.");
          setLoading(false);
        }
      } catch (error) {
        console.error("Error retrieving user data:", error);
        setLoading(false);
      }
    });

    return unsubscribe;

  }, []);


  const handleDocumentTypeSelect = (documentType) => {
    setIdType(documentType);
    
    //console.log(selectedDocumentType);
  };
  
  console.log(idType); // Log the selected document type
  
  
  //setIdType(id);
  const fetchProviderData = async () => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (currentProvider) => {
      if (!currentProvider) {
        setLoading(false);
        return;
      }

      setProvider(currentProvider);

      try {
        const email = currentProvider.email;
        //setEmail(email);

        // Fetch the user's profile image based on their UID
       // fetchProfileImage(currentUser.uid);

        const db = getFirestore();
        const providerProfilesCollection = collection(db, "providerProfiles");
        const providerDocRef = doc(providerProfilesCollection, currentProvider.uid);
        const providerDocSnapshot = await getDoc(providerDocRef);

        if (providerDocSnapshot.exists()) {
          const providerData = providerDocSnapshot.data();
          const appForm2Ref = collection(providerDocRef, 'appForm2');
          const appForm2Snapshot = await getDocs(appForm2Ref);

          if (!appForm2Snapshot.empty) {
            // Assuming that there's only one document in 'appForm2'
            const appForm2Data = appForm2Snapshot.docs[0].data();
            const appForm2Id = appForm2Snapshot.docs[0].id;
            setIdType(appForm2Data.idType);
            setIdProofimgFront(appForm2Data.idProofimgFront);
            setIdProofimgBack(appForm2Data.idProofimgBack);

          }
          setLoading(false);
          // console.log("User UID:", currentUser.uid);
        } else {
          console.log("No user data found for the given UID.");
          setLoading(false);
        }
      } catch (error) {
        console.error("Error retrieving user data:", error);
        setLoading(false);
      }
    });

    return unsubscribe;
  };

  const saveChangesHandle = async () => {
    try {
      // Create a reference to the Firestore database using your app instance
      const db = getFirestore();

      // Create references to the user's document and the appForm2 subcollection
      const userDocRef = doc(db, 'providerProfiles', provider.uid);
      const appForm2Ref = collection(userDocRef, 'appForm2');

      // Query the appForm2 subcollection to get the first document
      const appForm2Snapshot = await getDocs(appForm2Ref);
      const appForm2Doc = appForm2Snapshot.docs[0];

      if (appForm2Doc) {
        // Update the idType field within the appForm2 document
        await updateDoc(appForm2Doc.ref, {
          idType: idType,
        });

        console.log('idType updated successfully:', idType);
      } else {
        console.error('No appForm2 document found for the current user.');
      }
    } catch (error) {
      console.error('Error updating user data:', error);
      // Handle the error, e.g., display an error message to the user
    }
  };
  const pickImageFront = async () => {
    
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      
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
      const storageRef = ref(storage, `ProviderIDPicsFront/${provider.uid}`);

      try {

        
        // Read the image file as a blob
        const response = await fetch(selectedImageURI);
        const blob = await response.blob();

        // Upload the image blob to Firebase Storage
        const snapshot = await uploadBytes(storageRef, blob);

        // Get the download URL of the uploaded image
        const downloadURL = await getDownloadURL(snapshot.ref);

         // Now you can use `downloadURL` to update the Firestore document in appForm2
      const db = getFirestore();

      // Create references to the user's document and the appForm2 subcollection
      const userDocRef = doc(db, 'providerProfiles', provider.uid);
      const appForm2Ref = collection(userDocRef, 'appForm2');

      // Query the appForm2 subcollection to get the first document
      const appForm2Snapshot = await getDocs(appForm2Ref);
      const appForm2Doc = appForm2Snapshot.docs[0];

      if (appForm2Doc) {
        // Update the idProofimgFront field within the appForm2 document
        await updateDoc(appForm2Doc.ref, {
          idProofimgFront: downloadURL,
        });

        console.log("FRONT uploaded successfully:", downloadURL);
      } else {
        console.error("No appForm2 document found for the current user.");
      }
    } catch (error) {
      console.error("Error uploading image to Firebase Storage:", error);
    }
  }
};

  const pickImageBack = async () => {
     
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      
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
      const storageRef = ref(storage, `ProviderIDPicsBack/${provider.uid}`);

      try {

        
        // Read the image file as a blob
        const response = await fetch(selectedImageURI);
        const blob = await response.blob();

        // Upload the image blob to Firebase Storage
        const snapshot = await uploadBytes(storageRef, blob);

        // Get the download URL of the uploaded image
        const downloadURL = await getDownloadURL(snapshot.ref);

         // Now you can use `downloadURL` to update the Firestore document in appForm2
      const db = getFirestore();

      // Create references to the user's document and the appForm2 subcollection
      const userDocRef = doc(db, 'providerProfiles', provider.uid);
      const appForm2Ref = collection(userDocRef, 'appForm2');

      // Query the appForm2 subcollection to get the first document
      const appForm2Snapshot = await getDocs(appForm2Ref);
      const appForm2Doc = appForm2Snapshot.docs[0];

      if (appForm2Doc) {
        // Update the idProofimgFront field within the appForm2 document
        await updateDoc(appForm2Doc.ref, {
          idProofimgBack: downloadURL,
        });

        console.log("FRONT uploaded successfully:", downloadURL);
      } else {
        console.error("No appForm2 document found for the current user.");
      }
    } catch (error) {
      console.error("Error uploading image to Firebase Storage:", error);
    }
  }
  };

  return (
    <View style={[styles.applicationForm2, styles.applicationForm2Bg]}>
      <ScrollView
        style={styles.frame}
        showsVerticalScrollIndicator={true}
        showsHorizontalScrollIndicator={true}
        contentContainerStyle={styles.frameScrollViewContent}
      >
        <View style={[styles.componentsserviceList, styles.applicationForm2Bg]}>
          <View
            style={[
              styles.personalDetailsFrameParent,
              styles.componentsbutton7SpaceBlock,
            ]}
          >
            <Pressable style={styles.personalDetailsFrame}>
              <Text style={[styles.personalDetails, styles.detailsTypo]}>
                Personal Details
              </Text>
              <View
                style={[
                  styles.componentsbutton,
                  styles.componentsbuttonSpaceBlock1,
                ]}
              >
                <Text style={[styles.viewAllServices, styles.viewTypo]} />
              </View>
            </Pressable>
            <Pressable style={styles.idProofFrame}>
              <Text style={[styles.idProof, styles.detailsTypo]}>ID Proof</Text>
              <View
                style={[
                  styles.componentsbutton,
                  styles.componentsbuttonSpaceBlock1,
                ]}
              >
                <Text style={[styles.viewAllServices, styles.viewTypo]} />
              </View>
            </Pressable>
            <Pressable style={styles.idProofFrame}>
              <Text style={[styles.serviceDetails, styles.serviceDetailsTypo]}>
                Service Details
              </Text>
              <View
                style={[
                  styles.componentsbutton2,
                  styles.componentsbuttonSpaceBlock1,
                ]}
              >
                <Text style={[styles.viewAllServices, styles.viewTypo]} />
              </View>
            </Pressable>
          </View>
          <View style={styles.frameParent}>
            <View style={styles.chooseDocumentTypeWrapper}>
              <Text
                style={[styles.chooseDocumentType, styles.uploadIdProofTypo]}
              >
                Choose Document Type
              </Text>
            </View>
            <View style={styles.frameGroup}>
              <View style={styles.chooseDocumentTypeWrapper}>
              <Pressable
              
              style={[
                
                styles.componentsbuttonSpaceBlock,
                idType === "Driver's License"
               
                  ? styles.componentsbutton4
                  : null
              ]}
              onPress={() => handleDocumentTypeSelect("Driver's License")}
            >
              <Text style={[styles.viewAllServices3, styles.viewTypo]}>
                Driver’s License
              </Text>
            </Pressable>
            <Pressable
              style={[
                
                styles.componentsbuttonSpaceBlock69,
                idType === "NationalID"
                  ? styles.componentsbutton69
                  : null
              ]}
              onPress={() => handleDocumentTypeSelect("NationalID")}
            >
              <Text style={[styles.viewAllServices3, styles.viewTypo]}>
                National I.D.
              </Text>
            </Pressable>
          </View>
          <View style={styles.componentsbuttonGroup}>
            <Pressable
              style={[
                styles.componentsbuttonSpaceBlock,
                idType === "Passport"
                  ? styles.componentsbutton4
                  : null
              ]}
              onPress={() => handleDocumentTypeSelect("Passport")}
            >
              <Text style={[styles.viewAllServices3, styles.viewTypo]}>
                Passport
              </Text>
            </Pressable>
            <Pressable
              style={[
               
                styles.componentsbuttonSpaceBlock69,
                idType === "Other"
                  ? styles.componentsbutton69
                  : null
              ]}
              onPress={() => handleDocumentTypeSelect("Other")}
            >
              <Text style={[styles.viewAllServices3, styles.viewTypo]}>
                Other
              </Text>
            </Pressable>
              </View>
            </View>
          </View>
          <View style={styles.frameContainer}>
            <View style={styles.uploadIdProofParent}>
              <Text style={styles.uploadIdProofTypo}>Upload ID Proof</Text>
              <Text style={[styles.putYourDocument, styles.serviceDetailsTypo]}>
                Put your document on a plain clean surface and make sure
                important details such as name and age are visible.
              </Text>
            </View>
            <View style={styles.frameView}>
              <View style={styles.componentsbuttonWrapper}>
                <Pressable
                  style={[styles.componentsbutton7, styles.componentsbuttonBg]}
                  onPress={pickImageFront} // Open image picker for the front
                >
                  <View style={styles.componentsbuttonWrapper}>
                    <Image
                      style={styles.image2356Icon}
                      contentFit="cover"
                      source={require("../assets/image-2356.png")}
                    />
                  </View>
                  <View style={styles.frontWrapper}>
                    <Text style={[styles.front, styles.viewTypo]}>Front</Text>
                  </View>
                </Pressable>
              </View>
              <View style={styles.componentsbuttonContainer}>
                <Pressable
                  style={[styles.componentsbutton7, styles.componentsbuttonBg]}
                  onPress={pickImageBack} // Open image picker for the back
                >
                  <View style={styles.componentsbuttonWrapper}>
                    <Image
                      style={styles.image2356Icon}
                      contentFit="cover"
                      source={require("../assets/image-2356.png")}
                    />
                  </View>
                  <View style={styles.frontWrapper}>
                    <Text style={[styles.front, styles.viewTypo]}>Back</Text>
                  </View>
                </Pressable>
              </View>
            </View>
          </View>
          <View style={styles.componentsbuttonFrame}>
            <Pressable
              style={[
                styles.componentsbutton10,
                styles.componentsbuttonSpaceBlock2,
              ]}
              onPress={saveChangesHandle}
            >
              <Text style={[styles.viewAllServices7, styles.viewTypo]}>
                Next
              </Text>
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
  frameScrollViewContent: {
    flexDirection: "column",
    paddingHorizontal: 0,
    paddingVertical: 20,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  applicationForm2Bg: {
    backgroundColor: Color.m3White,
    alignItems: "center",
  },
  componentsbutton7SpaceBlock: {
    paddingVertical: Padding.p_3xs,
    paddingHorizontal: 0,
    alignSelf: "stretch",
  },
  detailsTypo: {
    textAlign: "left",
    fontSize: FontSize.typographyTaglineSmallRegular_size,
  },
  componentsbuttonSpaceBlock1: {
    marginTop: 8,
    height: 14,
    width: 91,
    paddingVertical: Padding.p_xs,
    paddingHorizontal: Padding.p_3xl,
    borderRadius: Border.br_5xs,
    flexDirection: "row",
  },
  viewTypo: {
    color: Color.neutral01,
    letterSpacing: -0.1,
    textAlign: "center",
    fontFamily: FontFamily.title2Bold32,
    fontWeight: "700",
  },
  serviceDetailsTypo: {
    color: Color.colorGray_100,
    fontFamily: FontFamily.levelSemibold14,
    fontWeight: "600",
    letterSpacing: -0.3,
  },
  uploadIdProofTypo: {
    letterSpacing: -0.4,
    textAlign: "left",
    color: Color.neutral07,
    fontFamily: FontFamily.levelSemibold14,
    fontWeight: "600",
    fontSize: FontSize.title3Bold20_size,
  },
  componentsbuttonSpaceBlock2: {
    paddingVertical: Padding.p_xs,
    paddingHorizontal: Padding.p_3xl,
    flexDirection: "row",
  },
  componentsbuttonSpaceBlock: {
    marginRight: 30,
    backgroundColor: Color.colorDarkslateblue_300,
    paddingVertical: Padding.p_xs,
    paddingHorizontal: Padding.p_3xl,
    borderRadius: Border.br_5xs,
    flexDirection: "row",
    flex: 1,
  },
  componentsbuttonSpaceBlock69: {
    marginLeft: 30,
    backgroundColor: Color.colorDarkslateblue_300,
    paddingVertical: Padding.p_xs,
    paddingHorizontal: Padding.p_3xl,
    borderRadius: Border.br_5xs,
    flexDirection: "row",
    flex: 1,
  },
  componentsbuttonBg: {
    backgroundColor: Color.colorSteelblue,
    borderRadius: Border.br_5xs,
  },
  personalDetails: {
    color: Color.neutral07,
    textAlign: "left",
    fontFamily: FontFamily.levelSemibold14,
    fontWeight: "600",
    letterSpacing: -0.3,
  },
  viewAllServices: {
    lineHeight: 24,
    color: Color.neutral01,
    letterSpacing: -0.1,
    fontSize: FontSize.paragraphMedium15_size,
  },
  componentsbutton: {
    backgroundColor: Color.colorDarkslateblue_200,
  },
  personalDetailsFrame: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  idProof: {
    color: Color.colorDarkslateblue_200,
    fontFamily: FontFamily.levelSemibold14,
    fontWeight: "600",
    letterSpacing: -0.3,
    textAlign: "left",
  },
  idProofFrame: {
    marginLeft: 10,
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  serviceDetails: {
    textAlign: "left",
    fontSize: FontSize.typographyTaglineSmallRegular_size,
  },
  componentsbutton2: {
    backgroundColor: Color.colorLightgray_100,
  },
  personalDetailsFrameParent: {
    overflow: "hidden",
    justifyContent: "center",
    flexDirection: "row",
    alignItems: "center",
  },
  chooseDocumentType: {
    flex: 1,
  },
  chooseDocumentTypeWrapper: {
    flexDirection: "row",
    alignSelf: "stretch",
  },
  viewAllServices3: {
    lineHeight: 24,
    color: Color.neutral01,
    letterSpacing: -0.1,
    fontSize: FontSize.typographyTaglineSmallRegular_size,
    flex: 1,
  },
  componentsbutton4: {
    marginRight: 30,
    backgroundColor: Color.colorDarkslateblue_200,
    paddingVertical: Padding.p_xs,
    paddingHorizontal: Padding.p_3xl,
    borderRadius: Border.br_5xs,
    flexDirection: "row",
    flex: 1,
  },

  componentsbutton69: {
    marginLeft: 30,
    backgroundColor: Color.colorDarkslateblue_200,
    paddingVertical: Padding.p_xs,
    paddingHorizontal: Padding.p_3xl,
    borderRadius: Border.br_5xs,
    flexDirection: "row",
    flex: 1,
  },

  componentsbutton6: {
    marginLeft: 30,
  },
  componentsbuttonGroup: {
    marginTop: 30,
    flexDirection: "row",
    alignSelf: "stretch",
  },
  frameGroup: {
    marginTop: 13,
    alignSelf: "stretch",
  },
  frameParent: {
    marginTop: 20,
    alignSelf: "stretch",
  },
  putYourDocument: {
    textAlign: "justify",
    width: 320,
    marginTop: 20,
    fontSize: FontSize.paragraphMedium15_size,
  },
  uploadIdProofParent: {
    justifyContent: "center",
    alignSelf: "stretch",
    alignItems: "center",
  },
  image2356Icon: {
    borderRadius: Border.br_46xl,
    width: 142,
    height: 85,
  },
  componentsbuttonWrapper: {
    alignItems: "center",
  },
  front: {
    lineHeight: 15,
    color: Color.neutral01,
    letterSpacing: -0.1,
    fontSize: FontSize.typographyTaglineSmallRegular_size,
    flex: 1,
  },
  frontWrapper: {
    paddingBottom: Padding.p_3xs,
    justifyContent: "center",
    flexDirection: "row",
    alignSelf: "stretch",
  },
  componentsbutton7: {
    paddingVertical: Padding.p_3xs,
    paddingHorizontal: 0,
    alignSelf: "stretch",
  },
  componentsbuttonContainer: {
    marginLeft: 30,
    alignItems: "center",
  },
  frameView: {
    marginTop: 10,
    justifyContent: "center",
    flexDirection: "row",
    alignSelf: "stretch",
    alignItems: "center",
  },
  frameContainer: {
    marginTop: 20,
    justifyContent: "center",
    alignSelf: "stretch",
    alignItems: "center",
  },
  viewAllServices7: {
    lineHeight: 24,
    color: Color.neutral01,
    letterSpacing: -0.1,
    fontSize: FontSize.paragraphMedium15_size,
    flex: 1,
  },
  componentsbutton10: {
    backgroundColor: Color.colorDarkslategray_600,
    borderRadius: Border.br_5xs,
    alignSelf: "stretch",
  },
  componentsbuttonFrame: {
    paddingTop: 91,
    marginTop: 20,
    justifyContent: "center",
    alignSelf: "stretch",
    alignItems: "center",
  },
  componentsserviceList: {
    padding: Padding.p_base,
    borderRadius: Border.br_5xs,
    justifyContent: "center",
    alignSelf: "stretch",
    alignItems: "center",
  },
  frame: {
    alignSelf: "stretch",
    flex: 1,
  },
  applicationForm2: {
    height: 812,
    alignItems: "center",
    width: "100%",
    flex: 1,
  },
});

export default ApplicationForm2;

