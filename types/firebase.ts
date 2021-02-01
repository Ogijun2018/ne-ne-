export type RoomID = {
  (): string;
};

export type PositionRef = {
  (roomId: string): string;
  (userId: string | undefined): string;
};
