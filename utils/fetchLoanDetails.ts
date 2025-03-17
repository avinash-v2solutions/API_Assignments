import axios from 'axios';
import fs from 'fs'

// Utility function to fetch loan details via API
export async function fetchLoanDetails(): Promise<any> {
    const response = await axios
    .get('https://971f40e1-2c76-4e12-846b-33eb8cc4e703.mock.pstmn.io/loanDetails');
    return response.data;
}