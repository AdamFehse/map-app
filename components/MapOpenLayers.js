import React, { useEffect, useRef } from "react";
import "ol/ol.css";
import { Map, View } from "ol";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import { fromLonLat } from "ol/proj";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { Feature } from "ol";
import { Point } from "ol/geom";
import { Style, Icon, Circle, Fill, Stroke } from "ol/style";

export default function MapOpenLayers({ projects, onMarkerClick, onMapReady }) {
  const mapRef = useRef();

  useEffect(() => {
    const vectorSource = new VectorSource();

    // Create markers for projects
    projects.forEach((project) => {
      const [lon, lat] = [
        parseFloat(project.Longitude),
        parseFloat(project.Latitude),
      ];

      const marker = new Feature({
        geometry: new Point(fromLonLat([lon, lat])),
        project, // Store project data for interaction
      });

      marker.setStyle(
        new Style({
          image: new Circle({
            radius: 3,
            fill: new Fill({ color: "red" }),
          }),
        })
      );

      vectorSource.addFeature(marker);
    });

    const vectorLayer = new VectorLayer({
      source: vectorSource,
    });

    // Define bounds for the Fronteridades border region (Arizona-Sonora border)
    const fronteridadesBounds = [
      fromLonLat([-113.5, 29.0]), // Southwest corner (south of Puerto Peñasco, MX)
      fromLonLat([-108.5, 33.5]), // Northeast corner (north of Flagstaff, AZ)
    ];

    // Initialize the map
    const map = new Map({
      target: mapRef.current,
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
        vectorLayer,
      ],
      view: new View({
        center: fromLonLat([-110.990274, 31.916004]), // Center at Tucson, AZ
        zoom: 9,
        extent: fronteridadesBounds.flat(), // Set the extent to restrict panning
        constrainOnlyCenter: false, // Constrain the entire view, not just the center
      }),
    });

    // Handle marker click
    map.on("singleclick", (evt) => {
      map.forEachFeatureAtPixel(evt.pixel, (feature) => {
        const project = feature.get("project");
        if (project) {
          onMarkerClick(project); // Pass clicked project to the handler
        }
      });
    });

    // Expose the map instance to the parent
    onMapReady(map);

    return () => map.setTarget(null); // Cleanup
  }, [projects, onMarkerClick, onMapReady]);

  return <div ref={mapRef} style={{ width: "100%", height: "100vh" }} />;
}
