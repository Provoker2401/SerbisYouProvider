import * as React from "react";
import {
  StatusBar,
  StyleSheet,
  Pressable,
  View,
  Text,
  ScrollView,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { Color, FontFamily, FontSize, Padding, Border } from "../GlobalStyles";

const AddCard = () => {
  return (
    <View style={styles.addCard}>
      <StatusBar barStyle="default" />
      <ScrollView
        style={styles.body}
        showsVerticalScrollIndicator={true}
        showsHorizontalScrollIndicator={true}
        contentContainerStyle={styles.bodyScrollViewContent}
      >
        <View style={[styles.cardDetailsFrame, styles.frameParentFlexBox]}>
          <View style={styles.singleLineInput}>
            <View style={styles.cardholdersNameWrapper}>
              <Text style={[styles.cardholdersName, styles.cardholdersTypo]}>
                Cardholder’s Name
              </Text>
            </View>
            <View style={[styles.field, styles.fieldIconFlexBox]}>
              <TextInput
                style={[styles.cardholdersNameInput, styles.cardholdersTypo]}
                placeholder="Name"
                placeholderTextColor="#848484"
              />
            </View>
            <View style={[styles.leftIconParent, styles.fieldIconFlexBox]}>
              <Image
                style={styles.leftIcon}
                contentFit="cover"
                source={require("../assets/-left-icon.png")}
              />
              <Text style={styles.errorName}>Error Name</Text>
            </View>
          </View>
          <View style={styles.singleLineInput1}>
            <View style={styles.cardholdersNameWrapper}>
              <Text style={[styles.cardholdersName, styles.cardholdersTypo]}>
                Card Number
              </Text>
            </View>
            <View style={[styles.field, styles.fieldIconFlexBox]}>
              <TextInput
                style={[styles.cardholdersNameInput, styles.cardholdersTypo]}
                placeholder="Card Number"
                keyboardType="number-pad"
                placeholderTextColor="#848484"
              />
            </View>
            <View style={styles.fieldIconFlexBox}>
              <Image
                style={styles.leftIcon}
                contentFit="cover"
                source={require("../assets/-left-icon1.png")}
              />
              <Text style={styles.theTypo}>
                The number you’re entering doesn’t seems right
              </Text>
            </View>
          </View>
          <View
            style={[styles.singleLineInputParent, styles.frameParentFlexBox]}
          >
            <View style={styles.singleLayout}>
              <View style={styles.cardholdersNameWrapper}>
                <Text style={[styles.cardholdersName, styles.cardholdersTypo]}>
                  Expiry Date
                </Text>
              </View>
              <View style={[styles.field2, styles.fieldIconFlexBox]}>
                <Image
                  style={styles.leftIcon2}
                  contentFit="cover"
                  source={require("../assets/-left-icon2.png")}
                />
                <TextInput
                  style={[styles.expiryDateInput, styles.cardholdersTypo]}
                  placeholder="MM / YY"
                  keyboardType="number-pad"
                  placeholderTextColor="#848484"
                />
                <Image
                  style={styles.leftIcon3}
                  contentFit="cover"
                  source={require("../assets/-left-icon3.png")}
                />
              </View>
              <View style={styles.fieldIconFlexBox}>
                <Image
                  style={styles.leftIcon}
                  contentFit="cover"
                  source={require("../assets/-left-icon1.png")}
                />
                <Text style={[styles.theExpiryDate, styles.theTypo]}>
                  The expiry date must be a future date
                </Text>
              </View>
            </View>
            <View style={[styles.singleLineInput3, styles.singleLayout]}>
              <View style={styles.cardholdersNameWrapper}>
                <Text style={[styles.cardholdersName, styles.cardholdersTypo]}>
                  CVV
                </Text>
              </View>
              <View style={[styles.field2, styles.fieldIconFlexBox]}>
                <Image
                  style={styles.leftIcon2}
                  contentFit="cover"
                  source={require("../assets/-left-icon2.png")}
                />
                <TextInput
                  style={[styles.expiryDateInput, styles.cardholdersTypo]}
                  placeholder="CVV"
                  keyboardType="number-pad"
                  placeholderTextColor="#848484"
                />
                <Image
                  style={styles.leftIcon3}
                  contentFit="cover"
                  source={require("../assets/-left-icon3.png")}
                />
              </View>
              <View style={styles.frameView}>
                <Image
                  style={styles.leftIcon}
                  contentFit="cover"
                  source={require("../assets/-left-icon1.png")}
                />
                <Text style={[styles.theExpiryDate, styles.theTypo]}>
                  Enter a valid CVV.
                </Text>
              </View>
            </View>
          </View>
        </View>
        <View style={[styles.frameParent, styles.frameParentFlexBox]}>
          <View style={[styles.frameGroup, styles.frameParentFlexBox]}>
            <View style={[styles.lockWrapper, styles.frameParentFlexBox]}>
              <Image
                style={styles.badgeLayout}
                contentFit="cover"
                source={require("../assets/lock.png")}
              />
            </View>
            <View
              style={[
                styles.yourCardDetailsWillBeSaveWrapper,
                styles.frameParentFlexBox,
              ]}
            >
              <Text style={[styles.yourCardDetails, styles.yourCardTypo]}>
                Your card details will be saved securely.
              </Text>
            </View>
          </View>
          <View
            style={[styles.singleLineInputParent, styles.frameParentFlexBox]}
          >
            <Text style={[styles.yourCardMayContainer, styles.yourCardTypo]}>
              <Text
                style={styles.yourCardMay}
              >{`Your card may be charged to make sure it is valid. That amount will be automatically refunded. By adding a card, you have read and agree to our `}</Text>
              <Text style={styles.termsAndConditions}>
                terms and conditions.
              </Text>
            </Text>
          </View>
        </View>
        <View style={[styles.addCardFrame, styles.buttonFlexBox]}>
          <Pressable style={[styles.button, styles.buttonFlexBox]}>
            <Text style={[styles.button1, styles.button1Typo]}>Add Card</Text>
          </Pressable>
        </View>
      </ScrollView>
      <View style={[styles.navigationBarHome, styles.buttonSpaceBlock]}>
        <View style={styles.segment1}>
          <View style={styles.iconContainerFlexBox}>
            <View style={styles.stateFlexBox}>
              <Image
                style={styles.iconLayout}
                contentFit="cover"
                source={require("../assets/icon1.png")}
              />
            </View>
          </View>
          <Text style={[styles.labelText, styles.labelTypo]}>Home</Text>
        </View>
        <View style={[styles.segment2, styles.segmentSpaceBlock]}>
          <View style={styles.iconContainerFlexBox}>
            <View style={styles.stateFlexBox}>
              <Image
                style={styles.icon2}
                contentFit="cover"
                source={require("../assets/icon2.png")}
              />
            </View>
          </View>
          <Text style={[styles.labelText1, styles.labelTypo]}>Bookings</Text>
        </View>
        <View style={styles.segmentSpaceBlock}>
          <View style={styles.iconContainerFlexBox}>
            <View style={styles.stateFlexBox}>
              <Image
                style={styles.iconLayout}
                contentFit="cover"
                source={require("../assets/icon3.png")}
              />
            </View>
          </View>
          <Text style={[styles.labelText1, styles.labelTypo]}>
            Notifications
          </Text>
        </View>
        <View style={styles.segment1}>
          <View style={[styles.iconContainer3, styles.iconContainerFlexBox]}>
            <View style={styles.stateFlexBox}>
              <Image
                style={[styles.icon4, styles.iconLayout]}
                contentFit="cover"
                source={require("../assets/icon4.png")}
              />
              <View style={[styles.badge, styles.badgeLayout]}>
                <Text style={styles.badgeLabel}>3</Text>
              </View>
            </View>
          </View>
          <Text style={[styles.labelText3, styles.labelTypo]}>Account</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#1a244d",
  },
  bodyScrollViewContent: {
    flexDirection: "column",
    paddingHorizontal: 0,
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  frameParentFlexBox: {
    justifyContent: "center",
    alignItems: "center",
  },
  button1Typo: {
    textAlign: "center",
    color: Color.white,
    fontWeight: "700",
  },
  cardholdersTypo: {
    fontFamily: FontFamily.typographyParagraphSmallMedium,
    fontWeight: "500",
    fontSize: FontSize.typographyTaglineSmallRegular_size,
    flex: 1,
  },
  fieldIconFlexBox: {
    marginTop: 8,
    flexDirection: "row",
    alignSelf: "stretch",
  },
  theTypo: {
    color: Color.colorRed_400,
    marginLeft: 8,
    fontFamily: FontFamily.typographyTaglineSmallRegular,
    fontSize: FontSize.level2Medium12_size,
    textAlign: "left",
  },
  singleLayout: {
    height: 108,
    flex: 1,
  },
  yourCardTypo: {
    fontSize: FontSize.level2Medium12_size,
    flex: 1,
  },
  buttonFlexBox: {
    paddingVertical: Padding.p_xl,
    alignItems: "center",
    alignSelf: "stretch",
  },
  buttonSpaceBlock: {
    paddingHorizontal: Padding.p_5xs,
    flexDirection: "row",
  },
  labelTypo: {
    marginTop: 4,
    fontFamily: FontFamily.m3LabelLarge,
    lineHeight: 16,
    letterSpacing: 1,
    fontSize: FontSize.level2Medium12_size,
    fontWeight: "500",
    textAlign: "center",
    alignSelf: "stretch",
  },
  segmentSpaceBlock: {
    opacity: 0.8,
    paddingBottom: Padding.p_base,
    paddingTop: Padding.p_xs,
    width: 90,
    justifyContent: "center",
    alignItems: "center",
  },
  iconContainerFlexBox: {
    borderRadius: Border.br_base,
    justifyContent: "center",
    overflow: "hidden",
    alignItems: "center",
  },
  iconLayout: {
    height: 30,
    width: 26,
    overflow: "hidden",
  },
  badgeLayout: {
    height: 12,
    width: 12,
    overflow: "hidden",
  },
  cardholdersName: {
    color: Color.colorGray80,
    textAlign: "left",
  },
  cardholdersNameWrapper: {
    flexDirection: "row",
    alignSelf: "stretch",
  },
  cardholdersNameInput: {
    alignItems: "center",
    flexDirection: "row",
  },
  field: {
    paddingVertical: Padding.p_base,
    borderWidth: 1,
    borderColor: Color.colorDarkslategray_200,
    borderStyle: "solid",
    marginTop: 8,
    paddingHorizontal: Padding.p_5xs,
    borderRadius: Border.br_5xs,
    alignItems: "center",
  },
  leftIcon: {
    width: 13,
    height: 13,
  },
  errorName: {
    color: Color.colorGray60,
    marginLeft: 8,
    fontFamily: FontFamily.typographyTaglineSmallRegular,
    fontSize: FontSize.level2Medium12_size,
    textAlign: "left",
  },
  leftIconParent: {
    display: "none",
  },
  singleLineInput: {
    alignSelf: "stretch",
  },
  singleLineInput1: {
    marginTop: 15,
    alignSelf: "stretch",
  },
  leftIcon2: {
    width: 20,
    height: 20,
    display: "none",
  },
  expiryDateInput: {
    marginLeft: 8,
    flexDirection: "row",
  },
  leftIcon3: {
    width: 16,
    height: 16,
    marginLeft: 8,
    display: "none",
  },
  field2: {
    paddingVertical: Padding.p_base,
    borderWidth: 1,
    borderColor: Color.colorDarkslategray_200,
    borderStyle: "solid",
    marginTop: 8,
    paddingHorizontal: Padding.p_5xs,
    borderRadius: Border.br_5xs,
  },
  theExpiryDate: {
    flex: 1,
  },
  frameView: {
    height: 14,
    marginTop: 8,
    flexDirection: "row",
    alignSelf: "stretch",
  },
  singleLineInput3: {
    marginLeft: 15,
  },
  singleLineInputParent: {
    marginTop: 15,
    flexDirection: "row",
    alignSelf: "stretch",
  },
  cardDetailsFrame: {
    paddingVertical: Padding.p_3xs,
    paddingHorizontal: Padding.p_3xl,
    alignSelf: "stretch",
  },
  lockWrapper: {
    flexDirection: "row",
  },
  yourCardDetails: {
    fontFamily: FontFamily.title4Regular18,
    color: Color.colorDimgray_300,
    textAlign: "left",
  },
  yourCardDetailsWillBeSaveWrapper: {
    marginLeft: 5,
    flexDirection: "row",
    flex: 1,
  },
  frameGroup: {
    flexDirection: "row",
    alignSelf: "stretch",
  },
  yourCardMay: {
    color: Color.colorDimgray_300,
  },
  termsAndConditions: {
    color: "#0025e8",
  },
  yourCardMayContainer: {
    fontWeight: "300",
    fontFamily: FontFamily.interLight,
    textAlign: "justify",
  },
  frameParent: {
    paddingBottom: 125,
    marginTop: 15,
    paddingHorizontal: Padding.p_3xl,
    alignSelf: "stretch",
  },
  button1: {
    fontSize: FontSize.bodyLgBodyLgRegular_size,
    fontFamily: FontFamily.georamaBold,
  },
  button: {
    height: 50,
    paddingHorizontal: Padding.p_5xs,
    flexDirection: "row",
    borderRadius: Border.br_5xs,
    paddingVertical: Padding.p_xl,
    justifyContent: "center",
    backgroundColor: Color.colorDarkslateblue_100,
  },
  addCardFrame: {
    justifyContent: "flex-end",
    marginTop: 15,
    paddingHorizontal: Padding.p_3xl,
  },
  body: {
    backgroundColor: Color.colorWhitesmoke_100,
    alignSelf: "stretch",
    flex: 1,
  },
  stateFlexBox: {
    paddingVertical: Padding.p_9xs,
    paddingHorizontal: Padding.p_xl,
    height: 32,
    width: 64,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  labelText: {
    color: Color.colorDimgray_200,
  },
  segment1: {
    paddingBottom: Padding.p_base,
    paddingTop: Padding.p_xs,
    width: 90,
    justifyContent: "center",
    alignItems: "center",
  },
  icon2: {
    height: 26,
    overflow: "hidden",
    width: 24,
  },
  labelText1: {
    color: Color.colorDarkslategray_100,
  },
  segment2: {
    height: 80,
  },
  icon4: {
    zIndex: 0,
  },
  badgeLabel: {
    marginTop: -7,
    marginLeft: -7,
    top: "50%",
    left: "50%",
    fontSize: FontSize.size_2xs,
    display: "flex",
    width: 14,
    position: "absolute",
    fontFamily: FontFamily.m3LabelLarge,
    lineHeight: 16,
    letterSpacing: 1,
    height: 14,
    fontWeight: "500",
    textAlign: "center",
    color: Color.white,
    justifyContent: "center",
    alignItems: "center",
  },
  badge: {
    top: 2,
    left: 35,
    borderRadius: Border.br_81xl,
    backgroundColor: Color.colorFirebrick_100,
    zIndex: 1,
    position: "absolute",
    display: "none",
  },
  iconContainer3: {
    backgroundColor: Color.colorLightblue,
  },
  labelText3: {
    color: Color.colorDarkslateblue_200,
  },
  navigationBarHome: {
    borderTopLeftRadius: Border.br_9xs,
    borderTopRightRadius: Border.br_9xs,
    paddingVertical: 0,
    justifyContent: "space-between",
    alignSelf: "stretch",
    backgroundColor: Color.white,
  },
  addCard: {
    height: 812,
    width: "100%",
    flex: 1,
    backgroundColor: Color.white,
  },
});

export default AddCard;
