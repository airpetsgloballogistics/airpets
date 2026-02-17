"use client";

import React, {
  useContext,
  useEffect,
  useState,
  Suspense,
  useRef,
} from "react";
import { useRouter, useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import ShipmentContext from "@/contexts/ShipmentContext";
import useMediaQuery from "@/components/UseMediaQuery";
import { geocodeAddress } from "@/utils/geocode";
import Footer from "@/components/Footer/Footer";
import Barcode from "@/components/Barcode";
const styles = {
  // Base styles
  tableCell: "py-4 px-6",
  container:
    "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-gray-50 min-h-screen",

  // Header styles
  header: "mb-8 text-center space-y-3",
  title: "text-3xl md:text-4xl font-bold text-gray-800 mb-2",
  subtitle: "text-lg md:text-xl text-gray-600",

  // Card styles
  card: "bg-white mb-8 transition-all duration-300 ",
  cardTitle:
    "text-xl md:text-2xl font-bold text-gray-800 bg-gray-50 p-4 rounded-lg mb-6",

  // Status styles
  currentLocation:
    "inline-flex items-center px-4 py-2 rounded- bg-emerald-50 text-emerald-700 font-bold",
  currentLocationDot: "w-2 h-2 rounded-full bg-emerald-500 mr-2 animate-pulse",
  checkingStatus:
    "inline-flex text-lg items-center px-4 py-2 rounded- bg-primary-50 text-primary-950 font-bold animate-pulse",
  checkingPulse: "w-2 h-2 rounded-full bg-primary-500 mr-2 animate-pulse",

  // Grid and Layout
  grid: "grid md:grid-cols-2 gap-8",
  shippingInfoContainer: "grid grid-cols-1 md:grid-cols-2 gap-6",
  detailsContainer: "bg-white rounded- shadow-md overflow-hidden",

  // Section styles
  infoSection: "mb-6 space-y-4",
  sectionHeader: "text-lg font-semibold text-white  bg-primary-950 p-4",
  infoTitle:
    "text-lg font-semibold text-gray-700 mb-4 border-l-4 border-primary-950 pl-3",

  // Row and value styles
  infoRow:
    "flex flex-wrap items-center mb-3 hover:bg-gray-50 p-3 rounded-lg transition-colors duration-200",
  infoLabel: "w-full sm:w-1/3 font-semibold text-gray-700 ",
  infoValue: "w-full sm:w-2/3 text-gray-800 font-medium",

  // Table styles
  detailsTable: "w-full border-collapse bg-white rounded overflow-hidden",
  table: "w-full border-collapse bg-white shadow-sm  overflow-hidden",
  tableHeader:
    "bg-gray-100 text-left py-4 px-6 font-semibold whitespace-nowrap text-gray-700 uppercase text-sm tracking-wider",
  tableRow:
    "border-b border-gray-200 hover:bg-gray-50 transition-colors duration-150",
  label:
    "text-gray-800 font-semibold py-4 px-4 bg-gray-50 border-b whitespace-nowrap border-gray-200 w-1/3",
  value: "text-gray-700 py-4 px-4 border-b border-gray-200 w-2/3",

  // Button styles
  statusBadge:
    "inline-block px-6 py-2 rounded-lg text-white font-medium shadow-sm transform transition-transform duration-200 hover:scale-105",
  button:
    "bg-primary-950 hover:bg-primary-950 text-white font-medium py-3 px-6 rounded-lg transition duration-200 inline-flex items-center shadow-md hover:shadow-xl active:transform active:scale-95",
  buttonIcon: "mr-2 h-5 w-5",
  printButton: "mb-6 flex justify-end space-x-4",

  // Container styles
  mapContainer:
    "h-[400px] md:h-[500px] w-full rounded-xl overflow-hidden mb-8 shadow-lg",
  barcodeContainer:
    "flex justify-center mb-8 p-6 bg-gray-50 rounded-xl shadow-inner",
  loadingContainer: "flex justify-center items-center h-screen bg-gray-50",
  errorContainer: "text-center py-12 bg-accent-50 rounded-xl",

  // Loading and error styles
  loader: "flex space-x-2",
  loaderSquare: "w-4 h-4 bg-primary-950 rounded-full animate-pulse",
  errorMessage: "text-accent-600 text-lg font-medium",

  // Additional layout styles
  detailsGrid: "grid md:grid-cols-3 gap-6",
  packageDetails: "overflow-x-auto rounded-xl shadow-md",
  statusTimeline:
    "relative pl-8 space-y-6 before:content-[''] before:absolute before:left-4 before:top-0 before:h-full before:w-0.5 before:bg-gray-200",
  timelineItem:
    "relative before:content-[''] before:absolute before:left-[-2rem] before:top-2 before:w-4 before:h-4 before:rounded-full before:bg-primary-950",
};

// Dynamic import of MapComponent with SSR disabled
const MapComponent = dynamic(() => import("@/components/MapComponent"), {
  ssr: false,
});

// Helper functions
const calculateEstimatedDeliveryTime = (distance, method) => {
  const speeds = {
    road: 20,
    sea: 15,
    rail: 60,
    air: 700,
  };

  const speed = speeds[method.toLowerCase()];
  if (!speed) return "N/A";
  const time = distance / speed;
  return time.toFixed(2);
};
const getStatusColor = (status) => {
  switch (status.toLowerCase()) {
    case "active":
    case "intransit":
      return "bg-emerald-600";
    case "completed":
      return "bg-primary-950";
    case "inactive":
      return "bg-accent-50";
    case "pending":
      return "bg-accent-50";
    default:
      return "bg-gray-600";
  }
};

// Loading component
function LoadingSpinner() {
  return (
    <div className={styles.loadingContainer}>
      <div className="flex  flex-col items-center space-y-4">
        <div className={styles.loader}>
          {[0, 1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className={styles.loaderSquare}
              style={{ animationDelay: `${i * 100}ms` }}
            />
          ))}
        </div>
        <p className="text-gray-600 font-medium animate-pulse">
          Loading shipment details...
        </p>
      </div>
    </div>
  );
}
// Error Message Component
function ErrorMessage({ message }) {
  return (
    <div className={styles.errorContainer}>
      <div className="max-w-md mx-auto p-6">
        <svg
          className="w-16 h-16 text-accent-500 mx-auto mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
        <h3 className="text-xl font-bold text-gray-800 mb-2">Error</h3>
        <p className={styles.errorMessage}>{message}</p>
      </div>
    </div>
  );
}

