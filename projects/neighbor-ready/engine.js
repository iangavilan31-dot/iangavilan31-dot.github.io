/**
 * Pure preparation rules. Priorities are editorial choices, not a risk model.
 * Tasks are selected by explicit household choices, then stably ordered by
 * prerequisites, cost preference, priority, and declaration order.
 * No network, location inference, clinical calculation, or storage occurs here.
 */
const bilingual = (en, es) => Object.freeze({ en, es });
const source = (title, url, en, es) => Object.freeze({ title, url, reviewed: '2026-10-12', summary: bilingual(en, es) });

export const DEFAULT_PROFILE = Object.freeze({
  people: 2, days: 3, hazards: Object.freeze(['outage']), needs: Object.freeze([]),
  budget: 'all', meeting: '', outside: '', contact: '', transport: '', notes: '',
});

export const HAZARDS = Object.freeze([
  Object.freeze({ id: 'outage', label: bilingual('Power outage', 'Corte de energía'), summary: bilingual('Light, charging, and everyday routines.', 'Luz, carga y rutinas diarias.') }),
  Object.freeze({ id: 'flood', label: bilingual('Flooding', 'Inundaciones'), summary: bilingual('Local instructions and departure planning.', 'Instrucciones locales y plan para salir.') }),
  Object.freeze({ id: 'heat', label: bilingual('Extreme heat', 'Calor extremo'), summary: bilingual('A cooler place and a way to reach it.', 'Un lugar más fresco y cómo llegar.') }),
  Object.freeze({ id: 'wildfire', label: bilingual('Wildfire', 'Incendios forestales'), summary: bilingual('Warnings and community evacuation plans.', 'Alertas y planes locales de evacuación.') }),
  Object.freeze({ id: 'storm', label: bilingual('Severe storms', 'Tormentas severas'), summary: bilingual('Warnings and a sturdy shelter.', 'Alertas y un refugio resistente.') }),
]);

export const NEEDS = Object.freeze([
  Object.freeze({ id: 'transport', label: bilingual('No reliable car or ride', 'Sin auto o transporte confiable'), summary: bilingual('Arrange transport and a backup.', 'Acordar transporte y una alternativa.') }),
  Object.freeze({ id: 'mobility', label: bilingual('Mobility or access support', 'Apoyo de movilidad o acceso'), summary: bilingual('Plan assistance and accessible exits.', 'Planear asistencia y salidas accesibles.') }),
  Object.freeze({ id: 'pets', label: bilingual('Pets or service animals', 'Mascotas o animales de servicio'), summary: bilingual('Plan destinations, care, and supplies.', 'Planear destinos, cuidados y suministros.') }),
  Object.freeze({ id: 'dependents', label: bilingual('Children or people relying on care', 'Niños o personas que necesitan cuidados'), summary: bilingual('Coordinate caregivers and daily needs.', 'Coordinar cuidadores y necesidades diarias.') }),
  Object.freeze({ id: 'power', label: bilingual('Equipment that needs electricity', 'Equipos que necesitan electricidad'), summary: bilingual('Ask the provider about backup arrangements.', 'Consultar al proveedor sobre alternativas.') }),
  Object.freeze({ id: 'medications', label: bilingual('Regular medicines', 'Medicamentos habituales'), summary: bilingual('Ask about emergency supply and storage.', 'Consultar sobre reserva y almacenamiento.') }),
]);

