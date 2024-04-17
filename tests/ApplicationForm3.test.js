import React from "react";
import { render } from "@testing-library/react-native";
import ApplicationForm3 from "../screens/ApplicationForm2";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";

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

jest.mock("firebase/storage", () => ({
  getStorage: jest.fn(),
  ref: jest.fn(),
  uploadString: jest.fn(),
  getDownloadURL: jest.fn(),
  uploadBytes: jest.fn(),
}));

jest.mock("expo-image-picker", () => ({
  requestMediaLibraryPermissionsAsync: jest.fn(),
}));

describe("ApplicationForm1 component", () => {
  beforeEach(() => {
    // Reset mock implementation before each test
    ImagePicker.requestMediaLibraryPermissionsAsync.mockReset();
  });

  test("renders correctly", () => {
    ImagePicker.requestMediaLibraryPermissionsAsync.mockResolvedValueOnce({
        status: "granted",
      });
    // Render the component
    render(<ApplicationForm3 />);
  });
});
