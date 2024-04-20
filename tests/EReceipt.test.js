import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import EReceipt from "../screens/EReceipt";
import { useNavigation } from "@react-navigation/native";
import { updateDoc } from "firebase/firestore";
import { updateEmail } from "firebase/auth";

jest.mock("firebase/firestore", () => ({
  getFirestore: jest.fn(),
  collection: jest.fn(),
  doc: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  getDoc: jest.fn(),
  updateDoc: jest.fn(),
  onSnapshot: jest.fn(),
}));

// Mocking Firebase Auth
jest.mock("firebase/auth", () => ({
  getAuth: jest.fn(),
  onAuthStateChanged: jest.fn(),
  updateEmail: jest.fn(),
  currentUser: { uid: "mockedUserId" }, // Mocking auth.currentUser
}));

jest.mock("@react-navigation/native", () => ({
  useNavigation: jest.fn(),
}));

const itemID = 1;

// Create the mockRouteParams object with the mock values
const mockRouteParams = {
  itemID,
};

describe("EReceipt found component", () => {
  test("renders with mock values", () => {
    // Render the component with mocked route params
    render(<EReceipt route={{ params: mockRouteParams }} />);
  });

  test("renders text correctly", () => {
    // Render the component
    const { getByText } = render(
      <EReceipt route={{ params: mockRouteParams }} />
    );

    const text = getByText("Service");

    expect(text).toBeTruthy();
  });

  test("renders text correctly", () => {
    // Render the component
    const { getByText } = render(
      <EReceipt route={{ params: mockRouteParams }} />
    );

    const text = getByText("Address");

    expect(text).toBeTruthy();
  });

  
  test("renders text correctly", () => {
    // Render the component
    const { getByText } = render(
      <EReceipt route={{ params: mockRouteParams }} />
    );

    const text = getByText("Distance Fee");

    expect(text).toBeTruthy();
  });

  test("renders text correctly", () => {
    // Render the component
    const { getByText } = render(
      <EReceipt route={{ params: mockRouteParams }} />
    );

    const text = getByText("Payment Method");

    expect(text).toBeTruthy();
  });

  test("renders text correctly", () => {
    // Render the component
    const { getByText } = render(
      <EReceipt route={{ params: mockRouteParams }} />
    );

    const text = getByText("Booking ID");

    expect(text).toBeTruthy();
  });

  test("renders text correctly", () => {
    // Render the component
    const { getByText } = render(
      <EReceipt route={{ params: mockRouteParams }} />
    );

    const text = getByText("Subtotal");

    expect(text).toBeTruthy();
  });
});
