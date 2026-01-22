export const agriBusinessTemplates = {
    "farm_business_plan": {
        name: "Standard Farm Business Plan",
        description: "A comprehensive business plan for starting or expanding a farm. Essential for loans and grants.",
        category: "business",
        tier: "free",
        countries: ["Nigeria", "Ghana", "Kenya", "South Africa", "Rwanda", "General"],
        fields: [
            { id: "owner_name", label: "Farm Owner Name", type: "text", required: true, placeholder: "e.g. Chinedu Okeke" },
            { id: "farm_name", label: "Farm Name", type: "text", required: true, placeholder: "e.g. Green Horizon Agro" },
            { id: "location", label: "Farm Location", type: "text", required: true, placeholder: "e.g. Iwo Road, Ibadan, Oyo State" },
            { id: "crop_type", label: "Primary Crop/Livestock", type: "select", options: ["Cassava", "Maize", "Rice", "Poultry (Broilers)", "Poultry (Layers)", "Vegetables"], required: true },
            { id: "farm_size", label: "Farm Size (Acres/Plots)", type: "text", required: true, placeholder: "e.g. 5 Acres" },
            { id: "market_target", label: "Target Market", type: "textarea", required: true, placeholder: "Who will buy your produce? (e.g., Local market, Processing factory, Restaurants)" },
            { id: "startup_cost", label: "Estimated Startup Cost (₦)", type: "number", required: true, placeholder: "500000" },
            { id: "funding_source", label: "Source of Funds", type: "text", required: true, placeholder: "Personal Savings, Bank Loan, Grant" },
            { id: "date", label: "Date", type: "date", required: true }
        ],
        generateTemplate: (data) => `
FARM BUSINESS PLAN
------------------------------------------------
Farm Name: ${data.farm_name}
Owner: ${data.owner_name}
Date: ${data.date}

1. EXECUTIVE SUMMARY
${data.farm_name} is an agricultural enterprise located at ${data.location}, focused on the production of ${data.crop_type} on a ${data.farm_size} land. Our goal is to provide high-quality, organic produce to meet the growing demand in our region while generating sustainable profit.

2. BUSINESS OVERVIEW
- **Location:** ${data.location}
- **Primary Product:** ${data.crop_type}
- **Scale:** ${data.farm_size}

3. MARKET ANALYSIS
There is a high demand for ${data.crop_type} in Nigeria due to its role as a staple food/source of protein.
**Target Market:**
${data.market_target}

We plan to reach our customers through direct farm-gate sales and partnerships with local distributors.

4. FINANCIAL PLAN
**Startup Capital Required:** ₦${Number(data.startup_cost).toLocaleString()}
**Source of Funds:** ${data.funding_source}

Funds will be utilized for:
- Land Preparation/Lease
- Seeds/Livestock Purchase
- Fertilizers/Feed
- Labor and Equipment

5. OPERATIONS PLAN
- **Preparation:** Land clearing and soil testing.
- **Production:** Systematic planting/stocking cycle ensuring year-round availability where possible.
- **Harvest/Sales:** Efficient harvesting to minimize post-harvest loss.

6. CONCLUSION
${data.farm_name} is positioned for success. With disciplined management and adherence to best agronomic practices, we project a break-even point within the first 1-2 production cycles.

------------------------------------------------
Signed: __________________________
${data.owner_name}
`
    },
    "loan_application": {
        name: "Agri-Loan Application Letter",
        description: "Formal letter applying for an agricultural loan (e.g., CBN Anchor Borrowers, details may vary).",
        category: "finance",
        tier: "free",
        countries: ["Nigeria", "Ghana", "General"],
        fields: [
            { id: "bank_name", label: "Bank Name", type: "text", required: true, placeholder: "e.g. Bank of Agriculture" },
            { id: "branch_address", label: "Bank Branch Address", type: "text", required: true },
            { id: "applicant_name", label: "Your Full Name", type: "text", required: true },
            { id: "account_number", label: "Account Number", type: "text", required: true },
            { id: "amount", label: "Loan Amount Requested (₦)", type: "number", required: true },
            { id: "purpose", label: "Specific Purpose of Loan", type: "textarea", required: true, placeholder: "e.g. To purchase 500 bags of fertilizer and hire 10 laborers." },
            { id: "duration", label: "Repayment Duration (Months)", type: "number", required: true, placeholder: "12" },
            { id: "date", label: "Date", type: "date", required: true }
        ],
        generateTemplate: (data) => `
${data.applicant_name}
${data.date}

The Branch Manager,
${data.bank_name},
${data.branch_address}.

Dear Sir/Madam,

APPLICATION FOR AGRICULTURAL LOAN OF ₦${Number(data.amount).toLocaleString()}

I, ${data.applicant_name} (Account Number: ${data.account_number}), hereby apply for an agricultural facility of ₦${Number(data.amount).toLocaleString()} to support my farming operations.

**Purpose of Loan:**
${data.purpose}

**Repayment Plan:**
I propose to repay this loan over a period of ${data.duration} months, using proceeds from the sale of my farm harvest. I am willing to comply with all terms and conditions, including providing necessary collateral or guarantors as required by the bank.

Attached to this letter is my detailed Business Plan and Cash Flow projection.

Thank you for your favorable consideration.

Yours faithfully,

__________________________
${data.applicant_name}
`
    },
    "investor_pitch": {
        name: "Investor Pitch Deck (One-Pager)",
        description: "A concise summary of your agri-business opportunity for potential investors.",
        category: "business",
        tier: "premium",
        countries: ["General"],
        fields: [
            { id: "startup_name", label: "Startup/Farm Name", type: "text", required: true },
            { id: "tagline", label: "Tagline/Slogan", type: "text", required: true, placeholder: "e.g. Feeding Africa, One Grain at a Time" },
            { id: "problem", label: "The Problem", type: "textarea", required: true, placeholder: "What gap are you filling? (e.g. Shortage of quality tomatoes in dry season)" },
            { id: "solution", label: "The Solution", type: "textarea", required: true, placeholder: "How do you solve it? (e.g. Greenhouse farming for year-round production)" },
            { id: "ask", label: "The Ask (Investment Needed)", type: "text", required: true, placeholder: "₦2,000,000 for 10% equity" },
            { id: "date", label: "Date", type: "date", required: true }
        ],
        generateTemplate: (data) => `
INVESTMENT OPPORTUNITY: ${data.startup_name.toUpperCase()}
"${data.tagline}"
Date: ${data.date}

------------------------------------------------
THE PROBLEM
${data.problem}

THE SOLUTION
${data.solution}

BUSINESS MODEL
We generate revenue by selling directly to consumers and wholesalers, cutting out middlemen to improve margins.

TRACTION
We have secured land and completed pilot testing with positive results.

THE ASK
We are seeking ${data.ask} to scale operations and meet confirmed demand.

------------------------------------------------
Contact: ${data.startup_name} Management
`
    }
};

export const getAgriDocuments = () => Object.entries(agriBusinessTemplates).map(([id, doc]) => ({ id, ...doc }));
