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
const fs = require("fs");

const {
    exec,
    execFile
} = require("child_process");

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
// WHISPERKIT CONFIGURATION
// ============================================================

// Local WhisperKit server
//
// Default:
// http://127.0.0.1:50060
//
// You can override this with:
//
// VELINO_WHISPERKIT_URL=http://127.0.0.1:50060
//
// ============================================================

const WHISPERKIT_URL =
    process.env.VELINO_WHISPERKIT_URL ||
    "http://127.0.0.1:50060";

// ============================================================
// FFMPEG PATH
// ============================================================
//
// Apple Silicon Homebrew normally installs FFmpeg here:
//
// /opt/homebrew/bin/ffmpeg
//
// Intel Mac Homebrew:
//
// /usr/local/bin/ffmpeg
//
// We check both before falling back to "ffmpeg".
// ============================================================

function getFFmpegPath() {

    const possiblePaths = [

        "/opt/homebrew/bin/ffmpeg",

        "/usr/local/bin/ffmpeg",

        "/usr/bin/ffmpeg",

        "ffmpeg"
    ];

    for (
        const ffmpegPath
        of possiblePaths
    ) {

        if (
            ffmpegPath !== "ffmpeg" &&
            fs.existsSync(ffmpegPath)
        ) {

            return ffmpegPath;
        }
    }

    return "ffmpeg";
}

// ============================================================
// RUN FFMPEG
// ============================================================

function runFFmpeg(args) {

    return new Promise(
        (
            resolve,
            reject
        ) => {

            const ffmpegPath =
                getFFmpegPath();

            execFile(
                ffmpegPath,
                args,
                (
                    error,
                    stdout,
                    stderr
                ) => {

                    if (error) {

                        const ffmpegError =
                            stderr?.trim() ||
                            error.message ||
                            "FFmpeg failed.";

                        reject(
                            new Error(
                                ffmpegError
                            )
                        );

                        return;
                    }

                    resolve({
                        stdout,
                        stderr
                    });
                }
            );
        }
    );
}

// ============================================================
// WINDOW
// ============================================================

let mainWindow = null;

// ============================================================
// CREATE WINDOW
// ============================================================

function createWindow() {

    mainWindow =
        new BrowserWindow({

            width: 1400,

            height: 900,

            minWidth: 1000,

            minHeight: 700,

            backgroundColor:
                "#02050b",

            webPreferences: {

                preload:
                    path.join(
                        __dirname,
                        "preload.js"
                    ),

                contextIsolation:
                    true,

                nodeIntegration:
                    false,

                sandbox:
                    false
            },

            title:
                "VELINO Smart AI",

            show:
                false
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

            mainWindow =
                null;

        }
    );
}

// ============================================================
// ASK VELINO
// ============================================================

