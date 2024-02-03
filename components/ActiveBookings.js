import React, { useState, useEffect } from 'react';
import {
  StyleProp,
  ViewStyle,
  StyleSheet,
  View,
  Text,
  Pressable,
  FlatList,
} from "react-native";
import { Image } from "expo-image";
import { useNavigation } from "@react-navigation/native";
import { Padding, Color, Border, FontSize, FontFamily } from "../GlobalStyles";
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  where,
  query,
  onSnapshot,
} from "firebase/firestore"; // Updated imports
import { getAuth, onAuthStateChanged, updateEmail } from "firebase/auth";
import ActiveBookingCard from './ActiveBookingCard';

const ActiveBookings = ({ style }) => {
  const navigation = useNavigation();
  const [activeBookings, setActiveBookings] = useState([]);

  const fetchActiveBookings = () => {
    const db = getFirestore();
    const auth = getAuth();
    const providerUID = auth.currentUser.uid;

    const q = query(collection(db, "providerProfiles", providerUID, "activeBookings"));
    // const providerProfilesCollection = doc(db, "providerProfiles", providerUID);

    // getDoc(providerProfilesCollection)
    // .then(async (docSnapshot) => {
    //   if (docSnapshot.exists()) {
    //     const customerData = docSnapshot.data();
    //     setCustomerUID(customerData.bookingID);
    //     console.log("Customer UID: ", customerUID);
    //   } else {
    //     console.log("No such document!");
    //   }
    // })
    // .catch((error) => {
    //   console.error("Error getting document:", error);
    // })

    // Set up the listener with onSnapshot
    onSnapshot(q, (querySnapshot) => {
      let bookings = [];
      if (!querySnapshot.empty) {
        querySnapshot.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          bookings.push({ id: doc.id, ...doc.data() });
          setActiveBookings(bookings);
        });
        console.log("Bookings: " , bookings);
        // return bookings;
      }else {
        setActiveBookings([]);
        console.log("The 'activeBookings' collection is empty.");
      }
    }, (error) => {
      // Handle errors, e.g., permission issues
      console.log("Error fetching active bookings: ", error);
    });

  // Return the unsubscribe function to stop listening to changes
  // return typeof unsubscribe === 'function' ? unsubscribe : () => {};
    // const querySnapshot = await getDocs(q);
    // let bookings = [];
    // if (!querySnapshot.empty) {
    //   querySnapshot.forEach((doc) => {
    //     // doc.data() is never undefined for query doc snapshots
    //     bookings.push({ id: doc.id, ...doc.data() });
    //   });
    //   console.log("Bookings: " , bookings);
    //   return bookings;
    // }else {
    //   console.log("The 'activeBookings' collection is empty.");
    // }
  };

  const getFormattedServiceName = (item) => {
    // Check if the title is "Pet Care" or "Gardening"
    if (item.title === "Pet Care" || item.title === "Gardening") {
      return item.category;
    } else {
      // If not, concatenate the title and category
      return `${item.title} ${item.category}`;
    }
  };

  useEffect(() => {
    const loadActiveBookings =  () => {
      const bookings = fetchActiveBookings();
      setActiveBookings(bookings);
      console.log("Active Bookings: " , activeBookings);
    };

    loadActiveBookings();
  }, []);

  // useEffect(() => {
  //   const unsubscribe = fetchActiveBookings();
  
  //   // Clean up the subscription on unmount
  //   return () => {
  //     unsubscribe();
  //   };
  // }, []);
  
  // useEffect(() => {
  //   let isMounted = true; // Track the mount status
  //   const unsubscribe = fetchActiveBookings();
  
  //   return () => {
  //     isMounted = false; // Update the mount status
  //     if (typeof unsubscribe === 'function') {
  //       unsubscribe(); // Unsubscribe if it's a function
  //     }
  //   };
  // }, []);

  
  const renderItem = ({ item, index }) => {
    return (
      <ActiveBookingCard
        status={item.status}
        date={item.date}
        time={item.time}
        location={item.address}
        serviceName={getFormattedServiceName(item)}
        matchedBookingID={item.bookingID}
        customerName={item.name}
        phone={item.phone}
        customerUID={item.customerUID}
        id={item.id}
      />
    );
  };

  return (
    <>
    {activeBookings?.length === 0 ? (
      // Display when there are no bookings
        <View style={styles.activeTabsSpaceBlock}>
          <View style={styles.componentsBookingsInner}>
            <View style={styles.frameParent1}>
              <View style={styles.componentsBookingsInner}>
                <Image
                  style={styles.component13Icon}
                  contentFit="cover"
                  source={require("../assets/component-132.png")}
                />
              </View>
              <View style={styles.frameWrapperFlexBox}>
                <Text style={[styles.noUpcomingBookings, styles.bookingsTypo]}>
                  No Upcoming Bookings
                </Text>
                <Text
                  style={[
                    styles.currentlyYouDont,
                    styles.viewAllServicesLayout,
                  ]}
                >
                  Currently you don’t have any upcoming booking. Track
                  your booking from here.
                </Text>
              </View>
              <View style={[styles.frameWrapper, styles.frameWrapperFlexBox]}>
                <View style={styles.componentsbuttonWrapper}>
                  <Pressable style={styles.componentsbutton} onPress={() =>navigation.navigate("BottomTabsRoot", { screen: "Homepage" })}>
                    <Text
                      style={[
                        styles.viewAllServices,
                        styles.viewAllServicesLayout,
                      ]}
                    >
                      Accept Orders 
                    </Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </View>
        </View>
      ) : (<View style={[styles.activeBookings, style]}>
        <FlatList
          scrollEnabled={true}
          showsVerticalScrollIndicator={true}
          data={activeBookings}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
        />
        {/* <View style={styles.frameFlexBox}>
          <View style={[styles.rectangleFrame, styles.rectangleFrameShadowBox]}>
            <View style={styles.providerFrame}>
              <View style={styles.image2378Wrapper}>
                <Image
                  style={styles.image2378Icon}
                  contentFit="cover"
                  source={require("../assets/image-2378.png")}
                />
              </View>
              <View style={[styles.frameParent, styles.parentSpaceBlock]}>
                <View style={styles.deepCleaningParent}>
                  <Text style={styles.deepCleaning}>Deep Cleaning</Text>
                  <Text
                    style={[styles.dummyProvider1, styles.messageBtnSpaceBlock]}
                  >
                    Dummy Provider #1
                  </Text>
                </View>
                <View style={styles.pendingWrapper}>
                  <View style={[styles.pending, styles.pendingFlexBox]}>
                    <Text style={styles.pending1}>Pending</Text>
                  </View>
                </View>
              </View>
              <View style={[styles.callBtnParent, styles.parentSpaceBlock]}>
                <Pressable style={styles.callBtn}>
                  <Image
                    style={styles.callBtnChild}
                    contentFit="cover"
                    source={require("../assets/ellipse-232.png")}
                  />
                  <Image
                    style={[styles.callIcon, styles.iconPosition]}
                    contentFit="cover"
                    source={require("../assets/call.png")}
                  />
                </Pressable>
                <Pressable
                  style={[styles.messageBtn, styles.messageBtnSpaceBlock]}
                >
                  <Image
                    style={styles.callBtnChild}
                    contentFit="cover"
                    source={require("../assets/ellipse-232.png")}
                  />
                  <Image
                    style={[styles.messageIcon, styles.iconPosition]}
                    contentFit="cover"
                    source={require("../assets/message.png")}
                  />
                </Pressable>
              </View>
            </View>
            <Image
              style={styles.rectangleFrameChild}
              contentFit="cover"
              source={require("../assets/line-83.png")}
            />
            <View style={[styles.scheduleFrame, styles.frameSpaceBlock]}>
              <View style={styles.frameGroupFlexBox}>
                <Text style={styles.dateTime}>{`Date & Time`}</Text>
                <View style={styles.aug112023Parent}>
                  <Text
                    style={[styles.aug112023, styles.textTypo]}
                  >{`Aug 11, 2023 `}</Text>
                  <Text style={[styles.text, styles.textTypo]}>|</Text>
                  <Text style={[styles.text, styles.textTypo]}> 8:00 AM</Text>
                </View>
              </View>
              <View style={[styles.frameGroup, styles.frameGroupFlexBox]}>
                <View style={styles.locationWrapper}>
                  <Text style={styles.dateTime}>Location</Text>
                </View>
                <View style={styles.uscTalambanCebuCityCebuWrapper}>
                  <Text
                    style={[styles.uscTalambanCebu, styles.textTypo]}
                  >{`USC Talamban, Cebu City, Cebu, Region 7, Philippines `}</Text>
                </View>
              </View>
            </View>
            <View style={[styles.buttonsFrame, styles.frameSpaceBlock]}>
              <Pressable
                style={[styles.cancelBookingBtn, styles.btnBorder]}
                onPress={openCancelBookingBtn}
              >
                <Text style={[styles.cancelBooking, styles.viewDetailsTypo]}>
                  Cancel Booking
                </Text>
              </Pressable>
              <Pressable
                style={[styles.viewDetailsBtn, styles.btnBorder]}
                onPress={() => navigation.navigate("BookingDetails")}
              >
                <Text style={[styles.viewDetails, styles.viewDetailsTypo]}>
                  View Details
                </Text>
              </Pressable>
            </View>
          </View>
        </View> */}
        {/* <ActiveBookingCard>

        </ActiveBookingCard> */}
        {/* <View style={[styles.upcomingFrame, styles.frameFlexBox]}>
          <View
            style={[styles.rectangleFrame1, styles.rectangleFrameShadowBox]}
          >
            <View style={styles.providerFrame}>
              <View style={styles.image2378Wrapper}>
                <Image
                  style={styles.image2378Icon}
                  contentFit="cover"
                  source={require("../assets/image-2378.png")}
                />
              </View>
              <View style={[styles.frameParent, styles.parentSpaceBlock]}>
                <View style={styles.deepCleaningParent}>
                  <Text style={styles.deepCleaning}>Dog Training</Text>
                  <Text
                    style={[styles.dummyProvider1, styles.messageBtnSpaceBlock]}
                  >
                    Dummy Provider #1
                  </Text>
                </View>
                <View style={styles.upcomingWrapper}>
                  <View style={[styles.upcoming, styles.pendingFlexBox]}>
                    <Text style={styles.pending1}>Upcoming</Text>
                  </View>
                </View>
              </View>
              <View style={[styles.callBtnParent, styles.parentSpaceBlock]}>
                <Pressable style={styles.callBtn}>
                  <Image
                    style={styles.callBtnChild}
                    contentFit="cover"
                    source={require("../assets/ellipse-232.png")}
                  />
                  <Image
                    style={[styles.callIcon, styles.iconPosition]}
                    contentFit="cover"
                    source={require("../assets/call.png")}
                  />
                </Pressable>
                <Pressable
                  style={[styles.messageBtn, styles.messageBtnSpaceBlock]}
                >
                  <Image
                    style={styles.callBtnChild}
                    contentFit="cover"
                    source={require("../assets/ellipse-232.png")}
                  />
                  <Image
                    style={[styles.messageIcon, styles.iconPosition]}
                    contentFit="cover"
                    source={require("../assets/message.png")}
                  />
                </Pressable>
              </View>
            </View>
            <Image
              style={styles.rectangleFrameChild}
              contentFit="cover"
              source={require("../assets/line-83.png")}
            />
            <View style={[styles.scheduleFrame, styles.frameSpaceBlock]}>
              <View style={styles.frameGroupFlexBox}>
                <Text style={styles.dateTime}>{`Date & Time`}</Text>
                <View style={styles.aug112023Parent}>
                  <Text
                    style={[styles.aug112023, styles.textTypo]}
                  >{`Aug 11, 2023 `}</Text>
                  <Text style={[styles.text, styles.textTypo]}>|</Text>
                  <Text style={[styles.text, styles.textTypo]}> 8:00 AM</Text>
                </View>
              </View>
              <View style={[styles.frameGroup, styles.frameGroupFlexBox]}>
                <View style={styles.locationWrapper}>
                  <Text style={styles.dateTime}>Location</Text>
                </View>
                <View style={styles.uscTalambanCebuCityCebuWrapper}>
                  <Text
                    style={[styles.uscTalambanCebu, styles.textTypo]}
                  >{`USC Talamban, Cebu City, Cebu, Region 7, Philippines `}</Text>
                </View>
              </View>
            </View>
            <View style={[styles.buttonsFrame, styles.frameSpaceBlock]}>
              <Pressable
                style={[styles.cancelBookingBtn, styles.btnBorder]}
                onPress={openCancelBookingBtn1}
              >
                <Text style={[styles.cancelBooking, styles.viewDetailsTypo]}>
                  Cancel Booking
                </Text>
              </Pressable>
              <Pressable
                style={[styles.viewDetailsBtn, styles.btnBorder]}
                onPress={() => navigation.navigate("BookingDetails")}
              >
                <Text style={[styles.viewDetails, styles.viewDetailsTypo]}>
                  View Details
                </Text>
              </Pressable>
            </View>
          </View>
        </View> */}
        {/* <View style={[styles.upcomingFrame, styles.frameFlexBox]}>
          <View
            style={[styles.rectangleFrame2, styles.rectangleFrameShadowBox]}
          >
            <View style={styles.providerFrame}>
              <View style={styles.image2378Wrapper}>
                <Image
                  style={styles.image2378Icon}
                  contentFit="cover"
                  source={require("../assets/image-2378.png")}
                />
              </View>
              <View style={[styles.frameParent, styles.parentSpaceBlock]}>
                <View style={styles.deepCleaningParent}>
                  <Text style={styles.deepCleaning}>Pest Control</Text>
                  <Text
                    style={[styles.dummyProvider1, styles.messageBtnSpaceBlock]}
                  >
                    Dummy Provider #1
                  </Text>
                </View>
                <View style={styles.upcomingWrapper}>
                  <View style={[styles.inTransit, styles.pendingFlexBox]}>
                    <Text style={styles.pending1}>In Transit</Text>
                  </View>
                </View>
              </View>
              <View style={[styles.callBtnParent, styles.parentSpaceBlock]}>
                <Pressable style={styles.callBtn2}>
                  <Image
                    style={styles.callBtnChild}
                    contentFit="cover"
                    source={require("../assets/ellipse-232.png")}
                  />
                  <Image
                    style={[styles.callIcon, styles.iconPosition]}
                    contentFit="cover"
                    source={require("../assets/call.png")}
                  />
                </Pressable>
                <Pressable
                  style={[styles.messageBtn, styles.messageBtnSpaceBlock]}
                >
                  <Image
                    style={styles.callBtnChild}
                    contentFit="cover"
                    source={require("../assets/ellipse-232.png")}
                  />
                  <Image
                    style={[styles.messageIcon, styles.iconPosition]}
                    contentFit="cover"
                    source={require("../assets/message.png")}
                  />
                </Pressable>
              </View>
            </View>
            <Image
              style={styles.rectangleFrameChild}
              contentFit="cover"
              source={require("../assets/line-83.png")}
            />
            <View style={[styles.scheduleFrame, styles.frameSpaceBlock]}>
              <View style={styles.frameGroupFlexBox}>
                <Text style={styles.dateTime}>{`Date & Time`}</Text>
                <View style={styles.aug112023Parent}>
                  <Text
                    style={[styles.aug112023, styles.textTypo]}
                  >{`Aug 11, 2023 `}</Text>
                  <Text style={[styles.text, styles.textTypo]}>|</Text>
                  <Text style={[styles.text, styles.textTypo]}> 8:00 AM</Text>
                </View>
              </View>
              <View style={[styles.frameGroup, styles.frameGroupFlexBox]}>
                <View style={styles.locationWrapper}>
                  <Text style={styles.dateTime}>Location</Text>
                </View>
                <View style={styles.uscTalambanCebuCityCebuWrapper}>
                  <Text
                    style={[styles.uscTalambanCebu, styles.textTypo]}
                  >{`USC Talamban, Cebu City `}</Text>
                </View>
              </View>
            </View>
            <View style={[styles.buttonsFrame, styles.frameSpaceBlock]}>
              <Pressable
                style={[styles.cancelBookingBtn, styles.btnBorder]}
                onPress={openCancelBookingBtn2}
              >
                <Text style={[styles.cancelBooking, styles.viewDetailsTypo]}>
                  Cancel Booking
                </Text>
              </Pressable>
              <Pressable
                style={[styles.viewDetailsBtn, styles.btnBorder]}
                onPress={() => navigation.navigate("BookingDetails")}
              >
                <Text style={[styles.viewDetails, styles.viewDetailsTypo]}>
                  View Details
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
        <View style={[styles.upcomingFrame, styles.frameFlexBox]}>
          <View
            style={[styles.rectangleFrame3, styles.rectangleFrameShadowBox]}
          >
            <View style={styles.providerFrame}>
              <View style={styles.image2378Wrapper}>
                <Image
                  style={styles.image2378Icon}
                  contentFit="cover"
                  source={require("../assets/image-2378.png")}
                />
              </View>
              <View style={[styles.frameParent, styles.parentSpaceBlock]}>
                <View style={styles.deepCleaningParent}>
                  <Text style={styles.deepCleaning}>
                    Electrical Installation
                  </Text>
                  <Text
                    style={[styles.dummyProvider1, styles.messageBtnSpaceBlock]}
                  >
                    Dummy Provider #1
                  </Text>
                </View>
                <View style={styles.inProgressWrapper}>
                  <View style={[styles.inProgress, styles.pendingFlexBox]}>
                    <Text style={styles.pending1}>In Progress</Text>
                  </View>
                </View>
              </View>
              <View style={[styles.callBtnParent, styles.parentSpaceBlock]}>
                <Pressable style={styles.callBtn}>
                  <Image
                    style={styles.callBtnChild}
                    contentFit="cover"
                    source={require("../assets/ellipse-232.png")}
                  />
                  <Image
                    style={[styles.callIcon, styles.iconPosition]}
                    contentFit="cover"
                    source={require("../assets/call.png")}
                  />
                </Pressable>
                <Pressable
                  style={[styles.messageBtn, styles.messageBtnSpaceBlock]}
                >
                  <Image
                    style={styles.callBtnChild}
                    contentFit="cover"
                    source={require("../assets/ellipse-232.png")}
                  />
                  <Image
                    style={[styles.messageIcon, styles.iconPosition]}
                    contentFit="cover"
                    source={require("../assets/message.png")}
                  />
                </Pressable>
              </View>
            </View>
            <Image
              style={styles.rectangleFrameChild}
              contentFit="cover"
              source={require("../assets/line-83.png")}
            />
            <View style={[styles.scheduleFrame, styles.frameSpaceBlock]}>
              <View style={styles.frameGroupFlexBox}>
                <Text style={styles.dateTime}>{`Date & Time`}</Text>
                <View style={styles.aug112023Parent}>
                  <Text
                    style={[styles.aug112023, styles.textTypo]}
                  >{`Aug 11, 2023 `}</Text>
                  <Text style={[styles.text, styles.textTypo]}>|</Text>
                  <Text style={[styles.text, styles.textTypo]}> 8:00 AM</Text>
                </View>
              </View>
              <View style={[styles.frameGroup, styles.frameGroupFlexBox]}>
                <View style={styles.locationWrapper}>
                  <Text style={styles.dateTime}>Location</Text>
                </View>
                <View style={styles.uscTalambanCebuCityCebuWrapper}>
                  <Text style={[styles.uscTalambanCebu, styles.textTypo]}>
                    USC Talamban, Cebu City
                  </Text>
                </View>
              </View>
            </View>
            <View style={[styles.buttonsFrame, styles.frameSpaceBlock]}>
              <Pressable
                style={[styles.cancelBookingBtn, styles.btnBorder]}
                onPress={openCancelBookingBtn3}
              >
                <Text style={[styles.cancelBooking, styles.viewDetailsTypo]}>
                  Cancel Booking
                </Text>
              </Pressable>
              <Pressable
                style={[styles.viewDetailsBtn, styles.btnBorder]}
                onPress={() => navigation.navigate("BookingDetails")}
              >
                <Text style={[styles.viewDetails, styles.viewDetailsTypo]}>
                  View Details
                </Text>
              </Pressable>
            </View>
          </View>
        </View> */}
      </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  frameFlexBox: {
    paddingBottom: Padding.p_7xs,
    alignItems: "center",
    backgroundColor: Color.m3White,
    alignSelf: "stretch",
  },
  rectangleFrameShadowBox2: {
    padding: Padding.p_3xs,
    shadowOpacity: 1,
    elevation: 4,
    shadowRadius: 4,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowColor: "rgba(0, 0, 0, 0.25)",
    borderRadius: Border.br_3xs,
    alignItems: "center",
    alignSelf: "stretch",
  },
  callFlexBox: {
    alignSelf: "stretch",
    justifyContent: "center",
  },
  parentSpaceBlock1: {
    marginLeft: 5,
    justifyContent: "center",
  },
  customer1SpaceBlock: {
    marginTop: 9,
    alignSelf: "stretch",
  },
  pendingFlexBox: {
    paddingVertical: Padding.p_7xs,
    paddingHorizontal: Padding.p_3xs,
    borderRadius: Border.br_6xs,
    justifyContent: "center",
    flexDirection: "row",
    alignSelf: "stretch",
  },
  iconPosition1: {
    zIndex: 1,
    height: 23,
    width: 23,
    position: "absolute",
    overflow: "hidden",
  },
  rectangleFrameLayout: {
    width: "100%",
    maxWidth: "100%",
    overflow: "hidden",
    alignSelf: "stretch",
  },
  frameSpaceBlock: {
    paddingTop: Padding.p_xl,
    alignSelf: "stretch",
  },
  textTypo2: {
    textAlign: "right",
    color: Color.colorDarkslategray_300,
    fontSize: FontSize.typographyTaglineSmallRegular_size,
    fontFamily: FontFamily.levelSemibold14,
    fontWeight: "600",
  },
  frameGroupFlexBox: {
    paddingVertical: 0,
    paddingHorizontal: Padding.p_8xs,
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "stretch",
  },
  viewDetailsTypo: {
    textAlign: "center",
    fontFamily: FontFamily.level2Medium12,
    fontWeight: "500",
    fontSize: FontSize.level2Medium12_size,
    lineHeight: 24,
    letterSpacing: -0.1,
  },
  viewBorder: {
    marginLeft: 26,
    backgroundColor: Color.colorSteelblue,
    borderWidth: 1.6,
    borderColor: Color.colorSteelblue,
    borderStyle: "solid",
    borderRadius: Border.br_xs,
    justifyContent: "center",
    flexDirection: "row",
    flex: 1,
    alignItems: "center",
  },
  image2378Icon: {
    width: 91,
    height: 91,
  },
  image2378Wrapper: {
    justifyContent: "center",
    flexDirection: "row",
    alignItems: "center",
  },
  deepCleaning: {
    fontSize: FontSize.paragraphMedium15_size,
    color: Color.lightLabelPrimary,
    textAlign: "left",
    fontFamily: FontFamily.levelSemibold14,
    fontWeight: "600",
    lineHeight: 24,
    letterSpacing: -0.1,
    alignSelf: "stretch",
  },
  customer1: {
    fontSize: FontSize.size_3xs,
    color: Color.colorTypographyContentIconsBlack02,
    fontFamily: FontFamily.interRegular,
    marginTop: 9,
    textAlign: "left",
    lineHeight: 24,
    letterSpacing: -0.1,
  },
  deepCleaningParent: {
    justifyContent: "center",
  },
  pending1: {
    textTransform: "capitalize",
    fontFamily: FontFamily.workSansSemiBold,
    color: Color.m3White,
    fontSize: FontSize.level2Medium12_size,
    textAlign: "left",
    fontWeight: "600",
  },
  pending: {
    backgroundColor: Color.colorCornflowerblue,
  },
  pendingWrapper: {
    width: 73,
    justifyContent: "center",
  },
  frameParent: {
    paddingLeft: Padding.p_8xs,
    flex: 1,
  },
  callBtnChild: {
    width: 42,
    height: 42,
    zIndex: 0,
  },
  callIcon: {
    top: 9,
    left: 9,
  },
  callBtn: {
    overflow: "hidden",
    justifyContent: "center",
    flexDirection: "row",
    alignItems: "center",
  },
  messageIcon: {
    top: 10,
    left: 10,
  },
  messageBtn: {
    overflow: "hidden",
    justifyContent: "center",
    flexDirection: "row",
    alignItems: "center",
  },
  callBtnParent: {
    alignItems: "center",
  },
  providerFrame: {
    paddingTop: Padding.p_3xs,
    paddingBottom: Padding.p_xl,
    justifyContent: "center",
    flexDirection: "row",
    alignItems: "center",
  },
  rectangleFrameChild: {
    height: 0,
  },
  dateTime: {
    fontSize: FontSize.typographyTaglineSmallRegular_size,
    color: Color.colorTypographyContentIconsBlack02,
    fontFamily: FontFamily.interRegular,
    textAlign: "left",
    lineHeight: 24,
    letterSpacing: -0.1,
  },
  aug112023: {
    lineHeight: 24,
    letterSpacing: -0.1,
    color: Color.colorDarkslategray_300,
  },
  text: {
    marginLeft: 2,
    lineHeight: 24,
    letterSpacing: -0.1,
    color: Color.colorDarkslategray_300,
  },
  aug112023Parent: {
    justifyContent: "flex-end",
    marginLeft: 30,
    flexDirection: "row",
    flex: 1,
    alignItems: "center",
  },
  locationWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  uscTalambanCebu: {
    lineHeight: 20,
    flex: 1,
  },
  uscTalambanCebuCityCebuWrapper: {
    marginLeft: 20,
    flexDirection: "row",
    flex: 1,
  },
  frameGroup: {
    marginTop: 8,
    justifyContent: "center",
  },
  scheduleFrame: {
    alignItems: "center",
  },
  cancelBooking: {
    color: Color.colorSteelblue,
  },
  cancelBookingBtn: {
    borderWidth: 1.6,
    borderColor: Color.colorSteelblue,
    borderStyle: "solid",
    borderRadius: Border.br_xs,
    justifyContent: "center",
    flexDirection: "row",
    flex: 1,
    alignItems: "center",
    backgroundColor: Color.m3White,
  },
  viewDetails: {
    color: Color.m3White,
  },
  viewDetailsBtn: {
    overflow: "hidden",
  },
  buttonsFrame: {
    alignItems: "flex-end",
    paddingBottom: Padding.p_3xs,
    justifyContent: "center",
    flexDirection: "row",
  },
  rectangleFrame: {
    backgroundColor: Color.colorAliceblue,
  },
  pendingFrame: {
    display: "none",
  },
  upcoming: {
    backgroundColor: Color.colorTeal,
  },
  upcomingWrapper: {
    width: 85,
    justifyContent: "center",
  },
  rectangleFrameItem: {
    height: 1,
  },
  rectangleFrame1: {
    backgroundColor: Color.colorGainsboro_200,
  },
  upcomingFrame: {
    marginTop: 14,
  },
  inTransit: {
    backgroundColor: Color.colorOrangered,
  },
  callBtn2: {
    justifyContent: "center",
    flexDirection: "row",
    alignItems: "center",
  },
  rectangleFrame2: {
    backgroundColor: Color.colorGainsboro_100,
  },
  inProgress: {
    backgroundColor: Color.colorGoldenrod,
  },
  inProgressWrapper: {
    width: 93,
    justifyContent: "center",
  },
  rectangleFrame3: {
    backgroundColor: Color.colorLinen,
  },
  activeBookings: {
    paddingHorizontal: 0,
    paddingVertical: Padding.p_xl,
    flex: 1,
    backgroundColor: Color.m3White,
    alignSelf: "stretch",
  },

  // Empty Bookings Styles
  activeTabsSpaceBlock: {
    // marginTop: 15,
    // paddingVertical: 0,
    // paddingHorizontal: Padding.p_base,
    alignItems: "center",
    alignSelf: "stretch",
  },
  bookingsTypo: {
    color: Color.neutral07,
    fontFamily: FontFamily.title2Bold32,
    fontWeight: "700",
  },
  componentsBookingsInner: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    alignSelf: "stretch",
  },
  frameParent1: {
    paddingVertical: Padding.p_121xl,
    paddingHorizontal: Padding.p_xl,
    borderRadius: Border.br_5xs,
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    backgroundColor: Color.m3White,
  },
  component13Icon: {
    width: 93,
    height: 90,
  },
  frameWrapperFlexBox: {
    marginTop: 32,
    alignItems: "center",
    alignSelf: "stretch",
  },
  noUpcomingBookings: {
    lineHeight: 26,
    textAlign: "center",
    fontSize: FontSize.title3Bold20_size,
    color: Color.neutral07,
    alignSelf: "stretch",
  },
  currentlyYouDont: {
    marginTop: 10,
    color: Color.colorTypographyContentIconsBlack02,
    fontSize: FontSize.m3LabelLarge_size,
    fontWeight: "500",
    fontFamily: FontFamily.level2Medium12,
    alignSelf: "stretch",
  },
  viewAllServicesLayout: {
    lineHeight: 24,
    letterSpacing: -0.1,
    textAlign: "center",
  },
  frameWrapper: {
    paddingHorizontal: Padding.p_51xl,
    paddingVertical: 0,
    justifyContent: "center",
  },
  componentsbuttonWrapper: {
    justifyContent: "center",
    alignItems: "center",
  },
  componentsbutton: {
    backgroundColor: Color.colorDarkslategray_600,
    paddingHorizontal: Padding.p_3xl,
    paddingVertical: Padding.p_xs,
    borderRadius: Border.br_5xs,
    flexDirection: "row",
    display: "flex",
  },
  viewAllServices: {
    fontSize: FontSize.paragraphMedium15_size,
    color: Color.neutral01,
    width: 122,
    fontFamily: FontFamily.title2Bold32,
    fontWeight: "700",
    letterSpacing: -0.1,
  },
});

export default ActiveBookings;
