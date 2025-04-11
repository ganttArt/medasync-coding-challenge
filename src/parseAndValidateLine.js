function parseAndValidateLine(line) {
    const lineContents = { type: undefined, isValid: false };
    const lineArray = line.split(' ')

    if (lineArray[0] === 'Patient') {
        if (!lineArray[1]) {
            console.error(`Invalid patient input: ${line}`);
            return lineContents;
        }
        lineContents.type = 'Patient';
        lineContents.name = lineArray[1];
        lineContents.isValid = true;
    }
    else if (lineArray[0] === 'Action') {
        if (!validateAction(lineArray)) {
            return lineContents;
        }
        lineContents.type = lineArray[1];
        lineContents.name = lineArray[2];
        lineContents.date = new Date(lineArray[3]);

        if (lineArray[1] === 'Treatment') {
            lineContents.treatmentCode = lineArray[4];
        }
        lineContents.isValid = true;
    }
    else {
        console.error(`Line is neither a patient or action: ${line}`);
    }
    return lineContents
}

function validateAction(action) {
    if (action.length < 4) {
        return false;
    }

    const actionType = action[1];
    const name = action[2];
    const dateStr = action[3];

    // Check valid action types
    const validActions = ["Intake", "Discharge", "Treatment"];
    if (!validActions.includes(actionType)) return false;

    // Check name is non-empty
    if (!name || name.length === 0) return false;

    // Check date validity using Date object
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return false;

    // Treatment should have a 5th part (treatment code), others shouldn't
    if (actionType === "Treatment" && action.length !== 5) {
        return false;
    }

    return true;
}

module.exports = { parseAndValidateLine, validateAction };
