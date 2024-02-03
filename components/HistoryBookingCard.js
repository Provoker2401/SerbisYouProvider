import * as React from "react";
import {
  Pressable,
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
} from "react-native";
import { Image } from "expo-image";
import { FontSize, FontFamily, Color, Border, Padding } from "../GlobalStyles";
import { useNavigation } from "@react-navigation/native";
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

// Define a function to map the status to the corresponding style
const getStatusStyle = (status) => {
  switch (status) {
    case "Canceled":
      return styles.rectangleFrameShadowBox1;
    case "Completed":
      return styles.rectangleFrameShadowBox;
    default:
      return styles.defaultStatus;
  }
};

// Define a function to map the status to the corresponding card background color
const getCardBackgroundColor = (status) => {
  switch (status) {
    case "Canceled":
      return styles.cancelled;
    case "Completed":
      return styles.completed;
    default:
      return {};
  }
};

const getButtonText = (status) => {
  switch (status) {
    case "Cancelled":
      return "Cancelled";
    case "Completed":
      return "Completed";
    default:
      return "Action";
  }
};

const getPaymentMethodText = (paymentMethod) => {
  switch (paymentMethod) {
    case "Gcash":
      return "Gcash";
    case "Cash":
      return "Cash";
    case "Paymaya":
      return "Paymaya";
    case "Paypal":
      return "Paypal";
    case "BPI":
      return "BPI";
    case "BDO":
      return "BDO";
    default:
      return "Action";
  }
};

const HistoryBookingCard = ({
  status,
  date,
  time,
  location,
  serviceName,
  customerName,
  totalPrice,
  paymentMethod,
  id,
}) => {
  const navigation = useNavigation();
  const statusStyle = getStatusStyle(status);
  const cardBackgroundColor = getCardBackgroundColor(status);

  const gotoEReceipt = async (id) => {
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

        navigation.navigate("EReceipt", { id });


      } else {
        console.log("No such document");
      }
    } catch (error) {}
  };

  console.log("ID", id);

  return (
    <View style={styles.cancelledFrameSpaceBlock}>
      <TouchableOpacity style={statusStyle} onPress={() => gotoEReceipt(id)}>
        <View style={styles.providerFrame}>
          <View style={[styles.frameParent, styles.frameParentSpaceBlock]}>
            <View style={styles.frameGroup}>
              <View style={styles.frameContainer}>
                <View style={styles.gardenMaintenanceWrapper}>
                  <Text
                    style={[
                      styles.gardenMaintenance,
                      styles.gardenMaintenanceTypo,
                    ]}
                  >
                    {serviceName}
                  </Text>
                </View>
                <View style={styles.frameWrapper}>
                  <View>
                    <View
                      style={[cardBackgroundColor, styles.cancelledFlexBox]}
                    >
                      <Text style={[styles.cancelled1, styles.cancelled1Clr]}>
                        {status}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
              <View style={styles.frameView}>
                <View style={styles.amParent}>
                  {/* <Text style={[styles.am, styles.amTypo]}>5:00 AM</Text> */}
                  <Text style={[styles.uscTalambanCebu, styles.amTypo]}>
                    {location}
                  </Text>
                </View>
                <Pressable
                  style={styles.vectorWrapper}
                  onPress={() => navigation.navigate("CalendarStrips")}
                >
                  <Image
                    style={styles.vectorIcon}
                    contentFit="cover"
                    source={require("../assets/vector3.png")}
                  />
                </Pressable>
              </View>
            </View>
            <View
              style={[styles.vectorContainer, styles.historyBookingsSpaceBlock]}
            >
              <Image
                style={[styles.frameChild, styles.frameChildLayout]}
                contentFit="cover"
                source={require("../assets/line-83.png")}
              />
            </View>
            <View style={styles.frameContainer}>
              <Text style={[styles.johnDoe, styles.amountClr]}>
                {customerName}
              </Text>
              <Text style={[styles.johnDoe, styles.amountClr2]}>{time}</Text>
            </View>
            <View style={styles.frameParent1}>
              <View style={styles.paidViaGcashWrapper}>
                <Text style={[styles.paidViaGcashContainer, styles.amTypo]}>
                  <Text style={styles.paidVia}>{`Paid via `}</Text>
                  <Text style={styles.gcash}>{paymentMethod}</Text>
                </Text>
              </View>
              <View style={styles.wrapper}>
                <Text
                  style={[styles.text, styles.textTypo]}
                >{`₱ ${totalPrice}.00`}</Text>
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
            <Pressable style={styles.messageBtn}>
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
        <View style={[styles.scheduleFrame, styles.scheduleFrameFlexBox]}>
          <View style={styles.parentFlexBox}>
            <Text style={[styles.time, styles.timeTypo]}>Time</Text>
            <View style={styles.amWrapper}>
              <Text style={[styles.am1, styles.textTypo1]}> 8:00 AM</Text>
            </View>
          </View>
          <View style={[styles.frameParent2, styles.parentFlexBox]}>
            <View style={styles.locationWrapper}>
              <Text style={[styles.time, styles.timeTypo]}>Location</Text>
            </View>
            <View style={styles.uscTalambanCebuCityCebuWrapper}>
              <Text
                style={[styles.uscTalambanCebu1, styles.textTypo1]}
              >{`USC Talamban, Cebu City, Cebu, Region 7, Philippines `}</Text>
            </View>
          </View>
        </View>
        <View style={[styles.buttonsFrame, styles.buttonsFrameFlexBox]}>
          <Pressable style={styles.btnBorder}>
            <Text style={[styles.viewDetails, styles.amTypo]}>
              View Details
            </Text>
          </Pressable>
        </View>
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  historyBookingsSpaceBlock: {
    paddingHorizontal: 0,
    alignSelf: "stretch",
  },
  leftArrow: {
    left: 0,
    top: -48,
    width: 25,
    height: 25,
  },
  rightArrow: {
    bottom: 48,
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
  amountClr2: {
    color: Color.colorTypographyContentIconsBlack02,
    textAlign: "right",
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
    fontWeight: "300",
    fontFamily: FontFamily.title2Bold32,
    fontSize: FontSize.level2Medium12_size,
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
  frameParent1: {
    flexDirection: "row",
    alignSelf: "stretch",
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
  completed: {
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
    alignItems: "center",
    backgroundColor: Color.m3White,
    paddingHorizontal: 0,
  },
});

export default HistoryBookingCard;
