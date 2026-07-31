const fs = require('fs');

const remediesPart2 = {
  "potato_early_blight": {
    "id": "potato_early_blight",
    "cropType": "potato",
    "name": "Potato Early Blight",
    "symptoms": [
      "Dark brown to black spots with concentric rings (target pattern) on older leaves",
      "Yellowing of leaf tissue around the spots",
      "Tuber lesions are dark, sunken, and circular with raised margins",
      "Underlying tuber tissue becomes brown, dry, and corky"
    ],
    "severityDefault": "moderate",
    "explanation": "Caused by Alternaria solani. Like tomato early blight, it starts on the lower canopy. It thrives under alternating wet and dry conditions and weakens the plant, reducing tuber yield and quality. Infection of the tubers typically happens at harvest when they contact infected foliage.",
    "remedy": {
      "steps": [
        "Apply a protective fungicide (e.g., chlorothalonil or mancozeb) when conditions favor disease, especially during tuber bulking",
        "Kill vines completely at least 14 days before harvest to allow the skin to set and the fungus to die off on the foliage",
        "Avoid harvesting in wet conditions or digging tubers through green, infected vines"
      ],
      "preventiveTips": [
        "Plant certified, disease-free seed potatoes",
        "Practice a 3-4 year crop rotation away from solanaceous crops",
        "Maintain adequate nitrogen and phosphorus levels to keep plants vigorous and delay senescence"
      ]
    }
  },
  "potato_late_blight": {
    "id": "potato_late_blight",
    "cropType": "potato",
    "name": "Potato Late Blight",
    "symptoms": [
      "Large, irregularly shaped, water-soaked, dark green or brown spots on leaves",
      "White fungal growth on the underside of leaves in humid mornings",
      "Dark brown to purplish lesions on stems",
      "Tubers develop firm, reddish-brown, granular rot under the skin"
    ],
    "severityDefault": "severe",
    "explanation": "Caused by Phytophthora infestans (the pathogen responsible for the Irish Potato Famine). It is explosively fast in cool, wet weather. It destroys foliage rapidly and washes down into the soil to rot the tubers, causing devastating crop losses.",
    "remedy": {
      "steps": [
        "Begin spraying immediately with systemic or translaminar fungicides (e.g., mefenoxam, cymoxanil) if late blight is detected nearby",
        "Destroy any severely infected patches (desiccate or burn vines) instantly to stop spore spread",
        "Do not harvest tubers for at least 2 weeks after all foliage is dead to prevent tuber infection during digging"
      ],
      "preventiveTips": [
        "Destroy all cull piles (waste potatoes) and volunteer potatoes early in the season",
        "Hill up soil well around the base of the plants to protect tubers from spores washing down from the leaves",
        "Use weather-based forecasting models to time preventative fungicide sprays"
      ]
    }
  },
  "potato_healthy": {
    "id": "potato_healthy",
    "cropType": "potato",
    "name": "Healthy Potato Plant",
    "symptoms": [
      "Lush, uniformly green foliage",
      "Strong, upright stems",
      "No spotting, mold, or yellowing on leaves"
    ],
    "severityDefault": "low",
    "explanation": "The potato plant shows no signs of early or late blight, viral mosaic, or other major foliar diseases.",
    "remedy": {
      "steps": [
        "Ensure consistent watering during tuber initiation and bulking",
        "Hill plants periodically to prevent greening of shallow tubers"
      ],
      "preventiveTips": [
        "Avoid over-fertilizing with nitrogen late in the season",
        "Monitor for Colorado potato beetles regularly"
      ]
    }
  },
  "raspberry_healthy": {
    "id": "raspberry_healthy",
    "cropType": "raspberry",
    "name": "Healthy Raspberry Plant",
    "symptoms": [
      "Green, unblemished leaves with serrated edges",
      "Vigorous cane growth",
      "Plump, brightly colored fruit without mold"
    ],
    "severityDefault": "low",
    "explanation": "The raspberry canes appear healthy with no signs of cane blight, rust, or viral infections.",
    "remedy": {
      "steps": [
        "Maintain a 2-3 inch layer of organic mulch around the base",
        "Water consistently, providing 1-2 inches per week during fruit development"
      ],
      "preventiveTips": [
        "Prune out second-year floricanes immediately after they finish fruiting to reduce disease pressure",
        "Ensure good trellis support and air circulation"
      ]
    }
  },
  "soybean_healthy": {
    "id": "soybean_healthy",
    "cropType": "soybean",
    "name": "Healthy Soybean Plant",
    "symptoms": [
      "Broad, green trifoliate leaves",
      "Erect stem structure",
      "Healthy pod development at the nodes without spotting"
    ],
    "severityDefault": "low",
    "explanation": "The soybean plant shows no signs of foliar diseases like rust, frogeye leaf spot, or bacterial blight.",
    "remedy": {
      "steps": [
        "Monitor for aphids and stink bugs during pod fill",
        "Ensure fields have adequate drainage"
      ],
      "preventiveTips": [
        "Use crop rotation and proper plant spacing",
        "Inoculate seeds with Bradyrhizobium japonicum before planting for optimal nitrogen fixation"
      ]
    }
  },
  "squash_powdery_mildew": {
    "id": "squash_powdery_mildew",
    "cropType": "squash",
    "name": "Squash Powdery Mildew",
    "symptoms": [
      "White, powdery, talcum-like spots on both sides of older leaves",
      "Spots expand to cover the entire leaf surface",
      "Leaves turn yellow, then brown and papery",
      "Sunscald on fruit due to loss of leaf canopy"
    ],
    "severityDefault": "moderate",
    "explanation": "Caused by Podosphaera xanthii. Unlike many fungal diseases, it does not require free water to germinate, thriving in high humidity with dry foliage. It rapidly kills the leaves, weakening the plant, reducing yield, and exposing the fruit to the sun.",
    "remedy": {
      "steps": [
        "Apply organic fungicides like neem oil, potassium bicarbonate, or sulfur at the first sign of white spots (ensure temperatures are below 90°F/32°C to avoid burning leaves)",
        "For severe infections, apply synthetic fungicides (e.g., chlorothalonil or myclobutanil), alternating chemical groups",
        "Remove heavily infected, dying leaves to reduce the spore load"
      ],
      "preventiveTips": [
        "Plant powdery mildew-resistant (PMR) squash varieties",
        "Ensure wide plant spacing to maximize air circulation and sunlight penetration",
        "Control weeds that may harbor the fungus"
      ]
    }
  },
  "strawberry_leaf_scorch": {
    "id": "strawberry_leaf_scorch",
    "cropType": "strawberry",
    "name": "Strawberry Leaf Scorch",
    "symptoms": [
      "Irregular, purplish to brown spots on leaves without a light center",
      "Spots coalesce, making the leaf look 'scorched' or burned",
      "Edges of leaves may curl upward",
      "Similar dark lesions on petioles and fruit stalks"
    ],
    "severityDefault": "moderate",
    "explanation": "Caused by Diplocarpon earlianum. The disease reduces the plant's vigor, making it susceptible to winter injury and reducing the next year's yield. The lack of a white/gray center in the spots differentiates it from leaf spot.",
    "remedy": {
      "steps": [
        "Mow and remove (or burn) the foliage of heavily infected plantings immediately after the last harvest (renovation)",
        "Apply a broad-spectrum fungicide (like captan) starting in early spring if the disease was severe the previous year"
      ],
      "preventiveTips": [
        "Plant resistant or tolerant strawberry varieties",
        "Use drip irrigation to keep foliage dry, rather than overhead sprinklers",
        "Maintain proper plant spacing by thinning runners to allow air circulation"
      ]
    }
  },
  "strawberry_healthy": {
    "id": "strawberry_healthy",
    "cropType": "strawberry",
    "name": "Healthy Strawberry Plant",
    "symptoms": [
      "Vibrant green, trifoliate leaves with clean, toothed edges",
      "No purplish spotting or scorched margins",
      "Healthy white blossoms and developing fruit"
    ],
    "severityDefault": "low",
    "explanation": "The strawberry plant shows no signs of leaf scorch, leaf spot, or grey mold (Botrytis).",
    "remedy": {
      "steps": [
        "Maintain consistent moisture, especially during fruit expansion",
        "Harvest ripe fruit frequently to prevent overripening and rot"
      ],
      "preventiveTips": [
        "Keep a layer of clean straw mulch under the fruit to prevent soil contact",
        "Renovate beds immediately after harvest to ensure strong crown development for next year"
      ]
    }
  },
  "tomato_bacterial_spot": {
    "id": "tomato_bacterial_spot",
    "cropType": "tomato",
    "name": "Tomato Bacterial Spot",
    "symptoms": [
      "Small, dark, greasy, water-soaked spots on leaves",
      "Spots on fruit begin as dark raised scabs, eventually turning brown and sunken",
      "Leaves turn yellow and drop prematurely (defoliation)",
      "General blighting of foliage in severe, wet conditions"
    ],
    "severityDefault": "severe",
    "explanation": "Caused by Xanthomonas bacteria. This pathogen thrives in warm, rainy weather and is highly contagious through splashing water. The fruit lesions make the tomatoes unmarketable, and severe defoliation causes sunscald.",
    "remedy": {
      "steps": [
        "Apply copper-based bactericides combined with mancozeb to slow the spread (bacteria cannot be cured, only managed)",
        "Remove and destroy severely blighted plants immediately",
        "Never work in or walk through the tomato patch when leaves are wet"
      ],
      "preventiveTips": [
        "Use certified disease-free seeds or hot-water treat seeds before planting",
        "Avoid overhead irrigation; use drip lines exclusively",
        "Practice strict 3-4 year crop rotation away from tomatoes and peppers"
      ]
    }
  },
  "tomato_leaf_mold": {
    "id": "tomato_leaf_mold",
    "cropType": "tomato",
    "name": "Tomato Leaf Mold",
    "symptoms": [
      "Pale green to yellow spots on the upper surface of older leaves",
      "Olive-green to brown velvety mold on the corresponding underside of the spots",
      "Infected leaves eventually turn yellow, curl, wither, and drop",
      "Rarely affects fruit or stems directly"
    ],
    "severityDefault": "moderate",
    "explanation": "Caused by Passalora fulva (formerly Fulvia fulva). This disease is highly dependent on high relative humidity (above 85%). It is extremely common in greenhouses and high tunnels with poor ventilation. While it rarely kills the plant directly, massive leaf loss reduces fruit size and yield.",
    "remedy": {
      "steps": [
        "Immediately improve ventilation (roll up high tunnel sides, prune lower leaves, space plants further apart)",
        "Apply fungicides containing chlorothalonil, mancozeb, or copper at the first sign of the disease",
        "Remove and destroy infected crop debris to lower spore count"
      ],
      "preventiveTips": [
        "Plant resistant varieties (many modern greenhouse hybrids carry resistance genes to specific strains)",
        "Water early in the day and keep relative humidity below 80% if growing indoors/under cover",
        "Disinfect greenhouse structures and tools between seasons"
      ]
    }
  },
  "tomato_septoria_leaf_spot": {
    "id": "tomato_septoria_leaf_spot",
    "cropType": "tomato",
    "name": "Septoria Leaf Spot (Tomato)",
    "symptoms": [
      "Numerous small, circular spots on lower leaves with dark borders and tan/gray centers",
      "Tiny black specks (fruiting bodies) visible in the center of the spots",
      "Leaves turn yellow and drop off rapidly",
      "Spots do not affect the fruit, only the leaves and stems"
    ],
    "severityDefault": "severe",
    "explanation": "Caused by Septoria lycopersici. This is one of the most common and destructive foliage diseases of tomatoes. Unlike Early Blight (which has concentric rings), Septoria spots are smaller, more numerous, and have gray centers with black specks. It causes severe defoliation, exposing fruit to sunscald.",
    "remedy": {
      "steps": [
        "Apply a protective fungicide (chlorothalonil, mancozeb, or copper) every 7-10 days to protect uninfected leaves",
        "Remove the lowest, infected leaves to slow upward progression",
        "Do not compost infected leaves; bag and trash them"
      ],
      "preventiveTips": [
        "Mulch heavily around the base of the plant to prevent fungal spores in the soil from splashing onto lower leaves",
        "Stake or cage tomatoes to keep them off the ground",
        "Water at the base using drip irrigation; never wet the foliage"
      ]
    }
  },
  "tomato_spider_mites": {
    "id": "tomato_spider_mites",
    "cropType": "tomato",
    "name": "Two-Spotted Spider Mite",
    "symptoms": [
      "Stippling (tiny yellow or white specks) on the upper surface of leaves",
      "Fine, silk-like webbing on the underside of leaves or between stems",
      "Leaves eventually turn bronze, yellow, and dry up",
      "Tiny, crawling mites (look like moving dust) visible under a magnifying glass"
    ],
    "severityDefault": "moderate",
    "explanation": "Not a disease, but an arachnid pest (Tetranychus urticae). Mites pierce plant cells and suck out the contents. They thrive in hot, dry, dusty conditions. Because they reproduce incredibly fast (a new generation every 5-7 days in hot weather), they can overwhelm a plant quickly.",
    "remedy": {
      "steps": [
        "Spray the plant aggressively with a strong stream of water to knock off mites and break their webbing",
        "Apply horticultural oil, neem oil, or insecticidal soap, ensuring thorough coverage of the *underside* of the leaves",
        "In severe commercial cases, apply a targeted miticide (not a general insecticide, which kills natural predators)"
      ],
      "preventiveTips": [
        "Keep plants well-watered; drought-stressed plants are highly susceptible",
        "Reduce dust around the plants by maintaining ground cover or mulching pathways",
        "Introduce or protect predatory mites (e.g., Phytoseiulus persimilis) as a biological control"
      ]
    }
  },
  "tomato_target_spot": {
    "id": "tomato_target_spot",
    "cropType": "tomato",
    "name": "Target Spot (Tomato)",
    "symptoms": [
      "Small, brown leaf spots with light centers, later developing dark concentric rings",
      "Spots lack the distinct yellow halo typical of early blight",
      "Dark, sunken, circular lesions on the fruit with target-like rings",
      "Significant defoliation starting from the lower canopy"
    ],
    "severityDefault": "severe",
    "explanation": "Caused by Corynespora cassiicola. It looks very similar to Early Blight but attacks both the leaves and the fruit aggressively in tropical and subtropical regions. The fruit lesions make the tomatoes completely unmarketable.",
    "remedy": {
      "steps": [
        "Apply systemic fungicides (e.g., azoxystrobin or difenoconazole) mixed with a protectant (mancozeb) on a 7-14 day schedule",
        "Remove deeply infected leaves and fruit to lower the inoculum load",
        "Improve canopy airflow immediately by pruning"
      ],
      "preventiveTips": [
        "Avoid planting tomatoes near older, infected crops (e.g., papaya or older tomato plantings that harbor the fungus)",
        "Ensure excellent air circulation and avoid overhead watering",
        "Rotate crops and deep plow residue after harvest"
      ]
    }
  },
  "tomato_yellow_leaf_curl_virus": {
    "id": "tomato_yellow_leaf_curl_virus",
    "cropType": "tomato",
    "name": "Tomato Yellow Leaf Curl Virus (TYLCV)",
    "symptoms": [
      "Leaves cup upward and margins turn distinctly yellow",
      "Leaves become significantly smaller, crinkled, and brittle",
      "Severe stunting of the entire plant (bushy appearance)",
      "Flower drop; plant stops producing new fruit"
    ],
    "severityDefault": "severe",
    "explanation": "A devastating viral disease transmitted exclusively by the Silverleaf Whitefly (Bemisia tabaci). If a young plant is infected, it will produce essentially no fruit. The virus is not seed-borne, nor does it spread by touching; it requires the whitefly vector.",
    "remedy": {
      "steps": [
        "There is no cure for a virus-infected plant. You must pull up and destroy the infected plant immediately to stop whiteflies from spreading it to others",
        "Control whitefly populations immediately using systemic insecticides (e.g., imidacloprid), neem oil, or insecticidal soaps",
        "Place yellow sticky traps around the garden to catch and monitor adult whiteflies"
      ],
      "preventiveTips": [
        "Plant TYLCV-resistant tomato varieties (e.g., Tycoon, Sanibel, BHN 589)",
        "Use reflective silver mulch to disorient whiteflies and prevent them from landing",
        "Cover young seedlings with fine insect-exclusion netting until they begin flowering"
      ]
    }
  },
  "tomato_mosaic_virus": {
    "id": "tomato_mosaic_virus",
    "cropType": "tomato",
    "name": "Tomato Mosaic Virus",
    "symptoms": [
      "Light and dark green mottled (mosaic) pattern on leaves",
      "Leaves may be distorted, fern-like, or narrowed",
      "Stunted plant growth and reduced fruit yield",
      "Fruit may have internal browning or uneven ripening"
    ],
    "severityDefault": "severe",
    "explanation": "An extremely contagious viral disease (ToMV / TMV). It spreads mechanically—meaning it is transmitted by hands, tools, or clothing brushing against an infected plant and then a healthy one. It can also be transmitted via tobacco products or infected seeds. There is no cure.",
    "remedy": {
      "steps": [
        "Pull and destroy infected plants immediately (burn them or bag them; do not compost)",
        "Vigorously wash hands with soap and water after handling any infected plant before touching healthy ones",
        "Disinfect all gardening tools (pruners, stakes, cages) with a 10% bleach solution"
      ],
      "preventiveTips": [
        "Do not smoke or handle tobacco products while working with tomatoes",
        "Buy certified disease-free seeds or ToMV-resistant varieties (look for 'T' or 'ToMV' in the disease resistance code)",
        "Avoid working in the garden when plants are wet, as viruses spread more easily in water films"
      ]
    }
  },
  "tomato_healthy": {
    "id": "tomato_healthy",
    "cropType": "tomato",
    "name": "Healthy Tomato",
    "symptoms": [
      "Deep green, slightly fuzzy leaves with no yellowing or spots",
      "Strong, thick main stem",
      "Healthy yellow blossoms and smooth fruit development"
    ],
    "severityDefault": "low",
    "explanation": "The tomato plant appears healthy with no visible signs of fungal blights, bacterial spots, or viral mosaic.",
    "remedy": {
      "steps": [
        "Water consistently at the base of the plant to prevent blossom end rot",
        "Prune lower suckers to maintain good airflow"
      ],
      "preventiveTips": [
        "Stake or cage the plant to keep foliage off the damp soil",
        "Mulch heavily to retain moisture and prevent soil splashing"
      ]
    }
  }
};

fs.writeFileSync('c:\\Pipe Line\\PranNadi\\app\\src\\ml\\remedies_part2.json', JSON.stringify(remediesPart2, null, 2));
console.log('Part 2 written.');
