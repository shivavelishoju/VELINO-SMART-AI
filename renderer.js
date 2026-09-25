// ============================================================
// VELINO SMART AI
// MODERN CHAT INTERFACE
// CHAT MANAGEMENT
// ============================================================

// ============================================================
// DOM
// ============================================================

const input =
    document.getElementById(
        "messageInput"
    );

const sendButton =
    document.getElementById(
        "sendButton"
    );

const chat =
    document.getElementById(
        "chatMessages"
    );

const welcome =
    document.getElementById(
        "welcomeScreen"
    );

const typing =
    document.getElementById(
        "typingIndicator"
    );

const newChatButton =
    document.getElementById(
        "newChatButton"
    );

const clearChatButton =
    document.getElementById(
        "clearChatButton"
    );

const chatHistory =
    document.getElementById(
        "chatHistory"
    );

// ============================================================
// STATE
// ============================================================

let thinking = false;

let currentChatId = null;

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
        customMessage ||
        input.value.trim();

    if (!text) {

        return;

    }

    if (welcome) {

        welcome.style.display =
            "none";

    }

    addUserMessage(
        text
    );

    input.value = "";

    autoResize();

    thinking = true;

    input.disabled = true;

    sendButton.disabled = true;

    if (typing) {

        typing.classList.remove(
            "hidden"
        );

    }

    scrollBottom();

    try {

        const response =
            await window.velino.ask(
                text
            );

        if (typing) {

            typing.classList.add(
                "hidden"
            );

        }

        addAIMessage(
            response ||
            "No response returned."
        );

        await refreshChats();

        currentChatId =
            await window.velino
                .getCurrentChatId();

    } catch (error) {

        console.error(
            "VELINO ERROR:",
            error
        );

        if (typing) {

            typing.classList.add(
                "hidden"
            );

        }

        addAIMessage(
            "I couldn't connect to the local AI engine. Please make sure Ollama is running."
        );

    }

    thinking = false;

    input.disabled = false;

    sendButton.disabled = false;

    input.focus();

    scrollBottom();

}

// ============================================================
// USER MESSAGE
// ============================================================

function addUserMessage(
    text
) {

    const wrapper =
        document.createElement(
            "div"
        );

    wrapper.className =
        "message user-message";

    wrapper.innerHTML = `

        <div class="message-inner">

            <div class="message-header">

                <div class="message-avatar user-avatar">
                    YOU
                </div>

                <div class="message-name">
                    YOU
                </div>

            </div>

            <div class="message-body">
                ${escapeHTML(text)}
            </div>

        </div>

    `;

    chat.appendChild(
        wrapper
    );

    scrollBottom();

}

// ============================================================
// AI MESSAGE
// ============================================================

