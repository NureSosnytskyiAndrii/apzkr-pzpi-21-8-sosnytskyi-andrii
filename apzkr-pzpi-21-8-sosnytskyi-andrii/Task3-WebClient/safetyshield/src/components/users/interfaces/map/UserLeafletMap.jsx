import React from 'react';
import {MapContainer, TileLayer, Marker, Popup} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const UserLeafletMap = ({latitude, longitude}) => {
    const position = [latitude, longitude];

    return (
        <div style={{display: "flex", justifyContent: "center"}}>
            <MapContainer center={position} zoom={13} style={{height: "460px", width: "80%"}}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <Marker position={position}>
                    <Popup>
                        Latitude: {latitude}, Longitude: {longitude}
                    </Popup>
                </Marker>
            </MapContainer>
        </div>
    );
};

export default UserLeafletMap;
