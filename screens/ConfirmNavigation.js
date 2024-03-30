import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Image } from "expo-image";
import SwipeButton from 'rn-swipe-button';
import { Padding, Border, FontSize, FontFamily, Color } from "../GlobalStyles";
import { useNavigation } from "@react-navigation/native";
import { getAuth } from "firebase/auth";
import { getFirestore, updateDoc, doc, query, collection, where, getDoc, setDoc, getDocs } from 'firebase/firestore';


import rightArrow from '../assets/arrow-right.png';

const ConfirmNavigation = ({route}) => {
    const navigation = useNavigation();
    const { itemID, matchedBookingID, customerUID } = route.params;
    const [toggleState, setToggleState] = useState(false);
    const [bookingTitle, setBookingTitle] = useState("");
    const [bookingCategory, setBookingCategory] = useState("");

    const [isLoading, setIsLoading] = useState(false);

    const makeSomeRequest = () => {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
      }, 3000);
    };

//     const handleToggle = (value) => setToggleState(value);
//     const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);
//   const [isConfirmed, setConfirmed] = useState(false);
//   // Animated value for X translation
//   const X = useSharedValue(0);
//   // Toggled State
//   const [toggled, setToggled] = useState(false);

//     // Fires when animation ends
//     const handleComplete = (isToggled) => {
//         if (isToggled !== toggled) {
//           setToggled(isToggled);
//           handleToggle(isToggled);
//         }
//       };

//     // Gesture Handler Events
//     const animatedGestureHandler = useAnimatedGestureHandler({
//     onStart: (_, ctx) => {
//         ctx.completed = toggled;
//     },
//     onActive: (e, ctx) => {
//         let newValue;
//         if (ctx.completed) {
//         newValue = H_SWIPE_RANGE + e.translationX;
//         } else {
//         newValue = e.translationX;
//         }

//         if (newValue >= 0 && newValue <= H_SWIPE_RANGE) {
//         X.value = newValue;
//         }
//     },
//     onEnd: () => {
//         if (X.value < BUTTON_WIDTH / 2 - SWIPEABLE_DIMENSIONS / 2) {
//         X.value = withSpring(0);
//         runOnJS(handleComplete)(false);
//         } else {
//         X.value = withSpring(H_SWIPE_RANGE);
//         runOnJS(handleComplete)(true);
//         }
//     },
//     });

//     const InterpolateXInput = [0, H_SWIPE_RANGE];
//     const AnimatedStyles = {
//     swipeCont: useAnimatedStyle(() => {
//         return {};
//     }),
//     colorWave: useAnimatedStyle(() => {
//         return {
//         width: H_WAVE_RANGE + X.value,

//         opacity: interpolate(X.value, InterpolateXInput, [0, 1]),
//         };
//     }),
//     swipeable: useAnimatedStyle(() => {
//         return {
//         backgroundColor: interpolateColor(
//             X.value,
//             [0, BUTTON_WIDTH - SWIPEABLE_DIMENSIONS - BUTTON_PADDING],
//             ['#06d6a0', '#fff'],
//         ),
//         transform: [{translateX: X.value}],
//         };
//     }),
//     swipeText: useAnimatedStyle(() => {
//         return {
//         opacity: interpolate(
//             X.value,
//             InterpolateXInput,
//             [0.7, 0],
//             Extrapolate.CLAMP,
//         ),
//         transform: [
//             {
//             translateX: interpolate(
//                 X.value,
//                 InterpolateXInput,
//                 [0, BUTTON_WIDTH / 2 - SWIPEABLE_DIMENSIONS],
//                 Extrapolate.CLAMP,
//             ),
//             },
//         ],
//         };
//     }),
//     };

