import React, { useState, useEffect, useRef, useContext } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  Dimensions,
  Pressable,
} from "react-native";
import MapView, {
  Marker,
  Circle,
  enableLatestRenderer,
} from "react-native-maps";
import axios from "axios";
import * as Location from "expo-location";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useNavigation} from "@react-navigation/native";
import { Padding, Border, Color, FontFamily, FontSize } from "../GlobalStyles";
import EditAddressModal from "../components/EditAddressModal";


const AddNewAddress = ({route}) => {
  const ref = useRef();
  const mapRef = useRef(null);
  const navigation = useNavigation();

  const [selectedLatitude, setSelectedLatitude] = useState(route.params?.selLatitude);
  const [selectedLongitude, setSelectedLongitude] = useState(route.params?.selLongitude);

  const [checkMarkerChange, setCheckMarkerChange] = useState(false);

  const [isInputFocused, setIsInputFocused] = useState(false);

  const [initialMapRegion, setInitialMapRegion] = useState(null);

  const [initialMarkerPosition, setInitialMarkerPosition] = useState(null);

  const [markerPosition, setMarkerPosition] = useState(initialMarkerPosition);
  const [adjustedPosition, setAdjustedPosition] = useState(
    initialMarkerPosition
  );
  const [currentPosition, setCurrentPosition] = useState(initialMarkerPosition);
  const [reverseGeocodedAddress, setReverseGeocodedAddress] = useState(null);
  const [showCloseBtn, setShowCloseBtn] = useState(true);
  const [cityAddress, setCityAddress] = useState(null);

  useEffect(() => {
    let currentLocationFlag = false;
    async function fetchCurrentLocation() {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.error('Permission to access location was denied');
        return;
      }
      const location = await Location.getCurrentPositionAsync({});
      currentLocationFlag = true;
      return location.coords;
    }
  
    async function fetchGeocode(latitude, longitude) {
      try {
        const addressResponse = await Location.reverseGeocodeAsync({
          latitude,
          longitude,
        });
        console.log('Address Response:', addressResponse);
  
        setInitialMarkerPosition({ latitude, longitude });
        setInitialMapRegion({
          latitude,
          longitude,
          latitudeDelta: 0.0522,
          longitudeDelta: 0.0321,
        });
        setMarkerPosition({ latitude, longitude });
        if(!currentLocationFlag){
          fetchCurrentLocation().then(({ latitude, longitude }) => {
            setCurrentPosition({latitude, longitude});
          });
        }else{
          setCurrentPosition({latitude, longitude});
        }
        fetchReverseGeolocation(latitude, longitude);

      } catch (error) {
        console.error('Error fetching geocode:', error);
      }
    }
  
    if (selectedLatitude && selectedLongitude) {
      // Use selected location if provided
      fetchGeocode(selectedLatitude, selectedLongitude);
    } else {
      // Fallback to current location
      fetchCurrentLocation().then(({ latitude, longitude }) => {
        fetchGeocode(latitude, longitude);
      });
    }
  }, [selectedLatitude, selectedLongitude]); // Dependencies array includes what the effect relies on
  

  // useEffect(() => {
  //   // Fetch geocode information for the chosenOptionAddress or selectedLoc
  //   function fetchGeocode() {
  //     try {
  
  //       let latitudeToFetch, longitudeToFetch;
  
  //       // Use selectedLoc if it's not null
  //       if (selectedLatitude && selectedLongitude) {
  //         latitudeToFetch = selectedLatitude; // Assuming selectedLoc has the required structure
  //         longitudeToFetch = selectedLongitude; // Assuming selectedLoc has the required structure
  //       }

  //       setMarkerPosition({ latitude: latitudeToFetch, longitude: longitudeToFetch });
  //       setInitialMapRegion({
  //         latitude: latitudeToFetch,
  //         longitude: longitudeToFetch,
  //         latitudeDelta: 0.0122,
  //         longitudeDelta: 0.0321,
  //       });
  //       // if (mapRef.current) {
  //       //   mapRef.current.animateToRegion({
  //       //     latitude:  latitudeToFetch,
  //       //     longitude:  longitudeToFetch,
  //       //     latitudeDelta: 0.0922,
  //       //     longitudeDelta: 0.0421,
  //       //   });
  //       // }
  //       console.log("Marker Position: " ,markerPosition);
  //       // setInitialMarkerPosition({ latitudeToFetch, longitudeToFetch });
  //       console.log("Marker Position: " , initialMapRegion);
  //       // fetchReverseGeolocation(latitudeToFetch, longitudeToFetch);
  //     } catch (error) {
  //       console.error("Error fetching geocode:", error);
  //     }
  //   }
  
  //   // Trigger the fetch when either chosenOptionAddress or selectedLoc changes
  //   if (selectedLatitude && selectedLongitude) {
  //     fetchGeocode();
  //   }
  // }, [selectedLatitude, selectedLongitude]);

  // useEffect(() => {
  //   (async () => {
  //     const { status } = await Location.requestForegroundPermissionsAsync();
  //     if (status !== "granted") {
  //       console.error("Permission to access location was denied");
  //       return;
  //     }
  //     const location = await Location.getCurrentPositionAsync({});

  //     const addressResponse = await Location.reverseGeocodeAsync({
  //       latitude: location.coords.latitude,
  //       longitude: location.coords.longitude,
  //     });
  //     console.log("Address Response:", addressResponse);

  //     // Destructuring latitude and longitude from location.coords
  //     const { latitude, longitude } = location.coords;

  //     setMarkerPosition({ latitude, longitude });
  //     setCurrentPosition({ latitude, longitude });
  //     setInitialMarkerPosition({ latitude, longitude });
  //     fetchReverseGeolocation(latitude, longitude);
  //     setInitialMapRegion({
  //       latitude: latitude,
  //       longitude: longitude,
  //       latitudeDelta: 0.0922,
  //       longitudeDelta: 0.0421,
  //     });
  //   })();
  // }, []);

  // useEffect(() => {
  //   (async () => {
  //     const { status } = await Location.requestForegroundPermissionsAsync();
  //     if (status !== "granted") {
  //       console.error("Permission to access location was denied");
  //       return;
  //     }

  //     const location = await Location.getCurrentPositionAsync({});

  //     const addressResponse = await Location.reverseGeocodeAsync({
  //       latitude: location.coords.latitude,
  //       longitude: location.coords.longitude,
  //     });

  //     if (addressResponse.length > 0) {
  //       const addressInfo = addressResponse[0];

  //       if (addressInfo.streetNumber !== null) {
  //         const cityOnly = `${addressResponse[0].streetNumber}, ${addressResponse[0].street}, ${addressResponse[0].city}`;
  //         console.log(cityOnly);
  //         setAddress(cityOnly);
  //       } else {
  //         const cityOnly = `${addressResponse[0].street}, ${addressResponse[0].city}`;
  //         console.log(cityOnly);
  //         setAddress(cityOnly);
  //       }
  //     }
  //   })();
  // }, []);


  const handleInputFocus = () => {
    setShowCloseBtn(showCloseBtn);
    setIsInputFocused(true);
  };

  const handleInputBlur = () => {
    setShowCloseBtn(showCloseBtn);
    setIsInputFocused(false);
  };

  const [isMapPressable, setIsMapPressable] = useState(true); // make it false as default

  const handlePlaceSelect = (data, details) => {
    // Your logic for handling the selected place
    setIsMapPressable(true); // Make the map pressable

    console.log("Map is now pressable after pressing handplace select");

    if (details) {

      setTimeout(() => {
        ref.current?.setAddressText('');
      }, 100);

      console.log("Details: ", details);
      const { lat, lng } = details.geometry.location;

      console.log(lat);
      console.log(lng);
      console.log("Details Geometry: ", details.geometry.location);
      console.log("Formatted Address: ", details.formatted_address);
      setMarkerPosition({ latitude: lat, longitude: lng });
      setInitialMapRegion({
        latitude: lat,
        longitude: lng,
        latitudeDelta: 0.0122,
        longitudeDelta: 0.0321,
      });
    }
  };

  const handleMapPress = (event) => {
    if (isMapPressable) {
      // Your logic for handling map press
      const { latitude, longitude } = event.nativeEvent.coordinate;
      setMarkerPosition({ latitude, longitude });
      setInitialMapRegion({
        latitude: latitude,
        longitude: longitude,
        latitudeDelta: 0.0122,
        longitudeDelta: 0.0321,
      });

      console.log("Map is pressed");
      // Reset the map pressability state if needed
    } else {
      console.log("Map is not pressable");
    }
  };

  const handleAddressInputChange = (text) => {
    if (text.trim() === "") {
      setIsMapPressable(true); // Make the map pressable
      setShowCloseBtn(false);
    } else {
      setIsMapPressable(false); // Make the map not pressable
      setShowCloseBtn(true);
    }
  };

  const fetchReverseGeolocation = async (latitude, longitude) => {
    try {
      enableLatestRenderer();
      console.log("Fetched Latitude: ", latitude);
      console.log("Fetched Longitude: ", longitude);

      const apiKey = "AIzaSyBeZMkWh5O-VLFnVvRJw13qwXK6xDyiYrQ";
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&result_type=street_address&key=${apiKey}`
      );
      console.log("Response: ", response.data);
      if (response.data.results && response.data.results.length > 0) {
        const firstResult = response.data.results[0];
        const formattedAddress = firstResult.formatted_address;
        console.log("First Result: ", firstResult);
        console.log("Formatted Address: ", formattedAddress);

        // Modify the address components to exclude the region, zip code, and country
        const addressComponents1 = firstResult.address_components.filter(
          (component) => {
            return ![
              "administrative_area_level_1",
              "postal_code",
              "country",
            ].includes(component.types[0]);
          }
        );

        console.log("Address Components: ", addressComponents1);

        const formattedAddress1 = addressComponents1
          .map((component) => component.long_name)
          .join(", ");
        console.log("Newly Formatted Address 1: ", formattedAddress1);
        const cityParts = formattedAddress1.split(", ");
        const cityAddress = cityParts[cityParts.length - 1];
        // setcityAddress(cityAddress);
        console.log("City Address:", cityAddress);

        // Extracting the city from the formatted address
        const addressComponents = firstResult.address_components;
        let city = "";
        for (const component of addressComponents) {
          if (component.types.includes("locality")) {
            city = component.long_name;
            break;
          }
        }

        if (
          ![
            "Cebu",
            "Cebu City",
            "Mandaue",
            "Mandaue City",
            "Lapu-Lapu",
            "Lapu-Lapu City",
          ].includes(city)
        ) {
          // Store administrative_area_level_2 in the city variable
          for (const component of firstResult.address_components) {
            if (component.types.includes("administrative_area_level_2")) {
              city = component.long_name;
              break;
            }
          }
        }
        console.log("City Name 2: ", city);
        setReverseGeocodedAddress(formattedAddress1);
        setCheckMarkerChange(true);
        setCityAddress(city);
      } else {
        // If Google Geocoding API doesn't return results, try OpenStreetMap Nominatim API
        try {
          const osmResponse = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const osmData = await osmResponse.json();
          if (osmData.display_name) {
            const addressParts = osmData.display_name.split(", ");

            // Remove the last 3 parts (region, zip code, and country)
            const modifiedAddress = addressParts.slice(0, -3).join(", ");
            console.log("Modified Address:", modifiedAddress);

            // New variable for city address
            let cityAddress = "";

            // Loop through addressParts to find specific city names
            for (const part of addressParts) {
              if (["Cebu", "Cebu City"].includes(part)) {
                cityAddress = "Cebu City";
                break; // Exit loop once the city is found
              } else if (["Mandaue", "Mandaue City"].includes(part)) {
                cityAddress = "Mandaue City";
                break; // Exit loop once the city is found
              } else if (["Lapu-Lapu", "Lapu-Lapu City"].includes(part)) {
                cityAddress = "Lapu-Lapu City";
                break; // Exit loop once the city is found
              }
            }

            // Use the cityAddress variable
            if (cityAddress) {
              console.log("City Address:", cityAddress);
              setCityAddress(cityAddress);
            } else {
              // Handle case where no specific city is found
              console.log("Address is out of Cebu City");
              setCityAddress("Address is out of scope");
            }

            setReverseGeocodedAddress(modifiedAddress);
            setCheckMarkerChange(true);
            console.log("OpenStreetMap Location:", osmData.display_name);
          } else {
            setReverseGeocodedAddress("Location not found");
            console.log("Location not found with OpenStreetMap");
          }
        } catch (osmError) {
          console.error(
            "Error fetching location with OpenStreetMap:",
            osmError
          );
        }
      }
    } catch (error) {
      console.error("Error fetching reverse geolocation:", error);
    }
  };

  const gotoUserLocation = async () => {
    try {
      enableLatestRenderer();
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status === "granted") {
        const location = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = location.coords;

        setMarkerPosition({ latitude, longitude });
        setCurrentPosition({ latitude, longitude });

        // Calculate new latitude and longitude values
        const newLatitude = latitude - 0.0002;
        const newLongitude = longitude + 0.0;
        // Create a new object for markerPosition
        const newMarkerPosition = {
          latitude: newLatitude,
          longitude: newLongitude,
        };
        setAdjustedPosition(newMarkerPosition);
        if (mapRef.current) {
          mapRef.current.animateToRegion({
            latitude:  latitude,
            longitude:  longitude,
            latitudeDelta: 0.0522,
            longitudeDelta: 0.0321,
          });
        }
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
    if (mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: markerPosition.latitude,
        longitude: markerPosition.longitude,
        latitudeDelta: 0.0522,
        longitudeDelta: 0.0321,
      });
    }
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

  return (
    <View style={styles.container}>
      <View style={[styles.componentstopNavigation]}>
        <View style={[styles.view, styles.backParentFlexBox6]}>
          <View style={[styles.frameParent, styles.backParentFlexBox6]}>
            <View style={[styles.backBtnParent, styles.backParentFlexBox6]}>
              <Pressable
                style={[styles.backBtn, styles.backParentFlexBox6]}
                onPress={() => navigation.goBack()}
              >
                <Image
                  style={styles.icon24pxbackArrow}
                  contentFit="cover"
                  source={require("../assets/icon24pxback-arrow1.png")}
                />
              </Pressable>
              <View style={styles.searchLocationWrapper}>
                <GooglePlacesAutocomplete
                  ref={ref}
                  enablePoweredByContainer={false} // Disable "Powered by Google" logo
                  placeholder="Enter your address"
                  onPress={(data, details = null) => {
                    handlePlaceSelect(data, details);
                  }}
                  query={{
                    key: "AIzaSyBeZMkWh5O-VLFnVvRJw13qwXK6xDyiYrQ",
                    language: "en",
                    components: "country:PH",
                  }}
                  fetchDetails={true}
                  renderRightButton={() =>
                    showCloseBtn && (
                      <TouchableOpacity
                        onPress={() => [
                          ref.current?.setAddressText(""),
                          setShowCloseBtn(false),
                        ]}
                        style={styles.backBtnWrapper}
                      >
                        <View style={styles.backBtnShadowBox}>
                          <Image
                            style={{ width: 10, height: 10 }}
                            resizeMode={"contain"}
                            source={require("../assets/closeBtn.png")}
                          />
                        </View>
                      </TouchableOpacity>
                    )
                  }
                  styles={{
                    container: {
                      marginVertical: 5,
                      marginLeft: -10,
                    },
                    listView: {
                      position: "absolute",
                      top: 50,
                      left: -40,
                      width: "130%",
                    },
                    separator: {
                      backgroundColor: "#ddd",
                      height: 1,
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
                    description: {
                      color: "black", // Change the text color of suggested places
                    },
                    poweredContainer: {
                      display: "none", // Hide the "Powered by Google" container
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
            <Pressable style={[styles.searchBtn, styles.backParentFlexBox6]}>
              <View style={styles.searchBtnChild} />
              <Image
                style={styles.icon16pxsearch}
                contentFit="cover"
                source={require("../assets/icon16pxsearch.png")}
              />
            </Pressable>
          </View>
        </View>
      </View>
      <View style={styles.rowContainer}>
        {initialMapRegion && (
          <MapView
          ref={mapRef}
          style={styles.map}
          region={initialMapRegion}
          onPress={handleMapPress}
          // provider={PROVIDER_GOOGLE}
        >
          {/* <Marker
            coordinate={currentPosition}
            centerOffset={currentPosition}
            title="You are here"
            image={require("../assets/currentMarker.png")}
          /> */}
          {markerPosition && currentPosition &&(
            <>
              <Circle
                center={currentPosition}
                radius={5}
                strokeWidth={2}
                strokeColor="#FFF"
                fillColor="rgba(0, 126, 167, 0.8)"
              />
              <Circle
                center={currentPosition}
                radius={50}
                strokeWidth={2}
                strokeColor="rgba(174, 221, 255, 1)"
                fillColor="rgba(174, 221, 255, 0.4)"
              />
              <Marker
                coordinate={markerPosition}
                title="Pinned Location"
                draggable={true}
                image={require("../assets/icons8location100-2-1.png")}
              />
            </>
          )}
        </MapView>
        )}
      </View>
      <View>
          <Pressable style={styles.locationButton} onPress={gotoUserLocation}>
            <View style={styles.locationTargetWrapper}>
              <Image
                style={styles.icon24pxbackArrowLayout}
                contentFit="cover"
                source={require("../assets/location-target.png")}
              />
            </View>
          </Pressable>
          <TouchableOpacity
            style={styles.goToMarkerButton}
            onPress={goToMarker}
          >
            <Text>Go to Marker</Text>
          </TouchableOpacity>
      </View>
      <View style={styles.editLocationModal}>
        <EditAddressModal
          editAddress={true}
          body={false}
          name="Add a new address"
          btnName="Confirm Location"
          checkMarkerChange={checkMarkerChange}
          cityAddress={cityAddress}
          specificLocation={reverseGeocodedAddress || "Loading"}
          selectedCoordinates={markerPosition}
          // addedFlag={false}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  // Go to User Location Styles
  locationButton: {
    position: "absolute",
    bottom: 235,
    right: 5,
    padding: 3,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
  },
  locationTargetWrapper: {
    // shadowColor: "rgba(0, 0, 0, 0.25)",
    // shadowOffset: {
    //   width: 0,
    //   height: 4,
    // },
    // shadowRadius: 4,
    elevation: 4,
    shadowOpacity: 1,
    width: 40,
    height: 40,
    paddingHorizontal: Padding.p_xs,
    paddingVertical: Padding.p_9xs,
    borderRadius: Border.br_xl,
    justifyContent: "center",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Color.m3White,
  },
  icon24pxbackArrowLayout: {
    height: 24,
    width: 24,
  },
  // Go to Marker Styles
  goToMarkerButton: {
    position: "absolute",
    bottom: 205,
    right: 10,
    padding: 3,
    backgroundColor: "#fff",
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
  },

  // Close Button Styles for Search Address
  backBtnShadowBox: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    height: 20,
    width: 20,
    // shadowOpacity: 1,
    // elevation: 4,
    // shadowRadius: 4,
    // shadowOffset: {
    //   width: 0,
    //   height: 4,
    // },
    // shadowColor: "rgba(0, 0, 0, 0.25)",
    borderRadius: 20,
    justifyContent: "center",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Color.colorLightGray,
    flex: 1,
    alignSelf: "center",
  },
  backBtnWrapper: {
    // left: 16,
    // paddingVertical: Padding.p_mini,
    zIndex: 0,
    flexDirection: "row",
    marginBottom: 5,
    // top: 0,
    // position: "absolute",
  },
  // Bottom Navigation Styles
  currentLocationBtn: {
    justifyContent: "flex-end",
    flexDirection: "row",
    alignItems: "center",
  },
  currentLocationBtnWrapper: {
    paddingVertical: Padding.p_xl,
    alignItems: "flex-end",
    justifyContent: "flex-end",
    zIndex: 1,
    paddingHorizontal: Padding.p_base,
    alignSelf: "stretch",
    backgroundColor: "rgba(255, 0, 0, 0.1)", // Red color with 50% opacity
  },
  locationTargetWrapper: {
    // shadowColor: "rgba(0, 0, 0, 0.25)",
    // shadowOffset: {
    //   width: 0,
    //   height: 4,
    // },
    // shadowRadius: 4,
    elevation: 4,
    shadowOpacity: 1,
    width: 40,
    height: 40,
    paddingHorizontal: Padding.p_xs,
    paddingVertical: Padding.p_9xs,
    borderRadius: Border.br_xl,
    justifyContent: "center",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Color.m3White,
  },
  icon24pxbackArrowLayout: {
    height: 24,
    width: 24,
  },
  confirmLocation: {
    justifyContent: "flex-end",
    zIndex: 1,
    alignSelf: "stretch",
    alignItems: "center",
  },
  frameContainer: {
    borderTopLeftRadius: Border.br_5xl,
    borderTopRightRadius: Border.br_5xl,
    paddingBottom: Padding.p_mini,
    justifyContent: "flex-end",
    paddingHorizontal: Padding.p_base,
    alignSelf: "stretch",
    alignItems: "center",
    backgroundColor: Color.m3White,
  },
  vectorWrapper: {
    paddingBottom: Padding.p_8xs,
    paddingTop: Padding.p_3xs,
    justifyContent: "center",
    alignSelf: "stretch",
    alignItems: "center",
  },
  frameChild: {
    width: 41,
    height: 3,
  },
  componentsSearchDefault: {
    paddingLeft: Padding.p_8xs,
    paddingTop: Padding.p_xs,
    paddingRight: Padding.p_3xs,
    paddingBottom: Padding.p_xs,
    backgroundColor: Color.colorWhitesmoke_300,
    flexDirection: "row",
    borderRadius: Border.br_5xs,
  },
  componentsFlexBox: {
    marginTop: 15,
    justifyContent: "center",
    alignSelf: "stretch",
    alignItems: "center",
  },
  locationIcon: {
    width: 30,
    height: 30,
  },
  uscTalamban: {
    fontFamily: FontFamily.montserratBold,
    color: Color.heading,
    textAlign: "left",
    fontWeight: "700",
    lineHeight: 32,
    fontSize: 15,
    alignSelf: "stretch",
  },
  uscTalambanParent: {
    marginLeft: 8,
    overflow: "hidden",
    flex: 1,
  },
  barangayNasipitTalamban: {
    fontSize: FontSize.typographyTaglineSmallRegular_size,
    fontFamily: FontFamily.montserratMedium,
    fontWeight: "500",
    lineHeight: 20,
    alignSelf: "stretch",
  },
  addAddressDetailsClr: {
    color: Color.colorDarkgray_300,
    textAlign: "left",
  },
  savedPlaces: {
    borderRadius: Border.br_xl,
    marginLeft: 8,
  },
  iconOutlineFlexBox: {
    padding: 1,
    justifyContent: "center",
    flexDirection: "row",
    alignItems: "center",
  },
  componentsbuttonFlexBox: {
    backgroundColor: Color.colorDarkslategray_900,
    justifyContent: "center",
    flexDirection: "row",
    alignItems: "center",
  },
  bookmarkIconPosition: {
    height: 15,
    width: 15,
    left: 5,
    top: 5,
    position: "absolute",
  },
  componentsSearchDefault1: {
    borderRadius: Border.br_5xs,
    overflow: "hidden",
    flexDirection: "row",
  },
  addAddressDetails: {
    fontFamily: FontFamily.montserratRegular,
    fontSize: FontSize.level2Medium12_size,
    lineHeight: 32,
    color: Color.colorDarkgray_300,
    flex: 1,
  },
  addressDetailsBtnBg: {
    backgroundColor: Color.colorWhitesmoke_300,
    flexDirection: "row",
  },
  addressDetailsBtn: {
    paddingLeft: Padding.p_3xs,
    paddingTop: Padding.p_8xs,
    paddingRight: Padding.p_8xs,
    paddingBottom: Padding.p_8xs,
    borderRadius: Border.br_3xs,
    flex: 1,
  },
  addressDetailsFrame: {
    flexDirection: "row",
    flex: 1,
  },
  whiteBookmarkIcon: {
    zIndex: 0,
  },
  grayBookmarkIcon: {
    display: "none",
    zIndex: 1,
  },
  whiteBookmarkParent: {
    width: 25,
    height: 25,
    borderRadius: Border.br_xl,
  },
  edit: {
    color: Color.colorDeepskyblue_100,
    display: "flex",
    width: 34,
    textAlign: "center",
    fontSize: FontSize.level2Medium12_size,
    justifyContent: "center",
    alignItems: "center",
  },
  editBtn: {
    marginLeft: 5,
    flexDirection: "row",
    alignSelf: "stretch",
  },
  editTypo: {
    fontFamily: FontFamily.montserratMedium,
    fontWeight: "500",
    lineHeight: 20,
    alignSelf: "stretch",
  },
  componentsbuttonWrapper: {
    paddingTop: Padding.p_3xs,
  },
  componentsbutton: {
    borderRadius: Border.br_mini,
    paddingHorizontal: Padding.p_3xl,
    paddingVertical: Padding.p_xs,
    alignSelf: "stretch",
  },
  viewAllServices: {
    letterSpacing: -0.1,
    lineHeight: 24,
    fontFamily: FontFamily.title2Bold32,
    color: Color.neutral01,
    textAlign: "center",
    fontWeight: "700",
    fontSize: 15,
  },
  icons8Location10021Wrapper: {
    top: 234,
    left: 53,
    padding: Padding.p_3xs,
    zIndex: 2,
    justifyContent: "flex-end",
    position: "absolute",
    overflow: "hidden",
    alignItems: "center",
  },
  icons8Location10021Wrapper1: {
    top: 365,
    left: 300,
    padding: Padding.p_3xs,
    zIndex: 2,
    justifyContent: "flex-end",
    position: "absolute",
    overflow: "hidden",
    alignItems: "center",
  },
  icons8Location10021: {
    width: 50,
    height: 50,
  },

  // Top Navigation styles
  componentstopNavigation: {
    backgroundColor: Color.colorDarkslateblue_200,
    position: "relative",
    zIndex: 2,
  },
  backParentFlexBox6: {
    alignItems: "center",
    flexDirection: "row",
  },
  icon24pxbackArrow: {
    width: 24,
    height: 24,
    overflow: "hidden",
  },
  backBtn: {
    width: 48,
    padding: Padding.p_xs,
    justifyContent: "center",
  },
  searchLocation: {
    fontFamily: FontFamily.interRegular,
    fontSize: FontSize.levelSemibold14_size,
    alignSelf: "stretch",
  },
  searchLocationWrapper: {
    marginLeft: 7,
    justifyContent: "center",
    flex: 1,
  },
  backBtnParent: {
    flex: 1,
  },
  searchBtnChild: {
    borderRadius: 8,
    backgroundColor: "#007ea7",
    width: 32,
    height: 32,
    zIndex: 0,
  },
  icon16pxsearch: {
    position: "absolute",
    marginTop: -15,
    top: "50%",
    right: 8,
    width: 16,
    height: 16,
    zIndex: 1,
  },
  searchBtn: {
    marginLeft: 8,
  },
  frameParent: {
    borderRadius: 10,
    backgroundColor: "#fbfbfb",
    borderStyle: "solid",
    borderColor: "#f2f2f2",
    borderWidth: 0.9,
    paddingRight: 8,
    flex: 1,
  },
  view: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    justifyContent: "space-between",
    alignSelf: "stretch",
  },
  container: {
    flex: 1,
  },
  rowContainer: {
    flex: 1,
    flexDirection: "row",
    zIndex: 1,
  },
  map: {
    flex: 1,
  },
  infoContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 16,
    backgroundColor: "white",
    padding: 16,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    height: hp(20),
    width: wp(100),
    flexDirection: "row",
    alignItems: "center",
    zIndex: 1,
  },
  infoIcon: {
    width: 24,
    height: 24,
    marginRight: 8,
    marginBottom: 60,
  },
  infoTextContainer: {
    flex: 1,
    paddingBottom: 60,
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
    marginBottom: 60,
  },
  editIcon: {
    width: 16,
    height: 16,
  },
  hideLocationDetails: {
    display: "none",
  },
  saveButton: {
    position: "absolute",
    top: 100,
    left: 20,
    alignSelf: "center",
    backgroundColor: "#003459",
    paddingHorizontal: 125,
    paddingVertical: 15,
    borderRadius: 15,
  },
  saveButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 20,
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
    zIndex: 1,
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
  xButton: {
    position: "absolute",
    top: 190,
    left: 10,
    width: 50,
    height: 50,
  },
  editLocationModal: {
    position: "absolute",
    width: "100%",
    height: "auto",
    bottom: 0,  // Set bottom to 0 to position it below the screen
    left: 0,    // Set left to 0 to cover the entire width
    right: 0,   // Set right to 0 to cover the entire width
  },
});

export default AddNewAddress;
