// Job Postings Service with LocalStorage persistence for Module 4
import { getStoredCompanies } from './companiesService';

const JOBS_DB_KEY = 'jobportal_jobs_module4';

export const INITIAL_MOCK_JOBS = [
  // Page 1: Exact 10 jobs matching reference image media_1792990242598_f8bde101.png
  {
    id: 'job_01',
    title: 'Frontend Developer',
    postedTime: 'Posted 2 days ago',
    companyName: 'Google',
    companyIndustry: 'Technology',
    companyLogo: 'https://www.gstatic.com/images/branding/product/2x/googleg_48dp.png',
    fallbackLetter: 'G',
    fallbackBg: 'bg-red-500',
    category: 'IT & Software',
    employmentType: 'Full Time',
    workplaceType: 'On-site',
    location: 'Bengaluru, KA',
    salaryRange: '$80k - $120k',
    minSalary: 80000,
    maxSalary: 120000,
    experience: '2-5 years',
    status: 'Open',
    applicationsCount: 48,
    featured: true,
    skills: ['React', 'TypeScript', 'Tailwind CSS', 'JavaScript', 'HTML5', 'Next.js'],
    description: 'Looking for an experienced Frontend Engineer with deep expertise in React.js, Tailwind CSS, TypeScript and high-performance Web APIs.',
    requirements: ['2+ years of React development', 'Solid TypeScript skills', 'Experience with responsive UI and state management'],
    createdAt: '2026-10-24T08:00:00.000Z',
  },
  {
    id: 'job_02',
    title: 'Software Engineer',
    postedTime: 'Posted 3 days ago',
    companyName: 'Microsoft',
    companyIndustry: 'Technology',
    companyLogo: 'https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg',
    fallbackLetter: 'M',
    fallbackBg: 'bg-blue-600',
    category: 'IT & Software',
    employmentType: 'Full Time',
    workplaceType: 'Hybrid',
    location: 'Hyderabad, TS',
    salaryRange: '$70k - $110k',
    minSalary: 70000,
    maxSalary: 110000,
    experience: '3-6 years',
    status: 'Open',
    applicationsCount: 72,
    featured: true,
    skills: ['C#', '.NET Core', 'Azure', 'SQL Server', 'Microservices'],
    description: 'Build mission-critical distributed cloud services, microservices and RESTful / gRPC APIs on Azure infrastructure.',
    requirements: ['Strong knowledge of Node.js / C# / Python', 'Experience with relational and NoSQL databases', 'Cloud architecture skills'],
    createdAt: '2026-10-23T09:30:00.000Z',
  },
  {
    id: 'job_03',
    title: 'Backend Developer',
    postedTime: 'Posted 4 days ago',
    companyName: 'Amazon',
    companyIndustry: 'E-commerce',
    companyLogo: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg',
    fallbackLetter: 'A',
    fallbackBg: 'bg-orange-500',
    category: 'IT & Software',
    employmentType: 'Full Time',
    workplaceType: 'Hybrid',
    location: 'Seattle, WA',
    salaryRange: '$90k - $140k',
    minSalary: 90000,
    maxSalary: 140000,
    experience: '2-5 years',
    status: 'Open',
    applicationsCount: 38,
    featured: true,
    skills: ['Java', 'Python', 'AWS', 'DynamoDB', 'REST APIs', 'Docker'],
    description: 'Design and operate massively scalable cloud infrastructure and server-side APIs powering global retail operations.',
    requirements: ['Proficiency in Java, Python, or Go', 'Strong cloud infrastructure knowledge (AWS)', 'Distributed system architecture'],
    createdAt: '2026-10-22T14:15:00.000Z',
  },
  {
    id: 'job_04',
    title: 'DevOps Engineer',
    postedTime: 'Posted 5 days ago',
    companyName: 'Meta',
    companyIndustry: 'Social Media',
    companyLogo: 'https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg',
    fallbackLetter: 'M',
    fallbackBg: 'bg-blue-500',
    category: 'DevOps',
    employmentType: 'Full Time',
    workplaceType: 'Remote',
    location: 'San Francisco, CA',
    salaryRange: '$100k - $150k',
    minSalary: 100000,
    maxSalary: 150000,
    experience: '3-6 years',
    status: 'Open',
    applicationsCount: 55,
    featured: true,
    skills: ['Kubernetes', 'Docker', 'Terraform', 'CI/CD', 'Linux', 'AWS'],
    description: 'Drive reliability, scalability, and automated deployments for global social connection platforms and data center systems.',
    requirements: ['3+ years in DevOps / SRE', 'Expertise with Kubernetes, Docker & CI/CD', 'Strong infrastructure-as-code experience'],
    createdAt: '2026-10-21T16:00:00.000Z',
  },
  {
    id: 'job_05',
    title: 'UI/UX Designer',
    postedTime: 'Posted 6 days ago',
    companyName: 'Apple',
    companyIndustry: 'Technology',
    companyLogo: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg',
    fallbackLetter: 'A',
    fallbackBg: 'bg-gray-800',
    category: 'Design',
    employmentType: 'Part Time',
    workplaceType: 'Hybrid',
    location: 'Austin, TX',
    salaryRange: '$60k - $90k',
    minSalary: 60000,
    maxSalary: 90000,
    experience: '2-4 years',
    status: 'Open',
    applicationsCount: 61,
    featured: false,
    skills: ['Figma', 'UI Design', 'UX Research', 'Design Systems', 'Prototyping'],
    description: 'Create intuitive, elegant user interfaces and delightful digital experiences that set global industry design standards.',
    requirements: ['Expertise in Figma & design systems', 'Proven portfolio in user-centered product design', 'Strong prototyping abilities'],
    createdAt: '2026-10-20T11:00:00.000Z',
  },
  {
    id: 'job_06',
    title: 'QA Engineer',
    postedTime: 'Posted 1 week ago',
    companyName: 'Netflix',
    companyIndustry: 'Entertainment',
    companyLogo: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg',
    fallbackLetter: 'N',
    fallbackBg: 'bg-red-600',
    category: 'QA & Testing',
    employmentType: 'Full Time',
    location: 'Los Angeles, CA',
    salaryRange: '$60k - $100k',
    experience: '2-5 years',
    status: 'Open',
    applicationsCount: 44,
    featured: false,
    description: 'Ensure flawless streaming playback and user experiences across TV, web, and mobile streaming client devices.',
    requirements: ['Automated test frameworks (Cypress, Playwright)', 'API testing with Postman', 'Performance benchmarking experience'],
    createdAt: '2026-10-16T10:00:00.000Z',
  },
  {
    id: 'job_07',
    title: 'DevOps Engineer',
    postedTime: 'Posted 1 week ago',
    companyName: 'Spotify',
    companyIndustry: 'Music & Audio',
    companyLogo: 'https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_without_text.svg',
    fallbackLetter: 'S',
    fallbackBg: 'bg-green-600',
    category: 'DevOps',
    employmentType: 'Full Time',
    location: 'Stockholm, SE',
    salaryRange: '$80k - $120k',
    experience: '3-6 years',
    status: 'Closed',
    applicationsCount: 32,
    featured: false,
    description: 'Manage automated deployment pipelines, Kubernetes container orchestration, and multi-region cloud uptime.',
    requirements: ['Docker & Kubernetes administration', 'CI/CD pipeline architecture with GitHub Actions', 'Infrastructure as Code (Terraform)'],
    createdAt: '2026-10-15T12:30:00.000Z',
  },
  {
    id: 'job_08',
    title: 'Mobile App Developer',
    postedTime: 'Posted 1 week ago',
    companyName: 'TCS',
    companyIndustry: 'IT Services',
    companyLogo: 'https://upload.wikimedia.org/wikipedia/commons/b/b1/Tata_Consultancy_Services_Logo.svg',
    fallbackLetter: 'T',
    fallbackBg: 'bg-sky-600',
    category: 'Mobile Development',
    employmentType: 'Contract',
    location: 'Chennai, TN',
    salaryRange: '$50k - $80k',
    experience: '1-4 years',
    status: 'Open',
    applicationsCount: 27,
    featured: false,
    description: 'Design and build cross-platform mobile apps for enterprise banking and logistics clients.',
    requirements: ['React Native or Flutter mastery', 'App Store and Google Play publishing workflow', 'REST API integration'],
    createdAt: '2026-10-14T09:00:00.000Z',
  },
  {
    id: 'job_09',
    title: 'System Administrator',
    postedTime: 'Posted 2 weeks ago',
    companyName: 'Infosys',
    companyIndustry: 'IT Services',
    companyLogo: 'https://upload.wikimedia.org/wikipedia/commons/9/95/Infosys_logo.svg',
    fallbackLetter: 'I',
    fallbackBg: 'bg-blue-700',
    category: 'IT Support',
    employmentType: 'Full Time',
    location: 'Pune, MH',
    salaryRange: '$40k - $70k',
    experience: '2-5 years',
    status: 'Open',
    applicationsCount: 23,
    featured: false,
    description: 'Maintain corporate Linux / Windows server networks, security access policies, and enterprise hardware environments.',
    requirements: ['Linux server management (Ubuntu, RHEL)', 'Network configuration, VPNs, and firewalls', 'User directory access management'],
    createdAt: '2026-10-09T08:45:00.000Z',
  },
  {
    id: 'job_10',
    title: 'Full Stack Developer',
    postedTime: 'Posted 2 weeks ago',
    companyName: 'Wipro',
    companyIndustry: 'IT Services',
    companyLogo: 'https://upload.wikimedia.org/wikipedia/commons/a/a0/Wipro_Primary_Logo_Color_RGB.svg',
    fallbackLetter: 'W',
    fallbackBg: 'bg-indigo-700',
    category: 'IT & Software',
    employmentType: 'Full Time',
    location: 'Bengaluru, KA',
    salaryRange: '$70k - $110k',
    experience: '3-6 years',
    status: 'Closed',
    applicationsCount: 19,
    featured: false,
    description: 'Develop full stack web applications utilizing modern JavaScript frameworks, relational databases, and microservices.',
    requirements: ['React.js, Node.js, Express', 'PostgreSQL or MongoDB', 'Agile sprint delivery experience'],
    createdAt: '2026-10-08T14:00:00.000Z',
  },

  // Page 2 & 3: Additional 14 jobs (Total = 24 jobs matching stats)
  {
    id: 'job_11',
    title: 'Cloud Infrastructure Architect',
    postedTime: 'Posted 2 weeks ago',
    companyName: 'Tesla',
    companyIndustry: 'Automotive',
    companyLogo: 'https://upload.wikimedia.org/wikipedia/commons/e/e8/Tesla_logo.png',
    fallbackLetter: 'T',
    fallbackBg: 'bg-red-600',
    category: 'DevOps',
    employmentType: 'Full Time',
    location: 'Austin, TX',
    salaryRange: '$130k - $175k',
    experience: '5-8 years',
    status: 'Open',
    applicationsCount: 18,
    featured: true,
    description: 'Design global telemetry infrastructure for connected electric vehicles and energy storage grids.',
    requirements: ['Large scale Kubernetes', 'IoT stream processing', 'AWS & bare metal servers'],
    createdAt: '2026-10-07T11:00:00.000Z',
  },
  {
    id: 'job_12',
    title: 'Creative Cloud Security Specialist',
    postedTime: 'Posted 2 weeks ago',
    companyName: 'Adobe',
    companyIndustry: 'Technology',
    companyLogo: 'https://upload.wikimedia.org/wikipedia/commons/7/7b/Adobe_Systems_logo_and_wordmark.svg',
    fallbackLetter: 'A',
    fallbackBg: 'bg-red-600',
    category: 'IT & Software',
    employmentType: 'Full Time',
    location: 'San Jose, CA',
    salaryRange: '$95k - $135k',
    experience: '4-7 years',
    status: 'Open',
    applicationsCount: 14,
    featured: false,
    description: 'Secure digital document workflows and cloud collaboration for millions of global subscribers.',
    requirements: ['AppSec & code audit skills', 'Threat modeling and vulnerability management', 'SOC2 / GDPR compliance'],
    createdAt: '2026-10-06T15:20:00.000Z',
  },
  {
    id: 'job_13',
    title: 'AI Acceleration & CUDA Engineer',
    postedTime: 'Posted 3 weeks ago',
    companyName: 'NVIDIA',
    companyIndustry: 'Technology',
    companyLogo: 'https://upload.wikimedia.org/wikipedia/commons/2/21/Nvidia_logo.svg',
    fallbackLetter: 'N',
    fallbackBg: 'bg-emerald-600',
    category: 'Data Science',
    employmentType: 'Full Time',
    location: 'Santa Clara, CA',
    salaryRange: '$140k - $190k',
    experience: '3-6 years',
    status: 'Open',
    applicationsCount: 22,
    featured: true,
    description: 'Optimize high-throughput neural network training workloads on GPU accelerator hardware.',
    requirements: ['C++, Python, CUDA runtime', 'Deep Learning frameworks (PyTorch, TensorRT)', 'Kernel optimization'],
    createdAt: '2026-10-04T10:00:00.000Z',
  },
  {
    id: 'job_14',
    title: 'Enterprise CRM Solutions Architect',
    postedTime: 'Posted 3 weeks ago',
    companyName: 'Salesforce',
    companyIndustry: 'Technology',
    companyLogo: 'https://upload.wikimedia.org/wikipedia/commons/f/f9/Salesforce.com_logo.svg',
    fallbackLetter: 'S',
    fallbackBg: 'bg-sky-500',
    category: 'IT & Software',
    employmentType: 'Full Time',
    location: 'San Francisco, CA',
    salaryRange: '$85k - $125k',
    experience: '2-5 years',
    status: 'Open',
    applicationsCount: 11,
    featured: false,
    description: 'Architect custom enterprise workflows, Apex integrations, and Lightning components.',
    requirements: ['Salesforce Certified Architect or Developer', 'REST API integrations', 'Data migration mastery'],
    createdAt: '2026-10-02T13:40:00.000Z',
  },
  {
    id: 'job_15',
    title: 'Payment Gateway Infrastructure Engineer',
    postedTime: 'Posted 3 weeks ago',
    companyName: 'Stripe',
    companyIndustry: 'Financial Services',
    companyLogo: 'https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg',
    fallbackLetter: 'S',
    fallbackBg: 'bg-indigo-600',
    category: 'IT & Software',
    employmentType: 'Full Time',
    location: 'San Francisco, CA',
    salaryRange: '$120k - $160k',
    experience: '4-7 years',
    status: 'Open',
    applicationsCount: 16,
    featured: false,
    description: 'Build fault-tolerant payment rails processing billions in multi-currency transactions worldwide.',
    requirements: ['Golang or Java distributed backend', 'ACID database design', 'PCI-DSS level security'],
    createdAt: '2026-10-01T09:15:00.000Z',
  },
  {
    id: 'job_16',
    title: 'Site Reliability Engineer - Dispatch',
    postedTime: 'Posted 3 weeks ago',
    companyName: 'Uber',
    companyIndustry: 'Technology',
    companyLogo: 'https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png',
    fallbackLetter: 'U',
    fallbackBg: 'bg-black',
    category: 'DevOps',
    employmentType: 'Full Time',
    location: 'San Francisco, CA',
    salaryRange: '$110k - $150k',
    experience: '3-6 years',
    status: 'Closed',
    applicationsCount: 12,
    featured: false,
    description: 'Ensure 99.999% uptime for real-time driver-rider dispatching algorithms across the globe.',
    requirements: ['Chaos engineering experience', 'Prometheus, Grafana and alerting systems', 'Golang debugging'],
    createdAt: '2026-09-29T16:00:00.000Z',
  },
  {
    id: 'job_17',
    title: 'Growth & Marketplace Operations Lead',
    postedTime: 'Posted 1 month ago',
    companyName: 'Airbnb',
    companyIndustry: 'Entertainment',
    companyLogo: 'https://upload.wikimedia.org/wikipedia/commons/6/69/Airbnb_Logo_B%C3%A9lo.svg',
    fallbackLetter: 'A',
    fallbackBg: 'bg-rose-500',
    category: 'Product',
    employmentType: 'Full Time',
    location: 'San Francisco, CA',
    salaryRange: '$75k - $110k',
    experience: '3-5 years',
    status: 'Open',
    applicationsCount: 13,
    featured: false,
    description: 'Scale host community programs and optimize guest conversion funnels.',
    requirements: ['Marketplace economics analysis', 'SQL data modeling', 'Product operations background'],
    createdAt: '2026-09-25T11:00:00.000Z',
  },
  {
    id: 'job_18',
    title: 'Semiconductor Hardware Architect',
    postedTime: 'Posted 1 month ago',
    companyName: 'Intel',
    companyIndustry: 'Consumer Electronics',
    companyLogo: 'https://upload.wikimedia.org/wikipedia/commons/7/7d/Intel_logo_%282020%29.svg',
    fallbackLetter: 'I',
    fallbackBg: 'bg-blue-700',
    category: 'IT & Software',
    employmentType: 'Full Time',
    location: 'Santa Clara, CA',
    salaryRange: '$90k - $130k',
    experience: '4-8 years',
    status: 'Closed',
    applicationsCount: 8,
    featured: false,
    description: 'Design and verify next-generation x86 multi-core processor microarchitectures.',
    requirements: ['Verilog / SystemVerilog', 'VLSI design verification', 'Microprocessor pipelining'],
    createdAt: '2026-09-22T08:30:00.000Z',
  },
  {
    id: 'job_19',
    title: 'Enterprise Database Administrator',
    postedTime: 'Posted 1 month ago',
    companyName: 'Oracle',
    companyIndustry: 'Technology',
    companyLogo: 'https://upload.wikimedia.org/wikipedia/commons/5/50/Oracle_logo.svg',
    fallbackLetter: 'O',
    fallbackBg: 'bg-red-700',
    category: 'IT Support',
    employmentType: 'Full Time',
    location: 'Austin, TX',
    salaryRange: '$80k - $115k',
    experience: '3-6 years',
    status: 'Open',
    applicationsCount: 10,
    featured: false,
    description: 'Maintain Autonomous Database instances, disaster recovery replication, and query tuning.',
    requirements: ['Oracle Exadata / Autonomous DB', 'High availability clustering (RAC)', 'PL/SQL optimization'],
    createdAt: '2026-09-18T14:45:00.000Z',
  },
  {
    id: 'job_20',
    title: 'Global Network Security Engineer',
    postedTime: 'Posted 1 month ago',
    companyName: 'Cisco',
    companyIndustry: 'Technology',
    companyLogo: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Cisco_logo_blue_2016.svg',
    fallbackLetter: 'C',
    fallbackBg: 'bg-cyan-600',
    category: 'IT Support',
    employmentType: 'Full Time',
    location: 'San Jose, CA',
    salaryRange: '$85k - $120k',
    experience: '3-6 years',
    status: 'Closed',
    applicationsCount: 7,
    featured: false,
    description: 'Deploy enterprise SD-WAN, firewall rules, and zero-trust perimeter defense.',
    requirements: ['CCNP / CCIE certification preferred', 'BGP, OSPF routing', 'Cisco Meraki & Catalyst'],
    createdAt: '2026-09-15T10:00:00.000Z',
  },
  {
    id: 'job_21',
    title: 'Generative AI Research Engineer',
    postedTime: 'Posted 1 month ago',
    companyName: 'IBM',
    companyIndustry: 'IT Services',
    companyLogo: 'https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg',
    fallbackLetter: 'I',
    fallbackBg: 'bg-blue-800',
    category: 'Data Science',
    employmentType: 'Full Time',
    location: 'Armonk, NY',
    salaryRange: '$125k - $165k',
    experience: '4-7 years',
    status: 'Open',
    applicationsCount: 15,
    featured: false,
    description: 'Conduct applied research on enterprise Foundation Models and watsonx AI orchestration.',
    requirements: ['LLM fine-tuning & prompt engineering', 'PyTorch / HuggingFace', 'Vector DBs (Milvus, Pinecone)'],
    createdAt: '2026-09-12T13:20:00.000Z',
  },
  {
    id: 'job_22',
    title: 'Professional Network Product Lead',
    postedTime: 'Posted 1 month ago',
    companyName: 'LinkedIn',
    companyIndustry: 'Social Media',
    companyLogo: 'https://upload.wikimedia.org/wikipedia/commons/c/ca/LinkedIn_logo_initials.png',
    fallbackLetter: 'L',
    fallbackBg: 'bg-blue-600',
    category: 'Product',
    employmentType: 'Full Time',
    location: 'Sunnyvale, CA',
    salaryRange: '$90k - $130k',
    experience: '3-6 years',
    status: 'Open',
    applicationsCount: 11,
    featured: false,
    description: 'Own career marketplace matching features connecting professionals with dream opportunities.',
    requirements: ['B2B & B2C product lifecycle', 'Recommendation algorithm collaboration', 'UX wireframing'],
    createdAt: '2026-09-08T11:00:00.000Z',
  },
  {
    id: 'job_23',
    title: 'Frontend Web Engineer - Live Feed',
    postedTime: 'Posted 1 month ago',
    companyName: 'Twitter',
    companyIndustry: 'Social Media',
    companyLogo: 'https://upload.wikimedia.org/wikipedia/commons/6/6f/Logo_of_Twitter.svg',
    fallbackLetter: 'X',
    fallbackBg: 'bg-black',
    category: 'IT & Software',
    employmentType: 'Contract',
    location: 'San Francisco, CA',
    salaryRange: '$75k - $105k',
    experience: '2-4 years',
    status: 'Closed',
    applicationsCount: 5,
    featured: false,
    description: 'Optimize high-concurrency live timeline feeds and low-latency websocket messaging.',
    requirements: ['React, TypeScript, WebSockets', 'Virtual DOM optimization', 'SSR performance'],
    createdAt: '2026-09-05T09:30:00.000Z',
  },
  {
    id: 'job_24',
    title: 'FinTech Merchant Engineering Lead',
    postedTime: 'Posted 1 month ago',
    companyName: 'PayPal',
    companyIndustry: 'Financial Services',
    companyLogo: 'https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg',
    fallbackLetter: 'P',
    fallbackBg: 'bg-blue-700',
    category: 'IT & Software',
    employmentType: 'Full Time',
    location: 'San Jose, CA',
    salaryRange: '$105k - $145k',
    experience: '4-7 years',
    status: 'Open',
    applicationsCount: 14,
    featured: false,
    description: 'Lead engineering teams developing global checkout SDKs and merchant commerce tools.',
    requirements: ['Java Spring Boot / Node.js', 'High availability payment processing', 'Global compliance'],
    createdAt: '2026-09-01T10:00:00.000Z',
  },
];

