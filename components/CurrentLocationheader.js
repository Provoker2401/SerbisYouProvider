import React, { useState, useEffect, useContext } from "react";
import {
  View,
  StyleSheet,
  Text,
  Pressable,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Location from "expo-location";
import { Image } from "expo-image";
import axios from "axios";
import { Color, Padding, FontSize, FontFamily, Border } from "../GlobalStyles";
import MultipleLocationModal from "./MultipleLocationModal";
import { getAuth } from "firebase/auth";
import {
  getFirestore,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
  collection,
  addDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import * as TaskManager from "expo-task-manager";
import { AddressSelectedContext } from "../AddressSelectedContext";

const CurrentLocationheader = ({ style }) => {
  let providerLatitude;
  let providerLongitude;
  const [address, setAddress] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedOption, setSelectedOption] = useState(0);
  const [locationBtnVisible, setLocationBtnVisible] = useState(false);
  const { currentAddress, setCurrentAddress, currentOption, setCurrentOption, chosenOptionLatitude, chosenOptionLongitude } = useContext(AddressSelectedContext);

  const openLocationBtn = () => {
    setLocationBtnVisible(true);
  };

  const closeLocationBtn = () => {
    setLocationBtnVisible(false);
  };

  const handleLocationChange = (newLocation, value) => {
    // try {
      setCurrentAddress(newLocation);
      // setAddress(newLocation);
      console.log("Address: ", newLocation);
      setCurrentOption(value);
      console.log("Value: ", selectedOption);
      setLocationBtnVisible(false);

      // const db = getFirestore();
      // const auth = getAuth();
      // const providerAuth = auth.currentUser.uid;
      // const providerDocRef = doc(db, "providerProfiles", providerAuth);

      // await updateDoc(providerDocRef, {
      //   coordinates: {
      //     latitude: chosenOptionLatitude,
      //     longitude: chosenOptionLongitude,
      //   },
      // });
    // }catch (error) {
    //   console.error("Location change error:", error);

    //   Toast.show({
    //     type: "error",
    //     position: "top",
    //     text1: "Error",
    //     text2: error.message || "An error occurred while fetching location information",
    //     visibilityTime: 5000,
    //   });
    // }
  };

  useEffect(() => {
    const updateAddress = async () => {
      setAddress(currentAddress);
  
      try {
        if((chosenOptionLatitude && chosenOptionLongitude)){
          const db = getFirestore();
          const auth = getAuth();
          const providerAuth = auth.currentUser.uid;
          const providerDocRef = doc(db, "providerProfiles", providerAuth);
          console.log("This is executed!");
          console.log("Latitude: ", chosenOptionLatitude);
          console.log("Longitude: ", chosenOptionLongitude);
          await updateDoc(providerDocRef, {
            coordinates: {
              latitude: chosenOptionLatitude,
              longitude: chosenOptionLongitude,
            },
          });
        }else{
          console.log("Do Nothing!");
        }
      } catch (error) {
        console.error("Location change error:", error);
  
        Toast.show({
          type: "error",
          position: "top",
          text1: "Error",
          text2: error.message || "An error occurred while fetching location information",
          visibilityTime: 5000,
        });
      }
    };
  
    updateAddress();
  }, [currentAddress]); // Dependency array with currentAddress
  

  useEffect(() => {
    if(!currentAddress) {
      (async () => {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          console.error("Permission to access location was denied");
          return;
        }
  
        const location = await Location.getCurrentPositionAsync({});
  
        const addressResponse = await Location.reverseGeocodeAsync({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
  
        const apiKey = "AIzaSyAuaR8dxr95SLUTU-cidS7I-3uB6mEoJmA"; // Replace with your Google Maps API key
        const response = await axios.get(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${location.coords.latitude},${location.coords.longitude}&result_type=street_address&key=${apiKey}`
        );

        try {
          const db = getFirestore();
          const auth = getAuth();
          const providerAuth = auth.currentUser.uid;
          const providerDocRef = doc(db, "providerProfiles", providerAuth);
    
          await updateDoc(providerDocRef, {
            coordinates: {
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            },
          });
        }catch (error) {
          console.error("Location change error:", error);
    
          Toast.show({
            type: "error",
            position: "top",
            text1: "Error",
            text2: error.message || "An error occurred while fetching location information",
            visibilityTime: 5000,
          });
        }
  
        if (addressResponse.length > 0) {
          const addressInfo = addressResponse[0];
          console.log("Address: ", addressInfo);
  
          if (addressInfo.streetNumber !== null && addressInfo.street !== null && addressInfo.city !== null) {
            const cityOnly = `${addressResponse[0].streetNumber}, ${addressResponse[0].street}, ${addressResponse[0].city}`;
            console.log(cityOnly);
            // setAddress(cityOnly);
            setCurrentAddress(cityOnly);
          } else {
            console.log("Google Maps or OSM will be used");
            if (response.data.results && response.data.results.length > 0) {
              const firstResult = response.data.results[0];
                      console.log("First Result: ", firstResult);
   
              const addressComponents1 = firstResult.address_components.filter(
                (component) => {
                  // Check if any of the component's types match the excluded list
                  return !component.types.some(type => 
                    ["administrative_area_level_1", "administrative_area_level_2", "postal_code", "country"].includes(type)
                  );
                }
              );
              console.log("Components Address: ", addressComponents1);
      
              const formattedAddress1 = addressComponents1
                .map((component) => component.long_name)
                .join(", ");
      
              // setAddress(formattedAddress1);
              setCurrentAddress(formattedAddress1);
              // Console.log the city
              console.log("City Address:", formattedAddress1);
            } else {
              // If Google Geocoding API doesn't return results, try OpenStreetMap Nominatim API
              try {
                const osmResponse = await fetch(
                  `https://nominatim.openstreetmap.org/reverse?format=json&lat=${location.coords.latitude}&lon=${location.coords.longitude}`
                );
                const osmData = await osmResponse.json();
                console.log("OSM Data:", osmData);
                if (osmData.display_name) {
                  const addressParts = osmData.display_name.split(", ");
                  console.log("Address Parts:", addressParts);
                  // console.log("City Part:", addressParts);
                  // Remove the last 3 parts (region, zip code, and country)
                  const modifiedAddress = addressParts.slice(0, -4).join(", ");
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
                    const fullAddress = modifiedAddress + ", " + cityAddress;
                    console.log("City Address:", fullAddress);
                    // setAddress(fullAddress);
                    setCurrentAddress(fullAddress);
                  } else {
                    cityAddress = osmData.address.city;
                    const fullAddress = modifiedAddress + ", " + cityAddress;
                    // Handle case where no specific city is found
                    console.log("Address is out of Cebu City");
                    // setAddress(fullAddress);
                    setCurrentAddress(fullAddress);
                    // setcityAddress("Address is out of scope");
                  }
                } else {
                  console.log("Error fetching location with OpenStreetMap");
                }
              } catch (osmError) {
                console.error(
                  "Error fetching location with OpenStreetMap:",
                  osmError
                );
              }
            }
          }
        }
      })();
    }
  }, []);

  // CURRENT LOCATION ONLY
  // useEffect(() => {
  //   const updateLocation = async () => {
  //     try {
  //       const db = getFirestore();
  //       const auth = getAuth();
  //       const providerUID = auth.currentUser.uid;
  //       const providerProfilesCollection = doc(db, "providerProfiles", providerUID);
  
  //       const { status } = await Location.requestForegroundPermissionsAsync();
  //       if (status !== "granted") {
  //         console.error("Permission to access location was denied");
  //         return;
  //       }

  //       const docSnapshot = await getDoc(providerProfilesCollection);
  //       if (docSnapshot.exists()) {
  //         const coordinates = docSnapshot.data().coordinates;
  //         console.log("Coordinates ", coordinates);
  //         providerLatitude = coordinates.latitude;
  //         providerLongitude = coordinates.longitude;
  //       }
  //       console.log("Received OG location data:", providerLatitude, providerLongitude);

  //       const addressResponse = await Location.reverseGeocodeAsync({
  //         latitude: providerLatitude,
  //         longitude: providerLongitude,
  //       });

  //       const apiKey = "AIzaSyAuaR8dxr95SLUTU-cidS7I-3uB6mEoJmA"; // Replace with your Google Maps API key
  //       const response = await axios.get(
  //         `https://maps.googleapis.com/maps/api/geocode/json?latlng=${providerLatitude},${providerLongitude}&result_type=street_address&key=${apiKey}`
  //       );
  
  //       if (addressResponse.length > 0) {
  //         const addressInfo = addressResponse[0];
  //         console.log("Address: ", addressInfo);
  
  //         if (addressInfo.streetNumber !== null && addressInfo.street !== null && addressInfo.city !== null) {
  //           const cityOnly = `${addressResponse[0].streetNumber}, ${addressResponse[0].street}, ${addressResponse[0].city}`;
  //           console.log(cityOnly);
  //           console.log("This is executed");
  //           setAddress(cityOnly);
  //         } else {
  //           console.log("Google Maps or OSM will be used");
  //           if (response.data.results && response.data.results.length > 0) {
  //             const firstResult = response.data.results[0];
  //             console.log("First Result: ", firstResult);
   
  //             const addressComponents1 = firstResult.address_components.filter(
  //               (component) => {
  //                 // Check if any of the component's types match the excluded list
  //                 return !component.types.some(type => 
  //                   ["administrative_area_level_1", "administrative_area_level_2", "postal_code", "country"].includes(type)
  //                 );
  //               }
  //             );
  //             console.log("Components Address: ", addressComponents1);
      
  //             const formattedAddress1 = addressComponents1
  //               .map((component) => component.long_name)
  //               .join(", ");
      
  //             setAddress(formattedAddress1);
  //             console.log("City Address:", formattedAddress1);
  //           } else {
  //             // If Google Geocoding API doesn't return results, try OpenStreetMap Nominatim API
  //             try {
  //               const osmResponse = await fetch(
  //                 `https://nominatim.openstreetmap.org/reverse?format=json&lat=${providerLatitude}&lon=${providerLongitude}`
  //               );
  //               const osmData = await osmResponse.json();
  //               console.log("OSM Data:", osmData);
  //               if (osmData.display_name) {
  //                 const addressParts = osmData.display_name.split(", ");
  //                 console.log("Address Parts:", addressParts);
 
  //                 // Remove the last 3 parts (region, zip code, and country)
  //                 const modifiedAddress = addressParts.slice(0, -4).join(", ");
  //                 console.log("Modified Address:", modifiedAddress);
                  
  //                 // New variable for city address
  //                 let cityAddress = "";
      
  //                 // Loop through addressParts to find specific city names
  //                 for (const part of addressParts) {
  //                   if (["Cebu", "Cebu City"].includes(part)) {
  //                     cityAddress = "Cebu City";
  //                     break; // Exit loop once the city is found
  //                   } else if (["Mandaue", "Mandaue City"].includes(part)) {
  //                     cityAddress = "Mandaue City";
  //                     break; // Exit loop once the city is found
  //                   } else if (["Lapu-Lapu", "Lapu-Lapu City"].includes(part)) {
  //                     cityAddress = "Lapu-Lapu City";
  //                     break; // Exit loop once the city is found
  //                   } 
  //                 }
  
  //                 console.log(cityAddress);
      
  //                 // Use the cityAddress variable
  //                 if (cityAddress) {
  //                   const fullAddress = modifiedAddress + ", " + cityAddress;
  //                   console.log("City Address:", fullAddress);
  //                   setAddress(fullAddress);
  //                 } else {
  //                   cityAddress = osmData.address.city;
  //                   const fullAddress = modifiedAddress + ", " + cityAddress;
  //                   // Handle case where no specific city is found
  //                   console.log("Address is out of Cebu City");
  //                   setAddress(fullAddress);
  //                 }
  //               } else {
  //                 console.log("Error fetching location with OpenStreetMap");
  //               }
  //             } catch (osmError) {
  //               console.error(
  //                 "Error fetching location with OpenStreetMap:",
  //                 osmError
  //               );
  //             }
  //           }
  //         }
  //       }

  //       const currentLocation = await Location.getCurrentPositionAsync({});

  //       await updateDoc(providerProfilesCollection, {
  //         realTimeCoordinates: {
  //           latitude: currentLocation.coords.latitude,
  //           longitude: currentLocation.coords.longitude,
  //         },
  //       });
  //     } catch (error) {
  //       console.error("Error updating location:", error);
  //     }
  //   };
  
  //   updateLocation();
  
  //   return () => {
  //     // Cleanup on unmount
  //   };
  // }, []);



  // USING TASK MANAGER
  // TaskManager.defineTask(getCurrentLocationTask, async ({ data, error }) => {
  //   if (error) {
  //     console.error("Background location task error:", error);
  //     return;
  //   }

  //   if (data) {
  //     try {
  //       if (data.locations && data.locations.length > 0) {
  //         const { coords } = data.locations[0];

  //         const docSnapshot = await getDoc(providerProfilesCollection);
  //         if (docSnapshot.exists()) {
  //           const coordinates = docSnapshot.data().coordinates;
  //           console.log("Coordinates ", coordinates);
  //           latitude = coordinates.latitude;
  //           longitude = coordinates.longitude;
  //         }
  //         console.log("Received OG location data:", latitude, longitude);
  //         console.log("Received new location data:", coords);

  //         const addressResponse = await Location.reverseGeocodeAsync({
  //           latitude: latitude,
  //           longitude: longitude,
  //         });

  //         const apiKey = "AIzaSyAuaR8dxr95SLUTU-cidS7I-3uB6mEoJmA"; // Replace with your Google Maps API key
  //         const response = await axios.get(
  //           `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&result_type=street_address&key=${apiKey}`
  //         );
    
  //         if (addressResponse.length > 0) {
  //           const addressInfo = addressResponse[0];
  //           console.log("Address: ", addressInfo);
    
  //           if (addressInfo.streetNumber !== null && addressInfo.street !== null && addressInfo.city !== null) {
  //             const cityOnly = `${addressResponse[0].streetNumber}, ${addressResponse[0].street}, ${addressResponse[0].city}`;
  //             console.log(cityOnly);
  //             console.log("This is executed");
  //             setAddress(cityOnly);
  //           } else {
  //             console.log("Google Maps or OSM will be used");
  //             if (response.data.results && response.data.results.length > 0) {
  //               const firstResult = response.data.results[0];
  //               console.log("First Result: ", firstResult);
     
  //               const addressComponents1 = firstResult.address_components.filter(
  //                 (component) => {
  //                   // Check if any of the component's types match the excluded list
  //                   return !component.types.some(type => 
  //                     ["administrative_area_level_1", "administrative_area_level_2", "postal_code", "country"].includes(type)
  //                   );
  //                 }
  //               );
  //               console.log("Components Address: ", addressComponents1);
        
  //               const formattedAddress1 = addressComponents1
  //                 .map((component) => component.long_name)
  //                 .join(", ");
        
  //               setAddress(formattedAddress1);
  //               console.log("City Address:", formattedAddress1);
  //             } else {
  //               // If Google Geocoding API doesn't return results, try OpenStreetMap Nominatim API
  //               try {
  //                 const osmResponse = await fetch(
  //                   `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
  //                 );
  //                 const osmData = await osmResponse.json();
  //                 console.log("OSM Data:", osmData);
  //                 if (osmData.display_name) {
  //                   const addressParts = osmData.display_name.split(", ");
  //                   console.log("Address Parts:", addressParts);
   
  //                   // Remove the last 3 parts (region, zip code, and country)
  //                   const modifiedAddress = addressParts.slice(0, -4).join(", ");
  //                   console.log("Modified Address:", modifiedAddress);
                    
  //                   // New variable for city address
  //                   let cityAddress = "";
        
  //                   // Loop through addressParts to find specific city names
  //                   for (const part of addressParts) {
  //                     if (["Cebu", "Cebu City"].includes(part)) {
  //                       cityAddress = "Cebu City";
  //                       break; // Exit loop once the city is found
  //                     } else if (["Mandaue", "Mandaue City"].includes(part)) {
  //                       cityAddress = "Mandaue City";
  //                       break; // Exit loop once the city is found
  //                     } else if (["Lapu-Lapu", "Lapu-Lapu City"].includes(part)) {
  //                       cityAddress = "Lapu-Lapu City";
  //                       break; // Exit loop once the city is found
  //                     } 
  //                   }
    
  //                   console.log(cityAddress);
        
  //                   // Use the cityAddress variable
  //                   if (cityAddress) {
  //                     const fullAddress = modifiedAddress + ", " + cityAddress;
  //                     console.log("City Address:", fullAddress);
  //                     setAddress(fullAddress);
  //                   } else {
  //                     cityAddress = osmData.address.city;
  //                     const fullAddress = modifiedAddress + ", " + cityAddress;
  //                     // Handle case where no specific city is found
  //                     console.log("Address is out of Cebu City");
  //                     setAddress(fullAddress);
  //                   }
  //                 } else {
  //                   console.log("Error fetching location with OpenStreetMap");
  //                 }
  //               } catch (osmError) {
  //                 console.error(
  //                   "Error fetching location with OpenStreetMap:",
  //                   osmError
  //                 );
  //               }
  //             }
  //           }
  //         }

  //         // const docSnapshot = await getDoc(providerProfilesCollection);
  //         // if (docSnapshot.exists()) {
  //         //   const coordinates = docSnapshot.data().realTimeCoordinates;
  //         //   console.log("Coordinates ", coordinates);

  //         //   // Update the real-time coordinates field in Firestore
  //         //   await updateDoc(providerProfilesCollection, {
  //         //     coordinates: {
  //         //       latitude: latitude,
  //         //       longitude: longitude,
  //         //     },
  //         //   });


  //         // }
  //       }
  //     } catch (error) {
  //       console.error("Error updating Firestore document:", error);
  //     }
  //   }
  // });

  // TaskManager.defineTask(getCurrentLocationTask, async ({ data, error }) => {
  //   if (error) {
  //     console.error("Background location task error:", error);
  //     return;
  //   }
  
  //   if (data) {
  //     try {
  //       const { locations } = data;
  //       if (locations && locations.length > 0) {
  //         const { coords } = locations[0];
    
  //         console.log("Received new location data:", coords);
  
  //         const addressResponse = await Location.reverseGeocodeAsync(coords);
  
  //         if (addressResponse.length > 0) {
  //           const addressInfo = addressResponse[0];
  //           console.log("Address Info:", addressInfo);
  
  //           let address;
  //           if (addressInfo.streetNumber && addressInfo.street && addressInfo.city) {
  //             address = `${addressInfo.streetNumber}, ${addressInfo.street}, ${addressInfo.city}`;
  //           } else {
  //             // Handle cases where some address components are missing
  //             address = addressInfo.name || addressInfo.city || "Unknown Address";
  //           }
  
  //           setAddress(address);
  //         } else {
  //           console.log("No address found for coordinates:", coords);
  //         }
  //       }
  //     } catch (error) {
  //       console.error("Error processing location data:", error);
  //     }
  //   }
  // });
  

  // useFocusEffect(
  //   React.useCallback(() => {
  //     // Code to start your function here
  //     updateLocation();
  //     setIsRunning(true);
  //     return () => {
  //       // Cleanup function: Stop the function when the screen loses focus
  //       if (isRunning) {
  //         // Code to stop the function here
  //         // stopUpdateLocation();
  //         // console.log("Stop the finding");
  //       }
  //     };
  //   }, [isRunning]) // Only run when isRunning changes
  // );

  // const stopUpdateLocation = async () => {
  //   try {
  //     await Location.stopLocationUpdatesAsync(getCurrentLocationTask);
  //     console.log("Background location stopped");
  //     await TaskManager.unregisterAllTasksAsync();
  //     console.log("All tasks unregistered");
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // const updateLocation = async () => {
  //   try {
  //     const { status } = await Location.requestForegroundPermissionsAsync();
  //     if (status !== "granted") {
  //       console.error("Permission to access location was denied");
  //       return;
  //     }

  //     // Get the current location every 5 seconds

  //     await Location.startLocationUpdatesAsync(
  //       getCurrentLocationTask,
  //       {
  //         accuracy: Location.Accuracy.High,
  //         timeInterval: 5000,
  //         distanceInterval: 100,
  //       },
  //       async ({ locations }) => {
  //         if (locations && locations.length > 0) {
  //           const { coords } = locations[0];

  //           const docSnapshot = await getDoc(providerProfilesCollection);
  //           if (docSnapshot.exists()) {
  //             const coordinates = docSnapshot.data().coordinates;
  //             console.log("Coordinates ", coordinates);
  //             latitude = coordinates.latitude;
  //             longitude = coordinates.longitude;
  //           }
  //           console.log("Received OG location data:", latitude, longitude);
  //           console.log("Received new location data:", coords);
  //         }
  //         const addressResponse = await Location.reverseGeocodeAsync({
  //           latitude: latitude,
  //           longitude: longitude,
  //         });

  //         const apiKey = "AIzaSyAuaR8dxr95SLUTU-cidS7I-3uB6mEoJmA"; // Replace with your Google Maps API key
  //         const response = await axios.get(
  //           `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&result_type=street_address&key=${apiKey}`
  //         );
    
  //         if (addressResponse.length > 0) {
  //           const addressInfo = addressResponse[0];
  //           console.log("Address: ", addressInfo);
    
  //           if (addressInfo.streetNumber !== null && addressInfo.street !== null && addressInfo.city !== null) {
  //             const cityOnly = `${addressResponse[0].streetNumber}, ${addressResponse[0].street}, ${addressResponse[0].city}`;
  //             console.log(cityOnly);
  //             setAddress(cityOnly);
  //           } else {
  //             console.log("Google Maps or OSM will be used");
  //             if (response.data.results && response.data.results.length > 0) {
  //               const firstResult = response.data.results[0];
  //               console.log("First Result: ", firstResult);
     
  //               const addressComponents1 = firstResult.address_components.filter(
  //                 (component) => {
  //                   // Check if any of the component's types match the excluded list
  //                   return !component.types.some(type => 
  //                     ["administrative_area_level_1", "administrative_area_level_2", "postal_code", "country"].includes(type)
  //                   );
  //                 }
  //               );
  //               console.log("Components Address: ", addressComponents1);
        
  //               const formattedAddress1 = addressComponents1
  //                 .map((component) => component.long_name)
  //                 .join(", ");
        
  //               setAddress(formattedAddress1);
  //               console.log("City Address:", formattedAddress1);
  //             } else {
  //               // If Google Geocoding API doesn't return results, try OpenStreetMap Nominatim API
  //               try {
  //                 const osmResponse = await fetch(
  //                   `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
  //                 );
  //                 const osmData = await osmResponse.json();
  //                 console.log("OSM Data:", osmData);
  //                 if (osmData.display_name) {
  //                   const addressParts = osmData.display_name.split(", ");
  //                   console.log("Address Parts:", addressParts);
   
  //                   // Remove the last 3 parts (region, zip code, and country)
  //                   const modifiedAddress = addressParts.slice(0, -4).join(", ");
  //                   console.log("Modified Address:", modifiedAddress);
                    
  //                   // New variable for city address
  //                   let cityAddress = "";
        
  //                   // Loop through addressParts to find specific city names
  //                   for (const part of addressParts) {
  //                     if (["Cebu", "Cebu City"].includes(part)) {
  //                       cityAddress = "Cebu City";
  //                       break; // Exit loop once the city is found
  //                     } else if (["Mandaue", "Mandaue City"].includes(part)) {
  //                       cityAddress = "Mandaue City";
  //                       break; // Exit loop once the city is found
  //                     } else if (["Lapu-Lapu", "Lapu-Lapu City"].includes(part)) {
  //                       cityAddress = "Lapu-Lapu City";
  //                       break; // Exit loop once the city is found
  //                     } 
  //                   }
    
  //                   console.log(cityAddress);
        
  //                   // Use the cityAddress variable
  //                   if (cityAddress) {
  //                     const fullAddress = modifiedAddress + ", " + cityAddress;
  //                     console.log("City Address:", fullAddress);
  //                     setAddress(fullAddress);
  //                   } else {
  //                     cityAddress = osmData.address.city;
  //                     const fullAddress = modifiedAddress + ", " + cityAddress;
  //                     // Handle case where no specific city is found
  //                     console.log("Address is out of Cebu City");
  //                     setAddress(fullAddress);
  //                   }
  //                 } else {
  //                   console.log("Error fetching location with OpenStreetMap");
  //                 }
  //               } catch (osmError) {
  //                 console.error(
  //                   "Error fetching location with OpenStreetMap:",
  //                   osmError
  //                 );
  //               }
  //             }
  //           }
  //         }
  //       }
  //     );
  //   } catch (error) {
  //     console.error("Error updating location:", error);
  //   }
  // };
  // const updateLocation = async () => {
  //   try {
  //     const { status: backgroundStatus } = await Location.requestBackgroundPermissionsAsync();
  //     if (backgroundStatus !== "granted") {
  //       console.error("Permission to access background location was denied");
  //       return;
  //     }

  //     // Get the current location every 5 seconds

  //     await Location.startLocationUpdatesAsync(
  //       getCurrentLocationTask,
  //       {
  //         accuracy: Location.Accuracy.High,
  //         timeInterval: 5000,
  //         distanceInterval: 100,
  //       },
  //       async ({ locations }) => {
  //         if (locations && locations.length > 0) {
  //           const { coords } = locations[0];
  //           const { latitude, longitude } = coords;
  //           console.log("Received new location data:", coords);
  //         }
  //         const addressResponse = await Location.reverseGeocodeAsync({
  //           latitude: latitude,
  //           longitude: longitude,
  //         });

  //         const apiKey = "AIzaSyAuaR8dxr95SLUTU-cidS7I-3uB6mEoJmA"; // Replace with your Google Maps API key
  //         const response = await axios.get(
  //           `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&result_type=street_address&key=${apiKey}`
  //         );
    
  //         if (addressResponse.length > 0) {
  //           const addressInfo = addressResponse[0];
  //           console.log("Address: ", addressInfo);
    
  //           if (addressInfo.streetNumber !== null && addressInfo.street !== null && addressInfo.city !== null) {
  //             const cityOnly = `${addressResponse[0].streetNumber}, ${addressResponse[0].street}, ${addressResponse[0].city}`;
  //             console.log(cityOnly);
  //             setAddress(cityOnly);
  //           } else {
  //             console.log("Google Maps or OSM will be used");
  //             if (response.data.results && response.data.results.length > 0) {
  //               const firstResult = response.data.results[0];
  //               console.log("First Result: ", firstResult);
     
  //               const addressComponents1 = firstResult.address_components.filter(
  //                 (component) => {
  //                   // Check if any of the component's types match the excluded list
  //                   return !component.types.some(type => 
  //                     ["administrative_area_level_1", "administrative_area_level_2", "postal_code", "country"].includes(type)
  //                   );
  //                 }
  //               );
  //               console.log("Components Address: ", addressComponents1);
        
  //               const formattedAddress1 = addressComponents1
  //                 .map((component) => component.long_name)
  //                 .join(", ");
        
  //               setAddress(formattedAddress1);
  //               console.log("City Address:", formattedAddress1);
  //             } else {
  //               // If Google Geocoding API doesn't return results, try OpenStreetMap Nominatim API
  //               try {
  //                 const osmResponse = await fetch(
  //                   `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
  //                 );
  //                 const osmData = await osmResponse.json();
  //                 console.log("OSM Data:", osmData);
  //                 if (osmData.display_name) {
  //                   const addressParts = osmData.display_name.split(", ");
  //                   console.log("Address Parts:", addressParts);
   
  //                   // Remove the last 3 parts (region, zip code, and country)
  //                   const modifiedAddress = addressParts.slice(0, -4).join(", ");
  //                   console.log("Modified Address:", modifiedAddress);
                    
  //                   // New variable for city address
  //                   let cityAddress = "";
        
  //                   // Loop through addressParts to find specific city names
  //                   for (const part of addressParts) {
  //                     if (["Cebu", "Cebu City"].includes(part)) {
  //                       cityAddress = "Cebu City";
  //                       break; // Exit loop once the city is found
  //                     } else if (["Mandaue", "Mandaue City"].includes(part)) {
  //                       cityAddress = "Mandaue City";
  //                       break; // Exit loop once the city is found
  //                     } else if (["Lapu-Lapu", "Lapu-Lapu City"].includes(part)) {
  //                       cityAddress = "Lapu-Lapu City";
  //                       break; // Exit loop once the city is found
  //                     } 
  //                   }
    
  //                   console.log(cityAddress);
        
  //                   // Use the cityAddress variable
  //                   if (cityAddress) {
  //                     const fullAddress = modifiedAddress + ", " + cityAddress;
  //                     console.log("City Address:", fullAddress);
  //                     setAddress(fullAddress);
  //                   } else {
  //                     cityAddress = osmData.address.city;
  //                     const fullAddress = modifiedAddress + ", " + cityAddress;
  //                     // Handle case where no specific city is found
  //                     console.log("Address is out of Cebu City");
  //                     setAddress(fullAddress);
  //                   }
  //                 } else {
  //                   console.log("Error fetching location with OpenStreetMap");
  //                 }
  //               } catch (osmError) {
  //                 console.error(
  //                   "Error fetching location with OpenStreetMap:",
  //                   osmError
  //                 );
  //               }
  //             }
  //           }
  //         }
  //       }
  //     );
  //   } catch (error) {
  //     console.error("Error updating location:", error);
  //   }
  // };

    // const updateLocation = async () => {
  //   try {
  //     const db = getFirestore();
  //     const auth = getAuth();
  //     const userUID = auth.currentUser.uid;
  //     const providerProfilesCollection = doc(db, "providerProfiles", userUID);

  //     const { status } = await Location.requestForegroundPermissionsAsync();
  //     if (status !== "granted") {
  //       console.error("Permission to access location was denied");
  //       return;
  //     }

  //     // Get the current location every 5 seconds
  //     const locationWatchId = await Location.watchPositionAsync(
  //       {
  //         accuracy: Location.Accuracy.High,
  //         timeInterval: 5000,
  //         distanceInterval: 0,
  //       },
  //       async (location) => {
  //         const addressResponse = await Location.reverseGeocodeAsync({
  //           latitude: location.coords.latitude,
  //           longitude: location.coords.longitude,
  //         });

  //         // Retrieve the existing data from Firestore
  //         const existingDataSnapshot = await getDoc(providerProfilesCollection);
  //         const existingData = existingDataSnapshot.data();

  //         // Calculate the distance between the current and existing locations
  //         const distance = geolib.getDistance(
  //           {
  //             latitude: existingData?.coordinates?.latitude || 0,
  //             longitude: existingData?.coordinates?.longitude || 0,
  //           },
  //           {
  //             latitude: location.coords.latitude,
  //             longitude: location.coords.longitude,
  //           }
  //         );

  //         console.log("Distance:", distance);

  //         await updateDoc(providerProfilesCollection, {
  //           realTimeCoordinates: {
  //             latitude: location.coords.latitude,
  //             longitude: location.coords.longitude,
  //           },
  //           // Retain other data
  //           // Add other fields you want to update here
  //         });

  //         // Check if the coordinates field is empty or if the distance is greater than or equal to 100 meters
  //         if (!existingData?.coordinates || distance >= 100) {
  //           console.log("Existing Coordinates:", existingData?.coordinates);
  //           console.log("Distance is 100 meters far:", distance);
  //           await updateDoc(providerProfilesCollection, {
  //             coordinates: {
  //               latitude: location.coords.latitude,
  //               longitude: location.coords.longitude,
  //             },
  //             // Retain other data
  //             // Add other fields you want to update here
  //           });
  //         }

  //         if (addressResponse.length > 0) {
  //           const addressInfo = addressResponse[0];
  //           let cityOnly = "";
  //           if (addressInfo.streetNumber !== null) {
  //             cityOnly = `${addressResponse[0].streetNumber}, ${addressResponse[0].street}, ${addressResponse[0].city}`;
  //           } else {
  //             cityOnly = `${addressResponse[0].street}, ${addressResponse[0].city}`;
  //           }
  //           console.log(cityOnly);
  //           setAddress(cityOnly);
  //         }
  //       }
  //     );
  //   } catch (error) {
  //     console.error("Error updating location:", error);
  //   }
  // };

  // const getCurrentLocation = async () => {
  //   let location = await Location.getCurrentPositionAsync({
  //     accuracy: Location.Accuracy.High,
  //   });

  //   setLocation(location);

  //   console.log("Location", location);
  // };

  // useEffect(() => {
  //   (async () => {
  //     try{
  //       const db = getFirestore();
  //       const auth = getAuth();
  //       const userUID = auth.currentUser.uid;
  //       const providerProfilesCollection = doc(db, "providerProfiles", userUID);

  //       const { status } = await Location.requestForegroundPermissionsAsync();
  //       if (status !== "granted") {
  //         console.error("Permission to access location was denied");
  //         return;
  //       }
  
  //       const location = await Location.getCurrentPositionAsync({});
  
  //       const addressResponse = await Location.reverseGeocodeAsync({
  //         latitude: location.coords.latitude,
  //         longitude: location.coords.longitude,
  //       });
  //       await setDoc(providerProfilesCollection, {
  //         coordinates: {
  //             latitude: location.coords.latitude,
  //             longitude: location.coords.longitude,
  //         },
  //       });
  
  //       if (addressResponse.length > 0) {
  //         const addressInfo = addressResponse[0];
  
  //         if (addressInfo.streetNumber !== null) {
  //           const cityOnly = `${addressResponse[0].streetNumber}, ${addressResponse[0].street}, ${addressResponse[0].city}`;
  //           console.log(cityOnly);
  //           setAddress(cityOnly);
  //         } else {
  //           const cityOnly = `${addressResponse[0].street}, ${addressResponse[0].city}`;
  //           console.log(cityOnly);
  //           setAddress(cityOnly);
  //         }
  //       }
  //     }catch (error) {
  //       console.error("Error retrieving data:", error);
  //     }
  //   })();
  // }, []);
  // useEffect(() => {
  //   const calculateDistance = async () => {
  //     try {
  //       const db = getFirestore();
  //       const auth = getAuth();
  //       const userUID = auth.currentUser.uid;
  //       const providerProfilesCollection = doc(db, "providerProfiles", userUID);
  
  //       const { status } = await Location.requestForegroundPermissionsAsync();
  //       if (status !== "granted") {
  //         console.error("Permission to access location was denied");
  //         return;
  //       }
  
  //       const location = await Location.getCurrentPositionAsync({});
  
  //       const addressResponse = await Location.reverseGeocodeAsync({
  //         latitude: location.coords.latitude,
  //         longitude: location.coords.longitude,
  //       });
  
  //       // Retrieve the existing data from Firestore
  //       const existingDataSnapshot = await getDoc(providerProfilesCollection);
  //       const existingData = existingDataSnapshot.data();
  
  //       // Calculate the distance between the current and existing locations

  
  //       // Check if the coordinates field is empty or if the distance is greater than or equal to 100 meters
  //       if (!existingData?.coordinates) {
  //         console.log("Coordinates field is empty");
  //         // Add the fetched distance to Firestore
  //         await updateDoc(providerProfilesCollection, {
  //           coordinates: {
  //             latitude: location.coords.latitude,
  //             longitude: location.coords.longitude,
  //           },
  //           // Retain other data
  //           // Add other fields you want to update here
  //         });
  //       }else{
  //         console.log("Calculating Distance...");
  //         console.log("Provider lat: " , location.coords.latitude);
  //         console.log("Provider Long: " , location.coords.longitude);
  //         console.log("User latitude: " , existingData?.coordinates?.latitude);
  //         console.log("User longitude: " , existingData?.coordinates?.longitude);

  //         const distance = geolib.getDistance(
  //           {
  //             latitude: existingData?.coordinates?.latitude || 0,
  //             longitude: existingData?.coordinates?.longitude || 0,
  //           },
  //           {
  //             latitude: location.coords.latitude,
  //             longitude: location.coords.longitude,
  //           }
  //         );
  //         console.log("Distance: " , distance);

  //         // Check if the distance is greater than or equal to 100 meters
  //         if (distance >= 100) {

  //           // Update the coordinates field in Firestore
  //           await updateDoc(providerProfilesCollection, {
  //             coordinates: {
  //               latitude: location.coords.latitude,
  //               longitude: location.coords.longitude,
  //             },
  //             // Retain other data
  //             // Add other fields you want to update here
  //           });
  //         }
  //       }  
  
  //       if (addressResponse.length > 0) {
  //         const addressInfo = addressResponse[0];
  
  //         if (addressInfo.streetNumber !== null) {
  //           const cityOnly = `${addressResponse[0].streetNumber}, ${addressResponse[0].street}, ${addressResponse[0].city}`;
  //           console.log(cityOnly);
  //           setAddress(cityOnly);
  //         } else {
  //           const cityOnly = `${addressResponse[0].street}, ${addressResponse[0].city}`;
  //           console.log(cityOnly);
  //           setAddress(cityOnly);
  //         }
  //       }
  //     } catch (error) {
  //       console.error("Error retrieving data:", error);
  //     }
  //   };

  //   // Call the function initially and every time the location changes
  //   calculateDistance();
  //   const interval = setInterval(calculateDistance, 60000); // Recalculate every minute
  
  //   return () => clearInterval(interval); // Cleanup on unmount
  // }, []);

  // useEffect(() => {
  //   const updateLocation = async () => {
  //     try {
  //       const db = getFirestore();
  //       const auth = getAuth();
  //       const userUID = auth.currentUser.uid;
  //       const providerProfilesCollection = doc(db, "providerProfiles", userUID);
  
  //       const { status } = await Location.requestForegroundPermissionsAsync();
  //       if (status !== "granted") {
  //         console.error("Permission to access location was denied");
  //         return;
  //       }
  
  //       // Get the current location every 5 seconds
  //       const locationWatchId = await Location.watchPositionAsync(
  //         { accuracy: Location.Accuracy.High, timeInterval: 5000, distanceInterval: 0 },
  //         async (location) => {
  //           const addressResponse = await Location.reverseGeocodeAsync({
  //             latitude: location.coords.latitude,
  //             longitude: location.coords.longitude,
  //           });
  
  //           // Retrieve the existing data from Firestore
  //           const existingDataSnapshot = await getDoc(providerProfilesCollection);
  //           const existingData = existingDataSnapshot.data();
  
  //           // Calculate the distance between the current and existing locations
  //           const distance = geolib.getDistance(
  //             {
  //               latitude: existingData?.coordinates?.latitude || 0,
  //               longitude: existingData?.coordinates?.longitude || 0,
  //             },
  //             {
  //               latitude: location.coords.latitude,
  //               longitude: location.coords.longitude,
  //             }
  //           );
  
  //           console.log("Distance:", distance);
  
  //           await updateDoc(providerProfilesCollection, {
  //             realTimeCoordinates: {
  //               latitude: location.coords.latitude,
  //               longitude: location.coords.longitude,
  //             },
  //             // Retain other data
  //             // Add other fields you want to update here
  //           });
  //           // Check if the coordinates field is empty or if the distance is greater than or equal to 100 meters
  //           if (!existingData?.coordinates || distance >= 100) {
  //             console.log("Existing Coordinates:", existingData?.coordinates);
  //             console.log("Distance is 100 meters far:", distance);
  //             await updateDoc(providerProfilesCollection, {
  //               coordinates: {
  //                 latitude: location.coords.latitude,
  //                 longitude: location.coords.longitude,
  //               },
  //               // Retain other data
  //               // Add other fields you want to update here
  //             });
  //           }
  
  //           if (addressResponse.length > 0) {
  //             const addressInfo = addressResponse[0];
  //             let cityOnly = "";
  //             if (addressInfo.streetNumber !== null) {
  //               cityOnly = `${addressResponse[0].streetNumber}, ${addressResponse[0].street}, ${addressResponse[0].city}`;
  //             } else {
  //               cityOnly = `${addressResponse[0].street}, ${addressResponse[0].city}`;
  //             }
  //             console.log(cityOnly);
  //             setAddress(cityOnly);
  //           }
  //         }
  //       );
  //     } catch (error) {
  //       console.error("Error updating location:", error);
  //     }
  //   };
  
  //   updateLocation();
  
  //   return () => {
  //     // Cleanup on unmount
  //   };
  // }, []);
  

