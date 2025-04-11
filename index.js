const fs = require("fs");
const readline = require("readline");
const processFileStream = require("./src/processFileStream");

const main = async () => {
    const inputFile = process.argv[2];

    if (!inputFile) {
        console.error('No file path provided');
        return;
    }

    if (!fs.existsSync(inputFile)) {
        console.error(`Error: File "${inputFile}" does not exist.`);
        return;
    }

    // Read the file as a stream
    const stream = fs.createReadStream(inputFile);

    stream.on('error', (err) => {
        console.error(`Failed to read file: ${err.message}`);
        process.exit(1);
    });

    // Processing input line by line using the interface abstraction
    const lineReader = readline.createInterface({
        input: stream,
        crlfDelay: Infinity // handles different newline formats safely
    });

    const summary = await processFileStream(lineReader);
    console.log(summary);
    return summary;
}

main();
