// Country-specific legal rights and laws database
export const legalRightsDatabase = {
    Nigeria: {
        arrest: {
            rights: [
                "You have the right to remain silent (Section 35, Constitution)",
                "You must be informed of the reason for arrest immediately",
                "You have the right to a lawyer (Section 36)",
                "You must be brought before a court within 24-48 hours",
                "You cannot be detained beyond 48 hours without court order"
            ],
            laws: "Criminal Procedure Act, 1945 & Constitution of Nigeria 1999",
            citation: "Section 35 & 36, Nigerian Constitution"
        },
        police: {
            rights: [
                "Police must show ID when requested",
                "You can refuse illegal searches without a warrant",
                "You can record police interactions (not prohibited by law)",
                "You have the right to report police misconduct"
            ],
            laws: "Police Act 2020",
            citation: "Section 4, Police Act 2020"
        },
        land: {
            rights: [
                "All land is vested in the Governor (Land Use Act)",
                "Certificate of Occupancy (C of O) is the primary title",
                "You can verify C of O at State Land Registry",
                "Customary land rights are recognized in some states"
            ],
            laws: "Land Use Act 1978",
            citation: "Section 1, Land Use Act 1978"
        }
    },
    Ghana: {
        arrest: {
            rights: [
                "You must be informed of the reason for arrest (Article 14)",
                "You have the right to remain silent",
                "You must be brought before court within 48 hours",
                "You have the right to a lawyer",
                "You can apply for bail"
            ],
            laws: "Constitution of Ghana 1992, Criminal Procedure Act",
            citation: "Article 14 & 19, Ghanaian Constitution"
        }
    },
    Kenya: {
        arrest: {
            rights: [
                "You must be informed of the reason for arrest (Article 49)",
                "You have the right to remain silent",
                "You must be brought before court within 24 hours",
                "You have the right to a lawyer (free if you cannot afford one)",
                "You can apply for bail"
            ],
            laws: "Constitution of Kenya 2010, Criminal Procedure Code",
            citation: "Article 49 & 50, Kenyan Constitution"
        }
    }
};

// Helper function to get country-specific legal advice
export const getLegalAdvice = (country, topic) => {
    const countryData = legalRightsDatabase[country];
    if (!countryData || !countryData[topic]) {
        return null;
    }

    const data = countryData[topic];
    let response = `**${country} - Legal Rights**\n\n`;
    response += `**Your Rights:**\n`;
    data.rights.forEach((right, index) => {
        response += `${index + 1}. ${right}\n`;
    });
    response += `\n**Legal Framework:** ${data.laws}\n`;
    response += `**Citation:** ${data.citation}\n\n`;
    response += `*Disclaimer: This is general information, not legal advice. Consult a lawyer for specific situations.*`;

    return response;
};
