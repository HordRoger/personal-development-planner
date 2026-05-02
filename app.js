const STORAGE_KEY = "team-improvement-plan";
const STORAGE_VERSION = 3;
const CLOUD_SAVE_DEBOUNCE_MS = 900;
const ROW_HEIGHT = 92;
const LABEL_WIDTH = 170;
const MIN_WEEK_WIDTH = 72;
const DEFAULT_TIMELINE_YEAR = getCurrentTimelineYear();
const DEFAULT_TIMELINE_WEEKS = getISOWeeksInYear(DEFAULT_TIMELINE_YEAR);
const DEFAULT_TIMELINE_START_DATE = getISOYearStartISO(DEFAULT_TIMELINE_YEAR);
const LOCK_ICON_URL = "padlock.png";
const UNLOCK_ICON_URL = "open-padlock.png";
const SVG_NS = "http://www.w3.org/2000/svg";
const ROADMAP_COLORS = ["#28f879", "#ffd21a", "#ff1630", "#36a8ff", "#ff7a2f", "#c47cff", "#2de2d1", "#f052b8"];
const WORKSPACE_VIEW_TIMELINE = "timeline";
const WORKSPACE_VIEW_ROADMAP = "roadmap";
const THEME_DARK = "dark";
const THEME_LIGHT = "light";
const TIMELINE_ZOOM_MONTH = "month";
const TIMELINE_ZOOM_WEEK = "week";
const TIMELINE_ZOOM_DAY = "day";
const TIMELINE_ZOOM_LEVELS = [TIMELINE_ZOOM_MONTH, TIMELINE_ZOOM_WEEK, TIMELINE_ZOOM_DAY];
const TIMELINE_ZOOM_LABELS = {
  [TIMELINE_ZOOM_MONTH]: "Mesi",
  [TIMELINE_ZOOM_WEEK]: "Settimane",
  [TIMELINE_ZOOM_DAY]: "Giorni",
};
const TIMELINE_UNIT_WIDTHS = {
  [TIMELINE_ZOOM_MONTH]: 128,
  [TIMELINE_ZOOM_WEEK]: 72,
  [TIMELINE_ZOOM_DAY]: 42,
};
const ACCESS_JUNIOR = 1;
const ACCESS_SENIOR = 2;
const ACCESS_TEAM_LEADER = 3;
const ACCESS_LEVELS = [ACCESS_JUNIOR, ACCESS_SENIOR, ACCESS_TEAM_LEADER];
const ACCESS_LEVEL_LABELS = {
  [ACCESS_JUNIOR]: "Junior",
  [ACCESS_SENIOR]: "Senior",
  [ACCESS_TEAM_LEADER]: "Team leader",
};
const MIGRATED_USER_PASSWORD = "password";
const REQUIRED_USERS = [
  {
    id: "ruggero-fermariello",
    name: "Ruggero Fermariello",
    role: "Team leader",
    level: ACCESS_TEAM_LEADER,
    managerId: "",
    password: "123",
  },
];

const criteriaStatusLabels = {
  locked: "Bloccato",
  unlocked: "Sbloccato",
};

const defaultState = {
  activeMemberId: "marta-rossi",
  timelineYear: DEFAULT_TIMELINE_YEAR,
  timelineWeeks: DEFAULT_TIMELINE_WEEKS,
  timelineStartDate: DEFAULT_TIMELINE_START_DATE,
  members: [
    {
      id: "ruggero-fermariello",
      name: "Ruggero Fermariello",
      role: "Team leader",
      level: ACCESS_TEAM_LEADER,
      managerId: "",
      password: "123",
      goals: [],
    },
    {
      id: "marta-rossi",
      name: "Marta Rossi",
      role: "Frontend Engineer",
      level: ACCESS_TEAM_LEADER,
      managerId: "",
      password: "marta",
      goals: [
        {
          id: "g1",
          title: "Ownership dei rilasci",
          start: 1,
          duration: 6,
          progress: 65,
          criteria: [{ id: "c1", label: "Release checklist autonoma", position: 65, status: "unlocked" }],
        },
        {
          id: "g2",
          title: "Mentoring su componenti UI",
          start: 4,
          duration: 5,
          progress: 45,
          criteria: [{ id: "c2", label: "Pairing svolto", position: 45, status: "locked" }],
        },
        {
          id: "g3",
          title: "Qualita test end-to-end",
          start: 8,
          duration: 5,
          progress: 25,
          criteria: [{ id: "c3", label: "Scenario critico coperto", position: 25, status: "locked" }],
        },
      ],
    },
    {
      id: "luca-bianchi",
      name: "Luca Bianchi",
      role: "Backend Engineer",
      level: ACCESS_SENIOR,
      managerId: "marta-rossi",
      password: "luca",
      goals: [
        {
          id: "g4",
          title: "Riduzione incidenti API",
          start: 1,
          duration: 9,
          progress: 50,
          criteria: [{ id: "c4", label: "Runbook validato", position: 50, status: "unlocked" }],
        },
        {
          id: "g5",
          title: "Documentazione tecnica",
          start: 3,
          duration: 7,
          progress: 35,
          criteria: [{ id: "c5", label: "Pagina architettura aggiornata", position: 35, status: "locked" }],
        },
      ],
    },
    {
      id: "giulia-verdi",
      name: "Giulia Verdi",
      role: "Junior QA",
      level: ACCESS_JUNIOR,
      managerId: "luca-bianchi",
      password: "giulia",
      goals: [
        {
          id: "g6",
          title: "Autonomia sui test regressivi",
          start: 5,
          duration: 6,
          progress: 30,
          criteria: [{ id: "c6", label: "Suite regressiva eseguita", position: 30, status: "locked" }],
        },
      ],
    },
  ],
};

const state = loadState();
const initialLocalSavedAt = state.savedAt;
const elements = {
  appShell: document.querySelector("#appShell"),
  workspace: document.querySelector(".workspace"),
  toggleLeftSidebar: document.querySelector("#toggleLeftSidebar"),
  memberSelect: document.querySelector("#memberSelect"),
  memberName: document.querySelector("#memberName"),
  memberRole: document.querySelector("#memberRole"),
  memberPassword: document.querySelector("#memberPassword"),
  memberLevel: document.querySelector("#memberLevel"),
  memberManager: document.querySelector("#memberManager"),
  saveMember: document.querySelector("#saveMember"),
  memberList: document.querySelector("#memberList"),
  memberCount: document.querySelector("#memberCount"),
  activeMemberName: document.querySelector("#activeMemberName"),
  activeMemberRole: document.querySelector("#activeMemberRole"),
  memberAvatar: document.querySelector("#memberAvatar"),
  goalPopup: document.querySelector("#goalPopup"),
  goalPopupPanel: document.querySelector(".goal-popup-panel"),
  closeGoalPopup: document.querySelector("#closeGoalPopup"),
  goalList: document.querySelector("#goalList"),
  confirmDialog: document.querySelector("#confirmDialog"),
  confirmMessage: document.querySelector("#confirmMessage"),
  cancelConfirm: document.querySelector("#cancelConfirm"),
  confirmDelete: document.querySelector("#confirmDelete"),
  goalTemplate: document.querySelector("#goalTemplate"),
  criterionTemplate: document.querySelector("#criterionTemplate"),
  timelineFrame: document.querySelector("#timelineFrame"),
  timeAxis: document.querySelector("#timeAxis"),
  planGrid: document.querySelector("#planGrid"),
  timelineHoverLine: document.querySelector("#timelineHoverLine"),
  addGoalButton: document.querySelector("#addGoalButton"),
  zoomTimelineOut: document.querySelector("#zoomTimelineOut"),
  zoomTimelineIn: document.querySelector("#zoomTimelineIn"),
  timelineZoomLabel: document.querySelector("#timelineZoomLabel"),
  timelineYear: document.querySelector("#timelineYear"),
  toggleTheme: document.querySelector("#toggleTheme"),
  openUserManagement: document.querySelector("#openUserManagement"),
  openUserManagementHeader: document.querySelector("#openUserManagementHeader"),
  closeUserManagement: document.querySelector("#closeUserManagement"),
  userManagementDialog: document.querySelector("#userManagementDialog"),
  userManagementList: document.querySelector("#userManagementList"),
  userManagementError: document.querySelector("#userManagementError"),
  createUserPanel: document.querySelector("#createUserPanel"),
  loginDialog: document.querySelector("#loginDialog"),
  loginForm: document.querySelector("#loginForm"),
  loginName: document.querySelector("#loginName"),
  loginPassword: document.querySelector("#loginPassword"),
  loginError: document.querySelector("#loginError"),
  sessionUser: document.querySelector("#sessionUser"),
  logoutUser: document.querySelector("#logoutUser"),
  saveStatus: document.querySelector("#saveStatus"),
  goCurrentWeek: document.querySelector("#goCurrentWeek"),
  goRoadmap: document.querySelector("#goRoadmap"),
  roadmapSection: document.querySelector("#roadmapSection"),
  roadmapCanvas: document.querySelector("#roadmapCanvas"),
  roadmapMember: document.querySelector("#roadmapMember"),
};

let activePopupGoalId = null;
let activePopupCriterionId = null;
let goalPopupAnchorRect = null;
let pendingCriterionFocus = null;
let pendingDeleteMemberId = null;
let roadmapPanState = null;
let loginFocusQueued = false;
const auth = {
  currentUserId: null,
};
const cloudSync = {
  ready: false,
  saveTimer: null,
  saving: false,
};

function loadState() {
  const saved = readPersistedState();
  if (!saved) return normalizeState(cloneDefaultState());

  try {
    return normalizeState(JSON.parse(saved));
  } catch {
    return normalizeState(cloneDefaultState());
  }
}

