import fs from 'fs'

// Function to read the expected sorted array from a JSON file
export function getExpectedArray(): string[] {
    const expectedArray = JSON.parse(fs.readFileSync('./test-data/expectedBorrowersFirstName.json', 'utf-8'));
    return expectedArray;
  }

  export function getExpectedArrayDSC(): string[] {
    const expectedArray = JSON.parse(fs.readFileSync('./test-data/expectedBorrowersFirstNameDSC.json', 'utf-8'));
    return expectedArray;
  }