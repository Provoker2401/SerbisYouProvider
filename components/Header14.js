import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  StyleProp,
  ViewStyle,
  StyleSheet,
  Text,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import * as Location from "expo-location";
import { Image } from "expo-image";
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  where,
  query,
  updateDoc,
} from "firebase/firestore"; // Updated imports
import * as geolib from "geolib";
import { getAuth, onAuthStateChanged, updateEmail } from "firebase/auth";
import { Color, Padding, FontSize, FontFamily, Border } from "../GlobalStyles";

const Header14 = ({ style }) => {
  const navigation = useNavigation();
  const [address, setAddress] = useState(null);

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
  useEffect(() => {
    (async () => {
      try {
        const db = getFirestore();
        const auth = getAuth();
        const userUID = auth.currentUser.uid;
        const providerProfilesCollection = doc(db, "providerProfiles", userUID);
  
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
  
        // Retrieve the existing data from Firestore
        const existingDataSnapshot = await getDoc(providerProfilesCollection);
        const existingData = existingDataSnapshot.data();
  
        // Calculate the distance between the current and existing locations

  
        // Check if the coordinates field is empty or if the distance is greater than or equal to 100 meters
        if (!existingData?.coordinates) {
          // Add the fetched distance to Firestore
          await updateDoc(providerProfilesCollection, {
            coordinates: {
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            },
            // Retain other data
            // Add other fields you want to update here
          });
        }else{
          const distance = geolib.getDistance(
            {
              latitude: existingData?.coordinates?.latitude || 0,
              longitude: existingData?.coordinates?.longitude || 0,
            },
            {
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            }
          );

          // Check if the distance is greater than or equal to 100 meters
          if (distance >= 100) {

            // Update the coordinates field in Firestore
            await updateDoc(providerProfilesCollection, {
              coordinates: {
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
              },
              // Retain other data
              // Add other fields you want to update here
            });
          }
        }  
  
        if (addressResponse.length > 0) {
          const addressInfo = addressResponse[0];
  
          if (addressInfo.streetNumber !== null) {
            const cityOnly = `${addressResponse[0].streetNumber}, ${addressResponse[0].street}, ${addressResponse[0].city}`;
            console.log(cityOnly);
            setAddress(cityOnly);
          } else {
            const cityOnly = `${addressResponse[0].street}, ${addressResponse[0].city}`;
            console.log(cityOnly);
            setAddress(cityOnly);
          }
        }
      } catch (error) {
        console.error("Error retrieving data:", error);
      }
    })();
  }, []);
  

  return (
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
          <View
            style={[styles.serbisyouWrapper, styles.locationWrapperFlexBox5]}
          >
            <Text style={[styles.serbisyou, styles.providerFlexBox2]}>
              SerbisYou
            </Text>
          </View>
          <View
            style={[styles.providerWrapper, styles.locationWrapperFlexBox5]}
          >
            <Text style={[styles.provider, styles.providerFlexBox2]}>
              Provider
            </Text>
          </View>
        </View>
        <View style={[styles.frame, styles.locationWrapperFlexBox4]}>
          <Pressable style={styles.locationBtn}>
            <View
              style={[
                styles.currentLocationWrapper,
                styles.locationWrapperFlexBox4,
              ]}
            >
              <Text
                style={[styles.currentLocation, styles.currentLocationFlexBox2]}
              >
                Current Location
              </Text>
            </View>
            <Pressable
              style={[styles.locationBtn1, styles.locationWrapperFlexBox4]}
            >
              <View
                style={[
                  styles.talambanCebuCityWrapper,
                  styles.locationWrapperFlexBox4,
                ]}
              >
              {address &&
                <Text
                  style={[
                    styles.talambanCebuCity,
                    styles.currentLocationFlexBox2,
                  ]}
                >
                  {/* Talamban, Cebu City */}
                  {address}
                </Text>
              }
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
                  source={require("../assets/vector-4.png")}
                />
              </View>
            </Pressable>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: Color.colorDarkslateblue_100,
  },
  locationWrapperFlexBox5: {
    alignSelf: "stretch",
    flexDirection: "row",
  },
  providerFlexBox2: {
    textAlign: "left",
    color: Color.m3White,
  },
  locationWrapperFlexBox4: {
    justifyContent: "flex-end",
    alignItems: "center",
  },
  currentLocationFlexBox2: {
    textAlign: "right",
    color: Color.m3White,
    flex: 1,
  },
  serbisyouwhite2Icon: {
    width: 63,
    height: 49,
  },
  serbisyouwhite2Wrapper: {
    paddingLeft: Padding.p_xs,
    paddingTop: Padding.p_7xs,
    paddingBottom: Padding.p_7xs,
  },
  serbisyou: {
    fontSize: FontSize.title3Bold20_size,
    letterSpacing: 0.5,
    lineHeight: 20,
    fontWeight: "700",
    fontFamily: FontFamily.title2Bold32,
    flex: 1,
  },
  serbisyouWrapper: {
    flexDirection: "row",
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
  frameParent: {
    flex: 1,
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
    alignSelf: "stretch",
  },
  talambanCebuCity: {
    fontSize: FontSize.typographyTaglineSmallRegular_size,
    fontFamily: FontFamily.abhayaLibreExtraBold,
  },
  talambanCebuCityWrapper: {
    flex: 1,
    flexDirection: "row",
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
  },
  view: {
    paddingHorizontal: 0,
    paddingVertical: Padding.p_5xs,
    alignItems: "center",
    flexDirection: "row",
    alignSelf: "stretch",
  },
});

export default Header14;
