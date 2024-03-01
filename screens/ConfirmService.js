import React, { useState, useEffect } from "react";
import {
  StatusBar,
  StyleSheet,
  Text,
  View,
  Pressable,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { FontSize, Color, Padding, FontFamily, Border } from "../GlobalStyles";
import {
  getFirestore,
  doc,
  getDoc,
  updateDoc,
  runTransaction,
  writeBatch,
  getDocs,
  collection,
  where,
  query,
} from "firebase/firestore"; // Updated imports
import { getAuth, onAuthStateChanged, updateEmail } from "firebase/auth";
import * as ImagePicker from "expo-image-picker";
import {
  getStorage,
  ref,
  uploadString,
  getDownloadURL,
  uploadBytes,
  deleteObject,
} from "firebase/storage";
import Toast from "react-native-toast-message";
import { app, firebaseConfig } from "../App"; // Update the path as needed
import MaskedView from "@react-native-masked-view/masked-view";
import { Svg, Circle, Rect } from "react-native-svg";
import { useNavigation } from "@react-navigation/native";

const ConfirmService = ({ route }) => {
  const navigation = useNavigation();
  const { itemID, matchedBookingID, customerUID } = route.params;
  const [user, setUser] = useState(null);
  const [bookingID, setBookingID] = useState("");
  const [bookingPaymentMethod, setBookingPaymentMethod] = useState("");
  const [bookingTotal, setBookingTotal] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [imageURI, setImageURI] = useState(null);
  const [imageFlag, setImageFlag] = useState(false);
  const [ID, setID] = useState("");
  const [isServiceCompleted, setIsServiceCompleted] = useState(false);
  const [category, setCategory] = useState("");
  const [title, setTitle] = useState("");

  useEffect(() => {
    (async () => {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        alert("Permission to access the camera roll is required!");
      }
    })();

    async function fetchData() {
      try {
        const db = getFirestore(); // Use getFirestore() to initialize Firestore

        // Get the user's UID
        const auth = getAuth();
        const providerUID = auth.currentUser.uid;
        setUser(providerUID);
        console.log("Provider UID: ", providerUID);
        console.log("Item Id: ", itemID);

        const userBookingDocRef = doc(
          db,
          "providerProfiles",
          providerUID,
          "activeBookings",
          itemID
        );
        const docSnapshot = await getDoc(userBookingDocRef);

        if (docSnapshot.exists()) {
          const booking = docSnapshot.data();
          console.log("Booking Data: ", booking);

          setBookingID(booking.bookingID);
          setBookingPaymentMethod(booking.paymentMethod);
          setBookingTotal(booking.totalPrice);
          setTitle(booking.title);
          setCategory(booking.category);

          console.log("Booking ID: ", bookingID);
          console.log("Payment Method: ", bookingPaymentMethod);
          console.log("Total: ", bookingTotal);
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error retrieving data:", error);
      }
    }

    fetchData(); // Call the fetchData function immediately
  }, []);

  const fetchProfileImage = async (uid) => {
    const storage = getStorage();
    const imageRef = ref(storage, `ProviderProof/${uid}`);
    const defaultImage = ref(
      storage,
      "ProfilePictures/serviceProviderIcon.png"
    );

    try {
      const imageUrl = await getDownloadURL(imageRef);
      setProfileImage(imageUrl);
    } catch (error) {
      //console.error("Error fetching profile image:", error);
      // Set a default image URL if the image doesn't exist
      const imageUrl = await getDownloadURL(defaultImage);

      setProfileImage(imageUrl);
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (result.canceled) {
      return;
    }

    if (result.assets && result.assets.length > 0) {
      const selectedAsset = result.assets[0];
      const selectedImageURI = selectedAsset.uri;

      // Create a reference to the storage location using the imported app
      const storage = getStorage(app);

      // Create a reference to the profile picture in the "ProfilePictures" folder
      const storageRef = ref(storage, `ProviderProof/${user.uid}`);

      try {
        // Read the image file as a blob
        const response = await fetch(selectedImageURI);
        const blob = await response.blob();

        // Upload the image blob to Firebase Storage
        const snapshot = await uploadBytes(storageRef, blob);

        // Get the download URL of the uploaded image
        const downloadURL = await getDownloadURL(snapshot.ref);

        // Now you can use `downloadURL` to display or save the image URL in Firestore if needed.
        setImageURI(downloadURL);
        setImageFlag(true);
        setID(itemID);

        console.log("Image uploaded successfully:", downloadURL);
      } catch (error) {
        console.error("Error uploading image to Firebase Storage:", error);
      }
    }
  };

  const deleteImage = async () => {
    // Reset the state to null, which will hide the image and show the "Add Photo" button again
    setImageURI(null);
    setImageFlag(true);
    setID(itemID);

    // If you also want to delete the image from Firebase Storage, you would do that here.
    const storage = getStorage(app);
    const storageRef = ref(storage, `ProviderProof/${user.uid}`);
    deleteObject(storageRef)
      .then(() => {
        console.log("File deleted successfully");
      })
      .catch((error) => {
        console.error("Error deleting file:", error);
      });
  };

  const getPaymentMethodText = (bookingPaymentMethod) => {
    return bookingPaymentMethod === "Cash"
      ? "Collect Cash from Customer"
      : `Paid via ${bookingPaymentMethod}`;
  };

  const handleCompletedService = async () => {
    // timestamp
    //service
    const currentDate = new Date();
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const formattedDate = `${
      monthNames[currentDate.getMonth()]
    } ${currentDate.getDate()}`;

    console.log("Booking ID: ", bookingID);
    console.log("Payment Method: ", bookingPaymentMethod);
    console.log("Total: ", bookingTotal);
    console.log(`${title} ${category}`);

    // try {
    //   const db = getFirestore();
    //   const auth = getAuth();
    //   const providerUID = auth.currentUser.uid;

    //   // Construct a reference to the "userWallet" collection under the provider's profile
    //   const userWalletCollectionRef = collection(
    //     db,
    //     "providerProfiles",
    //     providerUID,
    //     "userWallet"
    //   );

    //   // Get all documents in the "userWallet" collection
    //   const querySnapshot = await getDocs(userWalletCollectionRef);

    //   if (!querySnapshot.empty && bookingPaymentMethod !== "Cash") {
    //     // Access the reference to the first document
    //     const firstDocumentRef = querySnapshot.docs[0].ref;

    //     // Get the current data of the first document
    //     const firstDocumentData = querySnapshot.docs[0].data();

    //     // Initialize an empty array if "transactions" doesn't exist in the first document's data
    //     const transactions = firstDocumentData.transactions || [];

    //     const wallet = firstDocumentData.wallet || 0;

    //     const newWalletValue = wallet + bookingTotal;

    //     await updateDoc(firstDocumentRef, { wallet: newWalletValue });

    //     // Add your new transaction object to the transactions array
    //     const newTransaction = {
    //       bookingID: bookingID,
    //       amount: bookingTotal,
    //       service: `${title} ${category}`,
    //       timestamp: formattedDate,
    //     };
    //     transactions.push(newTransaction);

    //     // Update the "transactions" array in the first document
    //     await updateDoc(firstDocumentRef, { transactions });

    //     console.log("New transaction added successfully.");
    //   } else {
    //     console.log("No documents found under userWallet.");
    //   }
    // } catch (error) {
    //   console.error("Error:", error);
    // }

    try {
      const db = getFirestore();
      const auth = getAuth();
      const providerUID = auth.currentUser.uid;
      const providerBookingDocRef = doc(
        db,
        "providerProfiles",
        providerUID,
        "activeBookings",
        ID
      );
      const userWalletCollectionRef = collection(
        db,
        "providerProfiles",
        providerUID,
        "userWallet"
      );

      const querySnapshotWallet = await getDocs(userWalletCollectionRef);

      if (!querySnapshotWallet.empty && bookingPaymentMethod !== "Cash") {
        // Access the reference to the first document
        const firstDocumentRef = querySnapshotWallet.docs[0].ref;

        // Get the current data of the first document
        const firstDocumentData = querySnapshotWallet.docs[0].data();

        // Initialize an empty array if "transactions" doesn't exist in the first document's data
        const transactions = firstDocumentData.transactions || [];

        const wallet = firstDocumentData.wallet || 0;

        const newWalletValue = wallet + bookingTotal;

        await updateDoc(firstDocumentRef, { wallet: newWalletValue });

        // Add your new transaction object to the transactions array
        const newTransaction = {
          bookingID: bookingID,
          amount: bookingTotal,
          service: `${title} ${category}`,
          timestamp: formattedDate,
        };
        transactions.push(newTransaction);

        // Update the "transactions" array in the first document
        await updateDoc(firstDocumentRef, { transactions });

        console.log("New transaction added successfully.");
      } else {
        console.log("No documents found under userWallet.");
      }

      // Start a Firestore transaction
      await runTransaction(db, async (transaction) => {
        // Get the current document
        const providerBookingSnapshot = await transaction.get(
          providerBookingDocRef
        );

        if (!providerBookingSnapshot.exists()) {
          throw "Document does not exist!";
        }

        const userBookingData = providerBookingSnapshot.data();

        // Update the status to "Completed"
        transaction.update(providerBookingDocRef, { status: "Completed" });

        // Move the document to the activeBookings collection
        const activeBookingDocRef = doc(
          db,
          "providerProfiles",
          providerUID,
          "historyBookings",
          ID
        );
        transaction.set(activeBookingDocRef, {
          ...userBookingData,
          status: "Completed",
        });

        // Delete the document from historyBookings collection
        transaction.delete(providerBookingDocRef);

        // Update the provider profile
        const providerDocRef = doc(db, "providerProfiles", providerUID);
        transaction.update(providerDocRef, {
          availability: "available",
          bookingID: "",
          bookingIndex: null,
          bookingMatched: false,
        });
        console.log("Provider booking completed and moved to historyBookings");
      });

      const userBookingDocRef = collection(
        db,
        "serviceBookings",
        customerUID,
        "activeBookings"
      );

      console.log("Passed Item ID", itemID);
      console.log("Passed Matched Booking ID", matchedBookingID);
      console.log("Passed Customer UID", customerUID);

      const q = query(
        userBookingDocRef,
        where("bookingID", "==", matchedBookingID)
      );
      const querySnapshot = await getDocs(q);

      // Run a batch operation to move the booking to historyBookings and update the provider profile
      const batch = writeBatch(db);

      querySnapshot.forEach((document) => {
        const docRef = doc(
          db,
          "serviceBookings",
          customerUID,
          "activeBookings",
          document.id
        );
        const historyDocRef = doc(
          db,
          "serviceBookings",
          customerUID,
          "historyBookings",
          document.id
        );

        // Copy the document to historyBookings
        batch.set(historyDocRef, { ...document.data(), status: "Completed" });

        // Delete the document from activeBookings
        batch.delete(docRef);
      });

      // Commit the batch
      await batch.commit();
      console.log("User Booking completed and moved to historyBookings");

      // Navigate to PerformTheService screen with itemId
      // navigation.navigate("BottomTabsRoot", { screen: "Homepage" });
      setIsServiceCompleted(true);
    } catch (error) {
      console.error("Error completing service:", error);
    }
  };

  useEffect(() => {
    if (isServiceCompleted) {
      navigation.navigate("BottomTabsRoot", { screen: "Homepage" });
      // Reset the state if needed
      setIsServiceCompleted(false);
    }
  }, [isServiceCompleted, navigation]);

  return (
    <View style={styles.confirmService}>
      <StatusBar barStyle="default" />
      <ScrollView
        style={styles.body}
        indicatorStyle="default"
        showsVerticalScrollIndicator={true}
        showsHorizontalScrollIndicator={false}
        pagingEnabled={false}
        contentContainerStyle={styles.bodyScrollViewContent}
      >
        <View style={styles.bodyInner}>
          <View style={[styles.frameGroup, styles.frameSpaceBlock]}>
            <View style={styles.bookingFlexBox}>
              <View style={styles.bookingDetailsLabel2}>
                <Text style={styles.serviceRequests1}>{`Booking Order:`}</Text>
                <Text style={styles.serviceRequests}>{`${bookingID}`}</Text>
              </View>
              <View
                style={[
                  styles.bookingDetailsLabel,
                  styles.dateAndTimeFrameFlexBox,
                ]}
              >
                <Text style={[styles.totalPayment, styles.textFlexBox]}>
                  Total Payment
                </Text>
              </View>
              <View style={[styles.bookingDetailsLabel1, styles.frameFlexBox1]}>
                <View style={styles.wrapper}>
                  <Text
                    style={[styles.text, styles.textTypo]}
                  >{`₱${bookingTotal}.00`}</Text>
                </View>
              </View>
              <View style={[styles.addressFrame, styles.frameFlexBox1]}>
                <View style={styles.collectCashFromCustomerWrapper}>
                  <Text style={styles.collectCashFrom}>
                    {getPaymentMethodText(bookingPaymentMethod)}
                  </Text>
                </View>
              </View>
            </View>
            <View
              style={[styles.bookingDetailsLabelGroup, styles.bookingFlexBox]}
            >
              <View style={styles.bookingDetailsLabel2}>
                <Text style={[styles.proofOfCompleted, styles.textTypo]}>
                  Proof of Completed Service
                </Text>
              </View>
              {imageURI ? (
                <View style={styles.subcategoriesFrame}>
                  <View
                    style={[styles.dateAndTimeFrame, styles.frameInnerFlexBox]}
                  >
                    <Pressable
                      style={[styles.frame, styles.frameInnerFlexBox]}
                      onPress={deleteImage}
                    >
                      <Text style={styles.delete}>Delete</Text>
                    </Pressable>
                  </View>
                </View>
              ) : (
                <View style={styles.subcategoriesFrame2}>
                  <View
                    style={[styles.dateAndTimeFrame, styles.frameInnerFlexBox]}
                  >
                    <Pressable style={[styles.frame, styles.frameInnerFlexBox]}>
                      <Text style={styles.delete}>Delete</Text>
                    </Pressable>
                  </View>
                </View>
              )}
              <View style={styles.subcategoriesFrame}>
                {/* <View
                  style={[
                    styles.dateAndTimeFrame,
                    styles.dateAndTimeFrameFlexBox,
                  ]}
                >
                  <View style={styles.bookingDetailsLabel2}>
                    <View style={styles.frameParent}>
                      <View
                        style={[styles.frameWrapper, styles.frameSpaceBlock]}
                      >
                        <View style={styles.wrapper}>
                          <View style={styles.frameWrapper2}>
                            <View style={styles.bookingDetailsLabel2}>
                              <Text style={[styles.text1, styles.text1Text]}>
                                2
                              </Text>
                            </View>
                          </View>
                        </View>
                      </View>
                      <View
                        style={[
                          styles.frameFrame,
                          styles.frameWrapperSpaceBlock,
                        ]}
                      >
                        <View style={styles.bookingDetailsLabel2}>
                          <Text style={[styles.toiletSystem, styles.text1Text]}>
                            Toilet System
                          </Text>
                        </View>
                      </View>
                    </View>
                    <View style={[styles.frameParent1, styles.frameFlexBox]}>
                      <View
                        style={[styles.frameWrapper, styles.frameSpaceBlock]}
                      >
                        <View style={styles.wrapper}>
                          <View style={styles.frameWrapper2}>
                            <View style={styles.bookingDetailsLabel2}>
                              <Text style={[styles.text1, styles.text1Text]}>
                                2
                              </Text>
                            </View>
                          </View>
                        </View>
                      </View>
                      <View
                        style={[
                          styles.frameFrame,
                          styles.frameWrapperSpaceBlock,
                        ]}
                      >
                        <View style={styles.bookingDetailsLabel2}>
                          <Text style={[styles.toiletSystem, styles.text1Text]}>
                            Septic Tank Cleaning
                          </Text>
                        </View>
                      </View>
                    </View>
                    <View style={[styles.frameParent1, styles.frameFlexBox]}>
                      <View
                        style={[styles.frameWrapper, styles.frameSpaceBlock]}
                      >
                        <View style={styles.wrapper}>
                          <View style={styles.frameWrapper2}>
                            <View style={styles.bookingDetailsLabel2}>
                              <Text style={[styles.text1, styles.text1Text]}>
                                2
                              </Text>
                            </View>
                          </View>
                        </View>
                      </View>
                      <View
                        style={[
                          styles.frameWrapper10,
                          styles.frameWrapperSpaceBlock,
                        ]}
                      >
                        <View style={styles.bookingDetailsLabel2}>
                          <Text style={[styles.toiletSystem, styles.text1Text]}>
                            Cage or Habitat Cleaning
                          </Text>
                        </View>
                      </View>
                    </View>
                    <View style={[styles.frameParent1, styles.frameFlexBox]}>
                      <View
                        style={[styles.frameWrapper, styles.frameSpaceBlock]}
                      >
                        <View style={styles.wrapper}>
                          <View style={styles.frameWrapper2}>
                            <View style={styles.bookingDetailsLabel2}>
                              <Text style={[styles.text1, styles.text1Text]}>
                                2
                              </Text>
                            </View>
                          </View>
                        </View>
                      </View>
                      <View
                        style={[
                          styles.frameFrame,
                          styles.frameWrapperSpaceBlock,
                        ]}
                      >
                        <View style={styles.bookingDetailsLabel2}>
                          <Text style={[styles.toiletSystem, styles.text1Text]}>
                            Toilet System
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                  <View
                    style={[
                      styles.frameWrapper15,
                      styles.frameWrapperSpaceBlock,
                    ]}
                  >
                    <View style={styles.frame4}>
                      <Text style={styles.text5}>₱2000.00</Text>
                    </View>
                  </View>
                </View> */}
                <View style={[styles.dateAndTimeFrame1, styles.viewFlexBox]}>
                  <View style={styles.collectCashFromCustomerWrapper}>
                    <View style={styles.frame5}>
                      <Text style={styles.addAPhoto}>{`Add a photo as proof of 
completed service`}</Text>
                    </View>
                    <View style={styles.frameFlexBox1}>
                      <Text style={[styles.required, styles.requiredTypo]}>
                        *Required
                      </Text>
                    </View>
                  </View>
                  {imageURI ? (
                    <MaskedView
                      style={styles.circularImageContainer}
                      maskElement={
                        <Svg height={100} width={100}>
                          <Rect
                            x="10"
                            y="10"
                            rx="10"
                            ry="10"
                            width="80"
                            height="80"
                            fill="white"
                          />
                        </Svg>
                      }
                    >
                      <Image
                        style={styles.circularImage}
                        contentFit="cover"
                        source={{ uri: imageURI }}
                      />
                    </MaskedView>
                  ) : (
                    <View
                      style={[styles.dateAndTimeFrame2, styles.frameFlexBox]}
                    >
                      <Pressable style={styles.frame7} onPress={pickImage}>
                        <Text style={styles.addPhoto}>Add Photo</Text>
                      </Pressable>
                    </View>
                  )}
                  {/* <View style={[styles.dateAndTimeFrame2, styles.frameFlexBox]}>
                    <Pressable style={styles.frame7}>
                      <Text style={styles.addPhoto}>Add Photo</Text>
                    </Pressable>
                  </View> */}
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
      <View style={styles.confirmServiceInner}>
        <View style={styles.bookingDetailsLabel2}>
          {imageFlag ? (
            <TouchableOpacity
              style={styles.viewTimelineBtn2}
              onPress={handleCompletedService} // Corrected: pass the function reference
            >
              <Text style={[styles.viewAllServices2, styles.textTypo]}>
                Confirm Completed Service
              </Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.viewTimelineBtn}>
              <Text style={[styles.viewAllServices, styles.textTypo]}>
                Confirm Completed Service
              </Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#1a244d",
  },
  circularImageContainer: {
    width: 100, // Adjust the width and height as needed for your design
    height: 100,
  },
  circularImage: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  frame: {
    paddingRight: Padding.p_11xl,
    flexDirection: "row",
  },
  delete: {
    fontFamily: FontFamily.levelSemibold14,
    color: "#f50808",
    textAlign: "right",
    fontSize: FontSize.levelSemibold14_size,
    fontWeight: "600",
  },
  serviceRequests: {
    fontFamily: FontFamily.poppinsBold,
    fontWeight: "600",
    // display: "flex",
    textAlign: "left",
    color: Color.colorSteelblue,
    fontSize: FontSize.title3Bold20_size,
    // alignItems: "center",
    // flex: 1,
    // alignSelf: "stretch",
  },
  serviceRequests1: {
    fontFamily: FontFamily.poppinsMedium,
    fontWeight: "600",
    // display: "flex",
    textAlign: "right",
    color: Color.colorDarkslateblue_100,
    fontSize: FontSize.title3Bold20_size,
    // alignItems: "center",
    // flex: 1,
    // alignSelf: "stretch",
    marginRight: 10,
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
  frameSpaceBlock: {
    paddingVertical: 0,
    justifyContent: "center",
  },
  dateAndTimeFrameFlexBox: {
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
  textTypo: {
    fontSize: FontSize.title3Bold20_size,
    flex: 1,
  },
  bookingFlexBox: {
    padding: Padding.p_8xs,
    justifyContent: "center",
    alignSelf: "stretch",
    backgroundColor: Color.m3White,
  },
  text1Text: {
    textTransform: "capitalize",
    textAlign: "center",
  },
  frameWrapperSpaceBlock: {
    marginTop: 7,
    justifyContent: "center",
  },
  frameFlexBox: {
    marginLeft: 7,
    alignItems: "center",
    flex: 1,
  },
  requiredTypo: {
    fontFamily: FontFamily.level2Medium12,
    fontWeight: "500",
  },
  totalPayment: {
    fontFamily: FontFamily.workSansSemiBold,
    color: Color.colorDarkslateblue_100,
    fontWeight: "600",
    alignSelf: "stretch",
    fontSize: FontSize.size_lg,
    flex: 1,
  },
  bookingDetailsLabel: {
    flexDirection: "row",
  },
  bookingDetailsLabel2: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    alignSelf: "stretch",
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
  text1: {
    fontFamily: FontFamily.workSansRegular,
    fontSize: FontSize.paragraphMedium15_size,
    color: Color.m3White,
  },
  frameWrapper2: {
    borderRadius: Border.br_5xs,
    backgroundColor: Color.colorDarkslateblue_200,
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  frameWrapper: {
    width: 38,
    paddingHorizontal: Padding.p_9xs,
    alignItems: "center",
    flexDirection: "row",
  },
  toiletSystem: {
    fontSize: FontSize.levelSemibold14_size,
    color: Color.lightLabelPrimary,
    fontFamily: FontFamily.interRegular,
    flex: 1,
  },
  frameFrame: {
    alignItems: "center",
    alignSelf: "stretch",
  },
  frameParent: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  frameParent1: {
    justifyContent: "center",
  },
  frameWrapper10: {
    width: 78,
    alignItems: "center",
  },
  text5: {
    fontSize: FontSize.level2Medium12_size,
    lineHeight: 16,
    color: Color.neutral07,
    textAlign: "right",
    fontFamily: FontFamily.interRegular,
    flex: 1,
  },
  frame4: {
    display: "none",
    alignItems: "center",
    flexDirection: "row",
    alignSelf: "stretch",
  },
  frameWrapper15: {
    width: 68,
    alignItems: "flex-end",
    display: "none",
  },
  dateAndTimeFrame: {
    flexDirection: "row",
    alignSelf: "stretch",
  },
  frameInnerFlexBox: {
    justifyContent: "flex-end",
    alignItems: "center",
  },
  addAPhoto: {
    fontSize: FontSize.levelSemibold14_size,
    color: Color.lightLabelPrimary,
    textAlign: "left",
    fontFamily: FontFamily.interRegular,
    flex: 1,
  },
  frame5: {
    alignItems: "center",
    flexDirection: "row",
    alignSelf: "stretch",
  },
  required: {
    color: Color.colorDarkgray_100,
    fontSize: FontSize.levelSemibold14_size,
    textAlign: "left",
    flex: 1,
  },
  addPhoto: {
    fontFamily: FontFamily.levelSemibold14,
    color: Color.colorSteelblue,
    textAlign: "right",
    fontSize: FontSize.levelSemibold14_size,
    fontWeight: "600",
  },
  frame7: {
    paddingRight: Padding.p_5xs,
    justifyContent: "flex-end",
    alignItems: "center",
    flexDirection: "row",
  },
  dateAndTimeFrame2: {
    justifyContent: "flex-end",
    flexDirection: "row",
  },
  dateAndTimeFrame1: {
    paddingVertical: Padding.p_10xs,
  },
  subcategoriesFrame: {
    justifyContent: "center",
    alignSelf: "stretch",
  },
  subcategoriesFrame2: {
    display: "none",
  },
  bookingDetailsLabelGroup: {
    marginTop: 10,
  },
  frameGroup: {
    paddingHorizontal: Padding.p_3xs,
    alignSelf: "stretch",
  },
  bodyInner: {
    justifyContent: "flex-end",
    alignItems: "center",
    alignSelf: "stretch",
  },
  body: {
    alignSelf: "stretch",
    flex: 1,
  },
  viewAllServices: {
    letterSpacing: -0.2,
    lineHeight: 24,
    color: "#828181",
    textAlign: "center",
    fontFamily: FontFamily.title2Bold32,
    fontSize: FontSize.title3Bold20_size,
    fontWeight: "700",
  },
  viewAllServices2: {
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
    backgroundColor: "#bcb9b9",
    padding: Padding.p_xs,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    flex: 1,
  },
  viewTimelineBtn2: {
    borderRadius: Border.br_mini,
    borderRadius: Border.br_mini,
    backgroundColor: Color.colorDarkslategray_600,
    padding: Padding.p_xs,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    flex: 1,
  },
  confirmServiceInner: {
    padding: Padding.p_mini,
    justifyContent: "flex-end",
    alignItems: "center",
    alignSelf: "stretch",
    backgroundColor: Color.m3White,
  },
  confirmService: {
    backgroundColor: Color.colorWhitesmoke_200,
    width: "100%",
    height: 812,
    flex: 1,
  },
});

export default ConfirmService;