// Generate full realistic 124 jobs based on companies in companiesService.js
export const generate124Jobs = (baseJobs = INITIAL_MOCK_JOBS) => {
  const allCompanies = getStoredCompanies();
  const jobs = [...baseJobs];

  const titlesAndSkills = [
    { title: 'Full Stack Developer', category: 'IT & Software', skills: ['React', 'Node.js', 'MongoDB', 'Express', 'TypeScript'], minSalary: 85000, maxSalary: 130000, salaryRange: '$85k - $130k', exp: '2-5 years' },
    { title: 'Cloud Solutions Architect', category: 'IT & Software', skills: ['AWS', 'Azure', 'GCP', 'Architecture', 'Kubernetes'], minSalary: 120000, maxSalary: 180000, salaryRange: '$120k - $180k', exp: '5+ years' },
    { title: 'Data Scientist', category: 'Data Science', skills: ['Python', 'Pandas', 'Machine Learning', 'SQL', 'TensorFlow'], minSalary: 95000, maxSalary: 145000, salaryRange: '$95k - $145k', exp: '3-6 years' },
    { title: 'Machine Learning Engineer', category: 'Data Science', skills: ['PyTorch', 'Python', 'MLOps', 'Deep Learning', 'Computer Vision'], minSalary: 110000, maxSalary: 165000, salaryRange: '$110k - $165k', exp: '3-7 years' },
    { title: 'Product Manager', category: 'Product', skills: ['Roadmapping', 'Agile', 'User Stories', 'A/B Testing', 'Analytics'], minSalary: 100000, maxSalary: 155000, salaryRange: '$100k - $155k', exp: '4-8 years' },
    { title: 'QA Automation Engineer', category: 'QA & Testing', skills: ['Selenium', 'Cypress', 'Playwright', 'Jest', 'Postman'], minSalary: 65000, maxSalary: 105000, salaryRange: '$65k - $105k', exp: '2-5 years' },
    { title: 'Cybersecurity Analyst', category: 'Security', skills: ['SIEM', 'Penetration Testing', 'Network Security', 'Firewalls', 'Compliance'], minSalary: 85000, maxSalary: 135000, salaryRange: '$85k - $135k', exp: '3-6 years' },
    { title: 'Mobile App Developer', category: 'IT & Software', skills: ['React Native', 'Flutter', 'iOS', 'Android', 'Swift'], minSalary: 75000, maxSalary: 125000, salaryRange: '$75k - $125k', exp: '2-5 years' },
    { title: 'Database Administrator', category: 'IT & Software', skills: ['PostgreSQL', 'Oracle', 'MySQL', 'Performance Tuning', 'Backup'], minSalary: 80000, maxSalary: 120000, salaryRange: '$80k - $120k', exp: '3-6 years' },
    { title: 'Technical Product Owner', category: 'Product', skills: ['Scrum', 'Backlog Refinement', 'Jira', 'API Design', 'Stakeholder Mgmt'], minSalary: 90000, maxSalary: 140000, salaryRange: '$90k - $140k', exp: '3-6 years' },
    { title: 'Systems Engineer', category: 'IT & Software', skills: ['Linux', 'Bash', 'Networking', 'VMware', 'Troubleshooting'], minSalary: 70000, maxSalary: 110000, salaryRange: '$70k - $110k', exp: '2-5 years' },
    { title: 'Business Analyst', category: 'Business', skills: ['Requirement Gathering', 'SQL', 'Tableau', 'PowerBI', 'Excel'], minSalary: 65000, maxSalary: 100000, salaryRange: '$65k - $100k', exp: '1-3 years' },
    { title: 'Salesforce Developer', category: 'IT & Software', skills: ['Apex', 'Visualforce', 'LWC', 'Sales Cloud', 'SOQL'], minSalary: 80000, maxSalary: 125000, salaryRange: '$80k - $125k', exp: '2-5 years' },
    { title: 'Site Reliability Engineer (SRE)', category: 'DevOps', skills: ['Prometheus', 'Grafana', 'Go', 'Incident Response', 'SLOs'], minSalary: 105000, maxSalary: 160000, salaryRange: '$105k - $160k', exp: '3-6 years' },
    { title: 'Graphic & Brand Designer', category: 'Design', skills: ['Illustrator', 'Photoshop', 'Brand Strategy', 'Typography', 'Figma'], minSalary: 55000, maxSalary: 85000, salaryRange: '$55k - $85k', exp: '1-4 years' }
  ];

  const locations = [
    'Bengaluru, KA', 'Hyderabad, TS', 'Mumbai, MH', 'Pune, MH', 'Delhi, DL',
    'Seattle, WA', 'San Francisco, CA', 'Austin, TX', 'New York, NY', 'Mountain View, CA',
    'Redmond, WA', 'London, UK', 'Remote', 'Chennai, TN', 'Boston, MA'
  ];

  const types = ['Full Time', 'Full Time', 'Full Time', 'Part Time', 'Contract', 'Internship'];
  const workplaces = ['On-site', 'Hybrid', 'Remote', 'Hybrid', 'On-site'];

  let counter = jobs.length + 1;
  while (jobs.length < 124) {
    const comp = allCompanies[(counter * 7) % (allCompanies.length || 1)] || {
      name: 'Google',
      industry: 'Technology',
      logo: 'https://www.gstatic.com/images/branding/product/2x/googleg_48dp.png',
      fallbackLetter: 'G',
      fallbackBg: 'bg-red-500'
    };
    const roleInfo = titlesAndSkills[counter % titlesAndSkills.length];
    const loc = locations[(counter * 3) % locations.length];
    const type = types[counter % types.length];
    const work = workplaces[counter % workplaces.length];
    const postedDays = (counter % 14) + 1;
    const padId = counter.toString().padStart(2, '0');

    jobs.push({
      id: `job_${padId}`,
      title: roleInfo.title,
      postedTime: `Posted ${postedDays} days ago`,
      companyName: comp.name,
      companyIndustry: comp.industry || 'Technology',
      companyLogo: comp.logo,
      fallbackLetter: comp.name?.charAt(0) || 'C',
      fallbackBg: comp.fallbackBg || 'bg-[#25324B]',
      category: roleInfo.category,
      employmentType: type,
      workplaceType: work,
      location: loc,
      salaryRange: roleInfo.salaryRange,
      minSalary: roleInfo.minSalary,
      maxSalary: roleInfo.maxSalary,
      experience: roleInfo.exp,
      status: counter % 9 === 0 ? 'Closed' : 'Open',
      applicationsCount: 15 + (counter * 3) % 75,
      featured: counter % 5 === 0,
      skills: roleInfo.skills,
      description: `Opportunity to join ${comp.name} as a ${roleInfo.title}. Deliver top tier solutions, collaborate across functions, and advance digital transformation.`,
      requirements: [`Strong background in ${roleInfo.skills.slice(0, 2).join(' & ')}`, 'Strong team communication', 'Passionate about engineering excellence'],
      createdAt: new Date(Date.now() - postedDays * 86400000).toISOString(),
    });
    counter++;
  }

  return jobs.slice(0, 124);
};