function readPersistedState() {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

function cloneDefaultState() {
  return JSON.parse(JSON.stringify(defaultState));
}

function normalizeState(source) {
  const fallback = cloneDefaultState();
  const legacyMonths = source?.timelineWeeks ? null : Number(source?.months) || null;
  const timelineYear = getNormalizedTimelineYear(source);
  const timelineWeeks = getISOWeeksInYear(timelineYear);
  const timelineStartDate = getISOYearStartISO(timelineYear);
  const sourceTimelineStartDate = getValidTimelineStartDate(source?.timelineStartDate) || timelineStartDate;
  const timelineMigration =
    sourceTimelineStartDate === timelineStartDate
      ? null
      : { sourceStartDate: sourceTimelineStartDate, targetStartDate: timelineStartDate };
  const normalized = {
    schemaVersion: STORAGE_VERSION,
    activeMemberId: source?.activeMemberId || fallback.activeMemberId,
    timelineYear,
    timelineWeeks,
    timelineStartDate,
    savedAt: isValidDateValue(source?.savedAt) ? source.savedAt : null,
    ui: {
      leftCollapsed: Boolean(source?.ui?.leftCollapsed),
      activeView: source?.ui?.activeView === WORKSPACE_VIEW_ROADMAP ? WORKSPACE_VIEW_ROADMAP : WORKSPACE_VIEW_TIMELINE,
      timelineZoom: TIMELINE_ZOOM_LEVELS.includes(source?.ui?.timelineZoom) ? source.ui.timelineZoom : TIMELINE_ZOOM_WEEK,
      theme: source?.ui?.theme === THEME_LIGHT ? THEME_LIGHT : THEME_DARK,
    },
    members: Array.isArray(source?.members) && source.members.length ? source.members : fallback.members,
  };

  normalized.members = normalized.members.map((member, memberIndex) => ({
    id: member.id || createId(`member-${memberIndex + 1}`),
    name: member.name || `Membro ${memberIndex + 1}`,
    role: member.role || "",
    level: normalizeAccessLevel(member.level ?? inferAccessLevel(member, memberIndex)),
    managerId: member.managerId || "",
    password: String(member.password || MIGRATED_USER_PASSWORD),
    goals: Array.isArray(member.goals)
      ? member.goals.map((goal) => normalizeGoal(goal, normalized.timelineWeeks, legacyMonths, timelineMigration))
      : [],
  }));

  const sourceVersion = Number(source?.schemaVersion);
  repairMemberHierarchy(normalized.members, !Number.isFinite(sourceVersion) || sourceVersion < STORAGE_VERSION);
  ensureRequiredUsers(normalized.members);

  if (!normalized.members.some((member) => member.id === normalized.activeMemberId)) {
    normalized.activeMemberId = normalized.members[0]?.id || "";
  }

  return normalized;
}

function ensureRequiredUsers(members) {
  REQUIRED_USERS.forEach((requiredUser) => {
    const existing = members.find((member) => isRequiredUser(member, requiredUser));
    if (existing) {
      existing.role = existing.role || requiredUser.role;
      existing.level = requiredUser.level;
      existing.managerId = requiredUser.managerId;
      existing.password = requiredUser.password;
      return;
    }

    members.unshift({
      id: requiredUser.id || createId(requiredUser.name),
      name: requiredUser.name,
      role: requiredUser.role,
      level: requiredUser.level,
      managerId: requiredUser.managerId,
      password: requiredUser.password,
      goals: [],
    });
  });
}

function isRequiredUser(member, requiredUser) {
  return normalizeUserName(member?.name) === normalizeUserName(requiredUser.name);
}

function normalizeUserName(name) {
  return String(name || "").trim().replace(/\s+/g, " ").toLowerCase();
}

function normalizeAccessLevel(value) {
  const level = Math.round(Number(value));
  return ACCESS_LEVELS.includes(level) ? level : ACCESS_JUNIOR;
}

function inferAccessLevel(member, memberIndex) {
  const role = String(member?.role || "").toLowerCase();
  if (/\b(team\s*leader|leader|lead)\b/.test(role)) return ACCESS_TEAM_LEADER;
  if (/\bsenior\b/.test(role)) return ACCESS_SENIOR;
  if (/\bjunior\b/.test(role)) return ACCESS_JUNIOR;
  if (memberIndex === 0) return ACCESS_TEAM_LEADER;
  if (memberIndex === 1) return ACCESS_SENIOR;
  return ACCESS_JUNIOR;
}

function repairMemberHierarchy(members, assignMissingManagers = false) {
  const memberById = new Map(members.map((member) => [member.id, member]));

  members.forEach((member) => {
    const manager = memberById.get(member.managerId);
    if (
      !manager ||
      manager.id === member.id ||
      manager.level <= member.level ||
      createsManagementCycle(member.id, manager.id, memberById)
    ) {
      member.managerId = "";
    }
  });

  if (!assignMissingManagers) return;

  members.forEach((member) => {
    if (member.managerId || member.level >= ACCESS_TEAM_LEADER) return;
    const manager = findDefaultManagerForMember(member, members);
    if (manager) member.managerId = manager.id;
  });
}

function findDefaultManagerForMember(member, members) {
  return (
    members.find((candidate) => candidate.id !== member.id && candidate.level === member.level + 1) ||
    members.find((candidate) => candidate.id !== member.id && candidate.level > member.level) ||
    null
  );
}

function createsManagementCycle(memberId, managerId, memberById) {
  const seen = new Set([memberId]);
  let current = memberById.get(managerId);

  while (current) {
    if (seen.has(current.id)) return true;
    seen.add(current.id);
    current = memberById.get(current.managerId);
  }

  return false;
}

function getNormalizedTimelineYear(source) {
  const explicitYear = Number(source?.timelineYear);
  if (explicitYear >= 1970 && explicitYear <= 2200) return Math.round(explicitYear);

  return DEFAULT_TIMELINE_YEAR;
}

function normalizeGoal(goal = {}, weeks, legacyMonths = null, timelineMigration = null) {
  let start = Number(goal.start) || 1;
  let duration = Number(goal.duration) || Math.min(6, weeks);

  if (legacyMonths) {
    start = Math.round(((start - 1) / legacyMonths) * weeks) + 1;
    duration = Math.max(1, Math.round((duration / legacyMonths) * weeks));
  }

  if (timelineMigration) {
    start = migrateGoalStartToTimeline(start, timelineMigration);
  }

  const hasCriteria = Array.isArray(goal.criteria);
  const normalized = {
    id: goal.id || createId("goal"),
    title: goal.title || "Nuova linea",
    start: clamp(start, 1, weeks),
    duration: Math.max(1, duration),
    progress: clamp(Number(goal.progress) || 0, 0, 100),
    criteria: hasCriteria
      ? goal.criteria.map(normalizeCriterion)
      : [createCriterion(clamp(Number(goal.progress) || 50, 0, 100))],
  };

  normalized.duration = clamp(normalized.duration, 1, weeks - normalized.start + 1);
  snapGoalCriteriaToGrid(normalized);
  syncGoalProgress(normalized);

  return normalized;
}

function migrateGoalStartToTimeline(start, timelineMigration) {
  const sourceStartDate = parseLocalISODate(timelineMigration.sourceStartDate);
  sourceStartDate.setDate(sourceStartDate.getDate() + (start - 1) * 7);

  const targetStartDate = parseLocalISODate(timelineMigration.targetStartDate);
  const diffDays = Math.round((sourceStartDate - targetStartDate) / (24 * 60 * 60 * 1000));
  return Math.round(diffDays / 7) + 1;
}

function normalizeCriterion(criterion = {}) {
  const legacyUnlocked = criterion.status === "ready" || criterion.status === "done";
  const status = legacyUnlocked ? "unlocked" : criterion.status;

  return {
    id: criterion.id || createId("criterion"),
    label: criterion.label || "Criterio di avanzamento",
    position: clamp(Number(criterion.position) || 0, 0, 100),
    status: criteriaStatusLabels[status] ? status : "locked",
  };
}

function persistState() {
  state.schemaVersion = STORAGE_VERSION;
  state.savedAt = new Date().toISOString();
  const persistedState = createPersistableState();

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(persistedState));
  } catch {
    updateSaveStatus(null, true, "Salvataggio locale non riuscito");
    return;
  }

  if (getSupabaseConfig()) {
    if (cloudSync.ready) {
      scheduleCloudSave();
    } else {
      updateSaveStatus(state.savedAt, false, "Cloud in attesa");
    }
    return;
  }

  updateSaveStatus(state.savedAt);
}

function createPersistableState() {
  return JSON.parse(JSON.stringify(state));
}

function updateSaveStatus(savedAt = state.savedAt, hasError = false, message = null) {
  if (!elements.saveStatus) return;

  if (hasError) {
    elements.saveStatus.textContent = message || "Salvataggio non riuscito";
    elements.saveStatus.classList.add("has-error");
    return;
  }

  elements.saveStatus.classList.remove("has-error");
  if (message) {
    elements.saveStatus.textContent = message;
    return;
  }

  if (!savedAt) {
    elements.saveStatus.textContent = "Salvataggio locale";
    return;
  }

  elements.saveStatus.textContent = `Salvato ${formatSavedTime(savedAt)}`;
}

function formatSavedTime(savedAt) {
  const date = new Date(savedAt);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" });
}

function isValidDateValue(value) {
  if (!value) return false;
  return !Number.isNaN(new Date(value).getTime());
}

function getSupabaseConfig() {
  const config = window.PLANNER_SUPABASE || {};
  const url = String(config.url || "").trim().replace(/\/+$/, "");
  const anonKey = String(config.anonKey || "").trim();
  const workspaceId = String(config.workspaceId || "").trim();
  const table = String(config.table || "planner_state").trim() || "planner_state";

  if (!url || !anonKey || !workspaceId) return null;
  return { url, anonKey, workspaceId, table };
}

function scheduleCloudSave() {
  clearTimeout(cloudSync.saveTimer);
  updateSaveStatus(state.savedAt, false, "Salvataggio cloud...");
  cloudSync.saveTimer = window.setTimeout(saveStateToCloud, CLOUD_SAVE_DEBOUNCE_MS);
}

async function initializeCloudSync() {
  const config = getSupabaseConfig();
  if (!config) {
    updateSaveStatus(state.savedAt);
    return;
  }

  updateSaveStatus(null, false, "Connessione Supabase...");

  try {
    const cloudState = await loadStateFromCloud(config);
    cloudSync.ready = true;

    if (cloudState && !isNewerDateValue(initialLocalSavedAt, cloudState.savedAt)) {
      replaceState(normalizeState(cloudState));
    }

    render();
  } catch (error) {
    console.warn("Supabase sync unavailable", error);
    cloudSync.ready = false;
    updateSaveStatus(null, true, "Cloud non raggiungibile");
  }
}

async function loadStateFromCloud(config) {
  const response = await fetch(
    `${getSupabaseTableUrl(config)}?workspace_id=eq.${encodeURIComponent(config.workspaceId)}&select=data,updated_at`,
    {
      headers: getSupabaseHeaders(config),
    },
  );

  if (!response.ok) throw new Error(`Supabase load failed: ${response.status}`);

  const rows = await response.json();
  const row = Array.isArray(rows) ? rows[0] : null;
  if (!row?.data) return null;

  return {
    ...row.data,
    savedAt: row.data.savedAt || row.updated_at || null,
  };
}

async function saveStateToCloud() {
  const config = getSupabaseConfig();
  if (!config || cloudSync.saving) return;

  cloudSync.saving = true;

  try {
    const response = await fetch(`${getSupabaseTableUrl(config)}?on_conflict=workspace_id`, {
      method: "POST",
      headers: getSupabaseHeaders(config, {
        "Content-Type": "application/json",
        Prefer: "resolution=merge-duplicates,return=minimal",
      }),
      body: JSON.stringify({
        workspace_id: config.workspaceId,
        data: createPersistableState(),
        updated_at: new Date().toISOString(),
      }),
    });

    if (!response.ok) throw new Error(`Supabase save failed: ${response.status}`);
    updateSaveStatus(state.savedAt, false, `Cloud salvato ${formatSavedTime(state.savedAt)}`);
  } catch (error) {
    console.warn("Supabase save unavailable", error);
    updateSaveStatus(null, true, "Cloud non salvato");
  } finally {
    cloudSync.saving = false;
  }
}

function getSupabaseTableUrl(config) {
  return `${config.url}/rest/v1/${encodeURIComponent(config.table)}`;
}

function getSupabaseHeaders(config, extraHeaders = {}) {
  return {
    apikey: config.anonKey,
    Authorization: `Bearer ${config.anonKey}`,
    ...extraHeaders,
  };
}

function replaceState(nextState) {
  Object.keys(state).forEach((key) => delete state[key]);
  Object.assign(state, nextState);
}

function isNewerDateValue(candidate, reference) {
  if (!isValidDateValue(candidate)) return false;
  if (!isValidDateValue(reference)) return true;
  return new Date(candidate).getTime() > new Date(reference).getTime();
}

function getCurrentUser() {
  return state.members.find((member) => member.id === auth.currentUserId) ?? null;
}

