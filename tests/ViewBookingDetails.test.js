import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import ViewBookingDetails from "../screens/ViewBookingDetails";
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
jest.mock("@react-native-firebase/messaging", () => ({
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
    newDocumentID: "1234567890",
    matchedBookingID: "1",
    providerLocation: "10",
    itemID: "1",
  },
};
describe("ViewBookingDetails", () => {
  test("renders without errors", () => {
    render(<ViewBookingDetails route={routeParams} />);
  });

  test("renders text correctly", () => {
    // Render the component
    const { getByText } = render(<ViewBookingDetails route={routeParams} />);

    const text = getByText("Booking details");
    const text1 = getByText("Date");
    const text2 = getByText("Time");
    const text3 = getByText("Address");
    const text4 = getByText("Distance Radius");
    const text5 = getByText("Property Type");
    const text6 = getByText("Materials");
    const text7 = getByText("Category");

    // Assert that the text is present in the component
    expect(text).toBeTruthy();
    expect(text1).toBeTruthy();
    expect(text2).toBeTruthy();
    expect(text3).toBeTruthy();
    expect(text4).toBeTruthy();
    expect(text5).toBeTruthy();
    expect(text6).toBeTruthy();
    expect(text7).toBeTruthy();
  });
  test("Pressing the button navigates to home", () => {
    // Mock navigation
    const mockNavigate = jest.fn();
    useNavigation.mockReturnValue({ navigate: mockNavigate });

    // Render HomePage component
    const { getByTestId } = render(<ViewBookingDetails route={routeParams} />);

    // Find the Pressable element by its text content
    const changePressable = getByTestId("button");

    // Simulate a press event on the Pressable element
    fireEvent.press(changePressable);

    // Assert that navigation function is called with expected screen name
    expect(mockNavigate).toHaveBeenCalledWith('BottomTabsRoot', { screen: 'Homepage' });
  });

});