// Saved Jobs Bookmark LocalStorage Persistence
const SAVED_JOBS_KEY = 'jobportal_saved_job_ids';
const APPLIED_JOBS_KEY = 'jobportal_applied_job_ids';

const DEFAULT_SAVED_IDS = [
  'job_01', 'job_02', 'job_03', 'job_04', 'job_05',
  'job_06', 'job_07', 'job_08', 'job_09', 'job_10',
  'job_11', 'job_12', 'job_13', 'job_14', 'job_15',
  'job_16', 'job_17'
];

const DEFAULT_APPLIED_IDS = ['job_02', 'job_04', 'job_05'];

export const getSavedJobIds = () => {
  try {
    const data = localStorage.getItem(SAVED_JOBS_KEY);
    return data ? JSON.parse(data) : DEFAULT_SAVED_IDS;
  } catch {
    return DEFAULT_SAVED_IDS;
  }
};

export const toggleSavedJobId = (jobId) => {
  try {
    const current = getSavedJobIds();
    const index = current.indexOf(jobId);
    let updated;
    if (index >= 0) {
      updated = current.filter((id) => id !== jobId);
    } else {
      updated = [...current, jobId];
    }
    localStorage.setItem(SAVED_JOBS_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('storage'));
    return updated.includes(jobId);
  } catch {
    return false;
  }
};

