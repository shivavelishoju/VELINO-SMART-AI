// ============================================================
// VELINO SMART AI
// AGENT CORE V4
// ============================================================

const fs = require("fs");
const path = require("path");

const CONFIG =
    require("./config");

const memory =
    require("./memory");

const {
    runTool,
    getToolDescriptions
} = require("./tools");


// ============================================================
// CONFIG
// ============================================================

const OLLAMA_URL =
    CONFIG.OLLAMA_URL;

const MODEL =
    CONFIG.MODEL;

const MAX_MESSAGES =
    CONFIG.MAX_CHAT_MESSAGES || 20;

const MAX_AGENT_STEPS =
    CONFIG.MAX_AGENT_STEPS || 3;


// ============================================================
// DEVELOPER PROFILE
// ============================================================
// This information is intentionally stored inside the Agent Core.
// It allows VELINO Smart AI to answer questions about its developer
// without depending entirely on the AI model's memory.
// ============================================================

const DEVELOPER_PROFILE = {

    // --------------------------------------------------------
    // IDENTITY
    // --------------------------------------------------------

    name:
        "Shiva Velishoju",

    title:
        "Embedded Systems & Software Developer",

    education:
        "B.Tech in Electronics and Communication Engineering",

    ecosystem:
        "VELINO",

    aiProduct:
        "VELINO Smart AI",

    role:
        "Developer and creator behind the VELINO ecosystem",


    // --------------------------------------------------------
    // VELINO IDENTITY
    // --------------------------------------------------------

    velinoFullForm:
        "Versatile Embedded Platform for Learning, Innovation, and Open-Source Networking",

    velinoMeaning: `
VELINO stands for:

Versatile Embedded Platform for Learning, Innovation, and Open-Source Networking.

It represents an engineering ecosystem focused on learning, practical
innovation, embedded systems, electronics, software and open-source
technology.

The goal is to bring hardware, software and AI together into practical,
connected and intelligent engineering tools.
    `.trim(),


    // --------------------------------------------------------
    // VISION
    // --------------------------------------------------------

    vision:
        "Build practical engineering tools by combining hardware, software and AI.",


    // --------------------------------------------------------
    // JOURNEY
    // --------------------------------------------------------

    journey: `
Shiva Velishoju is an Electronics and Communication Engineering graduate
and an Embedded Systems & Software Developer.

His engineering journey began with an interest in electronics, practical
experimentation and embedded systems. Over time, his work expanded into
Arduino, ESP32, ESP32-C3, BLE, sensors, robotics, PCB development,
software development, web technologies, desktop applications and
AI-assisted engineering tools.

A major motivation behind the VELINO ecosystem came from practical
embedded-development problems.

Developers working with Arduino and embedded boards often need to spend
time identifying boards, selecting serial ports, configuring development
tools, compiling code, uploading firmware, monitoring serial output and
debugging errors.

The VELINO vision grew from the idea of simplifying that workflow and
bringing different engineering tools together.

This journey led to projects such as VELINO IDE, VELINO Smart AI,
VELINO Board S1, VELINO AirPad, VELINO Air Mouse V2,
VELINO Mecanum Robot and other embedded experiments.

His approach focuses on continuous learning, practical experimentation,
problem solving and turning ideas into working technology.
    `.trim(),


    // --------------------------------------------------------
    // VELINO STORY
    // --------------------------------------------------------

    story: `
The VELINO story is based on solving practical engineering problems.

The idea grew from hands-on experience with embedded development and the
observation that developers often spend unnecessary time dealing with
setup, board detection, serial-port selection, compilation, uploading
and debugging instead of focusing on building their ideas.

VELINO aims to bring these parts together into one ecosystem.

VELINO IDE focuses on the embedded development workflow.

VELINO Smart AI adds an engineering-focused local AI assistant.

VELINO hardware projects explore practical applications involving
Arduino, ESP32, ESP32-C3, BLE, sensors, robotics and custom electronics.

The broader vision is to create practical tools where:

Hardware
+
Software
+
AI

can work together.

VELINO stands for:

Versatile Embedded Platform for Learning, Innovation, and Open-Source Networking.
    `.trim(),


    // --------------------------------------------------------
    // ENGINEERING PHILOSOPHY
    // --------------------------------------------------------

    philosophy: `
Shiva's engineering philosophy is based on practical experimentation,
continuous learning, problem solving and innovation.

Rather than treating hardware and software as completely separate areas,
his projects combine electronics, embedded systems, software and AI.

The goal is to turn practical engineering problems into useful
technology solutions.

The VELINO philosophy is:

Build. Program. Innovate.
    `.trim(),


    // --------------------------------------------------------
    // INNOVATIONS
    // --------------------------------------------------------

    innovations: [

        {
            name:
                "VELINO IDE",

            description:
                "An embedded-development environment designed around Arduino and ESP32 workflows, including coding, board detection, serial-port handling, compilation, firmware uploading, Serial Monitor, Serial Plotter, debugging assistance and AI support."
        },

        {
            name:
                "VELINO Smart AI",

            description:
                "A local engineering-focused AI assistant designed to help with programming, embedded systems, electronics, Arduino, ESP32, IoT, robotics, debugging and VELINO projects."
        },

        {
            name:
                "VELINO Board S1",

            description:
                "A custom Arduino Uno-style development board concept created as part of the VELINO hardware ecosystem."
        },

        {
            name:
                "VELINO AirPad",

            description:
                "An ESP32-based wireless BLE controller designed for interaction with compatible devices."
        },

        {
            name:
                "VELINO Air Mouse V2",

            description:
                "An ESP32-C3 and MPU6050 based wireless air mouse concept using motion sensing and BLE HID interaction."
        },

        {
            name:
                "VELINO Mecanum Robot",

            description:
                "An ESP32-based mecanum robotic platform using Wi-Fi and a web-based control system."
        },

        {
            name:
                "ESP32-C3 Projects",

            description:
                "Embedded experiments involving ESP32-C3, BLE, sensors, OLED displays, motion control and human-interface devices."
        },

        {
            name:
                "VADDI Calculator Pro",

            description:
                "A software project combining HTML, CSS, JavaScript and application-oriented development."
        }

    ],


    // --------------------------------------------------------
    // TECHNOLOGIES
    // --------------------------------------------------------

    technologies: [

        "Arduino",
        "Arduino CLI",
        "ESP32",
        "ESP32-C3",
        "C/C++",
        "Java",
        "JavaScript",
        "HTML",
        "CSS",
        "Node.js",
        "Electron.js",
        "Monaco Editor",
        "BLE",
        "Bluetooth HID",
        "MPU6050",
        "OLED displays",
        "IoT",
        "Robotics",
        "PCB design",
        "Artificial Intelligence"

    ],


    // --------------------------------------------------------
    // PROJECT LIST
    // --------------------------------------------------------

    projects: [

        "VELINO IDE",
        "VELINO Smart AI",
        "VELINO Board S1",
        "VELINO AirPad",
        "VELINO Air Mouse V2",
        "VELINO Mecanum Robot",
        "ESP32-C3 embedded projects",
        "Arduino projects",
        "OLED and sensor projects",
        "BLE projects",
        "VADDI Calculator Pro",
        "Java-based projects",
        "VELINO web projects"

    ]

};


