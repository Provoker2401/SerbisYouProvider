import React, { useState, useEffect, useRef } from "react";
import {
  StatusBar,
  StyleSheet,
  ScrollView,
  Text,
  View,
  Pressable,
} from "react-native";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { Padding, Color, Border, FontFamily, FontSize } from "../GlobalStyles";
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  where,
  query,
} from "firebase/firestore"; // Updated imports
import { getAuth, onAuthStateChanged, updateEmail } from "firebase/auth";


const ViewBookingDetails = ( {route} ) => {
  const navigation = useNavigation();

  const {newDocumentID} = route.params;
  const [bookingAccepted, setBookingAccepted] = useState("");
  const [bookingAssigned, setBookingAssigned] = useState("");
  const [bookingName, setBookingName] = useState("");
  const [bookingEmail, setBookingEmail] = useState("");
  const [bookingRadius, setBookingRadius] = useState("");
  const [bookingDate, setBookingDate] = useState("");
  const [bookingTime, setBookingTime] = useState("");
  const [bookingAddress, setBookingAddress] = useState("");
  const [bookingProperty, setBookingProperty] = useState("");
  const [bookingMaterials, setBookingMaterials] = useState("");
  const [bookingCategory, setBookingCategory] = useState("");
  const [bookingServices, setBookingServices] = useState([]);
  const [bookingPaymentMethod, setBookingPaymentMethod] = useState("");
  const [bookingSubtotal, setBookingSubtotal] = useState("");
  const [bookingDistanceFee, setBookingDistanceFee] = useState("");
  const [bookingTotal, setBookingTotal] = useState("");
  const [bookingCoordinates, setBookingCoordinates] = useState({ latitude: null, longitude: null });

  useEffect(() => {
    async function fetchData() {
      try {
        const db = getFirestore(); // Use getFirestore() to initialize Firestore
  
        // Get the user's UID 
        const auth = getAuth();
        const providerUID = auth.currentUser.uid;
        console.log("Provider UID: " ,providerUID);
        // Reference to the "manageAddress" collection for the specified userUID
        // const userBookingDocRef = collection(
        //   db,
        //   "serviceBookings",
        //   userID
        // );

        const userBookingDocRef = doc(db, "providerProfiles", providerUID, "activeBookings", newDocumentID);
        const docSnapshot = await getDoc(userBookingDocRef);

        if (docSnapshot.exists()) {
          const booking = docSnapshot.data();

          const materials = booking.materials;
          console.log("Fetching data for booking:", booking);
          console.log("Services: " , booking.service);
          const servicesData = booking.service.map((doc) => doc);
          console.log("Data Services: " ,servicesData);
          if(materials == "useProviderMaterials"){
            setBookingMaterials("Supplied by Provider");
          }else{
            setBookingMaterials("Customer-Provided");
          }
          setBookingName(booking.name);
          setBookingEmail(booking.email);
          setBookingRadius(booking.distanceRadius);
          setBookingDate(booking.date);
          setBookingTime(booking.time);
          setBookingAddress(booking.address);
          setBookingProperty(booking.propertyType);
          setBookingCategory(booking.category);
          setBookingServices(booking.service);
          setBookingSubtotal(booking.subTotal);
          setBookingDistanceFee(booking.feeDistance);
          setBookingPaymentMethod(booking.paymentMethod);
          setBookingTotal(booking.totalPrice);
          setBookingCoordinates({
            latitude: booking.coordinates.latitude,
            longitude: booking.coordinates.longitude,
          });

          console.log("Date: " ,bookingDate);
          console.log("Time: " ,bookingTime);
          console.log("Address: " ,bookingAddress);
          console.log("Materials: " ,bookingMaterials);
          console.log("Category: " ,bookingCategory);
          console.log("Services: " ,bookingServices);
          console.log("Total Price: " ,bookingTotal);

        } else {
          console.log("No such document!");
        }
        // const userBookingDocRef = doc(db, "serviceBookings", userID, bookingIndex);

        // const bookingsQuery = query(userBookingDocRef);

        // const docSnapshot = await getDoc(bookingsQuery);

        // if (docSnapshot.exists()) {
        //   const bookingData = docSnapshot.data();
        //   console.log("Booking Data: ", bookingData);
        //   console.log("Booking Length: ", bookingData.bookings.length);
  
        //   if (Array.isArray(bookingData.bookings) && bookingData.bookings.length >= 0) {
        //     bookingLoop: for (const booking of bookingData.bookings) {
        //       if (booking.bookingAccepted) {
        //         // Fetch data and display through console.log
        //         const materials = booking.materials;
        //         console.log("Fetching data for booking:", booking);
        //         console.log("Services: " , booking.service);
        //         const servicesData = booking.service.map((doc) => doc);
        //         console.log("Data Services: " ,servicesData);
        //         if(materials == "useProviderMaterials"){
        //           setBookingMaterials("Supplied by Provider");
        //         }else{
        //           setBookingMaterials("Customer-Provided");
        //         }
        //         setBookingName(booking.name);
        //         setBookingEmail(booking.email);
        //         setBookingRadius(booking.distanceRadius);
        //         setBookingDate(booking.date);
        //         setBookingTime(booking.time);
        //         setBookingAddress(booking.address);
        //         setBookingProperty(booking.propertyType);
        //         setBookingCategory(booking.category);
        //         setBookingServices(booking.service);
        //         setBookingSubtotal(booking.subTotal);
        //         setBookingDistanceFee(booking.feeDistance);
        //         setBookingPaymentMethod(booking.paymentMethod);
        //         setBookingTotal(booking.totalPrice);

        //         console.log("Date: " ,bookingDate);
        //         console.log("Time: " ,bookingTime);
        //         console.log("Address: " ,bookingAddress);
        //         console.log("Materials: " ,bookingMaterials);
        //         console.log("Category: " ,bookingCategory);
        //         console.log("Services: " ,bookingServices);
        //         console.log("Total Price: " ,bookingTotal);
            
        //         // Use 'break' with the label to exit the loop after processing the desired booking
        //         break bookingLoop;
        //       }
        //     }
        //     console.log("Date: " ,bookingDate);
        //     console.log("Time: " ,bookingTime);
        //     console.log("Address: " ,bookingAddress);
        //     console.log("Materials: " ,bookingMaterials);
        //     console.log("Category: " ,bookingCategory);
        //     console.log("Services: " ,bookingServices);
          // } else {
          //   console.log("No savedOptions found in the document.");
          // }
        // } else {
        //   console.log("No such document!");
        // }
        
      } catch (error) {
        console.error("Error retrieving data:", error);
      }
    }
  
    fetchData(); // Call the fetchData function immediately
  }, []); // Add userID as a dependency

  return (
    <View style={[styles.viewBookingDetails, styles.frameItemLayout]}>
      <StatusBar barStyle="default" />
      <ScrollView
        style={styles.body}
        showsVerticalScrollIndicator={true}
        showsHorizontalScrollIndicator={true}
        contentContainerStyle={styles.bodyScrollViewContent}
      >
        <LinearGradient
          style={styles.frameParent}
          locations={[0, 1]}
          colors={["#1a244d", "#007ea7"]}
        >
          <View style={styles.ellipseParent}>
            <Image
              style={styles.frameChild}
              contentFit="cover"
              source={require("../assets/ellipse-52.png")}
            />
            <View style={styles.customer1Parent}>
              <Text style={styles.customer1}> {bookingName} </Text>
              <Text style={styles.customer1gmailcom}> {bookingEmail} </Text>
            </View>
          </View>
          <View
            style={[styles.backBtnWrapper, styles.backBtnWrapperSpaceBlock]}
          >
            <Pressable
              style={[styles.backBtn, styles.btnLayout]}
              onPress={() => navigation.goBack()}
            >
              <Image
                style={styles.uiIconarrowBackwardfilled}
                contentFit="cover"
                source={require("../assets/ui-iconarrow-backwardfilled.png")}
              />
            </Pressable>
          </View>
          <View style={[styles.messageBtnWrapper, styles.btnWrapperPosition]}>
            <Pressable
              style={[styles.messageBtn, styles.btnLayout]}
              onPress={() => navigation.goBack()}
            >
              <Image
                style={styles.icons8ChatBubble1001}
                contentFit="cover"
                source={require("../assets/icons8chatbubble100-1.png")}
              />
            </Pressable>
          </View>
          <View style={styles.editAddressModal}>
            <View style={styles.frameGroup}>
              <View
                style={[
                  styles.bookingDetailsLabelParent,
                  styles.dateAndTimeFrame3SpaceBlock,
                ]}
              >
                <View style={styles.bookingDetailsLabel}>
                  <Text style={styles.bookingDetails}>Booking details</Text>
                </View>
                <View
                  style={[styles.dateAndTimeFrame, styles.dateFrameSpaceBlock]}
                >
                  <View style={styles.dateRangeLightWrapper}>
                    <Image
                      style={styles.btnLayout}
                      contentFit="cover"
                      source={require("../assets/date-range-light1.png")}
                    />
                  </View>
                  <View style={styles.dateAndTimeFrameInner}>
                    <View style={[styles.dateWrapper, styles.frameInnerLayout]}>
                      <Text style={[styles.date, styles.dateClr]}>Date</Text>
                    </View>
                  </View>
                  <View style={styles.frameWrapper}>
                    <View style={[styles.frame, styles.frameFlexBox1]}>
                      <Text style={[styles.august112023, styles.amFlexBox]}>
                        {bookingDate}
                      </Text>
                    </View>
                  </View>
                </View>
                <View
                  style={[styles.dateAndTimeFrame, styles.dateFrameSpaceBlock]}
                >
                  <View style={styles.dateRangeLightWrapper}>
                    <View style={styles.clock1Wrapper}>
                      <Image
                        style={styles.clock1Icon}
                        contentFit="cover"
                        source={require("../assets/clock-1.png")}
                      />
                    </View>
                  </View>
                  <View style={styles.dateAndTimeFrameInner}>
                    <View style={[styles.timeWrapper, styles.timeLayout]}>
                      <Text style={[styles.time, styles.timeLayout]}>Time</Text>
                    </View>
                  </View>
                  <View style={styles.frameWrapper}>
                    <View style={[styles.frame, styles.frameFlexBox1]}>
                      <Text style={[styles.august112023, styles.amFlexBox]}>
                        {bookingTime}
                      </Text>
                    </View>
                  </View>
                </View>
                <View
                  style={[styles.dateAndTimeFrame, styles.dateFrameSpaceBlock]}
                >
                  <View style={styles.markersNearPinletMarkerWrapper}>
                    <Image
                      style={styles.markersNearPinletMarker}
                      contentFit="cover"
                      source={require("../assets/markers--near-pinlet-marker1.png")}
                    />
                  </View>
                  <View style={styles.dateAndTimeFrameInner}>
                    <View style={styles.addressWrapper}>
                      <Text style={[styles.time, styles.timeLayout]}>
                        Address
                      </Text>
                    </View>
                  </View>
                  <View style={styles.frameWrapper}>
                    <View style={styles.frame2}>
                      <Text style={[styles.august112023, styles.amFlexBox]}>
                        {bookingAddress}
                      </Text>
                    </View>
                  </View>
                </View>
                <View
                  style={[styles.dateAndTimeFrame, styles.dateFrameSpaceBlock]}
                >
                  <View style={styles.dateRangeLightWrapper}>
                    <Image
                      style={styles.btnLayout}
                      contentFit="cover"
                      source={require("../assets/gps-2.png")}
                    />
                  </View>
                  <View style={styles.frameWrapper}>
                    <View style={styles.frame2}>
                      <View style={styles.timeContainer}>
                        <Text style={[styles.typeOfProperty, styles.dateClr]}>
                          Distance Radius
                        </Text>
                      </View>
                    </View>
                  </View>
                  <View style={styles.frameWrapper}>
                    <View style={styles.frame2}>
                      <Text style={[styles.august112023, styles.amFlexBox]}>
                        {bookingRadius} kilometers
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
              <View style={styles.bookingDetailsLabelGroup}>
                <View style={styles.bookingDetailsLabel1}>
                  <Text style={styles.bookingDetails}>Service Details</Text>
                </View>
                <View
                  style={[styles.dateAndTimeFrame, styles.dateFrameSpaceBlock]}
                >
                  <View style={styles.dateRangeLightWrapper}>
                    <Image
                      style={styles.btnLayout}
                      contentFit="cover"
                      source={require("../assets/gps-2.png")}
                    />
                  </View>
                  <View style={styles.frameWrapper}>
                    <View style={styles.propertyTypeWrapper}>
                      <Text style={[styles.date, styles.dateClr]}>
                        Property Type
                      </Text>
                    </View>
                  </View>
                  <View style={styles.frameWrapper}>
                    <View style={styles.frame2}>
                      <Text style={[styles.august112023, styles.amFlexBox]}>
                        {bookingProperty}
                      </Text>
                    </View>
                  </View>
                </View>
                <View
                  style={[styles.dateAndTimeFrame, styles.dateFrameSpaceBlock]}
                >
                  <View style={styles.dateRangeLightWrapper}>
                    <Image
                      style={styles.btnLayout}
                      contentFit="cover"
                      source={require("../assets/mop-1.png")}
                    />
                  </View>
                  <View style={styles.frameWrapper}>
                    <View style={styles.materialsWrapper}>
                      <Text style={[styles.date, styles.dateClr]}>
                        Materials
                      </Text>
                    </View>
                  </View>
                  <View style={styles.frameWrapper6}>
                    <View style={styles.frame2}>
                      <Text style={[styles.august112023, styles.amFlexBox]}>
                        {bookingMaterials}
                      </Text>
                    </View>
                  </View>
                </View>
                <View
                  style={[styles.dateAndTimeFrame, styles.dateFrameSpaceBlock]}
                >
                  <View style={styles.dateRangeLightWrapper}>
                    <View style={styles.plumbingInstallationPicWrapper}>
                      <Image
                        style={styles.plumbingInstallationPic}
                        contentFit="cover"
                        source={require("../assets/plumbing-installation-pic.png")}
                      />
                    </View>
                  </View>
                  <View style={styles.frameWrapper}>
                    <View style={styles.materialsWrapper}>
                      <Text style={[styles.date, styles.dateClr]}>
                        Category
                      </Text>
                    </View>
                  </View>
                  <View style={styles.frameWrapper6}>
                    <View style={styles.frame2}>
                      <Text style={[styles.august112023, styles.amFlexBox]}>
                        {bookingCategory}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
              <View style={styles.componentsbuttonParent}>
                <Pressable
                  style={[
                    styles.componentsbutton,
                    styles.componentsbuttonFlexBox,
                  ]}
                >
                  <Text style={styles.viewAllServices}>VIEW LOCATION</Text>
                </Pressable>
                <Pressable
                  style={[
                    styles.componentsbutton1,
                    styles.componentsbuttonFlexBox,
                  ]}
                >
                  <Text style={styles.viewAllServices}>CALL NOW</Text>
                </Pressable>
              </View>
              <View style={styles.bookingDetailsLabelContainer}>
                <View style={styles.bookingDetailsLabel}>
                  <Text style={styles.bookingDetails}>Service Requests</Text>
                </View>
                <View
                  style={[
                    styles.subcategoriesFrame,
                    styles.dateFrameSpaceBlock,
                  ]}
                >
                  {/* <View
                    style={[
                      styles.dateAndTimeFrame3,
                      styles.dateAndTimeFrame3SpaceBlock,
                    ]}
                  >
                    <View
                      style={[
                        styles.frameWrapper24,
                        styles.frameWrapperFlexBox,
                      ]}
                    >
                      <View style={styles.frame14}>
                        <Text style={[styles.text4, styles.textClr]}>
                          ₱2000.00
                        </Text>
                      </View>
                    </View>
                  </View> */}
                  {bookingServices.map((item, index) => {
                    const {name, service, totalPrice, value} = item;
                    return (
                      <View
                        key={index}
                        style={[
                          styles.dateAndTimeFrame4,
                          styles.backBtnWrapperSpaceBlock,
                        ]}
                      >
                        <View style={styles.frameWrapper25}>
                          <View style={styles.frame2}>
                            <Text
                              style={[styles.septicTank, styles.septicTankTypo]}
                            >
                              {name}
                            </Text>
                          </View>
                        </View>
                        <View
                          style={[
                            styles.dateAndTimeFrameInner1,
                            styles.frameFlexBox,
                          ]}
                        >
                          <View style={styles.frameWrapper9}>
                            <View style={styles.frameWrapper10}>
                              <View style={styles.bookingDetailsLabel}>
                                <Text style={[styles.text, styles.amTypo]}> {value} </Text>
                              </View>
                            </View>
                          </View>
                        </View>
                        <View
                          style={[
                            styles.frameWrapper28,
                            styles.frameWrapperFlexBox,
                          ]}
                        >
                          <View style={styles.frame2}>
                            <Text style={[styles.text6, styles.textClr]}>
                              {totalPrice}
                            </Text>
                          </View>
                        </View>
                      </View>
                    )
                  })}
                  {/* <View
                    style={[
                      styles.dateAndTimeFrame4,
                      styles.backBtnWrapperSpaceBlock,
                    ]}
                  >
                    <View style={styles.frameWrapper25}>
                      <View style={styles.frame2}>
                        <Text
                          style={[styles.septicTank, styles.septicTankTypo]}
                        >
                          Viral disease mangagement
                        </Text>
                      </View>
                    </View>
                    <View
                      style={[
                        styles.dateAndTimeFrameInner1,
                        styles.frameFlexBox,
                      ]}
                    >
                      <View style={styles.frameWrapper9}>
                        <View style={styles.frameWrapper10}>
                          <View style={styles.bookingDetailsLabel}>
                            <Text style={[styles.text, styles.amTypo]}>1</Text>
                          </View>
                        </View>
                      </View>
                    </View>
                    <View
                      style={[
                        styles.frameWrapper28,
                        styles.frameWrapperFlexBox,
                      ]}
                    >
                      <View style={styles.frame2}>
                        <Text style={[styles.text6, styles.textClr]}>
                          ₱1500.00
                        </Text>
                      </View>
                    </View>
                  </View>
                  <View
                    style={[
                      styles.dateAndTimeFrame4,
                      styles.backBtnWrapperSpaceBlock,
                    ]}
                  >
                    <View style={styles.frameWrapper25}>
                      <View style={styles.frame2}>
                        <Text
                          style={[styles.septicTank, styles.septicTankTypo]}
                        >
                          Cage or habitat cleaning
                        </Text>
                      </View>
                    </View>
                    <View
                      style={[
                        styles.dateAndTimeFrameInner1,
                        styles.frameFlexBox,
                      ]}
                    >
                      <View style={styles.frameWrapper9}>
                        <View style={styles.frameWrapper10}>
                          <View style={styles.bookingDetailsLabel}>
                            <Text style={[styles.text, styles.amTypo]}>1</Text>
                          </View>
                        </View>
                      </View>
                    </View>
                    <View
                      style={[
                        styles.frameWrapper28,
                        styles.frameWrapperFlexBox,
                      ]}
                    >
                      <View style={styles.frame2}>
                        <Text style={[styles.text6, styles.textClr]}>
                          ₱1500.00
                        </Text>
                      </View>
                    </View>
                  </View>
                  <View
                    style={[
                      styles.dateAndTimeFrame4,
                      styles.backBtnWrapperSpaceBlock,
                    ]}
                  >
                    <View style={styles.frameWrapper25}>
                      <View style={styles.frame2}>
                        <Text
                          style={[styles.septicTank, styles.septicTankTypo]}
                        >
                          Septic Tank
                        </Text>
                      </View>
                    </View>
                    <View
                      style={[
                        styles.dateAndTimeFrameInner1,
                        styles.frameFlexBox,
                      ]}
                    >
                      <View style={styles.frameWrapper9}>
                        <View style={styles.frameWrapper10}>
                          <View style={styles.bookingDetailsLabel}>
                            <Text style={[styles.text, styles.amTypo]}>1</Text>
                          </View>
                        </View>
                      </View>
                    </View>
                    <View
                      style={[
                        styles.frameWrapper28,
                        styles.frameWrapperFlexBox,
                      ]}
                    >
                      <View style={styles.frame2}>
                        <Text style={[styles.text6, styles.textClr]}>
                          ₱1500.00
                        </Text>
                      </View>
                    </View>
                  </View>
                  <View
                    style={[
                      styles.dateAndTimeFrame4,
                      styles.backBtnWrapperSpaceBlock,
                    ]}
                  >
                    <View style={styles.frameWrapper25}>
                      <View style={styles.frame2}>
                        <Text
                          style={[styles.septicTank, styles.septicTankTypo]}
                        >
                          Septic Tank
                        </Text>
                      </View>
                    </View>
                    <View
                      style={[
                        styles.dateAndTimeFrameInner1,
                        styles.frameFlexBox,
                      ]}
                    >
                      <View style={styles.frameWrapper9}>
                        <View style={styles.frameWrapper10}>
                          <View style={styles.bookingDetailsLabel}>
                            <Text style={[styles.text, styles.amTypo]}>1</Text>
                          </View>
                        </View>
                      </View>
                    </View>
                    <View
                      style={[
                        styles.frameWrapper28,
                        styles.frameWrapperFlexBox,
                      ]}
                    >
                      <View style={styles.frame2}>
                        <Text style={[styles.text6, styles.textClr]}>
                          ₱1500.00
                        </Text>
                      </View>
                    </View>
                  </View> */}
                </View>
                <View
                  style={[styles.vectorWrapper, styles.dateFrameSpaceBlock]}
                >
                  <Image
                    style={[styles.frameItem, styles.frameItemLayout]}
                    contentFit="cover"
                    source={require("../assets/line-74.png")}
                  />
                </View>
                <View
                  style={[styles.dateAndTimeFrame9, styles.dateFrameSpaceBlock]}
                >
                  <View style={styles.frameWrapper45}>
                    <View style={styles.frame2}>
                      <View style={styles.timeContainer}>
                        <Text style={[styles.subtotal, styles.text15Typo]}>
                          Subtotal
                        </Text>
                      </View>
                      <View style={styles.frameInnerLayout}>
                        <View style={styles.frame2}>
                          <Text style={[styles.text15, styles.text15Typo]}>
                            ₱{bookingSubtotal}.00
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                  <View style={styles.frameWrapper45}>
                    <View style={styles.frame2}>
                      <View style={styles.timeContainer}>
                        <Text style={[styles.subtotal, styles.text15Typo]}>
                          Distance Fee
                        </Text>
                      </View>
                      <View style={styles.frameInnerLayout}>
                        <View style={styles.frame2}>
                          <Text style={[styles.text15, styles.text15Typo]}>
                            ₱{bookingDistanceFee}.00
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                  <View style={styles.frameWrapper45}>
                    <View style={styles.frame2}>
                      <View style={styles.timeContainer}>
                        <Text style={[styles.subtotal, styles.text15Typo]}>
                          Total
                        </Text>
                      </View>
                      <View style={styles.frameInnerLayout}>
                        <View style={styles.frame2}>
                          <Text style={[styles.text15, styles.text15Typo]}>
                            ₱{bookingTotal}.00
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
              <View style={styles.dateAndTimeFrameWrapper}>
                <View style={styles.bookingDetailsLabel}>
                  <View style={styles.dateRangeLightWrapper}>
                    <Image
                      style={styles.image2373Icon}
                      contentFit="cover"
                      source={require("../assets/image-2373.png")}
                    />
                  </View>
                  <View style={styles.frameWrapper}>
                    <View style={styles.frame2}>
                      <View style={styles.frameInner3}>
                        <View style={styles.paidViapaymentMethodWrapper}>
                          <Text style={[styles.date, styles.dateClr]}>
                            Paid via/Payment Method
                          </Text>
                        </View>
                      </View>
                      <View
                        style={[styles.paypalWrapper, styles.frameFlexBox1]}
                      >
                        <Text style={[styles.paypal, styles.amFlexBox]}>
                          {bookingPaymentMethod}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
              <View style={styles.customerAdditionalInstructioParent}>
                <Text
                  style={[
                    styles.customerAdditionalInstructio,
                    styles.pleaseMeetMeLayout,
                  ]}
                >
                  Customer Additional Instructions
                </Text>
                <Text style={[styles.pleaseMeetMe, styles.pleaseMeetMeLayout]}>
                  Please meet me at Room 6969, Hotel Sogo
                </Text>
              </View>
            </View>
          </View>
        </LinearGradient>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  bodyScrollViewContent: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  frameItemLayout: {
    width: "100%",
    flex: 1,
  },
  backBtnWrapperSpaceBlock: {
    paddingHorizontal: 0,
    flexDirection: "row",
  },
  btnLayout: {
    height: 40,
    width: 40,
  },
  btnWrapperPosition: {
    top: 0,
    position: "absolute",
  },
  dateAndTimeFrame3SpaceBlock: {
    paddingVertical: Padding.p_8xs,
    paddingHorizontal: 0,
    justifyContent: "center",
    alignSelf: "stretch",
  },
  dateFrameSpaceBlock: {
    marginTop: 5,
    alignSelf: "stretch",
  },
  frameInnerLayout: {
    width: 83,
    alignItems: "center",
  },
  dateClr: {
    color: Color.lightLabelPrimary,
    textAlign: "left",
  },
  frameFlexBox1: {
    justifyContent: "flex-end",
    flexDirection: "row",
    alignItems: "center",
  },
  amFlexBox: {
    textAlign: "right",
    color: Color.lightLabelPrimary,
  },
  timeLayout: {
    width: 79,
    alignItems: "center",
  },
  componentsbuttonFlexBox: {
    paddingVertical: Padding.p_xs,
    borderRadius: Border.br_mini,
    paddingHorizontal: 0,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  amTypo: {
    fontFamily: FontFamily.workSansRegular,
    textTransform: "capitalize",
    fontSize: FontSize.buttonBold15_size,
  },
  septicTankTypo: {
    fontFamily: FontFamily.interRegular,
    fontSize: FontSize.levelSemibold14_size,
    textTransform: "capitalize",
    color: Color.lightLabelPrimary,
    flex: 1,
  },
  frameWrapperFlexBox: {
    width: 68,
    alignItems: "flex-end",
    display: "none",
    justifyContent: "center",
  },
  textClr: {
    color: Color.neutral07,
    textAlign: "right",
  },
  frameFlexBox: {
    width: 38,
    paddingVertical: 0,
    paddingHorizontal: Padding.p_9xs,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  text15Typo: {
    fontFamily: FontFamily.interLight,
    fontWeight: "300",
    fontSize: FontSize.buttonBold15_size,
    flex: 1,
  },
  pleaseMeetMeLayout: {
    lineHeight: 15,
    textAlign: "left",
  },
  frameChild: {
    width: 112,
    height: 112,
  },
  customer1: {
    fontSize: FontSize.typographyHeading3Medium_size,
    fontFamily: FontFamily.typographyParagraphSmallMedium,
    textAlign: "left",
    color: Color.m3White,
    fontWeight: "500",
  },
  customer1gmailcom: {
    fontFamily: FontFamily.georamaLight,
    marginTop: 3,
    fontWeight: "300",
    fontSize: FontSize.buttonBold15_size,
    textAlign: "left",
    color: Color.m3White,
  },
  customer1Parent: {
    marginTop: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  ellipseParent: {
    zIndex: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  uiIconarrowBackwardfilled: {
    width: 24,
    height: 24,
  },
  backBtn: {
    paddingHorizontal: Padding.p_xs,
    paddingVertical: Padding.p_9xs,
    borderRadius: Border.br_xl,
    height: 40,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Color.m3White,
  },
  backBtnWrapper: {
    left: 16,
    zIndex: 1,
    paddingVertical: Padding.p_mini,
    top: 0,
    position: "absolute",
  },
  icons8ChatBubble1001: {
    width: 27,
    height: 27,
  },
  messageBtn: {
    borderRadius: Border.br_xl,
    height: 40,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Color.m3White,
  },
  messageBtnWrapper: {
    right: 14,
    paddingTop: Padding.p_mini,
    zIndex: 2,
    flexDirection: "row",
  },
  bookingDetails: {
    fontSize: FontSize.title3Bold20_size,
    fontFamily: FontFamily.workSansSemiBold,
    color: Color.colorDarkslateblue_100,
    display: "flex",
    fontWeight: "600",
    textAlign: "left",
    alignSelf: "stretch",
    alignItems: "center",
    flex: 1,
  },
  bookingDetailsLabel: {
    flexDirection: "row",
    justifyContent: "center",
    alignSelf: "stretch",
    alignItems: "center",
  },
  dateRangeLightWrapper: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  date: {
    fontFamily: FontFamily.workSansMedium,
    fontSize: FontSize.size_lg,
    fontWeight: "500",
    flex: 1,
  },
  dateWrapper: {
    flexDirection: "row",
  },
  dateAndTimeFrameInner: {
    marginLeft: 7,
    justifyContent: "center",
  },
  august112023: {
    fontFamily: FontFamily.workSansRegular,
    textTransform: "capitalize",
    fontSize: FontSize.buttonBold15_size,
    flex: 1,
  },
  frame: {
    alignSelf: "stretch",
  },
  frameWrapper: {
    marginLeft: 7,
    justifyContent: "center",
    flex: 1,
  },
  dateAndTimeFrame: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  clock1Icon: {
    height: 32,
    width: 32,
  },
  clock1Wrapper: {
    padding: Padding.p_9xs,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  time: {
    color: Color.lightLabelPrimary,
    textAlign: "left",
    fontFamily: FontFamily.workSansMedium,
    fontSize: FontSize.size_lg,
    fontWeight: "500",
    display: "flex",
  },
  timeWrapper: {
    flexDirection: "row",
  },
  timeContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  editBtn: {
    marginLeft: -56,
    alignItems: "center",
  },
  frame2: {
    flexDirection: "row",
    alignSelf: "stretch",
    alignItems: "center",
  },
  am: {
    fontFamily: FontFamily.workSansRegular,
    textTransform: "capitalize",
    fontSize: FontSize.buttonBold15_size,
  },
  dateAndTimeFrame2: {
    paddingTop: Padding.p_3xs,
    paddingBottom: Padding.p_8xs,
    display: "none",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  markersNearPinletMarker: {
    height: 41,
    width: 32,
  },
  markersNearPinletMarkerWrapper: {
    paddingVertical: 0,
    paddingHorizontal: Padding.p_9xs,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  addressWrapper: {
    width: 75,
    flexDirection: "row",
    alignItems: "center",
  },
  typeOfProperty: {
    width: 152,
    fontFamily: FontFamily.workSansMedium,
    fontSize: FontSize.size_lg,
    fontWeight: "500",
    display: "flex",
    alignItems: "center",
  },
  bookingDetailsLabelParent: {
    backgroundColor: Color.m3White,
  },
  bookingDetailsLabel1: {
    paddingLeft: Padding.p_8xs,
    flexDirection: "row",
    justifyContent: "center",
    alignSelf: "stretch",
    alignItems: "center",
  },
  propertyTypeWrapper: {
    width: 148,
    flexDirection: "row",
    alignItems: "center",
  },
  materialsWrapper: {
    width: 88,
    flexDirection: "row",
    alignItems: "center",
  },
  frameWrapper6: {
    width: 200,
    marginLeft: 7,
    justifyContent: "center",
  },
  plumbingInstallationPic: {
    height: 31,
    width: 30,
  },
  plumbingInstallationPicWrapper: {
    padding: Padding.p_8xs,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  bookingDetailsLabelGroup: {
    marginTop: 15,
    alignSelf: "stretch",
    alignItems: "center",
  },
  viewAllServices: {
    letterSpacing: -0.1,
    lineHeight: 24,
    fontWeight: "700",
    fontFamily: FontFamily.title2Bold32,
    color: Color.neutral01,
    textAlign: "center",
    fontSize: FontSize.buttonBold15_size,
    flex: 1,
  },
  componentsbutton: {
    backgroundColor: Color.colorSteelblue,
  },
  componentsbutton1: {
    backgroundColor: Color.colorDarkslategray_600,
    marginLeft: 10,
  },
  componentsbuttonParent: {
    alignItems: "flex-end",
    marginTop: 15,
    flexDirection: "row",
    justifyContent: "center",
    alignSelf: "stretch",
  },
  text: {
    textAlign: "center",
    color: Color.m3White,
  },
  frameWrapper10: {
    borderRadius: Border.br_5xs,
    backgroundColor: Color.colorDarkslateblue_200,
    height: 30,
    width: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  frameWrapper9: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  toiletSystem: {
    textAlign: "center",
  },
  frameWrapper11: {
    marginTop: 7,
    justifyContent: "center",
    alignSelf: "stretch",
    alignItems: "center",
  },
  frameParent2: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  frameParent3: {
    marginLeft: 7,
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  frameWrapper19: {
    width: 78,
    marginTop: 7,
    justifyContent: "center",
    alignItems: "center",
  },
  text4: {
    lineHeight: 16,
    color: Color.neutral07,
    fontSize: FontSize.m3LabelMedium_size,
    fontFamily: FontFamily.interRegular,
    flex: 1,
  },
  frame14: {
    display: "none",
    flexDirection: "row",
    alignSelf: "stretch",
    alignItems: "center",
  },
  frameWrapper24: {
    marginTop: 7,
  },
  dateAndTimeFrame3: {
    display: "none",
    alignItems: "center",
  },
  septicTank: {
    textAlign: "left",
  },
  frameWrapper25: {
    justifyContent: "center",
    flex: 1,
  },
  dateAndTimeFrameInner1: {
    marginLeft: 7,
  },
  text6: {
    lineHeight: 16,
    color: Color.neutral07,
    fontSize: FontSize.m3LabelMedium_size,
    fontFamily: FontFamily.interRegular,
    flex: 1,
    display: "none",
  },
  frameWrapper28: {
    marginLeft: 7,
  },
  dateAndTimeFrame4: {
    paddingVertical: Padding.p_10xs,
    justifyContent: "center",
    alignSelf: "stretch",
    alignItems: "center",
  },
  subcategoriesFrame: {
    justifyContent: "center",
  },
  frameItem: {
    maxWidth: "100%",
    overflow: "hidden",
    maxHeight: "100%",
    alignSelf: "stretch",
  },
  vectorWrapper: {
    height: 1,
    alignItems: "center",
  },
  subtotal: {
    color: Color.lightLabelPrimary,
    textAlign: "left",
  },
  text15: {
    lineHeight: 20,
    color: Color.neutral07,
    textAlign: "right",
  },
  frameWrapper45: {
    justifyContent: "center",
    alignSelf: "stretch",
  },
  dateAndTimeFrame9: {
    paddingTop: Padding.p_8xs,
    justifyContent: "center",
    alignItems: "center",
  },
  bookingDetailsLabelContainer: {
    paddingLeft: Padding.p_10xs,
    marginTop: 15,
    justifyContent: "center",
    alignSelf: "stretch",
    backgroundColor: Color.m3White,
  },
  image2373Icon: {
    height: 23,
    width: 40,
  },
  paidViapaymentMethodWrapper: {
    width: 150,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  frameInner3: {
    alignItems: "center",
    flex: 1,
  },
  paypal: {
    fontFamily: FontFamily.workSansMedium,
    fontSize: FontSize.size_lg,
    fontWeight: "500",
    flex: 1,
  },
  paypalWrapper: {
    flex: 1,
  },
  dateAndTimeFrameWrapper: {
    marginTop: 15,
    justifyContent: "center",
    alignSelf: "stretch",
    backgroundColor: Color.m3White,
  },
  customerAdditionalInstructio: {
    fontFamily: FontFamily.levelSemibold14,
    color: Color.colorGray_300,
    lineHeight: 15,
    fontSize: FontSize.levelSemibold14_size,
    fontWeight: "600",
  },
  pleaseMeetMe: {
    fontFamily: FontFamily.montserratMedium,
    color: "#6d6d6d",
    fontSize: FontSize.m3LabelMedium_size,
    lineHeight: 15,
    marginTop: 3,
    fontWeight: "500",
  },
  customerAdditionalInstructioParent: {
    width: 343,
    height: 33,
    marginTop: 15,
  },
  frameGroup: {
    borderTopLeftRadius: Border.br_5xl,
    borderTopRightRadius: Border.br_5xl,
    paddingHorizontal: Padding.p_base,
    paddingVertical: Padding.p_mini,
    alignSelf: "stretch",
    alignItems: "center",
    backgroundColor: Color.m3White,
  },
  editAddressModal: {
    paddingTop: Padding.p_6xl,
    zIndex: 3,
    alignSelf: "stretch",
    alignItems: "center",
  },
  frameParent: {
    paddingTop: Padding.p_11xl,
    backgroundColor: "transparent",
    alignSelf: "stretch",
    alignItems: "center",
  },
  body: {
    alignSelf: "stretch",
    flex: 1,
  },
  viewBookingDetails: {
    height: 812,
    alignItems: "center",
    backgroundColor: Color.m3White,
  },
});

export default ViewBookingDetails;

////////////////////////////////////////////////////////////////////////////////////////////////////////
// import React, { useState, useEffect, useRef } from "react";
// import {
//   StatusBar,
//   StyleSheet,
//   ScrollView,
//   Text,
//   View,
//   Pressable,
//   Linking,
// } from "react-native";
// import { Image } from "expo-image";
// import { LinearGradient } from "expo-linear-gradient";
// import { useNavigation } from "@react-navigation/native";
// import { Padding, Color, Border, FontFamily, FontSize } from "../GlobalStyles";
// import {
//   getFirestore,
//   collection,
//   doc,
//   getDoc,
//   getDocs,
//   setDoc,
//   where,
//   query,
// } from "firebase/firestore"; // Updated imports
// import { getAuth, onAuthStateChanged, updateEmail } from "firebase/auth";

// const ViewBookingDetails = ({ route }) => {
//   const navigation = useNavigation();

//   const { newDocumentID, providerLocation } = route.params;
//   const [bookingAccepted, setBookingAccepted] = useState("");
//   const [bookingAssigned, setBookingAssigned] = useState("");
//   const [bookingName, setBookingName] = useState("");
//   const [bookingEmail, setBookingEmail] = useState("");
//   const [bookingRadius, setBookingRadius] = useState("");
//   const [bookingDate, setBookingDate] = useState("");
//   const [bookingTime, setBookingTime] = useState("");
//   const [bookingAddress, setBookingAddress] = useState("");
//   const [bookingProperty, setBookingProperty] = useState("");
//   const [bookingMaterials, setBookingMaterials] = useState("");
//   const [bookingCategory, setBookingCategory] = useState("");
//   const [bookingServices, setBookingServices] = useState([]);
//   const [bookingPaymentMethod, setBookingPaymentMethod] = useState("");
//   const [bookingSubtotal, setBookingSubtotal] = useState("");
//   const [bookingDistanceFee, setBookingDistanceFee] = useState("");
//   const [bookingTotal, setBookingTotal] = useState("");

//   const [bookingCoordinates, setbookingCoordinates] = useState("");

//   const [phoneUser, setphoneUser] = useState("");

//   //get provider location information

//   // get customer location information

//   useEffect(() => {
//     async function fetchData() {
//       try {
//         const db = getFirestore(); // Use getFirestore() to initialize Firestore

//         // Get the user's UID
//         const auth = getAuth();
//         const providerUID = auth.currentUser.uid;
//         console.log("Provider UID: ", providerUID);
//         // Reference to the "manageAddress" collection for the specified userUID
//         // const userBookingDocRef = collection(
//         //   db,
//         //   "serviceBookings",
//         //   userID
//         // );

//         const userBookingDocRef = doc(
//           db,
//           "providerProfiles",
//           providerUID,
//           "activeBookings",
//           newDocumentID
//         );
//         const docSnapshot = await getDoc(userBookingDocRef);

//         if (docSnapshot.exists()) {
//           const booking = docSnapshot.data();

//           const materials = booking.materials;
//           console.log("Fetching data for booking:", booking);
//           console.log("Services: ", booking.service);
//           const servicesData = booking.service.map((doc) => doc);
//           console.log("Data Services: ", servicesData);
//           if (materials == "useProviderMaterials") {
//             setBookingMaterials("Supplied by Provider");
//           } else {
//             setBookingMaterials("Customer-Provided");
//           }
//           setBookingName(booking.name);
//           setBookingEmail(booking.email);
//           setBookingRadius(booking.distanceRadius);
//           setBookingDate(booking.date);
//           setBookingTime(booking.time);
//           setBookingAddress(booking.address);
//           setBookingProperty(booking.propertyType);
//           setBookingCategory(booking.category);
//           setBookingServices(booking.service);
//           setBookingSubtotal(booking.subTotal);
//           setBookingDistanceFee(booking.feeDistance);
//           setBookingPaymentMethod(booking.paymentMethod);
//           setBookingTotal(booking.totalPrice);
//           setbookingCoordinates(booking.coordinates);
//           setphoneUser(booking.phone);

//           console.log("Date: ", bookingDate);
//           console.log("Time: ", bookingTime);
//           console.log("Address: ", bookingAddress);
//           console.log("Materials: ", bookingMaterials);
//           console.log("Category: ", bookingCategory);
//           console.log("Services: ", bookingServices);
//           console.log("Total Price: ", bookingTotal);
//           console.log("Coordinates: ", bookingCoordinates);
//         } else {
//           console.log("No such document!");
//         }
//         // const userBookingDocRef = doc(db, "serviceBookings", userID, bookingIndex);

//         // const bookingsQuery = query(userBookingDocRef);

//         // const docSnapshot = await getDoc(bookingsQuery);

//         // if (docSnapshot.exists()) {
//         //   const bookingData = docSnapshot.data();
//         //   console.log("Booking Data: ", bookingData);
//         //   console.log("Booking Length: ", bookingData.bookings.length);

//         //   if (Array.isArray(bookingData.bookings) && bookingData.bookings.length >= 0) {
//         //     bookingLoop: for (const booking of bookingData.bookings) {
//         //       if (booking.bookingAccepted) {
//         //         // Fetch data and display through console.log
//         //         const materials = booking.materials;
//         //         console.log("Fetching data for booking:", booking);
//         //         console.log("Services: " , booking.service);
//         //         const servicesData = booking.service.map((doc) => doc);
//         //         console.log("Data Services: " ,servicesData);
//         //         if(materials == "useProviderMaterials"){
//         //           setBookingMaterials("Supplied by Provider");
//         //         }else{
//         //           setBookingMaterials("Customer-Provided");
//         //         }
//         //         setBookingName(booking.name);
//         //         setBookingEmail(booking.email);
//         //         setBookingRadius(booking.distanceRadius);
//         //         setBookingDate(booking.date);
//         //         setBookingTime(booking.time);
//         //         setBookingAddress(booking.address);
//         //         setBookingProperty(booking.propertyType);
//         //         setBookingCategory(booking.category);
//         //         setBookingServices(booking.service);
//         //         setBookingSubtotal(booking.subTotal);
//         //         setBookingDistanceFee(booking.feeDistance);
//         //         setBookingPaymentMethod(booking.paymentMethod);
//         //         setBookingTotal(booking.totalPrice);

//         //         console.log("Date: " ,bookingDate);
//         //         console.log("Time: " ,bookingTime);
//         //         console.log("Address: " ,bookingAddress);
//         //         console.log("Materials: " ,bookingMaterials);
//         //         console.log("Category: " ,bookingCategory);
//         //         console.log("Services: " ,bookingServices);
//         //         console.log("Total Price: " ,bookingTotal);

//         //         // Use 'break' with the label to exit the loop after processing the desired booking
//         //         break bookingLoop;
//         //       }
//         //     }
//         //     console.log("Date: " ,bookingDate);
//         //     console.log("Time: " ,bookingTime);
//         //     console.log("Address: " ,bookingAddress);
//         //     console.log("Materials: " ,bookingMaterials);
//         //     console.log("Category: " ,bookingCategory);
//         //     console.log("Services: " ,bookingServices);
//         // } else {
//         //   console.log("No savedOptions found in the document.");
//         // }
//         // } else {
//         //   console.log("No such document!");
//         // }
//       } catch (error) {
//         console.error("Error retrieving data:", error);
//       }
//     }

//     fetchData(); // Call the fetchData function immediately
//   }, []); // Add userID as a dependency

//   const handleGetDirections = () => {
//     const customerLocation = bookingCoordinates;

//     const data = {
//       source: providerLocation,
//       destination: customerLocation,
//       params: [
//         {
//           key: "travelmode",
//           value: "driving", // could be "walking", "bicycling" or "transit" as well
//         },
//         {
//           key: "dir_action",
//           value: "navigate", // this launches navigation directly
//         },
//       ],
//     };

//     const url = `https://www.google.com/maps/dir/?api=1&origin=${data.source.latitude},${data.source.longitude}&destination=${data.destination.latitude},${data.destination.longitude}&travelmode=${data.params[0].value}`;
//     Linking.openURL(url);
//   };

//   return (
//     <View style={[styles.viewBookingDetails, styles.frameItemLayout]}>
//       <StatusBar barStyle="default" />
//       <ScrollView
//         style={styles.body}
//         showsVerticalScrollIndicator={true}
//         showsHorizontalScrollIndicator={true}
//         contentContainerStyle={styles.bodyScrollViewContent}
//       >
//         <LinearGradient
//           style={styles.frameParent}
//           locations={[0, 1]}
//           colors={["#1a244d", "#007ea7"]}
//         >
//           <View style={styles.ellipseParent}>
//             <Image
//               style={styles.frameChild}
//               contentFit="cover"
//               source={require("../assets/ellipse-52.png")}
//             />
//             <View style={styles.customer1Parent}>
//               <Text style={styles.customer1}> {bookingName} </Text>
//               <Text style={styles.customer1gmailcom}> {bookingEmail} </Text>
//             </View>
//           </View>
//           <View
//             style={[styles.backBtnWrapper, styles.backBtnWrapperSpaceBlock]}
//           >
//             <Pressable
//               style={[styles.backBtn, styles.btnLayout]}
//               onPress={() =>
//                 navigation.navigate("BottomTabsRoot", { screen: "Homepage" })
//               }
//             >
//               <Image
//                 style={styles.uiIconarrowBackwardfilled}
//                 contentFit="cover"
//                 source={require("../assets/ui-iconarrow-backwardfilled.png")}
//               />
//             </Pressable>
//           </View>
//           <View style={[styles.messageBtnWrapper, styles.btnWrapperPosition]}>
//             <Pressable
//               style={[styles.messageBtn, styles.btnLayout]}
//               onPress={() => {
//                 // Use Linking to open the messaging app with the specified number
//                 Linking.openURL(`sms:${phoneUser}`);
//               }}
//             >
//               <Image
//                 style={styles.icons8ChatBubble1001}
//                 contentFit="cover"
//                 source={require("../assets/icons8chatbubble100-1.png")}
//               />
//             </Pressable>
//           </View>
//           <View style={styles.editAddressModal}>
//             <View style={styles.frameGroup}>
//               <View
//                 style={[
//                   styles.bookingDetailsLabelParent,
//                   styles.dateAndTimeFrame3SpaceBlock,
//                 ]}
//               >
//                 <View style={styles.bookingDetailsLabel}>
//                   <Text style={styles.bookingDetails}>Booking details</Text>
//                 </View>
//                 <View
//                   style={[styles.dateAndTimeFrame, styles.dateFrameSpaceBlock]}
//                 >
//                   <View style={styles.dateRangeLightWrapper}>
//                     <Image
//                       style={styles.btnLayout}
//                       contentFit="cover"
//                       source={require("../assets/date-range-light1.png")}
//                     />
//                   </View>
//                   <View style={styles.dateAndTimeFrameInner}>
//                     <View style={[styles.dateWrapper, styles.frameInnerLayout]}>
//                       <Text style={[styles.date, styles.dateClr]}>Date</Text>
//                     </View>
//                   </View>
//                   <View style={styles.frameWrapper}>
//                     <View style={[styles.frame, styles.frameFlexBox1]}>
//                       <Text style={[styles.august112023, styles.amFlexBox]}>
//                         {bookingDate}
//                       </Text>
//                     </View>
//                   </View>
//                 </View>
//                 <View
//                   style={[styles.dateAndTimeFrame, styles.dateFrameSpaceBlock]}
//                 >
//                   <View style={styles.dateRangeLightWrapper}>
//                     <View style={styles.clock1Wrapper}>
//                       <Image
//                         style={styles.clock1Icon}
//                         contentFit="cover"
//                         source={require("../assets/clock-1.png")}
//                       />
//                     </View>
//                   </View>
//                   <View style={styles.dateAndTimeFrameInner}>
//                     <View style={[styles.timeWrapper, styles.timeLayout]}>
//                       <Text style={[styles.time, styles.timeLayout]}>Time</Text>
//                     </View>
//                   </View>
//                   <View style={styles.frameWrapper}>
//                     <View style={[styles.frame, styles.frameFlexBox1]}>
//                       <Text style={[styles.august112023, styles.amFlexBox]}>
//                         {bookingTime}
//                       </Text>
//                     </View>
//                   </View>
//                 </View>
//                 <View
//                   style={[styles.dateAndTimeFrame, styles.dateFrameSpaceBlock]}
//                 >
//                   <View style={styles.markersNearPinletMarkerWrapper}>
//                     <Image
//                       style={styles.markersNearPinletMarker}
//                       contentFit="cover"
//                       source={require("../assets/markers--near-pinlet-marker1.png")}
//                     />
//                   </View>
//                   <View style={styles.dateAndTimeFrameInner}>
//                     <View style={styles.addressWrapper}>
//                       <Text style={[styles.time, styles.timeLayout]}>
//                         Address
//                       </Text>
//                     </View>
//                   </View>
//                   <View style={styles.frameWrapper}>
//                     <View style={styles.frame2}>
//                       <Text style={[styles.august112023, styles.amFlexBox]}>
//                         {bookingAddress}
//                       </Text>
//                     </View>
//                   </View>
//                 </View>
//                 <View
//                   style={[styles.dateAndTimeFrame, styles.dateFrameSpaceBlock]}
//                 >
//                   <View style={styles.dateRangeLightWrapper}>
//                     <Image
//                       style={styles.btnLayout}
//                       contentFit="cover"
//                       source={require("../assets/gps-2.png")}
//                     />
//                   </View>
//                   <View style={styles.frameWrapper}>
//                     <View style={styles.frame2}>
//                       <View style={styles.timeContainer}>
//                         <Text style={[styles.typeOfProperty, styles.dateClr]}>
//                           Distance Radius
//                         </Text>
//                       </View>
//                     </View>
//                   </View>
//                   <View style={styles.frameWrapper}>
//                     <View style={styles.frame2}>
//                       <Text style={[styles.august112023, styles.amFlexBox]}>
//                         {bookingRadius} kilometers
//                       </Text>
//                     </View>
//                   </View>
//                 </View>
//               </View>
//               <View style={styles.bookingDetailsLabelGroup}>
//                 <View style={styles.bookingDetailsLabel1}>
//                   <Text style={styles.bookingDetails}>Service Details</Text>
//                 </View>
//                 <View
//                   style={[styles.dateAndTimeFrame, styles.dateFrameSpaceBlock]}
//                 >
//                   <View style={styles.dateRangeLightWrapper}>
//                     <Image
//                       style={styles.btnLayout}
//                       contentFit="cover"
//                       source={require("../assets/gps-2.png")}
//                     />
//                   </View>
//                   <View style={styles.frameWrapper}>
//                     <View style={styles.propertyTypeWrapper}>
//                       <Text style={[styles.date, styles.dateClr]}>
//                         Property Type
//                       </Text>
//                     </View>
//                   </View>
//                   <View style={styles.frameWrapper}>
//                     <View style={styles.frame2}>
//                       <Text style={[styles.august112023, styles.amFlexBox]}>
//                         {bookingProperty}
//                       </Text>
//                     </View>
//                   </View>
//                 </View>
//                 <View
//                   style={[styles.dateAndTimeFrame, styles.dateFrameSpaceBlock]}
//                 >
//                   <View style={styles.dateRangeLightWrapper}>
//                     <Image
//                       style={styles.btnLayout}
//                       contentFit="cover"
//                       source={require("../assets/mop-1.png")}
//                     />
//                   </View>
//                   <View style={styles.frameWrapper}>
//                     <View style={styles.materialsWrapper}>
//                       <Text style={[styles.date, styles.dateClr]}>
//                         Materials
//                       </Text>
//                     </View>
//                   </View>
//                   <View style={styles.frameWrapper6}>
//                     <View style={styles.frame2}>
//                       <Text style={[styles.august112023, styles.amFlexBox]}>
//                         {bookingMaterials}
//                       </Text>
//                     </View>
//                   </View>
//                 </View>
//                 <View
//                   style={[styles.dateAndTimeFrame, styles.dateFrameSpaceBlock]}
//                 >
//                   <View style={styles.dateRangeLightWrapper}>
//                     <View style={styles.plumbingInstallationPicWrapper}>
//                       <Image
//                         style={styles.plumbingInstallationPic}
//                         contentFit="cover"
//                         source={require("../assets/plumbing-installation-pic.png")}
//                       />
//                     </View>
//                   </View>
//                   <View style={styles.frameWrapper}>
//                     <View style={styles.materialsWrapper}>
//                       <Text style={[styles.date, styles.dateClr]}>
//                         Category
//                       </Text>
//                     </View>
//                   </View>
//                   <View style={styles.frameWrapper6}>
//                     <View style={styles.frame2}>
//                       <Text style={[styles.august112023, styles.amFlexBox]}>
//                         {bookingCategory}
//                       </Text>
//                     </View>
//                   </View>
//                 </View>
//               </View>
//               <View style={styles.componentsbuttonParent}>
//                 <Pressable
//                   style={[
//                     styles.componentsbutton,
//                     styles.componentsbuttonFlexBox,
//                   ]}
//                   onPress={handleGetDirections}
//                 >
//                   <Text style={styles.viewAllServices}>VIEW LOCATION</Text>
//                 </Pressable>
//                 <Pressable
//                   style={[
//                     styles.componentsbutton1,
//                     styles.componentsbuttonFlexBox,
//                   ]}
//                   onPress={() => {
//                     // Specify the phone number you want to call

//                     // Use Linking to open the phone dialer with the specified number
//                     Linking.openURL(`tel:${phoneUser}`);
//                   }}
//                 >
//                   <Text style={styles.viewAllServices}>CALL NOW</Text>
//                 </Pressable>
//               </View>
//               <View style={styles.bookingDetailsLabelContainer}>
//                 <View style={styles.bookingDetailsLabel}>
//                   <Text style={styles.bookingDetails}>Service Requests</Text>
//                 </View>
//                 <View
//                   style={[
//                     styles.subcategoriesFrame,
//                     styles.dateFrameSpaceBlock,
//                   ]}
//                 >
//                   {/* <View
//                     style={[
//                       styles.dateAndTimeFrame3,
//                       styles.dateAndTimeFrame3SpaceBlock,
//                     ]}
//                   >
//                     <View
//                       style={[
//                         styles.frameWrapper24,
//                         styles.frameWrapperFlexBox,
//                       ]}
//                     >
//                       <View style={styles.frame14}>
//                         <Text style={[styles.text4, styles.textClr]}>
//                           ₱2000.00
//                         </Text>
//                       </View>
//                     </View>
//                   </View> */}
//                   {bookingServices.map((item, index) => {
//                     const { name, service, totalPrice, value } = item;
//                     return (
//                       <View
//                         key={index}
//                         style={[
//                           styles.dateAndTimeFrame4,
//                           styles.backBtnWrapperSpaceBlock,
//                         ]}
//                       >
//                         <View style={styles.frameWrapper25}>
//                           <View style={styles.frame2}>
//                             <Text
//                               style={[styles.septicTank, styles.septicTankTypo]}
//                             >
//                               {name}
//                             </Text>
//                           </View>
//                         </View>
//                         <View
//                           style={[
//                             styles.dateAndTimeFrameInner1,
//                             styles.frameFlexBox,
//                           ]}
//                         >
//                           <View style={styles.frameWrapper9}>
//                             <View style={styles.frameWrapper10}>
//                               <View style={styles.bookingDetailsLabel}>
//                                 <Text style={[styles.text, styles.amTypo]}>
//                                   {" "}
//                                   {value}{" "}
//                                 </Text>
//                               </View>
//                             </View>
//                           </View>
//                         </View>
//                         <View
//                           style={[
//                             styles.frameWrapper28,
//                             styles.frameWrapperFlexBox,
//                           ]}
//                         >
//                           <View style={styles.frame2}>
//                             <Text style={[styles.text6, styles.textClr]}>
//                               {totalPrice}
//                             </Text>
//                           </View>
//                         </View>
//                       </View>
//                     );
//                   })}
//                   {/* <View
//                     style={[
//                       styles.dateAndTimeFrame4,
//                       styles.backBtnWrapperSpaceBlock,
//                     ]}
//                   >
//                     <View style={styles.frameWrapper25}>
//                       <View style={styles.frame2}>
//                         <Text
//                           style={[styles.septicTank, styles.septicTankTypo]}
//                         >
//                           Viral disease mangagement
//                         </Text>
//                       </View>
//                     </View>
//                     <View
//                       style={[
//                         styles.dateAndTimeFrameInner1,
//                         styles.frameFlexBox,
//                       ]}
//                     >
//                       <View style={styles.frameWrapper9}>
//                         <View style={styles.frameWrapper10}>
//                           <View style={styles.bookingDetailsLabel}>
//                             <Text style={[styles.text, styles.amTypo]}>1</Text>
//                           </View>
//                         </View>
//                       </View>
//                     </View>
//                     <View
//                       style={[
//                         styles.frameWrapper28,
//                         styles.frameWrapperFlexBox,
//                       ]}
//                     >
//                       <View style={styles.frame2}>
//                         <Text style={[styles.text6, styles.textClr]}>
//                           ₱1500.00
//                         </Text>
//                       </View>
//                     </View>
//                   </View>
//                   <View
//                     style={[
//                       styles.dateAndTimeFrame4,
//                       styles.backBtnWrapperSpaceBlock,
//                     ]}
//                   >
//                     <View style={styles.frameWrapper25}>
//                       <View style={styles.frame2}>
//                         <Text
//                           style={[styles.septicTank, styles.septicTankTypo]}
//                         >
//                           Cage or habitat cleaning
//                         </Text>
//                       </View>
//                     </View>
//                     <View
//                       style={[
//                         styles.dateAndTimeFrameInner1,
//                         styles.frameFlexBox,
//                       ]}
//                     >
//                       <View style={styles.frameWrapper9}>
//                         <View style={styles.frameWrapper10}>
//                           <View style={styles.bookingDetailsLabel}>
//                             <Text style={[styles.text, styles.amTypo]}>1</Text>
//                           </View>
//                         </View>
//                       </View>
//                     </View>
//                     <View
//                       style={[
//                         styles.frameWrapper28,
//                         styles.frameWrapperFlexBox,
//                       ]}
//                     >
//                       <View style={styles.frame2}>
//                         <Text style={[styles.text6, styles.textClr]}>
//                           ₱1500.00
//                         </Text>
//                       </View>
//                     </View>
//                   </View>
//                   <View
//                     style={[
//                       styles.dateAndTimeFrame4,
//                       styles.backBtnWrapperSpaceBlock,
//                     ]}
//                   >
//                     <View style={styles.frameWrapper25}>
//                       <View style={styles.frame2}>
//                         <Text
//                           style={[styles.septicTank, styles.septicTankTypo]}
//                         >
//                           Septic Tank
//                         </Text>
//                       </View>
//                     </View>
//                     <View
//                       style={[
//                         styles.dateAndTimeFrameInner1,
//                         styles.frameFlexBox,
//                       ]}
//                     >
//                       <View style={styles.frameWrapper9}>
//                         <View style={styles.frameWrapper10}>
//                           <View style={styles.bookingDetailsLabel}>
//                             <Text style={[styles.text, styles.amTypo]}>1</Text>
//                           </View>
//                         </View>
//                       </View>
//                     </View>
//                     <View
//                       style={[
//                         styles.frameWrapper28,
//                         styles.frameWrapperFlexBox,
//                       ]}
//                     >
//                       <View style={styles.frame2}>
//                         <Text style={[styles.text6, styles.textClr]}>
//                           ₱1500.00
//                         </Text>
//                       </View>
//                     </View>
//                   </View>
//                   <View
//                     style={[
//                       styles.dateAndTimeFrame4,
//                       styles.backBtnWrapperSpaceBlock,
//                     ]}
//                   >
//                     <View style={styles.frameWrapper25}>
//                       <View style={styles.frame2}>
//                         <Text
//                           style={[styles.septicTank, styles.septicTankTypo]}
//                         >
//                           Septic Tank
//                         </Text>
//                       </View>
//                     </View>
//                     <View
//                       style={[
//                         styles.dateAndTimeFrameInner1,
//                         styles.frameFlexBox,
//                       ]}
//                     >
//                       <View style={styles.frameWrapper9}>
//                         <View style={styles.frameWrapper10}>
//                           <View style={styles.bookingDetailsLabel}>
//                             <Text style={[styles.text, styles.amTypo]}>1</Text>
//                           </View>
//                         </View>
//                       </View>
//                     </View>
//                     <View
//                       style={[
//                         styles.frameWrapper28,
//                         styles.frameWrapperFlexBox,
//                       ]}
//                     >
//                       <View style={styles.frame2}>
//                         <Text style={[styles.text6, styles.textClr]}>
//                           ₱1500.00
//                         </Text>
//                       </View>
//                     </View>
//                   </View> */}
//                 </View>
//                 <View
//                   style={[styles.vectorWrapper, styles.dateFrameSpaceBlock]}
//                 >
//                   <Image
//                     style={[styles.frameItem, styles.frameItemLayout]}
//                     contentFit="cover"
//                     source={require("../assets/line-74.png")}
//                   />
//                 </View>
//                 <View
//                   style={[styles.dateAndTimeFrame9, styles.dateFrameSpaceBlock]}
//                 >
//                   <View style={styles.frameWrapper45}>
//                     <View style={styles.frame2}>
//                       <View style={styles.timeContainer}>
//                         <Text style={[styles.subtotal, styles.text15Typo]}>
//                           Subtotal
//                         </Text>
//                       </View>
//                       <View style={styles.frameInnerLayout}>
//                         <View style={styles.frame2}>
//                           <Text style={[styles.text15, styles.text15Typo]}>
//                             ₱{bookingSubtotal}.00
//                           </Text>
//                         </View>
//                       </View>
//                     </View>
//                   </View>
//                   <View style={styles.frameWrapper45}>
//                     <View style={styles.frame2}>
//                       <View style={styles.timeContainer}>
//                         <Text style={[styles.subtotal, styles.text15Typo]}>
//                           Distance Fee
//                         </Text>
//                       </View>
//                       <View style={styles.frameInnerLayout}>
//                         <View style={styles.frame2}>
//                           <Text style={[styles.text15, styles.text15Typo]}>
//                             ₱{bookingDistanceFee}.00
//                           </Text>
//                         </View>
//                       </View>
//                     </View>
//                   </View>
//                   <View style={styles.frameWrapper45}>
//                     <View style={styles.frame2}>
//                       <View style={styles.timeContainer}>
//                         <Text style={[styles.subtotal, styles.text15Typo]}>
//                           Total
//                         </Text>
//                       </View>
//                       <View style={styles.frameInnerLayout}>
//                         <View style={styles.frame2}>
//                           <Text style={[styles.text15, styles.text15Typo]}>
//                             ₱{bookingTotal}.00
//                           </Text>
//                         </View>
//                       </View>
//                     </View>
//                   </View>
//                 </View>
//               </View>
//               <View style={styles.dateAndTimeFrameWrapper}>
//                 <View style={styles.bookingDetailsLabel}>
//                   <View style={styles.dateRangeLightWrapper}>
//                     <Image
//                       style={styles.image2373Icon}
//                       contentFit="cover"
//                       source={require("../assets/image-2373.png")}
//                     />
//                   </View>
//                   <View style={styles.frameWrapper}>
//                     <View style={styles.frame2}>
//                       <View style={styles.frameInner3}>
//                         <View style={styles.paidViapaymentMethodWrapper}>
//                           <Text style={[styles.date, styles.dateClr]}>
//                             Paid via/Payment Method
//                           </Text>
//                         </View>
//                       </View>
//                       <View
//                         style={[styles.paypalWrapper, styles.frameFlexBox1]}
//                       >
//                         <Text style={[styles.paypal, styles.amFlexBox]}>
//                           {bookingPaymentMethod}
//                         </Text>
//                       </View>
//                     </View>
//                   </View>
//                 </View>
//               </View>
//               <View style={styles.customerAdditionalInstructioParent}>
//                 <Text
//                   style={[
//                     styles.customerAdditionalInstructio,
//                     styles.pleaseMeetMeLayout,
//                   ]}
//                 >
//                   Customer Additional Instructions
//                 </Text>
//                 <Text style={[styles.pleaseMeetMe, styles.pleaseMeetMeLayout]}>
//                   Please meet me at Room 6969, Hotel Sogo
//                 </Text>
//               </View>
//             </View>
//           </View>
//         </LinearGradient>
//       </ScrollView>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   bodyScrollViewContent: {
//     flexDirection: "column",
//     alignItems: "center",
//     justifyContent: "flex-end",
//   },
//   frameItemLayout: {
//     width: "100%",
//     flex: 1,
//   },
//   backBtnWrapperSpaceBlock: {
//     paddingHorizontal: 0,
//     flexDirection: "row",
//   },
//   btnLayout: {
//     height: 40,
//     width: 40,
//   },
//   btnWrapperPosition: {
//     top: 0,
//     position: "absolute",
//   },
//   dateAndTimeFrame3SpaceBlock: {
//     paddingVertical: Padding.p_8xs,
//     paddingHorizontal: 0,
//     justifyContent: "center",
//     alignSelf: "stretch",
//   },
//   dateFrameSpaceBlock: {
//     marginTop: 5,
//     alignSelf: "stretch",
//   },
//   frameInnerLayout: {
//     width: 83,
//     alignItems: "center",
//   },
//   dateClr: {
//     color: Color.lightLabelPrimary,
//     textAlign: "left",
//   },
//   frameFlexBox1: {
//     justifyContent: "flex-end",
//     flexDirection: "row",
//     alignItems: "center",
//   },
//   amFlexBox: {
//     textAlign: "right",
//     color: Color.lightLabelPrimary,
//   },
//   timeLayout: {
//     width: 79,
//     alignItems: "center",
//   },
//   componentsbuttonFlexBox: {
//     paddingVertical: Padding.p_xs,
//     borderRadius: Border.br_mini,
//     paddingHorizontal: 0,
//     flexDirection: "row",
//     justifyContent: "center",
//     alignItems: "center",
//     flex: 1,
//   },
//   amTypo: {
//     fontFamily: FontFamily.workSansRegular,
//     textTransform: "capitalize",
//     fontSize: FontSize.buttonBold15_size,
//   },
//   septicTankTypo: {
//     fontFamily: FontFamily.interRegular,
//     fontSize: FontSize.levelSemibold14_size,
//     textTransform: "capitalize",
//     color: Color.lightLabelPrimary,
//     flex: 1,
//   },
//   frameWrapperFlexBox: {
//     width: 68,
//     alignItems: "flex-end",
//     display: "none",
//     justifyContent: "center",
//   },
//   textClr: {
//     color: Color.neutral07,
//     textAlign: "right",
//   },
//   frameFlexBox: {
//     width: 38,
//     paddingVertical: 0,
//     paddingHorizontal: Padding.p_9xs,
//     flexDirection: "row",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   text15Typo: {
//     fontFamily: FontFamily.interLight,
//     fontWeight: "300",
//     fontSize: FontSize.buttonBold15_size,
//     flex: 1,
//   },
//   pleaseMeetMeLayout: {
//     lineHeight: 15,
//     textAlign: "left",
//   },
//   frameChild: {
//     width: 112,
//     height: 112,
//   },
//   customer1: {
//     fontSize: FontSize.typographyHeading3Medium_size,
//     fontFamily: FontFamily.typographyParagraphSmallMedium,
//     textAlign: "left",
//     color: Color.m3White,
//     fontWeight: "500",
//   },
//   customer1gmailcom: {
//     fontFamily: FontFamily.georamaLight,
//     marginTop: 3,
//     fontWeight: "300",
//     fontSize: FontSize.buttonBold15_size,
//     textAlign: "left",
//     color: Color.m3White,
//   },
//   customer1Parent: {
//     marginTop: 10,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   ellipseParent: {
//     zIndex: 0,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   uiIconarrowBackwardfilled: {
//     width: 24,
//     height: 24,
//   },
//   backBtn: {
//     paddingHorizontal: Padding.p_xs,
//     paddingVertical: Padding.p_9xs,
//     borderRadius: Border.br_xl,
//     height: 40,
//     flexDirection: "row",
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: Color.m3White,
//   },
//   backBtnWrapper: {
//     left: 16,
//     zIndex: 1,
//     paddingVertical: Padding.p_mini,
//     top: 0,
//     position: "absolute",
//   },
//   icons8ChatBubble1001: {
//     width: 27,
//     height: 27,
//   },
//   messageBtn: {
//     borderRadius: Border.br_xl,
//     height: 40,
//     flexDirection: "row",
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: Color.m3White,
//   },
//   messageBtnWrapper: {
//     right: 14,
//     paddingTop: Padding.p_mini,
//     zIndex: 2,
//     flexDirection: "row",
//   },
//   bookingDetails: {
//     fontSize: FontSize.title3Bold20_size,
//     fontFamily: FontFamily.workSansSemiBold,
//     color: Color.colorDarkslateblue_100,
//     display: "flex",
//     fontWeight: "600",
//     textAlign: "left",
//     alignSelf: "stretch",
//     alignItems: "center",
//     flex: 1,
//   },
//   bookingDetailsLabel: {
//     flexDirection: "row",
//     justifyContent: "center",
//     alignSelf: "stretch",
//     alignItems: "center",
//   },
//   dateRangeLightWrapper: {
//     flexDirection: "row",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   date: {
//     fontFamily: FontFamily.workSansMedium,
//     fontSize: FontSize.size_lg,
//     fontWeight: "500",
//     flex: 1,
//   },
//   dateWrapper: {
//     flexDirection: "row",
//   },
//   dateAndTimeFrameInner: {
//     marginLeft: 7,
//     justifyContent: "center",
//   },
//   august112023: {
//     fontFamily: FontFamily.workSansRegular,
//     textTransform: "capitalize",
//     fontSize: FontSize.buttonBold15_size,
//     flex: 1,
//   },
//   frame: {
//     alignSelf: "stretch",
//   },
//   frameWrapper: {
//     marginLeft: 7,
//     justifyContent: "center",
//     flex: 1,
//   },
//   dateAndTimeFrame: {
//     flexDirection: "row",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   clock1Icon: {
//     height: 32,
//     width: 32,
//   },
//   clock1Wrapper: {
//     padding: Padding.p_9xs,
//     flexDirection: "row",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   time: {
//     color: Color.lightLabelPrimary,
//     textAlign: "left",
//     fontFamily: FontFamily.workSansMedium,
//     fontSize: FontSize.size_lg,
//     fontWeight: "500",
//     display: "flex",
//   },
//   timeWrapper: {
//     flexDirection: "row",
//   },
//   timeContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     flex: 1,
//   },
//   editBtn: {
//     marginLeft: -56,
//     alignItems: "center",
//   },
//   frame2: {
//     flexDirection: "row",
//     alignSelf: "stretch",
//     alignItems: "center",
//   },
//   am: {
//     fontFamily: FontFamily.workSansRegular,
//     textTransform: "capitalize",
//     fontSize: FontSize.buttonBold15_size,
//   },
//   dateAndTimeFrame2: {
//     paddingTop: Padding.p_3xs,
//     paddingBottom: Padding.p_8xs,
//     display: "none",
//     flexDirection: "row",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   markersNearPinletMarker: {
//     height: 41,
//     width: 32,
//   },
//   markersNearPinletMarkerWrapper: {
//     paddingVertical: 0,
//     paddingHorizontal: Padding.p_9xs,
//     flexDirection: "row",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   addressWrapper: {
//     width: 75,
//     flexDirection: "row",
//     alignItems: "center",
//   },
//   typeOfProperty: {
//     width: 152,
//     fontFamily: FontFamily.workSansMedium,
//     fontSize: FontSize.size_lg,
//     fontWeight: "500",
//     display: "flex",
//     alignItems: "center",
//   },
//   bookingDetailsLabelParent: {
//     backgroundColor: Color.m3White,
//   },
//   bookingDetailsLabel1: {
//     paddingLeft: Padding.p_8xs,
//     flexDirection: "row",
//     justifyContent: "center",
//     alignSelf: "stretch",
//     alignItems: "center",
//   },
//   propertyTypeWrapper: {
//     width: 148,
//     flexDirection: "row",
//     alignItems: "center",
//   },
//   materialsWrapper: {
//     width: 88,
//     flexDirection: "row",
//     alignItems: "center",
//   },
//   frameWrapper6: {
//     width: 200,
//     marginLeft: 7,
//     justifyContent: "center",
//   },
//   plumbingInstallationPic: {
//     height: 31,
//     width: 30,
//   },
//   plumbingInstallationPicWrapper: {
//     padding: Padding.p_8xs,
//     flexDirection: "row",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   bookingDetailsLabelGroup: {
//     marginTop: 15,
//     alignSelf: "stretch",
//     alignItems: "center",
//   },
//   viewAllServices: {
//     letterSpacing: -0.1,
//     lineHeight: 24,
//     fontWeight: "700",
//     fontFamily: FontFamily.title2Bold32,
//     color: Color.neutral01,
//     textAlign: "center",
//     fontSize: FontSize.buttonBold15_size,
//     flex: 1,
//   },
//   componentsbutton: {
//     backgroundColor: Color.colorSteelblue,
//   },
//   componentsbutton1: {
//     backgroundColor: Color.colorDarkslategray_600,
//     marginLeft: 10,
//   },
//   componentsbuttonParent: {
//     alignItems: "flex-end",
//     marginTop: 15,
//     flexDirection: "row",
//     justifyContent: "center",
//     alignSelf: "stretch",
//   },
//   text: {
//     textAlign: "center",
//     color: Color.m3White,
//   },
//   frameWrapper10: {
//     borderRadius: Border.br_5xs,
//     backgroundColor: Color.colorDarkslateblue_200,
//     height: 30,
//     width: 30,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   frameWrapper9: {
//     flexDirection: "row",
//     justifyContent: "center",
//     alignItems: "center",
//     flex: 1,
//   },
//   toiletSystem: {
//     textAlign: "center",
//   },
//   frameWrapper11: {
//     marginTop: 7,
//     justifyContent: "center",
//     alignSelf: "stretch",
//     alignItems: "center",
//   },
//   frameParent2: {
//     justifyContent: "center",
//     alignItems: "center",
//     flex: 1,
//   },
//   frameParent3: {
//     marginLeft: 7,
//     justifyContent: "center",
//     alignItems: "center",
//     flex: 1,
//   },
//   frameWrapper19: {
//     width: 78,
//     marginTop: 7,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   text4: {
//     lineHeight: 16,
//     color: Color.neutral07,
//     fontSize: FontSize.m3LabelMedium_size,
//     fontFamily: FontFamily.interRegular,
//     flex: 1,
//   },
//   frame14: {
//     display: "none",
//     flexDirection: "row",
//     alignSelf: "stretch",
//     alignItems: "center",
//   },
//   frameWrapper24: {
//     marginTop: 7,
//   },
//   dateAndTimeFrame3: {
//     display: "none",
//     alignItems: "center",
//   },
//   septicTank: {
//     textAlign: "left",
//   },
//   frameWrapper25: {
//     justifyContent: "center",
//     flex: 1,
//   },
//   dateAndTimeFrameInner1: {
//     marginLeft: 7,
//   },
//   text6: {
//     lineHeight: 16,
//     color: Color.neutral07,
//     fontSize: FontSize.m3LabelMedium_size,
//     fontFamily: FontFamily.interRegular,
//     flex: 1,
//     display: "none",
//   },
//   frameWrapper28: {
//     marginLeft: 7,
//   },
//   dateAndTimeFrame4: {
//     paddingVertical: Padding.p_10xs,
//     justifyContent: "center",
//     alignSelf: "stretch",
//     alignItems: "center",
//   },
//   subcategoriesFrame: {
//     justifyContent: "center",
//   },
//   frameItem: {
//     maxWidth: "100%",
//     overflow: "hidden",
//     maxHeight: "100%",
//     alignSelf: "stretch",
//   },
//   vectorWrapper: {
//     height: 1,
//     alignItems: "center",
//   },
//   subtotal: {
//     color: Color.lightLabelPrimary,
//     textAlign: "left",
//   },
//   text15: {
//     lineHeight: 20,
//     color: Color.neutral07,
//     textAlign: "right",
//   },
//   frameWrapper45: {
//     justifyContent: "center",
//     alignSelf: "stretch",
//   },
//   dateAndTimeFrame9: {
//     paddingTop: Padding.p_8xs,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   bookingDetailsLabelContainer: {
//     paddingLeft: Padding.p_10xs,
//     marginTop: 15,
//     justifyContent: "center",
//     alignSelf: "stretch",
//     backgroundColor: Color.m3White,
//   },
//   image2373Icon: {
//     height: 23,
//     width: 40,
//   },
//   paidViapaymentMethodWrapper: {
//     width: 150,
//     flexDirection: "row",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   frameInner3: {
//     alignItems: "center",
//     flex: 1,
//   },
//   paypal: {
//     fontFamily: FontFamily.workSansMedium,
//     fontSize: FontSize.size_lg,
//     fontWeight: "500",
//     flex: 1,
//   },
//   paypalWrapper: {
//     flex: 1,
//   },
//   dateAndTimeFrameWrapper: {
//     marginTop: 15,
//     justifyContent: "center",
//     alignSelf: "stretch",
//     backgroundColor: Color.m3White,
//   },
//   customerAdditionalInstructio: {
//     fontFamily: FontFamily.levelSemibold14,
//     color: Color.colorGray_300,
//     lineHeight: 15,
//     fontSize: FontSize.levelSemibold14_size,
//     fontWeight: "600",
//   },
//   pleaseMeetMe: {
//     fontFamily: FontFamily.montserratMedium,
//     color: "#6d6d6d",
//     fontSize: FontSize.m3LabelMedium_size,
//     lineHeight: 15,
//     marginTop: 3,
//     fontWeight: "500",
//   },
//   customerAdditionalInstructioParent: {
//     width: 343,
//     height: 33,
//     marginTop: 15,
//   },
//   frameGroup: {
//     borderTopLeftRadius: Border.br_5xl,
//     borderTopRightRadius: Border.br_5xl,
//     paddingHorizontal: Padding.p_base,
//     paddingVertical: Padding.p_mini,
//     alignSelf: "stretch",
//     alignItems: "center",
//     backgroundColor: Color.m3White,
//   },
//   editAddressModal: {
//     paddingTop: Padding.p_6xl,
//     zIndex: 3,
//     alignSelf: "stretch",
//     alignItems: "center",
//   },
//   frameParent: {
//     paddingTop: Padding.p_11xl,
//     backgroundColor: "transparent",
//     alignSelf: "stretch",
//     alignItems: "center",
//   },
//   body: {
//     alignSelf: "stretch",
//     flex: 1,
//   },
//   viewBookingDetails: {
//     height: 812,
//     alignItems: "center",
//     backgroundColor: Color.m3White,
//   },
// });

// export default ViewBookingDetails;

