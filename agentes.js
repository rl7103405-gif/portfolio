// Generado por herramientas/generar-agentes.py desde la oficina de agentes (7 oct 2026).
// Los SVG son los personajes de la oficina; las cifras son su registro de uso a esa fecha.
export const DEPTOS = {"direccion": ["Dirección", "Leadership"], "revision": ["Revisión", "Review"], "taller": ["Taller", "Workshop"], "pruebas": ["Pruebas", "Testing"], "seguridad": ["Seguridad", "Security"], "investigacion": ["Investigación", "Research"], "consultoria": ["Consultoría externa", "External advisors"]};
export const AGENTES = [
 {
  "nombre": "Beto",
  "depto": "direccion",
  "svg": "<svg viewBox=\"0 0 100 100\" xmlns=\"http://www.w3.org/2000/svg\" role=\"img\" aria-hidden=\"true\"><path d=\"M22 100v-9c0-11 10-18 28-18s28 7 28 18v9z\" fill=\"#0e7490\"></path><path d=\"M50 73c-6 0-11 1-15 3l15 10 15-10c-4-2-9-3-15-3z\" fill=\"rgb(11,87,108)\"></path><path d=\"M44 62h12v11c0 2-12 2-12 0z\" fill=\"rgb(141,93,57)\"></path><ellipse cx=\"50\" cy=\"45\" rx=\"19\" ry=\"21\" fill=\"#a06a41\"></ellipse><circle cx=\"30\" cy=\"47\" r=\"3.6\" fill=\"#a06a41\"></circle><circle cx=\"70\" cy=\"47\" r=\"3.6\" fill=\"#a06a41\"></circle><path d=\"M33 46c0 14 7 22 17 22s17-8 17-22c2 16-4 26-17 26s-19-10-17-26z\" fill=\"#e8e3dc\"></path><g><rect x=\"31\" y=\"40\" width=\"38\" height=\"12\" rx=\"6\" fill=\"#1e293b\"></rect><rect x=\"34\" y=\"43\" width=\"14\" height=\"6\" rx=\"3\" fill=\"#38bdf8\" opacity=\".85\"></rect><rect x=\"52\" y=\"43\" width=\"14\" height=\"6\" rx=\"3\" fill=\"#38bdf8\" opacity=\".85\"></rect></g><path d=\"M31 42c-1-14 8-22 19-22s20 8 19 22c-2-9-6-12-14-12-6 0-8 3-13 4-4 1-9 1-11 8z\" fill=\"#e8e3dc\"></path><g><path d=\"M30 44a20 20 0 0 1 40 0\" fill=\"none\" stroke=\"#2f3542\" stroke-width=\"3.5\"></path><rect x=\"25\" y=\"41\" width=\"8\" height=\"13\" rx=\"4\" fill=\"#2f3542\"></rect><rect x=\"67\" y=\"41\" width=\"8\" height=\"13\" rx=\"4\" fill=\"#2f3542\"></rect></g></svg>",
  "modelo": "",
  "usos": 884,
  "tipo": "prompts",
  "apr": null,
  "es": {
   "rol": "Dueño",
   "que": "Pone los objetivos, revisa el resultado y decide al final.",
   "nivel": "Dueño"
  },
  "en": {
   "rol": "Owner",
   "que": "Sets the goals, checks the result and has the final say.",
   "nivel": "Owner"
  }
 },
 {
  "nombre": "Claude",
  "depto": "direccion",
  "svg": "<svg viewBox=\"0 0 100 100\" xmlns=\"http://www.w3.org/2000/svg\" role=\"img\" aria-hidden=\"true\"><path d=\"M22 100v-9c0-11 10-18 28-18s28 7 28 18v9z\" fill=\"#16a34a\"></path><path d=\"M50 73c-6 0-11 1-15 3l15 10 15-10c-4-2-9-3-15-3z\" fill=\"rgb(17,122,56)\"></path><path d=\"M44 62h12v11c0 2-12 2-12 0z\" fill=\"rgb(141,93,57)\"></path><ellipse cx=\"50\" cy=\"45\" rx=\"19\" ry=\"21\" fill=\"#a06a41\"></ellipse><circle cx=\"30\" cy=\"47\" r=\"3.6\" fill=\"#a06a41\"></circle><circle cx=\"70\" cy=\"47\" r=\"3.6\" fill=\"#a06a41\"></circle><path d=\"M33 46c0 14 7 22 17 22s17-8 17-22c2 16-4 26-17 26s-19-10-17-26z\" fill=\"#7b3f6d\"></path><circle cx=\"42\" cy=\"46\" r=\"2.4\" fill=\"#2a2a2a\"></circle><circle cx=\"58\" cy=\"46\" r=\"2.4\" fill=\"#2a2a2a\"></circle><path d=\"M45 55h10\" fill=\"none\" stroke=\"#2a2a2a\" stroke-width=\"2\" stroke-linecap=\"round\"></path><path d=\"M31 42c-1-14 8-22 19-22s20 8 19 22c-2-9-6-12-14-12-6 0-8 3-13 4-4 1-9 1-11 8z\" fill=\"#7b3f6d\"></path></svg>",
  "modelo": "fable",
  "usos": 360,
  "tipo": "despachos",
  "apr": null,
  "es": {
   "rol": "Orquestador",
   "que": "Planea el trabajo, escribe el código y le pasa cada tarea al agente indicado.",
   "nivel": "Orquestador"
  },
  "en": {
   "rol": "Orchestrator",
   "que": "Plans the work, writes the code and hands each task to the right agent.",
   "nivel": "Orchestrator"
  }
 },
 {
  "nombre": "code-explorer",
  "depto": "revision",
  "svg": "<svg viewBox=\"0 0 100 100\" xmlns=\"http://www.w3.org/2000/svg\" role=\"img\" aria-hidden=\"true\"><path d=\"M22 100v-9c0-11 10-18 28-18s28 7 28 18v9z\" fill=\"#3b82f6\"></path><path d=\"M50 73c-6 0-11 1-15 3l15 10 15-10c-4-2-9-3-15-3z\" fill=\"rgb(44,98,185)\"></path><path d=\"M44 62h12v11c0 2-12 2-12 0z\" fill=\"rgb(107,66,37)\"></path><ellipse cx=\"50\" cy=\"45\" rx=\"19\" ry=\"21\" fill=\"#7a4b2a\"></ellipse><circle cx=\"30\" cy=\"47\" r=\"3.6\" fill=\"#7a4b2a\"></circle><circle cx=\"70\" cy=\"47\" r=\"3.6\" fill=\"#7a4b2a\"></circle><path d=\"M46 58h8c0 5-1 8-4 8s-4-3-4-8z\" fill=\"#7b3f6d\"></path><g stroke=\"#2a2a2a\" stroke-width=\"2.2\" stroke-linecap=\"round\"><path d=\"M39 46h6\"></path><path d=\"M55 46h6\"></path><path d=\"M38 40l7 2M62 40l-7 2\"></path></g><path d=\"M31 42c-1-14 8-22 19-22s20 8 19 22c-2-9-7-12-19-12s-17 3-19 12z\" fill=\"#7b3f6d\"></path><g><path d=\"M30 44a20 20 0 0 1 40 0\" fill=\"none\" stroke=\"#2f3542\" stroke-width=\"3.5\"></path><rect x=\"25\" y=\"41\" width=\"8\" height=\"13\" rx=\"4\" fill=\"#2f3542\"></rect><rect x=\"67\" y=\"41\" width=\"8\" height=\"13\" rx=\"4\" fill=\"#2f3542\"></rect></g></svg>",
  "modelo": "sonnet",
  "usos": 15,
  "tipo": "usos",
  "apr": 7,
  "es": {
   "rol": "Explorador",
   "que": "Antes de cambiar nada, recorre el código y dibuja cómo fluyen de verdad los datos.",
   "nivel": "Frecuente"
  },
  "en": {
   "rol": "Explorer",
   "que": "Before anything is changed, it walks through the code and maps how the data actually flows.",
   "nivel": "Frequent"
  }
 },
 {
  "nombre": "code-reviewer",
  "depto": "revision",
  "svg": "<svg viewBox=\"0 0 100 100\" xmlns=\"http://www.w3.org/2000/svg\" role=\"img\" aria-hidden=\"true\"><path d=\"M22 100v-9c0-11 10-18 28-18s28 7 28 18v9z\" fill=\"#7c3aed\"></path><path d=\"M50 73c-6 0-11 1-15 3l15 10 15-10c-4-2-9-3-15-3z\" fill=\"rgb(93,44,178)\"></path><path d=\"M44 62h12v11c0 2-12 2-12 0z\" fill=\"rgb(177,125,87)\"></path><ellipse cx=\"50\" cy=\"45\" rx=\"19\" ry=\"21\" fill=\"#c98e63\"></ellipse><circle cx=\"30\" cy=\"47\" r=\"3.6\" fill=\"#c98e63\"></circle><circle cx=\"70\" cy=\"47\" r=\"3.6\" fill=\"#c98e63\"></circle><path d=\"M43 52c2-2 5-2 7 0 2-2 5-2 7 0-2 3-12 3-14 0z\" fill=\"#e8e3dc\"></path><circle cx=\"42\" cy=\"46\" r=\"2.4\" fill=\"#2a2a2a\"></circle><circle cx=\"58\" cy=\"46\" r=\"2.4\" fill=\"#2a2a2a\"></circle><path d=\"M43 55c3 3 11 3 14 0\" fill=\"none\" stroke=\"#2a2a2a\" stroke-width=\"2\" stroke-linecap=\"round\"></path><g><path d=\"M30 38c0-13 9-20 20-20s20 7 20 20z\" fill=\"#e8e3dc\"></path><path d=\"M28 38h44c1 0 1 4 0 4H28c-1 0-1-4 0-4z\" fill=\"rgb(174,170,165)\"></path><path d=\"M70 38h14c1 2 0 5-3 5H70z\" fill=\"rgb(139,136,132)\"></path></g><g><circle cx=\"76\" cy=\"80\" r=\"7\" fill=\"rgba(125,211,252,.35)\" stroke=\"#475569\" stroke-width=\"2\"></circle><path d=\"M81 85l6 6\" stroke=\"#475569\" stroke-width=\"3\" stroke-linecap=\"round\"></path></g></svg>",
  "modelo": "sonnet",
  "usos": 80,
  "tipo": "usos",
  "apr": 35,
  "es": {
   "rol": "Revisor de código",
   "que": "Revisa cada cambio sin tocarlo: malas prácticas, errores sin manejar, datos expuestos y reglas de Firebase.",
   "nivel": "Muy frecuente"
  },
  "en": {
   "rol": "Code reviewer",
   "que": "Reviews every change without editing it, checking for bad practices, unhandled errors, exposed data and Firebase rules.",
   "nivel": "Very frequent"
  }
 },
 {
  "nombre": "debugger",
  "depto": "taller",
  "svg": "<svg viewBox=\"0 0 100 100\" xmlns=\"http://www.w3.org/2000/svg\" role=\"img\" aria-hidden=\"true\"><path d=\"M22 100v-9c0-11 10-18 28-18s28 7 28 18v9z\" fill=\"#7c3aed\"></path><path d=\"M50 73c-6 0-11 1-15 3l15 10 15-10c-4-2-9-3-15-3z\" fill=\"rgb(93,44,178)\"></path><path d=\"M44 62h12v11c0 2-12 2-12 0z\" fill=\"rgb(107,66,37)\"></path><ellipse cx=\"50\" cy=\"45\" rx=\"19\" ry=\"21\" fill=\"#7a4b2a\"></ellipse><circle cx=\"30\" cy=\"47\" r=\"3.6\" fill=\"#7a4b2a\"></circle><circle cx=\"70\" cy=\"47\" r=\"3.6\" fill=\"#7a4b2a\"></circle><path d=\"M43 52c2-2 5-2 7 0 2-2 5-2 7 0-2 3-12 3-14 0z\" fill=\"#c9922f\"></path><circle cx=\"42\" cy=\"46\" r=\"2.4\" fill=\"#2a2a2a\"></circle><circle cx=\"58\" cy=\"46\" r=\"2.4\" fill=\"#2a2a2a\"></circle><path d=\"M43 55c3 3 11 3 14 0\" fill=\"none\" stroke=\"#2a2a2a\" stroke-width=\"2\" stroke-linecap=\"round\"></path><path d=\"M30 42c-2-15 8-23 20-23s22 8 20 23v22c0 3-3 4-5 2-1-9-2-16-3-20-4 5-9 7-12 7s-8-2-12-7c-1 4-2 11-3 20-2 2-5 1-5-2z\" fill=\"#c9922f\"></path><g><path d=\"M30 44a20 20 0 0 1 40 0\" fill=\"none\" stroke=\"#2f3542\" stroke-width=\"3.5\"></path><rect x=\"25\" y=\"41\" width=\"8\" height=\"13\" rx=\"4\" fill=\"#2f3542\"></rect><rect x=\"67\" y=\"41\" width=\"8\" height=\"13\" rx=\"4\" fill=\"#2f3542\"></rect></g></svg>",
  "modelo": "sonnet",
  "usos": 60,
  "tipo": "usos",
  "apr": 60,
  "es": {
   "rol": "Depurador",
   "que": "Diagnostica la causa de una falla y aplica la corrección mínima. Es el único especialista con permiso de editar código.",
   "nivel": "Muy frecuente"
  },
  "en": {
   "rol": "Debugger",
   "que": "Finds the root cause of a failure and applies the smallest possible fix. It's the only specialist allowed to edit code.",
   "nivel": "Very frequent"
  }
 },
 {
  "nombre": "browser-tester",
  "depto": "pruebas",
  "svg": "<svg viewBox=\"0 0 100 100\" xmlns=\"http://www.w3.org/2000/svg\" role=\"img\" aria-hidden=\"true\"><path d=\"M22 100v-9c0-11 10-18 28-18s28 7 28 18v9z\" fill=\"#16a34a\"></path><path d=\"M50 73c-6 0-11 1-15 3l15 10 15-10c-4-2-9-3-15-3z\" fill=\"rgb(17,122,56)\"></path><path d=\"M44 62h12v11c0 2-12 2-12 0z\" fill=\"rgb(141,93,57)\"></path><ellipse cx=\"50\" cy=\"45\" rx=\"19\" ry=\"21\" fill=\"#a06a41\"></ellipse><circle cx=\"30\" cy=\"47\" r=\"3.6\" fill=\"#a06a41\"></circle><circle cx=\"70\" cy=\"47\" r=\"3.6\" fill=\"#a06a41\"></circle><path d=\"M33 46c0 14 7 22 17 22s17-8 17-22c2 16-4 26-17 26s-19-10-17-26z\" fill=\"#5b3a21\"></path><g><rect x=\"31\" y=\"40\" width=\"38\" height=\"12\" rx=\"6\" fill=\"#1e293b\"></rect><rect x=\"34\" y=\"43\" width=\"14\" height=\"6\" rx=\"3\" fill=\"#38bdf8\" opacity=\".85\"></rect><rect x=\"52\" y=\"43\" width=\"14\" height=\"6\" rx=\"3\" fill=\"#38bdf8\" opacity=\".85\"></rect></g><g fill=\"#5b3a21\"><circle cx=\"38\" cy=\"26\" r=\"8\"></circle><circle cx=\"50\" cy=\"21\" r=\"9\"></circle><circle cx=\"62\" cy=\"26\" r=\"8\"></circle><circle cx=\"32\" cy=\"34\" r=\"7\"></circle><circle cx=\"68\" cy=\"34\" r=\"7\"></circle></g><g><circle cx=\"76\" cy=\"80\" r=\"7\" fill=\"rgba(125,211,252,.35)\" stroke=\"#475569\" stroke-width=\"2\"></circle><path d=\"M81 85l6 6\" stroke=\"#475569\" stroke-width=\"3\" stroke-linecap=\"round\"></path></g></svg>",
  "modelo": "sonnet",
  "usos": 4,
  "tipo": "usos",
  "apr": 0,
  "es": {
   "rol": "Probador de navegador",
   "que": "Prueba formularios, navegación y estados visuales en un navegador real.",
   "nivel": "Ocasional"
  },
  "en": {
   "rol": "Browser tester",
   "que": "Tests forms, navigation and visual states in a real browser.",
   "nivel": "Occasional"
  }
 },
 {
  "nombre": "parser-tester",
  "depto": "pruebas",
  "svg": "<svg viewBox=\"0 0 100 100\" xmlns=\"http://www.w3.org/2000/svg\" role=\"img\" aria-hidden=\"true\"><path d=\"M22 100v-9c0-11 10-18 28-18s28 7 28 18v9z\" fill=\"#16a34a\"></path><path d=\"M50 73c-6 0-11 1-15 3l15 10 15-10c-4-2-9-3-15-3z\" fill=\"rgb(17,122,56)\"></path><path d=\"M44 62h12v11c0 2-12 2-12 0z\" fill=\"rgb(177,125,87)\"></path><ellipse cx=\"50\" cy=\"45\" rx=\"19\" ry=\"21\" fill=\"#c98e63\"></ellipse><circle cx=\"30\" cy=\"47\" r=\"3.6\" fill=\"#c98e63\"></circle><circle cx=\"70\" cy=\"47\" r=\"3.6\" fill=\"#c98e63\"></circle><path d=\"M33 46c0 14 7 22 17 22s17-8 17-22c2 16-4 26-17 26s-19-10-17-26z\" fill=\"#9a9a9a\"></path><g stroke=\"#2a2a2a\" stroke-width=\"2.2\" stroke-linecap=\"round\"><path d=\"M39 46h6\"></path><path d=\"M55 46h6\"></path><path d=\"M38 40l7 2M62 40l-7 2\"></path></g><path d=\"M32 40c0-12 7-19 18-19s18 7 18 19c0-6-8-9-18-9s-18 3-18 9z\" fill=\"#9a9a9a\" opacity=\".55\"></path><g><rect x=\"66\" y=\"78\" width=\"17\" height=\"14\" rx=\"2\" fill=\"#fef3c7\" stroke=\"rgb(15,114,52)\" stroke-width=\"1.5\"></rect><path d=\"M70 83h9M70 87h9\" stroke=\"#a8a29e\" stroke-width=\"1.4\" stroke-linecap=\"round\"></path></g></svg>",
  "modelo": "sonnet",
  "usos": 1,
  "tipo": "usos",
  "apr": 0,
  "es": {
   "rol": "Probador de archivos",
   "que": "Prueba la lectura de Excel, CSV y XML, incluidos archivos mal hechos.",
   "nivel": "Ocasional"
  },
  "en": {
   "rol": "File tester",
   "que": "Tests how Excel, CSV and XML files are read, including broken ones.",
   "nivel": "Occasional"
  }
 },
 {
  "nombre": "qa-tester",
  "depto": "pruebas",
  "svg": "<svg viewBox=\"0 0 100 100\" xmlns=\"http://www.w3.org/2000/svg\" role=\"img\" aria-hidden=\"true\"><path d=\"M22 100v-9c0-11 10-18 28-18s28 7 28 18v9z\" fill=\"#0e7490\"></path><path d=\"M50 73c-6 0-11 1-15 3l15 10 15-10c-4-2-9-3-15-3z\" fill=\"rgb(11,87,108)\"></path><path d=\"M44 62h12v11c0 2-12 2-12 0z\" fill=\"rgb(202,163,131)\"></path><ellipse cx=\"50\" cy=\"45\" rx=\"19\" ry=\"21\" fill=\"#e5b995\"></ellipse><circle cx=\"30\" cy=\"47\" r=\"3.6\" fill=\"#e5b995\"></circle><circle cx=\"70\" cy=\"47\" r=\"3.6\" fill=\"#e5b995\"></circle><path d=\"M43 52c2-2 5-2 7 0 2-2 5-2 7 0-2 3-12 3-14 0z\" fill=\"#e8e3dc\"></path><circle cx=\"42\" cy=\"46\" r=\"2.4\" fill=\"#2a2a2a\"></circle><circle cx=\"58\" cy=\"46\" r=\"2.4\" fill=\"#2a2a2a\"></circle><path d=\"M45 55h10\" fill=\"none\" stroke=\"#2a2a2a\" stroke-width=\"2\" stroke-linecap=\"round\"></path><path d=\"M32 40c0-12 7-19 18-19s18 7 18 19c0-6-8-9-18-9s-18 3-18 9z\" fill=\"#e8e3dc\" opacity=\".55\"></path><g><rect x=\"66\" y=\"78\" width=\"17\" height=\"14\" rx=\"2\" fill=\"#fef3c7\" stroke=\"rgb(10,81,101)\" stroke-width=\"1.5\"></rect><path d=\"M70 83h9M70 87h9\" stroke=\"#a8a29e\" stroke-width=\"1.4\" stroke-linecap=\"round\"></path></g></svg>",
  "modelo": "sonnet",
  "usos": 65,
  "tipo": "usos",
  "apr": 36,
  "es": {
   "rol": "Verificador funcional",
   "que": "Confirma que los flujos clave siguen funcionando después de cada corrección.",
   "nivel": "Muy frecuente"
  },
  "en": {
   "rol": "QA tester",
   "que": "Confirms the key flows still work after every fix.",
   "nivel": "Very frequent"
  }
 },
 {
  "nombre": "usuario-real",
  "depto": "pruebas",
  "svg": "<svg viewBox=\"0 0 100 100\" xmlns=\"http://www.w3.org/2000/svg\" role=\"img\" aria-hidden=\"true\"><path d=\"M22 100v-9c0-11 10-18 28-18s28 7 28 18v9z\" fill=\"#16a34a\"></path><path d=\"M50 73c-6 0-11 1-15 3l15 10 15-10c-4-2-9-3-15-3z\" fill=\"rgb(17,122,56)\"></path><path d=\"M44 62h12v11c0 2-12 2-12 0z\" fill=\"rgb(213,186,162)\"></path><ellipse cx=\"50\" cy=\"45\" rx=\"19\" ry=\"21\" fill=\"#f2d3b8\"></ellipse><circle cx=\"30\" cy=\"47\" r=\"3.6\" fill=\"#f2d3b8\"></circle><circle cx=\"70\" cy=\"47\" r=\"3.6\" fill=\"#f2d3b8\"></circle><path d=\"M46 58h8c0 5-1 8-4 8s-4-3-4-8z\" fill=\"#9a9a9a\"></path><g stroke=\"#2a2a2a\" stroke-width=\"2.2\" stroke-linecap=\"round\"><path d=\"M39 46h6\"></path><path d=\"M55 46h6\"></path><path d=\"M38 40l7 2M62 40l-7 2\"></path></g><path d=\"M31 42c-1-14 8-22 19-22s20 8 19 22c-2-9-7-12-19-12s-17 3-19 12z\" fill=\"#9a9a9a\"></path><g><rect x=\"68\" y=\"80\" width=\"15\" height=\"12\" rx=\"2\" fill=\"#ffffff\" stroke=\"#c3c9d4\" stroke-width=\"1.5\"></rect><path d=\"M83 83h4a3 3 0 0 1 0 6h-4\" fill=\"none\" stroke=\"#c3c9d4\" stroke-width=\"1.5\"></path><rect x=\"70\" y=\"82\" width=\"11\" height=\"3\" fill=\"#8b5a2b\"></rect></g></svg>",
  "modelo": "opus",
  "usos": 9,
  "tipo": "usos",
  "apr": 25,
  "es": {
   "rol": "Usuario de a pie",
   "que": "Usa la app como lo haría una persona concreta, con cuentas demo, y cuenta qué le costó.",
   "nivel": "Habitual"
  },
  "en": {
   "rol": "Real user",
   "que": "Uses the app the way one specific person would, on demo accounts, and reports what they struggled with.",
   "nivel": "Regular"
  }
 },
 {
  "nombre": "pentester",
  "depto": "seguridad",
  "svg": "<svg viewBox=\"0 0 100 100\" xmlns=\"http://www.w3.org/2000/svg\" role=\"img\" aria-hidden=\"true\"><path d=\"M22 100v-9c0-11 10-18 28-18s28 7 28 18v9z\" fill=\"#3b82f6\"></path><path d=\"M50 73c-6 0-11 1-15 3l15 10 15-10c-4-2-9-3-15-3z\" fill=\"rgb(44,98,185)\"></path><path d=\"M44 62h12v11c0 2-12 2-12 0z\" fill=\"rgb(217,199,180)\"></path><ellipse cx=\"50\" cy=\"45\" rx=\"19\" ry=\"21\" fill=\"#f7e2cd\"></ellipse><circle cx=\"30\" cy=\"47\" r=\"3.6\" fill=\"#f7e2cd\"></circle><circle cx=\"70\" cy=\"47\" r=\"3.6\" fill=\"#f7e2cd\"></circle><path d=\"M33 46c0 14 7 22 17 22s17-8 17-22c2 16-4 26-17 26s-19-10-17-26z\" fill=\"#7b3f6d\"></path><circle cx=\"42\" cy=\"46\" r=\"2.4\" fill=\"#2a2a2a\"></circle><circle cx=\"58\" cy=\"46\" r=\"2.4\" fill=\"#2a2a2a\"></circle><path d=\"M43 55c3 3 11 3 14 0\" fill=\"none\" stroke=\"#2a2a2a\" stroke-width=\"2\" stroke-linecap=\"round\"></path><g fill=\"#7b3f6d\"><circle cx=\"50\" cy=\"14\" r=\"8\"></circle><path d=\"M31 42c-1-15 8-23 19-23s20 8 19 23c-2-10-7-13-19-13s-17 3-19 13z\"></path></g><g><rect x=\"68\" y=\"80\" width=\"15\" height=\"12\" rx=\"2\" fill=\"#ffffff\" stroke=\"#c3c9d4\" stroke-width=\"1.5\"></rect><path d=\"M83 83h4a3 3 0 0 1 0 6h-4\" fill=\"none\" stroke=\"#c3c9d4\" stroke-width=\"1.5\"></path><rect x=\"70\" y=\"82\" width=\"11\" height=\"3\" fill=\"#8b5a2b\"></rect></g></svg>",
  "modelo": "opus",
  "usos": 30,
  "tipo": "usos",
  "apr": 33,
  "es": {
   "rol": "Red team",
   "que": "Piensa como atacante: arma pruebas de concepto contra el login y los permisos, nunca contra producción.",
   "nivel": "Frecuente"
  },
  "en": {
   "rol": "Red team",
   "que": "Thinks like an attacker: builds proofs of concept against login and permissions, never against production.",
   "nivel": "Frequent"
  }
 },
 {
  "nombre": "security-reviewer",
  "depto": "seguridad",
  "svg": "<svg viewBox=\"0 0 100 100\" xmlns=\"http://www.w3.org/2000/svg\" role=\"img\" aria-hidden=\"true\"><path d=\"M22 100v-9c0-11 10-18 28-18s28 7 28 18v9z\" fill=\"#3b82f6\"></path><path d=\"M50 73c-6 0-11 1-15 3l15 10 15-10c-4-2-9-3-15-3z\" fill=\"rgb(44,98,185)\"></path><path d=\"M44 62h12v11c0 2-12 2-12 0z\" fill=\"rgb(217,199,180)\"></path><ellipse cx=\"50\" cy=\"45\" rx=\"19\" ry=\"21\" fill=\"#f7e2cd\"></ellipse><circle cx=\"30\" cy=\"47\" r=\"3.6\" fill=\"#f7e2cd\"></circle><circle cx=\"70\" cy=\"47\" r=\"3.6\" fill=\"#f7e2cd\"></circle><path d=\"M46 58h8c0 5-1 8-4 8s-4-3-4-8z\" fill=\"#e8e3dc\"></path><g><rect x=\"31\" y=\"40\" width=\"38\" height=\"12\" rx=\"6\" fill=\"#1e293b\"></rect><rect x=\"34\" y=\"43\" width=\"14\" height=\"6\" rx=\"3\" fill=\"#38bdf8\" opacity=\".85\"></rect><rect x=\"52\" y=\"43\" width=\"14\" height=\"6\" rx=\"3\" fill=\"#38bdf8\" opacity=\".85\"></rect></g><g fill=\"#e8e3dc\"><circle cx=\"38\" cy=\"26\" r=\"8\"></circle><circle cx=\"50\" cy=\"21\" r=\"9\"></circle><circle cx=\"62\" cy=\"26\" r=\"8\"></circle><circle cx=\"32\" cy=\"34\" r=\"7\"></circle><circle cx=\"68\" cy=\"34\" r=\"7\"></circle></g></svg>",
  "modelo": "sonnet",
  "usos": 10,
  "tipo": "usos",
  "apr": 3,
  "es": {
   "rol": "Revisor de seguridad",
   "que": "Revisa autenticación, permisos, datos personales y secretos.",
   "nivel": "Habitual"
  },
  "en": {
   "rol": "Security reviewer",
   "que": "Reviews authentication, permissions, personal data and secrets.",
   "nivel": "Regular"
  }
 },
 {
  "nombre": "docs-researcher",
  "depto": "investigacion",
  "svg": "<svg viewBox=\"0 0 100 100\" xmlns=\"http://www.w3.org/2000/svg\" role=\"img\" aria-hidden=\"true\"><path d=\"M22 100v-9c0-11 10-18 28-18s28 7 28 18v9z\" fill=\"#3b82f6\"></path><path d=\"M50 73c-6 0-11 1-15 3l15 10 15-10c-4-2-9-3-15-3z\" fill=\"rgb(44,98,185)\"></path><path d=\"M44 62h12v11c0 2-12 2-12 0z\" fill=\"rgb(217,199,180)\"></path><ellipse cx=\"50\" cy=\"45\" rx=\"19\" ry=\"21\" fill=\"#f7e2cd\"></ellipse><circle cx=\"30\" cy=\"47\" r=\"3.6\" fill=\"#f7e2cd\"></circle><circle cx=\"70\" cy=\"47\" r=\"3.6\" fill=\"#f7e2cd\"></circle><path d=\"M43 52c2-2 5-2 7 0 2-2 5-2 7 0-2 3-12 3-14 0z\" fill=\"#7b3f6d\"></path><circle cx=\"42\" cy=\"46\" r=\"2.4\" fill=\"#2a2a2a\"></circle><circle cx=\"58\" cy=\"46\" r=\"2.4\" fill=\"#2a2a2a\"></circle><path d=\"M45 55h10\" fill=\"none\" stroke=\"#2a2a2a\" stroke-width=\"2\" stroke-linecap=\"round\"></path><path d=\"M32 40c0-12 7-19 18-19s18 7 18 19c0-6-8-9-18-9s-18 3-18 9z\" fill=\"#7b3f6d\" opacity=\".55\"></path><g><rect x=\"66\" y=\"78\" width=\"17\" height=\"14\" rx=\"2\" fill=\"#fef3c7\" stroke=\"rgb(41,91,172)\" stroke-width=\"1.5\"></rect><path d=\"M70 83h9M70 87h9\" stroke=\"#a8a29e\" stroke-width=\"1.4\" stroke-linecap=\"round\"></path></g></svg>",
  "modelo": "sonnet",
  "usos": 7,
  "tipo": "usos",
  "apr": 0,
  "es": {
   "rol": "Investigador de docs",
   "que": "Comprueba APIs y versiones contra la documentación oficial.",
   "nivel": "Habitual"
  },
  "en": {
   "rol": "Docs researcher",
   "que": "Checks APIs and versions against the official documentation.",
   "nivel": "Regular"
  }
 },
 {
  "nombre": "Codex (ChatGPT)",
  "depto": "consultoria",
  "svg": "<svg viewBox=\"0 0 100 100\" xmlns=\"http://www.w3.org/2000/svg\" role=\"img\" aria-hidden=\"true\"><path d=\"M22 100v-9c0-11 10-18 28-18s28 7 28 18v9z\" fill=\"#dc2626\"></path><path d=\"M50 73c-6 0-11 1-15 3l15 10 15-10c-4-2-9-3-15-3z\" fill=\"rgb(165,29,29)\"></path><path d=\"M44 62h12v11c0 2-12 2-12 0z\" fill=\"rgb(107,66,37)\"></path><ellipse cx=\"50\" cy=\"45\" rx=\"19\" ry=\"21\" fill=\"#7a4b2a\"></ellipse><circle cx=\"30\" cy=\"47\" r=\"3.6\" fill=\"#7a4b2a\"></circle><circle cx=\"70\" cy=\"47\" r=\"3.6\" fill=\"#7a4b2a\"></circle><path d=\"M46 58h8c0 5-1 8-4 8s-4-3-4-8z\" fill=\"#2f5d8a\"></path><g stroke=\"#2a2a2a\" stroke-width=\"2.2\" stroke-linecap=\"round\"><path d=\"M39 46h6\"></path><path d=\"M55 46h6\"></path><path d=\"M38 40l7 2M62 40l-7 2\"></path></g><g fill=\"#2f5d8a\"><circle cx=\"38\" cy=\"26\" r=\"8\"></circle><circle cx=\"50\" cy=\"21\" r=\"9\"></circle><circle cx=\"62\" cy=\"26\" r=\"8\"></circle><circle cx=\"32\" cy=\"34\" r=\"7\"></circle><circle cx=\"68\" cy=\"34\" r=\"7\"></circle></g><g><path d=\"M30 44a20 20 0 0 1 40 0\" fill=\"none\" stroke=\"#2f3542\" stroke-width=\"3.5\"></path><rect x=\"25\" y=\"41\" width=\"8\" height=\"13\" rx=\"4\" fill=\"#2f3542\"></rect><rect x=\"67\" y=\"41\" width=\"8\" height=\"13\" rx=\"4\" fill=\"#2f3542\"></rect></g></svg>",
  "modelo": "gpt",
  "usos": 91,
  "tipo": "llamadas",
  "apr": null,
  "es": {
   "rol": "Ojos frescos",
   "que": "Otra IA: critica el diseño antes de programar y busca fallas al final. Solo opina.",
   "nivel": "Muy frecuente"
  },
  "en": {
   "rol": "Fresh eyes",
   "que": "A second AI that critiques the design before coding and hunts for bugs at the end. It advises; it never edits.",
   "nivel": "Very frequent"
  }
 }
];
