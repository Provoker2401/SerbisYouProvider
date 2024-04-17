import React from "react";
import { render } from "@testing-library/react-native";
import ApplicationForm2 from "../screens/ApplicationForm2";
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
    render(<ApplicationForm2 />);
  });

  test("renders Personal Details correctly", () => {
    ImagePicker.requestMediaLibraryPermissionsAsync.mockResolvedValueOnce({
      status: "granted",
    });
    // Render the component
    const { getByText } = render(<ApplicationForm2 />);

    // Check if the text "Cardholder’s Name" is rendered
    const text = getByText("Personal Details");

    // Assert that the text is present in the component
    expect(text).toBeTruthy();
  });

  test("renders Service Details correctly", () => {
    ImagePicker.requestMediaLibraryPermissionsAsync.mockResolvedValueOnce({
      status: "granted",
    });
    // Render the component
    const { getByText } = render(<ApplicationForm2 />);

    // Check if the text "Cardholder’s Name" is rendered
    const text = getByText("Service Details");

    // Assert that the text is present in the component
    expect(text).toBeTruthy();
  });

  test("renders Choose Document Type correctly", () => {
    ImagePicker.requestMediaLibraryPermissionsAsync.mockResolvedValueOnce({
      status: "granted",
    });
    // Render the component
    const { getByText } = render(<ApplicationForm2 />);

    // Check if the text "Cardholder’s Name" is rendered
    const text = getByText("Choose Document Type");

    // Assert that the text is present in the component
    expect(text).toBeTruthy();
  });

  test("renders National ID correctly", () => {
    ImagePicker.requestMediaLibraryPermissionsAsync.mockResolvedValueOnce({
      status: "granted",
    });
    // Render the component
    const { getByText } = render(<ApplicationForm2 />);

    // Check if the text "Cardholder’s Name" is rendered
    const text = getByText("National I.D.");

    // Assert that the text is present in the component
    expect(text).toBeTruthy();
  });

  test("renders other correctly", () => {
    ImagePicker.requestMediaLibraryPermissionsAsync.mockResolvedValueOnce({
      status: "granted",
    });
    // Render the component
    const { getByText } = render(<ApplicationForm2 />);

    // Check if the text "Cardholder’s Name" is rendered
    const text = getByText("Other");

    // Assert that the text is present in the component
    expect(text).toBeTruthy();
  });

  test("renders other correctly", () => {
    ImagePicker.requestMediaLibraryPermissionsAsync.mockResolvedValueOnce({
      status: "granted",
    });
    // Render the component
    const { getByText } = render(<ApplicationForm2 />);

    // Check if the text "Cardholder’s Name" is rendered
    const text = getByText(
      "Put your document on a plain clean surface and make sure important details such as name and age are visible."
    );

    // Assert that the text is present in the component
    expect(text).toBeTruthy();
  });

  test("renders back correctly", () => {
    ImagePicker.requestMediaLibraryPermissionsAsync.mockResolvedValueOnce({
      status: "granted",
    });
    // Render the component
    const { getByText } = render(<ApplicationForm2 />);

    // Check if the text "Cardholder’s Name" is rendered
    const text = getByText("Back");

    // Assert that the text is present in the component
    expect(text).toBeTruthy();
  });

  test("renders Next correctly", () => {
    ImagePicker.requestMediaLibraryPermissionsAsync.mockResolvedValueOnce({
      status: "granted",
    });
    // Render the component
    const { getByText } = render(<ApplicationForm2 />);

    // Check if the text "Cardholder’s Name" is rendered
    const text = getByText("Next");

    // Assert that the text is present in the component
    expect(text).toBeTruthy();
  });
});
