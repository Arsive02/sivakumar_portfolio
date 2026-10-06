export type SkillGroup = 'ml' | 'quantum' | 'lang' | 'tools'

export interface Skill {
  id: string
  group: SkillGroup
}

export const groupLabels: Record<SkillGroup, string> = {
  ml: 'AI & Machine Learning',
  quantum: 'Quantum',
  lang: 'Languages',
  tools: 'Tools & Platforms',
}

export const skills: Skill[] = [
  { id: 'Deep Learning', group: 'ml' },
  { id: 'NLP', group: 'ml' },
  { id: 'Computer Vision', group: 'ml' },
  { id: 'Multimodal', group: 'ml' },
  { id: 'RAG', group: 'ml' },
  { id: 'Agentic AI', group: 'ml' },
  { id: 'Multi-agent', group: 'ml' },
  { id: 'LLM eval', group: 'ml' },
  { id: 'RL / RLHF', group: 'ml' },
  { id: 'Statistics', group: 'ml' },
  { id: 'Qubits', group: 'quantum' },
  { id: 'Quantum Algos', group: 'quantum' },
  { id: 'Python', group: 'lang' },
  { id: 'SQL', group: 'lang' },
  { id: 'Java', group: 'lang' },
  { id: 'JavaScript', group: 'lang' },
  { id: 'R', group: 'lang' },
  { id: 'PyTorch', group: 'tools' },
  { id: 'TensorFlow', group: 'tools' },
  { id: 'vLLM', group: 'tools' },
  { id: 'Hugging Face', group: 'tools' },
  { id: 'AWS', group: 'tools' },
  { id: 'FastAPI', group: 'tools' },
  { id: 'PostgreSQL', group: 'tools' },
  { id: 'Claude Code', group: 'tools' },
  { id: 'Ray', group: 'tools' },
  { id: 'Docker', group: 'tools' },
]

/**
 * Hand-authored "attention" between skills: how much one leans on another in practice.
 * Symmetric; rendered as an attention matrix and as edge weights in the force graph.
 */
const pairs: [string, string, number][] = [
  ['Deep Learning', 'PyTorch', 1], ['Deep Learning', 'TensorFlow', 0.7], ['Deep Learning', 'Computer Vision', 0.9],
  ['Deep Learning', 'NLP', 0.9], ['Deep Learning', 'Multimodal', 0.8], ['Deep Learning', 'Python', 0.9],
  ['NLP', 'RAG', 1], ['NLP', 'Hugging Face', 0.9], ['NLP', 'Agentic AI', 0.7], ['NLP', 'RL / RLHF', 0.6],
  ['RAG', 'vLLM', 1], ['RAG', 'PostgreSQL', 0.6], ['RAG', 'FastAPI', 0.7], ['RAG', 'Agentic AI', 0.8],
  ['Agentic AI', 'AWS', 0.8], ['Agentic AI', 'Python', 0.7],
  ['Computer Vision', 'Multimodal', 0.8], ['Computer Vision', 'PyTorch', 0.8], ['Multimodal', 'Hugging Face', 0.6],
  ['RL / RLHF', 'PyTorch', 0.7], ['Statistics', 'R', 0.9], ['Statistics', 'Python', 0.7],
  ['Statistics', 'Deep Learning', 0.6], ['Qubits', 'Quantum Algos', 1], ['Quantum Algos', 'Python', 0.5],
  ['Qubits', 'Statistics', 0.4], ['Python', 'PyTorch', 0.9], ['Python', 'FastAPI', 0.8], ['SQL', 'PostgreSQL', 1],
  ['Java', 'SQL', 0.5], ['JavaScript', 'Python', 0.3], ['AWS', 'FastAPI', 0.5], ['vLLM', 'PyTorch', 0.7],
  ['Multi-agent', 'Agentic AI', 1], ['Multi-agent', 'Claude Code', 0.8], ['Multi-agent', 'AWS', 0.6], ['LLM eval', 'RAG', 0.9],
  ['LLM eval', 'RL / RLHF', 0.6], ['Claude Code', 'Python', 0.6], ['Ray', 'Python', 0.8], ['Ray', 'Docker', 0.5], ['Docker', 'AWS', 0.7],
  ['Agentic AI', 'Claude Code', 0.7],
]

export const attention: number[][] = (() => {
  const idx = new Map(skills.map((s, i) => [s.id, i]))
  const m = skills.map(() => skills.map(() => 0))
  for (const [a, b, w] of pairs) {
    const i = idx.get(a)!, j = idx.get(b)!
    m[i][j] = m[j][i] = w
  }
  skills.forEach((_, i) => (m[i][i] = 1))
  return m
})()
