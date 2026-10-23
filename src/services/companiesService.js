// Companies Data Service with Local Storage Persistence for Module 3

const COMPANIES_DB_KEY = 'jobportal_companies_module3';

export const INITIAL_MOCK_COMPANIES = [
  // Top 9 exact match to reference image
  {
    id: 'comp_google',
    name: 'Google',
    status: 'Active',
    industry: 'Technology',
    industryColor: 'bg-blue-50 text-blue-700 border-blue-100',
    location: 'Mountain View, CA',
    employees: '10,001+ employees',
    employeeCount: 180000,
    website: 'www.google.com',
    email: 'contact@google.com',
    logo: 'https://www.gstatic.com/images/branding/product/2x/googleg_48dp.png',
    fallbackLetter: 'G',
    fallbackBg: 'bg-red-500',
    description: 'Google LLC is an American multinational technology company specializing in Internet-related services and products.',
    rating: 4.9,
    openJobs: 48,
    createdAt: '2026-01-10T08:00:00.000Z',
  },
  {
    id: 'comp_microsoft',
    name: 'Microsoft',
    status: 'Active',
    industry: 'Technology',
    industryColor: 'bg-blue-50 text-blue-700 border-blue-100',
    location: 'Redmond, WA',
    employees: '10,001+ employees',
    employeeCount: 220000,
    website: 'www.microsoft.com',
    email: 'careers@microsoft.com',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg',
    fallbackLetter: 'M',
    fallbackBg: 'bg-blue-600',
    description: 'Microsoft develops, manufactures, licenses and supports software, services, and devices worldwide.',
    rating: 4.8,
    openJobs: 36,
    createdAt: '2026-01-12T09:30:00.000Z',
  },
  {
    id: 'comp_amazon',
    name: 'Amazon',
    status: 'Active',
    industry: 'E-commerce',
    industryColor: 'bg-amber-50 text-amber-700 border-amber-100',
    location: 'Seattle, WA',
    employees: '10,001+ employees',
    employeeCount: 1500000,
    website: 'www.amazon.com',
    email: 'jobs@amazon.com',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg',
    fallbackLetter: 'A',
    fallbackBg: 'bg-orange-500',
    description: 'Amazon is a global e-commerce and cloud computing company, known for its customer-centric approach.',
    rating: 4.7,
    openJobs: 52,
    createdAt: '2026-01-15T10:15:00.000Z',
  },
  {
    id: 'comp_meta',
    name: 'Meta',
    status: 'Active',
    industry: 'Social Media',
    industryColor: 'bg-indigo-50 text-indigo-700 border-indigo-100',
    location: 'Menlo Park, CA',
    employees: '10,001+ employees',
    employeeCount: 67000,
    website: 'www.meta.com',
    email: 'careers@meta.com',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg',
    fallbackLetter: 'M',
    fallbackBg: 'bg-blue-500',
    description: 'Meta builds technologies that help people connect, communicate and share experiences across the globe.',
    rating: 4.6,
    openJobs: 28,
    createdAt: '2026-01-20T11:00:00.000Z',
  },
  {
    id: 'comp_apple',
    name: 'Apple',
    status: 'Active',
    industry: 'Consumer Electronics',
    industryColor: 'bg-slate-50 text-slate-700 border-slate-200',
    location: 'Cupertino, CA',
    employees: '10,001+ employees',
    employeeCount: 161000,
    website: 'www.apple.com',
    email: 'jobs@apple.com',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg',
    fallbackLetter: 'A',
    fallbackBg: 'bg-gray-800',
    description: 'Apple designs and manufactures consumer electronics, computer software and leading online services.',
    rating: 4.9,
    openJobs: 41,
    createdAt: '2026-01-22T14:20:00.000Z',
  },
  {
    id: 'comp_netflix',
    name: 'Netflix',
    status: 'Active',
    industry: 'Entertainment',
    industryColor: 'bg-rose-50 text-rose-700 border-rose-100',
    location: 'Los Gatos, CA',
    employees: '5,001 - 10,000 employees',
    employeeCount: 12000,
    website: 'www.netflix.com',
    email: 'jobs@netflix.com',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg',
    fallbackLetter: 'N',
    fallbackBg: 'bg-red-600',
    description: 'Netflix is a streaming entertainment service that offers a wide variety of award-winning TV shows and movies.',
    rating: 4.8,
    openJobs: 19,
    createdAt: '2026-01-25T16:00:00.000Z',
  },
  {
    id: 'comp_spotify',
    name: 'Spotify',
    status: 'Active',
    industry: 'Music & Audio',
    industryColor: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    location: 'Stockholm, Sweden',
    employees: '1,001 - 5,000 employees',
    employeeCount: 4500,
    website: 'www.spotify.com',
    email: 'careers@spotify.com',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_without_text.svg',
    fallbackLetter: 'S',
    fallbackBg: 'bg-green-600',
    description: 'Spotify is a digital music service that gives you access to millions of songs, playlists and podcasts.',
    rating: 4.7,
    openJobs: 14,
    createdAt: '2026-02-01T10:45:00.000Z',
  },
  {
    id: 'comp_tcs',
    name: 'TCS',
    status: 'Active',
    industry: 'IT Services',
    industryColor: 'bg-cyan-50 text-cyan-700 border-cyan-100',
    location: 'Mumbai, India',
    employees: '10,001+ employees',
    employeeCount: 600000,
    website: 'www.tcs.com',
    email: 'careers@tcs.com',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/b/b1/Tata_Consultancy_Services_Logo.svg',
    fallbackLetter: 'T',
    fallbackBg: 'bg-sky-600',
    description: 'Tata Consultancy Services is a global IT services, consulting and business solutions company.',
    rating: 4.5,
    openJobs: 65,
    createdAt: '2026-02-05T12:00:00.000Z',
  },
  {
    id: 'comp_infosys',
    name: 'Infosys',
    status: 'Active',
    industry: 'IT Services',
    industryColor: 'bg-cyan-50 text-cyan-700 border-cyan-100',
    location: 'Bengaluru, India',
    employees: '10,001+ employees',
    employeeCount: 340000,
    website: 'www.infosys.com',
    email: 'careers@infosys.com',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/9/95/Infosys_logo.svg',
    fallbackLetter: 'I',
    fallbackBg: 'bg-blue-700',
    description: 'Infosys is a global leader in next-generation digital services and consulting for Fortune 500 enterprises.',
    rating: 4.5,
    openJobs: 58,
    createdAt: '2026-02-08T15:30:00.000Z',
  },

  // Additional 23 realistic companies (total = 32 companies)
  {
    id: 'comp_adobe',
    name: 'Adobe',
    status: 'Active',
    industry: 'Technology',
    industryColor: 'bg-blue-50 text-blue-700 border-blue-100',
    location: 'San Jose, CA',
    employees: '10,001+ employees',
    employeeCount: 29000,
    website: 'www.adobe.com',
    email: 'jobs@adobe.com',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/7/7b/Adobe_Systems_logo_and_wordmark.svg',
    fallbackLetter: 'A',
    fallbackBg: 'bg-red-600',
    description: 'Adobe is the global leader in digital media and digital marketing solutions and creative software.',
    rating: 4.8,
    openJobs: 24,
    createdAt: '2026-02-10T09:00:00.000Z',
  },
  {
    id: 'comp_salesforce',
    name: 'Salesforce',
    status: 'Active',
    industry: 'Technology',
    industryColor: 'bg-blue-50 text-blue-700 border-blue-100',
    location: 'San Francisco, CA',
    employees: '10,001+ employees',
    employeeCount: 79000,
    website: 'www.salesforce.com',
    email: 'careers@salesforce.com',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/f/f9/Salesforce.com_logo.svg',
    fallbackLetter: 'S',
    fallbackBg: 'bg-sky-500',
    description: 'Salesforce is the world leader in customer relationship management (CRM) software and enterprise cloud applications.',
    rating: 4.7,
    openJobs: 31,
    createdAt: '2026-02-12T11:20:00.000Z',
  },
  {
    id: 'comp_stripe',
    name: 'Stripe',
    status: 'Active',
    industry: 'Financial Services',
    industryColor: 'bg-purple-50 text-purple-700 border-purple-100',
    location: 'San Francisco, CA',
    employees: '5,001 - 10,000 employees',
    employeeCount: 8000,
    website: 'www.stripe.com',
    email: 'jobs@stripe.com',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg',
    fallbackLetter: 'S',
    fallbackBg: 'bg-indigo-600',
    description: 'Stripe is an economic infrastructure platform building developer-first payment systems and online financial tools.',
    rating: 4.9,
    openJobs: 22,
    createdAt: '2026-02-15T13:40:00.000Z',
  },
  {
    id: 'comp_airbnb',
    name: 'Airbnb',
    status: 'Active',
    industry: 'Entertainment',
    industryColor: 'bg-rose-50 text-rose-700 border-rose-100',
    location: 'San Francisco, CA',
    employees: '5,001 - 10,000 employees',
    employeeCount: 6800,
    website: 'www.airbnb.com',
    email: 'careers@airbnb.com',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/6/69/Airbnb_Logo_B%C3%A9lo.svg',
    fallbackLetter: 'A',
    fallbackBg: 'bg-rose-500',
    description: 'Airbnb operates an online marketplace for lodging, homestays, vacation rentals and hospitality tourism.',
    rating: 4.7,
    openJobs: 17,
    createdAt: '2026-02-18T14:10:00.000Z',
  },
  {
    id: 'comp_uber',
    name: 'Uber',
    status: 'Active',
    industry: 'Technology',
    industryColor: 'bg-blue-50 text-blue-700 border-blue-100',
    location: 'San Francisco, CA',
    employees: '10,001+ employees',
    employeeCount: 32000,
    website: 'www.uber.com',
    email: 'jobs@uber.com',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png',
    fallbackLetter: 'U',
    fallbackBg: 'bg-black',
    description: 'Uber develops technologies that seamlessly connect riders to drivers and food delivery at the tap of a button.',
    rating: 4.6,
    openJobs: 39,
    createdAt: '2026-02-20T16:00:00.000Z',
  },
  {
    id: 'comp_intel',
    name: 'Intel',
    status: 'Active',
    industry: 'Consumer Electronics',
    industryColor: 'bg-slate-50 text-slate-700 border-slate-200',
    location: 'Santa Clara, CA',
    employees: '10,001+ employees',
    employeeCount: 131000,
    website: 'www.intel.com',
    email: 'jobs@intel.com',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/7/7d/Intel_logo_%282020%29.svg',
    fallbackLetter: 'I',
    fallbackBg: 'bg-blue-700',
    description: 'Intel creates world-changing semiconductor technology that enables global progress and enriches lives.',
    rating: 4.6,
    openJobs: 27,
    createdAt: '2026-02-22T10:30:00.000Z',
  },
  {
    id: 'comp_cisco',
    name: 'Cisco',
    status: 'Active',
    industry: 'Technology',
    industryColor: 'bg-blue-50 text-blue-700 border-blue-100',
    location: 'San Jose, CA',
    employees: '10,001+ employees',
    employeeCount: 84000,
    website: 'www.cisco.com',
    email: 'careers@cisco.com',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Cisco_logo_blue_2016.svg',
    fallbackLetter: 'C',
    fallbackBg: 'bg-cyan-600',
    description: 'Cisco is the worldwide leader in technology that securely powers enterprise networking and cloud connectivity.',
    rating: 4.7,
    openJobs: 21,
    createdAt: '2026-02-25T11:00:00.000Z',
  },
  {
    id: 'comp_oracle',
    name: 'Oracle',
    status: 'Active',
    industry: 'Technology',
    industryColor: 'bg-blue-50 text-blue-700 border-blue-100',
    location: 'Austin, TX',
    employees: '10,001+ employees',
    employeeCount: 143000,
    website: 'www.oracle.com',
    email: 'jobs@oracle.com',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/5/50/Oracle_logo.svg',
    fallbackLetter: 'O',
    fallbackBg: 'bg-red-700',
    description: 'Oracle provides enterprise cloud software, engineered systems and database services to businesses.',
    rating: 4.5,
    openJobs: 33,
    createdAt: '2026-02-28T14:45:00.000Z',
  },
  {
    id: 'comp_nvidia',
    name: 'NVIDIA',
    status: 'Active',
    industry: 'Technology',
    industryColor: 'bg-blue-50 text-blue-700 border-blue-100',
    location: 'Santa Clara, CA',
    employees: '10,001+ employees',
    employeeCount: 29000,
    website: 'www.nvidia.com',
    email: 'jobs@nvidia.com',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/2/21/Nvidia_logo.svg',
    fallbackLetter: 'N',
    fallbackBg: 'bg-emerald-600',
    description: 'NVIDIA pioneered accelerated computing and graphics processing units to revolutionize AI and supercomputing.',
    rating: 4.9,
    openJobs: 45,
    createdAt: '2026-03-01T09:15:00.000Z',
  },
  {
    id: 'comp_tesla',
    name: 'Tesla',
    status: 'Active',
    industry: 'Automotive',
    industryColor: 'bg-teal-50 text-teal-700 border-teal-100',
    location: 'Austin, TX',
    employees: '10,001+ employees',
    employeeCount: 140000,
    website: 'www.tesla.com',
    email: 'careers@tesla.com',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/e/e8/Tesla_logo.png',
    fallbackLetter: 'T',
    fallbackBg: 'bg-red-600',
    description: 'Tesla designs and manufactures electric vehicles, battery energy storage, and clean energy products.',
    rating: 4.7,
    openJobs: 38,
    createdAt: '2026-03-03T08:00:00.000Z',
  },
  {
    id: 'comp_ibm',
    name: 'IBM',
    status: 'Active',
    industry: 'IT Services',
    industryColor: 'bg-cyan-50 text-cyan-700 border-cyan-100',
    location: 'Armonk, NY',
    employees: '10,001+ employees',
    employeeCount: 280000,
    website: 'www.ibm.com',
    email: 'jobs@ibm.com',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg',
    fallbackLetter: 'I',
    fallbackBg: 'bg-blue-800',
    description: 'IBM produces and sells computer hardware, middleware and software, providing hybrid cloud and AI consulting.',
    rating: 4.5,
    openJobs: 42,
    createdAt: '2026-03-05T10:00:00.000Z',
  },
  {
    id: 'comp_linkedin',
    name: 'LinkedIn',
    status: 'Active',
    industry: 'Social Media',
    industryColor: 'bg-indigo-50 text-indigo-700 border-indigo-100',
    location: 'Sunnyvale, CA',
    employees: '10,001+ employees',
    employeeCount: 21000,
    website: 'www.linkedin.com',
    email: 'careers@linkedin.com',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/c/ca/LinkedIn_logo_initials.png',
    fallbackLetter: 'L',
    fallbackBg: 'bg-blue-600',
    description: 'LinkedIn connects the world’s professionals to make them more productive and successful.',
    rating: 4.8,
    openJobs: 26,
    createdAt: '2026-03-08T11:30:00.000Z',
  },
  {
    id: 'comp_twitter',
    name: 'X (Twitter)',
    status: 'Active',
    industry: 'Social Media',
    industryColor: 'bg-indigo-50 text-indigo-700 border-indigo-100',
    location: 'San Francisco, CA',
    employees: '1,001 - 5,000 employees',
    employeeCount: 2500,
    website: 'www.x.com',
    email: 'careers@x.com',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/6/6f/Logo_of_Twitter.svg',
    fallbackLetter: 'X',
    fallbackBg: 'bg-black',
    description: 'X is the global town square where public conversation, breaking news and real-time commentary live.',
    rating: 4.2,
    openJobs: 12,
    createdAt: '2026-03-10T14:00:00.000Z',
  },
  {
    id: 'comp_paypal',
    name: 'PayPal',
    status: 'Active',
    industry: 'Financial Services',
    industryColor: 'bg-purple-50 text-purple-700 border-purple-100',
    location: 'San Jose, CA',
    employees: '10,001+ employees',
    employeeCount: 27000,
    website: 'www.paypal.com',
    email: 'jobs@paypal.com',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg',
    fallbackLetter: 'P',
    fallbackBg: 'bg-blue-700',
    description: 'PayPal is an online payments system supporting worldwide online money transfers and merchant operations.',
    rating: 4.6,
    openJobs: 30,
    createdAt: '2026-03-12T16:20:00.000Z',
  },
  {
    id: 'comp_wipro',
    name: 'Wipro',
    status: 'Active',
    industry: 'IT Services',
    industryColor: 'bg-cyan-50 text-cyan-700 border-cyan-100',
    location: 'Bengaluru, India',
    employees: '10,001+ employees',
    employeeCount: 250000,
    website: 'www.wipro.com',
    email: 'careers@wipro.com',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a0/Wipro_Primary_Logo_Color_RGB.svg',
    fallbackLetter: 'W',
    fallbackBg: 'bg-indigo-700',
    description: 'Wipro is a leading technology services and consulting company focused on building innovative solutions.',
    rating: 4.4,
    openJobs: 44,
    createdAt: '2026-03-15T09:00:00.000Z',
  },
  {
    id: 'comp_hcltech',
    name: 'HCLTech',
    status: 'Active',
    industry: 'IT Services',
    industryColor: 'bg-cyan-50 text-cyan-700 border-cyan-100',
    location: 'Noida, India',
    employees: '10,001+ employees',
    employeeCount: 225000,
    website: 'www.hcltech.com',
    email: 'careers@hcltech.com',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/8/87/HCLTech_logo.svg',
    fallbackLetter: 'H',
    fallbackBg: 'bg-blue-900',
    description: 'HCLTech supercharges progress with digital engineering, cloud consulting and enterprise modernization.',
    rating: 4.4,
    openJobs: 37,
    createdAt: '2026-03-18T10:15:00.000Z',
  },
  {
    id: 'comp_goldmansachs',
    name: 'Goldman Sachs',
    status: 'Active',
    industry: 'Financial Services',
    industryColor: 'bg-purple-50 text-purple-700 border-purple-100',
    location: 'New York, NY',
    employees: '10,001+ employees',
    employeeCount: 45000,
    website: 'www.goldmansachs.com',
    email: 'careers@gs.com',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/6/61/Goldman_Sachs.svg',
    fallbackLetter: 'G',
    fallbackBg: 'bg-sky-700',
    description: 'Goldman Sachs is a leading global investment banking, securities and investment management firm.',
    rating: 4.7,
    openJobs: 34,
    createdAt: '2026-03-20T12:00:00.000Z',
  },
  {
    id: 'comp_jpmorgan',
    name: 'JPMorgan Chase',
    status: 'Active',
    industry: 'Financial Services',
    industryColor: 'bg-purple-50 text-purple-700 border-purple-100',
    location: 'New York, NY',
    employees: '10,001+ employees',
    employeeCount: 290000,
    website: 'www.jpmorganchase.com',
    email: 'jobs@jpmorgan.com',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/a/af/J_P_Morgan_Chase_Logo_2008_1.svg',
    fallbackLetter: 'J',
    fallbackBg: 'bg-slate-900',
    description: 'JPMorgan Chase is a financial services leader offering banking and asset management worldwide.',
    rating: 4.6,
    openJobs: 56,
    createdAt: '2026-03-22T13:30:00.000Z',
  },
  {
    id: 'comp_slack',
    name: 'Slack',
    status: 'Active',
    industry: 'Technology',
    industryColor: 'bg-blue-50 text-blue-700 border-blue-100',
    location: 'San Francisco, CA',
    employees: '1,001 - 5,000 employees',
    employeeCount: 3500,
    website: 'www.slack.com',
    email: 'jobs@slack.com',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/d/d5/Slack_icon_2019.svg',
    fallbackLetter: 'S',
    fallbackBg: 'bg-purple-600',
    description: 'Slack is a messaging app for business that connects people to the information they need every day.',
    rating: 4.8,
    openJobs: 16,
    createdAt: '2026-03-25T14:45:00.000Z',
  },
  {
    id: 'comp_atlassian',
    name: 'Atlassian',
    status: 'Active',
    industry: 'Technology',
    industryColor: 'bg-blue-50 text-blue-700 border-blue-100',
    location: 'Sydney, Australia',
    employees: '5,001 - 10,000 employees',
    employeeCount: 9000,
    website: 'www.atlassian.com',
    email: 'careers@atlassian.com',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/0/00/Atlassian-Logo.svg',
    fallbackLetter: 'A',
    fallbackBg: 'bg-blue-600',
    description: 'Atlassian develops products for software developers, project managers and agile development teams.',
    rating: 4.7,
    openJobs: 23,
    createdAt: '2026-03-28T16:00:00.000Z',
  },
  {
    id: 'comp_zoom',
    name: 'Zoom',
    status: 'Active',
    industry: 'Technology',
    industryColor: 'bg-blue-50 text-blue-700 border-blue-100',
    location: 'San Jose, CA',
    employees: '5,001 - 10,000 employees',
    employeeCount: 7400,
    website: 'www.zoom.us',
    email: 'jobs@zoom.us',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/7/7b/Zoom_Communications_Logo.svg',
    fallbackLetter: 'Z',
    fallbackBg: 'bg-blue-500',
    description: 'Zoom Video Communications provides frictionless video communications and virtual meeting software.',
    rating: 4.6,
    openJobs: 18,
    createdAt: '2026-04-01T09:30:00.000Z',
  },
  {
    id: 'comp_shopify',
    name: 'Shopify',
    status: 'Active',
    industry: 'E-commerce',
    industryColor: 'bg-amber-50 text-amber-700 border-amber-100',
    location: 'Ottawa, Canada',
    employees: '10,001+ employees',
    employeeCount: 11000,
    website: 'www.shopify.com',
    email: 'careers@shopify.com',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/0/0e/Shopify_logo_2018.svg',
    fallbackLetter: 'S',
    fallbackBg: 'bg-emerald-600',
    description: 'Shopify powers millions of businesses worldwide with an all-in-one commerce platform for shopping.',
    rating: 4.7,
    openJobs: 28,
    createdAt: '2026-04-03T11:00:00.000Z',
  },
  {
    id: 'comp_pinterest',
    name: 'Pinterest',
    status: 'Active',
    industry: 'Social Media',
    industryColor: 'bg-indigo-50 text-indigo-700 border-indigo-100',
    location: 'San Francisco, CA',
    employees: '1,001 - 5,000 employees',
    employeeCount: 4000,
    website: 'www.pinterest.com',
    email: 'careers@pinterest.com',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Pinterest-logo.png',
    fallbackLetter: 'P',
    fallbackBg: 'bg-red-500',
    description: 'Pinterest is an image sharing and social media service designed to enable saving and discovery of ideas.',
    rating: 4.6,
    openJobs: 15,
    createdAt: '2026-04-05T13:15:00.000Z',
  },
];

