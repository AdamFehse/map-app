'use client';

import React, { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import * as d3 from 'd3';

export default function VoronoiD3Layer() {
  const map = useMap();

  useEffect(() => {
    const fetchDataAndRender = async () => {
      // Fetch the project data
      const response = await fetch('/storymapdata.json');
      const data = await response.json();

      // Parse the coordinates from the data
      const coordinates = data.map((project) => ({
        lat: parseFloat(project.Latitude),
        lng: parseFloat(project.Longitude),
      }));

      // Get the map's overlayPane for rendering with D3
      const overlay = d3.select(map.getPanes().overlayPane);

      // Create an SVG element in the overlayPane
      const svg = overlay
        .append('svg')
        .attr('class', 'd3-overlay')
        .style('pointer-events', 'none'); // Let Leaflet handle pointer events

      const group = svg.append('g').attr('class', 'd3-group');

      const projectPoint = ([lat, lng]) => {
        const point = map.latLngToLayerPoint([lat, lng]);
        return [point.x, point.y];
      };

      const renderVoronoi = () => {
        const bounds = map.getBounds();
        const topLeft = map.latLngToLayerPoint(bounds.getNorthWest());
        const bottomRight = map.latLngToLayerPoint(bounds.getSouthEast());

        svg
          .attr('width', bottomRight.x - topLeft.x)
          .attr('height', bottomRight.y - topLeft.y)
          .style('left', `${topLeft.x}px`)
          .style('top', `${topLeft.y}px`);

        group.attr('transform', `translate(${-topLeft.x},${-topLeft.y})`);

        // Filter points within a padded map bounds
        const drawLimit = bounds.pad(0.4); // Slightly extend the bounding box
        const visiblePoints = coordinates
          .filter(({ lat, lng }) => drawLimit.contains([lat, lng]))
          .map(({ lat, lng }) => ({
            original: [lat, lng],
            projected: projectPoint([lat, lng]),
          }));

        // Extract projected points for Voronoi
        const projectedPoints = visiblePoints.map((d) => d.projected);

        // Generate Delaunay triangulation and Voronoi diagram
        const delaunay = d3.Delaunay.from(projectedPoints);
        const voronoi = delaunay.voronoi([
          0,
          0,
          bottomRight.x - topLeft.x,
          bottomRight.y - topLeft.y,
        ]);

        // Render Voronoi cells
        const cells = group.selectAll('path').data(projectedPoints);

        cells
          .enter()
          .append('path')
          .merge(cells)
          .attr('d', (_, i) => voronoi.renderCell(i)) // Render each Voronoi cell
          .attr('fill', 'none')
          .attr('stroke', 'green')
          .attr('stroke-width', 4);

        cells.exit().remove();

        // Render points (red circles)
        const circles = group.selectAll('circle').data(visiblePoints);

        circles
          .enter()
          .append('circle')
          .merge(circles)
          .attr('cx', (d) => d.projected[0])
          .attr('cy', (d) => d.projected[1])
          .attr('r', 5)
          .attr('fill', 'red');

        circles.exit().remove();
      };

      map.on('viewreset moveend', renderVoronoi); // Re-render on map move/zoom
      renderVoronoi(); // Initial render

      return () => {
        svg.remove();
        map.off('viewreset moveend', renderVoronoi); // Cleanup on unmount
      };
    };

    fetchDataAndRender();
  }, [map]);

  return null;
}
