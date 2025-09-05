import * as Sharing from 'expo-sharing';
import { ARPhoto, SocialPlatform } from '@/types';

export class SocialSharingService {
  async sharePhoto(photo: ARPhoto, platform?: SocialPlatform): Promise<boolean> {
    try {
      if (!await Sharing.isAvailableAsync()) return false;
      await Sharing.shareAsync(photo.imageData, {
        dialogTitle: 'Share your ECO-Guardian moment',
        mimeType: 'image/png',
      });
      return true;
    } catch (_error) {
      return false;
    }
  }
}


