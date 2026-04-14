export interface QuestBookEntry {
  id: string;
  number: number;
  title: string;
  goldRewardPerHero: number;
  rewardNotes: string | null;
}