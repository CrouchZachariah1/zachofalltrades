export type QuoteService = 'Website Development' | 'Advertising' | 'Website Care'

export type QuoteExtras = {
  webNeed?: string
  adsPlan?: string
  carePlan?: string
}

export type OfferPackage = {
  id: string
  name: string
  price: string
  management?: string
  spend?: string
  audience: string
  includeLabel: string
  items: string[]
  footnote?: string
  cta: string
  service: QuoteService
  extras: QuoteExtras
}

export const webNeedOptions = [
  'Professional Website',
  'Business Website',
  'E-Commerce Website',
  'Custom Web Application',
  'Website Redesign',
  "I'm Not Sure",
] as const

export const webPageOptions = ['1', '2–3', '4–5', '6–10', '10+', 'Not Sure'] as const

export const webFeatureOptions = [
  'Contact Form',
  'WhatsApp',
  'Gallery / Portfolio',
  'Blog',
  'Booking System',
  'User Accounts',
  'Payment Gateway',
  'Online Store',
  'Admin Dashboard',
  'Database',
  'Email Automation',
  'Advanced Animations',
  'API Integration',
  'Other',
  'Not Sure',
] as const

export const webBudgetOptions = [
  'R2,500 – R5,000',
  'R5,000 – R8,000',
  'R8,000 – R12,000',
  'R12,000 – R20,000',
  'R20,000+',
  "I'm not sure — I'd like a recommendation",
] as const

export const webPackages: OfferPackage[] = [
  {
    id: 'web-pro',
    name: 'Professional Website',
    price: 'From R2,500',
    audience: 'For individuals, startups and businesses that need a professional online presence.',
    includeLabel: 'Can include',
    items: [
      'Custom website design',
      'Mobile, tablet and desktop responsiveness',
      'Contact forms',
      'WhatsApp integration',
      'Social media integration',
      'Basic SEO setup',
      'SSL/HTTPS setup',
      'Performance optimisation',
      'Deployment',
      'Up to 2 revision rounds',
    ],
    footnote: 'R2,500 is the starting price. The quote is written around the pages and features the project actually needs.',
    cta: 'Get a Quote',
    service: 'Website Development',
    extras: { webNeed: 'Professional Website' },
  },
  {
    id: 'web-biz',
    name: 'Business Website',
    price: 'From R3,900',
    audience: 'For businesses that need a larger, more structured website with multiple pages and additional functionality.',
    includeLabel: 'Possible functionality can include',
    items: [
      'Multiple service pages',
      'About/company sections',
      'Galleries and portfolios',
      'Advanced contact/enquiry forms',
      'Maps',
      'Additional animations',
      'Blog/news functionality',
      'Analytics',
      'Additional integrations',
    ],
    footnote: 'The features above are examples of what a business site can include. Pricing depends on the project’s actual requirements.',
    cta: 'Get a Quote',
    service: 'Website Development',
    extras: { webNeed: 'Business Website' },
  },
  {
    id: 'web-shop',
    name: 'E-Commerce',
    price: 'From R7,500',
    audience: 'For businesses selling products or services online.',
    includeLabel: 'Possible functionality',
    items: [
      'Product catalogue',
      'Product pages',
      'Shopping cart',
      'Checkout',
      'Payment gateway integration',
      'Stock management',
      'Discounts/coupon codes',
      'Order management',
      'Customer notifications',
      'Shipping configuration',
      'Admin/product management',
      'Analytics',
    ],
    footnote:
      'Stores with large catalogues, custom dashboards, courier APIs, customer accounts, automation, custom databases or advanced integrations receive a custom quote.',
    cta: 'Get a Quote',
    service: 'Website Development',
    extras: { webNeed: 'E-Commerce Website' },
  },
  {
    id: 'web-custom',
    name: 'Custom Web Development',
    price: 'Custom Quote',
    audience: 'For projects beyond a normal business website.',
    includeLabel: 'Examples',
    items: [
      'Admin dashboards',
      'Customer portals',
      'Membership systems',
      'Booking systems',
      'Learning platforms',
      'Custom databases',
      'User accounts/authentication',
      'API integrations',
      'Payment systems',
      'Advanced automation',
      'Custom web applications',
    ],
    cta: 'Discuss Your Project',
    service: 'Website Development',
    extras: { webNeed: 'Custom Web Application' },
  },
]

