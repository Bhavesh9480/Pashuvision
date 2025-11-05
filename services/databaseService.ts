import { Registration } from '../types';
import { generateSampleRegistrations } from '../utils/sampleData';

const DB_NAME = 'PashuVisionDB';
const DB_VERSION = 1;
const STORE_NAME = 'registrations';

let db: IDBDatabase;

// Function to open the database
const openDB = (): Promise<IDBDatabase> => {
    return new Promise((resolve, reject) => {
        if (db) {
            return resolve(db);
        }

        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onerror = (event) => {
            console.error('Database error:', request.error);
            reject('Database error');
        };

        request.onsuccess = (event) => {
            db = request.result;
            resolve(db);
        };

        request.onupgradeneeded = (event) => {
            const dbInstance = (event.target as IDBOpenDBRequest).result;
            if (!dbInstance.objectStoreNames.contains(STORE_NAME)) {
                dbInstance.createObjectStore(STORE_NAME, { keyPath: 'id' });
            }
        };
    });
};

// Get all registrations
export const getAllRegistrations = async (): Promise<Registration[]> => {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, 'readonly');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.getAll();

        request.onerror = () => {
            reject('Error fetching registrations');
        };

        request.onsuccess = () => {
            if (request.result && request.result.length > 0) {
                resolve(request.result);
            } else {
                // DB is empty, populate with sample data
                const sampleData = generateSampleRegistrations();
                const writeTransaction = db.transaction(STORE_NAME, 'readwrite');
                const writeStore = writeTransaction.objectStore(STORE_NAME);
                
                let completed = 0;
                if (sampleData.length === 0) {
                    resolve([]);
                    return;
                }
                
                sampleData.forEach(reg => {
                    const addRequest = writeStore.add(reg);
                    addRequest.onsuccess = () => {
                        completed++;
                        if (completed === sampleData.length) {
                            resolve(sampleData);
                        }
                    };
                    addRequest.onerror = (e) => {
                        console.error('Error adding sample data item:', (e.target as IDBRequest).error);
                        // still count it as "completed" to not hang the promise
                        completed++;
                        if (completed === sampleData.length) {
                            resolve(sampleData); 
                        }
                    }
                });
                
                writeTransaction.onerror = () => {
                    reject('Error populating database');
                }
            }
        };
    });
};

// Add or update a registration
export const upsertRegistration = async (registration: Registration): Promise<void> => {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.put(registration);

        request.onerror = () => {
            console.error('Upsert error:', request.error);
            reject('Error saving registration');
        };
        request.onsuccess = () => {
            resolve();
        };
    });
};
