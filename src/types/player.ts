export interface PlayerStats {
  points: number;
  rebounds: number;
  assists: number;
  field_goal_percentage: number;
  usage_rate: number;
  true_shooting_percentage: number;
  player_efficiency: number;
  points_per_36: number;
  steals: number;
  blocks: number;
  minutes: number;
  games_played: number;
  three_point_percentage: number;
}

export interface Player {
  player_id: string;
  name: string;
  team: string;
  position: string;
  number: string;
  height: string;
  weight: string;
  college: string;
  avatar: string;
  stats: PlayerStats;
}