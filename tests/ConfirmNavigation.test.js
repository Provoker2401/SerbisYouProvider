import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import ConfirmNavigation from "../screens/ConfirmNavigation";
import { useNavigation } from "@react-navigation/native";

jest.mock("@react-navigation/native", () => ({
  useNavigation: jest.fn(),
}));

jest.mock("firebase/auth", () => ({
  getAuth: jest.fn(() => ({
    currentUser: {
      uid: "mockedUID",
    },
  })),
}));

jest.mock("rn-swipe-button", () => ({
  SwipeButton: jest.fn(),
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
  serverTimestamp: jest.fn(),
  setDoc: jest.fn(),
}));

describe("ConfirmNavigation component", () => {

  test("renders correctly with route params", () => {
    const route = {
      params: {
        itemID: "mockedItemID",
        matchedBookingID: "mockedBookingID",
        customerUID: "mockedCustomerUID",
      },
    };

    render(<ConfirmNavigation route={route} />);

  });
  test("renders correctly with route params", () => {
    const route = {
      params: {
        itemID: "mockedItemID",
        matchedBookingID: "mockedBookingID",
        customerUID: "mockedCustomerUID",
      },
    };

    const { getByText } = render(<ConfirmNavigation route={route} />);

    const text = getByText(
      "Please confirm if you are now heading to the customer's location."
    );
    expect(text).toBeTruthy();
  });

});
