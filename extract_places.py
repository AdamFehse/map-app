import json
import spacy
import requests
import time

# Load spaCy English model
nlp = spacy.load("en_core_web_sm")

GENERIC_PLACES = {"Arizona", "Mexico", "United States", "USA", "Sonora", "U.S.", "America"}

def is_specific_place(place):
    # Filter out generic names and very short/long names
    return place and place not in GENERIC_PLACES and 2 <= len(place) <= 40

def geocode_place(place):
    url = 'https://nominatim.openstreetmap.org/search'
    params = {
        'q': place,
        'format': 'json',
        'limit': 1,
        'addressdetails': 1,
    }
    headers = {'User-Agent': 'YourAppName/1.0 (your@email.com)'}
    response = requests.get(url, params=params, headers=headers)
    if response.ok and response.json():
        result = response.json()[0]
        return {
            'lat': result['lat'],
            'lon': result['lon'],
            'display_name': result['display_name'],
            'type': result.get('type', '')
        }
    return None

def reverse_geocode(lat, lon):
    url = 'https://nominatim.openstreetmap.org/reverse'
    params = {
        'lat': lat,
        'lon': lon,
        'format': 'json',
        'zoom': 10,  # city/town/village level
        'addressdetails': 1,
    }
    headers = {'User-Agent': 'YourAppName/1.0 (your@email.com)'}
    response = requests.get(url, params=params, headers=headers)
    if response.ok and response.json():
        result = response.json()
        address = result.get('address', {})
        # Try to get city/town/village/region
        for key in ['city', 'town', 'village', 'hamlet', 'county', 'state_district', 'state']:
            if key in address:
                return address[key]
        return result.get('display_name')
    return None

# Load your data
with open('/Users/adamfehse/Documents/gitrepos/mapWIP/map-app/public/storymapdata_db_ready.json', 'r', encoding='utf-8') as f:
    projects = json.load(f)

results = []

for project in projects:
    # Gather all text fields to search for places
    texts = []
    if project.get('DescriptionLong'):
        texts.append(project['DescriptionLong'])
    if project.get('DescriptionShort'):
        texts.append(project['DescriptionShort'])
    if project.get('Outcome', {}).get('Summary'):
        texts.append(project['Outcome']['Summary'])
    for art in project.get('Artworks', []):
        if art.get('Description'):
            texts.append(art['Description'])

    # Extract all GPEs
    all_gpes = []
    for text in texts:
        doc = nlp(text)
        all_gpes.extend([ent.text for ent in doc.ents if ent.label_ == "GPE"])

    # Filter for specific places
    specific_places = [p for p in all_gpes if is_specific_place(p)]

    # Try to geocode the first specific place
    found_location = None
    found_lat = None
    found_lon = None
    geocode_type = None

    for place in specific_places:
        geo = geocode_place(place + ' Mexico')  # Add 'Mexico' for context
        if geo and geo['type'] in ['city', 'town', 'village', 'hamlet', 'municipality', 'locality', 'county']:
            found_location = geo['display_name']
            found_lat = geo['lat']
            found_lon = geo['lon']
            geocode_type = 'direct'
            break
        time.sleep(1)  # Respect Nominatim's rate limit

    # Fallback: reverse geocode coordinates
    if not found_location and project.get('Latitude') and project.get('Longitude'):
        rev = reverse_geocode(project['Latitude'], project['Longitude'])
        if rev:
            found_location = rev
            found_lat = project['Latitude']
            found_lon = project['Longitude']
            geocode_type = 'reverse'

    # Fallback: flag for manual review
    if not found_location:
        geocode_type = 'manual'

    results.append({
        "Name": project.get("Name"),
        "SpecificPlacesFound": specific_places,
        "ChosenLocation": found_location,
        "Latitude": found_lat,
        "Longitude": found_lon,
        "GeocodeType": geocode_type
    })

    # Optional: print progress
    print(f"{project.get('Name')}: {found_location} ({geocode_type})")

    time.sleep(1)  # Respect Nominatim's rate limit

# Write results to a new file for inspection
with open('public/storymap-locations-preview.json', 'w', encoding='utf-8') as f:
    json.dump(results, f, ensure_ascii=False, indent=2)

print("Done! Results written to public/storymap-locations-preview.json")
