import React, { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import * as d3 from 'd3';

export default function AzBorderD3Layer() {
  const map = useMap();

  useEffect(() => {
    const fetchAndRender = async () => {
      // Fetch the AZ border GeoJSON
      const response = await fetch('/export0.geojson');
      const geojson = await response.json();

      // Get the map's overlayPane for rendering with D3
      const overlay = d3.select(map.getPanes().overlayPane);

      // Create an SVG element in the overlayPane
      const svg = overlay
        .append('svg')
        .attr('class', 'd3-border-overlay')
        .style('pointer-events', 'none');

      const group = svg.append('g').attr('class', 'd3-border-group');

      // Helper to project [lng, lat] to [x, y]
      const projectCoord = ([lng, lat]) => {
        const point = map.latLngToLayerPoint([lat, lng]);
        return [point.x, point.y];
      };

      const renderBorder = () => {
        const bounds = map.getBounds();
        const topLeft = map.latLngToLayerPoint(bounds.getNorthWest());
        const bottomRight = map.latLngToLayerPoint(bounds.getSouthEast());

        svg
          .attr('width', bottomRight.x - topLeft.x)
          .attr('height', bottomRight.y - topLeft.y)
          .style('left', `${topLeft.x}px`)
          .style('top', `${topLeft.y}px`);

        group.attr('transform', `translate(${-topLeft.x},${-topLeft.y})`);

        // Prepare paths for all features
        const features = geojson.features || [];
        const paths = features.map(feature => {
          const geom = feature.geometry;
          if (geom.type === 'Polygon') {
            return geom.coordinates.map(ring => d3.line()
              .x(d => projectCoord(d)[0])
              .y(d => projectCoord(d)[1])
              .curve(d3.curveLinearClosed)(ring));
          } else if (geom.type === 'MultiPolygon') {
            return geom.coordinates.flatMap(polygon =>
              polygon.map(ring => d3.line()
                .x(d => projectCoord(d)[0])
                .y(d => projectCoord(d)[1])
                .curve(d3.curveLinearClosed)(ring))
            );
          } else if (geom.type === 'LineString') {
            return [d3.line()
              .x(d => projectCoord(d)[0])
              .y(d => projectCoord(d)[1])
              .curve(d3.curveBasis)(geom.coordinates)];
          } else if (geom.type === 'MultiLineString') {
            return geom.coordinates.map(line => d3.line()
              .x(d => projectCoord(d)[0])
              .y(d => projectCoord(d)[1])
              .curve(d3.curveBasis)(line));
          }
          return [];
        }).flat();

        // Bind and render paths
        const borderPaths = group.selectAll('path.az-border').data(paths);

        borderPaths.enter()
          .append('path')
          .attr('class', 'az-border')
          .merge(borderPaths)
          .attr('d', d => d)
          .attr('fill', 'none')
          .attr('stroke', '#00ffea') // Bright cyan
          .attr('stroke-width', 6)
          .attr('stroke-linecap', 'round')
          .attr('stroke-linejoin', 'round')
          .style('filter', 'drop-shadow(0 0 16px #00fff7)');

        borderPaths.exit().remove();
      };

      map.on('viewreset moveend zoomend', renderBorder);
      renderBorder();

      return () => {
        svg.remove();
        map.off('viewreset moveend zoomend', renderBorder);
      };
    };

    fetchAndRender();
  }, [map]);

  return null;
}
