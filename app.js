const STORAGE_KEY = "team-improvement-plan";
const STORAGE_VERSION = 3;
const CLOUD_SAVE_DEBOUNCE_MS = 900;
const ROW_HEIGHT = 92;
const LABEL_WIDTH = 200;
const MIN_WEEK_WIDTH = 72;
const DEFAULT_TIMELINE_YEAR = getCurrentTimelineYear();
const DEFAULT_TIMELINE_WEEKS = getISOWeeksInYear(DEFAULT_TIMELINE_YEAR);
const DEFAULT_TIMELINE_START_DATE = getISOYearStartISO(DEFAULT_TIMELINE_YEAR);
const LOCK_ICON_URL = "padlock.png";
const UNLOCK_ICON_URL = "open-padlock.png";
const SVG_NS = "http://www.w3.org/2000/svg";
const ROADMAP_COLORS = ["#28f879", "#ffd21a", "#ff1630", "#36a8ff", "#ff7a2f", "#c47cff", "#2de2d1", "#f052b8"];
const ROADMAP_BLOCKED_COLOR = "#8f9a94";
const ROADMAP_ZOOM_MIN = 0.6;
const ROADMAP_ZOOM_MAX = 1.8;
const ROADMAP_ZOOM_STEP = 1.1;
const WORKSPACE_VIEW_TIMELINE = "timeline";
const WORKSPACE_VIEW_ROADMAP = "roadmap";
const WORKSPACE_VIEW_SKILL_TREE = "skill-tree";
const WORKSPACE_VIEW_SOFT_SKILL_TREE = "soft-skill-tree";
const WORKSPACE_VIEWS = [
  WORKSPACE_VIEW_TIMELINE,
  WORKSPACE_VIEW_ROADMAP,
  WORKSPACE_VIEW_SKILL_TREE,
  WORKSPACE_VIEW_SOFT_SKILL_TREE,
];
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
const DEFAULT_USER_PASSWORD = "123";
const LEGACY_USER_PASSWORDS = new Set(["password"]);
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

const SKILL_TREE = {
  id: "hard",
  title: "PLC skill tree",
  summary: "Hard skill PLC",
  view: WORKSPACE_VIEW_SKILL_TREE,
  rootId: "hard-plc",
  zoomKey: "skillTreeZoom",
  nodes: [
    {
      id: "hard-plc",
      label: "Hard skill PLC",
      description: "Competenze tecniche per programmare e mettere in servizio impianti PLC.",
      color: "#36a8ff",
    },
    {
      id: "fondamenti-plc",
      label: "Fondamenti PLC",
      description: "Ciclo di scansione, memoria, task e struttura base di un controllore.",
      parent: "hard-plc",
      color: "#36a8ff",
    },
    {
      id: "impianto-elettrico",
      label: "Lettura schemi",
      description: "Leggere schemi elettrici, morsettiere, segnali e alimentazioni.",
      parent: "fondamenti-plc",
      color: "#2de2d1",
    },
    {
      id: "io-segnali",
      label: "I/O e segnali",
      description: "Gestire ingressi, uscite, sensori, attuatori e segnali analogici.",
      parent: "fondamenti-plc",
      color: "#2de2d1",
    },
    {
      id: "linguaggi-plc",
      label: "IEC 61131-3",
      description: "Conoscere Ladder, FBD, Structured Text e organizzazione dei programmi.",
      parent: "hard-plc",
      color: "#ffd21a",
    },
    {
      id: "ladder-fbd",
      label: "Ladder e FBD",
      description: "Implementare logiche discrete leggibili per manutenzione e diagnostica.",
      parent: "linguaggi-plc",
      color: "#ffd21a",
    },
    {
      id: "structured-text",
      label: "Structured Text",
      description: "Scrivere funzioni, calcoli, sequenze e logiche riusabili.",
      parent: "linguaggi-plc",
      color: "#ffd21a",
    },
    {
      id: "modularita-plc",
      label: "Blocchi riusabili",
      description: "Progettare FB, FC e librerie ordinate per macchine simili.",
      parent: "linguaggi-plc",
      color: "#ffd21a",
    },
    {
      id: "reti-industriali",
      label: "Reti industriali",
      description: "Configurare comunicazione tra PLC, I/O remoti, drive e supervisione.",
      parent: "hard-plc",
      color: "#c47cff",
    },
    {
      id: "profinet-ethernetip",
      label: "PROFINET / Ethernet/IP",
      description: "Indirizzi, device, diagnostica rete e scambio dati ciclico.",
      parent: "reti-industriali",
      color: "#c47cff",
    },
    {
      id: "modbus-opcua",
      label: "Modbus / OPC UA",
      description: "Integrare dati macchina con dispositivi, SCADA e sistemi esterni.",
      parent: "reti-industriali",
      color: "#c47cff",
    },
    {
      id: "hmi-scada",
      label: "HMI e SCADA",
      description: "Creare pagine operatore, allarmi, trend, ricette e diagnostica.",
      parent: "hard-plc",
      color: "#ff7a2f",
    },
    {
      id: "allarmi-ricette",
      label: "Allarmi e ricette",
      description: "Gestire stati macchina, messaggi operatore e parametri di processo.",
      parent: "hmi-scada",
      color: "#ff7a2f",
    },
    {
      id: "azionamenti-motion",
      label: "Drive e motion",
      description: "Parametrizzare inverter, assi, homing, camme e profili di movimento.",
      parent: "hard-plc",
      color: "#f052b8",
    },
    {
      id: "sicurezza-macchina",
      label: "Safety PLC",
      description: "Comprendere funzioni di sicurezza, interblocchi e logiche fail-safe.",
      parent: "hard-plc",
      color: "#ff1630",
    },
    {
      id: "commissioning",
      label: "Commissioning",
      description: "Scaricare software, testare sequenze, validare I/O e avviare impianti.",
      parent: "hard-plc",
      color: "#28f879",
    },
    {
      id: "debug-online",
      label: "Debug online",
      description: "Monitorare variabili, forzature controllate, trace e stati macchina.",
      parent: "commissioning",
      color: "#28f879",
    },
    {
      id: "troubleshooting",
      label: "Troubleshooting",
      description: "Diagnosticare guasti combinando software, segnali, rete e processo.",
      parent: "commissioning",
      color: "#28f879",
    },
  ],
};

