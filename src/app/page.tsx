"use client";

import { useState } from "react";
import TeachableMachineClient from "../components/TeachableMachineClient";

// Type definition for individual bin characteristics.
interface BinInfo {
  name: string; // Display name of the bin.
  color: string; // Tailwind CSS class for background color (e.g., 'bg-blue-500').
  textColor?: string; // Optional: Tailwind CSS class for text color (e.g., 'text-white').
  description: string; // Description of what goes into the bin.
  items: string[]; // Example items for this bin.
}

// Type definition for a country's complete bin information system.
interface CountryBinInfo {
  countryName: string; // Name of the country.
  bins: BinInfo[]; // Array of bin information for the country.
  notes?: string; // Optional general notes about the country's recycling/waste system.
}

// Data store for country-specific waste bin information.
// Keyed by country code (e.g., "DE", "JP").
const countrySpecificBinInfo: Record<string, CountryBinInfo> = {
  // Germany: Detailed multi-stream recycling with mandatory sorting.
  DE: {
    countryName: "Germany",
    bins: [
      {
        name: "Restmüll (General Waste)",
        color: "bg-gray-700",
        textColor: "text-white",
        description: "General non-recyclable, non-compostable household waste.",
        items: ["Non-recyclable household items", "Ashes", "Nappies"],
      },
      {
        name: "Gelber Sack/Tonne (Packaging)",
        color: "bg-yellow-400",
        description:
          "Lightweight packaging (plastics, metals, composite materials).",
        items: [
          "Plastic packaging (bottles, tubs, films)",
          "Metal packaging (cans, foil)",
          "Composite materials (drink cartons)",
        ],
      },
      {
        name: "Papiertonne (Paper/Cardboard)",
        color: "bg-blue-500",
        textColor: "text-white",
        description: "Paper and Cardboard.",
        items: ["Newspapers", "Cardboard boxes", "Magazines", "Office paper"],
      },
      {
        name: "Biotonne (Organic Waste)",
        color: "bg-green-600",
        textColor: "text-white",
        description: "Organic waste (food scraps, garden waste).",
        items: [
          "Fruit/vegetable scraps",
          "Coffee grounds",
          "Tea bags",
          "Garden waste",
          "Cooked food leftovers (check local rules)",
        ],
      },
      {
        name: "Glass (Public Drop-off)",
        color: "bg-green-300",
        description:
          "Glass containers, separated by color (clear, brown, green) at public drop-off points.",
        items: [
          "Clear glass bottles/jars",
          "Brown glass bottles/jars",
          "Green glass bottles/jars",
        ],
      },
    ],
    notes:
      "Highly separated multi-stream recycling. Mandatory sorting. Deposit System (Pfand) for most beverage bottles/cans.",
  },
  // Japan: Extremely detailed municipal sorting rules.
  JP: {
    countryName: "Japan",
    bins: [
      {
        name: "Burnable (Moeru gomi)",
        color: "bg-red-500",
        textColor: "text-white",
        description:
          "General burnable waste. Rules vary by municipality (often food scraps, some plastics, paper).",
        items: [
          "Food scraps (check local rules)",
          "Some plastics (check local rules)",
          "Paper waste (non-recyclable)",
          "Wood items",
        ],
      },
      {
        name: "Non-Burnable (Moenai gomi)",
        color: "bg-blue-300",
        description:
          "Non-burnable items like ceramics, some glass, certain plastics, small metals.",
        items: [
          "Ceramics",
          "Broken glass (non-recyclable)",
          "Small metal items",
          "Certain plastics (check local rules)",
          "Light bulbs",
        ],
      },
      {
        name: "Recyclables (Shigen gomi)",
        color: "bg-yellow-500",
        description:
          "Separated recyclables: PET bottles, other plastics, cans, glass bottles, paper/cardboard (often bundled).",
        items: [
          "PET bottles (caps/labels removed)",
          "Plastic containers/trays",
          "Aluminum/steel cans",
          "Glass bottles (recyclable)",
          "Paper/cardboard (bundled separately)",
        ],
      },
      {
        name: "Large-sized waste (Sodai gomi)",
        color: "bg-gray-500",
        textColor: "text-white",
        description:
          "Large items requiring special collection (often fee-based).",
        items: ["Furniture", "Appliances", "Bicycles"],
      },
    ],
    notes:
      "Extremely detailed and strict sorting, dictated by municipality. Specific collection days for different categories. Check local guides carefully.",
  },
  // South Korea: Mandatory separation, volume-based bags, strict food waste rules.
  KR: {
    countryName: "South Korea",
    bins: [
      {
        name: "General Waste Bag (Jongnyangje)",
        color: "bg-gray-500",
        textColor: "text-white",
        description:
          "General Waste. Requires designated volume-based bags. Food waste is strictly separate.",
        items: ["Non-recyclable items", "Items not fitting other categories"],
      },
      {
        name: "Food Waste (Eumsikmul Sseuregi)",
        color: "bg-yellow-600",
        textColor: "text-white",
        description:
          "Mandatory separate collection for all food waste, often using specific bags or bins.",
        items: ["All food scraps (meat, fish, vegetables, fruit, grains)"],
      },
      {
        name: "Recyclables (Jaewalhyeongpum)",
        color: "bg-blue-500",
        textColor: "text-white",
        description:
          "Collected separately at designated points or bins: Paper, Plastics (various types), Glass, Metal Cans, Styrofoam.",
        items: [
          "Paper (newspapers, boxes)",
          "Plastic containers/bottles (cleaned)",
          "Glass bottles/jars (cleaned)",
          "Metal cans (cleaned)",
          "Styrofoam (cleaned)",
        ],
      },
      {
        name: "Large-sized waste (Daeyeong Pyegimul)",
        color: "bg-purple-500",
        textColor: "text-white",
        description: "Large items requiring special stickers/collection.",
        items: ["Furniture", "Large appliances"],
      },
    ],
    notes:
      "Mandatory separate collection, often using designated bags with fees. Extensive recycling. Strict food waste separation.",
  },
  // Sweden: Focus on energy recovery and producer responsibility for packaging.
  SE: {
    countryName: "Sweden",
    bins: [
      {
        name: "Residual Waste (Brännbart)",
        color: "bg-black",
        textColor: "text-white",
        description: "Residual waste for energy recovery (incineration).",
        items: ["Non-recyclable items", "Nappies", "Envelopes"],
      },
      {
        name: "Packaging (Förpackningar)",
        color: "bg-orange-500",
        description:
          "Designated collection points/bins for plastics, paper/cardboard packaging, metal, and glass.",
        items: [
          "Plastic packaging",
          "Paper/cardboard packaging",
          "Metal packaging",
          "Glass packaging (clear/colored separate)",
        ],
      },
      {
        name: "Food Waste (Matavfall)",
        color: "bg-brown-500",
        textColor: "text-white",
        description:
          "Separate collection in many municipalities, often in special paper bags.",
        items: ["Food scraps", "Coffee grounds", "Tea bags"],
      },
      {
        name: "Newspapers/Magazines (Tidningar)",
        color: "bg-blue-400",
        description:
          "Separate collection for newspapers, magazines, and office paper.",
        items: ["Newspapers", "Magazines", "Brochures", "Office paper"],
      },
      {
        name: "Hazardous/Electronics (Farligt Avfall/Elavfall)",
        color: "bg-red-700",
        textColor: "text-white",
        description:
          "Designated drop-off points for hazardous waste and electronics.",
        items: [
          "Batteries",
          "Electronics",
          "Light bulbs",
          "Chemicals",
          "Paint",
        ],
      },
    ],
    notes:
      "Emphasis on source separation, high recycling rates, energy recovery. Deposit System (Panta) for most beverage bottles/cans.",
  },
  // Switzerland: High recycling rates, polluter-pays principle with taxed bags for general waste.
  CH: {
    countryName: "Switzerland",
    bins: [
      {
        name: "General Waste (Fee Bag - Kehrichtsack)",
        color: "bg-gray-600",
        textColor: "text-white",
        description: "Non-recyclable waste in official fee-based bags.",
        items: ["Non-recyclable items not fitting other categories"],
      },
      {
        name: "Paper/Cardboard",
        color: "bg-blue-500",
        textColor: "text-white",
        description:
          "Often collected separately, bundled for curbside, or at drop-off points.",
        items: ["Newspapers", "Magazines", "Cardboard boxes (flattened)"],
      },
      {
        name: "Glass/PET/Aluminum/Tin",
        color: "bg-green-400",
        description:
          "Collected at communal drop-off points, often separated by type/color.",
        items: [
          "Glass bottles/jars (by color)",
          "PET bottles (often separate)",
          "Aluminum cans",
          "Tin cans",
        ],
      },
      {
        name: "Organic Waste (Grüngut/Compost)",
        color: "bg-green-700",
        textColor: "text-white",
        description:
          "Separate collection in many areas for composting (garden and often kitchen waste).",
        items: ["Fruit/vegetable scraps", "Garden waste", "Coffee grounds"],
      },
      {
        name: "Special Waste (Sonderabfälle)",
        color: "bg-red-600",
        textColor: "text-white",
        description:
          "Batteries, electronics, chemicals, etc., to designated collection points.",
        items: ["Batteries", "Electronics", "Medications", "Paints"],
      },
    ],
    notes:
      "High recycling rates, 'polluter pays' principle with fee-based general waste bags. Extensive separate collection at communal points.",
  },
  // Netherlands: High recycling rates, producer responsibility, deposit-return for some packaging.
  NL: {
    countryName: "Netherlands",
    bins: [
      {
        name: "General Waste (Restafval)",
        color: "bg-gray-500",
        textColor: "text-white",
        description: "General non-recyclable waste.",
        items: ["Non-recyclable items", "Nappies"],
      },
      {
        name: "Organic Waste (GFT - Groente-, Fruit-, Tuinafval)",
        color: "bg-green-500",
        textColor: "text-white",
        description:
          "Organic Waste (vegetable, fruit, garden waste, and often food leftovers).",
        items: [
          "Vegetable scraps",
          "Fruit scraps",
          "Garden waste",
          "Cooked food (check local rules)",
          "Coffee filters",
        ],
      },
      {
        name: "Paper/Cardboard (Papier en Karton)",
        color: "bg-blue-500",
        textColor: "text-white",
        description: "Clean and dry paper and cardboard.",
        items: [
          "Newspapers",
          "Cardboard boxes",
          "Magazines",
          "Paper packaging",
        ],
      },
      {
        name: "Packaging (PMD - Plastic, Metaal, Drankkartons)",
        color: "bg-orange-500",
        description:
          "Mixed packaging: Plastic packaging, Metal packaging (cans), Drink cartons.",
        items: [
          "Plastic bottles/containers/films",
          "Metal cans/foil",
          "Drink cartons (Tetra Pak)",
        ],
      },
      {
        name: "Glass (Glas)",
        color: "bg-teal-400",
        description:
          "Glass bottles and jars, often separated by color at communal bottle banks.",
        items: ["Glass bottles (clear, green, brown)", "Glass jars"],
      },
      {
        name: "Textiles (Textiel)",
        color: "bg-purple-400",
        description:
          "Clean and dry clothing, shoes, and textiles in designated containers.",
        items: ["Clothing", "Shoes (paired)", "Towels", "Linens"],
      },
    ],
    notes:
      "Focus on waste separation at source. Deposit System (Statiegeld) for many plastic bottles and cans.",
  },
  // Austria: Well-established separation system, high recycling rates, particularly for packaging and organics.
  AT: {
    countryName: "Austria",
    bins: [
      {
        name: "Restmüll (General Waste)",
        color: "bg-gray-700",
        textColor: "text-white",
        description: "General non-recyclable waste.",
        items: ["Non-recyclable household items", "Hygiene products"],
      },
      {
        name: "Leichtverpackungen (Light Packaging)",
        color: "bg-yellow-500",
        description:
          "Plastics, composite materials (drink cartons), small metals.",
        items: [
          "Plastic bottles/packaging",
          "Drink cartons",
          "Yogurt cups",
          "Metal cans",
          "Aluminum foil",
        ],
      },
      {
        name: "Papier (Paper/Cardboard)",
        color: "bg-blue-500",
        textColor: "text-white",
        description: "Clean paper and cardboard.",
        items: [
          "Newspapers",
          "Magazines",
          "Cardboard boxes",
          "Books (softcover)",
        ],
      },
      {
        name: "Bioabfall (Organic Waste)",
        color: "bg-brown-600",
        textColor: "text-white",
        description: "Organic waste from kitchen and garden.",
        items: [
          "Fruit/vegetable scraps",
          "Coffee grounds",
          "Tea bags",
          "Garden waste",
          "Eggshells",
        ],
      },
      {
        name: "Glas (Glass)",
        color: "bg-green-300",
        description:
          "Glass containers, separated by color (white/clear and colored) at public drop-off points.",
        items: [
          "White/clear glass bottles/jars",
          "Colored (green, brown) glass bottles/jars",
        ],
      },
      {
        name: "Metallverpackungen (Metal Packaging - if separate from Leicht)",
        color: "bg-gray-400",
        description: "Larger metal packaging if not in yellow bin.",
        items: ["Large tin cans", "Metal lids"],
      },
    ],
    notes:
      "Similar to Germany, strong emphasis on separate collection for recycling and composting.",
  },
  // Finland: Extensive separate collection. Deposit System (Palautuspullo/-tölkki) for most beverage bottles/cans.
  FI: {
    countryName: "Finland",
    bins: [
      {
        name: "Mixed Waste (Sekajäte)",
        color: "bg-gray-500",
        textColor: "text-white",
        description:
          "General waste that cannot be sorted otherwise, often for energy recovery.",
        items: ["Non-recyclable items", "Hygiene products", "Broken ceramics"],
      },
      {
        name: "Bio Waste (Biojäte)",
        color: "bg-brown-500",
        textColor: "text-white",
        description: "Organic food waste and small amounts of garden waste.",
        items: [
          "Food scraps (meat, fish, dairy, vegetables)",
          "Coffee grounds",
          "Paper towels (if soiled with food)",
        ],
      },
      {
        name: "Paper (Paperinkeräys)",
        color: "bg-blue-300",
        description: "Newspapers, magazines, advertisements, office paper.",
        items: [
          "Newspapers",
          "Magazines",
          "Envelopes (no plastic window)",
          "Copy paper",
        ],
      },
      {
        name: "Cardboard Packaging (Kartonkipakkaukset)",
        color: "bg-yellow-600",
        textColor: "text-white",
        description: "Cardboard boxes, milk/juice cartons (rinsed, flattened).",
        items: [
          "Cardboard boxes",
          "Milk/juice cartons",
          "Paper bags",
          "Cereal boxes",
        ],
      },
      {
        name: "Glass Packaging (Lasipakkaukset)",
        color: "bg-green-400",
        description: "Glass bottles and jars (rinsed, no caps/lids).",
        items: ["Glass bottles", "Glass jars (food containers)"],
      },
      {
        name: "Plastic Packaging (Muovipakkaukset)",
        color: "bg-pink-400",
        description: "Empty, clean, and dry plastic food packaging.",
        items: [
          "Plastic food containers (yogurt pots, butter tubs)",
          "Plastic bottles (detergent, shampoo)",
          "Plastic bags/films (clean)",
        ],
      },
      {
        name: "Metal (Metallinkeräys)",
        color: "bg-gray-400",
        description: "Metal packaging and small metal objects.",
        items: [
          "Metal cans (food, beverage)",
          "Foil trays",
          "Metal lids",
          "Empty aerosol cans",
        ],
      },
      {
        name: "Hazardous Waste (Vaarallinen jäte)",
        color: "bg-red-700",
        textColor: "text-white",
        description:
          "Batteries, electronics, paints, chemicals to collection points.",
        items: ["Batteries", "Energy-saving lamps", "Paints", "Solvents"],
      },
    ],
    notes:
      "Extensive separate collection. Deposit System (Palautuspullo/-tölkki) for most beverage bottles/cans.",
  },
  // Norway: High recycling rates, focus on energy recovery. Deposit System (Pant) for most beverage bottles/cans.
  NO: {
    countryName: "Norway",
    bins: [
      {
        name: "Residual Waste (Restavfall)",
        color: "bg-black",
        textColor: "text-white",
        description:
          "General waste that cannot be recycled, often for energy recovery.",
        items: ["Non-recyclable items", "Nappies", "Soiled packaging"],
      },
      {
        name: "Food Waste (Matavfall)",
        color: "bg-green-600",
        textColor: "text-white",
        description: "Separate collection in many areas, often in green bags.",
        items: [
          "Food scraps (all types)",
          "Coffee grounds",
          "Paper towels (food soiled)",
        ],
      },
      {
        name: "Plastic Packaging (Plastemballasje)",
        color: "bg-purple-400",
        description:
          "Clean plastic packaging, often collected in clear bags or designated bins.",
        items: [
          "Plastic bottles",
          "Plastic containers",
          "Plastic film/bags (clean)",
        ],
      },
      {
        name: "Paper/Cardboard/Cartons (Papir/Papp/Drikkekartong)",
        color: "bg-blue-500",
        textColor: "text-white",
        description: "Paper, cardboard, and drink cartons (rinsed, flattened).",
        items: [
          "Newspapers",
          "Magazines",
          "Cardboard boxes",
          "Drink cartons (milk, juice)",
        ],
      },
      {
        name: "Glass & Metal Packaging (Glass- og Metallemballasje)",
        color: "bg-cyan-400",
        description:
          "Glass and metal packaging, often to communal drop-off points.",
        items: [
          "Glass bottles/jars (rinsed)",
          "Metal cans (rinsed)",
          "Foil trays",
        ],
      },
      {
        name: "Hazardous Waste (Farlig avfall)",
        color: "bg-red-600",
        textColor: "text-white",
        description:
          "Batteries, electronics, paint etc. to special collection points.",
        items: [
          "Batteries",
          "Light bulbs",
          "Electronics",
          "Paint",
          "Chemicals",
        ],
      },
    ],
    notes:
      "High recycling rates, focus on energy recovery. Deposit System (Pant) for most beverage bottles/cans.",
  },
  // Belgium: Strong emphasis on separate collection, often using specific color-coded bags or bins. 'Polluter pays' principle. Rules can vary by region (Flanders, Wallonia, Brussels).
  BE: {
    countryName: "Belgium",
    bins: [
      {
        name: "General Waste Bag (Restafval/Déchets résiduels)",
        color: "bg-gray-700",
        textColor: "text-white",
        description:
          "Non-recyclable waste, in designated bags (varies by region).",
        items: ["Non-recyclable items", "Nappies"],
      },
      {
        name: "PMD Bag (Plastics, Metals, Drink Cartons)",
        color: "bg-blue-500",
        textColor: "text-white",
        description:
          "Blue bag for Plastic bottles/flasks, Metal packaging, Drink cartons.",
        items: [
          "Plastic bottles/flasks",
          "Metal cans/trays",
          "Aerosols",
          "Drink cartons",
        ],
      },
      {
        name: "Organic Waste (GFT/Déchets organiques)",
        color: "bg-green-500",
        textColor: "text-white",
        description:
          "Organic waste (kitchen and garden), often in green bags or bins.",
        items: [
          "Fruit/vegetable scraps",
          "Food leftovers",
          "Coffee grounds",
          "Garden waste (small amounts)",
        ],
      },
      {
        name: "Paper/Cardboard (Papier en Karton/Papiers-Cartons)",
        color: "bg-yellow-400",
        description:
          "Clean paper and cardboard, often bundled or in specific containers.",
        items: ["Newspapers", "Magazines", "Cardboard boxes (flattened)"],
      },
      {
        name: "Glass (Glas/Verre)",
        color: "bg-teal-300",
        description:
          "Glass bottles and jars to communal glass containers (clear and colored separated).",
        items: ["Clear glass bottles/jars", "Colored glass bottles/jars"],
      },
      {
        name: "Special Waste (Klein Gevaarlijk Afval/Petits Déchets Dangereux)",
        color: "bg-red-500",
        textColor: "text-white",
        description: "Batteries, paints, oils, electronics to container parks.",
        items: [
          "Batteries",
          "Paints",
          "Oils",
          "Small electronics",
          "Medication",
        ],
      },
    ],
    notes:
      "Strong emphasis on separate collection, often using specific color-coded bags or bins. 'Polluter pays' principle. Rules can vary by region (Flanders, Wallonia, Brussels).",
  },
  // France: Increasing separation, color-coded bins, public drop-off points.
  FR: {
    countryName: "France",
    bins: [
      {
        name: "General Waste (Ordures Ménagères)",
        color: "bg-gray-600",
        textColor: "text-white",
        description:
          "Non-recyclable household waste. Bin color can be green or grey.",
        items: ["Non-recyclable items", "Nappies", "Broken crockery"],
      },
      {
        name: "Packaging (Bac Jaune - Emballages)",
        color: "bg-yellow-400",
        description:
          "Yellow bin for mixed packaging (plastics, metal, cardboard bricks, paper). Rules expanding.",
        items: [
          "Plastic bottles/pots/films",
          "Metal cans/aerosols",
          "Cardboard boxes/bricks (Tetra Pak)",
          "Paper (newspapers, magazines if included)",
        ],
      },
      {
        name: "Glass (Verre)",
        color: "bg-green-700",
        textColor: "text-white",
        description:
          "Glass bottles and jars (no lids, rinsed) to communal bins (often white or green).",
        items: ["Glass bottles (wine, juice)", "Glass jars (food)"],
      },
      {
        name: "Organic Waste (Déchets Alimentaires/Compost)",
        color: "bg-brown-500",
        textColor: "text-white",
        description:
          "Organic waste collection is increasing, or for home composting.",
        items: [
          "Fruit/vegetable scraps",
          "Food leftovers (check local rules)",
          "Coffee grounds",
          "Garden waste (if accepted)",
        ],
      },
      {
        name: "Special Waste (Déchetterie)",
        color: "bg-red-600",
        textColor: "text-white",
        description:
          "Bulky waste, electronics, hazardous items to local waste collection centers (déchetterie).",
        items: ["Furniture", "Electronics", "Batteries", "Paint", "Chemicals"],
      },
    ],
    notes:
      "Increasingly harmonized national guidelines ('Tri Sélectif'). Yellow bin (bac jaune) rules are expanding to include more plastics. Check local municipality for specifics.",
  },
  // Italy: Varies by region/municipality, door-to-door and street bin systems.
  IT: {
    countryName: "Italy",
    bins: [
      {
        name: "General Waste (Indifferenziato/Secco Residuo)",
        color: "bg-gray-700",
        textColor: "text-white",
        description: "Non-recyclable waste.",
        items: ["Non-recyclable items", "Nappies", "Ceramics"],
      },
      {
        name: "Organic Waste (Organico/Umido)",
        color: "bg-brown-600",
        textColor: "text-white",
        description: "Organic food waste and sometimes garden waste.",
        items: [
          "Food scraps (fruit, vegetables, meat, fish)",
          "Coffee grounds",
          "Tea bags",
          "Soiled paper towels",
        ],
      },
      {
        name: "Plastic & Metals (Plastica e Metalli)",
        color: "bg-yellow-500",
        description:
          "Often collected together: Plastic bottles/containers, metal cans/foil.",
        items: [
          "Plastic bottles/containers (rinsed)",
          "Plastic bags/film (check local)",
          "Metal cans (food, beverage)",
          "Aluminum foil/trays",
        ],
      },
      {
        name: "Paper/Cardboard (Carta e Cartone)",
        color: "bg-blue-500",
        textColor: "text-white",
        description: "Clean paper and cardboard.",
        items: [
          "Newspapers",
          "Magazines",
          "Cardboard boxes (flattened)",
          "Paper bags",
          "Drink cartons (check local if with paper or plastic)",
        ],
      },
      {
        name: "Glass (Vetro)",
        color: "bg-green-500",
        textColor: "text-white",
        description: "Glass bottles and jars (rinsed, no lids).",
        items: ["Glass bottles", "Glass jars"],
      },
      {
        name: "Special Waste (Rifiuti Speciali/RAEE)",
        color: "bg-red-700",
        textColor: "text-white",
        description:
          "Batteries, electronics (RAEE), medicines, bulky items to ecological islands or collection services.",
        items: ["Batteries", "Electronics", "Medicines", "Light bulbs"],
      },
    ],
    notes:
      "Highly variable by municipality ('comune'). Door-to-door ('porta a porta') collection is common. 'Raccolta Differenziata' is the term for separate collection. Always check local rules.",
  },
  // United Kingdom: Varies by council, common multi-stream or co-mingled collections.
  GB: {
    countryName: "United Kingdom",
    bins: [
      {
        name: "General Waste (Residual Waste)",
        color: "bg-black",
        textColor: "text-white",
        description:
          "Non-recyclable household waste. Bin color often black, but can be grey or green.",
        items: [
          "Non-recyclable items",
          "Plastic bags/film (most areas)",
          "Polystyrene",
          "Nappies",
        ],
      },
      {
        name: "Mixed Dry Recycling",
        color: "bg-blue-600",
        textColor: "text-white",
        description:
          "Often mixed: paper, cardboard, plastic bottles, cans. Contents vary by council.",
        items: [
          "Paper (newspapers, magazines)",
          "Cardboard (flattened boxes)",
          "Plastic bottles (rinsed, lids on/off varies)",
          "Metal cans (food, drink, rinsed)",
          "Glass bottles/jars (sometimes included, or separate)",
        ],
      },
      {
        name: "Food & Garden Waste (Organics)",
        color: "bg-brown-500",
        textColor: "text-white",
        description: "Food scraps and/or garden waste. Collection varies.",
        items: [
          "Food scraps (all types, cooked/uncooked)",
          "Garden waste (grass, leaves, small branches)",
          "Tea bags",
          "Coffee grounds",
        ],
      },
      {
        name: "Glass (Separate Collection)",
        color: "bg-green-300",
        description:
          "Glass bottles and jars, if not in mixed recycling. Often to bottle banks.",
        items: ["Glass bottles (all colors)", "Glass jars"],
      },
      {
        name: "Household Waste Recycling Centre (HWRC)",
        color: "bg-purple-600",
        textColor: "text-white",
        description:
          "For bulky items, electronics, batteries, hazardous waste, extra recyclables.",
        items: [
          "Furniture",
          "Electronics (WEEE)",
          "Batteries",
          "Wood",
          "Rubble",
          "Chemicals",
        ],
      },
    ],
    notes:
      "Decentralized, highly variable by local authority (council). Check your council's website for specific rules. 'Kerbside' collection is common.",
  },
  // Canada: Varies by province/municipality, common multi-stream systems.
  CA: {
    countryName: "Canada",
    bins: [
      {
        name: "General Waste/Garbage",
        color: "bg-gray-700",
        textColor: "text-white",
        description: "Non-recyclable waste.",
        items: [
          "Non-recyclable items",
          "Plastic bags/film (most areas)",
          "Styrofoam",
          "Broken glass (wrapped)",
        ],
      },
      {
        name: "Blue Bin/Box (Recycling)",
        color: "bg-blue-500",
        textColor: "text-white",
        description:
          "Often single-stream for mixed paper, cardboard, plastic containers (check numbers), glass, metal cans. Varies by municipality.",
        items: [
          "Paper (newspapers, flyers)",
          "Cardboard (flattened)",
          "Plastic containers (#1-7, check local)",
          "Glass bottles/jars",
          "Metal cans",
          "Milk/juice cartons",
        ],
      },
      {
        name: "Green Bin (Organic Waste)",
        color: "bg-green-600",
        textColor: "text-white",
        description:
          "Food scraps and garden waste. Common in many urban areas.",
        items: [
          "Food scraps (all types)",
          "Soiled paper products (napkins, pizza boxes if allowed)",
          "Coffee grounds",
          "Tea bags",
          "Yard waste",
        ],
      },
      {
        name: "Special Waste Drop-off (Depots/Round-ups)",
        color: "bg-red-600",
        textColor: "text-white",
        description:
          "For electronics, batteries, hazardous waste, paint, tires.",
        items: [
          "Electronics",
          "Batteries",
          "Household hazardous waste (chemicals, paint)",
          "Tires",
        ],
      },
    ],
    notes:
      "Decentralized by province and municipality. 'Blue Bin' programs are widespread. Organic waste collection (Green Bin) is common in cities.",
  },
  // United States: Highly variable by municipality, often single-stream or dual-stream.
  US: {
    countryName: "United States",
    bins: [
      {
        name: "Trash/Garbage (General Waste)",
        color: "bg-black",
        textColor: "text-white",
        description: "General non-recyclable household waste.",
        items: [
          "Non-recyclable items",
          "Plastic bags/film",
          "Styrofoam",
          "Food-soiled paper (unless composted)",
          "Broken ceramics/glass (wrapped)",
        ],
      },
      {
        name: "Recycling (Single Stream or Multi-Stream)",
        color: "bg-blue-600",
        textColor: "text-white",
        description:
          "Commonly single-stream (mixed paper, cardboard, plastic containers, glass, metal cans). Rules vary widely by municipality.",
        items: [
          "Paper (newspaper, mail, magazines)",
          "Cardboard (flattened)",
          "Plastic bottles & containers (check local for accepted numbers, typically #1, #2, #5; clean & empty)",
          "Glass bottles & jars (clean & empty)",
          "Metal cans (aluminum, steel; clean & empty)",
        ],
      },
      {
        name: "Compost/Organics (Green Waste)",
        color: "bg-green-600",
        textColor: "text-white",
        description: "Food scraps and yard waste. Availability and rules vary.",
        items: [
          "Fruit/vegetable scraps",
          "Yard trimmings (leaves, grass)",
          "Coffee grounds",
          "Eggshells",
          "Food-soiled paper (if allowed locally)",
        ],
      },
      {
        name: "Special Waste (Drop-off/Collection Events)",
        color: "bg-red-700",
        textColor: "text-white",
        description:
          "For electronics (e-waste), batteries, hazardous household waste (HHW), paint, medications.",
        items: [
          "Electronics",
          "Batteries",
          "Fluorescent bulbs",
          "Paint",
          "Chemicals",
          "Unused medications",
        ],
      },
    ],
    notes:
      "Extremely decentralized, managed at municipal or county level. Single-stream recycling is common, but what's accepted varies significantly. Always check local guidelines.",
  },
  // Australia: Typically multi-stream with kerbside collection; container deposit schemes in some states.
  AU: {
    countryName: "Australia",
    bins: [
      {
        name: "General Waste/Landfill (Red Lid)",
        color: "bg-red-600",
        textColor: "text-white",
        description:
          "Non-recyclable waste for landfill. Typically red-lidded bin.",
        items: [
          "Non-recyclable items",
          "Plastic bags/soft plastics (unless specific program like REDcycle)",
          "Nappies",
          "Broken crockery",
          "Polystyrene",
        ],
      },
      {
        name: "Mixed Recyclables (Yellow Lid)",
        color: "bg-yellow-400",
        description:
          "Commonly for paper, cardboard, plastic bottles/containers, metal cans, glass bottles/jars. Typically yellow-lidded bin.",
        items: [
          "Paper (clean)",
          "Cardboard (flattened)",
          "Plastic bottles/containers (rigid, empty, lids off/on varies)",
          "Steel/aluminum cans (empty)",
          "Glass bottles/jars (empty, lids off)",
        ],
      },
      {
        name: "Organics/Garden Waste (Green Lid)",
        color: "bg-green-500",
        textColor: "text-white",
        description:
          "Food scraps and garden waste. Availability varies. Typically green-lidded bin.",
        items: [
          "Food scraps (all types)",
          "Garden waste (lawn clippings, leaves, small branches)",
          "Soiled paper/cardboard (check council)",
          "Coffee grounds",
          "Tea bags",
        ],
      },
      {
        name: "Special Waste (Council Drop-off/Services)",
        color: "bg-purple-500",
        textColor: "text-white",
        description:
          "For e-waste, batteries, chemicals, mattresses, white goods. Check council for services.",
        items: [
          "E-waste (computers, TVs)",
          "Batteries",
          "Chemicals (paints, oils)",
          "Mattresses",
          "White goods (fridges, washing machines)",
        ],
      },
    ],
    notes:
      "Largely standardized bin lid colors nationally (Red, Yellow, Green), but accepted contents can vary by local council. Check your local council's website.",
  },
  // New Zealand: Kerbside recycling common, focus on waste minimization.
  NZ: {
    countryName: "New Zealand",
    bins: [
      {
        name: "General Waste/Refuse (Red Lid)",
        color: "bg-red-700",
        textColor: "text-white",
        description:
          "Non-recyclable waste for landfill. Typically red-lidded bin.",
        items: [
          "Non-recyclable items",
          "Plastic bags/soft plastics (check local)",
          "Nappies",
          "Polystyrene",
          "Broken glass (wrapped)",
        ],
      },
      {
        name: "Mixed Recyclables (Yellow Lid)",
        color: "bg-yellow-400",
        description:
          "Commonly for paper, cardboard, plastic containers (#1, #2, #5 typically), metal cans, glass. Typically yellow-lidded bin.",
        items: [
          "Paper (clean)",
          "Cardboard (flattened)",
          "Plastic containers (#1, #2, #5 - clean, lids off)",
          "Metal cans (clean)",
          "Glass bottles/jars (clean, lids off - sometimes separate)",
        ],
      },
      {
        name: "Organics/Food & Garden Waste (Green Lid or separate)",
        color: "bg-green-500",
        textColor: "text-white",
        description:
          "Food scraps and garden waste. Availability and system vary.",
        items: [
          "Food scraps (all types)",
          "Garden waste",
          "Coffee grounds",
          "Tea bags",
        ],
      },
      {
        name: "Glass (Separate Crate/Bin)",
        color: "bg-blue-300",
        description:
          "Glass bottles and jars, often collected separately in a crate or small bin.",
        items: ["Glass bottles (all colors)", "Glass jars"],
      },
      {
        name: "Transfer Stations/Community Recycling Centres",
        color: "bg-indigo-500",
        textColor: "text-white",
        description:
          "For larger items, e-waste, hazardous waste, excess recycling.",
        items: [
          "E-waste",
          "Batteries",
          "Hazardous waste",
          "Whiteware",
          "Scrap metal",
          "Tyres",
        ],
      },
    ],
    notes:
      "Similar to Australia, with increasingly standardized bin colors but varying rules by council. Glass often collected separately.",
  },
  // Singapore: Advanced waste-to-energy incineration for general waste. Focus on reducing contamination in blue recycling bins. Food waste separate collection is more common for commercial/industrial.
  SG: {
    countryName: "Singapore",
    bins: [
      {
        name: "General Waste (Incineration)",
        color: "bg-green-700",
        textColor: "text-white",
        description:
          "General waste for incineration at Waste-to-Energy plants. Typically green or brown bins.",
        items: [
          "Non-recyclable items",
          "Food waste (residential generally)",
          "Soiled packaging",
          "Disposable plastics not accepted for recycling",
        ],
      },
      {
        name: "Recycling (Blue Bins)",
        color: "bg-blue-500",
        textColor: "text-white",
        description:
          "Mixed recyclables (paper, plastic, glass, metal) in blue bins. No need to sort. Ensure items are clean.",
        items: [
          "Paper/cardboard (clean)",
          "Plastic bottles/containers (rinsed)",
          "Glass bottles/jars (rinsed)",
          "Metal cans (rinsed)",
        ],
      },
      {
        name: "E-waste (Regulated Collection Points)",
        color: "bg-purple-600",
        textColor: "text-white",
        description:
          "Electronic waste to be brought to designated e-waste collection points (e.g., ALBA bins).",
        items: [
          "Computers",
          "Mobile phones",
          "Batteries (portable)",
          "Lamps",
          "Large appliances (via take-back schemes)",
        ],
      },
    ],
    notes:
      "Advanced waste-to-energy incineration for general waste. Focus on reducing contamination in blue recycling bins. Food waste separate collection is more common for commercial/industrial.",
  },
  // Denmark: Very high recycling rates, extensive use of waste-to-energy. Sorting systems can have many fractions (up to 10 or more). Deposit System (Pant) for most beverage containers.
  DK: {
    countryName: "Denmark",
    bins: [
      {
        name: "Residual Waste (Restaffald)",
        color: "bg-gray-600",
        textColor: "text-white",
        description:
          "General waste that cannot be sorted into other fractions, often for energy recovery.",
        items: [
          "Non-recyclable items",
          "Pizza boxes (greasy)",
          "Milk/juice cartons (check local, some sort as cardboard)",
          "Nappies",
          "Vacuum cleaner bags",
        ],
      },
      {
        name: "Food & Garden Waste (Mad- og Haveaffald/Bioaffald)",
        color: "bg-green-600",
        textColor: "text-white",
        description: "Organic waste from kitchen and garden.",
        items: [
          "Food scraps (all types)",
          "Coffee grounds/filters",
          "Tea bags",
          "Small garden waste (leaves, grass)",
        ],
      },
      {
        name: "Paper & Small Cardboard (Papir og Småt Pap)",
        color: "bg-blue-400",
        description: "Clean paper and small cardboard items.",
        items: [
          "Newspapers",
          "Magazines",
          "Advertisements",
          "Office paper",
          "Small cardboard boxes (e.g. cereal boxes, shoe boxes - flattened)",
        ],
      },
      {
        name: "Glass (Glas)",
        color: "bg-purple-500",
        textColor: "text-white",
        description: "Clean glass bottles and jars (no lids).",
        items: [
          "Glass bottles (wine, beer, soda)",
          "Glass jars (food containers)",
        ],
      },
      {
        name: "Plastic & Metal & Food/Drink Cartons (Plast, Metal & Mad- og Drikkekartoner)",
        color: "bg-orange-500",
        description:
          "Combined collection for clean hard plastic packaging, metal packaging, and food/drink cartons.",
        items: [
          "Plastic packaging (bottles, tubs - clean)",
          "Metal cans/foil (clean)",
          "Food/drink cartons (rinsed, flattened)",
        ],
      },
      {
        name: "Hazardous Waste (Farligt Affald)",
        color: "bg-red-700",
        textColor: "text-white",
        description:
          "Chemicals, paints, electronics, batteries to municipal collection points.",
        items: [
          "Batteries",
          "Electronics (small)",
          "Light bulbs (energy saving, fluorescent)",
          "Paint",
          "Chemicals",
          "Spray cans (with contents)",
        ],
      },
    ],
    notes:
      "Very high recycling rates, extensive use of waste-to-energy. Sorting systems can have many fractions (up to 10 or more). Deposit System (Pant) for most beverage containers.",
  },
  // Spain: Color-coded bins for paper, glass, packaging; organic waste separation expanding.
  ES: {
    countryName: "Spain",
    bins: [
      {
        name: "General Waste/Organic (Contenedor Gris/Marrón - Resto/Orgánico)",
        color: "bg-gray-500",
        textColor: "text-white",
        description:
          "Grey bin for general non-recyclable waste. Brown bin (where available) for organic waste.",
        items: [
          "Non-recyclable items (grey bin)",
          "Food scraps, garden waste (brown bin if present)",
        ],
      },
      {
        name: "Packaging - Plastics, Cans, Bricks (Contenedor Amarillo - Envases)",
        color: "bg-yellow-400",
        description:
          "Yellow bin for light packaging: plastic containers, metal cans, bricks (Tetrabriks).",
        items: [
          "Plastic bottles/containers",
          "Plastic bags (check local)",
          "Metal cans (food, drink)",
          "Aerosols",
          "Tetrabriks (milk, juice cartons)",
          "Aluminum foil/trays",
          "Plastic/metal lids",
        ],
      },
      {
        name: "Paper/Cardboard (Contenedor Azul - Papel y Cartón)",
        color: "bg-blue-500",
        textColor: "text-white",
        description: "Blue bin for clean paper and cardboard.",
        items: [
          "Newspapers",
          "Magazines",
          "Cardboard boxes (flattened)",
          "Paper bags",
          "Books",
        ],
      },
      {
        name: "Glass (Contenedor Verde - Vidrio)",
        color: "bg-green-500",
        textColor: "text-white",
        description:
          "Green igloo-shaped bin for glass bottles and jars (no lids, corks, or ceramics).",
        items: [
          "Glass bottles (wine, beer, water)",
          "Glass jars (food, cosmetics)",
        ],
      },
      {
        name: "Special Collection Points (Punto Limpio/Ecoparque)",
        color: "bg-purple-600",
        textColor: "text-white",
        description:
          "For bulky items, electronics, batteries, hazardous waste, cooking oil.",
        items: [
          "Furniture",
          "Appliances",
          "Electronics",
          "Batteries",
          "Paint",
          "Chemicals",
          "Used cooking oil",
        ],
      },
    ],
    notes:
      "Varies regionally, but generally uses color-coded communal bins. Brown bin for organics is becoming more common. 'Punto Limpio' for special wastes.",
  },
  // Brazil: Growing recycling infrastructure, often relies on waste picker cooperatives.
  BR: {
    countryName: "Brazil",
    bins: [
      {
        name: "Lixo Comum (General Waste)",
        color: "bg-black",
        textColor: "text-white",
        description: "Non-recyclable waste.",
        items: [
          "Non-recyclable items",
          "Food-soiled paper",
          "Nappies",
          "Ceramics",
          "Polystyrene",
        ],
      },
      {
        name: "Recicláveis (Recyclables)",
        color: "bg-blue-500",
        textColor: "text-white",
        description:
          "Recyclable materials: paper, cardboard, plastics, metals. Check local guidelines.",
        items: [
          "Paper (newspapers, magazines)",
          "Cardboard (flattened)",
          "Plastic bottles/containers (rinsed)",
          "Metal cans (rinsed)",
        ],
      },
      {
        name: "Orgânicos (Organic Waste)",
        color: "bg-green-600",
        textColor: "text-white",
        description: "Organic waste for composting.",
        items: [
          "Fruit/vegetable scraps",
          "Coffee grounds",
          "Tea bags",
          "Garden waste",
        ],
      },
      {
        name: "Perigosos (Hazardous Waste)",
        color: "bg-red-600",
        textColor: "text-white",
        description:
          "Hazardous materials like batteries, electronics, and chemicals.",
        items: [
          "Batteries",
          "Electronics",
          "Light bulbs",
          "Chemicals",
          "Paint",
        ],
      },
    ],
    notes:
      "Recycling systems vary widely. In many areas, waste pickers play a crucial role in recycling. Check local guidelines.",
  },
  // India: Waste management challenges, informal sector plays a large role, formal systems developing.
  IN: {
    countryName: "India",
    bins: [
      {
        name: "General Waste (Dry Waste)",
        color: "bg-black",
        textColor: "text-white",
        description:
          "Non-recyclable waste, including dry items like plastic, metal, and glass.",
        items: [
          "Non-recyclable items",
          "Plastic bags/film",
          "Polystyrene",
          "Broken glass (wrapped)",
        ],
      },
      {
        name: "Wet Waste (Organic Waste)",
        color: "bg-green-600",
        textColor: "text-white",
        description:
          "Organic waste like food scraps and garden waste. Usually collected separately.",
        items: [
          "Food scraps (all types)",
          "Garden waste",
          "Coffee grounds",
          "Tea bags",
        ],
      },
      {
        name: "Recyclable Waste (Dry Recyclables)",
        color: "bg-blue-500",
        textColor: "text-white",
        description:
          "Recyclable materials: paper, cardboard, plastics, metals. Check local guidelines.",
        items: [
          "Paper (newspapers, magazines)",
          "Cardboard (flattened)",
          "Plastic bottles/containers (rinsed)",
          "Metal cans (rinsed)",
        ],
      },
      {
        name: "Hazardous Waste",
        color: "bg-red-700",
        textColor: "text-white",
        description:
          "Hazardous materials like batteries, electronics, and chemicals.",
        items: [
          "Batteries",
          "Electronics",
          "Light bulbs",
          "Chemicals",
          "Paint",
        ],
      },
    ],
    notes:
      "Informal sector plays a significant role in waste management. Check local guidelines for segregation and disposal.",
  },
  // China: Rapidly developing waste management, promoting sorting in major cities.
  CN: {
    countryName: "China",
    bins: [
      {
        name: "干垃圾 (Dry Waste)",
        color: "bg-black",
        textColor: "text-white",
        description:
          "Non-recyclable waste, including items like plastic, metal, and glass.",
        items: [
          "Non-recyclable items",
          "Plastic bags/film",
          "Polystyrene",
          "Broken glass (wrapped)",
        ],
      },
      {
        name: "湿垃圾 (Wet Waste)",
        color: "bg-green-600",
        textColor: "text-white",
        description:
          "Organic waste like food scraps and garden waste. Usually collected separately.",
        items: [
          "Food scraps (all types)",
          "Garden waste",
          "Coffee grounds",
          "Tea bags",
        ],
      },
      {
        name: "可回收物 (Recyclable Waste)",
        color: "bg-blue-500",
        textColor: "text-white",
        description:
          "Recyclable materials: paper, cardboard, plastics, metals. Check local guidelines.",
        items: [
          "Paper (newspapers, magazines)",
          "Cardboard (flattened)",
          "Plastic bottles/containers (rinsed)",
          "Metal cans (rinsed)",
        ],
      },
      {
        name: "有害垃圾 (Hazardous Waste)",
        color: "bg-red-700",
        textColor: "text-white",
        description:
          "Hazardous materials like batteries, electronics, and chemicals.",
        items: [
          "Batteries",
          "Electronics",
          "Light bulbs",
          "Chemicals",
          "Paint",
        ],
      },
    ],
    notes:
      "Waste sorting is mandatory in many cities. Check local regulations for specific sorting and disposal guidelines.",
  },
  // South Africa: Developing formal recycling, focus on job creation in waste sector.
  ZA: {
    countryName: "South Africa",
    bins: [
      {
        name: "General Waste (Black Bag)",
        color: "bg-black",
        textColor: "text-white",
        description:
          "Non-recyclable waste, typically in black bags. Includes items like food waste, nappies, and other non-recyclables.",
        items: [
          "Non-recyclable items",
          "Food waste",
          "Nappies",
          "Broken glass (wrapped)",
        ],
      },
      {
        name: "Recyclable Waste (Blue Bag)",
        color: "bg-blue-500",
        textColor: "text-white",
        description:
          "Recyclable materials: paper, cardboard, plastics, metals. Usually in blue bags.",
        items: [
          "Paper (newspapers, magazines)",
          "Cardboard (flattened)",
          "Plastic bottles/containers (rinsed)",
          "Metal cans (rinsed)",
        ],
      },
      {
        name: "Garden Refuse (Green Waste)",
        color: "bg-green-600",
        textColor: "text-white",
        description:
          "Garden waste like grass, leaves, and branches. Often collected separately.",
        items: ["Garden waste", "Grass clippings", "Leaves", "Small branches"],
      },
      {
        name: "Hazardous Waste",
        color: "bg-red-700",
        textColor: "text-white",
        description:
          "Hazardous materials like batteries, electronics, and chemicals.",
        items: [
          "Batteries",
          "Electronics",
          "Light bulbs",
          "Chemicals",
          "Paint",
        ],
      },
    ],
    notes:
      "Recycling systems are developing. Check local guidelines for separation and disposal.",
  },
};

