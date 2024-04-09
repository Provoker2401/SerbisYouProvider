import React, { Component, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Pressable,
  StyleSheet,
  View,
  Text,
  ScrollView,
  TextInput,
} from "react-native";
import { Image } from "expo-image";
import { useNavigation } from "@react-navigation/native";
import { Border, Padding, FontFamily, FontSize, Color } from "../GlobalStyles";
import Icon from "react-native-vector-icons/MaterialIcons";
import SectionedMultiSelect from "react-native-sectioned-multi-select";
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
} from "firebase/firestore";

const ApplicationForm3 = () => {
  const navigation = useNavigation();

  const [selectedItems, setSelectedItems] = useState([]);
  const [subCategoryItems, setSubCategoryItems] = useState([]);

  const items = [
    {
      name: "Plumbing",
      id: 0,
      items: [
        { name: "Installation", id: 10 },
        { name: "Repairs/Replacement", id: 11 },
      ],
    },
    {
      name: "Electrical",
      id: 1,
      items: [
        { name: "Installation", id: 20 },
        { name: "Repairs/Replacement", id: 21 },
      ],
    },
    {
      name: "Cleaning",
      id: 2,
      items: [
        { name: "Standard Cleaning", id: 30 },
        { name: "Deep Cleaning", id: 31 },
        { name: "Electronic Appliance Cleaning", id: 32 },
        { name: "Pest Control", id: 33 },
      ],
    },
    {
      name: "Pet Care",
      id: 3,
      items: [
        { name: "Dog Training", id: 40 },
        { name: "Dog Pet Grooming", id: 41},
        { name: "Cat Pet Grooming", id: 42},
        { name: "Bird Pet Grooming", id: 43},
        { name: "Rabbit Pet Grooming", id: 44},
        { name: "Dog Pet Sitting", id: 45 },
        { name: "Cat Pet Sitting", id: 46 },
        { name: "Bird Pet Sitting", id: 47 },
        { name: "Rabbit Pet Sitting", id: 48 },
      ],
    },
    {
      name: "Gardening",
      id: 4,
      items: [
        { name: "Garden Maintenance", id: 50 },
        { name: "Landscape Design and Planning", id: 51 },
        { name: "Irrigation System Installation/Repairs", id: 52 },
        { name: "Pest and Disease Management", id: 53 },
      ],
    },
    {
      name: "Carpentry",
      id: 5,
      items: [
        { name: "Installation", id: 60 },
        { name: "Repairs/Replacement", id: 61 },
        { name: "Furniture Assembly and Disassembly", id: 62 },
      ],
    },
  ];

  const installationPlumbingItems = [
    {
      name: "Plumbing Installation",
      category: "Plumbing",
      subGroup: "Installation",
      id: 100,
      items: [
        { name: "Toilet System", id: 101 },
        { name: "Tub and Shower", id: 102 },
        { name: "Faucet and Sink", id: 103 },
        { name: "Roof and Gutter", id: 104 },
        { name: "Septic Tank", id: 105 },
        { name: "Water Tank", id: 106 },
        { name: "Pressure Pump", id: 107 },
      ],
    },
  ];

  const repairsPlumbingItems = [
    {
      name: "Repairs/Replacement Plumbing",
      category: "Plumbing",
      subGroup: "Repairs/Replacement",
      id: 200,
      items: [
        { name: "Sewage Systems", id: 201 },
        { name: "Toilet System", id: 202 },
        { name: "Tub and Shower", id: 203 },
        { name: "Faucent and Sink", id: 204 },
        { name: "Roof and Gutter", id: 205 },
        { name: "Septic Tank", id: 206 },
        { name: "Water Tank", id: 207 },
      ],
    },
  ];

  const installationElectricalItems = [
    {
      name: "Electrical Installation",
      category: "Electrical",
      subGroup: "Installation",
      id: 300,
      items: [
        { name: "Light Fixtures", id: 301 },
        { name: "Switch and Outlet", id: 302 },
        { name: "Electrical Panel Upgrades", id: 303 },
        { name: "CCTV", id: 304 },
        { name: "Fire Alarm", id: 305 },
        { name: "Smoke Detector", id: 306 },
      ],
    },
  ];

  const repairsElectricItems = [
    {
      name: "Electrical Repairs/Replacement",
      category: "Electrical",
      subGroup: "Repairs/Replacement",
      id: 400,
      items: [
        { name: "Light Fixtures", id: 401 },
        { name: "Switch and Outlet", id: 402 },
        { name: "Electrical Panel Upgrades", id: 403 },
        { name: "CCTV", id: 404 },
        { name: "Fire Alarm", id: 405 },
        { name: "Smoke Detector", id: 406 },
        { name: "Air Conditioner", id: 407 },
        { name: "Electric Fan", id: 408 },
        { name: "Washing Machine", id: 409 },
        { name: "Microwave Oven", id: 410 },
        { name: "Refrigerator", id: 411 },
        { name: "Gas Stove", id: 412 },
        { name: "Television", id: 413 },
      ],
    },
  ];

  //  for cleaning
  const standardCleaningItems = [
    {
      name: "Standard Cleaning",
      category: "Cleaning",
      subGroup: "Standard Cleaning",
      id: 500,
      items: [
        { name: "Living Room", id: 501 },
        { name: "Garage and Porch", id: 502 },
        { name: "Bathroom", id: 503 },
        { name: "Bedroom", id: 504 },
        { name: "Kitchen", id: 505 },
        { name: "Dining Room", id: 506 },
        { name: "Balcony", id: 507 },
        { name: "Roof and Gutter", id: 508 },
        { name: "Storage Room", id: 509 },
        { name: "Pet Area", id: 510 },
      ],
    },
  ];

  const deepCleaningItems = [
    {
      name: "Deep Cleaning",
      category: "Cleaning",
      subGroup: "Deep Cleaning",
      id: 600,
      items: [
        { name: "Sofa/Mattress", id: 601 },
        { name: "Windows/Curtains", id: 602 },
        { name: "Carpet", id: 603 },
        { name: "Garden Cleaning", id: 604 },
        { name: "Septic Tank Cleaning", id: 605 },
        { name: "Water Tank Cleaning", id: 606 },
      ],
    },
  ];

  const electronicApplianceItems = [
    {
      name: "Electronic Appliance Cleaning",
      category: "Cleaning",
      subGroup: "Electronic Appliance Cleaning",
      id: 700,
      items: [
        { name: "Area Conditioner", id: 701 },
        { name: "Refrigerator", id: 702 },
        { name: "Electric Fan", id: 703 },
        { name: "Television", id: 704 },
        { name: "Kitchen Stove", id: 705 },
        { name: "Washing Machine", id: 706 },
        { name: "Microwave Oven", id: 707 },
      ],
    },
  ];

  const pestControlCleaningItems = [
    {
      name: "Pest Control",
      category: "Cleaning",
      subGroup: "Pest Control",
      id: 800,
      items: [
        { name: "Termites", id: 801 },
        { name: "Mice", id: 802 },
        { name: "Mosquitoes", id: 803 },
        { name: "Cockroaches", id: 804 },
        { name: "Ants", id: 805 },
        { name: "Bed Bugs", id: 806 },
      ],
    },
  ];

  // for pet care

  const dogTrainingItems = [
    {
      name: "Dog Training",
      category: "Pet Care",
      subGroup: "Dog Training",
      id: 900,
      items: [
        { name: "Obedience Training", id: 901 },
        { name: "Socialization Training", id: 902 },
        { name: "Behavior Training", id: 903 },
        { name: "Good Citizen Training", id: 904 },
        { name: "Service Training", id: 905 },
        { name: "Agility Training", id: 906 },
        { name: "Search & Rescue Training", id: 907 },
        { name: "Scent Detection Training", id: 908 },
      ],
    },
  ];

  const dogpetGroomingItems = [
    {
      name: "Dog Pet Grooming",
      category: "Pet Care",
      subGroup: "Dog Pet Grooming",
      id: 1000,
      items: [
        { name: "Bathing and Shampooing", id: 1001 },
        { name: "Brushing and Combing", id: 1002 },
        { name: "Haircuts and Trims", id: 1003 },
        { name: "Ear and Teeth Cleaning", id: 1004 },
        { name: "Nail Trimming", id: 1005 },
        { name: "Anal Gland Expression", id: 1006 },
        { name: "Flea and Tick Treatments", id: 1007 },
        { name: "Skin and Coat Treatments", id: 1008 },
      ],
    },
  ];

  const catpetGroomingItems = [
    {
      name: "Cat Pet Grooming",
      category: "Pet Care",
      subGroup: "Cat Pet Grooming",
      id: 1009,
      items: [
        { name: "Bathing and Shampooing", id: 1010 },
        { name: "Brushing and Combing", id: 1011 },
        { name: "Haircuts and Trims", id: 1012 },
        { name: "Ear and Teeth Cleaning", id: 1013 },
        { name: "Nail Trimming", id: 1014 },
        { name: "Anal Gland Expression", id: 1015 },
        { name: "Flea and Tick Treatments", id: 1016 },
        { name: "Skin and Coat Treatments", id: 1017 },
      ],
    },
  ];

  const birdpetGroomingItems = [
    {
      name: "Bird Pet Grooming",
      category: "Pet Care",
      subGroup: "Bird Pet Grooming",
      id: 1018,
      items: [
        { name: "Bathing", id: 1019 },
        { name: "Beak Trimming", id: 1020 },
        { name: "Beak Conditioning", id: 1021 },
        { name: "Nail Trimming", id: 1022 },
        { name: "Feather Trimming", id: 1023 },
        { name: "Wing Clipping", id: 1024 },
        { name: "Feather Conditioning", id: 1025 },
      ],
    },
  ];

  const rabbitpetGroomingItems = [
    {
      name: "Rabbit Pet Grooming",
      category: "Pet Care",
      subGroup: "Rabbit Pet Grooming",
      id: 1026,
      items: [
        { name: "Bathing", id: 1027 },
        { name: "Brushing and Combing", id: 1028 },
        { name: "Fur Removal", id: 1029 },
        { name: "Ear and Teeth Cleaning", id: 1030 },
        { name: "Nail Trimming", id: 1031 },
        { name: "Scent Gland Clipping", id: 1032 },
        { name: "Eye Cleaning", id: 1033 },
      ],
    },
  ];

  const dogpetSittingItems = [
    {
      name: "Dog Pet Sitting",
      category: "Pet Care",
      subGroup: "Dog Pet Sitting",
      id: 1100,
      items: [
        { name: "Feeding and Watering", id: 1101 },
        { name: "Exercise and Playtime", id: 1102 },
        { name: "Potty Breaks", id: 1103 },
        { name: "Medication Administration", id: 1104 },
        { name: "Cage or Habitat Cleaning", id: 1105 },
        { name: "Specialized Care", id: 1106 },
        { name: "Flea and Tick Treatments", id: 1107 },
        { name: "Skin and Coat Treatments", id: 1108 },
      ],
    },
  ];

  const catpetSittingItems = [
    {
      name: " Cat Pet Sitting",
      category: "Pet Care",
      subGroup: "Cat Pet Sitting",
      id: 1109,
      items: [
        { name: "Feeding and Watering", id: 1110 },
        { name: "Exercise and Playtime", id: 1111 },
        { name: "Potty Breaks", id: 1112 },
        { name: "Medication Administration", id: 1113 },
        { name: "Cage or Habitat Cleaning", id: 1114 },
        { name: "Specialized Care", id: 1115 },
        { name: "Flea and Tick Treatments", id: 1116 },
        { name: "Skin and Coat Treatments", id: 1117 },
      ],
    },
  ];

  const birdpetSittingItems = [
    {
      name: " Bird Pet Sitting",
      category: "Pet Care",
      subGroup: "Bird Pet Sitting",
      id: 1118,
      items: [
        { name: "Feeding and Watering", id: 1119 },
        { name: "Exercise and Playtime", id: 1120 },
        { name: "Medication Administration", id: 1121 },
        { name: "Cage or Habitat Cleaning", id: 1122 },
        { name: "Bird Massage", id: 1123 },
        { name: "Interactive Socialization", id: 1124 },
        { name: "Outdoor Exploration", id: 1125 },
      ],
    },
  ];

  const rabbitpetSittingItems = [
    {
      name: " Rabbit Pet Sitting",
      category: "Pet Care",
      subGroup: "Rabbit Pet Sitting",
      id: 1126,
      items: [
        { name: "Feeding and Watering", id: 1127 },
        { name: "Exercise and Playtime", id: 1128 },
        { name: "Litter Box Maintenance", id: 1129 },
        { name: "Medication Administration", id: 1130 },
        { name: "Cage or Habitat Cleaning", id: 1131 },
        { name: "Specialized Care", id: 1132 },
        { name: "Skin and Fur Treatments", id: 1133 },
      ],
    },
  ];

  // for gardening
  const gardenMaintenanceItems = [
    {
      name: "Garden Maintenance",
      category: "Gardening",
      subGroup: "Garden Maintenance",
      id: 1034,
      items: [
        { name: "Pruning and Trimming", id: 1035 },
        { name: "Mulching", id: 1036 },
        { name: "Fertilizing", id: 1037 },
        { name: "Mowing", id: 1038 },
        { name: "Aerating", id: 1039 },
        { name: "Weed Removal and Control", id: 1040 },
      ],
    },
  ];

  const landscapeDesignItems = [
    {
      name: "Landscape Design and Planning",
      category: "Gardening",
      subGroup: "Landscape Design and Planning",
      id: 1041,
      items: [
        { name: "Residential Design", id: 1042 },
        { name: "Commercial Design", id: 1043 },
        { name: "Garden Theme Design", id: 1044 },
        { name: "Hardscape Design", id: 1045 },
        { name: "Water Feature Design", id: 1046 },
        { name: "Xeriscape Design", id: 1047 },
        { name: "Therapeutic Garden Design", id: 1048 },
      ],
    },
  ];

  const irrigationSystemItems = [
    {
      name: "Irrigation System Installation & Repairs",
      category: "Gardening",
      subGroup: "Irrigation System Installation & Repairs",
      id: 1049,
      items: [
        { name: "Drip Irrigation", id: 1050 },
        { name: "Sprinkler System", id: 1051 },
        { name: "Surface Irrigation", id: 1052 },
        { name: "Rainwater Harvesting", id: 1053 },
        { name: "Smart Irrigation Solutions", id: 1054 },
      ],
    },
  ];

  const pestManagementItems = [
    {
      name: "Pest & Disease Management",
      category: "Gardening",
      subGroup: "Pest & Disease Management",
      id: 1055,
      items: [
        { name: "Biological Pest Control", id: 1056 },
        { name: "Chemical Pest Control", id: 1057 },
        { name: "Organic Pest Control ", id: 1058 },
        { name: "Fungal Disease Control", id: 1059 },
        { name: "Bacterial Disease Control", id: 1060 },
        { name: "Insect Pest Control", id: 1061 },
        { name: "Viral Disease Management", id: 1062 },
      ],
    },
  ];

  // for carpentry
  const carpentryInstallationItems = [
    {
      name: "Carpentry Installation",
      category: "Carpentry",
      subGroup: "Installation",
      id: 1063,
      items: [
        { name: "Roofing", id: 1064 },
        { name: "Wall", id: 1065 },
        { name: "Tile", id: 1066 },
        { name: "Window", id: 1067 },
        { name: "Door and Door Lock", id: 1068 },
        { name: "Gutter", id: 1069 },
        { name: "Gate/Fence", id: 1070 },
        { name: "Doorbell", id: 1071 },
        { name: "Security Cameras", id: 1072 },
      ],
    },
  ];

  const carpentryRepairItems = [
    {
      name: "Carpentry Repairs/Replacement",
      category: "Carpentry",
      subGroup: "Repairs/Replacement",
      id: 1073,
      items: [
        { name: "Roofing", id: 1074 },
        { name: "Wall", id: 1075 },
        { name: "Tile", id: 1076 },
        { name: "Window", id: 1077 },
        { name: "Door and Door Lock", id: 1078 },
        { name: "Gutter", id: 1079 },
        { name: "Gate/Fence", id: 1080 },
        { name: "Doorbell", id: 1081 },
        { name: "Security Cameras", id: 1082 },
      ],
    },
  ];

  const carpentryFurnitureItems = [
    {
      name: "Carpentry Furniture Assembly And Disassembly",
      category: "Carpentry",
      subGroup: "Furniture Assembly And Disassembly",
      id: 1083,
      items: [
        { name: "Desk", id: 1084 },
        { name: "Cabinet", id: 1085 },
        { name: "Wardrobe", id: 1086 },
        { name: "Bed", id: 1087 },
        { name: "Bookshelf", id: 1088 },
        { name: "Chair", id: 1089 },
        { name: "Table", id: 1090 },
      ],
    },
  ];

  // const onSelectedItemsChange = (items) => {
  //   setSelectedItems(items);
  //   updateSubCategoryItems(items);
  // };

  const onSelectedItemsChange = (selectedItems) => {
    setSelectedItems(selectedItems);
    console.log("Selected Items: " , selectedItems);

    // Create an array to store the selected item names
    const selectedNames = selectedItems.map((selectedId) => {
      const selectedItem = findItemById(items, selectedId);
      return selectedItem ? selectedItem.name : "";
    });

    updateSubCategoryItems(selectedItems);

    // Log the selected item names to the console
    //console.log("Selected Items:", selectedNames);
  };

  // Helper function to find an item by ID
  const findItemById = (items, id) => {
    for (const item of items) {
      if (item.id === id) {
        return item;
      }
      if (item.items) {
        const foundItem = findItemById(item.items, id);
        if (foundItem) {
          return foundItem;
        }
      }
    }
    return null;
  };

  // Define the data to be updated
  const updatedTailoredServices = {
    Carpentry: {
      Installation: ["Toilet System", "Tub and Shower", "Faucet and Sink"],
      Repairs: ["Sewage Systems", "Toilet Systems", "Tub and Shower"]
    },
    Cleaning: {
      "Deep Cleaning": ["Garden Cleaning", "Septic Tank Cleaning", "Upholstery Cleaning"],
      "Electronic Appliance Cleaning": ["Air Conditioner", "Refrigerator", "Electric Fan"],
      "Pest Control": ["Termites", "Mice", "Mosquitoes"],
      "Standard Cleaning": ["Living Room", "Garage and Porch", "Bathroom"]
    },
    Electrical: {
      Installation: ["Roofing", "Wall", "Tile"],
      Repairs: ["Light Fixtures", "Switch and Outlet", "Electrical Panel Upgrades"]
    }
  };

  const handleSubmission = async () => {
    // Create an object to hold main category names and their associated subcategories
    const mainCategoryData = {};

    console.log("Selected Items: " , selectedItems);
    selectedItems.forEach((selectedId) => {
      for (const mainCategory of items) {
        const subCategory = mainCategory.items.find(
          (item) => item.id === selectedId
        );
        console.log("Subcategory: " + subCategory);
        if (subCategory) {
          if (!mainCategoryData[mainCategory.name]) {
            mainCategoryData[mainCategory.name] = [];
          }
          mainCategoryData[mainCategory.name].push(subCategory.name);
        }
      }
    });
    // console.log("mainCategoryData: " + mainCategoryData);


    const CategoriesName = [];
    const ServicesName = [];

    const updatedData = {};
    const mainCategoryData2 = {};
    // console.log("updatedTailoredServices: " , updatedTailoredServices);

    selectedItems.forEach((selectedId) => {
      for (const mainCategory of subCategoryItems) {
        console.log("Category 2:", mainCategory);
        console.log("SubGroup:", mainCategory.subGroup);
        const subCategory = mainCategory.items.find(
          (item) => item.id === selectedId
        );
        if (subCategory) {
          if (!updatedData[mainCategory.category]) {
            updatedData[mainCategory.category] = {}; // Initialize as a map
          }
          if (!updatedData[mainCategory.category][mainCategory.subGroup]) {
            updatedData[mainCategory.category][mainCategory.subGroup] = []; // Initialize as an array
          }
          updatedData[mainCategory.category][mainCategory.subGroup].push(subCategory.name);


          if (!mainCategoryData2[mainCategory.name]) {
            // console.log("Category 2:", mainCategory);
            // console.log("Category Name 2:", mainCategory.name);
            mainCategoryData2[mainCategory.name] = [];
          }
          // console.log("Subcategory Name 2:", subCategory);
          // console.log("Main Category Data 2:", mainCategoryData2);
          // console.log("Sub Category Data 2:", mainCategoryData2[mainCategory]);
          mainCategoryData2[mainCategory.name].push(subCategory.name);


          // if (!mainCategoryData2[mainCategory.category]) {
          //   console.log("Category 2:", mainCategory);
          //   console.log("Category Name 2:", mainCategory.subGroup);
          //   // mainCategoryData2[mainCategory.category] = {};
          //   mainCategoryData2[mainCategory.category] = {};
          //   mainCategoryData2[mainCategory.category][mainCategory.subGroup] = [];
          // }
          // console.log("Subcategory Name 2:", subCategory);
          // console.log("Main Category Data 2:", mainCategoryData2);
          // console.log("Sub Category Data 2:", mainCategoryData2[mainCategory]);
          // mainCategoryData2[mainCategory.category][mainCategory.subGroup].push(subCategory.name);
        }
        // console.log("OG mainCategory:", mainCategory);
        // console.log("OG Subcategory:", subCategory);
        // if(mainCategory.name !== undefined){
        //   console.log("mainCategory Name:", mainCategory.name);
        // }
        // if(subCategory.name !== undefined){
        //   console.log("Subcategory Name:", subCategory.name);
        // }
        
        // console.log("Category Data 2:", mainCategoryData2);
        // console.log("Main Category Data 2:", mainCategoryData2[mainCategory.name]);
      }
    });

    console.log("Main Data 2:", mainCategoryData2);
    console.log("Updated Data:", updatedData);

    // Merge mainCategoryData2 into mainCategoryData
    // for (const mainCategoryName in mainCategoryData2) {
    //   console.log("Category Data 2:", mainCategoryData2[mainCategoryName]);
    //   for (const category in mainCategoryData) {
    //     // console.log("mainCategoryData: " + mainCategoryData[category]);

    //     // console.log("Category Data:", category);
    //     for (const subCategory in mainCategoryData[category]) {
    //       if(mainCategoryData2[mainCategoryName] == mainCategoryData[category][subCategory]){
    //         for (const services in mainCategoryData2[mainCategoryName]) {
    //           mainCategoryData[category][subCategory] = mainCategoryData2[mainCategoryName][services]
    //         }
    //       }
    //     }
    //   }
      // if (mainCategoryData[mainCategoryName]) {
        
      //   mainCategoryData[mainCategoryName].push(...mainCategoryData2[mainCategoryName]);
      // } else {
      //   console.log("OG Data:", mainCategoryData);
      //   console.log("New Data:", mainCategoryName);
      //   console.log("Old Data:", mainCategoryData[mainCategoryName]);
      //   for (const services in mainCategoryData[mainCategoryName]) {
      //     mainCategoryData[mainCategoryName][services] = mainCategoryData2[mainCategoryName];
      //   }
        
      // }
    // }
    console.log("Main Category Data:", mainCategoryData);

    // Log the main category names and their associated subcategories to the console
    for (const mainCategoryName in mainCategoryData) {
      console.log(
        mainCategoryName + ": " + mainCategoryData[mainCategoryName].join(", ")
      );
      // console.log("Categories" + ":" + mainCategoryName);
      // console.log("Services" + ":" + mainCategoryData[mainCategoryName]);
      const categoryName = mainCategoryName;
      const servicesName = mainCategoryData[mainCategoryName];

      // if (mainCategoryData2[mainCategoryName]) {
      //   console.log("Old Data " , mainCategoryData[mainCategoryName]);
      //   mainCategoryData[mainCategoryName].push(...mainCategoryData2[mainCategoryName.name]);
      // }

      // console.log("Original Updated " ,mainCategoryName);
      
      // console.log("New Data " , mainCategoryData[mainCategoryName]);

      // Second Option:
      // updatedData[mainCategoryName] = {};
      
      // for (const subCategoryName of mainCategoryData[mainCategoryName]) {
      //   updatedData[mainCategoryName][subCategoryName] = [];
      // }


      CategoriesName.push(categoryName);
      ServicesName.push(...servicesName);
    }

    console.log("Updated Data: " + updatedData);
    // console.log("CategoriesName: " + CategoriesName);
    // console.log("ServicesName: " + ServicesName);

    // Log the main category names and their associated subcategories to the console
    const SubCategories = [];

    for (const mainCategoryName in mainCategoryData2) {
      const subCategoryValues = mainCategoryData2[mainCategoryName];
      SubCategories.push(...subCategoryValues);
    }

    console.log("SubCategories:", SubCategories);

    // try {
    //   const db = getFirestore();
    //   const auth = getAuth(); // Get the Firebase Authentication object

    //   const user = auth.currentUser; // Get the currently authenticated user
    //   if (!user) {
    //     console.error("User is not authenticated.");
    //     return;
    //   }

    //   const uid = user.uid; // Get the UID of the authenticated user

    //   // Reference to the Firestore collection "providerProfiles"
    //   const providerProfilesCollection = collection(db, "providerProfiles");

    //   // Reference to the user's document within the collection
    //   const userDocument = doc(providerProfilesCollection, uid);

    //   // Reference to the "appForm3" collection within the user's document
    //   const appForm3Collection = collection(userDocument, "appForm3");

    //   // Reference to the Firestore collection where you want to store subcategories
    //   //const subcategoriesCollection = collection(db, 'providerProfiles');

    //   // Loop through the subcategoriesData and save them as documents in Firestore
    //   for (const mainCategoryName in mainCategoryData2) {
    //     const data = {
    //       //mainCategory: mainCategoryName,
    //       subcategories: mainCategoryData2[mainCategoryName],
    //     };
    //     await addDoc(appForm3Collection, data);
    //   }

    //   console.log("Subcategories data saved to Firestore successfully");
    // } catch (error) {
    //   console.error("Error saving subcategories data to Firestore: ", error);
    // }

    console.log("Category: " + CategoriesName);
    console.log("Services: " + ServicesName);
    console.log("Sub Category: " + SubCategories);

    try {
      const db = getFirestore();
      const auth = getAuth(); // Get the Firebase Authentication object

      const user = auth.currentUser; // Get the currently authenticated user
      const userProfilesCollection = collection(db, "providerProfiles");
      const userDocRef = doc(userProfilesCollection, user.uid);
      console.log("ID: " , user.uid)

      // Fetch data from the "appForm1" subcollection
      const appForm3Collection = collection(userDocRef, "appForm3");
      const appForm3Query = query(appForm3Collection);
      const appForm3Docs = await getDocs(appForm3Query);

      if (appForm3Docs.size === 1 || appForm3Docs.size === 2) {
        const appForm3Doc = appForm3Docs.docs[0]; // Get the first document
        const appForm3Doc1 = appForm3Docs.docs[1]; // Get the first document
        const appForm3DocRef = doc(appForm3Collection, appForm3Doc.id); // Construct the reference using the document's ID
        const appForm3DocRef1 = doc(appForm3Collection, appForm3Doc1.id); // Construct the reference using the document's ID

        const data = {
          category: CategoriesName,
          services: ServicesName,
          SubCategories: SubCategories,
        };

        await setDoc(appForm3DocRef, data);
        // await setDoc(appForm3DocRef1, updatedTailoredServices);
        await setDoc(appForm3DocRef1, updatedData);

        console.log("Data updated in Firestore.");
      } else {
        console.log("No or multiple documents found in appForm1.");
      }
      navigation.navigate("BottomTabsRoot", { screen: "Homepage" });
    } catch (error) {
      console.error("Error updating Firestore data:", error);
    }
    // try {
    //   const db = getFirestore();
    //   const auth = getAuth(); // Get the Firebase Authentication object

    //   // Get the currently authenticated user
    //   const user = auth.currentUser;
    //   if (!user) {
    //     console.error("No authenticated user found.");
    //     return;
    //   }

    //   const providerUID = user.uid; // Get the currently authenticated user
    //   // const userProfilesCollection = collection(db, "providerProfiles");
    //   // const userDocRef = doc(userProfilesCollection, user.uid);
    //   const bookingRef = collection(db, "providerProfiles", providerUID, "appForm3");
    //   // console.log("ID: " , user.uid)

    //   // Fetch data from the "appForm1" subcollection
    //   // const appForm3Collection = collection(userDocRef, "appForm3");
    //   // const appForm3Query = query(appForm3Collection);
    //   // const appForm3Docs = await getDocs(appForm3Query);
    //   const data = {
    //     category: CategoriesName,
    //     services: ServicesName,
    //     SubCategories: SubCategories,
    //   };

    //   const docRefData = await addDoc(bookingRef, data);
    //   console.log("Data document written with ID: ", docRefData.id);
  
    //   // Second Document - Store "updatedData"
    //   const docRefUpdatedData = await addDoc(bookingRef, updatedData);
    //   console.log("UpdatedData document written with ID: ", docRefUpdatedData.id);

    //   // if (bookingRef) {
    //     // const appForm3Doc = appForm3Docs.docs[0]; // Get the first document
    //     // const appForm3Doc1 = appForm3Docs.docs[0]; // Get the first document
    //     // const appForm3DocRef = doc(appForm3Collection, appForm3Doc.id); // Construct the reference using the document's ID
    //     // const appForm3DocRef1 = doc(appForm3Collection, appForm3Doc.id); // Construct the reference using the document's ID

    //     // const data = {
    //     //   category: CategoriesName,
    //     //   services: ServicesName,
    //     //   SubCategories: SubCategories,
    //     // };

    //     // await addDoc(bookingRef, data);
    //     // await setDoc(appForm3DocRef1, updatedTailoredServices);
    //   //   await addDoc(bookingRef, updatedData);

    //   //   console.log("Data updated in Firestore.");
    //   // } else {
    //   //   console.log("No or multiple documents found in appForm1.");
    //   // }
    // } catch (error) {
    //   console.error("Error updating Firestore data:", error);
    // }
  };

  // const handleSubmission = () => {
  //   // Create an object to hold main category names and their associated subcategories
  //   const mainCategoryData = {};

  //   selectedItems.forEach((selectedId) => {
  //     for (const mainCategory of subCategoryItems) {
  //       const subCategory = mainCategory.items.find((item) => item.id === selectedId);
  //       if (subCategory) {
  //         if (!mainCategoryData[mainCategory.name]) {
  //           mainCategoryData[mainCategory.name] = [];
  //         }
  //         mainCategoryData[mainCategory.name].push(subCategory.name);
  //       }
  //     }
  //   });

  //   // Log the main category names and their associated subcategories to the console
  //   for (const mainCategoryName in mainCategoryData) {
  //     console.log(mainCategoryName + ": " + mainCategoryData[mainCategoryName].join(", "));
  //   }
  // };

  const updateSubCategoryItems = (selectedItems) => {
    let subCategories = [];

    selectedItems.forEach((item) => {
      switch (item) {
        case 10:
          subCategories = subCategories.concat(installationPlumbingItems);
          break;
        case 11:
          subCategories = subCategories.concat(repairsPlumbingItems);
          break;
        case 20:
          subCategories = subCategories.concat(installationElectricalItems);
          break;
        case 21:
          subCategories = subCategories.concat(repairsElectricItems);
          break;
        case 30:
          subCategories = subCategories.concat(standardCleaningItems);
          break;
        case 31:
          subCategories = subCategories.concat(deepCleaningItems);
          break;
        case 32:
          subCategories = subCategories.concat(electronicApplianceItems);
          break;
        case 33:
          subCategories = subCategories.concat(pestControlCleaningItems);
          break;
        case 40:
          subCategories = subCategories.concat(dogTrainingItems);
          break;
        case 41:
          subCategories = subCategories.concat(dogpetGroomingItems);
          break;
        case 42:
          subCategories = subCategories.concat(catpetGroomingItems);
          break;
        case 43:
          subCategories = subCategories.concat(birdpetGroomingItems);
          break;
        case 44:
          subCategories = subCategories.concat(rabbitpetGroomingItems);
          break;
        case 45:
          subCategories = subCategories.concat(dogpetSittingItems);
          break;
        case 46:
          subCategories = subCategories.concat(catpetSittingItems);
          break;
        case 47:
          subCategories = subCategories.concat(birdpetSittingItems);
          break;
        case 48:
          subCategories = subCategories.concat(rabbitpetSittingItems);
          break;
        case 50:
          subCategories = subCategories.concat(gardenMaintenanceItems);
          break;
        case 51:
          subCategories = subCategories.concat(landscapeDesignItems);
          break;
        case 52:
          subCategories = subCategories.concat(irrigationSystemItems);
          break;
        case 53:
          subCategories = subCategories.concat(pestManagementItems);
          break;
        case 60:
          subCategories = subCategories.concat(carpentryInstallationItems);
          break;
        case 61:
          subCategories = subCategories.concat(carpentryRepairItems);
          break;
        case 62:
          subCategories = subCategories.concat(carpentryFurnitureItems);
          break;
      }
      console.log("Sub Categories: " ,subCategories);
    });

    setSubCategoryItems(subCategories);
  };

  return (
    <View style={styles.applicationForm3}>
      <ScrollView
        style={styles.frame}
        showsVerticalScrollIndicator={true}
        showsHorizontalScrollIndicator={true}
        contentContainerStyle={styles.frameScrollViewContent}
      >
        <View style={[styles.componentsserviceList, styles.listboxMainFlexBox]}>
          <View
            style={[
              styles.personalDetailsFrameParent,
              styles.detailsParentSpaceBlock,
            ]}
          >
            <Pressable style={styles.personalDetailsFrame}>
              <Text style={[styles.personalDetails, styles.idProofTypo]}>
                Personal Details
              </Text>
              <View
                style={[
                  styles.componentsbutton,
                  styles.componentsbuttonSpaceBlock,
                ]}
              >
                <Text style={styles.viewTypo} />
              </View>
            </Pressable>
            <Pressable style={styles.idProofFrame}>
              <Text style={[styles.idProof, styles.idProofTypo]}>ID Proof</Text>
              <View
                style={[
                  styles.componentsbutton,
                  styles.componentsbuttonSpaceBlock,
                ]}
              >
                <Text style={styles.viewTypo} />
              </View>
            </Pressable>
            <Pressable style={styles.idProofFrame}>
              <Text style={[styles.idProof, styles.idProofTypo]}>
                Service Details
              </Text>
              <View
                style={[
                  styles.componentsbutton,
                  styles.componentsbuttonSpaceBlock,
                ]}
              >
                <Text style={styles.viewTypo} />
              </View>
            </Pressable>
          </View>
          <View style={styles.enterParentFlexBox}>
            <Text style={[styles.enterYouService, styles.idProofTypo]}>
              Enter you Service
            </Text>
            <View style={styles.frameFlexBox}>
              <View style={styles.listboxComponentWrapper}>
                <View style={styles.listboxComponentWrapper}>
                  <View style={styles.listboxTitle}>
                    <Text style={[styles.occupation, styles.cleaningTypo]}>
                      Services
                    </Text>
                  </View>
                  <SectionedMultiSelect
                    items={items}
                    IconRenderer={Icon}
                    uniqueKey="id"
                    subKey="items"
                    selectText="Select items"
                    showDropDowns={true}
                    readOnlyHeadings={true}
                    onSelectedItemsChange={onSelectedItemsChange}
                    selectedItems={selectedItems}
                  />
                  <View style={styles.listboxTitle1}>
                    <Text style={[styles.occupation, styles.cleaningTypo]}>
                      Sub-Category
                    </Text>
                  </View>
                  <SectionedMultiSelect
                    items={subCategoryItems}
                    uniqueKey="id"
                    subKey="items"
                    IconRenderer={Icon}
                    selectText="Select Options"
                    showDropDowns={true}
                    readOnlyHeadings={true}
                    onSelectedItemsChange={setSelectedItems}
                    selectedItems={selectedItems}
                  />
                </View>
              </View>
              {/* <View style={styles.enterParentFlexBox}>
                <View style={styles.frameContainer}>
                  <View style={styles.placeholderText}>
                    <View style={styles.unstarted}>
                      <View
                        style={[styles.rectangle, styles.rectangleLayout]}
                      />
                    </View>
                    <Text style={styles.standardCleaning}>
                      Standard Cleaning
                    </Text>
                  </View>
                  <View style={styles.placeholderText}>
                    <View style={styles.completed}>
                      <View
                        style={[styles.rectangle1, styles.rectangleLayout]}
                      />
                      <Image
                        style={styles.completedIcon}
                        contentFit="cover"
                        source={require("../assets/completed.png")}
                      />
                    </View>
                    <Text style={styles.standardCleaning}>Deep Cleaning</Text>
                  </View>
                </View>
                <View style={[styles.frameView, styles.frameFlexBox]}>
                  <View style={styles.placeholderText}>
                    <View style={styles.completed}>
                      <View
                        style={[styles.rectangle1, styles.rectangleLayout]}
                      />
                      <Image
                        style={styles.completedIcon}
                        contentFit="cover"
                        source={require("../assets/completed1.png")}
                      />
                    </View>
                    <Text style={styles.standardCleaning}>Pest Control</Text>
                  </View>
                  <View style={styles.placeholderText}>
                    <View style={styles.unstarted}>
                      <View
                        style={[styles.rectangle, styles.rectangleLayout]}
                      />
                    </View>
                    <Text style={styles.standardCleaning}>
                      Electronic Appliance Cleaning
                    </Text>
                  </View>
                </View>
              </View> */}
            </View>
          </View>
          <View
            style={[styles.enterYouDetailsParent, styles.enterParentFlexBox]}
          >
            <Text style={[styles.enterYouService, styles.idProofTypo]}>
              Enter you Details
            </Text>
            <View style={[styles.frameParent1, styles.frameParentSpaceBlock]}>
              <View style={styles.frameParent2}>
                <View style={styles.listboxTitle}>
                  <Text style={styles.nameTypo}>Name</Text>
                </View>
                <View style={[styles.frameWrapper, styles.listboxMainFlexBox]}>
                  <TextInput
                    style={styles.frameTypo}
                    placeholder="Juan DelaCruz"
                    placeholderTextColor="#1a1b2d"
                  />
                </View>
              </View>
              <View style={styles.frameParentSpaceBlock}>
                <View style={styles.listboxTitle}>
                  <Text style={[styles.mobile, styles.nameTypo]}>Mobile</Text>
                </View>
                <View style={[styles.frameWrapper, styles.listboxMainFlexBox]}>
                  <TextInput
                    style={[styles.frameItem, styles.frameTypo]}
                    placeholder="+63 95614759"
                    placeholderTextColor="#1a1b2d"
                  />
                </View>
              </View>
              <View style={styles.frameParentSpaceBlock}>
                <View style={styles.listboxTitle}>
                  <Text style={styles.nameTypo}>Email</Text>
                </View>
                <View style={[styles.frameWrapper, styles.listboxMainFlexBox]}>
                  <TextInput
                    style={styles.frameTypo}
                    placeholder="juanDelaCruz@gmail.com"
                    placeholderTextColor="#1a1b2d"
                  />
                </View>
              </View>
              <View style={styles.frameParentSpaceBlock}>
                <View style={styles.listboxTitle}>
                  <Text style={styles.nameTypo}>Zip Code</Text>
                </View>
                <View style={[styles.frameWrapper, styles.listboxMainFlexBox]}>
                  <TextInput
                    style={styles.frameTypo}
                    placeholder="6012"
                    placeholderTextColor="#1a1b2d"
                  />
                </View>
              </View>
            </View>
          </View>
          <View
            style={[styles.componentsbuttonWrapper, styles.enterParentFlexBox]}
          >
            <Pressable
              style={[
                styles.componentsbutton3,
                styles.componentsbuttonSpaceBlock,
              ]}
              // onPress={() =>
              //   navigation.navigate("BottomTabsRoot", { screen: "Homepage" })
              // }
              onPress={handleSubmission}
            >
              <Text style={[styles.viewAllServices3, styles.viewTypo]}>
                Submit
              </Text>
            </Pressable>
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
  frameScrollViewContent: {
    flexDirection: "column",
    paddingHorizontal: 0,
    paddingVertical: 20,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  listboxMainFlexBox: {
    alignSelf: "stretch",
    alignItems: "center",
  },
  detailsParentSpaceBlock: {
    paddingVertical: Padding.p_3xs,
    paddingHorizontal: 0,
  },
  idProofTypo: {
    textAlign: "left",
    fontFamily: FontFamily.levelSemibold14,
    fontWeight: "600",
  },
  componentsbuttonSpaceBlock: {
    paddingVertical: Padding.p_xs,
    paddingHorizontal: Padding.p_3xl,
    borderRadius: Border.br_5xs,
    flexDirection: "row",
  },
  cleaningTypo: {
    fontSize: FontSize.bodyLgBodyLgRegular_size,
    textAlign: "left",
  },
  rectangleLayout: {
    height: 30,
    width: 30,
    borderStyle: "solid",
    borderRadius: Border.br_7xs,
  },
  frameFlexBox: {
    marginTop: 26,
    justifyContent: "center",
    alignSelf: "stretch",
  },
  enterParentFlexBox: {
    marginTop: 20,
    justifyContent: "center",
    alignSelf: "stretch",
  },
  frameParentSpaceBlock: {
    marginTop: 25,
    alignSelf: "stretch",
  },
  nameTypo: {
    color: Color.colorGray_100,
    fontSize: FontSize.paragraphMedium15_size,
    textAlign: "left",
    fontFamily: FontFamily.levelSemibold14,
    fontWeight: "600",
    letterSpacing: -0.3,
  },
  frameTypo: {
    fontSize: FontSize.levelSemibold14_size,
    fontFamily: FontFamily.levelSemibold14,
    fontWeight: "600",
    flexDirection: "row",
    flex: 1,
  },
  viewTypo: {
    color: Color.neutral01,
    lineHeight: 24,
    fontSize: FontSize.paragraphMedium15_size,
    letterSpacing: -0.1,
    textAlign: "center",
    fontFamily: FontFamily.title2Bold32,
    fontWeight: "700",
  },
  personalDetails: {
    color: Color.neutral07,
    textAlign: "left",
    fontFamily: FontFamily.levelSemibold14,
    fontWeight: "600",
    letterSpacing: -0.3,
    fontSize: FontSize.typographyTaglineSmallRegular_size,
  },
  componentsbutton: {
    backgroundColor: Color.colorDarkslateblue_200,
    width: 91,
    height: 14,
    marginTop: 8,
  },
  personalDetailsFrame: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  idProof: {
    color: Color.colorDarkslateblue_200,
    textAlign: "left",
    fontFamily: FontFamily.levelSemibold14,
    fontWeight: "600",
    letterSpacing: -0.3,
    fontSize: FontSize.typographyTaglineSmallRegular_size,
  },
  idProofFrame: {
    marginLeft: 10,
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  personalDetailsFrameParent: {
    overflow: "hidden",
    justifyContent: "center",
    flexDirection: "row",
    alignSelf: "stretch",
    alignItems: "center",
  },
  enterYouService: {
    letterSpacing: -0.4,
    color: Color.neutral07,
    textAlign: "left",
    fontFamily: FontFamily.levelSemibold14,
    fontWeight: "600",
    fontSize: FontSize.title3Bold20_size,
  },
  occupation: {
    fontWeight: "500",
    fontFamily: FontFamily.montserratMedium,
    color: Color.colorDarkslategray_500,
  },
  listboxTitle: {
    flexDirection: "row",
    alignSelf: "stretch",
  },
  cleaning: {
    fontFamily: FontFamily.montserratRegular,
    color: "#eef0f2",
    flex: 1,
  },
  placeholderText: {
    justifyContent: "center",
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  chevronIcon: {
    width: 13,
    height: 6,
    opacity: 0.8,
    marginLeft: 10,
  },
  placeholderTextParent: {
    paddingHorizontal: Padding.p_mini,
    paddingVertical: 0,
    justifyContent: "center",
    flexDirection: "row",
    alignSelf: "stretch",
    alignItems: "center",
  },
  listboxMainInner: {
    height: 45,
    justifyContent: "center",
    alignSelf: "stretch",
    alignItems: "center",
  },
  listboxMain: {
    backgroundColor: Color.colorDarkslateblue_200,
    shadowColor: "rgba(0, 0, 0, 0.25)",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowRadius: 4,
    elevation: 4,
    shadowOpacity: 1,
    marginTop: 8,
    justifyContent: "center",
  },
  listboxTitle1: {
    paddingTop: Padding.p_xl,
    marginTop: 8,
    flexDirection: "row",
    alignSelf: "stretch",
  },
  listboxComponentWrapper: {
    justifyContent: "center",
    alignSelf: "stretch",
  },
  rectangle: {
    borderColor: Color.lightLabelPrimary,
    borderWidth: 2,
  },
  unstarted: {
    justifyContent: "center",
    flexDirection: "row",
    alignItems: "center",
  },
  standardCleaning: {
    lineHeight: 17,
    color: Color.colorGray_700,
    marginLeft: 8,
    letterSpacing: -0.1,
    textAlign: "left",
    fontSize: FontSize.typographyTaglineSmallRegular_size,
    fontFamily: FontFamily.title2Bold32,
    fontWeight: "700",
    flex: 1,
  },
  rectangle1: {
    borderColor: Color.colorSteelblue,
    borderWidth: 3,
    zIndex: 0,
  },
  completedIcon: {
    position: "absolute",
    height: "43.33%",
    width: "58.67%",
    top: "28.33%",
    right: "19.67%",
    bottom: "28.33%",
    left: "21.67%",
    maxWidth: "100%",
    maxHeight: "100%",
    zIndex: 1,
    overflow: "hidden",
  },
  completed: {
    justifyContent: "center",
    flexDirection: "row",
    alignItems: "center",
  },
  frameContainer: {
    justifyContent: "center",
    flexDirection: "row",
    alignSelf: "stretch",
    alignItems: "center",
  },
  frameView: {
    flexDirection: "row",
    alignItems: "center",
  },
  frameWrapper: {
    backgroundColor: Color.colorInputDefault,
    padding: Padding.p_xs,
    marginTop: 8,
    flexDirection: "row",
  },
  frameParent2: {
    alignSelf: "stretch",
  },
  mobile: {
    flex: 1,
  },
  frameItem: {
    justifyContent: "center",
    alignItems: "center",
  },
  frameParent1: {
    justifyContent: "center",
  },
  enterYouDetailsParent: {
    display: "none",
    paddingVertical: Padding.p_3xs,
    paddingHorizontal: 0,
  },
  viewAllServices3: {
    flex: 1,
  },
  componentsbutton3: {
    backgroundColor: Color.colorDarkslategray_600,
    alignSelf: "stretch",
  },
  componentsbuttonWrapper: {
    alignItems: "center",
  },
  componentsserviceList: {
    padding: Padding.p_base,
    justifyContent: "center",
    backgroundColor: Color.m3White,
  },
  frame: {
    alignSelf: "stretch",
    flex: 1,
  },
  applicationForm3: {
    height: 812,
    alignItems: "center",
    width: "100%",
    flex: 1,
    backgroundColor: Color.m3White,
  },
});

export default ApplicationForm3;

