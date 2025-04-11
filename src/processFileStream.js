const { parseAndValidateLine } = require("./parseAndValidateLine");
const updatePatientData = require("./updatePatientData");
const summarizePatientActions = require("./summarizePatientActions");

const processFileStream = (lineReader) => {
    return new Promise((resolve, reject) => {
        const patients = {};

        lineReader.on("line", (line) => {
            const lineContents = parseAndValidateLine(line);
            try {
                updatePatientData(lineContents, patients);
            } catch (err) {
                console.error("Error processing line:", err.message);
                reject(err);
            }
        });

        lineReader.on("close", () => {
            try {
                const output = summarizePatientActions(patients);
                resolve(output);
            } catch (err) {
                console.error("Error processing input:", err.message);
                reject(err);
            }
        });

        lineReader.on("error", (err) => {
            console.error("Error reading input:", err.message);
            reject(err);
        });
    });
};

module.exports = processFileStream;