export const isJobSaved = (jobId) => {
  const current = getSavedJobIds();
  return current.includes(jobId);
};

export const getAppliedJobIds = () => {
  try {
    const data = localStorage.getItem(APPLIED_JOBS_KEY);
    return data ? JSON.parse(data) : DEFAULT_APPLIED_IDS;
  } catch {
    return DEFAULT_APPLIED_IDS;
  }
};

export const toggleApplyJob = (jobId) => {
  try {
    const current = getAppliedJobIds();
    const index = current.indexOf(jobId);
    let updated;
    if (index >= 0) {
      updated = current.filter((id) => id !== jobId);
    } else {
      updated = [...current, jobId];
    }
    localStorage.setItem(APPLIED_JOBS_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('storage'));
    return updated.includes(jobId);
  } catch {
    return false;
  }
};

export const isJobApplied = (jobId) => {
  const current = getAppliedJobIds();
  return current.includes(jobId);
};

// Initialize Jobs in LocalStorage
export const initJobsDB = () => {
  try {
    const existing = localStorage.getItem(JOBS_DB_KEY);
    if (!existing) {
      const fullList = generate124Jobs();
      localStorage.setItem(JOBS_DB_KEY, JSON.stringify(fullList));
    } else {
      const parsed = JSON.parse(existing);
      // Re-seed only if parsed is not an array or has outdated schema missing workplaceType
      if (!Array.isArray(parsed) || (parsed.length > 0 && !parsed[0]?.workplaceType)) {
        const fullList = generate124Jobs();
        localStorage.setItem(JOBS_DB_KEY, JSON.stringify(fullList));
      }
    }
  } catch (e) {
    const fullList = generate124Jobs();
    localStorage.setItem(JOBS_DB_KEY, JSON.stringify(fullList));
  }
};