export const carePackages: OfferPackage[] = [
  {
    id: 'care-essential',
    name: 'Essential Care',
    price: 'R450/month',
    audience: 'For smaller websites requiring basic ongoing maintenance.',
    includeLabel: 'Intended for',
    items: ['Basic upkeep', 'Updates and checks on an agreed schedule', 'Support within the plan'],
    cta: 'Get a Quote',
    service: 'Website Care',
    extras: { carePlan: 'Essential Care' },
  },
  {
    id: 'care-business',
    name: 'Business Care',
    price: 'R750/month',
    audience: 'For active business websites requiring more support and maintenance.',
    includeLabel: 'Intended for',
    items: ['Regular maintenance', 'More active support', 'Updates as the site is used'],
    cta: 'Get a Quote',
    service: 'Website Care',
    extras: { carePlan: 'Business Care' },
  },
  {
    id: 'care-pro',
    name: 'Pro Care',
    price: 'R1,250/month',
    audience: 'For e-commerce and business-critical websites requiring more active maintenance.',
    includeLabel: 'Intended for',
    items: ['Active maintenance', 'Priority support within the plan', 'Stores and high-traffic sites'],
    cta: 'Get a Quote',
    service: 'Website Care',
    extras: { carePlan: 'Pro Care' },
  },
  {
    id: 'care-custom',
    name: 'Custom Care',
    price: 'From R1,500/month',
    audience: 'For advanced websites, custom systems and applications.',
    includeLabel: 'Intended for',
    items: ['Custom systems', 'Applications', 'Agreed support beyond a standard site'],
    cta: 'Get a Quote',
    service: 'Website Care',
    extras: { carePlan: 'Custom Care' },
  },
]

export const metaAdPackages: OfferPackage[] = [
  {
    id: 'meta-starter',
    name: 'Ads Starter',
    price: 'R750/month + ad spend',
    management: 'R750/month management',
    spend: 'Client-selected advertising budget',
    audience: 'Designed for small businesses beginning paid advertising on Facebook and Instagram.',
    includeLabel: 'Can include',
    items: [
      'Campaign setup',
      'Facebook and Instagram placements',
      'Audience targeting',
      'Basic campaign monitoring',
      'Monthly optimisation',
      'Basic performance reporting',
    ],
    cta: 'Get a Quote',
    service: 'Advertising',
    extras: { adsPlan: 'Ads Starter' },
  },
  {
    id: 'meta-growth',
    name: 'Ads Growth',
    price: 'R1,250/month + ad spend',
    management: 'R1,250/month management',
    spend: 'Client-selected advertising budget',
    audience: 'For businesses actively generating leads, enquiries or sales.',
    includeLabel: 'Can include',
    items: [
      'Multiple campaigns/ad sets',
      'Audience testing',
      'Retargeting where appropriate',
      'Campaign optimisation',
      'Basic A/B testing',
      'Conversion monitoring',
      'Monthly reporting',
    ],
    cta: 'Get a Quote',
    service: 'Advertising',
    extras: { adsPlan: 'Ads Growth' },
  },
  {
    id: 'meta-pro',
    name: 'Ads Pro',
    price: 'R1,750/month + ad spend',
    management: 'R1,750/month management',
    spend: 'Client-selected advertising budget',
    audience: 'For businesses requiring more active advertising management.',
    includeLabel: 'Can include',
    items: [
      'Multiple campaigns',
      'More advanced audience testing',
      'Retargeting',
      'Ongoing optimisation',
      'Campaign strategy',
      'Conversion tracking where applicable',
      'More detailed reporting',
    ],
    cta: 'Get a Quote',
    service: 'Advertising',
    extras: { adsPlan: 'Ads Pro' },
  },
]

