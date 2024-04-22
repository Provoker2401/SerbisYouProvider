import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import PrivacyPolicy from "../screens/PrivacyPolicy";

describe("Privacy Policy component", () => {
  test("renders correctly", () => {
    render(<PrivacyPolicy />);
  });
});
