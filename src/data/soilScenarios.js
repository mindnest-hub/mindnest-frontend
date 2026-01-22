export const soilScenarios = [
    {
        id: 1,
        condition: "Yellowing Leaves (Nitrogen Deficiency)",
        desc: "The maize leaves are turning yellow in a V-shape starting from the tip. Growth is stunted.",
        ph: 6.5,
        nutrients: { N: "Low", P: "Medium", K: "Medium" },
        correctTreatment: "urea",
        explanation: "Yellow leaves often indicate Nitrogen deficiency. Urea is rich in Nitrogen (46%) and boosts leafy growth quickly."
    },
    {
        id: 2,
        condition: "Purple Leaves (Phosphorus Deficiency)",
        desc: "Young plants have purplish stems and leaves. Root development is poor.",
        ph: 6.0,
        nutrients: { N: "Medium", P: "Low", K: "Medium" },
        correctTreatment: "npk_15_15_15",
        explanation: "Purple coloration indicates Phosphorus deficiency. NPK 15:15:15 provides a balanced mix, including Phosphorus for root strength."
    },
    {
        id: 3,
        condition: "Highly Acidic Soil",
        desc: "Soil test shows very low pH. Most crops are failing to absorb nutrients despite fertilization.",
        ph: 4.5,
        nutrients: { N: "High", P: "High", K: "High" }, // Nutrients locked out
        correctTreatment: "limestone",
        explanation: "Acidic soil (low pH) 'locks' nutrients so plants can't eat. Agricultural Compost or Limestone neutralizes acidity."
    },
    {
        id: 4,
        condition: "Burnt Tips (Potassium Deficiency)",
        desc: "Edges of leaves look scorched or burnt. Stalks are weak and falling over.",
        ph: 6.8,
        nutrients: { N: "High", P: "High", K: "Low" },
        correctTreatment: "potash",
        explanation: "Scorched edges mean Potassium (K) deficiency. Muriate of Potash strengthens stalks and drought resistance."
    },
    {
        id: 5,
        condition: "Soil Exhaustion (Low Organic Matter)",
        desc: "Soil is hard, dry, and dusty. Water runs off instantly instead of soaking in.",
        ph: 7.0,
        nutrients: { N: "Low", P: "Low", K: "Low" },
        correctTreatment: "organic_compost",
        explanation: "Chemical fertilizers feed the plant, but Organic Compost feeds the SOIL. It improves water retention and structure."
    }
];

export const treatments = [
    { id: "urea", name: "Urea (46-0-0)", type: "chemical", cost: 50 },
    { id: "npk_15_15_15", name: "NPK 15:15:15", type: "chemical", cost: 80 },
    { id: "limestone", name: "Agri-Lime", type: "mineral", cost: 30 },
    { id: "potash", name: "Muriate of Potash", type: "chemical", cost: 60 },
    { id: "organic_compost", name: "Organic Compost", type: "organic", cost: 20 },
    { id: "water", name: "Just Water", type: "basic", cost: 0 }
];
