import React from "react";
import { render } from "@testing-library/react-native";
import BookingsActive from "../screens/BookingsActive";
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
}));
jest.mock("@react-navigation/material-top-tabs", () => ({
  createMaterialTopTabNavigator: jest.fn(() => {
    const Navigator = jest.fn();
    const Screen = jest.fn();
    return {
      Navigator,
      Screen,
    };
  }),
}));
jest.mock("@react-navigation/material-top-tabs", () => ({
  createMaterialTopTabNavigator: jest.fn(() => {
    const Navigator = jest.fn();
    const Screen = jest.fn();
    return {
      Navigator,
      Screen,
    };
  }),
}));

describe("ApplicationForm1 component", () => {
  test("renders correctly", () => {
    // Render the component
    render(<BookingsActive />);
  });
});
