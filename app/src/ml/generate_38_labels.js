const fs = require('fs');

const PLANTVILLAGE_CLASSES = [
  "Apple___Apple_scab", "Apple___Black_rot", "Apple___Cedar_apple_rust", "Apple___healthy",
  "Blueberry___healthy",
  "Cherry_(including_sour)___Powdery_mildew", "Cherry_(including_sour)___healthy",
  "Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot", "Corn_(maize)___Common_rust_", "Corn_(maize)___Northern_Leaf_Blight", "Corn_(maize)___healthy",
  "Grape___Black_rot", "Grape___Esca_(Black_Measles)", "Grape___Leaf_blight_(Isariopsis_Leaf_Spot)", "Grape___healthy",
  "Orange___Haunglongbing_(Citrus_greening)",
  "Peach___Bacterial_spot", "Peach___healthy",
  "Pepper,_bell___Bacterial_spot", "Pepper,_bell___healthy",
  "Potato___Early_blight", "Potato___Late_blight", "Potato___healthy",
  "Raspberry___healthy",
  "Soybean___healthy",
  "Squash___Powdery_mildew",
  "Strawberry___Leaf_scorch", "Strawberry___healthy",
  "Tomato___Bacterial_spot", "Tomato___Early_blight", "Tomato___Late_blight", "Tomato___Leaf_Mold", "Tomato___Septoria_leaf_spot", "Tomato___Spider_mites Two-spotted_spider_mite", "Tomato___Target_Spot", "Tomato___Tomato_Yellow_Leaf_Curl_Virus", "Tomato___Tomato_mosaic_virus", "Tomato___healthy"
];

// 1. Generate labels.json
const labelsMap = {};
const diseaseIds = [];

PLANTVILLAGE_CLASSES.forEach((cls, i) => {
  let id = cls.toLowerCase()
    .replace(/_\(including_sour\)/g, '')
    .replace(/_\(maize\)/g, '')
    .replace(/_\(isariopsis_leaf_spot\)/g, '')
    .replace(/_\(citrus_greening\)/g, '_greening')
    .replace(/_\(black_measles\)/g, '_esca')
    .replace(/,_bell/g, '')
    .replace(/___/g, '_')
    .replace(/ gray_leaf_spot/g, '')
    .replace(/ two-spotted_spider_mite/g, '')
    .replace(/_+/g, '_')
    .trim();
  
  if (id.endsWith('_')) id = id.slice(0, -1);
  
  labelsMap[i] = id;
  diseaseIds.push(id);
});

fs.writeFileSync('c:\\Pipe Line\\PranNadi\\app\\src\\ml\\labels.json', JSON.stringify(labelsMap, null, 2));

// 2. Generate stubs for remedies.en.json
let existingRemedies = {};
try {
  existingRemedies = require('c:\\Pipe Line\\PranNadi\\app\\src\\data\\remedies\\remedies.en.json');
} catch (e) {}

const newRemedies = {};

diseaseIds.forEach((id) => {
  if (existingRemedies[id]) {
    newRemedies[id] = existingRemedies[id];
  } else {
    const parts = id.split('_');
    const crop = parts[0];
    const isHealthy = id.includes('healthy');
    const name = parts.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(' ');
    
    newRemedies[id] = {
      id: id,
      cropType: crop,
      name: name,
      symptoms: isHealthy 
        ? ["Vibrant green leaves", "Sturdy stems", "Normal growth rate", "No visible spots or discoloration"]
        : [`Placeholder symptom 1 for ${name}`, `Placeholder symptom 2 for ${name}`],
      severityDefault: isHealthy ? "low" : "moderate",
      explanation: isHealthy 
        ? `The ${crop} plant appears healthy with no visible signs of major fungal, bacterial, or viral diseases.` 
        : `Explanation for ${name} goes here.`,
      remedy: {
        steps: isHealthy
          ? ["Continue regular watering schedule", "Monitor for pests weekly"]
          : [`Apply appropriate treatment for ${name}`],
        preventiveTips: isHealthy
          ? ["Maintain good soil drainage", "Ensure proper spacing between plants"]
          : [`Rotate crops next season`]
      }
    };
  }
});

fs.writeFileSync('c:\\Pipe Line\\PranNadi\\app\\src\\data\\remedies\\remedies.en.json', JSON.stringify(newRemedies, null, 2));

console.log('Successfully generated labels.json and remedies.en.json stubs for ' + diseaseIds.length + ' diseases.');
