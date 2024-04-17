import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import Authentication from "../screens/Authentication";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import Toast from "react-native-toast-message";
import axios from "axios";

jest.mock("@react-navigation/native", () => ({
  useNavigation: jest.fn(),
}));

// Mock for firebase/auth
jest.mock("firebase/auth", () => ({
  getAuth: jest.fn(),
  createUserWithEmailAndPassword: jest.fn(),
}));
jest.mock("@react-navigation/stack", () => ({
  createStackNavigator: jest.fn(),
}));

// Mock for firebase/firestore
jest.mock("firebase/firestore", () => ({
  getFirestore: jest.fn(),
  collection: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  getDocs: jest.fn(),
  getDoc: jest.fn(),
  doc: jest.fn(),
  updateDoc: jest.fn(),
  getDoc: jest.fn(),
  setDoc: jest.fn(),
  addDoc: jest.fn(),
  serverTimestamp: jest.fn(),
}));

jest.mock("firebase/auth", () => ({
  getAuth: jest.fn(),
}));

jest.mock("@react-native-firebase/messaging", () => ({
  messaging: jest.fn(),
}));

jest.mock("axios");

const routeParams = {
  params: {
    name: "John Doe",
    email: "john@example.com",
    phone: "1234567890",
    password: "password123",
  },
};

describe("Authentication component", () => {
  test("renders correctly", () => {
    // Render the component

    // Render the component with route params
    render(<Authentication route={routeParams} />);
  });

  test("renders Authentication correctly", () => {
    // Render the component
    const { getByText } = render(<Authentication route={routeParams} />);

    // Check if the text "Cardholder’s Name" is rendered
    const test = getByText("Authentication");

    // Assert that the text is present in the component
    expect(test).toBeTruthy();
  });

  test("renders wehavesent correctly", () => {
    // Render the component
    const { getByText } = render(<Authentication route={routeParams} />);

    // Check if the text "Cardholder’s Name" is rendered
    const test = getByText(
      "We’ve sent a code to the phone number provided. Enter the code in that message to continue."
    );

    // Assert that the text is present in the component
    expect(test).toBeTruthy();
  });

  test("renders verifycode correctly", () => {
    // Render the component
    const { getByText } = render(<Authentication route={routeParams} />);

    // Check if the text "Cardholder’s Name" is rendered
    const test = getByText("Verify Code");

    // Assert that the text is present in the component
    expect(test).toBeTruthy();
  });

});
