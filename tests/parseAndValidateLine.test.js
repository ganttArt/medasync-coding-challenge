const { parseAndValidateLine, validateAction } = require('../src/parseAndValidateLine')

beforeEach(() => {
    console.error = jest.fn(); // Mock console.error
});

describe('parseAndValidateLine', () => {
    // Test for valid patient input
    it('should return a valid Patient object for valid patient input', () => {
        const line = 'Patient John';
        const result = parseAndValidateLine(line);
        expect(result.type).toBe('Patient');
        expect(result.name).toBe('John');
        expect(result.isValid).toBe(true);
    });

    // Test for invalid patient input (missing name)
    it('should return an invalid Patient object for invalid patient input', () => {
        const line = 'Patient';
        const result = parseAndValidateLine(line);
        expect(result.type).toBeUndefined();
        expect(result.isValid).toBe(false);
    });

    // Test for valid action input (non-treatment action)
    it('should return a valid Action object for valid Action input', () => {
        const line = 'Action Intake user1 2025-04-10';
        const result = parseAndValidateLine(line);
        expect(result.type).toBe('Intake');
        expect(result.name).toBe('user1');
        expect(result.date).toBeInstanceOf(Date);
        expect(result.isValid).toBe(true);
    });

    // Test for valid treatment action input with treatment code
    it('should return a valid Action object for valid Treatment action input', () => {
        const line = 'Action Treatment user1 2025-04-10 T1234';
        const result = parseAndValidateLine(line);
        expect(result.type).toBe('Treatment');
        expect(result.name).toBe('user1');
        expect(result.date).toBeInstanceOf(Date);
        expect(result.treatmentCode).toBe('T1234');
        expect(result.isValid).toBe(true);
    });

    // Test for invalid action input (name is empty)
    it('should return an invalid Action object for invalid Action input (empty name)', () => {
        const line = 'Action Treatment  2025-04-10 T1234';
        const result = parseAndValidateLine(line);
        expect(result.type).toBeUndefined();
        expect(result.isValid).toBe(false);
    });

    // Test for invalid action input (invalid date)
    it('should return an invalid Action object for invalid date format', () => {
        const line = 'Action Intake user1 invalid-date';
        const result = parseAndValidateLine(line);
        expect(result.type).toBeUndefined();
        expect(result.isValid).toBe(false);
    });

    // Test for invalid action input (invalid action type)
    it('should return an invalid Action object for invalid action type', () => {
        const line = 'Action InvalidAction user1 2025-04-10';
        const result = parseAndValidateLine(line);
        expect(result.type).toBeUndefined();
        expect(result.isValid).toBe(false);
    });

    // Test for invalid action input (missing treatment code for Treatment action)
    it('should return an invalid Action object for Treatment action missing treatment code', () => {
        const line = 'Action Treatment user1 2025-04-10';
        const result = parseAndValidateLine(line);
        expect(result.type).toBeUndefined();
        expect(result.isValid).toBe(false);
    });

    // Test for invalid action input (not enough parts)
    it('should return an invalid Action object if there are fewer than 4 parts', () => {
        const line = 'Action Intake';
        const result = parseAndValidateLine(line);
        expect(result.type).toBeUndefined();
        expect(result.isValid).toBe(false);
    });

    // Test for invalid action type (neither Patient nor Action)
    it('should return an invalid object for invalid action type', () => {
        const line = 'InvalidType randomDetails';
        parseAndValidateLine(line);
        expect(console.error).toHaveBeenCalledWith('Line is neither a patient or action: InvalidType randomDetails');
    });

    // Test for logging an error when a patient line is invalid
    it('should log an error for invalid Patient input', () => {
        const line = 'Patient';
        parseAndValidateLine(line);
        expect(console.error).toHaveBeenCalledWith('Invalid patient input: Patient');
    });

    // Test for logging an error when an action line is neither Patient nor Action
    it('should log an error for invalid line type', () => {
        const line = 'InvalidType randomDetails';
        parseAndValidateLine(line);
        expect(console.error).toHaveBeenCalledWith('Line is neither a patient or action: InvalidType randomDetails');
    });
});


describe('validateAction', () => {
    // Test for valid Intake action
    it('should return true for valid Intake action', () => {
        const action = ['Action', 'Intake', 'user1', '2025-04-10'];
        const result = validateAction(action);
        expect(result).toBe(true);
    });

    // Test for valid Discharge action
    it('should return true for valid Discharge action', () => {
        const action = ['Action', 'Discharge', 'user1', '2025-04-10'];
        const result = validateAction(action);
        expect(result).toBe(true);
    });

    // Test for valid Treatment action with treatment code
    it('should return true for valid Treatment action with treatment code', () => {
        const action = ['Action', 'Treatment', 'user1', '2025-04-10', 'T1234'];
        const result = validateAction(action);
        expect(result).toBe(true);
    });

    // Test for invalid action type (not in the valid actions list)
    it('should return false for invalid action type', () => {
        const action = ['Action', 'InvalidAction', 'user1', '2025-04-10'];
        const result = validateAction(action);
        expect(result).toBe(false);
    });

    // Test for missing name in action
    it('should return false for action with missing name', () => {
        const action = ['Action', 'Intake', '', '2025-04-10'];
        const result = validateAction(action);
        expect(result).toBe(false);
    });

    // Test for empty date in action
    it('should return false for action with empty date', () => {
        const action = ['Action', 'Intake', 'user1', ''];
        const result = validateAction(action);
        expect(result).toBe(false);
    });

    // Test for invalid date format in action
    it('should return false for action with invalid date format', () => {
        const action = ['Action', 'Intake', 'user1', 'invalid-date'];
        const result = validateAction(action);
        expect(result).toBe(false);
    });

    // Test for Treatment action missing treatment code
    it('should return false for Treatment action missing treatment code', () => {
        const action = ['Action', 'Treatment', 'user1', '2025-04-10'];
        const result = validateAction(action);
        expect(result).toBe(false);
    });

    // Test for action with fewer than 4 parts
    it('should return false for action with fewer than 4 parts', () => {
        const action = ['Action', 'Intake', 'user1'];
        const result = validateAction(action);
        expect(result).toBe(false);
    });

    // Test for action with more than 5 parts
    it('should return false for action with more than 5 parts', () => {
        const action = ['Action', 'Treatment', 'user1', '2025-04-10', 'T1234', 'extraPart'];
        const result = validateAction(action);
        expect(result).toBe(false);
    });
});