function getVisibleMembers(user = getCurrentUser()) {
  if (!user) return [];
  return state.members.filter((member) => canAccessMember(user, member));
}

function getActiveMember() {
  const visibleMembers = getVisibleMembers();
  return visibleMembers.find((member) => member.id === state.activeMemberId) ?? null;
}

function ensureActiveMemberVisible() {
  if (!getCurrentUser()) return null;

  const visibleMembers = getVisibleMembers();
  if (!visibleMembers.length) {
    state.activeMemberId = "";
    closeGoalPopup();
    return null;
  }

  if (!visibleMembers.some((member) => member.id === state.activeMemberId)) {
    state.activeMemberId = getCurrentUser()?.id || visibleMembers[0].id;
    closeGoalPopup();
  }

  return getActiveMember();
}

function canAccessMember(user, member) {
  if (!user || !member) return false;
  if (user.id === member.id) return true;
  if (isWorkspaceOwner(user)) return true;
  if (user.level <= ACCESS_JUNIOR) return false;
  return isSubordinateOf(member.id, user.id);
}

function isWorkspaceOwner(user) {
  return REQUIRED_USERS.some(
    (requiredUser) => isRequiredUser(user, requiredUser) && user.level === ACCESS_TEAM_LEADER,
  );
}

function isSubordinateOf(memberId, managerId) {
  const memberById = new Map(state.members.map((member) => [member.id, member]));
  const seen = new Set();
  let current = memberById.get(memberId);

  while (current?.managerId) {
    if (seen.has(current.id)) return false;
    seen.add(current.id);
    if (current.managerId === managerId) return true;
    current = memberById.get(current.managerId);
  }

  return false;
}

function canManageMember(user, member) {
  return canAccessMember(user, member);
}

function canCreateSubordinate(user = getCurrentUser()) {
  return Boolean(user && user.level > ACCESS_JUNIOR);
}

function getAccessLevelLabel(level) {
  return ACCESS_LEVEL_LABELS[normalizeAccessLevel(level)] || ACCESS_LEVEL_LABELS[ACCESS_JUNIOR];
}

function getMemberSubtitle(member) {
  const role = member.role || "Ruolo non indicato";
  return `${role} · ${getAccessLevelLabel(member.level)}`;
}

function createId(value) {
  const base = String(value)
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  const suffix = Math.random().toString(36).slice(2, 7);
  return `${base || "item"}-${suffix}`;
}

function createCriterion(position = 50) {
  return {
    id: createId("criterion"),
    label: "Criterio di avanzamento",
    position: clamp(position, 0, 100),
    status: "locked",
  };
}

function getInitials(name) {
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((part) => part[0]?.toUpperCase()).join("") || "--";
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(value, max));
}

function clampGoal(goal) {
  goal.start = clamp(Number(goal.start) || 1, 1, state.timelineWeeks);
  goal.duration = clamp(Number(goal.duration) || 1, 1, state.timelineWeeks - goal.start + 1);
  goal.criteria = Array.isArray(goal.criteria) ? goal.criteria.map(normalizeCriterion) : [];
  snapGoalCriteriaToGrid(goal);
  syncGoalProgress(goal);
}

function syncGoalProgress(goal) {
  const orderedCriteria = [...goal.criteria].sort((first, second) => first.position - second.position);
  const firstLocked = orderedCriteria.find((criterion) => criterion.status === "locked");

  if (firstLocked) {
    goal.progress = clamp(Number(firstLocked.position) || 0, 0, 100);
    return;
  }

  goal.progress = orderedCriteria.length ? 100 : 0;
}

function render() {
  const activeMember = ensureActiveMemberVisible();
  const timelineUnits = getTimelineUnits();
  const currentUnitIndex = getCurrentTimelineUnitIndex(timelineUnits);
  const timelineUnitWidth = getTimelineUnitWidth();
  const timelineMinWidth = LABEL_WIDTH + timelineUnits.length * timelineUnitWidth;
  document.documentElement.style.setProperty("--weeks", timelineUnits.length);
  document.documentElement.style.setProperty("--week-width", `${100 / timelineUnits.length}%`);
  document.documentElement.style.setProperty("--timeline-unit-min-width", `${timelineUnitWidth}px`);
  document.documentElement.style.setProperty("--timeline-min-width", `${timelineMinWidth}px`);
  document.documentElement.style.setProperty("--row-label-width", `${LABEL_WIDTH}px`);
  document.documentElement.style.setProperty("--current-week-left", `${(currentUnitIndex / timelineUnits.length) * 100}%`);
  document.documentElement.style.setProperty("--current-week-opacity", currentUnitIndex >= 0 ? "1" : "0");
  elements.timelineYear.textContent = `Anno ${state.timelineYear}`;
  elements.timelineZoomLabel.textContent = TIMELINE_ZOOM_LABELS[state.ui.timelineZoom];
  elements.zoomTimelineOut.disabled = state.ui.timelineZoom === TIMELINE_ZOOM_MONTH;
  elements.zoomTimelineIn.disabled = state.ui.timelineZoom === TIMELINE_ZOOM_DAY;
  elements.goCurrentWeek.title = currentUnitIndex < 0 ? "Mostra griglia" : "Mostra griglia e vai al periodo corrente";

  renderMemberSelect(activeMember);
  renderMemberList(activeMember);
  renderMemberSummary(activeMember);
  renderGoalEditors(activeMember);
  renderTimeline(activeMember);
  renderRoadmap(activeMember);
  renderUserManagement();
  applyWorkspaceView();
  applySidebarState();
  applyTheme();
  applyAuthState();
  window.requestAnimationFrame(updateTimelineOverlayPosition);
  persistState();
}

function renderMemberSelect(activeMember) {
  elements.memberSelect.innerHTML = "";
  const visibleMembers = getVisibleMembers();

  visibleMembers.forEach((member) => {
    const option = document.createElement("option");
    option.value = member.id;
    option.textContent = member.name;
    option.selected = member.id === activeMember?.id;
    elements.memberSelect.append(option);
  });

  elements.memberCount.textContent = visibleMembers.length;
  elements.memberSelect.disabled = visibleMembers.length === 0;
}

function renderMemberList(activeMember) {
  elements.memberList.innerHTML = "";
  const visibleMembers = getVisibleMembers();
  const currentUser = getCurrentUser();

  if (!visibleMembers.length) {
    const empty = document.createElement("p");
    empty.className = "member-list-empty";
    empty.textContent = "Nessun utente disponibile";
    elements.memberList.append(empty);
    return;
  }

  visibleMembers.forEach((member) => {
    const item = document.createElement("div");
    item.className = `member-list-item${member.id === activeMember?.id ? " is-active" : ""}`;

    const selectButton = document.createElement("button");
    selectButton.className = "member-list-select";
    selectButton.type = "button";
    selectButton.innerHTML = `
      <span class="member-list-avatar" aria-hidden="true">${escapeHtml(getInitials(member.name))}</span>
      <span>
        <strong>${escapeHtml(member.name)}</strong>
        <small>${escapeHtml(getMemberSubtitle(member))}</small>
      </span>
    `;
    selectButton.addEventListener("click", () => selectMember(member.id));

    const removeButton = document.createElement("button");
    removeButton.className = "remove-member";
    removeButton.type = "button";
    removeButton.title = `Cancella ${member.name}`;
    removeButton.setAttribute("aria-label", `Cancella ${member.name}`);
    removeButton.textContent = "x";
    removeButton.addEventListener("click", () => requestRemoveMember(member.id));
    removeButton.hidden = !currentUser || currentUser.id === member.id || !canManageMember(currentUser, member);

    item.append(selectButton, removeButton);
    elements.memberList.append(item);
  });
}

function renderMemberSummary(activeMember) {
  if (!activeMember) {
    elements.activeMemberName.textContent = "Nessun membro";
    elements.activeMemberRole.textContent = "Profilo non selezionato";
    elements.memberAvatar.textContent = "--";
    return;
  }

  elements.activeMemberName.textContent = activeMember.name;
  elements.activeMemberRole.textContent = getMemberSubtitle(activeMember);
  elements.memberAvatar.textContent = getInitials(activeMember.name);
}

function renderUserManagement() {
  const currentUser = getCurrentUser();
  elements.userManagementList.innerHTML = "";

  if (!currentUser) {
    elements.createUserPanel.hidden = true;
    return;
  }

  getVisibleMembers(currentUser).forEach((member) => {
    elements.userManagementList.append(createUserManagementCard(member, currentUser));
  });

  elements.createUserPanel.hidden = !canCreateSubordinate(currentUser);
  if (!elements.createUserPanel.hidden) {
    populateCreateUserLevelOptions();
    populateCreateUserManagerOptions();
  }
}

function createUserManagementCard(member, currentUser) {
  const isCurrentUser = member.id === currentUser.id;
  const card = document.createElement("article");
  card.className = `user-card${isCurrentUser ? " is-current" : ""}`;

  const header = document.createElement("div");
  header.className = "user-card-header";

  const identity = document.createElement("div");
  identity.className = "user-card-identity";
  identity.innerHTML = `
    <span class="member-list-avatar" aria-hidden="true">${escapeHtml(getInitials(member.name))}</span>
    <span>
      <strong>${escapeHtml(member.name)}</strong>
      <small>${escapeHtml(isCurrentUser ? "Utente connesso" : "Sottoposto")}</small>
    </span>
  `;

  const deleteButton = document.createElement("button");
  deleteButton.className = "remove-member";
  deleteButton.type = "button";
  deleteButton.title = `Cancella ${member.name}`;
  deleteButton.setAttribute("aria-label", `Cancella ${member.name}`);
  deleteButton.textContent = "x";
  deleteButton.hidden = isCurrentUser || !canManageMember(currentUser, member);
  deleteButton.addEventListener("click", () => requestRemoveMember(member.id));

  header.append(identity, deleteButton);

  const fields = document.createElement("div");
  fields.className = "user-card-fields";

  const nameInput = createUserTextInput(member.name, "Nome utente");
  nameInput.addEventListener("change", (event) => updateMemberUser(member.id, { name: event.target.value }));

  const roleInput = createUserTextInput(member.role, "Ruolo operativo");
  roleInput.addEventListener("change", (event) => updateMemberUser(member.id, { role: event.target.value }));

  const passwordInput = createUserTextInput("", "Nuova password");
  passwordInput.type = "password";
  passwordInput.autocomplete = "new-password";
  passwordInput.addEventListener("change", (event) => {
    updateMemberUser(member.id, { password: event.target.value });
    event.target.value = "";
  });

  const levelSelect = document.createElement("select");
  levelSelect.className = "field";
  populateLevelSelect(levelSelect, getEditableLevelsForMember(member, currentUser), member.level);
  levelSelect.disabled = isCurrentUser;
  levelSelect.addEventListener("change", (event) => updateMemberUser(member.id, { level: Number(event.target.value) }));

  const managerSelect = document.createElement("select");
  managerSelect.className = "field";
  populateManagerSelect(managerSelect, member, member.level, currentUser);
  managerSelect.disabled = isCurrentUser;
  managerSelect.addEventListener("change", (event) => updateMemberUser(member.id, { managerId: event.target.value }));

  fields.append(
    createFieldShell("Nome", nameInput),
    createFieldShell("Ruolo", roleInput),
    createFieldShell("Password", passwordInput),
    createFieldShell("Livello", levelSelect),
    createFieldShell("Responsabile", managerSelect),
  );
  card.append(header, fields);

  return card;
}

