// GREA's Anatomy — in-app expert agent
// Free/on-device: curated knowledge base + existing atlas tool bridge.
// A real LLM backend can be slotted in later by replacing `expertAnswer`.

import { SYSTEMS } from './anatomy';
import type { Concept } from './anatomy';

export type ExpertTopic =
  | 'app.whatIsThis'
  | 'app.systemsPanel'
  | 'app.searchPanel'
  | 'app.detailPanel'
  | 'app.explodeControl'
  | 'app.viewControls'
  | 'app.rotateControl'
  | 'app.resetControl'
  | 'app.mobileLayout'
  | 'app.modelSource'
  | 'app.scopeDisclaimer'
  | 'app.credits'
  | 'anatomy.system'
  | 'anatomy.structure'
  | 'anatomy.unknown';

export interface ExpertFact {
  topic: ExpertTopic;
  routing: string[]; // lowercase keywords that should trigger this fact
  answer: string;
}

const APP_FACTS: ExpertFact[] = [
  {
    topic: 'app.whatIsThis',
    routing: ['what is', 'what\'s this', 'about', 'what is this app', 'what is the app', 'what is grea', 'grea anatomy', 'grea\'s anatomy', 'grea’s anatomy', 'explain', 'app'],
    answer: `GREA's Anatomy is an interactive 3D anatomy explorer. It loads a BodyParts3D-based male reference body with 2,234 individually selectable pieces across 15 anatomical systems. You can orbit and zoom the model, toggle entire systems on and off, explode the body into a spaced inventory of every visible piece, search for named structures, and tap any piece to inspect it. The same viewer is available on the web at the project site, and this app is the iOS build of that viewer.`,
  },
  {
    topic: 'app.systemsPanel',
    routing: ['system', 'systems', 'layer', 'layers', 'panel', 'side panel', 'left panel', 'what are the systems', 'system list', 'toggle'],
    answer: `The Systems panel lists the 15 anatomical systems in the atlas: Skeleton, Muscles, Heart, Sensory organs, Arteries, Veins, Nervous system, Respiratory, Digestive, Urinary, Lymphatic, Endocrine, Reproductive, Body surface, and Connective tissue. Each row has a colored dot, the system name, and the piece count. Tapping a row shows only that system; the switch on the right toggles that system on or off while leaving the rest of the visible set unchanged. The All and Skeleton and Organs preset buttons at the top quickly switch between useful starting views.`,
  },
  {
    topic: 'app.searchPanel',
    routing: ['search', 'find', 'find a structure', 'search panel', 'search for', 'slash', '/', 'keyboard shortcut'],
    answer: `The Find a structure panel opens with the / key or the Find a structure button. Type any anatomical name or source identifier — heart, femur, cranial nerve, and so on — and it shows up to 80 matching concepts sorted by how short the name is. Tap a result to select it in the 3D view and open its detail panel. If nothing matches, try a shorter or more general term, because the atlas contains over 3,400 named concepts.`,
  },
  {
    topic: 'app.detailPanel',
    routing: ['detail', 'inspect', 'tap', 'selected', 'selected structure', 'detail panel', 'sheet', 'info', 'what happens when i tap', 'tapped'],
    answer: `When you tap a piece in the 3D view, the app selects it and opens the detail sheet. The sheet shows the structure name, which system it belongs to, a plain-language explanation when one exists, the atlas reference id, and how many pieces are selected. If a concept contains multiple meshes, the sheet also lists the included structures so you can jump between them. The Isolate structure button hides everything except the selected pieces and recenters the camera; Clear selection closes the selection and the sheet.`,
  },
  {
    topic: 'app.explodeControl',
    routing: ['explode', 'exploded', 'separate', 'spread', 'slide', 'slider', 'pieces apart', 'pull apart', 'inventory'],
    answer: `The Explode anatomy slider pulls the visible pieces apart from their assembled positions into a spaced inventory. At zero percent the body is whole. Around 45 percent the pieces begin moving outward from their system grouping. Past roughly 95 percent the body is fully exploded and the caption changes to ANATOMICAL INVENTORY. Drag to pan in that state. The slider only affects visible pieces, so hiding a system first keeps those pieces out of the exploded layout.`,
  },
  {
    topic: 'app.viewControls',
    routing: ['view', 'camera', 'angle', '¾', 'three quarter', 'front', 'side', 'back', 'view buttons', 'camera view', 'perspective'],
    answer: `The view buttons set the camera angle: ¾ is the default three-quarter view, F is front, S is side, and B is back. Changing the view re-fits the camera to frame the body at that angle. The explode slider can override the view — very high explode values force a front view so the exploded inventory stays readable. The buttons are disabled while the body is mostly exploded, because the camera is busy framing the spread-out pieces.`,
  },
  {
    topic: 'app.rotateControl',
    routing: ['rotate', 'auto rotate', 'spinning', 'rotation', 'animate', 'auto-rotate', 'play'],
    answer: `The rotate button turns automatic rotation on and off. When it is on, the body slowly spins on its vertical axis so you can inspect it hands-free. Rotation stops when the body is exploded past about 40 percent, because at that point dragging is panning the spread-out pieces instead of orbiting the whole body.`,
  },
  {
    topic: 'app.resetControl',
    routing: ['reset', 'assemble', 'back to normal', 'restore', 'undo', 'clear', 'start over', 'default'],
    answer: `Reset assembles the body back to its full default state: explode goes to zero, only the standard visible systems remain, the selection clears, and the camera returns to the default three-quarter view. It is the quickest way to get back to a clean starting point after experimenting with layers, search, or explosion.`,
  },
  {
    topic: 'app.mobileLayout',
    routing: ['phone', 'mobile', 'small screen', 'touch', 'iphone', 'layout', 'bottom', 'dock', 'where is', 'where are the', 'controls moved'],
    answer: `On a phone the app keeps the camera and selection controls away from the part of the screen you use to tap anatomy. The top controls move down, the system layers panel becomes a bottom sheet you open from the dock, the view buttons spread across the middle of the screen, and the detail sheet and search panel reflow to fit a tall narrow screen. The dock at the bottom holds the Systems button, the explode slider, and the reset button. Pinch to zoom and drag to orbit still work the same way.`,
  },
  {
    topic: 'app.modelSource',
    routing: ['source', 'bodyparts3d', 'where does', 'where do', 'from', 'downloaded', 'data', 'model', 'mesh', 'geometry', 'file', 'offline', 'bundle', 'packaged'],
    answer: `The model in this viewer comes from BodyParts3D 4.0, an adult male reference anatomy maintained by the Database Center for Life Science. The app packages the converted geometry and the atlas catalogue so the viewer can run offline; on first launch it reads the bundled atlas.json and the binary model chunks from the app bundle. The packaged model contains about 2.3 million triangles and downloads roughly 33 MB of compressed geometry. The full source geometry and metadata are available from the BodyParts3D site listed in the Source & credits sheet.`,
  },
  {
    topic: 'app.scopeDisclaimer',
    routing: ['diagnostic', 'surgical', 'medical advice', 'accuracy', 'every structure', 'complete', 'variation', 'not a', 'not for', 'limitation', 'disclaimer', 'scope'],
    answer: `This is an educational explorer, not a diagnostic or surgical tool. The BodyParts3D male reference does not contain every human structure or variation, and named concepts can group multiple meshes together, so a single name can correspond to several visible pieces. The geometry is simplified for the web and for mobile performance. Use it to learn and explore anatomy, not to make clinical decisions. The dataset itself is licensed CC BY 4.0, and the app preserves the source attribution in the Source & credits sheet.`,
  },
  {
    topic: 'app.credits',
    routing: ['credit', 'license', 'attribution', 'cite', 'source link', 'bodyparts3d license', 'dataset', 'publication', 'who made', 'made by', 'owner'],
    answer: `The anatomical data is BodyParts3D, maintained by the Database Center for Life Science, licensed under CC Attribution 4.0 International. The original geometry and English metadata come from the BodyParts3D download page, and the source publication is in Nucleic Acids Research. The app code itself is MIT-licensed. The Source & credits sheet in the app links to the dataset license, the original geometry and metadata, and the source publication.`,
  },
];

