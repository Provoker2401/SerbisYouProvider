import React, { useState, useEffect } from 'react';
import {
  StyleProp,
  ViewStyle,
  StyleSheet,
  View,
  Text,
  Pressable,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { Image } from "expo-image";
import CalendarStrip from 'react-native-calendar-strip';
import moment from 'moment';
import { useNavigation } from "@react-navigation/native";
import { Padding, Color, FontSize, FontFamily, Border } from "../GlobalStyles";
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
import HistoryBookingCard from './HistoryBookingCard';

const HistoryBookings = ({ style }) => {
  const navigation = useNavigation();
  const [historyBookings, setHistoryBookings] = useState([]);

  const [selectedDate, setSelectedDate] = useState(moment());
  const [formattedDate, setFormattedDate] = useState(moment().format('MMMM D, YYYY'));
  const [customDatesStyles, setCustomDatesStyles] = useState([]);
  const [markedDates, setMarkedDates] = useState([]);
  const [startingDate, setStartingDate] = useState(moment());
  const [bookingStatusByDate, setBookingStatusByDate] = useState({});

  useEffect(() => {
    // Whenever the selectedDate changes, update the startingDate
    // to the start of the week of the new selectedDate.
    setStartingDate(selectedDate.clone().startOf('week'));
  }, [selectedDate]);

  useEffect(() => {
    const loadMarkedDates = async () => {
      const db = getFirestore();
      const auth = getAuth();
      const userUID = auth.currentUser?.uid;
      if (!userUID) return;

      let newCustomDatesStyles = [];
      let newMarkedDates = [];
      let startDate = moment(startingDate); // Assuming startingDate is set to the start of the week

      for (let i = 0; i < 7; i++) {
        let date = startDate.clone().add(i, 'days');
        let formattedDate = date.format('MMMM D, YYYY');

        let dots = [];
        let lines = [];

        const q = query(
          collection(db, "providerProfiles", userUID, "historyBookings"),
          where("date", "==", formattedDate)
        );
  
        const querySnapshot = await getDocs(q);
        let hasCancelled = false;
        let hasCompleted = false;

        querySnapshot.forEach((doc) => {
          const booking = doc.data();
          if (booking.status === "Canceled") {
            hasCancelled = true;
          }
          if (booking.status === "Completed") {
            hasCompleted = true;
          }
        });

        if (hasCancelled && hasCompleted) {
          dots.push({
            color: '#3bae5c',
          });
          dots.push({
            color: '#b41600',
          });
        } 
        else if (hasCompleted) {
          dots.push({
            color: '#3bae5c',
            // selectedColor: 'yellow',
          });
        }
        else if (hasCancelled) {
          dots.push({
            color: '#b41600',
            // selectedColor: 'yellow',
          });
        }

        newMarkedDates.push({
          date,
          dots,
        });
      }

      setCustomDatesStyles(newCustomDatesStyles);
      setMarkedDates(newMarkedDates);
      }
    loadMarkedDates();
  }, [startingDate]);


  const datesBlacklistFunc = date => {
    // Convert moment date to start of day for accurate comparison
    return date.isAfter(moment(),'day');
  };

  const onDateSelected = date => {
    setSelectedDate(date);
    setFormattedDate(date.format('MMMM D, YYYY'));

    // Additionally, if CalendarStrip doesn't automatically handle week changes,
    // you might need to explicitly set the startingDate to the start of the week of the selectedDate
    setStartingDate(date.clone().startOf('week'));
  };

  const setSelectedDateNextWeek = () => {
    const newSelectedDate = moment(selectedDate).add(1, 'week');
    setSelectedDate(newSelectedDate);
    setFormattedDate(newSelectedDate.format('MMMM D, YYYY'));
  };

  const setSelectedDatePrevWeek = () => {
    const newSelectedDate = moment(selectedDate).subtract(1, 'week');
    setSelectedDate(newSelectedDate);
    setFormattedDate(newSelectedDate.format('MMMM D, YYYY'));
  };

  // Custom Selector for Previous Week
  const CustomLeftSelector = (
    <TouchableOpacity  onPress={setSelectedDatePrevWeek} >
      <Image
        style={styles.leftArrow}
        source={require("../assets/left-arrow-black.png")}
      />
      {/* <Text style={styles.selectorText}>Prev</Text> */}
    </TouchableOpacity>
  );

  // Custom Selector for Next Week
  const CustomRightSelector = (
    <TouchableOpacity onPress={setSelectedDateNextWeek} >
      <Image
        style={styles.rightArrow}
        contentFit="cover"
        source={require("../assets/right-arrow-black.png")}
      />
      {/* <Text style={styles.selectorText}>Next</Text> */}
    </TouchableOpacity>
  );

  // const fetchHistoryBookings = () => {
  //   const db = getFirestore();
  //   const auth = getAuth();
  //   const userUID = auth.currentUser.uid;
  //   const formattedSelectedDate = selectedDate.format('YYYY-MM-DD');

  //   const q = query(collection(db, "providerProfiles", userUID, "historyBookings"));

  //   // Set up the listener with onSnapshot
  //   onSnapshot(q, (querySnapshot) => {
  //     let bookings = [];
  //     if (!querySnapshot.empty) {
  //       querySnapshot.forEach((doc) => {
  //         // doc.data() is never undefined for query doc snapshots
  //         bookings.push({ id: doc.id, ...doc.data() });
  //         setHistoryBookings(bookings);
  //       });
  //       console.log("Bookings: " , bookings);
  //       // return bookings;
  //     }else {
  //       console.log("The 'historyBookings' collection is empty.");
  //     }
  //   }, (error) => {
  //     // Handle errors, e.g., permission issues
  //     console.log("Error fetching history bookings: ", error);
  //   });
  // };


    // Latest
    useEffect(() => {
      // Define the function within useEffect to avoid defining it on each render
      const loadHistoryBookings = () => {
        const db = getFirestore();
        const auth = getAuth();
        const userUID = auth.currentUser?.uid;
        if (!userUID) return;

        const formattedSelectedDate = selectedDate.format('MMMM D, YYYY');

        const q = query(
          collection(db, "providerProfiles", userUID, "historyBookings"),
          where("date", "==", formattedSelectedDate)
        );

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
          let bookings = [];
          if (!querySnapshot.empty) {
            querySnapshot.forEach((doc) => {
              bookings.push({ id: doc.id, ...doc.data() });
            });
            setHistoryBookings(bookings);
          } else {
            setHistoryBookings([]);
            console.log("No bookings for the selected date.");
          }
        }, (error) => {
          console.log("Error fetching history bookings: ", error);
        });

        return unsubscribe;
      };

      // Call the function to set up the listener
      const unsubscribe = loadHistoryBookings();

      // Clean up function
      return () => unsubscribe && unsubscribe();
    }, [selectedDate]);
    
  // const fetchHistoryBookings = () => {
  //   const db = getFirestore();
  //   const auth = getAuth();
  //   const userUID = auth.currentUser.uid;
  //   const formattedSelectedDate = selectedDate.format('YYYY-MM-DD');

  //   const q = query(collection(db, "providerProfiles", userUID, "historyBookings"));

  //   // Set up the listener with onSnapshot
  //   onSnapshot(q, (querySnapshot) => {
  //     let bookings = [];
  //     if (!querySnapshot.empty) {
  //       querySnapshot.forEach((doc) => {
  //         // doc.data() is never undefined for query doc snapshots
  //         bookings.push({ id: doc.id, ...doc.data() });
  //         setHistoryBookings(bookings);
  //       });
  //       console.log("Bookings: " , bookings);
  //       // return bookings;
  //     }else {
  //       console.log("The 'historyBookings' collection is empty.");
  //     }
  //   }, (error) => {
  //     // Handle errors, e.g., permission issues
  //     console.log("Error fetching history bookings: ", error);
  //   });
  // };

  const getFormattedServiceName = (item) => {
    // Check if the title is "Pet Care" or "Gardening"
    if (item.title === "Pet Care" || item.title === "Gardening" || item.title === "Cleaning") {
      return item.category;
    } else {
      // If not, concatenate the title and category
      return `${item.title} ${item.category}`;
    }
  };

  // useEffect(() => {
  //   const loadHistoryBookings =  () => {
  //     const bookings = fetchHistoryBookings();
  //     setHistoryBookings(bookings);
  //     console.log("History Bookings: " , historyBookings);
  //   };

  //   loadHistoryBookings();
  // }, []);

  const renderItem = ({ item, index }) => {
    return (
      <HistoryBookingCard
        status={item.status}
        date={item.date}
        time={item.time}
        location={item.address}
        serviceName={getFormattedServiceName(item)}
        customerName={item.name}
        totalPrice={item.totalPrice}
        paymentMethod={item.paymentMethod}
        id={item.id}
      />
    );
  };

  let datesWhitelist = [{
    start: moment(),
    end: moment().add(13, 'days')  // total 4 days enabled
  }];
  let datesBlacklist = [ moment().add(5, 'days') ]; // 1 day disabled
  return (
    <View
      style={[styles.historyBookings, styles.historyBookingsSpaceBlock]}
    >
      <View style={styles.image2531Wrapper}>
        <CalendarStrip
          // daySelectionAnimation={{type: 'background', duration: 200, highlightColor: '#1A244D'}}
          // style={{height: 100, width: '100%', paddingBottom: 10}}
          // calendarHeaderStyle={{color: 'black'}}
          // calendarColor={'white'}
          // dateNumberStyle={{color: 'black'}}
          // dateNameStyle={{color: 'black'}}
          // highlightDateNumberStyle={{color: 'white'}}
          // highlightDateNameStyle={{color: 'white'}}
          // disabledDateNameStyle={{color: 'grey'}}
          // disabledDateNumberStyle={{color: 'grey'}}
          // iconContainer={{flex: 0.1}}
          //         fontSize: FontSize.paragraphMedium15_size,
          // textAlign: "left",
          // fontFamily: FontFamily.levelSemibold14,
          // fontWeight: "600",
          // scrollable
          // calendarAnimation={{ type: 'sequence', duration: 30 }}
          daySelectionAnimation={{ type: 'background', duration: 300, highlightColor: '#007EA7' }}
          style={{ height: 100, width: '100%'}}
          calendarHeaderStyle={{ color: 'black', fontFamily: FontFamily.levelSemibold14 }}
          dateNameStyle={{ color: 'black', fontSize: 10}}
          dateNumberStyle={{ color: 'black', fontFamily: FontFamily.montserratMedium}}
          dayContainerStyle={{ alignItems: 'center', justifyContent: 'center', width: 46, height: 46, paddingVertical: 10}}
          calendarColor={'white'}
          iconContainer={{ flex: 0.1 }}
          highlightDateNameStyle={{ color: 'white' }}
          highlightDateNumberStyle={{ color: 'white' }}
          highlightDateContainerStyle={{ backgroundColor: '#007EA7' }}
          markedDates={markedDates}
          datesBlacklist={datesBlacklistFunc}
          disabledDateNameStyle={{color: '#464646'}}
          disabledDateNumberStyle={{color: '#464646'}}
          startingDate={startingDate} // Use the startingDate state here
          selectedDate={selectedDate}
          onDateSelected={onDateSelected}
          useIsoWeekday={false}
          leftSelector={[CustomLeftSelector]}
          rightSelector={[CustomRightSelector]}
        />
          {/* <Text style={{ fontSize: 24 }}>Selected Date: {formattedDate}</Text> */}
      </View>
      {historyBookings?.length === 0 ? (
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
                  No Past Bookings
                </Text>
                <Text
                  style={[
                    styles.currentlyYouDont,
                    styles.viewAllServicesLayout,
                  ]}
                >
                  Your booking history is empty. View all completed appointments and past activities here.
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
      ) :(
        <FlatList
          scrollEnabled={true}
          showsVerticalScrollIndicator={true}
          data={historyBookings}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  historyBookingsSpaceBlock: {
    paddingHorizontal: 0,
    alignSelf: "stretch",
  },
  leftArrow: {
    width: 25,
    height: 25,
  },
  rightArrow: {
    width: 25,
    height: 25,
  },
  frameParentSpaceBlock: {
    paddingLeft: Padding.p_8xs,
    flex: 1,
  },
  gardenMaintenanceTypo: {
    color: Color.lightLabelPrimary,
    fontSize: FontSize.paragraphMedium15_size,
    textAlign: "left",
    fontFamily: FontFamily.levelSemibold14,
    fontWeight: "600",
    lineHeight: 24,
    letterSpacing: -0.1,
  },
  cancelledFlexBox: {
    paddingVertical: Padding.p_7xs,
    paddingHorizontal: Padding.p_3xs,
    borderRadius: Border.br_6xs,
    flexDirection: "row",
    justifyContent: "center",
    alignSelf: "stretch",
  },
  cancelled1Clr: {
    color: Color.m3White,
    fontSize: FontSize.level2Medium12_size,
  },
  amTypo: {
    fontFamily: FontFamily.level2Medium12,
    fontWeight: "500",
  },
  frameChildLayout: {
    maxWidth: "100%",
    overflow: "hidden",
  },
  amountClr: {
    color: Color.colorTypographyContentIconsBlack02,
    textAlign: "left",
    letterSpacing: -0.1,
  },
  textTypo: {
    width: 95,
    fontFamily: FontFamily.level2Medium12,
    fontWeight: "500",
    color: Color.lightLabelPrimary,
  },
  parentSpaceBlock: {
    marginLeft: 5,
    justifyContent: "center",
  },
  iconPosition: {
    zIndex: 1,
    height: 23,
    width: 23,
    position: "absolute",
    overflow: "hidden",
  },
  scheduleFrameFlexBox: {
    paddingTop: Padding.p_xl,
    alignItems: "center",
    alignSelf: "stretch",
  },
  timeTypo: {
    fontFamily: FontFamily.interRegular,
    color: Color.colorTypographyContentIconsBlack02,
    textAlign: "left",
    lineHeight: 24,
    letterSpacing: -0.1,
  },
  textTypo1: {
    textAlign: "right",
    fontSize: FontSize.typographyTaglineSmallRegular_size,
  },
  parentFlexBox: {
    paddingHorizontal: Padding.p_8xs,
    paddingVertical: 0,
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "stretch",
  },
  buttonsFrameFlexBox: {
    paddingBottom: Padding.p_3xs,
    paddingTop: Padding.p_xl,
    alignItems: "flex-end",
    flexDirection: "row",
    justifyContent: "center",
    alignSelf: "stretch",
  },
  cancelledFrameSpaceBlock: {
    marginTop: 14,
    paddingBottom: Padding.p_7xs,
    alignItems: "center",
    backgroundColor: Color.m3White,
    alignSelf: "stretch",
  },
  uscTypo: {
    fontFamily: FontFamily.levelSemibold14,
    color: Color.colorDarkslategray_300,
    fontWeight: "600",
  },
  btnBorder: {
    borderWidth: 1.6,
    borderColor: Color.colorSteelblue,
    borderStyle: "solid",
    backgroundColor: Color.colorSteelblue,
    borderRadius: Border.br_xs,
    overflow: "hidden",
    flexDirection: "row",
    justifyContent: "center",
    flex: 1,
    alignItems: "center",
  },
  image2531Icon: {
    width: 472,
    height: 167,
  },
  image2531Wrapper: {
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "stretch",
  },
  gardenMaintenance: {
    textAlign: "left",
    flex: 1,
  },
  gardenMaintenanceWrapper: {
    flexDirection: "row",
    justifyContent: "center",
    flex: 1,
  },
  cancelled1: {
    textTransform: "capitalize",
    fontFamily: FontFamily.workSansSemiBold,
    textAlign: "left",
    fontWeight: "600",
    color: Color.m3White,
    fontSize: FontSize.level2Medium12_size,
  },
  cancelled: {
    backgroundColor: Color.colorFirebrick_300,
  },
  frameWrapper: {
    marginLeft: 10,
    alignItems: "flex-end",
  },
  frameContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignSelf: "stretch",
  },
  am: {
    color: Color.colorDarkslategray_300,
    lineHeight: 18,
    fontSize: FontSize.typographyTaglineSmallRegular_size,
    textAlign: "left",
    letterSpacing: -0.1,
    alignSelf: "stretch",
  },
  uscTalambanCebu: {
    color: Color.colorDarkslategray_300,
    lineHeight: 18,
    fontSize: FontSize.typographyTaglineSmallRegular_size,
    textAlign: "left",
    alignSelf: "stretch",
  },
  amParent: {
    justifyContent: "center",
    flex: 1,
  },
  vectorIcon: {
    width: 8,
    height: 13,
  },
  vectorWrapper: {
    paddingVertical: 0,
    paddingHorizontal: Padding.p_3xs,
    alignItems: "flex-end",
    justifyContent: "center",
  },
  frameView: {
    marginTop: 9,
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "stretch",
  },
  frameGroup: {
    justifyContent: "center",
    alignSelf: "stretch",
  },
  frameChild: {
    height: 1,
    overflow: "hidden",
    flex: 1,
  },
  vectorContainer: {
    paddingVertical: Padding.p_8xs,
    flexDirection: "row",
    justifyContent: "center",
  },
  johnDoe: {
    fontWeight: "700",
    fontFamily: FontFamily.title2Bold32,
    fontSize: FontSize.size_3xs,
    lineHeight: 18,
    flex: 1,
  },
  paidVia: {
    color: Color.colorDarkslategray_300,
  },
  gcash: {
    color: Color.colorDeepskyblue_100,
  },
  paidViaGcashContainer: {
    lineHeight: 18,
    fontSize: FontSize.typographyTaglineSmallRegular_size,
    textAlign: "left",
    letterSpacing: -0.1,
    alignSelf: "stretch",
  },
  paidViaGcashWrapper: {
    flex: 1,
  },
  text: {
    letterSpacing: 0.4,
    textAlign: "right",
    fontSize: FontSize.typographyTaglineSmallRegular_size,
    lineHeight: 18,
  },
  wrapper: {
    alignItems: "flex-end",
  },
  frameParent: {
    justifyContent: "center",
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
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "stretch",
  },
  messageIcon: {
    top: 10,
    left: 10,
  },
  messageBtn: {
    overflow: "hidden",
    marginTop: 9,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "stretch",
  },
  callBtnParent: {
    display: "none",
    alignItems: "center",
  },
  providerFrame: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "stretch",
  },
  time: {
    fontSize: FontSize.typographyTaglineSmallRegular_size,
  },
  am1: {
    color: Color.colorDarkslategray_300,
    fontFamily: FontFamily.levelSemibold14,
    fontWeight: "600",
    lineHeight: 24,
    letterSpacing: -0.1,
  },
  amWrapper: {
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
  uscTalambanCebu1: {
    lineHeight: 20,
    color: Color.colorDarkslategray_300,
    fontFamily: FontFamily.levelSemibold14,
    fontWeight: "600",
    flex: 1,
  },
  uscTalambanCebuCityCebuWrapper: {
    marginLeft: 20,
    flexDirection: "row",
    flex: 1,
  },
  frameParent2: {
    marginTop: 8,
    justifyContent: "center",
  },
  scheduleFrame: {
    display: "none",
  },
  viewDetails: {
    textAlign: "center",
    color: Color.m3White,
    fontSize: FontSize.level2Medium12_size,
    lineHeight: 24,
    letterSpacing: -0.1,
  },
  buttonsFrame: {
    display: "none",
  },
  rectangleFrameShadowBox1: {
    padding: Padding.p_3xs,
    shadowOpacity: 1,
    elevation: 4,
    shadowRadius: 4,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowColor: "rgba(0, 0, 0, 0.25)",
    backgroundColor: Color.colorMistyrose,
    borderRadius: Border.br_3xs,
    alignItems: "center",
    alignSelf: "stretch",
  },
  cancelled2: {
    backgroundColor: Color.colorMediumseagreen_200,
  },
  rectangleFrameShadowBox: {
    backgroundColor: Color.colorMintcream,
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
  image2378Icon: {
    width: 91,
    height: 91,
  },
  image2378Wrapper: {
    display: "none",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  cancelledWrapper1: {
    width: 92,
  },
  am4: {
    color: Color.colorDarkslategray_300,
    lineHeight: 18,
    fontSize: FontSize.typographyTaglineSmallRegular_size,
    textAlign: "left",
    letterSpacing: -0.1,
    alignSelf: "stretch",
  },
  uscTalambanCebu4: {
    color: Color.colorDarkslategray_300,
    lineHeight: 18,
    fontSize: FontSize.typographyTaglineSmallRegular_size,
    textAlign: "left",
    alignSelf: "stretch",
  },
  amount: {
    fontSize: FontSize.levelSemibold14_size,
    fontFamily: FontFamily.bodyLgBodyLgRegular,
    marginTop: 9,
    lineHeight: 24,
  },
  text2: {
    top: 7,
    left: 6,
    fontSize: FontSize.bodyLgBodyLgRegular_size,
    letterSpacing: 0.5,
    lineHeight: 31,
    position: "absolute",
    textAlign: "left",
  },
  cancelled6: {
    top: 11,
    left: 282,
    backgroundColor: Color.colorRoyalblue,
    width: 53,
    paddingVertical: Padding.p_9xs,
    position: "absolute",
    borderRadius: Border.br_6xs,
    flexDirection: "row",
    justifyContent: "center",
    paddingHorizontal: 0,
  },
  parent: {
    width: 350,
    height: 45,
    overflow: "hidden",
  },
  frameParent9: {
    paddingLeft: Padding.p_8xs,
    flex: 1,
  },
  providerFrame2: {
    paddingTop: Padding.p_3xs,
    paddingBottom: Padding.p_xl,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "stretch",
  },
  rectangleFrameChild: {
    height: 0,
    width: "100%",
    overflow: "hidden",
    alignSelf: "stretch",
  },
  cancelledFrame1: {
    display: "none",
  },
  image2378Container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  furnitureAssembly1: {
    textAlign: "left",
    alignSelf: "stretch",
  },
  customer1: {
    fontSize: FontSize.size_3xs,
    marginTop: 9,
    alignSelf: "stretch",
  },
  completedWrapper: {
    width: 89,
    justifyContent: "center",
  },
  text3: {
    marginLeft: 2,
    color: Color.colorDarkslategray_300,
    fontFamily: FontFamily.levelSemibold14,
    fontWeight: "600",
    lineHeight: 24,
    letterSpacing: -0.1,
  },
  eReceiptBtn1: {
    marginLeft: 26,
  },
  historyBookings: {
    paddingVertical: Padding.p_xl,
    flex: 1,
    backgroundColor: Color.m3White,
    paddingHorizontal: 0,
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
    paddingVertical: Padding.p_xl,
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

export default HistoryBookings;
