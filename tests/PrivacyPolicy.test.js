import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import PrivacyPolicy from "../screens/PrivacyPolicy";

describe("Privacy Policy component", () => {
  test("renders correctly", () => {
    render(<PrivacyPolicy />);
  });

  test("renders text correctly", () => {
    // Render the component
    const { getByText } = render(<PrivacyPolicy />);

    // Check if the text "Cardholder’s Name" is rendered
    const test = getByText("1. Types of Data We Collect");
    const test2 = getByText("2. Use of Your Personal Data");
    const test3 = getByText("3. Account Setup and Verification");
    const test4 = getByText("4. Communication");
    const test5 = getByText("5. Disclosure of Data");
    const test6 = getByText("6. Data Retention and Deletion");

    // Assert that the text is present in the component
    expect(test).toBeTruthy();
    expect(test2).toBeTruthy();
    expect(test3).toBeTruthy();
    expect(test4).toBeTruthy();
    expect(test5).toBeTruthy();
    expect(test6).toBeTruthy();
  });
});
