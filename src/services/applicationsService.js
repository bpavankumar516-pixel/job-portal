// Dynamic Applications Management Service
// Real-time bidirectional linking between Candidates and Recruiters
import { getStoredJobs, saveJobsToStorage, getAppliedJobIds } from './jobsService';
import { recordActivity } from './activityService';
import { addNotification } from './notificationService';

const APPLICATIONS_DB_KEY = 'jobportal_applications_db';

// Initial realistic applications connecting real jobs and DummyJSON candidates
const INITIAL_APPLICATIONS = [
  {
    id: 'app_101',
    jobId: 'job_01',
    jobTitle: 'Frontend Developer',
    companyName: 'Google',
    companyLogo: 'https://www.gstatic.com/images/branding/product/2x/googleg_48dp.png',
    candidateId: 1,
    candidateName: 'Olivia Wilson',
    candidateEmail: 'olivia.wilson@example.com',
    candidatePhone: '+1 (555) 234-5678',
    candidateRole: 'Senior React Developer',
    candidateAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    candidateLocation: 'San Francisco, CA',
    experienceYears: 4,
    skills: ['React.js', 'TypeScript', 'Tailwind CSS', 'Redux', 'Next.js'],
    status: 'In Review', // 'In Review' | 'Shortlisted' | 'Interview' | 'Hired' | 'Rejected'
    appliedAt: '2026-10-25T14:30:00.000Z',
    notes: 'Strong portfolio with 4+ years in modern frontend architectures and component design systems.',
    expectedSalary: '₹ 14L - 18L / year',
  },
  {
    id: 'app_102',
    jobId: 'job_01',
    jobTitle: 'Frontend Developer',
    companyName: 'Google',
    companyLogo: 'https://www.gstatic.com/images/branding/product/2x/googleg_48dp.png',
    candidateId: 2,
    candidateName: 'Priya Patel',
    candidateEmail: 'priya.patel@example.com',
    candidatePhone: '+91 98123 45678',
    candidateRole: 'UI/UX Frontend Engineer',
    candidateAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    candidateLocation: 'Mumbai, MH',
    experienceYears: 3,
    skills: ['React', 'Figma', 'JavaScript', 'CSS Modules'],
    status: 'Interview',
    appliedAt: '2026-10-24T10:15:00.000Z',
    notes: 'Shortlisted for technical round following preliminary screening.',
    expectedSalary: '₹ 12L - 15L / year',
  },
  {
    id: 'app_103',
    jobId: 'job_02',
    jobTitle: 'Backend Developer',
    companyName: 'Microsoft',
    companyLogo: 'https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg',
    candidateId: 3,
    candidateName: 'Amit Verma',
    candidateEmail: 'amit.verma@example.com',
    candidatePhone: '+91 97654 32109',
    candidateRole: 'Cloud Backend Architect',
    candidateAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    candidateLocation: 'Hyderabad, TS',
    experienceYears: 5,
    skills: ['Node.js', 'Go', 'Kubernetes', 'PostgreSQL', 'Microservices'],
    status: 'Shortlisted',
    appliedAt: '2026-10-26T09:00:00.000Z',
    notes: 'Solid distributed systems background with high-throughput cloud API deployments.',
    expectedSalary: '₹ 18L - 22L / year',
  },
  {
    id: 'app_104',
    jobId: 'job_03',
    jobTitle: 'UI/UX Designer',
    companyName: 'Apple',
    companyLogo: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg',
    candidateId: 4,
    candidateName: 'Neha Gupta',
    candidateEmail: 'neha.gupta@example.com',
    candidatePhone: '+91 96543 21098',
    candidateRole: 'Product & Visual Designer',
    candidateAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    candidateLocation: 'Pune, MH',
    experienceYears: 4,
    skills: ['Figma', 'Design Systems', 'User Research', 'Prototyping'],
    status: 'Hired',
    appliedAt: '2026-10-20T11:45:00.000Z',
    notes: 'Offer accepted! Onboarding scheduled for next month.',
    expectedSalary: '₹ 16L - 20L / year',
  },
  {
    id: 'app_105',
    jobId: 'job_04',
    jobTitle: 'Data Scientist',
    companyName: 'Amazon',
    companyLogo: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg',
    candidateId: 5,
    candidateName: 'Vikram Malhotra',
    candidateEmail: 'vikram.m@example.com',
    candidatePhone: '+91 95432 10987',
    candidateRole: 'ML & NLP Specialist',
    candidateAvatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150',
    candidateLocation: 'Bengaluru, KA',
    experienceYears: 5,
    skills: ['Python', 'PyTorch', 'NLP', 'SQL', 'Scikit-Learn'],
    status: 'Interview',
    appliedAt: '2026-10-23T16:20:00.000Z',
    notes: 'Completed technical coding round, panel interview next Tuesday.',
    expectedSalary: '₹ 20L - 26L / year',
  },
  {
    id: 'app_106',
    jobId: 'job_05',
    jobTitle: 'DevOps Engineer',
    companyName: 'Netflix',
    companyLogo: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg',
    candidateId: 6,
    candidateName: 'Ananya Sen',
    candidateEmail: 'ananya.sen@example.com',
    candidatePhone: '+91 94321 09876',
    candidateRole: 'Site Reliability Engineer',
    candidateAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
    candidateLocation: 'Delhi, DL',
    experienceYears: 3,
    skills: ['AWS', 'Terraform', 'Docker', 'Prometheus', 'CI/CD'],
    status: 'In Review',
    appliedAt: '2026-10-27T08:10:00.000Z',
    notes: 'Submitted resume and completed initial screening assessment.',
    expectedSalary: '₹ 15L - 19L / year',
  },
];