export const getStoredJobs = () => {
  initJobsDB();
  try {
    const data = localStorage.getItem(JOBS_DB_KEY);
    return data ? JSON.parse(data) : INITIAL_MOCK_JOBS;
  } catch {
    return INITIAL_MOCK_JOBS;
  }
};

export const saveJobsToStorage = (jobs) => {
  localStorage.setItem(JOBS_DB_KEY, JSON.stringify(jobs));
  try {
    window.dispatchEvent(new Event('storage'));
  } catch (e) {
    // ignore
  }
};

// Calculate 5 metric stats matching image
export const getJobStats = () => {
  const jobs = getStoredJobs();
  const activeCount = jobs.filter((j) => j.status === 'Open').length;
  const closedCount = jobs.filter((j) => j.status === 'Closed').length;
  const featuredCount = jobs.filter((j) => j.featured).length;
  const totalApps = jobs.reduce((sum, j) => sum + (Number(j.applicationsCount) || 0), 0);

  return {
    totalJobs: jobs.length,
    activeJobs: activeCount,
    closedJobs: closedCount,
    totalApplications: Math.max(totalApps, 482),
    featuredJobs: Math.max(featuredCount, 5),
  };
};

export const addJob = (newJobData) => {
  const jobs = getStoredJobs();
  const allComps = getStoredCompanies();
  const matchedComp = allComps.find((c) => c.name === newJobData.companyName);

  const job = {
    id: `job_${Date.now()}`,
    title: newJobData.title,
    postedTime: 'Posted just now',
    companyName: newJobData.companyName || 'Google',
    companyIndustry: matchedComp?.industry || 'Technology',
    companyLogo: matchedComp?.logo || 'https://www.gstatic.com/images/branding/product/2x/googleg_48dp.png',
    fallbackLetter: (newJobData.companyName || 'C').charAt(0).toUpperCase(),
    fallbackBg: 'bg-[#25324B]',
    category: newJobData.category || 'IT & Software',
    employmentType: newJobData.employmentType || 'Full Time',
    location: newJobData.location || (matchedComp?.location || 'Bengaluru, KA'),
    salaryRange: newJobData.salaryRange || '$80k - $120k',
    experience: newJobData.experience || '2-5 years',
    status: newJobData.status || 'Open',
    applicationsCount: 0,
    featured: Boolean(newJobData.featured),
    description: newJobData.description || 'Exciting career opportunity joining a fast-paced innovative team.',
    requirements: Array.isArray(newJobData.requirements)
      ? newJobData.requirements
      : (newJobData.requirements || 'Relevant degree or hands-on experience, Team player, Growth mindset').split(',').map((s) => s.trim()),
    createdAt: new Date().toISOString(),
  };

  jobs.unshift(job);
  saveJobsToStorage(jobs);
  return job;
};

