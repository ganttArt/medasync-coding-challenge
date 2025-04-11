const updatePatientData = (lineContents, patients) => {
    if (!lineContents.isValid) {
        console.warn("Invalid line: ", lineContents);
        return;
    }

    const { type, name, date, treatmentCode } = lineContents;

    if (type === "Patient") {
        patients[name] = { intake: null, treatments: [], discharge: null };
    } else {
        if (!patients.hasOwnProperty(name)) {
            throw new Error(`Action taken before patient admitted: ${JSON.stringify(lineContents)}`);
        }

        const patientRecord = patients[name];

        if (type === "Intake") {
            patientRecord.intake = date;
        } else if (type === "Treatment") {
            patientRecord.treatments.push(treatmentCode);
        } else if (type === "Discharge") {
            patientRecord.discharge = date;
        }
    }
};

module.exports = updatePatientData;
