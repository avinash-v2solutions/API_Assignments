import axios from 'axios';
import fs from 'fs'
import csvParser from 'csv-parser';
import xlsx from 'xlsx';


export function sortBorrowerNames(data: any): string[] {
    // Ensure that the data contains the necessary structure
    if (!data || !data.loan || !Array.isArray(data.loan.applications)) {
      throw new Error('Invalid data structure');
    }
  
    // Extract first names from each application in the 'loan.applications' array
    const borrowerNames = data.loan.applications.map((application: any) => application.borrower.firstName);
  
    // Sort the names alphabetically
    return borrowerNames.sort();
  }
  

// Function to extract and sort borrower names in descending order
export function sortBorrowerNamesDescending(data: any): string[] {
    if (!data || !data.loan || !Array.isArray(data.loan.applications)) {
      throw new Error('Invalid data structure');
    }
  
    const borrowerNames = data.loan.applications.map((application: any) => application.borrower.firstName);
  
    // Sort the names in descending order
    return borrowerNames.sort((a: string, b: string) => b.localeCompare(a, undefined, { sensitivity: 'base' }));
  }


/**
 * Function to read expected borrower names from a CSV file.
 * @param csvFilePath - The path to the CSV file.
 * @returns A promise that resolves to an array of borrower names.
 */
export const getExpectedBorrowerNamesCSV= async (csvFilePath: string): Promise<string[]> => {
  const expectedNames: string[] = [];
  
  return new Promise((resolve, reject) => {
    fs.createReadStream(csvFilePath)  // Path is passed as an argument
      .pipe(csvParser())  // Pipe CSV into parser
      .on('data', (row) => {
        // Assuming the CSV has a "Name" column
        if (row.Name) {
          expectedNames.push(row.Name);
        }
      })
      .on('end', () => {
        resolve(expectedNames);
      })
      .on('error', (err) => {
        reject(err);
      });
  });
};

export const getExpectedNamesFromExcel = async (excelFilePath: string, sheetName: string): Promise<string[]> => {
  const expectedNames: string[] = [];

  // Read the Excel file
  const workbook = xlsx.readFile(excelFilePath);

  // Get the sheet by name
  const sheet = workbook.Sheets[sheetName];

  if (sheet) {
    // Convert sheet data to JSON format
    const sheetData = xlsx.utils.sheet_to_json(sheet);
    
    // Assuming the "Name" column is where the borrower/co-borrower names are stored
    sheetData.forEach((row: any) => {
      if (row.Name) {
        expectedNames.push(row.Name);
      }
    });
  }

  return expectedNames;
};



  
  