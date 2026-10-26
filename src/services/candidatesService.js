// Candidates Data Service leveraging DummyJSON Users API (https://dummyjson.com/users)
// Performs live HTTP fetch calls visible in Browser Network tab

const DUMMY_JSON_USERS_URL = 'https://dummyjson.com/users';

const TECH_ROLES = [
  'Frontend Developer',
  'Software Engineer',
  'Backend Developer',
  'DevOps Engineer',
  'UI/UX Designer',
  'Data Scientist',
  'Full Stack Developer',
  'Cloud Solutions Architect',
  'QA Automation Engineer',
  'Mobile App Developer (React Native)',
  'Product Manager',
  'Cybersecurity Analyst',
];

const TECH_SKILLS_POOL = [
  ['React.js', 'JavaScript', 'HTML5', 'CSS3', 'Tailwind CSS', 'Git', 'GitHub', 'Redux', 'REST APIs', 'Responsive Design'],
  ['Node.js', 'Express.js', 'TypeScript', 'MongoDB', 'PostgreSQL', 'Docker', 'AWS', 'Microservices', 'GraphQL', 'Jest'],
  ['Python', 'Django', 'FastAPI', 'Pandas', 'Machine Learning', 'TensorFlow', 'SQL', 'Data Analytics', 'Git', 'Docker'],
  ['Kubernetes', 'Docker', 'Terraform', 'AWS', 'CI/CD', 'Linux', 'Bash', 'Prometheus', 'Grafana', 'Jenkins'],
  ['Figma', 'UI Design', 'UX Research', 'Design Systems', 'Wireframing', 'Prototyping', 'Adobe XD', 'HTML/CSS', 'User Testing'],
  ['Java', 'Spring Boot', 'Hibernate', 'MySQL', 'Kafka', 'Redis', 'RESTful Web Services', 'JUnit', 'Azure'],
  ['Flutter', 'Dart', 'React Native', 'iOS', 'Android', 'Mobile UI', 'Firebase', 'State Management', 'App Store'],
];

