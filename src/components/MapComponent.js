import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import ShipmentContext from "@/contexts/ShipmentContext";
import { MapPin } from "lucide-react";
import { useContext, useEffect, useRef, useState } from "react";

mapboxgl.accessToken =
  process.env.NEXT_PUBLIC_MAPBOX_TOKEN

class MapStyleControl {
  constructor(toggleCallback) {
    this._toggleCallback = toggleCallback;
    this._isStyleChanging = false; // Flag to track style change in progress
    this._currentStyle = "streets"; // Default style
  }

  onAdd(map) {
    this._map = map;
    this._container = document.createElement("div");
    this._container.className = "mapboxgl-ctrl mapboxgl-ctrl-group";

    // Satellite button
    const satelliteButton = document.createElement("button");
    satelliteButton.type = "button";
    satelliteButton.id = "satellite-button";
    satelliteButton.className = "mapboxgl-ctrl-icon satellite-button";
    satelliteButton.style.width = "auto";
    satelliteButton.style.height = "30px";
    satelliteButton.style.display = "flex";
    satelliteButton.style.alignItems = "center";
    satelliteButton.style.justifyContent = "center";
    satelliteButton.style.backgroundColor = "white";
    satelliteButton.style.border = "none";
    satelliteButton.style.cursor = "pointer";
    satelliteButton.style.padding = "0 10px";
    satelliteButton.title = "Satellite View";

    satelliteButton.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 5px;">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
        <line x1="3" y1="9" x2="21" y2="9"></line>
        <line x1="3" y1="15" x2="21" y2="15"></line>
      </svg>
      <span style="font-size: 12px;">Satellite</span>
    `;

    satelliteButton.addEventListener("click", () => {
      // Don't do anything if we're already in satellite view or changing styles
      if (this._currentStyle === "satellite" || this._isStyleChanging) return;

      this._isStyleChanging = true;

      // Disable satellite button, enable map button
      satelliteButton.style.backgroundColor = "#e5e7eb"; // Gray background to show selected
      satelliteButton.style.cursor = "default";
      satelliteButton.style.opacity = "0.7";
      mapButton.style.backgroundColor = "white";
      mapButton.style.cursor = "pointer";
      mapButton.style.opacity = "1";

      this._toggleCallback("satellite");
      this._currentStyle = "satellite";

      // Re-enable interaction after style change completes
      this._map.once("style.load", () => {
        setTimeout(() => {
          this._isStyleChanging = false;
        }, 500); // Add a small delay to ensure everything is loaded
      });
    });

    // Map button
    const mapButton = document.createElement("button");
    mapButton.type = "button";
    mapButton.id = "map-button";
    mapButton.className = "mapboxgl-ctrl-icon map-button";
    mapButton.style.width = "auto";
    mapButton.style.height = "30px";
    mapButton.style.display = "flex";
    mapButton.style.alignItems = "center";
    mapButton.style.justifyContent = "center";
    mapButton.style.backgroundColor = "#e5e7eb"; // Start with streets selected
    mapButton.style.border = "none";
    mapButton.style.cursor = "default"; // Default cursor for selected button
    mapButton.style.opacity = "0.7"; // Slightly dimmed for selected button
    mapButton.style.padding = "0 10px";
    mapButton.style.marginTop = "5px";
    mapButton.title = "Street Map View";

    mapButton.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 5px;">
        <path d="M3 6l6-3 6 3 6-3v15l-6 3-6-3-6 3V6z"></path>
        <path d="M9 3v15"></path>
        <path d="M15 6v15"></path>
      </svg>
      <span style="font-size: 12px;">Map</span>
    `;

    mapButton.addEventListener("click", () => {
      // Don't do anything if we're already in streets view or changing styles
      if (this._currentStyle === "streets" || this._isStyleChanging) return;

      this._isStyleChanging = true;

      // Disable map button, enable satellite button
      mapButton.style.backgroundColor = "#e5e7eb"; // Gray background to show selected
      mapButton.style.cursor = "default";
      mapButton.style.opacity = "0.7";
      satelliteButton.style.backgroundColor = "white";
      satelliteButton.style.cursor = "pointer";
      satelliteButton.style.opacity = "1";

      this._toggleCallback("streets");
      this._currentStyle = "streets";

      // Re-enable interaction after style change completes
      this._map.once("style.load", () => {
        setTimeout(() => {
          this._isStyleChanging = false;
        }, 500); // Add a small delay to ensure everything is loaded
      });
    });

    this._container.appendChild(satelliteButton);
    this._container.appendChild(mapButton);

    // Store references to buttons for later use
    this._satelliteButton = satelliteButton;
    this._mapButton = mapButton;

    return this._container;
  }

  onRemove() {
    this._container.parentNode.removeChild(this._container);
    this._map = undefined;
  }
}

