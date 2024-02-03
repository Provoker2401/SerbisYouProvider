import React, { useState, useEffect} from "react";
import {
  StatusBar,
  StyleSheet,
  Pressable,
  View,
  Text,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { useNavigation } from "@react-navigation/native";
import { Color, FontSize, Border, FontFamily, Padding } from "../GlobalStyles";
import {
  getFirestore,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore"; // Updated imports
import { getAuth, onAuthStateChanged, updateEmail } from "firebase/auth";

const GoToCustomer = ( {route} ) => {
  const navigation = useNavigation();

  const {itemID, matchedBookingID, customerUID} = route.params;
  const [bookingName, setBookingName] = useState("");
  const [bookingDate, setBookingDate] = useState("");
  const [bookingTime, setBookingTime] = useState("");
  const [bookingAddress, setBookingAddress] = useState("");
  const [bookingCoordinates, setBookingCoordinates] = useState({ latitude: null, longitude: null });
  const [bookingAddressInstruction, setBookingAddressInstruction] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const db = getFirestore(); // Use getFirestore() to initialize Firestore
  
        // Get the user's UID 
        const auth = getAuth();
        const providerUID = auth.currentUser.uid;
        console.log("Provider UID: " ,providerUID);
        console.log("Item Id: ", itemID);

        const userBookingDocRef = doc(db, "providerProfiles", providerUID, "activeBookings", itemID);
        const docSnapshot = await getDoc(userBookingDocRef);

        if (docSnapshot.exists()) {
          const booking = docSnapshot.data();
          console.log("Booking Data: ", booking);
  
          setBookingName(booking.name);
          setBookingDate(booking.date);
          setBookingTime(booking.time);
          setBookingAddress(booking.address);
          setBookingCoordinates({
            latitude: booking.coordinates.latitude,
            longitude: booking.coordinates.longitude,
          });
          // setBookingAddressInstruction(booking.totalPrice);

          console.log("Name: " ,bookingName);
          console.log("Date: " ,bookingDate);
          console.log("Time: " ,bookingTime);
          console.log("Address: " ,bookingAddress);
          console.log("Coordinates: " , bookingCoordinates);
          // console.log("Address: " , bookingAddress);

        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error retrieving data:", error);
      }
    }
  
    fetchData(); // Call the fetchData function immediately
  }, []); 

  const handleArrival = async (itemID) => {
    try {
      // const db = getFirestore();
      // const auth = getAuth();
      // const providerUID = auth.currentUser.uid;
      // const userBookingDocRef = doc(db, "providerProfiles", providerUID, "activeBookings", itemID);
  
      // // Update the status in Firestore
      // await updateDoc(userBookingDocRef, {
      //   status: "In Progress"
      // });
  
      // console.log("Status updated to 'In Progress'");
  
      // Navigate to PerformTheService screen with itemId
      navigation.navigate("PerformTheService", { itemID: itemID, matchedBookingID: matchedBookingID, customerUID: customerUID});
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  return (
    <View style={styles.goToCustomer}>
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
                <Pressable style={styles.message}>
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
                <Pressable style={styles.message}>
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
                      style={[styles.august112023, styles.august112023Typo]}
                    >
                      {bookingTime}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
            <View
              style={[styles.bookingDetailsLabelGroup, styles.bookingFlexBox]}
            >
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
              <View style={styles.bookingDetailsLabel3}>
                <View style={styles.frame2}>
                  <Text style={[styles.pleaseMeetMe, styles.amClr]}>
                    Please meet me at the blue gate, beside gate 3 siomai
                  </Text>
                </View>
              </View>
            </View>
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
              <View style={[styles.frameView, styles.frameViewFlexBox]}>
                <Pressable
                  style={[styles.technician1Parent, styles.frameViewFlexBox]}
                >
                  <Image
                    style={styles.technician1Icon}
                    contentFit="cover"
                    source={require("../assets/technician-1.png")}
                  />
                  <View style={styles.icons8Location10021Wrapper}>
                    <Image
                      style={[
                        styles.icons8Location10021,
                        styles.image2533IconLayout,
                      ]}
                      contentFit="cover"
                      source={require("../assets/icons8location100-2-1.png")}
                    />
                  </View>
                  <Pressable
                    style={[styles.currentLocationBtn, styles.innerFlexBox]}
                  >
                    <View style={styles.navigation11Wrapper}>
                      <Image
                        style={styles.navigation11}
                        contentFit="cover"
                        source={require("../assets/navigation-1-1.png")}
                      />
                    </View>
                  </Pressable>
                  <Image
                    style={[styles.image2533Icon, styles.image2533IconLayout]}
                    contentFit="cover"
                    source={require("../assets/image-2533.png")}
                  />
                </Pressable>
              </View>
            </View>
            {/* <View style={[styles.frameWrapper1, styles.bookingFlexBox]}>
              <View style={styles.componentsbuttonWrapper}>
                <Pressable
                  style={[
                    styles.componentsbutton,
                    styles.viewTimelineBtnFlexBox,
                  ]}
                  onPress={() => navigation.navigate("ViewBookingDetails")}
                >
                  <Text style={[styles.viewAllServices, styles.viewTypo]}>
                    VIEW FULL DETAILS
                  </Text>
                </Pressable>
              </View>
            </View> */}
          </View>
        </View>
      </ScrollView>
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
      <Image
        style={styles.serviceProviderIcon}
        contentFit="cover"
        source={require("../assets/service-provider-icon.png")}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#1a244d",
  },
  bodyScrollViewContent: {
    flexDirection: "column",
    paddingHorizontal: 2,
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "flex-end",
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
    textTransform: "capitalize",
    fontSize: FontSize.paragraphMedium15_size,
    textAlign: "left",
    flex: 1,
  },
  bookingFlexBox: {
    marginTop: 10,
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
    flex: 1,
  },
  frame2: {
    alignItems: "center",
    flexDirection: "row",
    flex: 1,
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
    padding: Padding.p_8xs,
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
    paddingHorizontal: Padding.p_8xs,
    paddingTop: Padding.p_8xs,
    paddingBottom: Padding.p_3xs,
    backgroundColor: Color.m3White,
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
    zIndex: 2,
    alignSelf: "stretch",
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
