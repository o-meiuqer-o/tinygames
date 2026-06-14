const translations = {
    en: {
        title: "Painting Quiz",
        subtitle: "Find the odd one out!",
        playLocal: "Play Game",
        backHub: "Back to Hub",
        premise: "Test your art history knowledge! In this quiz, you will see a famous painting and four attributes.",
        rulesTitle: "Rules:",
        rule1: "You will be presented with a painting.",
        rule2: "Four options will appear: Artist, Year, Medium, and Movement.",
        rule3: "Three of these are correct for the painting. One is completely unrelated.",
        rule4: "Find and click the odd one out to win!",
        scoreText: "Score",
        promptText: "Find the odd one out! Which is NOT related?",
        correct: "Correct!",
        incorrect: "Incorrect!",
        nextPainting: "Next Painting"
    },
    ml: {
        title: "പെയിൻ്റിംഗ് ക്വിസ്",
        subtitle: "വ്യത്യസ്തമായത് കണ്ടെത്തുക!",
        playLocal: "കളി തുടങ്ങുക",
        backHub: "ഹബ്ബിലേക്ക് മടങ്ങുക",
        premise: "നിങ്ങളുടെ കലാചരിത്ര അറിവ് പരീക്ഷിക്കുക! ഈ ക്വിസിൽ, നിങ്ങൾക്ക് ഒരു പ്രശസ്തമായ പെയിൻ്റിംഗും നാല് ഓപ്ഷനുകളും കാണാം.",
        rulesTitle: "നിയമങ്ങൾ:",
        rule1: "നിങ്ങൾക്ക് ഒരു പെയിൻ്റിംഗ് കാണിച്ചുതരും.",
        rule2: "നാല് ഓപ്ഷനുകൾ ഉണ്ടാകും: ആർട്ടിസ്റ്റ്, വർഷം, മീഡിയം, പ്രസ്ഥാനം.",
        rule3: "ഇതിൽ മൂന്നെണ്ണം പെയിൻ്റിംഗുമായി ബന്ധമുള്ളതാണ്. ഒരെണ്ണം തികച്ചും വ്യത്യസ്തമാണ്.",
        rule4: "ആ വ്യത്യസ്തമായത് കണ്ടെത്തി അതിൽ ക്ലിക്ക് ചെയ്ത് വിജയിക്കുക!",
        scoreText: "സ്കോർ",
        promptText: "വ്യത്യസ്തമായത് കണ്ടെത്തുക! ഏതാണ് ബന്ധമില്ലാത്തത്?",
        correct: "ശരിയാണ്!",
        incorrect: "തെറ്റാണ്!",
        nextPainting: "അടുത്ത പെയിൻ്റിംഗ്"
    }
};

let currentLang = 'en';

