import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  serverTimestamp,
  collectionGroup,
  Timestamp
} from 'firebase/firestore';
import { db, auth } from '../lib/firebase';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export enum OnlineClassCategory {
  AGAMA = 'Agama',
  BAHASA = 'Bahasa',
  SEKOLAH = 'Sekolah',
  KEMAHIRAN = 'Kemahiran',
  KESIHATAN = 'Kesihatan',
  KERJAYA = 'Kerjaya',
  HOBI = 'Hobi',
  LAIN = 'Lain-lain'
}

export enum OnlineClassLevel {
  PEMULA = 'Pemula',
  SEDERHANA = 'Sederhana',
  LANJUTAN = 'Lanjutan',
  SEMUA = 'Semua Peringkat'
}

export interface OnlineClass {
  id?: string;
  nama_kelas: string;
  kategori: OnlineClassCategory;
  penerangan: string;
  tahap: OnlineClassLevel;
  harga: number;
  link_meeting: string;
  gambar_url?: string;
  kapasiti?: number;
  umur_minimal?: number;
  hari: string; // Comma separated or JSON string
  tarikh_mula: string;
  tarikh_tamat?: string;
  masa_mula: string;
  masa_tamat: string;
  created_by: string;
  instructor_name: string;
  created_at: any;
}

export interface ClassEnrollment {
  id?: string;
  user_id: string;
  class_id: string;
  class_name: string;
  joined_at: any;
}

export interface ClassReview {
  id?: string;
  user_id: string;
  user_name: string;
  class_id: string;
  rating: number;
  komen: string;
  created_at: any;
}

export const classService = {
  // --- Classes ---
  async createClass(classData: Omit<OnlineClass, 'id' | 'created_by' | 'created_at'>) {
    if (!auth.currentUser) throw new Error('User not authenticated');
    
    const path = 'classes';
    try {
      return await addDoc(collection(db, path), {
        ...classData,
        created_by: auth.currentUser.uid,
        created_at: serverTimestamp()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
    }
  },

  async updateClass(classId: string, classData: Partial<OnlineClass>) {
    const path = `classes/${classId}`;
    try {
      const classRef = doc(db, 'classes', classId);
      return await updateDoc(classRef, {
        ...classData,
        updated_at: serverTimestamp()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  },

  async deleteClass(classId: string) {
    const path = `classes/${classId}`;
    try {
      return await deleteDoc(doc(db, 'classes', classId));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  },

  async getAllClasses() {
    const path = 'classes';
    try {
      const q = query(collection(db, path), orderBy('created_at', 'desc'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as OnlineClass));
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, path);
    }
  },

  async getClassById(classId: string) {
    const path = `classes/${classId}`;
    try {
      const docRef = doc(db, 'classes', classId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as OnlineClass;
      }
      return null;
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, path);
    }
  },

  async getClassesByInstructor(userId: string) {
    const path = 'classes';
    try {
      const q = query(collection(db, path), where('created_by', '==', userId), orderBy('created_at', 'desc'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as OnlineClass));
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, path);
    }
  },

  // --- Enrollments ---
  async enrollInClass(classId: string, className: string) {
    if (!auth.currentUser) throw new Error('User not authenticated');
    
    const path = `classes/${classId}/enrollments`;
    try {
      // Check if already enrolled
      const q = query(collection(db, path), where('user_id', '==', auth.currentUser.uid));
      const snap = await getDocs(q);
      if (!snap.empty) return snap.docs[0].id;

      return await addDoc(collection(db, path), {
        user_id: auth.currentUser.uid,
        class_id: classId,
        class_name: className,
        joined_at: serverTimestamp()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },

  async getEnrolledClasses() {
    if (!auth.currentUser) return [];
    
    const path = 'enrollments'; // collection group
    try {
      // Using collectionGroup for enrollments
      const q = query(
        collectionGroup(db, 'enrollments'), 
        where('user_id', '==', auth.currentUser.uid)
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ClassEnrollment));
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, path);
    }
  },

  async isEnrolled(classId: string) {
    if (!auth.currentUser) return false;
    const path = `classes/${classId}/enrollments`;
    try {
      const q = query(collection(db, path), where('user_id', '==', auth.currentUser.uid));
      const snap = await getDocs(q);
      return !snap.empty;
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, path);
    }
  },

  // --- Reviews ---
  async addReview(classId: string, review: Omit<ClassReview, 'id' | 'user_id' | 'created_at'>) {
    if (!auth.currentUser) throw new Error('User not authenticated');
    
    const path = `classes/${classId}/reviews`;
    try {
      return await addDoc(collection(db, path), {
        ...review,
        user_id: auth.currentUser.uid,
        class_id: classId,
        created_at: serverTimestamp()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
    }
  },

  async getClassReviews(classId: string) {
    const path = `classes/${classId}/reviews`;
    try {
      const q = query(collection(db, path), orderBy('created_at', 'desc'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ClassReview));
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, path);
    }
  },

  // --- Favorites ---
  async toggleFavorite(classId: string) {
    if (!auth.currentUser) throw new Error('User not authenticated');
    
    const path = `users/${auth.currentUser.uid}/saved_classes`;
    try {
      const favoritesRef = collection(db, path);
      const q = query(favoritesRef, where('class_id', '==', classId));
      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        await deleteDoc(doc(db, path, snapshot.docs[0].id));
        return false;
      } else {
        await addDoc(favoritesRef, {
          user_id: auth.currentUser.uid,
          class_id: classId,
          saved_at: serverTimestamp()
        });
        return true;
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },

  async getFavorites() {
    if (!auth.currentUser) return [];
    const path = `users/${auth.currentUser.uid}/saved_classes`;
    try {
      const q = query(collection(db, path), orderBy('saved_at', 'desc'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, path);
    }
  },

  async isFavorite(classId: string) {
    if (!auth.currentUser) return false;
    const path = `users/${auth.currentUser.uid}/saved_classes`;
    try {
      const q = query(collection(db, path), where('class_id', '==', classId));
      const snapshot = await getDocs(q);
      return !snapshot.empty;
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, path);
    }
  }
};