function PageContent() {
  const mobile = useMediaQuery("(max-width:740px)");
  const navigate = useRouter();
  const printRef = useRef();
  const searchParams = useSearchParams();
  const trackingNumber = searchParams.get("num");

  const {
    shipments,
    setShipments,
    shipmentStatus,
    setShipmentStatus,
    shipmentPosition,
    setShipmentPosition,
  } = useContext(ShipmentContext);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [senderCoords, setSenderCoords] = useState(null);
  const [receiverCoords, setReceiverCoords] = useState(null);
  const [estimatedDeliveryTime, setEstimatedDeliveryTime] = useState("");
  const [showMap, setShowMap] = useState(false);

  useEffect(() => {
    const fetchLatestShipment = async () => {
      const L = await import("leaflet");
      if (trackingNumber) {
        try {
          const res = await fetch("/api/getShipment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ trackingNumber }),
          });

          if (res.status === 200) {
            const data = await res.json();
            setShipments(data.shipmentData);

            // Check if the shipment status has changed
            if (data.shipmentData.status !== shipmentStatus) {
              // Send email notification
              await fetch("/api/sendEmail", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  receiverEmail: data.shipmentData.receiverEmail,
                  trackingNumber,
                  status: data.shipmentData.status,
                }),
              });

              setShipmentStatus(data.shipmentData.status);
            }

            setShipmentPosition(data.shipmentData.currentPosition);

            // Geocode addresses
            const senderCoords = await geocodeAddress(
              data.shipmentData.senderAddress
            );
            const receiverCoords = await geocodeAddress(
              data.shipmentData.receiverAddress
            );

            if (senderCoords && receiverCoords) {
              setSenderCoords(senderCoords);
              setReceiverCoords(receiverCoords);
              const distance =
                L.latLng(senderCoords).distanceTo(L.latLng(receiverCoords)) /
                1000;
              const estimatedTime = calculateEstimatedDeliveryTime(
                distance,
                data.shipmentData.shippingMethod
              );
              setEstimatedDeliveryTime(estimatedTime);
            } else {
              setError("Unable to geocode one or both addresses.");
            }
            setLoading(false);
          } else {
            const errorData = await res.json();
            throw new Error(errorData.message || "Shipment not found");
          }
        } catch (error) {
          console.error("Error caught:", error);
          setError(error.message);
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchLatestShipment();
  }, [
    trackingNumber,
    setShipments,
    setShipmentStatus,
    setShipmentPosition,
    shipmentStatus,
  ]);

  const handlePrint = () => {
    const printContent = printRef.current.innerHTML;
    const originalContent = document.body.innerHTML;

    document.body.innerHTML = printContent;
    window.print();
    document.body.innerHTML = originalContent;
    window.location.reload();
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!shipments) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md">
          <svg
            className="mx-auto h-16 w-16 text-gray-400 mb-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h1 className="text-2xl font-bold text-gray-700 mb-2">
            No Shipment Found
          </h1>
          <p className="text-gray-500 mb-6">
            No shipment details are available for the provided tracking number.
          </p>
          <button onClick={() => navigate.push("/")} className={styles.button}>
            Return Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className={styles.container} ref={printRef}>
        {/* Header Section */}
        <div className={styles.header}>
          <h1 className={styles.title}>Shipment Tracking Details</h1>
          <p className={styles.subtitle}>Tracking Number: {trackingNumber}</p>
        </div>
        {/* Print Button */}
        <div className={styles.printButton}>
          <button className={styles.button} onClick={handlePrint}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={styles.buttonIcon}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
              />
            </svg>
            Print Tracking Details
          </button>
        </div>
        {/* Barcode Section */}
        <div className={styles.barcodeContainer}>
          <Barcode trackingNumber={trackingNumber} />
        </div>
        {/* Status Badge */}
        <div className="mb-8 text-center">
          <div
            className={`inline-flex items-center px-6 py-2 rounded shadow-sm ${
              shipments.status.toLowerCase() === "inactive" ||
              shipments.status.toLowerCase() === "pending"
                ? "bg-accent-50"
                : getStatusColor(shipments.status.toLowerCase())
            }`}
          >
            <div
              className={`w-2 h-2 rounded-full mr-2 ${
                shipments.status.toLowerCase() === "inactive" ||
                shipments.status.toLowerCase() === "pending"
                  ? "bg-accent-500"
                  : "bg-emerald-500"
              }`}
            />
            <span
              className={
                shipments.status.toLowerCase() === "inactive" ||
                shipments.status.toLowerCase() === "pending"
                  ? "text-accent-700 font-medium"
                  : "text-white font-medium"
              }
            >
              Status:{" "}
              <span
                className={`font-bold ${
                  shipments.status.toLowerCase() === "inactive" ||
                  shipments.status.toLowerCase() === "pending"
                    ? "animate-[hardBlink_1s_step-end_infinite]"
                    : ""
                }`}
              >
                {shipments.status}
              </span>
            </span>
          </div>
        </div>

        {/* Continue with the rest of the components... */}
        {/* Shipping Informati{/* Shipping Information Card */}
        {/* Shipping Information Card */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Shipping Information</h2>

          <div className={styles.shippingInfoContainer}>
            {/* Sender's Details */}
            <div className={styles.detailsContainer}>
              <h3 className={styles.sectionHeader}>Sender's Details</h3>
              <table className={styles.detailsTable}>
                <tbody>
                  <tr className={styles.tableRow}>
                    <td className={styles.label}>Name:</td>
                    <td className={styles.value}>{shipments.sender}</td>
                  </tr>
                  <tr className={styles.tableRow}>
                    <td className={styles.label}>Contact:</td>
                    <td className={styles.value}>{shipments.senderNumber}</td>
                  </tr>
                  <tr className={styles.tableRow}>
                    <td className={styles.label}>Email:</td>
                    <td className={styles.value}>{shipments.senderEmail}</td>
                  </tr>
                  <tr className={styles.tableRow}>
                    <td className={styles.label}>Address:</td>
                    <td className={styles.value}>{shipments.senderAddress}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Receiver's Details */}
            <div className={styles.detailsContainer}>
              <h3 className={styles.sectionHeader}>Receiver's Details</h3>
              <table className={styles.detailsTable}>
                <tbody>
                  <tr className={styles.tableRow}>
                    <td className={styles.label}>Name:</td>
                    <td className={styles.value}>{shipments.receiver}</td>
                  </tr>
                  <tr className={styles.tableRow}>
                    <td className={styles.label}>Contact:</td>
                    <td className={styles.value}>{shipments.receiverNumber}</td>
                  </tr>
                  <tr className={styles.tableRow}>
                    <td className={styles.label}>Email:</td>
                    <td className={styles.value}>{shipments.receiverEmail}</td>
                  </tr>
                  <tr className={styles.tableRow}>
                    <td className={styles.label}>Address:</td>
                    <td className={styles.value}>
                      {shipments.receiverAddress}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        {/* Shipment Details Card */}
        <div className={styles.card}>
          <div className="overflow-x-auto">
            <h2 className={styles.sectionHeader}>Shipment Details</h2>
            <table className={styles.detailsTable}>
              <tbody>
                <tr className={styles.tableRow}>
                  <td className={styles.label}>Origin</td>
                  <td className={styles.value}>{shipments.origin}</td>
                </tr>
                <tr className={styles.tableRow}>
                  <td className={styles.label}>Destination</td>
                  <td className={styles.value}>{shipments.destination}</td>
                </tr>
                <tr className={styles.tableRow}>
                  <td className={styles.label}>Carrier</td>
                  <td className={styles.value}>{shipments.carrier}</td>
                </tr>
                <tr className={styles.tableRow}>
                  <td className={styles.label}>Package Type</td>
                  <td className={styles.value}>{shipments.packages}</td>
                </tr>
                <tr className={styles.tableRow}>
                  <td className={styles.label}>Weight</td>
                  <td className={styles.value}>{shipments.weight}</td>
                </tr>
                <tr className={styles.tableRow}>
                  <td className={styles.label}>Quantity</td>
                  <td className={styles.value}>{shipments.quantity}</td>
                </tr>
                <tr className={styles.tableRow}>
                  <td className={styles.label}>Product</td>
                  <td className={styles.value}>{shipments.product}</td>
                </tr>
                <tr className={styles.tableRow}>
                  <td className={styles.label}>Shipment Type</td>
                  <td className={styles.value}>{shipments.shipmentType}</td>
                </tr>
                <tr className={styles.tableRow}>
                  <td className={styles.label}>Mode</td>
                  <td className={styles.value}>{shipments.mode}</td>
                </tr>
                <tr className={styles.tableRow}>
                  <td className={styles.label}>Pickup Date</td>
                  <td className={styles.value}>{shipments.pickupDate}</td>
                </tr>
                <tr className={styles.tableRow}>
                  <td className={styles.label}>Pickup Time</td>
                  <td className={styles.value}>{shipments.pickupTime}</td>
                </tr>
                <tr className={styles.tableRow}>
                  <td className={styles.label}>Expected Delivery</td>
                  <td className={styles.value}>
                    {shipments.expectedDeliveryDate}
                  </td>
                </tr>
                <tr className={styles.tableRow}>
                  <td className={styles.label}>Carrier Ref No.</td>
                  <td className={styles.value}>
                    {shipments.carrierReferenceNo}
                  </td>
                </tr>
                <tr className={styles.tableRow}>
                  <td className={styles.label}>Payment Mode</td>
                  <td className={styles.value}>{shipments.paymentMethod}</td>
                </tr>
                <tr className={styles.tableRow}>
                  <td className={styles.label}>Total Freight</td>
                  <td className={styles.value}>{shipments.totalFreight}</td>
                </tr>
                <tr className={styles.tableRow}>
                  <td className={styles.label}>Comments</td>
                  <td className={styles.value}>{shipments.comments}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Package Details Card */}
        {(shipments.productQuantity > 0 ||
          shipments.productType ||
          shipments.description ||
          shipments.length ||
          shipments.width ||
          shipments.productWeight ||
          shipments.height ||
          shipments.currentLocation) && (
          <div className={styles.card}>
            <h2 className={styles.sectionHeader}>Package Details</h2>
            <div className="overflow-x-auto">
              <table className={styles.detailsTable}>
                <tbody>
                  {shipments.productQuantity > 0 && (
                    <tr className={styles.tableRow}>
                      <td className={styles.label}>Quantity</td>
                      <td className={styles.value}>
                        {shipments.productQuantity}
                      </td>
                    </tr>
                  )}
                  {shipments.productType && (
                    <tr className={styles.tableRow}>
                      <td className={styles.label}>Piece Type</td>
                      <td className={styles.value}>{shipments.productType}</td>
                    </tr>
                  )}
                  {shipments.description && (
                    <tr className={styles.tableRow}>
                      <td className={styles.label}>Description</td>
                      <td className={`${styles.value} uppercase`}>
                        {shipments.description}
                      </td>
                    </tr>
                  )}
                  {shipments.length && (
                    <tr className={styles.tableRow}>
                      <td className={styles.label}>Length (cm)</td>
                      <td className={`${styles.value} font-bold`}>
                        {shipments.length}
                      </td>
                    </tr>
                  )}
                  {shipments.width && (
                    <tr className={styles.tableRow}>
                      <td className={styles.label}>Width (cm)</td>
                      <td className={`${styles.value} font-bold`}>
                        {shipments.width}
                      </td>
                    </tr>
                  )}
                  {shipments.height && (
                    <tr className={styles.tableRow}>
                      <td className={styles.label}>Height (cm)</td>
                      <td className={`${styles.value} font-bold`}>
                        {shipments.height}
                      </td>
                    </tr>
                  )}
                  {shipments.productWeight && (
                    <tr className={styles.tableRow}>
                      <td className={styles.label}>Weight (g)</td>
                      <td className={`${styles.value} font-bold`}>
                        {shipments.productWeight}
                      </td>
                    </tr>
                  )}
                  <tr className={styles.tableRow}>
                    <td className={styles.label}>Current Location</td>
                    <td className={styles.value}>
                      {shipments.currentLocation ? (
                        <div className="inline-flex items-center px-3 py-1 bg-emerald-50">
                          <div className="w-2 h-2 rounded-full bg-emerald-500 mr-2"></div>
                          <span className="text-emerald-700 font-semibold">
                            {shipments.currentLocation}
                          </span>
                        </div>
                      ) : (
                        <div className="inline-flex items-center px-3 py-1 bg-primary-50">
                          <div className="w-2 h-2 rounded-full bg-primary-500 mr-2 animate-[locationPulse_2s_ease-in-out_infinite]"></div>
                          <span className="text-primary-950 animate-[locationPulse_2s_ease-in-out_infinite] font-semibold">
                            Checking...
                          </span>
                        </div>
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
        {/* Package Route Card with Map */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Package Route</h2>
          {senderCoords && receiverCoords ? (
            <div className={styles.mapContainer}>
              <MapComponent
                senderCoords={senderCoords}
                receiverCoords={receiverCoords}
                trackingNumber={trackingNumber}
                currentLocation={shipments.currentLocation || null}
                showOnMap={true}
              />
            </div>
          ) : (
            <div className="bg-gray-100 rounded-lg p-6 text-center">
              <p className="text-gray-600">
                Map data is loading or unavailable.
              </p>
            </div>
          )}
        </div>
        {/* Shipment History Card */}
        {/* <div className={styles.card}>
          <h2 className={styles.cardTitle}>Shipment History</h2>
          <div className="overflow-x-auto">
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.tableHeader}>Time</th>
                  <th className={styles.tableHeader}>Location</th>
                  <th className={styles.tableHeader}>Status</th>
                  <th className={styles.tableHeader}>Updated By</th>
                </tr>
              </thead>
              <tbody>
                <tr className={styles.tableRow}>
                  <td className={styles.tableCell}>
                    {shipments.departureTime}
                  </td>
                  <td className={styles.tableCell}>
                    {shipments.senderAddress}
                  </td>
                  <td className={`${styles.tableCell} uppercase`}>
                    {shipments.status}
                  </td>
                  <td className={`${styles.tableCell} font-bold`}>admin</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div> */}
      </div>
      <Footer />
    </>
  );
}

// Main Page Component with Suspense
function Page() {
  return (
    <Suspense
      fallback={
        <div className="h-screen w-full flex justify-center items-center bg-white">
          <div className="flex flex-col items-center space-y-4">
            <div className="flex space-x-2">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-3 h-3 bg-primary-950 rounded-full animate-bounce"
                  style={{
                    animationDelay: `${i * 150}ms`,
                    animationDuration: "1s",
                    animationIterationCount: "infinite",
                  }}
                />
              ))}
            </div>
            <p className="text-gray-600 font-medium">
              Loading tracking details...
            </p>
          </div>
        </div>
      }
    >
      <PageContent />
    </Suspense>
  );
}

export default Page;
