'use client';
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

// ===========================================
// CONSTANTS
// ===========================================
const BG = '#F4F6F8', CARD = '#FFFFFF', BORDER = '#E6EAF0', MUTED = '#8E95A2', TEXT = '#1B2030', SUBTEXT = '#5A6070', TEAL = '#2AA198', SAGE = '#3DA07A', CORAL = '#E06856', PURPLE = '#8B6CC1', ROYAL = '#3366CC', GOLD = '#E5A100';
const COLORS = { chloe: ROYAL, cameron: TEAL, shared: PURPLE, kids: GOLD, home: '#9CA3AF' };
const STATUS_CONFIG = { 'needs-love': { label: 'Needs love', emoji: '💛', color: CORAL, bg: '#FEF0ED', sort: 0 }, 'heads-up': { label: 'Heads up', emoji: '👀', color: PURPLE, bg: '#F3EFF8', sort: 1 }, handled: { label: 'Handled', color: SAGE, bg: '#EBF7F2', sort: 2 } };
const STATUS_OPTIONS = ['needs-love', 'heads-up', 'handled'];
const COOK_OPTIONS = ['Chloë', 'Cameron', 'Together', 'Takeout', 'Out', '—'];
const OWNER_OPTIONS = ['Chloë', 'Cameron', 'Both', '—'];
const AISLES = [{ id: 'fruit-veg', label: 'Fruit + Veg', emoji: '🥦' }, { id: 'dairy', label: 'Dairy', emoji: '🧀' }, { id: 'meat', label: 'Meat', emoji: '🥩' }, { id: 'bread', label: 'Bread', emoji: '🍞' }, { id: 'dry', label: 'Dry Goods', emoji: '🫘' }, { id: 'toiletries', label: 'Toiletries', emoji: '🧴' }, { id: 'household', label: 'Household', emoji: '🧹' }, { id: 'other', label: 'Other', emoji: '📦' }];

const EXERCISE_TYPES = [
  { id: 'chloe', label: 'Chloë', color: ROYAL },
  { id: 'cameron', label: 'Cameron', color: TEAL },
  { id: 'together', label: 'Together', color: PURPLE },
];
const SOCIAL_TYPES = [
  { id: 'chloe', label: 'Chloë', color: ROYAL },
  { id: 'cameron', label: 'Cameron', color: TEAL },
  { id: 'tom', label: 'Tom', color: '#D49200' },
  { id: 'luke', label: 'Luke', color: GOLD },
  { id: 'c+c', label: 'C+C', color: PURPLE },
  { id: 't+l', label: 'T+L', color: GOLD },
  { id: 'family', label: 'Family', color: '#8B6CC1' },
];
const LOGISTICS_OPTIONS = ['—', 'Chloë', 'Cameron', 'Together', 'JP or Patrick', 'Other'];
const LOGISTICS_COLORS = { '—': MUTED, 'Chloë': ROYAL, 'Cameron': TEAL, 'Together': PURPLE, 'JP or Patrick': '#D49200', 'Other': '#8E95A2' };


// ===========================================
// DEFAULT DATA
// ===========================================
const DEFAULT_REGISTRY = {
  home: { label: 'Home', emoji: '🏠', items: [
    { name: 'Cleaning', status: 'handled', owner: 'Chloë', rhythm: 'Mon/Wed/Thu', next: 'Mon 14 Apr', contacts: [{ name: 'Thandi', role: 'Cleaner', phone: '071 XXX XXXX' }], notes: 'Has keys. Mondays deep clean, Wed/Thu general.' },
    { name: 'Garden service', status: 'handled', owner: 'Cameron', rhythm: 'Weekly', next: 'Tue 15 Apr', contacts: [{ name: 'Green Fingers', role: 'Garden', phone: '082 XXX XXXX' }] },
    { name: 'Pool service', status: 'handled', owner: 'Cameron', rhythm: 'Weekly', next: 'Wed 16 Apr', contacts: [{ name: 'Pool Pro', role: 'Pool', phone: '076 XXX XXXX' }] },
    { name: 'Aircon service', status: 'needs-love', owner: 'Cameron', rhythm: 'Annually', next: 'Was due Mar 2026', contacts: [{ name: 'Cape Aircon', role: 'Service', phone: '021 XXX XXXX' }], notes: 'Last done Mar 2025. 3 units.', action: 'Book service' },
    { name: 'Vacuum filters', status: 'heads-up', owner: 'Chloë', rhythm: 'Every 3 months', next: 'Apr 20', notes: 'Dyson V15 SV22.', links: [{ label: 'Order filters', url: '#' }] },
  ]},
  vehicles: { label: 'Vehicles', emoji: '🚗', items: [
    { name: 'Jimny', status: 'handled', owner: 'Chloë', rhythm: 'Annually', next: 'Jul 2026', contacts: [{ name: 'Suzuki Tygerberg', role: 'Dealer', phone: '021 XXX XXXX' }], notes: '38,400km. Service plan to 60k/2028.', docs: ['Service book', 'Insurance cert', 'Service history'], details: { reg: 'CA XXX XXX', colour: 'Kinetic Yellow' } },
    { name: 'Jimny licence disk', status: 'handled', owner: 'Chloë', rhythm: 'Annually', next: 'Sep 2026', links: [{ label: 'WC eServices', url: '#' }] },
    { name: "Cameron's car", status: 'heads-up', owner: 'Cameron', rhythm: 'Annually', next: 'Service due May 2026', docs: ['Service book', 'Insurance cert'], action: 'Book service' },
  ]},
  kids: { label: 'Tom & Luke', emoji: '👦', items: [
    { name: 'Tom (13)', status: 'handled', owner: 'Both', rhythm: '—', next: '—', notes: 'No allergies. Discovery Coastal.', details: { age: '13', school: 'Grade 8', shoeSize: 'UK 7', clothing: '13-14 / Men S', nonUniform: 'Jeans 28, T-shirt S' }, contacts: [{ name: 'Dr van der Merwe', role: 'Dentist', phone: '021 XXX' }] },
    { name: 'Luke (11)', status: 'handled', owner: 'Both', rhythm: '—', next: '—', notes: 'Slight astigmatism left eye.', details: { age: '11', school: 'Grade 6', shoeSize: 'UK 5', clothing: '11-12 yrs', nonUniform: 'Jeans 26, T-shirt 11-12' }, contacts: [{ name: 'Spec-Savers', role: 'Optom', phone: '021 XXX' }] },
    { name: 'Tom dentist', status: 'needs-love', owner: 'Chloë', rhythm: 'Annually', next: 'Was due Feb 2026', action: 'Book appointment' },
    { name: 'Luke eye test', status: 'heads-up', owner: 'Chloë', rhythm: 'Annually', next: 'Apr 2026', action: 'Book appointment' },
    { name: 'School fees Term 2', status: 'handled', owner: 'Cameron', rhythm: 'Per term', next: 'Paid ✓', docs: ['Invoice', 'Payment proof'] },
    { name: 'Extra maths (Tom)', status: 'handled', owner: 'Chloë', rhythm: 'Weekly Tue', next: 'Tue 15 Apr', contacts: [{ name: 'Mrs Jacobs', role: 'Tutor', phone: '083 XXX' }], notes: 'R450/session. Tuesdays 3:30pm.' },
    { name: 'Cricket (Luke)', status: 'handled', owner: 'Cameron', rhythm: 'Weekly Sat', next: 'Sat 19 Apr' },
    { name: 'School uniforms', status: 'handled', owner: 'Chloë', rhythm: 'As needed', next: 'Check start of term', notes: 'Tom: blazer 13-14, shirt 38, shorts 30. Luke: blazer 11-12, shirt 34, shorts 28.' },
  ]},
  health: { label: 'Health', emoji: '🩺', items: [
    { name: 'Chloë bloods', status: 'heads-up', owner: 'Chloë', rhythm: 'Bi-annual', next: 'Apr 2026', contacts: [{ name: 'Pathcare Newlands', role: 'Lab', phone: '021 XXX' }], docs: ['Results Oct 2025'], action: 'Book bloods' },
    { name: 'Chloë hygienist', status: 'handled', owner: 'Chloë', rhythm: 'Twice yearly', next: 'Jun 2026' },
    { name: 'Chloë mole mapping', status: 'handled', owner: 'Chloë', rhythm: 'Annually', next: 'Nov 2026', docs: ['Report Nov 2025'] },
    { name: 'Cameron GP', status: 'needs-love', owner: 'Cameron', rhythm: 'Annually', next: 'Was due Jan 2026', contacts: [{ name: 'Dr Pillay', role: 'GP', phone: '021 XXX' }], action: 'Book check-up' },
    { name: 'Cameron dentist', status: 'handled', owner: 'Cameron', rhythm: 'Annually', next: 'Aug 2026' },
  ]},
  finance: { label: 'Finance & Legal', emoji: '💰', items: [
    { name: 'UK tax filing', status: 'heads-up', owner: 'Chloë', rhythm: 'Annually', next: 'Due Jul 2026', contacts: [{ name: 'James', role: 'UK tax', phone: '+44 XXX' }], docs: ["Last year's return"], action: 'Schedule call' },
    { name: 'SA financial advisor', status: 'needs-love', owner: 'Chloë', rhythm: 'Bi-annual', next: 'Was due Mar 2026', contacts: [{ name: 'Mark (Dovetail)', role: 'FA', phone: '082 XXX' }], action: 'Schedule call' },
    { name: 'Wills update', status: 'needs-love', owner: 'Both', rhythm: 'Every 2 years', next: 'Last updated 2023', docs: ['Current wills (2023)'], action: 'Book appointment' },
    { name: 'Monthly budget', status: 'handled', owner: 'Both', rhythm: 'Monthly', next: 'May 1', links: [{ label: 'Budget sheet', url: '#' }] },
  ]},
  documents: { label: 'Documents', emoji: '📄', items: [
    { name: 'Chloë SA passport', status: 'handled', owner: 'Chloë', rhythm: '10 years', next: 'Expires 2031', details: { number: 'AXXXXXXX', expires: '2031' }, docs: ['Scan'] },
    { name: 'Chloë UK passport', status: 'heads-up', owner: 'Chloë', rhythm: '10 years', next: 'Expires Dec 2026', notes: '6-month rule. Unusable from Jun 2026.', docs: ['Scan'], action: 'Start renewal' },
    { name: 'Cameron NZ passport', status: 'handled', owner: 'Cameron', rhythm: '10 years', next: 'Expires 2029' },
    { name: 'Tom SA passport', status: 'handled', owner: 'Chloë', rhythm: '5 years', next: 'Expires 2028', notes: 'Also NZ, UK, Finnish.' },
    { name: 'Luke SA passport', status: 'handled', owner: 'Chloë', rhythm: '5 years', next: 'Expires 2028', notes: 'Also NZ, UK, Finnish.' },
  ]},
  rentals: { label: 'Rentals', emoji: '🏘️', items: [
    { name: 'Property 1', status: 'handled', owner: 'Chloë', rhythm: 'Annually', next: 'Lease Oct 2026', contacts: [{ name: 'Sarah', role: 'Tenant', phone: '079 XXX' }], docs: ['Lease', 'Deposit receipt'], notes: 'R12,500/m auto debit.' },
    { name: 'Property 2 geyser', status: 'heads-up', owner: 'Chloë', rhythm: 'Ad hoc', next: 'Flagged by tenant', contacts: [{ name: 'Johan', role: 'Tenant', phone: '082 XXX' }, { name: 'Dave', role: 'Plumber', phone: '073 XXX' }], action: 'Call plumber' },
  ]},
  equipment: { label: 'Equipment', emoji: '🚲', items: [
    { name: "Chloë's bike", status: 'handled', owner: 'Chloë', rhythm: 'Annually', next: 'Aug 2026', details: { type: 'Road bike' } },
    { name: "Cameron's bike", status: 'handled', owner: 'Cameron', rhythm: 'Annually', next: 'Sep 2026', details: { type: 'MTB' } },
    { name: 'SUPs', status: 'handled', owner: 'Both', rhythm: 'Before summer', next: 'Oct 2026', notes: '2x boards in garage.' },
  ]},
  social: { label: 'People & Social', emoji: '🎂', items: [
    { name: "Cameron's mom birthday", status: 'heads-up', owner: 'Both', rhythm: 'Annual', next: 'Apr 28', notes: 'Last year: Jonkershuis lunch.', action: 'Get gift sorted' },
  ]},
  appliances: { label: 'Appliances', emoji: '🔌', items: [
    { name: 'Fridge', status: 'handled', owner: 'Chloë', rhythm: 'Annually', next: 'Warranty 2028', details: { brand: 'Samsung', model: 'RF28XXXXX', purchased: '2023' }, docs: ['Warranty', 'Receipt'] },
    { name: 'Washing machine', status: 'handled', owner: 'Chloë', rhythm: 'Annually', next: 'Warranty 2027', details: { brand: 'LG', purchased: '2022' }, docs: ['Warranty'] },
    { name: 'Oven', status: 'heads-up', owner: 'Cameron', rhythm: 'Annually', next: 'May 2026', details: { brand: 'Smeg' }, action: 'Book service' },
  ]},
  other: { label: 'Other', emoji: '📌', items: [{ name: 'Add anything here', status: 'handled', owner: '—', rhythm: '—', next: '—', notes: 'Catch-all.' }] },
};

