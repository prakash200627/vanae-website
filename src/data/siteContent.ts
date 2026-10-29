export interface SiteContent {
  branding: {
    name: string;
    tagline: string;
    logoLight: string;
    logoDark: string;
    favicon: string;
    primaryColor: string;
    goldColor: string;
  };
  navigation: { label: string; href: string }[];
  hero: {
    videoSrc: string;
    posterSrc: string;
    scrollText: string;
    badgeText: string;
    majorStatement: string;
    supportingCopy: string;
    ctaText: string;
    /** Required disclosure while the hero film carries an AI / CGI watermark. */
    impressionNote: string;
    /** Provisional figures — not shown in the hero until client-approved. */
    facts: string[];
  };
  overview: {
    eyebrow: string;
    headingLines: string[];
    paragraphs: string[];
    /** Portrait candidate — use only when portraitApproved is true. */
    portraitImage: string;
    portraitAlt: string;
    /**
     * Rights gate for overview imagery. When false, UI must show a labelled
     * placeholder instead of presenting the file as approved photography.
     */
    portraitApproved: boolean;
    /** Spec strip — every item remains unverified until client approval. */
    projectDetails: {
      value: string;
      label: string;
      status: "TO CONFIRM";
    }[];
    stats: { value: string; label: string }[];
    badge: string;
    brochureBtnText: string;
  };
  /** Consolidated architecture / nature story (replaces Elevation, Collage, Sky, Sanctuary mounts). */
  rootedStory: {
    eyebrow: string;
    sectionHeading: string;
    panels: {
      title: string;
      body: string;
      image: string;
      imageAlt: string;
      /**
       * Rights gate — when false, UI shows a rectangular “Image pending”
       * placeholder instead of presenting the file as approved photography.
       */
      imageApproved: boolean;
    }[];
    videoCtaText: string;
  };
  architecture: {
    headingLines: string[];
    supportingCopy: string;
    subheadingLines: string[];
    subheadingCopy: string;
    towerImage: string;
    bgImage: string;
  };
  natureStorytelling: {
    philosophyHeading: string[];
    philosophyCopy: string;
    panels: {
      phrase: string;
      copy: string;
      image?: string;
    }[];
    environmentalBenefits: {
      heading: string;
      supportingCopy: string;
      benefits: string[];
    };
  };
  residential: {
    headingLines: string[];
    supportingCopy: string;
    lifestyleHeading: string[];
    lifestyleCopy: string;
    btnText: string;
    images: { src: string; alt: string }[];
  };
  clubhouseAmenities: {
    headingLines: string[];
    supportingCopy: string;
    approvalNote: string;
    bannerText: string;
    bannerSubtext: string;
    bannerBtnText: string;
    categories: {
      name: string;
      description: string;
      /** Short status chip — e.g. TO CONFIRM or As shown. */
      status: string;
      items: string[];
      image: string;
      imageAlt: string;
      /** Rights gate — amenity photos stay off until explicitly approved. */
      imageApproved: boolean;
    }[];
    featuredCards: {
      title: string;
      desc: string;
      icon: string;
      image: string;
    }[];
  };
  verticalEcosystem: {
    headingLines: string[];
    supportingCopy: string;
    videoUrl: string;
    bgImage: string;
    btnText: string;
  };
  floorPlans: {
    headingLines: string[];
    paragraphs: string[];
    btnText: string;
    approvalNote: string;
    /** Shown when no approved drawings are available for display. */
    pendingLabel: string;
    pendingDetail: string;
    plans: {
      src: string;
      title: string;
      /** Intrinsic pixel size — used to preserve aspect without cropping. */
      width: number;
      height: number;
      labelStatus: "TO CONFIRM";
      /** Rights + provenance gate — false until a real approved drawing is confirmed. */
      drawingApproved: boolean;
      /** Descriptive alt based on what the drawing actually shows. */
      alt?: string;
    }[];
  };
  specifications: {
    tag: string;
    heading: string;
    subheading: string;
    categories: {
      title: string;
      items: string[];
    }[];
  };
  location: {
    tag: string;
    headingLines: string[];
    copy: string;
    /** Supported public description only — exact pin/address remain TO CONFIRM. */
    publicPlace: string;
    approvalNote: string;
    siteAddress: string;
    corporateAddress: string;
    /**
     * Location media — do not render until rights and suitability are confirmed.
     * location-aerial.jpg duplicates bespoke-2; sky-terrace.jpg is a site plan, not a photo.
     */
    mapImage: string;
    mapImageAlt: string;
    imageApproved: boolean;
    /** Valid Google Maps embed URL (iframe src) — not the share/place URL. */
    embedMapUrl: string;
    /** Client-supplied place URL for “Open in Google Maps”. */
    openMapsUrl: string;
    mapApproved: boolean;
  };
  enquiry: {
    eyebrow: string;
    heading: string;
    supportingCopy: string;
    ctaText: string;
  };
  gallery: {
    tag: string;
    headingLines: string[];
    approvalNote: string;
    items: {
      src: string;
      title: string;
      category: string;
      /** Editorial frame hint for mosaic layout. */
      frame: "tall" | "wide" | "square";
      /** Rights gate — gallery photos stay off until explicitly approved. */
      imageApproved: boolean;
    }[];
  };
  contact: {
    tag: string;
    titleLines: string[];
    phonePlaceholderNote: string;
    phone: string;
    displayPhone: string;
    isPhonePlaceholder: boolean;
    email: string;
    siteAddress: string;
    corporateAddress: string;
    reraNumberNote: string;
    socials: { name: string; url: string; short: string }[];
  };
  footer: {
    copyright: string;
    designedBy: string;
    designedByUrl: string;
    siteAddress: string;
    corporateAddress: string;
    reraNumber: string;
  };
  whatsapp?: {
    phoneNumber?: string;
    defaultMessage?: string;
    url?: string;
  };
}