// Maps Teachable Machine prediction classes to common bin/material types and advice
const classToBinMapping: Record<
  string,
  { binNameKeywords: string[]; advice?: string }
> = {
  Paper: {
    binNameKeywords: ["paper", "papiertonne", "papier", "papel", "carta"],
    advice: "Ensure it's clean and dry. Remove any plastic wrapping.",
  },
  Cardboard: {
    binNameKeywords: ["cardboard", "karton", "pappe", "cartone", "cartón"],
    advice: "Flatten boxes to save space. Remove tape if possible.",
  },
  Plastic: {
    binNameKeywords: [
      "plastic",
      "plastics",
      "kunststoff",
      "plastik",
      "plastique",
      "plastica",
      "plástico",
      "packaging",
      "pmd",
      "envases",
      "leichtverpackungen",
    ],
    advice:
      "Empty, rinse, and remove lids if required locally. Check local guidelines for accepted plastic types/numbers.",
  },
  Glass: {
    binNameKeywords: ["glass", "verre", "vetro", "glas", "vidrio"],
    advice:
      "Rinse containers. Remove lids. Some areas require color separation.",
  },
  Metal: {
    binNameKeywords: [
      "metal",
      "metals",
      "metall",
      "métal",
      "metallo",
      "pmd",
      "envases",
      "leichtverpackungen",
    ],
    advice: "Empty and rinse cans. Be careful of sharp edges.",
  },
  Organic: {
    binNameKeywords: [
      "organic",
      "bio",
      "food waste",
      "garden waste",
      "compost",
      "biotonne",
      "organico",
      "umido",
      "gft",
      "matavfall",
      "biojäte",
    ],
    advice:
      "No plastic bags (even biodegradable ones) unless specified by local council. Avoid liquids, oils, and large bones unless permitted.",
  },
  Trash: {
    binNameKeywords: [
      "general waste",
      "residual waste",
      "restmüll",
      "trash",
      "garbage",
      "mixed waste",
      "indifferenziato",
      "secco",
      "restafval",
      "ordures ménagères",
      "resto",
      "brännbart",
      "sekajäte",
    ],
    advice:
      "When in doubt, and it's not hazardous or recyclable, put it here. Avoid putting recyclables or hazardous waste in general trash.",
  },
  Battery: {
    binNameKeywords: [
      "battery",
      "batteries",
      "special waste",
      "hazardous",
      "farlig",
      "gevaarlijk",
      "dangereux",
      "sonderabfälle",
      "piles",
    ],
    advice:
      "Do not put in regular bins. Take to designated collection points (e.g., supermarkets, recycling centers).",
  },
  Ewaste: {
    binNameKeywords: [
      "e-waste",
      "electronic waste",
      "electronics",
      "special waste",
      "hazardous",
      "weee",
      "raee",
      "elavfall",
      "déchetterie",
    ],
    advice:
      "Electronic waste. Take to designated collection points or check for retailer take-back schemes.",
  },
};

