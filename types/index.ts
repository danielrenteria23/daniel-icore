export type InsuranceType = "Primary" | "Secondary";

export type ClaimStatus = "REJECTED" | "PENDING" | "CALL" | "RESUBMITTED";

export type PMSSyncStatus = "Synced" | "Not Synced";

export interface Claim {
  id: string;
  patientFirstName: string;
  patientLastName: string;
  patientId: string;
  serviceDate: string;
  insuranceCarrier: string;
  insuranceType: InsuranceType;
  amount: number;
  status: ClaimStatus;
  lastUpdated: string;
  user: string;
  dateSent: string;
  dateSentOrig: string;
  pmsSyncStatus: PMSSyncStatus;
  pmsSyncStatusModified: string;
  providerFirstName: string;
  providerLastName: string;
  providerId: string;
}

export type SortField =
  | "patientLastName"
  | "status"
  | "serviceDate"
  | "lastUpdated";

export type SortDirection = "asc" | "desc";

export interface SortConfig {
  field: SortField | null;
  direction: SortDirection;
}
