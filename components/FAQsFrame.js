import * as React from "react";
import {
  StyleProp,
  ViewStyle,
  Text,
  StyleSheet,
  View,
  ScrollView,
  Animated,
  LayoutAnimation,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { useState, useRef } from "react";
import { Image } from "expo-image";
import { toggleAnimation } from "../animations/toggleAnimation";
import { Padding, Border, FontFamily, FontSize, Color } from "../GlobalStyles";

const FAQsFrame = ({ style }) => {
  const animationController1 = useRef(new Animated.Value(0)).current;
  const animationController2 = useRef(new Animated.Value(0)).current;
  const animationController3 = useRef(new Animated.Value(0)).current;
  const animationController4 = useRef(new Animated.Value(0)).current;

  const [category, setCategory] = useState("");
  const [questions, setQuestions] = useState(false);

  const [inquiry, setInquiry] = useState([
    {
      Question: "I am currently working full-time, can I still apply to become a SerbisYOU Provider?",
      Answer: `Yes, you can apply to become a SerbisYOU Provider with us! All SerbisYOU Providers are independent contractors/freelancers and can decide when to put in their hours.`,
    },
    {
      Question: "How to use SerbisYOU Provider?",
      Answer: `To use SerbisYOU Provider, you first have to submit the necessary documents of your field of expertise in Home Service, such as Plumbing, Electrical, Cleaning, and more. Once you meet the qualifications, you can now accept Home Service bookings by customers. Each of the Home Service Categories have their own corresponding subcategories; for instance, under Cleaning, you'll find options like Standard Cleaning, Deep Cleaning, and more. When you accept a Home Service Booking, you can view the details of their booking such as their desired service category and its subcategory. You can also see your your day to day earnings in the Homescreen and your booking history in a separate screen.`,
    },
    {
      Question: "How do I cancel a booking?",
      Answer: `You can cancel a booking by clicking the cancel button. If ever the customer has already paid during the cancellation, refund negotiations should be done between the customer and service provider. Please do note that last minute cancellation can put you at risk on getting penalized.`,
    },
    {
      Question: "How do I accept a Home Service?",
      Answer: `Once your "Accept Orders" is toggled on, you will be notified if a customer is searching and in need of a provider that matches your Home Service field of expertise. You can choose to accept or decline the request based on your availability and expertise, if you accept the request, you can view the service booking details wherein you can see the customer's desired Home Service request and its corresponding category and subcategory.`,
    },
    {
      Question: "Can I immediately see the designated location of the customer once I accept his/her booking?",
      Answer: `Yes, you can. Once you have accepted the booking, you can view the location of the customer's address through google maps which is integrated within the application.`,
    },
  ]);
  const [account, setAccount] = useState([
    {
      Question: "What personal data does SerbisYOU collect about me?",
      Answer: `When you create an account on SerbisYou, we collect only the information that is necessary to provide you with our services. This includes your name, email address, phone number, and payment information. We do not share your personal information with any third parties without your explicit consent.`,
    },
    {
      Question: "How is my account data stored and secured?",
      Answer: `SerbisYou uses Firestore database security, a fully managed, scalable, and serverless NoSQL document database provided by Google Cloud.Your account data is protected by customizable identity-based security access controls and data validation via a configuration language, integrated with Firebase Authentication and Identity Platform.`,
    },
    {
      Question: "Can I trust SerbisYou with my personal information?",
      Answer: `Yes, you can trust SerbisYou with your personal information. We take the privacy and security of our users' data seriously and have implemented robust measures to protect your information. Additionally, we adhere to industry best practices and comply with relevant data protection regulations to ensure the safety of your personal data.`,
    },
    {
      Question: "How can I update my account information in SerbisYou?",
      Answer: `To update your account information, simply log in to your SerbisYou account and navigate to the "Account Settings" or "Profile" section of the app. From there, you can edit your name, contact information, and other relevant details. Make sure to save your changes before exiting the page.`,
    },
    {
      Question: "Can I access my account from different mobile phones?",
      Answer: `Yes, you can access your account from multiple devices. Firestore and Firebase handle user authentication and session management, allowing you to maintain your user presence across different devices.`,
    },
  ]);
  const [service, setService] = useState([
    {
      Question: "What services can Home Service Providers offer through SerbisYOU Provider?",
      Answer: `Home Service Providers can offer a variety of services through SerbisYOU Provider, such as cleaning, plumbing, electrical work, pet care, handyman, and gardening.`,
    },
    {
      Question: "How can I track my earnings?",
      Answer: `The SerbisYOU Provider app allows you to track your earnings by providing a detailed breakdown of your completed jobs and the corresponding payment for each job. You can also view your earnings history and track your progress over time.`,
    },
    {
      Question: "What if I encounter a problem with a customer or a job?",
      Answer: `If you encounter a problem with a customer or a job, you can contact our customer support team for assistance. We are available 24/7 to help you resolve any issues and ensure that you have a positive experience using the SerbisYOU Provider app.`,
    },
    {
      Question: "How can I improve my chances of getting hired for Home Service jobs?",
      Answer: `To improve your chances of getting hired for Home Service jobs, we recommend that you complete your profile with accurate and up-to-date information, including your skills, experience, and availability. You can also ask your satisfied customers to leave a positive review on the app, which can help you build a strong reputation and attract more customers.`,
    },
    {
      Question: "How does SerbisYOU Provider ensure the safety of Home Service Providers and customers?",
      Answer: `SerbisYOU Provider takes safety seriously and implements measures such as background checks and ratings and reviews to ensure the safety of Home Service Providers and customers.`,
    },
  ]);
  const [payment, setPayment] = useState([
    {
      Question: "How do you ensure the security of transactions?",
      Answer: `We use secure payment gateways and encryption technologies to protect sensitive information such as credit card details. We also comply with industry standards and regulations to ensure the security of transactions.`,
    },
    {
      Question: "What is your refund policy?",
      Answer: `We have a refund policy in place for dissatisfied customers. We offer partial or full refunds, credits for future services, or other remedies depending on the situation. `,
    },
    {
      Question: "How do I get paid for the services I provide through SerbisYOU Provider?",
      Answer: `To get paid for the services provided through SerbisYOU Provider, you can choose from various payment methods such as credit cards, debit cards, bank transfer,GCash, and cash on service. The payment process is secure as the application uses secure payment gateways and encryption technologies to protect sensitive information such as credit card details. The payment tracking feature is available for Home Service Providers, allowing them to track their earnings. The Firestore database used by the application implements security measures such as authentication and authorization to protect personal information.`,
    },
    {
      Question: "Will I get paid overtime?",
      Answer: `No, freelancers are not entitled to receiving overtime. Refer to your Service Agreement for more details.`,
    },
    {
      Question: "How do I cash out my earnings?",
      Answer: `You can go over to your wallet which is located in the profile screen. Once you are in the wallet screen, you can press the Cash Out button after which you will be given a User ID for reference purposes during the cash out process.`,
    },
  ]);

  const [expanded1, setExpanded1] = useState(
    new Array(inquiry.length).fill(false)
  );
  const [expanded2, setExpanded2] = useState(
    new Array(inquiry.length).fill(false)
  );
  const [expanded3, setExpanded3] = useState(
    new Array(inquiry.length).fill(false)
  );
  const [expanded4, setExpanded4] = useState(
    new Array(inquiry.length).fill(false)
  );

  const handleCategoryButtonPress = (category, value) => {
    // setCategory(value);
    if (category === "Property") {
      setCategory(value);
    }
    // } else if (category === "Materials") {
    //   setMaterials(value);
    //   setMaterialsVisible(true);
    // } else if (category === "Area") {
    //   setArea(value);
    //   handleAddButtonVisibility(value);
    // } else if (area === "ten") {
    //   setArea(value);
    //   setAreaVisible1(true);
    //   setAreaVisible2(true);
    //   setAreaVisible3(true);
    //   setAreaVisible4(true);
    //   setAreaVisible5(true);
    //   setAreaVisible6(true);
    // }
  };

  const animationControllers = inquiry.map(() => new Animated.Value(0));

  // const toggleListItem = () => {
  //   const config = {
  //     duration: 300,
  //     toValue: showContent ? 0 : 1,
  //     useNativeDriver: true,
  //   };
  //   Animated.timing(animationController, config).start();
  //   LayoutAnimation.configureNext(toggleAnimation);
  //   setShowContent(!showContent);
  // };

  const toggleListItem1 = (index) => {
    const config = {
      duration: 300,
      toValue: expanded1[index] ? 0 : 1,
      useNativeDriver: true,
    };
    Animated.timing(animationController1, config).start();
    console.log(animationController1);
    LayoutAnimation.configureNext(toggleAnimation);
    // Create a copy of the expanded state array and toggle the item at the specified index
    const newExpanded = [...expanded1];
    newExpanded[index] = !expanded1[index];
    setExpanded1(newExpanded);
  };
  const toggleListItem2 = (index) => {
    const config = {
      duration: 300,
      toValue: expanded2[index] ? 0 : 1,
      useNativeDriver: true,
    };
    Animated.timing(animationController2, config).start();
    console.log(animationController2);
    LayoutAnimation.configureNext(toggleAnimation);
    // Create a copy of the expanded state array and toggle the item at the specified index
    const newExpanded = [...expanded2];
    newExpanded[index] = !expanded2[index];
    setExpanded2(newExpanded);
  };
  const toggleListItem3 = (index) => {
    const config = {
      duration: 300,
      toValue: expanded3[index] ? 0 : 1,
      useNativeDriver: true,
    };
    Animated.timing(animationController3, config).start();
    console.log(animationController3);
    LayoutAnimation.configureNext(toggleAnimation);
    // Create a copy of the expanded state array and toggle the item at the specified index
    const newExpanded = [...expanded3];
    newExpanded[index] = !expanded3[index];
    setExpanded3(newExpanded);
  };
  const toggleListItem4 = (index) => {
    const config = {
      duration: 300,
      toValue: expanded4[index] ? 0 : 1,
      useNativeDriver: true,
    };
    Animated.timing(animationController4, config).start();
    console.log(animationController4);
    LayoutAnimation.configureNext(toggleAnimation);
    // Create a copy of the expanded state array and toggle the item at the specified index
    const newExpanded = [...expanded4];
    newExpanded[index] = !expanded4[index];
    setExpanded4(newExpanded);
  };

  return (
    <ScrollView
      style={[styles.faqsFrame]}
      contentContainerStyle={styles.frameFlexBox}
    >
      <View style={[styles.faqsFrame, style, styles.frameFlexBox]}>
        <ScrollView
          style={styles.chipsLayout}
          horizontal={true}
          contentContainerStyle={styles.containerParentFlexBox1}
        >
          <Pressable
            onPress={() => handleCategoryButtonPress("Property", "General")}
          >
            <View
              style={
                category == "General"
                  ? [styles.view, styles.viewFlexBox8]
                  : [styles.view1, styles.viewFlexBox8]
              }
            >
              <Text
                style={
                  category == "General"
                    ? [styles.general, styles.generalTypo]
                    : [styles.account, styles.generalTypo]
                }
              >
                General
              </Text>
            </View>
          </Pressable>
          <Pressable
            onPress={() => handleCategoryButtonPress("Property", "Account")}
          >
            <View
              style={
                category == "Account"
                  ? [styles.view, styles.viewFlexBox8]
                  : [styles.view1, styles.viewFlexBox8]
              }
            >
              <Text
                style={
                  category == "Account"
                    ? [styles.general, styles.generalTypo]
                    : [styles.account, styles.generalTypo]
                }
              >
                Account
              </Text>
            </View>
          </Pressable>
          <Pressable
            onPress={() => handleCategoryButtonPress("Property", "Service")}
          >
            <View
              style={
                category == "Service"
                  ? [styles.view, styles.viewFlexBox8]
                  : [styles.view1, styles.viewFlexBox8]
              }
            >
              <Text
                style={
                  category == "Service"
                    ? [styles.general, styles.generalTypo]
                    : [styles.account, styles.generalTypo]
                }
              >
                Service
              </Text>
            </View>
          </Pressable>
          <Pressable
            onPress={() => handleCategoryButtonPress("Property", "Payment")}
          >
            <View
              style={
                category == "Payment"
                  ? [styles.view, styles.viewFlexBox8]
                  : [styles.view1, styles.viewFlexBox8]
              }
            >
              <Text
                style={
                  category == "Payment"
                    ? [styles.general, styles.generalTypo]
                    : [styles.account, styles.generalTypo]
                }
              >
                Payment
              </Text>
            </View>
          </Pressable>
        </ScrollView>
        <View style={[styles.textFieldSearch, styles.firstSpaceBlock]}>
          <View style={styles.textField}>
            <View style={[styles.stateLayer, styles.stateLayerPosition]}>
              <View style={[styles.leadingIcon, styles.frameFlexBox]}>
                <View style={[styles.container, styles.containerParentFlexBox]}>
                  <View
                    style={[styles.stateLayer1, styles.containerParentFlexBox]}
                  >
                    <Image
                      style={styles.iconssearch24px}
                      contentFit="cover"
                      source={require("../assets/iconssearch-24px.png")}
                    />
                  </View>
                </View>
              </View>
              <View style={styles.content}>
                <View style={styles.containerParentFlexBox}>
                  <Text style={[styles.labelText1, styles.labelLayout]}>
                    {`Search `}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
        {category === "General" &&
          inquiry.map((item, index) => {
            {/* const arrowTransform = animationControllers[index].interpolate({
              inputRange: [0, 1],
              outputRange: ["0deg", "180deg"],
            }); */}

            return (
              <View
                style={[styles.firstQuestion1, styles.firstSpaceBlock]}
                key={index}
              >
                <View style={styles.totalShadowBox}>
                  <View
                    style={[styles.frameParent, styles.containerParentFlexBox]}
                  >
                    <Pressable
                      style={[
                        styles.titleLabelWrapper,
                        styles.containerParentFlexBox,
                      ]}
                      onPress={() => toggleListItem1(index)}
                    >
                      <View
                        style={[
                          styles.titleLabelWrapper,
                          styles.containerParentFlexBox,
                        ]}
                      >
                        <Text style={[styles.titleLabel, styles.labelLayout]}>
                          {item.Question}
                        </Text>
                      </View>
                      <View
                        style={[
                          styles.polygonDownGroup,
                          styles.containerParentFlexBox,
                        ]}
                      >
                        <Animated.Image
                          style={[
                            styles.polygonIconLayout,
                            {
                              transform: [
                                { rotate: expanded1[index] ? "180deg" : "0deg" },
                              ],
                            },
                          ]}
                          contentFit="cover"
                          source={require("../assets/polygon-up.png")}
                        ></Animated.Image>
                      </View>
                    </Pressable>
                  </View>

                  {expanded1[index] && (
                    <View style={styles.answerFrameFlexBox}>
                      <View
                        style={[styles.answerFrameInner, styles.frameFlexBox]}
                      >
                        <Image
                          style={styles.frameChild}
                          contentFit="cover"
                          source={require("../assets/line-13.png")}
                        />
                      </View>
                      <View
                        style={[
                          styles.titleLabelContainer,
                          styles.containerParentFlexBox,
                        ]}
                      >
                        <Text style={styles.titleLabel1}>{item.Answer}</Text>
                      </View>
                    </View>
                  )}
                </View>
              </View>
            );
          })}
        {category === "Account" &&
          account.map((item, index) => {
            {/* const arrowTransform = animationControllers[index].interpolate({
              inputRange: [0, 1],
              outputRange: ["0deg", "180deg"],
            }); */}

            return (
              <View
                style={[styles.firstQuestion1, styles.firstSpaceBlock]}
                key={index}
              >
                <View style={styles.totalShadowBox}>
                  <View
                    style={[styles.frameParent, styles.containerParentFlexBox]}
                  >
                    <Pressable
                      style={[
                        styles.titleLabelWrapper,
                        styles.containerParentFlexBox,
                      ]}
                      onPress={() => toggleListItem2(index)}
                    >
                      <View
                        style={[
                          styles.titleLabelWrapper,
                          styles.containerParentFlexBox,
                        ]}
                      >
                        <Text style={[styles.titleLabel, styles.labelLayout]}>
                          {item.Question}
                        </Text>
                      </View>
                      <View
                        style={[
                          styles.polygonDownGroup,
                          styles.containerParentFlexBox,
                        ]}
                      >
                        <Animated.Image
                          style={[
                            styles.polygonIconLayout,
                            {
                              transform: [
                                { rotate: expanded2[index] ? "180deg" : "0deg" },
                              ],
                            },
                          ]}
                          contentFit="cover"
                          source={require("../assets/polygon-up.png")}
                        ></Animated.Image>
                      </View>
                    </Pressable>
                  </View>

                  {expanded2[index] && (
                    <View style={styles.answerFrameFlexBox}>
                      <View
                        style={[styles.answerFrameInner, styles.frameFlexBox]}
                      >
                        <Image
                          style={styles.frameChild}
                          contentFit="cover"
                          source={require("../assets/line-13.png")}
                        />
                      </View>
                      <View
                        style={[
                          styles.titleLabelContainer,
                          styles.containerParentFlexBox,
                        ]}
                      >
                        <Text style={styles.titleLabel1}>{item.Answer}</Text>
                      </View>
                    </View>
                  )}
                </View>
              </View>
            );
          })}
          {category === "Service" &&
          service.map((item, index) => {
            {/* const arrowTransform = animationControllers[index].interpolate({
              inputRange: [0, 1],
              outputRange: ["0deg", "180deg"],
            }); */}

            return (
              <View
                style={[styles.firstQuestion1, styles.firstSpaceBlock]}
                key={index}
              >
                <View style={styles.totalShadowBox}>
                  <View
                    style={[styles.frameParent, styles.containerParentFlexBox]}
                  >
                    <Pressable
                      style={[
                        styles.titleLabelWrapper,
                        styles.containerParentFlexBox,
                      ]}
                      onPress={() => toggleListItem3(index)}
                    >
                      <View
                        style={[
                          styles.titleLabelWrapper,
                          styles.containerParentFlexBox,
                        ]}
                      >
                        <Text style={[styles.titleLabel, styles.labelLayout]}>
                          {item.Question}
                        </Text>
                      </View>
                      <View
                        style={[
                          styles.polygonDownGroup,
                          styles.containerParentFlexBox,
                        ]}
                      >
                        <Animated.Image
                          style={[
                            styles.polygonIconLayout,
                            {
                              transform: [
                                { rotate: expanded3[index] ? "180deg" : "0deg" },
                              ],
                            },
                          ]}
                          contentFit="cover"
                          source={require("../assets/polygon-up.png")}
                        ></Animated.Image>
                      </View>
                    </Pressable>
                  </View>

                  {expanded3[index] && (
                    <View style={styles.answerFrameFlexBox}>
                      <View
                        style={[styles.answerFrameInner, styles.frameFlexBox]}
                      >
                        <Image
                          style={styles.frameChild}
                          contentFit="cover"
                          source={require("../assets/line-13.png")}
                        />
                      </View>
                      <View
                        style={[
                          styles.titleLabelContainer,
                          styles.containerParentFlexBox,
                        ]}
                      >
                        <Text style={styles.titleLabel1}>{item.Answer}</Text>
                      </View>
                    </View>
                  )}
                </View>
              </View>
            );
          })}
          {category === "Payment" &&
          payment.map((item, index) => {
            {/* const arrowTransform = animationControllers[index].interpolate({
              inputRange: [0, 1],
              outputRange: ["0deg", "180deg"],
            }); */}

            return (
              <View
                style={[styles.firstQuestion1, styles.firstSpaceBlock]}
                key={index}
              >
                <View style={styles.totalShadowBox}>
                  <View
                    style={[styles.frameParent, styles.containerParentFlexBox]}
                  >
                    <Pressable
                      style={[
                        styles.titleLabelWrapper,
                        styles.containerParentFlexBox,
                      ]}
                      onPress={() => toggleListItem4(index)}
                    >
                      <View
                        style={[
                          styles.titleLabelWrapper,
                          styles.containerParentFlexBox,
                        ]}
                      >
                        <Text style={[styles.titleLabel, styles.labelLayout]}>
                          {item.Question}
                        </Text>
                      </View>
                      <View
                        style={[
                          styles.polygonDownGroup,
                          styles.containerParentFlexBox,
                        ]}
                      >
                        <Animated.Image
                          style={[
                            styles.polygonIconLayout,
                            {
                              transform: [
                                { rotate: expanded4[index] ? "180deg" : "0deg" },
                              ],
                            },
                          ]}
                          contentFit="cover"
                          source={require("../assets/polygon-up.png")}
                        ></Animated.Image>
                      </View>
                    </Pressable>
                  </View>

                  {expanded4[index] && (
                    <View style={styles.answerFrameFlexBox}>
                      <View
                        style={[styles.answerFrameInner, styles.frameFlexBox]}
                      >
                        <Image
                          style={styles.frameChild}
                          contentFit="cover"
                          source={require("../assets/line-13.png")}
                        />
                      </View>
                      <View
                        style={[
                          styles.titleLabelContainer,
                          styles.containerParentFlexBox,
                        ]}
                      >
                        <Text style={styles.titleLabel1}>{item.Answer}</Text>
                      </View>
                    </View>
                  )}
                </View>
              </View>
            );
          })}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  chipsLayout: {
    width: "100%",
    alignSelf: "stretch",
  },
  frameFlexBox: {
    alignItems: "center",
    justifyContent: "flex-start",
  },
  containerParentFlexBox: {
    flexDirection: "row",
  },
  containerParentFlexBox1: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  viewFlexBox8: {
    paddingVertical: Padding.p_3xs,
    paddingHorizontal: Padding.p_mini,
    borderRadius: Border.br_13xl,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  generalTypo: {
    textAlign: "left",
    fontFamily: FontFamily.level2Semibold12,
    fontWeight: "600",
    lineHeight: 22,
    fontSize: FontSize.body1Semibold_size,
  },
  firstSpaceBlock: {
    marginTop: 20,
    alignSelf: "stretch",
  },
  stateLayerPosition: {
    borderTopRightRadius: Border.br_9xs,
    borderTopLeftRadius: Border.br_9xs,
  },
  labelLayout: {
    lineHeight: 24,
    textAlign: "justify",
    flex: 1,
  },
  polygonIconLayout: {
    height: 10,
    width: 12,
    borderRadius: Border.br_12xs,
  },
  answerFrameFlexBox: {
    paddingTop: Padding.p_3xs,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "stretch",
  },
  general: {
    color: Color.m3White,
  },
  view: {
    backgroundColor: Color.colorDarkslateblue_100,
    borderStyle: "solid",
    borderColor: Color.colorDarkslateblue_100,
    borderWidth: 2,
    marginRight: 8,
  },
  account: {
    color: Color.colorDarkslateblue_100,
  },
  view1: {
    borderStyle: "solid",
    borderColor: Color.colorDarkslateblue_100,
    borderWidth: 2,
    marginRight: 8,
  },
  chips: {
    alignSelf: "stretch",
    alignItems: "center",
  },
  iconssearch24px: {
    width: 24,
    height: 24,
  },
  stateLayer1: {
    padding: Padding.p_sm,
    justifyContent: "center",
  },
  container: {
    borderRadius: Border.br_81xl,
    overflow: "hidden",
    justifyContent: "center",
  },
  leadingIcon: {
    width: 48,
    height: 48,
    justifyContent: "center",
  },
  labelText1: {
    fontSize: FontSize.bodyLgBodyLgRegular_size,
    letterSpacing: 1,
    fontFamily: FontFamily.m3BodySmall,
    color: Color.colorGray_900,
  },
  content: {
    height: 40,
    flex: 1,
    justifyContent: "center",
  },
  stateLayer: {
    paddingRight: Padding.p_3xs,
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "stretch",
  },
  textField: {
    borderRadius: Border.br_5xs,
    backgroundColor: Color.colorDarkslateblue_300,
    alignSelf: "stretch",
  },
  textFieldSearch: {
    borderTopRightRadius: Border.br_9xs,
    borderTopLeftRadius: Border.br_9xs,
  },
  titleLabel: {
    fontSize: FontSize.title4Regular18_size,
    fontWeight: "700",
    fontFamily: FontFamily.title2Bold32,
    color: Color.colorGray_1000,
  },
  titleLabelWrapper: {
    flex: 1,
  },
  polygonDownIcon: {
    top: 15,
    left: 15,
    zIndex: 0,
    position: "absolute",
    width: 15,
  },
  polygonUpIcon: {
    top: 0,
    left: 0,
    zIndex: 1,
    position: "absolute",
    width: 15,
    display: "none",
  },
  polygonDownParent: {
    marginLeft: 10,
    justifyContent: "center",
  },
  frameParent: {
    justifyContent: "center",
    alignSelf: "stretch",
  },
  frameChild: {
    maxWidth: "100%",
    maxHeight: "100%",
    width: "100%",
    opacity: 0.3,
    overflow: "hidden",
    flex: 1,
    alignSelf: "stretch",
  },
  answerFrameInner: {
    height: 1,
    justifyContent: "center",
    alignSelf: "stretch",
  },
  titleLabel1: {
    fontSize: FontSize.level2Medium12_size,
    letterSpacing: 0,
    lineHeight: 14,
    fontWeight: "500",
    fontFamily: FontFamily.level2Medium12,
    textAlign: "justify",
    color: Color.colorGray_1000,
    flex: 1,
  },
  titleLabelContainer: {
    marginTop: 10,
    justifyContent: "center",
    alignSelf: "stretch",
  },
  answerFrame: {
    display: "none",
  },
  totalShadowBox: {
    padding: Padding.p_mini,
    shadowOpacity: 1,
    elevation: 4,
    shadowRadius: 4,
    shadowOffset: {
      width: 10,
      height: 4,
    },
    shadowColor: "rgba(0, 0, 0, 1)",
    backgroundColor: Color.m3White,
    borderRadius: Border.br_xl,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "stretch",
  },
  firstQuestion: {
    display: "none",
    justifyContent: "center",
    alignItems: "center",
  },
  polygonDownIcon1: {
    width: 12,
    height: 10,
    borderRadius: Border.br_12xs,
  },
  polygonUpIcon1: {
    // marginLeft: 10,
  },
  polygonDownGroup: {
    marginTop: 6,
    marginLeft: 10,
    justifyContent: "center",
  },
  firstQuestion1: {
    justifyContent: "center",
    alignItems: "center",
  },
  faqsFrame: {
    paddingHorizontal: 3,
    paddingTop: Padding.p_3xs,
    marginBottom: 20,
    paddingBottom: 10,
    flex: 1,
    alignSelf: "stretch",
    backgroundColor: Color.colorWhitesmoke_100,
  },
});

export default FAQsFrame;
