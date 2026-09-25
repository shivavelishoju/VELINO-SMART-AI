// ============================================================
// VELINO SMART AI
// RENDERER PROCESS
// V1.1 + LOCAL WHISPERKIT STT
// ============================================================

const input = document.getElementById("messageInput");
const sendButton = document.getElementById("sendButton");
const chat = document.getElementById("chatMessages");
const welcome = document.getElementById("welcomeScreen");
const typing = document.getElementById("typingIndicator");
const newChatButton = document.getElementById("newChatButton");
const clearChatButton = document.getElementById("clearChatButton");

// ============================================================
// STATE
// ============================================================

let thinking = false;

let mediaRecorder = null;
let microphoneStream = null;
let recordedAudioChunks = [];

let isRecording = false;
let isTranscribing = false;

let micButton = null;


// ============================================================
// MICROPHONE BUTTON
// ============================================================

function createMicrophoneButton() {

    if (document.getElementById("micButton")) {
        micButton = document.getElementById("micButton");
        return;
    }

    if (!sendButton || !sendButton.parentElement) {
        console.error(
            "VELINO: Send button not found."
        );
        return;
    }

    micButton = document.createElement("button");

    micButton.id = "micButton";
    micButton.type = "button";
    micButton.className = "mic-button";

    micButton.title = "Speak to VELINO";
    micButton.setAttribute(
        "aria-label",
        "Speak to VELINO"
    );

    micButton.innerHTML = `
        <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M12 14C13.657 14 15 12.657 15 11V5C15 3.343 13.657 2 12 2C10.343 2 9 3.343 9 5V11C9 12.657 10.343 14 12 14Z"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
            />

            <path
                d="M19 11C19 14.866 15.866 18 12 18C8.134 18 5 14.866 5 11"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
            />

            <path
                d="M12 18V22"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
            />

            <path
                d="M8 22H16"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
            />
        </svg>
    `;

    sendButton.parentElement.insertBefore(
        micButton,
        sendButton
    );

    micButton.addEventListener(
        "click",
        toggleRecording
    );

    console.log(
        "VELINO microphone button ready."
    );
}


// ============================================================
// RECORDING TOGGLE
// ============================================================

async function toggleRecording() {

    if (isTranscribing) {
        return;
    }

    if (isRecording) {
        stopRecording();
        return;
    }

    await startRecording();
}


// ============================================================
// START RECORDING
// ============================================================

async function startRecording() {

    try {

        if (
            !navigator.mediaDevices ||
            !navigator.mediaDevices.getUserMedia
        ) {

            throw new Error(
                "Microphone access is not available."
            );
        }

        microphoneStream =
            await navigator.mediaDevices.getUserMedia({
                audio: {
                    channelCount: 1,
                    echoCancellation: true,
                    noiseSuppression: true,
                    autoGainControl: true
                }
            });


        recordedAudioChunks = [];


        const supportedTypes = [
            "audio/webm;codecs=opus",
            "audio/webm",
            "audio/ogg;codecs=opus"
        ];

        let selectedMimeType = "";

        for (
            const mimeType of supportedTypes
        ) {

            if (
                MediaRecorder.isTypeSupported(
                    mimeType
                )
            ) {

                selectedMimeType =
                    mimeType;

                break;
            }
        }


        if (selectedMimeType) {

            mediaRecorder =
                new MediaRecorder(
                    microphoneStream,
                    {
                        mimeType:
                            selectedMimeType
                    }
                );

        } else {

            mediaRecorder =
                new MediaRecorder(
                    microphoneStream
                );
        }


        mediaRecorder.ondataavailable =
            (event) => {

                if (
                    event.data &&
                    event.data.size > 0
                ) {

                    recordedAudioChunks.push(
                        event.data
                    );
                }
            };


        mediaRecorder.onstop =
            async () => {

                await transcribeRecording();
            };


        mediaRecorder.onerror =
            (event) => {

                console.error(
                    "VELINO microphone error:",
                    event
                );

                cleanupRecording();

                showTemporaryStatus(
                    "Microphone error"
                );
            };


        mediaRecorder.start(
            250
        );

        isRecording = true;


        updateMicrophoneUI();

        showTemporaryStatus(
            "Listening..."
        );


        console.log(
            "VELINO microphone recording started."
        );

    } catch (error) {

        console.error(
            "VELINO microphone access error:",
            error
        );

        cleanupRecording();


        let message =
            "Unable to access microphone.";

        if (
            error &&
            error.name ===
                "NotAllowedError"
        ) {

            message =
                "Microphone permission was denied.";

        } else if (
            error &&
            error.name ===
                "NotFoundError"
        ) {

            message =
                "No microphone was found.";
        }


        showTemporaryStatus(
            message
        );
    }
}


// ============================================================
// STOP RECORDING
// ============================================================

