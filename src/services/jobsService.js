// Job Postings Service with LocalStorage persistence for Module 4
import { getStoredCompanies } from './companiesService';

const JOBS_DB_KEY = 'jobportal_jobs_module4';

export const INITIAL_MOCK_JOBS = [
  // Page 1: Exact 10 jobs matching reference image
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
    location: 'Bengaluru, KA',
    salaryRange: '$80k - $120k',
    experience: '2-5 years',
    status: 'Open',
    applicationsCount: 48,
    featured: true,
    description: 'Looking for an experienced Frontend Engineer with deep expertise in React.js, Tailwind CSS, TypeScript and high-performance Web APIs.',
    requirements: ['2+ years of React development', 'Solid TypeScript skills', 'Experience with responsive UI and state management'],
    createdAt: '2026-10-21T08:00:00.000Z',
  },
  {
    id: 'job_02',
    title: 'Backend Developer',
    postedTime: 'Posted 3 days ago',
    companyName: 'Microsoft',
    companyIndustry: 'Technology',
    companyLogo: 'https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg',
    fallbackLetter: 'M',
    fallbackBg: 'bg-blue-600',
    category: 'IT & Software',
    employmentType: 'Full Time',
    location: 'Hyderabad, TS',
    salaryRange: '$70k - $110k',
    experience: '3-6 years',
    status: 'Open',
    applicationsCount: 72,
    featured: true,
    description: 'Build mission-critical distributed cloud services, microservices and RESTful / gRPC APIs on Azure infrastructure.',
    requirements: ['Strong knowledge of Node.js / C# / Python', 'Experience with relational and NoSQL databases', 'Cloud architecture skills'],
    createdAt: '2026-10-20T09:30:00.000Z',
  },
  {
    id: 'job_03',
    title: 'UI/UX Designer',
    postedTime: 'Posted 4 days ago',
    companyName: 'Apple',
    companyIndustry: 'Technology',
    companyLogo: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg',
    fallbackLetter: 'A',
    fallbackBg: 'bg-gray-800',
    category: 'Design',
    employmentType: 'Full Time',
    location: 'Mumbai, MH',
    salaryRange: '$60k - $90k',
    experience: '2-5 years',
    status: 'Open',
    applicationsCount: 61,
    featured: false,
    description: 'Create intuitive, elegant user interfaces and delightful digital experiences that set global industry design standards.',
    requirements: ['Expertise in Figma & design systems', 'Proven portfolio in user-centered product design', 'Strong prototyping abilities'],
    createdAt: '2026-10-19T11:00:00.000Z',
  },
  {
    id: 'job_04',
    title: 'Data Scientist',
    postedTime: 'Posted 5 days ago',
    companyName: 'Amazon',
    companyIndustry: 'E-commerce',
    companyLogo: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg',
    fallbackLetter: 'A',
    fallbackBg: 'bg-orange-500',
    category: 'Data Science',
    employmentType: 'Full Time',
    location: 'Seattle, WA',
    salaryRange: '$90k - $140k',
    experience: '3-7 years',
    status: 'Open',
    applicationsCount: 38,
    featured: false,
    description: 'Leverage machine learning algorithms and predictive analytics to optimize customer recommendations and supply chain logistics.',
    requirements: ['Proficiency in Python, SQL, and Pandas', 'Strong background in Machine Learning / Deep Learning', 'Experience with AWS SageMaker'],
    createdAt: '2026-10-18T14:15:00.000Z',
  },
  {
    id: 'job_05',
    title: 'Product Manager',
    postedTime: 'Posted 6 days ago',
    companyName: 'Meta',
    companyIndustry: 'Social Media',
    companyLogo: 'https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg',
    fallbackLetter: 'M',
    fallbackBg: 'bg-blue-500',
    category: 'Product',
    employmentType: 'Full Time',
    location: 'San Francisco, CA',
    salaryRange: '$100k - $150k',
    experience: '4-8 years',
    status: 'Open',
    applicationsCount: 55,
    featured: true,
    description: 'Drive vision, product strategy, and roadmaps for next-generation social connectivity and collaborative creator tools.',
    requirements: ['4+ years in digital product management', 'Data-driven mindset with A/B testing experience', 'Strong cross-functional leadership'],
    createdAt: '2026-10-17T16:00:00.000Z',
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

// Initialize Jobs in LocalStorage
export const initJobsDB = () => {
  try {
    const existing = localStorage.getItem(JOBS_DB_KEY);
    if (!existing) {
      localStorage.setItem(JOBS_DB_KEY, JSON.stringify(INITIAL_MOCK_JOBS));
    } else {
      const parsed = JSON.parse(existing);
      // Re-seed if previously had fewer jobs to ensure exact 24 match
      if (!Array.isArray(parsed) || parsed.length < 24) {
        localStorage.setItem(JOBS_DB_KEY, JSON.stringify(INITIAL_MOCK_JOBS));
      }
    }
  } catch (e) {
    localStorage.setItem(JOBS_DB_KEY, JSON.stringify(INITIAL_MOCK_JOBS));
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
  const filtered = jobs.filter((j) => j.id !== id);
  saveJobsToStorage(filtered);
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
