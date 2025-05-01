'use client'
import React from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '400px'
};

const center = {
  lat: 37.334665328,
  lng: -121.875329832
};

const GoogleMapComponent = () => {
  const apiKey = 'AIzaSyB82B8yxjm4ed0LfPqtUE-iYZIIapvfkFw';  //have fun hijacking my google api key or whatever for some reason billing is broken lol
  if (!apiKey) {
    return <p>Google Maps API key is missing</p>;
  }
  
  return (
    <LoadScript googleMapsApiKey={apiKey}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={10}
      >
        <Marker position={center} />
      </GoogleMap>
    </LoadScript>
  );
};

export default GoogleMapComponent;