export const siteContent: SiteContent = {
  branding: {
    name: "VANAE",
    tagline: "Ultra-Luxury Bespoke Residences",
    logoLight: "/assets/vanae-logo.jpg",
    logoDark: "/assets/vanae-logo.jpg",
    favicon: "/assets/logo.svg",
    primaryColor: "#0D5A46",
    goldColor: "#C39663",
  },
  /** Primary IA — exactly seven destinations (01–07). */
  navigation: [
    { label: "HOME", href: "#home" },
    { label: "OVERVIEW", href: "#overview" },
    { label: "AMENITIES", href: "#amenities" },
    { label: "FLOOR PLANS", href: "#floor-plans" },
    { label: "LOCATION", href: "#location" },
    { label: "GALLERY", href: "#gallery" },
    { label: "ENQUIRY", href: "#enquiry" },
  ],
  hero: {
    videoSrc: "/assets/videos/hero.mp4",
    /**
     * Poster currently may not match the film (audit). Frame extraction was
     * unavailable without ffmpeg — keep this fallback until a matching still
     * is supplied or extracted safely.
     */
    posterSrc: "/assets/images/hero-poster.jpg",
    scrollText: "Discover Vanae",
    badgeText: "VANAE",
    majorStatement: "Where architecture and landscape form one story.",
    supportingCopy: "Rooted living in Kollur, Hyderabad.",
    ctaText: "Enquire",
    impressionNote:
      "Artist’s impression. Film and stills are illustrative and may include AI-assisted visualisation.",
    facts: [
      "3 & 4 BHK",
      "36 Floors",
      "Spread Across 6 Towers",
      "11-Foot-High Ceilings",
    ],
  },
  overview: {
    eyebrow: "The art of rooted living",
    headingLines: ["Rise without", "leaving the earth."],
    paragraphs: [
      "Contemporary homes often trade the ground for height. Vanae is shaped around a quieter idea: that nature and architecture can share the same rhythm.",
      "Along Kollur, near ORR Exit 2, the project is envisioned as a place where landscape is not decoration at the edge of the plan, but part of how daily life is framed.",
    ],
    portraitImage: "/assets/images/tower-elevation.jpg",
    portraitAlt:
      "Residential towers with planted balconies at dusk, seen from across a tree-lined road.",
    portraitApproved: true,
    projectDetails: [
      { value: "3 & 4 BHK", label: "Residences", status: "TO CONFIRM" },
      { value: "6", label: "Towers", status: "TO CONFIRM" },
      { value: "36", label: "Floors", status: "TO CONFIRM" },
      { value: "11 ft", label: "Ceilings", status: "TO CONFIRM" },
      { value: "~1,00,000 sq.ft.", label: "Clubhouse", status: "TO CONFIRM" },
      { value: "50+", label: "Amenities", status: "TO CONFIRM" },
    ],
    stats: [
      { value: "3 & 4", label: "BHK Residences" },
      { value: "36", label: "Floors High" },
      { value: "6", label: "Towers Spread Across" },
      { value: "11 FT", label: "High Ceilings" },
    ],
    badge: "Kollur, ORR Exit 2 — Hyderabad",
    brochureBtnText: "Register interest",
  },
  rootedStory: {
    eyebrow: "Architecture & nature",
    sectionHeading: "Three chapters of rooted living",
    panels: [
      {
        title: "The land",
        body: "Before the building is the ground it meets. At Kollur, near ORR Exit 2, the story begins with landscape held close — not as ornament at the edge of a plan, but as the quiet companion to how a place is imagined.",
        image: "/assets/images/gallery-12.jpg",
        imageAlt:
          "Garden walk beside a play area, flowering plants, and a curved building front.",
        imageApproved: true,
      },
      {
        title: "The architecture",
        body: "Architecture here is meant to rise with the land rather than against it — a calm vertical reading of shade, silhouette, and sky. Exact materials, heights, and technical specifications remain subject to client confirmation.",
        image: "/assets/images/sanctuary-building.jpg",
        imageAlt:
          "Evening view of illuminated residential towers and a low glass pavilion among trees.",
        imageApproved: true,
      },
      {
        title: "The living",
        body: "Daily life is framed by light, air, and the nearness of landscape. Interiors favour composure over spectacle, so rooms feel open and unhurried. Detailed residence configurations and amenity claims are withheld until approved.",
        image: "/assets/images/gallery-2.jpg",
        imageAlt: "Living room with sofas, pendant lights, and a tall window.",
        imageApproved: true,
      },
    ],
    videoCtaText: "Watch the film",
  },
  architecture: {
    headingLines: ["WHERE THE FOREST", "ASCENDS."],
    supportingCopy:
      "Here, the landscape rises with you, creating a vertical tapestry of nature that soothes your soul and transforms your abode into a living ecosystem at every level.",
    subheadingLines: ["THE ART OF", "ROOTED LIVING"],
    subheadingCopy:
      "Somewhere along the way, up into the skies, our homes loose their connection to mother earth. And with it, a vital essence of better living. What if we could rise without leaving it behind?",
    towerImage: "/assets/images/tower-elevation.jpg",
    bgImage: "/assets/images/elevation-bg.jpg",
  },
  natureStorytelling: {
    philosophyHeading: [
      "THERE'S A CERTAIN WONDER IN",
      "RISING HIGHER WHILE",
      "STAYING ROOTED BELOW.",
    ],
    philosophyCopy:
      "And it's what Vanae brings to the table. For you don't just soar to towering heights here. You take a piece of nature with you to every level.",
    panels: [
      {
        phrase: "GROUNDED BY NATURE",
        copy: "In a way where every elevation begins with a connection to earth.",
      },
      {
        phrase: "SERENE BY NATURE",
        copy: "For the sense of calm finds you from both above and around.",
      },
      {
        phrase: "POISED BY NATURE",
        copy: "Because a forest towering into the skies is a sight to behold.",
      },
    ],
    environmentalBenefits: {
      heading: "PERKS THAT COME WITH LIVING HERE",
      supportingCopy:
        "This is a place where the expansive homes are just the beginning of the perks that come with living here.",
      benefits: [
        "Cooler towers & surroundings",
        "Reduced heat gain",
        "Improved visual and psychological connection with nature",
        "Greater environmental impact",
        "More shaded spaces",
      ],
    },
  },
  residential: {
    headingLines: ["BRINGING IN THE", "EASE YOU DESIRE"],
    supportingCopy:
      "Possibilities unfold every day here. With over 50 lifestyle amenities, this community has been thoughtfully curated to engage every generation and every mood. Each space is designed to enrich everyday life while preserving the calm and balance that define the living experience here.",
    lifestyleHeading: ["THE ADDRESS TO", "LIVE ABOVE"],
    lifestyleCopy:
      "Vanae brings together thoughtfully designed 3 & 4 BHK residences, where generous spaces, expansive views and a natural connection to the outdoors come together to create homes that feel open, elegant and effortlessly comfortable.",
    btnText: "The Residences",
    images: [
      { src: "/assets/images/bespoke-1.jpg", alt: "Master Suite with Expansive Views" },
      { src: "/assets/images/bespoke-3.jpg", alt: "Spacious Living Room with 11-Ft Ceilings" },
      { src: "/assets/images/bespoke-2.jpg", alt: "Outdoor Living Balcony" },
    ],
  },
  clubhouseAmenities: {
    /**
     * Image-led collections from visually inspected project assets.
     * Labels describe what each frame shows — not an official amenity directory.
     * Mismatched amenity-* stock (fitness water portrait, cafe→court, etc.) withheld.
     */
    bannerText: "",
    bannerSubtext: "",
    bannerBtnText: "Enquire about amenities",
    headingLines: ["Spaces for", "everyday ease."],
    supportingCopy:
      "A quiet selection of project spaces drawn from existing photography. Official amenity names, counts, and a full directory remain TO CONFIRM.",
    approvalNote:
      "Labels describe the image only. Official amenity directory TO CONFIRM.",
    categories: [
      {
        name: "Indoor lounge",
        description:
          "A plant-filled indoor lounge with soft seating and large windows.",
        status: "As shown",
        items: [
          "Visual reference from project imagery",
          "Official listing and hours TO CONFIRM",
        ],
        image: "/assets/images/bespoke-1.jpg",
        imageAlt:
          "Plant-filled indoor lounge with sofas, low tables, and large windows.",
        imageApproved: true,
      },
      {
        name: "Event room",
        description:
          "A large room set with round tables facing a projection screen.",
        status: "As shown",
        items: [
          "Visual reference from project imagery",
          "Official listing and capacity TO CONFIRM",
        ],
        image: "/assets/images/amenity-banquet.jpg",
        imageAlt:
          "Large event room set with round tables, facing a projection screen.",
        imageApproved: true,
      },
      {
        name: "Fitness room",
        description:
          "A fitness room with mats and equipment beside a window wall.",
        status: "As shown",
        items: [
          "Visual reference from project imagery",
          "Official listing and equipment TO CONFIRM",
        ],
        image: "/assets/images/bespoke-3.jpg",
        imageAlt:
          "Soft-focus fitness room with mats and exercise equipment beside a window wall.",
        imageApproved: true,
      },
      {
        name: "Treatment room",
        description:
          "A calm treatment setting with a prepared table and soft lighting.",
        status: "As shown",
        items: [
          "Visual reference from project imagery",
          "Official listing and services TO CONFIRM",
        ],
        image: "/assets/images/amenity-wellbeing.jpg",
        imageAlt:
          "Treatment table arranged with stones, a flower, towels, and candles.",
        imageApproved: true,
      },
    ],
    /** Unused by the Rooted Living amenities UI — kept empty until approved. */
    featuredCards: [],
  },
  verticalEcosystem: {
    headingLines: ["AN ENTIRE ECOSYSTEM", "DRAWN AROUND YOU"],
    supportingCopy:
      "Life at Vanae begins on the 6th floor. Thanks to the 5 levels of stilt parking between the residences and the ground below, every home at Vanae opens onto a view, giving them a greater sense of vibrancy, ventilation, and vitality.",
    videoUrl: "/assets/videos/hero.mp4",
    bgImage: "/assets/images/sanctuary-building.jpg",
    btnText: "The Outdoor Lifestyle",
  },
  floorPlans: {
    headingLines: ["Plans drawn for", "how you live."],
    paragraphs: [
      "Illustrated unit layouts from local project drawings. The older floor-plan JPEG files were interior photographs and remain withheld.",
      "Each sheet is shown in full at its true aspect ratio — never cropped. Exact labels, dimensions, and public-display rights remain subject to confirmation.",
    ],
    btnText: "Request floor plans",
    approvalNote:
      "Unit labels, dimensions, configurations, and drawing rights are TO CONFIRM.",
    pendingLabel: "Architectural drawing pending",
    pendingDetail: "Awaiting approved plans",
    /**
     * PNG sheets are furnished sales-layout composites (2D plan + 3D cutaway).
     * Do not use floor-plan-1.jpg / floor-plan-2.jpg — audit: lobby/spa photos.
     */
    plans: [
      {
        src: "/assets/images/floor-plan-1.png",
        title: "Block A · 4400 Sft (east)",
        width: 363,
        height: 481,
        labelStatus: "TO CONFIRM",
        drawingApproved: true,
        alt: "Illustrated Block A apartment layout, 4400 square feet east, with a 2D floor plan and 3D cutaway.",
      },
      {
        src: "/assets/images/floor-plan-2.png",
        title: "Block C–F · 2555 Sft (west lower)",
        width: 361,
        height: 483,
        labelStatus: "TO CONFIRM",
        drawingApproved: true,
        alt: "Illustrated Block C, D, E and F apartment layout, 2555 square feet west lower, with a 2D floor plan and 3D cutaway.",
      },
    ],
  },
  specifications: {
    tag: "TECHNICAL SPECIFICATIONS",
    heading: "BUILT TO UNCOMPROMISING STANDARDS",
    subheading: "Complete structural, architectural, electrical, and finishing specifications crafted for enduring luxury.",
    categories: [
      {
        title: "1. Structure & Walls",
        items: [
          "Structure: R.C.C. Framed Structure / R.C.C. Shear Wall Framed Structure to withstand wind and seismic loads.",
          "Walls: R.C.C. Shear Wall.",
        ],
      },
      {
        title: "2. Wall Finishes & Painting",
        items: [
          "External: Textured finish with two coats of exterior emulsion paint of reputed make.",
          "Internal: Smooth putty finish with two coats of premium acrylic emulsion paint of reputed make over a coat of primer.",
        ],
      },
      {
        title: "3. Flooring Finishes",
        items: [
          "Drawing / Living / Dining / All Bedrooms / Pooja: Premium-quality large-format vitrified tile flooring and skirting as per design.",
          "Master Bedroom: Vitrified / laminated wooden flooring as per design.",
          "Kitchen: Premium-quality large-format matte-finish vitrified tile flooring.",
          "All Bathrooms: Premium-quality large-format matte-finish vitrified tile flooring.",
          "All Balconies: Vitrified tile in wooden finish / matte-finish vitrified tile flooring.",
          "Utility: Non-slip vitrified tiles.",
          "Entrance Lounge & Lift Lobby: Granite flooring with designer false ceiling.",
          "Common Areas (Corridor): Full-body / premium-quality vitrified tile flooring.",
          "Staircases: Tandoor / Kota stone.",
        ],
      },
      {
        title: "4. Tile Cladding / Dadoing",
        items: [
          "Bathrooms: Premium-quality vitrified tile dado up to 7-foot height of reputed make.",
          "Utility: Premium-quality vitrified tile dado up to 3-foot height of reputed make.",
        ],
      },
      {
        title: "5. Doors",
        items: [
          "Main Door: Factory-made teak-veneered door frame and shutter finished with good-quality melamine polish, with hardware of reputed make.",
          "Internal Doors: Factory-made finger-joint wood frame and laminated shutter with hardware of reputed make.",
          "Toilet Doors: Factory-made finger-joint wood frame and laminated shutter with hardware of reputed make.",
        ],
      },
      {
        title: "6. French Doors & Windows",
        items: [
          "French Doors: UPVC door frame of reputed profile sections, with toughened / HS glass-panelled shutters designed as per relevant IS code and designer hardware of reputed make, with provision for mosquito mesh.",
          "Windows: UPVC window of reputed profile sections with tinted toughened / HS glass, suitable finishes as per design, provision for mosquito mesh for all sliding windows, designed as per relevant IS code.",
        ],
      },
      {
        title: "7. Railings",
        items: [
          "Balcony / Sit-Out: Laminated glass / MS railing designed as per relevant IS codes.",
          "Staircases: SS / MS railing as per design intent.",
          "Ventilation Cut-Out: MS railing as per design intent.",
        ],
      },
      {
        title: "8. Kitchen",
        items: [
          "Provision for water purifier, exhaust fan, and chimney.",
          "Water inlet and outlet provisions for sink.",
          "Provision for piped gas connection from centralized gas bank.",
        ],
      },
      {
        title: "9. Utility / Wash Area",
        items: [
          "Provision for washing machine / dishwasher and wet area for vessel washing.",
          "Non-slip vitrified tile flooring with glazed ceramic tile dadoing up to 3-foot height.",
        ],
      },
      {
        title: "10. CP & Sanitary Fixtures",
        items: [
          "All CP fittings and sanitary fixtures are of reputed make.",
          "Concealed flush tanks and wall-hung EWC in all bathrooms.",
          "Hot and cold water diverter / mixer in all bathrooms.",
        ],
      },
      {
        title: "11. Electrical Fixtures & Installations",
        items: [
          "Provision for geysers in all bathrooms.",
          "Provision for exhaust fans in all bathrooms.",
          "Provision for copper piping for air-conditioning units for all flats.",
          "Provision for power outlets for air conditioners in all bedrooms, drawing rooms, and living rooms.",
          "Plug points for TV and audio systems in living room and master bedroom.",
          "Three-phase supply for each unit with individual meter boards.",
          "Miniature circuit breakers (MCB) for each distribution board of reputed make.",
          "Concealed copper wiring and modular switches of reputed make.",
        ],
      },
      {
        title: "12. Telecommunications, Cable TV & Internet",
        items: [
          "Telephone points in drawing / living rooms and master bedroom.",
          "Intercom facility to all units connecting to security.",
          "Provision for cable connection in master bedroom and living room.",
          "One internet connection provision for all bedrooms.",
        ],
      },
      {
        title: "13. Elevators / Lifts",
        items: [
          "High-speed passenger lifts for residents and dedicated service lifts for vendors of reputed make in each tower.",
          "Equipped with ARD (Automatic Rescue Device), panic buttons, and intercom connected to the security room.",
          "Entrance lobby cladding with granite / marble.",
        ],
      },
      {
        title: "14. WTP & STP",
        items: [
          "Exclusive water-softening plant (WTP) for treated domestic water supply.",
          "Sewage Treatment Plant (STP) of adequate capacity as per statutory norms.",
          "Treated sewage water reused for landscaping and flushing.",
        ],
      },
      {
        title: "15. Generator Backup",
        items: [
          "100% DG-set backup with acoustic enclosure and AMF (Auto Main Failure) for entire development including all units and common areas.",
        ],
      },
      {
        title: "16. Fire Safety & Fire Fighting",
        items: [
          "Fire hydrant and fire sprinkler system on all floors and in basements as per NBC norms.",
          "Fire alarm and public-address system on all floors and parking areas / basements as per NBC norms.",
          "Central fire control panel located at main security cabin.",
        ],
      },
      {
        title: "17. LPG / Piped Gas",
        items: [
          "Gas supplied from a centralized gas bank to individual flats through an authorized reticulated piped gas system.",
          "Centralized prepaid-meter billing system integrated into BMS.",
        ],
      },
      {
        title: "18. Water Supply & Rainwater Harvesting",
        items: [
          "Domestic water through an exclusive water-softening plant.",
          "Water meters for each unit for domestic and drinking water.",
          "Rainwater harvesting pits at regular intervals for groundwater recharge as per environmental norms.",
        ],
      },
    ],
  },
  location: {
    tag: "Location",
    headingLines: ["Kollur,", "Hyderabad."],
    copy: "Vanae Project is listed on Google Maps in Kollur, Hyderabad, near ORR Exit 2. Exact street address, landmarks, and travel details remain TO CONFIRM.",
    publicPlace: "Vanae Project · Kollur, Hyderabad · near ORR Exit 2",
    approvalNote:
      "Interactive map uses the client-supplied Vanae Project Google listing. Exact street address, landmarks, and distances remain TO CONFIRM.",
    siteAddress:
      "Exact site address TO CONFIRM (working note: Kollur / ORR Exit 2 area, Hyderabad).",
    corporateAddress: "Corporate office address TO CONFIRM.",
    /**
     * sky-terrace.jpg is an existing project site-plan graphic (not a photograph /
     * not an aerial). Shown only as a labelled site plan. location-aerial.jpg is
     * byte-identical to bespoke-2.jpg and must not be used as an aerial.
     */
    mapImage: "/assets/images/sky-terrace.jpg",
    mapImageAlt:
      "Illustrative project site plan — not an aerial photograph. Exact street address TO CONFIRM.",
    /** Not shown in Location; site-plan graphic removed from public Location section. */
    imageApproved: false,
    // Embed built from client place id + coords (share URL is not a valid iframe src).
    embedMapUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3806.5!2d78.2481326!3d17.4672276!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcbed62a8a370ab%3A0xc869eec4cda08cc3!2sVanae%20Project!5e0!3m2!1sen-IN!2sin!4v1730000000000!5m2!1sen-IN!2sin",
    openMapsUrl:
      "https://www.google.com/maps/place/Vanae+Project/@17.462062,78.24976,15.61z/data=!4m6!3m5!1s0x3bcbed62a8a370ab:0xc869eec4cda08cc3!8m2!3d17.4672276!4d78.2481326!16s%2Fg%2F11zxtn9ry2?hl=en-IN",
    mapApproved: true,
  },
  enquiry: {
    eyebrow: "Enquiry",
    heading: "Begin a private conversation.",
    supportingCopy:
      "Share a few details when you are ready. The form opens only when you choose — nothing appears uninvited.",
    ctaText: "Open enquiry form",
  },
  gallery: {
    tag: "Gallery",
    headingLines: ["Spaces, light,", "and landscape."],
    approvalNote:
      "Project imagery selected after visual review. Titles describe what each frame shows — not marketing claims. gallery-3 withheld (lettering names another project).",
    /**
     * Mosaic from inspected project assets only. Frames match orientation.
     * Withheld: gallery-3 (other-project lettering); floor-plan-*; mismatched amenity stock.
     */
    items: [
      {
        src: "/assets/images/gallery-1.jpg",
        title: "Elevator lobby",
        category: "Arrival",
        frame: "tall",
        imageApproved: true,
      },
      {
        src: "/assets/images/bespoke-2.jpg",
        title: "Tower with planted balconies",
        category: "Architecture",
        frame: "tall",
        imageApproved: true,
      },
      {
        src: "/assets/images/gallery-4.jpg",
        title: "Rooftop lounge",
        category: "Outdoor",
        frame: "wide",
        imageApproved: true,
      },
      {
        src: "/assets/images/gallery-5.jpg",
        title: "Evening terrace",
        category: "Outdoor",
        frame: "tall",
        imageApproved: true,
      },
      {
        src: "/assets/images/gallery-6.jpg",
        title: "Building above landscaped courts",
        category: "Architecture",
        frame: "wide",
        imageApproved: true,
      },
      {
        src: "/assets/images/gallery-7.jpg",
        title: "Indoor pool",
        category: "Wellness",
        frame: "wide",
        imageApproved: true,
      },
      {
        src: "/assets/images/gallery-8.jpg",
        title: "Dining room",
        category: "Living",
        frame: "wide",
        imageApproved: true,
      },
      {
        src: "/assets/images/gallery-9.jpg",
        title: "Indoor racquet court",
        category: "Recreation",
        frame: "tall",
        imageApproved: true,
      },
      {
        src: "/assets/images/gallery-10.jpg",
        title: "Treatment room",
        category: "Wellness",
        frame: "wide",
        imageApproved: true,
      },
      {
        src: "/assets/images/gallery-11.jpg",
        title: "Landscaped courtyard",
        category: "Landscape",
        frame: "wide",
        imageApproved: true,
      },
    ],
  },
  contact: {
    tag: "ENQUIRIES",
    titleLines: ["BRINGING IN THE", "EASE YOU DESIRE"],
    phonePlaceholderNote: "Official contact phone number pending confirmation from management.",
    phone: "",
    displayPhone: "Contact details upon request",
    isPhonePlaceholder: true,
    /** Empty until client verifies a public sales email — do not invent an address. */
    email: "",
    siteAddress:
      "Exact site address TO CONFIRM · Kollur, Hyderabad, near ORR Exit 2.",
    corporateAddress: "Corporate office address TO CONFIRM.",
    reraNumberNote: "RERA / regulatory registration details TO CONFIRM.",
    /** Only verified profile URLs should be listed; empty until client confirms. */
    socials: [],
  },
  whatsapp: {
    phoneNumber: "",
    defaultMessage: "Hello, I would like to inquire about VANAE luxury residences.",
    url: "",
  },
  footer: {
    copyright: "© 2026 VANAE. All Rights Reserved.",
    designedBy: "Vanae Architectural Studio",
    designedByUrl: "#",
    siteAddress:
      "Exact site address TO CONFIRM · Kollur, Hyderabad, near ORR Exit 2.",
    corporateAddress: "Corporate office address TO CONFIRM.",
    reraNumber: "RERA / regulatory registration details TO CONFIRM.",
  },
};
