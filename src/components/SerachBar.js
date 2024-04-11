import React, { useRef, useState } from "react";
import { LoadScript, StandaloneSearchBox } from "@react-google-maps/api";

const libraries = ["places"];
const SearchBar = () => {
  const inputRef = useRef(null);
  const [distance, setDistance] = useState(30);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [nearByGolfCourses, setNearByGolfCourses] = useState([]);

  const handleSliderChange = (event) => {
    setDistance(parseInt(event.target.value));
  };

  const handlePlaceSelect = async () => {
    const place = inputRef.current.getPlaces()[0];
    setCurrentLocation(place.formatted_address);
    if (place) {
      const service = new window.google.maps.places.PlacesService(
        document.createElement("div")
      );
      const request = {
        location: place.geometry.location,
        radius: distance * 1609.32,
        type: ["golf_course"],
        keyword: "golf",
      };
      service.nearbySearch(request, (results, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
          console.log(results);
          setNearByGolfCourses(results.map((course) => course.name));
        } else {
          console.error("Nearby search request failed:", status);
        }
      });
    }
  };

  return (
    <div className="App">
      <LoadScript
        googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_KEY}
        libraries={libraries}
      >
        <StandaloneSearchBox
          onLoad={(ref) => (inputRef.current = ref)}
          onPlacesChanged={handlePlaceSelect}
        >
          <input
            type="text"
            placeholder="Enter a location"
            className="form-control"
          />
        </StandaloneSearchBox>
      </LoadScript>
      <label htmlFor="distance">Distance: {distance} miles</label>
      <input
        type="range"
        id="distance"
        name="distance"
        min="5"
        max="50"
        value={distance}
        onChange={handleSliderChange}
      />
      {currentLocation && <h5>current location: {currentLocation}</h5>}

      {nearByGolfCourses.length !== 0 && (
        <div style={{ display: "flex", flexDirection: "column" }}>
          {" "}
          {nearByGolfCourses.map((courseName) => (
            <h5>{courseName}</h5>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
