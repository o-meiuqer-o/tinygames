import urllib.request
import re

url = "https://cdn.amcharts.com/lib/3/maps/js/indiaLow.js"
req = urllib.request.Request(
    url, 
    headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}
)
try:
    response = urllib.request.urlopen(req)
    content = response.read().decode('utf-8', errors='ignore')
    print("Content length:", len(content))
    idx = content.find('"svg":')
    if idx != -1:
        print(content[idx:idx+800].encode('ascii', errors='ignore').decode('ascii'))
    else:
        print("Could not find path key")
except Exception as e:
    print("Error:", e)
