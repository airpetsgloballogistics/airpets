export const geocodeAddress = async (address) => {
  const controller = new AbortController();
  const signal = controller.signal;

  // Set a timeout for the request
  const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 seconds timeout

  try {
    console.log(`Geocoding address: ${address}`);
    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
        address
      )}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}`,
      { signal }
    );
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(
        `Geocoding request failed: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    console.log("Geocoding response data:", data); // Log the raw response data

    if (data.features && data.features.length > 0) {
      const [lon, lat] = data.features[0].center;
      console.log(`Geocoded coordinates: (${lat}, ${lon})`);
      return [lon, lat]; // Return in order [longitude, latitude]
    } else {
      console.warn(`No geocoding result found for address: ${address}`);
      return null;
    }
  } catch (error) {
    if (error.name === "AbortError") {
      console.error("Geocoding request timed out");
    } else {
      console.error("Geocoding error:", error);
    }
    return null;
  }
};
