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
    /** Spec strip — brochure-sourced or pending confirmation. */
    projectDetails: {
      value: string;
      label: string;
      status: "TO CONFIRM" | "Brochure";
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
  /**
   * Unified Lifestyle visitor section — selectable amenity spaces.
   * Detailed outdoor/clubhouse directories remain below for chatbot / future use.
   */
  lifestyle: {
    eyebrow: string;
    heading: string;
    /** Two-line break for the Lifestyle heading (matches design reference). */
    headingLines: string[];
    intro: string;
    /** Small uppercase disclaimer under the intro. */
    note: string;
    ctaText: string;
    /** Selectable spaces shown in the Lifestyle three-column layout. */
    highlights: {
      title: string;
      description: string;
      /** Status chip under the title — e.g. "As shown". */
      statusLabel?: string;
      /** Detail bullets shown in the right column. */
      bullets?: string[];
      /** Optional short factual supporting line (legacy / chatbot). */
      details?: string;
      image: string;
      imageAlt: string;
    }[];
  };
  /** Outdoor / landscape amenity directory (brochure names only). */
  outdoorAmenities: {
    headingLines: string[];
    supportingCopy: string;
    approvalNote: string;
    bannerBtnText: string;
    categories: {
      name: string;
      items: string[];
      /** Optional category visual — illustrative unless clearly facility-specific. */
      image?: string;
      imageAlt?: string;
      imageCaption?: string;
      imageApproved?: boolean;
    }[];
  };
  /** Indoor clubhouse directory — distinct from outdoor swimming pool. */
  clubhouse: {
    heading: string;
    sizeLabel: string;
    supportingCopy: string;
    approvalNote: string;
    bannerBtnText: string;
    categories: {
      name: string;
      items: string[];
      image?: string;
      imageAlt?: string;
      imageCaption?: string;
      imageApproved?: boolean;
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
    masterPlan: {
      src: string;
      title: string;
      /** Intrinsic pixel size — preserve aspect; never crop. */
      width: number;
      height: number;
      alt: string;
    };
    plans: {
      src: string;
      title: string;
      /** Area · block · orientation — no invented BHK labels. */
      caption: string;
      /** Intrinsic pixel size — used to preserve aspect without cropping. */
      width: number;
      height: number;
      drawingApproved: boolean;
      /** Descriptive alt based on what the drawing actually shows. */
      alt: string;
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
    /** Short place label for nav / drawers. */
    publicPlace: string;
    approvalNote: string;
    siteAddress: string;
    corporateAddress: string;
    /** Approved illustrated VANAE route map used in the Location section. */
    mapImage: string;
    mapImageAlt: string;
    imageApproved: boolean;
    /** Exact client-supplied destination for Maps actions. */
    openMapsUrl: string;
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
    brandDescription: string;
    mainOfficeLabel: string;
    siteAddress: string;
    corporateAddress: string;
    reraNumber: string;
    /** Brochure HMDA application number. */
    hmdaNumber: string;
    /** Conceptual imagery / brochure disclaimer. */
    disclaimer: string;
    /** Site-wide film/stills disclosure. */
    impressionNote: string;
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
    tagline: "The Art of Rooted Living",
    logoLight: "/assets/icons/vanae-logo.jpg",
    logoDark: "/assets/icons/vanae-logo.jpg",
    favicon: "/assets/icons/vanae-logo.jpg",
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
    /**
     * Looping hero film (muted, playsInline). Poster remains the approved dusk still.
     * Promotional film opens via VideoModal (`verticalEcosystem.videoUrl` → film.mp4).
     */
    videoSrc: "/assets/videos/hero.mp4",
    /** Verified path — dusk campus render in public/assets/renders/. */
    posterSrc: "/assets/renders/address-twin-towers-dusk-p9.jpg",
    scrollText: "Discover Vanae",
    badgeText: "VANAE",
    majorStatement: "Where architecture and landscape form one story.",
    supportingCopy: "3 & 4 BHK residences at Kollur, by ORR Exit 2, Hyderabad.",
    ctaText: "Enquire",
    impressionNote: "Artist’s impression. Imagery is illustrative.",
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
      "Vanae brings together 3 & 4 BHK residences across six towers, rising 36 floors with 11 ft floor-to-ceiling height — a vertical community shaped for over 1,200 families.",
      "Life begins on the 6th floor, above five levels of stilt parking. An approximately 1,00,000 sft clubhouse and over 50 lifestyle amenities support every rhythm of living at Kollur, by ORR Exit 2.",
    ],
    portraitImage: "/assets/renders/address-twin-towers-dusk-p9.jpg",
    portraitAlt:
      "Architectural render of VANAE towers at dusk with landscaped grounds and clubhouse podium.",
    portraitApproved: true,
    projectDetails: [
      { value: "3 & 4 BHK", label: "Residences", status: "Brochure" },
      { value: "6", label: "Towers", status: "Brochure" },
      { value: "36", label: "Floors", status: "Brochure" },
      { value: "11 ft", label: "Ceilings", status: "Brochure" },
      { value: "~1,00,000 sft", label: "Clubhouse", status: "Brochure" },
      { value: "50+", label: "Amenities", status: "Brochure" },
    ],
    stats: [
      { value: "3 & 4", label: "BHK Residences" },
      { value: "36", label: "Floors High" },
      { value: "6", label: "Towers Spread Across" },
      { value: "11 FT", label: "High Ceilings" },
    ],
    badge: "Kollur, by ORR Exit 2 — Hyderabad",
    brochureBtnText: "",
  },
  rootedStory: {
    eyebrow: "Architecture & nature",
    sectionHeading: "Three chapters of rooted living",
    panels: [
      {
        title: "The land",
        body: "Before the building is the ground it meets. At Kollur, by ORR Exit 2, the story begins with landscape held close — not as ornament at the edge of a plan, but as the quiet companion to how a place is imagined.",
        image: "/assets/amenity-photos/lawn-garden.jpg",
        imageAlt:
          "Landscaped lawn corridor bordered by flowering plants and trees.",
        imageApproved: true,
      },
      {
        title: "The architecture",
        body: "Architecture here is meant to rise with the land rather than against it — a calm vertical reading of shade, silhouette and sky, shaped as a vertical ecosystem.",
        image: "/assets/renders/towers-day-p10.jpg",
        imageAlt:
          "Architectural render of VANAE towers and entrance plaza by day.",
        imageApproved: true,
      },
      {
        title: "The living",
        body: "Daily life is framed by light, air and the nearness of landscape. Interiors favour composure over spectacle, so rooms feel open and unhurried — rising into the skies without leaving nature behind.",
        image: "/assets/renders/atrium-lounge-p25.jpg",
        imageAlt:
          "Architectural render of a biophilic atrium lounge with layered greenery.",
        imageApproved: true,
      },
    ],
    videoCtaText: "Watch the video",
  },
  architecture: {
    headingLines: ["WHERE THE FOREST", "ASCENDS."],
    supportingCopy:
      "Here, the landscape rises with you, creating a vertical tapestry of nature that soothes your soul and transforms your abode into a living ecosystem at every level.",
    subheadingLines: ["THE ART OF", "ROOTED LIVING"],
    subheadingCopy:
      "Somewhere along the way, up into the skies, our homes lose their connection to mother earth — and with it, a vital essence of better living. What if we could rise without leaving it behind?",
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
        "This is a place where the expansive homes are just the beginning of the experience of living here.",
      benefits: [
        "Intended cooler towers and surroundings through landscape and shade",
        "Architecture and greenery designed to help reduce heat gain",
        "A closer visual and psychological connection with nature",
        "Thoughtful environmental consideration across the campus",
        "More shaded outdoor spaces for everyday ease",
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
  lifestyle: {
    eyebrow: "Lifestyle",
    heading: "Spaces for everyday ease.",
    headingLines: ["Spaces for", "everyday ease."],
    intro:
      "A curated selection of spaces for movement, gathering, wellness and everyday living — part of a community shaped around over 50 lifestyle amenities.",
    note: "",
    ctaText: "Enquire About Amenities",
    highlights: [
      {
        title: "Indoor lounge",
        description:
          "A calm atrium lounge for meeting, reading and everyday connection — layered greenery and generous light.",
        bullets: [
          "Within the approximately 1,00,000 sft clubhouse",
          "Among Work & Convenience and shared clubhouse spaces",
        ],
        details: "Within the approximately 1,00,000 sft clubhouse.",
        image: "/assets/renders/atrium-lounge-p25.jpg",
        imageAlt:
          "Architectural render of a clubhouse atrium lounge with seating.",
      },
      {
        title: "Event room",
        description:
          "A large room set with round tables facing a projection screen.",
        bullets: [
          "Banquet hall among Family & Community clubhouse amenities",
          "Designed for gatherings and celebrations",
        ],
        details: "Banquet hall with stage and seating.",
        image: "/assets/amenity-photos/banquet-hall.jpg",
        imageAlt:
          "Architectural render of a formal banquet hall with stage and seating.",
      },
      {
        title: "Fitness room",
        description:
          "A contemporary fitness studio for everyday movement and active living.",
        bullets: [
          "Super Gym and Aerobics & Fitness Studio",
          "Part of clubhouse Sports & Active Living amenities",
        ],
        details: "Super Gym and aerobics & fitness studio.",
        image: "/assets/amenity-photos/gym.jpg",
        imageAlt:
          "Architectural render of a contemporary gym and fitness studio.",
      },
      {
        title: "Treatment room",
        description:
          "A quiet spa treatment room for restoration between the rhythms of the day.",
        bullets: [
          "Spa, Sauna and Physiotherapy Clinic",
          "Part of clubhouse Wellness & Mindfulness amenities",
        ],
        details: "Spa, sauna and physiotherapy clinic.",
        image: "/assets/amenity-photos/spa.jpg",
        imageAlt:
          "Lifestyle photograph of a spa treatment room with candles and linens.",
      },
      {
        title: "Landscaped garden",
        description:
          "Lawns, gardens and open-air rooms drawn through the grounds — places to wander, gather and pause.",
        bullets: [
          "Among outdoor Landscaping & Nature amenities",
          "Including lawns, gardens and greenscapes across the campus",
        ],
        details: "Outdoor landscape across the campus grounds.",
        image: "/assets/amenity-photos/lawn-garden.jpg",
        imageAlt:
          "Landscaped lawn bordered by flowering beds and trees at VANAE.",
      },
    ],
  },
  outdoorAmenities: {
    headingLines: ["Outdoor living,", "drawn across the grounds."],
    supportingCopy:
      "Named outdoor spaces across VANAE — arrival, landscape, wellness, community, and open-air sport.",
    approvalNote:
      "",
    bannerBtnText: "Enquire about amenities",
    categories: [
      {
        name: "First Impressions",
        items: [
          "Entry",
          "Exit",
          "Security Cabin",
          "Naming With Plantation",
          "Entrance Plaza",
          "Pathway",
          "Greenscapes",
        ],
        image: "/assets/renders/towers-day-p10.jpg",
        imageAlt:
          "Architectural render of the VANAE entrance plaza and towers by day.",
        imageCaption: "Illustrative architectural render",
        imageApproved: true,
      },
      {
        name: "Landscaping & Nature",
        items: [
          "Butterfly Garden",
          "Herbal Garden",
          "Thematic Plantation",
          "Open Amphitheatre/Stage",
          "Event Lawn",
          "Freeplay Lawn",
          "Leisure Lawn",
          "Pet Park",
        ],
        image: "/assets/amenity-photos/lawn-garden.jpg",
        imageAlt:
          "Illustrative landscaped lawn bordered by flowering beds and trees.",
        imageCaption: "Illustrative landscape imagery",
        imageApproved: true,
      },
      {
        name: "Wellness & Mindfulness",
        items: ["Yoga Deck", "Meditation Lawn"],
        image: "/assets/amenity-photos/yoga.jpg",
        imageAlt:
          "Lifestyle photograph of outdoor yoga and meditation amid greenery.",
        imageCaption: "Illustrative lifestyle photography",
        imageApproved: true,
      },
      {
        name: "Family & Community",
        items: ["Kids’ Play Area", "Senior Citizens’ Corner"],
        image: "/assets/amenity-photos/swing-play.jpg",
        imageAlt:
          "Lifestyle photograph of a child leaping from a swing above a lawn.",
        imageCaption: "Illustrative lifestyle photography",
        imageApproved: true,
      },
      {
        name: "Sports & Active Living",
        items: [
          "Tennis Court",
          "Half Basketball Court",
          "Cricket Nets",
          "Swimming Pool",
        ],
        image: "/assets/amenity-photos/basketball-court.jpg",
        imageAlt:
          "Architectural render of an outdoor basketball court among trees.",
        imageCaption: "Illustrative architectural render",
        imageApproved: true,
      },
    ],
  },
  clubhouse: {
    heading: "The Clubhouse",
    sizeLabel: "1,00,000 SFT",
    supportingCopy:
      "Indoor clubhouse spaces across VANAE — distinct from outdoor amenities, including the outdoor swimming pool.",
    approvalNote:
      "",
    bannerBtnText: "Enquire about the clubhouse",
    categories: [
      {
        name: "Work & Convenience",
        items: [
          "Supermarket",
          "Co-working Spaces",
          "Reading Lounge",
          "Salon",
        ],
        imageApproved: false,
      },
      {
        name: "Wellness & Mindfulness",
        items: ["Spa", "Sauna", "Physiotherapy Clinic"],
        image: "/assets/amenity-photos/spa.jpg",
        imageAlt:
          "Lifestyle photograph of a spa treatment room with candles and linens.",
        imageCaption: "Illustrative lifestyle photography",
        imageApproved: true,
      },
      {
        name: "Sports & Active Living",
        items: [
          "Badminton Courts",
          "Squash Court",
          "Super Gym",
          "Aerobics & Fitness Studio",
          "Indoor Games Lounge",
          "Table Tennis",
          "Pool",
        ],
        image: "/assets/amenity-photos/gym.jpg",
        imageAlt:
          "Architectural render of a contemporary gym and fitness studio.",
        imageCaption: "Illustrative architectural render",
        imageApproved: true,
      },
      {
        name: "Family & Community",
        items: [
          "Banquet Hall",
          "Mini Theatre",
          "Cafe",
          "Guest Rooms (10)",
          "Creche",
        ],
        image: "/assets/amenity-photos/banquet-hall.jpg",
        imageAlt:
          "Architectural render of a formal banquet hall with stage and seating.",
        imageCaption: "Illustrative architectural render",
        imageApproved: true,
      },
    ],
  },
  verticalEcosystem: {
    headingLines: ["AN ENTIRE ECOSYSTEM", "DRAWN AROUND YOU"],
    supportingCopy:
      "Life at Vanae begins on the 6th floor. Thanks to the 5 levels of stilt parking between the residences and the ground below, every home at Vanae opens onto a view, giving them a greater sense of vibrancy, ventilation, and vitality.",
    /** “Watch the film” — modal source (lazy-loaded when opened). */
    videoUrl: "/assets/videos/film.mp4",
    bgImage: "/assets/images/sanctuary-building.jpg",
    btnText: "The Outdoor Lifestyle",
  },
  floorPlans: {
    headingLines: ["Plans drawn for", "how you live."],
    paragraphs: [
      "Site master plan and unit layouts, shown at their true aspect ratio.",
      "Select any drawing to view it full size.",
    ],
    btnText: "Request floor plans",
    approvalNote:
      "",
    pendingLabel: "Architectural drawing pending",
    pendingDetail: "Awaiting approved plans",
    masterPlan: {
      src: "/assets/floor-plans/main-floor-plan.png",
      title: "Master plan",
      width: 886,
      height: 776,
      alt: "VANAE master plan showing Blocks A–F, clubhouse, landscaping, and site roads.",
    },
    /**
     * Brochure unit sheets from public/assets/floor-plans/ (spaces URL-encoded).
     * Legacy images/floor-plan-*.png and missing plan-*.jpg paths are not used.
     */
    plans: [
      {
        src: "/assets/floor-plans/Block%20D%2C%20E%20%26%20F%201765%20Sft%20(east).png",
        title: "1,765 SFT · Blocks D–F · East",
        caption: "1,765 SFT · Blocks D, E & F · East",
        width: 547,
        height: 502,
        drawingApproved: true,
        alt: "Unit floor plan drawing for 1,765 square feet, Blocks D, E and F, east orientation.",
      },
      {
        src: "/assets/floor-plans/Block%20D%2C%20E%20%26%20F%201765%20Sft%20(west).png",
        title: "1,765 SFT · Blocks D–F · West",
        caption: "1,765 SFT · Blocks D, E & F · West",
        width: 542,
        height: 497,
        drawingApproved: true,
        alt: "Unit floor plan drawing for 1,765 square feet, Blocks D, E and F, west orientation.",
      },
      {
        src: "/assets/floor-plans/Block%20D%20%26%20E%202360%20Sft%20(east).png",
        title: "2,360 SFT · Blocks D & E · East",
        caption: "2,360 SFT · Blocks D & E · East",
        width: 538,
        height: 538,
        drawingApproved: true,
        alt: "Unit floor plan drawing for 2,360 square feet, Blocks D and E, east orientation.",
      },
      {
        src: "/assets/floor-plans/Block%20D%20%26%20E%202360%20Sft%20(west).png",
        title: "2,360 SFT · Blocks D & E · West",
        caption: "2,360 SFT · Blocks D & E · West",
        width: 531,
        height: 551,
        drawingApproved: true,
        alt: "Unit floor plan drawing for 2,360 square feet, Blocks D and E, west orientation.",
      },
      {
        src: "/assets/floor-plans/Block%20B%2CC%2CD%2CE%20%26%20F%202555%20Sft%20(east).png",
        title: "2,555 SFT · Blocks B–F · East",
        caption: "2,555 SFT · Blocks B, C, D, E & F · East",
        width: 526,
        height: 552,
        drawingApproved: true,
        alt: "Unit floor plan drawing for 2,555 square feet, Blocks B, C, D, E and F, east orientation.",
      },
      {
        src: "/assets/floor-plans/Block%20B%2CC%2CD%2CE%20%26%20F%202555%20Sft%20(west).png",
        title: "2,555 SFT · Blocks B–F · West",
        caption: "2,555 SFT · Blocks B, C, D, E & F · West",
        width: 516,
        height: 566,
        drawingApproved: true,
        alt: "Unit floor plan drawing for 2,555 square feet, Blocks B, C, D, E and F, west orientation.",
      },
      {
        src: "/assets/floor-plans/Block%20A%204485%20Sft%20(east).png",
        title: "4,485 SFT · Block A · East",
        caption: "4,485 SFT · Block A · East",
        width: 573,
        height: 545,
        drawingApproved: true,
        alt: "Unit floor plan drawing for 4,485 square feet, Block A, east orientation.",
      },
      {
        src: "/assets/floor-plans/Block%20A%204485%20Sft%20(west).png",
        title: "4,485 SFT · Block A · West",
        caption: "4,485 SFT · Block A · West",
        width: 587,
        height: 577,
        drawingApproved: true,
        alt: "Unit floor plan drawing for 4,485 square feet, Block A, west orientation.",
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
    copy:
      "",
    publicPlace: "",
    approvalNote:
      "",
    siteAddress:
      "VANAE, Kollur Exit 2, Nehru Outer Ring Road, Nagulapalli, Edulnagulapally, Hyderabad, Telangana 502300, India.",
    corporateAddress:
      "7D, 7th floor, Weave, My Scape Road, Financial District, Hyderabad, Telangana 500089, India.",
    /**
     * Supplied illustrated location map showing VANAE and the route at Kollur Exit 2.
     */
    mapImage: "/assets/brand-art/vanae-location-map.jpg",
    mapImageAlt:
      "Illustrated map showing VANAE at Kollur Exit 2 and nearby routes.",
    imageApproved: true,
    openMapsUrl:
      "https://maps.app.goo.gl/XbCLPuLVijcJeGreA?g_st=ic",
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
    approvalNote: "",
    /**
     * Sequence from public/assets/renders/ and amenity-photos/ only.
     * Excludes legacy gallery-*, brand-art, floor plans, logos, and gallery-3 (Bupara branding).
     */
    items: [
      {
        src: "/assets/renders/towers-day-p10.jpg",
        title: "Towers and entrance plaza by day",
        category: "Architecture",
        frame: "square",
        imageApproved: true,
      },
      {
        src: "/assets/renders/address-twin-towers-dusk-p9.jpg",
        title: "Campus towers at dusk",
        category: "Architecture",
        frame: "wide",
        imageApproved: true,
      },
      {
        src: "/assets/renders/skyline-tower-day-p6.jpg",
        title: "Towers against the daytime skyline",
        category: "Architecture",
        frame: "wide",
        imageApproved: true,
      },
      {
        src: "/assets/renders/balcony-tower-night-p7.jpg",
        title: "Façade and entrance at dusk",
        category: "Architecture",
        frame: "tall",
        imageApproved: true,
      },
      {
        src: "/assets/renders/atrium-lounge-p25.jpg",
        title: "Biophilic atrium lounge",
        category: "Clubhouse",
        frame: "wide",
        imageApproved: true,
      },
      {
        src: "/assets/amenity-photos/banquet-hall.jpg",
        title: "Banquet hall",
        category: "Clubhouse",
        frame: "wide",
        imageApproved: true,
      },
      {
        src: "/assets/amenity-photos/gym.jpg",
        title: "Fitness studio",
        category: "Clubhouse",
        frame: "wide",
        imageApproved: true,
      },
      {
        src: "/assets/amenity-photos/mini-theatre.jpg",
        title: "Mini theatre",
        category: "Clubhouse",
        frame: "wide",
        imageApproved: true,
      },
      {
        src: "/assets/amenity-photos/spa.jpg",
        title: "Spa treatment room",
        category: "Clubhouse",
        frame: "wide",
        imageApproved: true,
      },
      {
        src: "/assets/amenity-photos/lawn-garden.jpg",
        title: "Landscaped lawn corridor",
        category: "Outdoor",
        frame: "wide",
        imageApproved: true,
      },
      {
        src: "/assets/amenity-photos/basketball-court.jpg",
        title: "Outdoor basketball court",
        category: "Outdoor",
        frame: "wide",
        imageApproved: true,
      },
      {
        src: "/assets/amenity-photos/yoga.jpg",
        title: "Outdoor yoga",
        category: "Lifestyle",
        frame: "wide",
        imageApproved: true,
      },
      {
        src: "/assets/amenity-photos/swing-play.jpg",
        title: "Play lawn and swing",
        category: "Lifestyle",
        frame: "wide",
        imageApproved: true,
      },
      {
        src: "/assets/amenity-photos/butterfly-garden.jpg",
        title: "Butterfly and garden flora",
        category: "Lifestyle",
        frame: "wide",
        imageApproved: true,
      },
      {
        src: "/assets/amenity-photos/swim-float.jpg",
        title: "Poolside calm",
        category: "Lifestyle",
        frame: "wide",
        imageApproved: true,
      },
    ],
  },
  contact: {
    tag: "ENQUIRIES",
    titleLines: ["BRINGING IN THE", "EASE YOU DESIRE"],
    phonePlaceholderNote: "Phone number available on enquiry.",
    phone: "",
    displayPhone: "Available on enquiry",
    isPhonePlaceholder: true,
    /** Empty until client verifies a public sales email — do not invent an address. */
    email: "",
    siteAddress:
      "VANAE, Kollur Exit 2, Nehru Outer Ring Road, Nagulapalli, Edulnagulapally, Hyderabad, Telangana 502300, India.",
    corporateAddress:
      "7D, 7th floor, Weave, My Scape Road, Financial District, Hyderabad, Telangana 500089, India.",
    reraNumberNote:
      "RERA No.: P01100011341 · HMDA Application No.: 005898/HMDA/01761/SWBP/SKP2/2025",
    /** Only verified profile URLs should be listed; empty until client confirms. */
    socials: [],
  },
  whatsapp: {
    phoneNumber: "919908215553",
    defaultMessage: "Hello, I would like to inquire about VANAE luxury residences.",
    url: "https://wa.me/919908215553",
  },
  footer: {
    copyright: "© 2026 VANAE. All Rights Reserved.",
    designedBy: "Vanae Architectural Studio",
    designedByUrl: "#",
    brandDescription:
      "The Art of Rooted Living — 3 & 4 BHK residences at Kollur Exit 2, Hyderabad, where architecture and landscape form one story.",
    mainOfficeLabel: "Main office",
    siteAddress:
      "VANAE, Kollur Exit 2, Nehru Outer Ring Road, Nagulapalli, Edulnagulapally, Hyderabad, Telangana 502300, India.",
    corporateAddress:
      "7D, 7th floor, Weave, My Scape Road, Financial District, Hyderabad, Telangana 500089, India.",
    reraNumber: "P01100011341",
    hmdaNumber: "005898/HMDA/01761/SWBP/SKP2/2025",
    /** Cleared from public footer — do not reintroduce unverified legal-offer / impression copy here. */
    disclaimer: "",
    impressionNote: "",
  },
};
