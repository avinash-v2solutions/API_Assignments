import { test, expect} from "@playwright/test"
import { json } from "stream/consumers"
import {log} from "console"
import fs from 'fs'
import fetch from 'node-fetch';
import csvParser from 'csv-parser';
import xlsx from 'xlsx';
import path from 'path'
import { convertDate} from "../utils/dateUtils"
import { calculateTitleFees } from '../helper/calculateFee'
import { getExpectedBorrowerNamesCSV,getExpectedNamesFromExcel,sortBorrowerNames , sortBorrowerNamesDescending } from '../helper/jsonHeplerUtility'
import { fetchLoanDetails } from "../utils/fetchLoanDetails"
import { getExpectedArray, getExpectedArrayDSC } from"../utils/expectedArray"
    

// Function to load the mock JSON response from the file
const testDataPath = "test-data/result.json";
const testData = JSON.parse(fs.readFileSync(testDataPath, "utf8"));

test("TC_001_Verify Loan Details API Response", async({request})=>{

    //get the loan details using get() method
    const getResponse= await request
    .get('https://971f40e1-2c76-4e12-846b-33eb8cc4e703.mock.pstmn.io/loanDetails')

    // extract the json data and store in a variable
    const getResponseBody = getResponse.json()

    //print the data
    console.log(await getResponseBody)

    //assert the status code of the response
    expect(getResponse.status()).toBe(200)

    //print the response status code
    console.log(getResponse.status())

})

test("Verify All Borrower's Names", async({request})=>{

   const getResponse= await request
   .get('https://971f40e1-2c76-4e12-846b-33eb8cc4e703.mock.pstmn.io/loanDetails')

  // get the json data
   var getResponseBody = await getResponse.json()

    // Log the full API response to verify the structure
  console.log('Full API Response:', getResponseBody);

 /// Extract borrower objects (individual properties like borrower_1, borrower_2, etc.)
 const borrowersArray = getResponseBody.loan?.applications;  // Assuming "applications" contains the array of borrower data

  // Log the borrowers array to verify the correct data
  console.log('Borrowers Array:', borrowersArray);

  // Extract the fullNameWithSuffix for each borrower
  const borrowerNames = borrowersArray.map((item: any) => item.borrower?.fullNameWithSuffix);

  // Log the borrower names
  console.log('Borrower Full Names with Suffix:', borrowerNames);


})


test('TC_002_Compare Borrower Names from Loan Details', async () => {
  const response = await
   fetch('https://971f40e1-2c76-4e12-846b-33eb8cc4e703.mock.pstmn.io/loanDetails')
  
  // Ensure the response is OK
  expect(response.status).toBe(200);

  const getResponseBody = await response.json()

  // Log the full API response to verify the structure
console.log('Full API Response:', getResponseBody);

/// Extract borrower objects (individual properties like borrower_1, borrower_2, etc.)
const borrowersArray = getResponseBody.loan?.applications;  // Assuming "applications" contains the array of borrower data

// Log the borrowers array to verify the correct data
console.log('Borrowers Array:', borrowersArray);

// Extract the fullNameWithSuffix for each borrower
const borrowerNames = borrowersArray.map((item: any) => item.borrower?.fullNameWithSuffix);

// Log the borrower names
console.log('Borrower Full Names with Suffix:', borrowerNames);

  // Get the expected borrower names from the CSV file
  const expectedBorrowerNames = await getExpectedBorrowerNamesCSV('./test-data/expected_borrowerNames.csv');

  // Compare the extracted borrower names with expected names
  expect(borrowerNames).toEqual(expectedBorrowerNames);

  console.log(borrowerNames + ' = ' +expectedBorrowerNames )
});

// Function to read expected names from an Excel file with specific sheet