function createUserTextInput(value, label) {
  const input = document.createElement("input");
  input.className = "field";
  input.type = "text";
  input.value = value || "";
  input.placeholder = label;
  input.setAttribute("aria-label", label);
  return input;
}

function createFieldShell(labelText, control) {
  const label = document.createElement("label");
  const text = document.createElement("span");
  text.className = "field-label";
  text.textContent = labelText;
  label.append(text, control);
  return label;
}

function getEditableLevelsForMember(member, currentUser) {
  if (member.id === currentUser.id) return [member.level];
  return ACCESS_LEVELS.filter((level) => level < currentUser.level);
}

function populateLevelSelect(select, levels, selectedLevel) {
  select.innerHTML = "";
  levels.forEach((level) => {
    const option = document.createElement("option");
    option.value = String(level);
    option.textContent = `${level} - ${getAccessLevelLabel(level)}`;
    option.selected = level === selectedLevel;
    select.append(option);
  });
}

function populateManagerSelect(select, member, level, currentUser) {
  select.innerHTML = "";
  const candidates = getManagerCandidates(level, currentUser, member.id);
  const currentManager = state.members.find((candidate) => candidate.id === member.managerId);
  const options =
    currentManager && !candidates.some((candidate) => candidate.id === currentManager.id)
      ? [currentManager, ...candidates]
      : candidates;

  if (level >= ACCESS_TEAM_LEADER || !options.length) {
    const option = document.createElement("option");
    option.value = "";
    option.textContent = "Nessuno";
    select.append(option);
  }

  options.forEach((candidate) => {
    const option = document.createElement("option");
    option.value = candidate.id;
    option.textContent = candidate.name;
    option.selected = candidate.id === member.managerId;
    select.append(option);
  });

  if (!select.value && options.some((candidate) => candidate.id === currentUser.id)) {
    select.value = currentUser.id;
  }
}

function getManagerCandidates(level, currentUser = getCurrentUser(), excludedMemberId = "") {
  if (!currentUser) return [];
  return getVisibleMembers(currentUser).filter(
    (candidate) => candidate.id !== excludedMemberId && candidate.level > level,
  );
}

function populateCreateUserLevelOptions() {
  const currentUser = getCurrentUser();
  if (!currentUser) return;

  const levels = ACCESS_LEVELS.filter((level) => level < currentUser.level);
  const previousLevel = Number(elements.memberLevel.value);
  populateLevelSelect(elements.memberLevel, levels, levels.includes(previousLevel) ? previousLevel : levels[0]);
}

function populateCreateUserManagerOptions() {
  const currentUser = getCurrentUser();
  if (!currentUser) return;

  const level = normalizeAccessLevel(elements.memberLevel.value);
  const candidates = getManagerCandidates(level, currentUser);
  elements.memberManager.innerHTML = "";
  candidates.forEach((candidate) => {
    const option = document.createElement("option");
    option.value = candidate.id;
    option.textContent = candidate.name;
    option.selected = candidate.id === currentUser.id;
    elements.memberManager.append(option);
  });
}

function showUserManagementError(message) {
  elements.userManagementError.textContent = message;
  elements.userManagementError.hidden = !message;
}

function clearUserCreationForm() {
  elements.memberName.value = "";
  elements.memberRole.value = "";
  elements.memberPassword.value = "";
  showUserManagementError("");
}

function renderGoalEditors(activeMember) {
  elements.goalList.innerHTML = "";

  if (!activeMember) return;

  const goalsToRender =
    !elements.goalPopup.hidden && activePopupGoalId
      ? activeMember.goals.filter((goal) => goal.id === activePopupGoalId)
      : [];

  if (!elements.goalPopup.hidden && activePopupGoalId && goalsToRender.length === 0) {
    closeGoalPopup();
    return;
  }

  goalsToRender.forEach((goal) => {
    const item = elements.goalTemplate.content.firstElementChild.cloneNode(true);
    item.dataset.goalId = goal.id;
    const criteriaList = item.querySelector(".criteria-list");
    const criteriaToRender =
      activePopupCriterionId && goal.criteria.some((criterion) => criterion.id === activePopupCriterionId)
        ? goal.criteria.filter((criterion) => criterion.id === activePopupCriterionId)
        : goal.criteria.slice(0, 1);

    criteriaToRender.forEach((criterion) => {
      criteriaList.append(createCriterionEditor(goal.id, criterion));
    });

    elements.goalList.append(item);
  });

  focusPendingCriterionEditor();
}

function createCriterionEditor(goalId, criterion) {
  const item = elements.criterionTemplate.content.firstElementChild.cloneNode(true);
  const labelInput = item.querySelector(".criterion-label-input");
  const statusInput = item.querySelector(".criterion-status-input");
  const removeButton = item.querySelector(".remove-criterion");

  labelInput.value = criterion.label;
  statusInput.value = criterion.status;

  labelInput.addEventListener("input", (event) => updateCriterion(goalId, criterion.id, { label: event.target.value }));
  statusInput.addEventListener("change", (event) => updateCriterion(goalId, criterion.id, { status: event.target.value }));
  removeButton.addEventListener("click", () => removeCriterion(goalId, criterion.id));

  return item;
}

function renderTimeline(activeMember) {
  elements.timeAxis.innerHTML = "";
  elements.planGrid.innerHTML = "";
  const timelineUnits = getTimelineUnits();
  const currentUnitIndex = getCurrentTimelineUnitIndex(timelineUnits);

  const axisGutter = document.createElement("div");
  axisGutter.className = "axis-gutter";
  elements.timeAxis.append(axisGutter);

  timelineUnits.forEach((unit, index) => {
    const marker = document.createElement("div");
    marker.className = `time-marker${index === currentUnitIndex ? " is-current" : ""}`;
    marker.title = unit.title;
    marker.innerHTML = `<strong>${unit.label}</strong><small>${unit.detail}</small>`;
    elements.timeAxis.append(marker);
  });

  if (!activeMember || activeMember.goals.length === 0) {
    const empty = document.createElement("div");
    empty.className = "empty-state";
    empty.textContent = "Nessun obiettivo nel piano.";
    elements.planGrid.append(empty);
    return;
  }

  activeMember.goals.forEach((goal) => {
    clampGoal(goal);
    const row = document.createElement("section");
    row.className = "goal-row";
    row.dataset.goalId = goal.id;
    const placement = getGoalTimelinePlacement(goal);
    row.style.setProperty("--bar-left", `${placement.left}%`);
    row.style.setProperty("--bar-width", `${placement.width}%`);
    row.style.setProperty("--progress", `${goal.progress}%`);

    const label = document.createElement("div");
    label.className = "goal-label";
    const labelInput = document.createElement("input");
    labelInput.className = "goal-label-input";
    labelInput.type = "text";
    labelInput.value = goal.title || "Obiettivo";
    labelInput.setAttribute("aria-label", "Titolo obiettivo");
    labelInput.addEventListener("click", (event) => event.stopPropagation());
    labelInput.addEventListener("dragstart", (event) => event.preventDefault());
    labelInput.addEventListener("input", (event) => updateGoalTitle(goal.id, event.target.value));
    label.append(labelInput);

    const track = document.createElement("div");
    track.className = "goal-track";

    const line = document.createElement("div");
    line.className = "goal-line";
    line.title = goal.title || "Linea obiettivo";
    line.setAttribute("aria-label", `Linea ${goal.title || "obiettivo"}`);
    line.innerHTML = `
      <div class="goal-line-progress"></div>
      <button class="goal-line-handle goal-line-start" type="button" draggable="true" aria-label="Inizio linea"></button>
      <button class="goal-line-handle goal-line-end" type="button" draggable="true" aria-label="Fine linea"></button>
    `;

    line.querySelector(".goal-line-start").addEventListener("dragstart", (event) => {
      event.stopPropagation();
      startDrag(event, { kind: "resize-start", goalId: goal.id });
    });
    line.querySelector(".goal-line-end").addEventListener("dragstart", (event) => {
      event.stopPropagation();
      startDrag(event, { kind: "resize-end", goalId: goal.id });
    });

    goal.criteria.forEach((criterion) => {
      line.append(createCriterionMarker(goal.id, criterion));
    });

    track.append(line);
    row.append(label, track);
    elements.planGrid.append(row);
  });
}

function createCriterionMarker(goalId, criterion) {
  const marker = document.createElement("button");
  marker.className = `criterion-circle status-${criterion.status}`;
  marker.type = "button";
  marker.draggable = true;
  marker.title = criterion.label;
  marker.style.left = `${criterion.position}%`;
  marker.setAttribute("aria-label", `${criterion.label}, ${criteriaStatusLabels[criterion.status]}`);
  marker.innerHTML = `<img class="criterion-icon" src="${getCriterionIconUrl(criterion.status)}" alt="" aria-hidden="true" />`;
  marker.addEventListener("dragstart", (event) => {
    event.stopPropagation();
    startDrag(event, { kind: "move-criterion", goalId, criterionId: criterion.id });
  });
  marker.addEventListener("click", (event) => {
    event.stopPropagation();
    focusCriterionEditor(goalId, criterion.id, marker);
  });

  return marker;
}

function getCriterionIconUrl(status) {
  return status === "unlocked" ? UNLOCK_ICON_URL : LOCK_ICON_URL;
}

function updateGoalTitle(goalId, title) {
  const goal = findGoal(goalId);
  if (!goal) return;

  goal.title = title;
  renderRoadmap(getActiveMember());
  persistState();
}

function updateGoal(goalId, patch) {
  const activeMember = getActiveMember();
  const goal = activeMember?.goals.find((item) => item.id === goalId);
  if (!goal) return;

  Object.assign(goal, patch);
  clampGoal(goal);
  renderTimeline(activeMember);
  renderRoadmap(activeMember);
  persistState();
}

function updateCriterion(goalId, criterionId, patch) {
  const goal = findGoal(goalId);
  const criterion = goal?.criteria.find((item) => item.id === criterionId);
  if (!criterion) return;

  Object.assign(criterion, patch);
  const normalized = normalizeCriterion(criterion);
  Object.assign(criterion, normalized);
  syncGoalProgress(goal);
  renderTimeline(getActiveMember());
  renderRoadmap(getActiveMember());
  persistState();
}

function updateMemberUser(memberId, patch) {
  const currentUser = getCurrentUser();
  const member = state.members.find((item) => item.id === memberId);
  if (!currentUser || !member || !canManageMember(currentUser, member)) return;

  if (Object.hasOwn(patch, "name")) {
    const name = String(patch.name || "").trim();
    if (!name) {
      showUserManagementError("Il nome utente non puo essere vuoto.");
      renderUserManagement();
      return;
    }
    const duplicate = state.members.find(
      (candidate) => candidate.id !== member.id && candidate.name.toLowerCase() === name.toLowerCase(),
    );
    if (duplicate) {
      showUserManagementError("Esiste gia un utente con questo nome.");
      renderUserManagement();
      return;
    }
    member.name = name;
  }

  if (Object.hasOwn(patch, "role")) {
    member.role = String(patch.role || "").trim();
  }

  if (Object.hasOwn(patch, "password")) {
    const password = String(patch.password || "").trim();
    if (password) member.password = password;
  }

  if (member.id !== currentUser.id && Object.hasOwn(patch, "level")) {
    const maxLevel = currentUser.level - 1;
    member.level = clamp(normalizeAccessLevel(patch.level), ACCESS_JUNIOR, maxLevel);
    if (!getValidatedManagerId(member.managerId, member.level, member.id)) {
      member.managerId = getValidatedManagerId(currentUser.id, member.level, member.id);
    }
  }

  if (member.id !== currentUser.id && Object.hasOwn(patch, "managerId")) {
    member.managerId = getValidatedManagerId(patch.managerId, member.level, member.id);
  }

  repairMemberHierarchy(state.members);
  showUserManagementError("");
  render();
}

