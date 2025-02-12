import React, { useEffect } from "react";
import { useMap } from "react-leaflet";
import * as d3 from "d3";

export default function D3Layer({ data }) {
  const map = useMap();

  useEffect(() => {
    // Get the map's overlayPane to add an SVG layer
    const overlay = d3.select(map.getPanes().overlayPane);

    // Create an SVG element in the overlayPane
    const svg = overlay
      .append("svg")
      .attr("class", "d3-overlay")
      .style("pointer-events", "none"); // Let Leaflet handle pointer events

    const group = svg.append("g").attr("class", "d3-group");

    const projectPoint = (lat, lng) => {
      const point = map.latLngToLayerPoint([lat, lng]);
      return [point.x, point.y];
    };

    // Render data points
    const render = () => {
      const bounds = map.getBounds();
      const topLeft = map.latLngToLayerPoint(bounds.getNorthWest());
      const bottomRight = map.latLngToLayerPoint(bounds.getSouthEast());

      svg
        .attr("width", bottomRight.x - topLeft.x)
        .attr("height", bottomRight.y - topLeft.y)
        .style("left", `${topLeft.x}px`)
        .style("top", `${topLeft.y}px`);

      group.attr("transform", `translate(${-topLeft.x},${-topLeft.y})`);

      // Bind data and render circles
      const circles = group.selectAll("circle").data(data);

      circles
        .enter()
        .append("circle")
        .merge(circles)
        .attr("r", 5) // Circle radius
        .attr("fill", "red") // Circle color
        .attr("cx", (d) => projectPoint(parseFloat(d.Latitude), parseFloat(d.Longitude))[0])
        .attr("cy", (d) => projectPoint(parseFloat(d.Latitude), parseFloat(d.Longitude))[1]);

      circles.exit().remove();
    };

    map.on("moveend", render); // Re-render on map move/zoom
    render(); // Initial render

    return () => {
      svg.remove();
      map.off("moveend", render); // Cleanup on unmount
    };
  }, [map, data]);

  return null;
}