/**
 * Get all stored applications from LocalStorage
 */
export const getStoredApplications = () => {
  try {
    const raw = localStorage.getItem(APPLICATIONS_DB_KEY);
    if (!raw) {
      localStorage.setItem(APPLICATIONS_DB_KEY, JSON.stringify(INITIAL_APPLICATIONS));
      return INITIAL_APPLICATIONS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : INITIAL_APPLICATIONS;
  } catch {
    return INITIAL_APPLICATIONS;
  }
};

/**
 * Save applications to LocalStorage and broadcast events
 */
export const saveApplicationsToStorage = (apps) => {
  try {
    localStorage.setItem(APPLICATIONS_DB_KEY, JSON.stringify(apps));
    window.dispatchEvent(new Event('applications_updated'));
    window.dispatchEvent(new Event('storage'));
  } catch (err) {
    console.error('Failed to save applications:', err);
  }
};

/**
 * Apply for a Job as a Candidate
 * Updates the candidate's applied list, increments recruiter job applicant count,
 * records dynamic activity and sends notification to recruiter!
 */
export const applyForJob = ({
  jobId,
  jobTitle,
  companyName,
  candidateId = 1,
  candidateName = 'Olivia Wilson',
  candidateEmail = 'olivia.wilson@example.com',
  candidateRole = 'Frontend Developer',
  candidateAvatar = 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
  notes = '',
}) => {
  try {
    const jobs = getStoredJobs();
    const matchedJob = jobs.find((j) => String(j.id) === String(jobId));

    const apps = getStoredApplications();

    // Check if already applied
    const existing = apps.find(
      (a) =>
        String(a.jobId) === String(jobId) &&
        (String(a.candidateId) === String(candidateId) || a.candidateEmail === candidateEmail)
    );

    if (existing) {
      return { success: false, message: 'Already applied for this position', application: existing };
    }

    const newApp = {
      id: `app_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      jobId: String(jobId),
      jobTitle: jobTitle || matchedJob?.title || 'Open Position',
      companyName: companyName || matchedJob?.companyName || 'Top Company',
      companyLogo: matchedJob?.companyLogo || '',
      candidateId: candidateId || 1,
      candidateName: candidateName || 'Olivia Wilson',
      candidateEmail: candidateEmail || 'olivia.wilson@example.com',
      candidatePhone: '+1 (555) 234-5678',
      candidateRole: candidateRole || 'Frontend Developer',
      candidateAvatar: candidateAvatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      candidateLocation: matchedJob?.location || 'Bengaluru, KA',
      experienceYears: 3,
      skills: matchedJob?.skills?.slice(0, 4) || ['React', 'JavaScript'],
      status: 'In Review',
      appliedAt: new Date().toISOString(),
      notes: notes || `Applied for ${matchedJob?.title || 'this role'}. Looking forward to discussing this opportunity.`,
      expectedSalary: matchedJob?.salaryRange || '₹ 12L - 16L / year',
    };

    const updatedApps = [newApp, ...apps];
    saveApplicationsToStorage(updatedApps);

    // Increment applicant count on the job in jobsService
    if (matchedJob) {
      const jobIdx = jobs.findIndex((j) => String(j.id) === String(jobId));
      if (jobIdx >= 0) {
        jobs[jobIdx].applicationsCount = (Number(jobs[jobIdx].applicationsCount) || 0) + 1;
        saveJobsToStorage(jobs);
      }
    }

    // Update applied IDs key in LocalStorage
    try {
      const appliedIdsKey = 'jobportal_applied_job_ids';
      const rawIds = localStorage.getItem(appliedIdsKey);
      const appliedIds = rawIds ? JSON.parse(rawIds) : [];
      if (!appliedIds.includes(String(jobId))) {
        localStorage.setItem(appliedIdsKey, JSON.stringify([...appliedIds, String(jobId)]));
      }
    } catch {}

    // Record activity and notification for recruiter and candidate
    recordActivity({
      type: 'application',
      title: 'New application submitted',
      meta: `${candidateName} applied for ${newApp.jobTitle} at ${newApp.companyName}`,
      link: `/jobs/${jobId}`,
      iconType: 'user-check',
    });

    addNotification({
      title: 'New Application Received',
      message: `${candidateName} applied for ${newApp.jobTitle} (${newApp.companyName})`,
      type: 'application',
      link: `/applications`,
      iconType: 'user-check',
    });

    return { success: true, application: newApp };
  } catch (err) {
    console.error('Failed to submit application:', err);
    return { success: false, message: err.message };
  }
};

/**
 * Withdraw an application (Candidate action)
 */
export const withdrawApplication = (applicationIdOrJobId) => {
  try {
    const apps = getStoredApplications();
    const target = apps.find(
      (a) => String(a.id) === String(applicationIdOrJobId) || String(a.jobId) === String(applicationIdOrJobId)
    );

    if (!target) return false;

    const filtered = apps.filter((a) => a.id !== target.id);
    saveApplicationsToStorage(filtered);

    // Decrement application count on job
    const jobs = getStoredJobs();
    const jobIdx = jobs.findIndex((j) => String(j.id) === String(target.jobId));
    if (jobIdx >= 0 && jobs[jobIdx].applicationsCount > 0) {
      jobs[jobIdx].applicationsCount -= 1;
      saveJobsToStorage(jobs);
    }

    // Remove from applied IDs list
    try {
      const appliedIdsKey = 'jobportal_applied_job_ids';
      const rawIds = localStorage.getItem(appliedIdsKey);
      const appliedIds = rawIds ? JSON.parse(rawIds) : [];
      const updatedIds = appliedIds.filter((id) => String(id) !== String(target.jobId));
      localStorage.setItem(appliedIdsKey, JSON.stringify(updatedIds));
    } catch {}

    recordActivity({
      type: 'application',
      title: 'Application withdrawn',
      meta: `Withdrew application for ${target.jobTitle} at ${target.companyName}`,
      link: `/jobs/${target.jobId}`,
      iconType: 'file-text',
    });

    return true;
  } catch (err) {
    console.error('Failed to withdraw application:', err);
    return false;
  }
};

/**
 * Update Application Status (Recruiter action: e.g. Advance to Interview, Shortlist, Hire, Reject)
 */
export const updateApplicationStatus = (applicationId, newStatus) => {
  try {
    const apps = getStoredApplications();
    const index = apps.findIndex((a) => String(a.id) === String(applicationId));

    if (index >= 0) {
      apps[index].status = newStatus;
      saveApplicationsToStorage(apps);

      recordActivity({
        type: 'application',
        title: `Candidate ${newStatus}`,
        meta: `${apps[index].candidateName}'s application for ${apps[index].jobTitle} updated to "${newStatus}"`,
        link: `/applications`,
        iconType: newStatus === 'Hired' ? 'user-check' : 'star',
      });

      addNotification({
        title: `Application Status: ${newStatus}`,
        message: `${apps[index].candidateName} is now marked as ${newStatus} for ${apps[index].jobTitle}`,
        type: 'application',
        link: `/applications`,
        iconType: 'user-check',
      });

      return apps[index];
    }
    return null;
  } catch (err) {
    console.error('Failed to update application status:', err);
    return null;
  }
};

