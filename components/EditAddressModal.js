import * as React from "react";
import {
  StatusBar,
  StyleSheet,
  Pressable,
  View,
  Text,
  TextInput,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { Image } from "expo-image";
import { useState, useContext, useMemo } from "react";
import { useNavigation } from "@react-navigation/native";
import { Padding, Border, FontFamily, Color, FontSize } from "../GlobalStyles";
import { useAddAddressContext } from "../AddAddressContext";
import { AddressSelectedContext } from "../AddressSelectedContext";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  addDoc,
  updateDoc,
  collection, // Import getDoc for checking if a user with the same phone number exists
} from "firebase/firestore";
import { getAuth} from "firebase/auth";
import Toast from "react-native-toast-message";

let optionsLength = 0;
let currentLocationLength = 0;
let updatedOptionsArr = { savedOptions: [] };
let updatedCurrentLocationArr = { currentLocation: [] };
let combinedData = { savedOptions: [] };

let updatedLabelInput = "";

const getStyleValue = (key, value) => {
  if (value === undefined) return;
  return { [key]: value === "unset" ? undefined : value };
};

export default function EditAddressModal({
  selectedLocation,
  selectedCity,
  selectedLabel,
  selectedValue,
  selectedCoordinates,
  editAddress,
  body,
  name,
  btnName,
  checkMarkerChange,
  noInputDefaultPosition,
  noInputDefaultZIndex,
  cityAddress,
  specificLocation,
  addedFlag,
  addedSpecificLocation,
  addedCoordinates,
  addedCityAddress,
  visible,
  onClose,
}) {
  const navigation = useNavigation();
  const [searchModal, setSearchModal] = useState(false);
  const [confirmAdd, setConfirmAdd] = useState(false);
  const [added, setAdded] = useState(addedFlag);

  const { setAddAddressData } = useAddAddressContext();
  // const { setCurrentFocus } = useContext(AddressSelectedContext);

  //handle text inputs
  const [textInputLabel, setTextInputLabel] = useState(selectedLabel || "");
  
  const [addFlag, setAddFlag] = useState(true);

  const [showLabel, setshowLabel] = useState(false);

  const [editLocationVisible, setEditLocationVisible] = useState(true);

  const noInputDefaultStyle = useMemo(() => {
    return {
      ...getStyleValue("position", noInputDefaultPosition),
      ...getStyleValue("zIndex", noInputDefaultZIndex),
    };
  }, [noInputDefaultPosition, noInputDefaultZIndex]);

  const handleInputChange = (identifier, text) => {
    switch (identifier) {
      case 'label':
        if (text.length <= 300) {
          setTextInputLabel(text);
        }
        break;
      default:
        console.log("Error changing the text input");
        break;
    }
  };

  const handleAddToList = async () => {
    console.log("This is pressed!");

    console.log("Label:", textInputLabel);

    // Check if label is undefined before proceeding
    if (textInputLabel !== undefined && textInputLabel !== "" ) {
      try {
        // Initialize Firestore and reference the 'userProfiles' collection
        const db = getFirestore();

        // Get the user's UID
        const auth = getAuth();
        const user = auth.currentUser.uid;
        console.log(user);

        // Reference to the "manageAddress" collection for the specified userUID
        const manageAddressCollectionRef = collection(
          db,
          "providerProfiles",
          user,
          "manageAddress"
        );

        const dataToAdd = {
          address: added
            ? addedSpecificLocation
            : checkMarkerChange
            ? specificLocation
            : selectedLocation,
          city: added ? addedCityAddress : cityAddress,
          coordinates: addedCoordinates,
          label: textInputLabel,
        };

        // Add the second document named "savedOptions"
        const currentLocationDocRef = doc(
          manageAddressCollectionRef,
          "currentLocation"
        );
        const savedOptionsDocRef = doc(
          manageAddressCollectionRef,
          "savedOptions"
        );

        const newDocRef = await addDoc(manageAddressCollectionRef, dataToAdd);
        console.log("First Document written with ID: ", newDocRef.id);

        getDoc(currentLocationDocRef)
          .then(async (docSnapshot) => {
            if (docSnapshot.exists()) {
              const currentLocationDocument = docSnapshot.data();
              console.log(
                "Current Location Document: ",
                currentLocationDocument
              ); // Log the entire fetched data

              // Check if "savedOptions" is an array and has at least one item
              if (
                Array.isArray(currentLocationDocument.currentLocation) &&
                currentLocationDocument.currentLocation.length > 0
              ) {
                // This code segment needs to be updated
                currentLocationLength = currentLocationDocument.currentLocation.length;
                updatedCurrentLocationArr.currentLocation = currentLocationDocument.currentLocation;
                console.log("No document is found");
              } else {
                updatedCurrentLocationArr.currentLocation = [dataToAdd];
                console.log("No document is found yet 1");
                const newDocRef = await setDoc(currentLocationDocRef, dataToAdd);
                console.log("First Document written with ID: ", newDocRef.id);
              }
            } else {
              // Add a new document with an auto-generated ID
              console.log("No document is found yet 2");
              const newDocRef = await addDoc(currentLocationDocRef, dataToAdd);
              console.log("First Document written with ID: ", newDocRef.id);
            }
          })
          .catch((error) => {
            console.error("Error getting document:", error);
          });

        getDoc(savedOptionsDocRef)
          .then(async (docSnapshot) => {
            if (docSnapshot.exists()) {
              const optionsData = docSnapshot.data();
              console.log("Saved Options Data: ", optionsData); // Log the entire fetched data

              // Check if "savedOptions" is an array and has at least one item
              if (
                Array.isArray(optionsData.savedOptions) &&
                optionsData.savedOptions.length > 0
              ) {
                const firstOption = optionsData.savedOptions[0]; // Access the first option
                const savedOptionsLength = optionsData.savedOptions.length;
                console.log("First Current Loc: ", firstOption);
                console.log("Updated Current loc: ", updatedCurrentLocationArr.currentLocation);

                // Create a temporary array for the fetched savedOptions
                updatedOptionsArr.savedOptions = optionsData.savedOptions;

                const tempData = [
                  {
                    address: added
                      ? addedSpecificLocation
                      : checkMarkerChange
                      ? specificLocation
                      : selectedLocation,
                    city: added ? addedCityAddress : cityAddress,
                    label: textInputLabel,
                    coordinates: addedCoordinates,
                    value: savedOptionsLength + 1,
                  },
                ];

                const firstData = optionsData.savedOptions[0];

                if (
                  Array.isArray(updatedCurrentLocationArr.currentLocation) &&
                  updatedCurrentLocationArr.currentLocation.length > 0
                ) {
                  const firstCurrentLoc = updatedCurrentLocationArr.currentLocation[0]; // Access the first option
                  console.log("Daan:", firstData);
                  console.log("Bago:", firstCurrentLoc);
                  if (firstData.address != firstCurrentLoc.address) {
                    const remainingOptions = updatedOptionsArr.savedOptions.slice(1);
                    combinedData = {
                      savedOptions: [
                        firstCurrentLoc,
                        ...remainingOptions,
                        ...tempData,
                      ],
                    };
                    await setDoc(savedOptionsDocRef, combinedData);
                    console.log(
                      "Selected address is not the same with current Location"
                    );
                  } else {
                    updatedOptionsArr = {
                      savedOptions: [
                        ...updatedOptionsArr.savedOptions,
                        ...tempData,
                      ],
                    };
                    await setDoc(savedOptionsDocRef, updatedOptionsArr);
                    console.log(
                      "Selected address is the same with current Location"
                    );
                  }
                } else {
                  console.log(
                    "No document is found in current Location Document!"
                  );
                }
              } else if (
                Array.isArray(optionsData.savedOptions) &&
                optionsData.savedOptions.length == 0
              ) {
                optionsLength = optionsData.savedOptions.length;

                const firstCurrentLoc = updatedCurrentLocationArr.currentLocation[0]; // Access the first option
                console.log("First Current Loc: ", firstCurrentLoc);
                const tempData = [
                  {
                    address: added
                      ? addedSpecificLocation
                      : checkMarkerChange
                      ? specificLocation
                      : selectedLocation,
                    city: added ? addedCityAddress : cityAddress,
                    label: textInputLabel,
                    coordinates: addedCoordinates,
                    value: optionsLength + 2,
                  },
                ];

                updatedOptionsArr.savedOptions = [firstCurrentLoc];

                updatedOptionsArr = {
                  savedOptions: [
                    ...updatedOptionsArr.savedOptions,
                    ...tempData,
                  ],
                };
                await setDoc(savedOptionsDocRef, updatedOptionsArr);
                console.log(
                  "Saved Options is empty!"
                );
              } else{
                const firstCurrentLoc = updatedCurrentLocationArr.currentLocation[0]; // Access the first option
                console.log("First Current Location: " + firstCurrentLoc);
                const tempData = [
                  {
                    address: added
                      ? addedSpecificLocation
                      : checkMarkerChange
                      ? specificLocation
                      : selectedLocation,
                    city: added ? addedCityAddress : cityAddress,
                    label: textInputLabel,
                    coordinates: addedCoordinates,
                    value: optionsLength + 2,
                  },
                ];
                if(firstCurrentLoc != undefined) {
                  updatedOptionsArr.savedOptions = [firstCurrentLoc];
                  updatedOptionsArr = {
                    savedOptions: [...updatedOptionsArr.savedOptions, ...tempData],
                  };
                  console.log("Updated Options: " + updatedOptionsArr);
                  await setDoc(savedOptionsDocRef, updatedOptionsArr);
                }else{
                  updatedOptionsArr = {
                    savedOptions: tempData,
                  };
                  console.log("tempData: " + updatedOptionsArr);
                  await setDoc(savedOptionsDocRef, updatedOptionsArr);
                }
              }
            } else {
              const firstCurrentLoc = updatedCurrentLocationArr.currentLocation[0]; // Access the first option
              console.log("First Current Location: " + firstCurrentLoc);
              const tempData = [
                {
                  address: added
                    ? addedSpecificLocation
                    : checkMarkerChange
                    ? specificLocation
                    : selectedLocation,
                  city: added ? addedCityAddress : cityAddress,
                  label: textInputLabel,
                  coordinates: addedCoordinates,
                  value: optionsLength + 2,
                },
              ];

              updatedOptionsArr.savedOptions = [firstCurrentLoc];
              updatedOptionsArr = {
                savedOptions: [...updatedOptionsArr.savedOptions, ...tempData],
              };
              console.log("Updated Options: " + updatedOptionsArr);
              await setDoc(savedOptionsDocRef, updatedOptionsArr);
            }
          })
          .catch((error) => {
            console.error("Error getting document:", error);
          });
          Toast.show({
            type: "success",
            position: "top",
            text1: "Address Added Successfully✅",
            text2: "Address is now added in your Saved Locations",
            visibilityTime: 5000,
          });
          setAddAddressData({
            addressValue: added
              ? addedSpecificLocation
              : checkMarkerChange
              ? specificLocation
              : selectedLocation,
            city: added ? addedCityAddress : cityAddress,
            labelValue: textInputLabel,
            addValue: addFlag,
            selectedIDValue: newDocRef.id,
          });
      } catch (error) {
        console.error("Add a new address error:", error);

        Toast.show({
          type: "error",
          position: "top",
          text1: "Error",
          text2: error.message || "An error occurred while adding",
          visibilityTime: 5000,
        });
      }
      navigation.navigate("Homepage");
      onClose();
    } else {
      Toast.show({
        type: "error",
        position: "top",
        text1: "Label Error",
        text2: "Please add a label❗",
        visibilityTime: 5000,
      });
    }
  };

  const handleAdd = () => {
    setConfirmAdd(true);

    navigation.navigate("EditAddressIconComplete", {
      checkMarkerChange: checkMarkerChange,
      addedCityAddress: cityAddress,
      addedSpecificLocation: specificLocation,
      addedCoordinates: selectedCoordinates,
      addedFlag: confirmAdd,
    });
  };

  const handleEdit = () => {
    if (textInputLabel != "") {
      updatedLabelInput = textInputLabel;
    } else {
      updatedLabelInput = selectedLabel;
    }

    (async () => {
      try {
        // Initialize Firestore and reference the 'providerProfiles' collection
        const db = getFirestore();

        // Get the user's UID
        const auth = getAuth();
        const user = auth.currentUser.uid;
        console.log(user);

        const savedOptionsDocRef = doc(
          db,
          "providerProfiles",
          user,
          "manageAddress",
          "savedOptions",
        );

        const updatedData = {
          address: selectedLocation,
          city: selectedCity,
          label: updatedLabelInput || "", // Set default value to an empty string if undefined
          coordinates: selectedCoordinates,
          value: selectedValue,
        };

        getDoc(savedOptionsDocRef)
          .then(async (docSnapshot) => {
            if (docSnapshot.exists()) {
              const optionsData = docSnapshot.data();
              console.log("Saved Options Data: ", optionsData); // Log the entire fetched data

              const selectedSavedOption =
                optionsData.savedOptions[selectedValue - 1];
              console.log("Selected Saved Option: ", selectedSavedOption);

              optionsData.savedOptions[selectedValue - 1] = updatedData;
              console.log("Updated optionsData: ", optionsData.savedOptions);

              // Update the document with the modified array
              await updateDoc(savedOptionsDocRef, {
                savedOptions: optionsData.savedOptions,
              });
              Toast.show({
                type: "success",
                position: "top",
                text1: "Address Edited Successfully✅",
                text2: "Address is now updated in your Saved Locations",
                visibilityTime: 5000,
              });

              navigation.navigate("Homepage");
            } else {
              Toast.show({
                type: "error",
                position: "top",
                text1: "Address does not Exist❗",
                text2: "Address is not found in your Saved Locations",
                visibilityTime: 5000,
              });
            }
          })
          .catch((error) => {
            Toast.show({
              type: "error",
              position: "top",
              text1: "Address does not Exist❗",
              text2: "Address is not found in your Saved Locations",
              visibilityTime: 5000,
            });
          });
      } catch (error) {
        console.error("Edit address error:", error);

        Toast.show({
          type: "error",
          position: "top",
          text1: "Error",
          text2: error.message || "An error occurred while editing",
          visibilityTime: 5000,
        });
      }
    })();
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={[styles.editAddressModal, noInputDefaultStyle,]}>
        {!searchModal && (
          <View style={styles.frameGroup}>
            <View style={styles.frameContainer}>
              <View style={styles.frameFlexBox1}>
                <View style={[styles.vectorWrapper1, styles.btnWrapperFlexBox]}>
                  <Image
                    style={styles.frameChild}
                    contentFit="cover"
                    source={require("../assets/line-76.png")}
                  />
                </View>
              </View>
              {editAddress && (
                <View
                  style={[styles.editYourAddressWrapper, styles.wrapperFlexBox]}
                >
                  <Text style={[styles.editYourAddress, styles.addALabelFlexBox]}>
                    {name}
                  </Text>
                </View>
              )}
            </View>
            <Pressable
              style={[styles.editBtn, styles.frameSpaceBlock]}
              onPress={() => {
                if (!body) {
                  setSearchModal(true);
                }
              }}
            >
              <View
                style={[styles.componentsSearchDefault, styles.componentsFlexBox]}
              >
                <View style={styles.iconOutline}>
                  <Image
                    style={styles.locationIcon}
                    contentFit="cover"
                    source={require("../assets/location-icon1.png")}
                  />
                </View>
                <View style={styles.barangayNasipitTalambanCeParent}>
                  <Text style={[styles.barangayNasipitTalamban, styles.homeTypo]}>
                    {added
                      ? addedSpecificLocation
                      : checkMarkerChange
                      ? specificLocation
                      : selectedLocation}

                    {console.log(
                      added
                        ? "Added in the box: " + addedSpecificLocation
                        : checkMarkerChange
                        ? "Marker Changed in the box : " + specificLocation
                        : "Selected in the box: " + selectedLocation
                    )}
                  </Text>
                  <Text style={[styles.cebu, styles.cebuClr]}>
                    {added
                      ? addedCityAddress
                      : selectedCity
                      ? selectedCity
                      : cityAddress}
                  </Text>
                </View>
              </View>
            </Pressable>
            {body && (
              <View style={[styles.frameView, styles.frameSpaceBlock1]}>
                <View
                  style={[
                    styles.deliveryInstructionsFrame,
                    styles.frameSpaceBlock1,
                  ]}
                >
                  <View style={styles.streetFrame}>
                    <Text style={[styles.addALabel, styles.addALabelTypo]}>
                      Add a label
                    </Text>
                  </View>
                </View>
                <View style={styles.frameSpaceBlock}>
                  <View
                    style={[
                      styles.componentsSearchDefault1,
                      styles.componentsFlexBox,
                    ]}
                  >
                    <TextInput
                      style={[styles.noteInput, styles.textTypo]}
                      placeholder="Add a label"
                      placeholderTextColor="#b8b8b8"
                      onChangeText={(text) => handleInputChange('label', text)}
                      value={textInputLabel} 
                      maxLength={300} 
                    />
                  </View>
                  <View style={styles.wrapper}>
                    <Text style={[styles.text, styles.textTypo]}>{textInputLabel.length}/300</Text>
                  </View>
                </View>
              </View>
            )}
            {editLocationVisible == true && (
              <View style={[styles.frameView, styles.frameSpaceBlock]}>
                <Pressable
                  style={styles.componentsbutton}
                  onPress={
                    name === "Edit your address"
                      ? handleEdit
                      : added
                      ? handleAddToList
                      : handleAdd
                  }
                >
                  <Text style={[styles.viewAllServices, styles.addALabelTypo]}>
                    {btnName}
                  </Text>
                </Pressable>
              </View>
            )}
          </View>
        )}
      </View>
    </TouchableWithoutFeedback>

  );
}