const valueTranslations = {
    "Great Indian Fruit Bat": "ഗ്രേറ്റ് ഇന്ത്യൻ ഫ്രൂട്ട് ബാറ്റ്",
    "Bhawani Das": "ഭവാനി ദാസ്",
    "The Collector of Prints": "ദി കളക്ടർ ഓഫ് പ്രിൻ്റ്സ്",
    "Edgar Degas": "എഡ്ഗർ ഡെഗാസ്",
    "Self-Portrait": "സെൽഫ് പോർട്രെയിറ്റ്",
    "Anthony van Dyck": "ആൻ്റണി വാൻ ഡിക്ക്",
    "Saints Peter, Martha, Mary Magdalen, and Leonard": "സെയിൻ്റ്സ് പീറ്റർ, മാർത്ത, മേരി മാഗ്ഡലിൻ, ആൻഡ് ലിയനാർഡ്",
    "Correggio (Antonio Allegri)": "കൊറെജിയോ (അൻ്റോണിയോ അല്ലെഗ്രി)",
    "Madonna and Child": "മഡോണ ആൻഡ് ചൈൽഡ്",
    "Giovanni Bellini": "ജോവാന്നി ബെല്ലിനി",
    "The Temptation": "ദി ടെംപ്റ്റേഷൻ",
    "Pietro Longhi (Pietro Falca)": "പിയട്രോ ലോംഗി",
    "Aegina Visited by Jupiter": "എജിന വിസിറ്റഡ് ബൈ ജൂപ്പിറ്റർ",
    "Jean-Baptiste Greuze": "ജീൻ ബാപ്റ്റിസ്റ്റ് ഗ്രൂസ്",
    "Christ Healing the Blind": "ക്രൈസ്റ്റ് ഹീലിംഗ് ദി ബ്ലൈൻഡ്",
    "El Greco (Domenikos Theotokopoulos)": "എൽ ഗ്രെക്കോ",
    "Berlinghiero": "ബെർലിംഗിയേരോ",
    "The Vision of Saint John": "ദി വിഷൻ ഓഫ് സെയിൻ്റ് ജോൺ",
    "Virgin and Child with Saint Catherine of Alexandria": "വിർജിൻ ആൻഡ് ചൈൽഡ് വിത്ത് സെയിൻ്റ് കാതറിൻ ഓഫ് അലക്സാണ്ട്രിയ",
    "The Three Ages of Humans": "ദി ത്രീ ഏജസ് ഓഫ് ഹ്യൂമൻസ്",
    "Dosso Dossi (Giovanni de Lutero)": "ഡോസ്സോ ഡോസ്സി",
    "Sebastián Martínez y Pérez (1747–1800)": "സെബാസ്റ്റ്യൻ മാർട്ടിനെസ്",
    "Goya (Francisco de Goya y Lucientes)": "ഗോയ (ഫ്രാൻസിസ്കോ ഡി ഗോയ)",
    "Virgin and Child with the Young Saint John the Baptist and Angels": "വിർജിൻ ആൻഡ് ചൈൽഡ് വിത്ത് ദി യംഗ് സെയിൻ്റ് ജോൺ ദി ബാപ്റ്റിസ്റ്റ്",
    "François Boucher": "ഫ്രാങ്സ്വാ ബൗച്ചർ",
    "A Woodland Road with Travelers": "എ വുഡ്‌ലാൻഡ് റോഡ് വിത്ത് ട്രാവലേഴ്സ്",
    "Jan Brueghel the Elder": "ജാൻ ബ്രൂഗൽ ദി എൽഡർ",
    "Cardinal Fernando Niño de Guevara (1541–1609)": "കാർഡിനൽ ഫെർണാണ്ടോ നിനോ",
    "The Entombment": "ദി എൻ്റോംബ്മെൻ്റ്",
    "Moretto da Brescia (Alessandro Bonvicino)": "മൊറെറ്റോ ഡാ ബ്രെസ്സിയ",
    "The Triumph of Henry IV": "ദി ട്രയംഫ് ഓഫ് ഹെൻറി IV",
    "Peter Paul Rubens": "പീറ്റർ പോൾ റൂബൻസ്",
    "Wolf and Fox Hunt": "വൂൾഫ് ആൻഡ് ഫോക്സ് ഹണ്ട്",
    "Clothing the Naked": "ക്ലോത്തിംഗ് ദി നേക്കഡ്",
    "Michiel Sweerts": "മിക്കിയേൽ സ്വീർട്സ്",
    "Don Gaspar de Guzmán (1587–1645), Count-Duke of Olivares": "ഡോൺ ഗാസ്പർ ഡി ഗുസ്മാൻ",
    "Juan Bautista Martínez del Mazo": "ജുവാൻ ബാപ്റ്റിസ്റ്റ മാർട്ടിനെസ് ഡെൽ മാസോ",
    "Cottage Children (The Wood Gatherers)": "കോട്ടേജ് ചിൽഡ്രൻ",
    "Thomas Gainsborough": "തോമസ് ഗെയിൻസ്ബറോ",
    "Josefa de Castilla Portugal y van Asbrock de Garcini (1775–about 1850)": "ജോസഫ ഡി കാസ്റ്റില്ല പോർച്ചുഗൽ",
    "Ignacio Garcini y Queralt (1752–1825), Brigadier of Engineers": "ഇഗ്നാസിയോ ഗാർസിനി",
    "The Visit": "ദി വിസിറ്റ്",
    "Pieter de Hooch": "പീറ്റർ ഡി ഹൂച്ച്",
    "A Forest at Dawn with a Deer Hunt": "എ ഫോറസ്റ്റ് അറ്റ് ഡോൺ വിത്ത് എ ഡീർ ഹണ്ട്",
    "Charles Claude de Flahaut (1730–1809), Comte d'Angiviller": "ചാൾസ് ക്ലൗഡ് ഡി ഫ്ലാഹൗട്ട്",
    "The Silver Tureen": "ദി സിൽവർ ട്യൂറീൻ",
    "Jean Siméon Chardin": "ജീൻ സിമിയോൺ ചാർഡിൻ",
    "Herman Doomer (ca. 1595–1650)": "ഹെർമൻ ഡൂമർ",
    "Rembrandt (Rembrandt van Rijn)": "റെംബ്രാൻഡ് (റെംബ്രാൻഡ് വാൻ റിൻ)",
    "Madame Charles Maurice de Talleyrand Périgord (1761–1835)": "മാഡം ചാൾസ് മൗറീസ്",
    "baron François Gérard": "ബാരൺ ഫ്രാങ്സ്വാ ജെറാർഡ്",
    "Charity": "ചാരിറ്റി",
    "Guido Reni": "ഗ്വിഡോ റെനി",
    "Comtesse de la Châtre (Marie Charlotte Louise Perrette Aglaé Bontemps, 1762–1848)": "കോംറ്റെസ്സെ ഡി ലാ ഷാട്രെ",
    "Elisabeth Louise Vigée Le Brun": "എലിസബത്ത് ലൂയിസ് വിഗീ ലെ ബ്രൺ",
    "The Abduction of Rebecca": "ദി അബ്ഡക്ഷൻ ഓഫ് റെബേക്ക",
    "Eugène Delacroix": "യൂജിൻ ഡെലാക്രോയിക്സ്",
    "Cassone with painted front panel depicting the Conquest of Trebizond": "കാസ്സോൺ വിത്ത് പെയിൻ്റഡ് ഫ്രണ്ട് പാനൽ",
    "Apollonio di Giovanni di Tomaso": "അപ്പോളോണിയോ ഡി ജോവാന്നി",
    "The Flagellation; (reverse) The Madonna of Mercy": "ദി ഫ്ലാജല്ലേഷൻ; (റിവേഴ്സ്) ദി മഡോണ ഓഫ് മേഴ്സി",
    "Girolamo Romanino": "ജിറോലാമോ റൊമാനിനോ",
    "Blind Orion Searching for the Rising Sun": "ബ്ലൈൻഡ് ഓറിയോൺ സേർച്ചിംഗ് ഫോർ ദി റൈസിംഗ് സൺ",
    "Nicolas Poussin": "നിക്കോളാസ് പൗസിൻ",
    "The Coronation of the Virgin": "ദി കൊറോണേഷൻ ഓഫ് ദി വിർജിൻ",
    "Annibale Carracci": "അന്നിബാലെ കരാച്ചി",
    "The Holy Family with Saints Anne and Catherine of Alexandria": "ദി ഹോളി ഫാമിലി വിത്ത് സെയിൻ്റ്സ് ആൻ ആൻഡ് കാതറിൻ",
    "Jusepe de Ribera (called Lo Spagnoletto)": "ജ്യൂസെപ്പെ ഡി റിബേര",
    "The Holy Family with the Young Saint John the Baptist": "ദി ഹോളി ഫാമിലി വിത്ത് ദി യംഗ് സെയിൻ്റ് ജോൺ",
    "Andrea del Sarto (Andrea d'Agnolo)": "ആൻഡ്രിയ ഡെൽ സാർട്ടോ",
    "Bartolomeo Bonghi (died 1584)": "ബാർട്ടോലോമിയോ ബോംഗി",
    "Giovanni Battista Moroni": "ജോവാന്നി ബാറ്റിസ്റ്റ മൊറോണി",
    "Ancient Rome": "ഏൻഷ്യൻ്റ് റോം",
    "Giovanni Paolo Panini": "ജോവാന്നി പൗലോ പാനിനി",
    "Marie Emilie Coignet de Courson (1716–1806) with a Dog": "മാരി എമിലി കോയ്ഗ്നെറ്റ് വിത്ത് എ ഡോഗ്",
    "Jean Honoré Fragonard": "ജീൻ ഓണറേ ഫ്രാഗോണാർഡ്",
    "Mars and Venus United by Love": "മാർസ് ആൻഡ് വീനസ് യുണൈറ്റഡ് ബൈ ലവ്",
    "Paolo Veronese (Paolo Caliari)": "പൗലോ വെറോണീസ്",
    "The Supper at Emmaus": "ദി സപ്പർ അറ്റ് എമ്മാവൂസ്",
    "Velázquez (Diego Rodríguez de Silva y Velázquez)": "വെലാസ്ക്വസ്",
    "The Public Viewing David's \"Coronation\" at the Louvre": "ദി പബ്ലിക് വ്യൂവിംഗ് ഡേവിഡ്സ് കൊറോണേഷൻ",
    "Louis Léopold Boilly": "ലൂയിസ് ലിയോപോൾഡ് ബോയിലി",
    "Virgin and Child with Saint Anne": "വിർജിൻ ആൻഡ് ചൈൽഡ് വിത്ത് സെയിൻ്റ് ആൻ",
    "Albrecht Dürer": "ആൽബ്രെക്റ്റ് ഡ്യൂറർ",
    "The Meditation on the Passion": "ദി മെഡിറ്റേഷൻ ഓൺ ദി പാഷൻ",
    "Vittore Carpaccio": "വിറ്റോറെ കാർപാച്ചിയോ",
    "The Lamentation": "ദി ലാമൻ്റേഷൻ",
    "Ludovico Carracci": "ലൂഡോവിക്കോ കരാച്ചി",
    "Marie Joséphine Charlotte du Val d'Ognes (1786–1868)": "മാരി ജോസഫിൻ ഷാർലറ്റ് ഡു വാൽ ഡി ഒഗ്നെസ്",
    "Marie Denise Villers": "മാരി ഡെനിസ് വില്ലേഴ്സ്",
    "Elizabeth Farren (born about 1759, died 1829), Later Countess of Derby": "എലിസബത്ത് ഫാരൻ",
    "Sir Thomas Lawrence": "സർ തോമസ് ലോറൻസ്",
    "Captain George K. H. Coussmaker (1759–1801)": "ക്യാപ്റ്റൻ ജോർജ് കൗസ്മേക്കർ",
    "Sir Joshua Reynolds": "സർ ജോഷ്വ റെയ്നോൾഡ്സ്",
    "Lute Player": "ല്യൂട്ട് പ്ലെയർ",
    "Valentin de Boulogne": "വാലൻ്റിൻ ഡി ബൊലോൺ",
    "Charles Maurice de Talleyrand Périgord (1754–1838), Prince de Bénévent": "ചാൾസ് മൗറീസ് ഡി ടാലിറാൻഡ്",
    "The Apotheosis of the Spanish Monarchy": "ദി അപ്പോത്തിയോസിസ് ഓഫ് ദി സ്പാനിഷ് മൊണാർക്കി",
    "Giovanni Battista Tiepolo": "ജോവാന്നി ബാറ്റിസ്റ്റ ടിയോപോളോ",
    "Benjamin Franklin (1706–1790)": "ബെഞ്ചമിൻ ഫ്രാങ്ക്ലിൻ",
    "Joseph Siffred Duplessis": "ജോസഫ് സിഫ്രെഡ് ഡ്യൂപ്ലെസിസ്",
    "Wall painting: Polyphemus and Galatea in a landscape, from the imperial villa at Boscotrecase": "വാൾ പെയിൻ്റിംഗ്: പോളിഫെമസ് ആൻഡ് ഗലാറ്റിയ",
    "Unknown Artist": "അജ്ഞാതനായ കലാകാരൻ",
    "Schloss Milkel in Moonlight": "ഷ്ലോസ് മിൽക്കൽ ഇൻ മൂൺലൈറ്റ്",
    "Carl Gustav Carus": "കാൾ ഗുസ്താവ് കാറസ്",
    "Shakyamuni triad": "ശാക്യമുനി ട്രയാഡ്",
    "Unidentified artist": "തിരിച്ചറിയാത്ത കലാകാരൻ",
    "Wall painting from Room H of the Villa of P. Fannius Synistor at Boscoreale": "വാൾ പെയിൻ്റിംഗ് ഫ്രം റൂം എച്ച്",
    "Beauty of the Kanbun Era": "ബ്യൂട്ടി ഓഫ് ദി കാൻബൺ എറ",
    "Portrait of Yun Dongseom (1710–1795)": "പോർട്രെയിറ്റ് ഓഫ് യുൻ ഡോങ്സോം",
    "Bamboo in the Wind": "ബാംബൂ ഇൻ ദി വിൻഡ്",
    "Yi Jeong (artist name: Taneun)": "യി ജിയോങ് (താനിയുൻ)",
    "The Christ Child with Saints Boris and Gleb": "ദി ക്രൈസ്റ്റ് ചൈൽഡ് വിത്ത് സെയിൻ്റ്സ് ബോറിസ് ആൻഡ് ഗ്ലെബ്",
    "Russian Painter": "റഷ്യൻ പെയിൻ്റർ",
    "Snuffbox": "സ്നഫ്ബോക്സ്",
    "A. P. C., Switzerland": "എ. പി. സി., സ്വിറ്റ്സർലൻഡ്",
    "The Dream of Aeneas": "ദി ഡ്രീം ഓഫ് എനിയാസ്",
    "Salvator Rosa": "സാൽവറ്റോർ റോസ",
    "Head of an Old Woman": "ഹെഡ് ഓഫ് ആൻ ഓൾഡ് വുമൺ",
    "Orazio Borgianni": "ഒറാസിയോ ബോർജിയാനി",
    "Two Children Teasing a Cat": "ടു ചിൽഡ്രൻ ടീസ്സിംഗ് എ കാറ്റ്",
    "The Abduction of the Sabine Women": "ദി അബ്ഡക്ഷൻ ഓഫ് ദി സബൈൻ വുമൺ",
    "The Birth of the Virgin": "ദി ബർത്ത് ഓഫ് ദി വിർജിൻ",
    "Fra Carnevale (Bartolomeo di Giovanni Corradini)": "ഫ്രാ കാർനെവാലെ",
    "Venus and Adonis": "വീനസ് ആൻഡ് അഡോണിസ്",
    "Titian (Tiziano Vecellio)": "ടിഷ്യൻ (ടിസിയാനോ വെസെല്ലിയോ)",
    "Marcantonio Pasqualini (1614–1691) Crowned by Apollo": "മാർക്കൻ്റോണിയോ പാസ്ക്വാലിനി ക്രൗൺഡ് ബൈ അപ്പോളോ",
    "Andrea Sacchi": "ആൻഡ്രിയ സാക്കി",
    "Wheat Fields": "വീറ്റ് ഫീൽഡ്സ്",
    "Jacob van Ruisdael": "ജേക്കബ് വാൻ റൂയിസ്ഡേൽ",
    "Filippo Archinto (born about 1500, died 1558), Archbishop of Milan": "ഫിലിപ്പോ ആർക്കിൻ്റോ",
    "Charles Maurice de Talleyrand Périgord (1754–1838), Prince de Talleyrand": "ചാൾസ് മൗറീസ് ഡി ടാലിറാൻഡ്",
    "Pierre Paul Prud'hon": "പിയറി പോൾ പ്രൂഡ്ഹോൺ",
    "The Last Communion of Saint Jerome": "ദി ലാസ്റ്റ് കമ്മ്യൂണിയൻ ഓഫ് സെയിൻ്റ് ജെറോം",
    "Botticelli (Alessandro di Mariano Filipepi)": "ബോട്ടിസെല്ലി",
    "Duccio di Buoninsegna": "ഡുച്ചിയോ ഡി ബുവോനിൻസെഗ്ന",
    "Madonna and Child Enthroned with Two Angels": "മഡോണ ആൻഡ് ചൈൽഡ് എൻത്രോൺഡ് വിത്ത് ടു ഏഞ്ചൽസ്",
    "Fra Filippo Lippi": "ഫ്രാ ഫിലിപ്പോ ലിപ്പി",
    "Pietà": "പിയേത്ത",
    "Juan de Valdés Leal": "ജുവാൻ ഡി വാൽഡെസ് ലീൽ",
    "Saint Christopher and the Infant Christ": "സെയിൻ്റ് ക്രിസ്റ്റഫർ ആൻഡ് ദി ഇൻഫൻ്റ് ക്രൈസ്റ്റ്",
    "Domenico Ghirlandaio (Domenico Bigordi)": "ഡൊമെനിക്കോ ഗിർലാൻഡയോ",
    "Wall painting from the west wall of Room L of the Villa of P. Fannius Synistor at Boscoreale": "വാൾ പെയിൻ്റിംഗ് ഫ്രം ദി വെസ്റ്റ് വാൾ",
    "Bamboo Shoots": "ബാംബൂ ഷൂട്ട്സ്",
    "Shokusanjin (Ōta Nanpo)": "ഷോകുസാൻജിൻ (ഓട നാൻപോ)",
    "Jacob Willemsz van Veen (1456–1535), the Artist's Father": "ജേക്കബ് വില്ലംസ് വാൻ വീൻ",
    "Maarten van Heemskerck": "മാർട്ടൻ വാൻ ഹീംസ്കെർക്ക്",
    "Self-Portrait with Two Pupils, Marie Gabrielle Capet (1761–1818) and Marie Marguerite Carraux de Rosemond (1765–1788)": "സെൽഫ്-പോർട്രെയിറ്റ് വിത്ത് ടു പ്യൂപ്പിൾസ്",
    "Adélaïde Labille-Guiard": "അഡ്‌ലെയ്ഡ് ലാബിൽ-ഗിയാർഡ്",
    "Young Lady in 1866": "യംഗ് ലേഡി ഇൻ 1866",
    "Edouard Manet": "എഡ്വാർഡ് മാനെറ്റ്",
    "The Crucifixion": "ദി ക്രൂസിഫിക്ഷൻ",
    "Pietro Lorenzetti": "പിയട്രോ ലോറെൻസെറ്റി",
    "Virgin and Child": "വിർജിൻ ആൻഡ് ചൈൽഡ്",
    "Bartolomé Estebán Murillo": "ബാർട്ടോലോമെ എസ്റ്റെബാൻ മുറില്ലോ",
    "Study of a Young Woman": "സ്റ്റഡി ഓഫ് എ യംഗ് വുമൺ",
    "Johannes Vermeer": "ജോഹന്നാസ് വെർമീർ",
    "Hermann von Wedigh III (died 1560)": "ഹെർമൻ വോൺ വെഡിഗ് III",
    "Hans Holbein the Younger": "ഹാൻസ് ഹോൾബെയിൻ ദി യംഗർ",
    "James Stuart (1612–1655), Duke of Richmond and Lennox": "ജെയിംസ് സ്റ്റുവർട്ട്",
    "The Immaculate Conception": "ദി ഇമ്മാക്കുലേറ്റ് കൺസെപ്ഷൻ",
    "Venus and Cupid": "വീനസ് ആൻഡ് ക്യൂപിഡ്",
    "Lorenzo Lotto": "ലോറെൻസോ ലോട്ടോ",
    "Juan de Pareja (ca. 1608–1670)": "ജുവാൻ ഡി പരേജ",
    "The Young Virgin": "ദി യംഗ് വിർജിൻ",
    "Francisco de Zurbarán": "ഫ്രാൻസിസ്കോ ഡി സുർബറാൻ",
    "A Musician and His Daughter": "എ മ്യൂസിഷ്യൻ ആൻഡ് ഹിസ് ഡോട്ടർ",
    "Thomas de Keyser": "തോമസ് ഡി കെയ്‌സർ",
    "Madonna and Child Enthroned with Saints Mary Magdalen and John the Baptist": "മഡോണ ആൻഡ് ചൈൽഡ് എൻത്രോൺഡ് വിത്ത് സെയിൻ്റ്സ് മേരി മാഗ്ഡലിൻ ആൻഡ് ജോൺ ദി ബാപ്റ്റിസ്റ്റ്",
    "Giuliano di Piero di Simone Bugiardini": "ജൂലിയാനോ ഡി പിയറോ ഡി സിമോൺ ബുജിയാർഡിനി",
    "Portrait of a Man, Said to be Christopher Columbus (born about 1446, died 1506)": "പോർട്രെയിറ്റ് ഓഫ് എ മാൻ, സെഡ് ടു ബി ക്രിസ്റ്റഫർ കൊളംബസ്",
    "Sebastiano del Piombo (Sebastiano Luciani)": "സെബാസ്റ്റിയാനോ ഡെൽ പിയോംബോ",
    "Bamboo in Snow": "ബാംബൂ ഇൻ സ്നോ",
    "Dapeng Zhengkun (Taihō Shōkon)": "ഡാപെങ് ഷെങ്‌കുൻ",
    "The Sackville Children": "ദി സാക്വിൽ ചിൽഡ്രൻ",
    "John Hoppner": "ജോൺ ഹോപ്നർ",
    "Madame Grand (Noël Catherine Vorlée, 1761–1835)": "മാഡം ഗ്രാൻഡ്",
    "The Adoration of the Magi": "ദി അഡോറേഷൻ ഓഫ് ദി മാഗി",
    "Quinten Massys": "ക്വിൻ്റൻ മാസ്സിസ്",

    'Islamic Art': 'ഇസ്ലാമിക് കല',
    'European Paintings': 'യൂറോപ്യൻ ചിത്രകല',
    'European Sculpture and Decorative Arts': 'യൂറോപ്യൻ ശിൽപങ്ങളും അലങ്കാര കലകളും',
    'Greek and Roman Art': 'ഗ്രീക്ക്, റോമൻ കല',
    'Asian Art': 'ഏഷ്യൻ കല',
    
    'Oil on canvas': 'കാൻവാസിൽ എണ്ണച്ചായം',
    'Oil on wood': 'തടിയിൽ എണ്ണച്ചായം',
    'Fresco': 'ഫ്രെസ്കോ',
    'Tempera and gold on wood': 'തടിയിൽ ടെമ്പറയും സ്വർണ്ണവും',
    'Tempera on wood, gold ground': 'തടിയിൽ ടെമ്പറയും സ്വർണ്ണ പശ്ചാത്തലവും',
    'Oil and tempera on wood': 'തടിയിൽ എണ്ണച്ചായവും ടെമ്പറയും',
    'Tempera and oil on wood': 'തടിയിൽ ടെമ്പറയും എണ്ണച്ചായവും',
    'Tempera and gold leaf on wood': 'തടിയിൽ ടെമ്പറയും സ്വർണ്ണ ഇലകളും',
    'Oil and gold on oak': 'ഓക്ക് തടിയിൽ എണ്ണച്ചായവും സ്വർണ്ണവും',
    'Hanging scroll; color and gold on silk': 'സിൽക്കിൽ നിറങ്ങളും സ്വർണ്ണവും',
    'Hanging scroll; ink, color, and gold on paper': 'കടലാസിൽ മഷി, നിറം, സ്വർണ്ണം',
    'Hanging scroll; ink and color on silk': 'സിൽക്കിൽ മഷിയും നിറവും',
    'Hanging scroll; ink on silk': 'സിൽക്കിൽ മഷി',
    'Pencil, ink, and opaque watercolor on paper': 'കടലാസിൽ പെൻസിൽ, മഷി, വാട്ടർകോളർ',
    
    'Unknown Artist': 'അജ്ഞാതനായ കലാകാരൻ',
    'Unknown Date': 'അജ്ഞാതമായ തിയ്യതി',
    'Unknown Medium': 'അജ്ഞാതമായ മീഡിയം',
    'Unknown Department': 'അജ്ഞാതമായ വിഭാഗം'
};

