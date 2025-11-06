export type User = {
  id: string;
  name: string;
  icon?: string;
  isHost: boolean;
  cardValue?: string;
};

export type Room = {
  id: string;
  hostId: string;
  users: User[];
  revealed: boolean;
};