// ============================================================
// CHAT DATABASE
// ============================================================

let chatFile = null;

let database = {

    currentChatId:
        null,

    chats:
        []

};


// ============================================================
// SAVE DATABASE
// ============================================================

function saveDatabase() {

    if (!chatFile) {
        return;
    }

    try {

        fs.mkdirSync(
            path.dirname(
                chatFile
            ),
            {
                recursive:
                    true
            }
        );

        fs.writeFileSync(

            chatFile,

            JSON.stringify(
                database,
                null,
                2
            ),

            "utf8"

        );

    } catch (error) {

        console.error(
            "VELINO CHAT SAVE ERROR:",
            error
        );

    }

}


// ============================================================
// INITIALIZE CHAT MEMORY
// ============================================================

function initializeMemory(
    filePath
) {

    chatFile =
        filePath;

    try {

        if (
            fs.existsSync(
                chatFile
            )
        ) {

            const raw =
                fs.readFileSync(
                    chatFile,
                    "utf8"
                );

            database =
                JSON.parse(
                    raw
                );

        } else {

            database = {

                currentChatId:
                    null,

                chats:
                    []

            };

        }

    } catch (error) {

        console.error(
            "VELINO CHAT DATABASE ERROR:",
            error
        );

        database = {

            currentChatId:
                null,

            chats:
                []

        };

    }


    // --------------------------------------------------------
    // VALIDATE DATABASE
    // --------------------------------------------------------

    if (
        !database ||
        !Array.isArray(
            database.chats
        )
    ) {

        database = {

            currentChatId:
                null,

            chats:
                []

        };

    }


    // --------------------------------------------------------
    // NORMALIZE OLD CHAT DATA
    // --------------------------------------------------------

    database.chats =
        database.chats.map(
            chat => ({

                id:
                    chat.id ||
                    `chat-${Date.now()}-${Math.random()
                        .toString(36)
                        .slice(2, 8)}`,

                title:
                    chat.title ||
                    "New conversation",

                pinned:
                    Boolean(
                        chat.pinned
                    ),

                tags:
                    Array.isArray(
                        chat.tags
                    )
                        ? chat.tags
                        : [],

                messages:
                    Array.isArray(
                        chat.messages
                    )
                        ? chat.messages
                        : [],

                createdAt:
                    chat.createdAt ||
                    new Date()
                        .toISOString(),

                updatedAt:
                    chat.updatedAt ||
                    new Date()
                        .toISOString()

            })
        );


    // --------------------------------------------------------
    // IMPORTANT:
    // ALWAYS START WITH A FRESH CHAT
    //
    // Old conversations remain saved in the sidebar.
    // But reopening VELINO Smart AI will NOT reopen the
    // previous conversation.
    // --------------------------------------------------------

    const freshChat =
        createNewChat(
            false
        );

    database.currentChatId =
        freshChat.id;


    saveDatabase();

}


