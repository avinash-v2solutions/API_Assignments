// utils/calculateFees.ts
import { fetchLoanDetails } from "../utils/fetchLoanDetails";

// Function to calculate Title Fee (sum of borrowerAmount)
export async function calculateTitleFees(): Promise<number> {
    // Fetch the loan details
    const loanDetails = await fetchLoanDetails();

    // Filter the fee object based on the required feeTypes
    const filteredFees = loanDetails.loan.fees.filter((fee: any) => 
        ["UserDefined_1111", "UserDefined_1112", "UserDefined_1113"].includes(fee.feeType)
    );

    // Sum up the borrowerAmount values for the filtered fees
    const titleFee = filteredFees.reduce((sum: number, fee: any) => sum + fee.borrowerPaidAmount, 0);

    return titleFee;
}