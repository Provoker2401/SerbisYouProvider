import React, { useState, useEffect, useRef} from "react";
import {
  StatusBar,
  StyleSheet,
  Pressable,
  TouchableOpacity,
  View,
  Text,
  ScrollView,
  Dimensions,
  Linking,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { useNavigation } from "@react-navigation/native";
import { Color, FontSize, Border, FontFamily, Padding } from "../GlobalStyles";
import MapView, {
  Marker,
} from "react-native-maps";
import {
  getFirestore,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore"; // Updated imports
import { getAuth } from "firebase/auth";
import * as TaskManager from "expo-task-manager";
import * as Location from "expo-location";

const GoToCustomer = ( {route} ) => {
  const navigation = useNavigation();
  const mapRef = useRef(null);

  // const [address, setAddress] = useState(null);
  const {itemID, matchedBookingID, customerUID} = route.params;
  const [bookingName, setBookingName] = useState("");
  const [bookingDate, setBookingDate] = useState("");
  const [bookingTime, setBookingTime] = useState("");
  const [bookingAddress, setBookingAddress] = useState("");
  const [bookingCoordinates, setBookingCoordinates] = useState({ latitude: null, longitude: null });
  const [providerCoordinates, setProviderCoordinates] = useState({ latitude: null, longitude: null });
  const [bookingAddressDetails, setBookingAddressDetails] = useState({});

  const [isMapReady, setIsMapReady] = useState(false);
  const [phoneUser, setphoneUser] = useState("");
  const getCurrentLocationTask = "background-location-task";

  // Calculate the map height as a fraction of the screen height
  const screenHeight = Dimensions.get("window").height;
  const mapHeight = screenHeight * 0.4; // 40% of the screen height

  const [isLoading, setIsLoading] = useState(true);

  
  const db = getFirestore();
  const auth = getAuth();
  const userUID = auth.currentUser.uid;
  const providerProfilesCollection = doc(db, "providerProfiles", userUID);

  TaskManager.defineTask(getCurrentLocationTask, async ({ data, error }) => {
    if (error) {
      console.error("Background location task error:", error);
      return;
    }

    if (data) {
      try {
        if (data.locations && data.locations.length > 0) {
          const { coords } = data.locations[0];
          const { latitude, longitude } = coords;
          console.log(
            "Received new location data from TaskManager - Latitude:",
            latitude,
            "Longitude:",
            longitude
          );

          const docSnapshot = await getDoc(providerProfilesCollection);
          if (docSnapshot.exists()) {
            const coordinates = docSnapshot.data().realTimeCoordinates;
            console.log("Coordinates ", coordinates);

            // Update the real-time coordinates field in Firestore
            await updateDoc(providerProfilesCollection, {
              realTimeCoordinates: {
                latitude: latitude,
                longitude: longitude,
              },
            });
          }
        }
      } catch (error) {
        console.error("Error updating Firestore document:", error);
      }
    }
  });

  useEffect(() => {
    updateLocation(); // Call the updateLocation function when component mounts
  }, []); // Empty dependency array ensures the effect is only run once after the initial render

  const updateLocation = async () => {
    try {
      const { status } = await Location.requestBackgroundPermissionsAsync();
      if (status !== "granted") {
        console.error("Permission to access background location was denied");
        return;
      }

      // Get the current location every 5 seconds

      await Location.startLocationUpdatesAsync(
        getCurrentLocationTask,
        {
          accuracy: Location.Accuracy.BestForNavigation,
          timeInterval: 1000, // Change the time interval according to your requirement
          // distanceInterval: 100,
        },
        async ({ locations }) => {
          if (locations && locations.length > 0) {
            const { coords } = locations[0];
            console.log("Received new location data:", coords);
          }
        }
      );
    } catch (error) {
      console.error("Error updating location:", error);
    }
  };

  // const [inTransit, setInTransit] = useState(true);

  // const LOCATION_TASK_NAME = "background-location-task";

  // const updateLocation = async () => {
  //   try {
  //     // Get the current location every 5 seconds
  //     await Location.startLocationUpdatesAsync(
  //       LOCATION_TASK_NAME,
  //       {
  //         accuracy: Location.Accuracy.High,
  //         timeInterval: 5000,
  //         distanceInterval: 100,
  //       },
  //       async ({ locations }) => {
  //         if (locations && locations.length > 0) {
  //           const { coords } = locations[0];
  //           console.log("Received new location data:", coords);
  //           setProviderCoordinates({ latitude, longitude });
  //         }
  //       }
  //     );
  //   } catch (error) {
  //     console.error("Error updating location:", error);
  //   }
  // };

  // useEffect(() => {
  //   const updateLocation = async () => {
  //     try {
  //       await Location.startLocationUpdatesAsync("background-location-task", {
  //         accuracy: Location.Accuracy.High,
  //         timeInterval: 5000, // Fetch location every 5 seconds
  //         distanceInterval: 100, // Or every 100 meters distance covered
  //       }, ({ locations }) => {
  //         if (locations && locations.length > 0) {
  //           const { latitude, longitude } = locations[0].coords;
  //           setProviderCoordinates({ latitude, longitude });

  //           // Update provider coordinates in Firestore
  //           const db = getFirestore();
  //           const auth = getAuth();
  //           const providerUID = auth.currentUser.uid;
  //           const providerProfilesCollection = doc(db, "providerProfiles", providerUID);
  //           updateDoc(providerProfilesCollection, {
  //             realTimeCoordinates: { latitude, longitude }
  //           });
  //         }
  //       });
  //     } catch (error) {
  //       console.error("Error updating location:", error);
  //     }
  //   };

  //   updateLocation();

  //   return () => {
  //     // Cleanup function to stop location updates when component unmounts
  //     Location.stopLocationUpdatesAsync("background-location-task");
  //   };
  // }, []);
  

  // Assuming you have these states or props available
  const providerLocation = {
    latitude: providerCoordinates.latitude,
    longitude: providerCoordinates.longitude,
  };
  const customerLocation = {
    latitude: bookingCoordinates.latitude,
    longitude: bookingCoordinates.longitude,
  };

  // Function to handle directions
  const handleGetDirections = () => {
    // const { latitude, longitude } = bookingCoordinates;
    const data = {
      source: providerLocation,
      destination: customerLocation,
      params: [
        {
          key: "travelmode",
          value: "driving", // could be "walking", "bicycling" or "transit" as well
        },
        {
          key: "dir_action",
          value: "navigate", // this launches navigation directly
        },
      ],
    };

    const url = `https://www.google.com/maps/dir/?api=1&origin=${data.source.latitude},${data.source.longitude}&destination=${data.destination.latitude},${data.destination.longitude}&travelmode=${data.params[0].value}`;
    Linking.openURL(url);
  };

  const onMapLayout = () => {
    setIsMapReady(true);
  };

  const [initialMapRegion, setInitialMapRegion] = useState({
    latitude: providerCoordinates.latitude,
    longitude: providerCoordinates.longitude,
    latitudeDelta: 0.008,
    longitudeDelta: 0.008,
  });

  const [initialMarkerPosition, setInitialMarkerPosition] = useState({
    latitude: providerCoordinates.latitude,
    longitude: providerCoordinates.longitude,
  });

  const [markerPosition, setMarkerPosition] = useState(initialMarkerPosition);

  useEffect(() => {
    if (isMapReady) {
      // Perform map operations here
    }
  }, [isMapReady]);


  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true); // Set loading to true before fetching data

        const db = getFirestore(); // Use getFirestore() to initialize Firestore
  
        // Get the user's UID 
        const auth = getAuth();
        const providerUID = auth.currentUser.uid;
        console.log("Provider UID: " , providerUID);
        console.log("Item Id: ", itemID);

        const providerProfilesCollection = doc(db, "providerProfiles", providerUID);
        const userBookingDocRef = doc(db, "providerProfiles", providerUID, "activeBookings", itemID);
        const [providerDocSnapshot, docSnapshot] = await Promise.all([
          getDoc(providerProfilesCollection),
          getDoc(userBookingDocRef)
        ]);

        let fetchedProviderCoordinates = null;

        if (docSnapshot.exists()) {
          const booking = docSnapshot.data();
          console.log("Booking Data: ", booking);
  
          setBookingName(booking.name);
          setBookingDate(booking.date);
          setBookingTime(booking.time);
          setBookingAddress(booking.address);
          setBookingAddressDetails(booking.addressDetails);
          setphoneUser(booking.phone);
          setBookingCoordinates({
            latitude: booking.coordinates.latitude,
            longitude: booking.coordinates.longitude,
          });
          // Validate coordinates before setting them
          // const bookingLat = booking.coordinates.latitude;
          // const bookingLong = booking.coordinates.longitude;
          // if (typeof bookingLat === 'number' && typeof bookingLong === 'number') {
 
          // } else {
          //   console.error('Invalid booking coordinates:', bookingLat, bookingLong);
          // }
          // setBookingAddressInstruction(booking.totalPrice);

          console.log("Booking Address Details: " ,bookingAddressDetails);
          console.log("Name: " ,bookingName);
          console.log("Date: " ,bookingDate);
          console.log("Time: " ,bookingTime);
          console.log("Address: " ,bookingAddress);
          console.log("Coordinates: " , bookingCoordinates);
          // console.log("Address: " , bookingAddress);

        } else {
          console.log("No such document!");
        }
        
        if (providerDocSnapshot.exists()) {
          const providerData = providerDocSnapshot.data();
          const coordinates = providerData.coordinates;
  
          const providerLat = parseFloat(coordinates.latitude);
          const providerLong = parseFloat(coordinates.longitude);
          if (!isNaN(providerLat) && !isNaN(providerLong)) {
            fetchedProviderCoordinates = { latitude: providerLat, longitude: providerLong };
            setProviderCoordinates(fetchedProviderCoordinates);
          } else {
            console.error('Invalid provider coordinates:', providerLat, providerLong);
          }
  
          console.log("Provider Coordinates from Firestore: ", fetchedProviderCoordinates);
  
        } else {
          console.log("No such document!");
        }
  
        // Now, fetch and update real-time location
        // await Location.startLocationUpdatesAsync(getCurrentLocationTask, {
        //   accuracy: Location.Accuracy.High,
        //   timeInterval: 5000, // Fetch location every 5 seconds
        //   //distanceInterval: 100, // Or every 100 meters distance covered
        // }, async ({ locations }) => {
        //   if (locations && locations.length > 0) {
        //     const { latitude1, longitude1 } = locations[0].coords;
  
        //     console.log("Provider Coordinates from Location Updates: ", { latitude1, longitude1 });
  
        //     // Update provider coordinates in Firestore
        //     const db = getFirestore();
        //     const auth = getAuth();
        //     const providerUID = auth.currentUser.uid;
        //     const providerProfilesCollection = doc(db, "providerProfiles", providerUID);
        //     // updateDoc(providerProfilesCollection, {
        //     //   realTimeCoordinates: { latitude1, longitude1 }
        //     // });
  
        //     if (fetchedProviderCoordinates &&
        //       fetchedProviderCoordinates.latitude === latitude1 &&
        //       fetchedProviderCoordinates.longitude === longitude1) {
        //       setProviderCoordinates(fetchedProviderCoordinates);
        //     } else {
        //       setProviderCoordinates({ latitude1, longitude1 });
        //     }
        //   }
        // });
  
        setIsLoading(false); // Set loading to false once data is fetched
      } catch (error) {
        console.error("Error retrieving data:", error);
      }

    }
  
    fetchData(); // Call the fetchData function immediately

    // Cleanup function to stop location updates when component unmounts

  }, []); 



  const handleArrival = async (itemID) => {
    try {
      navigation.navigate("PerformTheService", { itemID: itemID, matchedBookingID: matchedBookingID, customerUID: customerUID});
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  // useEffect(() => {
  //   console.log("Booking Coordinates: ", bookingCoordinates);
  // }, [bookingCoordinates]);
  
  // useEffect(() => {
  //   console.log("Provider Coordinates: ", providerCoordinates);
  // }, [providerCoordinates]);
  
  useEffect(() => {
    if (providerCoordinates.latitude && providerCoordinates.longitude &&
        bookingCoordinates.latitude && bookingCoordinates.longitude) {
      // Calculate the midpoint of the two locations
      const midLat = (providerCoordinates.latitude + bookingCoordinates.latitude) / 2;
      const midLong = (providerCoordinates.longitude + bookingCoordinates.longitude) / 2;

      // Calculate the deltas
      const deltaLat = Math.abs(providerCoordinates.latitude - bookingCoordinates.latitude) * 2;
      const deltaLong = Math.abs(providerCoordinates.longitude - bookingCoordinates.longitude) * 2;

      setInitialMapRegion({
        latitude: midLat,
        longitude: midLong,
        latitudeDelta: deltaLat,
        longitudeDelta: deltaLong,
      });
    }
  }, [providerCoordinates, bookingCoordinates]);

  // useEffect(() => {
  //   updateLocation();
  // }, []);

  // const stopUpdateLocation = async () => {
  //   try {
  //     await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
  //     console.log("Background location stopped");
  //     await TaskManager.unregisterAllTasksAsync();
  //     console.log("All tasks unregistered");

  //     setInTransit(false);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }) => {
  //   if (error) {
  //     console.error("Background location task error:", error);
  //     return;
  //   }

  //   if (data) {
  //     try {
  //       if (data.locations && data.locations.length > 0) {
  //         const { coords } = data.locations[0];
  //         const { latitude, longitude } = coords;
  //         console.log(
  //           "Received new location data from TaskManager - Latitude:",
  //           latitude,
  //           "Longitude:",
  //           longitude
  //         );

  //         const docSnapshot = await getDoc(providerProfilesCollection);
  //         if (docSnapshot.exists()) {
  //           const coordinates = docSnapshot.data().realTimeCoordinates;
  //           console.log("Coordinats ", coordinates);

  //           // Update the real-time coordinates field in Firestore
  //           await updateDoc(providerProfilesCollection, {
  //             realTimeCoordinates: {
  //               latitude: latitude,
  //               longitude: longitude,
  //             },
  //             // Retain other data
  //             // Add other fields you want to update here
  //           });
  //         }
  //         // // Update Firestore document with the new location data
  //         // await updateDoc(providerProfilesCollection, {
  //         //   realTimeCoordinates: {
  //         //     latitude: latitude,
  //         //     longitude: longitude,
  //         //   },
  //         // });
  //         // console.log("Location data updated in Firestore with UID of:" ,docSnapshot);
  //       }
  //     } catch (error) {
  //       console.error("Error updating Firestore document:", error);
  //     }
  //   }
  // });


  return isLoading ? (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size={60} color="#0000FF" />
    </View>
  ) : (
    <SafeAreaView style={styles.goToCustomer}>
    <StatusBar barStyle="default" />
    <ScrollView
      style={styles.body}
      indicatorStyle="default"
      showsVerticalScrollIndicator={true}
      showsHorizontalScrollIndicator={false}
      pagingEnabled={false}
      contentContainerStyle={styles.bodyScrollViewContent}
    >
      <View style={[styles.bodyInner, styles.innerFlexBox]}>
        <View style={[styles.frameParent, styles.frameParentSpaceBlock]}>
          <View style={styles.bookingDetailsLabelParent}>
            <View style={styles.bookingDetailsLabel}>
              <Text
                style={[styles.bookingDetails, styles.customerName1FlexBox]}
              >
                Booking details
              </Text>
            </View>
            <View style={[styles.bookingDetailsLabel1, styles.viewFlexBox]}>
              <View style={styles.customerName1Wrapper}>
                <Text
                  style={[styles.customerName1, styles.customerName1FlexBox]}
                >
                  {bookingName}
                </Text>
              </View>
              <Pressable 
                style={styles.message}               
                onPress={() => {Linking.openURL(`sms:${phoneUser}`);}}
              >
                <Image
                  style={styles.vectorIcon}
                  contentFit="cover"
                  source={require("../assets/vector7.png")}
                />
                <Image
                  style={[styles.vectorIcon1, styles.vectorIconLayout]}
                  contentFit="cover"
                  source={require("../assets/vector8.png")}
                />
              </Pressable>
              <Pressable 
                style={styles.message}                   
                onPress={() => {Linking.openURL(`tel:${phoneUser}`);}}
              >
                <Image
                  style={styles.vectorIcon}
                  contentFit="cover"
                  source={require("../assets/vector7.png")}
                />
                <Image
                  style={[styles.vectorIcon3, styles.vectorIconLayout]}
                  contentFit="cover"
                  source={require("../assets/vector9.png")}
                />
              </Pressable>
            </View>
            <View style={styles.addressFrame}>
              <View
                style={[
                  styles.markersNearPinletMarkerWrapper,
                  styles.frameParentSpaceBlock,
                ]}
              >
                <Image
                  style={styles.markersNearPinletMarker}
                  contentFit="cover"
                  source={require("../assets/markers--near-pinlet-marker1.png")}
                />
              </View>
              <View style={styles.frameWrapper}>
                <View style={styles.frame}>
                  <Text
                    style={[styles.universityOfSan, styles.august112023Typo]}
                  >
                    {bookingAddress}
                  </Text>
                </View>
              </View>
            </View>
            <View style={styles.dateAndTimeFrame}>
              <View style={styles.dateAndTimeFrameInner}>
                <View style={styles.clock1Wrapper}>
                  <Image
                    style={styles.clock1Icon}
                    contentFit="cover"
                    source={require("../assets/clock-1.png")}
                  />
                </View>
              </View>
              <View style={styles.frameWrapper}>
                <View style={styles.frame}>
                  <Text
                    style={[styles.universityOfSan, styles.august112023Typo]}
                  >
                    {bookingTime}
                  </Text>
                </View>
              </View>
            </View>
          </View>
          { bookingAddressDetails.note ? (
            <View>
              { (bookingAddressDetails.floor || bookingAddressDetails.house || bookingAddressDetails.street) ? (
                <View style={[styles.bookingDetailsLabelGroup, styles.bookingFlexBox]}>
                  <View style={styles.bookingDetailsLabel}>
                    <Text
                      style={[
                        styles.addressInstructions,
                        styles.pleaseMeetMeFlexBox,
                      ]}
                    >
                      Address Instructions
                    </Text>
                  </View>
                  {bookingAddressDetails.label? (
                    <View>
                      <View style={styles.frame2}>
                        <Text style={[styles.pleaseMeetMe, styles.amClr]}>
                          {bookingAddressDetails.label && 
                            <Text style={[styles.pleaseMeetMe2, styles.amClr]}>
                              ({bookingAddressDetails.label}){' '}
                            </Text>
                          }
                          {
                            [
                              bookingAddressDetails.street,
                              bookingAddressDetails.house,
                              bookingAddressDetails.floor
                            ].filter(Boolean).join(', ')
                          }
                        </Text>
                      </View>
                      <View style={styles.frame2}>
                        <Text style={[styles.pleaseMeetMe, styles.amClr]}>
                          Note: {bookingAddressDetails.note}
                        </Text>
                      </View>
                    </View>
                  ) : (
                    <View>
                      <View style={styles.frame2}>
                        <Text style={[styles.pleaseMeetMe, styles.amClr]}>
                          {
                            [
                              bookingAddressDetails.street,
                              bookingAddressDetails.house,
                              bookingAddressDetails.floor
                            ].filter(Boolean).join(', ')
                          }
                        </Text>
                      </View>
                      <View style={styles.frame2}>
                        <Text style={[styles.pleaseMeetMe, styles.amClr]}>
                          Note: {bookingAddressDetails.note}
                        </Text>
                      </View>
                    </View>
                  )}
                </View>
              ) : (
                <View style={[styles.bookingDetailsLabelGroup, styles.bookingFlexBox]}>
                  <View style={styles.bookingDetailsLabel}>
                    <Text
                      style={[
                        styles.addressInstructions,
                        styles.pleaseMeetMeFlexBox,
                      ]}
                    >
                      Address Instructions
                    </Text>
                  </View>
                  {bookingAddressDetails.label? (
                    <View>
                      <View style={styles.frame2}>
                        <Text style={[styles.pleaseMeetMe, styles.amClr]}>
                          {bookingAddressDetails.label && 
                            <Text style={[styles.pleaseMeetMe2, styles.amClr]}>
                              {bookingAddressDetails.label ? `(${bookingAddressDetails.label}) ` : ''}
                            </Text>
                          }
                          {' '}{bookingAddressDetails.note}
                        </Text>
                      </View>
                    </View>
                  ) : (
                    <Text style={[styles.pleaseMeetMe, styles.amClr]}>
                      {bookingAddressDetails.note}
                    </Text>
                  )}
                </View>
              )}
            </View>         
          ) : (
            <View>
              { (bookingAddressDetails.floor || bookingAddressDetails.house || bookingAddressDetails.street) ? (
                <View style={[styles.bookingDetailsLabelGroup, styles.bookingFlexBox]}>
                  <View style={styles.bookingDetailsLabel}>
                    <Text
                      style={[
                        styles.addressInstructions,
                        styles.pleaseMeetMeFlexBox,
                      ]}
                    >
                      Address Instructions
                    </Text>
                  </View>
                  {bookingAddressDetails.label? (
                    <View>
                      <View style={styles.frame2}>
                        <Text style={[styles.pleaseMeetMe, styles.amClr]}>
                          {bookingAddressDetails.label && 
                            <Text style={[styles.pleaseMeetMe2, styles.amClr]}>
                              ({bookingAddressDetails.label}){' '}
                            </Text>
                          }
                          {
                            [
                              bookingAddressDetails.street,
                              bookingAddressDetails.house,
                              bookingAddressDetails.floor
                            ].filter(Boolean).join(', ')
                          }
                        </Text>
                      </View>
                    </View>
                  ) : (
                    <View>
                      <View style={styles.frame2}>
                        <Text style={[styles.pleaseMeetMe, styles.amClr]}>
                          {
                            [
                              bookingAddressDetails.street,
                              bookingAddressDetails.house,
                              bookingAddressDetails.floor
                            ].filter(Boolean).join(', ')
                          }
                        </Text>
                      </View>
                    </View>
                  )}
                </View>
              ) : (
                <View style={[styles.bookingDetailsLabelGroup, styles.bookingFlexBox]}>
                  <View style={styles.bookingDetailsLabel}>
                    <Text
                      style={[
                        styles.addressInstructions,
                        styles.pleaseMeetMeFlexBox,
                      ]}
                    >
                      No Additional Address Instructions
                    </Text>
                  </View>
                </View>
              )}
            </View>
          )}
        </View>
      </View>
    </ScrollView>
            <View
            style={[
              styles.bookingDetailsLabelContainer,
              styles.bookingFlexBox,
            ]}
          >
              <View style={styles.bookingDetailsLabel4}>
                <Text
                  style={[styles.arriveAt, styles.amClr]}
                >{`Arrive at `}</Text>
                <Text style={[styles.am, styles.amClr]}>9:30 AM</Text>
              </View>
            </View>
            <View style={[styles.mapContainer]}>
              <MapView
                ref={mapRef}
                // style={[styles.map, { height: mapHeight }]}
                style={styles.map}
                region={initialMapRegion}
                onLayout={onMapLayout}
              >
                {providerCoordinates.latitude && providerCoordinates.longitude && (
                  <Marker
                    coordinate={providerCoordinates}
                    title="Provider's Location"
                    draggable={false}
                    image={require("../assets/provider-2.png")}
                  />
                )}
                {bookingCoordinates.latitude && bookingCoordinates.longitude && (
                  <Marker
                    coordinate={{
                      latitude: bookingCoordinates.latitude,
                      longitude: bookingCoordinates.longitude,
                    }}
                    title="Customer's Location"
                    draggable={false}
                    image={require("../assets/home-2.png")}
                  />
                )}
                {/* Directions Button */}
              </MapView>
              <TouchableOpacity
                style={styles.directionsButton}
                onPress={handleGetDirections}
              >
                <Image
                  source={require("../assets/navigation-1-1.png")}
                  style={styles.buttonIcon}
                />
              </TouchableOpacity>
            </View>
    <View style={[styles.goToCustomerInner, styles.innerFlexBox]}>
      <View style={styles.bookingDetailsLabel}>
        <Pressable
          style={[styles.viewTimelineBtn, styles.viewTimelineBtnFlexBox]}
          onPress={() => handleArrival(itemID)}
        >
          <Text style={[styles.viewAllServices1, styles.viewTypo]}>
            Arrived at the Customer
          </Text>
        </Pressable>
      </View>
    </View>
    </SafeAreaView>
  )
};

const styles = StyleSheet.create({
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  mapContainer: {
    // height: "50%", // or whatever height you prefer
    flex: 1,
    marginHorizontal: 10, // Horizontal padding
    marginTop: 10, // Top padding
    marginBottom: 20, // Top padding
    borderRadius: 10, // If you want rounded corners
    overflow: "hidden", // This property will hide the map's overflow to respect the border radius
    borderWidth: 1,
    borderColor: "#ccc",
  },
  buttonIcon: {
    width: 30, // Size of the directions icon image
    height: 30,
  },
  directionsButton: {
    position: "absolute",
    bottom: 10, // You can adjust this
    right: 10, // You can adjust this
    padding: 10,
    backgroundColor: "white", // Your desired color
    borderRadius: 20,
    elevation: 10, // For Android shadow
  },



  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },


  header: {
    backgroundColor: "#1a244d",
  },
  bodyScrollViewContent: {
    flexDirection: "column",
    paddingHorizontal: 2,
    paddingVertical: 15,
    flexGrow: 1,
    justifyContent: 'space-between', // This will push the content and map apart
  },
  viewFlexBox: {
    paddingHorizontal: 0,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    alignSelf: "stretch",
  },
  innerFlexBox: {
    justifyContent: "flex-end",
    alignItems: "center",
  },
  frameParentSpaceBlock: {
    paddingVertical: 0,
    justifyContent: "center",
  },
  customerName1FlexBox: {
    display: "flex",
    color: Color.colorDarkslateblue_100,
    textAlign: "left",
    alignItems: "center",
    flex: 1,
  },
  vectorIconLayout: {
    maxHeight: "100%",
    maxWidth: "100%",
    position: "absolute",
    overflow: "hidden",
    zIndex: 1,
  },
  august112023Typo: {
    color: Color.lightLabelPrimary,
    fontSize: FontSize.paragraphMedium15_size,
    textAlign: "left",
    flex: 1,
  },
  bookingFlexBox: {
    marginTop: 5,
    justifyContent: "center",
    alignSelf: "stretch",
  },
  pleaseMeetMeFlexBox: {
    textAlign: "left",
    flex: 1,
  },
  amClr: {
    color: Color.colorGray_300,
    fontSize: FontSize.paragraphMedium15_size,
  },
  frameViewFlexBox: {
    borderRadius: Border.br_3xs,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "stretch",
  },
  image2533IconLayout: {
    height: 30,
    width: 30,
    position: "absolute",
  },
  viewTimelineBtnFlexBox: {
    borderRadius: Border.br_mini,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    flex: 1,
  },
  viewTypo: {
    color: Color.neutral01,
    lineHeight: 24,
    textAlign: "center",
    fontFamily: FontFamily.title2Bold32,
    fontWeight: "700",
  },
  bookingDetails: {
    fontFamily: FontFamily.workSansRegular,
    fontSize: FontSize.bodyLgBodyLgRegular_size,
    alignSelf: "stretch",
  },
  bookingDetailsLabel: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    alignSelf: "stretch",
  },
  bookingDetailsLabel2: {
    display: "none",
  },
  customerName1: {
    fontFamily: FontFamily.workSansSemiBold,
    height: 23,
    fontWeight: "600",
    fontSize: FontSize.title3Bold20_size,
  },
  customerName1Wrapper: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    flex: 1,
  },
  vectorIcon: {
    width: 23,
    height: 23,
    zIndex: 0,
  },
  vectorIcon1: {
    height: "83.33%",
    width: "83.33%",
    top: "8.33%",
    right: "8.33%",
    bottom: "8.33%",
    left: "8.33%",
  },
  message: {
    marginLeft: 10,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  vectorIcon3: {
    height: "75%",
    width: "75%",
    top: "12.5%",
    right: "12.5%",
    bottom: "12.5%",
    left: "12.5%",
  },
  bookingDetailsLabel1: {
    paddingVertical: Padding.p_8xs,
    marginTop: 5,
  },
  markersNearPinletMarker: {
    height: 41,
    width: 32,
  },
  markersNearPinletMarkerWrapper: {
    paddingHorizontal: Padding.p_9xs,
    alignItems: "center",
    flexDirection: "row",
  },
  universityOfSan: {
    fontWeight: "500",
    fontFamily: FontFamily.workSansMedium,
  },
  frame: {
    alignItems: "center",
    flexDirection: "row",
    alignSelf: "stretch",
  },
  frameWrapper: {
    marginLeft: 7,
    justifyContent: "center",
    flex: 1,
  },
  addressFrame: {
    marginTop: 5,
    justifyContent: "center",
    flexDirection: "row",
    alignSelf: "stretch",
  },
  clock1Icon: {
    height: 32,
    width: 32,
  },
  clock1Wrapper: {
    padding: Padding.p_9xs,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  dateAndTimeFrameInner: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  august112023: {
    fontFamily: FontFamily.workSansRegular,
  },
  dateAndTimeFrame: {
    marginTop: 5,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    alignSelf: "stretch",
  },
  bookingDetailsLabelParent: {
    padding: Padding.p_8xs,
    justifyContent: "center",
    alignSelf: "stretch",
    backgroundColor: Color.m3White,
  },
  addressInstructions: {
    color: "#5a5a5a",
    fontFamily: FontFamily.workSansRegular,
    fontSize: FontSize.bodyLgBodyLgRegular_size,
  },
  pleaseMeetMe: {
    fontFamily: FontFamily.interRegular,
    color: Color.colorGray_300,
    textAlign: "left",

  },
  pleaseMeetMe2: {
    fontFamily: FontFamily.levelSemibold14,
    color: Color.colorGray_300,
    textAlign: "left",

  },
  frame2: {
    alignItems: "center",
    flexDirection: "row",
    flex: 1,
    alignSelf: "stretch",
  },
  bookingDetailsLabel3: {
    marginTop: 5,
    padding: Padding.p_8xs,
    alignItems: "center",
    flexDirection: "row",
    alignSelf: "stretch",
  },
  bookingDetailsLabelGroup: {
    padding: Padding.p_8xs,
    backgroundColor: Color.m3White,
  },
  arriveAt: {
    fontFamily: FontFamily.interRegular,
    color: Color.colorGray_300,
    textAlign: "center",
  },
  am: {
    fontFamily: FontFamily.levelSemibold14,
    marginLeft: 5,
    fontWeight: "600",
    textAlign: "center",
  },
  bookingDetailsLabel4: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    alignSelf: "stretch",
  },
  technician1Icon: {
    width: 27,
    height: 27,
    zIndex: 0,
  },
  icons8Location10021: {
    top: 0,
    left: 0,
    zIndex: 0,
  },
  icons8Location10021Wrapper: {
    top: 20,
    left: 58,
    padding: Padding.p_3xs,
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  navigation11: {
    width: 33,
    height: 33,
  },
  navigation11Wrapper: {
    borderRadius: Border.br_xl,
    shadowColor: "rgba(0, 0, 0, 0.25)",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowRadius: 4,
    elevation: 4,
    shadowOpacity: 1,
    width: 40,
    height: 40,
    paddingHorizontal: Padding.p_xs,
    paddingVertical: Padding.p_9xs,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    backgroundColor: Color.m3White,
  },
  currentLocationBtn: {
    top: 155,
    left: 285,
    position: "absolute",
    zIndex: 2,
    flexDirection: "row",
  },
  image2533Icon: {
    top: 145,
    left: 128,
    zIndex: 3,
  },
  technician1Parent: {
    height: 200,
    flexDirection: "row",
  },
  frameView: {
    borderStyle: "solid",
    borderColor: Color.colorLightgray_100,
    borderWidth: 1,
    marginTop: 5,
  },
  bookingDetailsLabelContainer: {
    // paddingHorizontal: Padding.p_8xs,
    // paddingTop: Padding.p_8xs,
    // paddingBottom: Padding.p_3xs,
  },
  viewAllServices: {
    letterSpacing: -0.1,
    fontSize: FontSize.paragraphMedium15_size,
    color: Color.neutral01,
    lineHeight: 24,
  },
  componentsbutton: {
    backgroundColor: Color.colorSteelblue,
    paddingHorizontal: Padding.p_3xl,
    paddingVertical: Padding.p_5xs,
  },
  componentsbuttonWrapper: {
    alignItems: "flex-end",
    justifyContent: "center",
    flexDirection: "row",
    alignSelf: "stretch",
  },
  frameWrapper1: {
    padding: Padding.p_8xs,
    backgroundColor: Color.colorWhitesmoke_200,
  },
  frameParent: {
    paddingHorizontal: Padding.p_3xs,
    alignSelf: "stretch",
  },
  bodyInner: {
    alignSelf: "stretch",
  },
  body: {
    // zIndex: 2,
    // alignSelf: "stretch",
    flex: 1,
  },
  viewAllServices1: {
    letterSpacing: -0.2,
    fontSize: FontSize.title3Bold20_size,
    flex: 1,
  },
  viewTimelineBtn: {
    backgroundColor: Color.colorDarkslategray_600,
    padding: Padding.p_xs,
  },
  goToCustomerInner: {
    padding: Padding.p_mini,
    zIndex: 3,
    alignSelf: "stretch",
    backgroundColor: Color.m3White,
  },
  serviceProviderIcon: {
    top: 456,
    left: 109,
    width: 20,
    height: 20,
    zIndex: 4,
    position: "absolute",
  },
  goToCustomer: {
    height: 812,
    width: "100%",
    flex: 1,
    backgroundColor: Color.colorWhitesmoke_200,
  },
});

export default GoToCustomer;