const MapComponent = ({
  senderCoords,
  receiverCoords,
  trackingNumber,
  currentLocation,
  showOnMap = true,
}) => {
  const mapRef = useRef(null);
  const currentMarkerRef = useRef(null);
  const styleControlRef = useRef(null);
  const routeDataRef = useRef(null);
  const { shipmentStatus } = useContext(ShipmentContext);
  const [error, setError] = useState(null);
  const [mapStyle, setMapStyle] = useState("streets");

  const createCustomMarker = (type) => {
    const element = document.createElement("div");
    element.className = "custom-marker";
    element.style.width = "30px";
    element.style.height = "30px";
    element.style.borderRadius = "50%";
    element.style.display = "flex";
    element.style.alignItems = "center";
    element.style.justifyContent = "center";

    if (type === "sender") {
      element.style.backgroundColor = "#000000";
    } else if (type === "receiver") {
      element.style.backgroundColor = "#ED7F35";
    } else if (type === "current") {
      element.style.backgroundColor = "#10b981";
    }

    element.style.color = "white";
    element.style.boxShadow = "0 2px 4px rgba(0,0,0,0.2)";

    const icon = document.createElement("span");
    icon.innerHTML =
      type === "current"
        ? '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/></svg>'
        : type === "sender"
        ? '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path></svg>'
        : '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path><circle cx="12" cy="10" r="3"></circle></svg>';
    element.appendChild(icon);
    return element;
  };

  const changeMapStyle = (style) => {
    if (mapRef.current) {
      const newStyleUrl =
        style === "satellite"
          ? "mapbox://styles/mapbox/satellite-v9"
          : "mapbox://styles/mapbox/streets-v12";

      // Save the current route data before changing style
      if (mapRef.current.getSource("route")) {
        try {
          const routeSource = mapRef.current.getSource("route");
          if (routeSource._data) {
            routeDataRef.current = routeSource._data;
          }
        } catch (err) {
          console.error("Error saving route data:", err);
        }
      }

      // Save camera position
      const center = mapRef.current.getCenter();
      const zoom = mapRef.current.getZoom();
      const bearing = mapRef.current.getBearing();
      const pitch = mapRef.current.getPitch();

      // Change the map style
      mapRef.current.setStyle(newStyleUrl);

      // After style is loaded, re-add the route and 3D buildings
      mapRef.current.once("style.load", () => {
        // Restore camera position
        mapRef.current.setCenter(center);
        mapRef.current.setZoom(zoom);
        mapRef.current.setBearing(bearing);
        mapRef.current.setPitch(pitch);

        // Re-add terrain
        try {
          mapRef.current.addSource("mapbox-dem", {
            type: "raster-dem",
            url: "mapbox://mapbox.mapbox-terrain-dem-v1",
            tileSize: 512,
            maxzoom: 14,
          });

          mapRef.current.setTerrain({
            source: "mapbox-dem",
            exaggeration: 1.5,
          });
        } catch (err) {
          console.error("Error adding terrain:", err);
        }

        // Re-add the route if we had it before
        if (routeDataRef.current) {
          try {
            if (!mapRef.current.getSource("route")) {
              mapRef.current.addSource("route", {
                type: "geojson",
                data: routeDataRef.current,
              });

              mapRef.current.addLayer({
                id: "route",
                type: "line",
                source: "route",
                layout: {
                  "line-join": "round",
                  "line-cap": "round",
                },
                paint: {
                  "line-color": "#000000",
                  "line-width": 4,
                  "line-opacity": 0.8,
                },
              });
            }
          } catch (err) {
            console.error("Error re-adding route:", err);
          }
        }

        // Add 3D buildings if in streets mode
        if (style === "streets") {
          try {
            mapRef.current.addLayer({
              id: "3d-buildings",
              source: "composite",
              "source-layer": "building",
              filter: ["==", "extrude", "true"],
              type: "fill-extrusion",
              minzoom: 15,
              paint: {
                "fill-extrusion-color": "#aaa",
                "fill-extrusion-height": [
                  "interpolate",
                  ["linear"],
                  ["zoom"],
                  15,
                  0,
                  15.05,
                  ["get", "height"],
                ],
                "fill-extrusion-base": [
                  "interpolate",
                  ["linear"],
                  ["zoom"],
                  15,
                  0,
                  15.05,
                  ["get", "min_height"],
                ],
                "fill-extrusion-opacity": 0.6,
              },
            });
          } catch (err) {
            console.error("Error adding 3D buildings:", err);
          }
        }
      });

      setMapStyle(style);
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined" && senderCoords && receiverCoords) {
      try {
        if (!mapRef.current) {
          const bounds = new mapboxgl.LngLatBounds()
            .extend(senderCoords)
            .extend(receiverCoords);

          mapRef.current = new mapboxgl.Map({
            container: "map",
            style: "mapbox://styles/mapbox/streets-v12",
            bounds: bounds,
            padding: 50,
            pitch: 45, // Add default pitch for 3D view
            antialias: true, // Enable antialiasing for smoother rendering
          });

          // Enable 3D terrain
          mapRef.current.on("style.load", () => {
            mapRef.current.addSource("mapbox-dem", {
              type: "raster-dem",
              url: "mapbox://mapbox.mapbox-terrain-dem-v1",
              tileSize: 512,
              maxzoom: 14,
            });

            // Add terrain
            mapRef.current.setTerrain({
              source: "mapbox-dem",
              exaggeration: 1.5,
            });
          });

          // Add controls
          mapRef.current.addControl(
            new mapboxgl.NavigationControl({
              visualizePitch: true, // Enable pitch control in navigation
            }),
            "top-right"
          );

          // Add rotation control
          mapRef.current.addControl(
            new mapboxgl.NavigationControl({
              showCompass: true,
              showZoom: false,
            }),
            "top-right"
          );

          mapRef.current.addControl(
            new mapboxgl.FullscreenControl(),
            "top-right"
          );

          // Add custom style toggle control
          styleControlRef.current = new MapStyleControl(changeMapStyle);
          mapRef.current.addControl(styleControlRef.current, "top-right");

          // Add sender and receiver markers
          new mapboxgl.Marker({ element: createCustomMarker("sender") })
            .setLngLat(senderCoords)
            .setPopup(
              new mapboxgl.Popup({ offset: 25 }).setHTML(`
                <div class="p-2">
                  <h4 class="font-bold text-lg mb-2">Sender Location</h4>
                  <p class="text-sm text-gray-600">Tracking: ${trackingNumber}</p>
                  <p class="text-sm text-gray-600">Status: ${shipmentStatus}</p>
                </div>
              `)
            )
            .addTo(mapRef.current);

          new mapboxgl.Marker({ element: createCustomMarker("receiver") })
            .setLngLat(receiverCoords)
            .setPopup(
              new mapboxgl.Popup({ offset: 25 }).setHTML(`
                <div class="p-2">
                  <h4 class="font-bold text-lg mb-2">Delivery Location</h4>
                  <p class="text-sm text-gray-600">Final Destination</p>
                </div>
              `)
            )
            .addTo(mapRef.current);

          // Fetch and add route
          fetch(
            `https://api.mapbox.com/directions/v5/mapbox/driving/${senderCoords.join(
              ","
            )};${receiverCoords.join(",")}?geometries=geojson&access_token=${
              mapboxgl.accessToken
            }`
          )
            .then((response) => response.json())
            .then((data) => {
              if (data.routes && data.routes.length > 0) {
                const routeCoordinates = data.routes[0].geometry.coordinates;
                const routeData = {
                  type: "Feature",
                  properties: {},
                  geometry: {
                    type: "LineString",
                    coordinates: routeCoordinates,
                  },
                };

                // Store route data for style changes
                routeDataRef.current = routeData;

                mapRef.current.addSource("route", {
                  type: "geojson",
                  data: routeData,
                });

                mapRef.current.addLayer({
                  id: "route",
                  type: "line",
                  source: "route",
                  layout: {
                    "line-join": "round",
                    "line-cap": "round",
                  },
                  paint: {
                    "line-color": "#000000",
                    "line-width": 4,
                    "line-opacity": 0.8,
                  },
                });
              }
            })
            .catch((error) => {
              setError("Failed to load route information");
              console.error("Error fetching route:", error);
            });
        }

        // Handle current location marker
        if (currentMarkerRef.current) {
          currentMarkerRef.current.remove();
          currentMarkerRef.current = null;
        }

        if (currentLocation && showOnMap) {
          fetch(
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
              currentLocation
            )}.json?access_token=${mapboxgl.accessToken}`
          )
            .then((response) => response.json())
            .then((data) => {
              if (data.features && data.features.length > 0) {
                const [lng, lat] = data.features[0].center;

                currentMarkerRef.current = new mapboxgl.Marker({
                  element: createCustomMarker("current"),
                })
                  .setLngLat([lng, lat])
                  .setPopup(
                    new mapboxgl.Popup({ offset: 25 }).setHTML(`
                      <div class="p-2">
                        <h4 class="font-bold text-lg mb-2">Current Location</h4>
                        <p class="text-sm text-gray-600">${currentLocation}</p>
                      </div>
                    `)
                  )
                  .addTo(mapRef.current);

                const bounds = new mapboxgl.LngLatBounds()
                  .extend(senderCoords)
                  .extend(receiverCoords)
                  .extend([lng, lat]);

                mapRef.current.fitBounds(bounds, { padding: 50 });
              }
            })
            .catch((error) => {
              console.error("Error geocoding current location:", error);
            });
        }
      } catch (error) {
        setError("Failed to initialize map");
        console.error("Map initialization error:", error);
      }
    }
  }, [
    senderCoords,
    receiverCoords,
    shipmentStatus,
    trackingNumber,
    currentLocation,
    showOnMap,
  ]);

  return (
    <div className="relative">
      <div id="map" className="h-[500px] w-full rounded-lg shadow-lg" />
      {error && (
        <div className="absolute top-4 left-4 bg-accent-100 border border-accent-400 text-accent-700 px-4 py-2 rounded">
          {error}
        </div>
      )}
    </div>
  );
};

export default MapComponent;
