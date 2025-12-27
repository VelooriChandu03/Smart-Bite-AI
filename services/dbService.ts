
import { UserProfile } from "../types";

const DB_KEY = 'smart_bite_cloud_v1';

/**
 * World-class persistence service. 
 * This can be easily swapped for a real Firebase/Postgres backend.
 */
export const dbService = {
  /**
   * Fetches the user profile from the database.
   */
  async getProfile(): Promise<UserProfile | null> {
    // Simulate network latency
    await new Promise(resolve => setTimeout(resolve, 800));
    const data = localStorage.getItem(DB_KEY);
    return data ? JSON.parse(data) : null;
  },

  /**
   * Saves or updates the user profile in the database.
   */
  async saveProfile(profile: UserProfile): Promise<boolean> {
    // Simulate network latency
    await new Promise(resolve => setTimeout(resolve, 1500));
    try {
      localStorage.setItem(DB_KEY, JSON.stringify(profile));
      return true;
    } catch (e) {
      console.error("Database Write Error:", e);
      return false;
    }
  },

  /**
   * Wipes the clinical vault.
   */
  async clearDatabase(): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500));
    localStorage.removeItem(DB_KEY);
  }
};
