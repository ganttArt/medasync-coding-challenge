const summarizePatientActions = (patients) => {
    const summaries = [];

    for (const [name, { intake, discharge, treatments }] of Object.entries(patients)) {
        if (!intake || !discharge) {
            console.warn(`Patient ${name} does not have intake and discharge`)
            continue;
        }

        const durationMs = discharge - intake;
        const totalMinutes = durationMs / (1000 * 60);
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;

        const formattedMinutes = minutes % 1 === 0
            ? Math.floor(minutes)
            : minutes.toFixed(2);

        summaries.push(`Patient ${name} stayed for ${hours} hours and ${formattedMinutes} minutes and received ${treatments.length} treatments`)
    }

    return summaries;
}

module.exports = summarizePatientActions;