const SOFT_SKILL_TREE = {
  id: "soft",
  title: "Competenze trasversali",
  summary: "Soft skill",
  view: WORKSPACE_VIEW_SOFT_SKILL_TREE,
  rootId: "soft-skill",
  zoomKey: "softSkillTreeZoom",
  nodes: [
    {
      id: "soft-skill",
      label: "Soft skill",
      description: "Competenze trasversali per lavorare bene in team e sui problemi.",
      color: "#52cda0",
    },
    {
      id: "professionalita",
      label: "Professionalita",
      description: "Responsabilita, affidabilita e cura del modo di lavorare.",
      parent: "soft-skill",
      color: "#2de2d1",
    },
    {
      id: "autogestione",
      label: "Autogestione",
      description: "Gestire focus, tempo e promesse in autonomia.",
      parent: "professionalita",
      color: "#2de2d1",
    },
    {
      id: "ownership-operativa",
      label: "Ownership operativa",
      description: "Prendere in carico problemi, follow-up e decisioni fino alla chiusura.",
      parent: "professionalita",
      color: "#2de2d1",
    },
    {
      id: "gestione-energia",
      label: "Gestione energia",
      description: "Proteggere attenzione, ritmo e recupero nei periodi intensi.",
      parent: "professionalita",
      color: "#2de2d1",
    },
    {
      id: "comunicazione",
      label: "Comunicazione chiara",
      description: "Spiegare problemi, decisioni e trade-off in modo comprensibile.",
      parent: "soft-skill",
      color: "#36a8ff",
    },
    {
      id: "ascolto",
      label: "Ascolto attivo",
      description: "Capire esigenze, vincoli e segnali deboli prima di rispondere.",
      parent: "comunicazione",
      color: "#36a8ff",
    },
    {
      id: "scrittura",
      label: "Scrittura tecnica",
      description: "Documentare decisioni, requisiti e passaggi operativi.",
      parent: "comunicazione",
      color: "#36a8ff",
    },
    {
      id: "assertivita",
      label: "Assertivita",
      description: "Dire no, chiedere chiarezza e proteggere priorita senza irrigidirsi.",
      parent: "comunicazione",
      color: "#36a8ff",
    },
    {
      id: "storytelling",
      label: "Storytelling tecnico",
      description: "Rendere leggibile il percorso da problema, evidenze e soluzione.",
      parent: "comunicazione",
      color: "#36a8ff",
    },
    {
      id: "collaborazione",
      label: "Collaborazione",
      description: "Lavorare bene con persone, ruoli e priorita diverse.",
      parent: "soft-skill",
      color: "#28f879",
    },
    {
      id: "feedback",
      label: "Feedback e code review",
      description: "Dare e ricevere feedback tecnico senza bloccare il team.",
      parent: "collaborazione",
      color: "#28f879",
    },
    {
      id: "conflitto",
      label: "Gestione conflitti",
      description: "Portare attriti e divergenze verso decisioni utili.",
      parent: "collaborazione",
      color: "#28f879",
    },
    {
      id: "remoto",
      label: "Coordinamento remoto",
      description: "Allinearsi in modo asincrono e rendere visibile il lavoro.",
      parent: "collaborazione",
      color: "#28f879",
    },
    {
      id: "negoziazione",
      label: "Negoziazione",
      description: "Trovare accordi pratici tra vincoli tecnici, tempi e bisogni diversi.",
      parent: "collaborazione",
      color: "#28f879",
    },
    {
      id: "pensiero-critico",
      label: "Pensiero critico",
      description: "Analizzare il contesto prima di scegliere una soluzione.",
      parent: "soft-skill",
      color: "#ffd21a",
    },
    {
      id: "problem-framing",
      label: "Problem framing",
      description: "Definire il problema giusto prima di implementare.",
      parent: "pensiero-critico",
      color: "#ffd21a",
    },
    {
      id: "priorita",
      label: "Prioritizzazione",
      description: "Separare urgenza, valore e rischio nelle decisioni quotidiane.",
      parent: "pensiero-critico",
      color: "#ffd21a",
    },
    {
      id: "decisioni",
      label: "Decisioni basate su dati",
      description: "Usare evidenze, metriche e test per orientare le scelte.",
      parent: "pensiero-critico",
      color: "#ffd21a",
    },
    {
      id: "pensiero-sistemico",
      label: "Pensiero sistemico",
      description: "Vedere dipendenze, effetti laterali e impatto sul processo completo.",
      parent: "pensiero-critico",
      color: "#ffd21a",
    },
    {
      id: "apprendimento",
      label: "Apprendimento continuo",
      description: "Aggiornarsi, chiedere feedback e trasformarlo in crescita.",
      parent: "soft-skill",
      color: "#c47cff",
    },
    {
      id: "adattabilita",
      label: "Adattabilita",
      description: "Cambiare approccio quando il contesto o la tecnologia cambia.",
      parent: "apprendimento",
      color: "#c47cff",
    },
    {
      id: "resilienza",
      label: "Resilienza al cambiamento",
      description: "Reggere incertezza, incidenti e iterazioni senza perdere lucidita.",
      parent: "apprendimento",
      color: "#c47cff",
    },
    {
      id: "curiosita-operativa",
      label: "Curiosita operativa",
      description: "Fare domande migliori e testare ipotesi sul campo.",
      parent: "apprendimento",
      color: "#c47cff",
    },
    {
      id: "etica",
      label: "Etica e impatto",
      description: "Valutare conseguenze, rischi e responsabilita del software.",
      parent: "soft-skill",
      color: "#ff7a2f",
    },
    {
      id: "inclusione",
      label: "Inclusione stakeholder",
      description: "Considerare utenti, team e contesti diversi nelle scelte tecniche.",
      parent: "etica",
      color: "#ff7a2f",
    },
    {
      id: "leadership-relazionale",
      label: "Leadership relazionale",
      description: "Aiutare il team a decidere, crescere e coordinarsi meglio.",
      parent: "soft-skill",
      color: "#f052b8",
    },
    {
      id: "mentoring",
      label: "Mentoring",
      description: "Far crescere autonomia e criterio tecnico nelle persone junior.",
      parent: "leadership-relazionale",
      color: "#f052b8",
    },
    {
      id: "delega",
      label: "Delega",
      description: "Affidare attivita con contesto, confini e controllo chiari.",
      parent: "leadership-relazionale",
      color: "#f052b8",
    },
    {
      id: "facilitazione",
      label: "Facilitazione",
      description: "Guidare riunioni e decisioni verso risultati concreti.",
      parent: "leadership-relazionale",
      color: "#f052b8",
    },
  ],
};

const SKILL_TREES = [SKILL_TREE, SOFT_SKILL_TREE];

const SKILL_ICON_BY_ID = {
  "skill-tree-root": "network",
  "soft-skill": "people",
  "hard-plc": "chip",
  professionalita: "shield",
  comunicazione: "message",
  "pensiero-critico": "brain",
  apprendimento: "book",
  etica: "scale",
  ascolto: "ear",
  scrittura: "file",
  collaborazione: "team",
  feedback: "review",
  conflitto: "balance",
  remoto: "globe",
  "problem-framing": "target",
  priorita: "list",
  decisioni: "chart",
  adattabilita: "rotate",
  resilienza: "mountain",
  autogestione: "clock",
  "ownership-operativa": "target",
  "gestione-energia": "clock",
  assertivita: "message",
  storytelling: "file",
  negoziazione: "balance",
  "pensiero-sistemico": "network",
  "curiosita-operativa": "spark",
  inclusione: "spark",
  "leadership-relazionale": "team",
  mentoring: "people",
  delega: "target",
  facilitazione: "message",
  "fondamenti-plc": "cpu",
  "impianto-elettrico": "schematic",
  "io-segnali": "io",
  "linguaggi-plc": "code",
  "ladder-fbd": "ladder",
  "structured-text": "braces",
  "modularita-plc": "blocks",
  "reti-industriali": "network",
  "profinet-ethernetip": "ethernet",
  "modbus-opcua": "database",
  "hmi-scada": "monitor",
  "allarmi-ricette": "bell",
  "azionamenti-motion": "motion",
  "sicurezza-macchina": "safety",
  commissioning: "rocket",
  "debug-online": "bug",
  troubleshooting: "wrench",
};