function getValidatedManagerId(managerId, level, memberId = "") {
  const manager = state.members.find((member) => member.id === managerId);
  const memberById = new Map(state.members.map((member) => [member.id, member]));
  if (
    !manager ||
    manager.id === memberId ||
    manager.level <= level ||
    createsManagementCycle(memberId, manager.id, memberById)
  ) {
    return "";
  }

  return manager.id;
}

function removeGoal(goalId) {
  const activeMember = getActiveMember();
  if (!activeMember) return;

  activeMember.goals = activeMember.goals.filter((goal) => goal.id !== goalId);
  if (activePopupGoalId === goalId || !activeMember.goals.length) closeGoalPopup();
  render();
}

function selectMember(memberId) {
  const currentUser = getCurrentUser();
  const member = state.members.find((item) => item.id === memberId);
  if (!currentUser || !member || !canAccessMember(currentUser, member)) return;
  state.activeMemberId = memberId;
  closeGoalPopup();
  render();
}

function requestRemoveMember(memberId) {
  const currentUser = getCurrentUser();
  const member = state.members.find((item) => item.id === memberId);
  if (!member || !currentUser || member.id === currentUser.id || !canManageMember(currentUser, member)) return;

  pendingDeleteMemberId = memberId;
  elements.confirmMessage.textContent = `Eliminare ${member.name} e tutti i suoi obiettivi?`;
  elements.confirmDialog.hidden = false;
  elements.cancelConfirm.focus();
}

function closeConfirmDialog() {
  elements.confirmDialog.hidden = true;
  pendingDeleteMemberId = null;
}

function confirmRemoveMember() {
  if (!pendingDeleteMemberId) return;
  const memberId = pendingDeleteMemberId;
  pendingDeleteMemberId = null;
  elements.confirmDialog.hidden = true;
  removeMember(memberId);
}

function removeMember(memberId) {
  const currentUser = getCurrentUser();
  const member = state.members.find((item) => item.id === memberId);
  if (!member || !currentUser || member.id === currentUser.id || !canManageMember(currentUser, member)) return;

  const memberIndex = state.members.findIndex((member) => member.id === memberId);
  if (memberIndex < 0) return;

  state.members.splice(memberIndex, 1);
  state.members.forEach((item) => {
    if (item.managerId === memberId) item.managerId = currentUser.id;
  });
  repairMemberHierarchy(state.members);
  if (state.activeMemberId === memberId) {
    state.activeMemberId = currentUser.id;
    closeGoalPopup();
  }

  render();
}

function addGoalAtDrop(dropMeta) {
  const activeMember = getActiveMember();
  if (!activeMember) return;

  const goal = createGoal({
    title: "Nuova linea",
    start: dropMeta.gridLine + 1,
    criterionGridLine: dropMeta.gridLine + 2,
  });

  const insertIndex = clamp(dropMeta.rowIndex, 0, activeMember.goals.length);
  activeMember.goals.splice(insertIndex, 0, goal);
  render();
}

function addGoalFromButton() {
  const activeMember = getActiveMember();
  if (!activeMember) return;

  const startLine = getVisibleTimelineGridLine();
  activeMember.goals.push(
    createGoal({
      title: "Nuova linea",
      start: startLine + 1,
      criterionGridLine: startLine + 2,
    }),
  );
  render();
}

function createGoal({ title, start, criterionGridLine = null }) {
  const safeStart = clamp(Number(start) || 1, 1, state.timelineWeeks);
  const duration = Math.min(4, state.timelineWeeks - safeStart + 1);
  const goal = {
    id: createId("goal"),
    title,
    start: safeStart,
    duration: Math.max(1, duration),
    progress: 0,
    criteria: [],
  };

  const safeCriterionGridLine =
    criterionGridLine === null ? goal.start - 1 + Math.round(goal.duration / 2) : criterionGridLine;
  goal.criteria.push(createCriterion(getCriterionPositionFromGridLine(goal, safeCriterionGridLine)));
  syncGoalProgress(goal);

  return goal;
}

function addCriterion(goalId) {
  const goal = findGoal(goalId);
  if (!goal) return;

  const centerGridLine = goal.start - 1 + Math.round(goal.duration / 2);
  goal.criteria.push(createCriterion(getCriterionPositionFromGridLine(goal, centerGridLine)));
  syncGoalProgress(goal);
  render();
}

function removeCriterion(goalId, criterionId) {
  const goal = findGoal(goalId);
  if (!goal) return;

  goal.criteria = goal.criteria.filter((criterion) => criterion.id !== criterionId);
  if (activePopupCriterionId === criterionId) closeGoalPopup();
  syncGoalProgress(goal);
  render();
}

function saveMember() {
  const currentUser = getCurrentUser();
  if (!canCreateSubordinate(currentUser)) return;

  const name = elements.memberName.value.trim();
  const role = elements.memberRole.value.trim();
  const password = elements.memberPassword.value.trim();
  const requestedLevel = normalizeAccessLevel(elements.memberLevel.value);
  const level = clamp(requestedLevel, ACCESS_JUNIOR, currentUser.level - 1);
  const managerId = getValidatedManagerId(elements.memberManager.value, level) || currentUser.id;

  if (!name) {
    elements.memberName.focus();
    showUserManagementError("Inserisci il nome del nuovo utente.");
    return;
  }

  if (!password) {
    elements.memberPassword.focus();
    showUserManagementError("Inserisci una password iniziale.");
    return;
  }

  const existing = state.members.find((member) => member.name.toLowerCase() === name.toLowerCase());
  if (existing) {
    showUserManagementError("Esiste gia un utente con questo nome.");
    return;
  }

  const newMember = {
    id: createId(name),
    name,
    role,
    level,
    managerId,
    password,
    goals: [createGoal({ title: "Prima linea", start: 1 })],
  };
  state.members.push(newMember);
  state.activeMemberId = newMember.id;
  clearUserCreationForm();
  render();
}

function scrollToCurrentWeek(behavior = "smooth") {
  const timelineUnits = getTimelineUnits();
  const currentUnitIndex = getCurrentTimelineUnitIndex(timelineUnits);
  if (currentUnitIndex < 0) return;

  const maxScrollLeft = Math.max(0, elements.timelineFrame.scrollWidth - elements.timelineFrame.clientWidth);
  const trackWidth = Math.max(MIN_WEEK_WIDTH, elements.timelineFrame.scrollWidth - LABEL_WIDTH);
  const weekWidth = trackWidth / timelineUnits.length;
  const visibleTrackWidth = Math.max(0, elements.timelineFrame.clientWidth - LABEL_WIDTH);
  const targetLeft = clamp(currentUnitIndex * weekWidth - (visibleTrackWidth - weekWidth) / 2, 0, maxScrollLeft);

  elements.timelineFrame.scrollTo({ left: targetLeft, behavior });
}

function handleTimelineWheel(event) {
  if (state.ui.activeView !== WORKSPACE_VIEW_TIMELINE) return;

  event.preventDefault();

  if (event.ctrlKey || event.metaKey) {
    zoomTimeline(event.deltaY < 0 ? 1 : -1);
    return;
  }

  const horizontalDelta = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
  elements.timelineFrame.scrollLeft += horizontalDelta;
}

function zoomTimeline(direction) {
  const currentIndex = TIMELINE_ZOOM_LEVELS.indexOf(state.ui.timelineZoom);
  const nextIndex = clamp(currentIndex + direction, 0, TIMELINE_ZOOM_LEVELS.length - 1);
  const nextZoom = TIMELINE_ZOOM_LEVELS[nextIndex];
  if (nextZoom === state.ui.timelineZoom) return;

  const maxScrollLeft = Math.max(1, elements.timelineFrame.scrollWidth - elements.timelineFrame.clientWidth);
  const scrollRatio = maxScrollLeft ? elements.timelineFrame.scrollLeft / maxScrollLeft : 0;
  state.ui.timelineZoom = nextZoom;
  render();

  window.requestAnimationFrame(() => {
    const nextMaxScrollLeft = Math.max(0, elements.timelineFrame.scrollWidth - elements.timelineFrame.clientWidth);
    elements.timelineFrame.scrollLeft = nextMaxScrollLeft * scrollRatio;
  });
}

function getTimelineUnitWidth() {
  return TIMELINE_UNIT_WIDTHS[state.ui.timelineZoom] || TIMELINE_UNIT_WIDTHS[TIMELINE_ZOOM_WEEK];
}

function getGridLineFromTimelineUnitLine(unitLine) {
  if (state.ui.timelineZoom === TIMELINE_ZOOM_DAY) {
    const weekIndex = Math.floor(unitLine / 5);
    const dayIndex = unitLine % 5;
    return clamp(weekIndex + dayIndex / 5, 0, state.timelineWeeks);
  }

  if (state.ui.timelineZoom === TIMELINE_ZOOM_MONTH) {
    const date = new Date(state.timelineYear, unitLine, 1);
    return clamp(getGridLineFromDate(date), 0, state.timelineWeeks);
  }

  return clamp(unitLine, 0, state.timelineWeeks);
}

function getGridLineFromDate(date) {
  const timelineStart = parseLocalISODate(state.timelineStartDate);
  const weekStart = getWeekStart(date);
  const diffDays = Math.round((weekStart - timelineStart) / (24 * 60 * 60 * 1000));
  return diffDays / 7;
}

function getGoalTimelinePlacement(goal) {
  const startRatio = (goal.start - 1) / state.timelineWeeks;
  const endRatio = getGoalEndGridLine(goal) / state.timelineWeeks;

  return {
    left: clamp(startRatio * 100, 0, 100),
    width: clamp((endRatio - startRatio) * 100, 0, 100),
  };
}

function getGoalEndGridLine(goal) {
  return clamp((Number(goal.start) || 1) - 1 + (Number(goal.duration) || 1), 1, state.timelineWeeks);
}

function getVisibleTimelineGridLine() {
  const { timelineUnits, trackWidth } = getTimelineTrackMetrics();
  if (!timelineUnits.length) return 0;
  const unitWidth = trackWidth / timelineUnits.length;
  const unitLine = clamp(Math.round(elements.timelineFrame.scrollLeft / unitWidth), 0, timelineUnits.length);

  return clamp(Math.round(getGridLineFromTimelineUnitLine(unitLine)), 0, state.timelineWeeks - 1);
}

function showTimelineView(scrollCurrentWeek = false) {
  state.ui.activeView = WORKSPACE_VIEW_TIMELINE;
  applyWorkspaceView();
  persistState();

  if (scrollCurrentWeek) {
    window.requestAnimationFrame(() => scrollToCurrentWeek());
  }
}

function showRoadmapView() {
  state.ui.activeView = WORKSPACE_VIEW_ROADMAP;
  applyWorkspaceView();
  persistState();
  elements.roadmapCanvas.focus({ preventScroll: true });
  window.requestAnimationFrame(centerRoadmapStart);
}

