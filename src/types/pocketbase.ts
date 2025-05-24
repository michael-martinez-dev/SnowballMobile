export type UserInfo = {
  email: string;
  pass: string;
};

export type PocketbaseSession = {
  pb: any;
};

export type PocketbaseContextType = {
  signedIn: boolean | null;
  setSignedIn: (signedInValue: boolean) => void;
  pbSession: PocketbaseSession | null;
  setPbSession: (pbSession: PocketbaseSession | null) => void;
};