//   return (
//     <>
//     <SafeAreaView style={[styles.header, style]}>
//       <View style={styles.view}>
//         <View style={styles.serbisyouwhite2Wrapper}>
//           <Image
//             style={styles.serbisyouwhite2Icon}
//             contentFit="cover"
//             source={require("../assets/serbisyouwhite-2.png")}
//           />
//         </View>
//         <View style={styles.frameParent}>
//           {/* <View
//             style={[styles.serbisyouWrapper, styles.locationWrapperFlexBox5]}
//           > */}
//             <Text style={[styles.serbisyou]}>
//               SerbisYou
//             </Text>
//           {/* </View>
//           <View
//             style={[styles.providerWrapper, styles.locationWrapperFlexBox5]}
//           >
//             <Text style={[styles.provider, styles.providerFlexBox2]}>
//               Provider
//             </Text>
//           </View> */}
//         </View>
//         <View style={[styles.frame, styles.locationWrapperFlexBox4]}>
//           <Pressable style={styles.locationBtn} onPress={openLocationBtn}>
//             <View
//               style={[
//                 styles.currentLocationWrapper,
//                 styles.locationWrapperFlexBox4,
//               ]}
//             >
//               <Text
//                 style={[styles.currentLocation, styles.currentLocationFlexBox2]}
//               >
//                 Current Location
//               </Text>
//             </View>
//             <Pressable
//               style={[styles.locationBtn1, styles.locationWrapperFlexBox4]}
//             >
//               <View
//                 style={[
//                   styles.talambanCebuCityWrapper,
//                   styles.locationWrapperFlexBox4,
//                 ]}
//               >
//               {address &&
//                 <Text
//                   style={[
//                     styles.talambanCebuCity,
//                     styles.currentLocationFlexBox2,
//                   ]}
//                 >
//                   {address}
//                 </Text>
//               }
//               </View>
//               <View
//                 style={[
//                   styles.locationBtnInner,
//                   styles.locationWrapperFlexBox4,
//                 ]}
//               >
//                 <Image
//                   style={styles.frameChild}
//                   contentFit="cover"
//                   source={require("../assets/currentLocationBtn.png")}
//                 />
//               </View>
//             </Pressable>
//           </Pressable>
//         </View>
//       </View>
//     </SafeAreaView>

