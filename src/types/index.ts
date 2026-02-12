export interface Contact {
  id: string;
  name: {
    chinese: string;
    english: string;
  };
  phone: string;
  avatar?: string;
  isVerified: boolean;
  verificationDetails?: VerificationDetails;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount?: number;
  isPinned?: boolean;
  isOnline?: boolean;
  isArchived?: boolean;
}

export interface VerificationDetails {
  organization: {
    chinese: string;
    english: string;
  };
  branch: {
    chinese: string;
    english: string;
  };
  employeeId: string;
  licenseNumber: string;
  role: {
    chinese: string;
    english: string;
  };
  verificationDate: string;
  licenseStatus: 'verified' | 'pending' | 'expired';
}

export interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: string;
  isRead: boolean;
  isPinned?: boolean;
  type: 'text' | 'image' | 'document' | 'voice' | 'location';
  mediaUrl?: string;
  duration?: number;
  replyTo?: {
    id: string;
    content: string;
    senderName: string;
  };
}

export interface Chat {
  id: string;
  contact: Contact;
  messages: Message[];
  pinnedMessages: Message[];
}

export interface CallRecord {
  id: string;
  contact: Contact;
  type: 'incoming' | 'outgoing' | 'missed' | 'video';
  timestamp: string;
  duration?: number;
}

export type TabType = 'chats' | 'calls' | 'settings';
export type ChatFilter = 'all' | 'unread' | 'pinned';
export type CallFilter = 'all' | 'missed';
export type ExportFormat = 'pdf' | 'txt' | 'json';

export interface ExportOptions {
  startDate: string;
  endDate: string;
  format: ExportFormat;
  forCompliance: boolean;
}
