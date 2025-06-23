import React, { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import * as d3 from 'd3';

export default function ProjectPathsD3Layer() {
  const map = useMap();

  useEffect(() => {
    const fetchDataAndRender = async () => {
      // Fetch the project data
      const response = await fetch('https://raw.githubusercontent.com/AdamFehse/map-app/gh-pages/storymapdata_db_ready.json');
      const data = await response.json();

      // Parse and sort the coordinates (customize sorting as needed)
      const coordinates = data
        .map((project) => [parseFloat(project.Latitude), parseFloat(project.Longitude)])
        .filter(([lat, lng]) => !isNaN(lat) && !isNaN(lng));

      // Get the map's overlayPane for rendering with D3
      const overlay = d3.select(map.getPanes().overlayPane);

      // Create an SVG element in the overlayPane
      const svg = overlay
        .append('svg')
        .attr('class', 'd3-path-overlay')
        .style('pointer-events', 'none'); // Let Leaflet handle pointer events

      const group = svg.append('g').attr('class', 'd3-path-group');

      const projectPoint = ([lat, lng]) => {
        const point = map.latLngToLayerPoint([lat, lng]);
        return [point.x, point.y];
      };

      const renderPath = () => {
        const bounds = map.getBounds();
        const topLeft = map.latLngToLayerPoint(bounds.getNorthWest());
        const bottomRight = map.latLngToLayerPoint(bounds.getSouthEast());

        svg
          .attr('width', bottomRight.x - topLeft.x)
          .attr('height', bottomRight.y - topLeft.y)
          .style('left', `${topLeft.x}px`)
          .style('top', `${topLeft.y}px`);

        group.attr('transform', `translate(${-topLeft.x},${-topLeft.y})`);

        // Project all points
        const projectedPoints = coordinates.map(projectPoint);

        // Create a smooth line generator
        const lineGenerator = d3.line()
          .x(d => d[0])
          .y(d => d[1])
          .curve(d3.curveBasis); // Smooth curve

        // Bind data and render the path
        let path = group.selectAll('path.project-path').data([projectedPoints]);

        path.enter()
          .append('path')
          .attr('class', 'project-path')
          .merge(path)
          .attr('d', lineGenerator)
          .attr('fill', 'none')
          .attr('stroke', '#ff00cc') // Bright color
          .attr('stroke-width', 6)
          .attr('stroke-linecap', 'round')
          .attr('stroke-linejoin', 'round')
          .style('filter', 'drop-shadow(0 0 12px #ff00cc)');

        path.exit().remove();
      };

      map.on('viewreset moveend zoomend', renderPath); // Re-render on map move/zoom
      renderPath(); // Initial render

      return () => {
        svg.remove();
        map.off('viewreset moveend zoomend', renderPath); // Cleanup on unmount
      };
    };

    fetchDataAndRender();
  }, [map]);

  return null;
} 