function addAIMessage(
    text
) {

    const wrapper =
        document.createElement(
            "div"
        );

    wrapper.className =
        "message";

    wrapper.innerHTML = `

        <div class="message-header">

            <div class="message-avatar ai-avatar">
                V
            </div>

            <div class="message-name">
                VELINO
            </div>

        </div>

        <div class="message-body">

            ${formatAIResponse(text)}

        </div>

    `;

    chat.appendChild(
        wrapper
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

    let safe =
        escapeHTML(
            String(text)
        );

    // Code blocks

    safe =
        safe.replace(
            /```([\s\S]*?)```/g,
            "<pre>$1</pre>"
        );

    // Inline code

    safe =
        safe.replace(
            /`([^`]+)`/g,
            "<code>$1</code>"
        );

    // Bold

    safe =
        safe.replace(
            /\*\*(.*?)\*\*/g,
            "<strong>$1</strong>"
        );

    // Headings

    safe =
        safe.replace(
            /^### (.*)$/gm,
            "<strong>$1</strong>"
        );

    safe =
        safe.replace(
            /^## (.*)$/gm,
            "<strong>$1</strong>"
        );

    // New lines

    safe =
        safe.replace(
            /\n/g,
            "<br>"
        );

    return safe;

}

// ============================================================
// ESCAPE HTML
// ============================================================

function escapeHTML(
    value
) {

    const div =
        document.createElement(
            "div"
        );

    div.textContent =
        String(value);

    return div.innerHTML;

}

// ============================================================
// SCROLL
// ============================================================

function scrollBottom() {

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

    input.style.height =
        "auto";

    input.style.height =
        Math.min(
            input.scrollHeight,
            180
        ) + "px";

}

input.addEventListener(
    "input",
    autoResize
);

// ============================================================
// ENTER
// ============================================================

input.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Enter" &&
            !event.shiftKey
        ) {

            event.preventDefault();

            sendMessage();

        }

    }
);

// ============================================================
// SEND
// ============================================================

sendButton.addEventListener(
    "click",
    () => {

        sendMessage();

    }
);

// ============================================================
// QUICK ACTIONS
// ============================================================

document
    .querySelectorAll(
        ".quick-action"
    )
    .forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    const message =
                        button.dataset.message;

                    sendMessage(
                        message
                    );

                }
            );

        }
    );

// ============================================================
// CLEAR SCREEN
// ============================================================

function clearChatScreen() {

    chat
        .querySelectorAll(
            ".message"
        )
        .forEach(
            message => {

                message.remove();

            }
        );

    if (welcome) {

        welcome.style.display =
            "flex";

    }

}

// ============================================================
// NEW CHAT
// ============================================================

async function createNewChat() {

    if (thinking) {

        return;

    }

    try {

        const newChat =
            await window.velino.newChat();

        currentChatId =
            newChat.id;

        clearChatScreen();

        await refreshChats();

        input.value = "";

        autoResize();

        input.focus();

    } catch (error) {

        console.error(
            "NEW CHAT ERROR:",
            error
        );

    }

}

// ============================================================
// CLEAR CURRENT CHAT
// ============================================================

async function clearCurrentChat() {

    if (thinking) {

        return;

    }

    try {

        await window.velino.clearChat();

        clearChatScreen();

        await refreshChats();

        input.focus();

    } catch (error) {

        console.error(
            "CLEAR CHAT ERROR:",
            error
        );

    }

}

// ============================================================
// LOAD CHAT
// ============================================================

async function openChat(
    chatId
) {

    if (thinking) {

        return;

    }

    try {

        const selected =
            await window.velino.loadChat(
                chatId
            );

        if (!selected) {

            return;

        }

        currentChatId =
            selected.id;

        renderConversation(
            selected.messages || []
        );

        await refreshChats();

        input.focus();

    } catch (error) {

        console.error(
            "LOAD CHAT ERROR:",
            error
        );

    }

}

// ============================================================
// RENDER CONVERSATION
// ============================================================

function renderConversation(
    messages
) {

    chat
        .querySelectorAll(
            ".message"
        )
        .forEach(
            message => {

                message.remove();

            }
        );

    if (
        !messages ||
        messages.length === 0
    ) {

        if (welcome) {

            welcome.style.display =
                "flex";

        }

        return;

    }

    if (welcome) {

        welcome.style.display =
            "none";

    }

    messages.forEach(
        message => {

            if (
                message.role ===
                "user"
            ) {

                addUserMessage(
                    message.content
                );

            }

            else if (
                message.role ===
                "assistant"
            ) {

                addAIMessage(
                    message.content
                );

            }

        }
    );

    scrollBottom();

}

// ============================================================
// REFRESH CHAT LIST
// ============================================================

async function refreshChats() {

    if (!chatHistory) {

        return;

    }

    try {

        const chats =
            await window.velino.getChats();

        renderChats(
            chats || []
        );

    } catch (error) {

        console.error(
            "REFRESH CHATS ERROR:",
            error
        );

    }

}

// ============================================================
// RENDER CHAT LIST
// ============================================================

function renderChats(
    chats
) {

    chatHistory.innerHTML =
        "";

    if (
        !chats ||
        chats.length === 0
    ) {

        chatHistory.innerHTML = `

            <div class="empty-chats">
                No conversations yet
            </div>

        `;

        return;

    }

    const pinned =
        chats.filter(
            chat =>
                chat.pinned
        );

    const recent =
        chats.filter(
            chat =>
                !chat.pinned
        );

    if (
        pinned.length > 0
    ) {

        addChatSection(
            "Pinned",
            pinned
        );

    }

    if (
        recent.length > 0
    ) {

        addChatSection(
            "Recent",
            recent
        );

    }

}

// ============================================================
// CHAT SECTION
// ============================================================

function addChatSection(
    title,
    chats
) {

    const heading =
        document.createElement(
            "div"
        );

    heading.className =
        "chat-section-title";

    heading.textContent =
        title;

    chatHistory.appendChild(
        heading
    );

    chats.forEach(
        chatData => {

            chatHistory.appendChild(
                createChatItem(
                    chatData
                )
            );

        }
    );

}

// ============================================================
// CHAT ITEM
// ============================================================

function createChatItem(
    chatData
) {

    const item =
        document.createElement(
            "div"
        );

    item.className =
        "chat-history-item";

    if (
        chatData.id ===
        currentChatId
    ) {

        item.classList.add(
            "active"
        );

    }

    // --------------------------------------------------------
    // ROW
    // --------------------------------------------------------

    const row =
        document.createElement(
            "div"
        );

    row.className =
        "chat-item-row";

    // --------------------------------------------------------
    // MAIN BUTTON
    // --------------------------------------------------------

    const mainButton =
        document.createElement(
            "button"
        );

    mainButton.className =
        "chat-main-button";

    mainButton.type =
        "button";

    mainButton.innerHTML = `

        <span class="chat-history-icon">
            ${chatData.pinned ? "📌" : "◈"}
        </span>

        <span class="chat-title">
            ${escapeHTML(
                chatData.title ||
                "New conversation"
            )}
        </span>

    `;

    mainButton.addEventListener(
        "click",
        () => {

            openChat(
                chatData.id
            );

        }
    );

    // --------------------------------------------------------
    // MENU
    // --------------------------------------------------------

    const menuButton =
        document.createElement(
            "button"
        );

    menuButton.className =
        "chat-menu-button";

    menuButton.type =
        "button";

    menuButton.textContent =
        "⋯";

    menuButton.title =
        "Chat options";

    menuButton.addEventListener(
        "click",
        event => {

            event.stopPropagation();

            showChatMenu(
                menuButton,
                chatData
            );

        }
    );

    row.appendChild(
        mainButton
    );

    row.appendChild(
        menuButton
    );

    item.appendChild(
        row
    );

    // --------------------------------------------------------
    // TAGS
    // --------------------------------------------------------

    if (
        Array.isArray(
            chatData.tags
        ) &&
        chatData.tags.length > 0
    ) {

        const tags =
            document.createElement(
                "div"
            );

        tags.className =
            "chat-tags";

        chatData.tags.forEach(
            tag => {

                const tagElement =
                    document.createElement(
                        "span"
                    );

                tagElement.className =
                    "chat-tag";

                tagElement.textContent =
                    tag;

                tags.appendChild(
                    tagElement
                );

            }
        );

        item.appendChild(
            tags
        );

    }

    return item;

}

// ============================================================
// CHAT MENU
// ============================================================

function showChatMenu(
    button,
    chatData
) {

    // Remove old menus

    document
        .querySelectorAll(
            ".chat-context-menu"
        )
        .forEach(
            menu => {

                menu.remove();

            }
        );

    const menu =
        document.createElement(
            "div"
        );

    menu.className =
        "chat-context-menu";

    // --------------------------------------------------------
    // PIN
    // --------------------------------------------------------

    const pinButton =
        createMenuButton(
            chatData.pinned
                ? "Unpin Chat"
                : "Pin Chat"
        );

    pinButton.addEventListener(
        "click",
        async () => {

            menu.remove();

            await window.velino
                .togglePinChat(
                    chatData.id
                );

            await refreshChats();

        }
    );

    menu.appendChild(
        pinButton
    );

    // --------------------------------------------------------
    // RENAME
    // --------------------------------------------------------

    const renameButton =
        createMenuButton(
            "Rename Chat"
        );

    renameButton.addEventListener(
        "click",
        async () => {

            menu.remove();

            const title =
                prompt(
                    "Enter new chat name:",
                    chatData.title
                );

            if (
                title &&
                title.trim()
            ) {

                try {

                    await window.velino
                        .renameChat(
                            chatData.id,
                            title.trim()
                        );

                    await refreshChats();

                } catch (error) {

                    console.error(
                        "RENAME ERROR:",
                        error
                    );

                }

            }

        }
    );

    menu.appendChild(
        renameButton
    );

    // --------------------------------------------------------
    // ADD TAG
    // --------------------------------------------------------

    const tagButton =
        createMenuButton(
            "Add Tag"
        );

    tagButton.addEventListener(
        "click",
        async () => {

            menu.remove();

            const tag =
                prompt(
                    "Enter tag:"
                );

            if (
                tag &&
                tag.trim()
            ) {

                try {

                    await window.velino
                        .addChatTag(
                            chatData.id,
                            tag.trim()
                        );

                    await refreshChats();

                } catch (error) {

                    console.error(
                        "TAG ERROR:",
                        error
                    );

                }

            }

        }
    );

    menu.appendChild(
        tagButton
    );

    // --------------------------------------------------------
    // DELETE
    // --------------------------------------------------------

    const deleteButton =
        createMenuButton(
            "Delete Chat"
        );

    deleteButton.classList.add(
        "danger"
    );

    deleteButton.addEventListener(
        "click",
        async () => {

            menu.remove();

            const confirmed =
                confirm(
                    `Delete "${chatData.title}"?`
                );

            if (!confirmed) {

                return;

            }

            try {

                const result =
                    await window.velino
                        .deleteChat(
                            chatData.id
                        );

                if (result) {

                    currentChatId =
                        result.id;

                    renderConversation(
                        result.messages ||
                        []
                    );

                }

                await refreshChats();

            } catch (error) {

                console.error(
                    "DELETE ERROR:",
                    error
                );

            }

        }
    );

    menu.appendChild(
        deleteButton
    );

    document.body.appendChild(
        menu
    );

    // --------------------------------------------------------
    // POSITION
    // --------------------------------------------------------

    const rect =
        button.getBoundingClientRect();

    menu.style.position =
        "fixed";

    menu.style.left =
        `${rect.right + 6}px`;

    menu.style.top =
        `${rect.top}px`;

    // --------------------------------------------------------
    // OUTSIDE CLICK
    // --------------------------------------------------------

    setTimeout(
        () => {

            document.addEventListener(
                "click",
                function closeMenu(
                    event
                ) {

                    if (
                        !menu.contains(
                            event.target
                        )
                    ) {

                        menu.remove();

                        document.removeEventListener(
                            "click",
                            closeMenu
                        );

                    }

                }
            );

        },
        0
    );

}

// ============================================================
// MENU BUTTON
// ============================================================

function createMenuButton(
    text
) {

    const button =
        document.createElement(
            "button"
        );

    button.className =
        "chat-context-button";

    button.type =
        "button";

    button.textContent =
        text;

    return button;

}

// ============================================================
// NEW CHAT
// ============================================================

newChatButton.addEventListener(
    "click",
    createNewChat
);

// ============================================================
// CLEAR
// ============================================================

clearChatButton.addEventListener(
    "click",
    clearCurrentChat
);

// ============================================================
// STARTUP
// ============================================================

async function initializeUI() {

    console.log(
        "===================================="
    );

    console.log(
        "VELINO SMART AI"
    );

    console.log(
        "CHAT SYSTEM READY"
    );

    console.log(
        "===================================="
    );

    try {

        currentChatId =
            await window.velino
                .getCurrentChatId();

        const conversation =
            await window.velino
                .getCurrentConversation();

        renderConversation(
            conversation
        );

        await refreshChats();

    } catch (error) {

        console.error(
            "VELINO STARTUP ERROR:",
            error
        );

    }

    input.focus();

}

initializeUI();