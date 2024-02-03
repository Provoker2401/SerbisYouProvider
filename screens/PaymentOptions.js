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
import { useNavigation } from "@react-navigation/native";
import { Padding, Color, FontSize, FontFamily, Border } from "../GlobalStyles";

const PaymentOptions = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.paymentOptions}>
      <StatusBar barStyle="default" />
      <ScrollView
        style={styles.body}
        showsVerticalScrollIndicator={true}
        showsHorizontalScrollIndicator={true}
        contentContainerStyle={styles.bodyScrollViewContent}
      >
        <View style={[styles.frameParent, styles.frameFlexBox1]}>
          <View style={[styles.linkedMethodsWrapper, styles.wrapperSpaceBlock]}>
            <Text style={styles.linkedMethods}>Linked Methods</Text>
          </View>
          <View style={styles.methodsFrameFlexBox}>
            <View style={styles.mastercardFrame}>
              <View style={styles.mastercardJpeg0Wrapper}>
                <Image
                  style={styles.mastercardJpeg0}
                  contentFit="cover"
                  source={require("../assets/mastercard--jpeg-0.png")}
                />
              </View>
              <View style={styles.cardsWrapperFlexBox}>
                <Text style={styles.mastercardXxxx4493}>
                  Mastercard xxxx 4493
                </Text>
                <Text style={styles.expires1528}>Expires 15/28</Text>
              </View>
              <Pressable style={styles.tripleDotBtn}>
                <View style={styles.ellipseParent}>
                  <Image
                    style={styles.frameLayout}
                    contentFit="cover"
                    source={require("../assets/ellipse-19.png")}
                  />
                  <Image
                    style={[styles.frameItem, styles.frameLayout]}
                    contentFit="cover"
                    source={require("../assets/ellipse-19.png")}
                  />
                  <Image
                    style={[styles.frameItem, styles.frameLayout]}
                    contentFit="cover"
                    source={require("../assets/ellipse-19.png")}
                  />
                </View>
              </Pressable>
            </View>
            <View style={[styles.paypalFrame, styles.frameFlexBox]}>
              <View style={[styles.image2373Wrapper, styles.wrapperSpaceBlock]}>
                <Image
                  style={styles.image2373Icon}
                  contentFit="cover"
                  source={require("../assets/image-2373.png")}
                />
              </View>
              <View style={styles.cardsWrapperFlexBox}>
                <Text style={styles.mastercardXxxx4493}>
                  PayPal xxxx 690690
                </Text>
                <Text style={styles.expires1528}>Expires 16/23</Text>
              </View>
              <Pressable style={styles.tripleDotBtn}>
                <View style={styles.ellipseParent}>
                  <Image
                    style={styles.frameLayout}
                    contentFit="cover"
                    source={require("../assets/ellipse-19.png")}
                  />
                  <Image
                    style={[styles.frameItem, styles.frameLayout]}
                    contentFit="cover"
                    source={require("../assets/ellipse-19.png")}
                  />
                  <Image
                    style={[styles.frameItem, styles.frameLayout]}
                    contentFit="cover"
                    source={require("../assets/ellipse-19.png")}
                  />
                </View>
              </Pressable>
            </View>
          </View>
        </View>
        <View style={[styles.frameGroup, styles.frameFlexBox1]}>
          <View style={[styles.linkedMethodsWrapper, styles.wrapperSpaceBlock]}>
            <Text style={styles.linkedMethods}>Add methods</Text>
          </View>
          <View style={[styles.addMethodsFrame, styles.methodsFrameFlexBox]}>
            <Pressable style={styles.mastercardFrame}>
              <View style={styles.vectorWrapper}>
                <Image
                  style={styles.vectorIcon}
                  contentFit="cover"
                  source={require("../assets/vector1.png")}
                />
              </View>
              <View style={styles.cardsWrapperFlexBox}>
                <Text style={styles.mastercardXxxx4493}>Bank Account</Text>
              </View>
            </Pressable>
            <Pressable
              style={[styles.cardsFrame, styles.frameFlexBox]}
              onPress={() => navigation.navigate("AddCard")}
            >
              <View style={styles.vectorWrapper}>
                <Image
                  style={styles.vectorIcon1}
                  contentFit="cover"
                  source={require("../assets/vector2.png")}
                />
              </View>
              <View style={[styles.cardsWrapper, styles.cardsWrapperFlexBox]}>
                <Text style={styles.mastercardXxxx4493}>Cards</Text>
              </View>
            </Pressable>
            <Pressable style={[styles.paypalFrame, styles.frameFlexBox]}>
              <View style={styles.vectorWrapper}>
                <Image
                  style={styles.vectorIcon}
                  contentFit="cover"
                  source={require("../assets/image-2387.png")}
                />
              </View>
              <View style={[styles.cardsWrapper, styles.cardsWrapperFlexBox]}>
                <Text style={styles.mastercardXxxx4493}>Gcash</Text>
              </View>
            </Pressable>
            <Pressable style={[styles.paypalFrame1, styles.frameFlexBox]}>
              <View style={[styles.image2373Wrapper, styles.wrapperSpaceBlock]}>
                <Image
                  style={styles.image2373Icon}
                  contentFit="cover"
                  source={require("../assets/image-2373.png")}
                />
              </View>
              <View style={styles.cardsWrapperFlexBox}>
                <Text style={styles.mastercardXxxx4493}>PayPal</Text>
              </View>
            </Pressable>
          </View>
        </View>
      </ScrollView>
      <View style={styles.navigationBarHome}>
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
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  frameFlexBox1: {
    paddingHorizontal: Padding.p_3xl,
    paddingVertical: Padding.p_3xs,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "stretch",
  },
  wrapperSpaceBlock: {
    paddingHorizontal: 0,
    alignItems: "center",
  },
  frameLayout: {
    height: 2,
    width: 2,
  },
  frameFlexBox: {
    marginTop: 20,
    paddingHorizontal: Padding.p_xs,
    alignItems: "center",
    flexDirection: "row",
    alignSelf: "stretch",
    backgroundColor: Color.white,
  },
  methodsFrameFlexBox: {
    marginTop: 10,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "stretch",
  },
  cardsWrapperFlexBox: {
    marginLeft: 16,
    justifyContent: "center",
    flex: 1,
  },
  labelTypo: {
    marginTop: 4,
    fontSize: FontSize.level2Medium12_size,
    fontFamily: FontFamily.m3LabelLarge,
    lineHeight: 16,
    letterSpacing: 1,
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
    width: 26,
    height: 30,
    overflow: "hidden",
  },
  linkedMethods: {
    color: Color.colorGray80,
    textAlign: "left",
    fontSize: FontSize.bodyLgBodyLgRegular_size,
    fontFamily: FontFamily.title2Bold32,
    fontWeight: "700",
    flex: 1,
  },
  linkedMethodsWrapper: {
    paddingVertical: Padding.p_3xs,
    justifyContent: "center",
    flexDirection: "row",
    alignSelf: "stretch",
  },
  mastercardJpeg0: {
    width: 40,
    height: 40,
  },
  mastercardJpeg0Wrapper: {
    padding: Padding.p_8xs,
    justifyContent: "center",
    flexDirection: "row",
  },
  mastercardXxxx4493: {
    fontFamily: FontFamily.typographyParagraphSmallMedium,
    color: Color.colorGray90,
    width: 250,
    fontWeight: "500",
    textAlign: "left",
    fontSize: FontSize.bodyLgBodyLgRegular_size,
  },
  expires1528: {
    fontSize: FontSize.typographyTaglineSmallRegular_size,
    fontFamily: FontFamily.typographyTaglineSmallRegular,
    color: Color.colorGray60,
    width: 256,
    marginTop: 2,
    textAlign: "left",
  },
  frameItem: {
    marginTop: 2,
  },
  ellipseParent: {
    justifyContent: "center",
  },
  tripleDotBtn: {
    paddingVertical: Padding.p_9xs,
    paddingHorizontal: Padding.p_5xs,
    marginLeft: 16,
    overflow: "hidden",
    alignItems: "center",
    flexDirection: "row",
  },
  mastercardFrame: {
    paddingHorizontal: Padding.p_xs,
    paddingVertical: Padding.p_3xs,
    alignItems: "center",
    flexDirection: "row",
    alignSelf: "stretch",
    backgroundColor: Color.white,
  },
  image2373Icon: {
    width: 50,
    height: 38,
  },
  image2373Wrapper: {
    paddingVertical: Padding.p_7xs,
  },
  paypalFrame: {
    paddingVertical: Padding.p_3xs,
  },
  frameParent: {
    paddingVertical: Padding.p_3xs,
  },
  vectorIcon: {
    height: 30,
    width: 30,
  },
  vectorWrapper: {
    padding: Padding.p_3xs,
    alignItems: "center",
  },
  vectorIcon1: {
    height: 28,
    width: 30,
  },
  cardsWrapper: {
    paddingLeft: Padding.p_12xs_5,
  },
  cardsFrame: {
    paddingVertical: Padding.p_2xs,
  },
  paypalFrame1: {
    display: "none",
    paddingVertical: Padding.p_3xs,
  },
  addMethodsFrame: {
    paddingBottom: Padding.p_xl,
  },
  frameGroup: {
    marginTop: 15,
    paddingVertical: Padding.p_3xs,
  },
  body: {
    backgroundColor: Color.colorWhitesmoke_100,
    alignSelf: "stretch",
    flex: 1,
  },
  stateFlexBox: {
    paddingHorizontal: Padding.p_xl,
    height: 32,
    width: 64,
    paddingVertical: Padding.p_9xs,
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
    lineHeight: 16,
    letterSpacing: 1,
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
    width: 12,
    height: 12,
    zIndex: 1,
    position: "absolute",
    display: "none",
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
    paddingVertical: 0,
    justifyContent: "space-between",
    paddingHorizontal: Padding.p_5xs,
    flexDirection: "row",
    alignSelf: "stretch",
    backgroundColor: Color.white,
  },
  paymentOptions: {
    height: 812,
    width: "100%",
    flex: 1,
    backgroundColor: Color.white,
  },
});

export default PaymentOptions;
