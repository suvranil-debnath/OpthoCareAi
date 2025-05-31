// src/utils/trialUtils.js
import { getDatabase, ref, get, update } from 'firebase/database';

export const checkAndConsumeTrial = async (uid, checkOnly = false) => {
  const db = getDatabase();
  const userRef = ref(db, 'Users/' + uid);

  try {
    const snapshot = await get(userRef);
    if (snapshot.exists()) {
      const userData = snapshot.val();
      let { trail_count, Subscriber } = userData;

      if (Subscriber) {
        return { allowed: true, message: 'Access granted (Subscribed user)', Subscriber: true };
      }

      if (trail_count > 0) {
        if (!checkOnly) {
          trail_count -= 1;
          await update(userRef, { trail_count });
        }
        return {
          allowed: true,
          message: checkOnly ? `Trials available: ${trail_count}` : `Access granted. Trials remaining: ${trail_count}`,
          trail_count
        };
      } else {
        return {
          allowed: false,
          message: 'No trials left. Please subscribe to continue.',
          trail_count: 0
        };
      }
    } else {
      throw new Error('User data not found.');
    }
  } catch (error) {
    console.error('Trial check error:', error);
    return {
      allowed: false,
      message: 'Error checking trials. Please try again later.',
    };
  }
};

export const updateSubscriptionStatus = async (uid) => {
  const db = getDatabase();
  const userRef = ref(db, 'Users/' + uid);

  try {
    await update(userRef, { 
      Subscriber: true,
      subscription_date: new Date().toISOString()
    });
    return true;
  } catch (error) {
    console.error('Error updating subscription status:', error);
    throw error;
  }
};