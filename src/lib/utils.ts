export function maskPhoneNumber(phoneNumber: string | null) {
  if (!phoneNumber) return "Private";
  const cleaned = phoneNumber.trim();
  if (cleaned.length <= 3) return cleaned;
  return `${cleaned.slice(0, 3)}${"•".repeat(cleaned.length - 3)}`;
}