export const updateJob = (id, updatedFields) => {
  const jobs = getStoredJobs();
  const index = jobs.findIndex((j) => j.id === id);
  if (index >= 0) {
    jobs[index] = {
      ...jobs[index],
      ...updatedFields,
    };
    saveJobsToStorage(jobs);
    return jobs[index];
  }
  return null;
};

export const deleteJob = (id) => {
  const jobs = getStoredJobs();
  const toDelete = jobs.find((j) => String(j.id) === String(id));
  const filtered = jobs.filter((j) => String(j.id) !== String(id));
  saveJobsToStorage(filtered);

  // Clean up saved & applied job lists
  try {
    const saved = getSavedJobIds().filter((savedId) => String(savedId) !== String(id));
    localStorage.setItem(SAVED_JOBS_KEY, JSON.stringify(saved));
  } catch {}

  try {
    const applied = getAppliedJobIds().filter((appId) => String(appId) !== String(id));
    localStorage.setItem(APPLIED_JOBS_KEY, JSON.stringify(applied));
  } catch {}

  return toDelete || true;
};

export const deleteMultipleJobs = (ids) => {
  if (!Array.isArray(ids) || ids.length === 0) return false;
  const idSet = new Set(ids.map((id) => String(id)));
  const jobs = getStoredJobs();
  const filtered = jobs.filter((j) => !idSet.has(String(j.id)));
  saveJobsToStorage(filtered);

  try {
    const saved = getSavedJobIds().filter((savedId) => !idSet.has(String(savedId)));
    localStorage.setItem(SAVED_JOBS_KEY, JSON.stringify(saved));
  } catch {}

  try {
    const applied = getAppliedJobIds().filter((appId) => !idSet.has(String(appId)));
    localStorage.setItem(APPLIED_JOBS_KEY, JSON.stringify(applied));
  } catch {}

  return true;
};

