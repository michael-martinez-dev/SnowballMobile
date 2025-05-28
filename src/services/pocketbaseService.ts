import PocketBase, { RecordModel } from "pocketbase";
import { DebtRecord } from "../types/database"; // Assuming this path is correct

const debtCollectionName = "debt_records";

/**
 * Maps a Pocketbase RecordModel to a DebtRecord.
 * @param record The Pocketbase RecordModel.
 * @returns The mapped DebtRecord.
 */
export function mapRecordToDebtRecord(record: RecordModel): DebtRecord {
  return {
    id: record.id,
    name: record.name,
    debt_type: record.debt_type,
    total: record.total,
    monthly_min: record.monthly_min,
    monthly_actual: record.monthly_actual,
    interest: record.interest,
    due_day: record.due_day,
    user: record.user,
  };
}

/**
 * Fetches all debt records for the current authenticated user.
 * @param pb The PocketBase instance.
 * @returns A promise that resolves to an array of DebtRecord.
 */
export async function getAllDebtRecords(pb: PocketBase): Promise<DebtRecord[]> {
  const userId = pb.authStore.model?.id;

  if (!userId) {
    console.warn("No authenticated user found. Cannot fetch debt records.");
    return [];
  }

  try {
    const records = await pb
      .collection(debtCollectionName)
      .getFullList<RecordModel>({
        filter: `user = "${userId}"`,
        sort: "-total",
      });
    return records.map(mapRecordToDebtRecord);
  } catch (error) {
    console.error("Error fetching debt records:", error);
    throw error;
  }
}

/**
 * Updates an existing debt record.
 * @param pb The PocketBase instance.
 * @param recordId The ID of the record to update.
 * @param data The partial data to update the record with.
 * @returns A promise that resolves to the updated DebtRecord.
 */
export async function updateDebtRecord(
  pb: PocketBase,
  recordId: string,
  data: Partial<Omit<DebtRecord, "id" | "user">>,
): Promise<DebtRecord> {
  try {
    const updatedRecord = await pb
      .collection(debtCollectionName)
      .update<RecordModel>(recordId, data);
    return mapRecordToDebtRecord(updatedRecord);
  } catch (error) {
    console.error(`Error updating debt record ${recordId}:`, error);
    throw error;
  }
}

/**
 * Creates a new debt record for the current authenticated user.
 * @param pb The PocketBase instance.
 * @param data The data for the new debt record (excluding id).
 * @returns A promise that resolves to the newly created DebtRecord.
 */
export async function createDebtRecord(
  pb: PocketBase,
  data: Omit<DebtRecord, "id" | "user"> & { user?: string }, // Allow user for flexibility, but will be overridden
): Promise<DebtRecord> {
  const userId = pb.authStore.model?.id;

  if (!userId) {
    console.error("User not authenticated. Cannot create debt record.");
    throw new Error("User not authenticated. Cannot create debt record.");
  }

  const recordData = {
    ...data,
    user: userId, // Ensure the record is associated with the current user
  };

  try {
    const newRecord = await pb
      .collection(debtCollectionName)
      .create<RecordModel>(recordData);
    return mapRecordToDebtRecord(newRecord);
  } catch (error) {
    console.error("Error creating debt record:", error);
    throw error;
  }
}

/**
 * Calculates the sum of total debt and total monthly actual payments for the current user.
 * @param pb The PocketBase instance.
 * @returns A promise that resolves to an object containing totalDebt and totalMonthlyActual.
 */
export async function getDebtTotals(
  pb: PocketBase,
): Promise<{ totalDebt: number; totalMonthlyActual: number }> {
  try {
    const records = await getAllDebtRecords(pb); // This already filters by user
    let totalDebt = 0;
    let totalMonthlyActual = 0;

    for (const record of records) {
      totalDebt += Number(record.total) || 0;
      totalMonthlyActual += Number(record.monthly_actual) || 0;
    }

    return { totalDebt, totalMonthlyActual };
  } catch (error) {
    console.error("Error calculating debt totals:", error);
    // If getAllDebtRecords throws and is not caught here, the error will propagate.
    // If it returns an empty array on error, this will return 0s, which might be acceptable.
    // For robustness, re-throw or handle as appropriate.
    throw error;
  }
}
