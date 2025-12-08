export type TUser = {
  id: string;
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
  displayName?: string;
  isOnline: boolean;
  lastSeen?: Date;
};