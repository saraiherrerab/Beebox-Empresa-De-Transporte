import { API_URL } from "@/config/api";

export interface SavedAddress {
  id: string;
  label: string;
  address: string;
  city: string;
  contactName?: string | null;
  contactPhone?: string | null;
}

export type SavedAddressInput = Omit<SavedAddress, "id">;

export interface SavedRecipient {
  id: string;
  name: string;
  phone: string;
  phone2?: string | null;
  address: string;
  city: string;
}

export type SavedRecipientInput = Omit<SavedRecipient, "id">;

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = typeof window !== "undefined" ? localStorage.getItem("beebox_token") : null;
  if (!token) throw new Error("Debes iniciar sesión para usar tu libreta.");

  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || `Error ${res.status} al contactar el servidor.`);
  return data as T;
}

export async function fetchSavedAddresses() {
  return (await request<{ addresses: SavedAddress[] }>("/addresses")).addresses;
}

export async function createSavedAddress(input: SavedAddressInput) {
  const data = await request<{ savedAddress: SavedAddress }>("/addresses", {
    method: "POST",
    body: JSON.stringify(input),
  });
  return data.savedAddress;
}

export async function updateSavedAddress(id: string, input: SavedAddressInput) {
  const data = await request<{ savedAddress: SavedAddress }>(`/addresses/${id}`, {
    method: "PUT",
    body: JSON.stringify(input),
  });
  return data.savedAddress;
}

export async function deleteSavedAddress(id: string) {
  await request(`/addresses/${id}`, { method: "DELETE" });
}

export async function fetchSavedRecipients() {
  return (await request<{ recipients: SavedRecipient[] }>("/recipients")).recipients;
}

export async function createSavedRecipient(input: SavedRecipientInput) {
  const data = await request<{ recipient: SavedRecipient }>("/recipients", {
    method: "POST",
    body: JSON.stringify(input),
  });
  return data.recipient;
}

export async function updateSavedRecipient(id: string, input: SavedRecipientInput) {
  const data = await request<{ recipient: SavedRecipient }>(`/recipients/${id}`, {
    method: "PUT",
    body: JSON.stringify(input),
  });
  return data.recipient;
}

export async function deleteSavedRecipient(id: string) {
  await request(`/recipients/${id}`, { method: "DELETE" });
}