function translateValue(val) {
    if (currentLang !== 'ml') return val;
    let str = String(val);
    if (valueTranslations[str]) return valueTranslations[str];
    
    if (str.includes('ca.')) str = str.replace('ca.', 'ഏകദേശം');
    if (str.includes('century')) str = str.replace('century', 'നൂറ്റാണ്ട്');
    
    return str;
}

function updateLanguage(lang) {
    document.documentElement.lang = lang;
    currentLang = lang;
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[lang] && translations[lang][key]) {
            if (el.tagName === 'INPUT' && el.type === 'text') {
                el.placeholder = translations[lang][key];
            } else {
                el.innerHTML = translations[lang][key];
            }
        }
    });

    document.querySelectorAll('#lang-en, #lang-ml').forEach(btn => btn.classList.remove('active'));
    document.getElementById(`lang-${lang}`).classList.add('active');
    
    // Update dynamic texts
    if (document.getElementById('score-label')) {
        document.getElementById('score-label').innerText = translations[lang].scoreText + ": ";
    }
    if (document.getElementById('prompt-text')) {
        document.getElementById('prompt-text').innerHTML = translations[lang].promptText.replace("NOT", '<strong style="color:#ff9800;">NOT</strong>').replace("ബന്ധമില്ലാത്തത്?", '<strong style="color:#ff9800;">ബന്ധമില്ലാത്തത്?</strong>');
    }
    if (document.getElementById('next-btn')) {
        document.getElementById('next-btn').innerText = translations[lang].nextPainting;
    }
    
    // update modal if it's open
    const modalTitle = document.getElementById('modal-title');
    if (modalTitle.innerText === translations['en'].correct || modalTitle.innerText === translations['ml'].correct) {
        modalTitle.innerText = translations[lang].correct;
    } else if (modalTitle.innerText === translations['en'].incorrect || modalTitle.innerText === translations['ml'].incorrect) {
        modalTitle.innerText = translations[lang].incorrect;
    }
}