// ============================================================
// GET CURRENT CHAT
// ============================================================

function getCurrentChat() {

    let chat =
        database.chats.find(
            item =>
                item.id ===
                database.currentChatId
        );


    if (!chat) {

        chat =
            database.chats[0];

        if (chat) {

            database.currentChatId =
                chat.id;

        }

    }


    return chat;

}


// ============================================================
// CREATE NEW CHAT
// ============================================================

function createNewChat(
    shouldSave = true
) {

    const now =
        new Date()
            .toISOString();


    const chat = {

        id:
            `chat-${Date.now()}-${Math.random()
                .toString(36)
                .slice(2, 8)}`,

        title:
            "New conversation",

        pinned:
            false,

        tags:
            [],

        messages:
            [],

        createdAt:
            now,

        updatedAt:
            now

    };


    database.chats.unshift(
        chat
    );


    database.currentChatId =
        chat.id;


    if (shouldSave) {

        saveDatabase();

    }


    return chat;

}


// ============================================================
// GET CHATS
// ============================================================

function getChats() {

    return database.chats

        .slice()

        .sort(
            (a, b) => {

                if (
                    a.pinned &&
                    !b.pinned
                ) {

                    return -1;

                }


                if (
                    !a.pinned &&
                    b.pinned
                ) {

                    return 1;

                }


                return (
                    new Date(
                        b.updatedAt
                    ) -
                    new Date(
                        a.updatedAt
                    )
                );

            }
        )

        .map(
            chat => ({

                id:
                    chat.id,

                title:
                    chat.title,

                pinned:
                    chat.pinned,

                tags:
                    chat.tags,

                messageCount:
                    chat.messages.length,

                createdAt:
                    chat.createdAt,

                updatedAt:
                    chat.updatedAt

            })
        );

}


// ============================================================
// LOAD CHAT
// ============================================================

function loadChat(
    chatId
) {

    const chat =
        database.chats.find(
            item =>
                item.id ===
                chatId
        );


    if (!chat) {

        throw new Error(
            "Chat not found."
        );

    }


    database.currentChatId =
        chat.id;


    saveDatabase();


    return chat;

}


// ============================================================
// GENERATE CHAT TITLE
// ============================================================

function generateTitle(
    message
) {

    const clean =
        String(
            message || ""
        )

            .replace(
                /\s+/g,
                " "
            )

            .trim();


    if (!clean) {

        return "New conversation";

    }


    if (
        clean.length <= 40
    ) {

        return clean;

    }


    return (
        clean.slice(
            0,
            40
        ) +
        "..."
    );

}


// ============================================================
// TRIM CHAT MESSAGES
// ============================================================

function trimMessages(
    chat
) {

    if (
        !chat ||
        !Array.isArray(
            chat.messages
        )
    ) {

        return;

    }


    if (
        chat.messages.length >
        MAX_MESSAGES
    ) {

        chat.messages =
            chat.messages.slice(
                -MAX_MESSAGES
            );

    }

}


// ============================================================
// DEVELOPER QUESTION DETECTOR
// ============================================================

function isDeveloperQuestion(
    message
) {

    const text =
        String(
            message || ""
        )

            .toLowerCase()

            .trim();


    return (

        // ----------------------------------------------------
        // WHO DEVELOPED VELINO?
        // ----------------------------------------------------

        /who\s+(developed|created|made|built)\s+(you|velino|velino smart ai)/i
            .test(text)

        ||

        /who\s+is\s+(your\s+)?(developer|creator|maker|builder)/i
            .test(text)

        ||

        /tell\s+me\s+about\s+(your\s+)?(developer|creator|maker|builder)/i
            .test(text)

        ||

        // ----------------------------------------------------
        // SHIVA
        // ----------------------------------------------------

        /who\s+is\s+shiva/i
            .test(text)

        ||

        /tell\s+me\s+about\s+shiva/i
            .test(text)

        ||

        /about\s+shiva/i
            .test(text)

        ||

        // ----------------------------------------------------
        // JOURNEY
        // ----------------------------------------------------

        /shiva.*(journey|background|story|career)/i
            .test(text)

        ||

        /(developer|creator).*(journey|background|story)/i
            .test(text)

        ||

        // ----------------------------------------------------
        // PROJECTS
        // ----------------------------------------------------

        /shiva.*(projects|innovations|inventions|work)/i
            .test(text)

        ||

        /what\s+(has|did)\s+shiva.*(built|created|developed|made)/i
            .test(text)

        ||

        // ----------------------------------------------------
        // VELINO CREATOR
        // ----------------------------------------------------

        /who\s+(created|developed|built|founded)\s+velino/i
            .test(text)

        ||

        /who\s+is\s+behind\s+(velino|you)/i
            .test(text)

        ||

        // ----------------------------------------------------
        // WHY VELINO
        // ----------------------------------------------------

        /why\s+(did|was)\s+(shiva|velino).*(create|created|build|built|develop|developed)/i
            .test(text)

        ||

        /why\s+velino/i
            .test(text)

        ||

        // ----------------------------------------------------
        // VELINO FULL FORM
        // ----------------------------------------------------

        /what\s+does\s+velino\s+stand\s+for/i
            .test(text)

        ||

        /velino\s+(full\s*form|meaning|stands\s+for)/i
            .test(text)

        ||

        /full\s*form\s+of\s+velino/i
            .test(text)

        ||

        // ----------------------------------------------------
        // DEVELOPER PROFILE
        // ----------------------------------------------------

        /developer\s+(profile|information|details|journey)/i
            .test(text)

        ||

        /about\s+(the\s+)?developer/i
            .test(text)

    );

}


