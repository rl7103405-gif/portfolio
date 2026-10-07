// Textos del portafolio en español (por defecto) e inglés.
// Regla: ninguna liga pública a una app con datos reales. Solo páginas públicas.

export const UI = {
  es: {
    skip: 'Saltar al contenido',
    langBtn: 'EN',
    langLabel: 'Ver en inglés',
    sound: 'Sonido',
    heroKicker: 'Portafolio · 2026',
    heroTitle: 'Hola, soy <b>Roberto</b>.<br>Construyo herramientas <em>reales</em> con IA.',
    heroSub: 'Apps que usan un rancho, una fábrica y mi familia todos los días. Toca una tecla para explorar.',
    heroHint: 'Toca una tecla · o usa el teclado cuando esté enfocado',
    lcdIdle: '> HOLA, SOY ROBERTO_',
    navLabel: 'Secciones del portafolio',
    toTop: 'Volver al teclado',
    deviceLabel: 'Teclado interactivo: cada tecla abre una sección',
    open: 'Ver en vivo',
    play: 'Jugarlo',
    repo: 'Código de este portafolio',
    private: 'Privada: tiene datos reales. Demo en video, pronto.',
    status: { prod: 'En producción', done: 'Entregado', wip: 'En progreso', lab: 'Experimento', internal: 'Interna' },
    used: 'Quién la usa',
    built: 'Qué hice',
    cvBtn: 'Descargar CV (PDF, inglés)',
    contactTitle: '¿Hablamos?',
    contactSub: 'Para proyectos, prácticas o un trabajo en Sydney en 2027.',
    footer: 'Hecho por Roberto Linares con Claude Code. Sin plantillas.',
  },
  en: {
    skip: 'Skip to content',
    langBtn: 'ES',
    langLabel: 'Ver en español',
    sound: 'Sound',
    heroKicker: 'Portfolio · 2026',
    heroTitle: 'Hi, I\'m <b>Roberto</b>.<br>I build <em>real</em> tools with AI.',
    heroSub: 'Apps that a ranch, a factory and my family use every day. Press a key to explore.',
    heroHint: 'Press a key · or use your keyboard when it is focused',
    lcdIdle: '> HI, I\'M ROBERTO_',
    navLabel: 'Portfolio sections',
    toTop: 'Back to the keypad',
    deviceLabel: 'Interactive keypad: each key opens a section',
    open: 'See it live',
    play: 'Play it',
    repo: 'This portfolio\'s code',
    private: 'Private: it holds real data. Video demo coming soon.',
    status: { prod: 'In production', done: 'Delivered', wip: 'In progress', lab: 'Experiment', internal: 'Internal' },
    used: 'Who uses it',
    built: 'What I did',
    cvBtn: 'Download CV (PDF)',
    contactTitle: 'Let\'s talk',
    contactSub: 'For projects, internships or a job in Sydney in 2027.',
    footer: 'Made by Roberto Linares with Claude Code. No templates.',
  },
};

// Las diez teclas: P O R T F / O L I O ↵. Cada una abre una sección.
export const KEYS = [
  { k: 'P', id: 'proyectos', color: '#ef5a3c', es: 'Proyectos', en: 'Projects' },
  { k: 'O', id: 'origen', color: '#f39a2b', es: 'Origen', en: 'Origin' },
  { k: 'R', id: 'cv', color: '#efe3c8', es: 'Currículum', en: 'Résumé' },
  { k: 'T', id: 'herramientas', color: '#2fb9a0', es: 'Herramientas', en: 'Toolkit' },
  { k: 'F', id: 'fabrica', color: '#7ccf4a', es: 'Fábrica', en: 'Factory' },
  { k: 'O', id: 'fuera', color: '#f08bb4', es: 'Fuera de la pantalla', en: 'Off-hours' },
  { k: 'L', id: 'laboratorio', color: '#e8473f', es: 'Laboratorio', en: 'Labs' },
  { k: 'I', id: 'en-proceso', color: '#f2a03d', es: 'En proceso', en: 'In progress' },
  { k: 'O', id: 'codigo', color: '#f3d23a', es: 'Código abierto', en: 'Open source' },
  { k: '↵', id: 'contacto', color: '#2d2f36', es: 'Contacto', en: 'Contact', wide: true },
];

