
export interface Recording {
  id: string;
  title: string;
  date: string;
  duration: string;
  caller: string;
  recipient: string;
  source: string;
  transcript?: {
    text: string;
    highlights?: { time: string; text: string }[];
  };
}