// ============================================================
// GET DEVELOPER RESPONSE
// ============================================================

function getDeveloperResponse(
    message
) {

    const text =
        String(
            message || ""
        )

            .toLowerCase()

            .trim();


    // ========================================================
    // VELINO FULL FORM
    // ========================================================

    if (

        text.includes(
            "what does velino stand for"
        )

        ||

        text.includes(
            "full form of velino"
        )

        ||

        text.includes(
            "velino full form"
        )

        ||

        text.includes(
            "velino meaning"
        )

        ||

        text.includes(
            "velino stands for"
        )

    ) {

        return `

**VELINO** stands for:

# Versatile Embedded Platform for Learning, Innovation, and Open-Source Networking

VELINO is an engineering ecosystem created by **Shiva Velishoju**.

It represents a platform focused on:

• Embedded systems  
• Learning  
• Innovation  
• Electronics  
• Software development  
• Open-source technology  
• Artificial Intelligence  
• Practical engineering projects  

The VELINO vision is to bring **hardware + software + AI** together.

**Build. Program. Innovate.**

        `.trim();

    }


    // ========================================================
    // DIRECT DEVELOPER IDENTITY
    // ========================================================

    if (

        text.includes(
            "who developed"
        )

        ||

        text.includes(
            "who created"
        )

        ||

        text.includes(
            "who made"
        )

        ||

        text.includes(
            "who built"
        )

        ||

        text.includes(
            "your developer"
        )

        ||

        text.includes(
            "your creator"
        )

    ) {

        return `

I was developed by **${DEVELOPER_PROFILE.name}**.

${DEVELOPER_PROFILE.name} is an **${DEVELOPER_PROFILE.title}** and the creator behind the **VELINO ecosystem**.

I am **${DEVELOPER_PROFILE.aiProduct}**, an engineering-focused local AI assistant designed to help with:

• Programming  
• Embedded systems  
• Electronics  
• Arduino  
• ESP32  
• ESP32-C3  
• IoT  
• Robotics  
• Debugging  
• VELINO projects  

VELINO stands for:

**${DEVELOPER_PROFILE.velinoFullForm}**

The goal behind VELINO is to bring **hardware, software and AI** together into practical engineering tools.

        `.trim();

    }


    // ========================================================
    // WHO IS SHIVA?
    // ========================================================

    if (

        text.includes(
            "who is shiva"
        )

        ||

        text.includes(
            "about shiva"
        )

        ||

        text.includes(
            "tell me about shiva"
        )

        ||

        text.includes(
            "developer profile"
        )

        ||

        text.includes(
            "developer information"
        )

        ||

        text.includes(
            "developer details"
        )

    ) {

        return `

# Shiva Velishoju

**Shiva Velishoju** is an Electronics and Communication Engineering graduate and an **Embedded Systems & Software Developer**.

He is the developer and creator behind:

• **VELINO ecosystem**  
• **VELINO IDE**  
• **VELINO Smart AI**  
• Multiple embedded systems and robotics projects  

His work combines:

• Embedded Systems  
• Electronics  
• Arduino  
• ESP32  
• ESP32-C3  
• BLE and Bluetooth HID  
• IoT  
• Robotics  
• PCB Development  
• Sensors  
• OLED Displays  
• Java  
• JavaScript  
• HTML and CSS  
• Node.js  
• Electron  
• Artificial Intelligence  

His approach focuses on solving practical engineering problems by combining **hardware + software + AI**.

        `.trim();

    }


    // ========================================================
    // JOURNEY
    // ========================================================

    if (

        text.includes(
            "journey"
        )

        ||

        text.includes(
            "background"
        )

        ||

        text.includes(
            "career"
        )

        ||

        (
            text.includes(
                "story"
            )

            &&

            text.includes(
                "shiva"
            )

        )

    ) {

        return `

# Shiva Velishoju's Journey

${DEVELOPER_PROFILE.journey}

        `.trim();

    }


    // ========================================================
    // PROJECTS / INNOVATIONS
    // ========================================================

    if (

        text.includes(
            "innovation"
        )

        ||

        text.includes(
            "innovations"
        )

        ||

        text.includes(
            "projects"
        )

        ||

        text.includes(
            "inventions"
        )

        ||

        (
            text.includes(
                "shiva"
            )

            &&

            (
                text.includes(
                    "built"
                )

                ||

                text.includes(
                    "created"
                )

                ||

                text.includes(
                    "developed"
                )

            )

        )

    ) {

        const projectList =
            DEVELOPER_PROFILE.innovations

                .map(
                    item =>
                        `• **${item.name}** — ${item.description}`
                )

                .join(
                    "\n\n"
                );


        return `

# Shiva Velishoju's Projects & Innovations

${DEVELOPER_PROFILE.name} has worked across embedded systems, electronics, software, IoT, robotics, PCB development and AI.

Some major projects include:

${projectList}

These projects represent the VELINO approach of combining practical hardware, software and intelligent tools.

        `.trim();

    }


    // ========================================================
    // WHY VELINO
    // ========================================================

    if (

        text.includes(
            "why velino"
        )

        ||

        (
            text.includes(
                "why"
            )

            &&

            text.includes(
                "velino"
            )

        )

    ) {

        return `

# Why was VELINO created?

The VELINO ecosystem grew from practical embedded-development problems.

When working with Arduino and embedded boards, developers often need to handle:

• Board identification  
• Serial-port selection  
• Tool configuration  
• Code compilation  
• Firmware uploading  
• Serial monitoring  
• Debugging  

The idea behind VELINO is to simplify this workflow and make engineering development more practical and connected.

**VELINO IDE** focuses on embedded development.

**VELINO Smart AI** adds an engineering-focused local AI assistant.

**VELINO hardware projects** explore Arduino, ESP32, ESP32-C3, BLE, sensors, robotics and custom electronics.

VELINO stands for:

**Versatile Embedded Platform for Learning, Innovation, and Open-Source Networking**

The larger vision is to create an ecosystem where:

**Hardware + Software + AI**

work together.

**Build. Program. Innovate.**

        `.trim();

    }


    // ========================================================
    // TECHNOLOGIES
    // ========================================================

    if (

        text.includes(
            "technology"
        )

        ||

        text.includes(
            "technologies"
        )

        ||

        text.includes(
            "tech stack"
        )

    ) {

        return `

# Technologies

${DEVELOPER_PROFILE.name} works across multiple engineering and software technologies:

${DEVELOPER_PROFILE.technologies
    .map(
        item =>
            `• ${item}`
    )
    .join("\n")}

        `.trim();

    }


    // ========================================================
    // VELINO STORY
    // ========================================================

    if (

        text.includes(
            "velino story"
        )

        ||

        text.includes(
            "story of velino"
        )

        ||

        text.includes(
            "history of velino"
        )

    ) {

        return `

# The VELINO Story

${DEVELOPER_PROFILE.story}

        `.trim();

    }


    // ========================================================
    // DEFAULT DEVELOPER RESPONSE
    // ========================================================

    return `

**${DEVELOPER_PROFILE.name}** is the developer behind **VELINO Smart AI** and the **VELINO ecosystem**.

He is an **Embedded Systems & Software Developer** whose work focuses on embedded systems, electronics, Arduino, ESP32, ESP32-C3, IoT, robotics, PCB development, software development and AI.

VELINO stands for:

**Versatile Embedded Platform for Learning, Innovation, and Open-Source Networking**

The VELINO vision is to combine:

**Hardware + Software + AI**

into practical engineering tools.

**Build. Program. Innovate.**

    `.trim();

}


