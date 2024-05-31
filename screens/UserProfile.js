import { useEffect, useState } from "react";
import {
  StatusBar,
  StyleSheet,
  View,
  Text,
  Pressable,
  ScrollView,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { Color, Padding, FontSize, FontFamily, Border } from "../GlobalStyles";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  getFirestore,
  collection,
  query,
  where,
  getDoc,
  doc,
} from "firebase/firestore";
import Spinner from "react-native-loading-spinner-overlay";
import {
  getStorage,
  ref as storageRef,
  getDownloadURL,
} from "firebase/storage";

const UserProfile = () => {
  const navigation = useNavigation();

  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true); // Initialize loading state as true
  const [profileImage, setProfileImage] = useState(null);

  const fetchUserData = async () => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        setName("");
        setEmail("");
        setLoading(false);
        return;
      }

      setUser(currentUser);

      try {
        const email = currentUser.email;
        setEmail(email);

        // Fetch the user's profile image based on their UID
        fetchProfileImage(currentUser.uid);

        const db = getFirestore();
        const userProfilesCollection = collection(db, "providerProfiles");
        const userDocRef = doc(userProfilesCollection, currentUser.uid);
        const userDocSnapshot = await getDoc(userDocRef);

        if (userDocSnapshot.exists()) {
          const userData = userDocSnapshot.data();
          const { name } = userData;
          setName(name);
          setLoading(false);
        } else {
          console.log("No user data found for the given UID.");
          setLoading(false);
        }
      } catch (error) {
        console.error("Error retrieving user data:", error);
        setLoading(false);
      }
    });

    return unsubscribe;
  };

  const fetchProfileImage = async (uid) => {
    const storage = getStorage();
    const imageRef = storageRef(storage, `ProfilePictures/${uid}`);

    const defaultImage =  storageRef(storage, "ProfilePictures/serviceProviderIcon.png");


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

  useEffect(() => {
    const intervalId = setInterval(() => {
      fetchUserData();
    }, 3000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <View style={styles.userProfile}>
      <StatusBar barStyle="default" />
      <ScrollView
        style={styles.body}
        showsVerticalScrollIndicator={true}
        showsHorizontalScrollIndicator={true}
        contentContainerStyle={styles.bodyScrollViewContent}
      >
        <View style={styles.profileFlexBox}>
          {loading ? (
            <Spinner visible={true} textContent={"Loading..."} />
          ) : (
            <View>
              <View style={[styles.headlineWrapper, styles.profileFlexBox]}>
                <Image
                  style={styles.frameChild}
                  contentFit="cover"
                  source={{ uri: profileImage }}
                />
              </View>
              <View
                style={[styles.lebandeTheKingParent, styles.profileFlexBox]}
              >
                <Text
                  style={[styles.lebandeTheKing, styles.editProfileFlexBox]}
                >
                  {name}
                </Text>
                <Text
                  style={[
                    styles.sirdaltisjabileeaucom,
                    styles.editProfileFlexBox,
                  ]}
                >
                  {email}
                </Text>
              </View>
            </View>
          )}
        </View>

        <View style={[styles.profileSettings, styles.profileFlexBox]}>
          <Pressable
            style={styles.btnFlexBox}
            onPress={() => navigation.navigate("EditProfile")}
          >
            <View style={[styles.editProfileBtnInner, styles.profileFlexBox]}>
              <View style={styles.ellipseParent}>
                <Image
                  style={styles.frameItem}
                  contentFit="cover"
                  source={require("../assets/ellipse-4.png")}
                />
                <Image
                  style={[styles.profileIcon, styles.badgePosition]}
                  contentFit="cover"
                  source={require("../assets/profile-icon.png")}
                />
              </View>
            </View>
            <View style={[styles.editProfileWrapper, styles.wrapperSpaceBlock]}>
              <Text style={[styles.editProfile, styles.editProfileFlexBox]}>
                Edit Profile
              </Text>
            </View>
            <View
              style={[styles.chevronRightWrapper, styles.wrapperSpaceBlock]}
            >
              <View style={[styles.chevronRight, styles.profileFlexBox]}>
                <Image
                  style={styles.vectorIcon}
                  contentFit="cover"
                  source={require("../assets/vector2.png")}
                />
              </View>
            </View>
          </Pressable>
          <Pressable
            style={[styles.changePasswordBtn, styles.btnFlexBox]}
            onPress={() => navigation.navigate("ChangePassword")}
          >
            <View style={[styles.editProfileBtnInner, styles.profileFlexBox]}>
              <View style={styles.ellipseParent}>
                <Image
                  style={styles.frameItem}
                  contentFit="cover"
                  source={require("../assets/ellipse-4.png")}
                />
                <Image
                  style={[styles.profileIcon, styles.badgePosition]}
                  contentFit="cover"
                  source={require("../assets/password-icon.png")}
                />
              </View>
            </View>
            <View style={[styles.editProfileWrapper, styles.wrapperSpaceBlock]}>
              <Text style={[styles.editProfile, styles.editProfileFlexBox]}>
                Change Password
              </Text>
            </View>
            <View
              style={[styles.chevronRightWrapper, styles.wrapperSpaceBlock]}
            >
              <View style={[styles.chevronRight, styles.profileFlexBox]}>
                <Image
                  style={styles.vectorIcon}
                  contentFit="cover"
                  source={require("../assets/vector2.png")}
                />
              </View>
            </View>
          </Pressable>
          <Pressable
            style={[styles.changePasswordBtn, styles.btnFlexBox]}
            onPress={() => navigation.navigate("Wallet")}
          >
            <View style={[styles.editProfileBtnInner, styles.profileFlexBox]}>
              <View style={styles.ellipseParent}>
                <Image
                  style={styles.frameItem}
                  contentFit="cover"
                  source={require("../assets/ellipse-4.png")}
                />
                <Image
                  style={[styles.profileIcon, styles.badgePosition]}
                  contentFit="cover"
                  source={require("../assets/payment-icon.png")}
                />
              </View>
            </View>
            <View style={[styles.editProfileWrapper, styles.wrapperSpaceBlock]}>
              <Text style={[styles.editProfile, styles.editProfileFlexBox]}>
                Wallet
              </Text>
            </View>
            <View
              style={[styles.chevronRightWrapper, styles.wrapperSpaceBlock]}
            >
              <View style={[styles.chevronRight, styles.profileFlexBox]}>
                <Image
                  style={styles.vectorIcon}
                  contentFit="cover"
                  source={require("../assets/vector2.png")}
                />
              </View>
            </View>
          </Pressable>
          {/* <Pressable
            style={[styles.changePasswordBtn, styles.btnFlexBox]}
            onPress={() => navigation.navigate("NotificationsSettings")}
          >
            <View style={[styles.editProfileBtnInner, styles.profileFlexBox]}>
              <View style={styles.ellipseParent}>
                <Image
                  style={styles.frameItem}
                  contentFit="cover"
                  source={require("../assets/ellipse-4.png")}
                />
                <Image
                  style={[styles.profileIcon, styles.badgePosition]}
                  contentFit="cover"
                  source={require("../assets/notifications-icon.png")}
                />
              </View>
            </View>
            <View style={[styles.editProfileWrapper, styles.wrapperSpaceBlock]}>
              <Text style={[styles.editProfile, styles.editProfileFlexBox]}>
                Notifications
              </Text>
            </View>
            <View
              style={[styles.chevronRightWrapper, styles.wrapperSpaceBlock]}
            >
              <View style={[styles.chevronRight, styles.profileFlexBox]}>
                <Image
                  style={styles.vectorIcon}
                  contentFit="cover"
                  source={require("../assets/vector2.png")}
                />
              </View>
            </View>
          </Pressable> */}
          <Pressable
            style={[styles.changePasswordBtn, styles.btnFlexBox]}
            onPress={() => navigation.navigate("HelpCenterFAQ")}
          >
            <View style={[styles.editProfileBtnInner, styles.profileFlexBox]}>
              <View style={styles.ellipseParent}>
                <Image
                  style={styles.frameItem}
                  contentFit="cover"
                  source={require("../assets/ellipse-4.png")}
                />
                <Image
                  style={[styles.profileIcon, styles.badgePosition]}
                  contentFit="cover"
                  source={require("../assets/help-center-icon.png")}
                />
              </View>
            </View>
            <View style={[styles.editProfileWrapper, styles.wrapperSpaceBlock]}>
              <Text style={[styles.editProfile, styles.editProfileFlexBox]}>
                Help Center
              </Text>
            </View>
            <View
              style={[styles.chevronRightWrapper, styles.wrapperSpaceBlock]}
            >
              <View style={[styles.chevronRight, styles.profileFlexBox]}>
                <Image
                  style={styles.vectorIcon}
                  contentFit="cover"
                  source={require("../assets/vector2.png")}
                />
              </View>
            </View>
          </Pressable>
          <Pressable
            style={[styles.changePasswordBtn, styles.btnFlexBox]}
            onPress={() => navigation.navigate("PrivacyPolicy")}
          >
            <View style={[styles.editProfileBtnInner, styles.profileFlexBox]}>
              <View style={styles.ellipseParent}>
                <Image
                  style={styles.frameItem}
                  contentFit="cover"
                  source={require("../assets/ellipse-4.png")}
                />
                <Image
                  style={[styles.profileIcon, styles.badgePosition]}
                  contentFit="cover"
                  source={require("../assets/policy-icon.png")}
                />
              </View>
            </View>
            <View style={[styles.editProfileWrapper, styles.wrapperSpaceBlock]}>
              <Text style={[styles.editProfile, styles.editProfileFlexBox]}>
                Privacy Policy
              </Text>
            </View>
            <View
              style={[styles.chevronRightWrapper, styles.wrapperSpaceBlock]}
            >
              <View style={[styles.chevronRight, styles.profileFlexBox]}>
                <Image
                  style={styles.vectorIcon}
                  contentFit="cover"
                  source={require("../assets/vector2.png")}
                />
              </View>
            </View>
          </Pressable>
          <View style={[styles.btnFlexBox1]}>
            <Text style={[styles.editProfile, styles.editProfileFlexBox1]}>
              Version 1.0
            </Text>
            <Text style={[styles.editProfile, styles.editProfileFlexBox1]}>
              © 2023-2024 SerbisYou Team. Icons by Icons8 and FlatIcons
            </Text>
          </View>
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
    justifyContent: "center",
  },
  profileTypo: {
    textAlign: "center",
    color: Color.m3White,
    fontWeight: "700",
  },
  logoutButtonSpaceBlock: {
    paddingVertical: 0,
    justifyContent: "space-between",
  },
  profileFlexBox: {
    justifyContent: "center",
    alignItems: "center",
  },
  editProfileFlexBox: {
    textAlign: "left",
    color: Color.colorGray90,
  },
  editProfileFlexBox1: {
    textAlign: "center",
    color: Color.colorGray90,
  },
  badgePosition: {
    zIndex: 1,
    position: "absolute",
  },
  wrapperSpaceBlock: {
    marginLeft: 25,
    justifyContent: "center",
  },
  btnFlexBox: {
    padding: Padding.p_xs,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    alignSelf: "stretch",
    backgroundColor: Color.m3White,
  },
  btnFlexBox1: {
    padding: Padding.p_xs,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    alignSelf: "stretch",
    backgroundColor: Color.m3White,
  },
  labelTypo: {
    marginTop: 4,
    fontSize: FontSize.level2Medium12_size,
    fontFamily: FontFamily.robotoMedium,
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
    height: 30,
    width: 26,
    overflow: "hidden",
  },
  frameChild: {
    width: 200,
    height: 200,
    borderRadius: 100,
  },
  headlineWrapper: {
    flexDirection: "row",
  },
  customerName: {
    fontSize: FontSize.typographyHeading3Medium_size,
    fontFamily: FontFamily.typographyParagraphSmallMedium,
    fontWeight: "500",
    color: Color.colorGray90,
  },
  johnDoegmailcom: {
    fontSize: FontSize.paragraphMedium15_size,
    fontWeight: "300",
    fontFamily: FontFamily.georamaLight,
    marginTop: 3,
  },
  customerNameParent: {
    marginTop: 8,
  },
  frameItem: {
    width: 34,
    height: 34,
    zIndex: 0,
  },
  profileIcon: {
    top: 7,
    left: 7,
    width: 20,
    height: 20,
  },
  ellipseParent: {
    flexDirection: "row",
  },
  editProfileBtnInner: {
    paddingLeft: Padding.p_3xs,
    flexDirection: "row",
  },
  editProfile: {
    fontFamily: FontFamily.typographyParagraphSmallMedium,
    fontWeight: "500",
    color: Color.colorGray90,
    fontSize: FontSize.bodyLgBodyLgRegular_size,
    alignSelf: "stretch",
  },
  editProfileWrapper: {
    flex: 1,
  },
  vectorIcon: {
    width: 8,
    height: 14,
  },
  chevronRight: {
    paddingHorizontal: Padding.p_4xs,
    paddingVertical: Padding.p_7xs,
    overflow: "hidden",
    flexDirection: "row",
  },
  chevronRightWrapper: {
    alignItems: "center",
    flexDirection: "row",
  },
  changePasswordBtn: {
    marginTop: 21,
  },
  profileSettings: {
    paddingBottom: Padding.p_8xs,
    marginTop: 15,
    alignSelf: "stretch",
  },
  body: {
    backgroundColor: Color.colorWhitesmoke_100,
    alignSelf: "stretch",
    flex: 1,
  },
  userProfile: {
    width: "100%",
    height: 812,
    flex: 1,
    backgroundColor: Color.m3White,
  },
});

export default UserProfile;
