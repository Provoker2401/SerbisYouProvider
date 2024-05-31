import * as React from "react";
import {
  StatusBar,
  StyleSheet,
  Pressable,
  TouchableOpacity,
  View,
  Modal,
  Text,
  Dimensions,
  TextInput,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  SafeAreaView,
} from "react-native";
import { useState, useEffect, useRef, useContext } from "react";
import { Image } from "expo-image";
import { useNavigation } from "@react-navigation/native";
import { Padding, Border, FontFamily, Color, FontSize } from "../GlobalStyles";
// import EditAddress from "./EditAddress";
import MapView, { Marker } from "react-native-maps";
import axios from "axios";
import * as Location from "expo-location";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import EditAddressModal from "../components/EditAddressModal";
import { AddressSelectedContext } from "../AddressSelectedContext";

const EditAddressIconComplete = ({ route }) => {
  const navigation = useNavigation();
  const ref = useRef();

  // From MultipleLocationModal or Addresses
  const [selectedLoc, setSelectedLoc] = useState(route.params?.loc);
  const [selectedCity, setSelectedCity] = useState(route.params?.city);
  const [selectedCoordinates, setSelectedCoordinates] = useState(route.params?.coordinates);
  const [selectedLabel, setSelectedLabel] = useState(route.params?.label);
  const [selectedValue, setSelectedValue] = useState(route.params?.value);

  const { currentFocus } = useContext(AddressSelectedContext);
  const [keyboardOffset, setKeyboardOffset] = useState();

  // From EditAddressModal
  const [addedMarkerChange, setAddedMarkerChange] = useState(
    route.params?.checkMarkerChange
  );
  const [addedCityAddress, setAddedCityAddress] = useState(
    route.params?.addedCityAddress
  );
  const [addedSpecificLocation, setAddedSpecificLocation] = useState(
    route.params?.addedSpecificLocation
  );
  const [addedCoordinates, setAddedCoordinates] = useState(
    route.params?.addedCoordinates
  );
  const [confirmAdd, setConfirmAdd] = useState(
    route.params?.addedFlag
  );

  const [modalVisible, setModalVisible] = useState(false);
  
  const [isInputFocused, setIsInputFocused] = useState(false);
  const screenHeight = Dimensions.get("window").height;

  const editLocationContainerHeight = screenHeight * 0.5;

  const [initialMapRegion, setInitialMapRegion] = useState({
    latitude: addedCoordinates? addedCoordinates.latitude - 0.0030 : selectedCoordinates.latitude - 0.0030,
    longitude: addedCoordinates ? addedCoordinates.longitude : selectedCoordinates.longitude,
    // latitudeDelta: 0.1922,
    // longitudeDelta: 0.0421,
    latitudeDelta: 0.0041,
    longitudeDelta: 0.0041,
  });

  const [initialMarkerPosition, setInitialMarkerPosition] = useState({
    latitude: addedCoordinates? addedCoordinates.latitude : selectedCoordinates.latitude,
    longitude: addedCoordinates ? addedCoordinates.longitude : selectedCoordinates.longitude,
  });

  const [markerPosition, setMarkerPosition] = useState(initialMarkerPosition);
  const [reverseGeocodedAddress, setReverseGeocodedAddress] = useState(null);
  const [editLocationVisible, setEditLocationVisible] = useState(false);
  const [cityAddress, setCityAddress] = useState(null);

  const handleMarkerDragEnd = (event) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setMarkerPosition({ latitude, longitude });
  };

  const fetchReverseGeolocation = async (latitude, longitude) => {
    try {
      // const apiKey = "apiKey";
      const apiKey = "AIzaSyAuaR8dxr95SLUTU-cidS7I-3uB6mEoJmA";
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`
      );
      if (response.data.results && response.data.results.length > 0) {
        const firstResult = response.data.results[0];
        const formattedAddress = firstResult.formatted_address;

        // Extracting the city from the formatted address
        const addressComponents = firstResult.address_components;
        let city = "";
        for (const component of addressComponents) {
          if (component.types.includes("locality")) {
            city = component.long_name;
            break;
          }
        }
        setReverseGeocodedAddress(formattedAddress);
        setCityAddress(city);
        console.log("City:", city);
      } else {
        setReverseGeocodedAddress("Location not found");
        console.log("Location not found");
      }
    } catch (error) {
      console.error("Error fetching reverse geolocation:", error);
    }
  };

  const gotoUserLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status === "granted") {
        const location = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = location.coords;
        setMarkerPosition({ latitude, longitude });
        setInitialMapRegion({
          latitude,
          longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
        setInitialMarkerPosition({ latitude, longitude });
        fetchReverseGeolocation(latitude, longitude);
      } else {
        console.error("Location permission denied");
      }
    } catch (error) {
      console.error("Error getting user location:", error);
    }
  };

  const goToMarker = () => {
    setInitialMapRegion({
      ...markerPosition,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    });
  };

  useEffect(() => {
    if (markerPosition) {
      fetchReverseGeolocation(
        markerPosition.latitude,
        markerPosition.longitude
      );
    }
    console.log("Is TextInput focused:", isInputFocused);
  }, [markerPosition, isInputFocused]);

  const handlePlaceSelect = (data, details = null) => {
    if (details) {
      const { lat, lng } = details.geometry.location;
      setMarkerPosition({ latitude: lat, longitude: lng });
      setInitialMapRegion({
        latitude: lat,
        longitude: lng,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
      setEditLocationVisible(false);
    }
  };

  // const keyboardOffset = () => {
  //   if (Platform.OS === "ios") {
  //     return 60;
  //   }else{
  //     console.log("Is Text Input Clicked: " ,isTextInputClicked);
  //     if(isTextInputClicked == true){
  //       return -240;
  //     }
  //     return 160;
  //   }
  // };

  // useEffect(() => {
  //   console.log("Street Input Clicked: " ,isStreetInputClicked);
  //   console.log("House Number Input Clicked: " ,isHNumberInputClicked);
  //   console.log("Floor Input Clicked: " ,isFloorInputClicked);
  //   console.log("Note Input Clicked: " ,isNoteInputClicked); 
  //   console.log("Label Input Clicked: " ,isLabelInputClicked); 
  //   if (isStreetInputClicked) {
  //     // When isTextInputClicked is false, set the default keyboard offset
  //     setKeyboardOffset(-300);
  //   } else if(isHNumberInputClicked) {
  //     // When isTextInputClicked is true, set the desired offset value
  //     setKeyboardOffset(-260);
  //   } else if(isFloorInputClicked) {
  //     // When isTextInputClicked is true, set the desired offset value
  //     setKeyboardOffset(-200);
  //   } else if(isLabelInputClicked) {
  //     // When isTextInputClicked is true, set the desired offset value
  //     setKeyboardOffset(-80);
  //   }
  // }, []);

  // useEffect(() => {
  //   const keyboardDidShowListener = Keyboard.addListener(
  //     'keyboardDidShow',
  //     () => {
  //       const offset = keyboardOffset();
  //       // Use the offset value as needed, e.g., to adjust the UI.
  //       console.log('Keyboard did show with offset:', offset);
  //       return offset;
  //     }
  //   );

  //   // Clean up the event listener when the component unmounts
  //   return () => {
  //     keyboardDidShowListener.remove();
  //   };
  // }, [isTextInputClicked]);

  // Directly set the offset based on which input is focused
  // useEffect(() => {
  //   const keyboardDidShowListener = Keyboard.addListener(
  //     'keyboardDidShow',
  //     (e) => {
  //       const offset = calculateOffset(currentFocus);
  //       console.log('Device Height:', e.endCoordinates.height);
  //       console.log('Keyboard did show with offset:', offset);
  //       setKeyboardOffset(offset);
  //     }
  //   );
  //   const keyboardDidHideListener = Keyboard.addListener(
  //     'keyboardDidHide',
  //     () => {
  //       setKeyboardOffset(0);
  //     }
  //   );
  
  //   return () => {
  //     keyboardDidShowListener.remove();
  //     keyboardDidHideListener.remove();
  //   };
  // }, [currentFocus]);
  
  // const calculateOffset = (inputType) => {
  //   // You may not need a baseOffset if you're using the keyboardHeight directly
  //   let additionalOffset = -50;
  
  //   switch (inputType) {
  //     case 'street' :
  //       // No additional offset might be needed if this is high up on the screen
  //       additionalOffset = -145;
  //       break;
  //     case 'houseNumber':
  //       // You might add a small additional offset if needed
  //       additionalOffset = -145;
  //       break;
  //     case 'floor':
  //       // Likely the same as houseNumber
  //       additionalOffset = -145;
  //       break;
  //     case 'note':
  //       // This might be at the very bottom, so you want to ensure it's above the keyboard
  //       additionalOffset = -140;
  //       break;
  //     case 'label':
  //       // This might be at the very bottom, so you want to ensure it's above the keyboard
  //       additionalOffset = -35;
  //       break;
  //     default:
  //       additionalOffset = -35;
  //   }
  
  //   // The total offset is the height of the keyboard plus any additional space you want
  //   return additionalOffset;
  // };
  
  return (
    // <KeyboardAvoidingView
    // style={{ flex: 1 }}
    // behavior={Platform.OS === "ios" ? "padding" : "height"}
    // keyboardVerticalOffset={keyboardOffset}
    // // keyboardVerticalOffset={Platform.OS === "ios" ? 60 : -120}
    // >
    <View style={{ flex: 1 }}>
        <StatusBar barStyle="default" />
        <View style={styles.body}>
          <View style={styles.rowContainer}>
            <MapView
              style={styles.map}
              region={initialMapRegion}
              // onPress={handleMapPress}
              // provider={PROVIDER_GOOGLE}
            >
              <Marker
                coordinate={markerPosition}
                title="Pinned Location"
                draggable={true}
                onDragEnd={handleMarkerDragEnd}
                image={require("../assets/icons8location100-2-1.png")}
              />
            </MapView>
          </View>

          <TouchableOpacity
            style={styles.locationButton}
            onPress={gotoUserLocation}
          >
            <Image source={require("../assets/location-target2.png")} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.goToMarkerButton} onPress={goToMarker}>
            <Text>Go to Marker</Text>
          </TouchableOpacity>

          <View style={styles.infoContainer}>
            <Image
              style={styles.infoIcon}
              source={require("../assets/location-icon1.png")}
            />
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoTitle}>
                {markerPosition.latitude.toFixed(6)}
              </Text>
              <Text style={styles.infoSubtitle}>
                {reverseGeocodedAddress || "Loading..."}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.editIconContainer}
              onPress={() => setEditLocationVisible(!editLocationVisible)}
            >
              <Image
                style={styles.editIcon}
                source={require("../assets/pencil-11.png")}
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.saveButton}>
            <Text style={styles.saveButtonText}>Save Address</Text>
          </TouchableOpacity>

          {editLocationVisible && (
            <View
              style={[
                styles.editLocationContainer,
                { height: editLocationContainerHeight },
              ]}
            >
              <View style={styles.searchContainer}>
                <TouchableOpacity
                  onPress={() => {
                    setEditLocationVisible(!editLocationVisible);
                  }}
                >
                  <Image
                    style={styles.editIcon}
                    source={require("../assets/icon24pxback-arrow1.png")}
                  />
                </TouchableOpacity>

                <GooglePlacesAutocomplete
                  ref={ref}
                  enablePoweredByContainer={false} // Disable "Powered by Google" logo
                  placeholder="Enter your address"
                  onPress={(data, details = null) =>
                    handlePlaceSelect(data, details)
                  }
                  query={{
                    key: "AIzaSyBeZMkWh5O-VLFnVvRJw13qwXK6xDyiYrQ",
                    language: "en",
                    components: "country:PH",
                  }}
                  fetchDetails={true}
                  styles={{
                    container: {
                      flex: 1,
                    },
                    listView: {
                      position: "absolute",
                      top: 45,
                      width: "100%",
                    },
                    separator: {
                      backgroundColor: "#ddd",
                      height: 1,
                    },
                    textInput: {
                      backgroundColor: "#e5e6e9",
                      color: "black",
                      marginLeft: 10,
                    },
                    textInput: {
                      height: 38,
                      color: "black",
                      fontSize: 16,
                    },
                    row: {
                      backgroundColor: "white",
                      flexDirection: "row",
                      alignItems: "center",
                    },
                  }}
                  textInputProps={{
                    onFocus: handleInputFocus,
                    onBlur: handleInputBlur,
                    onChangeText: handleAddressInputChange,
                  }}
                />
              </View>
            </View>
          )}
          <View style={styles.backBtnWrapper}>
            <Pressable style={styles.backBtn} onPress={() => navigation.goBack()}>
              <Image
                style={styles.uiIconarrowBackwardfilled}
                contentFit="cover"
                source={require("../assets/ui-iconarrow-backwardfilled.png")}
              />
            </Pressable>
          </View>
          <SafeAreaView style={styles.editLocationModal}>
            <EditAddressModal
              noInputDefaultPosition="unset"
              noInputDefaultZIndex={1}
              selectedLocation={selectedLoc}
              selectedCity={selectedCity}
              selectedCoordinates={selectedCoordinates}
              selectedLabel={selectedLabel}
              selectedValue={selectedValue}
              editAddress={true}
              body={true}
              name="Edit your address"
              btnName="Save and Continue"
            />
          </SafeAreaView>

          {addedMarkerChange && (
            <SafeAreaView style={styles.editLocationModal}>
              {console.log("location: ", addedSpecificLocation)} 
              {console.log("added flag: ", confirmAdd)} 
              <EditAddressModal
                noInputDefaultPosition="unset"
                noInputDefaultZIndex={1}
                addedSpecificLocation={addedSpecificLocation}
                addedCityAddress={addedCityAddress}
                addedCoordinates={addedCoordinates}
                editAddress={true}
                body={true} 
                name="Add a new address"
                btnName="Save and Continue"
                addedFlag={true}
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
              />
            </SafeAreaView>
          )}
        </View>
    </View>
    // </KeyboardAvoidingView>

  );
};

const styles = StyleSheet.create({
  editLocationModal: {
    position: "absolute",
    width: "100%",
    height: "auto",
  },
  container: {
    flex: 1,
  },
  rowContainer: {
    flex: 1,
    flexDirection: "row",
  },
  map: {
    flex: 1,
  },
  infoContainer: {
    position: "absolute",
    bottom: 50,
    left: 16,
    right: 16,
    backgroundColor: "white",
    padding: 16,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    height: "auto",
    flexDirection: "row",
    alignItems: "center",
  },
  infoIcon: {
    width: 24,
    height: 24,
    marginRight: 8,
  },
  infoTextContainer: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  infoSubtitle: {
    fontSize: 14,
    color: "gray",
  },
  editIconContainer: {
    marginLeft: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#f0f0f0",
    alignItems: "center",
    justifyContent: "center",
  },
  editIcon: {
    width: 16,
    height: 16,
  },
  locationButton: {
    position: "absolute",
    bottom: 190,
    right: 20,
    width: 50,
    height: 50,
  },
  goToMarkerButton: {
    position: "absolute",
    bottom: 270,
    right: 20,
    padding: 3,
    backgroundColor: "#fff",
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  saveButton: {
    position: "absolute",
    bottom: 4,
    alignSelf: "center",
    backgroundColor: "#007AFF",
    paddingHorizontal: 80,
    paddingVertical: 10,
    borderRadius: 8,
  },
  saveButtonText: {
    color: "white",
    fontWeight: "bold",
  },
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
  row: {
    backgroundColor: "white",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },
  iconImage: {
    width: 24,
    height: 24,
    marginRight: 12,
  },
  rowText: {
    fontSize: 16,
  },
  whiteParentPosition: {
    padding: Padding.p_3xs,
    zIndex: 1,
    position: "absolute",
    alignItems: "center",
  },
  wrapperFlexBox: {
    marginTop: 10,
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
    left: 0,
    top: 0,
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
    fontSize: 15,
    fontWeight: "700",
  },
  whitePosition: {
    display: "none",
    zIndex: 0,
  },
  homeIconPosition: {
    left: 0,
    height: 30,
    width: 30,
    top: 0,
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
    paddingVertical: Padding.p_mini,
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
  frameChild: {
    width: 41,
    height: 3,
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
    fontSize: FontSize.size_3xs,
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
    left: 0,
    height: 30,
    width: 30,
    top: 0,
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
    shadowColor: "rgba(0, 0, 0, 0.25)",
    borderRadius: Border.br_11xl,
    height: 50,
    width: 50,
    justifyContent: "center",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Color.m3White,
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
    width: 343,
    paddingHorizontal: Padding.p_3xl,
    paddingVertical: Padding.p_xs,
    justifyContent: "center",
    flexDirection: "row",
    alignItems: "center",
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
    zIndex: 2,
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
    // backgroundColor: Color.white,
  },
});

export default EditAddressIconComplete;





// NOTE: THIS IS THE ORIGINAL VERSION USING KEYBOARDAVOIDINGVIEW



// import * as React from "react";
// import {
//   StatusBar,
//   StyleSheet,
//   Pressable,
//   TouchableOpacity,
//   View,
//   Modal,
//   Text,
//   Dimensions,
//   TextInput,
//   ImageBackground,
//   KeyboardAvoidingView,
//   Platform,
//   Keyboard,
// } from "react-native";
// import { useState, useEffect, useRef, useContext } from "react";
// import { Image } from "expo-image";
// import { useNavigation } from "@react-navigation/native";
// import { Padding, Border, FontFamily, Color, FontSize } from "../GlobalStyles";
// // import EditAddress from "./EditAddress";
// import MapView, { Marker } from "react-native-maps";
// import axios from "axios";
// import * as Location from "expo-location";
// import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
// import EditAddressModal from "../components/EditAddressModal";
// import { AddressSelectedContext } from "../AddressSelectedContext";

// const EditAddressIconComplete = ({ route }) => {
//   const navigation = useNavigation();
//   const ref = useRef();

//   // From MultipleLocationModal
//   const [selectedLoc, setSelectedLoc] = useState(route.params?.loc);
//   const [selectedCity, setSelectedCity] = useState(route.params?.city);
//   const [selectedCoordinates, setSelectedCoordinates] = useState(route.params?.coordinates);
//   const [selectedFloor, setSelectedFloor] = useState(route.params?.floor);
//   const [selectedHouseNumber, setSelectedHouseNumber] = useState(route.params?.houseNumber);
//   const [selectedLabel, setSelectedLabel] = useState(route.params?.label);
//   const [selectedOtherLabel, setSelectedOtherLabel] = useState(route.params?.otherLabel);
//   const [selectedNote, setSelectedNote] = useState(route.params?.note);
//   const [selectedStreet, setSelectedStreet] = useState(route.params?.street);
//   const [selectedValue, setSelectedValue] = useState(route.params?.value);

  
//   const { currentFocus } = useContext(AddressSelectedContext);
//   const [keyboardOffset, setKeyboardOffset] = useState();

//   // From EditAddressModal
//   const [addedMarkerChange, setAddedMarkerChange] = useState(
//     route.params?.checkMarkerChange
//   );
//   const [addedCityAddress, setAddedCityAddress] = useState(
//     route.params?.addedCityAddress
//   );
//   const [addedSpecificLocation, setAddedSpecificLocation] = useState(
//     route.params?.addedSpecificLocation
//   );
//   const [addedCoordinates, setAddedCoordinates] = useState(
//     route.params?.addedCoordinates
//   );
//   const [confirmAdd, setConfirmAdd] = useState(
//     route.params?.addedFlag
//   );

//   const [modalVisible, setModalVisible] = useState(false);
  
//   const [isInputFocused, setIsInputFocused] = useState(false);
//   const screenHeight = Dimensions.get("window").height;

//   const [showExploreContainer, setShowExploreContainer] = useState(true);
//   const editLocationContainerHeight = screenHeight * 0.5;

//   const [initialMapRegion, setInitialMapRegion] = useState({
//     latitude: addedCoordinates? addedCoordinates.latitude - 0.0030 : selectedCoordinates.latitude - 0.0030,
//     longitude: addedCoordinates ? addedCoordinates.longitude : selectedCoordinates.longitude,
//     // latitudeDelta: 0.1922,
//     // longitudeDelta: 0.0421,
//     latitudeDelta: 0.0041,
//     longitudeDelta: 0.0041,
//   });

//   const [initialMarkerPosition, setInitialMarkerPosition] = useState({
//     latitude: addedCoordinates? addedCoordinates.latitude : selectedCoordinates.latitude,
//     longitude: addedCoordinates ? addedCoordinates.longitude : selectedCoordinates.longitude,
//   });

//   const [markerPosition, setMarkerPosition] = useState(initialMarkerPosition);
//   const [reverseGeocodedAddress, setReverseGeocodedAddress] = useState(null);
//   const [editLocationVisible, setEditLocationVisible] = useState(false);
//   const [cityAddress, setCityAddress] = useState(null);

//   const handleMapPress = (event) => {
//     const { latitude, longitude } = event.nativeEvent.coordinate;
//     setMarkerPosition({ latitude, longitude });
//   };

//   const handleMarkerDragEnd = (event) => {
//     const { latitude, longitude } = event.nativeEvent.coordinate;
//     setMarkerPosition({ latitude, longitude });
//   };

//   const fetchReverseGeolocation = async (latitude, longitude) => {
//     try {
//       // const apiKey = "apiKey";
//       const apiKey = "AIzaSyAuaR8dxr95SLUTU-cidS7I-3uB6mEoJmA";
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
//         setCityAddress(city);
//         console.log("City:", city);
//       } else {
//         setReverseGeocodedAddress("Location not found");
//         console.log("Location not found");
//       }
//     } catch (error) {
//       console.error("Error fetching reverse geolocation:", error);
//     }
//   };

//   const gotoUserLocation = async () => {
//     try {
//       const { status } = await Location.requestForegroundPermissionsAsync();

//       if (status === "granted") {
//         const location = await Location.getCurrentPositionAsync({});
//         const { latitude, longitude } = location.coords;
//         setMarkerPosition({ latitude, longitude });
//         setInitialMapRegion({
//           latitude,
//           longitude,
//           latitudeDelta: 0.0922,
//           longitudeDelta: 0.0421,
//         });
//         setInitialMarkerPosition({ latitude, longitude });
//         fetchReverseGeolocation(latitude, longitude);
//       } else {
//         console.error("Location permission denied");
//       }
//     } catch (error) {
//       console.error("Error getting user location:", error);
//     }
//   };

//   const goToMarker = () => {
//     setInitialMapRegion({
//       ...markerPosition,
//       latitudeDelta: 0.0922,
//       longitudeDelta: 0.0421,
//     });
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

//   const handlePlaceSelect = (data, details = null) => {
//     if (details) {
//       const { lat, lng } = details.geometry.location;
//       setMarkerPosition({ latitude: lat, longitude: lng });
//       setInitialMapRegion({
//         latitude: lat,
//         longitude: lng,
//         latitudeDelta: 0.0922,
//         longitudeDelta: 0.0421,
//       });
//       setEditLocationVisible(false);
//     }
//   };

//     // Directly set the offset based on which input is focused
//     useEffect(() => {
//       const keyboardDidShowListener = Keyboard.addListener(
//         'keyboardDidShow',
//         (e) => {
//           const offset = calculateOffset(currentFocus);
//           console.log('Device Height:', e.endCoordinates.height);
//           console.log('Keyboard did show with offset:', offset);
//           setKeyboardOffset(offset);
//         }
//       );
//       const keyboardDidHideListener = Keyboard.addListener(
//         'keyboardDidHide',
//         () => {
//           setKeyboardOffset(0);
//         }
//       );
    
//       return () => {
//         keyboardDidShowListener.remove();
//         keyboardDidHideListener.remove();
//       };
//     }, [currentFocus]);
    
//     const calculateOffset = (inputType) => {
//       // You may not need a baseOffset if you're using the keyboardHeight directly
//       let additionalOffset = -50;
    
//       switch (inputType) {
//         case 'street' :
//           // No additional offset might be needed if this is high up on the screen
//           additionalOffset = -145;
//           break;
//         case 'houseNumber':
//           // You might add a small additional offset if needed
//           additionalOffset = -145;
//           break;
//         case 'floor':
//           // Likely the same as houseNumber
//           additionalOffset = -145;
//           break;
//         case 'note':
//           // This might be at the very bottom, so you want to ensure it's above the keyboard
//           additionalOffset = -140;
//           break;
//         case 'label':
//           // This might be at the very bottom, so you want to ensure it's above the keyboard
//           additionalOffset = -35;
//           break;
//         default:
//           additionalOffset = -35;
//       }
    
//       // The total offset is the height of the keyboard plus any additional space you want
//       return additionalOffset;
//     };

//   return (
//     <KeyboardAvoidingView
//     style={{ flex: 1 }}
//     behavior={Platform.OS === "ios" ? "padding" : "height"}
//     keyboardVerticalOffset={keyboardOffset}
//     // keyboardVerticalOffset={Platform.OS === "ios" ? 60 : -120}
//     >
//     <View style={styles.editAddressIconComplete}>
//       <StatusBar barStyle="default" />
//       <View style={styles.body}>
//         <View style={styles.rowContainer}>
//           <MapView
//             style={styles.map}
//             region={initialMapRegion}
//             // onPress={handleMapPress}
//             // provider={PROVIDER_GOOGLE}
//           >
//             <Marker
//               coordinate={markerPosition}
//               title="Pinned Location"
//               draggable={true}
//               onDragEnd={handleMarkerDragEnd}
//               image={require("../assets/icons8location100-2-1.png")}
//             />
//           </MapView>
//         </View>

//         <TouchableOpacity
//           style={styles.locationButton}
//           onPress={gotoUserLocation}
//         >
//           <Image source={require("../assets/location-target2.png")} />
//         </TouchableOpacity>
//         <TouchableOpacity style={styles.goToMarkerButton} onPress={goToMarker}>
//           <Text>Go to Marker</Text>
//         </TouchableOpacity>

//         <View style={styles.infoContainer}>
//           <Image
//             style={styles.infoIcon}
//             source={require("../assets/location-icon1.png")}
//           />
//           <View style={styles.infoTextContainer}>
//             <Text style={styles.infoTitle}>
//               {markerPosition.latitude.toFixed(6)}
//             </Text>
//             <Text style={styles.infoSubtitle}>
//               {reverseGeocodedAddress || "Loading..."}
//             </Text>
//           </View>
//           <TouchableOpacity
//             style={styles.editIconContainer}
//             onPress={() => setEditLocationVisible(!editLocationVisible)}
//           >
//             <Image
//               style={styles.editIcon}
//               source={require("../assets/pencil-11.png")}
//             />
//           </TouchableOpacity>
//         </View>

//         <TouchableOpacity style={styles.saveButton}>
//           <Text style={styles.saveButtonText}>Save Address</Text>
//         </TouchableOpacity>

//         {editLocationVisible && (
//           <View
//             style={[
//               styles.editLocationContainer,
//               { height: editLocationContainerHeight },
//             ]}
//           >
//             <View style={styles.searchContainer}>
//               <TouchableOpacity
//                 onPress={() => {
//                   setEditLocationVisible(!editLocationVisible);
//                 }}
//               >
//                 <Image
//                   style={styles.editIcon}
//                   source={require("../assets/icon24pxback-arrow1.png")}
//                 />
//               </TouchableOpacity>

//               <GooglePlacesAutocomplete
//                 ref={ref}
//                 enablePoweredByContainer={false} // Disable "Powered by Google" logo
//                 placeholder="Enter your address"
//                 onPress={(data, details = null) =>
//                   handlePlaceSelect(data, details)
//                 }
//                 query={{
//                   key: "AIzaSyAuaR8dxr95SLUTU-cidS7I-3uB6mEoJmA",
//                   language: "en",
//                   components: "country:PH",
//                 }}
//                 fetchDetails={true}
//                 styles={{
//                   container: {
//                     flex: 1,
//                   },
//                   listView: {
//                     position: "absolute",
//                     top: 45,
//                     width: "100%",
//                   },
//                   separator: {
//                     backgroundColor: "#ddd",
//                     height: 1,
//                   },
//                   textInput: {
//                     backgroundColor: "#e5e6e9",
//                     color: "black",
//                     marginLeft: 10,
//                   },
//                   textInput: {
//                     height: 38,
//                     color: "black",
//                     fontSize: 16,
//                   },
//                   row: {
//                     backgroundColor: "white",
//                     flexDirection: "row",
//                     alignItems: "center",
//                   },
//                 }}
//                 textInputProps={{
//                   onFocus: handleInputFocus,
//                   onBlur: handleInputBlur,
//                   onChangeText: handleAddressInputChange,
//                 }}
//               />
//             </View>
//           </View>
//         )}
//         <View style={styles.backBtnWrapper}>
//           <Pressable style={styles.backBtn} onPress={() => navigation.goBack()}>
//             <Image
//               style={styles.uiIconarrowBackwardfilled}
//               contentFit="cover"
//               source={require("../assets/ui-iconarrow-backwardfilled.png")}
//             />
//           </Pressable>
//         </View>
//         {/* <Modal animationType="fade" transparent visible={locationBtnVisible}>
//             <EditAddress onClose={closeLocationBtn}/>
//           </Modal> */}
//         <View style={styles.editLocationModal}>
//           <EditAddressModal
//             selectedLocation={selectedLoc}
//             selectedCity={selectedCity}
//             selectedCoordinates={selectedCoordinates}
//             selectedFloor={selectedFloor}
//             selectedHouseNumber={selectedHouseNumber}
//             selectedLabel={selectedLabel}
//             selectedOtherLabel={selectedOtherLabel}
//             selectedNote={selectedNote}
//             selectedStreet={selectedStreet}
//             selectedValue={selectedValue}
//             editAddress={true}
//             body={true}
//             name="Edit your address"
//             btnName="Save and Continue"
//           />
//         </View>

//         {addedMarkerChange && (
//           <View style={styles.editLocationModal}>
//             {console.log("location: ", addedSpecificLocation)} 
//             {console.log("added flag: ", confirmAdd)} 
//             <EditAddressModal
//               addedSpecificLocation={addedSpecificLocation}
//               addedCityAddress={addedCityAddress}
//               addedCoordinates={addedCoordinates}
//               editAddress={true}
//               body={true} 
//               name="Add a new address"
//               btnName="Save and Continue"
//               addedFlag={true}
//               visible={modalVisible}
//               onClose={() => setModalVisible(false)}
//             />
//           </View>
//         )}
//       </View>
//     </View>
//     </KeyboardAvoidingView>
//   );
// };

// const styles = StyleSheet.create({
//   editLocationModal: {
//     position: "absolute",
//     width: "100%",
//     height: "auto",
//   },
//   container: {
//     flex: 1,
//   },
//   rowContainer: {
//     flex: 1,
//     flexDirection: "row",
//   },
//   map: {
//     flex: 1,
//   },
//   infoContainer: {
//     position: "absolute",
//     bottom: 50,
//     left: 16,
//     right: 16,
//     backgroundColor: "white",
//     padding: 16,
//     borderRadius: 8,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.25,
//     shadowRadius: 3.84,
//     elevation: 5,
//     height: "auto",
//     flexDirection: "row",
//     alignItems: "center",
//   },
//   infoIcon: {
//     width: 24,
//     height: 24,
//     marginRight: 8,
//   },
//   infoTextContainer: {
//     flex: 1,
//   },
//   infoTitle: {
//     fontSize: 16,
//     fontWeight: "bold",
//   },
//   infoSubtitle: {
//     fontSize: 14,
//     color: "gray",
//   },
//   editIconContainer: {
//     marginLeft: 8,
//     width: 24,
//     height: 24,
//     borderRadius: 12,
//     backgroundColor: "#f0f0f0",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   editIcon: {
//     width: 16,
//     height: 16,
//   },
//   locationButton: {
//     position: "absolute",
//     bottom: 190,
//     right: 20,
//     width: 50,
//     height: 50,
//   },
//   goToMarkerButton: {
//     position: "absolute",
//     bottom: 270,
//     right: 20,
//     padding: 3,
//     backgroundColor: "#fff",
//     borderRadius: 5,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   saveButton: {
//     position: "absolute",
//     bottom: 4,
//     alignSelf: "center",
//     backgroundColor: "#007AFF",
//     paddingHorizontal: 80,
//     paddingVertical: 10,
//     borderRadius: 8,
//   },
//   saveButtonText: {
//     color: "white",
//     fontWeight: "bold",
//   },
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
//   row: {
//     backgroundColor: "white",
//     flexDirection: "row",
//     alignItems: "center",
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//     borderBottomWidth: 1,
//     borderColor: "#ddd",
//   },
//   iconImage: {
//     width: 24,
//     height: 24,
//     marginRight: 12,
//   },
//   rowText: {
//     fontSize: 16,
//   },
//   whiteParentPosition: {
//     padding: Padding.p_3xs,
//     zIndex: 1,
//     position: "absolute",
//     alignItems: "center",
//   },
//   wrapperFlexBox: {
//     marginTop: 10,
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
//     left: 0,
//     top: 0,
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
//     display: "none",
//     zIndex: 0,
//   },
//   homeIconPosition: {
//     left: 0,
//     height: 30,
//     width: 30,
//     top: 0,
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
//   frameChild: {
//     width: 41,
//     height: 3,
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
//     fontSize: FontSize.size_3xs,
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
//     left: 0,
//     height: 30,
//     width: 30,
//     top: 0,
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
//     shadowColor: "rgba(0, 0, 0, 0.25)",
//     borderRadius: Border.br_11xl,
//     height: 50,
//     width: 50,
//     justifyContent: "center",
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: Color.white,
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
//     width: 343,
//     paddingHorizontal: Padding.p_3xl,
//     paddingVertical: Padding.p_xs,
//     justifyContent: "center",
//     flexDirection: "row",
//     alignItems: "center",
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
//     zIndex: 2,
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
//     // backgroundColor: Color.white,
//   },
// });

// export default EditAddressIconComplete;