document.getElementById('lang-en').addEventListener('click', () => updateLanguage('en'));
document.getElementById('lang-ml').addEventListener('click', () => updateLanguage('ml'));

// Lounge logic
let isGameVisible = false;

document.getElementById('play-btn').addEventListener('click', () => {
    if (typeof Sounds !== 'undefined') Sounds.play('click');
    document.getElementById('start-screen').classList.add('hidden');
    document.getElementById('game-container').classList.remove('hidden');
    isGameVisible = true;
    
    if (allPaintings.length > 0 && !currentPainting) {
        startRound();
    }
});

// Pause Logic
const pauseTopBtn = document.getElementById('pause-top-btn');
const pauseOverlay = document.getElementById('pause-overlay');
const resumeBtn = document.getElementById('resume-btn');
const quitBtn = document.getElementById('quit-btn');

if (pauseTopBtn) {
    pauseTopBtn.addEventListener('click', () => {
        if (typeof Sounds !== 'undefined') Sounds.play('click');
        pauseOverlay.classList.remove('hidden');
    });
}
if (resumeBtn) {
    resumeBtn.addEventListener('click', () => {
        if (typeof Sounds !== 'undefined') Sounds.play('click');
        pauseOverlay.classList.add('hidden');
    });
}
if (quitBtn) {
    quitBtn.addEventListener('click', () => {
        if (typeof Sounds !== 'undefined') Sounds.play('click');
        pauseOverlay.classList.add('hidden');
        document.getElementById('game-container').classList.add('hidden');
        document.getElementById('start-screen').classList.remove('hidden');
        isGameVisible = false;
        score = 0;
        scoreElement.innerText = score;
    });
}

