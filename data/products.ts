import type { Product, ProductBadge, ProductImage } from "@/types/catalog";

export type { Product, ProductBadge, ProductImage };

export const PRODUCTS: Product[] = [
  {
    id: "cr7-sql3-60w",
    slug: "cr7-sql-3-eye-laser-mini-driving-light",
    sku: "CR7-SQL3-60W",
    name: "CR7 SQL 3-Eye Laser Mini Driving Light Hi/Lo",
    category: "led-headlights",
    price: 245000,
    originalPrice: 295000,
    currency: "IDR",
    images: [
      {
        url: "/images/prod-biled-projector.svg",
        alt: "CR7 SQL 3-Eye Laser Mini Driving Light with CNC cooling fins and stainless bracket",
        label: "Main",
      },
      {
        url: "/images/prod-beam-test.svg",
        alt: "Night beam cutoff test showing crisp 6000K white low beam and 3000K amber high beam",
        label: "Beam Pattern",
      },
    ],
    shortSpecs: ["60W Real", "3000K / 6000K", "IP67"],
    fullSpecs: {
      "Power Output": "60W Total (30W Low + 30W High)",
      "Color Temperature": "6000K Crisp White + 3000K Fog Amber",
      "Input Voltage": "DC 12V – 24V",
      "Optical Lens": "3-Eye Flat Cutoff Convex Glass",
      "Body Material": "CNC Die-Cast Aviation Aluminum 6063",
      "Ingress Protection": "IP67 Waterproof & Dustproof",
      "Cooling System": "Passive Fin Heatsink + Internal Turbo Fan",
      Lifespan: "50,000+ Hours",
    },
    inTheBox: [
      "1x CR7 SQL 3-Eye Mini Driving Light",
      "1x Stainless Steel U-Bracket & Hex Bolts",
      "1x External Constant-Current Driver",
      "1x Official CR7 Warranty Card",
    ],
    fitmentNotes:
      "Universal mounting fits crash bars, lower fork tubes, or under-headlight brackets. Requires DC 12V wiring (recommended to pair with CR7 40A Relay Harness).",
    compatibility: [
      "Universal",
      "Yamaha NMAX",
      "Honda PCX 160",
      "Honda ADV 160",
      "Honda Vario 160",
    ],
    badges: ["Best Seller", "Waterproof"],
    featured: true,
    inStock: true,
    links: {
      shopee:
        "https://shopee.co.id/search?keyword=CR7%20SQL%203%20Mata%20Laser%2060W",
      tiktokShop: "https://shop.tiktok.com/",
    },
    description:
      "Flagship 3-eye mini driving light engineered with razor-sharp flat cutoff optics. Switch effortlessly between 6000K daylight white for clear roads and 3000K golden yellow for heavy rain and mountain fog.",
  },
  {
    id: "cr7-biled-25-pro",
    slug: "cr7-biled-25-inch-projector-angel-devil-eye",
    sku: "CR7-BILED25-PRO",
    name: "CR7 Bi-LED 2.5\" Projector Headlight + Demon Eye",
    category: "led-headlights",
    price: 385000,
    originalPrice: 440000,
    currency: "IDR",
    images: [
      {
        url: "/images/prod-biled-headlight.svg",
        alt: "CR7 2.5 inch Bi-LED projector headlight with halo ring and red demon eye shroud",
        label: "Main",
      },
      {
        url: "/images/prod-beam-test.svg",
        alt: "Flat projector cutoff beam output measured at 15 meters",
        label: "Beam Pattern",
      },
    ],
    shortSpecs: ["55W Bi-LED", "2.5\" Shroud", "12V DC"],
    fullSpecs: {
      "Power Output": "45W Low Beam / 55W High Beam",
      "Lens Diameter": "2.5 Inch Blue-Coated HD Glass",
      "Color Temperature": "6000K Pure White + Ice Blue Halo + Red Demon Eye",
      "Cutoff Pattern": "RHD Flat Step Cutoff",
      "Input Voltage": "DC 12V (Full Wave Recommended)",
      "Body Material": "Full Aluminum Reflector Bowl",
    },
    inTheBox: [
      "1x CR7 2.5\" Bi-LED Projector Unit",
      "1x BMW-Style Halo Shroud (Pre-installed)",
      "1x H4 / H7 Lock Nut Adapter Ring",
      "1x Silicone Dust Boot",
    ],
    fitmentNotes:
      "Fits most 150cc–250cc headlight housings with minor reflector clearance check. Professional retrofit alignment recommended for optimal cutoff height.",
    compatibility: [
      "Universal",
      "Honda Vario 160",
      "Yamaha Aerox 155",
      "Yamaha NMAX",
      "Kawasaki Ninja / ZX",
    ],
    badges: ["Best Seller", "New Arrival"],
    featured: true,
    inStock: true,
    links: {
      shopee:
        "https://shopee.co.id/search?keyword=CR7%20Biled%20Projector%202.5%20inch",
      tiktokShop: "https://shop.tiktok.com/",
    },
    description:
      "Full 2.5-inch Bi-LED retrofit projector delivering wide carpet illumination, crisp anti-glare cutoff, and instant mechanical solenoid high-beam flash with integrated Angel & Demon Eye accents.",
  },
  {
    id: "cr7-seq-signal-09",
    slug: "cr7-smoked-sequential-led-turn-signals",
    sku: "CR7-SEQ-09",
    name: "CR7 Smoked Sequential Running LED Turn Signals (Pair)",
    category: "signals-tail-lights",
    price: 115000,
    originalPrice: 145000,
    currency: "IDR",
    images: [
      {
        url: "/images/prod-turn-signal.svg",
        alt: "Pair of smoked-lens sequential running LED motorcycle turn signals with amber light bars",
        label: "Main",
      },
    ],
    shortSpecs: ["Running Flow", "M10 Bolt", "IP66"],
    fullSpecs: {
      "Light Mode": "Dynamic Sequential Flowing Amber",
      "Mounting Thread": "Standard M10 Flex-Stem",
      "Input Voltage": "DC 12V",
      "Lens Finish": "Smoked Polycarbonate Anti-Scratch",
      "Water Resistance": "IP66 Sealed Housing",
      Quantity: "1 Pair (Left + Right)",
    },
    inTheBox: [
      "2x CR7 Sequential LED Turn Signals (L/R)",
      "2x M10 Lock Nuts & Washers",
    ],
    fitmentNotes:
      "Direct bolt-on for motorcycles using M10 stalk turn signals. Pair with an adjustable LED flasher relay for ideal sweeping speed.",
    compatibility: [
      "Universal",
      "Kawasaki Ninja / ZX",
      "CRF / KLX Trail",
      "Yamaha Aerox 155",
    ],
    badges: ["Best Seller", "Waterproof"],
    featured: true,
    inStock: true,
    links: {
      shopee:
        "https://shopee.co.id/search?keyword=CR7%20Sein%20LED%20Running%20Sequential",
      tiktokShop: "https://shop.tiktok.com/",
    },
    description:
      "Ultra-bright 12-SMD sweeping amber turn indicators housed in flexible anti-snap smoked shells. High daylight visibility with sleek aerodynamic profile.",
  },
  {
    id: "cr7-cnc-lever-6c",
    slug: "cr7-cnc-6-click-adjustable-brake-clutch-levers",
    sku: "CR7-LVR-6C",
    name: "CR7 CNC 6-Click Adjustable Brake & Clutch Lever Set",
    category: "controls-cockpit",
    price: 195000,
    originalPrice: 235000,
    currency: "IDR",
    images: [
      {
        url: "/images/prod-cnc-levers.svg",
        alt: "Matte black CNC aluminum motorcycle brake and clutch levers with racing-red 6-position adjusters",
        label: "Main",
      },
    ],
    shortSpecs: ["6061-T6 CNC", "6-Click Reach", "Anodized"],
    fullSpecs: {
      Material: "CNC Machined 6061-T6 Billet Aluminum",
      Adjustment: "6-Position Ergonomic Reach Clicker",
      Finish: "Hard Anodized Matte Black + Racing Red Dial",
      Hardware: "304 Stainless Steel Pivot Bushings",
      Weight: "290g (Pair)",
    },
    inTheBox: [
      "1x Right Front Brake Lever",
      "1x Left Rear Brake / Clutch Lever",
      "1x Pre-installed Brass Pivot Bushing",
    ],
    fitmentNotes:
      "Select your exact motorcycle variant on Shopee or TikTok Shop before checkout (NMAX, PCX 160 CBS/ABS, Vario 160, or Aerox).",
    compatibility: [
      "Yamaha NMAX",
      "Honda PCX 160",
      "Honda Vario 160",
      "Yamaha Aerox 155",
    ],
    badges: ["CNC Alloy", "Best Seller"],
    featured: true,
    inStock: true,
    links: {
      shopee:
        "https://shopee.co.id/search?keyword=Handle%20Rem%20CNC%206%20Click%20NMAX%20PCX",
      tiktokShop: "https://shop.tiktok.com/",
    },
    description:
      "Precision-milled billet aluminum levers with 6-step reach adjustment to dial in finger feel for city commuting or spirited cornering.",
  },
  {
    id: "cr7-slider-pro",
    slug: "cr7-cnc-delrin-frame-slider-crash-protector",
    sku: "CR7-SLD-02",
    name: "CR7 CNC Delrin Frame Slider & Engine Crash Protector",
    category: "protection-body",
    price: 275000,
    originalPrice: 320000,
    currency: "IDR",
    images: [
      {
        url: "/images/prod-crash-guard.svg",
        alt: "Pair of matte black Delrin and CNC aluminum frame sliders with red anodized accents",
        label: "Main",
      },
    ],
    shortSpecs: ["POM Delrin", "CNC Collar", "M10 Bolts"],
    fullSpecs: {
      "Slider Puck": "High-Impact POM Delrin (Low Friction)",
      "Mounting Collar": "CNC 6061 Aluminum + Red Anodized Ring",
      "Bolt Spec": "High-Tensile 10.9 Grade M10 Steel",
      Length: "115mm Total Stand-Off",
      Quantity: "1 Pair (Left + Right)",
    },
    inTheBox: [
      "2x POM Delrin Frame Slider Assemblies",
      "2x High-Tensile M10 Mounting Bolts",
      "2x Aluminum Spacer Collars",
    ],
    fitmentNotes:
      "Designed to absorb low-side slide impact and protect fairings, engine covers, and radiator shrouds without bending the main chassis.",
    compatibility: [
      "Universal",
      "Kawasaki Ninja / ZX",
      "Yamaha NMAX",
      "Honda ADV 160",
    ],
    badges: ["CNC Alloy"],
    featured: true,
    inStock: true,
    links: {
      shopee:
        "https://shopee.co.id/search?keyword=Frame%20Slider%20CNC%20Motor%20Delrin",
      tiktokShop: "https://shop.tiktok.com/",
    },
    description:
      "Sacrificial POM Delrin sliders engineered to glide smoothly on asphalt instead of catching, paired with anodized CNC collars for rugged track-ready protection.",
  },
  {
    id: "cr7-mount-vibe",
    slug: "cr7-anti-vibration-cnc-phone-mount-usbc",
    sku: "CR7-MNT-PD20",
    name: "CR7 Anti-Vibration CNC Phone Mount + USB-C Fast Charge",
    category: "touring-mounts",
    price: 229000,
    originalPrice: 279000,
    currency: "IDR",
    images: [
      {
        url: "/images/prod-phone-mount.svg",
        alt: "CNC aluminum motorcycle handlebar phone mount with 4-corner vibration dampener and USB-C port",
        label: "Main",
      },
    ],
    shortSpecs: ["4-Point Dampener", "PD 20W USB-C", "IP65"],
    fullSpecs: {
      "Phone Fit Range": "4.7\" – 6.9\" Smartphones (Width 65–90mm)",
      "Vibration Control": "4-Point Silicone OIS Camera Dampener",
      "Charging Output": "USB-C PD 20W Fast Charge (12V–24V Input)",
      "Mount Types": "Handlebar Clamp (22–32mm) + Mirror Stem Adapter",
      "Build Material": "CNC Aluminum Alloy + Stainless Lock Screw",
    },
    inTheBox: [
      "1x Anti-Vibration CNC Phone Cradle",
      "1x Handlebar Clamp + Rubber Shims",
      "1x Mirror Stem Mounting Adapter",
      "1x 1.5m Waterproof Fused Power Cable",
    ],
    fitmentNotes:
      "Protects smartphone optical image stabilization (OIS) from high-frequency engine vibrations during long touring rides.",
    compatibility: [
      "Universal",
      "Yamaha NMAX",
      "Honda PCX 160",
      "Honda ADV 160",
      "Honda Vario 160",
    ],
    badges: ["Best Seller", "Waterproof", "CNC Alloy"],
    featured: true,
    inStock: true,
    links: {
      shopee:
        "https://shopee.co.id/search?keyword=Holder%20HP%20Motor%20Anti%20Getar%20CNC%20USB",
      tiktokShop: "https://shop.tiktok.com/",
    },
    description:
      "Touring-grade CNC handlebar phone mount featuring a quad-silicone vibration damper to safeguard smartphone cameras and a weather-sealed 20W USB-C charging port.",
  },
  {
    id: "cr7-relay-40a",
    slug: "cr7-waterproof-40a-led-relay-wiring-harness",
    sku: "CR7-RLY-40A",
    name: "CR7 Waterproof 40A LED Driving Light Relay Harness Kit",
    category: "electrical-relays",
    price: 89000,
    originalPrice: 110000,
    currency: "IDR",
    images: [
      {
        url: "/images/prod-relay-harness.svg",
        alt: "Waterproof 12V 40A motorcycle LED relay wiring harness kit with inline 30A fuse and braided loom",
        label: "Main",
      },
    ],
    shortSpecs: ["12V 40A", "30A Fuse", "Braided Loom"],
    fullSpecs: {
      "Relay Capacity": "DC 12V 40A Sealed Waterproof Relay",
      "Fuse Protection": "Inline 30A Blade Fuse with Weather Cap",
      "Wire Gauge": "16 AWG Pure Copper + Nylon Braided Sleeve",
      "Output Channels": "Dual Output (Supports 1–2 Auxiliary Lights)",
      Connectors: "Plug-and-Play Waterproof Deutsch Sockets",
    },
    inTheBox: [
      "1x Complete 40A Relay Wiring Harness",
      "1x Pre-installed 30A Blade Fuse",
      "4x Heavy-Duty Cable Ties",
    ],
    fitmentNotes:
      "Essential upgrade when installing 30W–120W SQL or Bi-LED lighting to prevent OEM switch meltdowns and voltage drop.",
    compatibility: [
      "Universal",
      "Yamaha NMAX",
      "Honda PCX 160",
      "Honda Vario 160",
      "Honda ADV 160",
      "CRF / KLX Trail",
    ],
    badges: ["Waterproof"],
    featured: true,
    inStock: true,
    links: {
      shopee:
        "https://shopee.co.id/search?keyword=Relay%20Set%20Lampu%20Tembak%20Motor%20Waterproof",
      tiktokShop: "https://shop.tiktok.com/",
    },
    description:
      "Heavy-duty braided copper relay harness engineered specifically for high-wattage motorcycle driving lights. Guarantees full battery voltage straight to your LEDs.",
  },
  {
    id: "cr7-mirror-barend",
    slug: "cr7-cnc-stealth-bar-end-mirrors-anti-glare",
    sku: "CR7-MRR-BE01",
    name: "CR7 CNC Stealth Bar-End Mirrors (Blue Anti-Glare)",
    category: "controls-cockpit",
    price: 165000,
    originalPrice: 199000,
    currency: "IDR",
    images: [
      {
        url: "/images/prod-bar-end-mirrors.svg",
        alt: "Pair of angular matte black CNC aluminum motorcycle bar-end mirrors with blue anti-glare glass",
        label: "Main",
      },
    ],
    shortSpecs: ["Blue Glass", "22mm Bar", "CNC Alloy"],
    fullSpecs: {
      Glass: "Convex Blue-Tinted Anti-Glare Optical Mirror",
      Housing: "CNC Machined 6061 Aluminum Matte Black",
      "Handlebar Fit": "Hollow 22mm (7/8\") Standard Handlebars",
      Adjustment: "360° Ball-Joint Swivel",
      Quantity: "1 Pair (Left + Right)",
    },
    inTheBox: [
      "2x Stealth CNC Bar-End Mirrors",
      "2x Expanding Aluminum Bar Inserts (13mm–18mm)",
      "1x Allen Key Tool",
    ],
    fitmentNotes:
      "Installs either over bar-end adapters or directly inside hollow 22mm handlebars. Eliminates glare from trailing high-beams at night.",
    compatibility: [
      "Universal",
      "Yamaha NMAX",
      "Yamaha Aerox 155",
      "Honda PCX 160",
      "Kawasaki Ninja / ZX",
    ],
    badges: ["CNC Alloy", "New Arrival"],
    featured: true,
    inStock: true,
    links: {
      shopee:
        "https://shopee.co.id/search?keyword=Spion%20Bar%20End%20CNC%20Anti%20Silau",
      tiktokShop: "https://shop.tiktok.com/",
    },
    description:
      "Low-profile angular CNC bar-end mirrors with wide convex blue-tinted glass that cuts night headlight glare while keeping your cockpit sharp and clean.",
  },
  {
    id: "cr7-tail-blade",
    slug: "cr7-twin-blade-smoked-led-tail-light",
    sku: "CR7-TL-NMAX",
    name: "CR7 Twin-Blade Smoked LED Tail Light + Integrated Signals",
    category: "signals-tail-lights",
    price: 415000,
    originalPrice: 485000,
    currency: "IDR",
    images: [
      {
        url: "/images/prod-tail-light.svg",
        alt: "Smoked twin-blade LED motorcycle tail light with red DRL bars and integrated amber turn indicators",
        label: "Main",
      },
    ],
    shortSpecs: ["3-in-1 DRL", "Plug & Play", "Smoked Lens"],
    fullSpecs: {
      Functions: "Red Running DRL + Bright Brake + Sequential Amber Signals",
      "Lens Type": "Dark Smoked Impact-Resistant Acrylic",
      Installation: "OEM Socket Plug & Play",
      Voltage: "DC 12V",
      Waterproof: "IP67 Ultrasonic Sealed",
    },
    inTheBox: [
      "1x Twin-Blade Smoked LED Tail Light Assembly",
      "1x Plug-and-Play OEM Harness Adapter",
    ],
    fitmentNotes:
      "Direct replacement for OEM tail assembly with zero wire cutting required. Exclusive flash drop available on Shopee.",
    compatibility: ["Yamaha NMAX", "Yamaha Aerox 155"],
    badges: ["New Arrival", "Waterproof"],
    featured: false,
    inStock: true,
    links: {
      shopee:
        "https://shopee.co.id/search?keyword=Stoplamp%20LED%203in1%20Smoke%20NMAX",
    },
    description:
      "Aggressive smoked 3-in-1 rear light cluster combining signature twin-blade DRL bars, high-intensity center brake matrix, and integrated sweeping turn signals.",
  },
  {
    id: "cr7-switch-3m",
    slug: "cr7-cnc-waterproof-3-mode-pass-beam-switch",
    sku: "CR7-SW-3M",
    name: "CR7 CNC Waterproof 3-Mode Auxiliary & Pass-Beam Switch",
    category: "controls-cockpit",
    price: 98000,
    currency: "IDR",
    images: [
      {
        url: "/images/prod-switch-3mode.svg",
        alt: "Waterproof CNC aluminum 3-mode handlebar switch with Hi/Lo selector and yellow Pass-Beam button",
        label: "Main",
      },
    ],
    shortSpecs: ["3-Mode + Pass", "IP67 Sealed", "22mm Clamp"],
    fullSpecs: {
      Controls: "Main Power Rocker + Hi/Lo Beam Toggle + Momentary Pass Flash",
      Body: "CNC Anodized Aluminum Block",
      Clamp: "22mm Handlebar Mount + Mirror Bracket Included",
      "Wire Length": "60cm Color-Coded Waterproof Cable",
    },
    inTheBox: [
      "1x CR7 3-Mode CNC Handlebar Switch",
      "1x Mirror-Base Mounting Bracket",
    ],
    fitmentNotes:
      "Ideal controller for CR7 SQL 3-Eye or dual-color mini projectors. Exclusive live-stream bundle available on TikTok Shop.",
    compatibility: [
      "Universal",
      "Yamaha NMAX",
      "Honda PCX 160",
      "Honda Vario 160",
      "Honda ADV 160",
    ],
    badges: ["CNC Alloy", "Waterproof"],
    featured: false,
    inStock: true,
    links: {
      tiktokShop: "https://shop.tiktok.com/",
    },
    description:
      "Compact weatherproof aluminum switch pod with dedicated Hi/Lo color selector and thumb-accessible momentary Pass-Beam button for instant overtaking flashes.",
  },
  {
    id: "cr7-d2-laser-pro",
    slug: "cr7-d2-mini-laser-fog-lamp-20w",
    sku: "CR7-D2L-20W",
    name: "CR7 D2 Compact Laser Fog Lamp 20W (White / Yellow)",
    category: "led-headlights",
    price: 139000,
    originalPrice: 175000,
    currency: "IDR",
    images: [
      {
        url: "/images/prod-biled-projector.svg",
        alt: "CR7 D2 compact laser motorcycle fog lamp in black aluminum housing",
        label: "Main",
      },
      {
        url: "/images/prod-beam-test.svg",
        alt: "Dual-color white and yellow beam cutoff pattern",
        label: "Beam Pattern",
      },
    ],
    shortSpecs: ["20W Compact", "Dual Color", "IP67"],
    fullSpecs: {
      "Power Output": "20W Real Output",
      "Color Modes": "Low White 6000K / High Yellow 3000K",
      "Input Voltage": "DC 12V – 24V",
      Dimensions: "58mm × 36mm × 34mm (Ultra-Compact)",
      "Water Resistance": "IP67 Sealed",
    },
    inTheBox: [
      "1x CR7 D2 Mini Laser Fog Lamp",
      "1x Adjustable L-Bracket & Bolts",
    ],
    fitmentNotes:
      "Ultra-compact footprint tucks cleanly inside under-fender spaces on scooters like Vario, Beat, Scoopy, and NMAX.",
    compatibility: [
      "Universal",
      "Honda Vario 160",
      "Yamaha NMAX",
      "Yamaha Aerox 155",
      "CRF / KLX Trail",
    ],
    badges: ["Waterproof"],
    featured: false,
    inStock: true,
    links: {
      shopee: "https://shopee.co.id/search?keyword=CR7%20D2%20Laser%2020W",
      tiktokShop: "https://shop.tiktok.com/",
    },
    description:
      "Stealth ultra-compact auxiliary fog lamp built for tight scooter fairings. Delivers focused dual-color illumination without bulky external housings.",
  },
  {
    id: "cr7-biled-30-titanium",
    slug: "cr7-bi-led-30-titanium-series-70w",
    sku: "CR7-TI30-70W",
    name: "CR7 Titanium Series 3.0\" Bi-LED Laser Matrix 70W",
    category: "led-headlights",
    price: 690000,
    originalPrice: 790000,
    currency: "IDR",
    images: [
      {
        url: "/images/prod-biled-headlight.svg",
        alt: "CR7 Titanium 3.0 inch Bi-LED laser matrix projector headlight",
        label: "Main",
      },
      {
        url: "/images/prod-beam-test.svg",
        alt: "High-intensity laser matrix beam cutoff test",
        label: "Beam Pattern",
      },
    ],
    shortSpecs: ["70W Matrix", "3.0\" Lens", "Limited Batch"],
    fullSpecs: {
      "Power Output": "58W Low / 70W Laser Assist High Beam",
      "Lens Size": "3.0 Inch Clear HD Optical Glass",
      "Color Temp": "5800K Natural Daylight",
      "Cooling Fan": "Dual Ball-Bearing High-RPM Copper Core",
    },
    inTheBox: [
      "1x CR7 Titanium 3.0\" Bi-LED Matrix Unit",
      "1x Heavy-Duty Mounting Shroud Kit",
    ],
    fitmentNotes:
      "Currently restocking next production batch. Check our official Shopee or TikTok Shop storefront for restock notifications.",
    compatibility: [
      "Kawasaki Ninja / ZX",
      "Yamaha NMAX",
      "Honda PCX 160",
      "Honda ADV 160",
    ],
    badges: ["New Arrival"],
    featured: false,
    inStock: false,
    links: {
      shopee: "https://shopee.co.id/search?keyword=CR7%20Biled%203%20inch",
      tiktokShop: "https://shop.tiktok.com/",
    },
    description:
      "Competition-grade 3.0-inch laser-assist Bi-LED projector engineered for long-distance highway touring. Currently awaiting next batch restock.",
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function getFeaturedProducts(): Product[] {
  return PRODUCTS.filter((p) => p.featured);
}

export function getRelatedProducts(product: Product, limit = 4): Product[] {
  const sameCategory = PRODUCTS.filter(
    (p) => p.category === product.category && p.id !== product.id
  );
  if (sameCategory.length >= limit) return sameCategory.slice(0, limit);
  const others = PRODUCTS.filter(
    (p) => p.category !== product.category && p.id !== product.id
  );
  return [...sameCategory, ...others].slice(0, limit);
}
