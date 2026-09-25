// ============================================================
// VELINO SMART AI
// ELECTRON MAIN PROCESS
// ============================================================

const {
    app,
    BrowserWindow,
    ipcMain
} = require("electron");

const path = require("path");
const { exec } = require("child_process");

// ============================================================
// VELINO AGENT
// ============================================================

const {
    initializeMemory,
    askVelino,
    createNewChat,
    getChats,
    loadChat,
    deleteChat,
    renameChat,
    togglePinChat,
    addChatTag,
    removeChatTag,
    clearCurrentChat,
    getCurrentConversation,
    getCurrentChatId
} = require("./agent");

// ============================================================
// GLOBAL MEMORY
// ============================================================

const {
    initializeMemory: initializeGlobalMemory
} = require("./memory");

// ============================================================
// WINDOW
// ============================================================

let mainWindow = null;

// ============================================================
// CREATE WINDOW
// ============================================================

function createWindow() {

    mainWindow = new BrowserWindow({
        width: 1400,
        height: 900,

        minWidth: 1000,
        minHeight: 700,

        backgroundColor: "#02050b",

        webPreferences: {
            preload: path.join(
                __dirname,
                "preload.js"
            ),

            contextIsolation: true,

            nodeIntegration: false,

            sandbox: false
        },

        title: "VELINO Smart AI",

        show: false
    });

    // --------------------------------------------------------
    // LOAD UI
    // --------------------------------------------------------

    mainWindow.loadFile(
        path.join(
            __dirname,
            "../renderer/index.html"
        )
    );

    // --------------------------------------------------------
    // SHOW WINDOW
    // --------------------------------------------------------

    mainWindow.once(
        "ready-to-show",
        () => {

            mainWindow.show();

        }
    );

    // --------------------------------------------------------
    // DEVELOPMENT
    // --------------------------------------------------------

    // Uncomment when debugging:
    //
    // mainWindow.webContents.openDevTools();

    // --------------------------------------------------------
    // CLOSED
    // --------------------------------------------------------

    mainWindow.on(
        "closed",
        () => {

            mainWindow = null;

        }
    );
}

// ============================================================
// ASK VELINO
// ============================================================

ipcMain.handle(
    "velino-ask",
    async (event, message) => {

        try {

            if (
                typeof message !== "string" ||
                !message.trim()
            ) {

                throw new Error(
                    "Message cannot be empty."
                );

            }

            console.log(
                "VELINO USER:",
                message.trim()
            );

            const response =
                await askVelino(
                    message.trim()
                );

            console.log(
                "VELINO RESPONSE:",
                response
            );

            return response;

        } catch (error) {

            console.error(
                "VELINO AI ERROR:",
                error
            );

            throw new Error(
                error.message ||
                "VELINO AI failed."
            );

        }

    }
);

// ============================================================
// NEW CHAT
// ============================================================

ipcMain.handle(
    "velino-new-chat",
    async () => {

        try {

            const chat =
                createNewChat();

            return chat;

        } catch (error) {

            console.error(
                "NEW CHAT ERROR:",
                error
            );

            throw error;

        }

    }
);

// ============================================================
// GET CHATS
// ============================================================

ipcMain.handle(
    "velino-get-chats",
    async () => {

        try {

            return getChats();

        } catch (error) {

            console.error(
                "GET CHATS ERROR:",
                error
            );

            return [];

        }

    }
);

// ============================================================
// LOAD CHAT
// ============================================================

ipcMain.handle(
    "velino-load-chat",
    async (event, chatId) => {

        try {

            return loadChat(
                chatId
            );

        } catch (error) {

            console.error(
                "LOAD CHAT ERROR:",
                error
            );

            throw error;

        }

    }
);

// ============================================================
// DELETE CHAT
// ============================================================

ipcMain.handle(
    "velino-delete-chat",
    async (event, chatId) => {

        try {

            return deleteChat(
                chatId
            );

        } catch (error) {

            console.error(
                "DELETE CHAT ERROR:",
                error
            );

            throw error;

        }

    }
);

// ============================================================
// RENAME CHAT
// ============================================================

ipcMain.handle(
    "velino-rename-chat",
    async (
        event,
        chatId,
        title
    ) => {

        try {

            return renameChat(
                chatId,
                title
            );

        } catch (error) {

            console.error(
                "RENAME CHAT ERROR:",
                error
            );

            throw error;

        }

    }
);

// ============================================================
// PIN / UNPIN
// ============================================================

ipcMain.handle(
    "velino-toggle-pin-chat",
    async (
        event,
        chatId
    ) => {

        try {

            return togglePinChat(
                chatId
            );

        } catch (error) {

            console.error(
                "PIN CHAT ERROR:",
                error
            );

            throw error;

        }

    }
);

// ============================================================
// ADD TAG
// ============================================================

ipcMain.handle(
    "velino-add-chat-tag",
    async (
        event,
        chatId,
        tag
    ) => {

        try {

            return addChatTag(
                chatId,
                tag
            );

        } catch (error) {

            console.error(
                "ADD TAG ERROR:",
                error
            );

            throw error;

        }

    }
);