function applyWorkspaceView() {
  const isRoadmap = state.ui.activeView === WORKSPACE_VIEW_ROADMAP;
  elements.workspace.classList.toggle("is-roadmap-view", isRoadmap);
  elements.workspace.classList.toggle("is-timeline-view", !isRoadmap);
  elements.goCurrentWeek.classList.toggle("active", !isRoadmap);
  elements.goRoadmap.classList.toggle("active", isRoadmap);
  elements.goRoadmap.setAttribute("aria-pressed", String(isRoadmap));
  elements.goCurrentWeek.setAttribute("aria-pressed", String(!isRoadmap));
}

function toggleTheme() {
  state.ui.theme = state.ui.theme === THEME_LIGHT ? THEME_DARK : THEME_LIGHT;
  applyTheme();
  persistState();
}

function applyTheme() {
  const isLight = state.ui.theme === THEME_LIGHT;
  document.documentElement.dataset.theme = isLight ? THEME_LIGHT : THEME_DARK;
  elements.toggleTheme.textContent = isLight ? "Tema scuro" : "Tema chiaro";
  elements.toggleTheme.title = isLight ? "Passa al tema scuro" : "Passa al tema chiaro";
  elements.toggleTheme.setAttribute("aria-label", elements.toggleTheme.title);
  elements.toggleTheme.setAttribute("aria-pressed", String(isLight));
}

function applyAuthState() {
  const currentUser = getCurrentUser();
  const isAuthenticated = Boolean(currentUser);
  elements.appShell.classList.toggle("is-auth-locked", !isAuthenticated);
  elements.appShell.setAttribute("aria-hidden", String(!isAuthenticated));
  elements.toggleLeftSidebar.hidden = !isAuthenticated;
  elements.loginDialog.hidden = isAuthenticated;
  elements.sessionUser.textContent = currentUser
    ? `${currentUser.name} · ${getAccessLevelLabel(currentUser.level)}`
    : "Accesso";

  if (isAuthenticated) {
    loginFocusQueued = false;
    return;
  }

  if (!loginFocusQueued) {
    loginFocusQueued = true;
    window.requestAnimationFrame(() => elements.loginName.focus());
  }
}

function handleLogin(event) {
  event.preventDefault();
  const name = elements.loginName.value.trim();
  const password = elements.loginPassword.value;
  const member = state.members.find((item) => item.name.toLowerCase() === name.toLowerCase());

  if (!member || member.password !== password) {
    elements.loginError.hidden = false;
    elements.loginPassword.select();
    return;
  }

  auth.currentUserId = member.id;
  state.activeMemberId = member.id;
  elements.loginError.hidden = true;
  elements.loginPassword.value = "";
  closeGoalPopup();
  closeUserManagement();
  render();
}

function logoutUser() {
  auth.currentUserId = null;
  closeGoalPopup();
  closeUserManagement();
  elements.loginPassword.value = "";
  render();
}

function openUserManagement() {
  if (!getCurrentUser()) return;
  elements.userManagementDialog.hidden = false;
  renderUserManagement();
  window.requestAnimationFrame(() => elements.closeUserManagement.focus());
}

function closeUserManagement() {
  elements.userManagementDialog.hidden = true;
  showUserManagementError("");
}

function centerRoadmapStart() {
  elements.roadmapCanvas.scrollTop = 0;
  elements.roadmapCanvas.scrollLeft = Math.max(0, (elements.roadmapCanvas.scrollWidth - elements.roadmapCanvas.clientWidth) / 2);
}

function renderRoadmap(activeMember) {
  elements.roadmapCanvas.innerHTML = "";
  elements.roadmapMember.textContent = activeMember
    ? `${activeMember.name} - ${activeMember.goals.length} obiettivi`
    : "Nessun membro";

  if (!activeMember || !activeMember.goals.length) {
    const empty = document.createElement("div");
    empty.className = "roadmap-empty";
    empty.textContent = "Nessun obiettivo da mostrare nella roadmap.";
    elements.roadmapCanvas.append(empty);
    return;
  }

  const goals = activeMember.goals;
  const maxCriteria = Math.max(1, ...goals.map((goal) => goal.criteria.length));
  const width = Math.max(1080, 300 + goals.length * 270, 760 + maxCriteria * 120);
  const height = Math.max(720, 600 + maxCriteria * 28);
  const rootX = Math.round(width / 2);
  const rootY = height + 150;
  const goalY = 104;
  const branchStartY = height - 28;
  const edgePadding = 170;

  const map = document.createElement("div");
  map.className = "roadmap-map";
  map.style.width = `${width}px`;
  map.style.height = `${height}px`;

  const svg = document.createElementNS(SVG_NS, "svg");
  svg.classList.add("roadmap-lines");
  svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
  svg.setAttribute("aria-hidden", "true");

  goals.forEach((goal, goalIndex) => {
    const endX = getRoadmapGoalX(goalIndex, goals.length, width, edgePadding);
    const color = getRoadmapColor(goalIndex);
    const path = getRoadmapBranchPath(rootX, rootY, endX, goalY);

    appendRoadmapPath(svg, path, color, "roadmap-branch-shadow");
    appendRoadmapPath(svg, path, color, "roadmap-branch-path");
  });

  map.append(svg);

  goals.forEach((goal, goalIndex) => {
    const endX = getRoadmapGoalX(goalIndex, goals.length, width, edgePadding);
    const color = getRoadmapColor(goalIndex);
    const criteria = [...goal.criteria].sort((first, second) => first.position - second.position);
    const visibleStartRatio = getRoadmapVisibleStartRatio(rootY, branchStartY, goalY);

    criteria.forEach((criterion) => {
      const timeRatio = clamp(Number(criterion.position) / 100, 0, 1);
      const branchRatio = visibleStartRatio + timeRatio * (1 - visibleStartRatio);
      const point = getRoadmapBranchPoint(rootX, rootY, endX, goalY, branchRatio);
      appendRoadmapCriterion(map, criterion, point.x, point.y, color);
    });

    appendRoadmapGoal(map, goal, goalIndex, endX, goalY, color);
  });

  elements.roadmapCanvas.append(map);
  if (state.ui.activeView === WORKSPACE_VIEW_ROADMAP) {
    centerRoadmapStart();
  }
}

function getRoadmapColor(index) {
  return ROADMAP_COLORS[index] || `hsl(${(index * 47 + 18) % 360} 88% 58%)`;
}

function getRoadmapGoalX(index, totalGoals, width, edgePadding) {
  if (totalGoals === 1) return Math.round(width / 2);

  return Math.round(edgePadding + (index / (totalGoals - 1)) * (width - edgePadding * 2));
}

function getRoadmapBranchPath(rootX, rootY, endX, endY) {
  return `M ${rootX} ${rootY} L ${endX} ${endY}`;
}

function getRoadmapBranchPoint(rootX, rootY, endX, endY, ratio) {
  const start = { x: rootX, y: rootY };
  const end = { x: endX, y: endY };

  return {
    x: start.x + (end.x - start.x) * ratio,
    y: start.y + (end.y - start.y) * ratio,
  };
}

function getRoadmapVisibleStartRatio(rootY, branchStartY, endY) {
  return clamp((rootY - branchStartY) / Math.max(1, rootY - endY), 0, 1);
}

function appendRoadmapPath(svg, path, color, className) {
  const branch = document.createElementNS(SVG_NS, "path");
  branch.setAttribute("d", path);
  branch.setAttribute("stroke", color);
  branch.classList.add(className);
  svg.append(branch);
}

function appendRoadmapCriterion(map, criterion, x, y, color) {
  const node = document.createElement("div");
  node.className = `roadmap-criterion-node${criterion.status === "unlocked" ? " is-unlocked" : ""}`;
  node.style.left = `${x}px`;
  node.style.top = `${y}px`;
  node.style.setProperty("--branch-color", color);

  const orb = document.createElement("span");
  orb.className = "roadmap-node-orb";

  const icon = document.createElement("img");
  icon.src = getCriterionIconUrl(criterion.status);
  icon.alt = "";
  icon.setAttribute("aria-hidden", "true");

  const caption = document.createElement("span");
  caption.className = "roadmap-criterion-caption";
  caption.textContent = criterion.label || "Criterio di avanzamento";

  orb.append(icon);
  node.append(orb, caption);
  map.append(node);
}

function appendRoadmapGoal(map, goal, goalIndex, x, y, color) {
  const node = document.createElement("div");
  node.className = "roadmap-goal-node";
  node.style.left = `${x}px`;
  node.style.top = `${y}px`;
  node.style.setProperty("--branch-color", color);

  const orb = document.createElement("span");
  orb.className = "roadmap-goal-orb";
  orb.textContent = String(goalIndex + 1).padStart(2, "0");

  const title = document.createElement("span");
  title.className = "roadmap-goal-title";
  title.textContent = goal.title || "Obiettivo";

  node.append(orb, title);
  map.append(node);
}

function toggleSidebar(side) {
  if (side !== "left") return;
  state.ui.leftCollapsed = !state.ui.leftCollapsed;

  applySidebarState();
  persistState();
}

function applySidebarState() {
  elements.appShell.classList.toggle("left-collapsed", state.ui.leftCollapsed);

  elements.toggleLeftSidebar.setAttribute("aria-pressed", String(state.ui.leftCollapsed));
  elements.toggleLeftSidebar.setAttribute(
    "aria-label",
    state.ui.leftCollapsed ? "Mostra menu membro" : "Nascondi menu membro",
  );
  elements.toggleLeftSidebar.title = state.ui.leftCollapsed ? "Mostra menu membro" : "Nascondi menu membro";
  elements.toggleLeftSidebar.querySelector("span").textContent = state.ui.leftCollapsed ? ">" : "<";
}

function findGoal(goalId) {
  return getActiveMember()?.goals.find((goal) => goal.id === goalId) ?? null;
}

function findGoalIndex(goalId) {
  const activeMember = getActiveMember();
  if (!activeMember) return -1;
  return activeMember.goals.findIndex((goal) => goal.id === goalId);
}

function openGoalPopup(goalId = null, criterionId = null, anchorElement = null) {
  activePopupGoalId = goalId;
  activePopupCriterionId = criterionId;
  goalPopupAnchorRect = anchorElement ? getElementRect(anchorElement) : goalPopupAnchorRect;
  elements.goalPopup.hidden = false;
  if (goalId && criterionId) {
    pendingCriterionFocus = { goalId, criterionId };
  }
  positionGoalPopup();
}

function closeGoalPopup() {
  elements.goalPopup.hidden = true;
  activePopupGoalId = null;
  activePopupCriterionId = null;
  goalPopupAnchorRect = null;
  pendingCriterionFocus = null;
}

function focusCriterionEditor(goalId, criterionId, anchorElement = null) {
  openGoalPopup(goalId, criterionId, anchorElement);
  renderGoalEditors(getActiveMember());
  positionGoalPopup();
}

function getElementRect(element) {
  const rect = element.getBoundingClientRect();
  return {
    bottom: rect.bottom,
    height: rect.height,
    left: rect.left,
    right: rect.right,
    top: rect.top,
    width: rect.width,
  };
}

