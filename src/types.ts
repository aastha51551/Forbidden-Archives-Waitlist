export interface WaitlistUser {
  id: string; // Forbidden Archives token ID like FA-XXXXXX
  name: string;
  email: string;
  waitlistNumber: number;
  displayNumber: number;
  createdAt: string;
  prophecy: string;
  verified: boolean;
  shares: {
    instagram: boolean;
    whatsapp: boolean;
    sms: boolean;
  };
  verificationToken?: string;
  simulatedEmail?: string;
}

export type ShareChannel = "instagram" | "whatsapp" | "sms";
