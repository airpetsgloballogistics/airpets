"use client";
import { createContext, useState, useEffect } from "react";

const ShipmentContext = createContext();

export const ShipmentProvider = ({ children }) => {
  const [shipments, setShipments] = useState(null);
  const [rem, setRem] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("rem") === "true";
    }
    return false;
  });
  const [shipmentStatus, setShipmentStatus] = useState("Inactive");
  const [shipmentPosition, setShipmentPosition] = useState([0, 0]);
  const [currentStep, setCurrentStep] = useState(0);
  const [user, setUser] = useState(() => {
    // Initialize user from local storage
    if (typeof window !== "undefined") {
      let storedUser = localStorage.getItem("user");
      return rem ? storedUser || "" : "";
    }
    return "";
  });

  useEffect(() => {
    // Save user and rem to local storage whenever they change
    if (typeof window !== "undefined") {
      if (rem) {
        localStorage.setItem("user", user);
        localStorage.setItem("rem", rem);
      } else {
        localStorage.removeItem("user");
        localStorage.removeItem("rem");
      }
    }
  }, [user, rem]);

  console.log("Current shipment position in context:", shipmentPosition);

  return (
    <ShipmentContext.Provider
      value={{
        shipments,
        setShipments,
        shipmentStatus,
        setShipmentStatus,
        shipmentPosition,
        setShipmentPosition,
        currentStep,
        setCurrentStep,
        user,
        setUser,
        rem,
        setRem,
      }}
    >
      {children}
    </ShipmentContext.Provider>
  );
};

export default ShipmentContext;