/**
 * Get applications for a specific job (Used in JobDetails Applicants tab)
 */
export const getApplicationsByJobId = (jobId) => {
  const apps = getStoredApplications();
  return apps.filter((a) => String(a.jobId) === String(jobId));
};

/**
 * Get applications by candidate (Used for candidate's own view)
 */
export const getCandidateApplications = (candidateIdOrEmail) => {
  const apps = getStoredApplications();
  if (!candidateIdOrEmail) return apps;
  return apps.filter(
    (a) =>
      String(a.candidateId) === String(candidateIdOrEmail) ||
      a.candidateEmail?.toLowerCase() === String(candidateIdOrEmail).toLowerCase()
  );
};

/**
 * Get Application Pipeline Stats for Recruiter or Candidate
 */
export const getApplicationStats = (jobId = null) => {
  const allApps = getStoredApplications();
  const apps = jobId ? allApps.filter((a) => String(a.jobId) === String(jobId)) : allApps;

  return {
    total: apps.length,
    inReview: apps.filter((a) => a.status === 'In Review').length,
    interview: apps.filter((a) => a.status === 'Interview').length,
    shortlisted: apps.filter((a) => a.status === 'Shortlisted').length,
    hired: apps.filter((a) => a.status === 'Hired').length,
    rejected: apps.filter((a) => a.status === 'Rejected').length,
  };
};
