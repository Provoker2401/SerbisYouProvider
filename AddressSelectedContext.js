import React, { createContext, useContext, useState } from 'react';

// Create AddressSelectedContext
const AddressSelectedContext = createContext();

// Create a Context Provider component
const AddressSelectedProvider = ({ children }) => {
  const [currentAddress, setCurrentAddress] = useState('');
  const [currentOption, setCurrentOption] = useState(0);
  const [chosenOptionAddress, setChosenOptionAddress] = useState('');
  const [chosenOptionLatitude, setChosenOptionLatitude] = useState('');
  const [chosenOptionLongitude, setChosenOptionLongitude] = useState('');
  const [currentFocus, setCurrentFocus] = useState(null);

  const contextValue = {
    currentAddress,
    setCurrentAddress,
    currentOption,
    setCurrentOption,
    chosenOptionAddress,
    setChosenOptionAddress,
    chosenOptionLatitude,
    setChosenOptionLatitude,
    chosenOptionLongitude,
    setChosenOptionLongitude,
    currentFocus,
    setCurrentFocus,
  }

  return (
    <AddressSelectedContext.Provider value={contextValue}>
      {children}
    </AddressSelectedContext.Provider>
  );
};

export { AddressSelectedProvider, AddressSelectedContext };