export const SOURCES = Object.freeze({
  communications: source('FEMA · Family communication', 'https://www.fema.gov/print/pdf/node/331794',
    'Agree on meeting places and an out-of-area contact.',
    'Acuerden puntos de encuentro y un contacto fuera de la zona.'),
  alerts: source('Ready.gov · FEMA app', 'https://www.ready.gov/fema-app',
    'Use official warning services for changing conditions. The FEMA app includes alerts and shelter information.',
    'Usen servicios oficiales de alertas para condiciones cambiantes. La app de FEMA incluye alertas e información de refugios.'),
  kit: source('Ready.gov · Household supplies', 'https://www.ready.gov/sites/default/files/2019-07/helping_children_cope.pdf',
    'Plan food, hygiene items, and portable supplies around the people who will use them.',
    'Planeen alimentos, higiene y suministros portátiles según las personas que los usarán.'),
  water: source('CDC · Emergency water supply', 'https://www.cdc.gov/water-emergency/about/how-to-create-and-store-an-emergency-water-supply.html',
    'Start with at least one gallon per person per day for three days. Some needs require more.',
    'Empiecen con al menos un galón por persona al día durante tres días. Algunas necesidades requieren más.'),
  tech: source('Ready.gov · Tech and paper backups', 'https://www.ready.gov/resolution',
    'Keep important information accessible, prepare charging alternatives, and plan how to contact each other.',
    'Mantengan accesible la información importante, preparen alternativas de carga y cómo comunicarse.'),
  outage: source('Ready.gov · Power outages', 'https://www.ready.gov/sites/default/files/2020-03/power-outage_information-sheet.pdf',
    'Locate existing supplies and charging options. Discuss electricity-dependent medical devices with your provider.',
    'Localicen suministros y opciones de carga. Consulten con su proveedor sobre equipos médicos que necesitan electricidad.'),
  flood: source('National Weather Service · Flood preparation', 'https://www.weather.gov/jan/beprepared-flooding',
    'Review local flood guidance and warnings. Never enter floodwater on foot or in a vehicle.',
    'Revisen orientación y alertas locales sobre inundaciones. Nunca entren en agua de inundación a pie ni en vehículo.'),
  heat: source('CDC · Cooling access', 'https://www.cdc.gov/mmwr/volumes/74/wr/mm7414a4.htm',
    'A cooling destination needs confirmed hours, access, and transport. Those barriers matter as much as location.',
    'Un lugar fresco necesita horario, acceso y transporte confirmados. Esas barreras importan tanto como la ubicación.'),
  wildfire: source('Ready.gov · Wildfire preparation', 'https://www.ready.gov/sites/default/files/2024-08/ready-gov_wildfire_info-sheet.pdf',
    'Learn community evacuation arrangements before a wildfire. Follow current instructions from local authorities.',
    'Conozcan los planes locales de evacuación antes de un incendio. Sigan instrucciones actuales de las autoridades.'),
  storm: source('National Weather Service · Thunderstorms', 'https://www.weather.gov/media/safety/Thunderstorm-brochure17.pdf',
    'Identify sturdy shelter in advance and practice how the household will reach it.',
    'Identifiquen un refugio resistente con anticipación y practiquen cómo llegará el hogar.'),
  transport: source('Ready.gov · Access and transport', 'https://www.ready.gov/sites/default/files/2023-05/ready.gov_disabilities_bookmark_front-back.pdf',
    'Identify transport needs and include them in an agreed emergency support plan.',
    'Identifiquen las necesidades de transporte en un plan acordado de apoyo para emergencias.'),
  mobility: source('Ready.gov · Personal support planning', 'https://www.ready.gov/sites/default/files/2020-04/disabilities-special-needs_printer-friendly.pdf',
    'Review daily assistance, equipment, and exit alternatives with people who agree to help.',
    'Revisen asistencia diaria, equipos y alternativas para salir con quienes acuerden ayudar.'),
  access: source('CDC · Inclusive preparation', 'https://www.cdc.gov/prepare-your-health/create-community/improve-access.html',
    'Assess assistance needs and form a support network. Ask local officials about available evacuation assistance.',
    'Evalúen asistencia necesaria y formen una red de apoyo. Consulten a autoridades sobre ayuda de evacuación disponible.'),
  pets: source('Ready.gov · Preparing pets', 'https://www.ready.gov/sites/default/files/2023-06/ready.gov_prepare-pets-for-disasters.pdf',
    'Plan animal care and destinations ahead of time. Pack their own food, water, and essentials.',
    'Planeen cuidados y destinos de los animales con anticipación. Preparen su comida, agua y artículos esenciales.'),
  care: source('Ready.gov · Reunification planning', 'https://www.ready.gov/sites/default/files/2025-09/school-districts-role-in-emergency-operations.pdf',
    'Check the actual school or care program’s emergency pickup and reunification procedures.',
    'Consulten los procedimientos reales de recogida y reunificación de la escuela o programa de cuidados.'),
  medication: source('CDC · Prescription preparation', 'https://stacks.cdc.gov/view/cdc/139899/cdc_139899_DS1.pdf',
    'Keep current medicine information and ask a qualified provider about emergency supply and storage.',
    'Mantengan información actual de medicamentos y consulten a un profesional sobre reserva y almacenamiento.'),
  devices: source('FDA · Home medical device checklist', 'https://www.fda.gov/medical-devices/home-health-and-consumer-devices/brochure-home-healthcare-medical-devices-checklist',
    'Ask about operation, backup arrangements, and supplies. Keep provider instructions and emergency contacts available.',
    'Consulten funcionamiento, alternativas y suministros. Mantengan accesibles instrucciones del proveedor y contactos de emergencia.'),
});

