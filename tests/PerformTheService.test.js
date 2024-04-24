import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import PerformTheService from "../screens/PerformTheService";
import { useNavigation } from "@react-navigation/native";

jest.mock("@react-navigation/native", () => ({
  useNavigation: jest.fn(),
}));

// Mock for firebase/auth
jest.mock("firebase/auth", () => ({
  getAuth: jest.fn(),
  onAuthStateChanged: jest.fn(),
  updateEmail: jest.fn(),
}));

// Mock for firebase/firestore
jest.mock("firebase/firestore", () => ({
  getFirestore: jest.fn(),
  collection: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  getDocs: jest.fn(),
  doc: jest.fn(),
  updateDoc: jest.fn(),
  getDoc: jest.fn(),
  setDoc: jest.fn(),
  addDoc: jest.fn(),
  arrayUnion: jest.fn(),
}));
jest.mock('@react-native-firebase/messaging', () => ({
    __esModule: true,
    default: {
      hasPermission: jest.fn(),
      requestPermission: jest.fn(),
      getToken: jest.fn(),
      onMessage: jest.fn(),
      setBackgroundMessageHandler: jest.fn(),
      onNotificationOpenedApp: jest.fn(),
      getInitialNotification: jest.fn(),
      onNotificationOpened: jest.fn(),
    },
  }));
const routeParams = {
  params: {
    itemID: "1234567890",
    matchedBookingID: "1",
    customerUID: "10",
  },
};
describe("Perform the service", () => {
  test("renders without errors", () => {
    render(<PerformTheService route={routeParams} />);
  });

  test("renders text correctly", () => {
    // Render the component
    const { getByText } = render(<PerformTheService route={routeParams} />);

    const text = getByText("Service details");

    // Assert that the text is present in the component
    expect(text).toBeTruthy();
  });
  test("renders text correctly", () => {
    // Render the component
    const { getByText } = render(<PerformTheService route={routeParams} />);

    const text = getByText("Property Type");

    // Assert that the text is present in the component
    expect(text).toBeTruthy();
  });
  test("renders text correctly", () => {
    // Render the component
    const { getByText } = render(<PerformTheService route={routeParams} />);

    const text = getByText("Category");

    // Assert that the text is present in the component
    expect(text).toBeTruthy();
  });
  test("renders text correctly", () => {
    // Render the component
    const { getByText } = render(<PerformTheService route={routeParams} />);

    const text = getByText("Service Requests");

    // Assert that the text is present in the component
    expect(text).toBeTruthy();
  });
  test("renders text correctly", () => {
    // Render the component
    const { getByText } = render(<PerformTheService route={routeParams} />);

    const text = getByText("Payment");

    // Assert that the text is present in the component
    expect(text).toBeTruthy();
  });
});
