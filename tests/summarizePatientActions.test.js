const summarizePatientActions = require('../src/summarizePatientActions');

// Mocking console.warn to test for warnings
beforeEach(() => {
    console.warn = jest.fn(); // Mock console.warn
});

describe('summarizePatientActions', () => {
    // Test for valid patient data
    it('should return correct summary for a patient with intake, discharge, and treatments', () => {
        const patients = {
            'John': {
                intake: new Date('2025-04-10T08:00:00'),
                discharge: new Date('2025-04-10T12:30:00'),
                treatments: ['Treatment1', 'Treatment2']
            }
        };
        
        const result = summarizePatientActions(patients);
        
        expect(result).toEqual([
            'Patient John stayed for 4 hours and 30 minutes and received 2 treatments'
        ]);
    });

    // Test for a patient with no intake or discharge time
    it('should warn and skip patients missing intake or discharge', () => {
        const patients = {
            'Jane': {
                intake: null,
                discharge: new Date('2025-04-10T12:30:00'),
                treatments: ['Treatment1']
            }
        };

        const result = summarizePatientActions(patients);
        
        expect(console.warn).toHaveBeenCalledWith('Patient Jane does not have intake and discharge');
        expect(result).toEqual([]);
    });

    // Test for a patient with only intake time (no discharge)
    it('should warn and skip patients missing discharge', () => {
        const patients = {
            'Alice': {
                intake: new Date('2025-04-10T08:00:00'),
                discharge: null,
                treatments: ['Treatment1', 'Treatment2']
            }
        };

        const result = summarizePatientActions(patients);

        expect(console.warn).toHaveBeenCalledWith('Patient Alice does not have intake and discharge');
        expect(result).toEqual([]);
    });

    // Test for a patient who stayed for exactly 1 hour
    it('should return correct summary for a patient who stayed for exactly 1 hour', () => {
        const patients = {
            'Bob': {
                intake: new Date('2025-04-10T08:00:00'),
                discharge: new Date('2025-04-10T09:00:00'),
                treatments: ['Treatment1']
            }
        };
        
        const result = summarizePatientActions(patients);
        
        expect(result).toEqual([
            'Patient Bob stayed for 1 hours and 0 minutes and received 1 treatments'
        ]);
    });

    // Test for a patient who stayed for exactly 0 minutes
    it('should return correct summary for a patient who stayed for exactly 0 minutes', () => {
        const patients = {
            'Charlie': {
                intake: new Date('2025-04-10T08:00:00'),
                discharge: new Date('2025-04-10T08:00:00'),
                treatments: ['Treatment1']
            }
        };
        
        const result = summarizePatientActions(patients);
        
        expect(result).toEqual([
            'Patient Charlie stayed for 0 hours and 0 minutes and received 1 treatments'
        ]);
    });

    // Test for a patient who stayed for a long time
    it('should return correct summary for a patient who stayed for several days', () => {
        const patients = {
            'David': {
                intake: new Date('2025-04-01T08:00:00'),
                discharge: new Date('2025-04-05T12:30:00'),
                treatments: ['Treatment1', 'Treatment2', 'Treatment3']
            }
        };

        const result = summarizePatientActions(patients);

        expect(result).toEqual([
            'Patient David stayed for 100 hours and 30 minutes and received 3 treatments'
        ]);
    });

    // Test for a patient with no treatments
    it('should return correct summary for a patient with no treatments', () => {
        const patients = {
            'Emily': {
                intake: new Date('2025-04-10T08:00:00'),
                discharge: new Date('2025-04-10T10:00:00'),
                treatments: []
            }
        };

        const result = summarizePatientActions(patients);

        expect(result).toEqual([
            'Patient Emily stayed for 2 hours and 0 minutes and received 0 treatments'
        ]);
    });

    // Test for multiple patients
    it('should handle multiple patients and generate correct summaries', () => {
        const patients = {
            'Frank': {
                intake: new Date('2025-04-10T08:00:00'),
                discharge: new Date('2025-04-10T10:30:00'),
                treatments: ['Treatment1']
            },
            'Grace': {
                intake: new Date('2025-04-10T09:00:00'),
                discharge: new Date('2025-04-10T12:00:00'),
                treatments: ['Treatment1', 'Treatment2']
            }
        };

        const result = summarizePatientActions(patients);

        expect(result).toEqual([
            'Patient Frank stayed for 2 hours and 30 minutes and received 1 treatments',
            'Patient Grace stayed for 3 hours and 0 minutes and received 2 treatments'
        ]);
    });

    // Test for a patient with warning for missing intake and discharge
    it('should warn and skip patients with missing intake or discharge times', () => {
        const patients = {
            'Helen': {
                intake: null,
                discharge: null,
                treatments: ['Treatment1', 'Treatment2']
            }
        };

        const result = summarizePatientActions(patients);

        expect(console.warn).toHaveBeenCalledWith('Patient Helen does not have intake and discharge');
        expect(result).toEqual([]);
    });
});
