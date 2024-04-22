import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import TermsAndConditions from "../screens/TermsAndConditions";

describe("Privacy Policy component", () => {
  test("renders correctly", () => {
    render(<TermsAndConditions />);
  });
  
  test("renders specified text correctly", () => {
    // Render the component
    const { getByText } = render(<TermsAndConditions />);

    // Check if the text "Cardholder’s Name" is rendered
    const test = getByText("AGREEMENT TO OUR LEGAL TERMS");
    const test1 = getByText("TABLE OF CONTENTS");
    const test2 = getByText("OUR SERVICES");
    const test3 = getByText("INTELLECTUAL PROPERTY RIGHTS");
    const test4 = getByText("You are responsible for what you post or upload:");
    const test5 = getByText("USER REGISTRATION");
    const test6 = getByText("PURCHASES AND PAYMENT");
    const test7 = getByText("POLICY");
    const test8 = getByText("All sales are final and no refund will be issued.");
    const test9 = getByText("USER DATA");
    const test10 = getByText("CONTACT US");




    // Assert that the text is present in the component
    expect(test).toBeTruthy();
    expect(test1).toBeTruthy();
    expect(test2).toBeTruthy();
    expect(test3).toBeTruthy();
    expect(test4).toBeTruthy();
    expect(test5).toBeTruthy();
    expect(test6).toBeTruthy();
    expect(test7).toBeTruthy();
    expect(test8).toBeTruthy();
    expect(test9).toBeTruthy();
    expect(test10).toBeTruthy();

  });
});
