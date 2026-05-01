const STORAGE_KEY = "team-improvement-plan";
const STORAGE_VERSION = 2;
const CLOUD_SAVE_DEBOUNCE_MS = 900;
const ROW_HEIGHT = 92;
const LABEL_WIDTH = 170;
const MIN_WEEK_WIDTH = 72;
const DEFAULT_TIMELINE_YEAR = getCurrentTimelineYear();
const DEFAULT_TIMELINE_WEEKS = getISOWeeksInYear(DEFAULT_TIMELINE_YEAR);
const DEFAULT_TIMELINE_START_DATE = getISOYearStartISO(DEFAULT_TIMELINE_YEAR);
const LOCK_ICON_URL = "padlock.png";
const UNLOCK_ICON_URL = "open-padlock.png";

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
      id: "marta-rossi",
      name: "Marta Rossi",
      role: "Frontend Engineer",
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
  ],
};

const state = loadState();
const initialLocalSavedAt = state.savedAt;
const elements = {
  appShell: document.querySelector("#appShell"),
  toggleLeftSidebar: document.querySelector("#toggleLeftSidebar"),
  toggleRightSidebar: document.querySelector("#toggleRightSidebar"),
  memberSelect: document.querySelector("#memberSelect"),
  memberName: document.querySelector("#memberName"),
  memberRole: document.querySelector("#memberRole"),
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
  toolList: document.querySelector("#toolList"),
  timelineYear: document.querySelector("#timelineYear"),
  saveStatus: document.querySelector("#saveStatus"),
  goCurrentWeek: document.querySelector("#goCurrentWeek"),
};

let activePopupGoalId = null;
let activePopupCriterionId = null;
let goalPopupAnchorRect = null;
let pendingCriterionFocus = null;
let pendingDeleteMemberId = null;
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
      rightCollapsed: Boolean(source?.ui?.rightCollapsed),
    },
    members: Array.isArray(source?.members) && source.members.length ? source.members : fallback.members,
  };

  normalized.members = normalized.members.map((member, memberIndex) => ({
    id: member.id || createId(`member-${memberIndex + 1}`),
    name: member.name || `Membro ${memberIndex + 1}`,
    role: member.role || "",
    goals: Array.isArray(member.goals)
      ? member.goals.map((goal) => normalizeGoal(goal, normalized.timelineWeeks, legacyMonths, timelineMigration))
      : [],
  }));

  if (!normalized.members.some((member) => member.id === normalized.activeMemberId)) {
    normalized.activeMemberId = normalized.members[0]?.id || "";
  }

  return normalized;
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

function getActiveMember() {
  return state.members.find((member) => member.id === state.activeMemberId) ?? state.members[0] ?? null;
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
  const activeMember = getActiveMember();
  const timelineMinWidth = LABEL_WIDTH + state.timelineWeeks * MIN_WEEK_WIDTH;
  const currentWeekIndex = getCurrentTimelineWeekIndex();
  document.documentElement.style.setProperty("--weeks", state.timelineWeeks);
  document.documentElement.style.setProperty("--week-width", `${100 / state.timelineWeeks}%`);
  document.documentElement.style.setProperty("--timeline-min-width", `${timelineMinWidth}px`);
  document.documentElement.style.setProperty("--row-label-width", `${LABEL_WIDTH}px`);
  document.documentElement.style.setProperty("--current-week-left", `${(currentWeekIndex / state.timelineWeeks) * 100}%`);
  document.documentElement.style.setProperty("--current-week-opacity", currentWeekIndex >= 0 ? "1" : "0");
  elements.timelineYear.textContent = `Anno ${state.timelineYear}`;
  elements.goCurrentWeek.disabled = currentWeekIndex < 0;

  renderMemberSelect(activeMember);
  renderMemberList(activeMember);
  renderMemberSummary(activeMember);
  renderGoalEditors(activeMember);
  renderTimeline(activeMember);
  applySidebarState();
  persistState();
}

function renderMemberSelect(activeMember) {
  elements.memberSelect.innerHTML = "";

  state.members.forEach((member) => {
    const option = document.createElement("option");
    option.value = member.id;
    option.textContent = member.name;
    option.selected = member.id === activeMember?.id;
    elements.memberSelect.append(option);
  });

  elements.memberCount.textContent = state.members.length;
  elements.memberSelect.disabled = state.members.length === 0;
}