//   // Handle the confirmation slide
//   const handleSlideComplete = () => {
//     // You can add additional logic here if needed
//     setConfirmed(true);
//   };
    const defaultStatusMessage = '';
    const [swipeStatusMessage, setSwipeStatusMessage] = useState(
    defaultStatusMessage,
    );

    setInterval(() => setSwipeStatusMessage(defaultStatusMessage), 5000);
    const updateSwipeStatusMessage = (message) => setSwipeStatusMessage(message);
    const renderSubHeading = (heading) => (
    <Text style={styles.subHeading}>{heading}</Text>
    );
    let forceResetLastButton = null;

    const CheckoutButton = () => {
    return(
        <View style={{width: 100, height: 30, backgroundColor: '#C70039', borderRadius: 5, justifyContent: 'center', alignItems: 'center'}}>
            <Text style={{color: '#ffffff'}}>Checkout</Text>
        </View>
    );
    } 

    // Firestore reference to the serviceBookings collection
    const db = getFirestore();
    const bookingRef = collection(db, "serviceBookings", customerUID, "activeBookings");

    // Firestore reference to the providerProfiles collection
    const auth = getAuth();
    const providerUID = auth.currentUser.uid;
    const userBookingDocRef = doc(db, "providerProfiles", providerUID, "activeBookings", itemID);

    const navigateToCustomer = async () => {
        setIsLoading(true);
        try {
          // Update the status in Firestore for serviceBookings
          console.log("Passed Item ID" , itemID);
          console.log("Passed Matched Booking ID" , matchedBookingID);
          console.log("Passed Customer UID" , customerUID);
          const docSnapshot = await getDoc(userBookingDocRef);

          if (docSnapshot.exists()) {
            const booking = docSnapshot.data();
            setBookingTitle(booking.title);
            setBookingCategory(booking.category);
          } else {
            console.log("No such document!");
          }

          const q = query(bookingRef, where("bookingID", "==", matchedBookingID));
          const querySnapshot = await getDocs(q);
          querySnapshot.forEach((document) => {
            const bookingDocRef = doc(db, "serviceBookings", customerUID, "activeBookings", document.id);
            updateDoc(bookingDocRef, {
              status: "In Transit"
            });
          });
    
          // Update the status in Firestore for providerProfiles
          await updateDoc(userBookingDocRef, {
            status: "In Transit"
          });

          const notifDocRef = doc(db, "userProfiles", customerUID);
          const notifCollection = collection(notifDocRef, "notifications");

          const today = new Date();
          const options = {
            year: "numeric",
            month: "long",
            day: "numeric",
          };
          const formattedDate = today.toLocaleDateString("en-US", options); // Adjust locale as needed

          const bookingDataNotif = {
            // Using bookingID as the key for the map inside the document
            [matchedBookingID]: {
              subTitle: `Your service provider for ${getFormattedServiceName()} is currently in transit and will arrive to your location shortly`,
              title: `Your booking ${matchedBookingID} is on the way to you`,
              // You can add more fields here if needed
            },
          };

          const notificationDocRef = doc(notifCollection, formattedDate);

          try {
            const notificationDoc = await getDoc(notificationDocRef);
            if (notificationDoc.exists()) {
              // Document exists, update it
              await setDoc(notificationDocRef, bookingDataNotif, {
                merge: true,
              });
              console.log("Notification updated successfully!");
            } else {
              // Document doesn't exist, create it
              await setDoc(notificationDocRef, bookingDataNotif);
              console.log("New notification document created!");
            }
          } catch (error) {
            console.error("Error updating notification:", error);
          }
    
          setIsLoading(false);
    
          // Navigate to the "GoToCustomer" screen
          navigation.navigate('GoToCustomer', { itemID: itemID, matchedBookingID: matchedBookingID, customerUID: customerUID});
        } catch (error) {
          console.error("Error updating Firestore documents:", error);
          setIsLoading(false);
        }
    };

  const getFormattedServiceName = () => {
    if (!bookingTitle || !bookingCategory) {
      return 'Service'; // Default text or handle as needed
    }

    // Check if the title is "Pet Care" or "Gardening"
    if (bookingTitle === "Pet Care" || bookingTitle === "Gardening") {
      return bookingCategory;
    } else {
      // If not, concatenate the title and category
      return `${bookingTitle} ${bookingCategory}`;
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.closeButton} onPress={() => navigation.goBack()}>
        <Ionicons name="close-circle" size={40} color="black" />
      </TouchableOpacity>
      {/* <View style={styles.mapContainer}>
      </View> */}
      <View style={styles.imageContainer}>
        <Image
            style={styles.cancel11Icon}
            contentFit="cover"
            source={require("../assets/navigationMap.png")}
        />
      </View>
      <View style={styles.container2}>

        <View style={styles.content}>
            <Text style={styles.headerText}>{`Start Navigation 
to Customer?`}</Text>
            <Text style={styles.confirmationText}>
                Please confirm if you are now heading to the customer's location.
            </Text>
        </View>
        <View style={styles.container1}>
          {/* <Text style={styles.title}>React Native Swipe Button</Text> */}
          <Text style={styles.swipeStatus}>{swipeStatusMessage}</Text>
          {/* {renderSubHeading('Swipe status callbacks')} */}
          {/* <SwipeButton
            containerStyles={{borderRadius: 25}}
            // height={25}
            shouldResetAfterSuccess={true}
            resetAfterSuccessAnimDelay={3000}
            onSwipeFail={() => updateSwipeStatusMessage('Incomplete swipe!')}
            onSwipeStart={() => updateSwipeStatusMessage('Swipe started!')}
            onSwipeSuccess={() => updateSwipeStatusMessage('Submitted successfully!')}
            railBackgroundColor="#31a57c"
            railStyles={{
              backgroundColor: '#fff',
              borderColor: '#000',
            }}
            // railStyles={{borderRadius: 5}}
            // thumbIconComponent={CheckoutButton}
            thumbIconImageSource={rightArrow}
            thumbIconStyles={{borderRadius: 25}}
            thumbIconWidth={50} 
            thumbIconBackgroundColor="#FFFFFF"
            title="Slide to confirm"
          /> */}
          {/* {renderSubHeading('Reverse swipe enabled')}
          <SwipeButton
            // enableReverseSwipe
            onSwipeSuccess={() => updateSwipeStatusMessage('Slide success!')}
            railBackgroundColor="#a493d6"
            thumbIconImageSource={rightArrow}
            thumbIconBackgroundColor="#FFFFFF"
            title="Slide to unlock"
          /> */}
          {/* {renderSubHeading('Set a component as thumb icon & use forceReset')} */}
          <View style={styles.content1}>
            <SwipeButton
                // disableResetOnTap
                // forceReset={ reset => {
                //   forceResetLastButton = reset
                // }}
                shouldResetAfterSuccess={true}
                resetAfterSuccessAnimDelay={2000}
                onSwipeFail={() => updateSwipeStatusMessage('Incomplete swipe!')}
                onSwipeStart={() => updateSwipeStatusMessage('Swipe started!')}
                onSwipeSuccess={navigateToCustomer}
                thumbIconImageSource={rightArrow}
                thumbIconStyles={{borderRadius: 25}}
                thumbIconWidth={50} 
                thumbIconBackgroundColor="#00A8E8"
                railBackgroundColor="#FFFFFF"
                railStyles={{
                    backgroundColor: '#47CCFE',
                    borderColor: '#000',
                }}
                title="Slide to confirm"
                titleColor= "#1A244D"
                titleStyles={{
                    fontSize: 20, // Set the font size as needed
                    fontWeight: '500', // Set the font weight to bold
                    color: '#003459' // You can also set the title color here if needed
                }}
            />
          </View>

          {/* <View style={{ alignItems: 'center', marginBottom: 5 }}>
            <Button onPress={() => forceResetLastButton && forceResetLastButton()} title="Force reset" />
          </View>   
           {renderSubHeading('Set .png image as thumb icon')}
          <SwipeButton thumbIconImageSource={'./assets/arrow-right.png'} railBackgroundColor="#cfb0dd"/> 
          {renderSubHeading('Set height & reset after successful swipe')}
          <SwipeButton height={25} shouldResetAfterSuccess={true} resetAfterSuccessAnimDelay={1000} /> 
          {renderSubHeading('Set height and width')}
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <SwipeButton height={35} width={200} title="Swipe" disabled={disableCBButton} />
            <View style={{ marginLeft: 15, width: 150, height: 32 }}><Button onPress={() => setDisableCBButton(!disableCBButton)} title="Toggle disable" /></View>
          </View>   */}

        </View>
      </View>
      

      {/*<View style={styles.swiperContainer}>
        <Swiper
            style={styles.swiper}
            showsButtons={true}
            onIndexChanged={() => setConfirmed(false)}
            onMomentumScrollEnd={handleSlideComplete}
            loop={false}
            >
          <View style={styles.slide}>
            <Text style={styles.slideText}>Slide to Confirm</Text>
          </View>
        </Swiper>
      </View> */}
        {/* <Animated.View style={[styles.swipeCont, AnimatedStyles.swipeCont]}>
            <AnimatedLinearGradient
                style={[AnimatedStyles.colorWave, styles.colorWave]}
                colors={['#06d6a0', '#1b9aaa']}
                start={{x: 0.0, y: 0.5}}
                end={{x: 1, y: 0.5}}
            />
            <GestureHandlerRootView style={{ flex: 1 }}>
                <PanGestureHandler onGestureEvent={animatedGestureHandler}>
                    <Animated.View style={[styles.swipeable, AnimatedStyles.swipeable]} />
                </PanGestureHandler>
            </GestureHandlerRootView>

            <Animated.Text style={[styles.swipeText, AnimatedStyles.swipeText]}>
                Swipe Me
            </Animated.Text>
        </Animated.View> */}
        {/* <View style={styles.content1}>
            <SwipeButton
                // disableResetOnTap
                // forceReset={ reset => {
                //   forceResetLastButton = reset
                // }}
                shouldResetAfterSuccess={true}
                resetAfterSuccessAnimDelay={3000}
                onSwipeFail={() => updateSwipeStatusMessage('Incomplete swipe!')}
                onSwipeStart={() => updateSwipeStatusMessage('Swipe started!')}
                onSwipeSuccess={() => updateSwipeStatusMessage('Submitted successfully!')}
                thumbIconImageSource={rightArrow}
                thumbIconStyles={{borderRadius: 25}}
                thumbIconWidth={50} 
                thumbIconBackgroundColor="#FFFFFF"
                railBackgroundColor="#9fc7e8"
                railStyles={{
                backgroundColor: '#fff',
                borderColor: '#000',
                }}
                title="Slide to confirm"
            />
        </View> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    padding: 15, 
    paddingTop: 20
  },
  imageContainer: {
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
  },
  container1: {
    alignContent: 'center',
    alignSelf: 'stretch',
    justifyContent: 'center',
    padding: 15, 
    paddingTop: 20
  },
  container2: {
    alignContent: 'center',
    alignSelf: 'stretch',
    justifyContent: 'center',
    // padding: 15, 
  },
  cancel11Icon: {
    width: 250,
    height: 250,
    paddingTop: 20,
  },
  swipeStatus: {
    color: '#FF0000',
    fontSize: 15,
    paddingVertical: 3,
    marginVertical: 5,
    textAlign: 'center',
  },
  subHeading: {color: '#140866', fontSize: 15},
  title: {
    color: '#700D99',
    fontSize: 20,
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
  },
  mapContainer: {
    width: '100%',
    height: '50%', //
    // Adjust height as needed
},
content: {
    alignItems: "center",
  },
content1: {
    // flex: 1,
    // alignItems: 'center',
    paddingTop: 10,
    alignSelf: 'stretch',
    alignContent: 'center',
    justifyContent: 'center',
  },
headerText: {
  fontWeight: '600',
  marginTop: 20,
  fontSize: 40,
  fontFamily: FontFamily.workSansSemiBold,
  color: "#1A244D",
  textAlign: "center",
},
headerText1: {
  fontWeight: '600',
  fontSize: 30,
  fontFamily: FontFamily.workSansSemiBold,
  color: "#1A244D",
  textAlign: "center",
},
confirmationText: {
  fontSize: 20,
  textAlign: 'center',
  marginHorizontal: 15,
  marginTop: 30,
},
swiperContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: 50,
  },
  swiper: {
    backgroundColor: 'transparent',
  },
  slide: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  slideText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1fb28a',
  },
//   swipeCont: {
//     height: BUTTON_HEIGHT,
//     width: BUTTON_WIDTH,
//     backgroundColor: '#fff',
//     borderRadius: BUTTON_HEIGHT,
//     padding: BUTTON_PADDING,
//     display: 'flex',
//     justifyContent: 'center',
//     alignItems: 'center',
//     flexDirection: 'row',
//   },
//   colorWave: {
//     position: 'absolute',
//     left: 0,
//     height: BUTTON_HEIGHT,
//     borderRadius: BUTTON_HEIGHT,
//   },
//   swipeable: {
//     position: 'absolute',
//     left: BUTTON_PADDING,
//     height: SWIPEABLE_DIMENSIONS,
//     width: SWIPEABLE_DIMENSIONS,
//     borderRadius: SWIPEABLE_DIMENSIONS,
//     zIndex: 3,
//   },
  swipeText: {
    alignSelf: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    zIndex: 2,
    color: '#1b9aaa',
  },
});

export default ConfirmNavigation;