const DEFAULT_MEALS = [
  { day: 'Sunday', meal: 'Roast Chicken + Veggies', who: 'Chloë' },
  { day: 'Monday', meal: 'Lean Girl Ostrich Mince Nachos', who: 'Cameron' },
  { day: 'Tuesday', meal: 'Trout, Veg + Salad', who: 'Chloë' },
  { day: 'Wednesday', meal: 'Pesto Pasta', who: 'Cameron' },
  { day: 'Thursday', meal: 'Saucy Beef Strips + Rice Bowl', who: 'Chloë' },
  { day: 'Friday', meal: 'Dinner Out 🍷', who: '—' },
  { day: 'Saturday', meal: 'Braai 🔥', who: 'Cameron' },
];

const DEFAULT_WEEKLY = {
  'fruit-veg': [{ id: 1, text: 'Bananas', checked: false }, { id: 2, text: 'Avocados x3', checked: false }, { id: 3, text: 'Broccoli', checked: false }, { id: 4, text: 'Cherry tomatoes', checked: false }, { id: 5, text: 'Salad leaves', checked: false }, { id: 6, text: 'Lemons', checked: false }],
  dairy: [{ id: 7, text: 'Milk (2L)', checked: false }, { id: 8, text: 'Greek yoghurt', checked: false }, { id: 9, text: 'Cheddar', checked: false }],
  meat: [{ id: 11, text: 'Ostrich Mince x2', checked: false }, { id: 12, text: 'Trout fillets x4', checked: false }, { id: 13, text: 'Beef strips 500g', checked: false }, { id: 14, text: 'Whole chicken', checked: false }],
  bread: [{ id: 16, text: 'Sourdough loaf', checked: false }, { id: 17, text: 'Wraps', checked: false }],
  dry: [{ id: 18, text: 'Penne pasta', checked: false }, { id: 19, text: 'Basmati rice', checked: false }, { id: 20, text: 'Nacho chips', checked: false }, { id: 21, text: 'Pesto jar', checked: false }],
  toiletries: [{ id: 22, text: 'Sunscreen SPF50', checked: false }],
  household: [{ id: 23, text: 'Dishwasher tablets', checked: false }, { id: 24, text: 'Bin bags', checked: false }],
  other: [{ id: 25, text: 'Coffee beans', checked: false }, { id: 26, text: 'Eggs x18', checked: false }],
};
const DEFAULT_MONTHLY = [{ id: 30, text: 'Washing powder', checked: false }, { id: 31, text: 'Olive oil', checked: false }, { id: 32, text: 'Cling wrap', checked: false }];
const DEFAULT_TOBUY = [{ id: 40, text: 'Tom cricket whites (13-14)', checked: false }, { id: 41, text: 'Luke school shoes (UK 5)', checked: false }, { id: 42, text: "Cameron's mom gift", checked: false }, { id: 43, text: 'Dyson filters x2', checked: false }];

// Dynamic week view builder - aggregates data from all sources
function buildWeekView(weekKey, { meals, exercise, socialSched, kidLogistics, custody, registry }) {
  const today = new Date();
  const dow = today.getDay();
  const daysToMonday = dow === 0 ? -6 : 1 - dow;
  const weekOffset = weekKey === 'nextWeek' ? 7 : 0;

  const monday = new Date(today);
  monday.setDate(today.getDate() + daysToMonday + weekOffset);
  monday.setHours(0, 0, 0, 0);

  const dayFullNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const dayShortNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const days = [];
  const todayStr = new Date(today); todayStr.setHours(0, 0, 0, 0);

  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    const date = d.getDate();
    const month = monthNames[d.getMonth()];
    const dayShort = dayShortNames[i];
    const dayFull = dayFullNames[i];
    const isToday = d.getTime() === todayStr.getTime();
    const label = `${dayShort} ${date}`;

    const tags = [];

    // 1. Custody handover
    if (custody?.[weekKey]) {
      const cd = custody[weekKey];
      const thisLoc = cd[i]?.loc;
      let prevLoc;
      if (i === 0) {
        prevLoc = weekKey === 'nextWeek' ? custody.thisWeek?.[6]?.loc : null;
      } else {
        prevLoc = cd[i - 1]?.loc;
      }
      if (thisLoc && prevLoc && thisLoc !== prevLoc) {
        tags.push({ text: thisLoc === 'N' ? 'Boys from Kommetjie' : 'Boys to Kommetjie', color: COLORS.kids });
      }
    }

    // 2. Meals (dinner + cook)
    if (meals) {
      const meal = meals.find(m => m.day === dayFull);
      if (meal && meal.meal) {
        tags.push({ text: `🍽️ ${meal.meal}`, color: COLORS.shared });
        if (meal.who && meal.who !== '—') {
          const cc = meal.who === 'Chloë' ? COLORS.chloe : meal.who === 'Cameron' ? COLORS.cameron : meal.who === 'Together' ? COLORS.shared : MUTED;
          tags.push({ text: `${meal.who} cooks`, color: cc });
        }
      }
    }

    // 3. Exercise
    if (exercise?.[weekKey]?.[i]) {
      exercise[weekKey][i].entries.forEach(e => {
        const tc = EXERCISE_TYPES.find(t => t.id === e.type);
        if (tc) tags.push({ text: `${tc.label}: ${e.what}`, color: tc.color });
      });
    }

    // 4. Social
    if (socialSched?.[weekKey]?.[i]) {
      socialSched[weekKey][i].entries.forEach(e => {
        const tc = SOCIAL_TYPES.find(t => t.id === e.type);
        if (tc) tags.push({ text: `${tc.label}: ${e.what}`, color: tc.color });
      });
    }

    // 5. Kid logistics (Mon-Fri)
    if (kidLogistics?.[weekKey]?.[i] && i < 5) {
      const kl = kidLogistics[weekKey][i];
      if (kl.dropoff && kl.dropoff !== '—') tags.push({ text: `Drop-off: ${kl.dropoff}`, color: COLORS.kids });
      if (kl.pickup && kl.pickup !== '—') tags.push({ text: `Pick-up: ${kl.pickup}`, color: COLORS.kids });
      if (kl.notes?.trim()) tags.push({ text: kl.notes, color: COLORS.kids });
    }

    // 6. Registry items matching this day (by date substring)
    if (registry) {
      const patterns = [`${dayShort} ${date}`, `${date} ${month}`, `${month} ${date}`];
      Object.values(registry).forEach(cat => {
        cat.items.forEach(item => {
          if (!item.next) return;
          if (patterns.some(p => item.next.includes(p))) {
            tags.push({ text: item.name, color: COLORS.home });
          }
        });
      });
    }

    days.push({ day: label, tags, isToday });
  }

  return days;
}


const DEFAULT_CUSTODY = {
  thisWeek: [{ day: 'M', loc: 'N' }, { day: 'T', loc: 'N' }, { day: 'W', loc: 'N' }, { day: 'T', loc: 'N' }, { day: 'F', loc: 'N' }, { day: 'S', loc: 'N' }, { day: 'S', loc: 'K' }],
  nextWeek: [{ day: 'M', loc: 'K' }, { day: 'T', loc: 'K' }, { day: 'W', loc: 'K' }, { day: 'T', loc: 'K' }, { day: 'F', loc: 'K' }, { day: 'S', loc: 'K' }, { day: 'S', loc: 'N' }],
};

const DEFAULT_EXERCISE = {
  thisWeek: [
    { day: 'Mon', date: '14', entries: [{ id: 1, type: 'chloe', what: 'Gym 6am' }] },
    { day: 'Tue', date: '15', entries: [{ id: 2, type: 'together', what: 'Run 5:30am' }] },
    { day: 'Wed', date: '16', entries: [{ id: 3, type: 'cameron', what: 'Gym 6am' }] },
    { day: 'Thu', date: '17', entries: [{ id: 4, type: 'chloe', what: 'Gym 6am' }] },
    { day: 'Fri', date: '18', entries: [] },
    { day: 'Sat', date: '19', entries: [{ id: 5, type: 'together', what: 'Run 7am' }] },
    { day: 'Sun', date: '20', entries: [] },
  ],
  nextWeek: [
    { day: 'Mon', date: '21', entries: [{ id: 6, type: 'chloe', what: 'Gym 6am' }] },
    { day: 'Tue', date: '22', entries: [{ id: 7, type: 'together', what: 'Run 5:30am' }] },
    { day: 'Wed', date: '23', entries: [] },
    { day: 'Thu', date: '24', entries: [{ id: 8, type: 'chloe', what: 'Gym 6am' }] },
    { day: 'Fri', date: '25', entries: [] },
    { day: 'Sat', date: '26', entries: [] },
    { day: 'Sun', date: '27', entries: [] },
  ],
};

