import json

# Read the JSON file
with open('storymapdata_converted_enriched_v21.json', 'r') as file:
    data = json.load(file)

for project in data:
    # If location is an object, flatten it
    if isinstance(project.get('location'), dict):
        location_obj = project['location']
        # Set address as location string if present
        if 'address' in location_obj:
            project['location'] = location_obj['address']
        else:
            project['location'] = ""
        # Flatten latitude and longitude
        if 'latitude' in location_obj and location_obj['latitude'] is not None:
            try:
                project['latitude'] = float(location_obj['latitude'])
            except (ValueError, TypeError):
                project['latitude'] = None
        else:
            project['latitude'] = None
        if 'longitude' in location_obj and location_obj['longitude'] is not None:
            try:
                project['longitude'] = float(location_obj['longitude'])
            except (ValueError, TypeError):
                project['longitude'] = None
        else:
            project['longitude'] = None

# Write the updated data back to the file
with open('storymapdata_converted_enriched_v21.json', 'w') as file:
    json.dump(data, file, indent=2)

print("Flattening complete!") 