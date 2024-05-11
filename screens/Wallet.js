import { useEffect, useState } from "react";
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
import { Color, FontFamily, FontSize, Padding, Border } from "../GlobalStyles";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  setDoc,
  addDoc,
  updateDoc
} from "firebase/firestore";
import Toast from "react-native-toast-message";

const Wallet = () => {
  const navigation = useNavigation();
  const [walletValue, setWalletValue] = useState(null);
  const [userTransactions, setUserTransactions] = useState([]);

  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
  });

  // useEffect(() => {
  //   fetchData(); // Call the fetchData function when the component mounts
  //   fetchUserTransactions();
  // }, []); // Empty dependency array to run the effect only once on mount

  // const fetchData = async () => {
  //   try {
  //     const db = getFirestore();
  //     const auth = getAuth();
  //     const user = auth.currentUser;
  //     const userProfilesCollection = collection(db, "providerProfiles");
  //     const userDocRef = doc(userProfilesCollection, user.uid);

      

  //     // Fetch data from the "userWallet" collection
  //     const userWalletCollection = collection(userDocRef, "userWallet");
  //     const userWalletQuery = query(userWalletCollection);
  //     const userWalletDocs = await getDocs(userWalletQuery);

  //     if (userWalletDocs.size === 1) {
  //       const userWalletDoc = userWalletDocs.docs[0];
  //       const userWalletDocData = userWalletDoc.data(); // Retrieve document data

  //       // Assuming 'wallet' is a field in the document
  //       const walletValue = userWalletDocData.wallet;

  //       setWalletValue(walletValue); // Set the wallet value in the component state
  //     } else {
  //       console.log("No or multiple documents found in userWallet.");
  //     }
  //   } catch (error) {
  //     console.error("Error fetching wallet data from Firestore:", error);
  //   }
  // };


  

  // const fetchUserTransactions = async () => {
  //   try {
  //     const db = getFirestore();
  //     const auth = getAuth();
  //     const user = auth.currentUser;
  //     const userProfilesCollection = collection(db, "providerProfiles");
  //     const userDocRef = doc(userProfilesCollection, user.uid);

  //     // Fetch data from the "userWallet" collection
  //     const userWalletCollection = collection(userDocRef, "userWallet");
  //     const userWalletQuery = query(userWalletCollection);
  //     const userWalletDocs = await getDocs(userWalletQuery);

  //     if (userWalletDocs.size === 1) {
  //       const userWalletDoc = userWalletDocs.docs[0];
  //       const userWalletDocData = userWalletDoc.data();

  //       // Assuming 'transactions' is the field containing the array of transactions
  //       const transactionsArray = userWalletDocData.transactions || [];
  //       setUserTransactions(transactionsArray);
  //       console.log("User Transactions:", transactionsArray);

  //       // You can now use the transactionsArray in your component state or for rendering
  //     } else {
  //       console.log("No or multiple documents found in userWallet.");
  //     }
  //   } catch (error) {
  //     console.error("Error fetching user transactions:", error);
  //   }
  // };


  // const handleCashOut = async () => {
  //   try {
  //     if (walletValue !== 0) {
  //       const db = getFirestore();
  //       const auth = getAuth();
  //       const user = auth.currentUser;
  //       const userProfilesCollection = collection(db, "providerProfiles");
  //       const userDocRef = doc(userProfilesCollection, user.uid);
  
  //       const userID = user.uid;
  
  //       // Fetch data from the "userWallet" collection
  //       const userWalletCollection = collection(userDocRef, "userWallet");
  //       const userWalletQuery = query(userWalletCollection);
  //       const userWalletDocs = await getDocs(userWalletQuery);
  
  //       if (userWalletDocs.size === 1) {
  //         const userWalletDoc = userWalletDocs.docs[0];
  //         const userWalletDocData = userWalletDoc.data();
  
  //         // Assuming 'wallet' is a field in the document
  //         const currentWalletValue = userWalletDocData.wallet;
  
  //         // Use the current wallet value as the cash-out amount
  //         const cashOutAmount = currentWalletValue;
  
  //         // Deduct the cash-out amount from the wallet value
  //         const newWalletValue = 0; // Set to 0 for complete cash-out, modify as needed
  
  //         // Update the wallet value in the Firestore database
  //         await updateDoc(userWalletDoc.ref, { wallet: newWalletValue });
  
  //         // Update the state to re-render the component with the new wallet value
  //         setWalletValue(newWalletValue);
  
  //         // Extract the first 8 characters of the userID
  //         const shortUserID = userID.substring(0, 8);
  
  //         // Navigate to the "CashOutBalance" screen and pass shortUserID as a parameter
  //         navigation.navigate("CashOutBalance", { shortUserID });
  //       } else {
  //         console.log("No or multiple documents found in userWallet.");
  //       }
  //     } else {
  //       Toast.show({
  //         type: "error",
  //         position: "top",
  //         text1: "Wallet value is 0",
  //         text2: "Cannot proceed with cash out❗" ,
  //         visibilityTime: 5000,
  //       });
  //       console.error("Cannot proceed with cash out. Wallet value is 0.");
  //     }
  //   } catch (error) {
  //     console.error("Error handling cash out:", error);
  //   }
  // };

  return (
    <View style={styles.wallet}>
      <StatusBar barStyle="default" />
      <ScrollView
        style={styles.body}
        showsVerticalScrollIndicator={true}
        showsHorizontalScrollIndicator={true}
        contentContainerStyle={styles.bodyScrollViewContent}
      >
        <View style={styles.frameParent}>
          <View style={[styles.currentBalanceWrapper, styles.bodyInnerFlexBox]}>
            <Text style={styles.currentBalance}>Current Balance</Text>
          </View>
          <View style={styles.linkedMethodsFrame}>
            <Text style={styles.php3200}>
              {walletValue !== null ? `Php ${walletValue}` : "Loading..."}
            </Text>
            <Pressable style={styles.button}>
              <Text style={[styles.button1, styles.wallet1Typo]}>Cash Out</Text>
            </Pressable>
          </View>
        </View>
        <View style={[styles.bodyInner, styles.bodyInnerFlexBox]}>
          <Image
            style={styles.frameChild}
            contentFit="cover"
            source={require("../assets/line-84.png")}
          />
        </View>
        <View style={styles.recentTransactionsWrapper}>
          <Text style={[styles.recentTransactions, styles.collection1Typo]}>
            Recent Transactions
          </Text>
        </View>
        {userTransactions.map((transaction, index) => (
          <View key={index} style={styles.frameGroup}>
            <View style={styles.customerSupport1Wrapper}>
              <Image
                style={styles.customerSupport1Icon}
                contentFit="cover"
                source={require("../assets/customersupport-1.png")}
              />
            </View>
            <View style={styles.collectionGroup}>
              <Text style={[styles.collection1, styles.collection1Typo]}>
                {transaction.service}
              </Text>
              <View style={styles.octParent}>
                <Text style={styles.octTypo}>{transaction.bookingID}</Text>
                <Text style={[styles.oct2, styles.octTypo]}>
                {transaction.timestamp}
                </Text>
              </View>
            </View>
            <View style={styles.php300Wrapper}>
              <Text style={[styles.php300, styles.php300Typo]}>
                ₱{transaction.amount}
              </Text>
            </View>
          </View>
        ))}

        {/* <View style={styles.frameGroup}>
          <View style={styles.customerSupport1Wrapper}>
            <Image
              style={styles.customerSupport1Icon}
              contentFit="cover"
              source={require("../assets/customersupport-1.png")}
            />
          </View>
          <View style={styles.collectionGroup}>
            <Text style={[styles.collection1, styles.collection1Typo]}>
              Collection
            </Text>
            <View style={styles.octParent}>
              <Text style={styles.octTypo}>Booking ID</Text>
              <Text style={[styles.oct2, styles.octTypo]}>08 Oct</Text>
            </View>
          </View>
          <View style={styles.php300Wrapper}>
            <Text style={[styles.php300, styles.php300Typo]}>-Php 300</Text>
          </View>
        </View> */}
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
  wallet1Typo: {
    color: Color.m3White,
    fontWeight: "700",
    textAlign: "center",
  },
  bodyInnerFlexBox: {
    paddingHorizontal: 0,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "stretch",
  },
  collection1Typo: {
    fontFamily: FontFamily.levelSemibold14,
    textAlign: "left",
    color: Color.colorGray90,
    fontWeight: "600",
  },
  php300Typo: {
    lineHeight: 21,
    fontSize: FontSize.typographyTaglineSmallRegular_size,
    fontFamily: FontFamily.levelSemibold14,
    color: Color.colorGray90,
    fontWeight: "600",
  },
  octTypo: {
    lineHeight: 10,
    fontSize: FontSize.size_3xs,
    textAlign: "left",
    color: Color.colorGray90,
    fontFamily: FontFamily.level2Medium12,
    fontWeight: "300",
    alignSelf: "stretch",
  },
  currentBalance: {
    color: Color.colorGray80,
    fontFamily: FontFamily.interLight,
    fontWeight: "300",
    fontSize: FontSize.size_mid,
    textAlign: "center",
    flex: 1,
  },
  currentBalanceWrapper: {
    paddingVertical: Padding.p_3xs,
    flexDirection: "row",
  },
  php3200: {
    fontSize: FontSize.size_5xl,
    fontFamily: FontFamily.georamaSemiBold,
    textAlign: "left",
    color: Color.colorGray90,
    fontWeight: "600",
  },
  button1: {
    fontSize: FontSize.bodyLgBodyLgRegular_size,
    fontFamily: FontFamily.georamaBold,
    textAlign: "center",
  },
  button: {
    borderRadius: Border.br_5xs,
    width: 320,
    height: 42,
    paddingHorizontal: 33,
    paddingVertical: Padding.p_4xs,
    marginTop: 20,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    backgroundColor: Color.colorDarkslateblue_100,
  },
  linkedMethodsFrame: {
    marginTop: 10,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "stretch",
  },
  frameParent: {
    paddingHorizontal: Padding.p_3xl,
    paddingVertical: Padding.p_3xs,
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
    marginTop: 5,
  },
  recentTransactions: {
    fontSize: FontSize.size_mid,
    fontFamily: FontFamily.levelSemibold14,
    flex: 1,
  },
  recentTransactionsWrapper: {
    paddingHorizontal: Padding.p_3xs,
    paddingVertical: Padding.p_5xs,
    marginTop: 5,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    alignSelf: "stretch",
  },
  collection: {
    height: 16,
    width: 95,
    textAlign: "center",
  },
  oct: {
    width: 103,
    height: 22,
    fontSize: FontSize.size_3xs,
    marginTop: 5,
    color: Color.colorGray90,
    fontFamily: FontFamily.interLight,
    fontWeight: "300",
    textAlign: "center",
  },
  collectionParent: {
    width: 374,
    height: 32,
    alignItems: "flex-end",
    paddingLeft: 428,
    paddingRight: 284,
    display: "none",
    marginTop: 5,
    justifyContent: "center",
  },
  customerSupport1Icon: {
    width: 25,
    height: 25,
  },
  customerSupport1Wrapper: {
    alignItems: "center",
    flexDirection: "row",
  },
  collection1: {
    fontSize: FontSize.paragraphMedium15_size,
    lineHeight: 16,
    alignSelf: "stretch",
  },
  oct2: {
    marginTop: 3,
  },
  octParent: {
    marginTop: 5,
    justifyContent: "center",
    alignSelf: "stretch",
  },
  collectionGroup: {
    paddingLeft: Padding.p_8xs,
    marginLeft: 15,
    justifyContent: "center",
    flex: 1,
  },
  php300: {
    textAlign: "right",
    flex: 1,
  },
  php300Wrapper: {
    marginLeft: 15,
    width: 95,
    alignItems: "center",
    flexDirection: "row",
  },
  frameGroup: {
    paddingHorizontal: Padding.p_xs,
    paddingVertical: 8,
    marginTop: 5,
    overflow: "hidden",
    alignItems: "center",
    flexDirection: "row",
    alignSelf: "stretch",
    backgroundColor: Color.colorWhitesmoke_100,
  },
  body: {
    alignSelf: "stretch",
    flex: 1,
    backgroundColor: Color.colorWhitesmoke_100,
  },
  wallet: {
    height: 877,
    flex: 1,
    backgroundColor: Color.colorWhitesmoke_100,
  },
});

export default Wallet;
