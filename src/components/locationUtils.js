// utils/locationUtils.ts

export const generateWaypoints = async (senderCoords, receiverCoords) => {
  try {
    // Get the route using the same Mapbox Directions API call as in the map
    const response = await fetch(
      `https://api.mapbox.com/directions/v5/mapbox/driving/${senderCoords.join(
        ","
      )};${receiverCoords.join(",")}?geometries=geojson&access_token=${
        process.env.NEXT_PUBLIC_MAPBOX_TOKEN
      }`
    );
    const data = await response.json();

    if (!data.routes?.length) return [];

    const route = data.routes[0].geometry.coordinates;
    const totalDistance = data.routes[0].distance; // in meters
    const waypoints = [];

    // Add sender location
    const senderLocationResponse = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${senderCoords[0]},${senderCoords[1]}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}`
    );
    const senderData = await senderLocationResponse.json();
    if (senderData.features?.length) {
      waypoints.push({
        name: senderData.features[0].place_name,
        coordinates: senderCoords,
        type: "origin",
        distance: 0,
      });
    }

    // Calculate number of intermediate points based on route distance
    // One point every ~200km
    const numberOfPoints = Math.min(Math.floor(totalDistance / 200000), 8);
    const interval = Math.floor(route.length / (numberOfPoints + 1));

    // Add intermediate waypoints
    for (let i = interval; i < route.length - interval; i += interval) {
      const coords = route[i];

      // Reverse geocode to get location name
      const locationResponse = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${coords[0]},${coords[1]}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}`
      );
      const locationData = await locationResponse.json();

      if (locationData.features?.length) {
        const feature = locationData.features[0];
        const distanceFromStart = calculateDistance(senderCoords, coords);

        // Determine type based on position in route and features
        let type;
        const progress = i / route.length;
        if (progress < 0.3) type = "checkpoint";
        else if (progress < 0.5) type = "customs";
        else if (progress < 0.7) type = "hub";
        else type = "city";

        waypoints.push({
          name: feature.place_name,
          coordinates: coords,
          type,
          distance: distanceFromStart,
          place_type: feature.place_type?.[0] || "point",
        });
      }
    }

    // Add receiver location
    const receiverLocationResponse = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${receiverCoords[0]},${receiverCoords[1]}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}`
    );
    const receiverData = await receiverLocationResponse.json();
    if (receiverData.features?.length) {
      waypoints.push({
        name: receiverData.features[0].place_name,
        coordinates: receiverCoords,
        type: "destination",
        distance: totalDistance,
      });
    }

    return waypoints;
  } catch (error) {
    console.error("Error generating waypoints:", error);
    return [];
  }
};

// Helper function to calculate distance between two points
const calculateDistance = (point1, point2) => {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = (point1[1] * Math.PI) / 180;
  const φ2 = (point2[1] * Math.PI) / 180;
  const Δφ = ((point2[1] - point1[1]) * Math.PI) / 180;
  const Δλ = ((point2[0] - point1[0]) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // distance in meters
};
