import * as React from "react";
import {
  StatusBar,
  StyleSheet,
  Pressable,
  View,
  Text,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { Color, FontSize, FontFamily, Padding, Border } from "../GlobalStyles";

const PrivacyPolicy = () => {
  return (
    <View style={styles.privacyPolicy}>
      <StatusBar barStyle="default" />
      <ScrollView
        style={styles.body}
        showsVerticalScrollIndicator={true}
        showsHorizontalScrollIndicator={true}
        contentContainerStyle={styles.bodyScrollViewContent}
      >
        <View style={[styles.frameParent, styles.frameParentSpaceBlock]}>
          <View
            style={[styles.typesOfDataWeCollectParent, styles.parentFlexBox]}
          >
            <Text style={[styles.typesOfData, styles.typesOfDataClr]}>
              1. Types of Data We Collect
            </Text>
            <Text style={[styles.policy1Description, styles.typesOfDataClr]}>
              As a home service provider, we collect the following types of data: your contact information, professional qualifications, business details, and any additional information necessary for your role on our platform.
            </Text>
          </View>
          <View
            style={[styles.useOfYourPersonalDataParent, styles.parentFlexBox]}
          >
            <Text style={[styles.typesOfData, styles.typesOfDataClr]}>
              2. Use of Your Personal Data
            </Text>
            <Text style={[styles.policy1Description, styles.typesOfDataClr]}>
              Your data is used to facilitate service requests, connect you with clients, manage appointments, and ensure compliance with relevant regulations. We also employ your data to personalize your experience, providing you with tailored job recommendations.
            </Text>
          </View>
          <View
            style={[styles.useOfYourPersonalDataParent, styles.parentFlexBox]}
          >
            <Text style={[styles.typesOfData, styles.typesOfDataClr]}>
              3. Account Setup and Verification
            </Text>
            <Text style={[styles.policy1Description, styles.typesOfDataClr]}>
              To set up your service provider account, we require specific information for identity verification. Rest assured that we take the security and confidentiality of your verification documents seriously.
            </Text>
          </View>
          <View
            style={[styles.useOfYourPersonalDataParent, styles.parentFlexBox]}
          >
            <Text style={[styles.typesOfData, styles.typesOfDataClr]}>
              4. Communication
            </Text>
            <Text style={[styles.policy1Description, styles.typesOfDataClr]}>
              We may use your contact information to keep you informed about updates, notifications, and service-related announcements, ensuring you're up-to-date with your service provider activities.            </Text>
          </View>
          <View
            style={[styles.useOfYourPersonalDataParent, styles.parentFlexBox]}
          >
            <Text style={[styles.typesOfData, styles.typesOfDataClr]}>
              5. Disclosure of Data
            </Text>
            <Text style={[styles.policy1Description, styles.typesOfDataClr]}>
              Your data is shared as necessary for the operation of our platform. This includes sharing information with customers seeking services and with partners involved in background checks. We never share your data for marketing purposes.            </Text>
          </View>
          <View
            style={[styles.useOfYourPersonalDataParent, styles.parentFlexBox]}
          >
            <Text style={[styles.typesOfData, styles.typesOfDataClr]}>
              6. Data Retention and Deletion
            </Text>
            <Text style={[styles.policy1Description, styles.typesOfDataClr]}>
              We retain your data for as long as necessary to provide our services and meet legal requirements. If you decide to stop using our app, you can request the deletion of your data, which we will process promptly.            </Text>
          </View>
          <View
            style={[styles.useOfYourPersonalDataParent, styles.parentFlexBox]}
          >
            <Text style={[styles.typesOfData, styles.typesOfDataClr]}>
              7. Security Measures
            </Text>
            <Text style={[styles.policy1Description, styles.typesOfDataClr]}>
              We employ robust security measures to protect your data, including encryption, stringent access controls, and continuous security assessments to maintain the utmost security.            </Text>
          </View>
          <View
            style={[styles.useOfYourPersonalDataParent, styles.parentFlexBox]}
          >
            <Text style={[styles.typesOfData, styles.typesOfDataClr]}>
              8. Legal Compliance
            </Text>
            <Text style={[styles.policy1Description, styles.typesOfDataClr]}>
              Our app is designed to comply with all applicable legal requirements, especially those relevant to home service providers. You can trust that your legal rights and protections are upheld.            </Text>
          </View>
          <View
            style={[styles.useOfYourPersonalDataParent, styles.parentFlexBox]}
          >
            <Text style={[styles.typesOfData, styles.typesOfDataClr]}>
              9. Contact Information
            </Text>
            <Text style={[styles.policy1Description, styles.typesOfDataClr]}>
              If you have questions or concerns regarding your privacy or data access, please don't hesitate to contact us at serbisyouapp@gmail.com. We are committed to addressing your privacy-related inquiries promptly.            </Text>
          </View>
        </View>
      </ScrollView>
      <View style={[styles.navigationBarHome, styles.frameParentSpaceBlock]}>
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
              <View style={styles.badge}>
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
    paddingVertical: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  parentFlexBox: {
    justifyContent: "center",
    alignItems: "center",
  },
  frameParentSpaceBlock: {
    paddingVertical: 0,
    alignSelf: "stretch",
  },
  typesOfDataClr: {
    color: Color.colorGray_1000,
    alignSelf: "stretch",
  },
  labelTypo: {
    marginTop: 4,
    fontSize: FontSize.level2Medium12_size,
    fontFamily: FontFamily.m3LabelLarge,
    fontWeight: "500",
    lineHeight: 16,
    letterSpacing: 1,
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
  typesOfData: {
    fontSize: FontSize.bodyLgBodyLgRegular_size,
    lineHeight: 24,
    textAlign: "left",
    fontFamily: FontFamily.title2Bold32,
    fontWeight: "700",
    color: Color.colorGray_1000,
  },
  policy1Description: {
    fontSize: FontSize.typographyTaglineSmallRegular_size,
    letterSpacing: 0,
    lineHeight: 14,
    fontFamily: FontFamily.title4Regular18,
    textAlign: "justify",
    marginTop: 10,
  },
  typesOfDataWeCollectParent: {
    alignSelf: "stretch",
  },
  useOfYourPersonalDataParent: {
    marginTop: 20,
    alignSelf: "stretch",
  },
  frameParent: {
    paddingHorizontal: Padding.p_3xl,
    justifyContent: "center",
    alignItems: "center",
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
    height: 14,
    position: "absolute",
    fontFamily: FontFamily.m3LabelLarge,
    fontWeight: "500",
    lineHeight: 16,
    letterSpacing: 1,
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
    width: 12,
    height: 12,
    display: "none",
    zIndex: 1,
    position: "absolute",
    overflow: "hidden",
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
    paddingHorizontal: Padding.p_5xs,
    justifyContent: "space-between",
    flexDirection: "row",
    backgroundColor: Color.white,
  },
  privacyPolicy: {
    height: 812,
    width: "100%",
    flex: 1,
    backgroundColor: Color.white,
  },
});

export default PrivacyPolicy;
