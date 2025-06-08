"use client";

import { useState, useEffect, useCallback } from "react";
import TeachableMachineClient from "../components/TeachableMachineClient";

// Defines the structure for a single waste bin.
interface Bin {
  name: string;
  color: string; // Tailwind CSS class for background
  items: string[];
  instructions?: string;
  notes?: string;
  textColor?: string; // Optional Tailwind CSS class for text
  description?: string; // Description of what goes in the bin
}

// Defines the structure for a country's complete waste bin system information.
interface CountryBinInfo {
  countryName: string;
  bins: Bin[]; // Uses the Bin interface
  generalAdvice?: string[];
  source?: string;
  notes?: string; // Country-specific general notes
}

// Defines the overall structure for country-specific bin information, keyed by country code.
interface CountrySpecificBinInfo {
  [countryCode: string]: CountryBinInfo;
}

// Type for the information displayed about a bin, including dynamic advice.
interface DisplayableBinInfo extends Bin {
  // Extends the Bin interface
  advice?: string;
}

const countrySpecificBinInfo: CountrySpecificBinInfo = {
  DE: {
    countryName: "Germany",
    bins: [
      {
        name: "Restmüll (Grey/Black Bin)",
        color: "bg-gray-700",
        textColor: "text-white",
        description: "General non-recyclable waste.",
        items: ["Ash", "Nappies", "Hygiene products", "Vacuum cleaner bags"],
      },
      {
        name: "Gelbe Tonne/Sack (Yellow Bin/Bag)",
        color: "bg-yellow-400",
        textColor: "text-black",
        description: "Packaging plastics, metals, and composite packaging.",
        items: [
          "Plastic containers",
          "Metal cans",
          "Drink cartons",
          "Aluminum foil",
        ],
      },
      {
        name: "Blaue Tonne (Blue Bin)",
        color: "bg-blue-500",
        textColor: "text-white",
        description: "Paper and cardboard.",
        items: [
          "Newspapers",
          "Magazines",
          "Cardboard boxes",
          "Paper packaging",
        ],
      },
      {
        name: "Glascontainer (Communal Glass Banks)",
        color: "bg-green-300",
        textColor: "text-black",
        description:
          "Glass bottles and jars, sorted by color (white, brown, green).",
        items: [
          "White glass bottles",
          "Brown glass bottles",
          "Green glass bottles",
        ],
        notes: "Deposit glass bottles (Pfandflaschen) go back to stores.",
      },
      {
        name: "Biotonne (Organic Waste Bin - if available)",
        color: "bg-green-600",
        textColor: "text-white",
        description: "Organic kitchen and garden waste.",
        items: [
          "Fruit/vegetable scraps",
          "Coffee grounds",
          "Tea bags",
          "Garden waste",
        ],
      },
    ],
    generalAdvice: [
      "Germany has a deposit system (Pfand) for many beverage containers.",
      "Sorting is mandatory and rules can be strict.",
    ],
    source: "Common knowledge, various German waste management sites.",
  },
  JP: {
    countryName: "Japan",
    bins: [
      {
        name: "Burnable Waste (Moeru Gomi)",
        color: "bg-red-500",
        textColor: "text-white",
        description:
          "Waste that can be incinerated. Often includes food-contaminated items, some plastics.",
        items: [
          "Food scraps (drained)",
          "Paper scraps (not recyclable)",
          "Some soft plastics",
          "Wood items",
        ],
        notes:
          "Specific bags and collection days apply. Rules vary significantly by municipality.",
      },
      {
        name: "Non-Burnable Waste (Moenai Gomi)",
        color: "bg-blue-400",
        textColor: "text-white",
        description: "Items that cannot be incinerated or recycled easily.",
        items: [
          "Ceramics",
          "Broken glass (non-recyclable)",
          "Small metal items (non-packaging)",
          "Some hard plastics",
        ],
        notes: "Specific bags and collection days apply.",
      },
      {
        name: "Plastic Containers & Packaging (Plastic)",
        color: "bg-orange-400",
        textColor: "text-black",
        description:
          "Clean plastic containers and packaging (e.g., bottles, trays, wrappers). PET bottles often separate.",
        items: [
          "PET bottles (rinsed, caps/labels removed)",
          "Plastic food trays (rinsed)",
          "Plastic wrappers (clean)",
        ],
      },
      {
        name: "Cans (Metal)",
        color: "bg-gray-400",
        textColor: "text-black",
        description: "Rinsed aluminum and steel cans.",
        items: ["Aluminum cans", "Steel cans"],
      },
      {
        name: "Paper & Cardboard",
        color: "bg-yellow-300",
        textColor: "text-black",
        description: "Bundled and tied newspapers, magazines, cardboard.",
        items: [
          "Newspapers",
          "Magazines",
          "Cardboard boxes (flattened, bundled)",
        ],
      },
      {
        name: "Glass Bottles & Jars (Glass)",
        color: "bg-green-400",
        textColor: "text-white",
        description:
          "Rinsed glass bottles and jars, sometimes sorted by color.",
        items: [
          "Clear glass bottles",
          "Brown glass bottles",
          "Other colored glass bottles",
        ],
      },
    ],
    generalAdvice: [
      "Sorting rules are extremely detailed and vary by city/ward. Always check local guides.",
      "Large items (Sodai Gomi) require special collection.",
    ],
    source: "Common knowledge, various Japanese municipal waste guides.",
  },
  KR: {
    countryName: "South Korea",
    bins: [
      {
        name: "General Waste (Ilban Sseuregi)",
        color: "bg-gray-500",
        textColor: "text-white",
        description:
          "Non-recyclable waste, placed in district-specific pre-paid bags.",
        items: [
          "Non-recyclable items",
          "Contaminated items",
          "Broken ceramics",
        ],
      },
      {
        name: "Recyclables - Metal Cans",
        color: "bg-neutral-400",
        textColor: "text-black",
        description: "Rinsed metal cans.",
        items: ["Steel cans", "Aluminum cans"],
      },
      {
        name: "Recyclables - Plastics",
        color: "bg-yellow-500",
        textColor: "text-black",
        description: "Clean plastic bottles, containers, and film.",
        items: [
          "PET bottles (crushed, caps removed)",
          "Plastic containers (rinsed)",
          "Clean plastic film/bags",
        ],
      },
      {
        name: "Recyclables - Paper & Cardboard",
        color: "bg-blue-300",
        textColor: "text-black",
        description: "Bundled paper and cardboard.",
        items: [
          "Newspapers",
          "Magazines",
          "Cardboard boxes (flattened, bundled)",
        ],
      },
      {
        name: "Recyclables - Glass",
        color: "bg-green-500",
        textColor: "text-white",
        description: "Rinsed glass bottles and jars.",
        items: [
          "Clear glass bottles",
          "Brown glass bottles",
          "Green glass bottles",
        ],
      },
      {
        name: "Food Waste (Eumsikmul Sseuregi)",
        color: "bg-orange-600",
        textColor: "text-white",
        description:
          "All food waste, collected separately (often in specific bins/bags, payment may be required).",
        items: ["Fruit/vegetable scraps", "Meat/fish bones", "Eggshells"],
        notes:
          "Drain excess moisture. Non-food items like shells or large bones might be general waste.",
      },
    ],
    generalAdvice: [
      "Mandatory separation. Use designated bags for general waste. Food waste separation is very strict.",
    ],
    source: "Common knowledge, various South Korean municipal waste guides.",
  },
  SE: {
    countryName: "Sweden",
    bins: [
      {
        name: "Residual Waste (Restavfall/Brännbart)",
        color: "bg-black",
        textColor: "text-white",
        description:
          "Waste that cannot be recycled or composted, often for energy recovery.",
        items: [
          "Nappies",
          "Envelopes",
          "Vacuum cleaner bags",
          "Contaminated packaging",
        ],
      },
      {
        name: "Metal Packaging (Metallförpackningar)",
        color: "bg-gray-500",
        textColor: "text-white",
        description: "Clean metal packaging.",
        items: [
          "Food cans",
          "Drink cans (non-deposit)",
          "Metal lids",
          "Clean aluminum foil",
        ],
      },
      {
        name: "Plastic Packaging (Plastförpackningar)",
        color: "bg-orange-500",
        textColor: "text-black",
        description: "Clean hard and soft plastic packaging.",
        items: [
          "Plastic bottles",
          "Plastic containers",
          "Plastic film/bags (clean)",
        ],
      },
      {
        name: "Paper/Cardboard Packaging (Pappersförpackningar)",
        color: "bg-blue-500",
        textColor: "text-white",
        description: "Clean paper and cardboard packaging.",
        items: [
          "Cardboard boxes",
          "Milk/juice cartons (rinsed, flattened)",
          "Paper bags",
          "Paper wrapping",
        ],
      },
      {
        name: "Newspapers/Magazines (Tidningar/Returpapper)",
        color: "bg-blue-300",
        textColor: "text-black",
        description: "Newspapers, magazines, brochures, office paper.",
        items: ["Newspapers", "Magazines", "Brochures", "Office paper"],
      },
      {
        name: "Glass Packaging (Glasförpackningar)",
        color: "bg-green-500",
        textColor: "text-white",
        description:
          "Clean glass packaging, sorted by color (clear and colored).",
        items: ["Clear glass bottles/jars", "Colored glass bottles/jars"],
        notes: "Deposit glass bottles (Pant) go back to stores.",
      },
      {
        name: "Food Waste (Matavfall - if collected)",
        color: "bg-brown-600",
        textColor: "text-white",
        description: "Food scraps, often collected in special paper bags.",
        items: [
          "Fruit/vegetable scraps",
          "Meat/fish remains",
          "Coffee grounds",
          "Tea bags",
        ],
      },
    ],
    generalAdvice: [
      "Sweden has a deposit system (Pant) for most beverage cans and PET bottles.",
      "Recycling stations (Återvinningsstation) are common for packaging.",
    ],
    source:
      "Common knowledge, Avfall Sverige (Swedish Waste Management Association).",
  },
  CH: {
    countryName: "Switzerland",
    bins: [
      {
        name: "General Waste (Kehrichtsack - Fee Bag)",
        color: "bg-gray-600",
        textColor: "text-white",
        description: "Non-recyclable waste in official, taxed garbage bags.",
        items: [
          "Non-recyclable items",
          "Hygiene products",
          "Contaminated packaging",
        ],
      },
      {
        name: "Metal (Aluminum/Tin Cans)",
        color: "bg-neutral-400",
        textColor: "text-black",
        description: "Aluminum and tin cans, collected at communal points.",
        items: ["Aluminum cans", "Tin cans"],
      },
      {
        name: "Plastic (PET Bottles)",
        color: "bg-yellow-400",
        textColor: "text-black",
        description:
          "PET beverage bottles, collected separately (e.g., supermarkets). Other plastics often general waste or specific collections.",
        items: ["PET beverage bottles (empty, crushed)"],
      },
      {
        name: "Cardboard (Karton)",
        color: "bg-amber-600",
        textColor: "text-white",
        description:
          "Flattened cardboard, bundled and collected separately or at communal points.",
        items: ["Cardboard boxes", "Corrugated cardboard"],
      },
      {
        name: "Paper (Papier)",
        color: "bg-blue-400",
        textColor: "text-white",
        description:
          "Newspapers, magazines, office paper, bundled and collected separately or at communal points.",
        items: ["Newspapers", "Magazines", "Office paper", "Paper bags"],
      },
      {
        name: "Glass (Glas)",
        color: "bg-green-500",
        textColor: "text-white",
        description:
          "Glass bottles and jars, sorted by color (clear, brown, green) at communal glass banks.",
        items: [
          "Clear glass bottles/jars",
          "Brown glass bottles/jars",
          "Green glass bottles/jars",
        ],
      },
      {
        name: "Organic Waste (Grüngut/Compost - if collected)",
        color: "bg-lime-600",
        textColor: "text-white",
        description: "Kitchen and garden waste for composting.",
        items: ["Fruit/vegetable scraps", "Coffee grounds", "Garden waste"],
      },
    ],
    generalAdvice: [
      "'Polluter pays' principle is strong; taxed bags for general waste. High recycling rates via communal collection points.",
    ],
    source: "Common knowledge, Swiss federal and cantonal waste guidelines.",
  },
  NL: {
    countryName: "Netherlands",
    bins: [
      {
        name: "Restafval (Grey/Black Bin)",
        color: "bg-gray-700",
        textColor: "text-white",
        description: "General non-recyclable waste.",
        items: [
          "Nappies",
          "Cat litter",
          "Contaminated items",
          "Non-recyclable plastics",
        ],
      },
      {
        name: "PMD (Plastic, Metal, Drink cartons - Orange Bin/Bag or Yellow Bin/Bag)",
        color: "bg-orange-500",
        textColor: "text-black",
        description:
          "Plastic packaging, metal packaging (cans), and drink cartons.",
        items: [
          "Plastic bottles/containers/films",
          "Metal cans/foil",
          "Drink cartons (Tetra Pak)",
        ],
      },
      {
        name: "Papier en karton (Blue Bin)",
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
        name: "Glas (Glasbak - Communal Glass Banks)",
        color: "bg-green-400",
        textColor: "text-white",
        description: "Glass bottles and jars, often sorted by color.",
        items: ["Clear glass", "Green glass", "Brown glass"],
        notes: "Deposit glass bottles (Statiegeld) go back to stores.",
      },
      {
        name: "GFT (Groente-, Fruit- en Tuinafval - Green Bin)",
        color: "bg-green-600",
        textColor: "text-white",
        description:
          "Vegetable, fruit, and garden waste, and often food leftovers.",
        items: [
          "Fruit/vegetable scraps",
          "Coffee grounds",
          "Tea bags",
          "Garden waste",
          "Cooked food (check local)",
        ],
      },
    ],
    generalAdvice: [
      "Deposit system (Statiegeld) for many plastic bottles and cans.",
      "PMD collection is common for mixed packaging.",
    ],
    source: "Common knowledge, Milieu Centraal, Rijkswaterstaat.",
  },
  AT: {
    countryName: "Austria",
    bins: [
      {
        name: "Restmüll (Grey/Black Bin)",
        color: "bg-gray-700",
        textColor: "text-white",
        description: "General non-recyclable waste.",
        items: [
          "Hygiene products",
          "Vacuum cleaner bags",
          "Contaminated items",
        ],
      },
      {
        name: "Leichtverpackungen (Yellow Bin/Bag)",
        color: "bg-yellow-500",
        textColor: "text-black",
        description:
          "Lightweight packaging: plastics, composite materials (drink cartons), small metals.",
        items: [
          "Plastic bottles/packaging",
          "Drink cartons",
          "Yogurt cups",
          "Metal cans",
          "Aluminum foil",
        ],
      },
      {
        name: "Altpapier (Blue Bin)",
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
        name: "Altglas (Communal Glass Collection)",
        color: "bg-green-300",
        textColor: "text-black",
        description:
          "Glass containers, separated by color (white/clear and colored) at public drop-off points.",
        items: [
          "White/clear glass bottles/jars",
          "Colored (green, brown) glass bottles/jars",
        ],
        notes: "Deposit glass bottles (Pfandflaschen) go back to stores.",
      },
      {
        name: "Bioabfall (Brown or Green Bin - Organic Waste)",
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
    ],
    generalAdvice: [
      "Similar to Germany, strong emphasis on separate collection. Deposit system for some beverage containers.",
    ],
    source:
      "Common knowledge, Austrian Ministry for Climate Action, Environment, Energy, Mobility, Innovation and Technology.",
  },
  FI: {
    countryName: "Finland",
    bins: [
      {
        name: "Mixed Waste/Energy Waste (Sekajäte/Energiajäte)",
        color: "bg-gray-500",
        textColor: "text-white",
        description:
          "General waste that cannot be sorted, often for energy recovery.",
        items: [
          "Non-recyclable items",
          "Hygiene products",
          "Broken ceramics",
          "PVC plastics",
        ],
      },
      {
        name: "Metal Packaging (Metallipakkaukset) & Small Metal Items",
        color: "bg-neutral-500",
        textColor: "text-white",
        description: "Clean metal packaging and small metal items.",
        items: [
          "Food cans",
          "Drink cans (non-deposit)",
          "Metal lids",
          "Clean aluminum foil/trays",
          "Empty aerosol cans",
        ],
      },
      {
        name: "Plastic Packaging (Muovipakkaukset)",
        color: "bg-yellow-400",
        textColor: "text-black",
        description: "Empty, clean, and dry plastic packaging.",
        items: [
          "Plastic food packaging (yogurt pots, butter tubs)",
          "Plastic bottles (rinsed)",
          "Plastic bags/films (if accepted locally)",
        ],
      },
      {
        name: "Cardboard Packaging (Kartonkipakkaukset)",
        color: "bg-orange-400",
        textColor: "text-black",
        description:
          "Clean and dry cardboard packaging, flattened. Includes milk/juice cartons.",
        items: [
          "Cardboard boxes (flattened)",
          "Milk/juice cartons (rinsed, flattened)",
          "Paper bags",
          "Pizza boxes (clean parts)",
        ],
      },
      {
        name: "Paper (Paperinkeräys)",
        color: "bg-blue-300",
        textColor: "text-black",
        description: "Newspapers, magazines, advertisements, office paper.",
        items: [
          "Newspapers",
          "Magazines",
          "Advertisements",
          "Office paper",
          "Envelopes",
        ],
      },
      {
        name: "Glass Packaging (Lasipakkaukset)",
        color: "bg-green-400",
        textColor: "text-white",
        description: "Empty glass bottles and jars, rinsed, no caps/lids.",
        items: ["Glass bottles (clear and colored)", "Glass jars"],
        notes: "Deposit glass bottles (Palpa) go back to stores.",
      },
      {
        name: "Bio Waste (Biojäte - if collected)",
        color: "bg-brown-500",
        textColor: "text-white",
        description: "Organic food waste and small amounts of garden waste.",
        items: ["Food scraps", "Coffee grounds", "Paper towels (food-soiled)"],
      },
    ],
    generalAdvice: [
      "Extensive separate collection. Deposit System (Palpa) for most beverage bottles/cans. Check local waste management (e.g., HSY for Helsinki region).",
    ],
    source:
      "Common knowledge, Finnish waste management companies (e.g., Kiertokapula, HSY).",
  },
  NO: {
    countryName: "Norway",
    bins: [
      {
        name: "Residual Waste (Restavfall)",
        color: "bg-gray-600",
        textColor: "text-white",
        description: "Waste that cannot be sorted into other categories.",
        items: [
          "Nappies",
          "Contaminated packaging",
          "Non-recyclable plastics",
          "Ceramics",
        ],
      },
      {
        name: "Metal Packaging (Metallemballasje)",
        color: "bg-neutral-500",
        textColor: "text-white",
        description:
          "Clean metal packaging, often collected with glass or at central points.",
        items: [
          "Food cans",
          "Drink cans (non-deposit)",
          "Clean aluminum foil/trays",
          "Metal lids",
        ],
      },
      {
        name: "Plastic Packaging (Plastemballasje)",
        color: "bg-purple-400",
        textColor: "text-white",
        description:
          "Clean plastic packaging (bottles, containers, film). Often collected in specific bags.",
        items: [
          "Plastic bottles (rinsed)",
          "Plastic containers (rinsed)",
          "Plastic film/bags (clean)",
        ],
      },
      {
        name: "Paper/Cardboard (Papir/Papp)",
        color: "bg-blue-500",
        textColor: "text-white",
        description: "Paper, cardboard, and rinsed drink cartons.",
        items: [
          "Newspapers",
          "Magazines",
          "Cardboard boxes",
          "Milk/juice cartons (rinsed, flattened)",
        ],
      },
      {
        name: "Glass Packaging (Glassemballasje)",
        color: "bg-teal-400",
        textColor: "text-white",
        description:
          "Clean glass bottles and jars, often collected with metal or at central points.",
        items: ["Glass bottles (rinsed)", "Glass jars (rinsed)"],
        notes: "Deposit glass bottles (Pant) go back to stores.",
      },
      {
        name: "Food Waste (Matavfall - if collected)",
        color: "bg-green-600",
        textColor: "text-white",
        description:
          "All food scraps, often collected in specific (e.g., green) bags.",
        items: [
          "Fruit/vegetable scraps",
          "Meat/fish bones",
          "Coffee grounds",
          "Eggshells",
        ],
      },
    ],
    generalAdvice: [
      "Color-coded bag system is common in many cities (e.g., Oslo). Deposit (Pant) on bottles/cans.",
    ],
    source:
      "Common knowledge, Loop (Norwegian recycling authority), Sortere.no.",
  },
  BE: {
    countryName: "Belgium",
    bins: [
      {
        name: "Residual Waste (Restafval/Déchets Résiduels - Grey/Black Bag/Bin)",
        color: "bg-gray-500",
        textColor: "text-white",
        description: "General non-recyclable waste.",
        items: [
          "Nappies",
          "Soiled packaging",
          "Cat litter",
          "Non-recyclable items",
        ],
      },
      {
        name: "PMC/PMD (Blue Bag - Plastique, Métal, Cartons à boissons)",
        color: "bg-sky-400",
        textColor: "text-white",
        description:
          "Plastic bottles & flasks, metal packaging, drink cartons.",
        items: [
          "Plastic bottles/flasks",
          "Metal cans/tins",
          "Aerosols (empty)",
          "Drink cartons (Tetra Pak)",
        ],
      },
      {
        name: "Paper/Cardboard (Papier/Carton - Yellow Bag/Bin or bundled)",
        color: "bg-yellow-400",
        textColor: "text-black",
        description: "Clean paper and cardboard.",
        items: [
          "Newspapers",
          "Magazines",
          "Cardboard boxes (flattened)",
          "Paper bags",
        ],
      },
      {
        name: "Glass (Verre/Glas - Communal Glass Bins/Containers)",
        color: "bg-emerald-400",
        textColor: "text-white",
        description:
          "Glass bottles and jars, often sorted by color (green for mixed, white for clear, brown for brown).",
        items: ["Clear glass bottles/jars", "Colored glass bottles/jars"],
      },
      {
        name: "Organic Waste (GFT/Déchets Organiques - if collected)",
        color: "bg-green-600",
        textColor: "text-white",
        description:
          "Fruit, vegetable, garden waste, and often food leftovers.",
        items: [
          "Fruit/vegetable scraps",
          "Coffee grounds",
          "Garden waste",
          "Cooked food (check local)",
        ],
      },
    ],
    generalAdvice: [
      "Sorting rules are strict and vary by region (Flanders, Wallonia, Brussels). Check local waste collection calendar (ophaalkalender).",
    ],
    source:
      "Common knowledge, Fost Plus, regional waste authorities (e.g., OVAM, BeWaPP, Bruxelles-Propreté).",
  },
  FR: {
    countryName: "France",
    bins: [
      {
        name: "Ordures Ménagères (Grey Bin)",
        color: "bg-gray-600",
        textColor: "text-white",
        description: "Non-recyclable household waste.",
        items: [
          "Non-recyclable items",
          "Food-soiled packaging",
          "Nappies",
          "Broken crockery",
        ],
      },
      {
        name: "Emballages et Papiers (Yellow Bin)",
        color: "bg-yellow-400",
        textColor: "text-black",
        description:
          "Packaging metals, plastic bottles/containers, packaging cardboard, graphic paper.",
        items: [
          "Metal cans",
          "Plastic bottles/containers",
          "Cardboard packaging (flattened)",
          "Newspapers/Magazines",
          "Drink cartons",
        ],
        notes:
          "Rules for what goes in the yellow bin are expanding (Extension des consignes de tri). Check local rules.",
      },
      {
        name: "Verre (Green Bin)",
        color: "bg-green-500",
        textColor: "text-white",
        description: "Glass bottles and jars.",
        items: ["Glass bottles", "Glass jars (no lids, no ceramics/pyrex)"],
      },
      {
        name: "Bio-déchets (Brown Bin - if collected)",
        color: "bg-brown-600",
        textColor: "text-white",
        description: "Food scraps and small garden waste.",
        items: [
          "Fruit/vegetable scraps",
          "Coffee grounds",
          "Tea bags",
          "Eggshells",
        ],
      },
    ],
    generalAdvice: [
      "Sorting instructions (consignes de tri) can vary locally. 'Bac jaune' is common for mixed recyclables. Bio-waste collection is expanding.",
    ],
    source:
      "Common knowledge, ADEME (French Environment and Energy Management Agency), Citeo.",
  },
  IT: {
    countryName: "Italy",
    bins: [
      {
        name: "Indifferenziato/Secco Non Riciclabile (General Trash)",
        color: "bg-gray-500",
        textColor: "text-white",
        description: "General waste that cannot be separated for recycling.",
        items: [
          "Non-recyclable items",
          "Nappies",
          "Ceramics",
          "Contaminated items",
        ],
      },
      {
        name: "Plastica (Plastic Bin/Bag)",
        color: "bg-yellow-500",
        textColor: "text-black",
        description:
          "Plastic packaging (bottles, containers). Metal often collected with plastic or glass.",
        items: [
          "Plastic bottles/containers",
          "Plastic film (check local)",
          "Sometimes metal cans/foil (check local)",
        ],
      },
      {
        name: "Carta e Cartone (Paper Bin/Bag)",
        color: "bg-blue-400",
        textColor: "text-white",
        description: "Paper and cardboard items.",
        items: [
          "Newspapers",
          "Cardboard boxes (flattened)",
          "Magazines",
          "Paper packaging",
        ],
      },
      {
        name: "Vetro (Glass Bin/Bag)",
        color: "bg-green-600",
        textColor: "text-white",
        description:
          "Glass bottles and jars. Metal often collected with glass or plastic.",
        items: [
          "Glass bottles",
          "Glass jars (no lids)",
          "Sometimes metal cans (check local)",
        ],
      },
      {
        name: "Organico/Umido (Organic Waste Bin/Bag)",
        color: "bg-brown-700",
        textColor: "text-white",
        description: "Food scraps and organic matter.",
        items: [
          "Fruit/vegetable scraps",
          "Meat/fish bones",
          "Coffee grounds",
          "Soiled paper napkins",
        ],
      },
    ],
    generalAdvice: [
      "'Raccolta differenziata' (separate collection) is often door-to-door with specific calendars. Rules vary significantly by comune (municipality).",
    ],
    source:
      "Common knowledge, Italian Ministry of Environment, local municipal waste guides.",
  },
  GB: {
    // United Kingdom
    countryName: "United Kingdom",
    bins: [
      {
        name: "General Waste (Black/Grey Bin)",
        color: "bg-black",
        textColor: "text-white",
        description: "Non-recyclable household waste.",
        items: [
          "Plastic bags/film (most areas)",
          "Polystyrene",
          "Crisp packets",
          "Nappies",
          "Contaminated food packaging",
        ],
      },
      {
        name: "Mixed Recyclables (Blue/Green/Yellow Bin - varies by council)",
        color: "bg-blue-500", // Example color, can vary
        textColor: "text-white",
        description:
          "Paper, cardboard, plastic bottles, hard containers, cans, glass (rules vary).",
        items: [
          "Newspapers",
          "Cardboard (flattened)",
          "Plastic bottles (rinsed, lids on/off varies)",
          "Food tins/drink cans (rinsed)",
          "Glass bottles/jars (rinsed)",
        ],
        notes:
          "Check local council for specific items accepted, especially plastic types and if glass is included or separate.",
      },
      {
        name: "Food Waste (Small Green/Brown Caddy/Bin - if collected)",
        color: "bg-green-600",
        textColor: "text-white",
        description: "All food scraps (cooked and uncooked).",
        items: [
          "Fruit/vegetable peelings",
          "Meat/fish bones",
          "Tea bags",
          "Coffee grounds",
          "Leftovers",
        ],
      },
      {
        name: "Garden Waste (Green Bin - often subscription)",
        color: "bg-lime-600",
        textColor: "text-white",
        description: "Green waste from the garden.",
        items: ["Grass cuttings", "Leaves", "Small branches", "Weeds"],
      },
    ],
    generalAdvice: [
      "Recycling rules vary significantly by local council. Use the postcode checker on the government or council website. Soft plastics often require supermarket drop-off.",
    ],
    source:
      "Common knowledge, UK government guidelines, WRAP (Waste & Resources Action Programme).",
  },
  CA: {
    countryName: "Canada",
    bins: [
      {
        name: "Garbage/Landfill (Black/Grey Bin)",
        color: "bg-gray-700",
        textColor: "text-white",
        description: "Non-recyclable and non-compostable waste.",
        items: [
          "Plastic bags (most areas)",
          "Styrofoam",
          "Non-recyclable plastics",
          "Broken glass (check local for safety)",
          "Pet waste",
        ],
      },
      {
        name: "Recycling (Blue Bin - often mixed)",
        color: "bg-blue-600",
        textColor: "text-white",
        description:
          "Paper, plastics (specific types), glass, metal containers.",
        items: [
          "Newspapers/Flyers",
          "Cardboard (flattened)",
          "Plastic bottles/containers (rinsed, check accepted numbers #1-#7, varies)",
          "Metal cans (rinsed)",
          "Glass bottles/jars (rinsed)",
        ],
        notes:
          "Accepted materials vary by province and municipality. Check local guidelines.",
      },
      {
        name: "Organics/Green Bin (Compost)",
        color: "bg-green-700",
        textColor: "text-white",
        description: "Food scraps and yard waste.",
        items: [
          "Fruit/vegetable scraps",
          "Coffee grounds/filters",
          "Tea bags",
          "Meat/fish/dairy (check local)",
          "Soiled paper products (napkins, pizza boxes - check local)",
          "Yard trimmings",
        ],
      },
    ],
    generalAdvice: [
      "Recycling programs are provincially managed but implemented municipally. Deposit-return systems for beverage containers in many provinces.",
    ],
    source:
      "Common knowledge, various Canadian municipal and provincial waste management sites.",
  },
  AU: {
    countryName: "Australia",
    bins: [
      {
        name: "General Waste (Red Lid Bin - Landfill)",
        color: "bg-red-600",
        textColor: "text-white",
        description: "Waste that cannot be recycled or composted.",
        items: [
          "Plastic bags/soft plastics (unless specific collection)",
          "Nappies",
          "Broken crockery",
          "Polystyrene",
          "Food scraps (if no FOGO/Green bin)",
        ],
      },
      {
        name: "Recycling (Yellow Lid Bin)",
        color: "bg-yellow-500",
        textColor: "text-black",
        description:
          "Paper, cardboard, glass, plastics (hard containers), metal.",
        items: [
          "Paper (clean)",
          "Cardboard (flattened)",
          "Glass bottles/jars (rinsed, lids off)",
          "Plastic containers (rinsed, lids off, typically types 1, 2, 3, 5)",
          "Steel/aluminum cans (rinsed)",
          "Empty aerosol cans",
          "Clean aluminum foil (scrunched)",
        ],
        notes:
          "Check local council for specific plastic types accepted. Keep items loose, not in bags.",
      },
      {
        name: "Organics/Green Waste (Green Lid Bin - FOGO: Food Organics Garden Organics, if available)",
        color: "bg-green-500",
        textColor: "text-white",
        description: "Food scraps and garden waste.",
        items: [
          "Food scraps (all types)",
          "Grass clippings",
          "Leaves",
          "Small branches",
          "Soiled paper/cardboard (check local)",
        ],
      },
      {
        name: "Glass (Purple Lid Bin - emerging in some areas)",
        color: "bg-purple-600",
        textColor: "text-white",
        description: "Dedicated glass recycling bin to improve quality.",
        items: ["Glass bottles/jars (rinsed, lids off)"],
      },
    ],
    generalAdvice: [
      "Follow the bin lid colors. 'Recycle Right' campaigns provide local info. Soft plastics often go to REDcycle bins at supermarkets.",
    ],
    source: "Common knowledge, Planet Ark, Australian local council websites.",
  },
  NZ: {
    countryName: "New Zealand",
    bins: [
      {
        name: "General Waste/Rubbish Bin",
        color: "bg-red-600", // Often red lid, but can vary
        textColor: "text-white",
        description: "Waste that cannot be recycled or composted.",
        items: [
          "Plastic bags/soft plastics (unless specific collection)",
          "Nappies",
          "Broken items",
          "Polystyrene",
          "Food scraps (if no separate collection)",
        ],
      },
      {
        name: "Mixed Recycling Bin (Often Yellow Lid)",
        color: "bg-yellow-400",
        textColor: "text-black",
        description:
          "Paper, cardboard, plastics (typically #1, #2, #5), glass, cans.",
        items: [
          "Paper (clean)",
          "Cardboard (flattened)",
          "Plastic bottles/containers (rinsed, lids off, check numbers #1, #2, #5)",
          "Glass bottles/jars (rinsed, lids off)",
          "Metal cans (rinsed)",
        ],
        notes:
          "Check with your local council as services and accepted items vary significantly.",
      },
      {
        name: "Food Scraps/Organics Bin (Often Green Lid - if available)",
        color: "bg-green-600",
        textColor: "text-white",
        description: "Food scraps and sometimes garden waste.",
        items: [
          "Fruit/vegetable scraps",
          "Coffee grounds",
          "Tea bags",
          "Meat/fish/dairy (check local)",
        ],
      },
      {
        name: "Glass Crate/Bin (Sometimes separate)",
        color: "bg-teal-500",
        textColor: "text-white",
        description:
          "Glass bottles and jars, collected separately in some areas.",
        items: ["Glass bottles/jars (rinsed, lids off)"],
      },
    ],
    generalAdvice: [
      "Recycling rules vary greatly by council. Check your local council's website for specific guidelines. Focus on reducing waste first.",
    ],
    source: "Common knowledge, New Zealand local council websites, WasteMINZ.",
  },
  SG: {
    countryName: "Singapore",
    bins: [
      {
        name: "General Waste (Brown/Green Bin)",
        color: "bg-green-600", // Or brown, for landed properties often green
        textColor: "text-white",
        description:
          "Non-recyclable waste. Food waste should be bagged if not in a dedicated food waste bin.",
        items: [
          "Food waste (bagged)",
          "Nappies",
          "Styrofoam",
          "Contaminated packaging",
          "Non-recyclable plastics",
        ],
      },
      {
        name: "Recyclables (Blue Bin - Commingled)",
        color: "bg-blue-500",
        textColor: "text-white",
        description:
          "All recyclables (paper, plastic, glass, metal) go into one blue bin. Rinse items.",
        items: [
          "Paper/cardboard (clean, dry)",
          "Plastic bottles/containers (rinsed)",
          "Glass bottles/jars (rinsed)",
          "Metal cans (rinsed)",
        ],
        notes:
          "Ensure recyclables are clean and free of food/liquids. Do not bag recyclables.",
      },
      {
        name: "E-waste (Separate Collection Points/Programs)",
        color: "bg-purple-500",
        textColor: "text-white",
        description:
          "Electronic waste to be dropped at designated e-waste collection points (e.g., ALBA E-waste).",
        items: [
          "Batteries",
          "Mobile phones",
          "Laptops",
          "Light bulbs",
          "Printers",
          "Other consumer electronics",
        ],
      },
      {
        name: "Food Waste (Dedicated Bin - if available, e.g., in some condos/precincts)",
        color: "bg-orange-600",
        textColor: "text-white",
        description: "Separated food waste for treatment.",
        items: ["Fruit/vegetable scraps", "Cooked food", "Meat/fish"],
      },
    ],
    generalAdvice: [
      "National recycling program with blue commingled recycling bins. Check NEA (National Environment Agency) website for specifics, especially for e-waste and what not to recycle.",
    ],
    source: "Common knowledge, NEA Singapore website.",
  },
  DK: {
    countryName: "Denmark",
    bins: [
      {
        name: "Residual Waste (Restaffald)",
        color: "bg-gray-700",
        textColor: "text-white",
        description:
          "Waste for incineration, items that cannot be recycled or sorted otherwise.",
        items: [
          "Nappies",
          "Pizza boxes (greasy)",
          "Milk/juice cartons (often, check local - some now plastic)",
          "Vacuum cleaner bags",
          "Contaminated items",
        ],
      },
      {
        name: "Metal (Metal)",
        color: "bg-neutral-400",
        textColor: "text-black",
        description: "Clean metal packaging and small metal items.",
        items: [
          "Food cans",
          "Drink cans (non-deposit)",
          "Aluminum foil (clean)",
          "Small metal objects",
          "Empty aerosol cans",
        ],
      },
      {
        name: "Plastic (Plast)",
        color: "bg-orange-400",
        textColor: "text-black",
        description: "Clean hard and soft plastic packaging.",
        items: [
          "Plastic bottles (rinsed)",
          "Plastic food containers (rinsed)",
          "Plastic bags/film (clean, if accepted)",
        ],
      },
      {
        name: "Cardboard (Pap)",
        color: "bg-amber-700",
        textColor: "text-white",
        description: "Clean and dry cardboard packaging, flattened.",
        items: [
          "Cardboard boxes",
          "Corrugated cardboard",
          "Cardboard egg cartons",
        ],
      },
      {
        name: "Paper (Papir)",
        color: "bg-blue-400",
        textColor: "text-white",
        description: "Clean paper.",
        items: [
          "Newspapers",
          "Magazines",
          "Office paper",
          "Envelopes",
          "Brochures",
        ],
      },
      {
        name: "Glass (Glas)",
        color: "bg-green-400",
        textColor: "text-white",
        description: "Clean glass bottles and jars.",
        items: ["Glass bottles (clear and colored)", "Glass jars (no lids)"],
        notes: "Deposit bottles/cans (Pant) go back to stores.",
      },
      {
        name: "Food Waste (Madaffald - increasingly common)",
        color: "bg-lime-600",
        textColor: "text-white",
        description: "Raw and cooked food waste, often in special bio-bags.",
        items: [
          "Fruit/vegetable scraps",
          "Meat/fish",
          "Dairy",
          "Bread",
          "Coffee grounds",
        ],
      },
      {
        name: "Hazardous Waste (Farligt Affald - to recycling centers)",
        color: "bg-red-600",
        textColor: "text-white",
        description:
          "Chemicals, electronics, batteries to be taken to recycling centers.",
        items: [
          "Batteries",
          "Light bulbs (energy saving)",
          "Paint",
          "Electronics (small)",
        ],
      },
    ],
    generalAdvice: [
      "Sorting systems vary by municipality (kommune). Many now have multi-compartment bins. Deposit (Pant) on most bottles/cans.",
    ],
    source:
      "Common knowledge, Danish Environmental Protection Agency (Miljøstyrelsen), local municipal waste guides.",
  },
  ES: {
    countryName: "Spain",
    bins: [
      {
        name: "Resto/Orgánico no reciclable (Grey Bin)",
        color: "bg-gray-700",
        textColor: "text-white",
        description:
          "General non-recyclable waste. If no separate organic bin, organic waste goes here too.",
        items: [
          "Non-recyclable items",
          "Nappies",
          "Ceramics",
          "Dust",
          "Food scraps (if no brown bin)",
        ],
      },
      {
        name: "Envases (Yellow Bin - Packaging)",
        color: "bg-yellow-400",
        textColor: "text-black",
        description:
          "Plastic containers, cans (metal), and cartons (Tetra Pak).",
        items: [
          "Plastic bottles/containers (rinsed)",
          "Metal cans (rinsed)",
          "Aerosols (empty)",
          "Drink cartons (Tetra Pak)",
          "Plastic lids/caps",
          "Clean aluminum foil/trays",
        ],
      },
      {
        name: "Papel y Cartón (Blue Bin - Paper/Cardboard)",
        color: "bg-blue-500",
        textColor: "text-white",
        description: "Paper and cardboard.",
        items: [
          "Newspapers",
          "Cardboard boxes (flattened)",
          "Magazines",
          "Paper bags",
          "Paper egg cartons",
        ],
      },
      {
        name: "Vidrio (Green Igloo-shaped Bin - Glass)",
        color: "bg-green-500",
        textColor: "text-white",
        description: "Glass bottles and jars.",
        items: [
          "Glass bottles (all colors)",
          "Glass jars (no lids, no crystal/ceramics)",
        ],
      },
      {
        name: "Orgánico (Brown Bin - Organic, if available)",
        color: "bg-stone-600",
        textColor: "text-white",
        description: "Food scraps and small plant waste.",
        items: [
          "Fruit/vegetable scraps",
          "Meat/fish remains",
          "Eggshells",
          "Coffee grounds",
          "Tea bags",
          "Small plant trimmings",
        ],
      },
    ],
    generalAdvice: [
      "Color-coded communal bins are standard. Organic collection (brown bin) is becoming more common. Rules can vary slightly by region/municipality.",
    ],
    source:
      "Common knowledge, Ecoembes (Spanish packaging recovery organization), Spanish Ministry for Ecological Transition.",
  },
  // US is already defined, ensure it's up-to-date or merge if necessary.
  // For this update, I'm assuming the user wants to replace the existing US entry if it was minimal
  // or ensure the new detailed one is used. Given the prompt structure, it implies a full replacement/addition.
  US: {
    countryName: "United States",
    bins: [
      {
        name: "Trash/Landfill",
        color: "bg-neutral-700",
        textColor: "text-white",
        description: "General non-recyclable, non-compostable household waste.",
        items: [
          "Plastic bags/film (check local, some store drop-offs)",
          "Styrofoam",
          "Food-soiled paper (unless compostable and accepted)",
          "Broken ceramics/glassware (check local rules for safety, often trash)",
          "Chip bags",
          "Candy wrappers",
          "Non-recyclable plastics (e.g. #3, #4, #6, #7 in many areas)",
        ],
      },
      {
        name: "Recycling (Single-Stream or Separated)",
        color: "bg-sky-600",
        textColor: "text-white",
        description:
          "Recyclable materials. Rules vary widely (e.g., paper, cardboard, plastic containers #1 & #2, metal cans, glass). ALWAYS CHECK LOCAL GUIDELINES.",
        items: [
          "Paper (clean, dry - newspapers, mail, magazines)",
          "Cardboard (flattened, clean, dry)",
          "Plastic bottles/jugs/tubs (empty, rinsed, lids on/off varies - typically #1 & #2, sometimes #5)",
          "Metal cans (empty, rinsed - aluminum and steel)",
          "Glass bottles/jars (empty, rinsed, lids off - sometimes separate or not accepted)",
        ],
      },
      {
        name: "Organics/Compost (If available)",
        color: "bg-emerald-600",
        textColor: "text-white",
        description:
          "Food scraps and yard waste. Availability and accepted items vary significantly by municipality.",
        items: [
          "Fruit/vegetable scraps",
          "Yard trimmings (leaves, grass, small branches - check local)",
          "Coffee grounds/filters (paper only)",
          "Tea bags (paper only, no staples)",
          "Eggshells",
          "Food-soiled paper (if specifically accepted locally, e.g. uncoated paper napkins)",
        ],
      },
    ],
    notes:
      "Waste management is highly localized. There is no national standard. ALWAYS check with your local city or county waste management service for specific rules. 'Wishcycling' (putting non-recyclables in recycling) contaminates loads.",
    source: "General knowledge, EPA, local municipal waste websites.",
  },
  // Ensure no trailing comma after the last country object if it's the absolute end of the main object.
};

// Maps Teachable Machine prediction classes to common bin/material types and advice
const classToBinMapping: Record<
  string,
  { binNameKeywords: string[]; advice?: string }
> = {
  Paper: {
    binNameKeywords: [
      "paper",
      "papiertonne",
      "papier",
      "papel",
      "carta",
      "blue bin",
      "recycling",
      "recyclables",
      "paper packaging", // Added
    ],
    advice: "Ensure it's clean and dry. Remove any plastic wrapping.",
  },
  Cardboard: {
    binNameKeywords: [
      "cardboard",
      "karton",
      "pappe",
      "cartone",
      "cartón",
      "blue bin",
      "recycling",
      "recyclables",
      "paper packaging", // Added
    ],
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
      "yellow bin",
      "blue bin",
      "recycling",
      "recyclables",
      "plastic packaging", // Added
    ],
    advice:
      "Empty, rinse, and remove lids if required locally. Check local guidelines for accepted plastic types/numbers.",
  },
  Glass: {
    binNameKeywords: [
      "glass",
      "verre",
      "vetro",
      "glas",
      "vidrio",
      "blue bin",
      "green bin",
      "recycling",
      "recyclables",
      "glascontainer",
      "glass packaging", // Added
    ],
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
      "yellow bin",
      "blue bin",
      "recycling",
      "recyclables",
      "metal packaging", // Added
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
      "green bin", // Added
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
      "black bin", // Added
      "grey bin", // Added
      "red lid bin", // Added for landfill bins like in AU
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

// Retrieves bin information for a searched item name and country.
// TODO: This is a basic implementation. You may need to refine the search logic
// to better match item names to bin types based on your available data.
const getBinInfoForItemName = (
  itemName: string,
  countryCode: string
): DisplayableBinInfo | null => {
  if (!itemName.trim()) {
    return null;
  }
  const itemLower = itemName.toLowerCase().trim();

  // Attempt to map search query to a known class directly or by keyword
  for (const className in classToBinMapping) {
    if (itemLower.includes(className.toLowerCase())) {
      // If item name contains a class name (e.g., "plastic bottle" contains "plastic")
      return getBinForPrediction(className, countryCode);
    }
    const mapping = classToBinMapping[className];
    if (
      mapping.binNameKeywords.some((keyword) =>
        itemLower.includes(keyword.toLowerCase())
      )
    ) {
      // If item name contains a keyword associated with a class
      return getBinForPrediction(className, countryCode);
    }
  }

  // Fallback: More generic search against bin names in countrySpecificBinInfo might be needed here
  // For now, if no direct class mapping, return null.
  // You might want to iterate through countrySpecificBinInfo[countryCode].bins
  // and match itemName against bin.name or keywords.
  console.warn(
    `getBinInfoForItemName: No direct class mapping found for "${itemName}". Further search logic may be needed.`
  );
  return null;
};

// Retrieves bin information for the currently selected country.
const getBinForPrediction = (
  predictionClass: string,
  countryCode: string
): DisplayableBinInfo => {
  const currentCountryInfo = countrySpecificBinInfo[countryCode];
  const fallbackBin: DisplayableBinInfo = {
    name:
      currentCountryInfo?.bins.find(
        (bin) =>
          bin.name.toLowerCase().includes("trash") ||
          bin.name.toLowerCase().includes("general") ||
          bin.name.toLowerCase().includes("restmüll")
      )?.name || "General Waste",
    color:
      currentCountryInfo?.bins.find(
        (bin) =>
          bin.name.toLowerCase().includes("trash") ||
          bin.name.toLowerCase().includes("general") ||
          bin.name.toLowerCase().includes("restmüll")
      )?.color || "bg-gray-500",
    textColor:
      currentCountryInfo?.bins.find(
        (bin) =>
          bin.name.toLowerCase().includes("trash") ||
          bin.name.toLowerCase().includes("general") ||
          bin.name.toLowerCase().includes("restmüll")
      )?.textColor || "text-white",
    items: [],
    description: "No specific bin found. Please check local guidelines.",
    advice: "Please check local regulations for this item.",
  };

  if (!currentCountryInfo) {
    return {
      ...fallbackBin,
      advice: "Country-specific information not available.",
    };
  }

  const mapping = classToBinMapping[predictionClass];
  if (!mapping) {
    // If the predictionClass itself is not in classToBinMapping, try a generic "Trash"
    const trashMapping = classToBinMapping["Trash"];
    const generalWasteBin = currentCountryInfo.bins.find((bin: Bin) =>
      trashMapping.binNameKeywords.some((keyword) =>
        bin.name.toLowerCase().includes(keyword.toLowerCase())
      )
    );
    if (generalWasteBin) {
      return {
        ...generalWasteBin,
        advice:
          trashMapping.advice ||
          "Item not specifically recognized, dispose of as general waste if not recyclable/hazardous.",
      };
    }
    return {
      // Ultimate fallback if even general trash isn't found by keywords
      ...fallbackBin,
      advice:
        "Item not recognized for specific binning. Check local guidelines.",
    };
  }

  const foundBin = currentCountryInfo.bins.find((bin: Bin) =>
    mapping.binNameKeywords.some((keyword) =>
      bin.name.toLowerCase().includes(keyword.toLowerCase())
    )
  );

  if (foundBin) {
    return {
      ...foundBin,
      advice:
        mapping.advice ||
        foundBin.instructions ||
        foundBin.description ||
        "Follow bin guidelines.",
    };
  }

  // Fallback: if no specific bin is found by keywords in bin names,
  // check if the predictionClass (e.g., "Paper") is mentioned in any bin's items list.
  for (const bin of currentCountryInfo.bins) {
    if (
      bin.items.some(
        (item: string) =>
          item.toLowerCase().includes(predictionClass.toLowerCase()) // Changed from === to includes
      )
    ) {
      return {
        ...bin,
        advice:
          mapping.advice ||
          bin.instructions ||
          bin.description ||
          "Follow bin guidelines.",
      };
    }
  }

  // If still not found, try to find the most appropriate general waste bin for the country
  const trashMapping = classToBinMapping["Trash"];
  const generalWasteBin = currentCountryInfo.bins.find((bin: Bin) =>
    trashMapping.binNameKeywords.some((keyword) =>
      bin.name.toLowerCase().includes(keyword.toLowerCase())
    )
  );
  if (generalWasteBin) {
    return {
      ...generalWasteBin,
      advice:
        mapping.advice ||
        trashMapping.advice ||
        "Considered general waste. Please verify locally if unsure.",
    };
  }

  return {
    // Final fallback to a generic definition of general waste
    ...fallbackBin,
    advice:
      mapping.advice ||
      currentCountryInfo.generalAdvice?.join(" ") ||
      fallbackBin.advice,
  };
};

const sortedCountries = Object.keys(countrySpecificBinInfo).sort((a, b) => {
  if (a === "US") return -1; // Always sort "US" to the top
  if (b === "US") return 1;
  return countrySpecificBinInfo[a].countryName.localeCompare(
    countrySpecificBinInfo[b].countryName
  );
});

// Main component for the Trash Sorter application page.
export default function TrashSorterPage() {
  const [selectedCountry, setSelectedCountry] = useState<string>("US");
  const [currentCountryData, setCurrentCountryData] =
    useState<CountryBinInfo | null>(null);
  const [predictionResult, setPredictionResult] = useState<string | null>(null);
  const [suggestedBin, setSuggestedBin] = useState<DisplayableBinInfo | null>(
    null
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [displayedBinInfo, setDisplayedBinInfo] =
    useState<DisplayableBinInfo | null>(null);
  const [recommendationTitle, setRecommendationTitle] = useState<string>(
    "Scan or search an item to see recommendations."
  );
  const [isScannerModalOpen, setIsScannerModalOpen] = useState(false);
  const [actionPriority, setActionPriority] = useState<
    "scan" | "search" | null
  >(null);
  const [showScanner, setShowScanner] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);

  useEffect(() => {
    setCurrentCountryData(countrySpecificBinInfo[selectedCountry]);
    setPredictionResult(null);
    setSuggestedBin(null);
    // setSearchQuery("");
    setDisplayedBinInfo(null);
    setRecommendationTitle("Scan or search an item to see recommendations.");
    setActionPriority(null);
  }, [selectedCountry]);

  const handleCountryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCountry(event.target.value);
  };

  const toggleScanner = () => {
    const willOpen = !showScanner;
    setShowScanner(willOpen);
    setIsScannerModalOpen(willOpen); // Sync with the modal state
    if (willOpen) {
      setIsCameraActive(true); // Activate camera when opening scanner
      // If opening scanner, and search was active, scan should take priority
      // but handlePrediction will set it once a prediction comes in.
      // If there's no active search, we don't need to change priority yet.
    } else {
      setIsCameraActive(false); // Deactivate camera when closing
      handlePrediction(null); // Clear prediction when scanner is manually closed
    }
  };

  // IMPORTANT: Replace with your actual Teachable Machine model URL
  const modelUrl = "https://teachablemachine.withgoogle.com/models/xBp9J61Qn/";

  // Callback function passed to TeachableMachineClient to handle prediction results.
  // It updates the prediction state.
  const handlePrediction = useCallback(
    (prediction: string | null) => {
      setPredictionResult(prediction);
      if (prediction) {
        const binInfo = getBinForPrediction(prediction, selectedCountry);
        setSuggestedBin(binInfo);
        setActionPriority("scan");
      } else {
        setSuggestedBin(null);
        if (actionPriority === "scan") {
          if (searchQuery.trim()) {
            setActionPriority("search");
          } else {
            setActionPriority(null);
          }
        }
      }
    },
    [selectedCountry, searchQuery, actionPriority] // actionPriority is needed here
  );

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    setSearchQuery(query);
    if (query.trim()) {
      setActionPriority("search");
    } else {
      if (actionPriority === "search") {
        if (suggestedBin && predictionResult) {
          setActionPriority("scan");
        } else {
          setActionPriority(null);
        }
      }
    }
  };

  // Effect to update displayedBinInfo and recommendationTitle based on the latest action
  useEffect(() => {
    if (actionPriority === "search") {
      if (searchQuery.trim()) {
        const searchBinInfo = getBinInfoForItemName(
          searchQuery,
          selectedCountry
        );
        setDisplayedBinInfo(searchBinInfo);
        setRecommendationTitle(
          searchBinInfo
            ? `Recommendation for "${searchQuery}"`
            : `No specific bin found for "${searchQuery}". Try general categories.`
        );
      } else {
        if (suggestedBin && predictionResult) {
          setDisplayedBinInfo(suggestedBin);
          setRecommendationTitle(
            `Recommendation for scanned item: ${predictionResult}`
          );
          // No need to setActionPriority here, handled by handleSearchChange
        } else {
          setDisplayedBinInfo(null);
          setRecommendationTitle(
            "Scan or search an item to see recommendations."
          );
        }
      }
    } else if (actionPriority === "scan") {
      if (suggestedBin && predictionResult) {
        setDisplayedBinInfo(suggestedBin);
        setRecommendationTitle(
          `Recommendation for scanned item: ${predictionResult}`
        );
      } else {
        if (searchQuery.trim()) {
          const searchBinInfo = getBinInfoForItemName(
            searchQuery,
            selectedCountry
          );
          setDisplayedBinInfo(searchBinInfo);
          setRecommendationTitle(
            searchBinInfo
              ? `Recommendation for "${searchQuery}"`
              : `No specific bin found for "${searchQuery}". Try general categories.`
          );
          // No need to setActionPriority here, handled by handlePrediction
        } else {
          setDisplayedBinInfo(null);
          setRecommendationTitle(
            "Scan or search an item to see recommendations."
          );
        }
      }
    } else {
      setDisplayedBinInfo(null);
      setRecommendationTitle("Scan or search an item to see recommendations.");
    }
  }, [
    actionPriority,
    searchQuery,
    suggestedBin,
    selectedCountry,
    predictionResult,
  ]);

  // This useEffect handles the case where the TeachableMachineClient modal might be closed
  // by its internal close button, rather than our toggleScanner function.
  useEffect(() => {
    if (!isScannerModalOpen && showScanner) {
      // If the modal state (isScannerModalOpen) becomes false
      // while our component thinks the scanner should be shown (showScanner is true),
      // it means the modal was closed externally (e.g., by its own close button).
      setShowScanner(false); // Sync our state
      setIsCameraActive(false);
      handlePrediction(null); // Clear prediction
    }
  }, [isScannerModalOpen, showScanner, handlePrediction]);

  // JSX for the search input
  // <input type="text" value={searchQuery} onChange={handleSearchChange} placeholder="Search for an item..." />

  // JSX for opening the scanner modal
  // <button onClick={() => setIsScannerModalOpen(true)}>Scan Item</button>

  // JSX for TeachableMachineClient
  /*
  {isScannerModalOpen && (
    <TeachableMachineClient
      onPrediction={handlePrediction}
      onClose={() => {
        setIsScannerModalOpen(false);
        // handlePrediction(null); // Already handled by the new useEffect above
      }}
    />
  )}
  */

  // JSX for displaying the recommendation
  /*
  <div>
    <h2>{recommendationTitle}</h2>
    {displayedBinInfo && (
      <div>
        <h3>{displayedBinInfo.name}</h3>
        <p>{displayedBinInfo.description}</p>
        {displayedBinInfo.advice && <p><strong>Advice:</strong> {displayedBinInfo.advice}</p>}
      </div>
    )}
  </div>
  */
  return (
    <main className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-100 to-sky-200 p-4 sm:p-8 font-sans text-gray-800">
      <div className="container mx-auto max-w-6xl">
        {" "}
        {/* Increased max-width for a more spacious feel */}
        {/* Header Section */}
        <header className="mb-12 text-center py-8 rounded-xl bg-white/80 backdrop-blur-lg shadow-2xl">
          {" "}
          {/* Enhanced header styling */}
          <div className="inline-block p-4">
            <h1 className="text-6xl font-bold text-verda-green tracking-tight fancy-font">
              {" "}
              {/* Increased font size */}
              VerdaVision Waste Sorter
            </h1>
            <p className="mt-4 text-xl text-gray-700">
              {" "}
              {/* Increased font size and adjusted margin */}
              Your smart guide to recycling and waste disposal.
            </p>
          </div>
        </header>
        {/* Country Selector Section */}
        <section className="mb-12 p-8 bg-white/70 backdrop-blur-lg rounded-xl shadow-xl hover:shadow-2xl transition-shadow duration-300">
          {" "}
          {/* Increased padding */}
          <h2 className="text-4xl font-semibold text-verda-green mb-6 text-center fancy-font">
            {" "}
            {/* Increased font size and margin */}
            Select Your Region
          </h2>
          <div className="flex justify-center max-w-md mx-auto">
            {" "}
            {/* Centered and max-width for select */}
            <select
              id="country-select"
              value={selectedCountry} // Already string, no `|| ""` needed
              onChange={handleCountryChange}
              className="w-full p-4 border-2 border-gray-300 rounded-lg shadow-md focus:ring-2 focus:ring-verda-green focus:border-verda-green text-lg transition-all duration-200 hover:border-emerald-400" /* Enhanced select style */
            >
              {sortedCountries.map((countryCode) => (
                <option key={countryCode} value={countryCode}>
                  {countrySpecificBinInfo[countryCode].countryName}
                </option>
              ))}
            </select>
          </div>
          {currentCountryData?.notes && (
            <p className="mt-6 text-md text-emerald-800 bg-emerald-100 p-5 rounded-lg border-l-4 border-verda-green italic shadow-sm">
              {" "}
              {/* Enhanced notes style */}
              <strong>Note for {currentCountryData.countryName}:</strong>{" "}
              {currentCountryData.notes}
            </p>
          )}
        </section>
        {/* Scanner Toggle and Item Search Section */}
        <section className="mb-12 p-8 bg-white/70 backdrop-blur-lg rounded-xl shadow-xl hover:shadow-2xl transition-shadow duration-300">
          {" "}
          {/* Increased padding */}
          <div className="grid md:grid-cols-2 gap-10 items-center">
            {" "}
            {/* Increased gap */}
            <div className="text-center md:text-left">
              <h2 className="text-4xl font-semibold text-verda-green mb-5 fancy-font">
                {" "}
                {/* Increased font size and margin */}
                Identify Your Item
              </h2>
              <p className="text-gray-700 mb-6 text-lg">
                {" "}
                {/* Increased font size and margin */}
                Use our AI scanner or search manually to find the right bin.
              </p>
              <button
                onClick={toggleScanner}
                className="w-full md:w-auto bg-verda-green hover:bg-emerald-700 text-white font-bold py-4 px-10 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 text-xl" /* Enhanced button style */
              >
                {showScanner ? "Close Scanner" : "Open Item Scanner"}
              </button>
            </div>
            <div>
              <input
                type="text"
                placeholder="E.g., plastic bottle, apple core, newspaper"
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full p-5 border-2 border-gray-300 rounded-lg shadow-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all text-lg hover:border-emerald-400" /* Enhanced input style */
                aria-label="Search for an item"
              />
            </div>
          </div>
        </section>
        {/* Scanner Modal */}
        {showScanner && (
          <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4 backdrop-blur-md">
            {" "}
            {/* Darker backdrop, more blur */}
            <div className="bg-gradient-to-br from-emerald-50 to-sky-100 p-8 rounded-xl shadow-2xl max-w-2xl w-full relative transform transition-all duration-300 scale-100 opacity-100 border-2 border-verda-green flex flex-col md:flex-row gap-6">
              {" "}
              {/* Gradient background, border, flex layout for side-by-side view on medium screens */}
              <button
                onClick={toggleScanner}
                className="absolute top-3 right-3 text-gray-600 hover:text-verda-green text-4xl font-bold transition-colors z-10" /* Enhanced close button, ensure it's above other elements */
                aria-label="Close scanner"
              >
                &times;
              </button>
              {/* Camera View Section */}
              <div className="md:w-1/2 w-full">
                <h3 className="text-3xl font-semibold text-verda-green mb-6 text-center fancy-font">
                  {" "}
                  {/* Increased font size and margin */}
                  Scan Your Item
                </h3>
                <div className="max-w-md mx-auto bg-gray-200 rounded-lg overflow-hidden shadow-inner aspect-video flex items-center justify-center border border-gray-300 relative">
                  {" "}
                  {/* Added border */}
                  {isCameraActive && ( // Conditionally render TeachableMachineClient based on isCameraActive
                    <TeachableMachineClient
                      onPrediction={handlePrediction}
                      modelUrl={modelUrl}
                      selectedCountry={selectedCountry} // Reinstated selectedCountry prop
                    />
                  )}
                  {!isCameraActive && ( // Placeholder when camera is not active
                    <div className="text-gray-500 text-center p-4">
                      Camera is off. Click &quot;Open Item Scanner&quot; to
                      start.
                    </div>
                  )}
                </div>
              </div>
              {/* Prediction Display Section (within modal) */}
              <div className="md:w-1/2 w-full flex flex-col justify-center">
                {predictionResult && displayedBinInfo && (
                  <div
                    className={`p-6 rounded-lg shadow-lg transition-all duration-300 ease-in-out ${
                      displayedBinInfo.color
                    } ${
                      displayedBinInfo.textColor || "text-gray-800"
                    } border border-white/30`}
                  >
                    <h4 className="text-2xl font-bold mb-2 fancy-font">
                      Recommended Bin: {displayedBinInfo.name}
                    </h4>
                    <p className="text-md mb-3">
                      For item: <strong>{predictionResult}</strong> in{" "}
                      {currentCountryData?.countryName}
                    </p>
                    {displayedBinInfo.advice && (
                      <p className="mb-3 text-sm italic bg-black/10 p-2 rounded-md">
                        <strong>Tip:</strong> {displayedBinInfo.advice}
                      </p>
                    )}
                    {displayedBinInfo.items &&
                      displayedBinInfo.items.length > 0 && (
                        <>
                          <h5 className="text-lg font-semibold mb-1">
                            Common Items:
                          </h5>
                          <ul className="list-disc list-inside space-y-1 text-sm">
                            {displayedBinInfo.items
                              .slice(0, 3)
                              .map((item: string, index: number) => (
                                <li key={index}>{item}</li>
                              ))}
                            {displayedBinInfo.items.length > 3 && (
                              <li>...and more</li>
                            )}
                          </ul>
                        </>
                      )}
                  </div>
                )}
                {predictionResult && !displayedBinInfo && (
                  <p className="mt-5 text-center text-red-700 bg-red-100 p-4 rounded-md border border-red-300 shadow-sm">
                    {" "}
                    {/* Enhanced error message style */}
                    Could not identify a specific bin for &quot;
                    {predictionResult}
                    &quot; in {currentCountryData?.countryName}. Please check
                    the item or try searching manually.
                  </p>
                )}
                {!predictionResult && (
                  <p className="text-center text-gray-600">
                    Point your camera at an item.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
        {/* Display Area for Predicted Bin or Search Results */}
        <section className="mt-10">
          {" "}
          {/* Increased top margin */}
          {/* Recommended Bin Display (after search or scan) */}
          {displayedBinInfo && (
            <div className="mb-12">
              {" "}
              {/* Added margin-bottom to separate from all bins list */}
              <h2 className="text-3xl font-semibold text-verda-green mb-6 text-center fancy-font">
                {recommendationTitle}
              </h2>
              <div
                className={`p-10 rounded-xl shadow-2xl transition-all duration-500 ease-in-out transform hover:scale-[1.02] hover:shadow-3xl ${
                  displayedBinInfo.color // Should exist on DisplayableBinInfo via Bin
                } ${
                  displayedBinInfo.textColor || "text-gray-800"
                } border-2 border-white/50`} /* Enhanced display, added border */
              >
                <h3 className="text-4xl font-bold mb-4 fancy-font">
                  {" "}
                  {/* Increased font size and margin */}
                  Place in: {displayedBinInfo.name} {/* Should exist */}
                </h3>
                <p className="text-xl mb-5">
                  {displayedBinInfo.description || "No description available."}
                </p>
                {displayedBinInfo.advice && (
                  <p className="mb-5 text-md italic bg-black/10 p-3 rounded-md">
                    <strong>Quick Tip:</strong> {displayedBinInfo.advice}
                  </p>
                )}
                {displayedBinInfo.items &&
                  displayedBinInfo.items.length > 0 && (
                    <>
                      <h4 className="text-2xl font-semibold mb-3">
                        Common Items:
                      </h4>
                      <ul className="list-disc list-inside space-y-1.5 text-lg">
                        {" "}
                        {/* Increased font size and spacing */}
                        {displayedBinInfo.items.map(
                          (item: string, index: number) => (
                            <li key={index}>{item}</li>
                          )
                        )}
                      </ul>
                    </>
                  )}
              </div>
            </div>
          )}
          {searchQuery &&
            displayedBinInfo === null &&
            !showScanner && ( // Only show if not in scanner and no results
              <div className="mt-10 p-8 bg-white/70 backdrop-blur-lg rounded-xl shadow-xl text-center">
                {" "}
                {/* Increased padding and margin */}
                <p className="text-2xl text-gray-700">
                  {" "}
                  {/* Increased font size */}
                  No specific bin found for &quot;{searchQuery}&quot; in{" "}
                  {currentCountryData?.countryName}.
                </p>
                <p className="text-lg text-gray-600 mt-2">
                  Please check your spelling or try a broader term.
                </p>
              </div>
            )}
          {/* Default Display: All Bins for Selected Country */}
          {currentCountryData && ( // Always show all bins for the selected country
            <section className="mt-16">
              {" "}
              {/* Increased top margin */}
              <h2 className="text-4xl font-semibold text-verda-green mb-10 text-center fancy-font">
                {" "}
                {/* Increased font size and margin */}
                All Waste Bins in {currentCountryData.countryName}
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                {" "}
                {/* Increased gap */}
                {currentCountryData.bins.map(
                  (
                    bin: Bin // Explicitly type bin as Bin
                  ) => (
                    <div
                      key={bin.name}
                      className={`p-8 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 ${
                        bin.color
                      } ${
                        bin.textColor || "text-gray-800"
                      } flex flex-col border-2 border-white/50`}
                    >
                      <h3 className="text-2xl font-bold mb-4 fancy-font">
                        {bin.name}
                      </h3>
                      <p className="text-md mb-5 flex-grow">
                        {bin.description || "No description available."}
                      </p>
                      <h4 className="text-lg font-semibold mb-3">
                        Common Items:
                      </h4>
                      <ul className="list-disc list-inside space-y-1.5 text-sm">
                        {bin.items
                          .slice(0, 3)
                          .map((item: string, index: number) => (
                            <li key={index}>{item}</li>
                          ))}
                        {bin.items.length > 3 && <li>...and more</li>}
                      </ul>
                    </div>
                  )
                )}
              </div>
            </section>
          )}
        </section>
      </div>
    </main>
  );
}
