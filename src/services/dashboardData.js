// Initial Mock Data and Storage Helpers for Module 2 Dashboard & Beyond

const STORAGE_KEYS = {
  COMPANIES: 'jobportal_companies',
  JOBS: 'jobportal_jobs',
  APPLICATIONS: 'jobportal_applications',
  ACTIVITIES: 'jobportal_activities',
  SAVED_JOBS: 'jobportal_saved_jobs',
};

// Initial Companies
export const INITIAL_COMPANIES = [
  {
    id: 'comp_01',
    name: 'TechCorp Solutions',
    logo: 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=120&auto=format&fit=crop&q=80',
    industry: 'Technology & Software',
    location: 'San Francisco, CA',
    website: 'https://techcorp.example.com',
    email: 'contact@techcorp.example.com',
    employees: '1,200 - 5,000',
    description: 'Leading provider of enterprise cloud infrastructure and modern AI-driven developer platforms.',
    openJobs: 14,
    rating: 4.8,
  },
  {
    id: 'comp_02',
    name: 'Innovate Labs',
    logo: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=120&auto=format&fit=crop&q=80',
    industry: 'Design & Creative',
    location: 'New York, NY',
    website: 'https://innovatelabs.example.com',
    email: 'jobs@innovatelabs.example.com',
    employees: '250 - 500',
    description: 'Product innovation studio building next-generation digital consumer experiences.',
    openJobs: 8,
    rating: 4.6,
  },
  {
    id: 'comp_03',
    name: 'FinPulse Global',
    logo: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=120&auto=format&fit=crop&q=80',
    industry: 'Financial Services',
    location: 'Chicago, IL',
    website: 'https://finpulse.example.com',
    email: 'careers@finpulse.example.com',
    employees: '5,000+',
    description: 'Next-gen algorithmic trading and decentralized banking security network.',
    openJobs: 19,
    rating: 4.9,
  },
  {
    id: 'comp_04',
    name: 'NextWave Media',
    logo: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=120&auto=format&fit=crop&q=80',
    industry: 'Marketing & Advertising',
    location: 'Austin, TX',
    website: 'https://nextwave.example.com',
    email: 'hello@nextwave.example.com',
    employees: '100 - 250',
    description: 'Growth marketing and AI content distribution engine for high-growth tech startups.',
    openJobs: 6,
    rating: 4.5,
  },
  {
    id: 'comp_05',
    name: 'CyberShield Systems',
    logo: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=120&auto=format&fit=crop&q=80',
    industry: 'Cybersecurity',
    location: 'Seattle, WA',
    website: 'https://cybershield.example.com',
    email: 'talent@cybershield.example.com',
    employees: '500 - 1,000',
    description: 'Enterprise zero-trust architecture protecting cloud-native global organizations.',
    openJobs: 11,
    rating: 4.7,
  },
];

