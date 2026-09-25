// ============================================================
// VELINO SMART AI
// PRELOAD PROCESS
// V1.1 + LOCAL WHISPERKIT STT
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

        // ========================================================
        // ASK VELINO AI
        // ========================================================

        ask: async (
            message
        ) => {

            return await ipcRenderer.invoke(
                "velino-ask",
                message
            );
        },


        // ========================================================
        // CHAT MANAGEMENT
        // ========================================================

        newChat: async () => {

            return await ipcRenderer.invoke(
                "velino-new-chat"
            );
        },


        getChats: async () => {

            return await ipcRenderer.invoke(
                "velino-get-chats"
            );
        },


        loadChat: async (
            chatId
        ) => {

            return await ipcRenderer.invoke(
                "velino-load-chat",
                chatId
            );
        },


        deleteChat: async (
            chatId
        ) => {

            return await ipcRenderer.invoke(
                "velino-delete-chat",
                chatId
            );
        },


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


        togglePinChat: async (
            chatId
        ) => {

            return await ipcRenderer.invoke(
                "velino-toggle-pin-chat",
                chatId
            );
        },


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


        clearChat: async () => {

            return await ipcRenderer.invoke(
                "velino-clear-chat"
            );
        },


        getCurrentConversation: async () => {

            return await ipcRenderer.invoke(
                "velino-get-current-conversation"
            );
        },


        getCurrentChatId: async () => {

            return await ipcRenderer.invoke(
                "velino-get-current-chat-id"
            );
        },


        // ========================================================
        // 🎙️ VELINO SPEECH TO TEXT
        // ========================================================
        //
        // Renderer
        //    ↓
        // Browser microphone
        //    ↓
        // ArrayBuffer
        //    ↓
        // Electron IPC
        //    ↓
        // main-stt.js
        //    ↓
        // FFmpeg
        //    ↓
        // WhisperKit
        //
        // ========================================================

        transcribeAudio: async (
            audioData
        ) => {

            return await ipcRenderer.invoke(
                "velino-transcribe-audio",
                audioData
            );
        },


        // ========================================================
        // 🔊 VELINO VOICE OUTPUT
        // ========================================================

        speak: async (
            text
        ) => {

            return await ipcRenderer.invoke(
                "velino-speak",
                text
            );
        }

    }
);


// ============================================================
// PRELOAD READY
// ============================================================

console.log(
    "===================================="
);

console.log(
    "VELINO PRELOAD READY"
);

console.log(
    "LOCAL AI IPC READY"
);

console.log(
    "WHISPERKIT STT IPC READY"
);

console.log(
    "VOICE OUTPUT IPC READY"
);

console.log(
    "===================================="
);