const hazardIds = HAZARDS.map(item => item.id);
const needIds = NEEDS.map(item => item.id);
const textLimits = Object.freeze({ meeting: 200, outside: 200, contact: 200, transport: 200, notes: 400 });
const plainObject = input => input !== null && typeof input === 'object' && !Array.isArray(input)
  && (Object.getPrototypeOf(input) === Object.prototype || Object.getPrototypeOf(input) === null);
const boundedNumber = (value, fallback, min, max) => typeof value === 'number' && Number.isFinite(value)
  ? Math.min(max, Math.max(min, Math.trunc(value))) : fallback;
const boundedText = (value, max) => typeof value === 'string'
  ? Array.from(value.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '').trim()).slice(0, max).join('') : '';
const selectedIds = (input, allowed) => Array.isArray(input) ? allowed.filter(id => input.includes(id)) : [];

/** Normalize untrusted UI/storage values into a fresh, whitelisted profile. */
export function normalizeProfile(input) {
  const value = plainObject(input) ? input : {};
  const hazards = selectedIds(value.hazards, hazardIds);
  const result = {
    people: boundedNumber(value.people, DEFAULT_PROFILE.people, 1, 12),
    days: boundedNumber(value.days, DEFAULT_PROFILE.days, 3, 14),
    hazards: hazards.length ? hazards : [...DEFAULT_PROFILE.hazards],
    needs: selectedIds(value.needs, needIds),
    budget: value.budget === 'free' ? 'free' : 'all',
  };
  for (const [key, max] of Object.entries(textLimits)) result[key] = boundedText(value[key], max);
  return result;
}

/** US liquid gallons; this is a planning baseline, not an individual requirement. */
export function waterTarget(profile) {
  const { people, days } = normalizeProfile(profile);
  const gallons = people * days;
  return { gallons, liters: Math.round(gallons * 3.785411784 * 10) / 10 };
}

const always = () => true;
const hazard = id => profile => profile.hazards.includes(id);
const need = id => profile => profile.needs.includes(id);
const supportNeeded = profile => ['transport', 'mobility', 'dependents', 'power'].some(id => profile.needs.includes(id));
const task = (id, titleEn, titleEs, bodyEn, bodyEs, whyEn, whyEs, category, minutes, cost, priority, sourceId, requires = [], when = always) => ({
  id, title: bilingual(titleEn, titleEs), body: bilingual(bodyEn, bodyEs), why: bilingual(whyEn, whyEs),
  category, minutes, cost, priority, sourceId, requires, when,
});