//     <Modal
//       animationType="fade"
//       transparent
//       visible={locationBtnVisible}
//       style={styles.modalContainer}
//     >
//       <View style={styles.locationBtnOverlay}>
//         <Pressable style={styles.locationBtnBg} onPress={closeLocationBtn} />
//         <MultipleLocationModal
//           onClose={closeLocationBtn}
//           onCurrentLocation={handleLocationChange}
//           selectedValue={currentOption}
//         />
//       </View>
//     </Modal>
//     </>
//   );
// };

// const styles = StyleSheet.create({
//   header: {
//     backgroundColor: Color.colorDarkslateblue_100,
//   },
//   modalContainer: {
//     backgroundColor: "transparent",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   locationBtnOverlay: {
//     flex: 1,
//     alignItems: "center",
//     justifyContent: "center",
//     backgroundColor: "rgba(113, 113, 113, 0.3)",
//   },
//   locationBtnBg: {
//     position: "absolute",
//     width: "100%",
//     height: "100%",
//     left: 0,
//     top: 0,
//   },
//   locationWrapperFlexBox5: {
//     alignSelf: "stretch",
//     flexDirection: "row",
//   },
//   providerFlexBox2: {
//     textAlign: "left",
//     color: Color.m3White,
//   },
//   locationWrapperFlexBox4: {
//     justifyContent: "flex-end",
//     alignItems: "center",
//   },
//   currentLocationFlexBox2: {
//     textAlign: "right",
//     color: Color.m3White,
//     flex: 1,
//   },
//   serbisyouwhite2Icon: {
//     width: 63,
//     height: 49,
//   },
//   serbisyouwhite2Wrapper: {
//     paddingLeft: Padding.p_xs,
//     paddingTop: Padding.p_7xs,
//     paddingBottom: Padding.p_7xs,
//   },
//   serbisyou: {
//     fontSize: FontSize.title3Bold20_size,
//     letterSpacing: 0.5,
//     // lineHeight: 20,
//     fontWeight: "700",
//     fontFamily: FontFamily.title2Bold32,
//     textAlign: "left",
//     alignSelf: "stretch",
//     alignContent: "center",
//     // flex: 1,
//   },
//   serbisyouWrapper: {
//     flexDirection: "row",
//   },
//   provider: {
//     fontSize: FontSize.bodyLgBodyLgRegular_size,
//     letterSpacing: 0.4,
//     lineHeight: 15,
//     fontFamily: FontFamily.interRegular,
//   },
//   providerWrapper: {
//     paddingLeft: Padding.p_mini,
//     flexDirection: "row",
//   },
//   frameParent: {
//     flex: 1,
//   },
//   currentLocation: {
//     fontSize: FontSize.size_4xs,
//     letterSpacing: 0.6,
//     lineHeight: 12,
//     textTransform: "uppercase",
//     fontWeight: "500",
//     fontFamily: FontFamily.level2Medium12,
//   },
//   currentLocationWrapper: {
//     flexDirection: "row",
//     alignSelf: "stretch",

