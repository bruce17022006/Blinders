// --- The API Key You Just Created ---
// PASTE YOUR KEY HERE. This is the only place it needs to go.
const API_KEY = "AIzaSyCF-NrhXH6tggaVNOtc3jDixYZnhpUh_87n_n8";

const promptTemplate = `
You are a game designer for an educational game about nutrition called "Balanced Bites". Your task is to generate the data for a single game level. The difficulty of the level is determined by the player's current level, which is {{level}}.

Rules for generating the level:
1. Provide a list of exactly 9 ingredients.
2. As the level number increases, introduce more varied and less common ingredients.
3. Each ingredient must have properties for: name, emoji, cost, and a nutrients object with protein, carbs, fiber, and fats.
4. The nutrient values should be realistic.
5. You MUST include 2-3 "trap" ingredients with low cost but high fats or low nutritional value.
6. Calculate and provide a "targets" object with minimum requirements for protein, carbs, and fiber, and a maximum limit for fats.
7. The targets MUST be solvable using a combination of ingredients from the list you provide.
8. **IMPORTANT: The targets should be very easy to achieve. Calculate the maximum possible nutritional values from the best ingredients, then set the minimum targets to be only 10-20% of that maximum. This ensures the player can win by selecting just a few good items.**
9. Calculate and provide a "startingBudget". First, find the optimal combination of ingredients that best meets the nutritional targets with low cost balance both cost and nutritional value. Then,. Calculate the total cost of this optimal combination. The "startingBudget" should be this optimal cost plus a small, realistic buffer (e.g., 10-20 coins), making the puzzle challenging but fair.

Provide your response ONLY as a single, minified JSON object with no other text, comments, or markdown.

The JSON structure must be:
{
  "ingredients": [
    {"id": 1, "name": "...", "emoji": "...", "cost": ..., "nutrients": {"protein": ..., "carbs": ..., "fiber": ..., "fats": ...}},
    {"id": 2, "name": "...", "emoji": "...", "cost": ..., "nutrients": {"protein": ..., "carbs": ..., "fiber": ..., "fats": ...}},
    {"id": 3, "name": "...", "emoji": "...", "cost": ..., "nutrients": {"protein": ..., "carbs": ..., "fiber": ..., "fats": ...}},
    {"id": 4, "name": "...", "emoji": "...", "cost": ..., "nutrients": {"protein": ..., "carbs": ..., "fiber": ..., "fats": ...}},
    {"id": 5, "name": "...", "emoji": "...", "cost": ..., "nutrients": {"protein": ..., "carbs": ..., "fiber": ..., "fats": ...}},
    {"id": 6, "name": "...", "emoji": "...", "cost": ..., "nutrients": {"protein": ..., "carbs": ..., "fiber": ..., "fats": ...}},
    {"id": 7, "name": "...", "emoji": "...", "cost": ..., "nutrients": {"protein": ..., "carbs": ..., "fiber": ..., "fats": ...}},
    {"id": 8, "name": "...", "emoji": "...", "cost": ..., "nutrients": {"protein": ..., "carbs": ..., "fiber": ..., "fats": ...}},
    {"id": 9, "name": "...", "emoji": "...", "cost": ..., "nutrients": {"protein": ..., "carbs": ..., "fiber": ..., "fats": ...}}
  ],
  "targets": {
    "protein": {"min": ...},
    "carbs": {"min": ...},
    "fiber": {"min": ...},
    "fats": {"max": ...}
  },
  "startingBudget": ...
}`;


// --- The Function to Call the API ---
export async function generateLevelData(level) {
  // Use the gemini-1.5-flash model for speed and cost-effectiveness
  const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${API_KEY}`;
  const prompt = promptTemplate.replace('{{level}}', level);

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`API call failed with status: ${response.status}. Body: ${errorBody}`);
    }

    const data = await response.json();
    const jsonString = data.candidates[0].content.parts[0].text;
    
    // The API sometimes wraps the JSON in markdown backticks, so we clean it up.
    const cleanedJsonString = jsonString.replace(/^```json\n/, '').replace(/\n```$/, '');
    
    return JSON.parse(cleanedJsonString);

  } catch (error) {
    console.error("Error generating level data:", error);
    return null; // Return null if the API call fails
  }
}

