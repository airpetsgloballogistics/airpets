"use client";
import React, { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";

const Barcode = ({ trackingNumber }) => {
  const barcodeRef = useRef(null);
  const [JsBarcode, setJsBarcode] = useState(null);

  useEffect(() => {
    const loadJsBarcode = async () => {
      const barcodeModule = await import("jsbarcode");
      setJsBarcode(() => barcodeModule.default);
    };

    loadJsBarcode();
  }, []);

  useEffect(() => {
    if (barcodeRef.current && JsBarcode) {
      JsBarcode(barcodeRef.current, trackingNumber, {
        format: "CODE128",
        displayValue: true,
        fontSize: 18,
      });
    }
  }, [trackingNumber, JsBarcode]);

  return <svg className="bar" ref={barcodeRef}></svg>;
};

export default Barcode;