function renderMemberList(activeMember) {
  elements.memberList.innerHTML = "";

  if (!state.members.length) {
    const empty = document.createElement("p");
    empty.className = "member-list-empty";
    empty.textContent = "Nessun membro salvato";
    elements.memberList.append(empty);
    return;
  }

  state.members.forEach((member) => {
    const item = document.createElement("div");
    item.className = `member-list-item${member.id === activeMember?.id ? " is-active" : ""}`;

    const selectButton = document.createElement("button");
    selectButton.className = "member-list-select";
    selectButton.type = "button";
    selectButton.innerHTML = `
      <span class="member-list-avatar" aria-hidden="true">${escapeHtml(getInitials(member.name))}</span>
      <span>
        <strong>${escapeHtml(member.name)}</strong>
        <small>${escapeHtml(member.role || "Ruolo non indicato")}</small>
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
  elements.activeMemberRole.textContent = activeMember.role || "Ruolo non indicato";
  elements.memberAvatar.textContent = getInitials(activeMember.name);
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
  const currentWeekStart = getCurrentWeekStartISO();

  const axisGutter = document.createElement("div");
  axisGutter.className = "axis-gutter";
  elements.timeAxis.append(axisGutter);

  for (let index = 0; index < state.timelineWeeks; index += 1) {
    const marker = document.createElement("div");
    const week = getTimelineWeekInfo(index);
    marker.className = `time-marker${week.startISO === currentWeekStart ? " is-current" : ""}`;
    marker.title = `Settimana ${week.week}: giorni ${week.dayRange}`;
    marker.innerHTML = `<strong>S${week.week}</strong><small>${week.dayRange}</small>`;
    elements.timeAxis.append(marker);
  }

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
    row.style.setProperty("--bar-left", `${((goal.start - 1) / state.timelineWeeks) * 100}%`);
    row.style.setProperty("--bar-width", `${(goal.duration / state.timelineWeeks) * 100}%`);
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
    line.draggable = true;
    line.title = goal.title || "Linea obiettivo";
    line.setAttribute("aria-label", `Linea ${goal.title || "obiettivo"}`);
    line.addEventListener("dragstart", (event) => startDrag(event, { kind: "move-line", goalId: goal.id }));
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
  persistState();
}

function updateGoal(goalId, patch) {
  const activeMember = getActiveMember();
  const goal = activeMember?.goals.find((item) => item.id === goalId);
  if (!goal) return;

  Object.assign(goal, patch);
  clampGoal(goal);
  renderTimeline(activeMember);
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
  persistState();
}

function removeGoal(goalId) {
  const activeMember = getActiveMember();
  if (!activeMember) return;

  activeMember.goals = activeMember.goals.filter((goal) => goal.id !== goalId);
  if (activePopupGoalId === goalId || !activeMember.goals.length) closeGoalPopup();
  render();
}

function selectMember(memberId) {
  if (!state.members.some((member) => member.id === memberId)) return;
  state.activeMemberId = memberId;
  closeGoalPopup();
  render();
}

function requestRemoveMember(memberId) {
  const member = state.members.find((item) => item.id === memberId);
  if (!member) return;

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
  const memberIndex = state.members.findIndex((member) => member.id === memberId);
  if (memberIndex < 0) return;

  state.members.splice(memberIndex, 1);
  if (state.activeMemberId === memberId) {
    state.activeMemberId = state.members[Math.max(0, memberIndex - 1)]?.id || state.members[0]?.id || "";
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
  const name = elements.memberName.value.trim();
  const role = elements.memberRole.value.trim();
  if (!name) {
    elements.memberName.focus();
    return;
  }

  const existing = state.members.find((member) => member.name.toLowerCase() === name.toLowerCase());

  if (existing) {
    existing.role = role || existing.role;
    state.activeMemberId = existing.id;
  } else {
    const newMember = {
      id: createId(name),
      name,
      role,
      goals: [createGoal({ title: "Prima linea", start: 1 })],
    };
    state.members.push(newMember);
    state.activeMemberId = newMember.id;
  }

  elements.memberName.value = "";
  elements.memberRole.value = "";
  render();
}

function scrollToCurrentWeek(behavior = "smooth") {
  const currentWeekIndex = getCurrentTimelineWeekIndex();
  if (currentWeekIndex < 0) return;

  const maxScrollLeft = Math.max(0, elements.timelineFrame.scrollWidth - elements.timelineFrame.clientWidth);
  const trackWidth = Math.max(MIN_WEEK_WIDTH, elements.timelineFrame.scrollWidth - LABEL_WIDTH);
  const weekWidth = trackWidth / state.timelineWeeks;
  const visibleTrackWidth = Math.max(0, elements.timelineFrame.clientWidth - LABEL_WIDTH);
  const targetLeft = clamp(currentWeekIndex * weekWidth - (visibleTrackWidth - weekWidth) / 2, 0, maxScrollLeft);

  elements.timelineFrame.scrollTo({ left: targetLeft, behavior });
}

function toggleSidebar(side) {
  if (side === "left") {
    state.ui.leftCollapsed = !state.ui.leftCollapsed;
  } else {
    state.ui.rightCollapsed = !state.ui.rightCollapsed;
  }

  applySidebarState();
  persistState();
}

function applySidebarState() {
  elements.appShell.classList.toggle("left-collapsed", state.ui.leftCollapsed);
  elements.appShell.classList.toggle("right-collapsed", state.ui.rightCollapsed);

  elements.toggleLeftSidebar.setAttribute("aria-pressed", String(state.ui.leftCollapsed));
  elements.toggleLeftSidebar.setAttribute(
    "aria-label",
    state.ui.leftCollapsed ? "Mostra menu membro" : "Nascondi menu membro",
  );
  elements.toggleLeftSidebar.title = state.ui.leftCollapsed ? "Mostra menu membro" : "Nascondi menu membro";
  elements.toggleLeftSidebar.querySelector("span").textContent = state.ui.leftCollapsed ? ">" : "<";

  elements.toggleRightSidebar.setAttribute("aria-pressed", String(state.ui.rightCollapsed));
  elements.toggleRightSidebar.setAttribute(
    "aria-label",
    state.ui.rightCollapsed ? "Mostra toolbox" : "Nascondi toolbox",
  );
  elements.toggleRightSidebar.title = state.ui.rightCollapsed ? "Mostra toolbox" : "Nascondi toolbox";
  elements.toggleRightSidebar.querySelector("span").textContent = state.ui.rightCollapsed ? "<" : ">";
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
  const input = criterionInputs[criterionIndex];
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

function handleToolDragStart(event) {
  const tool = event.target.closest("[data-tool]");
  if (!tool) return;

  const kind = tool.dataset.tool === "line" ? "new-line" : "new-criterion";
  startDrag(event, { kind });
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

function getDropMeta(event) {
  const activeMember = getActiveMember();
  if (!activeMember) return null;

  const frameRect = elements.timelineFrame.getBoundingClientRect();
  const planRect = elements.planGrid.getBoundingClientRect();
  const contentWidth = Math.max(elements.timelineFrame.scrollWidth, elements.timelineFrame.clientWidth);
  const trackWidth = Math.max(MIN_WEEK_WIDTH, contentWidth - LABEL_WIDTH);
  const contentX = event.clientX - frameRect.left + elements.timelineFrame.scrollLeft;
  const trackX = clamp(contentX - LABEL_WIDTH, 0, trackWidth);
  const gridLine = clamp(Math.round((trackX / trackWidth) * state.timelineWeeks), 0, state.timelineWeeks);
  const rowY = event.clientY - planRect.top;
  const rowIndex = clamp(Math.floor(rowY / ROW_HEIGHT), 0, activeMember.goals.length);

  return {
    gridLine,
    rowIndex,
    trackPercent: (gridLine / state.timelineWeeks) * 100,
  };
}

function addCriterionAtDrop(dropMeta) {
  const activeMember = getActiveMember();
  if (!activeMember) return;

  if (!activeMember.goals.length || dropMeta.rowIndex >= activeMember.goals.length) {
    addGoalAtDrop(dropMeta);
    return;
  }

  const goal = activeMember.goals[dropMeta.rowIndex];
  goal.criteria.push(createCriterion(getCriterionPositionFromGridLine(goal, dropMeta.gridLine)));
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

  criterion.position = getCriterionPositionFromGridLine(targetGoal, dropMeta.gridLine);
  targetGoal.criteria.push(criterion);
  syncGoalProgress(sourceGoal);
  syncGoalProgress(targetGoal);
  render();
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
  return clamp(Math.round(startLine + (criterion.position / 100) * goal.duration), startLine, endLine);
}

function getCriterionPositionFromGridLine(goal, gridLine) {
  const startLine = goal.start - 1;
  const endLine = startLine + goal.duration;
  const snappedLine = clamp(gridLine, startLine, endLine);
  return Math.round(((snappedLine - startLine) / goal.duration) * 100);
}

function getGoalRangeLabel(goal) {
  const start = getTimelineWeekInfo(goal.start - 1);
  const end = getTimelineWeekInfo(goal.start + goal.duration - 2);

  if (start.year === end.year) return `S${start.week}-S${end.week} ${start.year}`;
  return `S${start.week} ${start.year}-S${end.week} ${end.year}`;
}

function getTimelineWeekInfo(offset) {
  const startDate = parseLocalISODate(state.timelineStartDate);
  startDate.setDate(startDate.getDate() + offset * 7);
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + 6);

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
elements.toggleLeftSidebar.addEventListener("click", () => toggleSidebar("left"));
elements.toggleRightSidebar.addEventListener("click", () => toggleSidebar("right"));
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !elements.goalPopup.hidden) closeGoalPopup();
  if (event.key === "Escape" && !elements.confirmDialog.hidden) closeConfirmDialog();
});
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "hidden") persistState();
});
window.addEventListener("resize", positionGoalPopup);
window.addEventListener("beforeunload", persistState);
elements.memberName.addEventListener("keydown", (event) => {
  if (event.key === "Enter") saveMember();
});
elements.memberRole.addEventListener("keydown", (event) => {
  if (event.key === "Enter") saveMember();
});
elements.goCurrentWeek.addEventListener("click", () => scrollToCurrentWeek());

elements.toolList.addEventListener("dragstart", handleToolDragStart);
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

render();
initializeCloudSync();