// ============================================================
// SYSTEM PROMPT
// ============================================================

const SYSTEM_PROMPT = `

You are VELINO Smart AI Agent v4.

You are an engineering-focused local AI assistant developed by
Shiva Velishoju for the VELINO ecosystem.

============================================================
DEVELOPER IDENTITY
============================================================

Your developer is:

Shiva Velishoju

Role:

Embedded Systems & Software Developer

Education:

B.Tech in Electronics and Communication Engineering

Ecosystem:

VELINO

AI Product:

VELINO Smart AI

============================================================
VELINO FULL FORM
============================================================

VELINO stands for:

Versatile Embedded Platform for Learning, Innovation, and Open-Source Networking.

If the user asks:

- What does VELINO stand for?
- What is the full form of VELINO?
- What is VELINO's meaning?
- Explain VELINO.

You must use the exact expansion:

Versatile Embedded Platform for Learning, Innovation, and Open-Source Networking.

============================================================
IMPORTANT DEVELOPER INFORMATION
============================================================

Shiva Velishoju is the developer and creator behind:

- VELINO ecosystem
- VELINO IDE
- VELINO Smart AI
- VELINO hardware projects

His work combines:

- Embedded systems
- Electronics
- Arduino
- ESP32
- ESP32-C3
- BLE
- Bluetooth HID
- IoT
- Robotics
- PCB development
- Sensors
- OLED displays
- Java
- JavaScript
- HTML
- CSS
- Node.js
- Electron
- Artificial Intelligence

If the user asks:

- Who developed you?
- Who created you?
- Who made you?
- Who built you?
- Who is your developer?
- Who is your creator?
- Who is behind VELINO?
- Who is Shiva Velishoju?
- Tell me about Shiva.
- Tell me about your developer.
- What has Shiva built?
- What are Shiva's innovations?
- What is Shiva's journey?
- Why did Shiva create VELINO?

Use the developer information supplied in this system.

Never say that you do not know who developed VELINO Smart AI.

Never replace Shiva Velishoju with another person's name.

Do not invent additional personal information.

============================================================
ABOUT VELINO
============================================================

VELINO is an engineering ecosystem focused on combining:

HARDWARE

+

SOFTWARE

+

ARTIFICIAL INTELLIGENCE

The goal is to make engineering development more practical,
connected, intelligent and accessible.

The VELINO philosophy is:

Build. Program. Innovate.

============================================================
YOUR ROLE
============================================================

You are not only a chatbot.

You are an AI engineering assistant.

Your responsibilities are:

1. Understand the user's request.
2. Use conversation context.
3. Use long-term memory when relevant.
4. Use project tools when necessary.
5. Analyze available information.
6. Provide clear and practical answers.
7. Help with engineering, programming and debugging.

============================================================
MAIN AREAS
============================================================

- Programming
- JavaScript
- HTML
- CSS
- Node.js
- Electron
- Arduino
- Arduino CLI
- ESP32
- ESP32-C3
- Embedded systems
- Electronics
- IoT
- Robotics
- PCB development
- Sensors
- BLE
- Bluetooth HID
- VELINO IDE
- VELINO Smart AI
- VELINO hardware projects

============================================================
AGENT PRINCIPLES
============================================================

- Do not invent information.
- Do not pretend a tool was used when it was not.
- Do not claim an action was completed unless it actually was.
- Prefer practical solutions.
- Keep answers clear.
- For coding questions, provide working code when appropriate.
- For debugging, identify the likely cause and explain the fix.
- Use project information when available.
- Respect the user's existing architecture.
- Do not unnecessarily redesign working components.
- Use long-term memory when relevant.
- Maintain conversation context.
- If information is not known, clearly say so.

============================================================
AVAILABLE TOOLS
============================================================

${getToolDescriptions()}

============================================================
TOOL POLICY
============================================================

Tools are available for project inspection and utilities.

Never invent tool results.

When a tool result is supplied, use it as factual project evidence.

`;


