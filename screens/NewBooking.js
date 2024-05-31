import React, { useState, useEffect, useRef, useContext } from "react";
import {
  Dimensions,
  StatusBar,
  StyleSheet,
  Text,
  View,
  ScrollView,
  ImageBackground,
  Pressable,
  Animated,
  LayoutAnimation,
  TouchableOpacity,
  Linking,
  ActivityIndicator,
  Modal,
  BackHandler,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MapView, {
  Marker,
  Circle,
  enableLatestRenderer,
} from "react-native-maps";
import axios from "axios";
import * as Location from "expo-location";
import { Image } from "expo-image";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Color, Border, FontFamily, FontSize, Padding } from "../GlobalStyles";
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  addDoc,
  updateDoc,
  query,
  arrayUnion,
  runTransaction,
} from "firebase/firestore"; // Updated imports
import { toggleAnimation } from "../animations/toggleAnimation";
import { getAuth, onAuthStateChanged, updateEmail } from "firebase/auth";
import BookingNotFound from "../components/BookingNotFound";
import CancelBookingPrompt from "../components/CancelBookingPrompt";
import CountDownBooking from "../components/CountDownBooking";

const NewBooking = ({ route }) => {
  const navigation = useNavigation();
  const mapRef = useRef(null);

  const [isInputFocused, setIsInputFocused] = useState(false);
  const { name, userBookingID, matchedBookingID, bookingIndex, providerCoordinates } =
    route.params;
  const [bookingAccepted, setBookingAccepted] = useState(false);
  const [bookingAssigned, setBookingAssigned] = useState(false);
  const [bookingID, setBookingID] = useState("");
  const [bookingTitle, setBookingTitle] = useState("");
  const [bookingName, setBookingName] = useState("");
  const [bookingDate, setBookingDate] = useState("");
  const [bookingTime, setBookingTime] = useState("");
  const [bookingPhone, setBookingPhone] = useState("");
  const [bookingPropertyType, setBookingPropertyTime] = useState("");
  const [bookingAddress, setBookingAddress] = useState("");
  const [bookingAddressDetails, setBookingAddressDetails] = useState({});
  const [bookingCustomerUID, setBookingCustomerUID] = useState("");
  const [bookingMaterials, setBookingMaterials] = useState("");
  const [bookingCategory, setBookingCategory] = useState("");
  const [bookingCity, setBookingCity] = useState("");
  const [bookingServices, setBookingServices] = useState([]);
  const [bookingDistanceRadius, setBookingDistanceRadius] = useState(0);
  const [bookingEmail, setBookingEmail] = useState("");
  const [bookingFeeDistance, setBookingFeeDistance] = useState(0);
  const [bookingPaymentMethod, setBookingPaymentMethod] = useState("");
  const [bookingSubTotal, setBookingSubTotal] = useState(0);
  const [bookingTotal, setBookingTotal] = useState("");
  const [coordinates, setCoordinates] = useState({
    latitude: 10.336641527084641,
    longitude: 123.91533800644042,
  });
  const [isMapReady, setIsMapReady] = useState(false);

  // Calculate the map height as a fraction of the screen height
  const screenHeight = Dimensions.get("window").height;
  const mapHeight = screenHeight * 0.4; // 40% of the screen height

  // Assuming you have these states or props available
  const providerLocation = {
    latitude: providerCoordinates.latitude,
    longitude: providerCoordinates.longitude,
  };
  const customerLocation = {
    latitude: coordinates.latitude,
    longitude: coordinates.longitude,
  };
  const [isLoading, setIsLoading] = useState(true);

  const [cancelModalVisible, setCancelModalVisible] = useState(false);

  const [CountDownBookingVisible, setCountDownBookingVisible] = useState(false);
  const [CountDownBookingFlag, setCountDownBookingFlag] = useState(true);
  const [BookingNotFoundVisible, setBookingNotFoundVisible] = useState(false);
  const [countdown, setCountdown] = useState(60); // Initial countdown value in seconds
  const intervalRef = useRef(null);

  useEffect(() => {
    const countdownInterval = setInterval(() => {
      setCountdown((prevCount) => prevCount - 1);
    }, 1000);

    // Cleanup interval on component unmount
    return () => clearInterval(countdownInterval);
  }, []);

  useEffect(() => {
    if (countdown === 15 && CountDownBookingFlag) {
      setCountDownBookingVisible(true);
    } else if (countdown === 0) {
      declineBooking();
      setCountDownBookingVisible(false);
    }
  }, [countdown]);

  const closeCountDownModal = () => {
    setCountDownBookingVisible(false);
    console.log("closeCountDownModal");
  };
  const openCancelModal = () => {
    setCancelModalVisible(true);
  };

  const closeCancelModal = () => {
    setCancelModalVisible(false);
  };

  // Function to handle directions
  const handleGetDirections = () => {
    const data = {
      source: providerLocation,
      destination: customerLocation,
      params: [
        {
          key: "travelmode",
          value: "driving", // could be "walking", "bicycling" or "transit" as well
        },
        {
          key: "dir_action",
          value: "navigate", // this launches navigation directly
        },
      ],
    };

    const url = `https://www.google.com/maps/dir/?api=1&origin=${data.source.latitude},${data.source.longitude}&destination=${data.destination.latitude},${data.destination.longitude}&travelmode=${data.params[0].value}`;
    Linking.openURL(url);
  };

  const acceptBooking = async () => {
    // Create a reference to the Firestore database using your app instance
    const db = getFirestore();
    // Get the user's UID
    const auth = getAuth();
    const providerUID = auth.currentUser.uid;

    // Create references to the user's document and the appForm2 subcollection
    const providerDocRef = doc(db, "providerProfiles", providerUID);

    try {
      await runTransaction(db, async (transaction) => {
        // Get the provider's document snapshot
        const providerSnapshot = await transaction.get(providerDocRef);
        const providerBookingID = providerSnapshot.data().bookingID;

        if (!providerBookingID) {
          console.log("BookingID is blank");
          setBookingNotFoundVisible(true); // set visible for error booking has been canceled/already booked
          throw new Error("BookingID is blank");
        }

        console.log("BookingID is not blank");

        const activeBookings = collection(providerDocRef, "activeBookings");
        const serviceBookingsCollection = collection(db, "serviceBookings");

        // Get the service booking document using userBookingID
        const serviceBookingDocRef = doc(serviceBookingsCollection, userBookingID);
        const serviceBookingSnapshot = await transaction.get(serviceBookingDocRef);

        if (!serviceBookingSnapshot.exists()) {
          console.error("Service Booking document does not exist");
          return;
          throw new Error("Service Booking document does not exist");
        }else{
          
        // Update the acceptedBy field within the service booking document
        const updatedBookings = [...serviceBookingSnapshot.data().bookings];

        // Check if the booking has already been accepted
        if (updatedBookings[bookingIndex].bookingAccepted || updatedBookings[bookingIndex].acceptedBy) {
          console.error("Booking has already been accepted by another provider.");
          setBookingNotFoundVisible(true);    // set visible for error booking has already been accepted
          return;
          throw new Error("Booking has already been accepted by another provider.");
        }else{
          updatedBookings[bookingIndex].acceptedBy = providerUID;
          updatedBookings[bookingIndex].bookingAccepted = true;
  
          // Update the service booking document
          transaction.update(serviceBookingDocRef, {
            bookings: updatedBookings,
          });
          console.log("acceptedBy field updated in serviceBookings document.");
  
          // Update the availability field within the provider document after the provider accepts a booking
          transaction.update(providerDocRef, {
            // availability: "busy",
            availability: "available",
            bookingID: "",
            bookingIndex: "",
            bookingMatched: false,
          });
          console.log("Provider Status is now occupied");
  
          const newBookingData = {
            address: bookingAddress,
            addressDetails: bookingAddressDetails,
            customerUID: bookingCustomerUID,
            bookingAccepted: bookingAccepted,
            bookingAssigned: bookingAssigned,
            bookingID: bookingID,
            category: bookingCategory,
            city: bookingCity,
            coordinates: {
              latitude: coordinates.latitude,
              longitude: coordinates.longitude,
            },
            date: bookingDate,
            distanceRadius: bookingDistanceRadius,
            email: bookingEmail,
            feeDistance: bookingFeeDistance,
            materials: bookingMaterials,
            name: bookingName,
            paymentMethod: bookingPaymentMethod,
            phone: bookingPhone,
            propertyType: bookingPropertyType,
            service: bookingServices,
            subTotal: bookingSubTotal,
            time: bookingTime,
            title: bookingTitle,
            totalPrice: bookingTotal,
            status: "Upcoming",
          };
  
          const docRef = await addDoc(activeBookings, newBookingData);
          setCountDownBookingVisible(false);
          setCountDownBookingFlag(false);
  
          // Get the unique ID of the newly added document
          const newDocumentID = docRef.id;
          console.log("Document added to 'activeBookings' successfully.");
          navigation.navigate("ViewBookingDetails", {
            newDocumentID: newDocumentID,
            matchedBookingID: matchedBookingID,
            providerLocation: providerLocation, // Include providerLocation in the route parameters
          });
        }
        }
      });
    } catch (error) {
      console.error("Error updating user data:", error); // Handle the error, e.g., display an error message to the user
      setBookingNotFoundVisible(true);   
    }
  };

  // const acceptBooking = async () => {
  //   // Create a reference to the Firestore database using your app instance
  //   const db = getFirestore();
  //   // Get the user's UID
  //   const auth = getAuth();
  //   const providerUID = auth.currentUser.uid;

  //   // Create references to the user's document and the appForm2 subcollection
  //   const providerDocRef = doc(db, "providerProfiles", providerUID);

  //   // Get the document snapshot
  //   const providerSnapshot = await getDoc(providerDocRef);
  //   const providerBookingID = providerSnapshot.data().bookingID;

  //   if(providerBookingID) {
  //     console.log("BookingID is not blank");
  //     try {
  //       const activeBookings = collection(providerDocRef, "activeBookings");
  //       const serviceBookingsCollection = collection(db, "serviceBookings");
  
  //       // Get the service booking document using userBookingID
  //       const serviceBookingDocRef = doc(
  //         serviceBookingsCollection,
  //         userBookingID
  //       );
  
  //       // Get the document snapshot
  //       const serviceBookingSnapshot = await getDoc(serviceBookingDocRef);
  
  //       if (serviceBookingSnapshot.exists()) {
  //         // Update the acceptedBy field within the service booking document
  //         const updatedBookings = [...serviceBookingSnapshot.data().bookings];
  //         updatedBookings[bookingIndex].acceptedBy = providerUID;
  //         updatedBookings[bookingIndex].bookingAccepted = true;
  
  //         // Update the service booking document
  //         await updateDoc(serviceBookingDocRef, {
  //           bookings: updatedBookings,
  //         });
  //         console.log("acceptedBy field updated in serviceBookings document.");
  //       } else {
  //         console.error("Service Booking document does not exist");
  //       }
  
  //       if (providerSnapshot.exists()) {
  //         // Update the availability field within the provider document
  //         await updateDoc(providerDocRef, {
  //           availability: "busy",
  //         });
  //         console.log("Provider Status is now occupied");
  //         const docRef = await addDoc(activeBookings, {
  //           address: bookingAddress,
  //           addressDetails: bookingAddressDetails,
  //           customerUID: bookingCustomerUID,
  //           bookingAccepted: bookingAccepted,
  //           bookingAssigned: bookingAssigned,
  //           bookingID: bookingID,
  //           category: bookingCategory,
  //           city: bookingCity,
  //           coordinates: {
  //             latitude: coordinates.latitude,
  //             longitude: coordinates.longitude,
  //           },
  //           date: bookingDate,
  //           distanceRadius: bookingDistanceRadius,
  //           email: bookingEmail,
  //           feeDistance: bookingFeeDistance,
  //           materials: bookingMaterials,
  //           name: bookingName,
  //           paymentMethod: bookingPaymentMethod,
  //           phone: bookingPhone,
  //           propertyType: bookingPropertyType,
  //           service: bookingServices,
  //           subTotal: bookingSubTotal,
  //           time: bookingTime,
  //           title: bookingTitle,
  //           totalPrice: bookingTotal,
  //           status: "Upcoming",
  //         });
  //         setCountDownBookingVisible(false);
  //         setCountDownBookingFlag(false);
  //         // Get the unique ID of the newly added document
  //         const newDocumentID = docRef.id;
  //         console.log("Document added to 'activeBookings' successfully.");
  //         navigation.navigate("ViewBookingDetails", {
  //           newDocumentID: newDocumentID,
  //           matchedBookingID: matchedBookingID,
  //           providerLocation: providerLocation, // Include providerLocation in the route parameters
  //         })
  //       } else {
  //         console.error("Provider Profile does not exists");
  //       }
  //     } catch (error) {
  //       console.error("Error updating user data:", error);   // Handle the error, e.g., display an error message to the user
  //     }
  //   }else{
  //     console.log("BookingID is blank");
  //     setBookingNotFoundVisible(true);    // set visible for error booking has been canceled/already booked
  //   }

  // };
  const declineBooking = async () => {
    console.log("Decline Booking");

    console.log(bookingID);

    // Create a reference to the Firestore database using your app instance
    const db = getFirestore();

    // Get the user's UID
    const auth = getAuth();
    const providerUID = auth.currentUser.uid;

    // Create a reference to the user's document
    const providerDocRef = doc(db, "providerProfiles", providerUID);

    const serviceBookingsCollection = collection(db, "serviceBookings");

    // Get the service booking document using userBookingID
    const serviceBookingDocRef = doc(serviceBookingsCollection, userBookingID);

    // Get the document snapshot
    const serviceBookingSnapshot = await getDoc(serviceBookingDocRef);

    if (serviceBookingSnapshot.exists()) {
      // Update the acceptedBy field within the service booking document
      const updatedBookings = [...serviceBookingSnapshot.data().bookings];
      updatedBookings[bookingIndex].blackListed = bookingID;

      // Get the existing blackListed array
      const existingBlackListed =
        serviceBookingSnapshot.data().blackListed || [];

      // Update the service booking document
      await updateDoc(serviceBookingDocRef, {
        bookings: updatedBookings,
        blackListed: [...existingBlackListed, bookingID],
      });

      console.log("blackListed field updated in serviceBookings document.");
    } else {
      console.error("Service Booking document does not exist");
    }

    try {
      // Get the provider document
      const providerDocSnapshot = await getDoc(providerDocRef);

      if (providerDocSnapshot.exists()) {
        const blackListedArray = providerDocSnapshot.data().blackListed;

        console.log(blackListedArray);

        // Update the provider document
        await updateDoc(providerDocRef, {
          availability: "available",
          bookingID: "",
          bookingIndex: null,
          bookingMatched: false,
          blackListed: arrayUnion(bookingID),
        });
        setCountDownBookingVisible(false);
        setCountDownBookingFlag(false);

        navigation.navigate("BottomTabsRoot", {
          screen: "Homepage",
          bookingAccepted: false,
          bookingAssigned: false,
        });
      } else {
        console.log("Provider document does not exist.");
      }
    } catch (error) {
      console.error("Error updating provider document:", error);
    }
  };

  const onMapLayout = () => {
    setIsMapReady(true);
  };

  const [initialMapRegion, setInitialMapRegion] = useState({
    latitude: providerCoordinates.latitude,
    longitude: providerCoordinates.longitude,
    latitudeDelta: 0.008,
    longitudeDelta: 0.008,
  });

  const [initialMarkerPosition, setInitialMarkerPosition] = useState({
    latitude: providerCoordinates.latitude,
    longitude: providerCoordinates.longitude,
  });

  const [markerPosition, setMarkerPosition] = useState(initialMarkerPosition);

  const [reverseGeocodedAddress, setReverseGeocodedAddress] = useState(null);
  const [cityAddress, setcityAddress] = useState(null);

  const handleMapPress = (event) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setMarkerPosition({ latitude, longitude });
    // fetchReverseGeolocation(
    //   markerPosition.latitude,
    //   markerPosition.longitude
    // );
  };

  const handleMarkerDragEnd = (event) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setMarkerPosition({ latitude, longitude });
    // fetchReverseGeolocation(
    //   markerPosition.latitude,
    //   markerPosition.longitude
    // );
  };

  const getFormattedServiceName = () => {
    if (!bookingTitle || !bookingCategory) {
      return 'Service'; // Default text or handle as needed
    }

    // Check if the title is "Pet Care" or "Gardening"
    if (bookingTitle === "Pet Care" || bookingTitle === "Gardening" || bookingTitle === "Cleaning") {
      return bookingCategory;
    } else {
      // If not, concatenate the title and category
      return `${bookingTitle} ${bookingCategory}`;
    }
  };

  const getServiceImageSource = (category, service) => {
    if(category === "Plumbing") {
      switch (service) {
        case "Installation":
          return require("../assets/plumbing-installation.png");
        case "Repairs/Replacement":
          return require("../assets/plumbing-repair.png");
        default:
          return require("../assets/plumbing-installation.png");
      }
    }else if(category === "Electrical") {
      switch (service) {
        case "Installation":
          return require("../assets/electrical-installation.png");
        case "Repairs/Replacement":
          return require("../assets/electrical-repair.png");
        default:
          return require("../assets/electrical-installation.png");
      }
    }else if(category === "Carpentry") {
      switch (service) {
        case "Installation":
          return require("../assets/carpentry-installation.png");
        case "Repairs/Replacement":
          return require("../assets/carpentry-repair.png");
        case "Furniture Assembly And Disassembly":
          return require("../assets/furniture-assembly-and-disassembly.png");
        default:
          return require("../assets/carpentry-installation.png");
      }
    }else if(category === "Cleaning" || category === "Pet Care" || category === "Gardening"){
      switch (service) {
        case "Standard Cleaning":
          return require("../assets/standard-cleaning.png");
        case "Deep Cleaning":
          return require("../assets/deep-cleaning.png");
        case "Electronic Appliance Cleaning":
          return require("../assets/electronic-appliance-cleaning.png");
        case "Pest Control":
          return require("../assets/pest-control.png");
        case "Dog Training":
          return require("../assets/dog-training.png");
        case "Dog Pet Grooming":
          return require("../assets/pet-grooming.png");
        case "Cat Pet Grooming":
          return require("../assets/pet-grooming.png");
        case "Bird Pet Grooming":
          return require("../assets/pet-grooming.png");
        case "Rabbit Pet Grooming":
          return require("../assets/pet-grooming.png");
        case "Dog Pet Sitting":
          return require("../assets/pet-sitting.png");
        case "Cat Pet Sitting":
          return require("../assets/pet-sitting.png");
        case "Bird Pet Sitting":
          return require("../assets/pet-sitting.png");
        case "Rabbit Pet Sitting":
          return require("../assets/pet-sitting.png");
        case "Garden Maintenance":
          return require("../assets/garden-maintenance.png");
        case "Landscape Design and Planning":
          return require("../assets/landscape-design-and-planning.png");
        case "Irrigation System Installation/Repairs":
          return require("../assets/irrigation-system.png");
        case "Pest and Disease Management":
          return require("../assets/pest-and-disease-management.png");
        default:
          return require("../assets/standard-cleaning.png");
      }
    }
  };

  const fetchReverseGeolocation = async (latitude, longitude) => {
    try {
      enableLatestRenderer();
      console.log("Fetched Latitude: ", latitude);
      console.log("Fetched Longitude: ", longitude);

      const apiKey = "AIzaSyAuaR8dxr95SLUTU-cidS7I-3uB6mEoJmA"; // Replace with your Google Maps API key
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&result_type=street_address&key=${apiKey}`
      );

      if (response.data.results && response.data.results.length > 0) {
        const data = response.data.results;
        const firstResult = response.data.results[0];
        const formattedAddress = firstResult.formatted_address;

        // Modify the address components to exclude the region, zip code, and country
        const addressComponents1 = firstResult.address_components.filter(
          (component) => {
            return ![
              "administrative_area_level_1",
              "postal_code",
              "country",
            ].includes(component.types[0]);
          }
        );
        console.log("Address Components: ", addressComponents1);

        const formattedAddress1 = addressComponents1
          .map((component) => component.long_name)
          .join(", ");
        console.log("Newly Formatted Address 1: ", formattedAddress1);
        const cityParts = formattedAddress1.split(", ");
        const cityAddress = cityParts[cityParts.length - 1];
        console.log("City Address:", cityAddress);

        // Extracting the city from the formatted address
        const addressComponents = firstResult.address_components;
        let city = "";
        for (const component of addressComponents) {
          console.log("Address Types: ", component.types);
          if (component.types.includes("locality")) {
            city = component.long_name;
            break;
          }
        }

        console.log("City Name 1: ", city);

        // Check if the city is not one of the specified city names
        if (["Home", "Apartment", "Condo", "others", "Others"].includes(city)) {
          console.log("City: ", city);
          return;
        } else if (
          ![
            "Cebu",
            "Cebu City",
            "Mandaue",
            "Mandaue City",
            "Lapu-Lapu",
            "Lapu-Lapu City",
          ].includes(city)
        ) {
          // Store administrative_area_level_2 in the city variable
          for (const component of firstResult.address_components) {
            if (component.types.includes("administrative_area_level_2")) {
              city = component.long_name;
              break;
            }
          }
        }

        console.log("City Name 2: ", city);

        setReverseGeocodedAddress(formattedAddress1);
        setcityAddress(city);
        console.log("City:", city);
      } else {
        // If Google Geocoding API doesn't return results, try OpenStreetMap Nominatim API
        try {
          const osmResponse = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const osmData = await osmResponse.json();
          if (osmData.display_name) {
            const addressParts = osmData.display_name.split(", ");

            for (const parts of addressParts) {
              console.log("Parts: ", parts);
              if (parts == "Cebu" || parts == "Cebu City") {
                setcityAddress("Cebu City");
                console.log("City: Cebu City");
              } else if (parts == "Mandaue" || parts == "Mandaue City") {
                setcityAddress("Mandaue City");
                console.log("City: Mandaue City");
              } else if (parts == "Lapu-Lapu" || parts == "Lapu-Lapu City") {
                setcityAddress("Lapu-Lapu City");
                console.log("City: Lapu-Lapu City");
              }
            }

            // Remove the last 3 parts (region, zip code, and country)
            const modifiedAddress = addressParts.slice(0, -3).join(", ");
            console.log("Modified Address:", modifiedAddress);

            setReverseGeocodedAddress(modifiedAddress);
            console.log("OpenStreetMap Location:", osmData.display_name);
          } else {
            setReverseGeocodedAddress("Location not found");
            console.log("Location not found with OpenStreetMap");
          }
        } catch (osmError) {
          console.error(
            "Error fetching location with OpenStreetMap:",
            osmError
          );
        }
      }
    } catch (error) {
      console.error("Error fetching reverse geolocation:", error);
    }
  };

  useEffect(() => {
    if (isMapReady) {
      // Perform map operations here
    }
  }, [isMapReady]);

  // useEffect(() => {
  //   if (markerPosition && mapRef.current) {
  //     const { width, height } = mapRef.current.getDimensions();

  //     if (width !== 0 && height !== 0) {
  //       fetchReverseGeolocation(markerPosition.latitude, markerPosition.longitude);
  //     } else {
  //       // Maybe set a timeout or handle the scenario where dimensions are not available
  //     }
  //   }
  // }, [markerPosition]);

  useEffect(() => {
    if (markerPosition) {
      fetchReverseGeolocation(
        markerPosition.latitude,
        markerPosition.longitude
      );
    }
    console.log("Is TextInput focused:", isInputFocused);
  }, [markerPosition, isInputFocused]);

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true); // Set loading to true before fetching data

        const db = getFirestore(); // Use getFirestore() to initialize Firestore

        // Get the user's UID
        const auth = getAuth();
        const user = auth.currentUser.uid;
        console.log(user);
        console.log("Selected Id: ", userBookingID);

        // Reference to the "manageAddress" collection for the specified userUID
        // const userBookingDocRef = collection(
        //   db,
        //   "serviceBookings",
        //   userID
        // );

        const userBookingDocRef = doc(db, "serviceBookings", userBookingID);

        const bookingsQuery = query(userBookingDocRef);

        const docSnapshot = await getDoc(bookingsQuery);

        if (docSnapshot.exists()) {
          const bookingData = docSnapshot.data();
          console.log("Booking Data: ", bookingData);

          if (
            Array.isArray(bookingData.bookings) &&
            bookingData.bookings.length > 0
          ) {
            const indexToFetch = bookingIndex; // Set the desired index here
            const matchingBooking = bookingData.bookings[indexToFetch];
            if (matchingBooking) {
              // Fetch data and display through console.log
              const materials = matchingBooking.materials;
              console.log("Fetching data for booking:", matchingBooking);
              console.log("Services: ", matchingBooking.service);
              const servicesData = matchingBooking.service.map((doc) => doc);
              console.log("Data Services: ", servicesData);
              if (materials == "useProviderMaterials") {
                setBookingMaterials("Supplied by Provider");
              } else {
                setBookingMaterials("Customer-Provided");
              }
              setBookingAccepted(matchingBooking.bookingAccepted);
              setBookingAssigned(matchingBooking.bookingAssigned);
              setBookingID(matchingBooking.bookingID);
              setBookingCity(matchingBooking.city);
              setBookingDate(matchingBooking.date);
              setBookingDistanceRadius(matchingBooking.distanceRadius);
              setBookingEmail(matchingBooking.email);
              setBookingFeeDistance(matchingBooking.feeDistance);
              setBookingName(matchingBooking.name);
              setBookingPaymentMethod(matchingBooking.paymentMethod);
              setBookingPhone(matchingBooking.phone);
              setBookingPropertyTime(matchingBooking.propertyType);
              setBookingSubTotal(matchingBooking.subTotal);
              setBookingTotal(matchingBooking.totalPrice);
              setBookingTime(matchingBooking.time);
              setBookingTitle(matchingBooking.title);
              setBookingAddress(matchingBooking.address);
              setBookingAddressDetails(matchingBooking.addressDetails);
              setBookingCustomerUID(matchingBooking.customerUID);
              setBookingCategory(matchingBooking.category);
              setBookingServices(matchingBooking.service);
              setCoordinates({
                latitude: matchingBooking.coordinates.latitude,
                longitude: matchingBooking.coordinates.longitude,
              });

              console.log("Date: ", bookingDate);
              console.log("Time: ", bookingTime);
              console.log("Address: ", bookingAddress);
              console.log("Materials: ", bookingMaterials);
              console.log("Category: ", bookingCategory);
              console.log("Services: ", bookingServices);
              console.log("Total Price: ", bookingTotal);
              console.log("Coordinates: ", coordinates);
            } else {
              console.log(`Booking at index ${indexToFetch} not found.`);
            }
          } else {
            console.log("No savedOptions found in the document.");
          }
          setIsLoading(false); // Set loading to false once data is fetched
        } else {
          console.log("No such document!");
        }
        // if (!querySnapshot.empty) {
        //   querySnapshot.forEach((doc) => {
        //     const bookingData = doc.data();
        //     console.log("Booking Data: ", bookingData);

        //     if (
        //       Array.isArray(bookingData.bookings) &&
        //       bookingData.bookings.length > 0
        //     ) {
        //       // Handle the case where there are savedOptions
        //     } else {
        //       console.log("No savedOptions found in the document.");
        //     }
        //   });
        // } else {
        //   console.log("No documents found with the specified criteria.");
        // }

        // if (isAcceptOrdersEnabled && !bookingAccepted ) { // Check if the switch is turned on
        //   const db = getFirestore();
        //   const serviceBookingsCollection = collection(db, "serviceBookings");

        //   const q = query(serviceBookingsCollection ,where("bookingAssigned", "==", false));

        //   const querySnapshot = await getDocs(q);

        //   if (!querySnapshot.empty) {
        //     // doc.data() is never undefined for query doc snapshots
        //     // console.log(doc.id, " => ", doc.data());
        //     querySnapshot.forEach((doc) => {
        //       // Access data of the document using .data()
        //       const bookingData = doc.data();
        //       const id = doc.id;

        //       // Access specific fields like "name"
        //       const name = bookingData.name;
        //       const accepted = bookingData.bookingAccepted;
        //       const assigned = bookingData.bookingAssigned;

        //       if(!assigned){
        //         console.log("ID: ", id);
        //         console.log("Name: ", name);
        //         navigation.navigate("NewBooking"), {
        //           name: name,
        //           userID: id,
        //         };
        //       }
        //     });

        //   } else {
        //     console.log("The 'serviceBookings' collection is empty.");
        //   }
        // }else{
        //   console.log("The 'bookingAssigned' collection is empty.");
        // }
      } catch (error) {
        console.error("Error retrieving data:", error);
      }
    }

    fetchData(); // Call the fetchData function immediately
  }, [userBookingID]); // Add userID as a dependency

  const animationController = useRef(new Animated.Value(0)).current;
  const [showContent, setShowContent] = useState(false);

  const toggleListItem = () => {
    const config = {
      duration: 300,
      toValue: showContent ? 0 : 1,
      useNativeDriver: true,
    };
    Animated.timing(animationController, config).start();
    LayoutAnimation.configureNext(toggleAnimation);
    setShowContent(!showContent);
  };

  const arrowTransform = animationController.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        // Show the cancel modal when the back button is pressed
        openCancelModal();
        return true; // Prevent the default behavior (exit the app)
      }
    );

    return () => {
      backHandler.remove();
    };
  }, []); // Remove the dependency array so that this effect doesn't depend on cancelModalVisible

  return isLoading ? (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size={60} color="#0000FF" />
    </View>
  ) : (
    <SafeAreaView style={[styles.newBooking, styles.newBookingLayout]}>
      <StatusBar barStyle="default" />
      <View style={[styles.mapContainer]}>
        <MapView
          ref={mapRef}
          // style={[styles.map, { height: mapHeight }]}
          style={styles.map}
          region={initialMapRegion}
          onLayout={onMapLayout}
        >
          <Marker
            coordinate={markerPosition}
            title="Provider's Location"
            draggable={false}
            image={require("../assets/provider-2.png")}
          />
          {coordinates.latitude && coordinates.longitude && (
            <Marker
              coordinate={coordinates}
              title="Customer's Location"
              draggable={false}
              image={require("../assets/home-2.png")}
            />
          )}
          {/* Directions Button */}
        </MapView>
        <TouchableOpacity
          style={styles.directionsButton}
          onPress={handleGetDirections}
        >
          <Image
            source={require("../assets/navigation-1-1.png")}
            style={styles.buttonIcon}
          />
        </TouchableOpacity>
      </View>
      <ScrollView
        style={styles.body}
        indicatorStyle="default"
        showsVerticalScrollIndicator={true}
        showsHorizontalScrollIndicator={false}
        pagingEnabled={false}
        contentContainerStyle={styles.bodyScrollViewContent}
      >
        <View style={[styles.bodyInner, styles.frameFlexBox3]}>
          <View style={styles.frameParent}>
            <View
              style={[styles.bookingDetailsLabelWrapper, styles.parentFlexBox]}
            >
              <View style={styles.bookingDetailsLabel}>
                <View style={styles.bookingIdWrapper}>
                  <Text style={styles.bookingId}>Booking ID:</Text>
                </View>
                <View style={styles.ljkhParent}>
                  <Text style={[styles.ljkh, styles.ljkhFlexBox]}>
                    {bookingID}
                  </Text>
                  <Pressable style={[styles.copyButton, styles.frameFlexBox3]}>
                    <Image
                      style={styles.vectorIcon}
                      contentFit="cover"
                      source={require("../assets/vector10.png")}
                    />
                  </Pressable>
                </View>
              </View>
            </View>
            <View
              style={[
                styles.bookingDetailsLabelParent,
                styles.bookingDetailsFlexBox,
              ]}
            >
              <View style={styles.bookingDetailsLabel}>
                <Text style={styles.bookingId}>Booking details</Text>
              </View>
              {/* <View style={styles.container}>
                <Text style={styles.coordinatesText}>
                  Latitude: {coordinates.latitude}
                </Text>
                <Text style={styles.coordinatesText}>
                  Longitude: {coordinates.longitude}
                </Text>
              </View> */}
              <View style={[styles.dateAndTimeFrame, styles.frameFlexBox1]}>
                <View style={styles.dateRangeLightWrapper}>
                  <Image
                    style={styles.dateRangeLightIcon}
                    contentFit="cover"
                    source={require("../assets/date-range-light1.png")}
                  />
                </View>
                <View style={styles.dateAndTimeFrameInner}>
                  <View style={styles.dateWrapper}>
                    <Text style={[styles.date, styles.dateTypo]}>Date</Text>
                  </View>
                </View>
                <View style={styles.frameFrame}>
                  <View style={[styles.frame, styles.frameFlexBox3]}>
                    <Text style={[styles.august112023, styles.textTypo1]}>
                      {bookingDate}
                    </Text>
                  </View>
                </View>
              </View>
              <View style={[styles.dateAndTimeFrame, styles.frameFlexBox1]}>
                <View style={styles.dateRangeLightWrapper}>
                  <View style={styles.clock1Wrapper}>
                    <Image
                      style={styles.clock1Icon}
                      contentFit="cover"
                      source={require("../assets/clock-1.png")}
                    />
                  </View>
                </View>
                <View style={styles.dateAndTimeFrameInner}>
                  <View style={[styles.timeWrapper, styles.timeLayout]}>
                    <Text style={[styles.time, styles.timeLayout]}>Time</Text>
                  </View>
                </View>
                <View style={styles.frameFrame}>
                  <View style={[styles.frame, styles.frameFlexBox3]}>
                    <Text style={[styles.august112023, styles.textTypo1]}>
                      {bookingTime}
                    </Text>
                  </View>
                </View>
              </View>
              <View style={[styles.dateAndTimeFrame, styles.frameFlexBox1]}>
                <View style={styles.markersNearPinletMarkerWrapper}>
                  <Image
                    style={styles.markersNearPinletMarker}
                    contentFit="cover"
                    source={require("../assets/markers--near-pinlet-marker1.png")}
                  />
                </View>
                <View style={styles.dateAndTimeFrameInner}>
                  <View style={styles.addressWrapper}>
                    <Text style={[styles.time, styles.timeLayout]}>
                      Address
                    </Text>
                  </View>
                </View>
                <View style={styles.frameFrame}>
                  <View style={styles.frame2}>
                    <Text style={[styles.august112023, styles.textTypo1]}>
                      {bookingAddress}
                    </Text>
                  </View>
                </View>
              </View>
              <View style={[styles.dateAndTimeFrame, styles.frameFlexBox1]}>
                <View style={styles.dateRangeLightWrapper}>
                  <Image
                    style={styles.dateRangeLightIcon}
                    contentFit="cover"
                    source={require("../assets/mop-1.png")}
                  />
                </View>
                <View style={styles.frameFrame}>
                  <View style={styles.materialsWrapper}>
                    <Text style={[styles.date, styles.dateTypo]}>
                      Materials
                    </Text>
                  </View>
                </View>
                <View style={styles.frameWrapper3}>
                  <View style={styles.frame2}>
                    <Text style={[styles.august112023, styles.textTypo1]}>
                      {bookingMaterials}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
            <View
              style={[styles.bookingDetailsLabelParent, styles.parentFlexBox]}
            >
              <View style={styles.bookingDetailsLabel}>
                <Text style={styles.bookingId}>Service details</Text>
              </View>
              <TouchableOpacity
                onPress={() => toggleListItem()}
                style={[styles.dateAndTimeFrame2, styles.frameFlexBox1]}
              >
                <View style={styles.dateRangeLightWrapper}>
                  <Image
                    style={styles.plumbingInstallationPic}
                    contentFit="cover"
                    source={getServiceImageSource(bookingTitle, bookingCategory)}
                  />
                </View>
                <View style={styles.frameFrame}>
                  <View style={styles.frame2}>
                    <View style={styles.plumbingInstallationWrapper}>
                      <Text style={[styles.date, styles.dateTypo]}>
                        {/* Plumbing Installation */}
                        {getFormattedServiceName()}
                      </Text>
                    </View>
                  </View>
                </View>
                <Animated.Image
                  style={[
                    styles.collapseArrowIcon,
                    styles.frameWrapper7Layout,
                    { transform: [{ rotate: arrowTransform }] },
                  ]}
                  contentFit="cover"
                  source={require("../assets/collapse-arrow.png")}
                />
              </TouchableOpacity>
              {showContent && (
                <View style={[styles.frameFlexBox1]}>
                  <View style={styles.vectorWrapper}>
                    <Image
                      style={[styles.frameChild, styles.newBookingLayout]}
                      contentFit="cover"
                      source={require("../assets/line-741.png")}
                    />
                  </View>
                  <View
                    style={[styles.subcategoriesFrame, styles.frameFlexBox1]}
                  >
                    {bookingServices.map((item, index) => {
                      const { name, service, totalPrice, value } = item;
                      return (
                        <View
                          key={index}
                          style={[
                            styles.dateAndTimeFrame4,
                            styles.dateFrameFlexBox,
                          ]}
                        >
                          <View style={styles.frameWrapper22}>
                            <View style={styles.frame2}>
                              <Text
                                style={[
                                  styles.septicTank,
                                  styles.septicTankTypo,
                                ]}
                              >
                                {name}
                              </Text>
                            </View>
                          </View>
                          <View
                            style={[
                              styles.dateAndTimeFrameInner1,
                              styles.frameFlexBox,
                            ]}
                          >
                            <View style={styles.newBookingWrapper}>
                              <View
                                style={[
                                  styles.frameWrapper7,
                                  styles.frameWrapper7Layout,
                                ]}
                              >
                                <View style={styles.bookingDetailsLabel}>
                                  <Text style={[styles.text, styles.textTypo1]}>
                                    {value}
                                  </Text>
                                </View>
                              </View>
                            </View>
                          </View>
                        </View>
                      );
                    })}
                  </View>
                </View>
              )}
            </View>
          </View>
        </View>
      </ScrollView>
      <View style={[styles.frameParent8, styles.frameFlexBox3]}>
        <View style={styles.frameParent7}>
          <View style={styles.frameParent7}>
            <View style={styles.youWillEarnWrapper}>
              <Text style={styles.youWillEarn}>You will earn</Text>
            </View>
          </View>
          <View style={styles.frameFlexBox1}>
            <View style={styles.youWillEarnWrapper}>
              <Text style={styles.text15}>
                ₱{bookingTotal}.00
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.trackBookingBtnParent}>
          <Pressable
            style={[styles.trackBookingBtn, styles.btnFlexBox]}
            onPress={declineBooking}
          >
            <Text style={[styles.viewAllServices, styles.newBooking1Typo]}>
              Decline
            </Text>
          </Pressable>
          <Pressable
            style={[styles.viewTimelineBtn, styles.btnFlexBox]}
            onPress={acceptBooking}
          >
            <Text style={[styles.viewAllServices, styles.newBooking1Typo]}>
              Accept
            </Text>
          </Pressable>
        </View>
      </View>
      <Modal animationType="fade" transparent visible={cancelModalVisible}>
        <View style={styles.logoutButtonOverlay}>
          <View style={styles.containerCancel}>
            <Pressable
              style={styles.logoutButtonBg}
              onPress={closeCancelModal}
            />
            <CancelBookingPrompt
              onClose={closeCancelModal}
              onYesPress={declineBooking}
            />
          </View>
        </View>
      </Modal>

      <Modal animationType="fade" transparent visible={CountDownBookingVisible}>
        <View style={styles.logoutButtonOverlay}>
          <View style={styles.containerCancel}>
            <Pressable
              style={styles.logoutButtonBg}
              //onPress={closeCancelModal}
              // onClose={closeCountDownModal}
            />
            <CountDownBooking
              onClose={closeCountDownModal}
              //onYesPress={declineBooking}
            />
          </View>
        </View>
      </Modal>
      <Modal animationType="fade" transparent visible={BookingNotFoundVisible}>
        <View style={styles.logoutButtonOverlay}>
          <View style={styles.containerCancel}>
            <Pressable
              style={styles.logoutButtonBg}
              //onPress={closeCancelModal}
              // onClose={closeCountDownModal}
            />
            <BookingNotFound
              onClose={closeCountDownModal}
              //onYesPress={declineBooking}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  containerCancel: {
    backgroundColor: "white",
    borderRadius: 10,
  },
  logoutButtonOverlay: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(169, 169, 169, 0.7)", // Set the background color to grayish with transparency
  },
  logoutButtonBg: {
    position: "absolute",
    width: "100%",
    height: "100%",
    left: 0,
    top: 0,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    backgroundColor: "#1a244d",
  },
  // map: {
  //   flex: 1,
  //   // zIndex: 1,
  // },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  mapContainer: {
    height: "30%", // or whatever height you prefer
    marginHorizontal: 10, // Horizontal padding
    marginTop: 10, // Top padding
    borderRadius: 10, // If you want rounded corners
    overflow: "hidden", // This property will hide the map's overflow to respect the border radius
    borderWidth: 1,
    borderColor: "#ccc",
  },
  mapBox: {
    padding: 40,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  coordinatesText: {
    fontSize: 16,
    color: "#333",
    marginBottom: 10,
  },
  directionsButton: {
    position: "absolute",
    bottom: 10, // You can adjust this
    right: 10, // You can adjust this
    padding: 10,
    backgroundColor: "white", // Your desired color
    borderRadius: 20,
    elevation: 10, // For Android shadow
  },
  buttonIcon: {
    width: 30, // Size of the directions icon image
    height: 30,
  },
  bodyScrollViewContent: {
    flexDirection: "column",
    paddingHorizontal: 2,
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "flex-end",
  },
  newBookingLayout: {
    width: "100%",
    flex: 1,
  },
  dateFrameFlexBox: {
    paddingHorizontal: 0,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "stretch",
  },
  textClr: {
    color: Color.m3White,
    textAlign: "center",
  },
  frameFlexBox3: {
    justifyContent: "flex-end",
    alignItems: "center",
  },
  frameFlexBox2: {
    borderRadius: Border.br_3xs,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "stretch",
  },
  icons8Position: {
    zIndex: 0,
    position: "absolute",
  },
  frameWrapper7Layout: {
    height: 30,
    width: 30,
  },
  parentFlexBox: {
    marginTop: 10,
    justifyContent: "center",
    alignSelf: "stretch",
    backgroundColor: Color.m3White,
  },
  bookingDetailsFlexBox: {
    justifyContent: "center",
    alignSelf: "stretch",
    backgroundColor: Color.m3White,
  },
  ljkhFlexBox: {
    textAlign: "right",
    color: Color.lightLabelPrimary,
    flex: 1,
  },
  frameFlexBox1: {
    marginTop: 3,
    justifyContent: "center",
    alignSelf: "stretch",
  },
  dateTypo: {
    fontFamily: FontFamily.workSansMedium,
    fontWeight: "500",
    fontSize: FontSize.size_lg,
    color: Color.lightLabelPrimary,
    textAlign: "left",
  },
  textTypo1: {
    // textTransform: "capitalize",
    fontSize: FontSize.paragraphMedium15_size,
    fontFamily: FontFamily.workSansRegular,
  },
  timeLayout: {
    width: 79,
    alignItems: "center",
  },
  dateAndTimeFrame3SpaceBlock: {
    paddingVertical: Padding.p_8xs,
    display: "none",
  },
  septicTankTypo: {
    fontFamily: FontFamily.interRegular,
    fontSize: FontSize.levelSemibold14_size,
    textTransform: "capitalize",
    color: Color.lightLabelPrimary,
    flex: 1,
  },
  frameWrapperFlexBox: {
    alignItems: "flex-end",
    width: 68,
    display: "none",
    justifyContent: "center",
  },
  frameFlexBox: {
    width: 38,
    paddingHorizontal: Padding.p_9xs,
    paddingVertical: 0,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  textTypo: {
    color: Color.neutral07,
    lineHeight: 16,
    fontSize: FontSize.level2Medium12_size,
    fontFamily: FontFamily.interRegular,
    textAlign: "right",
    flex: 1,
  },
  btnFlexBox: {
    padding: Padding.p_xs,
    borderRadius: Border.br_mini,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    flex: 1,
  },
  newBooking1Typo: {
    fontFamily: FontFamily.title2Bold32,
    fontWeight: "700",
    fontSize: FontSize.title3Bold20_size,
  },
  icons8Location10021: {
    top: 0,
    left: 0,
    zIndex: 0,
    position: "absolute",
  },
  icons8Location10021Wrapper: {
    top: 20,
    left: 58,
    padding: Padding.p_3xs,
    justifyContent: "center",
    alignItems: "center",
  },
  frameContainer: {
    height: 198,
    flexDirection: "row",
  },
  frameWrapper: {
    borderStyle: "solid",
    borderColor: Color.colorLightgray_100,
    borderWidth: 1,
  },
  bookingId: {
    fontFamily: FontFamily.workSansSemiBold,
    color: Color.colorDarkslateblue_100,
    display: "flex",
    textAlign: "left",
    fontWeight: "600",
    fontSize: FontSize.title3Bold20_size,
    alignItems: "center",
    alignSelf: "stretch",
    flex: 1,
  },
  bookingIdWrapper: {
    width: 121,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  ljkh: {
    opacity: 0.89,
    fontFamily: FontFamily.workSansRegular,
    textAlign: "right",
    fontSize: FontSize.title3Bold20_size,
  },
  vectorIcon: {
    width: 13,
    height: 15,
  },
  copyButton: {
    marginLeft: 10,
    flexDirection: "row",
  },
  ljkhParent: {
    marginLeft: 10,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    flex: 1,
  },
  bookingDetailsLabel: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    alignSelf: "stretch",
  },
  bookingDetailsLabelWrapper: {
    paddingHorizontal: Padding.p_5xs,
    display: "none",
    paddingVertical: Padding.p_8xs,
  },
  dateRangeLightIcon: {
    height: 40,
    width: 40,
  },
  dateRangeLightWrapper: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  date: {
    flex: 1,
  },
  dateWrapper: {
    width: 83,
    alignItems: "center",
    flexDirection: "row",
  },
  dateAndTimeFrameInner: {
    marginLeft: 7,
    justifyContent: "center",
  },
  august112023: {
    textAlign: "right",
    color: Color.lightLabelPrimary,
    flex: 1,
  },
  frame: {
    flexDirection: "row",
    alignSelf: "stretch",
  },
  frameFrame: {
    marginLeft: 7,
    justifyContent: "center",
    flex: 1,
  },
  dateAndTimeFrame: {
    alignItems: "center",
    flexDirection: "row",
  },
  clock1Icon: {
    height: 32,
    width: 32,
  },
  clock1Wrapper: {
    padding: Padding.p_9xs,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  time: {
    fontFamily: FontFamily.workSansMedium,
    fontWeight: "500",
    fontSize: FontSize.size_lg,
    color: Color.lightLabelPrimary,
    textAlign: "left",
    display: "flex",
  },
  timeWrapper: {
    flexDirection: "row",
  },
  markersNearPinletMarker: {
    height: 41,
    width: 32,
  },
  markersNearPinletMarkerWrapper: {
    paddingHorizontal: Padding.p_9xs,
    paddingVertical: 0,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  addressWrapper: {
    width: 75,
    alignItems: "center",
    flexDirection: "row",
  },
  frame2: {
    alignItems: "center",
    flexDirection: "row",
    alignSelf: "stretch",
  },
  materialsWrapper: {
    width: 88,
    alignItems: "center",
    flexDirection: "row",
  },
  frameWrapper3: {
    width: 200,
    marginLeft: 7,
    justifyContent: "center",
  },
  bookingDetailsLabelParent: {
    padding: Padding.p_8xs,
  },
  plumbingInstallationPic: {
    height: 42,
    width: 40,
  },
  plumbingInstallationWrapper: {
    alignItems: "center",
    flexDirection: "row",
    flex: 1,
  },
  collapseArrowIcon: {
    marginLeft: 7,
  },
  dateAndTimeFrame2: {
    paddingTop: Padding.p_3xs,
    paddingBottom: Padding.p_8xs,
    paddingLeft: Padding.p_8xs,
    alignItems: "center",
    flexDirection: "row",
  },
  frameChild: {
    maxWidth: "100%",
    overflow: "hidden",
    maxHeight: "100%",
    alignSelf: "stretch",
  },
  vectorWrapper: {
    height: 1,
    alignItems: "center",
    alignSelf: "stretch",
  },
  text: {
    textAlign: "center",
    color: Color.m3White,
  },
  frameWrapper7: {
    borderRadius: Border.br_5xs,
    backgroundColor: Color.colorDarkslateblue_200,
    justifyContent: "center",
    alignItems: "center",
  },
  newBookingWrapper: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    flex: 1,
  },
  toiletSystem: {
    textAlign: "center",
  },
  frameWrapper8: {
    marginTop: 7,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "stretch",
  },
  frameParent2: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  frameParent3: {
    marginLeft: 7,
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  frameWrapper16: {
    width: 78,
    marginTop: 7,
    justifyContent: "center",
    alignItems: "center",
  },
  frame9: {
    display: "none",
    alignItems: "center",
    flexDirection: "row",
    alignSelf: "stretch",
  },
  frameWrapper21: {
    marginTop: 7,
  },
  dateAndTimeFrame3: {
    display: "none",
    paddingHorizontal: 0,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "stretch",
  },
  septicTank: {
    textAlign: "left",
  },
  frameWrapper22: {
    justifyContent: "center",
    flex: 1,
  },
  dateAndTimeFrameInner1: {
    marginLeft: 7,
  },
  text6: {
    display: "none",
  },
  frameWrapper25: {
    marginLeft: 7,
  },
  dateAndTimeFrame4: {
    paddingVertical: Padding.p_10xs,
    flexDirection: "row",
  },
  subcategoriesFrame: {
    paddingLeft: Padding.p_8xs,
  },
  frameGroup: {
    display: "none",
  },
  youWillEarn: {
    fontSize: FontSize.title3Bold20_size,
    fontFamily: FontFamily.levelSemibold14,
    color: Color.lightLabelPrimary,
    fontWeight: "800",
    textAlign: "center",
    flex: 1,
  },
  youWillEarnWrapper: {
    // width: 347,
    // height: 18,
    // paddingLeft: Padding.p_8xs,
    alignItems: "center",
    flexDirection: "row",
  },
  frameParent7: {
    justifyContent: "center",
    alignSelf: "stretch",
  },
  text15: {
    lineHeight: 26,
    fontWeight: "800",
    fontFamily: FontFamily.interExtraBold,
    color: Color.colorForestgreen,
    textAlign: "center",
    fontSize: FontSize.size_26,
    flex: 1,
  },
  viewAllServices: {
    letterSpacing: -0.2,
    lineHeight: 24,
    color: Color.neutral01,
    textAlign: "center",
    flex: 1,
  },
  trackBookingBtn: {
    backgroundColor: Color.colorFirebrick_200,
  },
  viewTimelineBtn: {
    backgroundColor: Color.colorDarkslategray_600,
    marginLeft: 10,
  },
  trackBookingBtnParent: {
    marginTop: 25,
    alignItems: "center",
    flexDirection: "row",
    alignSelf: "stretch",
  },
  frameParent6: {
    paddingLeft: Padding.p_10xs,
    paddingTop: Padding.p_mini,
    paddingRight: Padding.p_8xs,
    paddingBottom: Padding.p_mini,
    display: "none",
  },
  frameParent: {
    paddingHorizontal: Padding.p_3xs,
    paddingVertical: 0,
    justifyContent: "center",
    alignSelf: "stretch",
  },
  bodyInner: {
    alignSelf: "stretch",
  },
  body: {
    alignSelf: "stretch",
    flex: 1,
  },
  frameParent8: {
    padding: Padding.p_mini,
    alignSelf: "stretch",
    backgroundColor: Color.m3White,
  },
  newBooking: {
    backgroundColor: Color.colorWhitesmoke_200,
    height: 812,
  },
});

export default NewBooking;