function stopRecording() {

    if (!mediaRecorder) {
        return;
    }

    if (
        mediaRecorder.state ===
        "recording"
    ) {

        mediaRecorder.stop();
    }

    isRecording = false;

    updateMicrophoneUI();

    showTemporaryStatus(
        "Processing..."
    );

    console.log(
        "VELINO microphone recording stopped."
    );
}


// ============================================================
// TRANSCRIBE RECORDING
// ============================================================

async function transcribeRecording() {

    if (
        recordedAudioChunks.length === 0
    ) {

        cleanupRecording();

        showTemporaryStatus(
            "No speech detected."
        );

        return;
    }


    isTranscribing = true;

    updateMicrophoneUI();


    try {

        const audioBlob =
            new Blob(
                recordedAudioChunks,
                {
                    type:
                        mediaRecorder &&
                        mediaRecorder.mimeType
                            ? mediaRecorder.mimeType
                            : "audio/webm"
                }
            );


        const audioBuffer =
            await audioBlob.arrayBuffer();


        console.log(
            "Sending audio to local WhisperKit..."
        );


        const result =
            await window.velino.transcribeAudio(
                audioBuffer
            );


        if (
            !result ||
            !result.success
        ) {

            throw new Error(
                result &&
                result.error
                    ? result.error
                    : "Transcription failed."
            );
        }


        const text =
            String(
                result.text || ""
            ).trim();


        if (!text) {

            showTemporaryStatus(
                "No speech detected."
            );

            return;
        }


        // ====================================================
        // PUT TRANSCRIPTION INTO MESSAGE BOX
        // ====================================================
        //
        // IMPORTANT:
        // We DO NOT automatically send the message.
        //
        // User can review/edit the transcription first.
        //
        // ====================================================

        const existingText =
            input.value.trim();


        if (existingText) {

            input.value =
                existingText +
                " " +
                text;

        } else {

            input.value = text;
        }


        input.classList.add(
            "listening"
        );


        autoResize();

        input.focus();

        input.setSelectionRange(
            input.value.length,
            input.value.length
        );


        console.log(
            "VELINO STT:",
            text
        );


    } catch (error) {

        console.error(
            "VELINO WhisperKit transcription error:",
            error
        );


        showTemporaryStatus(
            "Speech recognition failed."
        );


        addAIMessage(
            "🎙️ Speech recognition failed.<br><br>" +
            escapeHTML(
                error.message ||
                "Unable to transcribe audio."
            )
        );

    } finally {

        isTranscribing = false;

        cleanupRecording();

        updateMicrophoneUI();
    }
}


// ============================================================
// CLEANUP RECORDING
// ============================================================

function cleanupRecording() {

    if (microphoneStream) {

        microphoneStream
            .getTracks()
            .forEach(
                track => track.stop()
            );
    }


    microphoneStream = null;

    mediaRecorder = null;

    recordedAudioChunks = [];

    isRecording = false;
}


// ============================================================
// MICROPHONE UI
// ============================================================

function updateMicrophoneUI() {

    if (!micButton) {
        return;
    }


    micButton.classList.toggle(
        "recording",
        isRecording
    );


    micButton.classList.toggle(
        "processing",
        isTranscribing
    );


    if (isTranscribing) {

        micButton.title =
            "Transcribing...";

        micButton.setAttribute(
            "aria-label",
            "Transcribing"
        );

    } else if (isRecording) {

        micButton.title =
            "Stop recording";

        micButton.setAttribute(
            "aria-label",
            "Stop recording"
        );

    } else {

        micButton.title =
            "Speak to VELINO";

        micButton.setAttribute(
            "aria-label",
            "Speak to VELINO"
        );
    }
}


// ============================================================
// TEMPORARY STATUS
// ============================================================

function showTemporaryStatus(
    message
) {

    if (!micButton) {
        return;
    }

    micButton.title = message;
}


// ============================================================
// SEND MESSAGE
// ============================================================

async function sendMessage(
    customMessage = null
) {

    if (thinking) {
        return;
    }


    const text =
        customMessage !== null
            ? String(
                customMessage
            ).trim()
            : input.value.trim();


    if (!text) {
        return;
    }


    thinking = true;


    if (welcome) {
        welcome.style.display =
            "none";
    }


    addUserMessage(
        text
    );


    input.value = "";

    input.classList.remove(
        "listening"
    );

    autoResize();


    if (typing) {

        typing.style.display =
            "flex";
    }


    if (sendButton) {
        sendButton.disabled =
            true;
    }

    if (micButton) {
        micButton.disabled =
            true;
    }


    scrollBottom();


    try {

        const response =
            await window.velino.ask(
                text
            );


        if (
            response &&
            typeof response ===
                "object"
        ) {

            if (
                response.success ===
                false
            ) {

                addAIMessage(
                    escapeHTML(
                        response.error ||
                        "VELINO could not process the request."
                    )
                );

            } else {

                addAIMessage(
                    formatAIResponse(
                        response.text ||
                        response.message ||
                        ""
                    )
                );
            }

        } else {

            addAIMessage(
                formatAIResponse(
                    String(
                        response || ""
                    )
                )
            );
        }


    } catch (error) {

        console.error(
            "VELINO AI error:",
            error
        );


        addAIMessage(
            "⚠️ VELINO Smart AI error.<br><br>" +
            escapeHTML(
                error.message ||
                "Unable to connect to the local AI."
            )
        );

    } finally {

        thinking = false;


        if (typing) {
            typing.style.display =
                "none";
        }


        if (sendButton) {
            sendButton.disabled =
                false;
        }

        if (micButton) {
            micButton.disabled =
                false;
        }


        scrollBottom();

        input.focus();
    }
}