export const SECTIONS = {
  proyectos: {
    es: { title: 'Proyectos', lead: 'Los que tienen usuarios reales. Cada uno resolvió un problema de alguien que conozco.' },
    en: { title: 'Projects', lead: 'The ones with real users. Each solved a problem for someone I know.' },
  },
  origen: {
    es: {
      title: 'Origen',
      lead: 'Tengo 18 años y soy de Puebla, México.',
      body: [
        'Terminé la prepa en el Colegio Humboldt de Puebla, una escuela alemana (promedio 9.15), e hice un semestre de intercambio en el Eberhard-Ludwigs-Gymnasium de Stuttgart. Hablo español, alemán e inglés.',
        'Empecé a construir porque veía problemas cerca: un rancho que anotaba todo en papel, una fábrica que coordinaba por WhatsApp, mi familia sin saber a dónde se iba el dinero. Con IA aprendí a convertir eso en apps que la gente usa de verdad.',
        'Mi ruta: inglés en Sydney en 2027, un año de Ingeniería en Información Electrónica en China y, después, ingeniería en TU Delft, en Países Bajos.',
      ],
    },
    en: {
      title: 'Origin',
      lead: 'I\'m 18 and from Puebla, Mexico.',
      body: [
        'I finished high school at Colegio Humboldt in Puebla, a German school (GPA 9.15/10), and spent an exchange semester at Eberhard-Ludwigs-Gymnasium in Stuttgart. I speak Spanish, German and English.',
        'I started building because I saw problems up close: a ranch that recorded everything on paper, a factory coordinating over WhatsApp, my family not knowing where the money went. AI taught me to turn that into apps people actually use.',
        'My path: English in Sydney in 2027, a year of Electronic Information Engineering in China, and then engineering at TU Delft in the Netherlands.',
      ],
    },
  },
  cv: {
    es: { title: 'Currículum', lead: 'Una hoja, en inglés, con experiencia, idiomas y disponibilidad.' },
    en: { title: 'Résumé', lead: 'One page with experience, languages and availability.' },
  },
  herramientas: {
    es: {
      title: 'Herramientas',
      lead: 'No solo le pido cosas a una IA: trabajo con un proceso.',
      body: [
        'Construyo con Claude Code y un equipo de agentes que revisa cada cambio: uno revisa el código, otro prueba que funcione, otro busca fallas de seguridad. Otra IA (Codex) critica el diseño antes de empezar y vuelve a revisar al final.',
        'Uso HTML y JavaScript sin frameworks cuando se puede, Firebase para datos y usuarios, GitHub Pages para publicar, Python para automatizar y procesar datos, y Godot para juegos.',
      ],
      chips: ['Claude Code', 'Agentes de revisión', 'Codex', 'JavaScript', 'Firebase', 'GitHub Pages', 'Python', 'Three.js', 'Godot', 'ffmpeg'],
    },
    en: {
      title: 'Toolkit',
      lead: 'I don\'t just ask an AI for things: I work with a process.',
      body: [
        'I build with Claude Code and a team of agents that reviews every change: one reviews the code, one tests that it works, one hunts for security holes. A second AI (Codex) critiques the design before I start and reviews again at the end.',
        'I use plain HTML and JavaScript when possible, Firebase for data and users, GitHub Pages to publish, Python to automate and process data, and Godot for games.',
      ],
      chips: ['Claude Code', 'Review agents', 'Codex', 'JavaScript', 'Firebase', 'GitHub Pages', 'Python', 'Three.js', 'Godot', 'ffmpeg'],
    },
  },
  fabrica: {
    es: { title: 'Fábrica', lead: 'Herramientas internas para Deportivos Quini, la fábrica textil de mi familia. Son privadas: las muestro sin datos reales.' },
    en: { title: 'Factory', lead: 'Internal tools for Deportivos Quini, my family\'s textile factory. They are private: shown without real data.' },
  },
  fuera: {
    es: {
      title: 'Fuera de la pantalla',
      lead: 'Lo que hago cuando no estoy construyendo.',
      items: [
        { label: 'Básquet', stat: 'Capitán', text: 'Capitán del equipo del Colegio Humboldt de 2023 a 2026 y titular en la Academia Jaguares, en San Pedro Cholula. En Sydney sigo jugando en liga.' },
        { label: 'Jiu-jitsu brasileño', stat: '4×', text: 'Cuatro campeonatos nacionales. Lo que me enseñó: la técnica le gana a la fuerza, y se entrena aunque no tengas ganas.' },
        { label: 'Rownies', stat: '2023', text: 'Mi marca de brownies desde 2023: produzco, costeo y vendo. Cada año tengo un puesto en un festival de unas 3,600 personas.' },
      ],
    },
    en: {
      title: 'Off-hours',
      lead: 'What I do when I\'m not building.',
      items: [
        { label: 'Basketball', stat: 'Captain', text: 'Team captain at Colegio Humboldt from 2023 to 2026 and starting player at Academia Jaguares in San Pedro Cholula. I keep playing league in Sydney.' },
        { label: 'Brazilian Jiu-Jitsu', stat: '4×', text: 'Four national championships. What it taught me: technique beats strength, and you train even when you don\'t feel like it.' },
        { label: 'Rownies', stat: '2023', text: 'My brownie brand since 2023: I make, cost and sell them. Every year I run a stall at a festival of about 3,600 people.' },
      ],
    },
  },
  laboratorio: {
    es: { title: 'Laboratorio', lead: 'Experimentos: cosas que hice para aprender o por pura curiosidad.' },
    en: { title: 'Labs', lead: 'Experiments: things I built to learn or out of pure curiosity.' },
  },
  'en-proceso': {
    es: { title: 'En proceso', lead: 'Lo que estoy construyendo ahora.' },
    en: { title: 'In progress', lead: 'What I\'m building right now.' },
  },
  codigo: {
    es: { title: 'Código abierto', lead: 'Mis repositorios públicos y mi perfil profesional. Este portafolio también es abierto: puedes ver cómo está hecho.' },
    en: { title: 'Open source', lead: 'My public repositories and professional profile. This portfolio is open too: see how it\'s built.' },
  },
  contacto: { es: { title: 'Contacto' }, en: { title: 'Contact' } },
};