// Game logic
let allPaintings = [];
let score = 0;
let currentPainting = null;
let currentOddOneOut = null;
let isWaitingForNext = false;

const imgElement = document.getElementById('painting-img');
const loadingIndicator = document.getElementById('loading-indicator');
const optionsContainer = document.getElementById('options-container');
const scoreElement = document.getElementById('score');
const resultModal = document.getElementById('result-modal');
const modalTitle = document.getElementById('modal-title');
const modalPaintingTitle = document.getElementById('modal-painting-title');
const modalDescription = document.getElementById('modal-description');
const nextBtn = document.getElementById('next-btn');

function loadPaintings() {
    try {
        allPaintings = typeof allPaintingsData !== 'undefined' ? allPaintingsData : [];
        if (isGameVisible && !currentPainting) {
            startRound();
        }
    } catch (error) {
        console.error("Failed to load paintings:", error);
        if (loadingIndicator) {
            loadingIndicator.innerText = translations[currentLang] ? translations[currentLang].incorrect : "Error loading data.";
        }
    }
}

function getOrientation() {
    return window.innerWidth > window.innerHeight ? 'landscape' : 'portrait';
}

function startRound() {
    try {
        if (allPaintings.length === 0) return;
        isWaitingForNext = false;

        const targetOrientation = getOrientation();
        let pool = allPaintings.filter(p => p.orientation === targetOrientation);
        
        if (pool.length === 0) pool = allPaintings;

        currentPainting = pool[Math.floor(Math.random() * pool.length)];

        imgElement.style.opacity = 0;
        loadingIndicator.style.display = 'block';
        loadingIndicator.innerText = 'Loading image...';
        
        imgElement.onload = () => {
            loadingIndicator.style.display = 'none';
            imgElement.style.opacity = 1;
        };
        imgElement.onerror = () => {
            loadingIndicator.innerText = 'Error loading image!';
            imgElement.style.opacity = 1;
        };
        imgElement.src = currentPainting.image;

        generateOptions();
    } catch (e) {
        loadingIndicator.innerText = 'Error in startRound: ' + e.message;
    }
}