ipcMain.handle(
    "velino-ask",
    async (
        event,
        message
    ) => {

        try {

            if (
                typeof message !==
                    "string" ||
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
    async (
        event,
        chatId
    ) => {

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
    async (
        event,
        chatId
    ) => {

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
// PIN / UNPIN CHAT
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
// ADD CHAT TAG
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
// REMOVE CHAT TAG
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
// VELINO SMART AI
// SPEECH TO TEXT
// ============================================================
//
// FLOW:
//
// Browser microphone
//       ↓
// MediaRecorder
//       ↓
// Electron IPC
//       ↓
// Temporary WebM file
//       ↓
// FFmpeg
//       ↓
// 16 kHz Mono WAV
//       ↓
// WhisperKit
//       ↓
// Transcribed text
//       ↓
// Renderer message box
//
// ============================================================

ipcMain.handle(
    "velino-transcribe-audio",
    async (
        event,
        audioData
    ) => {

        let inputPath =
            null;

        let outputPath =
            null;

        try {

            // ----------------------------------------------------
            // VALIDATE AUDIO
            // ----------------------------------------------------

            if (!audioData) {

                return {

                    success:
                        false,

                    text:
                        "",

                    error:
                        "No audio data received."
                };
            }

            // ----------------------------------------------------
            // CONVERT ARRAYBUFFER / TYPED ARRAY
            // ----------------------------------------------------

            let audioBuffer;

            if (
                Buffer.isBuffer(
                    audioData
                )
            ) {

                audioBuffer =
                    audioData;

            } else if (
                audioData instanceof
                    ArrayBuffer
            ) {

                audioBuffer =
                    Buffer.from(
                        audioData
                    );

            } else if (
                ArrayBuffer.isView(
                    audioData
                )
            ) {

                audioBuffer =
                    Buffer.from(
                        audioData.buffer,
                        audioData.byteOffset,
                        audioData.byteLength
                    );

            } else {

                audioBuffer =
                    Buffer.from(
                        audioData
                    );
            }

            // ----------------------------------------------------
            // CHECK SIZE
            // ----------------------------------------------------

            if (
                !audioBuffer ||
                !audioBuffer.length
            ) {

                return {

                    success:
                        false,

                    text:
                        "",

                    error:
                        "Recorded audio is empty."
                };
            }

            console.log(
                "===================================="
            );

            console.log(
                "🎙️ VELINO SPEECH TO TEXT"
            );

            console.log(
                "===================================="
            );

            console.log(
                "Audio size:",
                audioBuffer.length,
                "bytes"
            );

            console.log(
                "WhisperKit:",
                WHISPERKIT_URL
            );

            // ----------------------------------------------------
            // TEMP FILES
            // ----------------------------------------------------

            const tempDirectory =
                app.getPath(
                    "temp"
                );

            const timestamp =
                Date.now();

            inputPath =
                path.join(
                    tempDirectory,
                    `velino-stt-${timestamp}.webm`
                );

            outputPath =
                path.join(
                    tempDirectory,
                    `velino-stt-${timestamp}.wav`
                );

            // ----------------------------------------------------
            // SAVE RAW RECORDING
            // ----------------------------------------------------

            fs.writeFileSync(
                inputPath,
                audioBuffer
            );

            console.log(
                "🎙️ Recording saved:"
            );

            console.log(
                inputPath
            );

            // ----------------------------------------------------
            // FFMPEG CONVERSION
            // ----------------------------------------------------
            //
            // Convert browser audio to:
            //
            // WAV
            // 16,000 Hz
            // Mono
            // PCM signed 16-bit
            //
            // This is the format expected by
            // the local WhisperKit integration.
            //
            // ----------------------------------------------------

            console.log(
                "🔄 Converting audio..."
            );

            await runFFmpeg([

                "-y",

                "-i",
                inputPath,

                "-ar",
                "16000",

                "-ac",
                "1",

                "-c:a",
                "pcm_s16le",

                outputPath
            ]);

            console.log(
                "✅ Audio converted:"
            );

            console.log(
                outputPath
            );

            // ----------------------------------------------------
            // READ WAV
            // ----------------------------------------------------

            const wavBuffer =
                fs.readFileSync(
                    outputPath
                );

            if (
                !wavBuffer ||
                !wavBuffer.length
            ) {

                throw new Error(
                    "FFmpeg produced an empty WAV file."
                );
            }

            console.log(
                "WAV size:",
                wavBuffer.length,
                "bytes"
            );

            // ----------------------------------------------------
            // SEND TO WHISPERKIT
            // ----------------------------------------------------

            console.log(
                "🧠 Sending audio to WhisperKit..."
            );

            const form =
                new FormData();

            form.append(
                "file",
                new Blob(
                    [
                        wavBuffer
                    ],
                    {
                        type:
                            "audio/wav"
                    }
                ),
                "velino-stt.wav"
            );

            form.append(
                "model",
                "base"
            );

            // ----------------------------------------------------
            // WHISPERKIT REQUEST
            // ----------------------------------------------------

            const response =
                await fetch(
                    `${WHISPERKIT_URL}/v1/audio/transcriptions`,
                    {
                        method:
                            "POST",

                        body:
                            form
                    }
                );

            const responseText =
                await response.text();

            // ----------------------------------------------------
            // PARSE RESPONSE
            // ----------------------------------------------------

            let result;

            try {

                result =
                    JSON.parse(
                        responseText
                    );

            } catch {

                result = {

                    text:
                        responseText
                };
            }

            // ----------------------------------------------------
            // HTTP ERROR
            // ----------------------------------------------------

            if (
                !response.ok
            ) {

                throw new Error(

                    result?.error ||

                    result?.message ||

                    responseText ||

                    `WhisperKit returned HTTP ${response.status}`
                );
            }

            // ----------------------------------------------------
            // TRANSCRIPTION
            // ----------------------------------------------------

            const text =
                String(
                    result?.text ||
                    ""
                ).trim();

            console.log(
                "📝 VELINO TRANSCRIPTION:"
            );

            console.log(
                text
            );

            console.log(
                "===================================="
            );

            // ----------------------------------------------------
            // RETURN TEXT TO RENDERER
            // ----------------------------------------------------

            return {

                success:
                    true,

                text
            };

        } catch (error) {

            // ----------------------------------------------------
            // ERROR
            // ----------------------------------------------------

            console.error(
                "===================================="
            );

            console.error(
                "❌ VELINO STT ERROR"
            );

            console.error(
                error
            );

            console.error(
                "===================================="
            );

            let message =
                error?.message ||
                "Speech recognition failed.";

            // ----------------------------------------------------
            // FFMPEG ERROR
            // ----------------------------------------------------

            if (
                message.includes(
                    "ENOENT"
                ) ||
                message.toLowerCase()
                    .includes(
                        "ffmpeg"
                    )
            ) {

                message =
                    "FFmpeg was not found. Expected /opt/homebrew/bin/ffmpeg on Apple Silicon.";
            }

            // ----------------------------------------------------
            // WHISPERKIT CONNECTION ERROR
            // ----------------------------------------------------

            if (
                message.includes(
                    "ECONNREFUSED"
                ) ||
                message.includes(
                    "fetch failed"
                ) ||
                message.includes(
                    "Failed to fetch"
                )
            ) {

                message =
                    "WhisperKit is not running at http://127.0.0.1:50060.";
            }

            return {

                success:
                    false,

                text:
                    "",

                error:
                    message
            };

        } finally {

            // ----------------------------------------------------
            // CLEAN TEMP INPUT
            // ----------------------------------------------------

            try {

                if (
                    inputPath &&
                    fs.existsSync(
                        inputPath
                    )
                ) {

                    fs.unlinkSync(
                        inputPath
                    );
                }

            } catch (
                cleanupError
            ) {

                console.warn(
                    "STT input cleanup failed:",
                    cleanupError.message
                );
            }

            // ----------------------------------------------------
            // CLEAN TEMP WAV
            // ----------------------------------------------------

            try {

                if (
                    outputPath &&
                    fs.existsSync(
                        outputPath
                    )
                ) {

                    fs.unlinkSync(
                        outputPath
                    );
                }

            } catch (
                cleanupError
            ) {

                console.warn(
                    "STT WAV cleanup failed:",
                    cleanupError.message
                );
            }
        }
    }
);

// ============================================================
// MAC VOICE OUTPUT
// ============================================================
//
// This keeps your existing macOS "say" functionality.
//
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
                        typeof text !==
                            "string" ||
                        !text.trim()
                    ) {

                        resolve(
                            false
                        );

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

                            if (
                                error
                            ) {

                                console.error(
                                    "VOICE ERROR:",
                                    error
                                );

                                reject(
                                    error
                                );

                                return;
                            }

                            resolve(
                                true
                            );
                        }
                    );

                } catch (
                    error
                ) {

                    reject(
                        error
                    );
                }
            }
        );
    }
);

