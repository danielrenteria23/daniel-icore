import { Claim, InsuranceType, ClaimStatus, PMSSyncStatus } from "@/types";

const firstNames = [
  "James",
  "Mary",
  "John",
  "Patricia",
  "Robert",
  "Jennifer",
  "Michael",
  "Linda",
  "William",
  "Elizabeth",
  "David",
  "Barbara",
  "Richard",
  "Susan",
  "Joseph",
  "Jessica",
  "Thomas",
  "Sarah",
  "Charles",
  "Karen",
  "Christopher",
  "Nancy",
  "Daniel",
  "Lisa",
  "Matthew",
  "Betty",
  "Anthony",
  "Margaret",
  "Mark",
  "Sandra",
];

const lastNames = [
  "Smith",
  "Johnson",
  "Williams",
  "Brown",
  "Jones",
  "Garcia",
  "Miller",
  "Davis",
  "Rodriguez",
  "Martinez",
  "Hernandez",
  "Lopez",
  "Gonzalez",
  "Wilson",
  "Anderson",
  "Thomas",
  "Taylor",
  "Moore",
  "Jackson",
  "Martin",
  "Lee",
  "Perez",
  "Thompson",
  "White",
  "Harris",
  "Sanchez",
  "Clark",
  "Ramirez",
  "Lewis",
  "Robinson",
];

const insuranceCarriers = [
  "BCBS OF COLORADO",
  "AETNA",
  "UNITED HEALTHCARE",
  "CIGNA",
  "HUMANA",
  "KAISER PERMANENTE",
  "ANTHEM",
  "MEDICARE",
  "MEDICAID",
  "TRICARE",
];

export const STATUS_OPTIONS: ClaimStatus[] = [
  "REJECTED",
  "PENDING",
  "CALL",
  "RESUBMITTED",
];

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function randomElement<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomDate(start: Date, end: Date): Date {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime()),
  );
}

function formatDate(date: Date): string {
  return `${MONTHS[date.getMonth()]} ${date.getDate().toString().padStart(2, "0")}, ${date.getFullYear()}`;
}

function formatDateTime(date: Date): string {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  const hour12 = hours % 12 || 12;
  return `${MONTHS[date.getMonth()]} ${date.getDate().toString().padStart(2, "0")}, ${date.getFullYear()} ${hour12}:${minutes.toString().padStart(2, "0")} ${ampm}`;
}

function generateId(): string {
  return Math.floor(10000 + Math.random() * 90000).toString();
}

function generateProviderId(): string {
  return `ID:${Math.floor(1000000000 + Math.random() * 9000000000)}`;
}

function generateAmount(): number {
  return Math.floor(Math.random() * 100000) / 100 + 100;
}

export function generateClaims(count: number = 250): Claim[] {
  const claims: Claim[] = [];
  const startDate = new Date(2024, 0, 1);
  const endDate = new Date(2025, 11, 31);

  for (let i = 0; i < count; i++) {
    const serviceDate = randomDate(startDate, endDate);
    const lastUpdatedDate = randomDate(serviceDate, new Date(2030, 5, 28));
    const dateSent = randomDate(serviceDate, endDate);

    const insuranceType: InsuranceType =
      Math.random() > 0.3 ? "Primary" : "Secondary";
    const pmsSyncStatus: PMSSyncStatus =
      Math.random() > 0.7 ? "Synced" : "Not Synced";
    const patientFirstName = randomElement(firstNames);
    const patientLastName = randomElement(lastNames);

    claims.push({
      id: generateId(),
      patientFirstName,
      patientLastName,
      patientId: generateId(),
      serviceDate: formatDate(serviceDate),
      insuranceCarrier: randomElement(insuranceCarriers),
      insuranceType,
      amount: generateAmount(),
      status: randomElement(STATUS_OPTIONS),
      lastUpdated: formatDateTime(lastUpdatedDate),
      user: `${randomElement(firstNames).charAt(0)}${randomElement(lastNames).charAt(0)}`,
      dateSent: formatDate(dateSent),
      dateSentOrig: formatDate(dateSent),
      pmsSyncStatus,
      pmsSyncStatusModified: "Status modified today",
      providerFirstName: "Dr. " + randomElement(firstNames),
      providerLastName: randomElement(lastNames),
      providerId: generateProviderId(),
    });
  }

  return claims;
}

export const dummyClaims = generateClaims(250);

export const USER_COLORS: Record<string, string> = {
  A: "bg-red-100 text-red-800",
  B: "bg-blue-100 text-blue-800",
  C: "bg-green-100 text-green-800",
  D: "bg-purple-100 text-purple-800",
  E: "bg-pink-100 text-pink-800",
  F: "bg-indigo-100 text-indigo-800",
  G: "bg-yellow-100 text-yellow-800",
  H: "bg-teal-100 text-teal-800",
  I: "bg-orange-100 text-orange-800",
  J: "bg-cyan-100 text-cyan-800",
  K: "bg-lime-100 text-lime-800",
  L: "bg-emerald-100 text-emerald-800",
  M: "bg-violet-100 text-violet-800",
  N: "bg-fuchsia-100 text-fuchsia-800",
  O: "bg-rose-100 text-rose-800",
  P: "bg-sky-100 text-sky-800",
  Q: "bg-amber-100 text-amber-800",
  R: "bg-slate-100 text-slate-800",
  S: "bg-zinc-100 text-zinc-800",
  T: "bg-stone-100 text-stone-800",
  U: "bg-red-200 text-red-900",
  V: "bg-blue-200 text-blue-900",
  W: "bg-green-200 text-green-900",
  X: "bg-purple-200 text-purple-900",
  Y: "bg-pink-200 text-pink-900",
  Z: "bg-indigo-200 text-indigo-900",
};

export const getUserColor = (initials: string): string => {
  const firstLetter = initials.charAt(0).toUpperCase();
  return USER_COLORS[firstLetter] || "bg-gray-100 text-gray-800";
};