const DEFAULT_SOCIAL_SCHED = {
  thisWeek: [
    { day: 'Mon', date: '14', entries: [] },
    { day: 'Tue', date: '15', entries: [] },
    { day: 'Wed', date: '16', entries: [] },
    { day: 'Thu', date: '17', entries: [] },
    { day: 'Fri', date: '18', entries: [{ id: 10, type: 'c+c', what: 'Dinner out 🍷' }] },
    { day: 'Sat', date: '19', entries: [] },
    { day: 'Sun', date: '20', entries: [] },
  ],
  nextWeek: [
    { day: 'Mon', date: '21', entries: [] },
    { day: 'Tue', date: '22', entries: [] },
    { day: 'Wed', date: '23', entries: [] },
    { day: 'Thu', date: '24', entries: [] },
    { day: 'Fri', date: '25', entries: [{ id: 11, type: 'c+c', what: 'Date night? 💃' }] },
    { day: 'Sat', date: '26', entries: [] },
    { day: 'Sun', date: '27', entries: [] },
  ],
};

const DEFAULT_KID_LOGISTICS = {
  thisWeek: [
    { day: 'Mon', date: '14', dropoff: '—', pickup: 'JP or Patrick', notes: '' },
    { day: 'Tue', date: '15', dropoff: '—', pickup: 'JP or Patrick', notes: 'Tom maths 3:30' },
    { day: 'Wed', date: '16', dropoff: '—', pickup: 'JP or Patrick', notes: '' },
    { day: 'Thu', date: '17', dropoff: '—', pickup: 'JP or Patrick', notes: '' },
    { day: 'Fri', date: '18', dropoff: '—', pickup: 'Cameron', notes: '' },
  ],
  nextWeek: [
    { day: 'Mon', date: '21', dropoff: '—', pickup: '—', notes: 'Kommetjie week' },
    { day: 'Tue', date: '22', dropoff: '—', pickup: '—', notes: '' },
    { day: 'Wed', date: '23', dropoff: '—', pickup: '—', notes: '' },
    { day: 'Thu', date: '24', dropoff: '—', pickup: '—', notes: '' },
    { day: 'Fri', date: '25', dropoff: '—', pickup: '—', notes: '' },
  ],
};

// ===========================================
// SUPABASE HELPERS
// ===========================================
async function loadData(key, fallback) {
  const { data } = await supabase.from('app_data').select('value').eq('key', key).single();
  if (data) {
    // Migration: custody went from 8-day (Sun-Sun) to 7-day (Mon-Sun)
    if (key === 'custody' && data.value?.thisWeek?.length === 8) {
      const migrated = {
        thisWeek: data.value.thisWeek.slice(1),
        nextWeek: data.value.nextWeek.slice(1),
      };
      await saveData('custody', migrated);
      return migrated;
    }
    // Migration: kid logistics "JP" or "Patrick" -> "JP or Patrick"
    if (key === 'kid_logistics' && data.value?.thisWeek) {
      let changed = false;
      const migrate = (arr) => arr.map(d => {
        const out = { ...d };
        if (out.dropoff === 'JP' || out.dropoff === 'Patrick') { out.dropoff = 'JP or Patrick'; changed = true; }
        if (out.pickup === 'JP' || out.pickup === 'Patrick') { out.pickup = 'JP or Patrick'; changed = true; }
        return out;
      });
      const migrated = { thisWeek: migrate(data.value.thisWeek), nextWeek: migrate(data.value.nextWeek) };
      if (changed) {
        await saveData('kid_logistics', migrated);
        return migrated;
      }
    }
    return data.value;
  }
  await supabase.from('app_data').insert({ key, value: fallback });
  return fallback;
}
async function saveData(key, value) {
  await supabase.from('app_data').upsert({ key, value }, { onConflict: 'key' });
}