test('TC_003 Compare Co-Borrower Names from Loan Details', async () => {
  // Fetch the loan details from the API
  const response = await fetch('https://971f40e1-2c76-4e12-846b-33eb8cc4e703.mock.pstmn.io/loanDetails'); 

  // Ensure the response is OK
  expect(response.status).toBe(200);

  const data = await response.json(); // Assuming the response is JSON

  // Extract borrower names from the API response
  const coBorrowersArray = data.loan?.applications;  // Assuming "applications" contains the array of borrower data

  // Log the borrowers array to verify the correct data
  console.log('coBorrowers Array:', coBorrowersArray);

  // Extract the fullName for each borrower 
  const coBorrowerNames = coBorrowersArray.map((item: any) => item.coBorrower?.fullNameWithSuffix); // Fixed closing parenthesis

  // Get expected co-borrower names from the "co-borrowers" sheet
  const expectedCoBorrowerNames = await getExpectedNamesFromExcel('./test-data/expected_Names.xlsx', 'expected_coBorrowerNames');
  
  // Compare co-borrower names from the API with the expected co-borrower names from the Excel sheet
  expect(coBorrowerNames).toEqual(expectedCoBorrowerNames);

  // Optionally, log co-borrower names
  console.log('Co-Borrower Names:', coBorrowerNames);
});

  
  test('TC_004 Verify dates and Convert UTC Dates to IST (UTC+5:30)', async () => {
  
    // Interface for the expected dates in the JSON file
    interface ExpectedDates {
      milestoneCurrentDateAt: string;
      fundsReleaseDate: string;
      fileStartedDate: string;
    }
  
    // Send GET request to fetch the data
    const response = await fetch("https://971f40e1-2c76-4e12-846b-33eb8cc4e703.mock.pstmn.io/loanDetails");
  
    // Parse the JSON response
    const responseBody = await response.json();

    console.log(responseBody)
  
    // Extract the required date fields
    const milestoneCurrentDateAtUtc1 = responseBody.loan.milestoneCurrentDateAtUtc;
    const fundsReleaseDate1 = responseBody.loan.fundsReleaseDate;
    const fileStartedDate1 = responseBody.loan.fileStartedDate;
  
    // Log UTC dates to verify they are correct
    console.log('1st time (UTC):', milestoneCurrentDateAtUtc1);
    console.log('2nd time (UTC):', fundsReleaseDate1);
    console.log('3rd time (UTC):', fileStartedDate1);
  
    // Convert the dates from UTC to IST
    const milestoneCurrentDateAtIst = convertDate(milestoneCurrentDateAtUtc1);
    const fundsReleaseDateIst = convertDate(fundsReleaseDate1);
    const fileStartedDateIst = convertDate(fileStartedDate1);
  
    // Log the converted IST dates
    console.log('Converted Dates (IST):');
    console.log('Milestone Current Date (IST):', milestoneCurrentDateAtIst);
    console.log('Funds Release Date (IST):', fundsReleaseDateIst);
    console.log('File Started Date (IST):', fileStartedDateIst);
  
    // Load the expected dates from the JSON file
    const expectedDates: ExpectedDates = JSON.parse(fs.readFileSync('./test-data/expectedDates.json', 'utf8'));
  
    // Compare the converted dates with the expected dates
    if (
      expectedDates.milestoneCurrentDateAt === milestoneCurrentDateAtIst &&
      expectedDates.fundsReleaseDate === fundsReleaseDateIst &&
      expectedDates.fileStartedDate === fileStartedDateIst
    ) {
      console.log('Test Passed!');
    } else {
      console.log('Test Failed!');
      console.log('Expected:', expectedDates);
    }
  });

  // tests/loanDetailsTest.ts


test('TC_005_Loan Details Fee Calculation',  async () => {
        const feeTotal = await calculateTitleFees();
        console.log(`Total Fee: ${feeTotal}`);
        // Add assertions if necessary
    });

    
   
    test('TC_006_Verify Sorting on Borrower Names Fetched from API Response (Ascending Order)', async () => {
      // Fetch loan details from the API using the helper function
      const loanDetails = await fetchLoanDetails();
    
      // Extract and sort borrower names using the helper function
      const sortedBorrowerNames = sortBorrowerNames(loanDetails);
    
      // Get the expected array from the helper function
      const expectedArray = getExpectedArray();

      console.log('Expected Borrower Names (Ascending):', expectedArray);
    
      // Assert that the actual sorted array matches the expected array
      expect(sortedBorrowerNames).toEqual(expectedArray);
    });

    test('TC_007_Verify Sorting on Borrower Names Fetched from API Response (Descending Order)', async () => {
      // Fetch loan details from the API using the helper function
      const loanDetails = await fetchLoanDetails();
      
      // Extract and sort borrower names in descending order using the helper function
      const sortedBorrowerNames = sortBorrowerNamesDescending(loanDetails);
      
      // Get the expected array from the helper function
      const expectedArray = getExpectedArrayDSC();
      
      // Ensure expected array is sorted in descending order
      expectedArray.sort((a: string, b: string) => b.localeCompare(a, undefined, { sensitivity: 'base' }));
      
      console.log('Expected Borrower Names (Descending):', expectedArray);


      // Assert that the actual sorted array matches the expected array
      expect(sortedBorrowerNames).toEqual(expectedArray);

    });
    
    