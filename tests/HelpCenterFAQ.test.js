import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import HelpCenterFAQ from "../screens/HelpCenterFAQ";
import { SafeAreaProvider } from "react-native-safe-area-context";

describe("Help Center FAQ component", () => {
  test("renders correctly", () => {
    // Render the component
    render(
      <SafeAreaProvider>
        <HelpCenterFAQ />
      </SafeAreaProvider>
    );
  });

  

  
});
