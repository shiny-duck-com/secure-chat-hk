import { useState, useCallback } from 'react';
import { TabType, Contact, Message } from '@/types';
import { contacts as initialContacts, getMessagesForContact, callRecords } from '@/data/mockData';
import { BottomNav } from '@/components/BottomNav';
import { ChatList } from '@/components/ChatList';
import { ChatScreen } from '@/components/ChatScreen';
import { ContactProfile } from '@/components/ContactProfile';
import { ExportModal } from '@/components/ExportModal';
import { QRScannerModal } from '@/components/QRScannerModal';
import { CallsTab } from '@/components/CallsTab';
import { SettingsTab } from '@/components/SettingsTab';
import { DesktopNotice } from '@/components/DesktopNotice';
import { NewChatScreen } from '@/components/NewChatScreen';
import { MyQRCodeScreen } from '@/components/MyQRCodeScreen';
import { toast } from 'sonner';

type Screen = 'list' | 'chat' | 'profile' | 'newchat' | 'myqrcode';

const Index = () => {
  const [activeTab, setActiveTab] = useState<TabType>('chats');
  const [currentScreen, setCurrentScreen] = useState<Screen>('list');
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [contacts, setContacts] = useState<Contact[]>(initialContacts);
  const [messages, setMessages] = useState<Message[]>([]);
  
  // Modal states
  const [showExportModal, setShowExportModal] = useState(false);
  const [showQRScanner, setShowQRScanner] = useState(false);

  // Calculate total unread count
  const totalUnread = contacts.reduce((sum, c) => sum + (c.unreadCount ?? 0), 0);

  const handleSelectContact = useCallback((contact: Contact) => {
    setSelectedContact(contact);
    setMessages(getMessagesForContact(contact.id));
    setCurrentScreen('chat');
    
    // Clear unread count
    setContacts((prev) =>
      prev.map((c) =>
        c.id === contact.id ? { ...c, unreadCount: 0 } : c
      )
    );
  }, []);

  const handleBack = useCallback(() => {
    if (currentScreen === 'profile') {
      setCurrentScreen('chat');
    } else if (currentScreen === 'newchat' || currentScreen === 'myqrcode') {
      setCurrentScreen('list');
    } else {
      setCurrentScreen('list');
      setSelectedContact(null);
    }
  }, [currentScreen]);

  const handleSendMessage = useCallback((content: string, replyTo?: { id: string; content: string; senderName: string }) => {
    const newMessage: Message = {
      id: `m${Date.now()}`,
      senderId: 'me',
      content,
      timestamp: new Date().toLocaleTimeString('zh-HK', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      isRead: false,
      type: 'text',
      replyTo,
    };

    setMessages((prev) => [...prev, newMessage]);

    // Simulate read receipt after 500ms
    setTimeout(() => {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === newMessage.id ? { ...m, isRead: true } : m
        )
      );
    }, 500);

    // Simulate reply for demo
    if (selectedContact?.isVerified) {
      setTimeout(() => {
        const reply: Message = {
          id: `m${Date.now() + 1}`,
          senderId: selectedContact.id,
          content: '收到，謝謝您的訊息。',
          timestamp: new Date().toLocaleTimeString('zh-HK', { 
            hour: '2-digit', 
            minute: '2-digit' 
          }),
          isRead: true,
          type: 'text',
        };
        setMessages((prev) => [...prev, reply]);
      }, 1500);
    }
  }, [selectedContact]);

  const handleContactFound = useCallback((contact: Contact) => {
    const newContact: Contact = {
      ...contact,
      lastMessage: '新聯絡人',
      lastMessageTime: '剛剛',
      unreadCount: 0,
      isPinned: false,
    };
    
    setContacts((prev) => [newContact, ...prev]);
    toast.success('已新增聯絡人', {
      description: `${contact.name.chinese} 已成功添加到您的聯絡人列表`,
    });
  }, []);

  const handleCall = useCallback(() => {
    toast.info('正在撥打...', {
      description: `正在連接 ${selectedContact?.name.chinese}`,
    });
  }, [selectedContact]);

  const handleShare = useCallback(() => {
    toast.success('聯絡人卡片已複製', {
      description: '可以分享給其他人',
    });
  }, []);

  const handleClearChat = useCallback(() => {
    setMessages([]);
  }, []);

  const handleBlockContact = useCallback(() => {
    if (selectedContact) {
      setContacts((prev) => prev.filter((c) => c.id !== selectedContact.id));
      setCurrentScreen('list');
      setSelectedContact(null);
    }
  }, [selectedContact]);

  const handleReportContact = useCallback((_reason: string) => {
    // Report is handled via toast in ContactProfile
  }, []);

  const handleDeleteContact = useCallback(() => {
    if (selectedContact) {
      setContacts((prev) => prev.filter((c) => c.id !== selectedContact.id));
      setCurrentScreen('list');
      setSelectedContact(null);
    }
  }, [selectedContact]);

  const handleArchiveChat = useCallback(() => {
    if (selectedContact) {
      setContacts((prev) =>
        prev.map((c) =>
          c.id === selectedContact.id ? { ...c, isArchived: true } : c
        )
      );
      toast.success('聊天已封存');
      setCurrentScreen('list');
      setSelectedContact(null);
    }
  }, [selectedContact]);

  const handleNewChatSelect = useCallback((contact: Contact) => {
    handleSelectContact(contact);
  }, [handleSelectContact]);

  const renderContent = () => {
    // Chat tab screens
    if (activeTab === 'chats') {
      if (currentScreen === 'newchat') {
        return (
          <NewChatScreen
            contacts={contacts.filter((c) => !c.isArchived)}
            onSelectContact={handleNewChatSelect}
            onCancel={handleBack}
          />
        );
      }

      if (currentScreen === 'chat' && selectedContact) {
        return (
          <ChatScreen
            contact={selectedContact}
            messages={messages}
            onBack={handleBack}
            onOpenProfile={() => setCurrentScreen('profile')}
            onCall={handleCall}
            onSendMessage={handleSendMessage}
          />
        );
      }

      if (currentScreen === 'profile' && selectedContact) {
        return (
          <ContactProfile
            contact={selectedContact}
            onBack={handleBack}
            onCall={handleCall}
            onShare={handleShare}
            onClearChat={handleClearChat}
            onBlockContact={handleBlockContact}
            onReportContact={handleReportContact}
            onDeleteContact={handleDeleteContact}
            onArchiveChat={handleArchiveChat}
          />
        );
      }

      return (
        <ChatList
          contacts={contacts}
          onSelectContact={handleSelectContact}
          onOpenQRScanner={() => setShowQRScanner(true)}
          onNewChat={() => setCurrentScreen('newchat')}
        />
      );
    }

    if (activeTab === 'calls') {
      return <CallsTab calls={callRecords} />;
    }

    if (activeTab === 'settings') {
      if (currentScreen === 'myqrcode') {
        return <MyQRCodeScreen onBack={handleBack} />;
      }
      return (
        <SettingsTab
          onOpenMyQR={() => setCurrentScreen('myqrcode')}
        />
      );
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop notice */}
      <DesktopNotice />

      {/* Mobile app container */}
      <div className="md:hidden h-screen flex flex-col overflow-hidden">
        <main className="flex-1 overflow-hidden">
          {renderContent()}
        </main>

        {/* Bottom nav - hide when in chat, profile, newchat, or myqrcode */}
        {currentScreen === 'list' && (
          <BottomNav
            activeTab={activeTab}
            onTabChange={setActiveTab}
            unreadCount={totalUnread}
          />
        )}

        {/* Modals */}
        <ExportModal
          isOpen={showExportModal}
          onClose={() => setShowExportModal(false)}
          contactName={selectedContact?.name.chinese ?? ''}
        />

        <QRScannerModal
          isOpen={showQRScanner}
          onClose={() => setShowQRScanner(false)}
          onContactFound={handleContactFound}
        />
      </div>
    </div>
  );
};

export default Index;
