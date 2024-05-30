import React, { createContext, useContext, useState } from "react";

// Create the context
const AddAddressContext = createContext();

export const useAddAddressContext = () => useContext(AddAddressContext);

export const AddAddressProvider = ({ children }) => {
  const [addAddressData, setAddAddressData] = useState(null);

  const setAddAddressDataValue = (data) => {
    setAddAddressData(data);
  };

  return (
    <AddAddressContext.Provider
      value={{ addAddressData, setAddAddressData: setAddAddressDataValue }}
    >
      {children}
    </AddAddressContext.Provider>
  );
};

