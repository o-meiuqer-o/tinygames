import urllib.request

countries = [
    ("india", "indiaLow.js"),
    ("world", "worldLow.js"),
    ("china", "chinaLow.js"),
    ("usa", "usaLow.js"),
    ("uk", "unitedKingdomLow.js"),
    ("france", "franceLow.js"),
    ("germany", "germanyLow.js"),
    ("italy", "italyLow.js"),
    ("greece", "greeceLow.js"),
    ("egypt", "egyptLow.js"),
    ("japan", "japanLow.js"),
    ("russia", "russiaLow.js"),
    ("turkey", "turkeyLow.js"),
    ("spain", "spainLow.js"),
    ("mexico", "mexicoLow.js"),
    ("brazil", "brazilLow.js"),
    ("iran", "iranLow.js"),
    ("iraq", "iraqLow.js"),
    ("australia", "australiaLow.js"),
    ("south_africa", "southAfricaLow.js")
]

for name, filename in countries:
    url = f"https://cdn.amcharts.com/lib/3/maps/js/{filename}"
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    try:
        response = urllib.request.urlopen(req)
        print(f"OK: {name} ({len(response.read())} bytes)")
    except Exception as e:
        print(f"FAILED: {name} - {e}")