// ===========================================
// SMALL UI COMPONENTS
// ===========================================
function StatusBadge({ status }) { const c = STATUS_CONFIG[status]; return <span style={{ fontSize: 11, fontWeight: 500, padding: '2px 9px', borderRadius: 20, color: c.color, backgroundColor: c.bg, whiteSpace: 'nowrap' }}>{c.emoji} {c.label}</span>; }
function Tag({ text, color }) { return <span style={{ display: 'inline-block', fontSize: 11, fontWeight: 500, padding: '2px 8px', borderRadius: 6, background: color + '18', color, marginRight: 4, marginBottom: 3 }}>{text}</span>; }
function Check({ item, onToggle, onRemove }) { return (<div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px' }}><div onClick={onToggle} style={{ width: 20, height: 20, borderRadius: 5, flexShrink: 0, cursor: 'pointer', border: item.checked ? 'none' : `2px solid ${BORDER}`, background: item.checked ? SAGE : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 12, fontWeight: 700 }}>{item.checked ? '✓' : ''}</div><span style={{ flex: 1, fontSize: 13, color: item.checked ? MUTED : TEXT, textDecoration: item.checked ? 'line-through' : 'none' }}>{item.text}</span><span onClick={onRemove} style={{ fontSize: 13, color: '#CDD1D9', cursor: 'pointer', padding: '0 4px' }}>×</span></div>); }
function SectionTitle({ text, color }) { return <h3 style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', color: color || MUTED, fontWeight: 600, margin: '0 0 10px' }}>{text}</h3>; }
function Pill({ label, active, color, onClick }) { return <button onClick={onClick} style={{ fontSize: 10, padding: '4px 10px', borderRadius: 6, border: `1px solid ${active ? color : BORDER}`, background: active ? color + '18' : CARD, color: active ? color : MUTED, cursor: 'pointer', fontWeight: 500 }}>{label}</button>; }

function DateFormatTip() {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ background: '#EBF0FA', border: `1px solid ${ROYAL}30`, borderRadius: 10, marginBottom: 14, overflow: 'hidden' }}>
      <div onClick={() => setOpen(!open)} style={{ padding: '9px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
        <span style={{ fontSize: 12, color: ROYAL, fontWeight: 500 }}>💡 Date format tip {open ? '' : '(tap)'}</span>
        <span style={{ fontSize: 10, color: ROYAL, transform: open ? 'rotate(180deg)' : '', transition: 'transform 0.2s' }}>▼</span>
      </div>
      {open && (
        <div style={{ padding: '0 12px 12px', fontSize: 12, color: SUBTEXT, lineHeight: 1.55 }}>
          Items with a <strong>Next</strong> date auto-appear in your weekly view on Today tab. Use these formats:
          <ul style={{ margin: '6px 0 0 0', paddingLeft: 18 }}>
            <li><code style={{ background: CARD, padding: '1px 5px', borderRadius: 3 }}>15 Apr</code> or <code style={{ background: CARD, padding: '1px 5px', borderRadius: 3 }}>Apr 15</code> — appears on that day</li>
            <li><code style={{ background: CARD, padding: '1px 5px', borderRadius: 3 }}>Tue 15 Apr</code> — also works</li>
            <li><code style={{ background: CARD, padding: '1px 5px', borderRadius: 3 }}>Jul 2026</code>, <code style={{ background: CARD, padding: '1px 5px', borderRadius: 3 }}>Expires 2028</code> — shown as-is in the item, no auto-day matching</li>
          </ul>
          <div style={{ marginTop: 6, fontStyle: 'italic', color: MUTED, fontSize: 11 }}>Avoid: "Monday 14 April 2026", "next Tuesday", "April"</div>
        </div>
      )}
    </div>
  );
}

// ===========================================
// REGISTRY ITEM ROW (Full Editability)
// ===========================================
function ItemRow({ item: init, onUpdate, onDelete }) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [item, setItem] = useState(init);
  const [draft, setDraft] = useState({});
  const [showDelete, setShowDelete] = useState(false);
  const [addingContact, setAddingContact] = useState(false);
  const [newContact, setNewContact] = useState({ name: '', role: '', phone: '' });

  const startEdit = () => {
    setEditing(true);
    setDraft({
      name: item.name || '', owner: item.owner || '', rhythm: item.rhythm || '', next: item.next || '',
      notes: item.notes || '', action: item.action || '',
      details: item.details ? { ...item.details } : {},
    });
  };

  const saveEdit = () => {
    const updated = { ...item, name: draft.name, owner: draft.owner, rhythm: draft.rhythm, next: draft.next, notes: draft.notes, action: draft.action || undefined, details: Object.keys(draft.details).length > 0 ? draft.details : item.details };
    setItem(updated); setEditing(false); if (onUpdate) onUpdate(updated);
  };

  const setStatus = (s) => { const updated = { ...item, status: s }; setItem(updated); if (onUpdate) onUpdate(updated); };

  const removeContact = (idx) => {
    const updated = { ...item, contacts: item.contacts.filter((_, i) => i !== idx) };
    if (updated.contacts.length === 0) delete updated.contacts;
    setItem(updated); if (onUpdate) onUpdate(updated);
  };

  const addContact = () => {
    if (!newContact.name.trim()) return;
    const contacts = [...(item.contacts || []), { ...newContact }];
    const updated = { ...item, contacts };
    setItem(updated); if (onUpdate) onUpdate(updated);
    setNewContact({ name: '', role: '', phone: '' }); setAddingContact(false);
  };

  const removeDoc = (idx) => {
    const updated = { ...item, docs: item.docs.filter((_, i) => i !== idx) };
    if (updated.docs.length === 0) delete updated.docs;
    setItem(updated); if (onUpdate) onUpdate(updated);
  };

  const addDetail = () => {
    const key = prompt('Detail name (e.g. "brand", "model"):');
    if (!key) return;
    const val = prompt('Value:');
    if (val === null) return;
    const details = { ...(item.details || {}), [key]: val };
    const updated = { ...item, details };
    setItem(updated); if (onUpdate) onUpdate(updated);
  };

  const hasRich = item.contacts || item.docs || item.links || item.details || item.notes;
  const inputStyle = { flex: 1, padding: '6px 10px', borderRadius: 6, border: `1px solid ${BORDER}`, fontSize: 13, color: TEXT, outline: 'none', fontFamily: "'Outfit', sans-serif" };
  const labelStyle = { fontSize: 11, color: MUTED, width: 60, flexShrink: 0, fontWeight: 500 };

  return (
    <div style={{ background: CARD, borderRadius: 14, marginBottom: 8, border: `1px solid ${BORDER}`, overflow: 'hidden' }}>
      <div onClick={() => setOpen(!open)} style={{ padding: '13px 16px', cursor: 'pointer' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}><span style={{ fontSize: 14, color: TEXT, fontWeight: 500 }}>{item.name}</span><StatusBadge status={item.status} /></div>
            <div style={{ fontSize: 12, color: MUTED, marginTop: 3 }}>{item.owner} · {item.rhythm} · {item.next}</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {hasRich && !open && <div style={{ display: 'flex', gap: 2 }}>{item.contacts && <span style={{ fontSize: 10, opacity: 0.4 }}>📞</span>}{item.docs && <span style={{ fontSize: 10, opacity: 0.4 }}>📎</span>}</div>}
            <span style={{ fontSize: 10, color: '#CDD1D9', transform: open ? 'rotate(180deg)' : '', transition: 'transform 0.2s' }}>▼</span>
          </div>
        </div>
      </div>
      {open && (
        <div style={{ padding: '0 16px 16px', borderTop: `1px solid ${BORDER}`, paddingTop: 14 }}>
          {/* Status buttons */}
          <div style={{ display: 'flex', gap: 4, marginBottom: 14 }}>
            {STATUS_OPTIONS.map((s) => (<button key={s} onClick={(e) => { e.stopPropagation(); setStatus(s); }} style={{ fontSize: 10, padding: '4px 10px', borderRadius: 20, border: item.status === s ? 'none' : `1px solid ${BORDER}`, background: item.status === s ? STATUS_CONFIG[s].bg : 'transparent', color: STATUS_CONFIG[s].color, cursor: 'pointer', fontWeight: 500 }}>{STATUS_CONFIG[s].emoji} {STATUS_CONFIG[s].label}</button>))}
          </div>

          {!editing ? (<>
            {item.notes && <p style={{ fontSize: 13, color: SUBTEXT, lineHeight: 1.5, margin: '0 0 12px' }}>{item.notes}</p>}
            {item.details && <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>{Object.entries(item.details).map(([k, v]) => (<div key={k} style={{ fontSize: 11, color: SUBTEXT, background: BG, padding: '4px 10px', borderRadius: 6, border: `1px solid ${BORDER}` }}><span style={{ color: MUTED, textTransform: 'capitalize' }}>{k.replace(/([A-Z])/g, ' $1').trim()}:</span> {v}</div>))}<button onClick={addDetail} style={{ fontSize: 11, color: ROYAL, background: 'transparent', border: `1px dashed ${BORDER}`, borderRadius: 6, padding: '4px 10px', cursor: 'pointer' }}>+ detail</button></div>}
            {item.contacts && <div style={{ marginBottom: 12 }}><div style={{ fontSize: 10, color: MUTED, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>Contacts</div>{item.contacts.map((c, i) => (<div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '5px 0' }}><div><span style={{ fontSize: 13, fontWeight: 500, color: TEXT }}>{c.name}</span><span style={{ fontSize: 12, color: MUTED, marginLeft: 6 }}>{c.role}</span></div><div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><a href={`tel:${c.phone}`} style={{ fontSize: 12, color: ROYAL, textDecoration: 'none', fontWeight: 500 }}>📞 {c.phone}</a><span onClick={() => removeContact(i)} style={{ fontSize: 12, color: '#CDD1D9', cursor: 'pointer' }}>×</span></div></div>))}{!addingContact && <button onClick={() => setAddingContact(true)} style={{ fontSize: 11, color: ROYAL, background: 'transparent', border: 'none', cursor: 'pointer', padding: '4px 0', fontWeight: 500 }}>+ Add contact</button>}{addingContact && <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginTop: 6 }}><input placeholder="Name" value={newContact.name} onChange={(e) => setNewContact(p => ({ ...p, name: e.target.value }))} style={{ ...inputStyle, flex: '1 1 80px' }} /><input placeholder="Role" value={newContact.role} onChange={(e) => setNewContact(p => ({ ...p, role: e.target.value }))} style={{ ...inputStyle, flex: '1 1 60px' }} /><input placeholder="Phone" value={newContact.phone} onChange={(e) => setNewContact(p => ({ ...p, phone: e.target.value }))} style={{ ...inputStyle, flex: '1 1 80px' }} /><button onClick={addContact} style={{ fontSize: 11, padding: '6px 12px', borderRadius: 6, border: 'none', background: SAGE, color: 'white', cursor: 'pointer' }}>Add</button><button onClick={() => setAddingContact(false)} style={{ fontSize: 11, padding: '6px 8px', borderRadius: 6, border: `1px solid ${BORDER}`, background: CARD, cursor: 'pointer', color: MUTED }}>×</button></div>}</div>}
            {!item.contacts && <div style={{ marginBottom: 8 }}><button onClick={() => setAddingContact(true)} style={{ fontSize: 11, color: ROYAL, background: 'transparent', border: 'none', cursor: 'pointer', padding: '2px 0', fontWeight: 500 }}>+ Add contact</button>{addingContact && <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginTop: 6 }}><input placeholder="Name" value={newContact.name} onChange={(e) => setNewContact(p => ({ ...p, name: e.target.value }))} style={{ ...inputStyle, flex: '1 1 80px' }} /><input placeholder="Role" value={newContact.role} onChange={(e) => setNewContact(p => ({ ...p, role: e.target.value }))} style={{ ...inputStyle, flex: '1 1 60px' }} /><input placeholder="Phone" value={newContact.phone} onChange={(e) => setNewContact(p => ({ ...p, phone: e.target.value }))} style={{ ...inputStyle, flex: '1 1 80px' }} /><button onClick={addContact} style={{ fontSize: 11, padding: '6px 12px', borderRadius: 6, border: 'none', background: SAGE, color: 'white', cursor: 'pointer' }}>Add</button><button onClick={() => setAddingContact(false)} style={{ fontSize: 11, padding: '6px 8px', borderRadius: 6, border: `1px solid ${BORDER}`, background: CARD, cursor: 'pointer', color: MUTED }}>×</button></div>}</div>}
            {item.docs && <div style={{ marginBottom: 12 }}><div style={{ fontSize: 10, color: MUTED, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>Documents</div><div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>{item.docs.map((d, i) => <span key={i} style={{ fontSize: 12, color: SUBTEXT, background: BG, padding: '5px 10px', borderRadius: 8, border: `1px solid ${BORDER}`, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>📎 {d}<span onClick={() => removeDoc(i)} style={{ color: '#CDD1D9', cursor: 'pointer', fontSize: 10, marginLeft: 2 }}>×</span></span>)}</div></div>}
            {item.links && <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>{item.links.map((l, i) => <span key={i} style={{ fontSize: 12, color: ROYAL, background: '#EBF0FA', padding: '5px 10px', borderRadius: 8, cursor: 'pointer', fontWeight: 500 }}>🔗 {l.label}</span>)}</div>}
            <div style={{ display: 'flex', gap: 8, marginTop: 4, flexWrap: 'wrap' }}>
              {item.action && <button style={{ fontSize: 12, padding: '7px 16px', borderRadius: 9, border: 'none', cursor: 'pointer', fontWeight: 500, background: TEXT, color: 'white', display: 'flex', alignItems: 'center', gap: 5 }}><span style={{ fontSize: 11 }}>🤖</span> {item.action}</button>}
              <button onClick={(e) => { e.stopPropagation(); startEdit(); }} style={{ fontSize: 12, padding: '7px 16px', borderRadius: 9, border: `1px solid ${BORDER}`, background: CARD, cursor: 'pointer', color: ROYAL, fontWeight: 500 }}>✏️ Edit</button>
              {!showDelete ? (
                <button onClick={(e) => { e.stopPropagation(); setShowDelete(true); }} style={{ fontSize: 12, padding: '7px 16px', borderRadius: 9, border: `1px solid ${BORDER}`, background: CARD, cursor: 'pointer', color: MUTED }}>🗑️</button>
              ) : (
                <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                  <span style={{ fontSize: 11, color: CORAL }}>Delete?</span>
                  <button onClick={(e) => { e.stopPropagation(); if (onDelete) onDelete(); }} style={{ fontSize: 11, padding: '5px 10px', borderRadius: 6, border: 'none', background: CORAL, color: 'white', cursor: 'pointer' }}>Yes</button>
                  <button onClick={(e) => { e.stopPropagation(); setShowDelete(false); }} style={{ fontSize: 11, padding: '5px 10px', borderRadius: 6, border: `1px solid ${BORDER}`, background: CARD, cursor: 'pointer', color: MUTED }}>No</button>
                </div>
              )}
            </div>
          </>) : (<>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><span style={labelStyle}>Name</span><input value={draft.name} onChange={(e) => setDraft(p => ({ ...p, name: e.target.value }))} style={inputStyle} /></div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><span style={labelStyle}>Owner</span><div style={{ display: 'flex', gap: 4 }}>{OWNER_OPTIONS.map(o => <Pill key={o} label={o} active={draft.owner === o} color={o === 'Chloë' ? ROYAL : o === 'Cameron' ? TEAL : o === 'Both' ? PURPLE : MUTED} onClick={() => setDraft(p => ({ ...p, owner: o }))} />)}</div></div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><span style={labelStyle}>Rhythm</span><input value={draft.rhythm} onChange={(e) => setDraft(p => ({ ...p, rhythm: e.target.value }))} style={inputStyle} placeholder="e.g. Weekly, Annually" /></div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><span style={labelStyle}>Next</span><input value={draft.next} onChange={(e) => setDraft(p => ({ ...p, next: e.target.value }))} style={inputStyle} placeholder="e.g. 15 Apr, Tue 15 Apr, Jul 2026" /></div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><span style={labelStyle}>Action</span><input value={draft.action} onChange={(e) => setDraft(p => ({ ...p, action: e.target.value }))} style={inputStyle} placeholder="e.g. Book appointment" /></div>
            </div>
            <div style={{ marginBottom: 12 }}><div style={{ fontSize: 10, color: MUTED, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>Notes</div><textarea value={draft.notes} onChange={(e) => setDraft(p => ({ ...p, notes: e.target.value }))} rows={3} style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: `1px solid ${BORDER}`, fontSize: 13, color: TEXT, resize: 'vertical', outline: 'none', boxSizing: 'border-box', fontFamily: "'Outfit', sans-serif" }} /></div>
            {Object.keys(draft.details).length > 0 && <div style={{ marginBottom: 12 }}><div style={{ fontSize: 10, color: MUTED, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Details</div>{Object.entries(draft.details).map(([k, v]) => (<div key={k} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}><label style={{ fontSize: 12, color: SUBTEXT, width: 90, textTransform: 'capitalize', flexShrink: 0 }}>{k.replace(/([A-Z])/g, ' $1').trim()}</label><input value={v} onChange={(e) => setDraft(p => ({ ...p, details: { ...p.details, [k]: e.target.value } }))} style={inputStyle} /></div>))}</div>}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}><button onClick={saveEdit} style={{ fontSize: 12, padding: '7px 20px', borderRadius: 9, border: 'none', background: SAGE, color: 'white', cursor: 'pointer', fontWeight: 500 }}>Save</button><button onClick={() => setEditing(false)} style={{ fontSize: 12, padding: '7px 16px', borderRadius: 9, border: `1px solid ${BORDER}`, background: CARD, cursor: 'pointer', color: SUBTEXT }}>Cancel</button>{!showDelete ? (<button onClick={(e) => { e.stopPropagation(); setShowDelete(true); }} style={{ fontSize: 12, padding: '7px 14px', borderRadius: 9, border: `1px solid ${BORDER}`, background: CARD, cursor: 'pointer', color: CORAL, marginLeft: 'auto' }}>🗑️ Delete</button>) : (<div style={{ display: 'flex', gap: 4, alignItems: 'center', marginLeft: 'auto' }}><span style={{ fontSize: 11, color: CORAL }}>Delete?</span><button onClick={(e) => { e.stopPropagation(); if (onDelete) onDelete(); }} style={{ fontSize: 11, padding: '5px 10px', borderRadius: 6, border: 'none', background: CORAL, color: 'white', cursor: 'pointer' }}>Yes</button><button onClick={(e) => { e.stopPropagation(); setShowDelete(false); }} style={{ fontSize: 11, padding: '5px 10px', borderRadius: 6, border: `1px solid ${BORDER}`, background: CARD, cursor: 'pointer', color: MUTED }}>No</button></div>)}</div>
          </>)}
        </div>
      )}
    </div>
  );
}

// ===========================================
// ADD ITEM FORM
// ===========================================
function AddItemForm({ onAdd }) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState({ name: '', owner: 'Chloë', rhythm: '', next: '', status: 'handled', notes: '' });
  const inputStyle = { flex: 1, padding: '8px 10px', borderRadius: 8, border: `1px solid ${BORDER}`, fontSize: 13, color: TEXT, outline: 'none', fontFamily: "'Outfit', sans-serif" };
  const labelStyle = { fontSize: 11, color: MUTED, width: 60, flexShrink: 0, fontWeight: 500 };

  const submit = () => {
    if (!draft.name.trim()) return;
    onAdd({ ...draft, name: draft.name.trim() });
    setDraft({ name: '', owner: 'Chloë', rhythm: '', next: '', status: 'handled', notes: '' });
    setOpen(false);
  };

  if (!open) return <button onClick={() => setOpen(true)} style={{ width: '100%', padding: '12px', borderRadius: 12, border: `1.5px dashed ${BORDER}`, background: 'transparent', cursor: 'pointer', color: ROYAL, fontSize: 13, fontWeight: 500, marginTop: 4 }}>+ Add item</button>;

  return (
    <div style={{ background: CARD, borderRadius: 14, padding: 16, border: `1px solid ${ROYAL}40`, marginTop: 4 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><span style={labelStyle}>Name</span><input value={draft.name} onChange={(e) => setDraft(p => ({ ...p, name: e.target.value }))} style={inputStyle} placeholder="e.g. Dentist check-up" autoFocus /></div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><span style={labelStyle}>Owner</span><div style={{ display: 'flex', gap: 4 }}>{OWNER_OPTIONS.map(o => <Pill key={o} label={o} active={draft.owner === o} color={o === 'Chloë' ? ROYAL : o === 'Cameron' ? TEAL : o === 'Both' ? PURPLE : MUTED} onClick={() => setDraft(p => ({ ...p, owner: o }))} />)}</div></div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><span style={labelStyle}>Status</span><div style={{ display: 'flex', gap: 4 }}>{STATUS_OPTIONS.map(s => <Pill key={s} label={STATUS_CONFIG[s].label} active={draft.status === s} color={STATUS_CONFIG[s].color} onClick={() => setDraft(p => ({ ...p, status: s }))} />)}</div></div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><span style={labelStyle}>Rhythm</span><input value={draft.rhythm} onChange={(e) => setDraft(p => ({ ...p, rhythm: e.target.value }))} style={inputStyle} placeholder="e.g. Annually, Weekly" /></div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><span style={labelStyle}>Next</span><input value={draft.next} onChange={(e) => setDraft(p => ({ ...p, next: e.target.value }))} style={inputStyle} placeholder="e.g. 15 Apr, Tue 15 Apr, Jul 2026" /></div>
        <textarea value={draft.notes} onChange={(e) => setDraft(p => ({ ...p, notes: e.target.value }))} rows={2} placeholder="Notes (optional)" style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: `1px solid ${BORDER}`, fontSize: 13, color: TEXT, resize: 'vertical', outline: 'none', boxSizing: 'border-box', fontFamily: "'Outfit', sans-serif" }} />
      </div>
      <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
        <button onClick={submit} style={{ fontSize: 12, padding: '8px 20px', borderRadius: 9, border: 'none', background: SAGE, color: 'white', cursor: 'pointer', fontWeight: 600 }}>Add item</button>
        <button onClick={() => setOpen(false)} style={{ fontSize: 12, padding: '8px 16px', borderRadius: 9, border: `1px solid ${BORDER}`, background: CARD, cursor: 'pointer', color: SUBTEXT }}>Cancel</button>
      </div>
    </div>
  );
}

// ===========================================
// SCHEDULE & CUSTODY COMPONENTS
// ===========================================
function ScheduleCard({ days, startCollapsed }) {
  const [collapsed, setCollapsed] = useState(startCollapsed);
  const shown = collapsed ? days.slice(0, 3) : days;
  return (
    <div style={{ background: CARD, borderRadius: 14, border: `1px solid ${BORDER}`, overflow: 'hidden' }}>
      {shown.map((d, i) => (<div key={i} style={{ display: 'flex', gap: 12, padding: '10px 14px', borderBottom: `1px solid ${BORDER}`, alignItems: 'flex-start', background: d.isToday ? '#EBF0FA' : 'transparent' }}><span style={{ width: 52, fontSize: 12, fontWeight: d.isToday ? 700 : 600, color: d.isToday ? ROYAL : SUBTEXT, flexShrink: 0, paddingTop: 3 }}>{d.day}{d.isToday && <span style={{ fontSize: 8, display: 'block', marginTop: 1 }}>TODAY</span>}</span><div style={{ flex: 1, display: 'flex', flexWrap: 'wrap', gap: 3 }}>{d.tags.length === 0 ? <span style={{ fontSize: 11, color: '#CDD1D9', fontStyle: 'italic' }}>—</span> : d.tags.map((t, j) => <Tag key={j} text={t.text} color={t.color} />)}</div></div>))}
      {collapsed && <div onClick={() => setCollapsed(false)} style={{ padding: '9px 14px', textAlign: 'center', cursor: 'pointer', fontSize: 12, color: ROYAL, fontWeight: 500 }}>Show full week ↓</div>}
      {!collapsed && startCollapsed && <div onClick={() => setCollapsed(true)} style={{ padding: '9px 14px', textAlign: 'center', cursor: 'pointer', fontSize: 12, color: MUTED, fontWeight: 500 }}>Collapse ↑</div>}
    </div>
  );
}

function CustodyStrip({ days, label, onToggle }) {
  return (<div>{label && <div style={{ fontSize: 10, color: MUTED, fontWeight: 500, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</div>}<div style={{ display: 'flex', gap: 2, background: BG, borderRadius: 10, padding: 3, border: `1px solid ${BORDER}` }}>{days.map((d, i) => { const isN = d.loc === 'N'; return (<div key={i} onClick={() => onToggle && onToggle(i)} style={{ flex: 1, textAlign: 'center', padding: '7px 0', borderRadius: 7, background: isN ? ROYAL : 'transparent', color: isN ? 'white' : MUTED, cursor: onToggle ? 'pointer' : 'default' }}><div style={{ fontSize: 10, fontWeight: 600 }}>{d.day}</div><div style={{ fontSize: 7, marginTop: 1, opacity: 0.85 }}>{isN ? 'NWL' : 'KOM'}</div></div>); })}</div>{onToggle && <div style={{ fontSize: 9, color: MUTED, marginTop: 4, fontStyle: 'italic', textAlign: 'center' }}>Tap a day to toggle</div>}</div>);
}

// ===========================================
// SCHEDULES TAB (NEW)
// ===========================================
function SchedulesTab({ exercise, setExercise, saveExercise, socialSched, setSocialSched, saveSocialSched, kidLogistics, setKidLogistics, saveKidLogistics, custody, setCustody, saveCustody }) {
  const [weekView, setWeekView] = useState('thisWeek');
  const [section, setSection] = useState('exercise');
  const [addingTo, setAddingTo] = useState(null); // { dayIdx }
  const [addType, setAddType] = useState('');
  const [addWhat, setAddWhat] = useState('');
  const [editingLogistics, setEditingLogistics] = useState(null); // { dayIdx, field }

  const weekLabel = weekView === 'thisWeek' ? 'This week' : 'Next week';
  const exDays = exercise?.[weekView] || [];
  const soDays = socialSched?.[weekView] || [];
  const klDays = kidLogistics?.[weekView] || [];
  const types = section === 'exercise' ? EXERCISE_TYPES : SOCIAL_TYPES;

  const typeColor = (t) => {
    const found = [...EXERCISE_TYPES, ...SOCIAL_TYPES].find(x => x.id === t);
    return found ? found.color : MUTED;
  };
  const typeLabel = (t) => {
    const found = [...EXERCISE_TYPES, ...SOCIAL_TYPES].find(x => x.id === t);
    return found ? found.label : t;
  };

  // Exercise / Social entry management
  const addEntry = (dayIdx) => {
    if (!addType || !addWhat.trim()) return;
    const source = section === 'exercise' ? exercise : socialSched;
    const setter = section === 'exercise' ? setExercise : setSocialSched;
    const saver = section === 'exercise' ? saveExercise : saveSocialSched;
    const updated = { ...source };
    updated[weekView] = updated[weekView].map((d, i) => i === dayIdx ? { ...d, entries: [...d.entries, { id: Date.now(), type: addType, what: addWhat.trim() }] } : d);
    setter(updated); saver(updated);
    setAddingTo(null); setAddType(''); setAddWhat('');
  };

  const removeEntry = (dayIdx, entryId) => {
    const source = section === 'exercise' ? exercise : socialSched;
    const setter = section === 'exercise' ? setExercise : setSocialSched;
    const saver = section === 'exercise' ? saveExercise : saveSocialSched;
    const updated = { ...source };
    updated[weekView] = updated[weekView].map((d, i) => i === dayIdx ? { ...d, entries: d.entries.filter(e => e.id !== entryId) } : d);
    setter(updated); saver(updated);
  };

  // Kid logistics
  const cycleLogistics = (dayIdx, field) => {
    const updated = { ...kidLogistics };
    const current = updated[weekView][dayIdx][field];
    const currentIdx = LOGISTICS_OPTIONS.indexOf(current);
    const nextIdx = (currentIdx + 1) % LOGISTICS_OPTIONS.length;
    updated[weekView] = updated[weekView].map((d, i) => i === dayIdx ? { ...d, [field]: LOGISTICS_OPTIONS[nextIdx] } : d);
    setKidLogistics(updated); saveKidLogistics(updated);
  };

  const updateLogisticsNotes = (dayIdx, notes) => {
    const updated = { ...kidLogistics };
    updated[weekView] = updated[weekView].map((d, i) => i === dayIdx ? { ...d, notes } : d);
    setKidLogistics(updated); saveKidLogistics(updated);
  };

  // Custody toggle
  const toggleCustody = (week, idx) => {
    const updated = { ...custody };
    updated[week] = updated[week].map((d, i) => i === idx ? { ...d, loc: d.loc === 'N' ? 'K' : 'N' } : d);
    setCustody(updated); saveCustody(updated);
  };

  return (<>
    {/* Week toggle */}
    <div style={{ display: 'flex', gap: 6, marginBottom: 14 }}>
      {['thisWeek', 'nextWeek'].map(w => (
        <button key={w} onClick={() => setWeekView(w)} style={{ flex: 1, padding: '10px', borderRadius: 10, border: `1px solid ${BORDER}`, background: weekView === w ? TEXT : CARD, color: weekView === w ? 'white' : SUBTEXT, cursor: 'pointer', fontSize: 12, fontWeight: 500 }}>{w === 'thisWeek' ? '📅 This week' : '📅 Next week'}</button>
      ))}
    </div>

    {/* Custody strip - matches week toggle */}
    {custody && <div style={{ marginBottom: 20 }}>
      <SectionTitle text={`👦 Boys · ${weekLabel}`} />
      <CustodyStrip days={custody[weekView]} label="" onToggle={(i) => toggleCustody(weekView, i)} />
    </div>}

    {/* Section tabs */}
    <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
      {[{ id: 'exercise', l: 'Exercise', e: '🏋️' }, { id: 'social', l: 'Social', e: '🎉' }, { id: 'logistics', l: 'Kids', e: '🚗' }].map(t => (
        <button key={t.id} onClick={() => { setSection(t.id); setAddingTo(null); }} style={{ flex: 1, padding: '10px 6px', borderRadius: 10, border: `1px solid ${BORDER}`, background: section === t.id ? TEXT : CARD, color: section === t.id ? 'white' : SUBTEXT, cursor: 'pointer', fontSize: 12, fontWeight: 500 }}>{t.e} {t.l}</button>
      ))}
    </div>

    {/* Exercise / Social schedule */}
    {(section === 'exercise' || section === 'social') && (<>
      <div style={{ background: CARD, borderRadius: 14, border: `1px solid ${BORDER}`, overflow: 'hidden' }}>
        {(section === 'exercise' ? exDays : soDays).map((day, di) => (
          <div key={di} style={{ padding: '10px 14px', borderBottom: `1px solid ${BORDER}` }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: day.entries.length > 0 ? 6 : 0 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: SUBTEXT, width: 60 }}>{day.day} {day.date}</span>
              {day.entries.length === 0 && addingTo?.dayIdx !== di && <span style={{ fontSize: 11, color: '#CDD1D9' }}>—</span>}
              <button onClick={() => { setAddingTo({ dayIdx: di }); setAddType(types[0]?.id || ''); setAddWhat(''); }} style={{ fontSize: 10, color: ROYAL, background: 'transparent', border: 'none', cursor: 'pointer', fontWeight: 500, padding: '2px 6px' }}>+</button>
            </div>
            {day.entries.map((e) => (
              <div key={e.id} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3, marginLeft: 60 }}>
                <Tag text={`${typeLabel(e.type)}: ${e.what}`} color={typeColor(e.type)} />
                <span onClick={() => removeEntry(di, e.id)} style={{ fontSize: 11, color: '#CDD1D9', cursor: 'pointer' }}>×</span>
              </div>
            ))}
            {addingTo?.dayIdx === di && (
              <div style={{ display: 'flex', gap: 4, marginTop: 6, marginLeft: 60, flexWrap: 'wrap' }}>
                <select value={addType} onChange={(e) => setAddType(e.target.value)} style={{ padding: '5px 6px', borderRadius: 6, border: `1px solid ${BORDER}`, fontSize: 11, color: SUBTEXT, background: CARD }}>
                  {types.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
                </select>
                <input value={addWhat} onChange={(e) => setAddWhat(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addEntry(di)} placeholder="e.g. Gym 6am" style={{ flex: 1, padding: '5px 8px', borderRadius: 6, border: `1px solid ${BORDER}`, fontSize: 12, outline: 'none', minWidth: 80 }} autoFocus />
                <button onClick={() => addEntry(di)} style={{ fontSize: 11, padding: '5px 10px', borderRadius: 6, border: 'none', background: SAGE, color: 'white', cursor: 'pointer' }}>✓</button>
                <button onClick={() => setAddingTo(null)} style={{ fontSize: 11, padding: '5px 8px', borderRadius: 6, border: `1px solid ${BORDER}`, background: CARD, cursor: 'pointer', color: MUTED }}>×</button>
              </div>
            )}
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 6, marginTop: 8, flexWrap: 'wrap' }}>
        {types.map(t => <span key={t.id} style={{ fontSize: 10, display: 'flex', alignItems: 'center', gap: 4 }}><span style={{ width: 8, height: 8, borderRadius: 4, background: t.color }} />{t.label}</span>)}
      </div>
    </>)}

    {/* Kid Logistics */}
    {section === 'logistics' && (<>
      <div style={{ background: CARD, borderRadius: 14, border: `1px solid ${BORDER}`, overflow: 'hidden' }}>
        {/* Header */}
        <div style={{ display: 'flex', padding: '8px 14px', borderBottom: `1px solid ${BORDER}`, background: BG }}>
          <span style={{ width: 60, fontSize: 10, fontWeight: 600, color: MUTED }}></span>
          <span style={{ flex: 1, fontSize: 10, fontWeight: 600, color: MUTED, textAlign: 'center' }}>DROP-OFF</span>
          <span style={{ flex: 1, fontSize: 10, fontWeight: 600, color: MUTED, textAlign: 'center' }}>PICK-UP</span>
          <span style={{ width: 24 }}></span>
        </div>
        {klDays.length === 0 && <div style={{ padding: 16, textAlign: 'center', color: MUTED, fontSize: 13 }}>No school days this week (Kommetjie)</div>}
        {klDays.map((day, di) => (
          <div key={di} style={{ borderBottom: `1px solid ${BORDER}` }}>
            <div style={{ display: 'flex', alignItems: 'center', padding: '10px 14px' }}>
              <span style={{ width: 60, fontSize: 12, fontWeight: 600, color: SUBTEXT }}>{day.day} {day.date}</span>
              <div onClick={() => cycleLogistics(di, 'dropoff')} style={{ flex: 1, textAlign: 'center', cursor: 'pointer' }}>
                <span style={{ fontSize: 11, fontWeight: 500, padding: '3px 10px', borderRadius: 6, background: (LOGISTICS_COLORS[day.dropoff] || MUTED) + '18', color: LOGISTICS_COLORS[day.dropoff] || MUTED }}>{day.dropoff}</span>
              </div>
              <div onClick={() => cycleLogistics(di, 'pickup')} style={{ flex: 1, textAlign: 'center', cursor: 'pointer' }}>
                <span style={{ fontSize: 11, fontWeight: 500, padding: '3px 10px', borderRadius: 6, background: (LOGISTICS_COLORS[day.pickup] || MUTED) + '18', color: LOGISTICS_COLORS[day.pickup] || MUTED }}>{day.pickup}</span>
              </div>
              <span onClick={() => setEditingLogistics(editingLogistics === di ? null : di)} style={{ width: 24, fontSize: 10, color: '#CDD1D9', cursor: 'pointer', textAlign: 'center' }}>{day.notes ? '📝' : '+'}</span>
            </div>
            {editingLogistics === di && (
              <div style={{ padding: '0 14px 10px', marginLeft: 60 }}>
                <input value={day.notes} onChange={(e) => updateLogisticsNotes(di, e.target.value)} placeholder="Notes (e.g. Tom maths 3:30)" style={{ width: '100%', padding: '6px 10px', borderRadius: 6, border: `1px solid ${BORDER}`, fontSize: 12, outline: 'none', boxSizing: 'border-box' }} />
              </div>
            )}
          </div>
        ))}
      </div>
      <div style={{ fontSize: 10, color: MUTED, marginTop: 8, textAlign: 'center', fontStyle: 'italic' }}>Tap drop-off/pick-up to cycle: {LOGISTICS_OPTIONS.join(' → ')}</div>
    </>)}
  </>);
}

// ===========================================
// LISTS TAB
// ===========================================
function ListsTab({ meals, setMeals, saveMeals, weekly, setWeekly, saveWeekly, monthly, setMonthly, saveMonthly, toBuy, setToBuy, saveToBuy }) {
  const [listView, setListView] = useState('weekly');
  const [editingMeal, setEditingMeal] = useState(null);
  const [mealDraft, setMealDraft] = useState('');
  const [editingCook, setEditingCook] = useState(null);
  const [newItem, setNewItem] = useState('');
  const [newAisle, setNewAisle] = useState('other');

  const saveMealEdit = (i) => { const updated = meals.map((m, j) => j === i ? { ...m, meal: mealDraft } : m); setMeals(updated); saveMeals(updated); setEditingMeal(null); };
  const setCook = (i, who) => { const updated = meals.map((m, j) => j === i ? { ...m, who } : m); setMeals(updated); saveMeals(updated); setEditingCook(null); };
  const cookColor = (w) => w === 'Chloë' ? ROYAL : w === 'Cameron' ? TEAL : w === 'Together' ? PURPLE : MUTED;

  const toggleW = (aisle, id) => { const u = { ...weekly, [aisle]: weekly[aisle].map((i) => i.id === id ? { ...i, checked: !i.checked } : i) }; setWeekly(u); saveWeekly(u); };
  const removeW = (aisle, id) => { const u = { ...weekly, [aisle]: weekly[aisle].filter((i) => i.id !== id) }; setWeekly(u); saveWeekly(u); };
  const addW = () => { if (!newItem.trim()) return; const u = { ...weekly, [newAisle]: [{ id: Date.now(), text: newItem.trim(), checked: false }, ...weekly[newAisle]] }; setWeekly(u); saveWeekly(u); setNewItem(''); };

  const toggleF = (list, setList, save, id) => { const u = list.map((i) => i.id === id ? { ...i, checked: !i.checked } : i); setList(u); save(u); };
  const removeF = (list, setList, save, id) => { const u = list.filter((i) => i.id !== id); setList(u); save(u); };
  const addF = (list, setList, save) => { if (!newItem.trim()) return; const u = [{ id: Date.now(), text: newItem.trim(), checked: false }, ...list]; setList(u); save(u); setNewItem(''); };

  return (<>
    <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
      {[{ id: 'weekly', l: 'Weekly', e: '🛒' }, { id: 'monthly', l: 'Monthly', e: '📦' }, { id: 'tobuy', l: 'To Buy', e: '🏷️' }].map((t) => (
        <button key={t.id} onClick={() => setListView(t.id)} style={{ flex: 1, padding: '10px 6px', borderRadius: 10, border: `1px solid ${BORDER}`, background: listView === t.id ? TEXT : CARD, color: listView === t.id ? 'white' : SUBTEXT, cursor: 'pointer', fontSize: 12, fontWeight: 500 }}>{t.e} {t.l}</button>
      ))}
    </div>

    {listView === 'weekly' && (<>
      <div style={{ marginBottom: 20 }}>
        <SectionTitle text="🍽️ Dinner this week" />
        <div style={{ background: CARD, borderRadius: 14, border: `1px solid ${BORDER}`, overflow: 'hidden' }}>
          {meals.map((m, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', borderBottom: i < meals.length - 1 ? `1px solid ${BORDER}` : 'none' }}>
              <span style={{ width: 32, fontSize: 11, fontWeight: 600, color: SUBTEXT, flexShrink: 0 }}>{m.day.slice(0, 3)}</span>
              {editingMeal === i ? (
                <div style={{ flex: 1, display: 'flex', gap: 6 }}>
                  <input value={mealDraft} onChange={(e) => setMealDraft(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && saveMealEdit(i)} style={{ flex: 1, padding: '5px 8px', borderRadius: 6, border: `1px solid ${BORDER}`, fontSize: 13, outline: 'none' }} autoFocus />
                  <button onClick={() => saveMealEdit(i)} style={{ fontSize: 11, padding: '4px 10px', borderRadius: 6, border: 'none', background: SAGE, color: 'white', cursor: 'pointer' }}>✓</button>
                </div>
              ) : <span onClick={() => { setEditingMeal(i); setMealDraft(meals[i].meal); setEditingCook(null); }} style={{ flex: 1, fontSize: 13, color: TEXT, cursor: 'pointer' }}>{m.meal}</span>}
              {editingCook === i ? (
                <div style={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                  {COOK_OPTIONS.map((opt) => (<button key={opt} onClick={() => setCook(i, opt)} style={{ fontSize: 10, padding: '3px 7px', borderRadius: 5, border: `1px solid ${BORDER}`, background: m.who === opt ? cookColor(opt) + '20' : CARD, color: cookColor(opt), cursor: 'pointer', fontWeight: 500 }}>{opt}</button>))}
                </div>
              ) : <span onClick={() => { setEditingCook(i); setEditingMeal(null); }} style={{ fontSize: 10, color: cookColor(m.who), fontWeight: 500, cursor: 'pointer', padding: '3px 8px', borderRadius: 5, background: m.who !== '—' ? cookColor(m.who) + '15' : 'transparent' }}>{m.who !== '—' ? m.who : '+cook'}</span>}
            </div>
          ))}
        </div>
      </div>
      <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
        <select value={newAisle} onChange={(e) => setNewAisle(e.target.value)} style={{ padding: '8px 6px', borderRadius: 8, border: `1px solid ${BORDER}`, fontSize: 12, color: SUBTEXT, background: CARD, width: 90 }}>{AISLES.map((a) => <option key={a.id} value={a.id}>{a.emoji} {a.label}</option>)}</select>
        <input value={newItem} onChange={(e) => setNewItem(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addW()} placeholder="Add item..." style={{ flex: 1, padding: '8px 12px', borderRadius: 8, border: `1px solid ${BORDER}`, fontSize: 13, color: TEXT, background: CARD, outline: 'none' }} />
        <button onClick={addW} style={{ padding: '8px 16px', borderRadius: 8, border: 'none', background: ROYAL, color: 'white', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>+</button>
      </div>
      {AISLES.map((aisle) => { const items = weekly[aisle.id] || []; if (!items.length) return null; const unc = items.filter((i) => !i.checked); const chk = items.filter((i) => i.checked); return (
        <div key={aisle.id} style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: SUBTEXT, marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}><span>{aisle.emoji}</span> {aisle.label}{unc.length === 0 && items.length > 0 && <span style={{ fontSize: 10, color: SAGE }}>✓</span>}</div>
          <div style={{ background: CARD, borderRadius: 12, border: `1px solid ${BORDER}`, overflow: 'hidden' }}>
            {unc.map((item) => <Check key={item.id} item={item} onToggle={() => toggleW(aisle.id, item.id)} onRemove={() => removeW(aisle.id, item.id)} />)}
            {chk.map((item) => <Check key={item.id} item={item} onToggle={() => toggleW(aisle.id, item.id)} onRemove={() => removeW(aisle.id, item.id)} />)}
          </div>
        </div>
      ); })}
    </>)}

    {listView === 'monthly' && (<>
      <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}><input value={newItem} onChange={(e) => setNewItem(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addF(monthly, setMonthly, saveMonthly)} placeholder="Add item..." style={{ flex: 1, padding: '8px 12px', borderRadius: 8, border: `1px solid ${BORDER}`, fontSize: 13, color: TEXT, background: CARD, outline: 'none' }} /><button onClick={() => addF(monthly, setMonthly, saveMonthly)} style={{ padding: '8px 16px', borderRadius: 8, border: 'none', background: ROYAL, color: 'white', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>+</button></div>
      <div style={{ background: CARD, borderRadius: 14, border: `1px solid ${BORDER}`, overflow: 'hidden' }}>{monthly.filter((i) => !i.checked).map((item) => <Check key={item.id} item={item} onToggle={() => toggleF(monthly, setMonthly, saveMonthly, item.id)} onRemove={() => removeF(monthly, setMonthly, saveMonthly, item.id)} />)}{monthly.filter((i) => i.checked).map((item) => <Check key={item.id} item={item} onToggle={() => toggleF(monthly, setMonthly, saveMonthly, item.id)} onRemove={() => removeF(monthly, setMonthly, saveMonthly, item.id)} />)}{monthly.length === 0 && <div style={{ padding: 16, textAlign: 'center', color: MUTED, fontSize: 13 }}>All stocked up 🎉</div>}</div>
    </>)}

    {listView === 'tobuy' && (<>
      <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}><input value={newItem} onChange={(e) => setNewItem(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addF(toBuy, setToBuy, saveToBuy)} placeholder="Add item..." style={{ flex: 1, padding: '8px 12px', borderRadius: 8, border: `1px solid ${BORDER}`, fontSize: 13, color: TEXT, background: CARD, outline: 'none' }} /><button onClick={() => addF(toBuy, setToBuy, saveToBuy)} style={{ padding: '8px 16px', borderRadius: 8, border: 'none', background: ROYAL, color: 'white', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>+</button></div>
      <div style={{ background: CARD, borderRadius: 14, border: `1px solid ${BORDER}`, overflow: 'hidden' }}>{toBuy.filter((i) => !i.checked).map((item) => <Check key={item.id} item={item} onToggle={() => toggleF(toBuy, setToBuy, saveToBuy, item.id)} onRemove={() => removeF(toBuy, setToBuy, saveToBuy, item.id)} />)}{toBuy.filter((i) => i.checked).map((item) => <Check key={item.id} item={item} onToggle={() => toggleF(toBuy, setToBuy, saveToBuy, item.id)} onRemove={() => removeF(toBuy, setToBuy, saveToBuy, item.id)} />)}{toBuy.length === 0 && <div style={{ padding: 16, textAlign: 'center', color: MUTED, fontSize: 13 }}>Nothing to buy 🎉</div>}</div>
    </>)}
  </>);
}

// ===========================================
// MAIN APP
// ===========================================
export default function LifeOS({ session }) {
  const [view, setView] = useState('today');
  const [selectedCat, setSelectedCat] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [registry, setRegistry] = useState(null);
  const [meals, setMeals] = useState(null);
  const [weekly, setWeekly] = useState(null);
  const [monthly, setMonthly] = useState(null);
  const [toBuy, setToBuy] = useState(null);
  const [custody, setCustody] = useState(null);
  const [exercise, setExercise] = useState(null);
  const [socialSched, setSocialSched] = useState(null);
  const [kidLogistics, setKidLogistics] = useState(null);

  useEffect(() => {
    async function load() {
      const [r, m, w, mo, tb, c, ex, so, kl] = await Promise.all([
        loadData('registry', DEFAULT_REGISTRY),
        loadData('meals', DEFAULT_MEALS),
        loadData('weekly_shopping', DEFAULT_WEEKLY),
        loadData('monthly_shopping', DEFAULT_MONTHLY),
        loadData('tobuy_shopping', DEFAULT_TOBUY),
        loadData('custody', DEFAULT_CUSTODY),
        loadData('exercise_schedule', DEFAULT_EXERCISE),
        loadData('social_schedule', DEFAULT_SOCIAL_SCHED),
        loadData('kid_logistics', DEFAULT_KID_LOGISTICS),
      ]);
      setRegistry(r); setMeals(m); setWeekly(w); setMonthly(mo); setToBuy(tb);
      setCustody(c); setExercise(ex); setSocialSched(so); setKidLogistics(kl);
      setLoading(false);
    }
    load();
  }, []);

  const save = useCallback(async (key, value) => { setSaving(true); await saveData(key, value); setSaving(false); }, []);

  const updateRegistryItem = useCallback((catKey, itemIndex, updatedItem) => {
    setRegistry((prev) => {
      const updated = { ...prev };
      updated[catKey] = { ...updated[catKey], items: updated[catKey].items.map((item, i) => i === itemIndex ? updatedItem : item) };
      save('registry', updated);
      return updated;
    });
  }, [save]);

  const deleteRegistryItem = useCallback((catKey, itemIndex) => {
    setRegistry((prev) => {
      const updated = { ...prev };
      updated[catKey] = { ...updated[catKey], items: updated[catKey].items.filter((_, i) => i !== itemIndex) };
      save('registry', updated);
      return updated;
    });
  }, [save]);

  const addRegistryItem = useCallback((catKey, newItem) => {
    setRegistry((prev) => {
      const updated = { ...prev };
      updated[catKey] = { ...updated[catKey], items: [...updated[catKey].items, newItem] };
      save('registry', updated);
      return updated;
    });
  }, [save]);

  const logout = async () => { await supabase.auth.signOut(); };

  if (loading || !registry) return <div style={{ minHeight: '100vh', background: BG, display: 'flex', alignItems: 'center', justifyContent: 'center', color: MUTED, fontFamily: "'Outfit', sans-serif" }}>Loading your life...</div>;

  const allItems = [];
  Object.entries(registry).forEach(([ck, cat]) => { cat.items.forEach((item) => allItems.push({ ...item, catKey: ck })); });
  const needsLove = allItems.filter((i) => i.status === 'needs-love');
  const headsUp = allItems.filter((i) => i.status === 'heads-up');
  const handled = allItems.filter((i) => i.status === 'handled');

  const tab = (id, label, emoji) => (<button key={id} onClick={() => { setView(id); setSelectedCat(null); }} style={{ flex: 1, padding: '10px 0', background: 'none', border: 'none', borderBottom: view === id ? `2.5px solid ${ROYAL}` : '2.5px solid transparent', fontSize: 11, fontWeight: view === id ? 600 : 400, color: view === id ? TEXT : MUTED, cursor: 'pointer' }}>{emoji} {label}</button>);

  const today = new Date();
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const dateStr = `${dayNames[today.getDay()]} ${today.getDate()} ${monthNames[today.getMonth()]}`;
  const userName = session?.user?.email?.includes('chloe') ? 'Chloë' : session?.user?.email?.includes('cameron') ? 'Cameron' : 'there';

  return (
    <div style={{ minHeight: '100vh', background: BG, maxWidth: 440, margin: '0 auto', paddingBottom: 80 }}>
      {/* HEADER */}
      <div style={{ padding: '28px 22px 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 12, color: MUTED, fontWeight: 400, letterSpacing: '0.04em', textTransform: 'uppercase' }}>{dateStr}</div>
            <h1 style={{ fontSize: 26, fontFamily: "'Fraunces', serif", fontWeight: 600, margin: '2px 0 0' }}>Hey {userName} 👋</h1>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {saving && <span style={{ fontSize: 10, color: SAGE }}>Saving...</span>}
            <div onClick={logout} style={{ width: 38, height: 38, borderRadius: 19, background: `linear-gradient(135deg, ${ROYAL}, ${TEAL})`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>C+C</div>
          </div>
        </div>
      </div>

      {/* TABS */}
      <div style={{ display: 'flex', padding: '14px 22px 0', borderBottom: `1px solid ${BORDER}` }}>
        {tab('today', 'Today', '📋')}{tab('schedule', 'Schedule', '📅')}{tab('lists', 'Lists', '🛒')}{tab('registry', 'Registry', '🗄️')}{tab('manual', 'Manual', '📖')}
      </div>

      {/* CONTENT */}
      <div style={{ padding: '18px 22px' }}>

        {/* ========= TODAY TAB ========= */}
        {view === 'today' && (<>
          {/* Status summary */}
          <div style={{ background: `linear-gradient(135deg, ${ROYAL}, ${TEAL})`, borderRadius: 18, padding: '18px 20px', display: 'flex', gap: 12, justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', gap: 16 }}>
              {[{ n: handled.length, l: 'handled' }, { n: headsUp.length, l: 'heads up' }, { n: needsLove.length, l: 'need love' }].map((s, i) => (<div key={i} style={{ textAlign: 'center' }}><div style={{ fontSize: 24, fontFamily: "'Fraunces', serif", fontWeight: 600, color: 'white' }}>{s.n}</div><div style={{ fontSize: 10, color: 'rgba(255,255,255,0.75)', fontWeight: 500 }}>{s.l}</div></div>))}
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}><div style={{ fontSize: 13, color: 'rgba(255,255,255,0.9)', fontWeight: 500, textAlign: 'right', lineHeight: 1.4 }}>{needsLove.length === 0 ? "Everything's humming ✨" : needsLove.length <= 3 ? 'Almost there 👊' : 'A few things need you'}</div></div>
          </div>

          {/* Custody */}
          {custody && <div style={{ marginTop: 20 }}><SectionTitle text="👦 Boys" /><div style={{ display: 'flex', gap: 12 }}><div style={{ flex: 1 }}><CustodyStrip days={custody.thisWeek} label="This week" /></div><div style={{ flex: 1 }}><CustodyStrip days={custody.nextWeek} label="Next week" /></div></div></div>}

          {/* This week schedule - built dynamically from registry/schedule/meals */}
          <div style={{ marginTop: 20 }}><SectionTitle text="This week" /><ScheduleCard days={buildWeekView('thisWeek', { meals, exercise, socialSched, kidLogistics, custody, registry })} startCollapsed={false} /><div style={{ display: 'flex', gap: 10, marginTop: 8, flexWrap: 'wrap' }}>{[{ l: 'Chloë', c: COLORS.chloe }, { l: 'Cameron', c: COLORS.cameron }, { l: 'Together', c: COLORS.shared }, { l: 'Kids', c: COLORS.kids }, { l: 'House', c: COLORS.home }].map((x, i) => (<span key={i} style={{ fontSize: 10, display: 'flex', alignItems: 'center', gap: 4 }}><span style={{ width: 8, height: 8, borderRadius: 4, background: x.c }} />{x.l}</span>))}</div></div>
          <div style={{ marginTop: 20 }}><SectionTitle text="Next week" /><ScheduleCard days={buildWeekView('nextWeek', { meals, exercise, socialSched, kidLogistics, custody, registry })} startCollapsed={true} /></div>

          {/* Needs love */}
          {needsLove.length > 0 && <div style={{ marginTop: 20 }}><SectionTitle text={`💛 Needs some love (${needsLove.length})`} color={CORAL} />{needsLove.map((item, i) => (<div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '11px 14px', background: CARD, borderRadius: 12, marginBottom: 6, border: `1px solid ${BORDER}` }}><div><div style={{ fontSize: 13, fontWeight: 500, color: TEXT }}>{item.name}</div><div style={{ fontSize: 11, color: MUTED, marginTop: 1 }}>{item.owner} · {item.next}</div></div>{item.action && <button style={{ fontSize: 11, padding: '5px 12px', borderRadius: 7, border: 'none', background: '#FEF0ED', color: CORAL, cursor: 'pointer', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 4 }}>🤖 {item.action}</button>}</div>))}</div>}

          {/* Heads up */}
          {headsUp.length > 0 && <div style={{ marginTop: 20 }}><SectionTitle text={`👀 Heads up (${headsUp.length})`} color={PURPLE} />{headsUp.map((item, i) => (<div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '11px 14px', background: CARD, borderRadius: 12, marginBottom: 6, border: `1px solid ${BORDER}` }}><div><div style={{ fontSize: 13, fontWeight: 500, color: TEXT }}>{item.name}</div><div style={{ fontSize: 11, color: MUTED, marginTop: 1 }}>{item.owner} · {item.next}</div></div>{item.action && <button style={{ fontSize: 11, padding: '5px 12px', borderRadius: 7, border: 'none', background: '#F3EFF8', color: PURPLE, cursor: 'pointer', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 4 }}>🤖 {item.action}</button>}</div>))}</div>}
        </>)}

        {/* ========= SCHEDULE TAB ========= */}
        {view === 'schedule' && exercise && socialSched && kidLogistics && (
          <SchedulesTab
            exercise={exercise} setExercise={setExercise} saveExercise={(v) => save('exercise_schedule', v)}
            socialSched={socialSched} setSocialSched={setSocialSched} saveSocialSched={(v) => save('social_schedule', v)}
            kidLogistics={kidLogistics} setKidLogistics={setKidLogistics} saveKidLogistics={(v) => save('kid_logistics', v)}
            custody={custody} setCustody={setCustody} saveCustody={(v) => save('custody', v)}
          />
        )}

        {/* ========= LISTS TAB ========= */}
        {view === 'lists' && meals && weekly && monthly && toBuy && (
          <ListsTab meals={meals} setMeals={setMeals} saveMeals={(v) => save('meals', v)} weekly={weekly} setWeekly={setWeekly} saveWeekly={(v) => save('weekly_shopping', v)} monthly={monthly} setMonthly={setMonthly} saveMonthly={(v) => save('monthly_shopping', v)} toBuy={toBuy} setToBuy={setToBuy} saveToBuy={(v) => save('tobuy_shopping', v)} />
        )}

        {/* ========= REGISTRY TAB ========= */}
        {view === 'registry' && !selectedCat && (<>
          <p style={{ fontSize: 13, color: MUTED, margin: '0 0 14px' }}>Your life's filing cabinet.</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {Object.entries(registry).map(([key, cat]) => {
              const nl = cat.items.filter((i) => i.status === 'needs-love').length;
              const hu = cat.items.filter((i) => i.status === 'heads-up').length;
              const allGood = nl === 0 && hu === 0;
              const ta = cat.items.reduce((a, i) => a + (i.docs?.length || 0) + (i.contacts?.length || 0), 0);
              return (<button key={key} onClick={() => setSelectedCat(key)} style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 14, padding: '18px 16px', textAlign: 'left', cursor: 'pointer' }}><div style={{ fontSize: 24, marginBottom: 6 }}>{cat.emoji}</div><div style={{ fontSize: 14, fontWeight: 600, color: TEXT }}>{cat.label}</div><div style={{ fontSize: 12, color: MUTED, marginTop: 2 }}>{cat.items.length} items{ta > 0 && ` · ${ta} 📎`}</div><div style={{ fontSize: 11, marginTop: 4 }}>{allGood ? <span style={{ color: SAGE }}>All good ✓</span> : nl > 0 ? <span style={{ color: CORAL }}>💛 {nl}</span> : <span style={{ color: PURPLE }}>👀 {hu}</span>}</div></button>);
            })}
          </div>
        </>)}

        {view === 'registry' && selectedCat && (<>
          <button onClick={() => setSelectedCat(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontSize: 13, color: MUTED, marginBottom: 12 }}>← Back</button>
          <h2 style={{ fontSize: 22, fontFamily: "'Fraunces', serif", fontWeight: 600, margin: '0 0 12px' }}>{registry[selectedCat].emoji} {registry[selectedCat].label}</h2>
          <DateFormatTip />
          {registry[selectedCat].items
            .map((item, origIdx) => ({ item, origIdx }))
            .sort((a, b) => STATUS_CONFIG[a.item.status].sort - STATUS_CONFIG[b.item.status].sort)
            .map(({ item, origIdx }) => (
              <ItemRow key={origIdx} item={item} onUpdate={(updated) => updateRegistryItem(selectedCat, origIdx, updated)} onDelete={() => deleteRegistryItem(selectedCat, origIdx)} />
            ))}
          <AddItemForm onAdd={(newItem) => addRegistryItem(selectedCat, newItem)} />
        </>)}

        {/* ========= MANUAL TAB ========= */}
        {view === 'manual' && (<>
          <div style={{ padding: 22, background: `linear-gradient(135deg, ${TEXT}, #2E3548)`, borderRadius: 20, marginBottom: 16, color: 'white' }}><h3 style={{ fontSize: 20, fontFamily: "'Fraunces', serif", fontWeight: 600, margin: '0 0 6px' }}>The Manual</h3><p style={{ fontSize: 13, margin: 0, opacity: 0.8, lineHeight: 1.5 }}>Everything someone would need to keep your life running.</p></div>
          {[{ emoji: '📞', title: 'Key contacts', desc: `${allItems.reduce((a, i) => a + (i.contacts?.length || 0), 0)} contacts stored` }, { emoji: '📎', title: 'Documents & files', desc: `${allItems.reduce((a, i) => a + (i.docs?.length || 0), 0)} documents stored` }, { emoji: '🔄', title: 'What recurs and who owns it', desc: `${allItems.length} items across ${Object.keys(registry).length} categories` }, { emoji: '👦', title: "Kids' routines + sizes", desc: 'School, pick-ups, lessons, medical, clothing' }, { emoji: '💳', title: 'Financial overview', desc: 'Accounts, insurance, investments, tax' }, { emoji: '🔐', title: 'Account access', desc: 'Password manager, shared accounts' }].map((s, i) => (<div key={i} style={{ padding: '14px 16px', background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, marginBottom: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 14 }}><span style={{ fontSize: 22 }}>{s.emoji}</span><div style={{ flex: 1 }}><div style={{ fontSize: 14, fontWeight: 600 }}>{s.title}</div><div style={{ fontSize: 12, color: MUTED, marginTop: 1 }}>{s.desc}</div></div><span style={{ color: '#CDD1D9', fontSize: 14 }}>→</span></div>))}
        </>)}
      </div>
    </div>
  );
}
