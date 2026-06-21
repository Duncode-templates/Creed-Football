export interface NewsArticle {
  id: string;
  title: string;
  category: string;
  tag: string;
  summary: string;
  content: string;
  date: string;
  readTime: string;
  image: string;
  author: string;
  likes: number;
  comments: number;
  isTrending?: boolean;
  tags?: string[];
  isFromFirestore?: boolean;
}

export type MatchStatus = 'LIVE' | 'FT' | 'UPCOMING';

export interface MatchEvent {
  type: 'goal' | 'card_yellow' | 'card_red' | 'substitution';
  player: string;
  minute: number;
  team: 'home' | 'away';
  detail?: string;
}

export interface Match {
  id: string;
  homeTeam: string;
  homeLogo: string;
  awayTeam: string;
  awayLogo: string;
  homeScore: number;
  awayScore: number;
  status: MatchStatus;
  league: string;
  minute?: number;
  date?: string;
  stadium: string;
  events: MatchEvent[];
}

export interface TransferRumor {
  id: string;
  player: string;
  position: string;
  fromTeam: string;
  fromLogo: string;
  toTeam: string;
  toLogo: string;
  fee: string;
  probability: number; // 0 to 100
  source: string;
  status: 'Rumor' | 'Advanced' | 'Confirmed';
}

export interface LeagueStanding {
  rank: number;
  team: string;
  logo: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  points: number;
  goalDiff: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  trivia: string;
}
