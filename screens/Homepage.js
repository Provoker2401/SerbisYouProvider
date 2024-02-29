import React, { useState, useCallback, useEffect } from "react";
import {
  StatusBar,
  StyleSheet,
  View,
  Text,
  Pressable,
  ScrollView,
  Switch,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { Color, Padding, FontFamily, Border, FontSize } from "../GlobalStyles";
import { useNavigation } from "@react-navigation/native";
import * as Location from "expo-location";
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
  onSnapshot,
} from "firebase/firestore"; // Updated imports
import { getAuth, onAuthStateChanged, updateEmail } from "firebase/auth";
// import { navigate } from "@react-navigation/routers/lib/typescript/src/CommonActions";

const Homepage = ({ route }) => {
  const navigation = useNavigation();
  const [toggleSwitchSwitchValueState, setToggleSwitchSwitchValueState] =
    useState(true);

  const [loading, setLoading] = useState(true);

  const [bookingAccepted, setBookingAccepted] = useState(
    route.params?.bookingAccepted
  );
  const [bookingAssigned, setBookingAssigned] = useState(
    route.params?.bookingAssigned
  );
  const [providerName, setProviderName] = useState("");

  const [isAcceptOrdersEnabled, setIsAcceptOrdersEnabled] = useState(false);

  const toggleAcceptOrdersSwitch = () => {
    setIsAcceptOrdersEnabled((previousState) => !previousState);
  };

  const [wallet, setWallet] = useState("");

  const [numberOfUpcomingServices, setNumberOfUpcomingServices] = useState();

  const [totalHistory, setTotalHistory] = useState();

  const [todayBookings, setTodayBookings] = useState();

  useEffect(() => {
    const fetchWalletAndCount = async () => {
      try {
        const db = getFirestore();
        const auth = getAuth();
        const providerUID = auth.currentUser.uid;

        const userWalletCollectionRef = collection(
          db,
          "providerProfiles",
          providerUID,
          "userWallet"
        );

        const upcomingServicesCollectionRef = collection(
          db,
          "providerProfiles",
          providerUID,
          "activeBookings"
        );

        const totalServiceCollectionRef = collection(
          db,
          "providerProfiles",
          providerUID,
          "historyBookings"
        );

        const unsubscribeWallet = onSnapshot(
          userWalletCollectionRef,
          (querySnapshot) => {
            querySnapshot.forEach((doc) => {
              const walletData = doc.data();

              const wallet = walletData.wallet;

              setWallet(wallet);
            });
          }
        );

        const unsubscribeUpcomingServices = onSnapshot(
          upcomingServicesCollectionRef,
          (querySnapshot) => {
            // Get the total number of documents
            const totalDocuments = querySnapshot.size;
            console.log(
              "Total number of documents inside upcomingServicesCollectionRef:",
              totalDocuments
            );

            // Filter documents with status Upcoming
            const filteredDocumentsUpcoming = querySnapshot.docs.filter(
              (doc) => {
                const status = doc.data().status;
                return status === "Upcoming";
              }
            );

            const numberOfUpcoming = filteredDocumentsUpcoming.length;

            setNumberOfUpcomingServices(numberOfUpcoming);

            // Filter documents with status "In Transit" or "In Progress"
            const filteredDocuments = querySnapshot.docs.filter((doc) => {
              const status = doc.data().status;
              return status === "In Transit" || status === "In Progress";
            });

            // Get the count of filtered documents
            const numberOfFilteredDocuments = filteredDocuments.length;
            console.log(
              "Number of documents with status 'In Transit' or 'In Progress':",
              numberOfFilteredDocuments
            );

            // Set the count to a state variable
            setTodayBookings(numberOfFilteredDocuments);
          }
        );

        const unsubscribeTotalService = onSnapshot(
          totalServiceCollectionRef,
          (querySnapshot) => {
            const numberOfHistory = querySnapshot.size;
            setTotalHistory(numberOfHistory);
          }
        );

        return () => {
          unsubscribeWallet(); // Cleanup function to unsubscribe from wallet updates
          unsubscribeUpcomingServices(); // Cleanup function to unsubscribe from upcomingServices updates
        };
      } catch (error) {
        console.error("Error fetching wallet data:", error);
      }
    };

    fetchWalletAndCount(); // Call the fetchWalletAndCount function
  }, []);

  useEffect(() => {
    async function fetchName() {
      try {
        const db = getFirestore();
        const auth = getAuth();
        const userUID = auth.currentUser.uid;
        const providerProfilesCollection = doc(db, "providerProfiles", userUID);

        getDoc(providerProfilesCollection)
          .then(async (docSnapshot) => {
            if (docSnapshot.exists()) {
              const providerData = docSnapshot.data();
              const coordinates = providerData.coordinates;
              setProviderName(providerData.name);

              console.log("Provider Name: ", providerData.name);
            } else {
              console.log("No such document!");
            }
          })
          .catch((error) => {
            console.error("Error getting document:", error);
          })
          .finally(() => {
            // Set loading to false when data fetching is complete
            setLoading(false);
          });
      } catch (error) {
        console.error("Error retrieving data:", error);
      }
    }

    fetchName();
  }, []);

  // make a listener for the switch to update in firebase
  useEffect(() => {
    const toggleAvailability = async () => {
      const db = getFirestore();
      const auth = getAuth();
      const providerUID = auth.currentUser.uid;

      const providerDocRef = doc(db, "providerProfiles", providerUID);

      const providerSnapshot = await getDoc(providerDocRef);

      try {
        if (providerSnapshot.exists()) {
          const providerAvailable = providerSnapshot.data().availability;


          if (isAcceptOrdersEnabled) {
            // Update the availability field in Firestore
            await updateDoc(providerDocRef, {
              availability: "available",
            });
          } else {
            await updateDoc(providerDocRef, {
              availability: "unavailable",
            });
          }
        } else {
          console.log("Provider Snapshot doesnt exist");
        }
      } catch (error) {
        console.log("Toggle availability error", error);
      }
    };

    toggleAvailability(); // call toogle availability
  }, [isAcceptOrdersEnabled]);

  useEffect(() => {

    let unsubscribe;

    async function fetchData() {
      const db = getFirestore();
      const auth = getAuth();
      const user = auth.currentUser;
      const userUID = auth.currentUser.uid;

      const providerDocRef = doc(db, "providerProfiles", userUID);

       unsubscribe = onSnapshot(providerDocRef, (docSnapshot) => {
        if (docSnapshot.exists) {
          const data = docSnapshot.data();
          const providerStatus = data.availability;
          const providerbookingAccepted = data.bookingMatched;

          if (providerStatus === "onHold" && providerbookingAccepted) {
            // Check if the switch is turned on

            const serviceBookingsCollection = collection(db, "serviceBookings");
            const providerProfilesCollection = doc(
              db,
              "providerProfiles",
              userUID
            );

            getDoc(providerProfilesCollection)
              .then(async (docSnapshot) => {
                if (docSnapshot.exists()) {
                  const providerData = docSnapshot.data();
                  const coordinates = providerData.coordinates;

                  console.log("Provider data: ", providerData);
                  console.log("Provider Coordinates: ", coordinates);
                  console.log(
                    "Provider Coordinates Latitude: ",
                    coordinates.latitude
                  );
                  console.log(
                    "Provider Coordinates Latitude: ",
                    coordinates.longitude
                  );
                  if (providerData.bookingMatched == true) {
                    if (providerData.bookingID != null) {
                      const q = query(serviceBookingsCollection);

                      const querySnapshot = await getDocs(q);

                      if (!querySnapshot.empty) {
                        // doc.data() is never undefined for query doc snapshots
                        // console.log(doc.id, " => ", doc.data());
                        querySnapshot.forEach((doc) => {
                          // Access data of the document using .data()
                          const bookingData = doc.data();
                          const id = doc.id;

                          // Access specific fields like "name"
                          const name = bookingData.name;
                          const accepted = bookingData.bookingAccepted;
                          const assigned = bookingData.bookingAssigned;
                          console.log("Booking Data: ", bookingData);
                          console.log(
                            "user Booking ID: ",
                            providerData.bookingID
                          );
                          console.log("ID: ", id);

                          const latitude = parseFloat(coordinates.latitude);
                          const longitude = parseFloat(coordinates.longitude);

                          if (id == providerData.bookingID) {
                            console.log("ID: ", id);
                            console.log("Name: ", name);
                            navigation.navigate("NewBooking", {
                              name: name,
                              userBookingID: id,
                              matchedBookingID: providerData.bookingID,
                              bookingIndex: providerData.bookingIndex,
                              providerCoordinates: {
                                latitude: latitude,
                                longitude: longitude,
                              },
                            });
                          }
                        });
                      } else {
                        console.log(
                          "The 'serviceBookings' collection is empty."
                        );
                      }
                    } else {
                      console.log("No booking ID found!");
                    }
                  } else {
                    console.log("No booking matched!");
                  }
                } else {
                  console.log("No such document!");
                }
              })
              .catch((error) => {
                console.error("Error getting document:", error);
              })
              .finally(() => {
                // Set loading to false when data fetching is complete
                setLoading(false);
              });
          }

          // check if available is
        }
      });

    }

    fetchData(); // Call the fetchData function immediately
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []); 

  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);

  return (
    <View style={styles.homepage}>
      <StatusBar barStyle="default" />
      <ScrollView
        style={styles.body}
        showsVerticalScrollIndicator={true}
        showsHorizontalScrollIndicator={true}
        contentContainerStyle={styles.bodyScrollViewContent}
      >
        <View style={[styles.helloUser, styles.countersSpaceBlock]}>
          <View style={[styles.componentsintroSearch, styles.searchBorder]}>
            <View style={styles.topContent}>
              <Text style={styles.helloMike}>Hello {providerName} 👋</Text>
            </View>
            <View style={[styles.frameGroup, styles.searchBarSpaceBlock]}>
              <View style={styles.goodMorningWrapper}>
                <Text style={[styles.goodMorning, styles.serbisyouTypo]}>
                  Accept Orders
                </Text>
              </View>
              <View style={[styles.frameWrapper, styles.wrapperFlexBox]}>
                <View
                  style={[styles.toggleSwitchWrapper, styles.wrapperFlexBox]}
                >
                  {/* <Switch
                    style={styles.toggleSwitch}
                    value={toggleSwitchSwitchValueState}
                    onValueChange={fetchData}
                    trackColor={{ false: "#939393", true: "#fff" }}
                  /> */}
                  <Switch
                    style={styles.toggleSwitch}
                    trackColor={{ false: "#979797", true: "#1A244D" }}
                    thumbColor={isAcceptOrdersEnabled ? "#00A8E8" : "#Fff"}
                    // ios_backgroundColor="grey"
                    onValueChange={toggleAcceptOrdersSwitch}
                    value={isAcceptOrdersEnabled}
                  />
                  {/* <Switch
                    trackColor={{ false: "#979797", true: "#1A244D" }}
                    thumbColor={isEnabled ? "#f5dd4b" : "#fff"}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={toggleSwitch}
                    value={isEnabled}
                  /> */}
                </View>
              </View>
            </View>
            <View style={[styles.searchBar, styles.searchBarSpaceBlock]}>
              <Text
                style={[styles.searchWhatYou, styles.searchWhatYouTypo]}
              >{`Fill up the Application Form `}</Text>
              <Image
                style={styles.searchBarChild}
                contentFit="cover"
                source={require("../assets/group-34308.png")}
              />
            </View>
          </View>
        </View>
        <View style={[styles.counters, styles.view2SpaceBlock]}>
          <View style={styles.serbisyouWrapper}>
            <View style={[styles.totalEarning, styles.totalBorder]}>
              <View>
                <Text style={styles.text}>₱{wallet}</Text>
                <Text style={styles.totalEarning2Typo}>Total Earning</Text>
              </View>
              <Image
                style={[styles.icon, styles.iconLayout1]}
                contentFit="cover"
                source={require("../assets/icon13.png")}
              />
            </View>
            <View style={[styles.totalService, styles.totalBorder]}>
              <View>
                <Text style={styles.text}>{totalHistory}</Text>
                <Text style={styles.totalEarning2Typo}>Total Services</Text>
              </View>
              <Image
                style={[styles.icon1, styles.iconLayout1]}
                contentFit="cover"
                source={require("../assets/icon14.png")}
              />
            </View>
          </View>
          <View style={[styles.view2, styles.view2SpaceBlock]}>
            <View style={styles.totalBorder}>
              <View>
                <Text style={styles.text}>{numberOfUpcomingServices}</Text>
                <Text
                  style={[styles.upcomingServices, styles.totalEarning2Typo]}
                >
                  upcoming services
                </Text>
              </View>
              <Image
                style={[styles.icon2, styles.iconLayout1]}
                contentFit="cover"
                source={require("../assets/icon15.png")}
              />
            </View>
            <View style={[styles.totalService, styles.totalBorder]}>
              <View>
                <Text style={styles.text}>{todayBookings}</Text>
                <Text style={styles.totalEarning2Typo}>{`Today’s
Service`}</Text>
              </View>
              <Image
                style={[styles.icon3, styles.iconLayout1]}
                contentFit="cover"
                source={require("../assets/icon14.png")}
              />
            </View>
          </View>
        </View>
        <View style={[styles.counters, styles.view2SpaceBlock]}>
          <View style={styles.reviews1FlexBox}>
            <Text style={[styles.reviews2, styles.reviews2Typo]}>Reviews</Text>
            <Text style={[styles.viewAll, styles.textTypo]}>View All</Text>
          </View>
          <View style={styles.comments}>
            <View style={styles.comment1}>
              <Image
                style={styles.imageIcon}
                contentFit="cover"
                source={require("../assets/image.png")}
              />
              <Text style={[styles.donnaBins, styles.ratingPosition]}>
                Donna Bins
              </Text>
              <View style={[styles.rating, styles.ratingPosition]}>
                <View style={styles.starParent}>
                  <Image
                    style={styles.frameLayout}
                    contentFit="cover"
                    source={require("../assets/star-1.png")}
                  />
                  <Image
                    style={[styles.frameInner, styles.frameLayout]}
                    contentFit="cover"
                    source={require("../assets/star-1.png")}
                  />
                  <Image
                    style={[styles.frameInner, styles.frameLayout]}
                    contentFit="cover"
                    source={require("../assets/star-1.png")}
                  />
                  <Image
                    style={[styles.frameInner, styles.frameLayout]}
                    contentFit="cover"
                    source={require("../assets/star-1.png")}
                  />
                  <Image
                    style={[styles.frameInner, styles.frameLayout]}
                    contentFit="cover"
                    source={require("../assets/star-1.png")}
                  />
                </View>
                <Text style={[styles.text4, styles.textTypo]}>4.5</Text>
              </View>
              <Text style={[styles.dec, styles.textTypo]}>02 Dec</Text>
              <Text
                style={[styles.ametMinimMollit, styles.ratingPosition]}
              >{`Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet. `}</Text>
            </View>
            <View style={styles.comment2}>
              <Image
                style={styles.imageIcon}
                contentFit="cover"
                source={require("../assets/image1.png")}
              />
              <Text style={[styles.donnaBins, styles.ratingPosition]}>
                Ashutosh Pandey
              </Text>
              <View style={[styles.rating, styles.ratingPosition]}>
                <View style={styles.starParent}>
                  <Image
                    style={styles.frameLayout}
                    contentFit="cover"
                    source={require("../assets/star-11.png")}
                  />
                  <Image
                    style={[styles.frameInner, styles.frameLayout]}
                    contentFit="cover"
                    source={require("../assets/star-11.png")}
                  />
                  <Image
                    style={[styles.frameInner, styles.frameLayout]}
                    contentFit="cover"
                    source={require("../assets/star-11.png")}
                  />
                  <Image
                    style={[styles.frameInner, styles.frameLayout]}
                    contentFit="cover"
                    source={require("../assets/star-11.png")}
                  />
                  <Image
                    style={[styles.frameInner, styles.frameLayout]}
                    contentFit="cover"
                    source={require("../assets/star-11.png")}
                  />
                </View>
                <Text style={[styles.text5, styles.textTypo]}>4.5</Text>
              </View>
              <Text style={[styles.jan, styles.textTypo]}>25 Jan</Text>
              <Text
                style={[styles.ametMinimMollit, styles.ratingPosition]}
              >{`Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet. `}</Text>
            </View>
            <View style={styles.comment2}>
              <Image
                style={styles.imageIcon}
                contentFit="cover"
                source={require("../assets/image2.png")}
              />
              <Text style={[styles.donnaBins, styles.ratingPosition]}>
                Kristin Watson
              </Text>
              <View style={[styles.rating, styles.ratingPosition]}>
                <View style={styles.starParent}>
                  <Image
                    style={styles.frameLayout}
                    contentFit="cover"
                    source={require("../assets/star-11.png")}
                  />
                  <Image
                    style={[styles.frameInner, styles.frameLayout]}
                    contentFit="cover"
                    source={require("../assets/star-11.png")}
                  />
                  <Image
                    style={[styles.frameInner, styles.frameLayout]}
                    contentFit="cover"
                    source={require("../assets/star-11.png")}
                  />
                  <Image
                    style={[styles.frameInner, styles.frameLayout]}
                    contentFit="cover"
                    source={require("../assets/star-11.png")}
                  />
                  <Image
                    style={[styles.frameInner, styles.frameLayout]}
                    contentFit="cover"
                    source={require("../assets/star-11.png")}
                  />
                </View>
                <Text style={[styles.text5, styles.textTypo]}>4.5</Text>
              </View>
              <Text style={[styles.jan, styles.textTypo]}>30 Jan</Text>
              <Text
                style={[styles.ametMinimMollit, styles.ratingPosition]}
              >{`Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet. `}</Text>
            </View>
            <View style={styles.comment2}>
              <Image
                style={styles.imageIcon}
                contentFit="cover"
                source={require("../assets/image3.png")}
              />
              <Text style={[styles.donnaBins, styles.ratingPosition]}>
                Jerome Bell
              </Text>
              <View style={[styles.rating, styles.ratingPosition]}>
                <View style={styles.starParent}>
                  <Image
                    style={styles.frameLayout}
                    contentFit="cover"
                    source={require("../assets/star-11.png")}
                  />
                  <Image
                    style={[styles.frameInner, styles.frameLayout]}
                    contentFit="cover"
                    source={require("../assets/star-11.png")}
                  />
                  <Image
                    style={[styles.frameInner, styles.frameLayout]}
                    contentFit="cover"
                    source={require("../assets/star-11.png")}
                  />
                  <Image
                    style={[styles.frameInner, styles.frameLayout]}
                    contentFit="cover"
                    source={require("../assets/star-11.png")}
                  />
                  <Image
                    style={[styles.frameInner, styles.frameLayout]}
                    contentFit="cover"
                    source={require("../assets/star-11.png")}
                  />
                </View>
                <Text style={[styles.text5, styles.textTypo]}>4.5</Text>
              </View>
              <Text style={[styles.jan, styles.textTypo]}>25 Feb</Text>
              <Text
                style={[styles.ametMinimMollit, styles.ratingPosition]}
              >{`Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet. `}</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#1a244d",
  },
  bodyScrollViewContent: {
    flexDirection: "column",
    paddingTop: 15,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  providerClr: {
    color: Color.m3White,
    textAlign: "left",
  },
  locationWrapperFlexBox: {
    justifyContent: "flex-end",
    alignItems: "center",
  },
  wrapperFlexBox: {
    alignItems: "flex-end",
    justifyContent: "center",
  },
  currentLocationFlexBox: {
    textAlign: "right",
    color: Color.m3White,
    flex: 1,
  },
  countersSpaceBlock: {
    paddingHorizontal: Padding.p_3xs,
    paddingVertical: 0,
    alignItems: "center",
  },
  searchBorder: {
    borderWidth: 1,
    borderStyle: "solid",
    justifyContent: "center",
    alignItems: "center",
  },
  searchBarSpaceBlock: {
    marginTop: 5,
    flexDirection: "row",
  },
  serbisyouTypo: {
    fontFamily: FontFamily.title2Bold32,
    fontWeight: "700",
    flex: 1,
  },
  searchWhatYouTypo: {
    fontFamily: FontFamily.level2Medium12,
    fontWeight: "500",
  },
  view2SpaceBlock: {
    marginTop: 20,
    alignSelf: "stretch",
  },
  totalBorder: {
    paddingVertical: Padding.p_xl,
    paddingHorizontal: Padding.p_mini,
    borderColor: Color.colorGray_600,
    borderRadius: Border.br_8xs,
    borderWidth: 1,
    borderStyle: "solid",
    flexDirection: "row",
    flex: 1,
  },
  iconLayout1: {
    height: 35,
    width: 35,
  },
  totalEarning2Typo: {
    marginTop: 10,
    color: Color.bg,
    fontFamily: FontFamily.workSansMedium,
    fontSize: FontSize.level2Medium12_size,
    textTransform: "capitalize",
    fontWeight: "500",
    textAlign: "left",
  },
  reviews2Typo: {
    color: Color.black,
    fontFamily: FontFamily.workSansMedium,
    textTransform: "capitalize",
    fontWeight: "500",
    textAlign: "left",
  },
  textTypo: {
    color: Color.bg,
    fontFamily: FontFamily.workSansMedium,
    fontWeight: "500",
    textAlign: "left",
  },
  ratingPosition: {
    left: 66,
    position: "absolute",
  },
  frameLayout: {
    height: 16,
    width: 16,
    borderRadius: Border.br_12xs,
  },
  reviews1FlexBox: {
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    alignSelf: "stretch",
  },
  iconContainerFlexBox: {
    borderRadius: Border.br_base,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
  labelTypo: {
    marginTop: 4,
    textAlign: "center",
    fontFamily: FontFamily.robotoMedium,
    lineHeight: 16,
    letterSpacing: 1,
    fontSize: FontSize.level2Medium12_size,
    fontWeight: "500",
    alignSelf: "stretch",
  },
  segmentSpaceBlock: {
    paddingBottom: Padding.p_base,
    paddingTop: Padding.p_xs,
    width: 90,
    justifyContent: "center",
    alignItems: "center",
  },
  iconLayout: {
    height: 30,
    width: 26,
    overflow: "hidden",
  },
  helloMike: {
    letterSpacing: 2,
    lineHeight: 26,
    fontFamily: FontFamily.levelSemibold14,
    color: "#666c89",
    fontWeight: "600",
    fontSize: FontSize.levelSemibold14_size,
    textTransform: "uppercase",
    textAlign: "left",
    alignSelf: "stretch",
  },
  topContent: {
    alignSelf: "stretch",
  },
  goodMorning: {
    fontSize: FontSize.title2Bold32_size,
    letterSpacing: -1,
    lineHeight: 41,
    color: "#172b4d",
    textAlign: "left",
  },
  goodMorningWrapper: {
    flexDirection: "row",
    flex: 1,
  },
  toggleSwitch: {
    width: 36,
    height: 20,
  },
  toggleSwitchWrapper: {
    padding: Padding.p_8xs,
    justifyContent: "center",
  },
  frameWrapper: {
    paddingHorizontal: Padding.p_10xs,
    paddingVertical: Padding.p_8xs,
    marginLeft: 10,
    justifyContent: "center",
  },
  frameGroup: {
    paddingHorizontal: Padding.p_xs,
    paddingVertical: 0,
    alignSelf: "stretch",
  },
  searchWhatYou: {
    letterSpacing: -0.1,
    lineHeight: 18,
    color: "#9b9e9f",
    display: "none",
    fontSize: FontSize.typographyTaglineSmallRegular_size,
    textAlign: "left",
  },
  searchBarChild: {
    width: 32,
    marginLeft: 102,
    height: 32,
    display: "none",
  },
  searchBar: {
    borderRadius: Border.br_3xs,
    backgroundColor: Color.colorDarkslategray_600,
    borderColor: "#f2f2f2",
    width: 312,
    paddingHorizontal: Padding.p_smi,
    paddingVertical: Padding.p_4xs,
    display: "none",
    height: 50,
    borderWidth: 1,
    borderStyle: "solid",
    justifyContent: "center",
    alignItems: "center",
  },
  componentsintroSearch: {
    borderRadius: Border.br_5xs,
    shadowColor: "rgba(0, 0, 0, 0.25)",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowRadius: 4,
    elevation: 4,
    shadowOpacity: 1,
    borderColor: Color.lightLabelPrimary,
    padding: Padding.p_3xs,
    alignSelf: "stretch",
    backgroundColor: Color.m3White,
  },
  helloUser: {
    paddingVertical: 0,
    justifyContent: "center",
    alignSelf: "stretch",
  },
  text: {
    fontSize: FontSize.size_3xl,
    lineHeight: 22,
    fontFamily: FontFamily.workSansSemiBold,
    color: Color.colorSteelblue,
    textTransform: "capitalize",
    fontWeight: "600",
    textAlign: "left",
  },
  icon: {
    marginLeft: 16,
  },
  totalEarning: {
    backgroundColor: Color.m3White,
  },
  icon1: {
    marginLeft: 17,
  },
  totalService: {
    marginLeft: 28,
    backgroundColor: Color.m3White,
  },
  serbisyouWrapper: {
    flexDirection: "row",
    alignSelf: "stretch",
  },
  upcomingServices: {
    width: 63,
  },
  icon2: {
    marginLeft: 29,
  },
  icon3: {
    marginLeft: 49,
  },
  view2: {
    flexDirection: "row",
  },
  counters: {
    paddingVertical: 0,
    paddingHorizontal: Padding.p_3xs,
    alignItems: "center",
  },
  reviews2: {
    fontSize: FontSize.bodyLgBodyLgRegular_size,
  },
  viewAll: {
    fontSize: FontSize.level2Medium12_size,
    fontFamily: FontFamily.workSansMedium,
  },
  imageIcon: {
    left: 0,
    width: 50,
    top: 0,
    position: "absolute",
    height: 50,
  },
  donnaBins: {
    top: 0,
    color: Color.black,
    fontFamily: FontFamily.workSansMedium,
    textTransform: "capitalize",
    fontWeight: "500",
    textAlign: "left",
    fontSize: FontSize.levelSemibold14_size,
  },
  frameInner: {
    marginLeft: 1,
  },
  starParent: {
    flexDirection: "row",
  },
  text4: {
    marginLeft: 4,
    fontSize: FontSize.levelSemibold14_size,
  },
  rating: {
    top: 24,
    alignItems: "center",
    flexDirection: "row",
  },
  dec: {
    top: 1,
    left: 294,
    position: "absolute",
    fontSize: FontSize.level2Medium12_size,
    fontFamily: FontFamily.workSansMedium,
  },
  ametMinimMollit: {
    top: 56,
    width: 268,
    color: Color.bg,
    fontFamily: FontFamily.workSansMedium,
    fontWeight: "500",
    textAlign: "left",
    fontSize: FontSize.levelSemibold14_size,
    lineHeight: 20,
  },
  comment1: {
    width: 335,
    height: 96,
  },
  text5: {
    marginLeft: 8,
    fontSize: FontSize.levelSemibold14_size,
  },
  jan: {
    left: 293,
    top: 0,
    position: "absolute",
    fontSize: FontSize.level2Medium12_size,
    fontFamily: FontFamily.workSansMedium,
  },
  comment2: {
    width: 334,
    marginTop: 24,
    height: 96,
  },
  comments: {
    marginTop: 16,
    alignItems: "center",
    alignSelf: "stretch",
  },
  body: {
    alignSelf: "stretch",
    flex: 1,
    backgroundColor: Color.m3White,
  },
  homepage: {
    width: "100%",
    height: 812,
    flex: 1,
    backgroundColor: Color.m3White,
  },
});

export default Homepage;