// Initial Job Postings
export const INITIAL_JOBS = [
  {
    id: 'job_01',
    title: 'Senior Full Stack React & Node Engineer',
    companyId: 'comp_01',
    companyName: 'TechCorp Solutions',
    companyLogo: 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=120&auto=format&fit=crop&q=80',
    category: 'Engineering & Software',
    employmentType: 'Full-time',
    experienceLevel: 'Senior Level',
    salaryRange: '$140k - $185k',
    location: 'San Francisco, CA (Hybrid)',
    requiredSkills: ['React.js', 'Node.js', 'TypeScript', 'Tailwind CSS', 'PostgreSQL'],
    deadline: '2026-11-30',
    status: 'Open',
    applicationsCount: 42,
    createdAt: '2026-10-18T10:00:00.000Z',
    featured: true,
  },
  {
    id: 'job_02',
    title: 'Lead UI/UX Product Designer',
    companyId: 'comp_02',
    companyName: 'Innovate Labs',
    companyLogo: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=120&auto=format&fit=crop&q=80',
    category: 'Design & Creative',
    employmentType: 'Full-time',
    experienceLevel: 'Mid-Senior Level',
    salaryRange: '$120k - $155k',
    location: 'Remote (US)',
    requiredSkills: ['Figma', 'Design Systems', 'Prototyping', 'User Research'],
    deadline: '2026-11-25',
    status: 'Open',
    applicationsCount: 29,
    createdAt: '2026-10-19T14:30:00.000Z',
    featured: true,
  },
  {
    id: 'job_03',
    title: 'Backend Systems Architect (Go / Distributed)',
    companyId: 'comp_03',
    companyName: 'FinPulse Global',
    companyLogo: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=120&auto=format&fit=crop&q=80',
    category: 'Engineering & Software',
    employmentType: 'Full-time',
    experienceLevel: 'Director / Lead',
    salaryRange: '$180k - $230k',
    location: 'Chicago, IL',
    requiredSkills: ['Golang', 'Kubernetes', 'gRPC', 'Distributed Systems', 'Kafka'],
    deadline: '2026-12-10',
    status: 'Open',
    applicationsCount: 19,
    createdAt: '2026-10-20T08:15:00.000Z',
    featured: false,
  },
  {
    id: 'job_04',
    title: 'Performance Growth Marketing Lead',
    companyId: 'comp_04',
    companyName: 'NextWave Media',
    companyLogo: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=120&auto=format&fit=crop&q=80',
    category: 'Marketing & Sales',
    employmentType: 'Contract',
    experienceLevel: 'Mid Level',
    salaryRange: '$90k - $120k',
    location: 'Austin, TX (Remote)',
    requiredSkills: ['Google Ads', 'SEO', 'Data Analytics', 'HubSpot'],
    deadline: '2026-11-15',
    status: 'Open',
    applicationsCount: 35,
    createdAt: '2026-10-21T11:00:00.000Z',
    featured: false,
  },
  {
    id: 'job_05',
    title: 'Cloud Security Compliance Analyst',
    companyId: 'comp_05',
    companyName: 'CyberShield Systems',
    companyLogo: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=120&auto=format&fit=crop&q=80',
    category: 'Cybersecurity',
    employmentType: 'Full-time',
    experienceLevel: 'Senior Level',
    salaryRange: '$135k - $170k',
    location: 'Seattle, WA (Hybrid)',
    requiredSkills: ['SOC2', 'ISO 27001', 'AWS Security', 'Zero Trust'],
    deadline: '2026-10-25',
    status: 'Closed',
    applicationsCount: 54,
    createdAt: '2026-10-15T09:20:00.000Z',
    featured: false,
  },
];

// Initial Recent Activities
export const INITIAL_ACTIVITIES = [
  {
    id: 'act_01',
    user: 'Sarah Jenkins',
    role: 'Recruiter',
    action: 'published a new opening',
    target: 'Senior Full Stack React Engineer',
    company: 'TechCorp Solutions',
    timestamp: '15 minutes ago',
    type: 'job',
  },
  {
    id: 'act_02',
    user: 'Alex Morgan',
    role: 'Candidate',
    action: 'submitted an application for',
    target: 'Lead UI/UX Product Designer',
    company: 'Innovate Labs',
    timestamp: '1 hour ago',
    type: 'application',
  },
  {
    id: 'act_03',
    user: 'FinPulse Global',
    role: 'Company',
    action: 'verified corporate hiring credentials',
    target: 'FinPulse Global Profile',
    company: 'FinPulse Global',
    timestamp: '3 hours ago',
    type: 'company',
  },
  {
    id: 'act_04',
    user: 'CyberShield Systems',
    role: 'Recruiter',
    action: 'closed applications for',
    target: 'Cloud Security Compliance Analyst',
    company: 'CyberShield Systems',
    timestamp: '5 hours ago',
    type: 'status',
  },
  {
    id: 'act_05',
    user: 'David Chen',
    role: 'Candidate',
    action: 'saved job posting to bookmarks',
    target: 'Backend Systems Architect',
    company: 'FinPulse Global',
    timestamp: 'Yesterday at 4:30 PM',
    type: 'saved',
  },
];

// Initial Monthly Application Statistics (for Charts)
export const MONTHLY_APPLICATION_STATS = [
  { month: 'Jan', applications: 120, hires: 14, shortlisted: 38 },
  { month: 'Feb', applications: 165, hires: 22, shortlisted: 49 },
  { month: 'Mar', applications: 210, hires: 29, shortlisted: 68 },
  { month: 'Apr', applications: 275, hires: 34, shortlisted: 82 },
  { month: 'May', applications: 240, hires: 31, shortlisted: 74 },
  { month: 'Jun', applications: 310, hires: 42, shortlisted: 98 },
  { month: 'Jul', applications: 340, hires: 48, shortlisted: 110 },
  { month: 'Aug', applications: 395, hires: 55, shortlisted: 128 },
  { month: 'Sep', applications: 430, hires: 61, shortlisted: 142 },
  { month: 'Oct', applications: 490, hires: 73, shortlisted: 165 },
  { month: 'Nov', applications: 460, hires: 68, shortlisted: 152 },
  { month: 'Dec', applications: 520, hires: 84, shortlisted: 180 },
];

