import json
import random

# Read the JSON file
with open('storymapdata_db_ready.json', 'r') as file:
    data = json.load(file)

# Tucson's coordinate ranges
TUCSON_LAT_MIN = 32.1
TUCSON_LAT_MAX = 32.4
TUCSON_LNG_MIN = -111.1
TUCSON_LNG_MAX = -110.8

# Track used coordinates to avoid duplicates
used_coords = set()

# Add random coordinates within Tucson's area
for project in data:
    if 'Latitude' in project and 'Longitude' in project:
        # Keep trying until we find an unused coordinate
        while True:
            # Generate random coordinates within Tucson's area
            new_lat = round(random.uniform(TUCSON_LAT_MIN, TUCSON_LAT_MAX), 6)
            new_lng = round(random.uniform(TUCSON_LNG_MIN, TUCSON_LNG_MAX), 6)
            
            coord_key = (new_lat, new_lng)
            if coord_key not in used_coords:
                used_coords.add(coord_key)
                project['Latitude'] = new_lat
                project['Longitude'] = new_lng
                break

# Write the updated data back to the file
with open('storymapdata_db_ready.json', 'w') as file:
    json.dump(data, file, indent=2)

print("Coordinates spread across Tucson area successfully!") 