// ============================================================
// ADD USER MESSAGE
// ============================================================

function addUserMessage(
    text
) {

    const message =
        document.createElement(
            "div"
        );

    message.className =
        "message user-message";


    message.innerHTML = `
        <div class="message-content">
            ${escapeHTML(text)}
        </div>
    `;


    chat.appendChild(
        message
    );


    scrollBottom();
}


// ============================================================
// ADD AI MESSAGE
// ============================================================

function addAIMessage(
    text
) {

    const message =
        document.createElement(
            "div"
        );

    message.className =
        "message ai-message";


    message.innerHTML = `
        <div class="message-content">
            ${text}
        </div>
    `;


    chat.appendChild(
        message
    );


    scrollBottom();
}


// ============================================================
// FORMAT AI RESPONSE
// ============================================================

function formatAIResponse(
    text
) {

    if (!text) {
        return "";
    }


    let formatted =
        escapeHTML(
            String(text)
        );


    formatted =
        formatted.replace(
            /\*\*(.*?)\*\*/g,
            "<strong>$1</strong>"
        );


    formatted =
        formatted.replace(
            /`([^`]+)`/g,
            "<code>$1</code>"
        );


    formatted =
        formatted.replace(
            /\n/g,
            "<br>"
        );


    return formatted;
}


// ============================================================
// ESCAPE HTML
// ============================================================

function escapeHTML(
    value
) {

    return String(
        value
    )
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );
}


// ============================================================
// SCROLL
// ============================================================

function scrollBottom() {

    if (!chat) {
        return;
    }


    requestAnimationFrame(
        () => {

            chat.scrollTop =
                chat.scrollHeight;
        }
    );
}


// ============================================================
// AUTO RESIZE
// ============================================================

function autoResize() {

    if (!input) {
        return;
    }


    input.style.height =
        "auto";


    input.style.height =
        Math.min(
            input.scrollHeight,
            180
        ) + "px";
}


// ============================================================
// INPUT EVENT
// ============================================================

if (input) {

    input.addEventListener(
        "input",
        autoResize
    );


    input.addEventListener(
        "keydown",
        event => {

            if (
                event.key ===
                "Enter" &&
                !event.shiftKey
            ) {

                event.preventDefault();

                sendMessage();
            }
        }
    );
}


// ============================================================
// SEND BUTTON
// ============================================================

if (sendButton) {

    sendButton.addEventListener(
        "click",
        () => {

            sendMessage();
        }
    );
}


// ============================================================
// NEW CHAT
// ============================================================

if (newChatButton) {

    newChatButton.addEventListener(
        "click",
        async () => {

            try {

                await window.velino.newChat();

                clearConversation();

                if (welcome) {

                    welcome.style.display =
                        "";
                }

                input.focus();

            } catch (error) {

                console.error(
                    "VELINO new chat error:",
                    error
                );
            }
        }
    );
}


// ============================================================
// CLEAR CHAT
// ============================================================

if (clearChatButton) {

    clearChatButton.addEventListener(
        "click",
        async () => {

            try {

                await window.velino.clearChat();

                clearConversation();

            } catch (error) {

                console.error(
                    "VELINO clear chat error:",
                    error
                );
            }
        }
    );
}


// ============================================================
// CLEAR CONVERSATION UI
// ============================================================

function clearConversation() {

    if (!chat) {
        return;
    }


    chat
        .querySelectorAll(
            ".message"
        )
        .forEach(
            element =>
                element.remove()
        );


    if (welcome) {

        welcome.style.display =
            "";
    }


    input.value = "";

    input.classList.remove(
        "listening"
    );


    autoResize();

    scrollBottom();

    input.focus();
}


// ============================================================
// QUICK ACTIONS
// ============================================================

document
    .querySelectorAll(
        "[data-message]"
    )
    .forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    const message =
                        button.dataset.message;

                    if (message) {

                        sendMessage(
                            message
                        );
                    }
                }
            );
        }
    );


// ============================================================
// STARTUP
// ============================================================

createMicrophoneButton();

autoResize();

input.focus();

console.log(
    "===================================="
);

console.log(
    "VELINO SMART AI RENDERER READY"
);

console.log(
    "LOCAL WHISPERKIT STT READY"
);

console.log(
    "MICROPHONE UI READY"
);

console.log(
    "===================================="
);