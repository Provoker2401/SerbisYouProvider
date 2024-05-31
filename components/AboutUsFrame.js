import * as React from "react";
import { StyleProp, ViewStyle, Text, StyleSheet, View, ScrollView } from "react-native";
import { FontFamily, FontSize, Color, Padding } from "../GlobalStyles";

const AboutUsFrame = ({ style }) => {
  return (
    <ScrollView
    style={[styles.faqsFrame]}
    contentContainerStyle={styles.frameFlexBox}
    >
      <View style={[styles.aboutUsFrame, style, styles.aboutUsFrameFlexBox]}>
        <View style={styles.aboutUsFrameFlexBox}>
          <Text style={styles.descriptionTypo}>
            Serbisyou is a mobile Android application designed to revolutionize
            the way people book home services. It aims to provide a convenient and
            efficient platform for users to connect with reliable service
            companies in the local area. Whether it's plumbing, electrical work,
            cleaning, gardening, or any other home-related service, Serbisyou
            ensures that users can find the right professionals with just a few
            taps on their mobile devices. Serbisyou aims to enhance the home
            service booking experience by simplifying the process and connecting
            users with reliable service providers in their local area. With its
            user-friendly interface, comprehensive features, and focus on customer
            satisfaction, Serbisyou is set to become the go-to app for convenient
            and efficient home service bookings.
          </Text>
        </View>
        <View
          style={[styles.useOfYourPersonalDataParent, styles.aboutUsFrameFlexBox]}
        >
          <Text style={styles.useOfYour}>Vision</Text>
          <Text style={[styles.policy2Description, styles.descriptionTypo]}>
            Our vision at Serbisyou is to become the leading mobile application
            that reshapes the landscape of home service bookings. We envision a
            future where anyone in need of home-related services can instantly and
            confidently access a network of reputable professionals with the tap
            of a finger. By continuously refining our platform, embracing
            technological advancements, and nurturing strong partnerships within
            local communities, we aspire to establish Serbisyou as the go-to app
            for individuals seeking convenience, reliability, and excellence in
            their home service experiences. Through our unwavering commitment to
            innovation and customer-centricity, we aim to elevate the way people
            engage with service providers and elevate the standards of the home
            service industry as a whole.
          </Text>
        </View>
        <View
          style={[styles.useOfYourPersonalDataParent, styles.aboutUsFrameFlexBox]}
        >
          <Text style={styles.useOfYour}>Mission</Text>
          <Text style={[styles.policy2Description, styles.descriptionTypo]}>
            At Serbisyou, our mission is to transform the way people access and
            experience home services. We are committed to providing a seamless and
            user-friendly mobile platform that empowers individuals to
            effortlessly connect with trusted local service companies. Our goal is
            to simplify the process of booking home services, ensuring that every
            user can easily find skilled professionals for their specific needs.
            Through innovation, convenience, and a dedication to customer
            satisfaction, we strive to enhance the quality of life for our users
            by creating a reliable and efficient solution for all their home
            service requirements.
          </Text>
        </View>
      </View>
    </ScrollView>

  );
};

const styles = StyleSheet.create({
  aboutUsFrameFlexBox: {
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "stretch",
  },
  descriptionTypo: {
    textAlign: "justify",
    fontFamily: FontFamily.title4Regular18,
    lineHeight: 14,
    letterSpacing: 0,
    fontSize: FontSize.typographyTaglineSmallRegular_size,
    color: Color.colorGray_1000,
    alignSelf: "stretch",
  },
  useOfYour: {
    fontSize: FontSize.bodyLgBodyLgRegular_size,
    lineHeight: 24,
    fontWeight: "700",
    fontFamily: FontFamily.title2Bold32,
    textAlign: "left",
    color: Color.colorGray_1000,
    alignSelf: "stretch",
  },
  policy2Description: {
    marginTop: 10,
  },
  useOfYourPersonalDataParent: {
    marginTop: 20,
  },
  aboutUsFrame: {
    paddingHorizontal: 3,
    paddingVertical: Padding.p_xl,
    flex: 1,
  },
  faqsFrame: {
    flex: 1,
    alignSelf: "stretch",
    backgroundColor: Color.colorWhitesmoke_100,
  },
  frameFlexBox: {
    alignItems: "center",
    justifyContent: "center",
  },
});

export default AboutUsFrame;
