import * as React from "react";
import { TouchableOpacity, Text, StyleSheet, View, Linking, Pressable} from "react-native";
import { Image } from "expo-image";
import { FontSize, FontFamily, Color, Border, Padding } from "../GlobalStyles";
import { useNavigation } from "@react-navigation/native";
import moment from 'moment';

// Define a function to map the status to the corresponding style
const getStatusStyle = (status) => {
    switch (status) {
      case 'Upcoming':
        return styles.upcoming;
      case 'In Transit':
        return styles.inTransit;
      case 'In Progress':
        return styles.inProgress;
      default:
        return styles.defaultStatus;
    }
  };

// Define a function to map the status to the corresponding card background color
const getCardBackgroundColor = (status) => {
    switch (status) {
      case 'Upcoming':
        return styles.upcomingCardColor;
      case 'In Transit':
        return styles.inTransitCardColor;
      case 'In Progress':
        return styles.inProgressCardColor;
      default:
        return {};
    }
};

const getButtonText = (status) => {
    switch (status) {
      case 'Upcoming':
        return 'Go to Customer';
      case 'In Transit':
        return 'Arrived';
      case 'In Progress':
        return 'Done';
      default:
        return 'Action'; 
    }
  };
  
const ActiveBookingCard = ({status, date, time, location, serviceName, matchedBookingID, phone, customerName, customerUID, id, onOpenCancelModal}) => {
const navigation = useNavigation();
  const statusStyle = getStatusStyle(status);
  const cardBackgroundColor = getCardBackgroundColor(status);

  const handleButton =  () => {
    const currentDateTime = moment();
    const bookingDateTime = moment(`${date} ${time}`, "MMM D YYYY h:mm A");
    const timeDiff = bookingDateTime.diff(currentDateTime, 'minutes');

    if (status === 'Upcoming' && (currentDateTime.format("MMM D YYYY") !== date || timeDiff > 60)) {
      // Add a restriction message or disable the button
      alert("You cannot go to the customer yet. Please check the date and time of the booking.");
      return;
    }

    if (status === 'Upcoming') {
      navigation.navigate("ConfirmNavigation", { itemID: id, matchedBookingID: matchedBookingID, customerUID: customerUID});
    } else if (status === 'In Transit') {
      navigation.navigate("PerformTheService", { itemID: id, matchedBookingID: matchedBookingID, customerUID: customerUID});
    } else if (status === 'In Progress') {
      navigation.navigate("ConfirmService", { itemID: id, matchedBookingID: matchedBookingID, customerUID: customerUID });
    }
  };

  // When the 'Cancel Booking' button is pressed
  const onCancelPress = () => {
    // This will call the openCancelModal function passed as a prop from the parent component
    onOpenCancelModal();
  };

  const messageProvider = ()=>{
    Linking.openURL(`sms:${phone}`);
  }
  const callProvider = ()=>{
    Linking.openURL(`tel:${phone}`);
  }

  const viewBookingDetails = () => {
    navigation.navigate("ViewBookingDetails", { itemID: id });
  };
  

  return (
    <View style={[styles.upcomingFrame, styles.frameFlexBox]}>
      <View style={[cardBackgroundColor, styles.rectangleFrameShadowBox2]}>
        <View style={[styles.providerFrame, styles.callFlexBox]}>
          <View style={styles.image2378Wrapper}>
            <Image
              style={styles.image2378Icon}
              contentFit="cover"
              source={require("../assets/image-2378.png")}
            />
          </View>
          <View style={[styles.frameParent, styles.parentSpaceBlock1]}>
            <View style={[styles.deepCleaningParent, styles.callFlexBox]}>
              <Text style={styles.deepCleaning}>{serviceName}</Text>
              <Text style={[styles.customer1, styles.customer1SpaceBlock]}>
                {customerName}
              </Text>
            </View>
            <View style={styles.upcomingWrapper}>
              <View style={[styles.pendingFlexBox, statusStyle]}>
                <Text style={styles.pending1}>{status}</Text>
              </View>
            </View>
          </View>
          <View style={[styles.callBtnParent, styles.parentSpaceBlock1]}>
            <TouchableOpacity style={[styles.callBtn, styles.callFlexBox]} onPress={callProvider}>
              <Image
                style={styles.callBtnChild}
                contentFit="cover"
                source={require("../assets/ellipse-232.png")}
              />
              <Image
                style={[styles.callIcon, styles.iconPosition1]}
                contentFit="cover"
                source={require("../assets/call.png")}
              />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.messageBtn, styles.customer1SpaceBlock]} onPress={messageProvider}>
              <Image
                style={styles.callBtnChild}
                contentFit="cover"
                source={require("../assets/ellipse-232.png")}
              />
              <Image
                style={[styles.messageIcon, styles.iconPosition1]}
                contentFit="cover"
                source={require("../assets/message.png")}
              />
            </TouchableOpacity>
          </View>
        </View>
        <Image
          style={[styles.rectangleFrameItem, styles.rectangleFrameLayout]}
          contentFit="cover"
          source={require("../assets/line-831.png")}
        />
        <View style={[styles.scheduleFrame, styles.frameSpaceBlock]}>
          <View style={styles.frameGroupFlexBox}>
            <Text style={styles.dateTime}>{`Date & Time`}</Text>
            <View style={styles.aug112023Parent}>
              <Text
                style={[styles.aug112023, styles.textTypo2]}
              >{`${date}`}</Text>
              <Text style={[styles.text, styles.textTypo2]}>|</Text>
              <Text style={[styles.text, styles.textTypo2]}> {`${time}`}</Text>
            </View>
          </View>
          <View style={[styles.frameGroup, styles.frameGroupFlexBox]}>
            <View style={styles.locationWrapper}>
              <Text style={styles.dateTime}>Location</Text>
            </View>
            <View style={styles.uscTalambanCebuCityCebuWrapper}>
              <Text
                style={[styles.uscTalambanCebu, styles.textTypo2]}
              >{location}</Text>
            </View>
          </View>
        </View>
        <View style={[styles.buttonsFrame, styles.frameSpaceBlock]}>
          {status === "Upcoming" && (
            <Pressable
            style={[styles.buttonContainer, styles.cancelBookingBtn2]}
            onPress={onCancelPress}
            >
              <Text style={[styles.cancelBooking2, styles.viewDetailsTypo]}>
                Cancel
              </Text>
            </Pressable>
          )}
          <Pressable
            style={[styles.buttonContainer, styles.cancelBookingBtn]}
            onPress={() => handleButton()}
          >
            <Text style={[styles.cancelBooking, styles.viewDetailsTypo]}>
                {getButtonText(status)}
            </Text>
          </Pressable>
          <Pressable style={[styles.buttonContainer, styles.viewBorder]} onPress={() => viewBookingDetails()}>
            <Text style={[styles.viewDetails, styles.viewDetailsTypo]}>
              View Details
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
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
    marginHorizontal: 0,
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
  cancelBooking2: {
    color: Color.colorFirebrick_300,
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
    marginHorizontal: 5,
  },
  cancelBookingBtn2: {
    borderWidth: 1.6,
    borderColor: Color.colorFirebrick_300,
    borderStyle: "solid",
    borderRadius: Border.br_xs,
    justifyContent: "center",
    flexDirection: "row",
    flex: 1,
    alignItems: "center",
    backgroundColor: Color.colorMistyrose,
    marginHorizontal: 0,
  },
  viewDetails: {
    color: Color.m3White,
  },
  viewDetailsBtn: {
    overflow: "hidden",
  },
  buttonsFrame: {
    alignItems: "flex-end",
    paddingBottom: 5,
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
  upcomingCardColor: {
    backgroundColor: Color.colorGainsboro_200,
  },
  upcomingFrame: {
    marginTop: 5,
  },
  inTransit: {
    backgroundColor: Color.colorOrangered,
  },
  callBtn2: {
    justifyContent: "center",
    flexDirection: "row",
    alignItems: "center",
  },
  inTransitCardColor: {
    backgroundColor: Color.colorGainsboro_100,
  },
  inProgress: {
    backgroundColor: Color.colorGoldenrod,
  },
  inProgressWrapper: {
    width: 93,
    justifyContent: "center",
  },
  inProgressCardColor: {
    backgroundColor: Color.colorLinen,
  },
  activeBookings: {
    paddingHorizontal: 0,
    paddingVertical: Padding.p_xl,
    flex: 1,
    alignItems: "center",
    backgroundColor: Color.m3White,
    alignSelf: "stretch",
  },
});

export default ActiveBookingCard;
