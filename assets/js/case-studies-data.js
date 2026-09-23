/**
 * LYFAds Bengaluru - Case Studies & Portfolio Dataset
 * Detailed case studies with challenge, solution, and audited results.
 */

const CASE_STUDIES_DATA = [
  {
    id: 'bengaluru-saas-unicorn',
    title: 'ScaleCloud: 340% Pipeline Velocity & -42% Demo CAC',
    client: 'ScaleCloud AI (Bengaluru Tech Corridor)',
    category: 'saas',
    tag: 'B2B SaaS Growth',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
    summary: 'How an enterprise observability platform scaled qualified B2B demos across India and US markets.',
    metrics: [
      { label: 'Demo Bookings', value: '+340%' },
      { label: 'CAC Reduction', value: '-42%' },
      { label: 'Pipeline Generated', value: '₹14.2 Cr' }
    ],
    challenge: 'ScaleCloud had developed a cutting-edge cloud observability engine, but were burning massive ad dollars on generic LinkedIn and Google Search ads with an unsustainable CAC of ₹4,200 per demo lead. Sales reps spent 60% of their time on unqualified leads.',
    solution: 'LYFAds Bengaluru revamped their entire GTM engine: produced 4 high-octane 3D animated explainer films dissecting server downtime horrors, launched hyper-targeted Account-Based Marketing (ABM) campaigns targeting CTOs and VP Engineers, and deployed an autonomous AI SDR bot that pre-qualified prospects in real-time.',
    results: 'Within 90 days, qualified demo volume skyrocketed by 340%. The AI qualification filter reduced unqualified sales conversations to under 4%, slashing blended customer acquisition cost (CAC) by 42% and generating ₹14.2 Crore in validated pipeline.',
    testimonial: '"LYFAds completely transformed our outbound and paid engine. Their blend of cinema-grade 3D visual storytelling and razor-sharp B2B performance targeting is unmatched in Bengaluru."',
    author: 'Kunal Singhania, Chief Growth Officer'
  },
  {
    id: 'd2c-fashion-viral-reels',
    title: 'Aura Athletics: ₹2.4Cr GMV in 30 Days via Viral Creative Reels',
    client: 'Aura Athletics (Indiranagar, Bengaluru)',
    category: 'd2c',
    tag: 'D2C E-Commerce & Video',
    image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80',
    summary: 'Cinematic ad films and performance creator reels engineered for peak festive season ROAS.',
    metrics: [
      { label: 'Festive GMV', value: '₹2.4 Cr' },
      { label: 'Meta Blended ROAS', value: '6.8x' },
      { label: 'Organic Video Views', value: '8.4M+' }
    ],
    challenge: 'Aura Athletics was competing in a hyper-crowded activewear landscape dominated by legacy brands with 100x their marketing budget. Static image ads on Meta were plateauing at a mediocre 1.8x ROAS with severe creative fatigue.',
    solution: 'LYFAds Bengaluru took over complete creative direction and media buying: filmed 12 high-tempo, cinematic action reels in our Bengaluru studio featuring real athletes, combined with dynamic UGC product hook testing. We coupled this with automated WhatsApp cart recovery funnels.',
    results: 'The flagship launch reel surpassed 8.4 Million organic views on Instagram. Blended Meta ROAS jumped to 6.8x, generating over ₹2.4 Crore GMV in the first 30 days while dropping cart abandonment by 31%.',
    testimonial: '"The visual aesthetics LYFAds creates look like an international Nike campaign, but what truly blew us away was their obsession with unit economics and conversion rates."',
    author: 'Ananya Sharma, Founder & Creative Director'
  },
  {
    id: 'fintech-b2b-pipeline',
    title: 'FinEdge: Automated HNI Wealth Inbound Funnel',
    client: 'FinEdge Capital (MG Road, Bengaluru)',
    category: 'fintech',
    tag: 'FinTech & Paid Ads',
    image: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=800&q=80',
    summary: 'High-ticket alternative investment acquisition targeting tech founders and executives.',
    metrics: [
      { label: 'HNI Inbound Leads', value: '620+' },
      { label: 'AUM Onboarded', value: '₹48 Cr' },
      { label: 'Cost Per Qualified Lead', value: '₹380' }
    ],
    challenge: 'FinEdge needed to attract High-Net-Worth Individuals (HNIs) and venture-backed startup founders for their exclusive private equity fund. Regulatory constraints prevented sensationalist advertising.',
    solution: 'LYFAds crafted an authoritative editorial series, proprietary market benchmark whitepapers, and hyper-targeted Google Search & LinkedIn conversational ad funnels. We implemented strict KYC-level lead qualification filtering.',
    results: 'Acquired 620+ ultra-qualified HNI leads across Bengaluru, Mumbai, and Delhi-NCR within 4 months, directly translating into ₹48 Crore in new Assets Under Management (AUM) at an unprecedented ₹380 per qualified investor lead.',
    testimonial: '"In financial services, credibility is everything. LYFAds positioned our fund as the premier institutional choice for tech executives."',
    author: 'Raghavan Iyer, Managing Partner'
  },
  {
    id: 'real-estate-luxury-villas',
    title: 'Palm Greens: 100% Sold-Out Ultra-Luxury Enclave',
    client: 'Palm Greens Realty (Whitefield, Bengaluru)',
    category: 'realestate',
    tag: 'Real Estate & 3D VFX',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    summary: '3D CGI virtual tours and hyper-local geofenced ads that closed ₹85Cr in residential sales.',
    metrics: [
      { label: 'Inventory Sold', value: '100%' },
      { label: 'Total Sales Closed', value: '₹85 Cr' },
      { label: 'Site Visits Booked', value: '280+' }
    ],
    challenge: 'Palm Greens was launching 42 ultra-luxury villas in Whitefield with price tags starting at ₹4.5 Crore. Physical sample villas were still under construction, creating customer hesitation.',
    solution: 'Our 3D CGI and VFX team constructed photorealistic 360-degree interactive architectural walkthroughs. We paired this with geofenced programmatic campaigns targeting high-income professionals in IT corridors (Manyata, Ecospace, Bagmane Tech Park).',
    results: 'Generated 280+ verified high-intent site visits. All 42 luxury villas were 100% sold out in under 120 days, resulting in ₹85 Crore in aggregate property sales.',
    testimonial: '"The 3D architectural renders were so photorealistic that buyers made booking deposits before we even finished our site foundation."',
    author: 'Deepak Chawla, VP Marketing'
  },
  {
    id: 'saas-developer-tools',
    title: 'CodePulse: Zero to 50,000 GitHub Stars & Dev Installs',
    client: 'CodePulse Inc. (HSR Layout, Bengaluru)',
    category: 'saas',
    tag: 'DevTools & Organic Growth',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
    summary: 'Viral developer marketing, meme engineering, and technical SEO that built a global open-source community.',
    metrics: [
      { label: 'Developer Installs', value: '50,000+' },
      { label: 'GitHub Stars', value: '12.4k' },
      { label: 'Paid Conversion', value: '11.8%' }
    ],
    challenge: 'Developers notoriously hate marketing. Traditional corporate ads were falling completely flat on Reddit, Hacker News, and X for this open-source telemetry library.',
    solution: 'We engineered developer-authentic memes, interactive code playground landing pages, deep-dive architectural teardowns, and an influencer seeding campaign with senior tech leads on YouTube and X.',
    results: 'Propelled CodePulse to #1 trending on GitHub for 5 consecutive days. Organic installs surpassed 50,000 across 80+ countries, with a 11.8% conversion rate into their paid enterprise cloud tier.',
    testimonial: '"LYFAds gets developer culture. They didn\'t market to our users—they engaged them with technical authenticity."',
    author: 'Tarun Mathur, Co-Founder & CTO'
  },
  {
    id: 'quick-commerce-food-delivery',
    title: 'BiteDrop: Scaling 15-Minute Delivery in Bengaluru',
    client: 'BiteDrop App (Koramangala, Bengaluru)',
    category: 'd2c',
    tag: 'Mobile App Marketing',
    image: 'https://images.unsplash.com/photo-1526367790999-0150786686a2?auto=format&fit=crop&w=800&q=80',
    summary: 'Hyper-local pincode targeting and dynamic video ads driving 150k app downloads.',
    metrics: [
      { label: 'App Installs', value: '150,000+' },
      { label: 'Blended CPI', value: '₹18.50' },
      { label: 'Day-30 Retention', value: '44.2%' }
    ],
    challenge: 'BiteDrop was launching against deep-pocketed conglomerates in the hyper-competitive quick-commerce corridor of South Bengaluru.',
    solution: 'We executed a hyper-local pincode-level blitzkrieg: 15-second dynamic video ads showing real delivery scooters navigating famous Bengaluru traffic landmarks, paired with Google App Campaigns and influencer snack unboxings.',
    results: 'Delivered over 150,000 verified app downloads in 60 days at an ultra-low blended Cost Per Install (CPI) of ₹18.50, outperforming industry benchmarks by 2.3x.',
    testimonial: '"Their ability to turn local Bengaluru culture and humor into high-converting ad films gave us instant market share."',
    author: 'Siddharth Rao, Head of Brand'
  }
];

// Helper to filter case studies
function getCaseStudiesByCategory(category) {
  if (!category || category === 'all') return CASE_STUDIES_DATA;
  return CASE_STUDIES_DATA.filter(c => c.category === category);
}

// Expose globally
window.CASE_STUDIES_DATA = CASE_STUDIES_DATA;
window.getCaseStudiesByCategory = getCaseStudiesByCategory;