function positionGoalPopup() {
  if (elements.goalPopup.hidden || !goalPopupAnchorRect) return;

  const panelRect = elements.goalPopupPanel.getBoundingClientRect();
  const viewportMargin = 12;
  const gap = 12;
  const anchorCenter = goalPopupAnchorRect.left + goalPopupAnchorRect.width / 2;
  const halfPanelWidth = panelRect.width / 2;
  const left = clamp(anchorCenter, viewportMargin + halfPanelWidth, window.innerWidth - viewportMargin - halfPanelWidth);
  const maxTop = Math.max(viewportMargin, window.innerHeight - viewportMargin - panelRect.height);
  const top = clamp(goalPopupAnchorRect.bottom + gap, viewportMargin, maxTop);

  elements.goalPopupPanel.style.left = `${left}px`;
  elements.goalPopupPanel.style.top = `${top}px`;
}

function focusPendingCriterionEditor() {
  if (!pendingCriterionFocus || elements.goalPopup.hidden) return;
  const { goalId, criterionId } = pendingCriterionFocus;

  const editors = elements.goalList.querySelectorAll(".goal-editor");
  const editor = [...editors].find((item) => item.dataset.goalId === goalId);
  if (!editor) {
    pendingCriterionFocus = null;
    return;
  }

  const criterionInputs = editor.querySelectorAll(".criterion-label-input");
  const goal = findGoal(goalId);
  const criterionIndex = goal?.criteria.findIndex((criterion) => criterion.id === criterionId) ?? -1;
  const input = activePopupCriterionId ? criterionInputs[0] : criterionInputs[criterionIndex];
  if (input) {
    input.focus();
    input.select();
  }

  pendingCriterionFocus = null;
}

function startDrag(event, payload) {
  event.dataTransfer.effectAllowed = "copyMove";
  event.dataTransfer.setData("application/json", JSON.stringify(payload));
  event.dataTransfer.setData("text/plain", payload.kind);
}

