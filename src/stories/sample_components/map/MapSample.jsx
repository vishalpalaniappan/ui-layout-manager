import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import "./MapSample.scss";

const MapSample = () => {
    const mapRef = useRef(null);
    const containerRef = useRef(null);

    useEffect(() => {
        if (!mapRef.current) {
            const map = L.map(containerRef.current).setView(
                [43.65, -79.38],
                12
            );

            L.tileLayer(
                "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png",
                { keepBuffer: 2 } // improves resize behavior
            ).addTo(map);

            mapRef.current = map;

            const observer = new ResizeObserver(() => {
                map.invalidateSize();
                map.setView(map.getCenter());
            });

            observer.observe(containerRef.current);

            return () => {
                observer.disconnect();
                map.remove();
                mapRef.current = null;
            };
        }
    }, []);

    return <div ref={containerRef} style={{ backgroundColor:"#00000", height: "100%", width: "100%" }} />;
};

export default MapSample;