const SYSTEM_FACTS: ExpertFact[] = SYSTEMS.map((s): ExpertFact => ({
  topic: 'anatomy.system',
  routing: [s.id, s.name.toLowerCase(), s.name.toLowerCase().slice(0, 6)],
  answer: `${s.name}: ${s.description}`,
}));

export const EXPERT_FACTS: ExpertFact[] = [
  ...APP_FACTS,
  ...SYSTEM_FACTS,
];

function score(query: string, fact: ExpertFact): number {
  const terms = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
  if (terms.length === 0) return 0;
  const routing = fact.routing.map(r => r.toLowerCase());
  let hits = 0;
  for (const term of terms) {
    for (const r of routing) {
      if (r.includes(term) || term.includes(r)) {
        hits += r.split(/\s+/).length;
      }
    }
  }
  // Favor concise, specific matches over long multi-word routing strings.
  return hits;
}

export function expertTopic(query: string): ExpertTopic {
  const trimmed = query.trim();
  if (!trimmed) return 'app.whatIsThis';
  let best: ExpertFact | null = null;
  let bestScore = 0;
  for (const fact of EXPERT_FACTS) {
    const s = score(trimmed, fact);
    if (s > bestScore) {
      bestScore = s;
      best = fact;
    }
  }
  if (!best) return 'anatomy.unknown';
  return best.topic;
}

