
import { useState, useEffect, useCallback } from 'react';
import { ChatMessage, Game } from '../types';

const CHAT_USERNAME_KEY = 'chat_username';
const CHAT_MESSAGES_KEY = 'chat_messages_v1';

export const useChat = () => {
    const [username, setUsername] = useState<string | null>(null);
    const [isUsernameModalOpen, setIsUsernameModalOpen] = useState(false);
    
    const [isGlobalChatOpen, setIsGlobalChatOpen] = useState(false);
    const [isGameChatOpen, setIsGameChatOpen] = useState(false);
    const [gameChatGame, setGameChatGame] = useState<Game | null>(null);
    
    const [allChatMessages, setAllChatMessages] = useState<Record<string, ChatMessage[]>>({ global: [] });
    
    useEffect(() => {
        const storedUsername = localStorage.getItem(CHAT_USERNAME_KEY);
        if (storedUsername) setUsername(storedUsername);

        try {
            const storedMessages = localStorage.getItem(CHAT_MESSAGES_KEY);
            if (storedMessages) setAllChatMessages(JSON.parse(storedMessages));
        } catch (e) {
            console.error("Failed to load chat messages from localStorage", e);
        }
    }, []);

    useEffect(() => {
        try {
            localStorage.setItem(CHAT_MESSAGES_KEY, JSON.stringify(allChatMessages));
        } catch (e) {
            console.error("Failed to save chat messages to localStorage", e);
        }
    }, [allChatMessages]);

    const handleSetUsername = useCallback((name: string) => {
        localStorage.setItem(CHAT_USERNAME_KEY, name);
        setUsername(name);
        setIsUsernameModalOpen(false);
    }, []);
    
    const ensureUsername = useCallback(() => {
        if (!username) {
            setIsUsernameModalOpen(true);
            return false;
        }
        return true;
    }, [username]);

    const handleToggleGlobalChat = useCallback(() => {
        if (ensureUsername()) setIsGlobalChatOpen(prev => !prev);
    }, [ensureUsername]);
    
    const handleOpenGameChat = useCallback((game: Game) => {
        if (ensureUsername()) {
            setGameChatGame(game);
            setIsGameChatOpen(true);
            setIsGlobalChatOpen(false);
        }
    }, [ensureUsername]);

    const handleSwitchToGlobalChat = useCallback(() => {
        setIsGameChatOpen(false);
        setGameChatGame(null);
        setIsGlobalChatOpen(true);
    }, []);

    const handleSwitchToGameChat = useCallback((game: Game) => {
        setIsGlobalChatOpen(false);
        setGameChatGame(game);
        setIsGameChatOpen(true);
    }, []);
    
    const handleSendMessage = useCallback((text: string, chatId: string) => {
        if (!username) return;
        
        const newMessage: ChatMessage = {
            id: `msg-${chatId}-${Date.now()}`,
            username,
            text,
            timestamp: Date.now(),
        };

        setAllChatMessages(prev => ({
            ...prev,
            [chatId]: [...(prev[chatId] || []), newMessage],
        }));
    }, [username]);

    const handleCloseGameChat = useCallback(() => {
        setIsGameChatOpen(false);
        setGameChatGame(null);
    }, []);
    
    const handleCloseUsernameModal = useCallback(() => {
        setIsUsernameModalOpen(false);
    }, []);

    return {
        username,
        isUsernameModalOpen,
        isGlobalChatOpen,
        isGameChatOpen,
        gameChatGame,
        allChatMessages,
        handleSetUsername,
        handleToggleGlobalChat,
        handleOpenGameChat,
        handleSwitchToGlobalChat,
        handleSwitchToGameChat,
        handleSendMessage,
        handleCloseGameChat,
        handleCloseUsernameModal,
    };
};