//   },
//   talambanCebuCity: {
//     fontSize: FontSize.typographyTaglineSmallRegular_size,
//     fontFamily: FontFamily.abhayaLibreExtraBold,
//   },
//   talambanCebuCityWrapper: {
//     flex: 1,
//     flexDirection: "row",

//   },
//   frameChild: {
//     borderRadius: Border.br_12xs,
//     width: 11,
//     height: 6,
//   },
//   locationBtnInner: {
//     marginLeft: 1,
//   },
//   locationBtn1: {
//     marginTop: 1,
//     flexDirection: "row",
//     alignSelf: "stretch",

//   },
//   locationBtn: {
//     alignItems: "flex-end",
//     justifyContent: "center",
//     flex: 1,
//   },
//   frame: {
//     paddingRight: Padding.p_smi,
//     flex: 1,
//     flexDirection: "row",
//     justifyContent: "flex-end",
//   },
//   view: {
//     paddingHorizontal: 0,
//     paddingVertical: Padding.p_5xs,
//     alignItems: "center",
//     flexDirection: "row",
//     alignSelf: "stretch",
//   },
// });

return (
  <>
    <SafeAreaView style={[styles.header, style]}>
      <View style={styles.view}>
        <View style={styles.serbisyouwhite2Wrapper}>
          <Image
            style={styles.serbisyouwhite2Icon}
            contentFit="cover"
            source={require("../assets/serbisyouwhite-2.png")}
          />
        </View>
        <View style={styles.frameParent}>
          <Text style={styles.serbisyou}>SerbisYou</Text>
          <Text style={[styles.provider, styles.providerFlexBox2]}>
              Provider
            </Text>
          {/* <View
            style={[styles.serbisyouWrapper, styles.locationWrapperFlexBox5]}
          > 
            <Text style={[styles.serbisyou]}>
              SerbisYou
            </Text>
          </View>
          <View
            style={[styles.providerWrapper, styles.locationWrapperFlexBox5]}
          >
            <Text style={[styles.provider, styles.providerFlexBox2]}>
              Provider
            </Text>
          </View>  */}
        </View>
        <View style={[styles.frame, styles.locationWrapperFlexBox4]}>
          <Pressable style={styles.locationBtn} onPress={openLocationBtn}>
            <View
              style={[
                styles.currentLocationWrapper,
                styles.locationWrapperFlexBox4,
              ]}
            >
              <Text
                style={[
                  styles.currentLocation,
                  styles.currentLocationFlexBox2,
                ]}
              >
                Current Location
              </Text>
            </View>
            <View
              style={[styles.locationBtn1, styles.locationWrapperFlexBox4]}
            >
              <View
                style={[
                  styles.talambanCebuCityWrapper,
                  styles.locationWrapperFlexBox4,
                ]}
              > 
              {address && (
                <Text
                  style={[
                    styles.talambanCebuCity,
                    styles.currentLocationFlexBox2,
                  ]}
                >
                  {address}
                </Text>
              )}
              </View>
              <View
                style={[
                  styles.locationBtnInner,
                  styles.locationWrapperFlexBox4,
                ]}
              >
                <Image
                  style={styles.frameChild}
                  contentFit="cover"
                  source={require("../assets/currentLocationBtn.png")}
                />
              </View>
            </View>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>

    <Modal
      animationType="fade"
      transparent
      visible={locationBtnVisible}
      style={styles.modalContainer}
    >
      <View style={styles.locationBtnOverlay}>
        <Pressable style={styles.locationBtnBg} onPress={closeLocationBtn} />
        <MultipleLocationModal
          onClose={closeLocationBtn}
          onCurrentLocation={handleLocationChange}
          selectedValue={currentOption}
        />
      </View>
    </Modal>
  </>
);
};