// Retrieves bin information for the currently selected country.
const getBinForPrediction = (
  predictionClass: string,
  countryCode: string
): BinInfo & { advice?: string } => {
  const countryData = countrySpecificBinInfo[countryCode];
  const defaultBinInfo = {
    name: "Check Locally",
    description: "Please check local municipal guidelines for this item.",
    color: "bg-gray-400",
    textColor: "text-white",
    items: [predictionClass],
    advice: "Local rules are key!",
  };

  if (!countryData) {
    return {
      ...defaultBinInfo,
      name: "Info Not Found",
      description: `Country data missing for ${countryCode}.`,
    };
  }

  const mappedInfo = classToBinMapping[predictionClass];
  let targetBin: (BinInfo & { advice?: string }) | undefined = undefined;

  if (mappedInfo) {
    for (const bin of countryData.bins) {
      const binNameLower = bin.name.toLowerCase();
      const binDescLower = bin.description.toLowerCase();

      if (
        mappedInfo.binNameKeywords.some(
          (keyword) =>
            binNameLower.includes(keyword) || binDescLower.includes(keyword)
        )
      ) {
        targetBin = { ...bin, advice: mappedInfo.advice };
        break;
      }
    }
  }

  // If a specific bin is found through keywords
  if (targetBin) {
    return targetBin;
  }

  // Fallback for Battery/E-waste if not found by primary keywords, try more generic hazardous/special waste bins
  if (predictionClass === "Battery" || predictionClass === "Ewaste") {
    const specialWasteKeywords = [
      "special",
      "hazardous",
      "e-waste",
      "electronics",
      "battery",
      "batteries",
      "déchetterie",
      "punto limpio",
      "hwrc",
      "transfer station",
      "recycling centre",
    ];
    for (const bin of countryData.bins) {
      const binNameLower = bin.name.toLowerCase();
      const binDescLower = bin.description.toLowerCase();
      if (
        specialWasteKeywords.some(
          (keyword) =>
            binNameLower.includes(keyword) || binDescLower.includes(keyword)
        )
      ) {
        return {
          ...bin,
          advice:
            mappedInfo?.advice ||
            "Take to designated collection points for hazardous/electronic waste.",
        };
      }
    }
  }

  // Fallback: If no specific bin found, default to the primary "General Waste" bin of the country
  const generalWasteKeywords = [
    "general waste",
    "residual waste",
    "restmüll",
    "trash",
    "garbage",
    "mixed waste",
    "indifferenziato",
    "secco",
    "restafval",
    "ordures ménagères",
    "resto",
    "brännbart",
    "sekajäte",
    "landfill",
    "refuse",
  ];
  for (const bin of countryData.bins) {
    const binNameLower = bin.name.toLowerCase();
    // Prioritize bins explicitly named "General Waste" or similar primary terms
    if (
      generalWasteKeywords.some(
        (keyword) =>
          binNameLower.startsWith(keyword) || bin.name.toLowerCase() === keyword
      )
    ) {
      return {
        ...bin,
        advice: `Item '${predictionClass}' not specifically matched. If not recyclable or hazardous, it likely goes here. Please verify locally.`,
      };
    }
  }
  // Broader search if strict general waste not found
  for (const bin of countryData.bins) {
    const binNameLower = bin.name.toLowerCase();
    const binDescLower = bin.description.toLowerCase();
    if (
      generalWasteKeywords.some(
        (keyword) =>
          binNameLower.includes(keyword) || binDescLower.includes(keyword)
      )
    ) {
      return {
        ...bin,
        advice: `Item '${predictionClass}' not specifically matched. If not recyclable or hazardous, it likely goes here. Please verify locally.`,
      };
    }
  }

  // Absolute fallback if no general waste bin is identified by keywords
  return {
    ...defaultBinInfo,
    description: `Could not determine the correct bin for '${predictionClass}' in ${countryData.countryName}. Please check local guidelines.`,
  };
};