function generateOptions() {
    const categories = ["artist", "year", "medium", "movement"];
    
    // Safely check and trim values
    const validCategories = categories.filter(c => currentPainting[c] && String(currentPainting[c]).trim() !== "");
    
    if(validCategories.length === 0) {
        // Fallback if painting has no data somehow
        setTimeout(startRound, 100);
        return;
    }

    const oddCategory = validCategories[Math.floor(Math.random() * validCategories.length)];
    
    let correctCategories = validCategories.filter(c => c !== oddCategory);
    if (correctCategories.length > 3) {
        correctCategories = correctCategories.slice(0, 3);
    } else if (correctCategories.length < 3) {
        // Pad with other categories if needed
        const remaining = categories.filter(c => c !== oddCategory && !correctCategories.includes(c));
        while(correctCategories.length < 3 && remaining.length > 0) {
            correctCategories.push(remaining.pop());
        }
    }

    // Prepare correct values string
    const correctValues = correctCategories.map(c => {
        let val = currentPainting[c];
        return val ? String(val) : "Unknown";
    });
    
    let wrongValue = "";
    let attempts = 0;
    while(attempts < 100) {
        const randomPainting = allPaintings[Math.floor(Math.random() * allPaintings.length)];
        const val = randomPainting[oddCategory];
        if (val && String(val) !== String(currentPainting[oddCategory]) && !correctValues.includes(String(val))) {
            wrongValue = String(val);
            break;
        }
        attempts++;
    }
    
    if (!wrongValue) wrongValue = "Unknown " + oddCategory;
    currentOddOneOut = wrongValue;

    let options = [...correctValues, wrongValue];
    
    // Shuffle options array
    for (let i = options.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [options[i], options[j]] = [options[j], options[i]];
    }

    optionsContainer.innerHTML = "";
    options.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.innerText = translateValue(opt);
        btn.dataset.val = opt;
        btn.onclick = () => {
            if (typeof Sounds !== 'undefined') Sounds.play('click');
            handleGuess(opt, btn);
        };
        optionsContainer.appendChild(btn);
    });
}

