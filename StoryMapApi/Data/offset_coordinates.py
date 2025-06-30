import json
import math
import random

def distance(coord1, coord2):
    """Calculate Euclidean distance between two coordinates"""
    return math.sqrt((coord1[0] - coord2[0])**2 + (coord1[1] - coord2[1])**2)

def interpolate_along_linestring(coords, num_points):
    """Interpolate points evenly along a LineString"""
    if num_points <= 0:
        return []
    if num_points == 1:
        return [coords[0]]
    
    # Calculate cumulative distances along the line
    distances = [0]
    total_length = 0
    
    for i in range(1, len(coords)):
        segment_length = distance(coords[i-1], coords[i])
        total_length += segment_length
        distances.append(total_length)
    
    # Generate evenly spaced points
    interpolated_points = []
    
    for i in range(num_points):
        # Calculate target distance along the line
        target_distance = (i / (num_points - 1)) * total_length if num_points > 1 else 0
        
        # Find which segment this distance falls in
        segment_idx = 0
        for j in range(len(distances) - 1):
            if distances[j] <= target_distance <= distances[j + 1]:
                segment_idx = j
                break
        
        # Interpolate within the segment
        if segment_idx < len(coords) - 1:
            segment_start_dist = distances[segment_idx]
            segment_end_dist = distances[segment_idx + 1]
            segment_length = segment_end_dist - segment_start_dist
            
            if segment_length > 0:
                # How far along this segment should we place the point?
                ratio = (target_distance - segment_start_dist) / segment_length
            else:
                ratio = 0
            
            # Linear interpolation between segment endpoints
            start_coord = coords[segment_idx]
            end_coord = coords[segment_idx + 1]
            
            interpolated_lng = start_coord[0] + ratio * (end_coord[0] - start_coord[0])
            interpolated_lat = start_coord[1] + ratio * (end_coord[1] - start_coord[1])
            
            interpolated_points.append([interpolated_lng, interpolated_lat])
        else:
            # Fallback to last coordinate
            interpolated_points.append(coords[-1])
    
    return interpolated_points

def get_perpendicular_offset(start, end, magnitude):
    """Get a small offset perpendicular to the segment from start to end."""
    dx = end[0] - start[0]
    dy = end[1] - start[1]
    length = math.sqrt(dx**2 + dy**2)
    if length == 0:
        return (0, 0)
    # Perpendicular vector (swap and negate one component)
    perp_dx = -dy / length
    perp_dy = dx / length
    # Randomly choose above or below the line
    direction = random.choice([-1, 1])
    return (perp_dx * magnitude * direction, perp_dy * magnitude * direction)

# Load project data
with open('../../public/storymapdata_db_ready_v2.json', 'r') as file:
    projects = json.load(file)

# Load anchor points
with open('../../public/anchor_points.geojson', 'r') as file:
    anchor_geojson = json.load(file)
anchor_points = [feature['geometry']['coordinates'] for feature in anchor_geojson['features']]
num_anchors = len(anchor_points)
num_projects = len(projects)

# Shuffle projects for randomness
random.shuffle(projects)

# Assign each project to a random location near an anchor point
for i, project in enumerate(projects):
    anchor_idx = i % num_anchors  # Evenly distribute among anchors
    anchor_lng, anchor_lat = anchor_points[anchor_idx]
    # Add a small random offset (in degrees, adjust as needed)
    offset_lng = random.uniform(-0.03, 0.03)
    offset_lat = random.uniform(-0.03, 0.03)
    project['Longitude'] = round(anchor_lng + offset_lng, 6)
    project['Latitude'] = round(anchor_lat + offset_lat, 6)

# Save updated project data
with open('../../public/storymapdata_db_ready_v2.json', 'w') as file:
    json.dump(projects, file, indent=2)

print(f"Assigned {num_projects} projects to {num_anchors} anchor points with random spread.")