// Proyectos. status: prod | done | wip | lab | internal. url solo si es pública y sin datos reales.
export const PROJECTS = [
  {
    group: 'proyectos', status: 'prod', mono: 'BR', logo: 'assets/logos/bravo.png', accent: '#7ccf4a',
    name: 'Bravo',
    url: 'https://rl7103405-gif.github.io/control-ganadero/',
    es: { tag: 'Control ganadero', desc: 'App para llevar el rancho de mi abuelo: censo de animales, partos, pesos y rotación de potreros.', used: 'El rancho familiar, todos los días. Ya tiene una versión de demostración para otros ranchos.', built: 'La diseñé y la construí completa, con respaldos y reglas de seguridad probadas.' },
    en: { tag: 'Livestock management', desc: 'An app to run my grandfather\'s ranch: herd census, births, weights and pasture rotation.', used: 'The family ranch, every day. A demo version for other ranches already exists.', built: 'I designed and built it end to end, with backups and tested security rules.' },
    stack: ['Firebase', 'JavaScript', 'PWA'],
  },
  {
    group: 'proyectos', status: 'prod', mono: 'MC', logo: 'assets/logos/mi-cartera.svg', accent: '#2fb9a0',
    name: 'Mi Cartera',
    url: 'https://rl7103405-gif.github.io/mi-cartera-web/',
    es: { tag: 'Finanzas personales', desc: 'App para saber a dónde se va el dinero: cuentas, presupuesto, tarjetas e inversiones, sincronizada entre teléfonos.', used: 'Cinco personas de mi familia, más una cartera compartida de la casa.', built: 'La app, su página de presentación y una cuenta de demostración con datos inventados.' },
    en: { tag: 'Personal finance', desc: 'An app to see where the money goes: accounts, budget, cards and investments, synced across phones.', used: 'Five people in my family, plus a shared household wallet.', built: 'The app, its landing page and a demo account with made-up data.' },
    stack: ['Firebase', 'JavaScript', 'GSAP'],
  },
  {
    group: 'proyectos', status: 'prod', mono: 'RU', accent: '#f39a2b',
    name: 'RUNA',
    es: { tag: 'Área de muestras', desc: 'Sistema que digitaliza el área de muestras de la fábrica: asigna trabajos, sigue su avance en tiempo real y exporta reportes.', used: 'El equipo de muestras de Deportivos Quini.', built: 'Diseño, construcción y permisos por rol.' },
    en: { tag: 'Sampling department', desc: 'A system that digitises the factory\'s sampling department: assigns jobs, tracks progress in real time and exports reports.', used: 'The sampling team at Deportivos Quini.', built: 'Design, build and role-based permissions.' },
    stack: ['Firebase', 'JavaScript'],
  },
  {
    group: 'proyectos', status: 'prod', mono: 'CM', accent: '#ef5a3c',
    name: 'Captura Mecánicos',
    es: { tag: 'Mantenimiento', desc: 'Mantenimiento en tiempo real para la planta de tejido: reportar fallas, atenderlas y cerrarlas, con un tablero de máquinas por colores.', used: 'Los mecánicos y supervisores de la planta.', built: 'El sistema completo, con indicadores y códigos de falla.' },
    en: { tag: 'Maintenance', desc: 'Real-time maintenance for the knitting plant: report faults, handle and close them, with a colour-coded machine board.', used: 'The plant\'s mechanics and supervisors.', built: 'The whole system, with KPIs and fault codes.' },
    stack: ['Firebase', 'JavaScript'],
  },
  {
    group: 'proyectos', status: 'done', mono: 'EL', logo: 'assets/logos/entrelineas.svg', accent: '#f08bb4',
    name: 'Entre Líneas',
    es: { tag: 'Cliente: taller local', desc: 'Una app de gestión financiera para un taller: pedidos ordenados por prioridad, cobros, inventario y un resumen de lo vendido contra lo cobrado.', used: 'La dueña del taller y su equipo, cada quien con su rol. Me la encargó y la pagó.', built: 'La app completa, a la medida de cómo trabaja ella.' },
    en: { tag: 'Client: local workshop', desc: 'A financial management app for a workshop: orders sorted by priority, payments, inventory and a summary of what was sold versus collected.', used: 'The workshop owner and her team, each with their own role. She commissioned it and paid for it.', built: 'The whole app, tailored to the way she works.' },
    stack: ['Firebase', 'JavaScript'],
  },
  {
    group: 'proyectos', status: 'prod', mono: 'JG', logo: 'assets/logos/jaguares.png', accent: '#f3d23a',
    name: 'Jaguares NZ',
    url: 'https://rl7103405-gif.github.io/jaguarez-nz/',
    es: { tag: 'Academia de básquet', desc: 'La página de la academia de básquet donde juego: programas, horarios y contacto para niños de 6 a 17 años.', used: 'Las familias de la academia, en San Pedro Cholula.', built: 'La página y un portal de prueba para la academia.' },
    en: { tag: 'Basketball academy', desc: 'The website of the basketball academy I play for: programs, schedules and contact for kids aged 6 to 17.', used: 'The academy\'s families, in San Pedro Cholula.', built: 'The website and a trial portal for the academy.' },
    stack: ['HTML', 'CSS', 'JavaScript'],
  },
  // Fábrica (internas)
  { group: 'fabrica', status: 'internal', mono: 'RG', accent: '#7ccf4a', name: 'RAGNAR',
    es: { tag: 'Embarques e inventario', desc: 'Control de la maquila externa: qué salió, qué regresó y qué falta, con un portal para los talleres maquileros.' },
    en: { tag: 'Shipping & inventory', desc: 'Control of external contract manufacturing: what left, what came back and what is missing, with a portal for contractors.' } },
  { group: 'fabrica', status: 'internal', mono: 'GR', accent: '#2fb9a0', name: 'Extractor de gramajes',
    es: { tag: 'Fichas técnicas', desc: 'Lee las fichas técnicas de los productos y saca los gramajes de cada hilo, que antes se copiaban a mano.' },
    en: { tag: 'Tech sheets', desc: 'Reads product tech sheets and extracts the yarn weights that used to be copied by hand.' } },
  { group: 'fabrica', status: 'wip', mono: 'GC', accent: '#f39a2b', name: 'Gestión comercial',
    es: { tag: 'Arquitectura', desc: 'Una sola fuente de verdad para la información que hoy vive dispersa entre departamentos. La arquitectura está lista.' },
    en: { tag: 'Architecture', desc: 'A single source of truth for information currently scattered across departments. The architecture is ready.' } },
  // Laboratorio
  { group: 'laboratorio', status: 'lab', mono: 'ER', accent: '#ef5a3c', name: 'Escala Real',
    es: { tag: 'Fábrica de videos', desc: 'Una fábrica local y gratuita de YouTube Shorts: de un guion en texto sale un video vertical con voz, imágenes y subtítulos.' },
    en: { tag: 'Video factory', desc: 'A free, local YouTube Shorts factory: a text script becomes a vertical video with voice, images and subtitles.' } },
  { group: 'laboratorio', status: 'lab', mono: 'OA', accent: '#2fb9a0', name: 'Oficina de agentes',
    es: { tag: 'Tablero 3D', desc: 'Una oficina en 3D donde veo a mis agentes de IA: quién existe, quién trabaja ahora y cuánto se usa cada uno.' },
    en: { tag: '3D dashboard', desc: 'A 3D office where I see my AI agents: who exists, who is working now and how much each one is used.' } },
  { group: 'laboratorio', status: 'lab', mono: 'BJ', accent: '#f3d23a', name: 'Blackjack Trainer', url: 'blackjack/', play: true,
    es: { tag: 'Entrenador', desc: 'Juego para entrenar el conteo de cartas Hi-Lo paso a paso: estrategia básica, conteo y apuestas.' },
    en: { tag: 'Trainer', desc: 'A game to practise Hi-Lo card counting step by step: basic strategy, counting and betting.' } },
  { group: 'laboratorio', status: 'lab', mono: 'AG', accent: '#f08bb4', name: 'Astro Génesis',
    es: { tag: 'Videojuego', desc: 'Un juego espacial en Godot. Su demo 2D está terminado y se probó con 93 pruebas automáticas.' },
    en: { tag: 'Video game', desc: 'A space game in Godot. Its 2D demo is finished and covered by 93 automated tests.' } },
  // En proceso
  { group: 'en-proceso', status: 'wip', mono: 'B+', accent: '#7ccf4a', name: 'Bravo para otros ranchos',
    es: { tag: 'Producto', desc: 'La app del rancho, convertida en un producto para otros ganaderos, con su rancho de demostración.' },
    en: { tag: 'Product', desc: 'The ranch app, turned into a product for other ranchers, with its own demo ranch.' } },
  { group: 'en-proceso', status: 'wip', mono: 'PD', accent: '#f39a2b', name: 'Prodeco',
    es: { tag: 'Web', desc: 'La página de una empresa de poda y tala.' },
    en: { tag: 'Website', desc: 'The website for a tree pruning and felling company.' } },
];

export const LINKS = {
  github: 'https://github.com/rl7103405-gif',
  linkedin: 'https://www.linkedin.com/in/roberto-linares-alvarez-0a1791420',
  email: 'rl7103405@gmail.com',
  cv: 'assets/CV-Roberto-Linares-EN.pdf',
};
