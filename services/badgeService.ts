import { doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../lib/firebase';

export async function awardBadge(userId: string, badgeId: string) {
  try {
    const userRef = doc(db, 'users', userId);
    const snap = await getDoc(userRef);
    
    if (snap.exists()) {
      const data = snap.data();
      const badges = data.badges || [];
      
      if (!badges.includes(badgeId)) {
        await updateDoc(userRef, {
          badges: arrayUnion(badgeId),
          updated_at: new Date().toISOString()
        });
        return true; // Successfully awarded
      }
    }
    return false; // Already has badge or user not found
  } catch (error) {
    console.error('Error awarding badge:', error);
    return false;
  }
}

/**
 * Checks for tracker-related badges
 * @param userId User ID
 * @param records Current daily solat records
 * @param completedCount Number of prayers completed today
 */
export async function checkTrackerBadges(userId: string, completedCount: number) {
  // Award "First Step" on first recorded prayer
  if (completedCount >= 1) {
    await awardBadge(userId, 'first_prayer');
  }
  
  // Award "Full Day" if all 5 are checked
  if (completedCount === 5) {
    await awardBadge(userId, 'full_day');
  }
}
