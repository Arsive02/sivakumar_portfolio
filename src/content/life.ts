type MediaMeta = { label: string; source: string; duration?: string; aspect: '16/9' | '9/16' }
export interface Hobby {
  title: string
  line: string
  detail: string
  /** Optimised GLB in /models, shown in the tile beside the heading. */
  model: { url: string; axis?: 'x' | 'y'; note: string }
  media?: ({ kind: 'video'; src: string; poster: string } | { kind: 'youtube'; id: string }) & MediaMeta
  links?: { label: string; href: string }[]
}

export const hobbies: Hobby[] = [
  {
    title: 'Flute',
    line: 'A bamboo flute and a lot of patience.',
    detail: 'I started with breathing and basic notes, moved on to a few classical pieces, picked up some contemporary style, and played my first public performance. These days I am working on ear training and improvisation.',
    model: { url: '/models/venu.glb', axis: 'x', note: 'venu · 8 holes · bamboo' },
    media: { kind: 'video', src: '/media/flute', poster: '/media/flute-poster.webp', label: 'Live recital', source: 'CU Boulder', duration: '6:33', aspect: '16/9' },
  },
  {
    title: 'Chess',
    line: 'Path to some title :)',
    detail: 'I climbed past 1000 Elo, played a few local tournaments and got beaten by nine-year-olds more than once. Right now I am trying to get off the 1200 plateau and reach 1400.',
    model: { url: '/models/knight.glb', note: 'Staunton knight' },
    media: { kind: 'youtube', id: 'XfDiKDH0_WM', label: 'Over the board', source: 'YouTube Shorts', aspect: '9/16' },
    links: [
      { label: 'lichess', href: 'https://lichess.org/@/Arsive02' },
      { label: 'chess.com', href: 'https://www.chess.com/member/arsive' },
    ],
  },
  {
    title: 'Boxing',
    line: 'Physical combat class.',
    detail: 'I have the stances and combinations down. Next up is my first sparring match.',
    model: { url: '/models/glove.glb', note: 'one glove, laced' },
  },
  {
    title: 'Japanese',
    line: 'One kana at a time.',
    detail: 'Hiragana and katakana first, then kanji and conversation. I passed JLPT N5 and I am working toward the next level.',
    model: { url: '/models/torii.glb', note: 'torii, a gate into something new' },
  },
]

export type ResourceType = 'book' | 'course' | 'playlist' | 'article' | 'website'
export interface Resource {
  title: string
  author: string
  link: string
  type: ResourceType
  topic: 'Quantum' | 'Linear Algebra' | 'Deep Learning' | 'NLP' | 'Statistics'
}

export const resources: Resource[] = [
  { title: 'Dancing with Qubits', author: 'Robert Sutor', link: 'https://learning.oreilly.com/library/view/dancing-with-qubits', type: 'book', topic: 'Quantum' },
  { title: 'Q-CTRL Open Controls', author: 'Q-CTRL', link: 'https://q-ctrl.com/products/open-controls/', type: 'article', topic: 'Quantum' },
  { title: 'Azure Quantum Katas', author: 'Microsoft', link: 'https://learn.microsoft.com/en-us/azure/quantum/', type: 'course', topic: 'Quantum' },
  { title: 'Essence of Linear Algebra', author: 'Grant Sanderson · 3Blue1Brown', link: 'https://www.3blue1brown.com/topics/linear-algebra', type: 'playlist', topic: 'Linear Algebra' },
  { title: 'Interactive Linear Algebra', author: 'Immersive Math', link: 'https://immersivemath.com/ila/index.html', type: 'website', topic: 'Linear Algebra' },
  { title: 'MIT 18.06 Linear Algebra', author: 'Gilbert Strang', link: 'https://www.youtube.com/playlist?list=PLE7DDD91010BC51F8', type: 'playlist', topic: 'Linear Algebra' },
  { title: 'Linear Algebra and its Applications', author: 'David C. Lay', link: 'https://a.co/d/2E6nM30', type: 'book', topic: 'Linear Algebra' },
  { title: 'Neural Networks: Zero to Hero', author: 'Andrej Karpathy', link: 'https://karpathy.ai/zero-to-hero.html', type: 'course', topic: 'Deep Learning' },
  { title: 'Deep Learning', author: 'Goodfellow, Bengio & Courville', link: 'https://www.deeplearningbook.org/', type: 'book', topic: 'Deep Learning' },
  { title: 'Transformers from Scratch', author: 'Brandon Rohrer', link: 'https://e2eml.school/transformers.html', type: 'article', topic: 'NLP' },
  { title: 'Speech and Language Processing', author: 'Jurafsky & Martin', link: 'https://web.stanford.edu/~jurafsky/slp3/', type: 'book', topic: 'NLP' },
  { title: 'An Introduction to Statistical Learning', author: 'James, Witten, Hastie & Tibshirani', link: 'https://www.statlearning.com/', type: 'book', topic: 'Statistics' },
  { title: 'StatQuest', author: 'Josh Starmer', link: 'https://www.youtube.com/user/joshstarmer', type: 'playlist', topic: 'Statistics' },
]
