import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { DiseaseResult } from '../types';


// =================================================================================================
// IMPORTANT: FIREBASE CONFIGURATION
// =================================================================================================
//
// PLEASE REPLACE THE PLACEHOLDER VALUES BELOW WITH YOUR ACTUAL FIREBASE PROJECT CONFIGURATION.
//
// You can find your Firebase project's configuration details in the Firebase console:
// 1. Go to your project's settings.
// 2. In the "General" tab, scroll down to "Your apps".
// 3. Select the web app you've registered.
// 4. Click on "SDK setup and configuration" and choose "Config".
// 5. Copy the configuration object and paste it here.
//
// =================================================================================================

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
// FIX: Updated to use the modular Firebase v9+ syntax for initialization.
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
const db = getFirestore(app);


/**
 * Saves the diagnosis result to Firestore under the user's profile.
 * @param userId The ID of the current user.
 * @param imageUrl The public URL of the uploaded image from ImageKit.io.
 * @param diagnosisResult The AI-generated diagnosis result.
 */
export const saveDiagnosis = async (
    userId: string,
    imageUrl: string,
    diagnosisResult: DiseaseResult
): Promise<void> => {
    if (!userId || !imageUrl || !diagnosisResult) {
        throw new Error("Missing required data for saving diagnosis.");
    }
    
    // Prepare the complete diagnosis data object for Firestore
    const diagnosisToSave = {
        ...diagnosisResult,
        imageUrl: imageUrl,
        createdAt: serverTimestamp(),
        userId: userId,
    };

    // Save the diagnosis document to the user's subcollection
    // Firestore path: /users/{userId}/diagnoses/{diagnosisId}
    await addDoc(collection(db, 'users', userId, 'diagnoses'), diagnosisToSave);
};