export function expertAnswer(query: string): string {
  const trimmed = query.trim();
  if (!trimmed) return APP_FACTS[0].answer;
  let best: ExpertFact | null = null;
  let bestScore = 0;
  for (const fact of EXPERT_FACTS) {
    const s = score(trimmed, fact);
    if (s > bestScore) {
      bestScore = s;
      best = fact;
    }
  }
  if (!best) {
    return "I can explain the app’s controls, the anatomical systems, and how the viewer works. Try asking about the Systems panel, the explode slider, the view buttons, search, the detail sheet, what the model is based on, or a specific system like skeleton or heart.";
  }
  return best.answer;
}

export function expertSuggest(): string[] {
  return [
    'What is GREA’s Anatomy?',
    'What do the system layers do?',
    'How does the explode slider work?',
    'What do the view buttons do?',
    'What happens when I tap a piece?',
    'What is this model based on?',
    'Is this medically accurate?',
    'Tell me about the skeleton system.',
    'Tell me about the heart.',
  ];
}

export type ExpertToolName = 'find_anatomy' | 'inspect_anatomical_structure';

export interface ExpertToolCall {
  name: ExpertToolName;
  input: { query?: string; id?: string };
}

export interface ExpertTurn {
  role: 'user' | 'assistant' | 'tool';
  content: string;
  toolCall?: ExpertToolCall;
  toolResult?: string;
}

const MAX_TOOL_CALLS_PER_TURN = 2;