function handleGuess(guess, btn) {
    if (isWaitingForNext) return;
    isWaitingForNext = true;

    const isWin = guess === currentOddOneOut;
    
    const buttons = optionsContainer.querySelectorAll('.option-btn');
    buttons.forEach(b => {
        if (b.dataset.val === String(currentOddOneOut)) {
            b.classList.add('correct');
        } else if (b === btn && !isWin) {
            b.classList.add('wrong');
        }
    });

    if (isWin) {
        if (typeof Sounds !== 'undefined') Sounds.play('win');
        score++;
        scoreElement.innerText = score;
        modalTitle.innerText = translations[currentLang].correct;
        modalTitle.className = "modal-title win";
    } else {
        if (typeof Sounds !== 'undefined') Sounds.play('lose');
        score = 0;
        scoreElement.innerText = score;
        modalTitle.innerText = translations[currentLang].incorrect;
        modalTitle.className = "modal-title loss";
    }

    modalPaintingTitle.innerText = currentPainting.title;
    
    let desc = "";
    if (currentLang === 'ml') {
        let titleMl = translateValue(currentPainting.title) || currentPainting.title;
        let artistMl = currentPainting.artist ? translateValue(currentPainting.artist) : "";
        let yearMl = currentPainting.year ? translateValue(currentPainting.year) : "";
        let mediumMl = currentPainting.medium ? translateValue(currentPainting.medium) : "";
        let movementMl = currentPainting.movement ? translateValue(currentPainting.movement) : "";
        
        desc = `${titleMl}`;
        if (artistMl) desc += ` വരച്ചത് ${artistMl} ആണ്`;
        if (yearMl) desc += ` (${yearMl})`;
        desc += ".";
        if (mediumMl) desc += ` ഇത് വരയ്ക്കാൻ ഉപയോഗിച്ചത് ${mediumMl} ആണ്.`;
        if (movementMl) desc += ` ഇത് ${movementMl} ചിത്രകലയുമായി ബന്ധപ്പെട്ടിരിക്കുന്നു.`;
    } else {
        let descParts = [];
        if (currentPainting.artist) descParts.push(`was painted by ${currentPainting.artist}`);
        if (currentPainting.year) descParts.push(`in ${currentPainting.year}`);
        if (currentPainting.medium) descParts.push(`using ${currentPainting.medium}`);
        
        desc = `${currentPainting.title} ` + descParts.join(' ') + ".";
        if (currentPainting.movement) {
            desc += ` It is associated with the ${currentPainting.movement} movement.`;
        }
    }
    
    if(!isWin) {
        const oddText = currentLang === 'ml' ? `വ്യത്യസ്തമായത് "${translateValue(currentOddOneOut)}" ആയിരുന്നു.\n\n` : `The odd one out was "${currentOddOneOut}".\n\n`;
        desc = oddText + desc;
    }

    modalDescription.innerText = desc;

    setTimeout(() => {
        resultModal.classList.remove('hidden');
    }, 800);
}

nextBtn.addEventListener('click', () => {
    if (nextBtn.disabled) return;
    nextBtn.disabled = true;
    if (typeof Sounds !== 'undefined') Sounds.play('click');
    resultModal.classList.add('hidden');
    setTimeout(() => {
        startRound();
        nextBtn.disabled = false;
    }, 300);
});

window.addEventListener('resize', () => {
    // Optional CSS handling
});

// Initialize
updateLanguage('en');
loadPaintings();
