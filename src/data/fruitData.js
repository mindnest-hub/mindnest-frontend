export const fruitData = [
    {
        id: 'mango',
        name: 'Mango',
        emoji: '🥭',
        color: '#FFB300',
        nutrition: ['Vitamin A', 'Vitamin C', 'Folate', 'Fiber'],
        benefits: [
            { title: 'Eye Health', desc: 'High in Vitamin A and beta-carotene, supporting vision and preventing night blindness.' },
            { title: 'Immunity Boost', desc: 'Vitamin C and antioxidants help the body fight off infections.' },
            { title: 'Digestion', desc: 'Contains enzymes that help break down proteins and fiber for a healthy gut.' }
        ],
        wasteToWealth: {
            reuse: 'Mango peels can be dried and ground into a nutrient-rich powder for smoothies or used as a natural skin exfoliant.',
            plant: 'The large seed (pit) can be cleaned, dried, and carefully opened to reveal the "bean" inside. Plant this in well-draining soil to grow your own mango tree!',
            tip: 'The seed husk can also be used as a natural scrubbing tool once dried.'
        }
    },
    {
        id: 'papaya',
        name: 'Papaya (Pawpaw)',
        emoji: '🍐', // Closest emoji
        color: '#FF7043',
        nutrition: ['Papain', 'Vitamin C', 'Potassium', 'Lycopene'],
        benefits: [
            { title: 'Digestive Power', desc: 'Contains papain, an enzyme that makes protein easier to digest. Great after a heavy meal.' },
            { title: 'Heart Health', desc: 'Antioxidants prevent the oxidation of cholesterol, reducing heart disease risk.' },
            { title: 'Skin Healing', desc: 'Can be used topically or eaten to promote wound healing and skin elasticity.' }
        ],
        wasteToWealth: {
            reuse: 'Papaya seeds are edible! They have a peppery taste and can be dried and ground as a substitute for black pepper. They are also anti-parasitic.',
            plant: 'Scoop out the seeds, wash away the jelly coating, dry them, and sow in a sunny spot. Papayas grow very fast!',
            tip: 'The skins contain latex; use them to tenderize tough meats before cooking.'
        }
    },
    {
        id: 'guava',
        name: 'Guava',
        emoji: '🍏',
        color: '#8BC34A',
        nutrition: ['Vitamin C (4x Orange)', 'Fiber', 'Lycopene', 'Manganese'],
        benefits: [
            { title: 'The Immunity King', desc: 'Has one of the highest Vitamin C contents of any fruit, essential for fighting colds.' },
            { title: 'Blood Sugar Control', desc: 'Low glycemic index and high fiber help prevent spikes in blood sugar.' },
            { title: 'Cramp Relief', desc: 'Magnesium in guavas helps relax muscles and nerves after exercise.' }
        ],
        wasteToWealth: {
            reuse: 'Guava leaves are medicinal! Boil them to make a tea that helps with coughs, diarrhea, and toothaches.',
            plant: 'Guava seeds are hard but easy to grow. Simply scatter mature seeds in loamy soil and keep moist.',
            tip: 'The entire fruit is edible — seeds and all — providing a massive fiber boost.'
        }
    },
    {
        id: 'watermelon',
        name: 'Watermelon',
        emoji: '🍉',
        color: '#E53935',
        nutrition: ['Lycopene', 'Citrulline', 'Vitamin A', '92% Water'],
        benefits: [
            { title: 'Hydration', desc: 'Perfect for the African heat. Provides essential electrolytes alongside water.' },
            { title: 'Muscle Recovery', desc: 'Contains L-citrulline, which reduces muscle soreness and improves circulation.' },
            { title: 'Prostate Health', desc: 'Rich in lycopene, which specifically supports mens health and reduces inflammation.' }
        ],
        wasteToWealth: {
            reuse: 'The white rind is edible! It contains more citrulline than the red flesh. Pickle it or stir-fry it like a vegetable.',
            plant: 'Watermelons need space. Plant seeds 2 meters apart in sandy, well-draining soil during the dry season.',
            tip: 'Dried watermelon seeds are a popular snack in some cultures, rich in protein and fats.'
        }
    },
    {
        id: 'citrus',
        name: 'Lemon & Lime',
        emoji: '🍋',
        color: '#FDD835',
        nutrition: ['Flavonoids', 'Vitamin C', 'Citric Acid', 'Pectin'],
        benefits: [
            { title: 'Detoxification', desc: 'Flushes the liver and supports bile production for better fat digestion.' },
            { title: 'Alkalizing', desc: 'Though acidic to taste, they have an alkalizing effect on the body, reducing inflammation.' },
            { title: 'Stone Prevention', desc: 'Citric acid helps prevent the formation of kidney stones.' }
        ],
        wasteToWealth: {
            reuse: 'Lemon peels contain essential oils. Use them to make natural cleaners, zest for flavor, or boil them for an aromatic air freshener.',
            plant: 'Citrus seeds are easy to sprout in small pots on a windowsill before moving them to the garden.',
            tip: 'Freeze lemon juice in ice trays to have fresh "detox drops" ready for your morning water.'
        }
    },
    {
        id: 'moringa',
        name: 'Moringa (The Miracle Seed)',
        emoji: '🌿',
        color: '#43A047',
        nutrition: ['Protein (All 필수 Amino Acids)', 'Iron', 'Calcium', 'Vitamin A'],
        benefits: [
            { title: 'Multi-Vitamin Tree', desc: 'Contains 7x the Vitamin C of oranges and 15x the potassium of bananas.' },
            { title: 'Energy Boost', desc: 'Rich in iron and B-vitamins, fighting fatigue and anemia naturally.' },
            { title: 'Anti-Inflammatory', desc: 'Isothiocyanates in the seeds and leaves help reduce joint pain and swelling.' }
        ],
        wasteToWealth: {
            reuse: 'Crushed moringa seeds can actually purify water by causing dirt and bacteria to clump and sink!',
            plant: 'Moringa is a "survival tree." It grows incredibly fast even in poor soil. Just stick a seed in the ground.',
            tip: 'Dry the leaves into a powder to add a nutritional "Elite" boost to any meal without changing the flavor much.'
        }
    },
    {
        id: 'strawberry',
        name: 'Strawberry',
        emoji: '🍓',
        color: '#FF1744',
        nutrition: ['Anthocyanins', 'Vitamin C', 'Potassium', 'Manganese'],
        benefits: [
            { title: 'Brain Protection', desc: 'Anthocyanins protect brain cells from oxidative stress and may improve memory.' },
            { title: 'Heart Health', desc: 'Increases HDL (good) cholesterol and lowers blood pressure.' },
            { title: 'Blood Sugar', desc: 'Helps slow down glucose digestion and reduces spikes in insulin.' }
        ],
        wasteToWealth: {
            reuse: 'Strawberry tops (the green leafy bits) are edible! Use them to infuse water or toss them into a smoothie for extra minerals.',
            plant: 'Strawberry seeds are on the skin. You can thinly slice the skin, place it on moist soil, and watch them sprout into tiny plants.',
            tip: 'The tops can also be used to make a gentle, vitamin-rich tea.'
        }
    },
    {
        id: 'avocado',
        name: 'Avocado',
        emoji: '🥑',
        color: '#4CAF50',
        nutrition: ['Healthy Fats (Oleic Acid)', 'Vitamin K', 'Folate', 'Potassium'],
        benefits: [
            { title: 'Brain Fuel', desc: 'Healthy fats support the structure of brain cells and improve concentration.' },
            { title: 'Nutrient Absorption', desc: 'Eating avocado helps you absorb 5x more nutrients from other vegetables (like carrots or spinach).' },
            { title: 'Eye Protection', desc: 'Rich in lutein and zeaxanthin, which protect eyes from light damage.' }
        ],
        wasteToWealth: {
            reuse: 'Avocado pits can be dried, grated, and used as a natural brown dye for fabrics or boiled for a medicinal tea.',
            plant: 'The classic pit-and-toothpick method! Suspend the seed over water to sprout a beautiful indoor tree.',
            tip: 'The skin is tough enough to be used as a natural seedling pot — it will biodegrade as the plant grows.'
        }
    },
    {
        id: 'ginger',
        name: 'Ginger',
        emoji: '🫚',
        color: '#C0CA33',
        nutrition: ['Gingerol', 'Magnesium', 'Vitamin B6'],
        benefits: [
            { title: 'Digestion & Nausea', desc: 'A legendary remedy for bloating, indigestion, and motion sickness.' },
            { title: 'Anti-Inflammatory', desc: 'Gingerol is a powerful anti-inflammatory that helps reduce muscle pain and arthritis.' },
            { title: 'Infection Fighter', desc: 'Fresh ginger can help inhibit the growth of many different types of bacteria.' }
        ],
        wasteToWealth: {
            reuse: 'Ginger peels are highly aromatic. Use them in soups or boil them with honey and lemon for a powerful anti-cold tonic.',
            plant: 'Simply bury a piece of fresh ginger root (rhizome) with an "eye" or bud facing up in a pot. It grows into a beautiful reed-like plant.',
            tip: 'If your ginger is getting dry, mince it and freeze it in olive oil for easy cooking later.'
        }
    },
    {
        id: 'garlic',
        name: 'Garlic',
        emoji: '🧄',
        color: '#E0E0E0',
        nutrition: ['Allicin', 'Selenium', 'Vitamin C'],
        benefits: [
            { title: 'Natural Antibiotic', desc: 'Allicin, released when crushed, has potent antibacterial and antiviral properties.' },
            { title: 'Heart Guard', desc: 'Helps lower blood pressure and prevents the hardening of arteries.' },
            { title: 'Athletic Performance', desc: 'Historically used to reduce fatigue and increase the work capacity of laborers.' }
        ],
        wasteToWealth: {
            reuse: 'Garlic skins are full of antioxidants. Add them to veggie stocks or roast them with veggies for extra flavor and nutrients!',
            plant: 'Plant individual cloves (pointy side up) in the soil. Each clove will grow into a full head of garlic.',
            tip: 'The green sprouts that come out of old garlic are edible and taste like mild leeks — use them as a garnish.'
        }
    },
    {
        id: 'clove',
        name: 'Clove',
        emoji: '🍂', // Closest emoji
        color: '#795548',
        nutrition: ['Eugenol', 'Manganese', 'Vitamin K'],
        benefits: [
            { title: 'Oral Health', desc: 'Eugenol is a natural anesthetic and antibacterial — perfect for toothaches and gum health.' },
            { title: 'Liver Protection', desc: 'Antioxidants in cloves may help improve liver function and reduce oxidative stress.' },
            { title: 'Blood Sugar Regulation', desc: 'Compounds in cloves help keep blood sugar levels in check by piquing insulin activity.' }
        ],
        wasteToWealth: {
            reuse: 'Used cloves from tea can be dried and placed in closets to keep away moths and insects naturally.',
            plant: 'Clove trees grow from seeds, but they need a tropical, humid climate to flourish. They can be grown as ornamental indoor plants.',
            tip: 'Stick cloves into an orange (a pomander) to create a natural, long-lasting room freshener.'
        }
    }
];
