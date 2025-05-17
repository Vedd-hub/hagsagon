import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit, 
  DocumentData, 
  QueryConstraint, 
  DocumentReference,
  CollectionReference
} from 'firebase/firestore';
import { db } from '../firebase/config';

/**
 * Generic service for Firestore operations
 */
export class FirestoreService {
  /**
   * Get a reference to a collection
   */
  getCollection<T = DocumentData>(collectionPath: string): CollectionReference<T> {
    return collection(db, collectionPath) as CollectionReference<T>;
  }

  /**
   * Get a reference to a document
   */
  getDocRef<T = DocumentData>(collectionPath: string, docId: string): DocumentReference<T> {
    return doc(db, collectionPath, docId) as DocumentReference<T>;
  }

  /**
   * Get all documents from a collection
   */
  async getAll<T = DocumentData>(collectionPath: string, ...queryConstraints: QueryConstraint[]): Promise<T[]> {
    const collectionRef = collection(db, collectionPath);
    const q = query(collectionRef, ...queryConstraints);
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as T[];
  }

  /**
   * Get a document by ID
   */
  async getById<T = DocumentData>(collectionPath: string, docId: string): Promise<T | null> {
    const docRef = doc(db, collectionPath, docId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data()
      } as T;
    }
    
    return null;
  }

  /**
   * Add a new document to a collection
   */
  async add<T = DocumentData>(collectionPath: string, data: Omit<T, 'id'>): Promise<string> {
    const collectionRef = collection(db, collectionPath);
    const docRef = await addDoc(collectionRef, data);
    return docRef.id;
  }

  /**
   * Update a document
   */
  async update<T = DocumentData>(collectionPath: string, docId: string, data: Partial<T>): Promise<void> {
    const docRef = doc(db, collectionPath, docId);
    await updateDoc(docRef, data as DocumentData);
  }

  /**
   * Delete a document
   */
  async delete(collectionPath: string, docId: string): Promise<void> {
    const docRef = doc(db, collectionPath, docId);
    await deleteDoc(docRef);
  }

  /**
   * Get a single document by ID
   */
  async getDoc<T = DocumentData>(collectionPath: string, docId: string): Promise<(T & { id: string }) | null> {
    const docRef = doc(db, collectionPath, docId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data()
      } as T & { id: string };
    }
    
    return null;
  }

  /**
   * Query documents with conditions
   */
  async query<T = DocumentData>(
    collectionPath: string, 
    ...queryConstraints: QueryConstraint[]
  ): Promise<T[]> {
    const collectionRef = collection(db, collectionPath);
    const q = query(collectionRef, ...queryConstraints);
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as T[];
  }
} 