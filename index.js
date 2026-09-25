const readline = require("readline");
const { askVelino } = require("./agent");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

console.log("");
console.log("====================================");
console.log("             VELINO");
console.log("       SMART AI ASSISTANT");
console.log("              v1.0");
console.log("====================================");
console.log("");
console.log("Type 'exit' to close VELINO.");
console.log("");

function chat() {
    rl.question("You: ", async (message) => {

        if (message.toLowerCase() === "exit") {
            console.log("\nVELINO: Goodbye! 👋");
            rl.close();
            return;
        }

        if (!message.trim()) {
            chat();
            return;
        }

        try {
            console.log("\nVELINO: Thinking... 🤖\n");

            const response = await askVelino(message);

            console.log(`VELINO: ${response}\n`);

        } catch (error) {
            console.error("\nVELINO ERROR:");
            console.error(error.message);
            console.log("");
        }

        chat();
    });
}

chat();