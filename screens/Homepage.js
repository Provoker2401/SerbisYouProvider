import React, { useState, useEffect} from "react";
import {
  StatusBar,
  StyleSheet,
  View,
  Text,
  Pressable,
  ScrollView,
  Switch,
  Animated,
  LayoutAnimation,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { Color, Padding, FontFamily, Border, FontSize } from "../GlobalStyles";
import { useNavigation } from "@react-navigation/native";
import { toggleAnimation } from "../animations/toggleAnimation";
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
  query,
  onSnapshot,
} from "firebase/firestore"; // Updated imports
import { getAuth} from "firebase/auth";
import messaging from '@react-native-firebase/messaging';

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

  const [tailoredCategory, setTailoredCategory] = useState(null);

  const [showSubCategory, setShowSubCategory] = useState([]);
  const [arrowCategoryRotation, setArrowCategoryRotation] = useState([]);
  const [arrowSubCategoryRotation, setArrowSubCategoryRotation] = useState([]);
  const [showSubContent, setShowSubContent] = useState([]);

  useEffect(() => {
    const fetchTailoredServices = async () => {
      try {
        const db = getFirestore();
        const auth = getAuth();
        const providerUID = auth.currentUser.uid;

        const q = query(collection(db, "providerProfiles", providerUID, "appForm3" ));
        const querySnapshot = await getDocs(q);

        let bookings;

        // Check if there are at least two documents
        if (querySnapshot.size <= 2) {
          // Get the second document (index 1 since arrays are 0-based)
          const secondDocumentSnapshot = querySnapshot.docs[1];

          // Get the data of the second document
          const secondDocumentData = secondDocumentSnapshot.data();

          bookings = secondDocumentData;
        } else {
          console.log("There are not enough documents in appForm3 subcollection.");
        }
        setTailoredCategory(bookings);

        const authStatus = await messaging().requestPermission();
        const enabled =
          authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
          authStatus === messaging.AuthorizationStatus.PROVISIONAL;
    
        if (enabled) {
          console.log("Authorization status:", authStatus);
        }
      } catch (error) {
        // Handle errors, e.g., permission issues
        console.log("Error fetching active bookings: ", error);
        return [];
      }
    };
    
    fetchTailoredServices();
  }, []);

  useEffect(() => {
    if (tailoredCategory) {
      setShowSubCategory(Array(Object.keys(tailoredCategory).length).fill(false));
      // Initialize arrowRotations with animated values
      const initialCategoryRotations = Array(Object.keys(tailoredCategory).length).fill(0).map(() => new Animated.Value(0));
      setArrowCategoryRotation(initialCategoryRotations);

      setShowSubContent(
        Object.values(tailoredCategory).map((services) =>
          Array(Object.keys(services).length).fill(false)
        )
      );
      const initialSubCategoryRotations = Object.values(tailoredCategory).map((services) =>
        Array(Object.keys(services).length).fill(0).map(() => new Animated.Value(0))
      );
      setArrowSubCategoryRotation(initialSubCategoryRotations);
    }
  }, [tailoredCategory]);

  const toggleCategory = (index) => {
    const newShowContent = [...showSubCategory];
    newShowContent[index] = !newShowContent[index];
    setShowSubCategory(newShowContent);

    const newArrowRotations = [...arrowCategoryRotation];
    Animated.timing(newArrowRotations[index], {
      toValue: newShowContent[index] ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
    LayoutAnimation.configureNext(toggleAnimation);
    setArrowCategoryRotation(newArrowRotations);
  };

  const toggleSubCategory = (index, subIndex) => {
    const newShowSubContent = [...showSubContent];
    newShowSubContent[index][subIndex] = !newShowSubContent[index][subIndex];
    setShowSubContent(newShowSubContent);

    const newSubArrowRotations = [...arrowSubCategoryRotation];
    Animated.timing(newSubArrowRotations[index][subIndex], {
      toValue: newShowSubContent[index][subIndex] ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
    LayoutAnimation.configureNext(toggleAnimation);
    setArrowSubCategoryRotation(newSubArrowRotations);
  };

  const arrowCategoryRotate = (index) => {
    if (!arrowCategoryRotation[index]) return '0deg'; // Check if arrowRotations[index] is defined
    return arrowCategoryRotation[index].interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '90deg'],
    });
  };

  const subCategoryArrowRotate = (index, subIndex) => {
    if (!arrowSubCategoryRotation[index] || !arrowSubCategoryRotation[index][subIndex]) return '0deg';
    return arrowSubCategoryRotation[index][subIndex].interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '90deg'],
    });
  };

  const getCategoryImageSource = (category) => {
    switch (category) {
      case "Plumbing":
        return require("../assets/plumbing.png");
      case "Carpentry":
        return require("../assets/carpentry.png");
      case "Pet Care":
        return require("../assets/pet-care.png");
      case "Electrical":
        return require("../assets/electrical.png");
      case "Gardening":
        return require("../assets/gardening.png");
      case "Cleaning":
        return require("../assets/cleaning-category.png");
      default:
        return require("../assets/cleaning-category.png");
    }
  };
  
  const getServiceImageSource = (category, service) => {
    if(category === "Plumbing") {
      switch (service) {
        case "Installation":
          return require("../assets/plumbing-installation.png");
        case "Repairs/Replacement":
          return require("../assets/plumbing-repair.png");
        default:
          return require("../assets/plumbing-installation.png");
      }
    }else if(category === "Electrical") {
      switch (service) {
        case "Installation":
          return require("../assets/electrical-installation.png");
        case "Repairs/Replacement":
          return require("../assets/electrical-repair.png");
        default:
          return require("../assets/electrical-installation.png");
      }
    }else if(category === "Carpentry") {
      switch (service) {
        case "Installation":
          return require("../assets/carpentry-installation.png");
        case "Repairs/Replacement":
          return require("../assets/carpentry-repair.png");
        case "Furniture Assembly And Disassembly":
          return require("../assets/furniture-assembly-and-disassembly.png");
        default:
          return require("../assets/carpentry-installation.png");
      }
    }else if(category === "Cleaning" || category === "Pet Care" || category === "Gardening"){
      switch (service) {
        case "Standard Cleaning":
          return require("../assets/standard-cleaning.png");
        case "Deep Cleaning":
          return require("../assets/deep-cleaning.png");
        case "Electronic Appliance Cleaning":
          return require("../assets/electronic-appliance-cleaning.png");
        case "Pest Control":
          return require("../assets/pest-control.png");
        case "Dog Training":
          return require("../assets/dog-training.png");
        case "Pet Grooming":
          return require("../assets/pet-grooming.png");
        case "Pet Sitting":
          return require("../assets/pet-sitting.png");
        case "Garden Maintenance":
          return require("../assets/garden-maintenance.png");
        case "Landscape Design and Planning":
          return require("../assets/landscape-design-and-planning.png");
        case "Irrigation System Installation/Repairs":
          return require("../assets/irrigation-system.png");
        case "Pest and Disease Management":
          return require("../assets/pest-and-disease-management.png");
        default:
          return require("../assets/standard-cleaning.png");
      }
    }
  };

  // Render the activeBookings
  const renderTailoredServices = () => {
    if (!tailoredCategory) {
      return <Text>Loading...</Text>; // or any loading indicator
    }

    // Check if tailoredCategory is an array and has items before mapping
    if (Object.keys(tailoredCategory).length === 0) {
      return <Text>No tailored services available</Text>; // Or any other placeholder
    }
    console.log("renderTailoredServices" , tailoredCategory);
    
    return (
      <SafeAreaView style={styles.comment1Parent}>
        {Object.entries(tailoredCategory).map(([category, services], index) => (
          <View key={category} style={styles.verticalGap}>
            <Pressable style={styles.comment1} onPress={() => toggleCategory(index)}>
              <View style={styles.collapseArrowWrapper}>
                <Animated.Image
                  style={[
                    styles.collapseArrowIcon,
                    {
                      transform: [
                        { 
                          rotate: arrowCategoryRotate(index)
                        },
                      ],
                  }]}
                  contentFit="cover"
                  source={require("../assets/collapse-arrow3.png")}
                />
              </View>
              <View style={styles.cleaningCategory}>
                <Image
                  style={styles.cleaningCategoryIcon}
                  contentFit="cover"
                  source={getCategoryImageSource(category)}
                />
              </View>
              <View style={styles.cleaningWrapper}>
                <Text style={styles.cleaningTypo}>
                  <Text style={styles.cleaning1Typo}>{category}</Text>
                  <Text style={styles.text4}>{` `}</Text>
                </Text>
              </View>
            </Pressable>
            {showSubCategory[index] && (
              Object.entries(services).map(([service, bookings] , subIndex) => (
                <View key={service} style={styles.comment5Parent}>
                  <Pressable style={styles.commentFlexBox2} onPress={() => toggleSubCategory(index, subIndex)}>
                    <View style={styles.collapseArrowWrapper}>
                      <Animated.Image
                        style={[
                          styles.collapseArrowIcon,
                          {
                            transform: [
                              { 
                                rotate: subCategoryArrowRotate(index, subIndex)
                              },
                            ],
                        }]}
                        contentFit="cover"
                        source={require("../assets/collapse-arrow3.png")}
                      />
                    </View>
                    <View style={styles.comment5Inner}>
                      <Image
                        style={styles.cleaningCategoryIcon}
                        contentFit="cover"
                        source={getServiceImageSource(category, service)}
                      />
                    </View>
                    <View style={styles.standardCleaningWrapper}>
                      <Text
                        style={[styles.standardCleaning, styles.cleaningTypo1]}
                      >{service}</Text>
                    </View>
                  </Pressable>
                  {showSubContent[index][subIndex] && (
                    bookings.map((homeService, itemIndex) => (
                      <View key={itemIndex} style={styles.comment6Parent}>
                        <View style={styles.commentFlexBox1}>
                          <Image
                            style={styles.frameIcon}
                            contentFit="cover"
                            source={require("../assets/bulletFrame.png")}
                          />
                          <View style={styles.livingRoomWrapper}>
                            <Text style={[styles.livingRoom, styles.cleaningTypo2]}>
                              {homeService}
                            </Text>
                          </View>
                        </View>
                      </View>
                    ))
                  )}
                </View>
              ))
            )}
          </View>
        ))}
      </SafeAreaView>
      )
  };

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

            // Filter documents with status Upcoming
            const filteredTotalServices = querySnapshot.docs.filter(
              (doc) => {
                const status = doc.data().status;
                return status === "Completed" || status === "Canceled";
              }
            );

            const numberOfTotalServices = filteredTotalServices.length;

            setTotalHistory(numberOfTotalServices);
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

  // useEffect(() => {
  //   async function fetchData() {
  //     try {
  //       if (isAcceptOrdersEnabled && bookingAccepted) {
  //         // Check if the switch is turned on
  //         const db = getFirestore();
  //         const auth = getAuth();
  //         const user = auth.currentUser;
  //         const userUID = auth.currentUser.uid;

  //         const serviceBookingsCollection = collection(db, "serviceBookings");
  //         const providerProfilesCollection = doc(
  //           db,
  //           "providerProfiles",
  //           userUID
  //         );

  //         getDoc(providerProfilesCollection)
  //           .then(async (docSnapshot) => {
  //             if (docSnapshot.exists()) {
  //               const providerData = docSnapshot.data();
  //               const coordinates = providerData.coordinates;

  //               console.log("Provider data: ", providerData);
  //               console.log("Provider Coordinates: ", coordinates);
  //               console.log(
  //                 "Provider Coordinates Latitude: ",
  //                 coordinates.latitude
  //               );
  //               console.log(
  //                 "Provider Coordinates Latitude: ",
  //                 coordinates.longitude
  //               );
  //               if (providerData.bookingMatched == true) {
  //                 if (providerData.bookingID != null) {
  //                   const q = query(serviceBookingsCollection);

  //                   const querySnapshot = await getDocs(q);

  //                   if (!querySnapshot.empty) {
  //                     // doc.data() is never undefined for query doc snapshots
  //                     // console.log(doc.id, " => ", doc.data());
  //                     querySnapshot.forEach((doc) => {
  //                       // Access data of the document using .data()
  //                       const bookingData = doc.data();
  //                       const id = doc.id;

  //                       // Access specific fields like "name"
  //                       const name = bookingData.name;
  //                       const accepted = bookingData.bookingAccepted;
  //                       const assigned = bookingData.bookingAssigned;
  //                       console.log("Booking Data: ", bookingData);
  //                       console.log(
  //                         "user Booking ID: ",
  //                         providerData.bookingID
  //                       );
  //                       console.log("ID: ", id);

  //                       const latitude = parseFloat(coordinates.latitude);
  //                       const longitude = parseFloat(coordinates.longitude);

  //                       if (id == providerData.bookingID) {
  //                         console.log("ID: ", id);
  //                         console.log("Name: ", name);
  //                         navigation.navigate("NewBooking", {
  //                           name: name,
  //                           userBookingID: id,
  //                           matchedBookingID: providerData.bookingID,
  //                           bookingIndex: providerData.bookingIndex,
  //                           providerCoordinates: {
  //                             latitude: latitude,
  //                             longitude: longitude,
  //                           },
  //                         });
  //                       }
  //                       // if(!assigned){
  //                       //   console.log("ID: ", id);
  //                       //   console.log("Name: ", name);
  //                       //   navigation.navigate("NewBooking", {
  //                       //     name: name,
  //                       //     userID: id,
  //                       //   });

  //                       // }
  //                     });
  //                   } else {
  //                     console.log("The 'serviceBookings' collection is empty.");
  //                   }
  //                 } else {
  //                   console.log("No booking ID found!");
  //                 }
  //               } else {
  //                 console.log("No booking matched!");
  //               }
  //             } else {
  //               console.log("No such document!");
  //             }
  //           })
  //           .catch((error) => {
  //             console.error("Error getting document:", error);
  //           })
  //           .finally(() => {
  //             // Set loading to false when data fetching is complete
  //             setLoading(false);
  //           });
  //       } else {
  //         console.log("The 'bookingAssigned' collection is empty.");
  //       }
  //     } catch (error) {
  //       console.error("Error retrieving data:", error);
  //     }
  //   }

  //   fetchData(); // Call the fetchData function immediately
  // }, [isAcceptOrdersEnabled]); // Add isAcceptOrdersEnabled as a dependency

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
                source={require("../assets/icon14.png")}
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
        <View style={[styles.counters, styles.view2SpaceBlock2]}>
          <View style={styles.reviews1FlexBox}>
            <Text style={[styles.tailoredServices, styles.textText]}>
              TAILORED SERVICES
            </Text>
          </View>
          <View style={styles.comments}>
            {tailoredCategory !== null ? (
              renderTailoredServices()
            ) : (
              <Text>No tailored services found.</Text>
            )}
          </View>
        
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  locationWrapperFlexBox: {
    justifyContent: "flex-end",
    alignItems: "center",
    flexDirection: "row",
  },
  helloMikeTypo: {
    fontFamily: FontFamily.levelSemibold14,
    fontWeight: "600",
  },
  cleaning1Typo: {
    fontFamily: FontFamily.title2Bold32,
    fontWeight: "700",
  },
  livingRoomTypo: {
    fontFamily: FontFamily.level2Medium12,
    fontWeight: "500",
  },
  textText: {
    textAlign: "center",
    flex: 1,
  },
  cleaningTypo: {
    color: Color.colorGray_400,
    lineHeight: 22,
    fontSize: FontSize.title3Bold20_size,
    textAlign: "left",
    flex: 1,
  },
  cleaningTypo1: {
    color: Color.colorGray_400,
    lineHeight: 22,
    fontSize: FontSize.bodyLgBodyLgRegular_size,
    textAlign: "left",
    flex: 1,
  },
  cleaningTypo2: {
    color: Color.colorGray_400,
    lineHeight: 22,
    fontSize: FontSize.bodyLgBodyLgRegular_size,
    textAlign: "left",
    flex: 1,
  },
  commentFlexBox1: {
    paddingLeft: 95,
    overflow: "hidden",
    alignItems: "center",
    flexDirection: "row",
    alignSelf: "stretch",
  },
  commentFlexBox2: {
    paddingLeft: 20,
    overflow: "hidden",
    alignItems: "center",
    flexDirection: "row",
    alignSelf: "stretch",
  },
  commentFlexBox: {
    paddingLeft: 105,
    overflow: "hidden",
    alignItems: "center",
    flexDirection: "row",
    alignSelf: "stretch",
  },
  collapseIconLayout: {
    height: 14,
    width: 30,
  },
  iconLayout: {
    width: 26,
    height: 30,
    overflow: "hidden",
  },
  helloMike: {
    fontSize: FontSize.levelSemibold14_size,
    letterSpacing: 2,
    lineHeight: 26,
    color: "#666c89",
    textTransform: "uppercase",
    textAlign: "left",
    alignSelf: "stretch",
  },
  goodMorning: {
    fontSize: FontSize.title2Bold32_size,
    letterSpacing: -1,
    lineHeight: 41,
    color: "#172b4d",
    textAlign: "left",
    flex: 1,
  },
  frameGroup: {
    paddingHorizontal: Padding.p_xs,
    marginTop: 5,
    paddingVertical: 0,
    flexDirection: "row",
    alignSelf: "stretch",
  },
  totalEarning2: {
    marginTop: 10,
  },
  upcomingServices: {
    marginTop: 10,
    width: 63,
  },
  tailoredServices: {
    // fontFamily: FontFamily.workSansExtraBold,
    fontFamily: FontFamily.title2Bold32,
    color: Color.black,
    fontWeight: "600",
    fontSize: FontSize.size_11xl,
  },
  collapseArrowIcon: {
    height: 30,
    width: 14,
  },
  collapseArrowWrapper: {
    alignItems: "center",
    flexDirection: "row",
  },
  cleaningCategoryIcon: {
    width: 40,
    height: 44,
  },
  cleaningCategory: {
    marginLeft: 10,
    alignItems: "center",
  },
  text4: {
    fontFamily: FontFamily.interExtraBold,
    fontWeight: "800",
  },
  cleaningWrapper: {
    paddingLeft: Padding.p_3xs,
    marginLeft: 10,
    alignItems: "center",
    flexDirection: "row",
    flex: 1,
  },
  comment1: {
    overflow: "hidden",
    alignItems: "center",
    flexDirection: "row",
    alignSelf: "stretch",
  },
  comment5Inner: {
    marginLeft: 10,
    alignItems: "center",
    flexDirection: "row",
  },
  standardCleaning: {
    fontFamily: FontFamily.levelSemibold14,
    fontWeight: "600",
  },
  standardCleaningWrapper: {
    marginLeft: 10,
    alignItems: "center",
    flexDirection: "row",
    flex: 1,
  },
  frameIcon: {
    width: 15,
    height: 15,
    overflow: "hidden",
  },
  livingRoom: {
    fontFamily: FontFamily.level2Medium12,
    fontWeight: "500",
  },
  livingRoomWrapper: {
    paddingLeft: Padding.p_8xs,
    marginLeft: 5,
    alignItems: "center",
    flexDirection: "row",
    flex: 1,
  },
  comment9: {
    marginTop: 2,
  },
  comment6Parent: {
    marginTop: 10,
    alignItems: "center",
    alignSelf: "stretch",
  },
  electronicApplianceCleaning: {
    height: 40,
    width: 40,
  },
  comment7: {
    marginTop: 10,
  },
  pestControlPic: {
    height: 40,
    width: 35,
  },
  pestControlPicWrapper: {
    marginLeft: 10,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  pestControlWrapper: {
    paddingLeft: Padding.p_sm,
    marginLeft: 10,
    alignItems: "center",
    flexDirection: "row",
    flex: 1,
  },
  comment5Parent: {
    marginTop: 5,
    alignItems: "center",
    alignSelf: "stretch",
  },
  comment1Parent: {
    alignItems: "left",
    alignSelf: "stretch",
  },
  comment91: {
    marginTop: 2,
  },
  collapseArrowIcon7: {
    transform: [
      {
        rotate: "-180deg",
      },
    ],
  },
  collapseArrowWrapper4: {
    transform: [
      {
        rotate: "-180deg",
      },
    ],
    alignItems: "center",
    flexDirection: "row",
  },



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
  view2SpaceBlock: {
    marginTop: 20,
    alignSelf: "stretch",
  },
  view2SpaceBlock2: {
    marginTop: 10,
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
  topContent: {
    alignSelf: "stretch",
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
  verticalGap: {
    marginBottom: 10,
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

  icon2: {
    marginLeft: 29,
  },
  icon3: {
    marginLeft: 56,
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
    marginTop: 8,
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