export async function expertReply(
  history: ExpertTurn[],
  atlasConcepts: Concept[],
  inspect: (concept: Concept) => void,
): Promise<{ text: string; turns: ExpertTurn[] }> {
  const newTurns: ExpertTurn[] = [...history];
  const lastUser = [...history].reverse().find(t => t.role === 'user');
  const query = lastUser?.content ?? '';

  // 1) Give the free expert a deterministic answer first.
  const baseAnswer = expertAnswer(query);
  const topic = expertTopic(query);

  // 2) If the query looks like a direct anatomy lookup, also run the tool bridge.
  const toolCall = shouldCallTool(topic, query, atlasConcepts);
  if (toolCall) {
    const result = await executeTool(toolCall, atlasConcepts, inspect);
    newTurns.push({ role: 'user', content: query });
    newTurns.push({ role: 'assistant', content: baseAnswer, toolCall });
    newTurns.push({ role: 'tool', content: result, toolCall });
    const enriched = enrichWithToolResult(baseAnswer, result);
    return { text: enriched, turns: newTurns };
  }

  newTurns.push({ role: 'user', content: query });
  newTurns.push({ role: 'assistant', content: baseAnswer });
  return { text: baseAnswer, turns: newTurns };
}

function shouldCallTool(
  topic: ExpertTopic,
  query: string,
  concepts: Concept[],
): ExpertToolCall | null {
  const q = query.toLowerCase().trim();

  // Direct "show me X" / "inspect X" style requests.
  if (/\b(show|inspect|open|select|focus|look at|zoom to|tap)\b/.test(q)) {
    const nameMatch = extractNameQuery(q);
    if (nameMatch) {
      const found = concepts.find(
        c =>
          c.name.toLowerCase() === nameMatch ||
          c.id.toLowerCase() === nameMatch,
      );
      if (found) {
        return { name: 'inspect_anatomical_structure', input: { id: found.id } };
      }
    }
    // Fall back to a find tool call if there is any plausible term.
    const term = extractNameQuery(q) ?? q.replace(/^(show|inspect|open|select|focus|look at|zoom to|tap)\s+/i, '').trim();
    if (term) {
      return { name: 'find_anatomy', input: { query: term } };
    }
  }

  // "what is X" where X looks like an anatomical name.
  if (topic === 'anatomy.structure' || topic === 'anatomy.system') {
    const nameMatch = extractNameQuery(q);
    if (nameMatch) {
      const found = concepts.find(
        c =>
          c.name.toLowerCase() === nameMatch ||
          c.id.toLowerCase() === nameMatch,
      );
      if (found) {
        return { name: 'inspect_anatomical_structure', input: { id: found.id } };
      }
    }
  }

  return null;
}

function extractNameQuery(q: string): string | null {
  const cleaned = q
    .replace(/^(what is|tell me about|explain|describe|who is|where is|find|search for|look up)\s+/i, '')
    .replace(/\?+$/, '')
    .trim();
  if (!cleaned) return null;
  // Take the first substantial token run.
  const candidates = cleaned.split(/\s+(?:and|or|with|in|of|the|for|a|an)\s+/i);
  for (const c of candidates) {
    if (c.length >= 3) return c;
  }
  return cleaned.length >= 3 ? cleaned : null;
}

async function executeTool(
  call: ExpertToolCall,
  concepts: Concept[],
  inspect: (concept: Concept) => void,
): Promise<string> {
  if (call.name === 'find_anatomy') {
    const q = (call.input.query ?? '').toLowerCase().trim();
    const results = concepts
      .filter(c => c.name.toLowerCase().includes(q) || c.id.toLowerCase().includes(q))
      .slice(0, 8)
      .map(c => `${c.name} (${c.elements.length} piece${c.elements.length === 1 ? '' : 's'})`);
    if (!results.length) return `No matching structures found for "${call.input.query}".`;
    return `Found: ${results.join(', ')}.`;
  }

  if (call.name === 'inspect_anatomical_structure') {
    const concept = concepts.find(c => c.id === call.input?.id);
    if (!concept) return `Structure "${call.input?.id}" is not in this atlas.`;
    inspect(concept);
    return `Selected ${concept.name} (${concept.elements.length} piece${concept.elements.length === 1 ? '' : 's'}). Opened its detail panel.`;
  }

  return '';
}

function enrichWithToolResult(base: string, result: string): string {
  if (!result) return base;
  return `${base}\n\n${result}`;
}
