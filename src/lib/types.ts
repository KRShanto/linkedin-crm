export enum ContactStatus {
  NOT_STARTED = "Not Started (1/12)",
  SENT_CONNECTION = "Sent Connection (2/12)",
  ACCEPTED_CONNECTION = "Accepted Connection (3/12)",
  SENT_INITIAL_MESSAGE = "Sent Initial Message (4/12)",
  CONVERSATION_STARTED = "Conversation Started (5/12)",
  ASKED_REPORT = "Asked Report (6/12)",
  SENT_REPORT = "Sent Report (7/12)",
  ASKED_MOCKUP = "Asked Mockup (8/12)",
  SENT_MOCKUP = "Sent Mockup (9/12)",
  SENT_QUOTATION = "Sent Quotation (10/12)",
  PAYMENT_DONE = "Payment Done (11/12)",
  DELIVERY_DONE = "Delivery Done (12/12)",
  CANCELLED = "Cancelled"
} 


export type Person = {
  id: string;
  name?: string | null;
  url?: string | null;
  profileImage?: string | null;
  location?: string | null;
  headline?: string | null;
  about?: string | null;
  currentPosition?: string | null;
  currentCompany?: string | null;
  connectionDegree: number;
  websites: string[];
  email?: string | null;
  phone?: string | null;
  connected: boolean;
  status: ContactStatus;
  createdAt: Date;
  updatedAt: Date;
};