const rules = [
  task('contacts', 'Agree on an out-of-area contact', 'Acordar un contacto fuera de la zona',
    'Ask an out-of-area person to be your contact. Share their number.',
    'Pidan a alguien fuera de su zona que sea el contacto. Compartan su número.',
    'A shared contact helps people reconnect when separated.', 'Un contacto común ayuda a reunirse cuando están separados.',
    'communication', 5, 'free', 2, 'communications'),
  task('meeting', 'Choose two meeting places', 'Elegir dos puntos de encuentro',
    'Agree on nearby and out-of-neighborhood places. Check that everyone can reach them.',
    'Acuerden un lugar cercano y otro fuera del vecindario. Verifiquen que todos puedan llegar.',
    'Home or the neighborhood may be affected.', 'La vivienda o el vecindario pueden quedar afectados.',
    'communication', 10, 'free', 2, 'communications'),
  task('alerts', 'Set up official warnings', 'Preparar alertas oficiales',
    'Find your local emergency office’s warning service. Review FEMA’s app and a radio backup.',
    'Busquen las alertas de su oficina local de emergencias. Revisen la app de FEMA y una radio de respaldo.',
    'You selected hazards; changing conditions need current official information.', 'Eligieron peligros; las condiciones cambiantes requieren información oficial actual.',
    'information', 10, 'free', 2, 'alerts'),
  task('inventory', 'Start with what you have', 'Empezar con lo que tienen',
    'Locate existing lights, chargers, and emergency supplies. List the gaps before buying anything.',
    'Localicen luces, cargadores y suministros de emergencia. Anoten lo que falta antes de comprar.',
    'Existing supplies can make your next step practical.', 'Los suministros existentes ayudan a definir el siguiente paso.',
    'supplies', 10, 'free', 2, 'outage'),
  task('water', 'Plan your water supply', 'Planear la reserva de agua',
    'Use the people × days baseline below. Check storage and extra needs, including animals, before gathering water.',
    'Usen la base personas × días indicada abajo. Revisen almacenamiento y necesidades adicionales, incluidos animales, antes de reunir agua.',
    'Your household size and planning period determine this baseline.', 'El tamaño del hogar y los días elegidos determinan esta base.',
    'supplies', 15, 'supplies', 2, 'water', ['inventory']),
  task('food', 'Close food and hygiene gaps', 'Resolver faltantes de comida e higiene',
    'Gather food that needs little preparation, a manual opener if needed, and household hygiene supplies.',
    'Reúnan alimentos de preparación sencilla, un abrelatas manual si hace falta y artículos de higiene.',
    'Supplies need to fit actual household routines.', 'Los suministros deben ajustarse a las rutinas del hogar.',
    'supplies', 20, 'supplies', 2, 'kit', ['inventory']),
  task('portable-kit', 'Make supplies easy to take', 'Preparar suministros para llevar',
    'Put essentials in a portable container. Choose something the people carrying it can manage.',
    'Guarden lo esencial en un recipiente portátil. Elijan algo que puedan transportar quienes lo llevarán.',
    'You may need to leave with little time to gather items.', 'Podrían tener que salir con poco tiempo para reunir artículos.',
    'supplies', 15, 'supplies', 3, 'kit', ['inventory']),
  task('paper', 'Keep a paper and offline copy', 'Guardar una copia en papel y sin conexión',
    'Print the agreed details. If saving here, test reopening offline and keep paper where everyone can find it.',
    'Impriman lo acordado. Si guardan aquí, prueben abrir sin conexión y dejen el papel accesible para todos.',
    'Connectivity and device power may be unavailable.', 'La conexión y la batería pueden no estar disponibles.',
    'communication', 5, 'free', 3, 'tech', ['contacts', 'meeting']),
  task('practice', 'Walk through the plan together', 'Revisar el plan juntos',
    'Discuss separation, support, and finding your copy. Write down arrangements that still need confirmation.',
    'Conversen sobre separación, apoyo y dónde está la copia. Anoten acuerdos que aún necesitan confirmación.',
    'A conversation can reveal unconfirmed details.', 'Una conversación puede revelar detalles sin confirmar.',
    'practice', 10, 'free', 3, 'mobility', ['paper']),
  task('outage-charge', 'Check lights and phone charging', 'Revisar luces y carga del teléfono',
    'Test your lights and charging alternatives. Keep devices charged before expected outages.',
    'Prueben las luces y alternativas de carga. Mantengan cargados los dispositivos antes de cortes previstos.',
    'You selected power outage preparation.', 'Eligieron prepararse para cortes de energía.',
    'hazard', 10, 'free', 2, 'outage', ['inventory'], hazard('outage')),
  task('flood-plan', 'Review local flood instructions', 'Revisar instrucciones locales de inundación',
    'Review local warnings and evacuation arrangements in advance. Never walk or drive through floodwater.',
    'Revisen alertas y planes locales de evacuación con anticipación. Nunca caminen ni conduzcan por agua de inundación.',
    'You selected flooding; familiar routes can become unsafe.', 'Eligieron inundaciones; las rutas conocidas pueden volverse peligrosas.',
    'hazard', 10, 'free', 2, 'flood', [], hazard('flood')),
  task('heat-place', 'Confirm somewhere cooler', 'Confirmar un lugar más fresco',
    'Ask about a cooling destination’s current hours, access, transport, and animal policies before relying on it.',
    'Consulten horario actual, acceso, transporte y normas para animales de un lugar fresco antes de depender de él.',
    'You selected heat; a destination must be reachable and available.', 'Eligieron calor; el destino debe ser accesible y estar disponible.',
    'hazard', 15, 'free', 2, 'heat', [], hazard('heat')),
  task('wildfire-plan', 'Review community evacuation plans', 'Revisar planes locales de evacuación',
    'Learn official departure options and warning channels. Follow current local evacuation instructions.',
    'Conozcan las opciones oficiales para salir y recibir alertas. Sigan instrucciones locales actuales de evacuación.',
    'You selected wildfire preparation; conditions can change quickly.', 'Eligieron prepararse para incendios; las condiciones pueden cambiar rápidamente.',
    'hazard', 15, 'free', 2, 'wildfire', [], hazard('wildfire')),
  task('storm-shelter', 'Identify sturdy storm shelter', 'Identificar refugio resistente para tormentas',
    'Review official storm guidance and the building’s shelter plan. Discuss how everyone will reach shelter in time.',
    'Revisen orientación oficial sobre tormentas y el plan del edificio. Acuerden cómo todos llegarán al refugio a tiempo.',
    'You selected severe storms; shelter needs planning before warnings.', 'Eligieron tormentas severas; el refugio requiere preparación previa a las alertas.',
    'hazard', 10, 'free', 2, 'storm', [], hazard('storm')),
  task('support-network', 'Ask people to join your support plan', 'Pedir apoyo para su plan',
    'Ask trusted people what help they can actually provide. Agree on a backup and how to reconnect.',
    'Pregunten a personas de confianza qué ayuda pueden ofrecer. Acuerden una alternativa y cómo comunicarse.',
    'You selected needs that may require agreed help from others.', 'Eligieron necesidades que pueden requerir ayuda acordada con otras personas.',
    'access', 15, 'free', 1, 'access', [], supportNeeded),
  task('transport-support', 'Confirm a ride and a backup', 'Confirmar transporte y una alternativa',
    'Ask a support person or local emergency office about transport. Confirm access, equipment, and a backup.',
    'Consulten transporte con alguien de apoyo o la oficina de emergencias. Confirmen acceso, equipos y una alternativa.',
    'You selected no reliable car or ride; transport cannot be assumed.', 'Eligieron transporte no confiable; no se debe dar por hecho.',
    'access', 15, 'free', 1, 'transport', ['support-network'], need('transport')),
  task('mobility-assess', 'Review accessible exits and assistance', 'Revisar salidas accesibles y asistencia',
    'Review exits with your support people and building manager. Discuss alternatives if elevators are unavailable.',
    'Revisen salidas con su apoyo y responsable del edificio. Acuerden alternativas si los ascensores no funcionan.',
    'You selected mobility or access support.', 'Eligieron apoyo de movilidad o acceso.',
    'access', 20, 'free', 1, 'mobility', ['support-network'], need('mobility')),
  task('pet-destination', 'Confirm a destination for your animals', 'Confirmar un destino para sus animales',
    'Check animal policies with potential destinations. Agree who can help with care or transport.',
    'Confirmen las normas para animales en posibles destinos. Acuerden quién ayudará con cuidados o transporte.',
    'You selected animals; pet access varies by destination.', 'Eligieron animales; el acceso de mascotas depende del destino.',
    'care', 15, 'free', 1, 'pets', [], need('pets')),
  task('pet-kit', 'Pack your animals’ essentials', 'Preparar lo esencial para sus animales',
    'Gather animal food, water, medicines, identification, and a suitable carrier or leash as needed.',
    'Reúnan comida, agua, medicamentos, identificación y transportín o correa adecuados según haga falta.',
    'Animals need supplies beyond the human water baseline.', 'Los animales necesitan suministros además de la base de agua humana.',
    'care', 20, 'supplies', 2, 'pets', ['inventory'], need('pets')),
  task('dependent-handoff', 'Confirm caregiver and pickup arrangements', 'Confirmar cuidadores y recogida',
    'Ask each school or care program about emergency handoffs. Confirm who is authorized and a backup caregiver.',
    'Consulten a la escuela o programa sobre entrega en emergencias. Confirmen personas autorizadas y un cuidador alternativo.',
    'You selected people relying on care; handoffs need agreement.', 'Eligieron personas que dependen de cuidados; la entrega requiere acuerdos.',
    'care', 15, 'free', 1, 'care', [], need('dependents')),
  task('device-provider', 'Make an equipment plan with your provider', 'Planear equipos con su proveedor',
    'Ask your care team or equipment provider what to do during an outage. Record their instructions and support contacts.',
    'Pregunten al equipo médico o proveedor qué hacer en un corte. Anoten sus instrucciones y contactos de apoyo.',
    'You selected electricity-dependent equipment; backup needs individual advice.', 'Eligieron equipos eléctricos; las alternativas necesitan orientación individual.',
    'health', 20, 'free', 1, 'devices', [], need('power')),
  task('device-backup', 'Check the agreed equipment backup', 'Revisar el respaldo acordado de equipos',
    'With your provider, confirm backup equipment, supplies, and an alternate care arrangement. Follow their instructions.',
    'Con su proveedor, confirmen equipos de respaldo, suministros y una alternativa de cuidados. Sigan sus instrucciones.',
    'The provider’s plan should guide what you prepare.', 'El plan del proveedor debe orientar la preparación.',
    'health', 20, 'supplies', 1, 'devices', ['device-provider'], need('power')),
  task('medication-plan', 'Ask about medicine supply and storage', 'Consultar reserva y almacenamiento de medicamentos',
    'Ask your pharmacist or clinician about emergency refills and storage. Keep a current medicine list with their instructions.',
    'Consulten al farmacéutico o profesional sobre reserva y almacenamiento. Guarden una lista actual con sus instrucciones.',
    'You selected regular medicines; preparation depends on the actual prescriptions.', 'Eligieron medicamentos habituales; la preparación depende de las recetas reales.',
    'health', 15, 'free', 1, 'medication', [], need('medications')),
];

