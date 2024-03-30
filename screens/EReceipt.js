import * as React from "react";
import {
  StatusBar,
  StyleSheet,
  Pressable,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Animated,
  LayoutAnimation,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { FontFamily, Padding, FontSize, Color, Border } from "../GlobalStyles";
import { useState, useCallback, useRef, useEffect } from "react";
//import { useReviewSummaryContext } from "../ReviewSummaryContext";
import { toggleAnimation } from "../animations/toggleAnimation";
import {
  getFirestore,
  doc,
  getDoc,
} from "firebase/firestore"; // Updated imports
import { getAuth, onAuthStateChanged, updateEmail } from "firebase/auth";
import * as Clipboard from "expo-clipboard";

const EReceipt = ({ route }) => {
  const { id } = route.params;

  console.log("Booking Data:", id);

  const animationController = useRef(new Animated.Value(0)).current;
  const [showContent, setShowContent] = useState(false);
  const [loading, setLoading] = useState(false); // Set to true initially, assuming you want to show the loading indicator on component mount

  const toggleListItem = () => {
    const config = {
      duration: 300,
      toValue: showContent ? 0 : 1,
      useNativeDriver: true,
    };
    Animated.timing(animationController, config).start();
    LayoutAnimation.configureNext(toggleAnimation);
    setShowContent(!showContent);
  };

  const arrowTransform = animationController.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });

  const [customerName, setCustomerName] = useState("");
  const [serviceTitle, setServiceTitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [address, setAddress] = useState("");
  const [category, setCategory] = useState("");
  const [subtotal, setSubTotal] = useState("");
  const [distanceFee, setDistanceFee] = useState("");
  const [totalPrice, setTotalPrice] = useState("");
  const [payment, setPayment] = useState("");
  const [bookingID, setBookingID] = useState("");

  const [bookingServices, setBookingServices] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const db = getFirestore();
        const auth = getAuth();
        const providerUID = auth.currentUser.uid;

        const userBookingDocRef = doc(
          db,
          "providerProfiles",
          providerUID,
          "historyBookings",
          id
        );

        const docSnapshot = await getDoc(userBookingDocRef);

        if (docSnapshot.exists()) {
          const booking = docSnapshot.data();
          console.log("Booking Data:", booking);

          setDate(booking.date);
          setTime(booking.time);
          setAddress(booking.address);
          setCustomerName(booking.name);
          setServiceTitle(booking.title);
          setSubTotal(booking.subTotal);
          setDistanceFee(booking.feeDistance);
          setTotalPrice(booking.totalPrice);
          setPayment(booking.paymentMethod);
          setBookingID(booking.bookingID);
          setBookingServices(booking.service);
          setCategory(booking.category);
        } else {
          console.log("No such document");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [id]);

  const copyToClipboard = useCallback(() => {
    Clipboard.setString(bookingID);
    Alert.alert(
      "Copied to clipboard",
      `Booking ID: ${bookingID} has been copied to clipboard.`
    );
  }, [bookingID]);

  const getFormattedServiceName = () => {
    if (!serviceTitle || !category) {
      return 'Service'; // Default text or handle as needed
    }

    // Check if the title is "Pet Care" or "Gardening"
    if (serviceTitle === "Pet Care" || serviceTitle === "Gardening" || serviceTitle === "Cleaning") {
      return category;
    } else {
      // If not, concatenate the title and category
      return `${serviceTitle} ${category}`;
    }
  };

  return (
    <View style={styles.eReceipt}>
      <StatusBar barStyle="default" />
      <ScrollView
        style={styles.body}
        indicatorStyle="default"
        showsVerticalScrollIndicator={true}
        showsHorizontalScrollIndicator={false}
        pagingEnabled={false}
        contentContainerStyle={styles.bodyScrollViewContent}
      >
        {/* {loading ? (
          <ActivityIndicator
            size="large"
            color="#0000ff"
            style={{
              marginVertical: "75%",
              transform: [{ scale: 2 }], // Adjust the scale factor as needed
            }}
          />
        ) : ( */}
        <View style={styles.providerDetailsParent}>
          <View style={[styles.providerDetails, styles.frameWrapperFlexBox1]}>
            <View
              style={[styles.image2358Wrapper, styles.frameWrapperFlexBox1]}
            >
              <Image
                style={styles.image2358Icon}
                contentFit="cover"
                source={require("../assets/image-23583.png")}
              />
            </View>
            <View
              style={[
                styles.dummyProvider1Wrapper,
                styles.frameWrapperFlexBox1,
              ]}
            >
              <Text style={[styles.dummyProvider, styles.eReceipt1Typo]}>
                {customerName}
              </Text>
            </View>
            <View style={[styles.lineWrapper, styles.lineWrapperFlexBox]}>
              <Image
                style={[styles.lineIcon, styles.lineIconLayout]}
                contentFit="cover"
                source={require("../assets/line.png")}
              />
            </View>
          </View>
          <View style={[styles.frameWrapper, styles.frameWrapperFlexBox]}>
            <View style={styles.totalAssetSpaceBlock}>
              <View
                style={[
                  styles.frameServicesParent,
                  styles.frameWrapperFlexBox1,
                ]}
              >
                <View style={styles.frameServices}>
                  <Text style={[styles.service, styles.serviceFlexBox]}>
                    Service
                  </Text>
                </View>
                <View style={[styles.frameServices1, styles.copyButtonFlexBox]}>
                  <Text style={styles.plumbing}>{serviceTitle}</Text>
                </View>
              </View>
              <View
                style={[
                  styles.dummyProvider1Wrapper,
                  styles.frameWrapperFlexBox1,
                ]}
              >
                <View style={styles.frameServices}>
                  <Text
                    style={[styles.service, styles.serviceFlexBox]}
                  >{`Date & Time`}</Text>
                </View>
                <View style={[styles.frameServices1, styles.copyButtonFlexBox]}>
                  <Text style={styles.plumbing}>
                    {date} {time}
                  </Text>
                </View>
              </View>
              <View
                style={[
                  styles.dummyProvider1Wrapper,
                  styles.frameWrapperFlexBox1,
                ]}
              >
                <View style={styles.frameServices}>
                  <Text style={[styles.service, styles.serviceFlexBox]}>
                    Address
                  </Text>
                </View>
                <View style={[styles.frameServices1, styles.copyButtonFlexBox]}>
                  <Text style={styles.plumbing}>{address}</Text>
                </View>
              </View>
            </View>
          </View>
          <View style={[styles.firstQuestion, styles.frameWrapperFlexBox]}>
            <View style={[styles.totalAsset, styles.totalAssetSpaceBlock]}>
              <TouchableOpacity
                onPress={() => toggleListItem()}
                style={[
                  styles.frameServicesParent,
                  styles.frameWrapperFlexBox1,
                ]}
              >
                <View style={styles.titleLabelWrapper}>
                  <Text style={styles.titleLabel}>Service Details</Text>
                </View>
                <Animated.Image
                  style={[
                    styles.polygonUpIcon,
                    { transform: [{ rotate: arrowTransform }] },
                  ]}
                  contentFit="cover"
                  source={require("../assets/polygon-up.png")}
                />
              </TouchableOpacity>
              {showContent && (
                <View style={[styles.answerFrame, styles.frameWrapperFlexBox1]}>
                  <View style={styles.lineContainerFlexBox}>
                    <Image
                      style={[styles.frameChild, styles.lineIconLayout]}
                      contentFit="cover"
                      source={require("../assets/line-132.png")}
                    />
                  </View>
                  <View
                    style={[
                      styles.dateAndTimeFrame,
                      styles.frameWrapperFlexBox,
                    ]}
                  >
                    <View
                      style={[
                        styles.frameContainer,
                        styles.frameWrapperFlexBox1,
                      ]}
                    >
                      <View
                        style={[
                          styles.frameServicesParent,
                          styles.frameWrapperFlexBox1,
                        ]}
                      >
                        <View
                          style={[
                            styles.plumbingInstallationWrapper,
                            styles.frameWrapperFlexBox1,
                          ]}
                        >
                          <Text style={styles.plumbingInstallation}>
                            {getFormattedServiceName()}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                  <View style={styles.frameWrapperFlexBox}>
                    {bookingServices.map((item, index) => (
                      <View style={styles.lineWrapperFlexBox}>
                        <View
                          style={[
                            styles.dateAndTimeFrameInner,
                            styles.frameWrapperFlexBox1,
                          ]}
                        >
                          <View
                            style={[
                              styles.frameContainer,
                              styles.frameWrapperFlexBox1,
                            ]}
                          >
                            <Text style={[styles.x, styles.xTypo]}>
                              {item.value}x
                            </Text>
                          </View>
                        </View>
                        <View
                          style={[styles.frameFrame, styles.frameSpaceBlock]}
                        >
                          <View style={styles.frame1}>
                            <Text style={[styles.toiletSystem, styles.xTypo]}>
                              {item.name}
                            </Text>
                          </View>
                        </View>
                        <View
                          style={[styles.frameView, styles.frameSpaceBlock]}
                        >
                          <View style={styles.frame1}>
                            <Text style={[styles.text, styles.textTypo]}>
                              ₱{item.totalPrice}.00
                            </Text>
                          </View>
                        </View>
                      </View>
                    ))}
                  </View>
                </View>
              )}
            </View>
          </View>
          <View style={[styles.frameWrapper5, styles.frameWrapperFlexBox]}>
            <View style={styles.totalAssetSpaceBlock}>
              <View
                style={[
                  styles.frameServicesParent,
                  styles.frameWrapperFlexBox1,
                ]}
              >
                <View style={styles.frameServices}>
                  <Text style={[styles.service, styles.serviceFlexBox]}>
                    Subtotal
                  </Text>
                </View>
                <View style={[styles.frameServices1, styles.copyButtonFlexBox]}>
                  <Text style={[styles.text, styles.textTypo]}>
                    ₱{subtotal}.00
                  </Text>
                </View>
              </View>
              <View
                style={[
                  styles.dummyProvider1Wrapper,
                  styles.frameWrapperFlexBox1,
                ]}
              >
                <View style={styles.frameServices}>
                  <Text style={[styles.service, styles.serviceFlexBox]}>
                    Distance Fee
                  </Text>
                </View>
                <View style={[styles.frameServices1, styles.copyButtonFlexBox]}>
                  <Text style={[styles.text, styles.textTypo]}>
                    ₱{distanceFee}.00
                  </Text>
                </View>
              </View>
              <View style={[styles.lineContainer, styles.lineContainerFlexBox]}>
                <Image
                  style={[styles.frameChild, styles.lineIconLayout]}
                  contentFit="cover"
                  source={require("../assets/line-133.png")}
                />
              </View>
              <View
                style={[
                  styles.dummyProvider1Wrapper,
                  styles.frameWrapperFlexBox1,
                ]}
              >
                <View style={styles.frameServices}>
                  <Text style={[styles.totalPrice, styles.xTypo]}>
                    Total Price
                  </Text>
                </View>
                <View style={[styles.frameServices1, styles.copyButtonFlexBox]}>
                  <Text style={[styles.text5, styles.textTypo]}>
                    ₱{totalPrice}.00
                  </Text>
                </View>
              </View>
            </View>
          </View>
          <View style={[styles.frameWrapper6, styles.frameWrapperFlexBox]}>
            <View style={styles.totalAssetSpaceBlock}>
              <View
                style={[
                  styles.frameServicesParent,
                  styles.frameWrapperFlexBox1,
                ]}
              >
                <View style={styles.frameServices12}>
                  <Text style={[styles.service, styles.serviceFlexBox]}>
                    Payment Method
                  </Text>
                </View>
                <View style={[styles.frameServices1, styles.copyButtonFlexBox]}>
                  <Text style={styles.plumbing}>{payment}</Text>
                </View>
              </View>
              <View
                style={[
                  styles.dummyProvider1Wrapper,
                  styles.frameWrapperFlexBox1,
                ]}
              >
                <View style={styles.frameServices12}>
                  <Text style={[styles.service, styles.serviceFlexBox]}>
                    Booking ID
                  </Text>
                </View>
                <View style={[styles.frameServices1, styles.copyButtonFlexBox]}>
                  <Text style={styles.plumbing}>{bookingID}</Text>
                </View>
                <Pressable
                  style={[styles.copyButton, styles.copyButtonFlexBox]}
                  onPress={copyToClipboard}
                >
                  <Image
                    style={styles.vectorIcon}
                    contentFit="cover"
                    source={require("../assets/copy.png")}
                  />
                </Pressable>
              </View>
            </View>
          </View>
        </View>
        {/* )} */}
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
    paddingTop: 20,
    paddingBottom: 25,
    alignItems: "center",
    justifyContent: "center",
  },
  frameWrapperFlexBox1: {
    justifyContent: "center",
    alignItems: "center",
  },
  eReceipt1Typo: {
    fontFamily: FontFamily.title2Bold32,
    fontWeight: "700",
    textAlign: "center",
  },
  lineWrapperFlexBox: {
    paddingVertical: Padding.p_8xs,
    paddingHorizontal: 0,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    alignSelf: "stretch",
  },
  lineIconLayout: {
    maxWidth: "100%",
    overflow: "hidden",
    flex: 1,
  },
  frameWrapperFlexBox: {
    marginTop: 10,
    justifyContent: "center",
    alignSelf: "stretch",
  },
  serviceFlexBox: {
    textAlign: "left",
    flex: 1,
  },
  copyButtonFlexBox: {
    justifyContent: "flex-end",
    alignItems: "center",
    flexDirection: "row",
  },
  totalAssetSpaceBlock: {
    paddingVertical: Padding.p_mini,
    paddingHorizontal: Padding.p_3xs,
    justifyContent: "center",
    alignSelf: "stretch",
  },
  xTypo: {
    fontFamily: FontFamily.level2Medium12,
    fontWeight: "500",
  },
  frameSpaceBlock: {
    marginLeft: 7,
    justifyContent: "center",
  },
  textTypo: {
    lineHeight: 16,
    fontSize: FontSize.level2Medium12_size,
    textAlign: "right",
    color: Color.neutral07,
    flex: 1,
  },
  lineContainerFlexBox: {
    height: 1,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "stretch",
  },
  image2358Icon: {
    height: 132,
    width: 129,
  },
  image2358Wrapper: {
    flexDirection: "row",
  },
  dummyProvider: {
    fontSize: FontSize.size_5xl,
    lineHeight: 41,
    color: "#172b4d",
    textTransform: "capitalize",
    textAlign: "center",
    flex: 1,
  },
  dummyProvider1Wrapper: {
    marginTop: 5,
    flexDirection: "row",
    alignSelf: "stretch",
  },
  lineIcon: {
    height: 2,
  },
  lineWrapper: {
    marginTop: 5,
  },
  providerDetails: {
    alignSelf: "stretch",
  },
  service: {
    color: Color.neutral07,
    letterSpacing: -0.3,
    fontSize: 15,
    textAlign: "left",
    fontFamily: FontFamily.title4Regular18,
  },
  frameServices: {
    width: 94,
    alignItems: "center",
    flexDirection: "row",
  },
  plumbing: {
    textAlign: "right",
    fontFamily: "Inter-SemiBold",
    fontWeight: "600",
    color: Color.neutral07,
    letterSpacing: -0.3,
    fontSize: 15,
    flex: 1,
  },
  frameServices1: {
    marginLeft: 5,
    flex: 1,
  },
  frameServicesParent: {
    flexDirection: "row",
    alignSelf: "stretch",
  },
  frameWrapper: {
    borderWidth: 1,
    borderColor: "#000",
    borderStyle: "solid",
    shadowOpacity: 1,
    elevation: 4,
    shadowRadius: 4,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowColor: "rgba(0, 0, 0, 0.25)",
    borderRadius: Border.br_5xs,
    backgroundColor: "#fff",
  },
  titleLabel: {
    lineHeight: 24,
    colorGray_1000: "#19191a",
    fontFamily: "Inter-SemiBold",
    fontWeight: "600",
    textAlign: "left",
    fontSize: 15,
  },
  titleLabelWrapper: {
    alignItems: "center",
    flexDirection: "row",
    flex: 1,
  },
  polygonDownIcon: {
    width: 12,
    height: 10,
    borderRadius: Border.br_12xs,
  },
  polygonUpIcon: {
    width: 12,
    height: 10,
    borderRadius: Border.br_12xs,
  },
  polygonDownParent: {
    marginLeft: 10,
    flexDirection: "row",
  },
  frameChild: {
    maxHeight: "100%",
    opacity: 0.3,
    alignSelf: "stretch",
    width: "100%",
  },
  plumbingInstallation: {
    fontSize: 18,
    fontFamily: FontFamily.workSansMedium,
    color: "#000",
    fontWeight: "500",
    textAlign: "center",
    flex: 1,
  },
  plumbingInstallationWrapper: {
    flexDirection: "row",
    flex: 1,
  },
  frameContainer: {
    flex: 1,
  },
  dateAndTimeFrame: {
    paddingTop: Padding.p_3xs,
    paddingBottom: Padding.p_8xs,
    alignItems: "center",
    flexDirection: "row",
  },
  x: {
    fontSize: FontSize.level2Medium12_size,
    fontFamily: FontFamily.level2Medium12,
    color: "#000",
    textAlign: "center",
    alignSelf: "stretch",
  },
  dateAndTimeFrameInner: {
    width: 30,
    flexDirection: "row",
  },
  toiletSystem: {
    fontSize: FontSize.level2Medium12_size,
    fontFamily: FontFamily.level2Medium12,
    color: "#000",
    textAlign: "left",
    flex: 1,
    textTransform: "capitalize",
  },
  frame1: {
    alignItems: "center",
    flexDirection: "row",
    alignSelf: "stretch",
  },
  frameFrame: {
    flex: 1,
  },
  text: {
    fontFamily: "Inter-Regular",
  },
  frameView: {
    width: 68,
    alignItems: "flex-end",
  },
  answerFrame: {
    paddingTop: Padding.p_8xs,
    alignSelf: "stretch",
  },
  totalAsset: {
    borderWidth: 1,
    borderColor: "#000",
    borderStyle: "solid",
    shadowOpacity: 1,
    elevation: 4,
    shadowRadius: 4,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowColor: "rgba(0, 0, 0, 0.25)",
    borderRadius: Border.br_5xs,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  firstQuestion: {
    alignItems: "center",
  },
  lineContainer: {
    marginTop: 5,
  },
  totalPrice: {
    textAlign: "left",
    flex: 1,
    color: Color.neutral07,
    letterSpacing: -0.3,
    fontSize: 15,
  },
  text5: {
    fontFamily: FontFamily.level2Medium12,
    fontWeight: "500",
  },
  frameWrapper5: {
    borderWidth: 1,
    borderColor: "black",
    borderStyle: "solid",
    shadowOpacity: 1,
    elevation: 4,
    shadowRadius: 4,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowColor: "rgba(0, 0, 0, 0.25)",
    borderRadius: Border.br_5xs,
    backgroundColor: "white",
  },
  frameServices12: {
    width: 129,
    alignItems: "center",
    flexDirection: "row",
  },
  vectorIcon: {
    width: 14,
    height: 16,
  },
  copyButton: {
    marginLeft: 10,
  },
  frameWrapper6: {
    borderWidth: 1,
    borderColor: "black",
    borderStyle: "solid",
    shadowOpacity: 1,
    elevation: 4,
    shadowRadius: 4,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowColor: "rgba(0, 0, 0, 0.25)",
    borderRadius: Border.br_5xs,
    backgroundColor: "#fff",
  },
  providerDetailsParent: {
    paddingVertical: 0,
    paddingHorizontal: Padding.p_3xs,
    justifyContent: "center",
    alignSelf: "stretch",
  },
  body: {
    alignSelf: "stretch",
    flex: 1,
  },
  eReceipt: {
    backgroundColor: Color.colorWhitesmoke_200,
    height: 812,
    width: "100%",
    flex: 1,
  },
});

export default EReceipt;