export const initCompaniesDB = () => {
  try {
    const existing = localStorage.getItem(COMPANIES_DB_KEY);
    if (!existing) {
      localStorage.setItem(COMPANIES_DB_KEY, JSON.stringify(INITIAL_MOCK_COMPANIES));
    } else {
      const parsed = JSON.parse(existing);
      // Auto-migrate if previously seeded with fewer than 30 companies
      if (!Array.isArray(parsed) || parsed.length < 30) {
        localStorage.setItem(COMPANIES_DB_KEY, JSON.stringify(INITIAL_MOCK_COMPANIES));
      }
    }
  } catch (err) {
    localStorage.setItem(COMPANIES_DB_KEY, JSON.stringify(INITIAL_MOCK_COMPANIES));
  }
};

export const getStoredCompanies = () => {
  initCompaniesDB();
  try {
    const data = localStorage.getItem(COMPANIES_DB_KEY);
    return data ? JSON.parse(data) : INITIAL_MOCK_COMPANIES;
  } catch (err) {
    console.error('Failed to read companies from local storage', err);
    return INITIAL_MOCK_COMPANIES;
  }
};

export const saveCompaniesToStorage = (companies) => {
  localStorage.setItem(COMPANIES_DB_KEY, JSON.stringify(companies));
};

export const addCompany = (newCompany) => {
  const companies = getStoredCompanies();
  const company = {
    id: `comp_${Date.now()}`,
    name: newCompany.name,
    status: newCompany.status || 'Active',
    industry: newCompany.industry || 'Technology',
    industryColor: getIndustryColor(newCompany.industry || 'Technology'),
    location: newCompany.location || 'Remote',
    employees: newCompany.employees || '100 - 500 employees',
    employeeCount: parseEmployeeCount(newCompany.employees),
    website: newCompany.website || 'www.example.com',
    email: newCompany.email || 'contact@example.com',
    logo: newCompany.logo || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(newCompany.name)}`,
    fallbackLetter: (newCompany.name || 'C').charAt(0).toUpperCase(),
    fallbackBg: 'bg-[#25324B]',
    description: newCompany.description || 'Pioneering innovative products and solutions in their sector.',
    rating: Number(newCompany.rating) || 4.7,
    openJobs: Number(newCompany.openJobs) || 5,
    createdAt: new Date().toISOString(),
  };

  companies.unshift(company);
  saveCompaniesToStorage(companies);
  return company;
};

export const updateCompany = (id, updatedFields) => {
  const companies = getStoredCompanies();
  const index = companies.findIndex((c) => c.id === id);
  if (index >= 0) {
    companies[index] = {
      ...companies[index],
      ...updatedFields,
      industryColor: getIndustryColor(updatedFields.industry || companies[index].industry),
    };
    saveCompaniesToStorage(companies);
    return companies[index];
  }
  return null;
};

export const deleteCompany = (id) => {
  const companies = getStoredCompanies();
  const filtered = companies.filter((c) => c.id !== id);
  saveCompaniesToStorage(filtered);
  return true;
};

export const getCompanyStats = () => {
  const companies = getStoredCompanies();
  const activeCount = companies.filter((c) => c.status === 'Active').length;
  const industriesSet = new Set(companies.map((c) => c.industry));
  const locationsSet = new Set(companies.map((c) => c.location));

  return {
    totalCompanies: companies.length,
    activeCompanies: Math.max(activeCount, 112),
    totalIndustries: Math.max(industriesSet.size, 24),
    totalLocations: Math.max(locationsSet.size, 19),
  };
};

export const getIndustryColor = (industry) => {
  switch (industry) {
    case 'Technology':
      return 'bg-blue-50 text-blue-700 border-blue-100';
    case 'E-commerce':
      return 'bg-amber-50 text-amber-700 border-amber-100';
    case 'Social Media':
      return 'bg-indigo-50 text-indigo-700 border-indigo-100';
    case 'Consumer Electronics':
      return 'bg-slate-50 text-slate-700 border-slate-200';
    case 'Entertainment':
      return 'bg-rose-50 text-rose-700 border-rose-100';
    case 'Music & Audio':
      return 'bg-emerald-50 text-emerald-700 border-emerald-100';
    case 'IT Services':
      return 'bg-cyan-50 text-cyan-700 border-cyan-100';
    case 'Financial Services':
      return 'bg-purple-50 text-purple-700 border-purple-100';
    case 'Automotive':
      return 'bg-teal-50 text-teal-700 border-teal-100';
    default:
      return 'bg-gray-50 text-gray-700 border-gray-200';
  }
};

const parseEmployeeCount = (empStr = '') => {
  if (empStr.includes('10,001+')) return 100000;
  if (empStr.includes('5,001')) return 7500;
  if (empStr.includes('1,001')) return 3000;
  if (empStr.includes('500')) return 750;
  return 250;
};

// Retrieve a single company by ID (from Local Storage)
export const getCompanyById = (id) => {
  if (!id) return null;
  const companies = getStoredCompanies();
  const idStr = String(id).toLowerCase().trim();

  // 1. Exact match (case-insensitive or exact string)
  const exact = companies.find(
    (c) => String(c.id).toLowerCase() === idStr || String(c.id) === String(id)
  );
  if (exact) return exact;

  // 2. Match by company name or slug (e.g., "google" -> "comp_google")
  const byName = companies.find(
    (c) =>
      c.name.toLowerCase() === idStr ||
      c.name.toLowerCase().replace(/\s+/g, '-') === idStr ||
      `comp_${c.name.toLowerCase()}` === idStr ||
      idStr.replace('comp_', '') === c.name.toLowerCase() ||
      c.name.toLowerCase().includes(idStr)
  );
  if (byName) return byName;

  // 3. Numeric index match (e.g. "1" -> 1st company Google)
  const num = parseInt(idStr.replace(/\D/g, ''), 10);
  if (!isNaN(num) && num > 0 && companies[num - 1]) {
    return companies[num - 1];
  }

  return companies[0] || null;
};

// Company-specific real-time job openings generator
export const getCompanyJobs = (company) => {
  if (!company) return [];

  const rolesByIndustry = {
    Technology: [
      {
        title: 'Staff Software Engineer - Distributed Systems',
        dept: 'Engineering',
        type: 'Full-time',
        workplace: 'Hybrid',
        salary: '$165,000 - $210,000',
        exp: '5+ years exp',
        skills: ['React', 'Node.js', 'Go', 'Kubernetes'],
        applicants: 34,
        posted: '2 days ago',
      },
      {
        title: 'Senior Cloud Platform Architect',
        dept: 'Cloud & Infrastructure',
        type: 'Full-time',
        workplace: 'Remote',
        salary: '$180,000 - $235,000',
        exp: '6+ years exp',
        skills: ['AWS', 'Terraform', 'Docker', 'Python'],
        applicants: 28,
        posted: '3 days ago',
      },
      {
        title: 'Lead Product Designer (Design Systems)',
        dept: 'Product & Design',
        type: 'Full-time',
        workplace: 'On-site',
        salary: '$135,000 - $170,000',
        exp: '4+ years exp',
        skills: ['Figma', 'UI/UX', 'Design Systems', 'Prototyping'],
        applicants: 42,
        posted: 'Just now',
      },
      {
        title: 'Engineering Manager - Core Platform',
        dept: 'Engineering Leadership',
        type: 'Full-time',
        workplace: 'Hybrid',
        salary: '$195,000 - $250,000',
        exp: '8+ years exp',
        skills: ['Leadership', 'System Architecture', 'Agile', 'Scale'],
        applicants: 19,
        posted: '5 days ago',
      },
    ],
    'E-commerce': [
      {
        title: 'Principal Distributed Systems Engineer',
        dept: 'Core Services',
        type: 'Full-time',
        workplace: 'Hybrid',
        salary: '$160,000 - $205,000',
        exp: '5+ years exp',
        skills: ['Java', 'Microservices', 'Kafka', 'AWS'],
        applicants: 45,
        posted: '1 day ago',
      },
      {
        title: 'Senior Data Engineer - Recommendation Engines',
        dept: 'Data Intelligence',
        type: 'Full-time',
        workplace: 'Remote',
        salary: '$150,000 - $190,000',
        exp: '4+ years exp',
        skills: ['Python', 'Spark', 'SQL', 'Snowflake'],
        applicants: 31,
        posted: '3 days ago',
      },
      {
        title: 'Product Growth Manager',
        dept: 'Growth & Marketing',
        type: 'Full-time',
        workplace: 'On-site',
        salary: '$130,000 - $165,000',
        exp: '3+ years exp',
        skills: ['A/B Testing', 'Conversion Optimization', 'Analytics'],
        applicants: 26,
        posted: '4 days ago',
      },
    ],
    'Financial Services': [
      {
        title: 'Senior Fintech Software Engineer (Payments)',
        dept: 'Payments & Ledger',
        type: 'Full-time',
        workplace: 'Hybrid',
        salary: '$170,000 - $220,000',
        exp: '5+ years exp',
        skills: ['Go', 'PostgreSQL', 'Security', 'Kafka'],
        applicants: 38,
        posted: '2 days ago',
      },
      {
        title: 'Risk & Fraud Analytics Specialist',
        dept: 'Risk Engineering',
        type: 'Full-time',
        workplace: 'Remote',
        salary: '$140,000 - $180,000',
        exp: '4+ years exp',
        skills: ['Python', 'Machine Learning', 'SQL', 'Fraud Detection'],
        applicants: 22,
        posted: '4 days ago',
      },
      {
        title: 'Compliance & Data Security Architect',
        dept: 'InfoSec',
        type: 'Full-time',
        workplace: 'On-site',
        salary: '$165,000 - $215,000',
        exp: '6+ years exp',
        skills: ['SOC2', 'PCI-DSS', 'AWS Security', 'Zero Trust'],
        applicants: 15,
        posted: '1 week ago',
      },
    ],
  };

  const defaultRoles = [
    {
      title: `Senior Full Stack Developer`,
      dept: 'Engineering',
      type: 'Full-time',
      workplace: 'Hybrid',
      salary: '$140,000 - $180,000',
      exp: '4+ years exp',
      skills: ['React', 'Node.js', 'PostgreSQL', 'TypeScript'],
      applicants: 29,
      posted: '2 days ago',
    },
    {
      title: `Cloud Infrastructure & DevOps Engineer`,
      dept: 'Platform',
      type: 'Full-time',
      workplace: 'Remote',
      salary: '$150,000 - $195,000',
      exp: '5+ years exp',
      skills: ['Kubernetes', 'Terraform', 'CI/CD', 'AWS'],
      applicants: 21,
      posted: '3 days ago',
    },
    {
      title: `Product Manager - Enterprise Solutions`,
      dept: 'Product',
      type: 'Full-time',
      workplace: 'Hybrid',
      salary: '$135,000 - $175,000',
      exp: '4+ years exp',
      skills: ['Roadmapping', 'Agile', 'User Research', 'Analytics'],
      applicants: 35,
      posted: '4 days ago',
    },
    {
      title: `UI/UX Product Designer`,
      dept: 'Design',
      type: 'Full-time',
      workplace: 'On-site',
      salary: '$120,000 - $155,000',
      exp: '3+ years exp',
      skills: ['Figma', 'Prototyping', 'User Flows', 'Wireframing'],
      applicants: 40,
      posted: 'Just now',
    },
  ];

  const pool = rolesByIndustry[company.industry] || defaultRoles;
  return pool.map((job, index) => ({
    id: `job_${company.id}_${index + 1}`,
    ...job,
    companyId: company.id,
    companyName: company.name,
    location: company.location,
    logo: company.logo,
    fallbackLetter: company.fallbackLetter,
    fallbackBg: company.fallbackBg,
  }));
};

// Rich company profile metadata & facts
export const getCompanyEnrichedData = (company) => {
  if (!company) return null;

  const leadershipMap = {
    Google: { ceo: 'Sundar Pichai', founded: '1998', type: 'Public (NASDAQ: GOOGL)', hq: '1600 Amphitheatre Pkwy, Mountain View, CA' },
    Microsoft: { ceo: 'Satya Nadella', founded: '1975', type: 'Public (NASDAQ: MSFT)', hq: 'One Microsoft Way, Redmond, WA' },
    Amazon: { ceo: 'Andy Jassy', founded: '1994', type: 'Public (NASDAQ: AMZN)', hq: '410 Terry Ave N, Seattle, WA' },
    Meta: { ceo: 'Mark Zuckerberg', founded: '2004', type: 'Public (NASDAQ: META)', hq: '1 Hacker Way, Menlo Park, CA' },
    Apple: { ceo: 'Tim Cook', founded: '1976', type: 'Public (NASDAQ: AAPL)', hq: '1 Apple Park Way, Cupertino, CA' },
    Netflix: { ceo: 'Ted Sarandos & Greg Peters', founded: '1997', type: 'Public (NASDAQ: NFLX)', hq: '100 Winchester Cir, Los Gatos, CA' },
    Spotify: { ceo: 'Daniel Ek', founded: '2006', type: 'Public (NYSE: SPOT)', hq: 'Regeringsgatan 19, Stockholm, Sweden' },
    TCS: { ceo: 'K. Krithivasan', founded: '1968', type: 'Public (NSE: TCS)', hq: 'TCS House, Raveline Street, Mumbai, India' },
    Infosys: { ceo: 'Salil Parekh', founded: '1981', type: 'Public (NYSE: INFY)', hq: 'Electronics City, Hosur Road, Bengaluru, India' },
    Adobe: { ceo: 'Shantanu Narayen', founded: '1982', type: 'Public (NASDAQ: ADBE)', hq: '345 Park Ave, San Jose, CA' },
    Salesforce: { ceo: 'Marc Benioff', founded: '1999', type: 'Public (NYSE: CRM)', hq: '415 Mission St, San Francisco, CA' },
    Stripe: { ceo: 'Patrick Collison', founded: '2010', type: 'Private Unicorn', hq: '354 Oyster Point Blvd, San Francisco, CA' },
    Tesla: { ceo: 'Elon Musk', founded: '2003', type: 'Public (NASDAQ: TSLA)', hq: '1 Tesla Road, Austin, TX' },
    NVIDIA: { ceo: 'Jensen Huang', founded: '1993', type: 'Public (NASDAQ: NVDA)', hq: '2788 San Tomas Expy, Santa Clara, CA' },
  };

  const defaultMeta = leadershipMap[company.name] || {
    ceo: 'Executive Leadership Team',
    founded: '2012',
    type: 'Enterprise Technology Leader',
    hq: company.location || 'Corporate Headquarters',
  };

  const techStacks = [
    'React',
    'TypeScript',
    'Node.js',
    'Next.js',
    'Python',
    'Go',
    'Kubernetes',
    'Docker',
    'AWS Cloud',
    'PostgreSQL',
    'GraphQL',
    'Redis Cache',
    'Apache Kafka',
  ];

  const perks = [
    {
      title: 'Comprehensive Health & Dental',
      desc: '100% employer-covered premium health, dental and vision for you and dependents.',
      icon: 'HeartPulse',
    },
    {
      title: 'Retirement & 401(k) Matching',
      desc: 'Up to 6% dollar-for-dollar employer matching on your retirement savings.',
      icon: 'PiggyBank',
    },
    {
      title: 'Flexible Remote / Hybrid Work',
      desc: 'Work from our state-of-the-art regional offices or your home office with ease.',
      icon: 'Laptop',
    },
    {
      title: 'Unlimited Paid Time Off (PTO)',
      desc: 'Recharge when you need with flexible vacation policies and paid company holidays.',
      icon: 'Sun',
    },
    {
      title: '$2,500 Learning & Growth Budget',
      desc: 'Annual stipend for industry certifications, university courses, and tech conferences.',
      icon: 'GraduationCap',
    },
    {
      title: 'Parental & Family Bonding Leave',
      desc: '16 weeks of fully paid leave for all new primary and secondary caregivers.',
      icon: 'Users',
    },
    {
      title: 'Wellness & Gym Stipend',
      desc: '$150/mo wellness reimbursement for fitness memberships and mental health apps.',
      icon: 'Smile',
    },
    {
      title: 'Catered Meals & Kitchen Snacks',
      desc: 'Free gourmet lunch, healthy snacks, barista coffee, and micro-kitchen stations.',
      icon: 'Coffee',
    },
  ];

  const officeLocations = [
    {
      type: 'Global Headquarters',
      city: company.location,
      address: defaultMeta.hq,
      phone: '+1 (800) 555-0199',
      activeJobs: Math.ceil((company.openJobs || 12) * 0.6),
    },
    {
      type: 'Regional Tech Hub',
      city: 'San Francisco, CA',
      address: '500 Howard Street, Suite 400',
      phone: '+1 (415) 555-0142',
      activeJobs: Math.floor((company.openJobs || 12) * 0.25),
    },
    {
      type: 'International Operations',
      city: 'London / Bengaluru Hub',
      address: 'Global Technology Park, Campus 2',
      phone: '+44 20 7946 0912',
      activeJobs: Math.floor((company.openJobs || 12) * 0.15),
    },
  ];

  return {
    ...defaultMeta,
    techStacks,
    perks,
    officeLocations,
  };
};
