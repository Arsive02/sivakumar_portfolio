export type AchievementKind = 'award' | 'certification' | 'contribution'

export interface Achievement {
  title: string
  issuer: string
  date: string
  kind: AchievementKind
  /** Relative weight → Voronoi cell area. */
  weight: number
  link?: string
}

export const achievements: Achievement[] = [
  { title: '1st place, Kaggle Goodreads rating prediction', issuer: 'Kaggle', date: '2023', kind: 'award', weight: 3, link: 'https://www.kaggle.com/competitions/goodreads-books-reviews-290312/leaderboard' },
  { title: '2nd place, National Mathematics Conference', issuer: 'SRM Institute of Science and Technology', date: '2018', kind: 'award', weight: 2.2 },
  { title: '3rd place, national paper presentation on AIoT', issuer: 'Prince Shri Bhavani College of Engineering', date: '2021', kind: 'award', weight: 1.6 },
  { title: 'Academic Excellence Award', issuer: 'Sri Sai Ram Engineering College, Anna University', date: '2019', kind: 'award', weight: 1.6 },
  { title: 'Merit Scholarship', issuer: 'Sembakkam Municipality', date: '2018', kind: 'award', weight: 1.2 },
  { title: 'Natural Language Processing Specialization', issuer: 'DeepLearning.AI · Stanford', date: '2022', kind: 'certification', weight: 1.8, link: 'https://www.coursera.org/account/accomplishments/specialization/JFDNHB4YM3AR' },
  { title: 'Deep Learning Specialization', issuer: 'DeepLearning.AI', date: '2022', kind: 'certification', weight: 1.8, link: 'https://www.coursera.org/account/accomplishments/specialization/DEVTH7W95X9T' },
  { title: 'Machine Learning', issuer: 'Stanford · Andrew Ng', date: '2022', kind: 'certification', weight: 1.4, link: 'https://www.coursera.org/account/accomplishments/verify/Q7G4VB62HQBK' },
  { title: 'Image Super-Resolution with Autoencoders', issuer: 'Coursera', date: '2020', kind: 'certification', weight: 0.9, link: 'https://www.coursera.org/account/accomplishments/verify/224HMQYX5MP6' },
  { title: 'Image Classification with TensorFlow', issuer: 'Coursera', date: '2020', kind: 'certification', weight: 0.9, link: 'https://www.coursera.org/account/accomplishments/verify/W2HZ4BZDQ54H' },
  { title: 'Problem Solving', issuer: 'HackerRank', date: '2021', kind: 'certification', weight: 0.8, link: 'https://www.hackerrank.com/certificates/3C2D7E87403C' },
  { title: 'Python', issuer: 'HackerRank', date: '2021', kind: 'certification', weight: 0.8, link: 'https://www.hackerrank.com/certificates/8ED97EAC7704' },
  { title: 'Programming with MATLAB', issuer: 'Vanderbilt University', date: '2020', kind: 'certification', weight: 0.8, link: 'https://www.coursera.org/account/accomplishments/verify/LGLX4PLXAGQG' },
  { title: 'Git and GitHub', issuer: 'Google', date: '2020', kind: 'certification', weight: 0.7, link: 'https://www.coursera.org/account/accomplishments/verify/EKH2UNG5RWNG' },
  { title: 'JLPT N5 in Japanese', issuer: 'The Japan Foundation', date: '2019', kind: 'certification', weight: 1, link: '/docs/jlpt.pdf' },
  { title: 'T5 Goodreads model on Hugging Face', issuer: 'Open source', date: '2023', kind: 'contribution', weight: 1.2, link: 'https://huggingface.co/Arsive' },
]
