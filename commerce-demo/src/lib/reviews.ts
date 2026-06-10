export interface ChismisReview {
  rating: 1 | 2 | 3 | 4 | 5
  author: string
  comment: string
  image?: string
}

export const productReviews: Record<string, ChismisReview[]> = {
  'galunggong': [
    { rating: 4, author: 'Marites D.', comment: 'Sariwa! Pero konti lang yung laman. Pero sulit naman sa presyo. Bumili na ulit ako kahapon.' },
    { rating: 5, author: 'Mang Jose', comment: 'Presyong sari-sari store talaga! Sariwang-sariwa, bagong huli. Perfect pang-sinigang.' },
    { rating: 3, author: 'Aling Bebang', comment: 'Maliit yung iba pero ok naman. Sana next time mas malalaki.' },
  ],
  'tilapia': [
    { rating: 5, author: 'Kapitan Boy', comment: 'Sariwang tilapia! Malinis at walang malansa. Prito ko lang, sarap!' },
    { rating: 4, author: 'Mely S.', comment: 'Masarap i-sinampalukan. Fresh at walang tunaw. Sulit sa presyo.' },
  ],
  'bangus': [
    { rating: 4, author: 'Tita Liza', comment: 'Daing na bangus — ang sarap! Sana magkaroon ulit ng stock.' },
  ],
  'itlog': [
    { rating: 5, author: 'Nene C.', comment: 'Sariwang itlog! Dilaw ng pula, makapal ang puti. Perfect pang-almusal.' },
    { rating: 5, author: 'Jun B.', comment: 'Malalaki yung itlog, worth it. Bumili ako ng 12, lahat fresh.' },
    { rating: 4, author: 'Ate Glo', comment: 'Mura at sariwa. Pang-tortang talong, bagay na bagay.' },
  ],
  'pancit-canton': [
    { rating: 5, author: 'Ryan P.', comment: 'Hindi nababasa, hindi nasisira yung noodles. Paborito ng mga bata!' },
    { rating: 4, author: 'Mama Jun', comment: 'Laging available, mabilis lutuin. Lagi akong may stock nito.' },
  ],
  'sibuyas': [
    { rating: 5, author: 'Mang Bert', comment: 'Sariwang sibuyas! Malalaki at hindi bulok. Sulit sa 1kg pack.' },
    { rating: 4, author: 'Gloria M.', comment: 'Matamis ang sibuyas, perfect pang-ensalada. Sana laging may stock.' },
  ],
  'saging-saba': [
    { rating: 4, author: 'Tina R.', comment: 'Saba pambalot ng turon, tamang-tama! Hinog pero hindi sobra.' },
    { rating: 5, author: 'Kyle D.', comment: 'Pinakuluan ko, ginawa kong minatamis. Ang sarap, try niyo!' },
    { rating: 3, author: 'Lorna B.', comment: 'Mura pero maliit yung piling. Sana mas marami yung piraso.' },
  ],
  'kopiko': [
    { rating: 5, author: 'Ofelia T.', comment: 'Tamang kape para sa umaga. Hindi matamis, hindi mapait. Perfect!' },
    { rating: 4, author: 'Ricky A.', comment: 'Mura at masarap. Lagi akong may stock sa desk ko.' },
  ],
}
