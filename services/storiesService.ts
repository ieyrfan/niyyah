import { db } from '../lib/firebase';
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  addDoc, 
  orderBy, 
  Timestamp,
  doc,
  updateDoc,
  deleteDoc
} from 'firebase/firestore';

export interface Story {
  id?: string;
  userId: string;
  author_name: string;
  tajuk: string;
  kandungan: string;
  kategori: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  likes?: number;
  comments_count?: number;
}

export const storiesService = {
  async getApprovedStories() {
    const q = query(
      collection(db, 'stories'),
      where('status', '==', 'approved'),
      orderBy('created_at', 'desc')
    );
    const snap = await getDocs(q);
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Story));
  },

  async getUserStories(userId: string) {
    const q = query(
      collection(db, 'stories'),
      where('userId', '==', userId),
      orderBy('created_at', 'desc')
    );
    const snap = await getDocs(q);
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Story));
  },

  async submitStory(story: Omit<Story, 'id' | 'status' | 'created_at'>) {
    return addDoc(collection(db, 'stories'), {
      ...story,
      status: 'pending',
      created_at: new Date().toISOString()
    });
  },

  async deleteStory(storyId: string) {
    return deleteDoc(doc(db, 'stories', storyId));
  }
};