const styles = StyleSheet.create({
  // Search Address Styles
  editLocationContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "white",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 8,
    flexDirection: "column",
    alignItems: "stretch",
    height: 400,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  editIcon: {
    width: 16,
    height: 16,
  },
  centeredImageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  centeredImageTextContainer: {
    alignItems: "center",
  },
  centeredImage: {
    marginBottom: 10,
    width: 100,
    height: 100,
    resizeMode: "contain",
  },
  exploreText: {
    fontSize: 14,
    marginTop: 10,
  },

  searchAdddresModal: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "white",
    paddingVertical: 16,
    borderRadius: 8,
    flexDirection: "column",
    alignSelf: "center",
    alignItems: "stertch",
  },
  frameGroup1: {
    borderTopLeftRadius: Border.br_5xl,
    borderTopRightRadius: Border.br_5xl,
    overflow: "hidden",
    alignSelf: "stretch",
    alignItems: "center",
    backgroundColor: Color.m3White,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingTop: 5,
    flexDirection: "column",
    flex: 1,
    zIndex: 5,
  },
  frameFlexBox: {
    paddingTop: Padding.p_5xs,
    height: 8,
    justifyContent: "center",
    alignSelf: "stretch",
  },
  frameFlexBox1: {
    height: 8,
  },
  vectorWrapper1: {
    alignSelf: "stretch",
  },
  btnWrapperFlexBox: {
    justifyContent: "center",
    alignItems: "center",
  },
  frameChild: {
    width: 42,
    height: 3,
  },
  frameContainer1: {
    paddingHorizontal: 16,
    paddingVertical: 5,
    marginTop: 3,
    alignSelf: "stretch",
    alignItems: "center",
    flexDirection: "column",
  },
  componentsSearchDefaultWrapper: {
    alignSelf: "stretch",
  },
  componentsSearchDefault3: {
    overflow: "hidden",
    flexDirection: "row",
    alignSelf: "stretch",
  },
  iconOutline1: {
    flexDirection: "row",
  },
  uiIconarrowBackwardfilled1: {
    overflow: "hidden",
  },
  locationTargetIconLayout: {
    height: 24,
    width: 24,
  },
  componentsSearchDefault2: {
    borderRadius: Border.br_5xs,
    marginLeft: 10,
    flexDirection: "row",
    flex: 1,
  },
  addressFrame: {
    borderRadius: Border.br_3xs,
    backgroundColor: Color.colorWhitesmoke_300,
    paddingLeft: Padding.p_3xs,
    paddingTop: Padding.p_8xs,
    paddingRight: Padding.p_5xs,
    paddingBottom: Padding.p_8xs,
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  enterAddressInput: {
    fontFamily: FontFamily.montserratRegular,
    fontSize: FontSize.level2Medium12_size,
    flexDirection: "row",
    flex: 1,
  },
  closeBtn: {
    marginLeft: 5,
    flexDirection: "row",
  },
  vectorIcon1: {
    width: 16,
    height: 16,
  },
  frameView1: {
    marginTop: 3,
  },
  frameItem1: {
    maxWidth: "100%",
    overflow: "hidden",
    width: "100%",
  },
  frameLayout: {
    height: 1.5,
    alignSelf: "stretch",
  },
  frameLayout1: {
    maxWidth: "100%",
    overflow: "hidden",
    width: "100%",
  },
  vectorFrame: {
    display: "none",
    marginTop: 3,
    alignItems: "center",
  },
  frameInner: {
    maxHeight: "100%",
    alignSelf: "stretch",
    flex: 1,
  },
  image2397Icon: {
    width: 150,
    height: 150,
  },
  enterAnAddressToExploreSeWrapper: {
    paddingHorizontal: 50,
    marginTop: 10,
    paddingVertical: Padding.p_mini,
    flexDirection: "row",
    alignSelf: "stretch",
  },
  enterAnAddress: {
    fontSize: FontSize.levelSemibold14_size,
    lineHeight: 15,
    fontWeight: "500",
    fontFamily: FontFamily.montserratMedium,
    color: Color.colorGray_800,
    textAlign: "center",
    display: "flex",
    height: 35,
    flex: 1,
  },

  whiteParentPosition: {
    padding: Padding.p_3xs,
    zIndex: 1,
    position: "absolute",
    alignItems: "center",
  },
  wrapperFlexBox: {
    // marginTop: 5,
    flexDirection: "row",
    alignSelf: "stretch",
  },
  addALabelFlexBox: {
    textAlign: "left",
    lineHeight: 32,
  },
  frameSpaceBlock: {
    marginTop: 15,
    alignSelf: "stretch",
  },
  frameSpaceBlock1: {
    alignSelf: "stretch",
  },
  componentsFlexBox: {
    paddingBottom: Padding.p_3xs,
    paddingTop: Padding.p_3xs,
    paddingLeft: Padding.p_8xs,
    borderRadius: Border.br_5xs,
    overflow: "hidden",
    justifyContent: "center",
    flexDirection: "row",
    alignSelf: "stretch",
    alignItems: "center",
  },
  homeTypo: {
    fontFamily: FontFamily.montserratSemiBold,
    fontWeight: "600",
    lineHeight: 15,
    textAlign: "left",
  },
  cebuClr: {
    color: Color.colorSilver_300,
    lineHeight: 15,
  },
  pencil1Position: {
    height: 20,
    width: 20,
    left: -10,
    top: -10,
    position: "absolute",
  },
  textTypo: {
    fontFamily: FontFamily.montserratRegular,
    fontSize: FontSize.typographyTaglineSmallRegular_size,
  },
  cebuTypo: {
    fontFamily: FontFamily.montserratMedium,
    fontWeight: "500",
    textAlign: "left",
  },
  addALabelTypo: {
    fontFamily: FontFamily.title2Bold32,
    fontSize: FontSize.paragraphMedium15_size,
    fontWeight: "700",
  },
  whitePosition: {
    zIndex: 0,
  },
  homeIconPosition: {
    left: 10,
    height: 30,
    width: 30,
    top: 10,
    position: "absolute",
  },
  addPosition: {
    left: 2,
    top: 2,
    overflow: "hidden",
    justifyContent: "center",
    flexDirection: "row",
    position: "absolute",
    alignItems: "center",
  },
  uiIconarrowBackwardfilled: {
    width: 24,
    height: 24,
  },
  backBtn: {
    borderRadius: Border.br_xl,
    width: 40,
    height: 40,
    paddingHorizontal: Padding.p_xs,
    paddingVertical: Padding.p_9xs,
    justifyContent: "center",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Color.m3White,
  },
  backBtnWrapper: {
    left: 16,
    paddingVertical: 15,
    zIndex: 0,
    paddingHorizontal: 0,
    flexDirection: "row",
    top: 0,
    position: "absolute",
  },
  frameItemLayout: {
    height: 50,
    width: 50,
  },
  icons8Location10021Wrapper: {
    top: 252,
    left: 28,
    zIndex: 1,
    overflow: "hidden",
    justifyContent: "flex-end",
  },
  vectorWrapper: {
    width: 342,
    height: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  editYourAddress: {
    fontSize: FontSize.size_mid,
    fontFamily: FontFamily.montserratBold,
    display: "flex",
    width: 253,
    color: Color.colorGray_800,
    fontWeight: "700",
    textAlign: "left",
    lineHeight: 32,
    height: 24,
    alignItems: "center",
  },
  editYourAddressWrapper: {
    alignItems: "center",
  },
  frameContainer: {
    paddingTop: Padding.p_5xs,
    justifyContent: "flex-end",
    alignSelf: "stretch",
  },
  locationIcon: {
    height: 30,
    width: 30,
  },
  iconOutline: {
    justifyContent: "center",
    flexDirection: "row",
    alignItems: "center",
  },
  barangayNasipitTalamban: {
    color: Color.colorDarkgray_300,
    fontSize: FontSize.levelSemibold14_size,
    fontFamily: FontFamily.montserratSemiBold,
    alignSelf: "stretch",
  },
  cebu: {
    fontSize: FontSize.level2Medium12_size,
    fontFamily: FontFamily.montserratMedium,
    fontWeight: "500",
    textAlign: "left",
    alignSelf: "stretch",
  },
  barangayNasipitTalambanCeParent: {
    marginLeft: 10,
    overflow: "hidden",
    flex: 1,
  },
  pencil1Wrapper: {
    zIndex: 0,
  },
  componentsSearchDefaultInner: {
    marginLeft: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  componentsSearchDefault: {
    paddingRight: Padding.p_10xs,
  },
  editBtn: {
    justifyContent: "flex-end",
  },
  noteInput: {
    paddingHorizontal: Padding.p_3xs,
    paddingVertical: 0,
    fontSize: FontSize.typographyTaglineSmallRegular_size,
    overflow: "hidden",
    justifyContent: "center",
    alignSelf: "stretch",
    flex: 1,
  },
  componentsSearchDefault1: {
    borderStyle: "solid",
    borderColor: Color.colorDarkgray_100,
    borderWidth: 1,
    height: 48,
    paddingRight: Padding.p_3xs,
  },
  streetFrame: {
    flex: 1,
  },
  houseNumberFrame: {
    marginLeft: 15,
    flex: 1,
  },
  streetFrameParent: {
    justifyContent: "center",
    flexDirection: "row",
    alignSelf: "stretch",
  },
  serviceProviderInstructions: {
    fontFamily: FontFamily.levelSemibold14,
    fontWeight: "600",
    lineHeight: 15,
    fontSize: FontSize.levelSemibold14_size,
    textAlign: "left",
    color: Color.colorGray_800,
  },
  giveUsMore: {
    fontSize: FontSize.level2Medium12_size,
    color: Color.colorDimgray_100,
    marginTop: 3,
    lineHeight: 15,
    fontFamily: FontFamily.montserratMedium,
    fontWeight: "500",
  },
  deliveryInstructionsFrame: {
    justifyContent: "center",
    flexDirection: "row",
    alignItems: "center",
  },
  text: {
    textAlign: "right",
    fontSize: FontSize.typographyTaglineSmallRegular_size,
    color: Color.colorSilver_300,
    lineHeight: 15,
  },
  wrapper: {
    marginTop: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignSelf: "stretch",
  },
  addALabel: {
    color: Color.lightLabelPrimary,
    textAlign: "left",
    lineHeight: 32,
    fontFamily: FontFamily.title2Bold32,
    fontSize: FontSize.paragraphMedium15_size,
    alignSelf: "stretch",
  },
  frameItem: {
    height: 50,
    width: 50,
  },
  whiteHomeIcon: {
    left: 10,
    height: 30,
    width: 30,
    top: 10,
    position: "absolute",
  },
  blueHomeIcon: {
    zIndex: 1,
  },
  whiteHomeParent: {
    top: 10,
    left: 10,
    zIndex: 1,
    justifyContent: "center",
  },
  ellipseParentShadowBox: {
    shadowOpacity: 1,
    elevation: 4,
    shadowRadius: 4,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowColor: "rgba(0, 0, 0, 0.75)",
    borderRadius: Border.br_11xl,
    height: 50,
    width: 50,
    justifyContent: "center",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Color.m3White,
    zIndex: 1,
  },
  ellipseParentShadowBox1: {
    shadowOpacity: 1,
    elevation: 6,
    shadowRadius: 4,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowColor: "rgba(0, 0, 0, 1)",
    borderRadius: Border.br_11xl,
    height: 50,
    width: 50,
    justifyContent: "center",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Color.colorDarkslategray_900,
    zIndex: 1,
  },
  home: {
    fontSize: FontSize.typographyTaglineSmallRegular_size,
    color: Color.colorGray_800,
  },
  homeWrapper: {
    paddingVertical: Padding.p_8xs,
    justifyContent: "center",
    paddingHorizontal: 0,
  },
  homeBtn: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  apartmentBtn: {
    marginLeft: 10,
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  whiteAdd: {
    display: "none",
    zIndex: 0,
  },
  blueAdd: {
    zIndex: 1,
  },
  whiteAddParent: {
    top: 9,
    left: 8,
    zIndex: 1,
    justifyContent: "center",
  },
  addALabelIconsFrame: {
    flexDirection: "row",
    alignItems: "center",
  },
  frameView: {
    justifyContent: "flex-end",
    alignItems: "center",
  },
  viewAllServices: {
    letterSpacing: -0.1,
    lineHeight: 24,
    color: Color.neutral01,
    textAlign: "center",
  },
  componentsbutton: {
    borderRadius: Border.br_mini,
    backgroundColor: Color.colorDarkslategray_900,
    // width: 343,
    paddingHorizontal: Padding.p_3xl,
    paddingVertical: Padding.p_xs,
    justifyContent: "center",
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "stretch",
  },
  frameGroup: {
    borderTopLeftRadius: Border.br_5xl,
    borderTopRightRadius: Border.br_5xl,
    paddingHorizontal: Padding.p_base,
    paddingBottom: Padding.p_mini,
    alignSelf: "stretch",
    alignItems: "center",
    backgroundColor: Color.m3White,
  },
  editAddressModal: {
    zIndex: 5,
    justifyContent: "flex-end",
    alignSelf: "stretch",
    alignItems: "center",
  },
  frameParent: {
    justifyContent: "flex-end",
    alignSelf: "stretch",
    alignItems: "center",
    flex: 1,
  },
  frameParent1: {
    paddingTop: 30,
    justifyContent: "flex-start",
    alignSelf: "stretch",
    alignItems: "center",
    flex: 1,
  },
  body: {
    justifyContent: "flex-end",
    alignSelf: "stretch",
    alignItems: "center",
    flex: 1,
  },
  editAddressIconComplete: {
    width: "100%",
    height: 812,
    alignItems: "center",
    flex: 1,
    backgroundColor: Color.m3White,
  },
  // for searching autocomplte

  editAddressModalSearch: {
    zIndex: 5,
    justifyContent: "flex-end",
    alignSelf: "stretch",
    alignItems: "center",
  },

  frameGroupSearch: {
    borderTopLeftRadius: Border.br_5xl,
    borderTopRightRadius: Border.br_5xl,
    // paddingHorizontal: Padding.p_base,
    paddingBottom: 60,
    alignSelf: "stretch",
    alignItems: "center",
    backgroundColor: Color.m3White,
  },

  frameContainerSearch: {
    paddingTop: Padding.p_5xs,
    justifyContent: "flex-end",
    alignSelf: "stretch",
    position: "relative",
    alignItems: "center",
    flex: 1,
  },
  frameFlexBox1Search: {
    // paddingTop: Padding.p_5xs,
    height: 8,
    // justifyContent: "center",
    // alignSelf: "stretch",
  },
  vectorWrapper1Search: {
    // height: 0,
    alignSelf: "stretch",
  },
  btnWrapperFlexBoxSearch: {
    justifyContent: "center",
    alignItems: "center",
  },
  frameChildSearch: {
    width: 42,
    height: 3,
  },
  frameContainer1Search: {
    paddingHorizontal: 16,
    paddingVertical: 5,
    marginTop: 3,
    alignSelf: "stretch",
    alignItems: "center",
    flex: 1,
    // flexDirection: "column",
  },
  componentsSearchDefaultWrapperSearch: {
    alignSelf: "stretch",
  },
  btnWrapperFlexBoxSearch: {
    justifyContent: "center",
    alignItems: "center",
  },
  iconOutline1Search: {
    flexDirection: "row",
  },
  btnWrapperFlexBoxSearch: {
    justifyContent: "center",
    alignItems: "center",
  },
  uiIconarrowBackwardfilled1Search: {
    overflow: "hidden",
  },
  locationTargetIconLayoutSearch: {
    height: 24,
    width: 24,
  },
  componentsSearchDefault2Search: {
    borderRadius: Border.br_5xs,
    marginLeft: 10,
    flexDirection: "row",
    flex: 1,
  },
  btnWrapperFlexBoxSearch: {
    justifyContent: "center",
    alignItems: "center",
  },
  componentsSearchDefault3Search: {
    flexDirection: "row",
  },
  backBtnWrapperSearch: {
    paddingVertical: Padding.p_mini,
    zIndex: 0,
    paddingHorizontal: 0,
    flexDirection: "row",
    top: 0,
    marginRight: 10,
  },
  frameViewSearch: {
    justifyContent: "flex-end",
    alignItems: "center",
  },
  frameFlexBoxSearch: {
    paddingTop: Padding.p_5xs,
    height: 8,
    justifyContent: "center",
    alignSelf: "stretch",
  },
  vectorWrapper1Search: {
    alignSelf: "stretch",
  },
  btnWrapperFlexBoxSearch: {
    justifyContent: "center",
    alignItems: "center",
  },
  frameItem1Search: {
    maxWidth: "100%",
    overflow: "hidden",
    width: "100%",
  },
  frameLayoutSearch: {
    height: 1.5,
    alignSelf: "stretch",
  },
  frameParent1Search: {
    paddingTop: 30,
    justifyContent: "flex-start",
    alignSelf: "stretch",
    alignItems: "center",
  },
  image2397IconSearch: {
    width: 150,
    height: 150,
  },
  enterAnAddressToExploreSeWrapperSearch: {
    paddingHorizontal: 50,
    marginTop: 10,
    paddingVertical: Padding.p_mini,
    flexDirection: "row",
    alignSelf: "stretch",
  },
  btnWrapperFlexBoxSearch: {
    justifyContent: "center",
    alignItems: "center",
  },
  enterAnAddressSearch: {
    fontSize: FontSize.levelSemibold14_size,
    lineHeight: 15,
    fontWeight: "500",
    fontFamily: FontFamily.montserratMedium,
    color: Color.colorGray_800,
    textAlign: "center",
    display: "flex",
    height: 35,
    flex: 1,
  },
  btnWrapperFlexBoxSearch: {
    justifyContent: "center",
    alignItems: "center",
  },
  hiddenFrameSearch: {
    display: "flex",
    marginTop: 255,
    justifyContent: "flex-start",
    alignSelf: "stretch",
    alignItems: "center",
    flex: 5,
  },
  frameParent2Search: {
    display: "none",
    paddingTop: 30,
    justifyContent: "flex-start",
    alignSelf: "stretch",
    alignItems: "center",
    // flex: 1,
  },
  image2397IconSearch: {
    width: 150,
    height: 150,
  },
  enterAnAddressToExploreSeWrapperSearch: {
    paddingHorizontal: 50,
    marginTop: 10,
    paddingVertical: Padding.p_mini,
    flexDirection: "row",
    alignSelf: "stretch",
  },
  btnWrapperFlexBoxSearch: {
    justifyContent: "center",
    alignItems: "center",
  },
  enterAnAddressSearch: {
    fontSize: FontSize.levelSemibold14_size,
    lineHeight: 15,
    fontWeight: "500",
    fontFamily: FontFamily.montserratMedium,
    color: Color.colorGray_800,
    textAlign: "center",
    display: "flex",
    height: 35,
    flex: 1,
  },
  btnWrapperFlexBoxSearch: {
    justifyContent: "center",
    alignItems: "center",
  },
});





// NOTE: THIS IS THE ORIGINAL VERSION USING handleTextInputs






// import * as React from "react";
// import {
//   StatusBar,
//   StyleSheet,
//   Pressable,
//   View,
//   Text,
//   TextInput,
// TouchableOpacity,
//   Dimensions,
//   ImageBackground,
//   ScrollView,
//   Keyboard,
//   TouchableWithoutFeedback,
// } from "react-native";
// import { Image } from "expo-image";
// import { useState,  useEffect, useRef, useContext, useMemo } from "react";
// import { useNavigation } from "@react-navigation/native";
// import { Padding, Border, FontFamily, Color, FontSize } from "../GlobalStyles";
// import { useAddAddressContext } from "../AddAddressContext";
// import { AddressSelectedContext } from "../AddressSelectedContext";
// import MapView, { Marker } from "react-native-maps";
// import axios from "axios";
// import * as Location from "expo-location";
// import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
// import {
//   widthPercentageToDP as wp,
//   heightPercentageToDP as hp,
// } from "react-native-responsive-screen";
// import {
//   getFirestore,
//   doc,
//   setDoc,
//   getDoc,
//   addDoc,
//   updateDoc,
//   collection, // Import getDoc for checking if a user with the same phone number exists
// } from "firebase/firestore";
// import { getAuth} from "firebase/auth";
// import Toast from "react-native-toast-message";

// let optionsLength = 0;
// let currentLocationLength = 0;
// let updatedOptionsArr = { savedOptions: [] };
// let updatedCurrentLocationArr = { currentLocation: [] };
// let combinedData = { savedOptions: [] };

// let updatedStreetInput = "";
// let updatedHouseNumberInput = "";
// let updatedFloorInput = "";
// let updatedLabelInput = "";
// let updatedOtherLabelInput = "";
// let updatedNoteInput = "";

// const getStyleValue = (key, value) => {
//   if (value === undefined) return;
//   return { [key]: value === "unset" ? undefined : value };
// };

// export default function EditAddressModal({
//   selectedLocation,
//   selectedCity,
//   selectedFloor,
//   selectedHouseNumber,
//   selectedLabel,
//   selectedOtherLabel,
//   selectedNote,
//   selectedStreet,
//   selectedValue,
//   selectedCoordinates,
//   editAddress,
//   body,
//   name,
//   btnName,
//   checkMarkerChange,
//   cityAddress,
//   specificLocation,
//   addedFlag,
//   addedSpecificLocation,
//   addedCoordinates,
//   addedCityAddress,
//   visible,
//   onClose,
// }) {
//   const navigation = useNavigation();
//   const [label, setLabel] = useState(selectedLabel);

//   const [searchModal, setSearchModal] = useState(false);
//   const [confirmAdd, setConfirmAdd] = useState(false);
//   const [added, setAdded] = useState(addedFlag);

//   const { setAddAddressData } = useAddAddressContext();
//   const { setCurrentFocus } = useContext(AddressSelectedContext);

//   //handle text inputs
//   const [textInputStreet, setTextInputStreet] = useState(selectedStreet || "");
//   const [textInputHouseNumber, setTextInputHouseNumber] = useState(selectedHouseNumber || "");
//   const [textInputFloor, setTextInputFloor] = useState(selectedFloor || "");
//   const [textInputNote, setTextInputNote] = useState(selectedNote || '');
//   const [textInputLabel, setTextInputLabel] = useState(selectedOtherLabel || "");
  
//   const [addFlag, setAddFlag] = useState(true);

//   const [showLabel, setshowLabel] = useState(false);

//   const [otherLabel, setotherLabel] = useState("");

//   // const [updatedStreetInput, setUpdatedStreetInput] = useState("");
//   // const [updatedHouseNumberInput, setUpdatedHouseNumberInput] = useState("");
//   // const [updatedFloorInput, setUpdatedFloorInput] = useState("");
//   // const [updatedNoteInput, setUpdatedNoteInput] = useState("");
//   // const [updatedLabelInput, setUpdatedLabelInput] = useState("");

//   // const [buttonName, setButtonName] = useState(btnName);
//   const [labelVisible, setLabelVisible] = useState(false);

//   const [isInputFocused, setIsInputFocused] = useState(false);

//   const screenHeight = Dimensions.get("window").height;
//   const editLocationContainerHeight = screenHeight * 0.75;
//   const [showExploreContainer, setShowExploreContainer] = useState(true);

//   const [initialMapRegion, setInitialMapRegion] = useState({
//     latitude: 10.3157,
//     longitude: 123.8854,
//     latitudeDelta: 0.0922,
//     longitudeDelta: 0.0421,
//   });

//   const [initialMarkerPosition, setInitialMarkerPosition] = useState({
//     latitude: 10.3157,
//     longitude: 123.8854,
//   });

//   const [markerPosition, setMarkerPosition] = useState(initialMarkerPosition);
//   const [reverseGeocodedAddress, setReverseGeocodedAddress] = useState(null);
//   const [editLocationVisible, setEditLocationVisible] = useState(true);
//   const [showCloseBtn, setShowCloseBtn] = useState(true);
//   const [cityLocation, setCityLocation] = useState(null);

//   const [documentData, setDocumentData] = useState({
//     savedOptions: [],
//   });

//   const [savedOptionsData, setSavedOptionsData] = useState([]);

//   const handleInputFocus = () => {
//     setShowCloseBtn(showCloseBtn);
//     setIsInputFocused(true);
//   };

//   const handleInputBlur = () => {
//     setShowCloseBtn(showCloseBtn);
//     setIsInputFocused(false);
//   };


  
//   const fetchReverseGeolocation = async (latitude, longitude) => {
//     try {
//       const apiKey = "AIzaSyAuaR8dxr95SLUTU-cidS7I-3uB6mEoJmA"; // Replace with your Google Maps API key
//       // const apiKey = "AIzaSyAuaR8dxr95SLUTU-cidS7I-3uB6mEoJmA"; // Replace with your Google Maps API key
//       const response = await axios.get(
//         `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`
//       );
//       if (response.data.results && response.data.results.length > 0) {
//         const firstResult = response.data.results[0];
//         const formattedAddress = firstResult.formatted_address;

//         // Extracting the city from the formatted address
//         const addressComponents = firstResult.address_components;
//         let city = "";
//         for (const component of addressComponents) {
//           if (component.types.includes("locality")) {
//             city = component.long_name;
//             break;
//           }
//         }

//         setReverseGeocodedAddress(formattedAddress);
//         setCityLocation(city);
//         // Console.log the city
//         console.log("City:", city);
//       } else {
//         setReverseGeocodedAddress("Location not found");
//         console.log("City not found");
//       }
//     } catch (error) {
//       console.error("Error fetching reverse geolocation:", error);
//     }
//   };

//   useEffect(() => {
//     if (markerPosition) {
//       fetchReverseGeolocation(
//         markerPosition.latitude,
//         markerPosition.longitude
//       );
//     }
//     console.log("Is TextInput focused:", isInputFocused);
//   }, [markerPosition, isInputFocused]);


//   const handleInputChange = (identifier, text) => {
//     switch (identifier) {
//       case 'street':
//         setTextInputStreet(text);
//         break;
//       case 'houseNumber':
//         setTextInputHouseNumber(text);
//         break;
//       case 'floor':
//         setTextInputFloor(text);
//         break;
//       case 'note':
//         // Only apply the character limit to the note input
//         if (text.length <= 300) {
//           setTextInputNote(text);
//         }
//         break;
//       case 'label':
//         setTextInputLabel(text);
//         break;
//       default:
//         console.log("Error changing the text input");
//         break;
//     }
//   };

//   const handleCategoryButtonPress = (category, value) => {
//     if (category === "Label") {
//       setLabel(value);
//       if (value === "Others") {
//         setshowLabel(true);
//       } else {
//         setshowLabel(false);
//       }
//     }
//   };

//   const handleAddToList = async () => {
//     console.log("This is pressed!");

//     console.log("Label:", label);

//     // Check if label is undefined before proceeding

//     if (label !== undefined) {
//       try {
//         // Initialize Firestore and reference the 'userProfiles' collection
//         const db = getFirestore();

//         // Get the user's UID
//         const auth = getAuth();
//         const user = auth.currentUser.uid;
//         console.log(user);

//         // Reference to the "manageAddress" collection for the specified userUID
//         const manageAddressCollectionRef = collection(
//           db,
//           "userProfiles",
//           user,
//           "manageAddress"
//         );

//         const dataToAdd = {
//           address: added
//             ? addedSpecificLocation
//             : checkMarkerChange
//             ? specificLocation
//             : selectedLocation,
//           city: added ? addedCityAddress : cityAddress,
//           street: textInputStreet,
//           coordinates: addedCoordinates,
//           houseNumber: textInputHouseNumber,
//           floor: textInputFloor,
//           note: textInputNote,
//           label: label,
//           otherLabel: textInputLabel,
//         };

//         // Add a new document with an auto-generated ID
//         const newDocRef = await addDoc(manageAddressCollectionRef, dataToAdd);

//         console.log("First Document written with ID: ", newDocRef.id);

//         // Add the second document named "savedOptions"
//         const currentLocationDocRef = doc(
//           manageAddressCollectionRef,
//           "currentLocation"
//         );
//         const savedOptionsDocRef = doc(
//           manageAddressCollectionRef,
//           "savedOptions"
//         );

//         getDoc(currentLocationDocRef)
//           .then(async (docSnapshot) => {
//             if (docSnapshot.exists()) {
//               const currentLocationDocument = docSnapshot.data();
//               console.log(
//                 "Current Location Document: ",
//                 currentLocationDocument
//               ); // Log the entire fetched data

//               // Check if "savedOptions" is an array and has at least one item
//               if (
//                 Array.isArray(currentLocationDocument.currentLocation) &&
//                 currentLocationDocument.currentLocation.length > 0
//               ) {
//                 // This code segment needs to be updated

//                 const firstOption = currentLocationDocument.currentLocation[0]; // Access the first option
//                 console.log("Current Location Address: ", firstOption.address);
//                 console.log("Current Location Label: ", firstOption.label);
//                 console.log("Current Location Value: ", firstOption.value);
//                 currentLocationLength =
//                   currentLocationDocument.currentLocation.length;
//                 console.log("Current Location Length: ", currentLocationLength);
//                 console.log(
//                   "Current Location Data: ",
//                   currentLocationDocument.currentLocation
//                 );

//                 updatedCurrentLocationArr.currentLocation =
//                   currentLocationDocument.currentLocation;
//                 console.log(
//                   "Current Location Array: ",
//                   updatedCurrentLocationArr.currentLocation
//                 );
//               } else {
//                 console.log("No current Location found in the document.");

//                 const firstOption = currentLocationDocument.currentLocation[0]; // Access the first option
//                 console.log("Current Location Address: ", firstOption.address);
//                 console.log("Current Location Label: ", firstOption.label);
//                 console.log("Current Location Value: ", firstOption.value);
//                 currentLocationLength =
//                   currentLocationDocument.currentLocation.length;
//                 console.log("Current Location Length: ", currentLocationLength);
//                 console.log(
//                   "Current Location Data: ",
//                   currentLocationDocument.currentLocation
//                 );

//                 updatedCurrentLocationArr.currentLocation =
//                   currentLocationDocument.currentLocation;
//                 console.log(
//                   "Current Location Array: ",
//                   updatedCurrentLocationArr.currentLocation
//                 );
//               }
//             } else {
//               console.log("No such document!");
//             }
//           })
//           .catch((error) => {
//             console.error("Error getting document:", error);
//           });

//         getDoc(savedOptionsDocRef)
//           .then(async (docSnapshot) => {
//             if (docSnapshot.exists()) {
//               const optionsData = docSnapshot.data();
//               console.log("Saved Options Data: ", optionsData); // Log the entire fetched data

//               // Check if "savedOptions" is an array and has at least one item
//               if (
//                 Array.isArray(optionsData.savedOptions) &&
//                 optionsData.savedOptions.length > 0
//               ) {
//                 const firstOption = optionsData.savedOptions[0]; // Access the first option
//                 console.log("Options Address: ", firstOption.address);
//                 console.log("Label: ", firstOption.label);
//                 console.log("Value: ", firstOption.value);
//                 optionsLength = optionsData.savedOptions.length;
//                 console.log("Saved Options Length: ", optionsLength);
//                 console.log(
//                   "Original Fetched Data: ",
//                   optionsData.savedOptions
//                 );

//                 // Create a temporary array for the fetched savedOptions
//                 const optionsArray = [optionsData.savedOptions];
//                 console.log(optionsArray);

//                 updatedOptionsArr.savedOptions = optionsData.savedOptions;
//                 console.log("Saved Options Array: ", updatedOptionsArr);

//                 const tempData = [
//                   {
//                     address: added
//                       ? addedSpecificLocation
//                       : checkMarkerChange
//                       ? specificLocation
//                       : selectedLocation,
//                     city: added ? addedCityAddress : cityAddress,
//                     floor: textInputFloor,
//                     houseNumber: textInputHouseNumber,
//                     label: label,
//                     otherLabel: textInputLabel,
//                     note: textInputNote,
//                     street: textInputStreet,
//                     coordinates: addedCoordinates,
//                     value: optionsLength + 1,
//                   },
//                 ];

//                 const firstData = updatedOptionsArr.savedOptions[0];
//                 console.log("First Data Address: ", firstData.address);
//                 console.log("First Data Label: ", firstData.label);
//                 console.log("First Data Value: ", firstData.value);

//                 console.log("Document Data: ", firstData);

//                 if (
//                   Array.isArray(updatedCurrentLocationArr.currentLocation) &&
//                   updatedCurrentLocationArr.currentLocation.length > 0
//                 ) {
//                   const firstCurrentLoc =
//                     updatedCurrentLocationArr.currentLocation[0]; // Access the first option
//                   console.log(
//                     "First Current Address: ",
//                     firstCurrentLoc.address
//                   );
//                   console.log("First Current Label: ", firstCurrentLoc.label);
//                   console.log("First Current Value: ", firstCurrentLoc.value);

//                   if (firstData.address != firstCurrentLoc.address) {
//                     combinedData.savedOptions = firstCurrentLoc;
//                     console.log(
//                       "Current Location Combined: ",
//                       combinedData.savedOptions
//                     );

//                     combinedData = {
//                       savedOptions: [
//                         ...combinedData.savedOptions,
//                         ...updatedOptionsArr.savedOptions,
//                       ],
//                     };
//                     console.log(
//                       "Current + Saved Options Combined: ",
//                       combinedData
//                     );

//                     combinedData = {
//                       savedOptions: [...combinedData.savedOptions, ...tempData],
//                     };
//                     console.log(
//                       "Current + Saved Options + tempData Combined: ",
//                       combinedData
//                     );

//                     await setDoc(savedOptionsDocRef, combinedData);
//                   } else {
//                     updatedOptionsArr = {
//                       savedOptions: [
//                         ...updatedOptionsArr.savedOptions,
//                         ...tempData,
//                       ],
//                     };
//                     console.log(
//                       "Saved Options + tempData Combined: ",
//                       updatedOptionsArr
//                     );
//                     await setDoc(savedOptionsDocRef, updatedOptionsArr);
//                   }
//                 } else {
//                   console.log(
//                     "No document is found in current Location Document!"
//                   );

//                 }
//                 console.log("Updated 'savedOptions' document\n");
//               } else if (
//                 Array.isArray(optionsData.savedOptions) &&
//                 optionsData.savedOptions.length == 0
//               ) {
//                 optionsLength = optionsData.savedOptions.length;
//                 console.log("Options Length should be zero: ", optionsLength);
//                 console.log(
//                   "Options Data should be empty: : ",
//                   optionsData.savedOptions
//                 );

//                 const firstCurrentLoc =
//                   updatedCurrentLocationArr.currentLocation[0]; // Access the first option
//                 console.log("Current Data: ", firstCurrentLoc);
//                 console.log("First Current Address: ", firstCurrentLoc.address);
//                 console.log("First Current Label: ", firstCurrentLoc.label);
//                 console.log("First Current Value: ", firstCurrentLoc.value);

//                 const tempData = [
//                   {
//                     address: added
//                       ? addedSpecificLocation
//                       : checkMarkerChange
//                       ? specificLocation
//                       : selectedLocation,
//                     city: added ? addedCityAddress : cityAddress,
//                     floor: textInputFloor,
//                     houseNumber: textInputHouseNumber,
//                     label: label,
//                     otherLabel: textInputLabel,
//                     note: textInputNote,
//                     street: textInputStreet,
//                     coordinates: addedCoordinates,
//                     value: optionsLength + 2,
//                   },
//                 ];

//                 updatedOptionsArr.savedOptions = [firstCurrentLoc];
//                 console.log(
//                   "First Element Current Location for Saved Options Array: ",
//                   updatedOptionsArr
//                 );

//                 updatedOptionsArr = {
//                   savedOptions: [
//                     ...updatedOptionsArr.savedOptions,
//                     ...tempData,
//                   ],
//                 };
//                 console.log("Updated Saved Options Array: ", updatedOptionsArr);
//                 await setDoc(savedOptionsDocRef, updatedOptionsArr);
//                 console.log("Two Elements savedOptions found in the document.");
//               } else {
//                 console.log("No savedOptions found in the document.");
//               }
//             } else {
//               const optionsData = docSnapshot.data();
//               console.log("Saved Options Data: ", optionsData); // Log the entire fetched data

//               const firstCurrentLoc =
//                 updatedCurrentLocationArr.currentLocation[0]; // Access the first option
//               console.log("Current Data: ", firstCurrentLoc);
//               console.log("First Current Address: ", firstCurrentLoc.address);
//               console.log("First Current Label: ", firstCurrentLoc.label);
//               console.log("First Current Value: ", firstCurrentLoc.value);

//               const tempData = [
//                 {
//                   address: added
//                     ? addedSpecificLocation
//                     : checkMarkerChange
//                     ? specificLocation
//                     : selectedLocation,
//                   city: added ? addedCityAddress : cityAddress,
//                   floor: textInputFloor,
//                   houseNumber: textInputHouseNumber,
//                   label: label,
//                   otherLabel: textInputLabel,
//                   note: textInputNote,
//                   street: textInputStreet,
//                   coordinates: addedCoordinates,
//                   value: optionsLength + 2,
//                 },
//               ];

//               updatedOptionsArr.savedOptions = [firstCurrentLoc];
//               console.log(
//                 "First Element Current Location for Saved Options Array: ",
//                 updatedOptionsArr
//               );

//               updatedOptionsArr = {
//                 savedOptions: [...updatedOptionsArr.savedOptions, ...tempData],
//               };
//               console.log("Updated Saved Options Array: ", updatedOptionsArr);
//               await setDoc(savedOptionsDocRef, updatedOptionsArr);
//               console.log("Two Elements savedOptions found in the document.");
//             }
//           })
//           .catch((error) => {
//             console.error("Error getting document:", error);
//           });

//         setAddAddressData({
//           addressValue: added
//             ? addedSpecificLocation
//             : checkMarkerChange
//             ? specificLocation
//             : selectedLocation,
//           city: added ? addedCityAddress : cityAddress,
//           streetValue: textInputStreet,
//           houseNumberValue: textInputHouseNumber,
//           floorValue: textInputFloor,
//           noteValue: textInputNote,
//           labelValue: label,
//           otherLabel: textInputLabel,
//           addValue: addFlag,
//           selectedIDValue: newDocRef.id,
//         });
//       } catch (error) {
//         console.error("Add a new address error:", error);

//         Toast.show({
//           type: "error",
//           position: "top",
//           text1: "Error",
//           text2: error.message || "An error occurred while adding",
//           visibilityTime: 5000,
//         });
//       }
//       navigation.navigate("Homepage");
//       onClose();
//     } else {
//       Toast.show({
//         type: "error",
//         position: "top",
//         text1: "Label Error",
//         text2: "Please add a label❗",
//         visibilityTime: 5000,
//       });
//     }
//   };

//   const handleAdd = () => {
//     console.log("Name: ", btnName);
//     console.log("added: ", added);
//     setConfirmAdd(true);
//     console.log("check Marker Change: ", checkMarkerChange);
//     console.log("ConfirmAdd: ", confirmAdd);

//     navigation.navigate("EditAddressIconComplete", {
//       checkMarkerChange: checkMarkerChange,
//       addedCityAddress: cityAddress,
//       addedSpecificLocation: specificLocation,
//       addedCoordinates: selectedCoordinates,
//       addedFlag: confirmAdd,
//       // add a new address
//     });
//   };

//   const handleEdit = () => {
//     console.log(textInputStreet);
//     console.log(textInputFloor);
//     console.log("The label is", label);
//     console.log(textInputNote);
//     console.log(textInputHouseNumber);
//     console.log(textInputLabel);
//     if (textInputStreet != "") {
//       updatedStreetInput = textInputStreet;
//     } else {
//       updatedStreetInput = selectedStreet;
//     }

//     if (textInputFloor != "") {
//       updatedFloorInput = textInputFloor;
//     } else {
//       updatedFloorInput = selectedFloor;
//     }

//     if (textInputHouseNumber != "") {
//       updatedHouseNumberInput = textInputHouseNumber;
//     } else {
//       updatedHouseNumberInput = selectedHouseNumber;
//     }

//     if (textInputNote != "") {
//       updatedNoteInput = textInputNote;
//     } else {
//       updatedNoteInput = selectedNote;
//     }

//     if (label != "") {
//       updatedLabelInput = label;
//     } else {
//       updatedLabelInput = selectedLabel;
//     }
//     if (textInputLabel != "") {
//       updatedOtherLabelInput = textInputLabel;
//     } else {
//       updatedOtherLabelInput = selectedOtherLabel;
//     }

//     console.log("Street Input: ", updatedStreetInput);
//     console.log("House Number Input: ", updatedHouseNumberInput);
//     console.log("Floor Input: ", updatedFloorInput);
//     console.log("Note Input: ", updatedNoteInput);
//     console.log("Label Input: ", updatedLabelInput);
//     console.log("Other Label Input: ", updatedOtherLabelInput);
//     (async () => {
//       try {
//         // Initialize Firestore and reference the 'userProfiles' collection
//         const db = getFirestore();

//         // Get the user's UID
//         const auth = getAuth();
//         const user = auth.currentUser.uid;
//         console.log(user);

//         const savedOptionsDocRef = doc(
//           db,
//           "userProfiles",
//           user,
//           "manageAddress",
//           "savedOptions",
//         );

//         const updatedData = {
//           address: selectedLocation,
//           city: selectedCity,
//           floor: updatedFloorInput || "", // Set default value to an empty string if undefined
//           houseNumber: updatedHouseNumberInput || "", // Set default value to an empty string if undefined
//           label: updatedLabelInput || "", // Set default value to an empty string if undefined
//           otherLabel: updatedOtherLabelInput || "", // Set default value to an empty string if undefined
//           note: updatedNoteInput || "", // Set default value to an empty string if undefined
//           street: updatedStreetInput || "", // Set default value to an empty string if undefined
//           coordinates: selectedCoordinates,
//           value: selectedValue,
//         };

//         getDoc(savedOptionsDocRef)
//           .then(async (docSnapshot) => {
//             if (docSnapshot.exists()) {
//               const optionsData = docSnapshot.data();
//               console.log("Saved Options Data: ", optionsData); // Log the entire fetched data

//               const selectedSavedOption =
//                 optionsData.savedOptions[selectedValue - 1];
//               console.log("Selected Saved Option: ", selectedSavedOption);

//               optionsData.savedOptions[selectedValue - 1] = updatedData;
//               console.log("Updated optionsData: ", optionsData.savedOptions);

//               // Update the document with the modified array
//               await updateDoc(savedOptionsDocRef, {
//                 savedOptions: optionsData.savedOptions,
//               });

//               navigation.navigate("Homepage");
//             } else {
//               console.log("No such document!");
//             }
//           })
//           .catch((error) => {
//             console.error("Error getting document:", error);
//           });
//       } catch (error) {
//         console.error("Edit address error:", error);

//         Toast.show({
//           type: "error",
//           position: "top",
//           text1: "Error",
//           text2: error.message || "An error occurred while editing",
//           visibilityTime: 5000,
//         });
//       }
//     })();
//   };

//   // Define onFocus and onBlur handlers for your inputs
//   const handleTextInputFocus = (inputType) => {
//     setCurrentFocus(inputType);
//   };
  
//   // Inside your handleTextInputBlur function
//   const handleTextInputBlur = () => {
//     setCurrentFocus(null);
//   };

//   return (
    
//       <View style={[styles.editAddressModal]}>
//         {!searchModal && (
//           <View style={styles.frameGroup}>
//             <View style={styles.frameContainer}>
//               <View style={styles.frameFlexBox1}>
//                 <View style={[styles.vectorWrapper1, styles.btnWrapperFlexBox]}>
//                   <Image
//                     style={styles.frameChild}
//                     contentFit="cover"
//                     source={require("../assets/line-76.png")}
//                   />
//                 </View>
//               </View>
//               {editAddress && (
//                 <View
//                   style={[styles.editYourAddressWrapper, styles.wrapperFlexBox]}
//                 >
//                   <Text style={[styles.editYourAddress, styles.addALabelFlexBox]}>
//                     {name}
//                   </Text>
//                 </View>
//               )}
//             </View>
//             <Pressable
//               style={[styles.editBtn, styles.frameSpaceBlock]}
//               onPress={() => {
//                 if (!body) {
//                   setSearchModal(true);
//                 }
//               }}
//             >
//               <View
//                 style={[styles.componentsSearchDefault, styles.componentsFlexBox]}
//               >
//                 <View style={styles.iconOutline}>
//                   <Image
//                     style={styles.locationIcon}
//                     contentFit="cover"
//                     source={require("../assets/location-icon1.png")}
//                   />
//                 </View>
//                 <View style={styles.barangayNasipitTalambanCeParent}>
//                   <Text style={[styles.barangayNasipitTalamban, styles.homeTypo]}>
//                     {added
//                       ? addedSpecificLocation
//                       : checkMarkerChange
//                       ? specificLocation
//                       : selectedLocation}

//                     {console.log(
//                       added
//                         ? "Added in the box: " + addedSpecificLocation
//                         : checkMarkerChange
//                         ? "Marker Changed in the box : " + specificLocation
//                         : "Selected in the box: " + selectedLocation
//                     )}
//                   </Text>
//                   <Text style={[styles.cebu, styles.cebuClr]}>
//                     {added
//                       ? addedCityAddress
//                       : selectedCity
//                       ? selectedCity
//                       : cityAddress}
//                   </Text>
//                 </View>
//               </View>
//             </Pressable>
//             {body && (
//               <View style={[styles.frameView, styles.frameSpaceBlock]}>
//                 <View style={styles.streetFrameParent}>
//                   <View style={styles.streetFrame}>
//                     <Text>Street</Text>
//                     <View
//                       style={[
//                         styles.componentsSearchDefault1,
//                         styles.componentsFlexBox,
//                       ]}
//                     >
                      
//                       <TextInput
//                         style={[styles.noteInput, styles.textTypo]}
//                         placeholder="Street"
//                         placeholderTextColor="#b8b8b8"
//                         onChangeText={(text) => handleInputChange('street', text)}
//                         value={textInputStreet} // Add this line to control the input value
//                         onFocus={() => handleTextInputFocus("street")}
//                         onBlur={handleTextInputBlur}
//                         onKeyPress={() => handleTextInputFocus("street")}
//                         onPressIn={() => handleTextInputFocus("street")}
//                         onLayout={() => handleTextInputFocus("street")}
//                       />
//                     </View>
//                   </View>
//                   <View style={styles.houseNumberFrame}>
//                     <Text>House Number</Text>
//                     <View
//                       style={[
//                         styles.componentsSearchDefault1,
//                         styles.componentsFlexBox,
//                       ]}
//                     >
                  
//                         <TextInput
//                           style={[styles.noteInput, styles.textTypo]}
//                           placeholder="House Number"
//                           placeholderTextColor="#b8b8b8"
//                           onChangeText={(text) => handleInputChange('houseNumber', text)}
//                           value={textInputHouseNumber} // Add this line to control the input value
//                           onFocus={() => handleTextInputFocus("houseNumber")}
//                           onBlur={handleTextInputBlur}
//                           onKeyPress={() => handleTextInputFocus("houseNumber")}
//                           onPressIn={() => handleTextInputFocus("houseNumber")}
//                           onLayout={() => handleTextInputFocus("houseNumber")}
//                         />
            
//                     </View>
//                   </View>
//                 </View>
//                 <View style={styles.frameSpaceBlock}>
//                   <Text>Floor/Unit/Room#</Text>
//                   <View
//                     style={[
//                       styles.componentsSearchDefault1,
//                       styles.componentsFlexBox,
//                     ]}
//                   >
          
//                       <TextInput
//                         style={[styles.noteInput, styles.textTypo]}
//                         placeholder="Floor/Unit/Room #"
//                         placeholderTextColor="#b8b8b8"
//                         onChangeText={(text) => handleInputChange('floor', text)}
//                         value={textInputFloor} // Add this line to control the input value
//                         onFocus={() => handleTextInputFocus("floor")}
//                         onBlur={handleTextInputBlur}
//                         onKeyPress={() => handleTextInputFocus("floor")}
//                         onPressIn={() => handleTextInputFocus("floor")}
//                         onLayout={() => handleTextInputFocus("floor")}
//                       />
      
//                   </View>
//                 </View>
//                 <View
//                   style={[
//                     styles.deliveryInstructionsFrame,
//                     styles.frameSpaceBlock,
//                   ]}
//                 >
//                   <View style={styles.streetFrame}>
//                     <Text style={styles.serviceProviderInstructions}>
//                       Service Provider Instructions
//                     </Text>
//                     <Text style={[styles.giveUsMore, styles.cebuTypo]}>
//                       Give us more information about your address.
//                     </Text>
//                   </View>
//                 </View>
//                 <View style={styles.frameSpaceBlock}>
//                   <View
//                     style={[
//                       styles.componentsSearchDefault1,
//                       styles.componentsFlexBox,
//                     ]}
//                   >
              
//                       <TextInput
//                         style={[styles.noteInput, styles.textTypo]}
//                         placeholder="Note to service provider - e.g. landmark"
//                         placeholderTextColor="#b8b8b8"
//                         onChangeText={(text) => handleInputChange('note', text)}
//                         value={textInputNote} // Add this line to control the input value
//                         onFocus={() => handleTextInputFocus("note")}
//                         onBlur={handleTextInputBlur}
//                         onKeyPress={() => handleTextInputFocus("note")}
//                         onPressIn={() => handleTextInputFocus("note")}
//                         onLayout={() => handleTextInputFocus("note")}
//                         maxLength={300} // This is optional to further enforce the limit
//                       />
            
//                   </View>
//                   <View style={styles.wrapper}>
//                     <Text style={[styles.text, styles.textTypo]}>{textInputNote.length}/300</Text>
//                   </View>
//                 </View>
//                 <View
//                   style={[
//                     styles.deliveryInstructionsFrame,
//                     styles.frameSpaceBlock,
//                   ]}
//                 >
//                   <View style={styles.streetFrame}>
//                     <Text style={[styles.addALabel, styles.addALabelTypo]}>
//                       Add a label
//                     </Text>
//                   </View>
//                 </View>
//                 <View
//                   style={[styles.addALabelIconsFrame, styles.frameSpaceBlock]}
//                 >
//                   <Pressable
//                     style={styles.homeBtn}
//                     onPress={() => handleCategoryButtonPress("Label", "Home")}
//                   >
//                     <View
//                       style={
//                         label == "Home"
//                           ? styles.ellipseParentShadowBox1
//                           : styles.ellipseParentShadowBox
//                       }
//                     >
//                       <Image
//                         style={[styles.frameItem, styles.whitePosition]}
//                         contentFit="cover"
//                         source={require("../assets/ellipse-43.png")}
//                       >
//                         <View
//                           style={[
//                             styles.whiteHomeParent,
//                             styles.whiteParentPosition,
//                           ]}
//                         >
//                           {label == "Home" ? (
//                             <Image
//                               style={[styles.whiteHomeIcon, styles.whitePosition]}
//                               contentFit="cover"
//                               source={require("../assets/white-home1.png")}
//                             />
//                           ) : (
//                             <Image
//                               style={[
//                                 styles.blueHomeIcon,
//                                 styles.homeIconPosition,
//                               ]}
//                               contentFit="cover"
//                               source={require("../assets/blue-home1.png")}
//                             />
//                           )}
//                         </View>
//                       </Image>
//                     </View>
//                     <View style={[styles.homeWrapper, styles.wrapperFlexBox]}>
//                       <Text style={[styles.home, styles.homeTypo]}>Home</Text>
//                     </View>
//                   </Pressable>
//                   <Pressable
//                     style={styles.apartmentBtn}
//                     onPress={() =>
//                       handleCategoryButtonPress("Label", "Apartment")
//                     }
//                   >
//                     <View
//                       style={
//                         label == "Apartment"
//                           ? styles.ellipseParentShadowBox1
//                           : styles.ellipseParentShadowBox
//                       }
//                     >
//                       <Image
//                         style={[styles.frameItem, styles.whitePosition]}
//                         contentFit="cover"
//                         source={require("../assets/ellipse-43.png")}
//                       >
//                         <View
//                           style={[
//                             styles.whiteHomeParent,
//                             styles.whiteParentPosition,
//                           ]}
//                         >
//                           {label == "Apartment" ? (
//                             <Image
//                               style={[styles.whiteHomeIcon, styles.whitePosition]}
//                               contentFit="cover"
//                               source={require("../assets/white-condo1.png")}
//                             />
//                           ) : (
//                             <Image
//                               style={[
//                                 styles.blueHomeIcon,
//                                 styles.homeIconPosition,
//                               ]}
//                               contentFit="cover"
//                               source={require("../assets/blue-condo1.png")}
//                             />
//                           )}
//                         </View>
//                       </Image>
//                     </View>
//                     <View style={[styles.homeWrapper, styles.wrapperFlexBox]}>
//                       <Text style={[styles.home, styles.homeTypo]}>
//                         Apartment
//                       </Text>
//                     </View>
//                   </Pressable>
//                   <Pressable
//                     style={styles.apartmentBtn}
//                     onPress={() => handleCategoryButtonPress("Label", "Condo")}
//                   >
//                     <View
//                       style={
//                         label == "Condo"
//                           ? styles.ellipseParentShadowBox1
//                           : styles.ellipseParentShadowBox
//                       }
//                     >
//                       <Image
//                         style={[styles.frameItem, styles.whitePosition]}
//                         contentFit="cover"
//                         source={require("../assets/ellipse-43.png")}
//                       >
//                         <View
//                           style={[
//                             styles.whiteHomeParent,
//                             styles.whiteParentPosition,
//                           ]}
//                         >
//                           {label == "Condo" ? (
//                             <Image
//                               style={[styles.whiteHomeIcon, styles.whitePosition]}
//                               contentFit="cover"
//                               source={require("../assets/white-apartment2.png")}
//                             />
//                           ) : (
//                             <Image
//                               style={[
//                                 styles.blueHomeIcon,
//                                 styles.homeIconPosition,
//                               ]}
//                               contentFit="cover"
//                               source={require("../assets/blue-apartment1.png")}
//                             />
//                           )}
//                         </View>
//                       </Image>
//                     </View>
//                     <View style={[styles.homeWrapper, styles.wrapperFlexBox]}>
//                       <Text style={[styles.home, styles.homeTypo]}>Condo</Text>
//                     </View>
//                   </Pressable>
//                   <Pressable
//                     style={styles.apartmentBtn}
//                     onPress={() => handleCategoryButtonPress("Label", "Others")}
//                   >
//                     <View
//                       style={
//                         label == "Others"
//                           ? styles.ellipseParentShadowBox1
//                           : styles.ellipseParentShadowBox
//                       }
//                     >
//                       <Image
//                         style={[styles.frameItem, styles.whitePosition]}
//                         contentFit="cover"
//                         source={require("../assets/ellipse-43.png")}
//                       >
//                         <View
//                           style={[
//                             styles.whiteHomeParent,
//                             styles.whiteParentPosition,
//                           ]}
//                         >
//                           {label == "Others" ? (
//                             <Image
//                               style={[styles.whiteHomeIcon, styles.whitePosition]}
//                               contentFit="cover"
//                               source={require("../assets/vector11.png")}
//                             />
//                           ) : (
//                             <Image
//                               style={[
//                                 styles.blueHomeIcon,
//                                 styles.homeIconPosition,
//                               ]}
//                               contentFit="cover"
//                               source={require("../assets/vector12.png")}
//                             />
//                           )}
//                         </View>
//                       </Image>
//                     </View>
//                     <View style={[styles.homeWrapper, styles.wrapperFlexBox]}>
//                       <Text style={[styles.home, styles.homeTypo]}>Other</Text>
//                     </View>
//                   </Pressable>
//                 </View>
//               </View>
//             )}
//             {showLabel && (
//               <View style={styles.frameSpaceBlock}>
//                 <Text>Label*</Text>
//                 <View
//                   style={[
//                     styles.componentsSearchDefault1,
//                     styles.componentsFlexBox,
//                   ]}
//                 >
//                     <TextInput
//                       style={[styles.noteInput, styles.textTypo]}
//                       placeholder="e.g. Office, Lobby, Villa, etc."
//                       placeholderTextColor="#b8b8b8"
//                       value={textInputLabel}
//                       onChangeText={(text) => handleInputChange('label', text)}
//                       onFocus={() => handleTextInputFocus("label")}
//                       onBlur={handleTextInputBlur}
//                       onKeyPress={() => handleTextInputFocus("label")}
//                       onPressIn={() => handleTextInputFocus("label")}
//                       onLayout={() => handleTextInputFocus("label")}
//                       onClick={() => handleTextInputFocus("label")}
//                     />
//                 </View>
//               </View>
//             )}

//             {editLocationVisible == true && (
//               <View style={[styles.frameView, styles.frameSpaceBlock]}>
//                 <Pressable
//                   style={styles.componentsbutton}
//                   onPress={
//                     name === "Edit your address"
//                       ? handleEdit
//                       : added
//                       ? handleAddToList
//                       : handleAdd
//                   }
//                 >
//                   <Text style={[styles.viewAllServices, styles.addALabelTypo]}>
//                     {btnName}
//                   </Text>
//                 </Pressable>
//               </View>
//             )}
//           </View>
//         )}
//       </View>
    

//   );
// }

// const styles = StyleSheet.create({
//   // Search Address Styles
//   editLocationContainer: {
//     position: "absolute",
//     bottom: 0,
//     left: 0,
//     right: 0,
//     backgroundColor: "white",
//     paddingVertical: 16,
//     paddingHorizontal: 16,
//     borderRadius: 8,
//     flexDirection: "column",
//     alignItems: "stretch",
//     height: 400,
//   },
//   searchContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//   },
//   editIcon: {
//     width: 16,
//     height: 16,
//   },
//   centeredImageContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   centeredImageTextContainer: {
//     alignItems: "center",
//   },
//   centeredImage: {
//     marginBottom: 10,
//     width: 100,
//     height: 100,
//     resizeMode: "contain",
//   },
//   exploreText: {
//     fontSize: 14,
//     marginTop: 10,
//   },

//   searchAdddresModal: {
//     position: "absolute",
//     bottom: 0,
//     left: 0,
//     right: 0,
//     backgroundColor: "white",
//     paddingVertical: 16,
//     borderRadius: 8,
//     flexDirection: "column",
//     alignSelf: "center",
//     alignItems: "stertch",
//   },
//   frameGroup1: {
//     borderTopLeftRadius: Border.br_5xl,
//     borderTopRightRadius: Border.br_5xl,
//     overflow: "hidden",
//     alignSelf: "stretch",
//     alignItems: "center",
//     backgroundColor: Color.white,
//     position: "absolute",
//     bottom: 0,
//     left: 0,
//     right: 0,
//     paddingTop: 5,
//     flexDirection: "column",
//     flex: 1,
//     zIndex: 5,
//   },
//   frameFlexBox: {
//     paddingTop: Padding.p_5xs,
//     height: 8,
//     justifyContent: "center",
//     alignSelf: "stretch",
//   },
//   frameFlexBox1: {
//     height: 8,
//   },
//   vectorWrapper1: {
//     alignSelf: "stretch",
//   },
//   btnWrapperFlexBox: {
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   frameChild: {
//     width: 42,
//     height: 3,
//   },
//   frameContainer1: {
//     paddingHorizontal: 16,
//     paddingVertical: 5,
//     marginTop: 3,
//     alignSelf: "stretch",
//     alignItems: "center",
//     flexDirection: "column",
//   },
//   componentsSearchDefaultWrapper: {
//     alignSelf: "stretch",
//   },
//   componentsSearchDefault3: {
//     overflow: "hidden",
//     flexDirection: "row",
//     alignSelf: "stretch",
//   },
//   iconOutline1: {
//     flexDirection: "row",
//   },
//   uiIconarrowBackwardfilled1: {
//     overflow: "hidden",
//   },
//   locationTargetIconLayout: {
//     height: 24,
//     width: 24,
//   },
//   componentsSearchDefault2: {
//     borderRadius: Border.br_5xs,
//     marginLeft: 10,
//     flexDirection: "row",
//     flex: 1,
//   },
//   addressFrame: {
//     borderRadius: Border.br_3xs,
//     backgroundColor: Color.colorWhitesmoke_300,
//     paddingLeft: Padding.p_3xs,
//     paddingTop: Padding.p_8xs,
//     paddingRight: Padding.p_5xs,
//     paddingBottom: Padding.p_8xs,
//     flexDirection: "row",
//     alignItems: "center",
//     flex: 1,
//   },
//   enterAddressInput: {
//     fontFamily: FontFamily.montserratRegular,
//     fontSize: FontSize.level2Medium12_size,
//     flexDirection: "row",
//     flex: 1,
//   },
//   closeBtn: {
//     marginLeft: 5,
//     flexDirection: "row",
//   },
//   vectorIcon1: {
//     width: 16,
//     height: 16,
//   },
//   frameView1: {
//     marginTop: 3,
//   },
//   frameItem1: {
//     maxWidth: "100%",
//     overflow: "hidden",
//     width: "100%",
//   },
//   frameLayout: {
//     height: 1.5,
//     alignSelf: "stretch",
//   },
//   frameLayout1: {
//     maxWidth: "100%",
//     overflow: "hidden",
//     width: "100%",
//   },
//   vectorFrame: {
//     display: "none",
//     marginTop: 3,
//     alignItems: "center",
//   },
//   frameInner: {
//     maxHeight: "100%",
//     alignSelf: "stretch",
//     flex: 1,
//   },
//   image2397Icon: {
//     width: 150,
//     height: 150,
//   },
//   enterAnAddressToExploreSeWrapper: {
//     paddingHorizontal: Padding.p_31xl,
//     marginTop: 10,
//     paddingVertical: Padding.p_mini,
//     flexDirection: "row",
//     alignSelf: "stretch",
//   },
//   enterAnAddress: {
//     fontSize: FontSize.m3LabelLarge_size,
//     lineHeight: 15,
//     fontWeight: "500",
//     fontFamily: FontFamily.montserratMedium,
//     color: Color.colorGray_800,
//     textAlign: "center",
//     display: "flex",
//     height: 35,
//     flex: 1,
//   },

//   whiteParentPosition: {
//     padding: Padding.p_3xs,
//     zIndex: 1,
//     position: "absolute",
//     alignItems: "center",
//   },
//   wrapperFlexBox: {
//     // marginTop: 5,
//     flexDirection: "row",
//     alignSelf: "stretch",
//   },
//   addALabelFlexBox: {
//     textAlign: "left",
//     lineHeight: 32,
//   },
//   frameSpaceBlock: {
//     marginTop: 15,
//     alignSelf: "stretch",
//   },
//   componentsFlexBox: {
//     paddingBottom: Padding.p_3xs,
//     paddingTop: Padding.p_3xs,
//     paddingLeft: Padding.p_8xs,
//     borderRadius: Border.br_5xs,
//     overflow: "hidden",
//     justifyContent: "center",
//     flexDirection: "row",
//     alignSelf: "stretch",
//     alignItems: "center",
//   },
//   homeTypo: {
//     fontFamily: FontFamily.montserratSemiBold,
//     fontWeight: "600",
//     lineHeight: 15,
//     textAlign: "left",
//   },
//   cebuClr: {
//     color: Color.colorSilver_300,
//     lineHeight: 15,
//   },
//   pencil1Position: {
//     height: 20,
//     width: 20,
//     left: -10,
//     top: -10,
//     position: "absolute",
//   },
//   textTypo: {
//     fontFamily: FontFamily.montserratRegular,
//     fontSize: FontSize.typographyTaglineSmallRegular_size,
//   },
//   cebuTypo: {
//     fontFamily: FontFamily.montserratMedium,
//     fontWeight: "500",
//     textAlign: "left",
//   },
//   addALabelTypo: {
//     fontFamily: FontFamily.title2Bold32,
//     fontSize: FontSize.body1Semibold_size,
//     fontWeight: "700",
//   },
//   whitePosition: {
//     zIndex: 0,
//   },
//   homeIconPosition: {
//     left: 10,
//     height: 30,
//     width: 30,
//     top: 10,
//     position: "absolute",
//   },
//   addPosition: {
//     left: 2,
//     top: 2,
//     overflow: "hidden",
//     justifyContent: "center",
//     flexDirection: "row",
//     position: "absolute",
//     alignItems: "center",
//   },
//   uiIconarrowBackwardfilled: {
//     width: 24,
//     height: 24,
//   },
//   backBtn: {
//     borderRadius: Border.br_xl,
//     width: 40,
//     height: 40,
//     paddingHorizontal: Padding.p_xs,
//     paddingVertical: Padding.p_9xs,
//     justifyContent: "center",
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: Color.white,
//   },
//   backBtnWrapper: {
//     left: 16,
//     paddingVertical: Padding.p_mini,
//     zIndex: 0,
//     paddingHorizontal: 0,
//     flexDirection: "row",
//     top: 0,
//     position: "absolute",
//   },
//   frameItemLayout: {
//     height: 50,
//     width: 50,
//   },
//   icons8Location10021Wrapper: {
//     top: 252,
//     left: 28,
//     zIndex: 1,
//     overflow: "hidden",
//     justifyContent: "flex-end",
//   },
//   vectorWrapper: {
//     width: 342,
//     height: 2,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   editYourAddress: {
//     fontSize: FontSize.size_mid,
//     fontFamily: FontFamily.montserratBold,
//     display: "flex",
//     width: 253,
//     color: Color.colorGray_800,
//     fontWeight: "700",
//     textAlign: "left",
//     lineHeight: 32,
//     height: 24,
//     alignItems: "center",
//   },
//   editYourAddressWrapper: {
//     alignItems: "center",
//   },
//   frameContainer: {
//     paddingTop: Padding.p_5xs,
//     justifyContent: "flex-end",
//     alignSelf: "stretch",
//   },
//   locationIcon: {
//     height: 30,
//     width: 30,
//   },
//   iconOutline: {
//     justifyContent: "center",
//     flexDirection: "row",
//     alignItems: "center",
//   },
//   barangayNasipitTalamban: {
//     color: Color.colorDarkgray_300,
//     fontSize: FontSize.m3LabelLarge_size,
//     fontFamily: FontFamily.montserratSemiBold,
//     alignSelf: "stretch",
//   },
//   cebu: {
//     fontSize: FontSize.level2Medium12_size,
//     fontFamily: FontFamily.montserratMedium,
//     fontWeight: "500",
//     textAlign: "left",
//     alignSelf: "stretch",
//   },
//   barangayNasipitTalambanCeParent: {
//     marginLeft: 10,
//     overflow: "hidden",
//     flex: 1,
//   },
//   pencil1Wrapper: {
//     zIndex: 0,
//   },
//   componentsSearchDefaultInner: {
//     marginLeft: 10,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   componentsSearchDefault: {
//     paddingRight: Padding.p_10xs,
//   },
//   editBtn: {
//     justifyContent: "flex-end",
//   },
//   noteInput: {
//     paddingHorizontal: Padding.p_3xs,
//     paddingVertical: 0,
//     fontSize: FontSize.typographyTaglineSmallRegular_size,
//     overflow: "hidden",
//     justifyContent: "center",
//     alignSelf: "stretch",
//     flex: 1,
//   },
//   componentsSearchDefault1: {
//     borderStyle: "solid",
//     borderColor: Color.colorDarkgray_100,
//     borderWidth: 1,
//     height: 48,
//     paddingRight: Padding.p_3xs,
//   },
//   streetFrame: {
//     flex: 1,
//   },
//   houseNumberFrame: {
//     marginLeft: 15,
//     flex: 1,
//   },
//   streetFrameParent: {
//     justifyContent: "center",
//     flexDirection: "row",
//     alignSelf: "stretch",
//   },
//   serviceProviderInstructions: {
//     fontFamily: FontFamily.level2Semibold12,
//     fontWeight: "600",
//     lineHeight: 15,
//     fontSize: FontSize.m3LabelLarge_size,
//     textAlign: "left",
//     color: Color.colorGray_800,
//   },
//   giveUsMore: {
//     fontSize: FontSize.level2Medium12_size,
//     color: Color.colorDimgray_100,
//     marginTop: 3,
//     lineHeight: 15,
//     fontFamily: FontFamily.montserratMedium,
//     fontWeight: "500",
//   },
//   deliveryInstructionsFrame: {
//     justifyContent: "center",
//     flexDirection: "row",
//     alignItems: "center",
//   },
//   text: {
//     textAlign: "right",
//     fontSize: FontSize.typographyTaglineSmallRegular_size,
//     color: Color.colorSilver_300,
//     lineHeight: 15,
//   },
//   wrapper: {
//     marginTop: 1,
//     flexDirection: "row",
//     justifyContent: "flex-end",
//     alignSelf: "stretch",
//   },
//   addALabel: {
//     color: Color.colorBlack,
//     textAlign: "left",
//     lineHeight: 32,
//     fontFamily: FontFamily.title2Bold32,
//     fontSize: FontSize.body1Semibold_size,
//     alignSelf: "stretch",
//   },
//   frameItem: {
//     height: 50,
//     width: 50,
//   },
//   whiteHomeIcon: {
//     left: 10,
//     height: 30,
//     width: 30,
//     top: 10,
//     position: "absolute",
//   },
//   blueHomeIcon: {
//     zIndex: 1,
//   },
//   whiteHomeParent: {
//     top: 10,
//     left: 10,
//     zIndex: 1,
//     justifyContent: "center",
//   },
//   ellipseParentShadowBox: {
//     shadowOpacity: 1,
//     elevation: 4,
//     shadowRadius: 4,
//     shadowOffset: {
//       width: 0,
//       height: 4,
//     },
//     shadowColor: "rgba(0, 0, 0, 0.75)",
//     borderRadius: Border.br_11xl,
//     height: 50,
//     width: 50,
//     justifyContent: "center",
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: Color.white,
//     zIndex: 1,
//   },
//   ellipseParentShadowBox1: {
//     shadowOpacity: 1,
//     elevation: 6,
//     shadowRadius: 4,
//     shadowOffset: {
//       width: 0,
//       height: 4,
//     },
//     shadowColor: "rgba(0, 0, 0, 1)",
//     borderRadius: Border.br_11xl,
//     height: 50,
//     width: 50,
//     justifyContent: "center",
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: Color.colorDarkslategray_900,
//     zIndex: 1,
//   },
//   home: {
//     fontSize: FontSize.typographyTaglineSmallRegular_size,
//     color: Color.colorGray_800,
//   },
//   homeWrapper: {
//     paddingVertical: Padding.p_8xs,
//     justifyContent: "center",
//     paddingHorizontal: 0,
//   },
//   homeBtn: {
//     justifyContent: "center",
//     alignItems: "center",
//     flex: 1,
//   },
//   apartmentBtn: {
//     marginLeft: 10,
//     justifyContent: "center",
//     alignItems: "center",
//     flex: 1,
//   },
//   whiteAdd: {
//     display: "none",
//     zIndex: 0,
//   },
//   blueAdd: {
//     zIndex: 1,
//   },
//   whiteAddParent: {
//     top: 9,
//     left: 8,
//     zIndex: 1,
//     justifyContent: "center",
//   },
//   addALabelIconsFrame: {
//     flexDirection: "row",
//     alignItems: "center",
//   },
//   frameView: {
//     justifyContent: "flex-end",
//     alignItems: "center",
//   },
//   viewAllServices: {
//     letterSpacing: -0.1,
//     lineHeight: 24,
//     color: Color.neutral01,
//     textAlign: "center",
//   },
//   componentsbutton: {
//     borderRadius: Border.br_mini,
//     backgroundColor: Color.colorDarkslategray_900,
//     // width: 343,
//     paddingHorizontal: Padding.p_3xl,
//     paddingVertical: Padding.p_xs,
//     justifyContent: "center",
//     flexDirection: "row",
//     alignItems: "center",
//     alignSelf: "stretch",
//   },
//   frameGroup: {
//     borderTopLeftRadius: Border.br_5xl,
//     borderTopRightRadius: Border.br_5xl,
//     paddingHorizontal: Padding.p_base,
//     paddingBottom: Padding.p_mini,
//     alignSelf: "stretch",
//     alignItems: "center",
//     backgroundColor: Color.white,
//   },
//   editAddressModal: {
//     zIndex: 5,
//     justifyContent: "flex-end",
//     alignSelf: "stretch",
//     alignItems: "center",
//   },
//   frameParent: {
//     justifyContent: "flex-end",
//     alignSelf: "stretch",
//     alignItems: "center",
//     flex: 1,
//   },
//   frameParent1: {
//     paddingTop: 30,
//     justifyContent: "flex-start",
//     alignSelf: "stretch",
//     alignItems: "center",
//     flex: 1,
//   },
//   body: {
//     justifyContent: "flex-end",
//     alignSelf: "stretch",
//     alignItems: "center",
//     flex: 1,
//   },
//   editAddressIconComplete: {
//     width: "100%",
//     height: 812,
//     alignItems: "center",
//     flex: 1,
//     backgroundColor: Color.white,
//   },
//   // for searching autocomplte

//   editAddressModalSearch: {
//     zIndex: 5,
//     justifyContent: "flex-end",
//     alignSelf: "stretch",
//     alignItems: "center",
//   },

//   frameGroupSearch: {
//     borderTopLeftRadius: Border.br_5xl,
//     borderTopRightRadius: Border.br_5xl,
//     // paddingHorizontal: Padding.p_base,
//     paddingBottom: 60,
//     alignSelf: "stretch",
//     alignItems: "center",
//     backgroundColor: Color.white,
//   },

//   frameContainerSearch: {
//     paddingTop: Padding.p_5xs,
//     justifyContent: "flex-end",
//     alignSelf: "stretch",
//     position: "relative",
//     alignItems: "center",
//     flex: 1,
//   },
//   frameFlexBox1Search: {
//     // paddingTop: Padding.p_5xs,
//     height: 8,
//     // justifyContent: "center",
//     // alignSelf: "stretch",
//   },
//   vectorWrapper1Search: {
//     // height: 0,
//     alignSelf: "stretch",
//   },
//   btnWrapperFlexBoxSearch: {
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   frameChildSearch: {
//     width: 42,
//     height: 3,
//   },
//   frameContainer1Search: {
//     paddingHorizontal: 16,
//     paddingVertical: 5,
//     marginTop: 3,
//     alignSelf: "stretch",
//     alignItems: "center",
//     flex: 1,
//     // flexDirection: "column",
//   },
//   componentsSearchDefaultWrapperSearch: {
//     alignSelf: "stretch",
//   },
//   btnWrapperFlexBoxSearch: {
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   iconOutline1Search: {
//     flexDirection: "row",
//   },
//   btnWrapperFlexBoxSearch: {
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   uiIconarrowBackwardfilled1Search: {
//     overflow: "hidden",
//   },
//   locationTargetIconLayoutSearch: {
//     height: 24,
//     width: 24,
//   },
//   componentsSearchDefault2Search: {
//     borderRadius: Border.br_5xs,
//     marginLeft: 10,
//     flexDirection: "row",
//     flex: 1,
//   },
//   btnWrapperFlexBoxSearch: {
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   componentsSearchDefault3Search: {
//     flexDirection: "row",
//   },
//   backBtnWrapperSearch: {
//     paddingVertical: Padding.p_mini,
//     zIndex: 0,
//     paddingHorizontal: 0,
//     flexDirection: "row",
//     top: 0,
//     marginRight: 10,
//   },
//   frameViewSearch: {
//     justifyContent: "flex-end",
//     alignItems: "center",
//   },
//   frameFlexBoxSearch: {
//     paddingTop: Padding.p_5xs,
//     height: 8,
//     justifyContent: "center",
//     alignSelf: "stretch",
//   },
//   vectorWrapper1Search: {
//     alignSelf: "stretch",
//   },
//   btnWrapperFlexBoxSearch: {
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   frameItem1Search: {
//     maxWidth: "100%",
//     overflow: "hidden",
//     width: "100%",
//   },
//   frameLayoutSearch: {
//     height: 1.5,
//     alignSelf: "stretch",
//   },
//   frameParent1Search: {
//     paddingTop: 30,
//     justifyContent: "flex-start",
//     alignSelf: "stretch",
//     alignItems: "center",
//   },
//   image2397IconSearch: {
//     width: 150,
//     height: 150,
//   },
//   enterAnAddressToExploreSeWrapperSearch: {
//     paddingHorizontal: Padding.p_31xl,
//     marginTop: 10,
//     paddingVertical: Padding.p_mini,
//     flexDirection: "row",
//     alignSelf: "stretch",
//   },
//   btnWrapperFlexBoxSearch: {
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   enterAnAddressSearch: {
//     fontSize: FontSize.m3LabelLarge_size,
//     lineHeight: 15,
//     fontWeight: "500",
//     fontFamily: FontFamily.montserratMedium,
//     color: Color.colorGray_800,
//     textAlign: "center",
//     display: "flex",
//     height: 35,
//     flex: 1,
//   },
//   btnWrapperFlexBoxSearch: {
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   hiddenFrameSearch: {
//     display: "flex",
//     marginTop: 255,
//     justifyContent: "flex-start",
//     alignSelf: "stretch",
//     alignItems: "center",
//     flex: 5,
//   },
//   frameParent2Search: {
//     display: "none",
//     paddingTop: 30,
//     justifyContent: "flex-start",
//     alignSelf: "stretch",
//     alignItems: "center",
//     // flex: 1,
//   },
//   image2397IconSearch: {
//     width: 150,
//     height: 150,
//   },
//   enterAnAddressToExploreSeWrapperSearch: {
//     paddingHorizontal: Padding.p_31xl,
//     marginTop: 10,
//     paddingVertical: Padding.p_mini,
//     flexDirection: "row",
//     alignSelf: "stretch",
//   },
//   btnWrapperFlexBoxSearch: {
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   enterAnAddressSearch: {
//     fontSize: FontSize.m3LabelLarge_size,
//     lineHeight: 15,
//     fontWeight: "500",
//     fontFamily: FontFamily.montserratMedium,
//     color: Color.colorGray_800,
//     textAlign: "center",
//     display: "flex",
//     height: 35,
//     flex: 1,
//   },
//   btnWrapperFlexBoxSearch: {
//     justifyContent: "center",
//     alignItems: "center",
//   },
// });
