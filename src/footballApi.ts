import { Match, MatchEvent } from './types';

// Let's support fetching fixtures from api-football.com
// Users can provide the API key through VITE_FOOTBALL_API_KEY or through the client-side setting stored in localStorage.
export const getStoredFootballApiKey = (): string => {
  return localStorage.getItem('creed_football_api_key') || ((import.meta as any).env?.VITE_FOOTBALL_API_KEY as string) || '';
};

export const setStoredFootballApiKey = (key: string): void => {
  localStorage.setItem('creed_football_api_key', key);
};

// Map API-Football's fixture object to our Match object
export function mapApiFixtureToMatch(item: any): Match {
  const statusShort = item.fixture.status.short;
  
  let mappedStatus: 'LIVE' | 'FT' | 'UPCOMING' = 'UPCOMING';
  if (statusShort === 'FT') {
    mappedStatus = 'FT';
  } else if (['1H', '2H', 'HT', 'LIVE', 'BT'].includes(statusShort)) {
    mappedStatus = 'LIVE';
  }

  // Get events (if any)
  const mappedEvents: MatchEvent[] = [];
  if (Array.isArray(item.events)) {
    item.events.forEach((ev: any) => {
      let eventType: 'goal' | 'card_yellow' | 'card_red' | 'substitution' = 'goal';
      if (ev.type === 'Goal') {
        eventType = 'goal';
      } else if (ev.type === 'Card') {
        eventType = ev.detail?.toLowerCase().includes('red') ? 'card_red' : 'card_yellow';
      } else if (ev.type === 'subst') {
        eventType = 'substitution';
      }

      mappedEvents.push({
        type: eventType,
        player: ev.player?.name || 'Unknown Player',
        minute: ev.time?.elapsed || 0,
        team: ev.team?.name === item.teams.home.name ? 'home' : 'away',
        detail: ev.detail || ''
      });
    });
  }

  return {
    id: item.fixture.id.toString(),
    homeTeam: item.teams.home.name,
    homeLogo: item.teams.home.logo || '⚽',
    awayTeam: item.teams.away.name,
    awayLogo: item.teams.away.logo || '⚽',
    homeScore: item.goals.home ?? 0,
    awayScore: item.goals.away ?? 0,
    status: mappedStatus,
    league: item.league.name || 'International',
    minute: item.fixture.status.elapsed ?? undefined,
    stadium: item.fixture.venue?.name || 'Grand Arena',
    events: mappedEvents
  };
}

// Global fetch for live, past, and upcoming matches
export async function fetchFootballFixtures(apiKey: string): Promise<Match[]> {
  if (!apiKey) return [];

  try {
    // We will attempt headers for direct API-Sports first, with a fallback check
    // Direct host: https://v3.football.api-sports.io
    const headers: Record<string, string> = {
      'x-apisports-key': apiKey
    };

    // Make an API request for today's fixtures
    // Let's get today's date formatted as YYYY-MM-DD in UTC
    const dateStr = new Date().toISOString().split('T')[0];
    
    const response = await fetch(`https://v3.football.api-sports.io/fixtures?date=${dateStr}`, {
      method: 'GET',
      headers: headers
    });

    if (!response.ok) {
      throw new Error(`API response status error: ${response.status}`);
    }

    const data = await response.json();
    
    // Check if the API key was valid and returned fixtures
    if (data.errors && Object.keys(data.errors).length > 0) {
      const errorMsg = JSON.stringify(data.errors);
      // Try RapidAPI endpoint as a fallback if the direct key failed or if user uses RapidAPI
      const rapidHeaders: Record<string, string> = {
        'x-rapidapi-key': apiKey,
        'x-rapidapi-host': 'api-football-v1.p.rapidapi.com'
      };
      const fallbackResponse = await fetch(`https://api-football-v1.p.rapidapi.com/v3/fixtures?date=${dateStr}`, {
        method: 'GET',
        headers: rapidHeaders
      });

      if (fallbackResponse.ok) {
        const fallbackData = await fallbackResponse.json();
        if (Array.isArray(fallbackData.response) && fallbackData.response.length > 0) {
          return fallbackData.response.map(mapApiFixtureToMatch);
        }
      }
      throw new Error(`API Football returned errors: ${errorMsg}`);
    }

    if (Array.isArray(data.response)) {
      return data.response.map(mapApiFixtureToMatch);
    }

    return [];
  } catch (error) {
    console.warn('Failed to fetch from API-Football, falling back to mock fixtures.', error);
    throw error;
  }
}