// Jobs Category Distribution (for Donut Chart)
export const JOB_CATEGORY_STATS = [
  { category: 'Engineering & Dev', count: 480, percentage: 42, color: '#25324B' },
  { category: 'Design & Creative', count: 210, percentage: 18, color: '#3B4861' },
  { category: 'Marketing & Sales', count: 185, percentage: 16, color: '#52627E' },
  { category: 'Finance & Banking', count: 145, percentage: 13, color: '#6E7F9E' },
  { category: 'Cybersecurity', count: 125, percentage: 11, color: '#90A1C0' },
];

// Database Initialization Helper
export const initDashboardDB = () => {
  if (!localStorage.getItem(STORAGE_KEYS.COMPANIES)) {
    localStorage.setItem(STORAGE_KEYS.COMPANIES, JSON.stringify(INITIAL_COMPANIES));
  }
  if (!localStorage.getItem(STORAGE_KEYS.JOBS)) {
    localStorage.setItem(STORAGE_KEYS.JOBS, JSON.stringify(INITIAL_JOBS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.ACTIVITIES)) {
    localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(INITIAL_ACTIVITIES));
  }
  if (!localStorage.getItem(STORAGE_KEYS.SAVED_JOBS)) {
    localStorage.setItem(STORAGE_KEYS.SAVED_JOBS, JSON.stringify(['job_01', 'job_03']));
  }
  if (!localStorage.getItem(STORAGE_KEYS.APPLICATIONS)) {
    localStorage.setItem(
      STORAGE_KEYS.APPLICATIONS,
      JSON.stringify([
        {
          id: 'app_01',
          jobId: 'job_02',
          candidateName: 'Alex Morgan',
          candidateEmail: 'candidate@jobportal.com',
          appliedAt: '2026-10-21T14:00:00.000Z',
          status: 'Under Review',
        },
      ])
    );
  }
};

// Data Retrieval Helpers
export const getDashboardStats = (role = 'recruiter') => {
  initDashboardDB();
  const companies = JSON.parse(localStorage.getItem(STORAGE_KEYS.COMPANIES) || '[]');
  const jobs = JSON.parse(localStorage.getItem(STORAGE_KEYS.JOBS) || '[]');
  const applications = JSON.parse(localStorage.getItem(STORAGE_KEYS.APPLICATIONS) || '[]');
  const savedJobs = JSON.parse(localStorage.getItem(STORAGE_KEYS.SAVED_JOBS) || '[]');

  const activeJobs = jobs.filter((j) => j.status === 'Open');

  return {
    totalCompanies: companies.length + 243, // Seeded base + active
    totalJobs: jobs.length + 1415,
    activeJobs: activeJobs.length + 851,
    totalCandidates: 9840,
    totalApplications: applications.length + 3239,
    savedJobs: savedJobs.length + (role === 'candidate' ? 10 : 140),
  };
};

export const getDashboardJobs = () => {
  initDashboardDB();
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.JOBS) || '[]');
};

export const getDashboardActivities = () => {
  initDashboardDB();
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.ACTIVITIES) || '[]');
};

export const addQuickJob = (newJobData) => {
  initDashboardDB();
  const jobs = getDashboardJobs();
  const newJob = {
    id: `job_${Date.now()}`,
    title: newJobData.title,
    companyId: 'comp_01',
    companyName: newJobData.companyName || 'TechCorp Solutions',
    companyLogo: 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=120&auto=format&fit=crop&q=80',
    category: newJobData.category || 'Engineering & Software',
    employmentType: newJobData.employmentType || 'Full-time',
    experienceLevel: newJobData.experienceLevel || 'Mid-Senior Level',
    salaryRange: newJobData.salaryRange || '$120k - $160k',
    location: newJobData.location || 'Remote',
    requiredSkills: newJobData.requiredSkills
      ? newJobData.requiredSkills.split(',').map((s) => s.trim())
      : ['React.js', 'JavaScript'],
    deadline: newJobData.deadline || '2026-12-31',
    status: 'Open',
    applicationsCount: 0,
    createdAt: new Date().toISOString(),
    featured: Boolean(newJobData.featured),
  };

  jobs.unshift(newJob);
  localStorage.setItem(STORAGE_KEYS.JOBS, JSON.stringify(jobs));

  // Also add activity
  const activities = getDashboardActivities();
  activities.unshift({
    id: `act_${Date.now()}`,
    user: 'Sarah Jenkins',
    role: 'Recruiter',
    action: 'published a new opening',
    target: newJob.title,
    company: newJob.companyName,
    timestamp: 'Just now',
    type: 'job',
  });
  localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(activities.slice(0, 10)));

  return newJob;
};
