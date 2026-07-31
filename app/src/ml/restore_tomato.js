const fs = require('fs');

const missing = {
  "tomato_early_blight": {
    "id": "tomato_early_blight",
    "cropType": "tomato",
    "name": "Tomato Early Blight",
    "symptoms": [
      "Dark brown circular spots with concentric rings (target-board pattern) on lower leaves",
      "Yellow halo surrounding the brown lesions",
      "Lesions merge causing large blighted areas; severely affected leaves turn yellow and drop",
      "Stem lesions appear as dark, slightly sunken areas near soil line in seedlings (collar rot)"
    ],
    "severityDefault": "moderate",
    "explanation": "The distinctive concentric ring pattern on older leaves is the key visual cue — it mimics a target or bull's-eye, caused by the fungus Alternaria solani expanding outward as it kills host tissue. Infections typically start on the most mature (lowest) leaves, which is another diagnostic indicator.",
    "remedy": {
      "steps": [
        "Remove and destroy all visibly infected leaves immediately — do not compost them",
        "Apply neem oil spray (2% concentration — 20ml per litre of water with a few drops of liquid soap as emulsifier) every 7–10 days, starting before symptoms are widespread",
        "Alternatively, spray copper-based Bordeaux mixture (1% concentration) as an organic fungicide",
        "Mulch around the base of plants to prevent soil splash, which spreads fungal spores upward",
        "Water at the base of the plant (drip or furrow), not overhead, to keep foliage dry"
      ],
      "preventiveTips": [
        "Use certified disease-free seeds or resistant varieties (e.g., Arka Rakshak, Arka Samrat)",
        "Follow crop rotation — do not grow tomato, potato, or other Solanaceae in the same plot for at least 2–3 seasons",
        "Maintain adequate plant spacing (45–60 cm) for air circulation to reduce humidity around leaves",
        "Apply potassium-rich fertilizer to strengthen plant cell walls against fungal penetration",
        "Scout fields weekly from transplanting; early intervention prevents rapid spread"
      ]
    }
  },
  "tomato_late_blight": {
    "id": "tomato_late_blight",
    "cropType": "tomato",
    "name": "Tomato Late Blight",
    "symptoms": [
      "Pale green to brown water-soaked patches on leaf margins and tips, rapidly darkening",
      "White cottony mold visible on leaf undersides in humid conditions (early morning)",
      "Stem turns dark brown/black; infected fruit shows firm, brown, greasy-looking lesions",
      "Entire plant can collapse within days in warm, wet weather"
    ],
    "severityDefault": "severe",
    "explanation": "Late blight (Phytophthora infestans) progresses far faster than early blight — the water-soaked, greasy appearance of lesions and white sporulation on the leaf underside distinguish it. It requires wet, cool conditions (15–22°C) to spread, and a single infected plant can devastate a field rapidly.",
    "remedy": {
      "steps": [
        "Act immediately — late blight spreads extremely rapidly; delay of 24–48 hours can mean losing an entire field",
        "Remove and bag (do not compost) all heavily infected plants or branches; dispose away from the field",
        "Apply copper hydroxide or copper oxychloride spray (0.3% — 3g per litre) covering both leaf surfaces thoroughly",
        "Spray Trichoderma viride biological fungicide (4–5g per litre) as an organic alternative or supplement",
        "Repeat sprays every 5–7 days while wet conditions persist"
      ],
      "preventiveTips": [
        "Destroy all volunteer tomato and potato plants from previous seasons",
        "Improve drainage and avoid overhead irrigation to minimize leaf wetness duration"
      ]
    }
  }
};

const curr = require('c:\\Pipe Line\\PranNadi\\app\\src\\data\\remedies\\remedies.en.json');
Object.assign(curr, missing);
fs.writeFileSync('c:\\Pipe Line\\PranNadi\\app\\src\\data\\remedies\\remedies.en.json', JSON.stringify(curr, null, 2));
console.log('Restored missing tomato blights. Total entries: ' + Object.keys(curr).length);
