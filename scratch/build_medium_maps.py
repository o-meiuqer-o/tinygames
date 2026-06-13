import urllib.request
import re
import json

countries = [
    ("india", "indiaLow.js", "🇮🇳", "28 states and 8 Union Territories"),
    ("world", "worldLow.js", "🌍", "Our world has 195 recognized countries"),
    ("china", "chinaLow.js", "🇨🇳", "China has 23 provinces, 5 autonomous regions and 4 municipalities"),
    ("usa", "usaLow.js", "🇺🇸", "The USA has 50 states and Washington D.C."),
    ("uk", "unitedKingdomLow.js", "🇬🇧", "The UK comprises England, Scotland, Wales, and Northern Ireland"),
    ("france", "franceLow.js", "🇫🇷", "France has 18 administrative regions"),
    ("germany", "germanyLow.js", "🇩🇪", "Germany has 16 Bundesländer (federal states)"),
    ("italy", "italyLow.js", "🇮🇹", "Italy has 20 regions, shaped like a boot"),
    ("greece", "greeceLow.js", "🇬🇷", "Greece has 13 peripheries, birthplace of democracy"),
    ("egypt", "egyptLow.js", "🇪🇬", "Egypt has 27 governorates, home to one of the oldest civilizations"),
    ("japan", "japanLow.js", "🇯🇵", "Japan has 47 prefectures across its four main islands"),
    ("russia", "russiaLow.js", "🇷🇺", "Russia is the largest country in the world, spanning 11 time zones"),
    ("turkey", "turkeyLow.js", "🇹🇷", "Turkey has 81 provinces, bridging Europe and Asia"),
    ("spain", "spainLow.js", "🇪🇸", "Spain has 17 autonomous communities"),
    ("mexico", "mexicoLow.js", "🇲🇽", "Mexico has 31 states and 1 federal entity, home to Aztec and Maya"),
    ("brazil", "brazilLow.js", "🇧🇷", "Brazil has 26 states and 1 federal district"),
    ("iran", "iranLow.js", "🇮🇷", "Iran has 31 provinces, heart of the ancient Persian Empire"),
    ("iraq", "iraqLow.js", "🇮🇶", "Iraq has 19 governorates, home to ancient Mesopotamia"),
    ("australia", "australiaLow.js", "🇦🇺", "Australia has 6 states and 2 major territories"),
    ("south_africa", "southAfricaLow.js", "🇿🇦", "South Africa has 9 provinces and 3 capital cities")
]

def parse_svg_path_bbox(d_string):
    # Extracts all coordinate numbers (X, Y) from path commands like M x,y or L x,y or C x,y...
    coords = re.findall(r'[-+]?[0-9]*\.?[0-9]+', d_string)
    # Filter only float numbers
    floats = [float(x) for x in coords]
    if not floats:
        return 0, 0, 800, 500
    
    # Coordinates in path d strings usually alternate between x and y: x0, y0, x1, y1...
    xs = floats[0::2]
    ys = floats[1::2]
    
    if not xs or not ys:
        return 0, 0, 800, 500
        
    return min(xs), min(ys), max(xs), max(ys)

map_data_1 = []
map_data_2 = []

for idx, (name, filename, emoji, fact) in enumerate(countries):
    level = idx + 1
    url = f"https://cdn.amcharts.com/lib/3/maps/js/{filename}"
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    try:
        response = urllib.request.urlopen(req)
        content = response.read().decode('utf-8', errors='ignore')
        
        # Extract path elements using regex matching: {"id":"...", "title":"...", "d":"..."}
        # Keys can be in double or single quotes or unquoted, so use a flexible regex
        matches = re.finditer(r'\{[^{}]*?"id"\s*:\s*"([^"]+)"[^{}]*?\}', content, re.DOTALL)
        
        regions = []
        all_d_strings = []
        
        for m in matches:
            block = m.group(0)
            
            # extract keys within the block
            id_match = re.search(r'"id"\s*:\s*"([^"]+)"', block)
            title_match = re.search(r'"title"\s*:\s*"([^"]+)"', block)
            d_match = re.search(r'"d"\s*:\s*"([^"]+)"', block)
            
            if id_match and title_match and d_match:
                reg_id = id_match.group(1).replace('-', '_').lower()
                reg_title = title_match.group(1)
                reg_d = d_match.group(1)
                regions.append({
                    "id": reg_id,
                    "name": reg_title,
                    "path": reg_d
                })
                all_d_strings.append(reg_d)
                
        # Calculate viewBox based on the bounding box of ALL paths combined
        if regions:
            min_x, min_y, max_x, max_y = float('inf'), float('inf'), float('-inf'), float('-inf')
            for d in all_d_strings:
                x0, y0, x1, y1 = parse_svg_path_bbox(d)
                min_x = min(min_x, x0)
                min_y = min(min_y, y0)
                max_x = max(max_x, x1)
                max_y = max(max_y, y1)
            
            # Add margin (e.g. 5% of width/height)
            width = max_x - min_x
            height = max_y - min_y
            margin_x = max(10, width * 0.05)
            margin_y = max(10, height * 0.05)
            
            view_box = f"{int(min_x - margin_x)} {int(min_y - margin_y)} {int(width + 2 * margin_x)} {int(height + 2 * margin_y)}"
        else:
            view_box = "0 0 800 600"
            
        level_obj = {
            "level": level,
            "id": name,
            "name": name.replace('_', ' ').title(),
            "emoji": emoji,
            "fact": fact,
            "viewBox": view_box,
            "regions": regions
        }
        
        if level <= 10:
            map_data_1.append(level_obj)
        else:
            map_data_2.append(level_obj)
            
        print(f"Processed Level {level}: {name} ({len(regions)} regions)")
        
    except Exception as e:
        print(f"FAILED to process {name}: {e}")

# Save part 1
with open("d:/tinygames/public/js/map-data-1.js", "w", encoding="utf-8") as f:
    f.write("// Mapping Express — Map Data Part 1 (Levels 1-10) - Medium Detail\n")
    f.write("const MAP_DATA_1 = ")
    json.dump(map_data_1, f, indent=2, ensure_ascii=False)
    f.write(";\n")

# Save part 2
with open("d:/tinygames/public/js/map-data-2.js", "w", encoding="utf-8") as f:
    f.write("// Mapping Express — Map Data Part 2 (Levels 11-20) - Medium Detail\n")
    f.write("const MAP_DATA_2 = ")
    json.dump(map_data_2, f, indent=2, ensure_ascii=False)
    f.write(";\n")

print("Finished generation successfully!")
