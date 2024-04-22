// Notifications.test.js

import React from "react";
import { render } from "@testing-library/react-native";
import Notifications from "../screens/Notifications";
import { getFirestore, getAuth, onSnapshot } from "firebase/firestore";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";

jest.mock("@react-navigation/native", () => ({
  useNavigation: jest.fn(),
}));

// Mock Firebase
jest.mock("firebase/firestore", () => ({
  getFirestore: jest.fn(),
  collection: jest.fn(),
  doc: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  getDocs: jest.fn(),
  onSnapshot: jest.fn(),
}));

jest.mock("firebase/auth", () => ({
    getAuth: jest.fn(() => ({
      currentUser: {
        uid: "mockedUID",
      },
    })),
  }));

describe("Notifications component", () => {
  test("renders correctly", () => {
    // Render the component
    render(<Notifications />);
  });

  test("renders Notification text correctly", () => {
    // Render the component
    const { getByText } = render(<Notifications />);

    // Check if the text "Cardholder’s Name" is rendered
    const test = getByText("Notification");

    // Assert that the text is present in the component
    expect(test).toBeTruthy();
  });
});
