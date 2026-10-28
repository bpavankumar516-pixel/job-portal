// Activity Logging and Dynamic Event Synthesis Service
import { getStoredJobs, getSavedJobIds } from './jobsService';
import { getStoredCompanies } from './companiesService';
import { addNotification } from './notificationService';

const ACTIVITIES_KEY = 'jobportal_recent_activities';

/**
 * Get stored activities from LocalStorage
 */
export const getStoredActivities = () => {
  try {
    const data = localStorage.getItem(ACTIVITIES_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

/**
 * Record a new dynamic activity event into LocalStorage & emit real-time notification
 */
export const recordActivity = (activity) => {
  try {
    const existing = getStoredActivities();
    const newActivity = {
      id: `act_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      timestamp: Date.now(),
      time: 'Just now',
      ...activity,
    };
    const updated = [newActivity, ...existing].slice(0, 35);
    localStorage.setItem(ACTIVITIES_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('storage'));

    // Automatically synchronize with dynamic notification system
    if (activity.notify !== false) {
      addNotification({
        title: activity.title,
        message: activity.meta || activity.message || activity.title,
        type: activity.type || 'info',
        link: activity.link || '/dashboard',
        iconType: activity.iconType || activity.type || 'bell',
      });
    }

    return newActivity;
  } catch (err) {
    console.error('Failed to record activity:', err);
    return null;
  }
};

/**
 * Convenience helper to log an action to both activities and notifications
 */
export const logAction = (actionData) => recordActivity(actionData);

/**
 * Clear stored activities
 */
export const clearActivities = () => {
  try {
    localStorage.removeItem(ACTIVITIES_KEY);
    window.dispatchEvent(new Event('storage'));
  } catch {}
};

/**
 * Generates dynamic activities based on real live data from jobs, candidates, and companies
 */
export const getDynamicActivities = (jobs = [], candidates = [], shortlistedIds = []) => {
  const customStored = getStoredActivities();
  const rawJobs = jobs.length > 0 ? jobs : getStoredJobs();
  const rawCompanies = getStoredCompanies();
  const savedIds = getSavedJobIds();

  const generated = [];

  // 1. Candidate Application activities based on real jobs & real DummyJSON candidates
  if (candidates.length > 0 && rawJobs.length > 0) {
    const c1 = candidates[0]; // Rahul Sharma
    const j1 = rawJobs[0]; // Frontend Developer at Google
    generated.push({
      id: 'gen_app_1',
      type: 'application',
      title: 'New application received',
      meta: `${c1?.name || 'Rahul Sharma'} applied for ${j1?.title || 'Frontend Developer'} at ${j1?.companyName || 'Google'}`,
      time: '8 min ago',
      link: j1?.id ? `/jobs/${j1.id}` : '/jobs',
      iconType: 'user-check',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    });

    if (candidates.length > 1 && rawJobs.length > 1) {
      const c2 = candidates[1];
      const j2 = rawJobs[1];
      generated.push({
        id: 'gen_app_2',
        type: 'application',
        title: 'Application in Review',
        meta: `${c2.name} · ${j2.title} at ${j2.companyName}`,
        time: '35 min ago',
        link: j2.id ? `/jobs/${j2.id}` : '/jobs',
        iconType: 'file-text',
        badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
      });
    }
  }

  // 2. Shortlisted Candidates
  if (shortlistedIds.length > 0 && candidates.length > 0) {
    const shortlistedCands = candidates.filter((c) => shortlistedIds.includes(c.id));
    if (shortlistedCands.length > 0) {
      const s1 = shortlistedCands[0];
      generated.push({
        id: 'gen_shortlist_1',
        type: 'candidate',
        title: 'Candidate shortlisted',
        meta: `${s1.name} · ${s1.role} (${s1.experienceYears} exp)`,
        time: '1 hr ago',
        link: `/candidates/${s1.id}`,
        iconType: 'star',
        badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
      });
    }
  }

  // 3. Recently Posted Jobs
  if (rawJobs.length > 0) {
    const newestJob = rawJobs[0];
    generated.push({
      id: 'gen_job_1',
      type: 'job',
      title: 'Job posting published',
      meta: `${newestJob.title} · ${newestJob.companyName} (${newestJob.location})`,
      time: '2 hrs ago',
      link: `/jobs/${newestJob.id}`,
      iconType: 'briefcase',
      badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    });
  }

  // 4. Saved Jobs Activity
  if (savedIds.length > 0 && rawJobs.length > 0) {
    const savedJob = rawJobs.find((j) => savedIds.includes(j.id)) || rawJobs[0];
    generated.push({
      id: 'gen_saved_1',
      type: 'bookmark',
      title: 'Job saved to bookmarks',
      meta: `${savedJob.title} at ${savedJob.companyName}`,
      time: '4 hrs ago',
      link: `/jobs/${savedJob.id}`,
      iconType: 'bookmark',
      badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
    });
  }

  // 5. Active Company Hiring
  if (rawCompanies.length > 0) {
    const topComp = rawCompanies[0];
    generated.push({
      id: 'gen_comp_1',
      type: 'company',
      title: 'Company actively hiring',
      meta: `${topComp.name} · ${topComp.industry} (${topComp.openJobs || 12} open roles)`,
      time: 'Yesterday',
      link: `/companies/${topComp.id}`,
      iconType: 'building',
      badgeColor: 'bg-sky-50 text-sky-700 border-sky-200',
    });
  }

  // Merge custom stored activities with generated ones, custom first
  const merged = [...customStored, ...generated];

  // Remove duplicate titles if any
  const seen = new Set();
  const deduped = [];
  for (const item of merged) {
    const key = `${item.title}_${item.meta}`;
    if (!seen.has(key)) {
      seen.add(key);
      deduped.push(item);
    }
  }

  return deduped.slice(0, 5);
};
