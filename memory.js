// ============================================================
// VELINO SMART AI
// GLOBAL MEMORY ENGINE
// ============================================================

const fs = require("fs");
const path = require("path");

let memoryFile = null;

let database = {
    memories: []
};


// ============================================================
// INITIALIZE
// ============================================================

function initializeMemory(filePath) {

    memoryFile = filePath;

    try {

        if (fs.existsSync(memoryFile)) {

            const raw =
                fs.readFileSync(
                    memoryFile,
                    "utf8"
                );

            database =
                JSON.parse(raw);

            if (
                !database ||
                !Array.isArray(database.memories)
            ) {

                database = {
                    memories: []
                };

            }

        } else {

            database = {
                memories: []
            };

            saveMemory();

        }

    } catch (error) {

        console.error(
            "VELINO MEMORY LOAD ERROR:",
            error
        );

        database = {
            memories: []
        };

    }

}


// ============================================================
// SAVE
// ============================================================

function saveMemory() {

    if (!memoryFile) {
        return;
    }

    try {

        fs.mkdirSync(
            path.dirname(memoryFile),
            {
                recursive: true
            }
        );

        fs.writeFileSync(
            memoryFile,
            JSON.stringify(
                database,
                null,
                2
            ),
            "utf8"
        );

    } catch (error) {

        console.error(
            "VELINO MEMORY SAVE ERROR:",
            error
        );

    }

}


// ============================================================
// NORMALIZE
// ============================================================

function normalize(text) {

    return String(text || "")
        .toLowerCase()
        .trim();

}


// ============================================================
// ADD MEMORY
// ============================================================

function addMemory({
    category = "general",
    key = "",
    value = "",
    source = "conversation"
}) {

    if (!key || !value) {
        return null;
    }

    const normalizedKey =
        normalize(key);

    const normalizedValue =
        normalize(value);

    const existing =
        database.memories.find(
            memory =>
                normalize(memory.key) ===
                    normalizedKey
                &&
                normalize(memory.value) ===
                    normalizedValue
        );

    if (existing) {

        existing.updatedAt =
            new Date().toISOString();

        saveMemory();

        return existing;

    }


    const memory = {

        id:
            `memory-${Date.now()}-${Math.random()
                .toString(36)
                .slice(2, 8)}`,

        category,

        key,

        value,

        source,

        createdAt:
            new Date().toISOString(),

        updatedAt:
            new Date().toISOString()

    };


    database.memories.unshift(
        memory
    );


    // Keep database manageable
    if (
        database.memories.length >
        500
    ) {

        database.memories =
            database.memories.slice(
                0,
                500
            );

    }


    saveMemory();

    return memory;

}


// ============================================================
// GET ALL
// ============================================================

function getMemories() {

    return [
        ...database.memories
    ];

}


// ============================================================
// SEARCH
// ============================================================

function searchMemory(query) {

    const words =
        normalize(query)
            .split(/\s+/)
            .filter(
                word =>
                    word.length > 2
            );


    if (!words.length) {
        return [];
    }


    const results =
        database.memories
            .map(memory => {

                const text =
                    normalize(
                        `${memory.category}
                         ${memory.key}
                         ${memory.value}`
                    );


                let score = 0;


                for (const word of words) {

                    if (
                        text.includes(word)
                    ) {

                        score += 1;

                    }

                }


                return {
                    ...memory,
                    score
                };

            })
            .filter(
                memory =>
                    memory.score > 0
            )
            .sort(
                (a, b) =>
                    b.score - a.score
            )
            .slice(
                0,
                10
            );


    return results;

}


// ============================================================
// BUILD MEMORY CONTEXT
// ============================================================

function buildMemoryContext(query) {

    const memories =
        searchMemory(query);


    if (!memories.length) {

        return "";

    }


    return memories
        .map(
            memory =>
                `- ${memory.key}: ${memory.value}`
        )
        .join("\n");

}


// ============================================================
// EXTRACT MEMORY
// ============================================================

function extractMemories(message) {

    const text =
        String(message || "");

    const memories = [];


    // --------------------------------------------------------
    // ESP32-C3
    // --------------------------------------------------------

    if (
        /ESP32-C3/i.test(text)
    ) {

        memories.push({

            category:
                "hardware",

            key:
                "ESP32-C3",

            value:
                "The user's project uses ESP32-C3."

        });

    }


    // --------------------------------------------------------
    // ESP32
    // --------------------------------------------------------

    if (
        /ESP32/i.test(text)
    ) {

        memories.push({

            category:
                "hardware",

            key:
                "ESP32",

            value:
                "The user works with ESP32 hardware."

        });

    }


    // --------------------------------------------------------
    // MPU6050
    // --------------------------------------------------------

    if (
        /MPU6050/i.test(text)
    ) {

        memories.push({

            category:
                "sensor",

            key:
                "MPU6050",

            value:
                "The user's project uses an MPU6050 sensor."

        });

    }


    // --------------------------------------------------------
    // VELINO AIR MOUSE
    // --------------------------------------------------------

    if (
        /VELINO AIR MOUSE V2/i.test(text)
    ) {

        memories.push({

            category:
                "project",

            key:
                "VELINO Air Mouse V2",

            value:
                "The user is developing the VELINO Air Mouse V2."

        });

    }


    // --------------------------------------------------------
    // VELINO IDE
    // --------------------------------------------------------

    if (
        /VELINO IDE/i.test(text)
    ) {

        memories.push({

            category:
                "project",

            key:
                "VELINO IDE",

            value:
                "The user is developing VELINO IDE."

        });

    }


    // --------------------------------------------------------
    // OLED
    // --------------------------------------------------------

    if (
        /\bOLED\b/i.test(text)
    ) {

        memories.push({

            category:
                "display",

            key:
                "OLED",

            value:
                "The user's projects use OLED displays."

        });

    }


    // --------------------------------------------------------
    // BLE
    // --------------------------------------------------------

    if (
        /\bBLE\b/i.test(text) ||
        /Bluetooth/i.test(text)
    ) {

        memories.push({

            category:
                "wireless",

            key:
                "BLE",

            value:
                "The user works with Bluetooth/BLE projects."

        });

    }


    // --------------------------------------------------------
    // Arduino Uno
    // --------------------------------------------------------

    if (
        /Arduino Uno/i.test(text)
    ) {

        memories.push({

            category:
                "hardware",

            key:
                "Arduino Uno",

            value:
                "The user works with Arduino Uno."

        });

    }


    return memories;

}


// ============================================================
// DELETE MEMORY
// ============================================================

function deleteMemory(id) {

    database.memories =
        database.memories.filter(
            memory =>
                memory.id !== id
        );

    saveMemory();

}


// ============================================================
// CLEAR ALL
// ============================================================

function clearAllMemory() {

    database = {
        memories: []
    };

    saveMemory();

}


// ============================================================
// EXPORT
// ============================================================

module.exports = {

    initializeMemory,

    saveMemory,

    addMemory,

    getMemories,

    searchMemory,

    buildMemoryContext,

    extractMemories,

    deleteMemory,

    clearAllMemory

};