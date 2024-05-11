import React, { useState, useEffect, useCallback} from "react";
import {
  StatusBar,
  StyleSheet,
  Pressable,
  View,
  Text,
  ScrollView,
  Modal,
  Linking,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { useNavigation } from "@react-navigation/native";
import { Color, Padding, FontFamily, FontSize, Border } from "../GlobalStyles";
import {
  getFirestore,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore"; // Updated imports
import { getAuth, onAuthStateChanged, updateEmail } from "firebase/auth";
import PerformServicePrompt from "../components/PerformServicePrompt";

const PerformTheService = ({route}) => {
  const navigation = useNavigation();

  const {itemID, matchedBookingID, customerUID} = route.params;
  const [bookingName, setBookingName] = useState("");
  const [bookingPropertyType, setBookingPropertyType] = useState("");
  const [bookingTitle, setBookingTitle] = useState("");
  const [bookingCategory, setBookingCategory] = useState("");
  const [bookingServices, setBookingServices] = useState([]);
  const [bookingPaymentMethod, setBookingPaymentMethod] = useState("");
  const [bookingTotal, setBookingTotal] = useState("");

  const [phoneUser, setphoneUser] = useState("");

  const [cancelModalVisible, setcancelModalVisible] = useState(false);
  const [serviceBtn, setServiceBtn] = useState(true);

  const openCancelModal = useCallback(() => {
    // setcancelModalVisible(true);
  }, []);

  const closeCancelModal = useCallback(() => {
    // setcancelModalVisible(false);
  }, []);

  const serviceInProgress = useCallback(() => {
    // setcancelModalVisible(false);
    // setServiceBtn(false);
  }, []);

  // useEffect(() => {
  //   async function fetchData() {
  //     try {
  //       const db = getFirestore(); // Use getFirestore() to initialize Firestore
  
  //       // Get the user's UID 
  //       const auth = getAuth();
  //       const providerUID = auth.currentUser.uid;
  //       console.log("Provider UID: " ,providerUID);
  //       console.log("Item Id: ", itemID);

  //       const userBookingDocRef = doc(db, "providerProfiles", providerUID, "activeBookings", itemID);
  //       const docSnapshot = await getDoc(userBookingDocRef);

  //       if (docSnapshot.exists()) {
  //         const booking = docSnapshot.data();
  //         console.log("Booking Data: ", booking);
  //         const servicesData = booking.service.map((doc) => doc);
  //         console.log("Data Services: " ,servicesData);
  //         setBookingName(booking.name);
  //         setBookingPropertyType(booking.propertyType);
  //         setBookingTitle(booking.title);
  //         setBookingCategory(booking.category);
  //         setBookingServices(booking.service);
  //         setBookingPaymentMethod(booking.paymentMethod);
  //         setBookingTotal(booking.totalPrice);
  //         setphoneUser(booking.phone);


  //         console.log("Name: " ,bookingName);
  //         console.log("Property Type: " , bookingPropertyType);
  //         console.log("Title: " , bookingTitle);
  //         console.log("Category: " ,bookingCategory);
  //         console.log("Services: " , bookingServices);
  //         console.log("Payment Method: " , bookingPaymentMethod);
  //         console.log("Total: " , bookingTotal);

  //       } else {
  //         console.log("No such document!");
  //       }
  //     } catch (error) {
  //       // console.error("Error retrieving data:", error);
  //     }
  //   }
  
  //   fetchData(); // Call the fetchData function immediately
  // }, []); 

  const getFormattedServiceName = () => {
    if (!bookingTitle || !bookingCategory) {
      return 'Service'; // Default text or handle as needed
    }

    // Check if the title is "Pet Care" or "Gardening"
    if (bookingTitle === "Pet Care" || bookingTitle === "Gardening" || bookingTitle === "Cleaning") {
      return bookingCategory;
    } else {
      // If not, concatenate the title and category
      return `${bookingTitle} ${bookingCategory}`;
    }
  };

  const getPaymentMethodText = (bookingPaymentMethod) => {
    return bookingPaymentMethod === "Cash" ? "Collect Cash" : `Paid via ${bookingPaymentMethod}`;
  };

  // const getServiceImageSource = (category, service) => {
  //   if(category === "Plumbing") {
  //     switch (service) {
  //       case "Installation":
  //         return require("../assets/plumbing-installation.png");
  //       case "Repairs/Replacement":
  //         return require("../assets/plumbing-repair.png");
  //       default:
  //         return require("../assets/plumbing-installation.png");
  //     }
  //   }else if(category === "Electrical") {
  //     switch (service) {
  //       case "Installation":
  //         return require("../assets/electrical-installation.png");
  //       case "Repairs/Replacement":
  //         return require("../assets/electrical-repair.png");
  //       default:
  //         return require("../assets/electrical-installation.png");
  //     }
  //   }else if(category === "Carpentry") {
  //     switch (service) {
  //       case "Installation":
  //         return require("../assets/carpentry-installation.png");
  //       case "Repairs/Replacement":
  //         return require("../assets/carpentry-repair.png");
  //       case "Furniture Assembly And Disassembly":
  //         return require("../assets/furniture-assembly-and-disassembly.png");
  //       default:
  //         return require("../assets/carpentry-installation.png");
  //     }
  //   }else if(category === "Cleaning" || category === "Pet Care" || category === "Gardening"){
  //     switch (service) {
  //       case "Standard Cleaning":
  //         return require("../assets/standard-cleaning.png");
  //       case "Deep Cleaning":
  //         return require("../assets/deep-cleaning.png");
  //       case "Electronic Appliance Cleaning":
  //         return require("../assets/electronic-appliance-cleaning.png");
  //       case "Pest Control":
  //         return require("../assets/pest-control.png");
  //       case "Dog Training":
  //         return require("../assets/dog-training.png");
  //       case "Dog Pet Grooming":
  //         return require("../assets/pet-grooming.png");
  //       case "Cat Pet Grooming":
  //         return require("../assets/pet-grooming.png");
  //       case "Bird Pet Grooming":
  //         return require("../assets/pet-grooming.png");
  //       case "Rabbit Pet Grooming":
  //         return require("../assets/pet-grooming.png");
  //       case "Dog Pet Sitting":
  //         return require("../assets/pet-sitting.png");
  //       case "Cat Pet Sitting":
  //         return require("../assets/pet-sitting.png");
  //       case "Bird Pet Sitting":
  //         return require("../assets/pet-sitting.png");
  //       case "Rabbit Pet Sitting":
  //         return require("../assets/pet-sitting.png");
  //       case "Garden Maintenance":
  //         return require("../assets/garden-maintenance.png");
  //       case "Landscape Design and Planning":
  //         return require("../assets/landscape-design-and-planning.png");
  //       case "Irrigation System Installation/Repairs":
  //         return require("../assets/irrigation-system.png");
  //       case "Pest and Disease Management":
  //         return require("../assets/pest-and-disease-management.png");
  //       default:
  //         return require("../assets/standard-cleaning.png");
  //     }
  //   }
  // };

  
  // const handlePerformService = () => {
  //   try {
  //     // const db = getFirestore();
  //     // const auth = getAuth();
  //     // const providerUID = auth.currentUser.uid;
  //     // const userBookingDocRef = doc(db, "providerProfiles", providerUID, "activeBookings", itemID);
  
  //     // Update the status in Firestore
  //     // await updateDoc(userBookingDocRef, {
  //     //   status: "In Transit"
  //     // });
  
  //     // console.log("Status updated to 'In Transit'");
  
  //     // openCancelModal();
  //   } catch (error) {
  //     // console.error("Error updating status:", error);
  //   }
  // };
  // const handleCompletedService = async (itemID) => {
  //   try {
  //     // const db = getFirestore();
  //     // const auth = getAuth();
  //     // const providerUID = auth.currentUser.uid;
  //     // const userBookingDocRef = doc(db, "providerProfiles", providerUID, "activeBookings", itemID);
  
  //     // Update the status in Firestore
  //     // await updateDoc(userBookingDocRef, {
  //     //   status: "In Transit"
  //     // });
  
  //     // console.log("Status updated to 'In Transit'");
  
  //     // Navigate to PerformTheService screen with itemId
  //     // navigation.navigate("ConfirmService", { itemID: itemID, matchedBookingID: matchedBookingID, customerUID: customerUID });
  //   } catch (error) {
  //     // console.error("Error updating status:", error);
  //   }
  // };

  return (
    <View style={styles.performTheService}>
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
          <View style={styles.frameParent}>
            <View
              style={[
                styles.bookingDetailsLabelParent,
                styles.bookingSpaceBlock,
              ]}
            >
              <View style={styles.bookingDetailsLabel}>
                <Text style={styles.serviceDetails}>Service details</Text>
              </View>
              <View style={[styles.bookingDetailsLabel1, styles.frameFlexBox1]}>
                <View style={styles.customerName1Wrapper}>
                  <Text
                    style={[styles.customerName1, styles.customerName1Typo]}
                  >
                    {bookingName}
                  </Text>
                </View>
                <Pressable style={styles.message}               
                  onPress={() => {
                  // Use Linking to open the messaging app with the specified number
                  // Linking.openURL(`sms:${phoneUser}`);
                }}>
                  <Image
                    style={styles.vectorIcon}
                    contentFit="cover"
                    source={require("../assets/vector7.png")}
                  />
                  <Image
                    style={[styles.vectorIcon1, styles.vectorIconPosition]}
                    contentFit="cover"
                    source={require("../assets/vector8.png")}
                  />
                </Pressable>
                <Pressable 
                  style={styles.message}
                  // onPress={() => {Linking.openURL(`tel:${phoneUser}`);}}
                >
                  <Image
                    style={styles.vectorIcon}
                    contentFit="cover"
                    source={require("../assets/vector7.png")}
                  />
                  <Image
                    style={[styles.vectorIcon3, styles.vectorIconPosition]}
                    contentFit="cover"
                    source={require("../assets/vector9.png")}
                  />
                </Pressable>
              </View>
              <View style={[styles.addressFrame, styles.frameFlexBox1]}>
                <View style={styles.gps2Wrapper}>
                  <Image
                    style={styles.gps2Icon}
                    contentFit="cover"
                    source={require("../assets/town.png")}
                  />
                </View>
                <View style={styles.addressFrameInner}>
                  <View style={styles.propertyTypeWrapper}>
                    <Text
                      style={[styles.propertyType, styles.propertyTypeTypo]}
                    >
                      Property Type
                    </Text>
                  </View>
                </View>
                <View style={styles.addressFrameInner}>
                  <View style={styles.frame}>
                    <Text style={[styles.home, styles.homeFlexBox]}>{bookingPropertyType}</Text>
                  </View>
                </View>
              </View>
              <View style={[styles.addressFrame, styles.frameFlexBox1]}>
                <View style={styles.gps2Wrapper}>
                  <View
                    style={[
                      styles.plumbingInstallationPicWrapper,
                      styles.bookingSpaceBlock,
                    ]}
                  >
                    <Image
                      style={styles.plumbingInstallationPic}
                      contentFit="cover"
                      // source={getServiceImageSource(bookingTitle, bookingCategory)}
                    />
                  </View>
                </View>
                <View style={styles.addressFrameInner}>
                  <View style={styles.categoryWrapper}>
                    <Text
                      style={[styles.propertyType, styles.propertyTypeTypo]}
                    >
                      Category
                    </Text>
                  </View>
                </View>
                <View style={styles.frameContainer}>
                  <View style={styles.frame}>
                    <Text style={[styles.home, styles.homeFlexBox]}>
                      {getFormattedServiceName()}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
            <View
              style={[
                styles.bookingDetailsLabelGroup,
                styles.bookingSpaceBlock,
              ]}
            >
              <View style={styles.bookingDetailsLabel}>
                <Text
                  style={[styles.serviceRequests, styles.customerName1Typo]}
                >
                  Service Requests
                </Text>
              </View>
              <View style={styles.frameFlexBox1}>
                {/* <View
                  style={[
                    styles.dateAndTimeFrame,
                    styles.dateAndTimeFrameSpaceBlock,
                  ]}
                >
                  <View style={styles.bookingDetailsLabel}>
                    <View style={styles.frameParent1}>
                      <View style={[styles.frameWrapper1, styles.frameFlexBox]}>
                        <View style={styles.customerName1Wrapper}>
                          <View style={styles.frameWrapper3}>
                            <View style={styles.bookingDetailsLabel}>
                              <Text style={[styles.text, styles.homeTypo]}>
                                2
                              </Text>
                            </View>
                          </View>
                        </View>
                      </View>
                      <View style={styles.frameFrame}>
                        <View style={styles.bookingDetailsLabel}>
                          <Text
                            style={[styles.toiletSystem, styles.septicTankTypo]}
                          >
                            Toilet System
                          </Text>
                        </View>
                      </View>
                    </View>
                    <View style={styles.frameParent2}>
                      <View style={[styles.frameWrapper1, styles.frameFlexBox]}>
                        <View style={styles.customerName1Wrapper}>
                          <View style={styles.frameWrapper3}>
                            <View style={styles.bookingDetailsLabel}>
                              <Text style={[styles.text, styles.homeTypo]}>
                                2
                              </Text>
                            </View>
                          </View>
                        </View>
                      </View>
                      <View style={styles.frameFrame}>
                        <View style={styles.bookingDetailsLabel}>
                          <Text
                            style={[styles.toiletSystem, styles.septicTankTypo]}
                          >
                            Septic Tank Cleaning
                          </Text>
                        </View>
                      </View>
                    </View>
                    <View style={styles.frameParent2}>
                      <View style={[styles.frameWrapper1, styles.frameFlexBox]}>
                        <View style={styles.customerName1Wrapper}>
                          <View style={styles.frameWrapper3}>
                            <View style={styles.bookingDetailsLabel}>
                              <Text style={[styles.text, styles.homeTypo]}>
                                2
                              </Text>
                            </View>
                          </View>
                        </View>
                      </View>
                      <View style={styles.frameWrapper11}>
                        <View style={styles.bookingDetailsLabel}>
                          <Text
                            style={[styles.toiletSystem, styles.septicTankTypo]}
                          >
                            Cage or Habitat Cleaning
                          </Text>
                        </View>
                      </View>
                    </View>
                    <View style={styles.frameParent2}>
                      <View style={[styles.frameWrapper1, styles.frameFlexBox]}>
                        <View style={styles.customerName1Wrapper}>
                          <View style={styles.frameWrapper3}>
                            <View style={styles.bookingDetailsLabel}>
                              <Text style={[styles.text, styles.homeTypo]}>
                                2
                              </Text>
                            </View>
                          </View>
                        </View>
                      </View>
                      <View style={styles.frameFrame}>
                        <View style={styles.bookingDetailsLabel}>
                          <Text
                            style={[styles.toiletSystem, styles.septicTankTypo]}
                          >
                            Toilet System
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                  <View
                    style={[styles.frameWrapper16, styles.frameWrapperFlexBox]}
                  >
                    <View style={styles.frame6}>
                      <Text style={styles.textTypo}>₱2000.00</Text>
                    </View>
                  </View>
                </View> */}
                {bookingServices.map((item, index) => (
                  <View key={index} style={[styles.dateAndTimeFrame1, styles.viewFlexBox]}>
                  <View style={styles.frameWrapper17}>
                    <View style={styles.frame}>
                      <Text style={[styles.septicTank, styles.septicTankTypo]}>
                        {item.name}
                      </Text>
                    </View>
                  </View>
                  <View
                    style={[styles.dateAndTimeFrameInner, styles.frameFlexBox]}
                  >
                    <View style={styles.customerName1Wrapper}>
                      <View style={styles.frameWrapper3}>
                        <View style={styles.bookingDetailsLabel}>
                          <Text style={[styles.text, styles.homeTypo]}>{item.value}</Text>
                        </View>
                      </View>
                    </View>
                  </View>
                </View>
                ))}
                {/* <View style={[styles.dateAndTimeFrame1, styles.viewFlexBox]}>
                  <View style={styles.frameWrapper17}>
                    <View style={styles.frame}>
                      <Text style={[styles.septicTank, styles.septicTankTypo]}>
                        Viral disease mangagement
                      </Text>
                    </View>
                  </View>
                  <View
                    style={[styles.dateAndTimeFrameInner, styles.frameFlexBox]}
                  >
                    <View style={styles.customerName1Wrapper}>
                      <View style={styles.frameWrapper3}>
                        <View style={styles.bookingDetailsLabel}>
                          <Text style={[styles.text, styles.homeTypo]}>1</Text>
                        </View>
                      </View>
                    </View>
                  </View>
                  <View
                    style={[styles.frameWrapper20, styles.frameWrapperFlexBox]}
                  >
                    <View style={styles.frame}>
                      <Text style={[styles.text6, styles.textTypo]}>
                        ₱1500.00
                      </Text>
                    </View>
                  </View>
                </View>
                <View style={[styles.dateAndTimeFrame1, styles.viewFlexBox]}>
                  <View style={styles.frameWrapper17}>
                    <View style={styles.frame}>
                      <Text style={[styles.septicTank, styles.septicTankTypo]}>
                        Cage or habitat cleaning
                      </Text>
                    </View>
                  </View>
                  <View
                    style={[styles.dateAndTimeFrameInner, styles.frameFlexBox]}
                  >
                    <View style={styles.customerName1Wrapper}>
                      <View style={styles.frameWrapper3}>
                        <View style={styles.bookingDetailsLabel}>
                          <Text style={[styles.text, styles.homeTypo]}>1</Text>
                        </View>
                      </View>
                    </View>
                  </View>
                  <View
                    style={[styles.frameWrapper20, styles.frameWrapperFlexBox]}
                  >
                    <View style={styles.frame}>
                      <Text style={[styles.text6, styles.textTypo]}>
                        ₱1500.00
                      </Text>
                    </View>
                  </View>
                </View>
                <View style={[styles.dateAndTimeFrame1, styles.viewFlexBox]}>
                  <View style={styles.frameWrapper17}>
                    <View style={styles.frame}>
                      <Text style={[styles.septicTank, styles.septicTankTypo]}>
                        Septic Tank
                      </Text>
                    </View>
                  </View>
                  <View
                    style={[styles.dateAndTimeFrameInner, styles.frameFlexBox]}
                  >
                    <View style={styles.customerName1Wrapper}>
                      <View style={styles.frameWrapper3}>
                        <View style={styles.bookingDetailsLabel}>
                          <Text style={[styles.text, styles.homeTypo]}>1</Text>
                        </View>
                      </View>
                    </View>
                  </View>
                  <View
                    style={[styles.frameWrapper20, styles.frameWrapperFlexBox]}
                  >
                    <View style={styles.frame}>
                      <Text style={[styles.text6, styles.textTypo]}>
                        ₱1500.00
                      </Text>
                    </View>
                  </View>
                </View>
                <View style={[styles.dateAndTimeFrame1, styles.viewFlexBox]}>
                  <View style={styles.frameWrapper17}>
                    <View style={styles.frame}>
                      <Text style={[styles.septicTank, styles.septicTankTypo]}>
                        Septic Tank
                      </Text>
                    </View>
                  </View>
                  <View
                    style={[styles.dateAndTimeFrameInner, styles.frameFlexBox]}
                  >
                    <View style={styles.customerName1Wrapper}>
                      <View style={styles.frameWrapper3}>
                        <View style={styles.bookingDetailsLabel}>
                          <Text style={[styles.text, styles.homeTypo]}>1</Text>
                        </View>
                      </View>
                    </View>
                  </View>
                  <View
                    style={[styles.frameWrapper20, styles.frameWrapperFlexBox]}
                  >
                    <View style={styles.frame}>
                      <Text style={[styles.text6, styles.textTypo]}>
                        ₱1500.00
                      </Text>
                    </View>
                  </View>
                </View> */}
              </View>
            </View>
            <View
              style={[
                styles.bookingDetailsLabelGroup,
                styles.bookingSpaceBlock,
              ]}
            >
              <View style={styles.bookingDetailsLabel}>
                <Text
                  style={[styles.serviceRequests, styles.customerName1Typo]}
                >
                  Payment
                </Text>
              </View>
              <View
                style={[styles.dateAndTimeFrameWrapper, styles.frameFlexBox1]}
              >
                <View style={styles.bookingDetailsLabel}>
                  <View style={styles.frameWrapper17}>
                    <View style={styles.frame}>
                      <View style={styles.paidViacollectCashWrapper}>
                        <Text
                          style={[
                            styles.paidViacollectCash,
                            styles.propertyTypeTypo,
                          ]}
                        >
                          {getPaymentMethodText(bookingPaymentMethod)}
                        </Text>
                      </View>
                      <View style={[styles.paypalWrapper, styles.innerFlexBox]}>
                        <Text style={[styles.paypal, styles.homeFlexBox]}>
                          {`₱${bookingTotal}`}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
      <View style={[styles.performTheServiceInner, styles.innerFlexBox]}>
        <View style={styles.bookingDetailsLabel}>
          {serviceBtn ? (
            <Pressable
              style={styles.viewTimelineBtn}
              // onPress={() => handlePerformService(itemID)}
            >
              <Text style={[styles.viewAllServices, styles.viewAllServicesTypo]}>
                Perform Service 
              </Text>
            </Pressable>
          ) : (
            <Pressable
              style={styles.viewTimelineBtn}
              // onPress={() => handleCompletedService(itemID)}
            >
              <Text style={[styles.viewAllServices, styles.viewAllServicesTypo]}>
                Service Completed
              </Text>
            </Pressable>
          )}
        </View>
      </View>
      <Modal animationType="fade" transparent visible={cancelModalVisible}>
        <View style={styles.yesBtnOverlay}>
          <Pressable style={styles.yesBtnBg} onPress={closeCancelModal} />
          <PerformServicePrompt onClose={closeCancelModal} itemID={itemID} matchedBookingID={matchedBookingID} customerUID={customerUID} onProgress={serviceInProgress}/>
        </View>
      </Modal>
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
  yesBtnOverlay: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(113, 113, 113, 0.3)",
  },
  yesBtnBg: {
    position: "absolute",
    width: "100%",
    height: "100%",
    left: 0,
    top: 0,
  },
  viewFlexBox: {
    paddingHorizontal: 0,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    alignSelf: "stretch",
  },
  textClr: {
    color: Color.m3White,
    textAlign: "center",
  },
  innerFlexBox: {
    justifyContent: "flex-end",
    alignItems: "center",
  },
  bookingSpaceBlock: {
    padding: Padding.p_8xs,
    justifyContent: "center",
  },
  frameFlexBox1: {
    marginTop: 5,
    justifyContent: "center",
    alignSelf: "stretch",
  },
  customerName1Typo: {
    fontFamily: FontFamily.workSansSemiBold,
    fontWeight: "600",
    display: "flex",
    textAlign: "left",
    color: Color.colorDarkslateblue_100,
    fontSize: FontSize.title3Bold20_size,
    alignItems: "center",
    flex: 1,
  },
  vectorIconPosition: {
    zIndex: 1,
    maxHeight: "100%",
    maxWidth: "100%",
    position: "absolute",
    overflow: "hidden",
  },
  propertyTypeTypo: {
    color: Color.lightLabelPrimary,
    fontFamily: FontFamily.workSansMedium,
    fontWeight: "500",
    fontSize: FontSize.size_lg,
    textAlign: "left",
  },
  homeFlexBox: {
    textAlign: "right",
    color: Color.lightLabelPrimary,
    flex: 1,
  },
  dateAndTimeFrameSpaceBlock: {
    paddingVertical: Padding.p_8xs,
    paddingHorizontal: 0,
    alignItems: "center",
  },
  frameFlexBox: {
    width: 38,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  homeTypo: {
    textTransform: "capitalize",
    fontSize: FontSize.paragraphMedium15_size,
    fontFamily: FontFamily.workSansRegular,
  },
  septicTankTypo: {
    fontFamily: FontFamily.interRegular,
    fontSize: FontSize.levelSemibold14_size,
    textTransform: "capitalize",
    color: Color.lightLabelPrimary,
    flex: 1,
  },
  frameWrapperFlexBox: {
    alignItems: "flex-end",
    width: 68,
    display: "none",
    justifyContent: "center",
  },
  textTypo: {
    color: Color.neutral07,
    lineHeight: 16,
    fontSize: FontSize.level2Medium12_size,
    fontFamily: FontFamily.interRegular,
    textAlign: "right",
    flex: 1,
  },
  viewAllServicesTypo: {
    fontFamily: FontFamily.title2Bold32,
    fontWeight: "700",
    fontSize: FontSize.title3Bold20_size,
    flex: 1,
  },
  serviceDetails: {
    fontSize: FontSize.bodyLgBodyLgRegular_size,
    display: "flex",
    color: Color.colorDarkslateblue_100,
    fontFamily: FontFamily.workSansRegular,
    textAlign: "left",
    alignItems: "center",
    alignSelf: "stretch",
    flex: 1,
  },
  bookingDetailsLabel: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    alignSelf: "stretch",
  },
  customerName1: {
    height: 23,
  },
  customerName1Wrapper: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    flex: 1,
  },
  vectorIcon: {
    width: 23,
    zIndex: 0,
    height: 23,
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
    paddingHorizontal: 0,
    alignItems: "center",
    flexDirection: "row",
  },
  gps2Icon: {
    width: 40,
    height: 40,
  },
  gps2Wrapper: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  propertyType: {
    flex: 1,
  },
  propertyTypeWrapper: {
    width: 148,
    alignItems: "center",
    flexDirection: "row",
  },
  addressFrameInner: {
    marginLeft: 7,
    justifyContent: "center",
    flex: 1,
  },
  home: {
    textTransform: "capitalize",
    fontSize: FontSize.paragraphMedium15_size,
    fontFamily: FontFamily.workSansRegular,
  },
  frame: {
    alignItems: "center",
    flexDirection: "row",
    alignSelf: "stretch",
  },
  addressFrame: {
    alignItems: "center",
    flexDirection: "row",
  },
  plumbingInstallationPic: {
    height: 31,
    width: 30,
  },
  plumbingInstallationPicWrapper: {
    alignItems: "center",
    flexDirection: "row",
  },
  categoryWrapper: {
    width: 88,
    alignItems: "center",
    flexDirection: "row",
  },
  frameContainer: {
    width: 200,
    marginLeft: 7,
    justifyContent: "center",
  },
  bookingDetailsLabelParent: {
    alignSelf: "stretch",
    backgroundColor: Color.m3White,
  },
  serviceRequests: {
    alignSelf: "stretch",
  },
  text: {
    textAlign: "center",
    color: Color.m3White,
  },
  frameWrapper3: {
    borderRadius: Border.br_5xs,
    backgroundColor: Color.colorDarkslateblue_200,
    height: 30,
    width: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  frameWrapper1: {
    paddingHorizontal: Padding.p_9xs,
    paddingVertical: 0,
  },
  toiletSystem: {
    textAlign: "center",
  },
  frameFrame: {
    marginTop: 7,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "stretch",
  },
  frameParent1: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  frameParent2: {
    marginLeft: 7,
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  frameWrapper11: {
    width: 78,
    marginTop: 7,
    justifyContent: "center",
    alignItems: "center",
  },
  frame6: {
    display: "none",
    alignItems: "center",
    flexDirection: "row",
    alignSelf: "stretch",
  },
  frameWrapper16: {
    marginTop: 7,
  },
  dateAndTimeFrame: {
    display: "none",
    justifyContent: "center",
    alignSelf: "stretch",
  },
  septicTank: {
    textAlign: "left",
    fontSize: FontSize.levelSemibold14_size,
  },
  frameWrapper17: {
    justifyContent: "center",
    flex: 1,
  },
  dateAndTimeFrameInner: {
    paddingLeft: Padding.p_9xs,
    marginLeft: 7,
  },
  text6: {
    display: "none",
  },
  frameWrapper20: {
    marginLeft: 7,
  },
  dateAndTimeFrame1: {
    paddingVertical: Padding.p_10xs,
  },
  bookingDetailsLabelGroup: {
    marginTop: 10,
    alignSelf: "stretch",
    backgroundColor: Color.m3White,
  },
  paidViacollectCash: {
    alignSelf: "stretch",
  },
  paidViacollectCashWrapper: {
    alignItems: "center",
    flex: 1,
  },
  paypal: {
    fontFamily: FontFamily.workSansMedium,
    fontWeight: "500",
    fontSize: FontSize.size_lg,
    textAlign: "right",
  },
  paypalWrapper: {
    width: 150,
    flexDirection: "row",
  },
  dateAndTimeFrameWrapper: {
    backgroundColor: Color.m3White,
  },
  frameParent: {
    paddingHorizontal: Padding.p_3xs,
    paddingVertical: 0,
    justifyContent: "center",
    alignSelf: "stretch",
  },
  bodyInner: {
    alignSelf: "stretch",
  },
  body: {
    alignSelf: "stretch",
    flex: 1,
  },
  viewAllServices: {
    letterSpacing: -0.2,
    lineHeight: 24,
    color: Color.neutral01,
    textAlign: "center",
  },
  viewTimelineBtn: {
    borderRadius: Border.br_mini,
    backgroundColor: Color.colorDarkslategray_600,
    padding: Padding.p_xs,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    flex: 1,
  },
  performTheServiceInner: {
    padding: Padding.p_mini,
    alignSelf: "stretch",
    backgroundColor: Color.m3White,
  },
  performTheService: {
    backgroundColor: Color.colorWhitesmoke_200,
    height: 812,
    width: "100%",
    flex: 1,
  },
});

export default PerformTheService;