// List of supported country codes for the dropdown.
const supportedCountries = Object.keys(countrySpecificBinInfo);

// Sort countries alphabetically, but keep US at the top
const sortedCountries = supportedCountries.sort((a, b) => {
  if (a === "US") return -1;
  if (b === "US") return 1;
  return countrySpecificBinInfo[a].countryName.localeCompare(
    countrySpecificBinInfo[b].countryName
  );
});

// Main page component for the trash sorter application.
export default function Home() {
  // State for the currently selected country code.
  const [selectedCountry, setSelectedCountry] = useState<string>("DE"); // Default to Germany.
  // State for the prediction result from Teachable Machine.
  const [predictionResult, setPredictionResult] = useState<string | null>(null);

  // URL for your Teachable Machine model.
  // Ensure this is the full URL to the `model.json` file hosted by Teachable Machine.
  const modelUrl = "https://teachablemachine.withgoogle.com/models/xBp9J61Qn/"; // Updated model URL

  // Retrieves bin information for the currently selected country.
  const currentBinInfo = countrySpecificBinInfo[selectedCountry];

  // Handler for when a prediction is made by the Teachable Machine.
  const handlePrediction = (className: string) => {
    setPredictionResult(`Predicted: ${className}`);
    // Potentially trigger other actions based on prediction
  };

  return (
    <main className="flex flex-col min-h-screen bg-pale-leaf font-sans items-center text-forest-green p-4 md:p-8">
      <div className="w-full max-w-6xl mx-auto mt-8 space-y-12">
        {/* Header section */}
        <header className="text-center space-y-4">
          <h1 className="text-5xl md:text-6xl font-serif text-pine-green font-bold">
            EcoHub Trash Sorter
          </h1>
          <p className="text-lg md:text-xl text-bark-brown max-w-2xl mx-auto">
            Confused about where your trash goes? Select your country and use
            our AI-powered sorter to learn how to recycle right and reduce your
            environmental impact.
          </p>
        </header>

        {/* Teachable Machine client section */}
        <section
          id="trash-sorter"
          className="bg-white/80 backdrop-blur-sm p-6 md:p-8 rounded-xl shadow-2xl hover:shadow-pine-green/30 transition-shadow duration-300"
        >
          <h2 className="text-3xl md:text-4xl font-serif text-pine-green mb-6 text-center">
            What item are you sorting?
          </h2>
          {/* Teachable Machine Client */}
          <div className="bg-white p-6 rounded-xl shadow-2xl">
            <TeachableMachineClient
              modelUrl={modelUrl}
              onPrediction={handlePrediction}
            />
            <p className="text-xs text-gray-600 mt-2 text-center">
              For best accuracy, please use a solid white, black, or grey
              background.
            </p>
            {/* Country Selector */}
            <div className="mt-4">
              {/* Display prediction result */}
              {predictionResult && (
                <div className="mt-4 text-center p-4 bg-leaf-green/50 rounded-md">
                  <p className="text-lg text-pine-green font-semibold">
                    {predictionResult}
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Country selection and bin information section */}
        <section
          id="bin-info"
          className="bg-white/80 backdrop-blur-sm p-6 md:p-8 rounded-xl shadow-2xl hover:shadow-pine-green/30 transition-shadow duration-300"
        >
          <h2 className="text-3xl md:text-4xl font-serif text-pine-green mb-6 text-center">
            Recycling & Waste Bins in Your Area
          </h2>
          {/* Country selector dropdown */}
          <div className="mb-8 text-center">
            <label
              htmlFor="country-select"
              className="block text-lg font-medium text-bark-brown mb-2"
            >
              Select your country:
            </label>
            <select
              id="country-select"
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="mt-1 block w-full max-w-md mx-auto pl-3 pr-10 py-2 text-base border-stone-gray focus:outline-none focus:ring-pine-green focus:border-pine-green sm:text-sm rounded-md shadow-sm bg-white border"
            >
              {sortedCountries.map((countryCode) => (
                <option key={countryCode} value={countryCode}>
                  {countrySpecificBinInfo[countryCode].countryName}
                </option>
              ))}
            </select>
          </div>

          {/* Display bin information for the selected country */}
          {currentBinInfo && (
            <div className="space-y-6">
              <h3 className="text-2xl md:text-3xl font-serif text-pine-green mb-4 text-center">
                {currentBinInfo.countryName}
              </h3>
              {currentBinInfo.notes && (
                <p className="mb-6 text-md text-bark-brown bg-leaf-green/30 p-4 rounded-lg italic">
                  <strong>Note:</strong> {currentBinInfo.notes}
                </p>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentBinInfo.bins.map((bin) => (
                  <div
                    key={bin.name}
                    className={`${bin.color} ${
                      bin.textColor || "text-gray-900"
                    } p-6 rounded-lg shadow-lg transition-transform hover:scale-105 duration-300 flex flex-col`}
                  >
                    <h4 className="text-xl font-bold mb-2 font-serif">
                      {bin.name}
                    </h4>
                    <p className="text-sm mb-3 flex-grow">{bin.description}</p>
                    <div>
                      <p className="text-xs font-semibold mb-1">
                        Common items:
                      </p>
                      <ul className="list-disc list-inside text-xs space-y-1">
                        {bin.items.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* Call to action to visit the Carbon Quiz page */}
        <section className="text-center py-8">
          <h2 className="text-3xl md:text-4xl font-serif text-pine-green mb-4">
            Curious About Your Carbon Footprint?
          </h2>
          <p className="text-lg text-bark-brown mb-6 max-w-xl mx-auto">
            Take our quiz to understand your environmental impact and find ways
            to live more sustainably.
          </p>
          <a
            href="/carbon-quiz"
            className="inline-block bg-pine-green text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-forest-green transition-colors duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
          >
            Take the Carbon Quiz
          </a>
        </section>
      </div>

      {/* Footer section */}
      <footer className="w-full max-w-6xl mx-auto text-center py-8 mt-12 border-t border-stone-gray/50">
        <p className="text-sm text-stone-gray">
          &copy; {new Date().getFullYear()} EcoHub. Sorting our future, one
          piece of trash at a time.
        </p>
      </footer>
    </main>
  );
}