const styles = StyleSheet.create({
header: {
  backgroundColor: Color.colorDarkslateblue_100,
},
provider: {
  fontSize: FontSize.bodyLgBodyLgRegular_size,
  letterSpacing: 0.4,
  lineHeight: 15,
  fontFamily: FontFamily.interRegular,
},
providerWrapper: {
  paddingLeft: Padding.p_mini,
  flexDirection: "row",
},
providerFlexBox2: {
  textAlign: "left",
  color: Color.m3White,
  paddingLeft: Padding.p_mini,
},
locationWrapperFlexBox4: {
  justifyContent: "flex-end",
  alignItems: "center",
},
currentLocationFlexBox2: {
  textAlign: "right",
  flex: 1,
  color: Color.m3White,
},
serbisyouwhite2Icon: {
  width: 63,
  height: 49,
},
frameParent: {
  flex: 1,
},
serbisyouwhite2Wrapper: {
  paddingLeft: Padding.p_xs,
  paddingTop: Padding.p_7xs,
  paddingBottom: Padding.p_7xs,
},
serbisyou: {
  fontSize: FontSize.title3Bold20_size,
  letterSpacing: 0.5,
  fontWeight: "700",
  fontFamily: FontFamily.title2Bold32,
  textAlign: "left",
  color: Color.m3White,
  alignSelf: "stretch",
  alignContent: "center",
  // flex: 1,
},
locationBtnOverlay: {
  flex: 1,
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "rgba(113, 113, 113, 0.3)",
},
locationBtnBg: {
  position: "absolute",
  width: "100%",
  height: "100%",
  left: 0,
  top: 0,
},
currentLocation: {
  fontSize: FontSize.size_4xs,
  letterSpacing: 0.6,
  lineHeight: 12,
  textTransform: "uppercase",
  fontWeight: "500",
  fontFamily: FontFamily.level2Medium12,
},
currentLocationWrapper: {
  flexDirection: "row",
  justifyContent: "flex-end",
  alignSelf: "stretch",
},
talambanCebuCity: {
  fontSize: FontSize.typographyTaglineSmallRegular_size,
  fontFamily: FontFamily.abhayaLibreExtraBold,
},
talambanCebuCityWrapper: {
  flex: 1,
  flexDirection: "row",
  justifyContent: "flex-end",
},
frameChild: {
  borderRadius: Border.br_12xs,
  width: 11,
  height: 6,
},
locationBtnInner: {
  marginLeft: 1,
},
locationBtn1: {
  marginTop: 1,
  flexDirection: "row",
  justifyContent: "flex-end",
  alignSelf: "stretch",
},
locationBtn: {
  alignItems: "flex-end",
  justifyContent: "center",
  flex: 1,
},
frame: {
  paddingRight: Padding.p_smi,
  flex: 1,
  flexDirection: "row",
  justifyContent: "flex-end",
},
modalContainer: {
  backgroundColor: "transparent",
  alignItems: "center",
  justifyContent: "center",
},
view: {
  paddingHorizontal: 0,
  paddingVertical: Padding.p_5xs,
  alignItems: "center",
  flexDirection: "row",
  alignSelf: "stretch",
},
});

export default CurrentLocationheader;
