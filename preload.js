// ============================================================
// VELINO SMART AI
// ELECTRON PRELOAD
// ============================================================

const {
    contextBridge,
    ipcRenderer
} = require("electron");

// ============================================================
// VELINO API
// ============================================================

contextBridge.exposeInMainWorld(
    "velino",
    {

        // ====================================================
        // AI
        // ====================================================

        ask: async (message) => {

            return await ipcRenderer.invoke(
                "velino-ask",
                message
            );

        },

        // ====================================================
        // NEW CHAT
        // ====================================================

        newChat: async () => {

            return await ipcRenderer.invoke(
                "velino-new-chat"
            );

        },

        // ====================================================
        // GET CHATS
        // ====================================================

        getChats: async () => {

            return await ipcRenderer.invoke(
                "velino-get-chats"
            );

        },

        // ====================================================
        // LOAD CHAT
        // ====================================================

        loadChat: async (chatId) => {

            return await ipcRenderer.invoke(
                "velino-load-chat",
                chatId
            );

        },

        // ====================================================
        // DELETE CHAT
        // ====================================================

        deleteChat: async (chatId) => {

            return await ipcRenderer.invoke(
                "velino-delete-chat",
                chatId
            );

        },

        // ====================================================
        // RENAME CHAT
        // ====================================================

        renameChat: async (
            chatId,
            title
        ) => {

            return await ipcRenderer.invoke(
                "velino-rename-chat",
                chatId,
                title
            );

        },

        // ====================================================
        // PIN / UNPIN
        // ====================================================

        togglePinChat: async (
            chatId
        ) => {

            return await ipcRenderer.invoke(
                "velino-toggle-pin-chat",
                chatId
            );

        },

        // ====================================================
        // ADD TAG
        // ====================================================

        addChatTag: async (
            chatId,
            tag
        ) => {

            return await ipcRenderer.invoke(
                "velino-add-chat-tag",
                chatId,
                tag
            );

        },

        // ====================================================
        // REMOVE TAG
        // ====================================================

        removeChatTag: async (
            chatId,
            tag
        ) => {

            return await ipcRenderer.invoke(
                "velino-remove-chat-tag",
                chatId,
                tag
            );

        },

        // ====================================================
        // CLEAR CURRENT CHAT
        // ====================================================

        clearChat: async () => {

            return await ipcRenderer.invoke(
                "velino-clear-chat"
            );

        },

        // ====================================================
        // CURRENT CONVERSATION
        // ====================================================

        getCurrentConversation: async () => {

            return await ipcRenderer.invoke(
                "velino-get-current-conversation"
            );

        },

        // ====================================================
        // CURRENT CHAT ID
        // ====================================================

        getCurrentChatId: async () => {

            return await ipcRenderer.invoke(
                "velino-get-current-chat-id"
            );

        },

        // ====================================================
        // VOICE OUTPUT
        // ====================================================

        speak: async (text) => {

            return await ipcRenderer.invoke(
                "velino-speak",
                text
            );

        }

    }
);

console.log(
    "VELINO PRELOAD API READY"
);