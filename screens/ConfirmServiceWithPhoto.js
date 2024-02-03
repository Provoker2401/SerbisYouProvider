import * as React from "react";
import {
  StatusBar,
  StyleSheet,
  Text,
  View,
  Pressable,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { useNavigation } from "@react-navigation/native";
import { FontSize, Color, Padding, Border, FontFamily } from "../GlobalStyles";

const ConfirmServiceWithPhoto = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.confirmServiceWithPhoto}>
      <StatusBar barStyle="default" />
      <ScrollView
        style={styles.body}
        indicatorStyle="default"
        showsVerticalScrollIndicator={true}
        showsHorizontalScrollIndicator={false}
        pagingEnabled={false}
        contentContainerStyle={styles.bodyScrollViewContent}
      >
        <View style={[styles.bodyInner, styles.frameInnerFlexBox]}>
          <View style={[styles.frameGroup, styles.frameSpaceBlock]}>
            <View style={styles.bookingFlexBox}>
              <View
                style={[
                  styles.bookingDetailsLabel,
                  styles.dateAndTimeFrame1FlexBox,
                ]}
              >
                <Text style={[styles.totalPayment, styles.textFlexBox]}>
                  Total Payment
                </Text>
              </View>
              <View style={[styles.bookingDetailsLabel1, styles.frameFlexBox1]}>
                <View style={styles.wrapper}>
                  <Text style={[styles.text, styles.textTypo1]}>₱6040.00</Text>
                </View>
              </View>
              <View style={[styles.addressFrame, styles.frameFlexBox1]}>
                <View style={styles.collectCashFromCustomerWrapper}>
                  <Text style={styles.collectCashFrom}>
                    Collect cash from customer
                  </Text>
                </View>
              </View>
            </View>
            <View
              style={[styles.bookingDetailsLabelGroup, styles.bookingFlexBox]}
            >
              <View style={styles.bookingDetailsLabel2}>
                <Text style={[styles.proofOfCompleted, styles.textTypo1]}>
                  Proof of Completed Service
                </Text>
              </View>
              <View style={styles.subcategoriesFrame}>
                <View
                  style={[styles.dateAndTimeFrame, styles.frameInnerFlexBox]}
                >
                  <Pressable style={[styles.frame, styles.frameInnerFlexBox]}>
                    <Text style={styles.delete}>Delete</Text>
                  </Pressable>
                </View>
              </View>
              <View style={styles.subcategoriesFrame}>
                <View
                  style={[
                    styles.dateAndTimeFrame1,
                    styles.dateAndTimeFrame1FlexBox,
                  ]}
                >
                  <View style={styles.bookingDetailsLabel2}>
                    <View style={styles.frameParent}>
                      <View
                        style={[styles.frameWrapper, styles.frameSpaceBlock]}
                      >
                        <View style={styles.wrapper}>
                          <View
                            style={[styles.frameWrapper2, styles.frameFlexBox]}
                          >
                            <View style={styles.bookingDetailsLabel2}>
                              <Text style={[styles.text1, styles.text1Text]}>
                                2
                              </Text>
                            </View>
                          </View>
                        </View>
                      </View>
                      <View style={styles.frameFrame}>
                        <View style={styles.bookingDetailsLabel2}>
                          <Text style={[styles.toiletSystem, styles.text1Text]}>
                            Toilet System
                          </Text>
                        </View>
                      </View>
                    </View>
                    <View style={styles.frameParent1}>
                      <View
                        style={[styles.frameWrapper, styles.frameSpaceBlock]}
                      >
                        <View style={styles.wrapper}>
                          <View
                            style={[styles.frameWrapper2, styles.frameFlexBox]}
                          >
                            <View style={styles.bookingDetailsLabel2}>
                              <Text style={[styles.text1, styles.text1Text]}>
                                2
                              </Text>
                            </View>
                          </View>
                        </View>
                      </View>
                      <View style={styles.frameFrame}>
                        <View style={styles.bookingDetailsLabel2}>
                          <Text style={[styles.toiletSystem, styles.text1Text]}>
                            Septic Tank Cleaning
                          </Text>
                        </View>
                      </View>
                    </View>
                    <View style={styles.frameParent1}>
                      <View
                        style={[styles.frameWrapper, styles.frameSpaceBlock]}
                      >
                        <View style={styles.wrapper}>
                          <View
                            style={[styles.frameWrapper2, styles.frameFlexBox]}
                          >
                            <View style={styles.bookingDetailsLabel2}>
                              <Text style={[styles.text1, styles.text1Text]}>
                                2
                              </Text>
                            </View>
                          </View>
                        </View>
                      </View>
                      <View style={styles.frameWrapper10}>
                        <View style={styles.bookingDetailsLabel2}>
                          <Text style={[styles.toiletSystem, styles.text1Text]}>
                            Cage or Habitat Cleaning
                          </Text>
                        </View>
                      </View>
                    </View>
                    <View style={styles.frameParent1}>
                      <View
                        style={[styles.frameWrapper, styles.frameSpaceBlock]}
                      >
                        <View style={styles.wrapper}>
                          <View
                            style={[styles.frameWrapper2, styles.frameFlexBox]}
                          >
                            <View style={styles.bookingDetailsLabel2}>
                              <Text style={[styles.text1, styles.text1Text]}>
                                2
                              </Text>
                            </View>
                          </View>
                        </View>
                      </View>
                      <View style={styles.frameFrame}>
                        <View style={styles.bookingDetailsLabel2}>
                          <Text style={[styles.toiletSystem, styles.text1Text]}>
                            Toilet System
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                  <View
                    style={[styles.frameWrapper15, styles.frameWrapperFlexBox]}
                  >
                    <View style={styles.frame5}>
                      <Text style={styles.textTypo}>₱2000.00</Text>
                    </View>
                  </View>
                </View>
                <View style={[styles.dateAndTimeFrame2, styles.viewFlexBox]}>
                  <View style={styles.collectCashFromCustomerWrapper}>
                    <View style={styles.frame6}>
                      <Text
                        style={[styles.addAPhoto, styles.requiredTypo]}
                      >{`Add a photo as proof of 
completed service`}</Text>
                    </View>
                    <View style={styles.frameFlexBox1}>
                      <Text style={[styles.required, styles.requiredTypo]}>
                        *Required
                      </Text>
                    </View>
                  </View>
                  <View
                    style={[
                      styles.dateAndTimeFrameInner,
                      styles.frameInnerFlexBox,
                    ]}
                  >
                    <View
                      style={[styles.frameWrapper16, styles.frameInnerFlexBox]}
                    >
                      <View style={[styles.frameChild, styles.frameFlexBox]} />
                    </View>
                  </View>
                  <View
                    style={[styles.frameWrapper17, styles.frameWrapperFlexBox]}
                  >
                    <View style={styles.frame6}>
                      <Text style={[styles.text6, styles.textTypo]}>
                        ₱1500.00
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
      <View
        style={[styles.confirmServiceWithPhotoInner, styles.frameInnerFlexBox]}
      >
        <View style={styles.bookingDetailsLabel2}>
          <Pressable
            style={styles.viewTimelineBtn}
            onPress={() => navigation.navigate("NewBooking")}
          >
            <Text style={[styles.viewAllServices, styles.textTypo1]}>
              Confirm Completed Service
            </Text>
          </Pressable>
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
    paddingHorizontal: 2,
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "flex-end",
  },
  viewFlexBox: {
    paddingHorizontal: 0,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    alignSelf: "stretch",
  },
  text1Typo: {
    fontSize: FontSize.paragraphMedium15_size,
    color: Color.m3White,
  },
  frameInnerFlexBox: {
    justifyContent: "flex-end",
    alignItems: "center",
  },
  frameSpaceBlock: {
    paddingVertical: 0,
    justifyContent: "center",
  },
  dateAndTimeFrame1FlexBox: {
    paddingVertical: Padding.p_8xs,
    paddingHorizontal: 0,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "stretch",
  },
  textFlexBox: {
    display: "flex",
    color: Color.colorDarkslateblue_100,
    textAlign: "left",
    alignItems: "center",
  },
  frameFlexBox1: {
    marginTop: 5,
    alignItems: "center",
    flexDirection: "row",
    alignSelf: "stretch",
  },
  textTypo1: {
    fontSize: FontSize.title3Bold20_size,
    flex: 1,
  },
  bookingFlexBox: {
    padding: Padding.p_8xs,
    justifyContent: "center",
    alignSelf: "stretch",
    backgroundColor: Color.m3White,
  },
  frameFlexBox: {
    backgroundColor: Color.colorDarkslateblue_200,
    borderRadius: Border.br_5xs,
    justifyContent: "center",
    alignItems: "center",
  },
  text1Text: {
    textTransform: "capitalize",
    textAlign: "center",
  },
  frameWrapperFlexBox: {
    alignItems: "flex-end",
    width: 68,
    display: "none",
    justifyContent: "center",
  },
  requiredTypo: {
    fontSize: FontSize.levelSemibold14_size,
    flex: 1,
  },
  textTypo: {
    color: Color.neutral07,
    lineHeight: 16,
    fontSize: FontSize.level2Medium12_size,
    textAlign: "right",
    fontFamily: FontFamily.interRegular,
    flex: 1,
  },
  totalPayment: {
    fontFamily: FontFamily.workSansSemiBold,
    fontWeight: "600",
    color: Color.colorDarkslateblue_100,
    alignSelf: "stretch",
    fontSize: FontSize.size_lg,
    flex: 1,
  },
  bookingDetailsLabel: {
    flexDirection: "row",
  },
  text: {
    fontFamily: FontFamily.workSansBold,
    height: 23,
    display: "flex",
    color: Color.colorDarkslateblue_100,
    textAlign: "left",
    alignItems: "center",
    fontWeight: "700",
    fontSize: FontSize.title3Bold20_size,
  },
  wrapper: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    flex: 1,
  },
  bookingDetailsLabel1: {
    paddingTop: Padding.p_8xs,
    justifyContent: "center",
  },
  collectCashFrom: {
    fontFamily: FontFamily.workSansMedium,
    color: Color.lightLabelPrimary,
    textAlign: "left",
    fontWeight: "500",
    fontSize: FontSize.size_lg,
    alignSelf: "stretch",
  },
  collectCashFromCustomerWrapper: {
    justifyContent: "center",
    flex: 1,
  },
  addressFrame: {
    paddingBottom: Padding.p_8xs,
    justifyContent: "center",
  },
  proofOfCompleted: {
    display: "flex",
    color: Color.colorDarkslateblue_100,
    textAlign: "left",
    alignItems: "center",
    fontFamily: FontFamily.workSansSemiBold,
    fontWeight: "600",
    alignSelf: "stretch",
  },
  bookingDetailsLabel2: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    alignSelf: "stretch",
  },
  delete: {
    fontFamily: FontFamily.levelSemibold14,
    color: "#f50808",
    textAlign: "right",
    fontSize: FontSize.levelSemibold14_size,
    fontWeight: "600",
  },
  frame: {
    paddingRight: Padding.p_5xs,
    flexDirection: "row",
  },
  dateAndTimeFrame: {
    flexDirection: "row",
    alignSelf: "stretch",
  },
  subcategoriesFrame: {
    justifyContent: "center",
    alignSelf: "stretch",
  },
  text1: {
    fontFamily: FontFamily.workSansRegular,
    fontSize: FontSize.paragraphMedium15_size,
    color: Color.m3White,
  },
  frameWrapper2: {
    width: 30,
    height: 30,
  },
  frameWrapper: {
    width: 38,
    paddingHorizontal: Padding.p_9xs,
    alignItems: "center",
    flexDirection: "row",
  },
  toiletSystem: {
    fontSize: FontSize.levelSemibold14_size,
    flex: 1,
    color: Color.lightLabelPrimary,
    fontFamily: FontFamily.interRegular,
  },
  frameFrame: {
    marginTop: 7,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "stretch",
  },
  frameParent: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  frameParent1: {
    marginLeft: 7,
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  frameWrapper10: {
    width: 78,
    marginTop: 7,
    justifyContent: "center",
    alignItems: "center",
  },
  frame5: {
    display: "none",
    alignItems: "center",
    flexDirection: "row",
    alignSelf: "stretch",
  },
  frameWrapper15: {
    marginTop: 7,
  },
  dateAndTimeFrame1: {
    display: "none",
  },
  addAPhoto: {
    color: Color.lightLabelPrimary,
    textAlign: "left",
    fontFamily: FontFamily.interRegular,
  },
  frame6: {
    alignItems: "center",
    flexDirection: "row",
    alignSelf: "stretch",
  },
  required: {
    color: Color.colorDarkgray_100,
    textAlign: "left",
    fontFamily: FontFamily.level2Medium12,
    fontWeight: "500",
  },
  frameChild: {
    width: 60,
    height: 60,
  },
  frameWrapper16: {
    flexDirection: "row",
    flex: 1,
  },
  dateAndTimeFrameInner: {
    paddingLeft: Padding.p_9xs,
    marginLeft: 7,
    flexDirection: "row",
    flex: 1,
  },
  text6: {
    display: "none",
  },
  frameWrapper17: {
    marginLeft: 7,
  },
  dateAndTimeFrame2: {
    paddingVertical: Padding.p_10xs,
  },
  bookingDetailsLabelGroup: {
    marginTop: 10,
  },
  frameGroup: {
    paddingHorizontal: Padding.p_3xs,
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
    fontFamily: FontFamily.title2Bold32,
    fontSize: FontSize.title3Bold20_size,
    fontWeight: "700",
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
  confirmServiceWithPhotoInner: {
    padding: Padding.p_mini,
    alignSelf: "stretch",
    backgroundColor: Color.m3White,
  },
  confirmServiceWithPhoto: {
    backgroundColor: Color.colorWhitesmoke_200,
    width: "100%",
    height: 812,
    flex: 1,
  },
});

export default ConfirmServiceWithPhoto;
