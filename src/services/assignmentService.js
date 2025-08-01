import { collection, addDoc, query, where, orderBy, getDocs, Timestamp } from 'firebase/firestore';
import { db } from '../config/firebase';

export const saveAssignmentData = async (userId, prompt, breakdown, feedback) => {
  try {
    const docRef = await addDoc(collection(db, 'assignments'), {
      userId,
      prompt,
      breakdown,
      feedback,
      timestamp: Timestamp.now()
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error saving assignment:', error);
    return { success: false, error: error.message };
  }
};

export const getUserAssignments = async (userId) => {
  try {
    const q = query(
      collection(db, 'assignments'),
      where('userId', '==', userId),
      orderBy('timestamp', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const assignments = [];
    
    querySnapshot.forEach((doc) => {
      assignments.push({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp.toDate()
      });
    });
    
    return { success: true, data: assignments };
  } catch (error) {
    console.error('Error fetching assignments:', error);
    return { success: false, error: error.message };
  }
};