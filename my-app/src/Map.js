import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import pinIconUrl from './path/to/pin-icon.png';

const customIcon = new L.Icon({
    iconUrl: pinIconUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34]
});

const Map = ({ shops, center, onShopSelect }) => {
    const [mapCenter, setMapCenter] = useState(center);
    const [mapKey, setMapKey] = useState(Date.now());

    useEffect(() => {
        // Fetch user's current location only once when the component mounts
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setMapCenter([position.coords.latitude, position.coords.longitude]);
                setMapKey(Date.now());
            },
            (error) => {
                console.error('位置情報の取得に失敗しました。', error);
            },
            { timeout: 10000 }
        );
    }, []);

    useEffect(() => {
        // Update map center when the selected shop's location changes
        if (center !== mapCenter) {
            setMapCenter(center);
            setMapKey(Date.now());
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [center]);
    

    return (
        <MapContainer key={mapKey} center={mapCenter} zoom={16} style={{ height: '400px', width: '100%' }}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {shops.map(shop => (
                shop.lat && shop.lng &&
                <Marker
                    key={shop.id}
                    position={[Number(shop.lat), Number(shop.lng)]}
                    icon={customIcon}
                    eventHandlers={{
                        click: () => {
                            onShopSelect(shop.id);
                        },
                    }}
                >
                    <Popup>{shop.name}</Popup>
                </Marker>
            ))}
        </MapContainer>
    );
};

export default Map;