// ============================================================
// DETERMINE INTENT
// ============================================================

function determineIntent(
    message
) {

    const text =
        String(
            message || ""
        ).toLowerCase();


    if (
        isDeveloperQuestion(
            text
        )
    ) {

        return "developer_profile";

    }


    if (

        /read|open|show|contents? of|what is inside/i
            .test(text)

        &&

        /\.(js|html|css|json|ino|cpp|h|hpp|py|md|txt)\b/i
            .test(text)

    ) {

        return "read_file";

    }


    if (

        /search.*project|find.*in.*project|where.*defined|find.*code/i
            .test(text)

    ) {

        return "search_project";

    }


    if (

        /list.*files|show.*files|project files|what files/i
            .test(text)

    ) {

        return "list_files";

    }


    if (

        /project info|system info|environment|electron version|node version/i
            .test(text)

    ) {

        return "project_info";

    }


    if (

        /calculate|what is \d|compute/i
            .test(text)

    ) {

        return "calculate";

    }


    return "chat";

}


// ============================================================
// EXTRACT FILE PATH
// ============================================================

function extractFilePath(
    message
) {

    const match =
        message.match(

            /(?:read|open|show|contents?\s+of)\s+[`"']?([A-Za-z0-9_./() -]+\.(?:js|html|css|json|ino|cpp|h|hpp|py|md|txt))[`"']?/i

        );


    return match
        ? match[1].trim()
        : null;

}


// ============================================================
// EXTRACT SEARCH QUERY
// ============================================================

function extractSearchQuery(
    message
) {

    const match =
        message.match(
            /(?:search|find)(?:\s+for)?\s+["'`](.*?)["'`]/i
        );


    if (match) {

        return match[1].trim();

    }


    return message

        .replace(
            /search|find|in project|project|code/gi,
            ""
        )

        .trim();

}


// ============================================================
// EXTRACT CALCULATION
// ============================================================

function extractCalculation(
    message
) {

    const match =
        message.match(
            /(?:calculate|compute|what is)\s+([0-9+\-*/().%\s]+)/i
        );


    return match
        ? match[1].trim()
        : null;

}


// ============================================================
// RUN SPECIALIZED TOOL
// ============================================================

async function runIntentTool(
    intent,
    message
) {

    switch (intent) {


        case "read_file": {

            const filePath =
                extractFilePath(
                    message
                );


            if (!filePath) {

                return {

                    used:
                        false,

                    result:
                        "I could not determine which file you want me to read."

                };

            }


            const result =
                await runTool(

                    "read_project_file",

                    {
                        path:
                            filePath
                    }

                );


            return {

                used:
                    true,

                tool:
                    "read_project_file",

                result

            };

        }


        case "search_project": {

            const query =
                extractSearchQuery(
                    message
                );


            const result =
                await runTool(

                    "search_project",

                    {
                        query
                    }

                );


            return {

                used:
                    true,

                tool:
                    "search_project",

                result

            };

        }


        case "list_files": {

            const result =
                await runTool(
                    "list_project_files"
                );


            return {

                used:
                    true,

                tool:
                    "list_project_files",

                result

            };

        }


        case "project_info": {

            const result =
                await runTool(
                    "project_info"
                );


            return {

                used:
                    true,

                tool:
                    "project_info",

                result

            };

        }


        case "calculate": {

            const expression =
                extractCalculation(
                    message
                );


            if (!expression) {

                return {

                    used:
                        false,

                    result:
                        "I could not determine the calculation."

                };

            }


            const result =
                await runTool(

                    "calculate",

                    {
                        expression
                    }

                );


            return {

                used:
                    true,

                tool:
                    "calculate",

                result

            };

        }


        case "developer_profile":

            return {

                used:
                    false,

                result:
                    null

            };


        default:

            return {

                used:
                    false,

                result:
                    null

            };

    }

}


// ============================================================
// ASK OLLAMA
// ============================================================

async function askOllama(
    messages
) {

    const response =
        await fetch(

            OLLAMA_URL,

            {

                method:
                    "POST",

                headers: {

                    "Content-Type":
                        "application/json"

                },

                body:
                    JSON.stringify({

                        model:
                            MODEL,

                        messages,

                        stream:
                            false

                    })

            }

        );


    if (!response.ok) {

        throw new Error(

            `Ollama error: ${response.status} ${response.statusText}`

        );

    }


    const data =
        await response.json();


    if (

        !data ||

        !data.message ||

        !data.message.content

    ) {

        throw new Error(
            "VELINO received an invalid response from Ollama."
        );

    }


    return data.message.content.trim();

}


// ============================================================
// ASK VELINO
// ============================================================

async function askVelino(
    message
) {

    if (

        !message ||

        !message.trim()

    ) {

        throw new Error(
            "Message cannot be empty."
        );

    }


    const cleanMessage =
        message.trim();


    const chat =
        getCurrentChat();


    if (!chat) {

        throw new Error(
            "No active chat."
        );

    }


    // --------------------------------------------------------
    // SAVE USER MESSAGE
    // --------------------------------------------------------

    chat.messages.push({

        role:
            "user",

        content:
            cleanMessage,

        timestamp:
            new Date()
                .toISOString()

    });


    // --------------------------------------------------------
    // GENERATE CHAT TITLE
    // --------------------------------------------------------

    if (

        chat.title ===
        "New conversation"

    ) {

        chat.title =
            generateTitle(
                cleanMessage
            );

    }


    // --------------------------------------------------------
    // GLOBAL MEMORY EXTRACTION
    // --------------------------------------------------------

    try {

        const extracted =
            memory.extractMemories(
                cleanMessage
            );


        for (
            const item of extracted
        ) {

            memory.addMemory(
                item
            );

        }

    } catch (error) {

        console.error(
            "MEMORY EXTRACTION ERROR:",
            error
        );

    }


    // --------------------------------------------------------
    // DEVELOPER PROFILE RESPONSE
    //
    // This happens BEFORE Ollama so the model cannot forget
    // who developed VELINO or what VELINO stands for.
    // --------------------------------------------------------

    if (

        isDeveloperQuestion(
            cleanMessage
        )

    ) {

        const answer =
            getDeveloperResponse(
                cleanMessage
            );


        chat.messages.push({

            role:
                "assistant",

            content:
                answer,

            timestamp:
                new Date()
                    .toISOString(),

            agent: {

                intent:
                    "developer_profile",

                toolUsed:
                    false

            }

        });


        chat.updatedAt =
            new Date()
                .toISOString();


        trimMessages(
            chat
        );


        saveDatabase();


        console.log(
            "[VELINO AGENT] Developer profile response."
        );


        return answer;

    }


    // --------------------------------------------------------
    // RETRIEVE LONG-TERM MEMORY
    // --------------------------------------------------------

    let memoryContext =
        "";


    try {

        memoryContext =
            memory.buildMemoryContext(
                cleanMessage
            );

    } catch (error) {

        console.error(
            "MEMORY RETRIEVAL ERROR:",
            error
        );

    }


    // --------------------------------------------------------
    // DETERMINE INTENT
    // --------------------------------------------------------

    const intent =
        determineIntent(
            cleanMessage
        );


    console.log(

        "[VELINO AGENT]",

        "Intent:",

        intent

    );


    // --------------------------------------------------------
    // TOOL EXECUTION
    // --------------------------------------------------------

    let toolContext =
        "";

    let toolUsed =
        false;


    try {

        const toolResult =
            await runIntentTool(

                intent,

                cleanMessage

            );


        if (
            toolResult.used
        ) {

            toolUsed =
                true;


            toolContext = `

AGENT TOOL RESULT

Tool:
${toolResult.tool}

Result:
${JSON.stringify(
    toolResult.result,
    null,
    2
)}

Use this result as factual project evidence.

`;

        }

    } catch (error) {

        console.error(
            "VELINO TOOL ERROR:",
            error
        );


        toolContext = `

AGENT TOOL ERROR

The requested tool failed.

Error:
${error.message}

Do not pretend the tool succeeded.

`;

    }


    // --------------------------------------------------------
    // MEMORY CONTEXT
    // --------------------------------------------------------

    const memoryBlock =
        memoryContext

            ? `

RELEVANT LONG-TERM MEMORY:

${memoryContext}

Use this information only when relevant.

`

            : "";


    // --------------------------------------------------------
    // CONVERSATION CONTEXT
    // --------------------------------------------------------

    const conversationMessages =
        chat.messages.slice(
            -MAX_MESSAGES
        );


    const messages = [

        {

            role:
                "system",

            content:

                SYSTEM_PROMPT +

                memoryBlock +

                toolContext

        },

        ...conversationMessages

    ];


    // --------------------------------------------------------
    // ASK AI
    // --------------------------------------------------------

    const answer =
        await askOllama(
            messages
        );


    // --------------------------------------------------------
    // SAVE AI RESPONSE
    // --------------------------------------------------------

    chat.messages.push({

        role:
            "assistant",

        content:
            answer,

        timestamp:
            new Date()
                .toISOString(),

        agent: {

            intent,

            toolUsed

        }

    });


    trimMessages(
        chat
    );


    chat.updatedAt =
        new Date()
            .toISOString();


    saveDatabase();


    return answer;

}


// ============================================================
// DELETE CHAT
// ============================================================

function deleteChat(
    chatId
) {

    database.chats =
        database.chats.filter(
            chat =>
                chat.id !==
                chatId
        );


    if (
        database.chats.length ===
        0
    ) {

        createNewChat();

    }

    else if (

        database.currentChatId ===
        chatId

    ) {

        database.currentChatId =
            database.chats[0].id;

    }


    saveDatabase();

}


// ============================================================
// RENAME CHAT
// ============================================================

function renameChat(
    chatId,
    title
) {

    const chat =
        database.chats.find(
            item =>
                item.id ===
                chatId
        );


    if (!chat) {

        throw new Error(
            "Chat not found."
        );

    }


    chat.title =
        String(
            title || ""
        )

            .trim()

            .slice(
                0,
                100
            )

        ||

        "New conversation";


    chat.updatedAt =
        new Date()
            .toISOString();


    saveDatabase();


    return chat;

}


// ============================================================
// PIN / UNPIN CHAT
// ============================================================

function togglePinChat(
    chatId
) {

    const chat =
        database.chats.find(
            item =>
                item.id ===
                chatId
        );


    if (!chat) {

        throw new Error(
            "Chat not found."
        );

    }


    chat.pinned =
        !chat.pinned;


    chat.updatedAt =
        new Date()
            .toISOString();


    saveDatabase();


    return chat;

}


// ============================================================
// ADD CHAT TAG
// ============================================================

function addChatTag(
    chatId,
    tag
) {

    const chat =
        database.chats.find(
            item =>
                item.id ===
                chatId
        );


    if (!chat) {

        throw new Error(
            "Chat not found."
        );

    }


    if (
        !Array.isArray(
            chat.tags
        )
    ) {

        chat.tags =
            [];

    }


    const cleanTag =
        String(
            tag || ""
        )

            .trim()

            .slice(
                0,
                30
            );


    if (

        cleanTag &&

        !chat.tags.includes(
            cleanTag
        )

    ) {

        chat.tags.push(
            cleanTag
        );

    }


    chat.updatedAt =
        new Date()
            .toISOString();


    saveDatabase();


    return chat;

}


// ============================================================
// REMOVE CHAT TAG
// ============================================================

function removeChatTag(
    chatId,
    tag
) {

    const chat =
        database.chats.find(
            item =>
                item.id ===
                chatId
        );


    if (!chat) {

        throw new Error(
            "Chat not found."
        );

    }


    if (
        !Array.isArray(
            chat.tags
        )
    ) {

        chat.tags =
            [];

    }


    chat.tags =
        chat.tags.filter(
            item =>
                item !== tag
        );


    chat.updatedAt =
        new Date()
            .toISOString();


    saveDatabase();


    return chat;

}


// ============================================================
// CLEAR CURRENT CHAT
// ============================================================

function clearCurrentChat() {

    const chat =
        getCurrentChat();


    if (!chat) {

        return null;

    }


    chat.messages =
        [];


    chat.title =
        "New conversation";


    chat.updatedAt =
        new Date()
            .toISOString();


    saveDatabase();


    return chat;

}


// ============================================================
// GET CURRENT CONVERSATION
// ============================================================

function getCurrentConversation() {

    const chat =
        getCurrentChat();


    return chat
        ? chat.messages
        : [];

}


// ============================================================
// GET CURRENT CHAT ID
// ============================================================

function getCurrentChatId() {

    return database.currentChatId;

}


// ============================================================
// EXPORT
// ============================================================

module.exports = {

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

};