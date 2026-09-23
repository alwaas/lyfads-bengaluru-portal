/**
 * LYFAds Bengaluru - 20 Comprehensive Digital Marketing Services Dataset
 * Official agency catalog matching https://www.lyfads.com/ standard
 */

const SERVICES_DATA = [
  {
    id: 'performance-marketing',
    title: 'Performance Marketing & Paid Ads',
    category: 'paid-growth',
    icon: 'fa-solid fa-chart-line',
    shortDesc: 'High-ROI multi-channel campaigns on Meta, Google, LinkedIn & TikTok engineered for lowest CAC.',
    fullDesc: 'We manage full-funnel media buying combining high-CTR creative angles with algorithmic bidding. Daily budget optimization, creative fatigue monitoring, and precision retargeting across Meta Ads, Google Performance Max, YouTube, and LinkedIn B2B ad networks.',
    kpi: '3.8x - 14x Average ROAS',
    deliverables: ['Custom Audience Personas', 'Ad Copywriting & Creatives', 'A/B Variant Testing', 'Weekly Attribution Reports'],
    badge: 'High Impact'
  },
  {
    id: 'seo-technical',
    title: 'Search Engine Optimization (SEO)',
    category: 'paid-growth',
    icon: 'fa-solid fa-magnifying-glass-chart',
    shortDesc: 'Dominant search visibility with technical audits, programmatic SEO, and high-authority backlink outreach.',
    fullDesc: 'Outrank enterprise competitors on high-intent transactional search queries. Our Bengaluru SEO team handles Core Web Vitals optimization, semantic schema markup, programmatic landing page generation, and contextual editorial link acquisition.',
    kpi: '+320% Organic Traffic',
    deliverables: ['Technical SEO Health Audit', 'Keyword Intent Mapping', 'On-Page Content Optimization', 'White-Hat Tier-1 Link Building'],
    badge: 'Organic Core'
  },
  {
    id: 'ai-automation',
    title: 'AI Automation & Workflow Bots',
    category: 'tech-ai',
    icon: 'fa-solid fa-robot',
    shortDesc: 'Autonomous AI SDRs, smart WhatsApp chatbots, and Zapier/Make automated pipeline integrations.',
    fullDesc: 'Modernize marketing and sales ops with state-of-the-art AI agents. From automated lead enrichment to instant 24/7 AI qualification bots on WhatsApp and web chat, eliminate lead leakage and accelerate sales cycle velocity.',
    kpi: '< 30s Lead Response Time',
    deliverables: ['Custom LLM Prompting & Knowledge Base', 'WhatsApp Business Cloud API', 'HubSpot/Salesforce Sync', 'Automated Lead Qualification'],
    badge: 'AI Powered'
  },
  {
    id: 'b2b-sales-acceleration',
    title: 'B2B Sales Acceleration & BD',
    category: 'strategy-sales',
    icon: 'fa-solid fa-briefcase',
    shortDesc: 'Enterprise outbound pipelines, qualified demo bookings, and account-based marketing (ABM).',
    fullDesc: 'Scale high-ticket B2B deals across India, US, and APAC markets. We build verified prospect lists, craft hyper-personalized multi-touch email/LinkedIn sequences, and book qualified discovery calls directly into your calendar.',
    kpi: '40+ Qualified Demos / Month',
    deliverables: ['TAM & ICP Definition', 'Verified B2B Prospect Lists', 'Cold Email & LinkedIn Outreach', 'Direct Calendar Bookings'],
    badge: 'B2B Focus'
  },
  {
    id: 'customer-support-crm',
    title: 'Customer Support & Retention CRM',
    category: 'strategy-sales',
    icon: 'fa-solid fa-headset',
    shortDesc: 'Omnichannel CRM implementation, ticketing automation, and post-purchase customer satisfaction.',
    fullDesc: 'Maximize customer lifetime value (LTV) through unified omnichannel support desks. We deploy automated SLA routing, customer delight workflows, and proactive churn intervention triggers.',
    kpi: '98% CSAT Rating',
    deliverables: ['Omnichannel Inbox Setup', 'SLA & Escalation Workflows', 'Customer Feedback Loops', 'Churn Reduction Protocols'],
    badge: 'Retention'
  },
  {
    id: 'commercial-video-production',
    title: 'Commercial Video & Ad Film Production',
    category: 'content-creative',
    icon: 'fa-solid fa-clapperboard',
    shortDesc: 'Cinematic ad films, viral short-form reels, and commercial brand spots produced in Bengaluru.',
    fullDesc: 'The flagship craft of LYFAds: cinematic storytelling engineered for conversion. We direct feature-film quality commercial spots, viral reel series, high-impact founder narratives, and investor pitch films with feature-grade color grading.',
    kpi: '10M+ Organic Views',
    deliverables: ['Scriptwriting & Storyboarding', 'Studio & Location Filming', 'Cinema-Grade 4K/6K Edit', 'Custom Sound Design & Color'],
    badge: 'Flagship'
  },
  {
    id: 'social-media-management',
    title: 'Social Media Management & Virality',
    category: 'content-creative',
    icon: 'fa-solid fa-share-nodes',
    shortDesc: 'End-to-end organic social strategy, meme marketing, community building, and viral content reels.',
    fullDesc: 'Build a cult brand following on Instagram, LinkedIn, YouTube, and X. Our creative studio manages daily content calendars, trend hijacking, high-engagement carousels, and community conversations that turn followers into brand advocates.',
    kpi: '+450% Engagement Rate',
    deliverables: ['Monthly Content Calendar', 'Daily Reel & Carousel Assets', 'Community Management', 'Trend Hijacking Strategy'],
    badge: 'Brand Growth'
  },
  {
    id: 'vfx-3d-motion-graphics',
    title: '3D Motion Graphics & VFX',
    category: 'content-creative',
    icon: 'fa-solid fa-cube',
    shortDesc: 'Hyper-realistic 3D product renders, CGI anamorphic billboards, and dynamic visual effects.',
    fullDesc: 'Elevate brand perception with high-end CGI and motion design. From photorealistic 3D product exploded views for e-commerce to futuristic CGI anamorphic installations and kinetic typography for digital campaigns.',
    kpi: '4K Photorealistic CGI',
    deliverables: ['3D Modeling & Texturing', 'Lighting & Simulation VFX', 'Product Exploded Animations', 'Anamorphic Billboard Cuts'],
    badge: 'Cutting Edge'
  },
  {
    id: 'cro-funnel-engineering',
    title: 'Conversion Rate Optimization (CRO)',
    category: 'paid-growth',
    icon: 'fa-solid fa-filter-circle-dollar',
    shortDesc: 'Data-driven landing page audits, multivariate A/B testing, and frictionless checkout funnels.',
    fullDesc: 'Turn existing traffic into paying customers. We analyze user session recordings (Hotjar, Clarity), detect conversion friction points, design high-converting wireframes, and run statistical A/B tests that multiply your bottom line.',
    kpi: '+45% Higher Conversion',
    deliverables: ['Heatmap & Session Analysis', 'A/B Testing Roadmap', 'Checkout Drop-off Fixes', 'Dynamic Personalization'],
    badge: 'Revenue Multiplier'
  },
  {
    id: 'influencer-marketing',
    title: 'Influencer & Creator Marketing',
    category: 'content-creative',
    icon: 'fa-solid fa-users-viewfinder',
    shortDesc: 'Vetted creator partnerships, micro & macro influencer collaborations, and performance affiliate seeding.',
    fullDesc: 'Tap into trusted voices across India and global niches. We manage creator discovery, contract negotiation, creative brief governance, whitelisted ad usage rights, and real-time tracking of influencer-driven GMV.',
    kpi: '5.2x ROI on Creator Spend',
    deliverables: ['Tiered Influencer Roster', 'Creative Briefs & Legal Contracts', 'Seeding & Unboxing Logistics', 'Whitelisted Dark Post Ads'],
    badge: 'High Reach'
  },
  {
    id: 'brand-identity-visual-direction',
    title: 'Brand Identity & Visual Direction',
    category: 'content-creative',
    icon: 'fa-solid fa-palette',
    shortDesc: 'Iconic visual identities, typography guidelines, packaging, and high-fashion brand books.',
    fullDesc: 'Establish a timeless brand identity. We craft comprehensive brand guidelines, custom logo typography, distinctive color palettes, 3D packaging designs, and digital visual systems that command premium pricing.',
    kpi: 'Complete Brand System',
    deliverables: ['Logo & Visual Guideline Book', 'Color System & Custom Typography', 'Packaging & Collateral Design', 'Digital Design Tokens'],
    badge: 'Premium'
  },
  {
    id: 'email-whatsapp-lifecycle',
    title: 'Email & WhatsApp Lifecycle Marketing',
    category: 'paid-growth',
    icon: 'fa-solid fa-envelope-open-text',
    shortDesc: 'Automated retention flows, abandoned cart recovery, and VIP customer segment broadcast funnels.',
    fullDesc: 'Drive predictable recurring revenue without spending on ads. We build automated lifecycle email flows (Klaviyo) and official WhatsApp Business campaigns (WATI/Interakt) that recover carts and re-engage dormant customers.',
    kpi: '28%+ Revenue from Retention',
    deliverables: ['Welcome & Onboarding Sequences', 'Abandoned Cart Multi-Step Triggers', 'VIP Tier Segmentation', 'WhatsApp Broadcast Templates'],
    badge: 'Zero Ad-Spend Rev'
  },
  {
    id: 'content-thought-leadership',
    title: 'Content Marketing & Thought Leadership',
    category: 'content-creative',
    icon: 'fa-solid fa-pen-nib',
    shortDesc: 'High-authority whitepapers, ghostwritten founder newsletters, and viral LinkedIn essays.',
    fullDesc: 'Position your founders and executives as undisputed industry leaders. We research, draft, and distribute viral LinkedIn posts, in-depth industry benchmarks, and thought leadership articles that open enterprise doors.',
    kpi: '500k+ Executive Impressions',
    deliverables: ['Executive Ghostwriting', 'Original Industry Reports', 'Editorial Articles & PR Posts', 'Newsletter Distribution Strategy'],
    badge: 'Authority'
  },
  {
    id: 'programmatic-display-ads',
    title: 'Programmatic & Display Advertising',
    category: 'paid-growth',
    icon: 'fa-solid fa-network-wired',
    shortDesc: 'Omnichannel DSP media buying, retargeting exchanges, and high-impact digital native placements.',
    fullDesc: 'Reach high-value audiences across premium digital publishers, connected TV (CTV), and audio streaming apps. We execute programmatic DSP media buys with real-time fraud filtering and geofencing precision.',
    kpi: '99.2% Brand-Safe Inventory',
    deliverables: ['DSP Setup & Bidding Rules', 'Contextual & Geo-Targeting', 'Interactive Rich Media Banners', 'Brand Safety Whitelists'],
    badge: 'Scale'
  },
  {
    id: 'mobile-app-marketing-aso',
    title: 'Mobile App Marketing & ASO',
    category: 'paid-growth',
    icon: 'fa-solid fa-mobile-screen-button',
    shortDesc: 'App Store & Google Play optimization, organic keyword rank boosts, and cost-efficient CPI campaigns.',
    fullDesc: 'Dominate the app charts with holistic App Store Optimization (ASO). We conduct keyword metadata enhancements, screenshot/icon conversion testing, and targeted Google App Campaigns & Apple Search Ads to drive sticky installs.',
    kpi: '< ₹25 Cost Per Install (CPI)',
    deliverables: ['App Store Keyword Optimization', 'Visual Screenshot A/B Testing', 'Apple Search Ads (ASA)', 'MMP Tracking Setup (AppsFlyer/Branch)'],
    badge: 'App Scale'
  },
  {
    id: 'web-landing-page-engineering',
    title: 'Web & Landing Page Engineering',
    category: 'tech-ai',
    icon: 'fa-solid fa-code',
    shortDesc: 'Ultra-fast, mobile-first web pages engineered for maximum conversion and sub-second load times.',
    fullDesc: 'Speed is conversion. We engineer bespoke, responsive web applications and high-conversion sales landers using clean HTML5, modern CSS, and headless architectures with 95+ Google PageSpeed benchmarks.',
    kpi: '< 0.8s Page Load Time',
    deliverables: ['Custom Responsive Code', 'Sub-second CDN Optimization', 'Dynamic CMS & Form Sync', 'Accessibility & SEO Ready'],
    badge: 'Sub-Second'
  },
  {
    id: 'data-analytics-attribution',
    title: 'Data Analytics & Attribution Modeling',
    category: 'tech-ai',
    icon: 'fa-solid fa-chart-pie',
    shortDesc: 'Server-side tracking (GA4, CAPI), custom Looker Studio dashboards, and multi-touch ROI attribution.',
    fullDesc: 'Eliminate blind spots in modern iOS/privacy environments. We implement robust server-side Meta Conversions API (CAPI), Google Analytics 4, BigQuery event piping, and real-time executive dashboards that expose true channel incrementality.',
    kpi: '100% Tracking Data Accuracy',
    deliverables: ['Server-Side GTM & Meta CAPI', 'GA4 Custom Event Taxonomy', 'Executive Looker Studio Dashboards', 'Marketing Mix Modeling (MMM)'],
    badge: 'Data Integrity'
  },
  {
    id: 'digital-pr-media-relations',
    title: 'Digital PR & Media Authority',
    category: 'strategy-sales',
    icon: 'fa-solid fa-newspaper',
    shortDesc: 'Tier-1 press releases, startup funding announcements, and media placements across top business outlets.',
    fullDesc: 'Get featured on YourStory, Inc42, Economic Times, TechCrunch, and regional Bengaluru media. We manage press narrative development, journalist pitching, and high-impact media tours that cement market credibility.',
    kpi: 'Guaranteed Tier-1 Press Coverage',
    deliverables: ['Press Release Drafting & Distribution', 'Journalist Direct Outreach', 'Founder Media Interviews', 'High-DA Backlink Syndication'],
    badge: 'Credibility'
  },
  {
    id: 'ecommerce-marketplace-growth',
    title: 'E-Commerce & Marketplace Ads',
    category: 'paid-growth',
    icon: 'fa-solid fa-cart-shopping',
    shortDesc: 'Amazon, Flipkart, and Shopify growth scaling with Sponsored Ads, A+ content, and Buy Box strategies.',
    fullDesc: 'Scale GMV on India and global retail platforms. We optimize product listing titles, create cinema-grade A+ visual content, manage Amazon PPC bid algorithms, and drive targeted external traffic for maximum organic rank lift.',
    kpi: '4.5x Marketplace ROAS',
    deliverables: ['Amazon Sponsored Products & Brands', 'A+ Enhanced Brand Content (EBC)', 'Buy Box & Inventory Monitoring', 'Shopify Store Optimization'],
    badge: 'E-Com Scale'
  },
  {
    id: 'outbound-lead-generation',
    title: 'Outbound Lead Gen & Funnel Strategy',
    category: 'strategy-sales',
    icon: 'fa-solid fa-bullseye',
    shortDesc: 'High-ticket lead qualification, hyper-targeted account lists, and predictable pipeline generation.',
    fullDesc: 'A predictable, scalable engine to acquire mid-market and enterprise accounts. We orchestrate targeted account research, multi-channel cadences, dedicated outbound SDR teams, and weekly pipeline review meetings.',
    kpi: '₹2.5Cr+ Sourced Pipeline',
    deliverables: ['Target Account Lists (10k+ Vetted)', 'Omni-channel Outbound Playbooks', 'SDR Scripting & Quality Control', 'CRM Integration & Deal Handoff'],
    badge: 'Pipeline Engine'
  }
];

// Helper to filter services by category
function getServicesByCategory(cat) {
  if (!cat || cat === 'all') return SERVICES_DATA;
  return SERVICES_DATA.filter(s => s.category === cat);
}

// Expose globally
window.SERVICES_DATA = SERVICES_DATA;
window.getServicesByCategory = getServicesByCategory;