const knownTaskIds = new Set(rules.map(rule => rule.id));

/** Return a fresh, deterministic topological ordering of applicable rules. */
export function generatePlan(input) {
  const profile = normalizeProfile(input);
  const tasks = rules.filter(rule => rule.when(profile)).map(({ when, ...entry }, index) => ({
    ...entry, title: { ...entry.title }, body: { ...entry.body }, why: { ...entry.why }, requires: [...entry.requires], index,
  }));
  const activeIds = new Set(tasks.map(entry => entry.id));
  for (const entry of tasks) entry.requires = entry.requires.filter(id => activeIds.has(id));
  const paper = tasks.find(entry => entry.id === 'paper');
  const coordination = ['transport-support', 'mobility-assess', 'pet-destination', 'dependent-handoff', 'device-provider', 'medication-plan'];
  paper.requires.push(...coordination.filter(id => activeIds.has(id)));

  const compare = (left, right) => {
    if (profile.budget === 'free' && left.cost !== right.cost) return left.cost === 'free' ? -1 : 1;
    return left.priority - right.priority || left.index - right.index;
  };
  const remaining = [...tasks];
  const ordered = [];
  const placed = new Set();
  while (remaining.length) {
    const available = remaining.filter(entry => entry.requires.every(id => placed.has(id))).sort(compare);
    // Internal programming error: every rule graph must be acyclic and complete.
    if (!available.length) throw new Error('The preparation rule dependencies need repair.');
    const chosen = available[0];
    remaining.splice(remaining.indexOf(chosen), 1);
    placed.add(chosen.id);
    const { index, ...entry } = chosen;
    ordered.push(entry);
  }
  return ordered;
}