export const toggleJobStatus = (id) => {
  const jobs = getStoredJobs();
  const index = jobs.findIndex((j) => j.id === id);
  if (index >= 0) {
    jobs[index].status = jobs[index].status === 'Open' ? 'Closed' : 'Open';
    saveJobsToStorage(jobs);
    return jobs[index];
  }
  return null;
};

export const getJobById = (id) => {
  if (!id) return null;
  const jobs = getStoredJobs();
  const idStr = String(id).toLowerCase().trim();

  // 1. Exact match (case-insensitive or exact string)
  const exact = jobs.find(
    (j) => String(j.id).toLowerCase() === idStr || String(j.id) === String(id)
  );
  if (exact) return exact;

  // 2. Numeric match (e.g., "1" -> "job_01" or index 0)
  const num = parseInt(idStr.replace(/\D/g, ''), 10);
  if (!isNaN(num) && num > 0) {
    const formatted = `job_${num.toString().padStart(2, '0')}`;
    const byNum = jobs.find((j) => j.id === formatted) || (jobs[num - 1] ? jobs[num - 1] : null);
    if (byNum) return byNum;
  }

  // 3. Match by job title slug
  const byTitle = jobs.find(
    (j) =>
      j.title.toLowerCase() === idStr ||
      j.title.toLowerCase().replace(/\s+/g, '-') === idStr ||
      j.title.toLowerCase().includes(idStr)
  );
  if (byTitle) return byTitle;

  return jobs[0] || null;
};