const SKILL_ICON_SVG = {
  network:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="6" cy="7" r="2.2"/><circle cx="18" cy="7" r="2.2"/><circle cx="12" cy="18" r="2.2"/><path d="M8 8.5 11 16M16 8.5 13 16M8.3 7h7.4"/></svg>',
  people:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="9" cy="8" r="3"/><circle cx="17" cy="10" r="2.4"/><path d="M3.5 19c.8-3.2 3-5 5.5-5s4.7 1.8 5.5 5M14.5 15c2.4.1 4.2 1.5 5 4"/></svg>',
  chip:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="7" y="7" width="10" height="10" rx="2"/><path d="M9 2v3M15 2v3M9 19v3M15 19v3M2 9h3M2 15h3M19 9h3M19 15h3M10 12h4"/></svg>',
  shield:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3 19 6v5c0 4.5-2.6 8-7 10-4.4-2-7-5.5-7-10V6l7-3Z"/><path d="m9 12 2 2 4-5"/></svg>',
  message:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 5h14v10H9l-4 4V5Z"/><path d="M8 9h8M8 12h5"/></svg>',
  brain:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5a4 4 0 0 0-4 4c-1.5.7-2 2-2 3.5A3.5 3.5 0 0 0 6.5 16H8v3M15 5a4 4 0 0 1 4 4c1.5.7 2 2 2 3.5a3.5 3.5 0 0 1-3.5 3.5H16v3M12 4v16M8 10h3M13 10h3M8 14h3M13 14h3"/></svg>',
  book:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 4h6a3 3 0 0 1 3 3v13a3 3 0 0 0-3-3H5V4ZM19 4h-5a3 3 0 0 0-3 3"/><path d="M14 17h5V4"/></svg>',
  scale:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4v17M5 7h14M7 7l-4 7h8L7 7ZM17 7l-4 7h8l-4-7Z"/></svg>',
  ear:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 9a5 5 0 0 1 10 0c0 5-5 5-5 9a3 3 0 0 1-5.8 1M9 9a3 3 0 0 1 6 0c0 2.4-2.5 3-3.2 4.7"/><path d="M4 10a8 8 0 0 1 2.2-5.5"/></svg>',
  file:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 3h8l4 4v14H6V3Z"/><path d="M14 3v5h4M9 12h6M9 16h6"/></svg>',
  team:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="8" cy="8" r="3"/><circle cx="16" cy="8" r="3"/><path d="M3.5 19c.7-3 2.4-4.5 4.5-4.5s3.8 1.5 4.5 4.5M11.5 19c.7-3 2.4-4.5 4.5-4.5s3.8 1.5 4.5 4.5"/></svg>',
  review:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h16v11H8l-4 4V5Z"/><path d="m8 11 2 2 5-5M16 13h1"/></svg>',
  balance:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v18M5 6h14M7 6l-4 6h8L7 6ZM17 6l-4 6h8l-4-6Z"/><path d="M8 21h8"/></svg>',
  globe:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.4 2.5 3.6 5.5 3.6 9S14.4 18.5 12 21M12 3C9.6 5.5 8.4 8.5 8.4 12S9.6 18.5 12 21"/></svg>',
  target:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="4"/><path d="M12 2v4M12 18v4M2 12h4M18 12h4"/></svg>',
  list:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 6h12M8 12h12M8 18h12"/><circle cx="4" cy="6" r="1"/><circle cx="4" cy="12" r="1"/><circle cx="4" cy="18" r="1"/></svg>',
  chart:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20V4M4 20h16"/><path d="m7 15 4-4 3 3 5-7"/><circle cx="7" cy="15" r="1.2"/><circle cx="11" cy="11" r="1.2"/><circle cx="14" cy="14" r="1.2"/><circle cx="19" cy="7" r="1.2"/></svg>',
  rotate:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 7h7a5 5 0 0 1 0 10H9"/><path d="m7 7 3-3M7 7l3 3M17 17l-3 3M17 17l-3-3"/></svg>',
  mountain:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 20 10 6l4 7 2-3 5 10H3Z"/><path d="m10 6 2.5 5H8.5"/></svg>',
  clock:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8"/><path d="M12 7v5l4 2"/></svg>',
  spark:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3l2.2 5.8L20 11l-5.8 2.2L12 19l-2.2-5.8L4 11l5.8-2.2L12 3Z"/><path d="M19 4v4M17 6h4"/></svg>',
  cpu:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="6" y="6" width="12" height="12" rx="2"/><path d="M9 10h6M9 14h6M4 9h2M4 15h2M18 9h2M18 15h2M9 4v2M15 4v2M9 18v2M15 18v2"/></svg>',
  schematic:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6h6v6H4V6ZM14 12h6v6h-6v-6Z"/><path d="M10 9h4M17 12V9H10M7 12v4h7"/></svg>',
  io:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 5h14v14H5V5Z"/><path d="M8 9h3v6H8zM14 9h2v6h-2zM2 9h3M2 15h3M19 9h3M19 15h3"/></svg>',
  code:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m8 8-4 4 4 4M16 8l4 4-4 4M13 5l-2 14"/></svg>',
  ladder:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 4v16M18 4v16M6 8h12M6 12h12M6 16h12"/></svg>',
  braces:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 4H7a2 2 0 0 0-2 2v3a2 2 0 0 1-2 2 2 2 0 0 1 2 2v3a2 2 0 0 0 2 2h2M15 4h2a2 2 0 0 1 2 2v3a2 2 0 0 0 2 2 2 2 0 0 0-2 2v3a2 2 0 0 1-2 2h-2"/></svg>',
  blocks:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="4" width="7" height="7" rx="1.5"/><rect x="8.5" y="13" width="7" height="7" rx="1.5"/></svg>',
  ethernet:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 4h8v6l-2 2h-4l-2-2V4Z"/><path d="M12 12v8M7 20h10M9 7h1M12 7h1M15 7h1"/></svg>',
  database:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><ellipse cx="12" cy="6" rx="7" ry="3"/><path d="M5 6v6c0 1.7 3.1 3 7 3s7-1.3 7-3V6M5 12v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6"/></svg>',
  monitor:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="5" width="16" height="11" rx="2"/><path d="M9 20h6M12 16v4M8 10h3M13 10h3"/></svg>',
  bell:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 17h12l-1.4-2V10a4.6 4.6 0 0 0-9.2 0v5L6 17Z"/><path d="M10 20h4"/></svg>',
  motion:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="8" cy="12" r="3"/><path d="M11 12h8M16 8l4 4-4 4M4 6h4M4 18h7"/></svg>',
  safety:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3 20 7v5c0 4.6-3 7.5-8 9-5-1.5-8-4.4-8-9V7l8-4Z"/><path d="M12 8v5M12 16h.1"/></svg>',
  rocket:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M13 4c4 1 6 3 7 7l-6 6-5-5 4-8Z"/><path d="M9 12 5 13l-2 5 5-2 1-4ZM14 6l4 4M8 17l-2 2"/></svg>',
  bug:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="8" y="7" width="8" height="12" rx="4"/><path d="M8 11H4M20 11h-4M8 15H5M19 15h-3M10 7 8 4M14 7l2-3M9 20l-2 2M15 20l2 2"/></svg>',
  wrench:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 6a5 5 0 0 0 6 6L10 22l-4-4 10-10a5 5 0 0 1-2-2Z"/><path d="M7 19l-2 2"/></svg>',
  skill:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="7"/><path d="M12 5v14M5 12h14"/></svg>',
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
  memberSearchOptions: document.querySelector("#memberSearchOptions"),
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
  confirmTitle: document.querySelector("#confirmTitle"),
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
  themeIcon: document.querySelector("#themeIcon"),
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
  goSkillTree: document.querySelector("#goSkillTree"),
  goSoftSkillTree: document.querySelector("#goSoftSkillTree"),
  roadmapSection: document.querySelector("#roadmapSection"),
  roadmapCanvas: document.querySelector("#roadmapCanvas"),
  roadmapMember: document.querySelector("#roadmapMember"),
  skillTreeSection: document.querySelector("#skillTreeSection"),
  skillTreeCanvas: document.querySelector("#skillTreeCanvas"),
  skillTreeSummary: document.querySelector("#skillTreeSummary"),
  softSkillTreeSection: document.querySelector("#softSkillTreeSection"),
  softSkillTreeCanvas: document.querySelector("#softSkillTreeCanvas"),
  softSkillTreeSummary: document.querySelector("#softSkillTreeSummary"),
};