export const googleAdPackages: OfferPackage[] = [
  {
    id: 'google-starter',
    name: 'Google Starter',
    price: 'R950/month + ad spend',
    management: 'R950/month management',
    spend: 'Client-selected advertising budget',
    audience: 'A starting point for Google Ads campaign management.',
    includeLabel: 'Can include',
    items: ['Campaign setup', 'Keyword and search targeting', 'Basic monitoring', 'Monthly optimisation', 'Basic reporting'],
    cta: 'Get a Quote',
    service: 'Advertising',
    extras: { adsPlan: 'Google Starter' },
  },
  {
    id: 'google-growth',
    name: 'Google Growth',
    price: 'R1,500/month + ad spend',
    management: 'R1,500/month management',
    spend: 'Client-selected advertising budget',
    audience: 'For businesses running more active Google Ads campaigns.',
    includeLabel: 'Can include',
    items: [
      'Multiple campaigns',
      'Keyword and audience testing',
      'Conversion monitoring',
      'Ongoing optimisation',
      'Monthly reporting',
    ],
    cta: 'Get a Quote',
    service: 'Advertising',
    extras: { adsPlan: 'Google Growth' },
  },
  {
    id: 'google-pro',
    name: 'Google Pro',
    price: 'From R2,000/month + ad spend',
    management: 'From R2,000/month management',
    spend: 'Client-selected advertising budget',
    audience: 'For more complex Google Ads accounts and campaign structures.',
    includeLabel: 'Can include',
    items: [
      'Multiple campaigns',
      'More advanced targeting',
      'Conversion tracking',
      'Ongoing optimisation',
      'Campaign strategy',
      'More detailed reporting',
    ],
    footnote:
      'Google Ads pricing varies with campaign complexity, competition, keywords, tracking requirements and the number of campaigns.',
    cta: 'Get a Quote',
    service: 'Advertising',
    extras: { adsPlan: 'Google Pro' },
  },
]

export const combinedAdPackages: OfferPackage[] = [
  {
    id: 'digital-starter',
    name: 'Digital Ads Starter',
    price: 'R1,500/month + ad spend',
    management: 'R1,500/month management',
    spend: 'Client-selected advertising budget',
    audience: 'Meta + Google advertising management for smaller businesses.',
    includeLabel: 'Can include',
    items: ['Facebook and Instagram management', 'Google Ads management', 'Shared reporting', 'Monthly optimisation'],
    cta: 'Get a Quote',
    service: 'Advertising',
    extras: { adsPlan: 'Digital Ads Starter' },
  },
  {
    id: 'digital-growth',
    name: 'Digital Ads Growth',
    price: 'R2,250/month + ad spend',
    management: 'R2,250/month management',
    spend: 'Client-selected advertising budget',
    audience: 'More active Meta + Google management, optimisation, conversion tracking and reporting.',
    includeLabel: 'Can include',
    items: [
      'Active Meta and Google management',
      'Optimisation across platforms',
      'Conversion tracking',
      'Monthly reporting',
    ],
    footnote: 'Advanced advertising requirements receive a custom quote.',
    cta: 'Get a Quote',
    service: 'Advertising',
    extras: { adsPlan: 'Digital Ads Growth' },
  },
]

export const webPricingDisclaimer =
  'Prices shown are starting prices. Final pricing depends on project size, functionality, integrations and specific requirements. A clear quote will be provided before development begins.'

export const webExternalFeesDisclaimer =
  'Domain registration, premium hosting, paid third-party services, advertising spend, premium APIs, email services and other external service fees may be charged separately where applicable.'

export const careDisclaimer =
  'Maintenance covers agreed maintenance and support work. New pages, major redesigns, new functionality, integrations and significant development work are quoted separately. Unused included support or development time does not roll over unless explicitly agreed otherwise.'

export const adsSpendDisclaimer =
  'Advertising spend is not included in the monthly management fee. The management fee is what you pay Zach of All Trades for setting up, managing, monitoring and optimising the advertising. The advertising budget is what you pay separately to platforms such as Meta or Google.'

export const adsBillingDisclaimer =
  'Where practical, advertising spend is paid directly by you to the advertising platform. Zach of All Trades does not collect and redistribute the advertising budget as part of the management fee.'
