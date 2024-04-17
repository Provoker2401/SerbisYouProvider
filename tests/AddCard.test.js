import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import AddCard from "../screens/AddCard";

describe("Add Card component", () => {
  test("renders correctly", () => {
    // Render the component
    render(<AddCard />);
  });

  test("renders cardholder's name correctly", () => {
    // Render the component
    const { getByText } = render(<AddCard />);

    // Check if the text "Cardholder’s Name" is rendered
    const cardholderNameText = getByText("Cardholder’s Name");

    // Assert that the text is present in the component
    expect(cardholderNameText).toBeTruthy();
  });

  test("renders card number correctly", () => {
    // Render the component
    const { getByText } = render(<AddCard />);

    // Check if the text "Cardholder’s Name" is rendered
    const cardholderNameText = getByText("Card Number");

    // Assert that the text is present in the component
    expect(cardholderNameText).toBeTruthy();
  });

  test("renders The number you’re entering doesn’t seems right correctly", () => {
    // Render the component
    const { getByText } = render(<AddCard />);

    // Check if the text "Cardholder’s Name" is rendered
    const cardholderNameText = getByText("The number you’re entering doesn’t seems right");

    // Assert that the text is present in the component
    expect(cardholderNameText).toBeTruthy();
  });

  test("renders Expiry date correctly", () => {
    // Render the component
    const { getByText } = render(<AddCard />);

    // Check if the text "Cardholder’s Name" is rendered
    const cardholderNameText = getByText("Expiry Date");

    // Assert that the text is present in the component
    expect(cardholderNameText).toBeTruthy();
  });

  test("renders Notifications correctly", () => {
    // Render the component
    const { getByText } = render(<AddCard />);

    // Check if the text "Cardholder’s Name" is rendered
    const cardholderNameText = getByText("Notifications");

    // Assert that the text is present in the component
    expect(cardholderNameText).toBeTruthy();
  });

  test("renders Account correctly", () => {
    // Render the component
    const { getByText } = render(<AddCard />);

    // Check if the text "Cardholder’s Name" is rendered
    const cardholderNameText = getByText("Account");

    // Assert that the text is present in the component
    expect(cardholderNameText).toBeTruthy();
  });

  test("renders Enter a valid CV correctly", () => {
    // Render the component
    const { getByText } = render(<AddCard />);

    // Check if the text "Cardholder’s Name" is rendered
    const cardholderNameText = getByText("Enter a valid CVV.");

    // Assert that the text is present in the component
    expect(cardholderNameText).toBeTruthy();
  });

  test("renders CVV correctly", () => {
    // Render the component
    const { getByText } = render(<AddCard />);

    // Check if the text "Cardholder’s Name" is rendered
    const cardholderNameText = getByText("CVV");

    // Assert that the text is present in the component
    expect(cardholderNameText).toBeTruthy();
  });

  test("renders Your card details will be saved securely. correctly", () => {
    // Render the component
    const { getByText } = render(<AddCard />);

    // Check if the text "Cardholder’s Name" is rendered
    const cardholderNameText = getByText("Your card details will be saved securely.");

    // Assert that the text is present in the component
    expect(cardholderNameText).toBeTruthy();
  });

  test("renders terms and conditions. correctly", () => {
    // Render the component
    const { getByText } = render(<AddCard />);

    // Check if the text "Cardholder’s Name" is rendered
    const cardholderNameText = getByText("terms and conditions.");

    // Assert that the text is present in the component
    expect(cardholderNameText).toBeTruthy();
  });
});
