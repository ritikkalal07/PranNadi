const fs = require('fs');

const remediesPart1 = {
  "apple_scab": {
    "id": "apple_scab",
    "cropType": "apple",
    "name": "Apple Scab",
    "symptoms": [
      "Dull, olive-green to black, velvety spots on leaves",
      "Leaves may twist or pucker",
      "Scabby, dark, cracked lesions on the fruit surface",
      "Premature leaf drop in severe cases"
    ],
    "severityDefault": "moderate",
    "explanation": "Apple scab is caused by the fungus Venturia inaequalis. It thrives in cool, wet spring weather. The velvety dark spots are clusters of fungal spores that spread via rain splash. If left untreated, it severely affects fruit quality and tree vigor.",
    "remedy": {
      "steps": [
        "Rake and destroy fallen leaves in autumn to reduce overwintering spores",
        "Prune trees to improve air circulation and sunlight penetration",
        "Apply a protective fungicide (e.g., captan or myclobutanil) early in the season when buds begin to break",
        "Use sulfur or neem oil sprays organically, applying every 7-10 days during wet periods"
      ],
      "preventiveTips": [
        "Plant scab-resistant apple varieties (e.g., Liberty, Enterprise)",
        "Ensure proper tree spacing to allow rapid drying of foliage after rain"
      ]
    }
  },
  "apple_black_rot": {
    "id": "apple_black_rot",
    "cropType": "apple",
    "name": "Apple Black Rot",
    "symptoms": [
      "Purple spots on leaves that enlarge and develop light tan centers (frog-eye leaf spot)",
      "Dark, sunken, and firm rotted areas on fruit, often starting at the calyx",
      "Rotted fruit eventually mummifies and remains attached to the tree",
      "Reddish-brown cankers on branches"
    ],
    "severityDefault": "severe",
    "explanation": "Caused by the fungus Botryosphaeria obtusa, black rot infects leaves, fruit, and wood. The fungus overwinters in dead wood and mummified fruit, releasing spores during rain. The classic 'frog-eye' leaf spots are a major early warning sign.",
    "remedy": {
      "steps": [
        "Prune out and burn or discard all dead or cankered wood",
        "Remove all mummified fruit from the tree and the ground",
        "Apply a broad-spectrum fungicide (like Mancozeb or Captan) starting from the tight cluster stage",
        "Avoid mechanical injury to the bark to prevent canker formation"
      ],
      "preventiveTips": [
        "Maintain tree health with proper fertilization and watering",
        "Sanitize pruning tools between cuts to avoid spreading the fungus"
      ]
    }
  },
  "apple_cedar_rust": {
    "id": "apple_cedar_rust",
    "cropType": "apple",
    "name": "Cedar Apple Rust",
    "symptoms": [
      "Bright yellow-orange spots on the upper surface of leaves",
      "Tube-like structures on the underside of the leaf spots",
      "Yellowish-orange lesions on the fruit, causing distortion",
      "Premature defoliation in severe cases"
    ],
    "severityDefault": "moderate",
    "explanation": "This is a unique fungal disease (Gymnosporangium juniperi-virginianae) that requires two hosts to complete its life cycle: an apple tree and a juniper/cedar tree. Spores blow from cedar galls in spring to infect apple leaves.",
    "remedy": {
      "steps": [
        "Remove all galls from nearby cedar or juniper trees in late winter before they produce spore horns",
        "Apply protective fungicides (e.g., myclobutanil or sulfur) to apple trees from the pink bud stage until 2-3 weeks after petal fall",
        "Remove heavily infected apple leaves to reduce tree stress"
      ],
      "preventiveTips": [
        "Avoid planting apple trees within a 1-mile radius of Eastern Red Cedar trees if possible",
        "Plant rust-resistant apple varieties (e.g., Freedom, Liberty)"
      ]
    }
  },
  "apple_healthy": {
    "id": "apple_healthy",
    "cropType": "apple",
    "name": "Healthy Apple Tree",
    "symptoms": [
      "Vibrant green, unblemished leaves",
      "Smooth, clean bark",
      "Normal fruit development without spots or rot"
    ],
    "severityDefault": "low",
    "explanation": "The apple leaves show no visible signs of fungal, bacterial, or viral diseases. The tree appears in good health.",
    "remedy": {
      "steps": [
        "Continue regular watering schedule",
        "Apply balanced fertilizer in early spring",
        "Perform routine dormant pruning to maintain structure and airflow"
      ],
      "preventiveTips": [
        "Monitor weekly for early signs of pests like aphids or codling moths",
        "Keep the base of the tree free from excess weed competition"
      ]
    }
  },
  "blueberry_healthy": {
    "id": "blueberry_healthy",
    "cropType": "blueberry",
    "name": "Healthy Blueberry Plant",
    "symptoms": [
      "Bright green leaves without spots or discoloration",
      "Sturdy, productive canes",
      "Healthy fruit set without mummification"
    ],
    "severityDefault": "low",
    "explanation": "The blueberry plant appears robust and free of common diseases like mummy berry or Botrytis blight.",
    "remedy": {
      "steps": [
        "Maintain soil acidity (pH 4.5 to 5.5)",
        "Water consistently, keeping the soil moist but not waterlogged",
        "Apply an acidifying fertilizer (like ammonium sulfate) in early spring"
      ],
      "preventiveTips": [
        "Apply a thick layer of pine bark mulch to retain moisture and keep roots cool",
        "Prune out older canes (over 5-6 years old) to encourage new growth"
      ]
    }
  },
  "cherry_powdery_mildew": {
    "id": "cherry_powdery_mildew",
    "cropType": "cherry",
    "name": "Cherry Powdery Mildew",
    "symptoms": [
      "White, powdery fungal growth on the surface of young leaves and shoots",
      "Leaves may curl upward, distort, and become brittle",
      "Stunted shoot growth",
      "Infected fruit may develop a white web-like coating"
    ],
    "severityDefault": "moderate",
    "explanation": "Caused by Podosphaera clandestina, powdery mildew thrives in dry, warm climates with high humidity. The white powdery substance consists of fungal threads and spores that cover the leaf surface, blocking photosynthesis.",
    "remedy": {
      "steps": [
        "Apply sulfur-based organic fungicides or neem oil at the first sign of mildew",
        "Ensure the canopy is pruned open to allow maximum sunlight and airflow",
        "Avoid excessive nitrogen fertilization, which promotes highly susceptible succulent growth",
        "Apply chemical fungicides (like myclobutanil) if the infection is severe, rotating chemical classes to prevent resistance"
      ],
      "preventiveTips": [
        "Prune heavily infected shoots during the dormant season",
        "Do not overwater or use overhead sprinklers, which can increase humidity in the canopy"
      ]
    }
  },
  "cherry_healthy": {
    "id": "cherry_healthy",
    "cropType": "cherry",
    "name": "Healthy Cherry Tree",
    "symptoms": [
      "Glossy, dark green leaves without curling or spots",
      "Clean fruit development without cracking or mold",
      "No gummy oozing from the bark"
    ],
    "severityDefault": "low",
    "explanation": "The cherry leaves appear healthy with no signs of fungal, bacterial, or viral diseases.",
    "remedy": {
      "steps": [
        "Maintain a deep watering schedule during fruit development",
        "Protect fruit from bird damage using netting"
      ],
      "preventiveTips": [
        "Avoid pruning during wet weather to prevent bacterial canker infections",
        "Apply a dormant oil spray in late winter to smother overwintering pest eggs"
      ]
    }
  },
  "maize_cercospora_leaf_spot": {
    "id": "maize_cercospora_leaf_spot",
    "cropType": "maize",
    "name": "Gray Leaf Spot (Maize)",
    "symptoms": [
      "Small tan spots that elongate into rectangular, blocky brown lesions",
      "Lesions are strictly bounded by leaf veins",
      "Lesions turn grayish in high humidity as the fungus produces spores",
      "Severe infections cause leaves to blight and die, starting from the bottom"
    ],
    "severityDefault": "severe",
    "explanation": "Caused by the fungus Cercospora zeae-maydis. It is one of the most yield-limiting diseases of corn. It thrives in prolonged periods of high humidity and cloudy weather. The blocky, vein-restricted lesions are the key identifier.",
    "remedy": {
      "steps": [
        "Apply a foliar fungicide (e.g., strobilurins or triazoles) at the tasseling (VT) stage to protect the upper canopy",
        "Ensure lower canopy airflow by managing weed growth",
        "Severely infected lower leaves cannot be saved; focus on protecting the ear leaf and leaves above it"
      ],
      "preventiveTips": [
        "Plant resistant or tolerant maize hybrids",
        "Practice crop rotation to a non-host crop for at least one year",
        "Tillage (where appropriate) helps bury infected corn residue, reducing early-season spore loads"
      ]
    }
  },
  "maize_common_rust": {
    "id": "maize_common_rust",
    "cropType": "maize",
    "name": "Maize Common Rust",
    "symptoms": [
      "Small, elongated, brick-red to brownish pustules on both upper and lower leaf surfaces",
      "Pustules rupture the leaf epidermis, releasing powdery reddish spores",
      "Pustules turn black as the corn matures",
      "Leaves may yellow and die prematurely in severe infections"
    ],
    "severityDefault": "moderate",
    "explanation": "Caused by Puccinia sorghi. It is favored by cool (16-25°C) temperatures and high relative humidity. While visually striking, it often arrives too late in the season to cause severe yield loss in mature plants, but can devastate late-planted or susceptible sweet corn.",
    "remedy": {
      "steps": [
        "Fungicide application is usually only economical if the infection reaches the ear leaf before the dough stage",
        "Use a triazole or strobilurin fungicide if severity exceeds threshold levels on upper leaves",
        "Ensure the crop has adequate potassium, which can help mitigate rust severity"
      ],
      "preventiveTips": [
        "Use rust-resistant commercial hybrids (many modern field corn hybrids have excellent resistance)",
        "Plant early in the season to ensure the crop matures before environmental conditions favor severe rust outbreaks"
      ]
    }
  },
  "maize_northern_leaf_blight": {
    "id": "maize_northern_leaf_blight",
    "cropType": "maize",
    "name": "Northern Corn Leaf Blight",
    "symptoms": [
      "Large, cigar-shaped or elliptical grayish-green to tan lesions on leaves",
      "Lesions can be 1 to 6 inches long",
      "In damp weather, dark grayish-black spores appear in the center of lesions",
      "Lesions coalesce, killing large areas of leaf tissue"
    ],
    "severityDefault": "severe",
    "explanation": "Caused by Exserohilum turcicum. The distinct 'cigar-shaped' lesions differentiate it from Gray Leaf Spot. It thrives in moderate temperatures with heavy dews. Loss of leaf tissue reduces the plant's ability to fill grain, leading to significant yield loss if it strikes before silking.",
    "remedy": {
      "steps": [
        "Apply a foliar fungicide prior to or at tasseling if lesions are present on or above the ear leaf",
        "Reduce canopy moisture by optimizing irrigation timing (water in the morning, not evening)"
      ],
      "preventiveTips": [
        "Select hybrids with high resistance ratings for NCLB",
        "Practice crop rotation with non-host crops like soybeans for 1-2 years",
        "Manage crop residue through tillage to accelerate decomposition of the fungus"
      ]
    }
  },
  "maize_healthy": {
    "id": "maize_healthy",
    "cropType": "maize",
    "name": "Healthy Maize",
    "symptoms": [
      "Broad, dark green leaves without significant spots or lesions",
      "Sturdy stalks",
      "Uniform silk and tassel development"
    ],
    "severityDefault": "low",
    "explanation": "The corn leaves show no signs of major fungal blights or rusts.",
    "remedy": {
      "steps": [
        "Continue standard irrigation and nutrient management",
        "Scout weekly for signs of fall armyworms or corn borers"
      ],
      "preventiveTips": [
        "Maintain optimal nitrogen levels during rapid vegetative growth",
        "Keep fields weed-free to prevent competition for nutrients"
      ]
    }
  },
  "grape_black_rot": {
    "id": "grape_black_rot",
    "cropType": "grape",
    "name": "Grape Black Rot",
    "symptoms": [
      "Small, light brown circular spots with dark borders on leaves",
      "Tiny black fungal fruiting bodies (pycnidia) appear in a ring within the leaf spots",
      "Berries turn light brown, then rapidly blacken and shrivel into hard 'mummies'",
      "Elongated black lesions on young shoots"
    ],
    "severityDefault": "severe",
    "explanation": "Caused by Guignardia bidwellii, this is one of the most destructive diseases of grapes. It thrives in warm, wet weather. The infection moves from leaves to the fruit, completely destroying the clusters by turning them into hard, black mummies.",
    "remedy": {
      "steps": [
        "Immediately prune out and destroy infected shoots, leaves, and any mummified fruit",
        "Apply protectant fungicides (like Mancozeb or Myclobutanil) starting when shoots are 4-6 inches long, continuing through early fruit development",
        "Maintain an open canopy to allow rapid drying of foliage after rain"
      ],
      "preventiveTips": [
        "Remove all mummified grapes from the vines and the ground during dormant winter pruning",
        "Ensure excellent weed control under the vines to increase airflow"
      ]
    }
  },
  "grape_esca": {
    "id": "grape_esca",
    "cropType": "grape",
    "name": "Grape Esca (Black Measles)",
    "symptoms": [
      "Tiger-stripe pattern on leaves (yellow or red discoloration between green veins)",
      "Small, dark, purplish-black spots ('measles') on the berries",
      "Sudden wilting or collapse of the entire vine (apoplexy) in mid-summer",
      "White rot in the trunk wood"
    ],
    "severityDefault": "severe",
    "explanation": "Esca is a complex trunk disease caused by a combination of fungi (e.g., Phaeomoniella). It rots the interior wood of the vine, restricting water flow. The classic 'tiger-stripe' leaf pattern is a reaction to toxins produced by the fungi in the trunk. It often kills mature vines.",
    "remedy": {
      "steps": [
        "There is no cure once the trunk is severely infected",
        "If only one arm is infected, prune it off well below the symptomatic wood (check for dark discoloration in the cross-section)",
        "For severely affected vines, trunk renewal (cutting the trunk near the ground to force a new shoot) is required"
      ],
      "preventiveTips": [
        "Protect all large pruning wounds with a fungicidal paste or paint (e.g., thiophanate-methyl)",
        "Delay major pruning until late winter when wound healing is faster and spore release is lower",
        "Avoid making large cuts during wet weather"
      ]
    }
  },
  "grape_leaf_blight": {
    "id": "grape_leaf_blight",
    "cropType": "grape",
    "name": "Grape Leaf Blight",
    "symptoms": [
      "Irregular, dark reddish-brown spots on leaves",
      "Spots coalesce to form large blighted areas, causing the leaf to dry up",
      "Leaves may prematurely drop off",
      "Dark lesions on stems"
    ],
    "severityDefault": "moderate",
    "explanation": "Also known as Isariopsis Leaf Spot, this disease causes significant leaf damage which reduces the vine's photosynthetic capacity, thereby lowering fruit sugar accumulation and weakening the vine for winter.",
    "remedy": {
      "steps": [
        "Apply copper-based fungicides or appropriate chemical fungicides (e.g., captan) when symptoms first appear",
        "Ensure the trellis system allows good air circulation to keep leaves dry"
      ],
      "preventiveTips": [
        "Clean up and burn fallen leaves in the autumn to reduce overwintering inoculum",
        "Prune vines properly to prevent dense, humid canopies"
      ]
    }
  },
  "grape_healthy": {
    "id": "grape_healthy",
    "cropType": "grape",
    "name": "Healthy Grape Vine",
    "symptoms": [
      "Lush, uniform green leaves without significant spotting or striping",
      "Healthy, plump berry development",
      "Vigorous shoot growth"
    ],
    "severityDefault": "low",
    "explanation": "The grape leaves show no signs of major fungal infections or trunk disease toxins.",
    "remedy": {
      "steps": [
        "Continue regular canopy management (shoot positioning, leaf pulling around the fruit zone)",
        "Maintain routine preventative spray programs for powdery mildew"
      ],
      "preventiveTips": [
        "Ensure adequate soil drainage",
        "Test petioles annually for nutrient deficiencies"
      ]
    }
  },
  "orange_greening": {
    "id": "orange_greening",
    "cropType": "orange",
    "name": "Citrus Greening (HLB)",
    "symptoms": [
      "Asymmetrical, blotchy yellow mottling on leaves (crosses the leaf veins)",
      "Yellow shoots and severe fruit drop",
      "Fruits are small, lopsided, remain partially green, and taste bitter/salty",
      "Twigs and branches die back, leading to tree death"
    ],
    "severityDefault": "severe",
    "explanation": "Huanglongbing (HLB) or Citrus Greening is the most devastating citrus disease worldwide. It is caused by the bacterium Candidatus Liberibacter asiaticus, transmitted by the Asian citrus psyllid. The asymmetrical yellow mottling on leaves is the classic sign. There is no cure.",
    "remedy": {
      "steps": [
        "Confirm the diagnosis through laboratory testing if possible",
        "Infected trees must be completely removed and destroyed to prevent the psyllid from spreading the bacteria to healthy trees",
        "Foliar nutritional sprays can prolong the productive life of an infected tree temporarily, but will not cure it"
      ],
      "preventiveTips": [
        "Aggressively control the Asian citrus psyllid vector using systemic insecticides (e.g., imidacloprid) and biological controls",
        "Purchase and plant only certified disease-free citrus trees",
        "Use reflective mulch to deter psyllids from landing"
      ]
    }
  },
  "peach_bacterial_spot": {
    "id": "peach_bacterial_spot",
    "cropType": "peach",
    "name": "Peach Bacterial Spot",
    "symptoms": [
      "Small, water-soaked, purplish spots on leaves",
      "Spots dry up and drop out, creating a 'shot-hole' appearance",
      "Leaves turn yellow and drop prematurely",
      "Deep, dark, pitted lesions and cracking on the fruit surface"
    ],
    "severityDefault": "moderate",
    "explanation": "Caused by Xanthomonas campestris pv. pruni, this bacterium enters through leaf stomata during wet, windy weather. The 'shot-hole' effect on leaves and pitted fruit significantly damages both tree health and crop marketability.",
    "remedy": {
      "steps": [
        "Apply copper-based bactericides (like copper hydroxide) or oxytetracycline during the growing season (note: peaches are highly sensitive to copper, use low rates to avoid phytotoxicity)",
        "Ensure trees are properly fertilized; weak trees are more susceptible",
        "Prune out infected twigs where the bacteria overwinter"
      ],
      "preventiveTips": [
        "Plant highly resistant peach varieties (e.g., Candor, Biscoe, Redhaven)",
        "Establish windbreaks around the orchard, as blowing sand and wind-driven rain create micro-wounds for bacterial entry"
      ]
    }
  },
  "peach_healthy": {
    "id": "peach_healthy",
    "cropType": "peach",
    "name": "Healthy Peach Tree",
    "symptoms": [
      "Long, narrow, vibrant green leaves with intact margins",
      "Smooth fruit development without pitting or scabs",
      "Healthy branch growth without oozing cankers"
    ],
    "severityDefault": "low",
    "explanation": "The peach leaves appear healthy with no signs of bacterial spot or leaf curl.",
    "remedy": {
      "steps": [
        "Continue regular watering and fertilization schedules",
        "Thin excess fruit early in the season to prevent branch breakage and improve fruit size"
      ],
      "preventiveTips": [
        "Apply a dormant copper spray in autumn or early spring to prevent leaf curl",
        "Monitor for peach tree borer at the base of the trunk"
      ]
    }
  },
  "pepper_bacterial_spot": {
    "id": "pepper_bacterial_spot",
    "cropType": "pepper",
    "name": "Pepper Bacterial Spot",
    "symptoms": [
      "Small, water-soaked, greasy spots on leaves, becoming dark brown with yellow halos",
      "Spots often merge, causing the leaf to yellow and drop off",
      "Raised, rough, blister-like scabs on the pepper fruit",
      "Severe defoliation exposes fruit to sunscald"
    ],
    "severityDefault": "severe",
    "explanation": "Caused by Xanthomonas campestris pv. vesicatoria. It is a highly destructive disease in warm, humid climates. Splashing rain spreads the bacteria rapidly. The rough, scabby fruit lesions ruin the crop's market value.",
    "remedy": {
      "steps": [
        "Immediately remove and destroy heavily infected plants",
        "Apply copper fungicides mixed with mancozeb to slow the spread (bacteria easily develop copper resistance, so mixing is essential)",
        "Avoid working in the field when plants are wet"
      ],
      "preventiveTips": [
        "Use certified disease-free seed, or treat seeds with hot water before planting",
        "Use drip irrigation instead of overhead sprinklers to keep foliage dry",
        "Rotate peppers with non-solanaceous crops for at least 2-3 years"
      ]
    }
  },
  "pepper_healthy": {
    "id": "pepper_healthy",
    "cropType": "pepper",
    "name": "Healthy Bell Pepper",
    "symptoms": [
      "Glossy, dark green leaves with smooth edges",
      "Strong stems supporting developing fruit",
      "No spotting, yellowing, or wilting"
    ],
    "severityDefault": "low",
    "explanation": "The pepper plant shows no signs of bacterial spotting, viral mosaic, or fungal blights.",
    "remedy": {
      "steps": [
        "Maintain consistent soil moisture to prevent blossom end rot",
        "Provide stakes or cages to support the weight of heavy fruit"
      ],
      "preventiveTips": [
        "Mulch the base of the plant to retain moisture and suppress weeds",
        "Monitor for aphids and apply insecticidal soap if spotted"
      ]
    }
  }
};

fs.writeFileSync('c:\\Pipe Line\\PranNadi\\app\\src\\ml\\remedies_part1.json', JSON.stringify(remediesPart1, null, 2));
console.log('Part 1 written.');
