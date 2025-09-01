import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
  User
} from 'firebase/auth';
import { ref, set, get } from 'firebase/database';
import { auth, database } from './FirebaseService';
import { UserProfile } from '@/types';

export class AuthService {
  async signIn(email: string, password: string): Promise<User> {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  }

  async signUp(email: string, password: string, displayName: string): Promise<User> {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    await updateProfile(user, { displayName });
    await this.createUserProfile(user, displayName);
    
    return user;
  }

  async signOut(): Promise<void> {
    await signOut(auth);
  }

  private async createUserProfile(user: User, displayName: string): Promise<void> {
    const userProfile: Partial<UserProfile> = {
      uid: user.uid,
      displayName,
      email: user.email!,
      createdAt: new Date(),
      level: 1,
      totalPoints: 0,
      achievements: [],
      sustainabilityStats: {
        totalEcoActions: 0,
        sustainabilityStreak: 0,
        locationVisits: [],
        challengesCompleted: 0,
        co2Saved: 0,
        waterSaved: 0,
        wasteRecycled: 0,
      },
      preferences: {
        notificationsEnabled: true,
        locationSharingEnabled: true,
        socialFeaturesEnabled: true,
        arEffectsEnabled: true,
        soundEnabled: true,
      },
    };

    const userRef = ref(database, `users/${user.uid}`);
    await set(userRef, userProfile);
  }

  async getUserProfile(uid: string): Promise<UserProfile | null> {
    const userRef = ref(database, `users/${uid}`);
    const snapshot = await get(userRef);
    return snapshot.exists() ? snapshot.val() : null;
  }

  getCurrentUser(): User | null {
    return auth.currentUser;
  }
}