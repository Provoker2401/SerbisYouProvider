import React from "react";
import { render } from "@testing-library/react-native";
import EditService from "../screens/EditService";
import { useNavigation } from "@react-navigation/native";

jest.mock("@react-navigation/native", () => ({
  useNavigation: jest.fn(),
}));

// Mock for firebase/auth
jest.mock("firebase/auth", () => ({
  getAuth: jest.fn(),
  onAuthStateChanged: jest.fn(),
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
}));

describe("ApplicationForm1 component", () => {
  test("renders correctly", () => {
    // Render the component
    render(<EditService />);
  });

  test("renders text correctly", () => {
    // Render the component
    const { getByText } = render(<EditService />);

    const text = getByText("Personal Details");
    const text1 = getByText("ID Proof");

    expect(text).toBeTruthy();
    expect(text1).toBeTruthy();
  });

  test("renders text correctly", () => {
    // Render the component
    const { getByText } = render(<EditService />);

    const text = getByText("Service Details");

    expect(text).toBeTruthy();
  });

  test("renders text correctly", () => {
    // Render the component
    const { getByText } = render(<EditService />);

    const text = getByText("Enter Your Services");

    expect(text).toBeTruthy();
  });

  test("renders text correctly", () => {
    // Render the component
    const { getByText } = render(<EditService />);

    const text = getByText("Services");

    expect(text).toBeTruthy();
  });


  test("renders text correctly", () => {
    // Render the component
    const { getByText } = render(<EditService />);

    const text = getByText("Update and Save");

    expect(text).toBeTruthy();
  });


});