// ============================================================
// REMOVE TAG
// ============================================================

ipcMain.handle(
    "velino-remove-chat-tag",
    async (
        event,
        chatId,
        tag
    ) => {

        try {

            return removeChatTag(
                chatId,
                tag
            );

        } catch (error) {

            console.error(
                "REMOVE TAG ERROR:",
                error
            );

            throw error;

        }

    }
);

// ============================================================
// CLEAR CURRENT CHAT
// ============================================================

ipcMain.handle(
    "velino-clear-chat",
    async () => {

        try {

            return clearCurrentChat();

        } catch (error) {

            console.error(
                "CLEAR CHAT ERROR:",
                error
            );

            throw error;

        }

    }
);

// ============================================================
// CURRENT CONVERSATION
// ============================================================

ipcMain.handle(
    "velino-get-current-conversation",
    async () => {

        try {

            return getCurrentConversation();

        } catch (error) {

            console.error(
                "CURRENT CONVERSATION ERROR:",
                error
            );

            return [];

        }

    }
);

// ============================================================
// CURRENT CHAT ID
// ============================================================

ipcMain.handle(
    "velino-get-current-chat-id",
    async () => {

        try {

            return getCurrentChatId();

        } catch (error) {

            console.error(
                "CURRENT CHAT ID ERROR:",
                error
            );

            return null;

        }

    }
);

// ============================================================
// MAC VOICE OUTPUT
// ============================================================

ipcMain.handle(
    "velino-speak",
    async (
        event,
        text
    ) => {

        return new Promise(
            (
                resolve,
                reject
            ) => {

                try {

                    if (
                        typeof text !== "string" ||
                        !text.trim()
                    ) {

                        resolve(false);

                        return;

                    }

                    const safeText =
                        text
                            .replace(
                                /\\/g,
                                "\\\\"
                            )
                            .replace(
                                /"/g,
                                '\\"'
                            )
                            .replace(
                                /\$/g,
                                "\\$"
                            )
                            .replace(
                                /`/g,
                                "\\`"
                            );

                    const command =
                        `say "${safeText}"`;

                    exec(
                        command,
                        error => {

                            if (error) {

                                console.error(
                                    "VOICE ERROR:",
                                    error
                                );

                                reject(error);

                                return;

                            }

                            resolve(true);

                        }
                    );

                } catch (error) {

                    reject(error);

                }

            }
        );

    }
);

// ============================================================
// APP READY
// ============================================================

app.whenReady()
    .then(() => {

        try {

            // --------------------------------------------------
            // CHAT MEMORY FILE
            // --------------------------------------------------

            const chatMemoryPath =
                path.join(
                    app.getPath("userData"),
                    "velino-memory.json"
                );

            initializeMemory(
                chatMemoryPath
            );

            // --------------------------------------------------
            // GLOBAL MEMORY FILE
            // --------------------------------------------------

            const globalMemoryPath =
                path.join(
                    app.getPath("userData"),
                    "velino-global-memory.json"
                );

            initializeGlobalMemory(
                globalMemoryPath
            );

            console.log(
                "===================================="
            );

            console.log(
                "VELINO SMART AI"
            );

            console.log(
                "CHAT MEMORY READY"
            );

            console.log(
                "GLOBAL MEMORY READY"
            );

            console.log(
                "===================================="
            );

            // --------------------------------------------------
            // ALWAYS START WITH A FRESH CHAT
            // --------------------------------------------------
            // Previous chats remain saved in memory.
            // Only the active chat is replaced with a new one.
            // --------------------------------------------------

            const freshChat =
                createNewChat();

            console.log(
                "FRESH CHAT CREATED:",
                freshChat?.id
            );

            // --------------------------------------------------
            // CREATE WINDOW
            // --------------------------------------------------

            createWindow();

        } catch (error) {

            console.error(
                "MEMORY INITIALIZATION ERROR:",
                error
            );

            // Still create the window even if memory
            // initialization encounters an error.

            createWindow();

        }

    })
    .catch(error => {

        console.error(
            "ELECTRON START ERROR:",
            error
        );

    });

// ============================================================
// MACOS
// ============================================================

app.on(
    "window-all-closed",
    () => {

        if (
            process.platform !== "darwin"
        ) {

            app.quit();

        }

    }
);

// ============================================================
// MACOS ACTIVATE
// ============================================================

app.on(
    "activate",
    () => {

        if (
            BrowserWindow.getAllWindows()
                .length === 0
        ) {

            // Do not create another chat here.
            // A fresh chat is created during app startup.
            createWindow();

        }

    }
);

// ============================================================
// ERROR HANDLING
// ============================================================

process.on(
    "uncaughtException",
    error => {

        console.error(
            "VELINO UNCAUGHT EXCEPTION:",
            error
        );

    }
);

process.on(
    "unhandledRejection",
    error => {

        console.error(
            "VELINO UNHANDLED REJECTION:",
            error
        );

    }
);