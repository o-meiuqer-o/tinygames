const CONSTELLATIONS = [
  {
    name: "Big Dipper", mlName: "സപ്തർഷിമണ്ഡലം (Big Dipper)",
    info: "The Big Dipper points to the North Star.", mlInfo: "ഇത് ധ്രുവനക്ഷത്രത്തെ ചൂണ്ടിക്കാണിക്കുന്നു.",
    stars: [{x: -0.8, y: -0.3}, {x: -0.4, y: -0.1}, {x: -0.1, y: 0.1}, {x: 0.2, y: 0.4}, {x: 0.7, y: 0.6}, {x: 0.8, y: 0.0}, {x: 0.4, y: -0.2}],
    edges: [[0,1], [1,2], [2,3], [3,4], [4,5], [5,6], [6,3]]
  },
  {
    name: "Cassiopeia", mlName: "കാശ്യപി (Cassiopeia)",
    info: "Recognized by its 'W' shape.", mlInfo: "ഇംഗ്ലീഷ് അക്ഷരം 'W' യുടെ ആകൃതിയാണ്.",
    stars: [{x: -0.8, y: -0.5}, {x: -0.3, y: 0.3}, {x: 0.1, y: -0.1}, {x: 0.5, y: 0.4}, {x: 0.9, y: -0.4}],
    edges: [[0,1], [1,2], [2,3], [3,4]]
  },
  {
    name: "Cygnus", mlName: "അരയന്നം (Cygnus)",
    info: "Represents a swan flying down the Milky Way.", mlInfo: "ആകാശഗംഗയിലൂടെ പറക്കുന്ന ഒരു അരയന്നത്തെ ഇത് പ്രതിനിധീകരിക്കുന്നു.",
    stars: [{x: -0.1, y: -0.8}, {x: 0.0, y: -0.1}, {x: 0.1, y: 0.4}, {x: 0.2, y: 0.9}, {x: -0.7, y: 0.1}, {x: 0.6, y: -0.4}],
    edges: [[0,1], [1,2], [2,3], [4,1], [1,5]]
  },
  {
    name: "Orion", mlName: "മൃഗവ്യാധൻ (Orion)",
    info: "Orion is the hunter. His belt is formed by three bright stars.", mlInfo: "മൃഗവ്യാധൻ (വേട്ടക്കാരൻ) എന്നാണ് ഒറിയോൺ അറിയപ്പെടുന്നത്. 3 നക്ഷത്രങ്ങൾ ചേർന്ന ബെൽറ്റ് ഇതിന്റെ പ്രത്യേകതയാണ്.",
    stars: [{x: -0.4, y: -0.7}, {x: 0.4, y: -0.7}, {x: -0.2, y: 0.0}, {x: 0.0, y: -0.1}, {x: 0.2, y: -0.2}, {x: -0.5, y: 0.7}, {x: 0.3, y: 0.8}],
    edges: [[0,2], [1,4], [2,3], [3,4], [2,5], [4,6]]
  },
  {
    name: "Leo", mlName: "ചിങ്ങം (Leo)",
    info: "The Lion, containing the bright star Regulus.", mlInfo: "ചിങ്ങം രാശിയെ പ്രതിനിധീകരിക്കുന്ന സിംഹം.",
    stars: [{x: -0.6, y: -0.2}, {x: -0.4, y: -0.6}, {x: 0.0, y: -0.5}, {x: 0.2, y: -0.1}, {x: -0.1, y: 0.1}, {x: -0.7, y: 0.3}, {x: -0.2, y: 0.5}, {x: 0.4, y: 0.4}, {x: 0.8, y: 0.2}],
    edges: [[0,1], [1,2], [2,3], [3,4], [4,0], [0,5], [4,6], [6,7], [7,8]]
  },
  {
    name: "Scorpius", mlName: "വൃശ്ചികം (Scorpius)",
    info: "The Scorpion, with its red heart Antares.", mlInfo: "വൃശ്ചികം രാശി. ഇതിന്റെ ഹൃദയഭാഗത്ത് തിളങ്ങുന്ന ചുവന്ന നക്ഷത്രമുണ്ട്.",
    stars: [{x: 0.8, y: -0.6}, {x: 0.4, y: -0.4}, {x: 0.1, y: -0.2}, {x: -0.2, y: 0.0}, {x: -0.5, y: 0.2}, {x: -0.7, y: 0.6}, {x: -0.4, y: 0.8}, {x: -0.1, y: 0.6}, {x: 0.2, y: 0.2}, {x: 0.5, y: 0.0}, {x: 0.7, y: -0.2}],
    edges: [[0,1], [1,2], [2,3], [3,4], [4,5], [5,6], [6,7], [7,8], [8,9], [9,10]]
  },
  {
    name: "Taurus", mlName: "ഇടവം (Taurus)",
    info: "The Bull, housing the Pleiades star cluster.", mlInfo: "ഇടവം രാശി. കാളയുടെ ആകൃതി.",
    stars: [{x: -0.5, y: -0.5}, {x: -0.2, y: -0.2}, {x: 0.0, y: 0.0}, {x: 0.4, y: -0.2}, {x: 0.7, y: -0.6}, {x: -0.1, y: 0.4}, {x: -0.3, y: 0.8}],
    edges: [[0,1], [1,2], [2,3], [3,4], [2,5], [5,6]]
  },
  {
    name: "Gemini", mlName: "മിഥുനം (Gemini)",
    info: "The Twins, marked by bright stars Castor and Pollux.", mlInfo: "മിഥുനം രാശിയെ പ്രതിനിധീകരിക്കുന്ന ഇരട്ടകൾ.",
    stars: [{x: -0.4, y: -0.8}, {x: 0.4, y: -0.7}, {x: -0.3, y: -0.2}, {x: 0.3, y: -0.1}, {x: -0.2, y: 0.4}, {x: 0.2, y: 0.5}, {x: -0.6, y: 0.8}, {x: 0.5, y: 0.9}],
    edges: [[0,2], [2,4], [4,6], [1,3], [3,5], [5,7], [4,5]]
  },
  {
    name: "Canis Major", mlName: "മഹാവ്യാധൻ (Canis Major)",
    info: "The Great Dog, follows Orion and contains Sirius, the brightest star.", mlInfo: "മൃഗവ്യാധനെ പിന്തുടരുന്ന വലിയ നായ. ആകാശത്തിലെ ഏറ്റവും തിളക്കമുള്ള നക്ഷത്രമായ സിറിയസ് ഇതിലാണ്.",
    stars: [{x: -0.4, y: -0.5}, {x: 0.0, y: -0.2}, {x: 0.5, y: 0.1}, {x: 0.8, y: 0.5}, {x: 0.3, y: 0.6}, {x: -0.1, y: 0.4}, {x: -0.6, y: 0.1}],
    edges: [[0,1], [1,2], [2,3], [3,4], [4,5], [5,6], [6,1]]
  },
  {
    name: "Pegasus", mlName: "ഭാദ്രപദം (Pegasus)",
    info: "The Winged Horse, known for its Great Square.", mlInfo: "പറക്കുന്ന കുതിര. വലിയ ചതുരാകൃതി ഇതിന്റെ പ്രത്യേകതയാണ്.",
    stars: [{x: -0.5, y: -0.5}, {x: 0.5, y: -0.4}, {x: 0.4, y: 0.4}, {x: -0.4, y: 0.5}, {x: -0.8, y: 0.0}, {x: 0.8, y: -0.8}, {x: 0.9, y: 0.0}],
    edges: [[0,1], [1,2], [2,3], [3,0], [0,4], [1,5], [2,6]]
  },
  {
    name: "Lyra", mlName: "ലൈറ (Lyra)",
    info: "The Lyre (a musical instrument), featuring the bright star Vega.", mlInfo: "ഒരു സംഗീതോപകരണത്തിന്റെ ആകൃതി. വേഗ എന്ന തിളങ്ങുന്ന നക്ഷത്രം ഇതിലാണ്.",
    stars: [{x: 0.0, y: -0.6}, {x: -0.3, y: -0.1}, {x: 0.4, y: 0.0}, {x: -0.2, y: 0.5}, {x: 0.3, y: 0.6}],
    edges: [[0,1], [0,2], [1,2], [1,3], [2,4], [3,4]]
  },
  {
    name: "Aquila", mlName: "ഗരുഡൻ (Aquila)",
    info: "The Eagle, with the bright star Altair at its head.", mlInfo: "പരുന്തിന്റെ ആകൃതി. അൾട്ടയർ ഇതിലെ പ്രധാന നക്ഷത്രമാണ്.",
    stars: [{x: 0.0, y: -0.7}, {x: -0.2, y: -0.2}, {x: 0.3, y: -0.1}, {x: -0.6, y: 0.2}, {x: 0.6, y: 0.3}, {x: 0.0, y: 0.6}],
    edges: [[0,1], [0,2], [1,3], [2,4], [1,5], [2,5]]
  },
  {
    name: "Bootes", mlName: "ഭൂതപാലൻ (Bootes)",
    info: "The Herdsman, shaped like a kite.", mlInfo: "ഒരു പട്ടത്തിന്റെ ആകൃതിയാണ് ഇതിന്.",
    stars: [{x: 0.0, y: 0.8}, {x: -0.3, y: 0.3}, {x: 0.3, y: 0.2}, {x: -0.5, y: -0.3}, {x: 0.4, y: -0.4}, {x: -0.1, y: -0.8}],
    edges: [[0,1], [0,2], [1,3], [2,4], [3,5], [4,5]]
  },
  {
    name: "Hercules", mlName: "ഹെർക്കുലീസ് (Hercules)",
    info: "The Roman hero, featuring a central 'Keystone' square.", mlInfo: "റോമൻ വീരനായ ഹെർക്കുലീസിന്റെ പേരിൽ അറിയപ്പെടുന്നു.",
    stars: [{x: -0.3, y: -0.3}, {x: 0.3, y: -0.2}, {x: 0.2, y: 0.4}, {x: -0.4, y: 0.3}, {x: -0.7, y: -0.6}, {x: 0.6, y: -0.7}, {x: -0.6, y: 0.7}, {x: 0.7, y: 0.8}],
    edges: [[0,1], [1,2], [2,3], [3,0], [0,4], [1,5], [3,6], [2,7]]
  },
  {
    name: "Draco", mlName: "വ്യാളി (Draco)",
    info: "The Dragon, winding its way around the North Star.", mlInfo: "ധ്രുവനക്ഷത്രത്തിന് ചുറ്റും വളഞ്ഞുകിടക്കുന്ന വ്യാളിയുടെ ആകൃതി.",
    stars: [{x: 0.5, y: 0.5}, {x: 0.8, y: 0.3}, {x: 0.6, y: 0.0}, {x: 0.2, y: 0.1}, {x: -0.2, y: -0.1}, {x: -0.5, y: -0.4}, {x: -0.3, y: -0.8}, {x: 0.2, y: -0.7}, {x: 0.4, y: -0.4}],
    edges: [[0,1], [1,2], [2,3], [3,4], [4,5], [5,6], [6,7], [7,8]]
  },
  {
    name: "Virgo", mlName: "കന്നി (Virgo)",
    info: "The Maiden, one of the largest constellations.", mlInfo: "കന്നി രാശി. ആകാശത്തിലെ ഏറ്റവും വലിയ നക്ഷത്രസമൂഹങ്ങളിൽ ഒന്ന്.",
    stars: [{x: -0.6, y: 0.2}, {x: -0.3, y: -0.1}, {x: 0.1, y: 0.0}, {x: 0.5, y: 0.3}, {x: 0.7, y: -0.2}, {x: 0.3, y: -0.5}, {x: -0.1, y: -0.4}],
    edges: [[0,1], [1,2], [2,3], [3,4], [4,5], [5,6], [6,1]]
  },
  {
    name: "Aries", mlName: "മേടം (Aries)",
    info: "The Ram, a simple curved line of stars.", mlInfo: "മേടം രാശിയെ പ്രതിനിധീകരിക്കുന്ന ആട്.",
    stars: [{x: -0.5, y: 0.3}, {x: 0.0, y: 0.0}, {x: 0.4, y: -0.3}, {x: 0.6, y: 0.1}],
    edges: [[0,1], [1,2], [2,3]]
  },
  {
    name: "Cancer", mlName: "കർക്കിടകം (Cancer)",
    info: "The Crab, an upside-down 'Y' shape.", mlInfo: "കർക്കിടകം രാശിയെ പ്രതിനിധീകരിക്കുന്ന ഞണ്ട്.",
    stars: [{x: 0.0, y: -0.2}, {x: 0.0, y: 0.3}, {x: -0.4, y: 0.6}, {x: 0.4, y: 0.5}, {x: -0.3, y: -0.6}],
    edges: [[0,1], [1,2], [1,3], [0,4]]
  },
  {
    name: "Capricornus", mlName: "മകരം (Capricornus)",
    info: "The Sea Goat, shaped like a large triangle.", mlInfo: "മകരം രാശി. ഒരു വലിയ ത്രികോണത്തിന്റെ ആകൃതി.",
    stars: [{x: -0.6, y: -0.4}, {x: 0.0, y: -0.6}, {x: 0.6, y: -0.3}, {x: 0.4, y: 0.3}, {x: 0.0, y: 0.6}, {x: -0.4, y: 0.2}],
    edges: [[0,1], [1,2], [2,3], [3,4], [4,5], [5,0]]
  },
  {
    name: "Pisces", mlName: "മീനം (Pisces)",
    info: "The Fishes, two small circles connected by a V-shaped line.", mlInfo: "മീനം രാശി. V ആകൃതിയിലുള്ള വരയാൽ ബന്ധിപ്പിച്ച രണ്ട് മത്സ്യങ്ങൾ.",
    stars: [{x: -0.7, y: 0.5}, {x: -0.5, y: 0.3}, {x: -0.3, y: 0.6}, {x: -0.5, y: 0.7}, {x: 0.0, y: 0.0}, {x: 0.5, y: -0.4}, {x: 0.7, y: -0.2}, {x: 0.8, y: -0.6}, {x: 0.4, y: -0.7}],
    edges: [[0,1], [1,2], [2,3], [3,0], [1,4], [4,5], [5,6], [6,7], [7,8], [8,5]]
  }
];