let activePopupGoalId = null;
let activePopupCriterionId = null;
let goalPopupAnchorRect = null;
let pendingCriterionFocus = null;
let pendingDeleteMemberId = null;
let pendingSkillUnlockId = null;
let roadmapPanState = null;
let skillTreePanState = null;
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
      activeView: WORKSPACE_VIEWS.includes(source?.ui?.activeView) ? source.ui.activeView : WORKSPACE_VIEW_TIMELINE,
      timelineZoom: TIMELINE_ZOOM_LEVELS.includes(source?.ui?.timelineZoom) ? source.ui.timelineZoom : TIMELINE_ZOOM_WEEK,
      roadmapZoom: normalizeRoadmapZoom(source?.ui?.roadmapZoom),
      skillTreeZoom: normalizeRoadmapZoom(source?.ui?.skillTreeZoom),
      softSkillTreeZoom: normalizeRoadmapZoom(source?.ui?.softSkillTreeZoom),
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
    password: normalizeUserPassword(member.password),
    skillUnlocks: normalizeSkillUnlocks(member.skillUnlocks),
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
      existing.skillUnlocks = normalizeSkillUnlocks(existing.skillUnlocks);
      return;
    }

    members.unshift({
      id: requiredUser.id || createId(requiredUser.name),
      name: requiredUser.name,
      role: requiredUser.role,
      level: requiredUser.level,
      managerId: requiredUser.managerId,
      password: requiredUser.password,
      skillUnlocks: {},
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

function normalizeUserPassword(value) {
  const password = String(value || "").trim();
  return password && !LEGACY_USER_PASSWORDS.has(password) ? password : DEFAULT_USER_PASSWORD;
}

function normalizeSkillUnlocks(value) {
  const skillIds = new Set(SKILL_TREES.flatMap((tree) => tree.nodes.map((node) => node.id)));
  if (!value || typeof value !== "object") return {};

  return Object.fromEntries(
    Object.entries(value).filter(([skillId, isUnlocked]) => skillIds.has(skillId) && isUnlocked === true),
  );
}

function normalizeRoadmapZoom(value) {
  return clamp(Number(value) || 1, ROADMAP_ZOOM_MIN, ROADMAP_ZOOM_MAX);
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
  renderSkillTrees();
  renderUserManagement();
  applyWorkspaceView();
  applySidebarState();
  applyTheme();
  applyAuthState();
  window.requestAnimationFrame(updateTimelineOverlayPosition);
  persistState();
}

function renderMemberSelect(activeMember) {
  const visibleMembers = getVisibleMembers();
  if (elements.memberCount) elements.memberCount.textContent = visibleMembers.length;
  if (!elements.memberSelect || !elements.memberSearchOptions) return;

  elements.memberSearchOptions.innerHTML = "";

  visibleMembers.forEach((member) => {
    const option = document.createElement("option");
    option.value = member.name;
    option.label = getMemberSubtitle(member);
    option.dataset.memberId = member.id;
    elements.memberSearchOptions.append(option);
  });

  elements.memberSelect.value = activeMember?.name ?? "";
  elements.memberSelect.disabled = visibleMembers.length === 0;
}

function renderMemberList(activeMember) {
  elements.memberList.innerHTML = "";
  const visibleMembers = getVisibleMembers();

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

    item.append(selectButton);
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
  axisGutter.innerHTML = `<span>ID</span><span>Obiettivo</span>`;
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

  activeMember.goals.forEach((goal, goalIndex) => {
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
    const idBadge = document.createElement("span");
    idBadge.className = "goal-id-badge";
    idBadge.textContent = String(goalIndex + 1).padStart(2, "0");
    idBadge.title = `ID roadmap ${idBadge.textContent}`;
    idBadge.setAttribute("aria-label", `ID roadmap ${idBadge.textContent}`);
    idBadge.style.setProperty("--roadmap-color", getRoadmapColor(goalIndex));

    const labelInput = document.createElement("input");
    labelInput.className = "goal-label-input";
    labelInput.type = "text";
    labelInput.value = goal.title || "Obiettivo";
    labelInput.setAttribute("aria-label", "Titolo obiettivo");
    labelInput.addEventListener("click", (event) => event.stopPropagation());
    labelInput.addEventListener("dragstart", (event) => event.preventDefault());
    labelInput.addEventListener("input", (event) => updateGoalTitle(goal.id, event.target.value));
    label.append(idBadge, labelInput);

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
  marker.dataset.goalId = goalId;
  marker.dataset.criterionId = criterion.id;
  marker.style.left = `${criterion.position}%`;
  marker.setAttribute("aria-label", `${criterion.label}, ${criteriaStatusLabels[criterion.status]}`);
  marker.innerHTML = `<img class="criterion-icon" src="${getCriterionIconUrl(criterion.status)}" alt="" aria-hidden="true" />`;
  marker.addEventListener("dragstart", (event) => {
    event.stopPropagation();
    startDrag(event, { kind: "move-criterion", goalId, criterionId: criterion.id });
  });
  marker.addEventListener("pointerenter", hideTimelineHoverLine);
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

function selectMemberFromSearch(value) {
  const query = normalizeUserName(value);
  if (!query) {
    renderMemberSelect(getActiveMember());
    return;
  }

  const visibleMembers = getVisibleMembers();
  const match =
    visibleMembers.find((member) => normalizeUserName(member.name) === query) ??
    visibleMembers.find((member) => normalizeUserName(member.name).includes(query));

  if (!match) {
    renderMemberSelect(getActiveMember());
    return;
  }

  selectMember(match.id);
}

function requestRemoveMember(memberId) {
  const currentUser = getCurrentUser();
  const member = state.members.find((item) => item.id === memberId);
  if (!member || !currentUser || member.id === currentUser.id || !canManageMember(currentUser, member)) return;

  pendingDeleteMemberId = memberId;
  pendingSkillUnlockId = null;
  elements.confirmTitle.textContent = "Conferma eliminazione";
  elements.confirmMessage.textContent = `Eliminare ${member.name} e tutti i suoi obiettivi?`;
  elements.confirmDelete.textContent = "Elimina";
  elements.confirmDelete.className = "danger-action";
  elements.confirmDialog.hidden = false;
  elements.cancelConfirm.focus();
}

function closeConfirmDialog() {
  elements.confirmDialog.hidden = true;
  pendingDeleteMemberId = null;
  pendingSkillUnlockId = null;
}

function confirmRemoveMember() {
  if (pendingSkillUnlockId) {
    const skillId = pendingSkillUnlockId;
    pendingSkillUnlockId = null;
    elements.confirmDialog.hidden = true;
    unlockSkillForActiveMember(skillId);
    return;
  }

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
  const { labelWidth, trackWidth } = getTimelineTrackMetrics();
  const weekWidth = trackWidth / timelineUnits.length;
  const visibleTrackWidth = Math.max(0, elements.timelineFrame.clientWidth - labelWidth);
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

function showSkillTreeView() {
  state.ui.activeView = WORKSPACE_VIEW_SKILL_TREE;
  applyWorkspaceView();
  persistState();
  elements.skillTreeCanvas.focus({ preventScroll: true });
  window.requestAnimationFrame(() => centerSkillTreeStart(elements.skillTreeCanvas));
}

function showSoftSkillTreeView() {
  state.ui.activeView = WORKSPACE_VIEW_SOFT_SKILL_TREE;
  applyWorkspaceView();
  persistState();
  elements.softSkillTreeCanvas.focus({ preventScroll: true });
  window.requestAnimationFrame(() => centerSkillTreeStart(elements.softSkillTreeCanvas));
}

function goToTimelineTarget(goalId, criterionId = null) {
  if (!findGoal(goalId)) return;

  state.ui.activeView = WORKSPACE_VIEW_TIMELINE;
  applyWorkspaceView();
  renderTimeline(getActiveMember());
  persistState();

  window.requestAnimationFrame(() => revealTimelineTarget(goalId, criterionId));
}

function revealTimelineTarget(goalId, criterionId = null) {
  const row = [...elements.planGrid.querySelectorAll(".goal-row")].find((item) => item.dataset.goalId === goalId);
  if (!row) return;

  const target = criterionId
    ? [...row.querySelectorAll(".criterion-circle")].find((item) => item.dataset.criterionId === criterionId)
    : row;
  if (!target) return;

  const frameRect = elements.timelineFrame.getBoundingClientRect();
  const targetRect = target.getBoundingClientRect();
  const nextScrollLeft =
    elements.timelineFrame.scrollLeft +
    targetRect.left +
    targetRect.width / 2 -
    (frameRect.left + elements.timelineFrame.clientWidth / 2);
  const nextScrollTop =
    elements.timelineFrame.scrollTop +
    row.getBoundingClientRect().top +
    row.offsetHeight / 2 -
    (frameRect.top + elements.timelineFrame.clientHeight / 2);

  elements.timelineFrame.scrollTo({
    left: Math.max(0, nextScrollLeft),
    top: Math.max(0, nextScrollTop),
    behavior: "smooth",
  });

  target.classList.add("is-jump-highlight");
  window.setTimeout(() => target.classList.remove("is-jump-highlight"), 1200);
}

function applyWorkspaceView() {
  const isRoadmap = state.ui.activeView === WORKSPACE_VIEW_ROADMAP;
  const isSkillTree = state.ui.activeView === WORKSPACE_VIEW_SKILL_TREE;
  const isSoftSkillTree = state.ui.activeView === WORKSPACE_VIEW_SOFT_SKILL_TREE;
  const isTimeline = state.ui.activeView === WORKSPACE_VIEW_TIMELINE;
  elements.workspace.classList.toggle("is-roadmap-view", isRoadmap);
  elements.workspace.classList.toggle("is-skilltree-view", isSkillTree);
  elements.workspace.classList.toggle("is-soft-skilltree-view", isSoftSkillTree);
  elements.workspace.classList.toggle("is-timeline-view", isTimeline);
  elements.goCurrentWeek.classList.toggle("active", isTimeline);
  elements.goRoadmap.classList.toggle("active", isRoadmap);
  elements.goSkillTree.classList.toggle("active", isSkillTree);
  elements.goSoftSkillTree.classList.toggle("active", isSoftSkillTree);
  elements.goRoadmap.setAttribute("aria-pressed", String(isRoadmap));
  elements.goCurrentWeek.setAttribute("aria-pressed", String(isTimeline));
  elements.goSkillTree.setAttribute("aria-pressed", String(isSkillTree));
  elements.goSoftSkillTree.setAttribute("aria-pressed", String(isSoftSkillTree));
}

function toggleTheme() {
  state.ui.theme = state.ui.theme === THEME_LIGHT ? THEME_DARK : THEME_LIGHT;
  applyTheme();
  persistState();
}

function applyTheme() {
  const isLight = state.ui.theme === THEME_LIGHT;
  document.documentElement.dataset.theme = isLight ? THEME_LIGHT : THEME_DARK;
  elements.toggleTheme.title = isLight ? "Passa al tema scuro" : "Passa al tema chiaro";
  elements.toggleTheme.setAttribute("aria-label", elements.toggleTheme.title);
  elements.toggleTheme.setAttribute("aria-pressed", String(isLight));
  elements.themeIcon.src = isLight ? "dark theme.png" : "light theme.png";
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
  const password = elements.loginPassword.value.trim();
  const member = findLoginMember(name);

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

function findLoginMember(name) {
  const normalizedName = normalizeUserName(name);
  if (!normalizedName) return null;

  return (
    state.members.find((member) => normalizeUserName(member.name) === normalizedName) ||
    state.members.find((member) => normalizeUserName(member.name).startsWith(normalizedName)) ||
    null
  );
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
  elements.roadmapCanvas.scrollTop = Math.max(0, elements.roadmapCanvas.scrollHeight - elements.roadmapCanvas.clientHeight);
  elements.roadmapCanvas.scrollLeft = Math.max(0, (elements.roadmapCanvas.scrollWidth - elements.roadmapCanvas.clientWidth) / 2);
}

function renderRoadmap(activeMember, options = {}) {
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
  const roadmapZoom = normalizeRoadmapZoom(state.ui.roadmapZoom);
  const width = Math.max(1500, 420 + goals.length * 220, 720 + maxCriteria * 92);
  const height = Math.max(820, 650 + maxCriteria * 34, 620 + goals.length * 28);
  const rootX = Math.round(width / 2);
  const rootY = height - 58;
  const minBranchLength = Math.min(300, height - 320);
  const maxBranchLength = Math.max(minBranchLength + 140, height - 300);

  const map = document.createElement("div");
  map.className = "roadmap-map";
  map.style.width = `${Math.round(width * roadmapZoom)}px`;
  map.style.height = `${Math.round(height * roadmapZoom)}px`;

  const surface = document.createElement("div");
  surface.className = "roadmap-surface";
  surface.style.width = `${width}px`;
  surface.style.height = `${height}px`;
  surface.style.transform = `scale(${roadmapZoom})`;

  const svg = document.createElementNS(SVG_NS, "svg");
  svg.classList.add("roadmap-lines");
  svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
  svg.setAttribute("aria-hidden", "true");

  goals.forEach((goal, goalIndex) => {
    const startX = getRoadmapStartX(goalIndex, goals.length, rootX);
    const branch = getRoadmapBranchShape(goal, goalIndex, goals.length, startX, rootY, minBranchLength, maxBranchLength);
    const color = getRoadmapColor(goalIndex);
    const progressRatio = getRoadmapProgressRatio(goal);
    const fullPath = getRoadmapBranchPath(branch);
    const forkPath = getRoadmapForkPath(branch);
    const verticalPath = getRoadmapVerticalPath(branch);
    const progressPath = getRoadmapProgressPath(branch, progressRatio);

    appendRoadmapPath(svg, fullPath, ROADMAP_BLOCKED_COLOR, "roadmap-branch-shadow");
    appendRoadmapPath(svg, verticalPath, ROADMAP_BLOCKED_COLOR, "roadmap-branch-muted");
    appendRoadmapPath(svg, forkPath, color, "roadmap-branch-fork");
    if (progressRatio > 0) {
      appendRoadmapPath(svg, progressPath, color, "roadmap-branch-path");
    }
  });

  surface.append(svg);

  goals.forEach((goal, goalIndex) => {
    const startX = getRoadmapStartX(goalIndex, goals.length, rootX);
    const branch = getRoadmapBranchShape(goal, goalIndex, goals.length, startX, rootY, minBranchLength, maxBranchLength);
    const color = getRoadmapColor(goalIndex);
    const criteria = [...goal.criteria].sort((first, second) => first.position - second.position);

    criteria.forEach((criterion) => {
      const timeRatio = clamp(Number(criterion.position) / 100, 0, 1);
      const point = getRoadmapBranchPoint(branch, timeRatio);
      const criterionColor = criterion.position <= goal.progress && criterion.status === "unlocked" ? color : ROADMAP_BLOCKED_COLOR;
      appendRoadmapCriterion(surface, goal, criterion, point.x, point.y, criterionColor);
    });

    appendRoadmapGoal(surface, goal, goalIndex, branch.endX, branch.endY, color);
  });

  map.append(surface);
  elements.roadmapCanvas.append(map);
  if (state.ui.activeView === WORKSPACE_VIEW_ROADMAP && options.center !== false) {
    centerRoadmapStart();
  }
}

function centerSkillTreeStart(canvas = elements.skillTreeCanvas) {
  canvas.scrollTop = Math.max(0, (canvas.scrollHeight - canvas.clientHeight) / 2);
  canvas.scrollLeft = Math.max(0, (canvas.scrollWidth - canvas.clientWidth) / 2);
}

function renderSkillTrees(options = {}) {
  renderSkillTree(SKILL_TREE, elements.skillTreeCanvas, elements.skillTreeSummary, options);
  renderSkillTree(SOFT_SKILL_TREE, elements.softSkillTreeCanvas, elements.softSkillTreeSummary, options);
}

function renderSkillTree(tree, canvas, summary, options = {}) {
  canvas.innerHTML = "";
  const activeMember = getActiveMember();
  const currentUser = getCurrentUser();
  const progress = getSkillTreeProgress(activeMember, tree);
  summary.textContent = `${progress.unlocked}/${progress.total} skill sbloccate`;

  const { height, nodeById, nodes, width } = getSkillTreeLayout(tree.nodes);
  const skillTreeZoom = normalizeRoadmapZoom(state.ui[tree.zoomKey]);

  const map = document.createElement("div");
  map.className = `roadmap-map skill-tree-map skill-tree-map-${tree.id}`;
  map.style.width = `${Math.round(width * skillTreeZoom)}px`;
  map.style.height = `${Math.round(height * skillTreeZoom)}px`;

  const surface = document.createElement("div");
  surface.className = `roadmap-surface skill-tree-surface skill-tree-surface-${tree.id}`;
  surface.style.width = `${width}px`;
  surface.style.height = `${height}px`;
  surface.style.transform = `scale(${skillTreeZoom})`;

  const svg = document.createElementNS(SVG_NS, "svg");
  svg.classList.add("roadmap-lines", "skill-tree-lines");
  svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
  svg.setAttribute("aria-hidden", "true");

  nodes.forEach((node) => {
    const parent = nodeById.get(node.parent);
    if (!parent) return;
    const isUnlocked = isSkillUnlockedForMember(node, activeMember, tree) && isSkillUnlockedForMember(parent, activeMember, tree);
    appendSkillTreeLink(svg, parent, node, "skill-tree-link-shadow", isUnlocked);
    appendSkillTreeLink(svg, parent, node, "skill-tree-link", isUnlocked);
  });

  surface.append(svg);
  nodes.forEach((node) => appendSkillTreeNode(surface, node, tree, activeMember, currentUser));
  map.append(surface);
  canvas.append(map);

  if (state.ui.activeView === tree.view && options.center !== false) {
    centerSkillTreeStart(canvas);
  }
}

function getSkillTreeLayout(sourceNodes) {
  const baseRadius = 250;
  const ringGap = 255;
  const outerMargin = 340;
  const firstBranchAngle = -Math.PI / 2;
  const nodeById = new Map(sourceNodes.map((node) => [node.id, { ...node }]));
  const childrenByParent = new Map();
  const roots = [];
  let maxDepth = 0;

  sourceNodes.forEach((node) => {
    if (!node.parent || !nodeById.has(node.parent)) {
      roots.push(node.id);
      return;
    }

    if (!childrenByParent.has(node.parent)) childrenByParent.set(node.parent, []);
    childrenByParent.get(node.parent).push(node.id);
  });

  function setDepth(nodeId, depth) {
    const node = nodeById.get(nodeId);
    const childIds = childrenByParent.get(nodeId) || [];
    maxDepth = Math.max(maxDepth, depth);
    node.depth = depth;
    childIds.forEach((childId) => setDepth(childId, depth + 1));
  }

  function placeBranch(nodeId, angle, span) {
    const node = nodeById.get(nodeId);
    const childIds = childrenByParent.get(nodeId) || [];
    node.angle = angle;

    if (!childIds.length) return;

    const localSpan = Math.min(span, Math.PI / (node.depth <= 1 ? 1.35 : 1.8));
    const step = localSpan / childIds.length;
    childIds.forEach((childId, index) => {
      const childAngle = angle - localSpan / 2 + step * (index + 0.5);
      placeBranch(childId, childAngle, Math.min(step * 0.9, Math.PI / 3));
    });
  }

  roots.forEach((rootId) => setDepth(rootId, 0));
  roots.forEach((rootId) => {
    const root = nodeById.get(rootId);
    const childIds = childrenByParent.get(rootId) || [];
    root.angle = 0;

    if (!childIds.length) return;

    const step = (Math.PI * 2) / childIds.length;
    childIds.forEach((childId, index) => {
      const branchAngle = firstBranchAngle + step * index;
      placeBranch(childId, branchAngle, step * 0.9);
    });
  });

  const outerRadius = baseRadius + Math.max(0, maxDepth - 1) * ringGap;
  const width = Math.max(1900, outerRadius * 2 + outerMargin * 2);
  const height = Math.max(1700, outerRadius * 2 + outerMargin * 2);
  const centerX = width / 2;
  const centerY = height / 2;
  nodeById.forEach((node) => {
    const radius = node.depth <= 0 ? 0 : baseRadius + (node.depth - 1) * ringGap;
    node.x = centerX + Math.cos(node.angle || 0) * radius;
    node.y = centerY + Math.sin(node.angle || 0) * radius;
  });

  return {
    height,
    nodeById,
    nodes: sourceNodes.map((node) => nodeById.get(node.id)),
    width,
  };
}

function getAverageAngle(angles) {
  if (!angles.length) return 0;

  const vector = angles.reduce(
    (accumulator, angle) => ({
      x: accumulator.x + Math.cos(angle),
      y: accumulator.y + Math.sin(angle),
    }),
    { x: 0, y: 0 },
  );

  return Math.atan2(vector.y, vector.x);
}

function appendSkillTreeLink(svg, parent, node, className, isUnlocked) {
  const link = document.createElementNS(SVG_NS, "path");
  link.setAttribute("d", `M ${parent.x} ${parent.y} L ${node.x} ${node.y}`);
  link.setAttribute("stroke", isUnlocked ? node.color : ROADMAP_BLOCKED_COLOR);
  link.classList.add(className);
  if (!isUnlocked) link.classList.add("is-locked");
  svg.append(link);
}

function appendSkillTreeNode(map, nodeData, tree, activeMember, currentUser) {
  const isUnlocked = isSkillUnlockedForMember(nodeData, activeMember, tree);
  const isUnlockable =
    !isUnlocked && canUnlockSkillForMember(activeMember, currentUser) && isUnlockableSkillNode(nodeData, tree);
  const node = document.createElement("button");
  node.className = [
    "skill-tree-node",
    nodeData.parent ? "" : "is-root",
    nodeData.parent === tree.rootId ? "is-branch" : "",
    isUnlocked ? "is-unlocked" : "is-locked",
    isUnlockable ? "is-unlockable" : "",
  ]
    .filter(Boolean)
    .join(" ");
  node.type = "button";
  node.style.left = `${nodeData.x}px`;
  node.style.top = `${nodeData.y}px`;
  node.style.setProperty("--skill-color", nodeData.color);
  node.dataset.skillId = nodeData.id;
  node.setAttribute("aria-label", getSkillAriaLabel(nodeData, isUnlocked, isUnlockable));
  node.setAttribute("aria-disabled", String(!isUnlockable));
  node.addEventListener("pointerenter", () => node.classList.add("is-hovered"));
  node.addEventListener("pointerleave", () => node.classList.remove("is-hovered"));
  node.addEventListener("mouseenter", () => node.classList.add("is-hovered"));
  node.addEventListener("mouseleave", () => node.classList.remove("is-hovered"));
  node.addEventListener("focus", () => node.classList.add("is-hovered"));
  node.addEventListener("blur", () => node.classList.remove("is-hovered"));
  node.addEventListener("click", (event) => {
    event.stopPropagation();
    requestSkillUnlockForActiveMember(nodeData.id);
  });

  const orb = document.createElement("span");
  orb.className = "skill-tree-orb";
  const icon = document.createElement("span");
  icon.className = "skill-tree-icon";
  icon.innerHTML = getSkillIconMarkup(nodeData);
  const card = document.createElement("span");
  card.className = "skill-tree-hover-card";
  card.setAttribute("aria-hidden", "true");
  card.innerHTML = `
    <strong>${escapeHtml(nodeData.label)}</strong>
    <span>${escapeHtml(nodeData.description || "Skill permanente acquisita.")}</span>
  `;

  orb.append(icon);
  node.append(card);
  node.append(orb);
  map.append(node);
}

function getSkillTreeProgress(member, tree) {
  const skillNodes = tree.nodes.filter((node) => isUnlockableSkillNode(node, tree));
  if (!member) return { total: skillNodes.length, unlocked: 0 };

  return {
    total: skillNodes.length,
    unlocked: skillNodes.filter((node) => isSkillUnlockedForMember(node, member, tree)).length,
  };
}

function isUnlockableSkillNode(node, tree = getSkillTreeForNode(node?.id)) {
  return Boolean(node?.parent && node.parent !== tree?.rootId);
}

function isSkillUnlockedForMember(node, member, tree = getSkillTreeForNode(node?.id)) {
  if (!node) return false;
  if (!isUnlockableSkillNode(node, tree)) return true;
  return Boolean(member?.skillUnlocks?.[node.id]);
}

function getSkillTreeForNode(skillId) {
  return SKILL_TREES.find((tree) => tree.nodes.some((node) => node.id === skillId)) || null;
}

function findSkillNode(skillId) {
  const tree = getSkillTreeForNode(skillId);
  return {
    node: tree?.nodes.find((item) => item.id === skillId) || null,
    tree,
  };
}

function canUnlockSkillForMember(member, currentUser = getCurrentUser()) {
  return Boolean(currentUser && member && currentUser.id !== member.id && canManageMember(currentUser, member));
}

function getSkillAriaLabel(node, isUnlocked, isUnlockable) {
  const action = isUnlockable ? " Clicca per sbloccare." : "";
  return `${node.label}: ${node.description || "Skill permanente"}. ${
    isUnlocked ? "Sbloccata." : "Bloccata."
  }${action}`;
}

function getSkillIconMarkup(node) {
  const iconName = SKILL_ICON_BY_ID[node.id] || "skill";
  return SKILL_ICON_SVG[iconName] || SKILL_ICON_SVG.skill;
}

function requestSkillUnlockForActiveMember(skillId) {
  const activeMember = getActiveMember();
  const currentUser = getCurrentUser();
  const { node, tree } = findSkillNode(skillId);
  if (!node || !activeMember || !isUnlockableSkillNode(node, tree) || isSkillUnlockedForMember(node, activeMember, tree)) {
    return;
  }
  if (!canUnlockSkillForMember(activeMember, currentUser)) return;

  pendingSkillUnlockId = skillId;
  pendingDeleteMemberId = null;
  elements.confirmTitle.textContent = "Conferma sblocco skill";
  elements.confirmMessage.textContent = `Sbloccare "${node.label}" per ${activeMember.name}? La skill rimarra permanente nel suo skill tree.`;
  elements.confirmDelete.textContent = "Sblocca";
  elements.confirmDelete.className = "primary-action confirm-primary-action";
  elements.confirmDialog.hidden = false;
  elements.cancelConfirm.focus();
}

function unlockSkillForActiveMember(skillId) {
  const activeMember = getActiveMember();
  const currentUser = getCurrentUser();
  const { node, tree } = findSkillNode(skillId);
  if (!node || !activeMember || !isUnlockableSkillNode(node, tree) || isSkillUnlockedForMember(node, activeMember, tree)) {
    return;
  }
  if (!canUnlockSkillForMember(activeMember, currentUser)) return;

  activeMember.skillUnlocks = normalizeSkillUnlocks(activeMember.skillUnlocks);
  activeMember.skillUnlocks[skillId] = true;
  renderSkillTrees({ center: false });
  persistState();
}

function getRoadmapColor(index) {
  return ROADMAP_COLORS[index] || `hsl(${(index * 47 + 18) % 360} 88% 58%)`;
}

function getRoadmapStartX(index, totalGoals, rootX) {
  const branchDistance = getRoadmapBranchDistance(totalGoals);
  return Math.round(rootX + (index - (totalGoals - 1) / 2) * branchDistance);
}

function getRoadmapBranchShape(goal, index, totalGoals, startX, rootY, minBranchLength, maxBranchLength) {
  const branchLength = getRoadmapBranchLength(goal, minBranchLength, maxBranchLength);
  const radians = (getRoadmapBranchAngle(index, totalGoals) * Math.PI) / 180;
  const firstStemLength = 44;
  const stemStartY = rootY - 142;
  const forkRise = Math.max(1, (rootY + 28 - firstStemLength) - stemStartY);
  const laneOffset = Math.sin(radians) * forkRise * 1.7;
  const laneX = Math.round(startX + laneOffset);
  const visualStartY = rootY + 28;
  const forkY = visualStartY - firstStemLength;

  return {
    startX,
    startY: visualStartY,
    forkX: startX,
    forkY,
    bendX: laneX,
    bendY: stemStartY,
    endX: laneX,
    endY: Math.round(stemStartY - branchLength),
  };
}

function getRoadmapBranchLength(goal, minBranchLength, maxBranchLength) {
  const deadlineRatio = clamp(getGoalEndGridLine(goal) / state.timelineWeeks, 0, 1);
  const branchLength = minBranchLength + deadlineRatio * (maxBranchLength - minBranchLength);
  return Math.round(branchLength);
}

function getRoadmapBranchAngle(index, totalGoals) {
  if (totalGoals <= 1) return 0;

  return (index - (totalGoals - 1) / 2) * getRoadmapBranchDistance(totalGoals);
}

function getRoadmapBranchDistance(totalGoals) {
  return 180 / Math.max(1, totalGoals);
}

function getRoadmapProgressRatio(goal) {
  return clamp(Number(goal.progress) / 100, 0, 1);
}

function getRoadmapBranchPath(branch) {
  return `M ${branch.startX} ${branch.startY} L ${branch.forkX} ${branch.forkY} L ${branch.bendX} ${branch.bendY} L ${branch.endX} ${branch.endY}`;
}

function getRoadmapForkPath(branch) {
  return `M ${branch.startX} ${branch.startY} L ${branch.forkX} ${branch.forkY} L ${branch.bendX} ${branch.bendY}`;
}

function getRoadmapVerticalPath(branch) {
  return `M ${branch.bendX} ${branch.bendY} L ${branch.endX} ${branch.endY}`;
}

function getRoadmapProgressPath(branch, ratio) {
  const point = getRoadmapBranchPoint(branch, ratio);
  return `M ${branch.bendX} ${branch.bendY} L ${point.x} ${point.y}`;
}

function getRoadmapBranchPoint(branch, ratio) {
  const clampedRatio = clamp(ratio, 0, 1);
  return interpolatePoint(branch.bendX, branch.bendY, branch.endX, branch.endY, clampedRatio);
}

function interpolatePoint(startX, startY, endX, endY, ratio) {
  return {
    x: startX + (endX - startX) * ratio,
    y: startY + (endY - startY) * ratio,
  };
}

function appendRoadmapPath(svg, path, color, className) {
  const branch = document.createElementNS(SVG_NS, "path");
  branch.setAttribute("d", path);
  branch.setAttribute("stroke", color);
  branch.classList.add(className);
  svg.append(branch);
}

function appendRoadmapCriterion(map, goal, criterion, x, y, color) {
  const node = document.createElement("button");
  node.className = `roadmap-criterion-node${criterion.status === "unlocked" ? " is-unlocked" : ""}`;
  node.type = "button";
  node.style.left = `${x}px`;
  node.style.top = `${y}px`;
  node.style.setProperty("--branch-color", color);
  node.dataset.goalId = goal.id;
  node.dataset.criterionId = criterion.id;
  node.dataset.tooltip = criterion.label || "Criterio di avanzamento";
  node.title = criterion.label || "Criterio di avanzamento";

  const orb = document.createElement("span");
  orb.className = "roadmap-node-orb";

  const icon = document.createElement("img");
  icon.src = getCriterionIconUrl(criterion.status);
  icon.alt = "";
  icon.setAttribute("aria-hidden", "true");

  node.setAttribute("aria-label", criterion.label || "Criterio di avanzamento");
  node.addEventListener("pointerdown", stopRoadmapNodeEvent);
  node.addEventListener("click", (event) => {
    event.stopPropagation();
    goToTimelineTarget(goal.id, criterion.id);
  });
  orb.append(icon);
  node.append(orb);
  map.append(node);
}

function appendRoadmapGoal(map, goal, goalIndex, x, y, color) {
  const node = document.createElement("button");
  node.className = "roadmap-goal-node";
  node.type = "button";
  node.style.left = `${x}px`;
  node.style.top = `${y}px`;
  node.style.setProperty("--branch-color", color);
  node.dataset.goalId = goal.id;
  node.dataset.tooltip = goal.title || "Obiettivo";
  node.title = goal.title || "Obiettivo";

  const orb = document.createElement("span");
  orb.className = "roadmap-goal-orb";
  orb.textContent = String(goalIndex + 1).padStart(2, "0");

  node.setAttribute("aria-label", goal.title || "Obiettivo");
  node.addEventListener("pointerdown", stopRoadmapNodeEvent);
  node.addEventListener("click", (event) => {
    event.stopPropagation();
    goToTimelineTarget(goal.id);
  });
  node.append(orb);
  map.append(node);
}

function stopRoadmapNodeEvent(event) {
  event.stopPropagation();
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
  if (event.target.closest(".criterion-circle")) {
    hideTimelineHoverLine();
    return;
  }

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
  if (event.target.closest(".roadmap-criterion-node, .roadmap-goal-node")) return;

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

function handleRoadmapWheel(event) {
  if (state.ui.activeView !== WORKSPACE_VIEW_ROADMAP) return;

  event.preventDefault();
  const currentZoom = normalizeRoadmapZoom(state.ui.roadmapZoom);
  const nextZoom = normalizeRoadmapZoom(
    currentZoom * (event.deltaY < 0 ? ROADMAP_ZOOM_STEP : 1 / ROADMAP_ZOOM_STEP),
  );
  if (nextZoom === currentZoom) return;

  const rect = elements.roadmapCanvas.getBoundingClientRect();
  const pointerX = event.clientX - rect.left;
  const pointerY = event.clientY - rect.top;
  const contentX = elements.roadmapCanvas.scrollLeft + pointerX;
  const contentY = elements.roadmapCanvas.scrollTop + pointerY;
  const zoomRatio = nextZoom / currentZoom;

  state.ui.roadmapZoom = Number(nextZoom.toFixed(3));
  renderRoadmap(getActiveMember(), { center: false });
  persistState();

  window.requestAnimationFrame(() => {
    elements.roadmapCanvas.scrollLeft = contentX * zoomRatio - pointerX;
    elements.roadmapCanvas.scrollTop = contentY * zoomRatio - pointerY;
  });
}

function handleSkillTreePointerDown(event) {
  if (event.button !== 0) return;
  if (event.target.closest(".skill-tree-node")) return;

  const canvas = event.currentTarget;
  skillTreePanState = {
    canvas,
    pointerId: event.pointerId,
    startX: event.clientX,
    startY: event.clientY,
    scrollLeft: canvas.scrollLeft,
    scrollTop: canvas.scrollTop,
  };
  canvas.classList.add("is-panning");
  canvas.setPointerCapture(event.pointerId);
  event.preventDefault();
}

function handleSkillTreePointerMove(event) {
  if (!skillTreePanState || skillTreePanState.pointerId !== event.pointerId) return;

  skillTreePanState.canvas.scrollLeft = skillTreePanState.scrollLeft - (event.clientX - skillTreePanState.startX);
  skillTreePanState.canvas.scrollTop = skillTreePanState.scrollTop - (event.clientY - skillTreePanState.startY);
}

function endSkillTreePan(event) {
  if (!skillTreePanState || skillTreePanState.pointerId !== event.pointerId) return;

  const canvas = skillTreePanState.canvas;
  if (canvas.hasPointerCapture(event.pointerId)) {
    canvas.releasePointerCapture(event.pointerId);
  }
  skillTreePanState = null;
  canvas.classList.remove("is-panning");
}

function handleSkillTreeWheel(event) {
  const canvas = event.currentTarget;
  const tree = getSkillTreeForCanvas(canvas);
  if (!tree || state.ui.activeView !== tree.view) return;

  event.preventDefault();
  const currentZoom = normalizeRoadmapZoom(state.ui[tree.zoomKey]);
  const nextZoom = normalizeRoadmapZoom(
    currentZoom * (event.deltaY < 0 ? ROADMAP_ZOOM_STEP : 1 / ROADMAP_ZOOM_STEP),
  );
  if (nextZoom === currentZoom) return;

  const rect = canvas.getBoundingClientRect();
  const pointerX = event.clientX - rect.left;
  const pointerY = event.clientY - rect.top;
  const contentX = canvas.scrollLeft + pointerX;
  const contentY = canvas.scrollTop + pointerY;
  const zoomRatio = nextZoom / currentZoom;

  state.ui[tree.zoomKey] = Number(nextZoom.toFixed(3));
  renderSkillTrees({ center: false });
  persistState();

  window.requestAnimationFrame(() => {
    canvas.scrollLeft = contentX * zoomRatio - pointerX;
    canvas.scrollTop = contentY * zoomRatio - pointerY;
  });
}

function getSkillTreeForCanvas(canvas) {
  if (canvas === elements.skillTreeCanvas) return SKILL_TREE;
  if (canvas === elements.softSkillTreeCanvas) return SOFT_SKILL_TREE;
  return null;
}

function getDropMeta(event) {
  return getTimelinePointerMeta(event);
}

function getTimelinePointerMeta(event) {
  const activeMember = getActiveMember();
  if (!activeMember) return null;

  const frameRect = elements.timelineFrame.getBoundingClientRect();
  const planRect = elements.planGrid.getBoundingClientRect();
  const { labelWidth, timelineUnits, trackWidth } = getTimelineTrackMetrics();
  if (!timelineUnits.length) return null;
  const contentX = event.clientX - frameRect.left + elements.timelineFrame.scrollLeft;
  const unitMeta = getTimelineUnitLineMeta(contentX, timelineUnits, labelWidth, trackWidth);
  const unitLine = unitMeta.unitLine;
  const gridLinePrecise = getGridLineFromTimelineUnitLine(unitLine);
  const gridLine = clamp(Math.round(gridLinePrecise), 0, state.timelineWeeks);
  const contentLineLeft = unitMeta.contentLineLeft;
  const screenLineLeft = contentLineLeft - elements.timelineFrame.scrollLeft;
  const rowY = event.clientY - planRect.top;
  const rowIndex = Math.floor(rowY / ROW_HEIGHT);

  if (screenLineLeft < labelWidth || screenLineLeft > elements.timelineFrame.clientWidth) return null;

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
  const labelWidth = getTimelineLabelWidth();
  const contentWidth = Math.max(elements.timeAxis.scrollWidth, elements.planGrid.scrollWidth);
  const trackWidth = Math.max(MIN_WEEK_WIDTH, contentWidth - labelWidth);

  return { labelWidth, timelineUnits, trackWidth };
}

function getTimelineUnitLineMeta(contentX, timelineUnits, labelWidth, trackWidth) {
  const markers = [...elements.timeAxis.querySelectorAll(".time-marker")];

  if (markers.length === timelineUnits.length) {
    const boundaries = markers.map((marker) => marker.offsetLeft);
    const lastMarker = markers[markers.length - 1];
    boundaries.push(lastMarker.offsetLeft + lastMarker.offsetWidth);

    let unitLine = 0;
    let closestDistance = Infinity;
    boundaries.forEach((boundary, index) => {
      const distance = Math.abs(contentX - boundary);
      if (distance < closestDistance) {
        closestDistance = distance;
        unitLine = index;
      }
    });

    return {
      contentLineLeft: boundaries[unitLine],
      unitLine: clamp(unitLine, 0, timelineUnits.length),
    };
  }

  const trackX = clamp(contentX - labelWidth, 0, trackWidth);
  const unitWidth = trackWidth / timelineUnits.length;
  const unitLine = clamp(Math.round(trackX / unitWidth), 0, timelineUnits.length);

  return {
    contentLineLeft: labelWidth + unitLine * unitWidth,
    unitLine,
  };
}

function getTimelineLabelWidth() {
  return elements.timeAxis.querySelector(".axis-gutter")?.offsetWidth || LABEL_WIDTH;
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

if (elements.memberSelect) {
  elements.memberSelect.addEventListener("change", (event) => {
    selectMemberFromSearch(event.target.value);
  });
  elements.memberSelect.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      selectMemberFromSearch(event.target.value);
    }
  });
}

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
elements.openUserManagement?.addEventListener("click", openUserManagement);
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
elements.goSkillTree.addEventListener("click", showSkillTreeView);
elements.goSoftSkillTree.addEventListener("click", showSoftSkillTreeView);
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
elements.roadmapCanvas.addEventListener("wheel", handleRoadmapWheel, { passive: false });
elements.skillTreeCanvas.addEventListener("pointerdown", handleSkillTreePointerDown);
elements.skillTreeCanvas.addEventListener("pointermove", handleSkillTreePointerMove);
elements.skillTreeCanvas.addEventListener("pointerup", endSkillTreePan);
elements.skillTreeCanvas.addEventListener("pointercancel", endSkillTreePan);
elements.skillTreeCanvas.addEventListener("wheel", handleSkillTreeWheel, { passive: false });
elements.softSkillTreeCanvas.addEventListener("pointerdown", handleSkillTreePointerDown);
elements.softSkillTreeCanvas.addEventListener("pointermove", handleSkillTreePointerMove);
elements.softSkillTreeCanvas.addEventListener("pointerup", endSkillTreePan);
elements.softSkillTreeCanvas.addEventListener("pointercancel", endSkillTreePan);
elements.softSkillTreeCanvas.addEventListener("wheel", handleSkillTreeWheel, { passive: false });

render();
initializeCloudSync();
