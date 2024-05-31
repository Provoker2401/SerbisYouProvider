import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  FlatList,
  ActivityIndicator,
  Modal,
} from "react-native";
import { Image } from "expo-image";
import { useNavigation } from "@react-navigation/native";
import { Padding, Color, Border, FontSize, FontFamily } from "../GlobalStyles";
import {
  getFirestore,
  collection,
  query,
  onSnapshot,
  doc,
  getDoc,
  getDocs,
  setDoc,
  where,
  serverTimestamp,
  runTransaction,
  writeBatch,
} from "firebase/firestore"; // Updated imports
import { getAuth } from "firebase/auth";
import CancelActiveBookingPrompt from "./CancelActiveBookingPrompt";
import CancelActiveBookingSuccessful from "./CancelActiveBookingSuccessful";
import ActiveBookingCard from './ActiveBookingCard';

const ActiveBookings = ({ style }) => {
  const navigation = useNavigation();
  const [activeBookings, setActiveBookings] = useState([]);

  const [selectedBookingId, setSelectedBookingId] = useState(null); 
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [matchedBookingID, setMatchedBookingID] = useState(""); 
  const [customerID, setCustomerID] = useState("");
  const [loading, setLoading] = useState(true); 
  const [loadingData, setLoadingData] = useState(true);

  const fetchActiveBookings = () => {
    const db = getFirestore();
    const auth = getAuth();
    const providerUID = auth.currentUser.uid;

    const q = query(collection(db, "providerProfiles", providerUID, "activeBookings"));

    // Set up the listener with onSnapshot
    onSnapshot(q, (querySnapshot) => {
      let bookings = [];
      if (!querySnapshot.empty) { 
        querySnapshot.forEach((doc) => {
          if (doc.data().bookingID !== undefined) {
            bookings.push({ id: doc.id, ...doc.data() });
          }
        });
        if (bookings.length > 0) {
          setActiveBookings(bookings);
          console.log("Bookings: ", bookings);
        } else {
          setActiveBookings([]);
          console.log("The 'activeBookings' collection is empty or has no data.");
        }
        setLoadingData(true);
      }else {
        setActiveBookings([]);
        setLoadingData(false);
        console.log("The 'activeBookings' collection is empty.");
      }
      setLoading(false);
    }, (error) => {
      console.log("Error fetching active bookings: ", error);
    });
  };

  const getFormattedServiceName = (item) => {
    // Check if the title is "Pet Care" or "Gardening" or "Cleaning"
    if (item.title === "Pet Care" || item.title === "Gardening" || item.title === "Cleaning") {
      return item.category;
    } else {
      // If not, concatenate the title and category
      return `${item.title} ${item.category}`;
    }
  };

  // Callback to open the cancellation prompt
  const openCancelModal = (bookingId, userID, bookingID) => {
    setSelectedBookingId(bookingId); // Set the selected booking ID
    setCustomerID(userID);
    setMatchedBookingID(bookingID);
  };

  // Callback to close the cancellation prompt
  const closeCancelModal = () => {
    setSelectedBookingId(null); // Clear the selected booking ID
  };

  // Callback for when the cancellation is confirmed
  const handleCancelConfirm = async () => {
    if (selectedBookingId) {
      setSelectedBookingId(null);
      setShowSuccessModal(true);

      const db = getFirestore();
      const auth = getAuth();
      const providerUID = auth.currentUser.uid;
      const bookingRef = doc(db, "providerProfiles", providerUID, "activeBookings", selectedBookingId);

      // Start a Firestore transaction
      await runTransaction(db, async (transaction) => {
        // Get the current document
        const userBookingSnapshot = await transaction.get(bookingRef);

        if (!userBookingSnapshot.exists()) {
          throw "Document does not exist!";
        }

        const userBookingData = userBookingSnapshot.data();
        
        // Update the status to "Completed"
        transaction.update(bookingRef, { status: "Canceled" });

        // Move the document to the activeBookings collection
        const historyBookingDocRef = doc(db, "providerProfiles", providerUID, "historyBookings", selectedBookingId);
        transaction.set(historyBookingDocRef, { ...userBookingData, status: "Canceled" });

        // Delete the document from historyBookings collection
        transaction.delete(bookingRef);

        // Update the provider profile
        const providerDocRef = doc(db, 'providerProfiles', providerUID);
        transaction.update(providerDocRef, {
          availability: "available",
          bookingID: "",
          bookingIndex: null,
          bookingMatched: false,
        });
        console.log("Provider booking canceled and moved to historyBookings");
      });

      const providerBookingDocRef = collection(db, "serviceBookings", customerID, "activeBookings");

      const q = query(providerBookingDocRef, where("bookingID", "==", matchedBookingID));
      const querySnapshot = await getDocs(q);

      console.log("Matched booking ID: " ,matchedBookingID);
      // Run a batch operation to move the booking to historyBookings and update the provider profile
      const batch = writeBatch(db);

      querySnapshot.forEach((document) => {
        console.log("Document ID: " , document.id);
        const docRef = doc(db, "serviceBookings", customerID, "activeBookings", document.id);
        const historyDocRef = doc(db, "serviceBookings", customerID, "historyBookings", document.id);

        // Copy the document to historyBookings
        batch.set(historyDocRef, { ...document.data(), status: "Canceled" });

        // Delete the document from activeBookings
        batch.delete(docRef);
      });

      // Commit the batch
      await batch.commit();
      console.log("Customer Booking canceled and moved to historyBookings");

      const notifDocRef = doc(db, "userProfiles", providerUID);
      const notifCollection = collection(notifDocRef, "notifications");
  
      const today = new Date();
      const options = {
        year: "numeric",
        month: "long",
        day: "numeric",
      };
      const formattedDate = today.toLocaleDateString("en-US", options); // Adjust locale as needed

      const bookingDataNotif = {
        [generateRandomBookingIDWithNumbers()]: {
          subTitle: `We regret to inform you that your Booking ${selectedBookingId} has been cancelled by the service provider`,
          title: "Booking Cancelled",
          createdAt: serverTimestamp(),
        },
        date: serverTimestamp(),
      };

      const notificationDocRef = doc(notifCollection, formattedDate);

      try {
        const notificationDoc = await getDoc(notificationDocRef);
        if (notificationDoc.exists()) {
          // Document exists, update it
          await setDoc(notificationDocRef, bookingDataNotif, {
            merge: true,
          });
          console.log("Notification updated successfully!");
        } else {
          // Document doesn't exist, create it
          await setDoc(notificationDocRef, bookingDataNotif);
          console.log("New notification document created!");
        }
      } catch (error) {
        console.error("Error updating notification:", error);
      }

      const notifDocRef2 = doc(db, "providerProfiles", customerID);
      const notifCollection2 = collection(notifDocRef2, "notifications");

      const bookingDataNotif2 = {
        [generateRandomBookingIDWithNumbers()]: {
          subTitle: `Booking ${selectedBookingId} has been cancelled successfully`,
          title: "Booking Cancelled",
          createdAt: serverTimestamp(),
        },
        date: serverTimestamp(),
      };

      const notificationDocRef2 = doc(notifCollection2, formattedDate);

      try {
        const notificationDoc = await getDoc(notificationDocRef);
        if (notificationDoc.exists()) {
          // Document exists, update it
          await setDoc(notificationDocRef2, bookingDataNotif2, {
            merge: true,
          });
          console.log("Notification updated successfully!");
        } else {
          // Document doesn't exist, create it
          await setDoc(notificationDocRef2, bookingDataNotif2);
          console.log("New notification document created!");
        }
      } catch (error) {
        console.error("Error updating notification:", error);
      }
    }
  };

  function generateRandomBookingIDWithNumbers(length = 8) {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let bookingID = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      bookingID += characters.charAt(randomIndex);
    }
    return bookingID;
  }

  const closeSuccessModal = () => {
    setShowSuccessModal(false); // Hide the success modal
    setSelectedBookingId(null);
  };
  
  useEffect(() => {
    const loadActiveBookings =  () => {
      const bookings = fetchActiveBookings();
      setActiveBookings(bookings);
      console.log("Active Bookings: " , activeBookings);
    };

    loadActiveBookings();
  }, []);
  
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
        onOpenCancelModal={() => openCancelModal(item.id, item.customerUID, item.bookingID)}
      />
    );
  };

  return (
    <View style={styles.container}>
      {loading ? (
          <ActivityIndicator size="large" color="#003459" />
        ) : (
        <View style={styles.activeBookingFlexBox}>
          {activeBookings?.length === 0 && !loadingData && (
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
                      Currently, you don’t have any bookings scheduled. Manage your availability and review past past activities here.
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
          )}
          {activeBookings?.length > 0 && loadingData &&(
            <View style={[styles.activeBookings, style]}>
              <FlatList
                scrollEnabled={true}
                showsVerticalScrollIndicator={true}
                data={activeBookings}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
              />
            </View>
          )}
          {selectedBookingId !== null && (
            <Modal
              animationType="fade"
              transparent
              visible={selectedBookingId !== null}
              // onRequestClose={closeCancelModal}
            >
              <View style={styles.logoutButtonOverlay}>
              <Pressable
                style={styles.logoutButtonBg}
                onPress={closeCancelModal}
              />
                <CancelActiveBookingPrompt
                  onClose={closeCancelModal}
                  onConfirm={handleCancelConfirm}
                />
              </View>
            </Modal>
          )}
          <Modal
            animationType="fade"
            transparent
            visible={showSuccessModal}
            // onRequestClose={closeSuccessModal}
          >
            <View style={styles.logoutButtonOverlay}>
              <Pressable
                style={styles.logoutButtonBg}
                onPress={closeSuccessModal}
              />
                <CancelActiveBookingSuccessful onClose={closeSuccessModal} />
            </View>
          </Modal>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignSelf: "stretch",
    alignItems: "center",
    flex: 1,
  },
  activeBookingFlexBox: {
    alignSelf: "stretch",
    flex: 1,
  },
  frameFlexBox: {
    paddingBottom: Padding.p_7xs,
    alignItems: "center",
    backgroundColor: Color.m3White,
    alignSelf: "stretch",
  },
  logoutButtonOverlay: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(113, 113, 113, 0.3)",
  },
  logoutButtonBg: {
    position: "absolute",
    width: "100%",
    height: "100%",
    left: 0,
    top: 0,
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
    paddingVertical: 80,
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
