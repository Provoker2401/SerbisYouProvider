import * as React from "react";
import {
  StatusBar,
  StyleSheet,
  Pressable,
  View,
  Text,
  ScrollView,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { useNavigation } from "@react-navigation/native";
import { Color, FontSize, Padding, FontFamily } from "../GlobalStyles";

const CashOutBalance = ({ route }) => {
  const navigation = useNavigation();

  const { shortUserID } = route.params;

  return (
    <View style={[styles.cashOutBalance, styles.bodyBg]}>
      <StatusBar barStyle="default" />
      <ScrollView
        style={[styles.body, styles.bodyBg]}
        showsVerticalScrollIndicator={true}
        showsHorizontalScrollIndicator={true}
        contentContainerStyle={styles.bodyScrollViewContent}
      >
        <View style={styles.frameParent}>
          <View style={[styles.clockWrapper, styles.bodyInnerSpaceBlock]}>
            <View style={styles.clock}>
              <Image
                style={styles.vectorIcon}
                contentFit="cover"
                source={require("../assets/vector1.png")}
              />
            </View>
          </View>
          <View style={styles.linkedMethodsFrame}>
            <Text style={[styles.referToYour, styles.nf070601Clr]}>
              Refer to your user ID to complete the payment
            </Text>
          </View>
        </View>
        <View style={[styles.bodyInner, styles.bodyWrapperFlexBox]}>
          <Image
            style={styles.frameChild}
            contentFit="cover"
            source={require("../assets/line-84.png")}
          />
        </View>
        <View style={[styles.userIdWrapper, styles.bodyWrapperFlexBox]}>
          <Text style={styles.userId}>User ID</Text>
        </View>
        <View style={[styles.nf070601Wrapper, styles.bodyWrapperFlexBox]}>
          <Text style={[styles.nf070601, styles.nf070601Clr]}>
            {shortUserID.toUpperCase()}
          </Text>
        </View>
        <View style={[styles.bodyChild, styles.bodyWrapperFlexBox]}>
          <Pressable
            style={styles.backToWalletWrapper}
            onPress={() => navigation.navigate("Wallet")}
          >
            <Text style={styles.backToWallet}>Back to Wallet</Text>
          </Pressable>
        </View>
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
    paddingHorizontal: 0,
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  bodyBg: {
    backgroundColor: Color.colorWhitesmoke_100,
    flex: 1,
  },
  cashOutTypo: {
    fontWeight: "700",
    fontSize: FontSize.title3Bold20_size,
    flex: 1,
  },
  bodyInnerSpaceBlock: {
    paddingHorizontal: 0,
    justifyContent: "center",
  },
  nf070601Clr: {
    color: Color.colorGray90,
    textAlign: "center",
  },
  bodyWrapperFlexBox: {
    marginTop: 5,
    alignItems: "center",
    alignSelf: "stretch",
  },
  vectorIcon: {
    width: 50,
    height: 50,
  },
  clock: {
    padding: Padding.p_9xs,
    justifyContent: "center",
    overflow: "hidden",
    alignItems: "center",
    flexDirection: "row",
  },
  clockWrapper: {
    paddingVertical: Padding.p_3xs,
    alignItems: "center",
    flexDirection: "row",
    alignSelf: "stretch",
  },
  referToYour: {
    fontSize: FontSize.size_lg,
    fontFamily: FontFamily.typographyParagraphSmallMedium,
    fontWeight: "500",
    alignSelf: "stretch",
  },
  linkedMethodsFrame: {
    marginTop: 10,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "stretch",
  },
  frameParent: {
    paddingHorizontal: Padding.p_3xl,
    paddingTop: Padding.p_mini,
    paddingBottom: Padding.p_3xs,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "stretch",
  },
  frameChild: {
    width: 382,
    height: 1,
  },
  bodyInner: {
    paddingVertical: Padding.p_8xs,
    paddingHorizontal: 0,
    justifyContent: "center",
  },
  userId: {
    fontSize: FontSize.size_mid,
    fontFamily: FontFamily.level2Medium12,
    color: Color.colorGray80,
    fontWeight: "500",
    textAlign: "center",
    flex: 1,
  },
  userIdWrapper: {
    paddingTop: Padding.p_11xl,
    paddingBottom: Padding.p_8xs,
    justifyContent: "center",
    flexDirection: "row",
  },
  nf070601: {
    fontFamily: FontFamily.georamaBold,
    fontWeight: "700",
    fontSize: FontSize.title3Bold20_size,
    flex: 1,
  },
  nf070601Wrapper: {
    flexDirection: "row",
  },
  backToWallet: {
    fontSize: FontSize.size_3xl,
    fontWeight: "600",
    fontFamily: FontFamily.levelSemibold14,
    color: Color.colorDeepskyblue_100,
    width: 387,
    textAlign: "center",
  },
  backToWalletWrapper: {
    alignItems: "center",
    flexDirection: "row",
  },
  bodyChild: {
    paddingTop: 50,
    flexDirection: "row",
  },
  body: {
    alignSelf: "stretch",
    flex: 1,
  },
  cashOutBalance: {
    height: 877,
    width: "100%",
    flex: 1,
  },
});

export default CashOutBalance;
