import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const LeafletMap = ({ latitude, longitude }) => {
    // Define the position using the passed latitude and longitude props
    const position = [latitude, longitude];

    return (
        // Center the map container in the parent element
        <div style={{ display: "flex", justifyContent: "center" }}>
            {/* Initialize the map with a center position and zoom level */}
            <MapContainer center={position} zoom={13} style={{ height: "460px", width: "80%" }}>
                {/* Add a tile layer to the map using OpenStreetMap tiles */}
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                {/* Add a marker to the map at the specified position */}
                <Marker position={position}>
                    {/* Display a popup when the marker is clicked */}
                    <Popup>
                        Latitude: {latitude}, Longitude: {longitude}
                    </Popup>
                </Marker>
            </MapContainer>
        </div>
    );
};

export default LeafletMap;

