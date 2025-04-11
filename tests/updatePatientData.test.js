const updatePatientData = require('../src/updatePatientData');

describe('updatePatientData', () => {
    let patients;
    const testPatient = 'John'

    beforeEach(() => {
        patients = {
            [testPatient]: { intake: null, treatments: [], discharge: null }
        };
        jest.spyOn(console, 'warn').mockImplementation(() => { }); // Mock console.warn
    });

    afterEach(() => {
        jest.restoreAllMocks(); // Restore the original console.warn
    });

    it('should create a new patient when type is "Patient"', () => {
        const lineContents = {
            isValid: true,
            type: 'Patient',
            name: 'Sue',
        };

        updatePatientData(lineContents, patients);

        expect(patients['Sue']).toEqual({
            intake: null,
            treatments: [],
            discharge: null
        });
    });

    it('should update intake date when type is "Intake"', () => {
        const intakeLine = {
            isValid: true,
            type: 'Intake',
            name: testPatient,
            date: '2025-04-12'
        };

        updatePatientData(intakeLine, patients);

        expect(patients[testPatient].intake).toBe('2025-04-12');
    });

    it('should add a treatment when type is "Treatment"', () => {
        const treatmentLine = {
            isValid: true,
            type: 'Treatment',
            name: testPatient,
            date: '2025-04-12',
            treatmentCode: 'T123'
        };

        updatePatientData(treatmentLine, patients);

        expect(patients[testPatient].treatments).toContain('T123');
    });

    it('should update discharge date when type is "Discharge"', () => {
        const dischargeLine = {
            isValid: true,
            type: 'Discharge',
            name: testPatient,
            date: '2025-04-13'
        };

        updatePatientData(dischargeLine, patients);

        expect(patients[testPatient].discharge).toBe('2025-04-13');
    });

    it('should throw an error if action is taken before patient admitted', () => {
        const treatmentLine = {
            isValid: true,
            type: 'Treatment',
            name: 'Sue',
            date: '2025-04-12',
            treatmentCode: 'T123'
        };

        expect(() => updatePatientData(treatmentLine, patients)).toThrowError('Action taken before patient admitted: {"isValid":true,"type":"Treatment","name":"Sue","date":"2025-04-12","treatmentCode":"T123"}');
    });

    it('should not update anything if isValid is false', () => {
        const lineContents = {
            isValid: false,
            type: 'Patient',
            name: testPatient,
        };

        updatePatientData(lineContents, patients);

        expect(patients[testPatient]).toEqual({
            intake: null,
            treatments: [],
            discharge: null
        });
    });

    it('should log a warning if lineContents is invalid', () => {
        const lineContents = {
            isValid: false,
            type: 'Patient',
            name: testPatient,
            date: '2025-04-11'
        };

        updatePatientData(lineContents, patients);

        expect(console.warn).toHaveBeenCalledWith('Invalid line: ', lineContents);
    });
});