function parseDragPayload(event) {
  try {
    const raw = event.dataTransfer.getData("application/json");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function handleTimelinePointerMove(event) {
  const pointerMeta = getTimelinePointerMeta(event);
  if (!isTimelineGoalRow(pointerMeta)) {
    hideTimelineHoverLine();
    return;
  }

  showTimelineHoverLine(pointerMeta);
}

function handleTimelinePointerLeave() {
  hideTimelineHoverLine();
}

function handleTimelineClick(event) {
  if (isTimelineInteractiveTarget(event.target)) return;

  const pointerMeta = getTimelinePointerMeta(event);
  const activeMember = getActiveMember();
  if (!isTimelineGoalRow(pointerMeta) || !activeMember) return;

  const goal = activeMember.goals[pointerMeta.rowIndex];
  ensureGoalIncludesGridLine(goal, pointerMeta.gridLinePrecise);
  goal.criteria.push(createCriterion(getCriterionPositionFromGridLine(goal, pointerMeta.gridLinePrecise)));
  syncGoalProgress(goal);
  render();
}

function isTimelineInteractiveTarget(target) {
  return Boolean(
    target.closest("button, input, select, textarea, .criterion-circle, .goal-line-handle, .timeline-add-goal"),
  );
}

function showTimelineHoverLine(pointerMeta) {
  elements.timelineHoverLine.hidden = false;
  elements.timelineHoverLine.style.left = `${pointerMeta.contentLineLeft}px`;
  elements.timelineHoverLine.style.top = `${48 + pointerMeta.rowIndex * ROW_HEIGHT}px`;
  elements.timelineHoverLine.style.height = `${ROW_HEIGHT}px`;
}

function hideTimelineHoverLine() {
  elements.timelineHoverLine.hidden = true;
}

function updateTimelineOverlayPosition() {
  if (!elements.timelineFrame || state.ui.activeView !== WORKSPACE_VIEW_TIMELINE) return;

  const frameRect = elements.timelineFrame.getBoundingClientRect();
  const buttonSize = 42;
  const left = frameRect.left + frameRect.width / 2 - buttonSize / 2;
  const top = Math.min(frameRect.bottom - 64, window.innerHeight - 74);
  document.documentElement.style.setProperty("--timeline-add-left", `${Math.max(16, left)}px`);
  document.documentElement.style.setProperty("--timeline-add-top", `${Math.max(frameRect.top + 72, top)}px`);
}

function isTimelineGoalRow(pointerMeta) {
  const activeMember = getActiveMember();
  return Boolean(
    pointerMeta &&
      activeMember &&
      pointerMeta.rowIndex >= 0 &&
      pointerMeta.rowIndex < activeMember.goals.length,
  );
}

function handleGridDrop(event) {
  event.preventDefault();
  elements.timelineFrame.classList.remove("is-dropping");

  const payload = parseDragPayload(event);
  const dropMeta = getDropMeta(event);
  if (!payload || !dropMeta) return;

  if (payload.kind === "new-line") {
    addGoalAtDrop(dropMeta);
    return;
  }

  if (payload.kind === "new-criterion") {
    addCriterionAtDrop(dropMeta);
    return;
  }

  if (payload.kind === "move-line") {
    moveLine(payload.goalId, dropMeta);
    return;
  }

  if (payload.kind === "resize-start") {
    resizeLineStart(payload.goalId, dropMeta);
    return;
  }

  if (payload.kind === "resize-end") {
    resizeLineEnd(payload.goalId, dropMeta);
    return;
  }

  if (payload.kind === "move-criterion") {
    moveCriterion(payload, dropMeta);
  }
}

function handleRoadmapPointerDown(event) {
  if (event.button !== 0) return;

  roadmapPanState = {
    pointerId: event.pointerId,
    startX: event.clientX,
    startY: event.clientY,
    scrollLeft: elements.roadmapCanvas.scrollLeft,
    scrollTop: elements.roadmapCanvas.scrollTop,
  };
  elements.roadmapCanvas.classList.add("is-panning");
  elements.roadmapCanvas.setPointerCapture(event.pointerId);
  event.preventDefault();
}

function handleRoadmapPointerMove(event) {
  if (!roadmapPanState || roadmapPanState.pointerId !== event.pointerId) return;

  elements.roadmapCanvas.scrollLeft = roadmapPanState.scrollLeft - (event.clientX - roadmapPanState.startX);
  elements.roadmapCanvas.scrollTop = roadmapPanState.scrollTop - (event.clientY - roadmapPanState.startY);
}

function endRoadmapPan(event) {
  if (!roadmapPanState || roadmapPanState.pointerId !== event.pointerId) return;

  if (elements.roadmapCanvas.hasPointerCapture(event.pointerId)) {
    elements.roadmapCanvas.releasePointerCapture(event.pointerId);
  }
  roadmapPanState = null;
  elements.roadmapCanvas.classList.remove("is-panning");
}

function getDropMeta(event) {
  return getTimelinePointerMeta(event);
}

function getTimelinePointerMeta(event) {
  const activeMember = getActiveMember();
  if (!activeMember) return null;

  const frameRect = elements.timelineFrame.getBoundingClientRect();
  const planRect = elements.planGrid.getBoundingClientRect();
  const { timelineUnits, trackWidth } = getTimelineTrackMetrics();
  if (!timelineUnits.length) return null;
  const contentX = event.clientX - frameRect.left + elements.timelineFrame.scrollLeft;
  const trackX = clamp(contentX - LABEL_WIDTH, 0, trackWidth);
  const unitWidth = trackWidth / timelineUnits.length;
  const unitLine = clamp(Math.round(trackX / unitWidth), 0, timelineUnits.length);
  const gridLinePrecise = getGridLineFromTimelineUnitLine(unitLine);
  const gridLine = clamp(Math.round(gridLinePrecise), 0, state.timelineWeeks);
  const contentLineLeft = LABEL_WIDTH + unitLine * unitWidth;
  const screenLineLeft = contentLineLeft - elements.timelineFrame.scrollLeft;
  const rowY = event.clientY - planRect.top;
  const rowIndex = Math.floor(rowY / ROW_HEIGHT);

  if (screenLineLeft < LABEL_WIDTH || screenLineLeft > elements.timelineFrame.clientWidth) return null;

  return {
    gridLine,
    gridLinePrecise,
    rowIndex,
    contentLineLeft,
    screenLineLeft,
    trackPercent: (unitLine / timelineUnits.length) * 100,
  };
}

function getTimelineTrackMetrics() {
  const timelineUnits = getTimelineUnits();
  const contentWidth = Math.max(
    elements.timeAxis.scrollWidth,
    elements.planGrid.scrollWidth,
    elements.timelineFrame.clientWidth,
  );
  const trackWidth = Math.max(MIN_WEEK_WIDTH, contentWidth - LABEL_WIDTH);

  return { timelineUnits, trackWidth };
}

function addCriterionAtDrop(dropMeta) {
  const activeMember = getActiveMember();
  if (!activeMember) return;

  if (dropMeta.rowIndex < 0) return;

  if (!activeMember.goals.length || dropMeta.rowIndex >= activeMember.goals.length) {
    addGoalAtDrop(dropMeta);
    return;
  }

  const goal = activeMember.goals[dropMeta.rowIndex];
  ensureGoalIncludesGridLine(goal, dropMeta.gridLinePrecise);
  goal.criteria.push(createCriterion(getCriterionPositionFromGridLine(goal, dropMeta.gridLinePrecise)));
  syncGoalProgress(goal);
  render();
}

function moveLine(goalId, dropMeta) {
  const activeMember = getActiveMember();
  const currentIndex = findGoalIndex(goalId);
  if (!activeMember || currentIndex < 0) return;

  const [goal] = activeMember.goals.splice(currentIndex, 1);
  const startLine = clamp(dropMeta.gridLine, 0, state.timelineWeeks - goal.duration);
  goal.start = startLine + 1;
  clampGoal(goal);

  const insertIndex = clamp(dropMeta.rowIndex, 0, activeMember.goals.length);
  activeMember.goals.splice(insertIndex, 0, goal);
  render();
}

function resizeLineStart(goalId, dropMeta) {
  const goal = findGoal(goalId);
  if (!goal) return;

  const preservedCriterionLines = getCriterionGridLineMap(goal);
  const endLine = goal.start - 1 + goal.duration;
  const newStartLine = clamp(dropMeta.gridLine, 0, endLine - 1);
  goal.start = newStartLine + 1;
  goal.duration = endLine - newStartLine;
  restoreCriterionGridLines(goal, preservedCriterionLines);
  clampGoal(goal);
  render();
}

function resizeLineEnd(goalId, dropMeta) {
  const goal = findGoal(goalId);
  if (!goal) return;

  const preservedCriterionLines = getCriterionGridLineMap(goal);
  const startLine = goal.start - 1;
  const newEndLine = clamp(dropMeta.gridLine, startLine + 1, state.timelineWeeks);
  goal.duration = newEndLine - startLine;
  restoreCriterionGridLines(goal, preservedCriterionLines);
  clampGoal(goal);
  render();
}

function moveCriterion(payload, dropMeta) {
  const activeMember = getActiveMember();
  if (!activeMember) return;

  const sourceGoal = findGoal(payload.goalId);
  const criterionIndex = sourceGoal?.criteria.findIndex((criterion) => criterion.id === payload.criterionId) ?? -1;
  if (!sourceGoal || criterionIndex < 0) return;

  const targetGoal = activeMember.goals[clamp(dropMeta.rowIndex, 0, activeMember.goals.length - 1)] ?? sourceGoal;
  const [criterion] = sourceGoal.criteria.splice(criterionIndex, 1);

  if (targetGoal === sourceGoal) {
    targetGoal.criteria.push(criterion);
  }

  ensureGoalIncludesGridLine(targetGoal, dropMeta.gridLinePrecise);
  criterion.position = getCriterionPositionFromGridLine(targetGoal, dropMeta.gridLinePrecise);
  if (targetGoal !== sourceGoal) {
    targetGoal.criteria.push(criterion);
  }
  syncGoalProgress(sourceGoal);
  syncGoalProgress(targetGoal);
  render();
}

function ensureGoalIncludesGridLine(goal, gridLine) {
  const targetLine = clamp(Number(gridLine) || 0, 0, state.timelineWeeks);
  const currentStartLine = goal.start - 1;
  const currentEndLine = currentStartLine + goal.duration;

  if (targetLine >= currentStartLine && targetLine <= currentEndLine) return;

  const preservedCriterionLines = getCriterionGridLineMap(goal);
  const nextStartLine = clamp(Math.floor(Math.min(currentStartLine, targetLine)), 0, state.timelineWeeks - 1);
  const nextEndLine = clamp(Math.ceil(Math.max(currentEndLine, targetLine)), nextStartLine + 1, state.timelineWeeks);

  goal.start = nextStartLine + 1;
  goal.duration = nextEndLine - nextStartLine;
  restoreCriterionGridLines(goal, preservedCriterionLines);
}

function getCriterionGridLineMap(goal) {
  return new Map(goal.criteria.map((criterion) => [criterion.id, getCriterionGridLine(goal, criterion)]));
}

function snapGoalCriteriaToGrid(goal) {
  goal.criteria.forEach((criterion) => {
    criterion.position = getCriterionPositionFromGridLine(goal, getCriterionGridLine(goal, criterion));
  });
}

function restoreCriterionGridLines(goal, gridLineMap) {
  goal.criteria.forEach((criterion) => {
    criterion.position = getCriterionPositionFromGridLine(goal, gridLineMap.get(criterion.id) ?? goal.start - 1);
  });
  syncGoalProgress(goal);
}

function getCriterionGridLine(goal, criterion) {
  const startLine = goal.start - 1;
  const endLine = startLine + goal.duration;
  return clamp(startLine + (criterion.position / 100) * goal.duration, startLine, endLine);
}

function getCriterionPositionFromGridLine(goal, gridLine) {
  const startLine = goal.start - 1;
  const endLine = startLine + goal.duration;
  const snappedLine = clamp(gridLine, startLine, endLine);
  return Number((((snappedLine - startLine) / goal.duration) * 100).toFixed(3));
}

function getGoalRangeLabel(goal) {
  const start = getTimelineWeekInfo(goal.start - 1);
  const end = getTimelineWeekInfo(goal.start + goal.duration - 2);

  if (start.year === end.year) return `S${start.week}-S${end.week} ${start.year}`;
  return `S${start.week} ${start.year}-S${end.week} ${end.year}`;
}

function getTimelineUnits() {
  if (state.ui.timelineZoom === TIMELINE_ZOOM_MONTH) return getTimelineMonthUnits();
  if (state.ui.timelineZoom === TIMELINE_ZOOM_DAY) return getTimelineWorkdayUnits();

  return Array.from({ length: state.timelineWeeks }, (_, index) => {
    const week = getTimelineWeekInfo(index);
    return {
      label: `S${week.week}`,
      detail: week.dayRange,
      startISO: week.startISO,
      endISO: week.endISO,
      title: `Settimana ${week.week}: giorni lavorativi ${week.dayRange}`,
    };
  });
}

function getTimelineWorkdayUnits() {
  const labels = ["Lun", "Mar", "Mer", "Gio", "Ven"];
  const units = [];

  for (let weekIndex = 0; weekIndex < state.timelineWeeks; weekIndex += 1) {
    const weekStart = parseLocalISODate(state.timelineStartDate);
    weekStart.setDate(weekStart.getDate() + weekIndex * 7);

    for (let dayIndex = 0; dayIndex < 5; dayIndex += 1) {
      const date = new Date(weekStart);
      date.setDate(date.getDate() + dayIndex);
      const iso = toLocalISODate(date);
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      units.push({
        label: day,
        detail: labels[dayIndex],
        startISO: iso,
        endISO: iso,
        title: `${labels[dayIndex]} ${day}/${month}/${date.getFullYear()}`,
      });
    }
  }

  return units;
}

function getTimelineMonthUnits() {
  return Array.from({ length: 12 }, (_, monthIndex) => {
    const startDate = new Date(state.timelineYear, monthIndex, 1);
    const endDate = new Date(state.timelineYear, monthIndex + 1, 0);
    return {
      label: getMonthNameShort(monthIndex),
      detail: String(state.timelineYear),
      startISO: toLocalISODate(startDate),
      endISO: toLocalISODate(endDate),
      title: `${getMonthNameShort(monthIndex)} ${state.timelineYear}`,
    };
  });
}

function getCurrentTimelineUnitIndex(units) {
  const today = toLocalISODate(new Date());
  return units.findIndex((unit) => unit.startISO <= today && today <= unit.endISO);
}

function getMonthNameShort(monthIndex) {
  return ["Gen", "Feb", "Mar", "Apr", "Mag", "Giu", "Lug", "Ago", "Set", "Ott", "Nov", "Dic"][monthIndex] || "";
}

function getTimelineWeekInfo(offset) {
  const startDate = parseLocalISODate(state.timelineStartDate);
  startDate.setDate(startDate.getDate() + offset * 7);
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + 4);

  return {
    ...getISOWeekInfo(startDate),
    startISO: toLocalISODate(startDate),
    endISO: toLocalISODate(endDate),
    dayRange: `${String(startDate.getDate()).padStart(2, "0")}-${String(endDate.getDate()).padStart(2, "0")}`,
  };
}

function getCurrentTimelineWeekIndex() {
  const currentWeekStart = parseLocalISODate(getCurrentWeekStartISO());
  const timelineStart = parseLocalISODate(state.timelineStartDate);
  const diffDays = Math.round((currentWeekStart - timelineStart) / (24 * 60 * 60 * 1000));
  const index = diffDays / 7;
  return Number.isInteger(index) && index >= 0 && index < state.timelineWeeks ? index : -1;
}

function getCurrentWeekStartISO() {
  return toLocalISODate(getWeekStart(new Date()));
}

function getCurrentTimelineYear() {
  return getISOWeekInfo(new Date()).year;
}

function getISOYearStartISO(year) {
  const janFourth = new Date(year, 0, 4);
  return toLocalISODate(getWeekStart(janFourth));
}

function getISOWeeksInYear(year) {
  return getISOWeekInfo(new Date(year, 11, 28)).week;
}

function getValidTimelineStartDate(value) {
  if (!value) return null;
  const date = parseLocalISODate(value);
  return Number.isNaN(date.getTime()) ? null : toLocalISODate(getWeekStart(date));
}

function getWeekStart(date) {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  const day = result.getDay() || 7;
  result.setDate(result.getDate() - day + 1);
  return result;
}

function parseLocalISODate(value) {
  const [year, month, day] = String(value).split("-").map(Number);
  return new Date(year, month - 1, day);
}

function toLocalISODate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getISOWeekInfo(date) {
  const target = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNumber = (target.getUTCDay() + 6) % 7;
  target.setUTCDate(target.getUTCDate() - dayNumber + 3);

  const isoYear = target.getUTCFullYear();
  const firstThursday = new Date(Date.UTC(isoYear, 0, 4));
  const firstDayNumber = (firstThursday.getUTCDay() + 6) % 7;
  firstThursday.setUTCDate(firstThursday.getUTCDate() - firstDayNumber + 3);

  return {
    week: 1 + Math.round((target - firstThursday) / (7 * 24 * 60 * 60 * 1000)),
    year: isoYear,
  };
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

elements.memberSelect.addEventListener("change", (event) => {
  selectMember(event.target.value);
});

elements.saveMember.addEventListener("click", saveMember);
elements.closeGoalPopup.addEventListener("click", closeGoalPopup);
elements.goalPopup.addEventListener("click", (event) => {
  if (event.target === elements.goalPopup) closeGoalPopup();
});
elements.cancelConfirm.addEventListener("click", closeConfirmDialog);
elements.confirmDelete.addEventListener("click", confirmRemoveMember);
elements.confirmDialog.addEventListener("click", (event) => {
  if (event.target === elements.confirmDialog) closeConfirmDialog();
});
elements.loginForm.addEventListener("submit", handleLogin);
elements.logoutUser.addEventListener("click", logoutUser);
elements.openUserManagement.addEventListener("click", openUserManagement);
elements.openUserManagementHeader.addEventListener("click", openUserManagement);
elements.closeUserManagement.addEventListener("click", closeUserManagement);
elements.userManagementDialog.addEventListener("click", (event) => {
  if (event.target === elements.userManagementDialog) closeUserManagement();
});
elements.toggleLeftSidebar.addEventListener("click", () => toggleSidebar("left"));
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !elements.goalPopup.hidden) closeGoalPopup();
  if (event.key === "Escape" && !elements.confirmDialog.hidden) closeConfirmDialog();
  if (event.key === "Escape" && !elements.userManagementDialog.hidden) closeUserManagement();
});
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "hidden") persistState();
});
window.addEventListener("resize", positionGoalPopup);
window.addEventListener("resize", updateTimelineOverlayPosition);
window.addEventListener("scroll", updateTimelineOverlayPosition, { passive: true });
window.addEventListener("beforeunload", persistState);
elements.memberName.addEventListener("keydown", (event) => {
  if (event.key === "Enter") saveMember();
});
elements.memberRole.addEventListener("keydown", (event) => {
  if (event.key === "Enter") saveMember();
});
elements.memberPassword.addEventListener("keydown", (event) => {
  if (event.key === "Enter") saveMember();
});
elements.memberLevel.addEventListener("change", populateCreateUserManagerOptions);
elements.goCurrentWeek.addEventListener("click", () => showTimelineView(true));
elements.goRoadmap.addEventListener("click", showRoadmapView);
elements.zoomTimelineOut.addEventListener("click", () => zoomTimeline(-1));
elements.zoomTimelineIn.addEventListener("click", () => zoomTimeline(1));
elements.toggleTheme.addEventListener("click", toggleTheme);
elements.addGoalButton.addEventListener("click", addGoalFromButton);

elements.timelineFrame.addEventListener("wheel", handleTimelineWheel, { passive: false });
elements.timelineFrame.addEventListener("pointermove", handleTimelinePointerMove);
elements.timelineFrame.addEventListener("pointerleave", handleTimelinePointerLeave);
elements.timelineFrame.addEventListener("click", handleTimelineClick);
elements.timelineFrame.addEventListener("scroll", () => {
  hideTimelineHoverLine();
  updateTimelineOverlayPosition();
});
elements.timelineFrame.addEventListener("dragover", (event) => {
  event.preventDefault();
  elements.timelineFrame.classList.add("is-dropping");
});
elements.timelineFrame.addEventListener("dragleave", (event) => {
  if (!elements.timelineFrame.contains(event.relatedTarget)) {
    elements.timelineFrame.classList.remove("is-dropping");
  }
});
elements.timelineFrame.addEventListener("drop", handleGridDrop);
elements.roadmapCanvas.addEventListener("pointerdown", handleRoadmapPointerDown);
elements.roadmapCanvas.addEventListener("pointermove", handleRoadmapPointerMove);
elements.roadmapCanvas.addEventListener("pointerup", endRoadmapPan);
elements.roadmapCanvas.addEventListener("pointercancel", endRoadmapPan);

render();
initializeCloudSync();