// ============================================================
// APP READY
// ============================================================

app.whenReady()
    .then(
        () => {

            try {

                // --------------------------------------------------
                // CHAT MEMORY FILE
                // --------------------------------------------------

                const chatMemoryPath =
                    path.join(
                        app.getPath(
                            "userData"
                        ),
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
                        app.getPath(
                            "userData"
                        ),
                        "velino-global-memory.json"
                    );

                initializeGlobalMemory(
                    globalMemoryPath
                );

                // --------------------------------------------------
                // STARTUP LOG
                // --------------------------------------------------

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
                    "WHISPERKIT STT READY"
                );

                console.log(
                    "WHISPERKIT URL:",
                    WHISPERKIT_URL
                );

                console.log(
                    "FFMPEG:",
                    getFFmpegPath()
                );

                console.log(
                    "===================================="
                );

                // --------------------------------------------------
                // ALWAYS START WITH A FRESH CHAT
                // --------------------------------------------------
                //
                // Previous chats remain saved.
                // Only the active chat starts fresh.
                //
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

            } catch (
                error
            ) {

                console.error(
                    "MEMORY INITIALIZATION ERROR:",
                    error
                );

                // Still create window
                // if initialization fails.

                createWindow();
            }
        }
    )
    .catch(
        error => {

            console.error(
                "ELECTRON START ERROR:",
                error
            );
        }
    );

// ============================================================
// MACOS
// ============================================================

app.on(
    "window-all-closed",
    () => {

        if (
            process.platform !==
            "darwin"
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
            BrowserWindow
                .getAllWindows()
                .length === 0
        ) {

            // Do not create another chat.
            // Startup already created one.

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