export const submitJobApplication = (jobId) => {
  const jobs = getStoredJobs();
  const index = jobs.findIndex((j) => j.id === jobId);
  if (index >= 0) {
    jobs[index].applicationsCount = (Number(jobs[index].applicationsCount) || 0) + 1;
    saveJobsToStorage(jobs);
    return jobs[index];
  }
  return null;
};

export const getJobEnrichedDetails = (job) => {
  if (!job) return null;

  const defaultResponsibilities = [
    'Architect, design, and implement high-performance, resilient software solutions.',
    'Collaborate closely with cross-functional teams including Product Managers, Designers, and Platform engineers.',
    'Write clean, readable, modular code adhering to modern engineering standards and automated testing.',
    'Optimize application workflows for maximum speed, security, scalability, and responsiveness.',
    'Participate actively in technical architecture reviews, sprint planning, and mentorship.',
    'Diagnose and troubleshoot production incidents with automated observability and telemetry.',
  ];

  const defaultSkills = [
    'React.js',
    'TypeScript',
    'Tailwind CSS',
    'Node.js',
    'REST & GraphQL APIs',
    'Git & GitHub',
    'Jest / Testing Library',
    'Cloud Platforms (AWS/Azure/GCP)',
  ];

  const sampleApplicants = [
    {
      id: 'app_1',
      name: 'Alex Morgan',
      email: 'alex.morgan@example.com',
      experience: '4 years',
      appliedAt: '1 day ago',
      stage: 'Under Review',
      stageColor: 'bg-blue-50 text-blue-700',
      matchScore: '95%',
    },
    {
      id: 'app_2',
      name: 'Priya Sharma',
      email: 'priya.sharma@example.com',
      experience: '5 years',
      appliedAt: '2 days ago',
      stage: 'Shortlisted',
      stageColor: 'bg-emerald-50 text-emerald-700',
      matchScore: '98%',
    },
    {
      id: 'app_3',
      name: 'David Chen',
      email: 'david.chen@example.com',
      experience: '3 years',
      appliedAt: '3 days ago',
      stage: 'Interview Scheduled',
      stageColor: 'bg-purple-50 text-purple-700',
      matchScore: '89%',
    },
    {
      id: 'app_4',
      name: 'Sarah Jenkins',
      email: 'sarah.j@example.com',
      experience: '6 years',
      appliedAt: '5 days ago',
      stage: 'Screened',
      stageColor: 'bg-amber-50 text-amber-700',
      matchScore: '92%',
    },
  ];

  return {
    responsibilities: defaultResponsibilities,
    skills: defaultSkills,
    applicantsList: sampleApplicants,
  };
};

export const getCategoryBadgeStyle = (category) => {
  switch (category) {
    case 'IT & Software':
      return 'bg-blue-50 text-blue-700 border-blue-200';
    case 'Design':
      return 'bg-purple-50 text-purple-700 border-purple-200';
    case 'Data Science':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    case 'Product':
      return 'bg-rose-50 text-rose-700 border-rose-200';
    case 'QA & Testing':
      return 'bg-violet-50 text-violet-700 border-violet-200';
    case 'DevOps':
      return 'bg-amber-50 text-amber-700 border-amber-200';
    case 'Mobile Development':
      return 'bg-sky-50 text-sky-700 border-sky-200';
    case 'IT Support':
      return 'bg-slate-100 text-slate-700 border-slate-200';
    default:
      return 'bg-gray-100 text-gray-700 border-gray-200';
  }
};

export const getTypeBadgeStyle = (type) => {
  switch (type) {
    case 'Full Time':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200/80';
    case 'Contract':
      return 'bg-purple-50 text-purple-700 border-purple-200/80';
    case 'Part Time':
      return 'bg-blue-50 text-blue-700 border-blue-200/80';
    case 'Internship':
      return 'bg-amber-50 text-amber-700 border-amber-200/80';
    default:
      return 'bg-gray-50 text-gray-700 border-gray-200/80';
  }
};