/** Completion is self-reported. A completed child does not complete its parent. */
export function getPlanState(profile, completedIds = []) {
  const tasks = generatePlan(profile);
  const ids = new Set(tasks.map(entry => entry.id));
  const completed = new Set(Array.isArray(completedIds) ? completedIds.filter(id => typeof id === 'string' && ids.has(id)) : []);
  const completedTasks = tasks.filter(entry => completed.has(entry.id));
  const pendingTasks = tasks.filter(entry => !completed.has(entry.id));
  const readyTasks = pendingTasks.filter(entry => entry.requires.every(id => completed.has(id)));
  const blockedTasks = pendingTasks.filter(entry => entry.requires.some(id => !completed.has(id)));
  const done = completedTasks.length;
  return { tasks, readyTasks, pendingTasks, blockedTasks, completedTasks, total: tasks.length, done, percent: Math.round(done / tasks.length * 100) };
}

/** Strict imports fail with a useful reason; routine UI normalization can clamp. */
export function validateImport(input) {
  let envelope = input;
  if (typeof input === 'string') {
    if (input.length > 131072) throw new Error('The backup is too large. Choose a NeighborReady backup smaller than 128 KB.');
    try { envelope = JSON.parse(input); }
    catch { throw new Error('The backup is not valid JSON. Choose an exported NeighborReady JSON file.'); }
  }
  if (!plainObject(envelope)) throw new Error('The backup must be a NeighborReady JSON object.');
  if (envelope.schemaVersion !== 1) throw new Error('This backup version is unsupported. Choose a version 1 NeighborReady backup.');
  if (!plainObject(envelope.profile)) throw new Error('The backup is missing a household profile.');
  const profile = envelope.profile;
  for (const [key, min, max] of [['people', 1, 12], ['days', 3, 14]]) {
    if (!Number.isInteger(profile[key]) || profile[key] < min || profile[key] > max) {
      throw new Error(`The backup’s ${key} must be a whole number from ${min} to ${max}.`);
    }
  }
  for (const [key, allowed] of [['hazards', hazardIds], ['needs', needIds]]) {
    if (!Array.isArray(profile[key]) || profile[key].length > allowed.length || profile[key].some(id => typeof id !== 'string' || !allowed.includes(id))) {
      throw new Error(`The backup contains invalid ${key}. Choose a current NeighborReady backup.`);
    }
  }
  if (!profile.hazards.length) throw new Error('The backup needs at least one selected hazard.');
  if (!['all', 'free'].includes(profile.budget)) throw new Error('The backup’s budget choice must be all or free.');
  for (const [key, max] of Object.entries(textLimits)) {
    if (profile[key] !== undefined && (typeof profile[key] !== 'string' || Array.from(profile[key]).length > max)) {
      throw new Error(`The backup’s ${key} must be text of at most ${max} characters.`);
    }
  }
  if (!Array.isArray(envelope.completed) || envelope.completed.length > 256 || envelope.completed.some(id => typeof id !== 'string' || !knownTaskIds.has(id))) {
    throw new Error('The backup contains an unrecognized completed step. Choose an unmodified NeighborReady backup.');
  }
  if (envelope.exportedAt !== undefined && (typeof envelope.exportedAt !== 'string' || envelope.exportedAt.length > 64 || !Number.isFinite(Date.parse(envelope.exportedAt)))) {
    throw new Error('The backup has an invalid export date. Choose an unmodified NeighborReady backup.');
  }
  const normalized = normalizeProfile(profile);
  const applicable = new Set(generatePlan(normalized).map(entry => entry.id));
  return { profile: normalized, completed: [...new Set(envelope.completed)].filter(id => applicable.has(id)) };
}
