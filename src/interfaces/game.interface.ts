import { Team } from './team.interface'

interface Game {
  location: string;
  time: string;
  home: Team;
  away: Team;
  stats: Stats;
  innings: LineScore[];
  alerts: Alerts;

}

interface Stats {
  hr: LineScore;
  e: LineScore;
  so: LineScore;
  r: LineScore;
}

interface LineScore {
  home: string;
  away: string;
}

interface Alerts {
  text: string;
  briefText: string;
}

export { Game, Stats, LineScore, Alerts };