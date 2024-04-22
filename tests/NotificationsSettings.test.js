// NotificationsSettings.test.js

import React from "react";
import { render } from "@testing-library/react-native";
import NotificationsSettings from "../screens/NotificationsSettings";
import { useNavigation } from "@react-navigation/native";

describe("NotificationsSettings component", () => {
  test("renders correctly", () => {
    // Render the component
    render(<NotificationsSettings />);
  });

  test("renders Email Notications text correctly", () => {
    // Render the component
    const { getByText } = render(<NotificationsSettings />);

    const test = getByText("Email Notifications");

    // Assert that the text is present in the component
    expect(test).toBeTruthy();
  });

  test("renders  Push notifications to email text correctly", () => {
    // Render the component
    const { getByText } = render(<NotificationsSettings />);

    const test = getByText("Push notifications to email");

    // Assert that the text is present in the component
    expect(test).toBeTruthy();
  });

  test("renders  Push notifications to email text correctly", () => {
    // Render the component
    const { getByText } = render(<NotificationsSettings />);

    const test = getByText("SMS Notifications");

    // Assert that the text is present in the component
    expect(test).toBeTruthy();
  });
  test("renders  Push notifications to email text correctly", () => {
    // Render the component
    const { getByText } = render(<NotificationsSettings />);

    const test = getByText("Push notifications to phone");

    // Assert that the text is present in the component
    expect(test).toBeTruthy();
  });
  test("renders  Push notifications to email text correctly", () => {
    // Render the component
    const { getByText } = render(<NotificationsSettings />);

    const test = getByText("Order Notifications");

    // Assert that the text is present in the component
    expect(test).toBeTruthy();
  });
  test("renders  Push notifications to email text correctly", () => {
    // Render the component
    const { getByText } = render(<NotificationsSettings />);

    const test = getByText("Receive orders notifications");

    // Assert that the text is present in the component
    expect(test).toBeTruthy();
  });
  test("renders  Push notifications to email text correctly", () => {
    // Render the component
    const { getByText } = render(<NotificationsSettings />);

    const test = getByText("Chat Notifications");

    // Assert that the text is present in the component
    expect(test).toBeTruthy();
  });
  test("renders  Push notifications to email text correctly", () => {
    // Render the component
    const { getByText } = render(<NotificationsSettings />);

    const test = getByText("Receive chat or call notifications");

    // Assert that the text is present in the component
    expect(test).toBeTruthy();
  });
});