const APPLICATION_STATUSES = [
  { company: 'Google', role: 'Frontend Developer', time: '2 days ago', status: 'Applied', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  { company: 'Microsoft', role: 'UI/UX Designer', time: '5 days ago', status: 'Applied', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  { company: 'Amazon', role: 'Frontend Developer', time: '1 week ago', status: 'Shortlisted', color: 'bg-blue-50 text-blue-700 border-blue-200' },
  { company: 'Meta', role: 'Software Engineer', time: '1 week ago', status: 'Interview', color: 'bg-purple-50 text-purple-700 border-purple-200' },
  { company: 'Netflix', role: 'Web Developer', time: '2 weeks ago', status: 'Rejected', color: 'bg-red-50 text-red-600 border-red-200' },
];

/**
 * Enriches a raw DummyJSON user object with realistic tech candidate fields
 */
export const enrichCandidate = (user, index = 0) => {
  // Candidate #1 matches exact reference image (Rahul Sharma)
  const isPrimary = index === 0;

  const fullName = isPrimary ? 'Rahul Sharma' : `${user.firstName} ${user.lastName}`;
  const role = isPrimary ? 'Frontend Developer' : TECH_ROLES[index % TECH_ROLES.length];
  const skills = isPrimary ? TECH_SKILLS_POOL[0] : TECH_SKILLS_POOL[index % TECH_SKILLS_POOL.length];
  const location = isPrimary
    ? 'Bengaluru, KA'
    : `${user.address?.city || 'Hyderabad'}, ${user.address?.stateCode || 'TS'}`;
  const email = isPrimary ? 'rahul.sharma@example.com' : user.email;
  const phone = isPrimary ? '+91 98765 43210' : user.phone;
  const age = isPrimary ? 26 : user.age || 27;
  const username = isPrimary ? 'rahul' : user.username || 'candidate';
  const university = isPrimary ? 'JNTU, Hyderabad' : user.university || 'National Institute of Technology';
  const companyName = isPrimary ? 'TechCorp Solutions' : user.company?.name || 'TechCorp Global';
  const prevCompanyName = isPrimary ? 'WebTech Innovations' : 'InnovateSoft Technologies';

  return {
    id: user.id || index + 1,
    dummyId: user.id,
    name: fullName,
    firstName: isPrimary ? 'Rahul' : user.firstName,
    lastName: isPrimary ? 'Sharma' : user.lastName,
    headline: role,
    role: role,
    avatar: user.image || `https://dummyjson.com/icon/${user.username || 'user'}/128`,
    fallbackLetter: fullName.charAt(0).toUpperCase(),
    location: location,
    email: email,
    phone: phone,
    age: age,
    website: `https://${username}.dev`,
    bio: isPrimary
      ? 'Passionate Frontend Developer with 2+ years of experience in building responsive and user-friendly web applications. Skilled in React, JavaScript, and modern web technologies.'
      : `Experienced ${role} with solid background in ${skills.slice(0, 3).join(', ')}. Passionate about building scalable, high-performance web applications and collaborating across agile teams.`,
    
    // Key Stats
    experienceYears: isPrimary ? '2+' : `${(index % 5) + 2}+`,
    totalApplications: isPrimary ? 5 : (index % 6) + 4,
    rating: isPrimary ? '4.2' : (4.0 + (index % 10) * 0.1).toFixed(1),
    matchScore: isPrimary ? 85 : 75 + (index * 3) % 23,

    // Status
    status: 'Active',
    availability: 'Immediately',
    noticePeriod: isPrimary ? '30 Days' : `${(index % 3 + 1) * 15} Days`,
    expectedSalary: isPrimary ? '₹ 8 - 12 LPA' : `₹ ${8 + (index % 5) * 2} - ${12 + (index % 5) * 3} LPA`,
    currentLocation: location,

    // Work Experience Timeline
    workHistory: [
      {
        id: `work_${user.id}_1`,
        company: companyName,
        badgeLetter: companyName.charAt(0),
        badgeBg: 'bg-teal-600',
        role: role,
        period: 'Jan 2023 - Present • 1 yr 9 mos',
        bullets: [
          `Developed responsive web applications using ${skills[0]} and ${skills[4] || 'Tailwind CSS'}.`,
          'Collaborated with cross-functional teams to deliver high-quality features.',
          'Improved application performance by 30% through code optimization and bundle splitting.',
        ],
      },
      {
        id: `work_${user.id}_2`,
        company: prevCompanyName,
        badgeLetter: prevCompanyName.charAt(0),
        badgeBg: 'bg-indigo-600',
        role: `Junior ${role.replace('Senior ', '')}`,
        period: 'Jul 2021 - Dec 2022 • 1 yr 6 mos',
        bullets: [
          `Assisted in building UI components using HTML, CSS, and ${skills[1] || 'JavaScript'}.`,
          'Worked on bug fixing, code refactoring, and feature enhancements.',
        ],
      },
    ],

    // Education
    education: {
      degree: 'B.Tech in Computer Science',
      institution: university,
      period: '2017 - 2021',
      grade: isPrimary ? '8.5 CGPA' : `${(8.0 + (index % 10) * 0.15).toFixed(1)} CGPA`,
    },

    // Skills
    skills: skills,

    // Application History
    applicationHistory: APPLICATION_STATUSES.map((app, appIdx) => ({
      id: `app_${user.id}_${appIdx}`,
      jobTitle: `${app.role} - ${app.company}`,
      company: app.company,
      role: app.role,
      time: app.time,
      status: app.status,
      badgeColor: app.color,
    })),
  };
};

// LocalStorage Persistence for Custom, Overridden & Deleted Candidates
const SHORTLISTED_KEY = 'jobportal_shortlisted_candidates';
const CUSTOM_CANDIDATES_KEY = 'jobportal_custom_candidates';
const CANDIDATE_OVERRIDES_KEY = 'jobportal_candidate_overrides';
const DELETED_CANDIDATE_IDS_KEY = 'jobportal_deleted_candidate_ids';

export const getCustomCandidates = () => {
  try {
    const data = localStorage.getItem(CUSTOM_CANDIDATES_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const getCandidateOverrides = () => {
  try {
    const data = localStorage.getItem(CANDIDATE_OVERRIDES_KEY);
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
};

export const getDeletedCandidateIds = () => {
  try {
    const data = localStorage.getItem(DELETED_CANDIDATE_IDS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

/**
 * Fetch candidates from DummyJSON Users API (visible in Browser Network Tab)
 * Merges with user-created candidates and applies edits/deletions
 */
export const fetchDummyJsonCandidates = async (limit = 30, skip = 0) => {
  try {
    const response = await fetch(`${DUMMY_JSON_USERS_URL}?limit=${limit}&skip=${skip}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch DummyJSON users: ${response.status}`);
    }
    const data = await response.json();
    let apiCandidates = [];
    if (data && Array.isArray(data.users)) {
      apiCandidates = data.users.map((user, idx) => enrichCandidate(user, idx));
    }

    const deletedIds = getDeletedCandidateIds();
    const overrides = getCandidateOverrides();
    const customCandidates = getCustomCandidates();

    // Apply overrides and filter deleted
    const processedApi = apiCandidates
      .filter((cand) => !deletedIds.includes(cand.id))
      .map((cand) => (overrides[cand.id] ? { ...cand, ...overrides[cand.id] } : cand));

    const processedCustom = customCandidates
      .filter((cand) => !deletedIds.includes(cand.id))
      .map((cand) => (overrides[cand.id] ? { ...cand, ...overrides[cand.id] } : cand));

    // Custom candidates first, then API candidates
    return [...processedCustom, ...processedApi];
  } catch (error) {
    console.error('Error fetching DummyJSON users API:', error);
    throw error;
  }
};

/**
 * Fetch single candidate by ID from DummyJSON Users API or local overrides
 */
export const fetchDummyJsonCandidateById = async (id) => {
  try {
    const cleanId = Number(String(id).replace(/\D/g, '')) || 1;
    const deletedIds = getDeletedCandidateIds();
    if (deletedIds.includes(cleanId)) {
      return null;
    }

    // Check custom candidates first
    const customCandidates = getCustomCandidates();
    const foundCustom = customCandidates.find((c) => c.id === cleanId);
    const overrides = getCandidateOverrides();

    if (foundCustom) {
      return overrides[cleanId] ? { ...foundCustom, ...overrides[cleanId] } : foundCustom;
    }

    // Otherwise fetch from DummyJSON
    const dummyApiId = cleanId > 200 ? 1 : cleanId;
    const response = await fetch(`${DUMMY_JSON_USERS_URL}/${dummyApiId}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch DummyJSON user ${cleanId}`);
    }
    const user = await response.json();
    const baseCandidate = enrichCandidate(user, cleanId - 1);
    baseCandidate.id = cleanId;

    return overrides[cleanId] ? { ...baseCandidate, ...overrides[cleanId] } : baseCandidate;
  } catch (error) {
    console.error(`Error fetching candidate ${id} from DummyJSON:`, error);
    throw error;
  }
};

/**
 * Search candidates via DummyJSON Users search API
 */
export const searchDummyJsonCandidates = async (query) => {
  try {
    if (!query || !query.trim()) {
      return await fetchDummyJsonCandidates(30);
    }
    const response = await fetch(`${DUMMY_JSON_USERS_URL}/search?q=${encodeURIComponent(query)}`);
    if (!response.ok) {
      throw new Error(`Failed to search DummyJSON users: ${response.status}`);
    }
    const data = await response.json();
    let results = [];
    if (data && Array.isArray(data.users)) {
      results = data.users.map((user, idx) => enrichCandidate(user, idx));
    }

    const deletedIds = getDeletedCandidateIds();
    const overrides = getCandidateOverrides();
    const customCandidates = getCustomCandidates();

    // Include matching custom candidates
    const qLower = query.toLowerCase();
    const matchingCustom = customCandidates.filter(
      (c) =>
        c.name.toLowerCase().includes(qLower) ||
        c.role.toLowerCase().includes(qLower) ||
        c.location.toLowerCase().includes(qLower) ||
        (Array.isArray(c.skills) && c.skills.some((s) => s.toLowerCase().includes(qLower)))
    );

    const merged = [...matchingCustom, ...results]
      .filter((c) => !deletedIds.includes(c.id))
      .map((c) => (overrides[c.id] ? { ...c, ...overrides[c.id] } : c));

    return merged;
  } catch (error) {
    console.error('Error searching DummyJSON candidates:', error);
    throw error;
  }
};

/**
 * CREATE Candidate: Calls DummyJSON POST https://dummyjson.com/users/add
 * (Generates live HTTP POST visible in DevTools Network tab)
 */
export const createDummyJsonCandidate = async (formData) => {
  const names = (formData.name || 'New Candidate').trim().split(' ');
  const firstName = names[0] || 'Candidate';
  const lastName = names.slice(1).join(' ') || '';

  const postPayload = {
    firstName: firstName,
    lastName: lastName,
    age: Number(formData.age) || 28,
    email: formData.email || `${firstName.toLowerCase()}@example.com`,
    phone: formData.phone || '+91 98765 43210',
    address: {
      city: formData.location?.split(',')[0]?.trim() || 'Bengaluru',
      state: formData.location?.split(',')[1]?.trim() || 'KA',
    },
    company: {
      name: formData.currentCompany || 'TechCorp Solutions',
      title: formData.role || 'Software Engineer',
    },
  };

  let dummyRes = null;
  try {
    const res = await fetch(`${DUMMY_JSON_USERS_URL}/add`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(postPayload),
    });
    if (res.ok) {
      dummyRes = await res.json();
    }
  } catch (err) {
    console.warn('DummyJSON add API call error (fallback used):', err);
  }

  const newId = Date.now();
  const skillsArray = Array.isArray(formData.skills)
    ? formData.skills
    : typeof formData.skills === 'string'
    ? formData.skills
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
    : ['React.js', 'JavaScript', 'Tailwind CSS'];

  const newCandidate = {
    id: newId,
    dummyId: dummyRes?.id || 209,
    name: formData.name.trim(),
    firstName: firstName,
    lastName: lastName,
    headline: formData.role || 'Software Engineer',
    role: formData.role || 'Software Engineer',
    avatar:
      formData.avatar ||
      `https://images.unsplash.com/photo-${1534528741775 + (newId % 1000)}?w=150&auto=format&fit=crop&q=80`,
    fallbackLetter: (formData.name || 'C').charAt(0).toUpperCase(),
    location: formData.location || 'Bengaluru, KA',
    email: formData.email || `${firstName.toLowerCase()}@example.com`,
    phone: formData.phone || '+91 98765 43210',
    age: Number(formData.age) || 28,
    website: formData.website || `https://${firstName.toLowerCase()}.dev`,
    bio:
      formData.bio ||
      `Passionate ${formData.role || 'developer'} with ${formData.experienceYears || '3+'} of industry experience. Specialized in building modern web applications.`,
    experienceYears: formData.experienceYears || '3+ Years',
    totalApplications: 1,
    rating: formData.rating || '4.5',
    matchScore: 92,
    status: formData.status || 'Active',
    availability: formData.availability || 'Immediately',
    noticePeriod: formData.noticePeriod || '15 Days',
    expectedSalary: formData.expectedSalary || '₹ 10 - 15 LPA',
    currentLocation: formData.location || 'Bengaluru, KA',
    skills: skillsArray,
    workHistory: [
      {
        id: `work_${newId}_1`,
        company: formData.currentCompany || 'TechCorp Solutions',
        badgeLetter: (formData.currentCompany || 'T').charAt(0),
        badgeBg: 'bg-indigo-600',
        role: formData.role || 'Software Engineer',
        period: '2023 - Present',
        bullets: [
          `Engineered key client features using ${skillsArray.slice(0, 2).join(' and ')}.`,
          'Collaborated with product designers and backend engineers in agile sprints.',
        ],
      },
    ],
    education: {
      degree: formData.degree || 'B.Tech in Computer Science',
      institution: formData.university || 'National Institute of Technology',
      period: '2018 - 2022',
      grade: '8.4 CGPA',
    },
    applicationHistory: [
      {
        id: `app_${newId}_1`,
        jobTitle: `${formData.role || 'Software Engineer'} - Google`,
        company: 'Google',
        role: formData.role || 'Software Engineer',
        time: 'Just now',
        status: 'Applied',
        badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      },
    ],
  };

  // Persist locally
  const currentCustom = getCustomCandidates();
  const updated = [newCandidate, ...currentCustom];
  localStorage.setItem(CUSTOM_CANDIDATES_KEY, JSON.stringify(updated));

  return newCandidate;
};

/**
 * UPDATE Candidate: Calls DummyJSON PUT https://dummyjson.com/users/:id
 * (Generates live HTTP PUT visible in DevTools Network tab)
 */
export const updateDummyJsonCandidate = async (id, updatedFields) => {
  const cleanId = Number(String(id).replace(/\D/g, '')) || 1;
  const dummyApiId = cleanId > 200 ? 1 : cleanId;

  const names = (updatedFields.name || '').trim().split(' ');
  const firstName = names[0] || undefined;
  const lastName = names.slice(1).join(' ') || undefined;

  try {
    await fetch(`${DUMMY_JSON_USERS_URL}/${dummyApiId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        firstName: firstName,
        lastName: lastName,
        email: updatedFields.email,
        phone: updatedFields.phone,
      }),
    });
  } catch (err) {
    console.warn('DummyJSON PUT API call warning (local override used):', err);
  }

  const skillsArray = Array.isArray(updatedFields.skills)
    ? updatedFields.skills
    : typeof updatedFields.skills === 'string'
    ? updatedFields.skills
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
    : undefined;

  const formattedUpdate = {
    ...updatedFields,
    ...(skillsArray ? { skills: skillsArray } : {}),
  };

  // If in custom candidates, update in custom list
  const customCandidates = getCustomCandidates();
  const customIndex = customCandidates.findIndex((c) => c.id === cleanId);
  if (customIndex !== -1) {
    customCandidates[customIndex] = { ...customCandidates[customIndex], ...formattedUpdate };
    localStorage.setItem(CUSTOM_CANDIDATES_KEY, JSON.stringify(customCandidates));
    return customCandidates[customIndex];
  }

  // Otherwise store in overrides
  const overrides = getCandidateOverrides();
  overrides[cleanId] = { ...(overrides[cleanId] || {}), ...formattedUpdate };
  localStorage.setItem(CANDIDATE_OVERRIDES_KEY, JSON.stringify(overrides));

  return { id: cleanId, ...formattedUpdate };
};

/**
 * DELETE Candidate: Calls DummyJSON DELETE https://dummyjson.com/users/:id
 * (Generates live HTTP DELETE visible in DevTools Network tab)
 */
export const deleteDummyJsonCandidate = async (id) => {
  const cleanId = Number(String(id).replace(/\D/g, '')) || 1;
  const dummyApiId = cleanId > 200 ? 1 : cleanId;

  try {
    await fetch(`${DUMMY_JSON_USERS_URL}/${dummyApiId}`, {
      method: 'DELETE',
    });
  } catch (err) {
    console.warn('DummyJSON DELETE API call warning (local deletion used):', err);
  }

  // Add to deleted IDs
  const deletedIds = getDeletedCandidateIds();
  if (!deletedIds.includes(cleanId)) {
    const updated = [...deletedIds, cleanId];
    localStorage.setItem(DELETED_CANDIDATE_IDS_KEY, JSON.stringify(updated));
  }

  // Remove from custom list if present
  const customCandidates = getCustomCandidates();
  const filteredCustom = customCandidates.filter((c) => c.id !== cleanId);
  localStorage.setItem(CUSTOM_CANDIDATES_KEY, JSON.stringify(filteredCustom));

  return true;
};

// LocalStorage Persistence for Shortlisted Candidates
export const getShortlistedCandidateIds = () => {
  try {
    const data = localStorage.getItem(SHORTLISTED_KEY);
    return data ? JSON.parse(data) : [1]; // default shortlist candidate 1
  } catch {
    return [1];
  }
};

export const toggleCandidateShortlistStorage = (candidateId) => {
  try {
    const current = getShortlistedCandidateIds();
    const idNum = Number(String(candidateId).replace(/\D/g, '')) || 1;
    let updated;
    if (current.includes(idNum)) {
      updated = current.filter((id) => id !== idNum);
    } else {
      updated = [...current, idNum];
    }
    localStorage.setItem(SHORTLISTED_KEY, JSON.stringify(updated));
    return updated.includes(idNum);
  } catch {
    return false;
  }
};
