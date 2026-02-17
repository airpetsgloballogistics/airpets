import { useEffect, useState, useRef } from "react";
import MapComponent from "./MapComponent";
import { MapPin } from "lucide-react";

export const CurrentLocationInput = ({
  waypoints,
  onLocationSelect,
  currentLocation,
  trackingEvents,
  onRemoveEvent,
  showOnMap,
  setShowOnMap,
  trackingNumber,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showPreviewMap, setShowPreviewMap] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isCustomLocation, setIsCustomLocation] = useState(false);
  const [error, setError] = useState("");

  const [currentLocationValue, setCurrentLocationValue] = useState(
    currentLocation || ""
  );
  const [isInitialized, setIsInitialized] = useState(false);
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  // Add click outside handler
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        !inputRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Helper function to get status based on location type
  const determineStatus = (locationType) => {
    switch (locationType) {
      case "customs":
        return "In Customs Clearance";
      case "hub":
        return "At Logistics Hub";
      case "checkpoint":
        return "Security Checkpoint";
      case "city":
        return "In Transit";
      case "origin":
        return "Package Collected";
      case "destination":
        return "Out for Delivery";
      case "custom":
        return "Package Location Updated";
      default:
        return "Location Updated";
    }
  };

  const generateEventDescription = (location) => {
    switch (location.type) {
      case "customs":
        return `Package is undergoing customs inspection at ${location.name}`;
      case "hub":
        return `Package arrived at logistics hub in ${location.name}`;
      case "checkpoint":
        return `Security check at ${location.name}`;
      case "city":
        return `Package in transit through ${location.name}`;
      case "origin":
        return `Package collected from ${location.name}`;
      case "destination":
        return `Package out for delivery to ${location.name}`;
      case "custom":
        return `Package location updated to ${location.name}`;
      default:
        return `Package location updated to ${location.name}`;
    }
  };

  // Group waypoints by type
  const groupedWaypoints = waypoints.reduce((acc, waypoint) => {
    if (!acc[waypoint.type]) {
      acc[waypoint.type] = [];
    }
    acc[waypoint.type].push(waypoint);
    return acc;
  }, {});

  const typeOrder = [
    "origin",
    "checkpoint",
    "customs",
    "hub",
    "city",
    "destination",
  ];

  const typeLabels = {
    origin: "Origin Point",
    checkpoint: "Security Checkpoints",
    customs: "Customs Locations",
    hub: "Distribution Hubs",
    city: "Transit Points",
    destination: "Destination",
  };

  // Filter waypoints based on search term
  const filteredWaypoints = searchTerm.trim()
    ? waypoints.filter(
        (wp) =>
          wp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          wp.type.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  const handleCustomLocation = () => {
    if (searchTerm.trim()) {
      setError("");
      const customWaypoint = {
        name: searchTerm,
        type: "custom",
      };

      const status = determineStatus("custom");
      const description = generateEventDescription(customWaypoint);

      if (!currentLocation || currentLocation !== searchTerm) {
        onLocationSelect({
          location: searchTerm,
          timestamp: new Date().toISOString(),
          status: status,
          description: description,
          type: "custom",
          showOnMap: showOnMap,
        });
      }
      setSearchTerm("");
      setIsOpen(false);
      setIsCustomLocation(false);
    }
  };

  const [currentEvent, setCurrentEvent] = useState(null);

  useEffect(() => {
    if (currentLocation && trackingEvents) {
      const event = trackingEvents.find((e) => e.location === currentLocation);
      if (event) {
        setCurrentEvent(event);
        setShowOnMap(event.showOnMap);
      }
    }
  }, [currentLocation, trackingEvents]);

  const handleLocationSelect = (waypoint) => {
    if (waypoint) {
      setError("");
      const status = determineStatus(waypoint.type);
      const description = generateEventDescription(waypoint);

      if (!currentLocation || currentLocation !== waypoint.name) {
        const eventId = `${waypoint.name}-${new Date().getTime()}`;
        onLocationSelect({
          id: eventId,
          location: waypoint.name,
          timestamp: new Date().toISOString(),
          status: status,
          description: description,
          type: waypoint.type,
          showOnMap: showOnMap,
          coordinates: waypoint.coordinates,
        });
      }
    }
    setSearchTerm("");
    setIsOpen(false);
    setIsCustomLocation(false);
  };

  useEffect(() => {
    setCurrentLocationValue(currentLocation || "");
  }, [currentLocation]);

  const handleShowOnMapToggle = (e) => {
    const checked = e.target.checked;
    setShowOnMap(checked);

    if (currentLocation && trackingEvents) {
      const currentEvent = trackingEvents.find(
        (event) => event.location === currentLocation
      );
      if (currentEvent) {
        onLocationSelect({
          ...currentEvent,
          showOnMap: checked,
        });
      }
    }
  };
  const clearLocation = () => {
    try {
      if (!currentLocationValue) {
        setError("No location to clear");
        return;
      }
      setError("");
      onLocationSelect({
        location: "",
        timestamp: new Date().toISOString(),
        status: "Location Cleared",
        description: "Location has been cleared",
        type: "custom",
        showOnMap: false,
      });
      setCurrentLocationValue("");
      setSearchTerm("");
      setIsCustomLocation(false);
      setCurrentEvent(null);
    } catch (err) {
      setError("Error clearing location");
      console.error("Error in clearLocation:", err);
    }
  };

  const renderWaypointButton = (waypoint, index) => {
    const status = determineStatus(waypoint.type);
    const isCurrentLocation = currentLocation === waypoint.name;

    return (
      <button
        key={index}
        onClick={() => handleLocationSelect(waypoint)}
        className={`w-full text-left px-3 py-2 hover:bg-gray-100 rounded-md ${
          isCurrentLocation ? "bg-primary-50" : ""
        }`}
      >
        <div className="font-medium">{waypoint.name}</div>
        <div className="text-sm text-gray-500">
          {status} - {waypoint.name}
        </div>
      </button>
    );
  };

  return (
    <div className="relative space-y-2">
      {!isCustomLocation && (
        <button
          onClick={() => {
            setIsCustomLocation(true);
            setIsOpen(false);
            setError("");
          }}
          className="text-sm text-primary-500 hover:text-primary-950"
        >
          + Add custom location
        </button>
      )}

      <div className="flex gap-2">
        <div className="relative flex-1">
          <input
            ref={inputRef}
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setIsOpen(true);
              setError("");
            }}
            onFocus={() => setIsOpen(true)}
            placeholder={
              isCustomLocation
                ? "Enter custom location..."
                : "Search or enter custom location..."
            }
            className={`w-full px-3 py-2 border ${
              error ? "border-accent-500" : "border-gray-300"
            } rounded-md focus:ring-primary-500 focus:border-primary-500`}
          />
          {currentLocation && (
            <button
              onClick={clearLocation}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          )}
          {isOpen && !isCustomLocation && (
            <div
              ref={dropdownRef}
              className="absolute z-10 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-96 overflow-y-auto top-full mt-1"
            >
              {searchTerm.trim() ? (
                <div className="p-2">
                  {filteredWaypoints.length > 0 ? (
                    filteredWaypoints.map((waypoint, index) =>
                      renderWaypointButton(waypoint, index)
                    )
                  ) : (
                    <div className="text-center py-4 text-gray-500">
                      No locations found
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-2 space-y-4">
                  {typeOrder.map((type) => {
                    const waypointsOfType = groupedWaypoints[type];
                    if (!waypointsOfType?.length) return null;

                    return (
                      <div key={type} className=" space-y-2">
                        <div className="text-sm font-semibold text-gray-700 px-3">
                          {typeLabels[type]}
                        </div>
                        {waypointsOfType.map((waypoint, index) =>
                          renderWaypointButton(waypoint, index)
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
        {isCustomLocation && (
          <button
            onClick={handleCustomLocation}
            disabled={!searchTerm.trim()}
            className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-950 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Add
          </button>
        )}
      </div>

      {error && (
        <div className="text-accent-500 text-sm mt-1 animate-fade-in">{error}</div>
      )}

      <div className="flex justify-between items-center space-x-2">
        <label className="flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={showOnMap}
            onChange={handleShowOnMapToggle}
            className="rounded border-gray-300 text-primary-950 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
          />
          <span className="ml-2 text-sm text-gray-600">Show on map</span>
        </label>
      </div>

      {/* {trackingEvents && trackingEvents.length > 0 && (
        <div className="mt-4 space-y-2">
          <h3 className="font-medium">Tracking Events</h3>
          <div className="space-y-2">
            {trackingEvents.map((event, index) => (
              <div
                key={index}
                className={`p-3 rounded-md ${
                  event.type === "customs"
                    ? "bg-yellow-50"
                    : event.type === "checkpoint"
                    ? "bg-primary-50"
                    : "bg-gray-50"
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-medium">{event.status}</div>
                    <div className="text-sm text-gray-600">
                      {event.description}
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(event.timestamp).toLocaleString()}
                    </div>
                  </div>
                  <button
                    onClick={() => onRemoveEvent && onRemoveEvent(index)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ×
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )} */}

      {currentLocationValue && (
        <>
          <h2>Location Preview</h2>
          <div className="mt-2 p-3 bg-primary-50 rounded-md">
            <p className="text-sm text-primary-950">
              Current Location: {currentLocationValue}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {new Date().toLocaleString()}
            </p>
          </div>

          {/* Add Preview Map Button */}
          <button
            onClick={() => setShowPreviewMap(!showPreviewMap)}
            className="mt-2 w-full px-4 py-2 text-sm text-primary-950 hover:text-primary-950 border border-primary-200 rounded-md hover:bg-primary-50 transition-colors flex items-center justify-center gap-2"
          >
            <MapPin size={16} />
            {showPreviewMap ? "Hide Map Preview" : "Show Map Preview"}
          </button>

          {/* Map Preview Section */}
          {showPreviewMap && currentLocationValue && (
            <div className="mt-4">
              <MapComponent
                senderCoords={
                  waypoints.find((wp) => wp.type === "origin")?.coordinates
                }
                receiverCoords={
                  waypoints.find((wp) => wp.type === "destination")?.coordinates
                }
                trackingNumber={trackingNumber}
                currentLocation={currentLocationValue}
                showOnMap={showOnMap}
              />
            </div>
          )}

          {/* Clear Location Button */}
          <button
            onClick={clearLocation}
            className="mt-2 w-full px-4 py-2 text-sm text-accent-600 hover:text-accent-700 border border-accent-200 rounded-md hover:bg-accent-50 transition-colors"
          >
            Clear Location
          </button>
        </>
      )}
    </div>
  );
};
