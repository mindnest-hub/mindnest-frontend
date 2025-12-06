import React, { useState } from 'react';

const regions = {
    "North Africa": [
        { name: "Algeria 🇩🇿", res: "Oil, Natural Gas, Iron Ore" },
        { name: "Egypt 🇪🇬", res: "Gold, Natural Gas, Cotton" },
        { name: "Libya 🇱🇾", res: "Oil, Natural Gas, Gypsum" },
        { name: "Morocco 🇲🇦", res: "Phosphates (World's largest reserves), Fish" },
        { name: "Sudan 🇸🇩", res: "Gold, Oil, Gum Arabic" },
        { name: "Tunisia 🇹🇳", res: "Phosphates, Olive Oil" },
        { name: "Mauritania 🇲🇷", res: "Iron Ore, Gold, Copper" }
    ],
    "West Africa": [
        { name: "Nigeria 🇳🇬", res: "Oil, Gas, Tin, Columbite" },
        { name: "Ghana 🇬🇭", res: "Gold, Cocoa, Oil, Bauxite" },
        { name: "Ivory Coast 🇨🇮", res: "Cocoa (World's top producer), Coffee, Oil" },
        { name: "Senegal 🇸🇳", res: "Fish, Phosphates, Gold" },
        { name: "Mali 🇲🇱", res: "Gold, Cotton, Salt" },
        { name: "Niger 🇳🇪", res: "Uranium, Gold, Oil" },
        { name: "Burkina Faso 🇧🇫", res: "Gold, Cotton" },
        { name: "Guinea 🇬🇳", res: "Bauxite (Aluminum ore), Gold, Diamonds" },
        { name: "Sierra Leone 🇸🇱", res: "Diamonds, Titanium, Bauxite" },
        { name: "Liberia 🇱🇷", res: "Rubber, Iron Ore, Timber" },
        { name: "Benin 🇧🇯", res: "Cotton, Cashews" },
        { name: "Togo 🇹🇬", res: "Phosphates, Cotton" },
        { name: "Gambia 🇬🇲", res: "Peanuts, Fish" },
        { name: "Guinea-Bissau 🇬🇼", res: "Cashews, Bauxite" },
        { name: "Cabo Verde 🇨🇻", res: "Fish, Salt" }
    ],
    "East Africa": [
        { name: "Kenya 🇰🇪", res: "Tea, Coffee, Flowers" },
        { name: "Ethiopia 🇪🇹", res: "Coffee (Origin), Gold, Potash" },
        { name: "Tanzania 🇹🇿", res: "Gold, Tanzanite (Rare gem), Diamonds" },
        { name: "Uganda 🇺🇬", res: "Coffee, Gold, Oil" },
        { name: "Rwanda 🇷🇼", res: "Coffee, Tea, Tin, Coltan" },
        { name: "Burundi 🇧🇮", res: "Coffee, Nickel, Rare Earths" },
        { name: "South Sudan 🇸🇸", res: "Oil" },
        { name: "Somalia 🇸🇴", res: "Livestock, Uranium (Potential)" },
        { name: "Djibouti 🇩🇯", res: "Salt, Strategic Ports" },
        { name: "Eritrea 🇪🇷", res: "Gold, Potash, Zinc" },
        { name: "Seychelles 🇸🇨", res: "Fish, Tourism" }
    ],
    "Central Africa": [
        { name: "DR Congo 🇨🇩", res: "Cobalt (60% of world), Copper, Diamonds" },
        { name: "Congo Republic 🇨🇬", res: "Oil, Timber" },
        { name: "Gabon 🇬🇦", res: "Manganese, Oil, Timber" },
        { name: "Cameroon 🇨🇲", res: "Oil, Cocoa, Coffee, Timber" },
        { name: "Chad 🇹🇩", res: "Oil, Cotton, Cattle" },
        { name: "CAR 🇨🇫", res: "Diamonds, Timber, Gold" },
        { name: "Eq. Guinea 🇬🇶", res: "Oil, Gas" },
        { name: "Sao Tome 🇸🇹", res: "Cocoa, Oil (Potential)" }
    ],
    "Southern Africa": [
        { name: "South Africa 🇿🇦", res: "Platinum, Gold, Chromium, Diamonds" },
        { name: "Angola 🇦🇴", res: "Oil, Diamonds" },
        { name: "Botswana 🇧🇼", res: "Diamonds (World leader by value)" },
        { name: "Zambia 🇿🇲", res: "Copper, Cobalt" },
        { name: "Zimbabwe 🇿🇼", res: "Platinum, Lithium, Gold" },
        { name: "Namibia 🇳🇦", res: "Uranium, Diamonds, Fish" },
        { name: "Mozambique 🇲🇿", res: "Natural Gas, Coal, Aluminum" },
        { name: "Malawi 🇲🇼", res: "Tobacco, Tea, Rare Earths" },
        { name: "Lesotho 🇱🇸", res: "Diamonds, Water" },
        { name: "Eswatini 🇸🇿", res: "Sugar, Forestry" },
        { name: "Madagascar 🇲🇬", res: "Vanilla (80% of world), Nickel" },
        { name: "Mauritius 🇲🇺", res: "Sugar, Textiles, Tourism" },
        { name: "Comoros 🇰🇲", res: "Vanilla, Cloves, Ylang-ylang" }
    ]
};

const ResourceList = ({ isKid }) => {
    const [activeRegion, setActiveRegion] = useState("West Africa");

    return (
        <div style={{ marginTop: '1rem', backgroundColor: '#222', padding: '1rem', borderRadius: '8px' }}>
            <h3 style={{ color: 'var(--color-primary)', marginBottom: '1rem', textAlign: 'center' }}>
                {isKid ? "🌍 Treasure Map of Africa" : "🌍 Comprehensive Resource Map"}
            </h3>

            {/* Region Tabs */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem', justifyContent: 'center' }}>
                {Object.keys(regions).map(region => (
                    <button
                        key={region}
                        onClick={() => setActiveRegion(region)}
                        style={{
                            padding: '0.5rem 0.8rem',
                            backgroundColor: activeRegion === region ? 'var(--color-primary)' : '#333',
                            color: activeRegion === region ? '#000' : '#fff',
                            border: 'none',
                            borderRadius: '20px',
                            cursor: 'pointer',
                            fontSize: '0.9rem',
                            fontWeight: 'bold'
                        }}
                    >
                        {region}
                    </button>
                ))}
            </div>

            {/* Country List */}
            <div style={{ maxHeight: '300px', overflowY: 'auto', paddingRight: '0.5rem' }}>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                    {regions[activeRegion].map((country, index) => (
                        <li key={index} style={{
                            marginBottom: '0.8rem',
                            paddingBottom: '0.8rem',
                            borderBottom: '1px solid #333',
                            display: 'flex',
                            flexDirection: 'column'
                        }}>
                            <span style={{ fontWeight: 'bold', color: '#fff', fontSize: '1.1rem' }}>{country.name}</span>
                            <span style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>
                                {isKid ? "✨ Has: " : "Resources: "}{country.res}
                            </span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default ResourceList;
