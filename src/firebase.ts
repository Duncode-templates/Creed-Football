import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getFirestore, collection, getDocs, Firestore, DocumentData } from 'firebase/firestore';
import { NewsArticle } from './types';

// Helper to look up Firebase configuration from environment or local storage
export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  collectionName?: string;
  databaseId?: string;
}

export function getStoredFirebaseConfig(): FirebaseConfig | null {
  // Try environment first
  const metaEnv = (import.meta as any).env || {};
  const envConfig: FirebaseConfig = {
    apiKey: metaEnv.VITE_FIREBASE_API_KEY || '',
    authDomain: metaEnv.VITE_FIREBASE_AUTH_DOMAIN || '',
    projectId: metaEnv.VITE_FIREBASE_PROJECT_ID || '',
    storageBucket: metaEnv.VITE_FIREBASE_STORAGE_BUCKET || '',
    messagingSenderId: metaEnv.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
    appId: metaEnv.VITE_FIREBASE_APP_ID || '',
    collectionName: metaEnv.VITE_FIREBASE_COLLECTION_NAME || 'articles',
    databaseId: metaEnv.VITE_FIREBASE_DATABASE_ID || '',
  };

  if (envConfig.apiKey && envConfig.projectId) {
    return envConfig;
  }

  // Fallback to local storage for quick dynamic live setup in preview iframe
  try {
    const saved = localStorage.getItem('creed_firebase_config');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.apiKey && parsed.projectId) {
        return {
          apiKey: parsed.apiKey,
          authDomain: parsed.authDomain || '',
          projectId: parsed.projectId,
          storageBucket: parsed.storageBucket || '',
          messagingSenderId: parsed.messagingSenderId || '',
          appId: parsed.appId || '',
          collectionName: parsed.collectionName || 'articles',
          databaseId: parsed.databaseId || '',
        };
      }
    }
  } catch (e) {
    console.error('Error reading localStorage config:', e);
  }

  // Fallback directly to the newly provisioned project configurations
  return {
    apiKey: 'AIzaSyDyKQ-RIzpeGybIqBJa4vu5-u0g1WGR2-0',
    authDomain: 'mega-journey-wr4g1.firebaseapp.com',
    projectId: 'mega-journey-wr4g1',
    storageBucket: 'mega-journey-wr4g1.firebasestorage.app',
    messagingSenderId: '624564378262',
    appId: '1:624564378262:web:099c0e195e736957b600b7',
    collectionName: 'articles',
    databaseId: 'ai-studio-56d28270-a00b-49f9-ac91-ec01d5b95230',
  };
}

// Lazy load app and firestore to avoid crashing if config is invalid or missing
let initializedApp: FirebaseApp | null = null;
let firestoreDb: Firestore | null = null;

export function getFirebaseInstance(): { app: FirebaseApp; db: Firestore } | null {
  const config = getStoredFirebaseConfig();
  if (!config) return null;

  try {
    if (!initializedApp) {
      if (getApps().length > 0) {
        initializedApp = getApp();
      } else {
        initializedApp = initializeApp({
          apiKey: config.apiKey,
          authDomain: config.authDomain,
          projectId: config.projectId,
          storageBucket: config.storageBucket,
          messagingSenderId: config.messagingSenderId,
          appId: config.appId,
        });
      }
    }

    if (!firestoreDb && initializedApp) {
      // Connect specifically to custom database ID if specified
      if (config.databaseId && config.databaseId !== '(default)') {
        firestoreDb = getFirestore(initializedApp, config.databaseId);
      } else {
        firestoreDb = getFirestore(initializedApp);
      }
    }

    if (initializedApp && firestoreDb) {
      return { app: initializedApp, db: firestoreDb };
    }
  } catch (error) {
    console.error('Firebase Initialization Error:', error);
  }

  return null;
}

// Map any random document schema into standard Creed NewsArticle format dynamically and safely
export function mapDocToArticle(id: string, data: DocumentData): NewsArticle {
  // Use the exact categorizations and subheadings defined in the database
  let category = '';
  if (data.category && typeof data.category === 'string' && data.category.trim() !== '') {
    category = data.category.trim();
  } else if (Array.isArray(data.categories) && data.categories.length > 0 && typeof data.categories[0] === 'string') {
    category = data.categories[0].trim();
  } else {
    category = 'General News';
  }

  // Derive human-readable tag/subheading
  let tag = data.tag || data.subheading || '';
  if (!tag) {
    if (Array.isArray(data.categories) && data.categories.length > 0) {
      tag = data.categories[1] || data.categories[0];
    } else {
      tag = 'FOOTBALL';
    }
  }

  // Derive date safely
  const rawDate = data.date || data.publishedDate || data.publishedAt || data.scrapedAt;
  let dateStr = new Date().toISOString().substring(0, 10);
  if (rawDate) {
    try {
      const d = new Date(rawDate);
      if (!isNaN(d.getTime())) {
        dateStr = d.toISOString().substring(0, 10);
      }
    } catch (e) {}
  }

  // Compute realistic read time
  const fullText = data.compiledMarkdown || (Array.isArray(data.scrapedParagraphs) ? data.scrapedParagraphs.join(' ') : (data.content || data.body || data.text || ''));
  const wordCount = fullText ? fullText.split(/\s+/).length : 200;
  const readMinutes = Math.max(2, Math.ceil(wordCount / 220));
  const readTime = data.readTime || `${readMinutes} min read`;

  // Select the highest quality image available
  let imageUrl = 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80';
  if (data.mainImage) {
    imageUrl = data.mainImage;
  } else if (Array.isArray(data.images) && data.images.length > 0 && data.images[0]?.url) {
    imageUrl = data.images[0].url;
  } else if (data.image || data.imageUrl || data.banner) {
    imageUrl = data.image || data.imageUrl || data.banner;
  }

  return {
    id: id || data.id || '',
    title: data.title || data.heading || 'Untitled News',
    category,
    tag: tag.toUpperCase(),
    summary: data.summary || data.description || data.teaser || 'Read the full coverage for key match details, player performances, and reactions.',
    content: fullText || 'No detailed content available.',
    date: dateStr,
    readTime,
    image: imageUrl,
    author: data.author || data.writer || data.by || 'Creed Staff',
    likes: typeof data.likes === 'number' ? data.likes : Math.floor(Math.random() * 25) + 5,
    comments: typeof data.comments === 'number' ? data.comments : Math.floor(Math.random() * 10) + 1,
    isTrending: typeof data.isTrending === 'boolean' ? data.isTrending : (data.trending || false),
    tags: Array.isArray(data.categories) ? data.categories : (data.category ? [data.category] : []),
    isFromFirestore: true,
  };
}

export async function fetchArticlesFromFirebase(): Promise<NewsArticle[] | null> {
  const instance = getFirebaseInstance();
  if (!instance) return null;

  const config = getStoredFirebaseConfig();
  const collectionName = config?.collectionName || 'articles';

  try {
    const articlesCol = collection(instance.db, collectionName);
    const snapshot = await getDocs(articlesCol);
    
    if (snapshot.empty) {
      return [];
    }

    const fetchedList: NewsArticle[] = [];
    snapshot.forEach((doc) => {
      fetchedList.push(mapDocToArticle(doc.id, doc.data()));
    });

    return fetchedList;
  } catch (error) {
    console.error(`Error fetching from Firestore collection "${collectionName}":`, error);
    throw error;
  }
}
