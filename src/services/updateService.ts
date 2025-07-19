
interface UpdateInfo {
  hasUpdate: boolean;
  version?: string;
  timestamp?: number;
}

class UpdateService {
  private static instance: UpdateService;
  private updateCheckInterval: number = 30000; // 30 seconds
  private intervalId: NodeJS.Timeout | null = null;
  private listeners: ((updateInfo: UpdateInfo) => void)[] = [];

  private constructor() {}

  static getInstance(): UpdateService {
    if (!UpdateService.instance) {
      UpdateService.instance = new UpdateService();
    }
    return UpdateService.instance;
  }

  async checkForUpdates(): Promise<UpdateInfo> {
    try {
      // Check if service worker is available
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.getRegistration();
        if (registration) {
          // Force check for updates
          await registration.update();
          
          // Check if there's a waiting service worker (new version available)
          if (registration.waiting) {
            return {
              hasUpdate: true,
              version: await this.getAppVersion(),
              timestamp: Date.now()
            };
          }
        }
      }

      // Fallback: Check for updates using cache busting
      const currentVersion = await this.getAppVersion();
      const response = await fetch('/version.json?t=' + Date.now(), {
        cache: 'no-cache'
      });
      
      if (response.ok) {
        const data = await response.json();
        const remoteVersion = data.version || data.timestamp;
        
        if (remoteVersion !== currentVersion) {
          return {
            hasUpdate: true,
            version: remoteVersion,
            timestamp: Date.now()
          };
        }
      }
    } catch (error) {
      console.warn('Erreur lors de la vérification des mises à jour:', error);
    }

    return { hasUpdate: false };
  }

  private async getAppVersion(): Promise<string> {
    try {
      const response = await fetch('/version.json');
      if (response.ok) {
        const data = await response.json();
        return data.version || data.timestamp || Date.now().toString();
      }
    } catch (error) {
      console.warn('Impossible de récupérer la version:', error);
    }
    return Date.now().toString();
  }

  startUpdateCheck(): void {
    this.stopUpdateCheck();
    
    // Check immediately
    this.checkForUpdates().then(updateInfo => {
      if (updateInfo.hasUpdate) {
        this.notifyListeners(updateInfo);
      }
    });

    // Set up periodic checks
    this.intervalId = setInterval(async () => {
      const updateInfo = await this.checkForUpdates();
      if (updateInfo.hasUpdate) {
        this.notifyListeners(updateInfo);
      }
    }, this.updateCheckInterval);
  }

  stopUpdateCheck(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  addUpdateListener(listener: (updateInfo: UpdateInfo) => void): void {
    this.listeners.push(listener);
  }

  removeUpdateListener(listener: (updateInfo: UpdateInfo) => void): void {
    this.listeners = this.listeners.filter(l => l !== listener);
  }

  private notifyListeners(updateInfo: UpdateInfo): void {
    this.listeners.forEach(listener => listener(updateInfo));
  }

  async applyUpdate(): Promise<void> {
    try {
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.getRegistration();
        if (registration?.waiting) {
          // Tell the waiting service worker to skip waiting
          registration.waiting.postMessage({ type: 'SKIP_WAITING' });
          
          // Listen for the controlling service worker change
          navigator.serviceWorker.addEventListener('controllerchange', () => {
            window.location.reload();
          });
          
          return;
        }
      }
      
      // Fallback: Force reload
      window.location.reload();
    } catch (error) {
      console.error('Erreur lors de l\'application de la mise à jour:', error);
      // Force reload as fallback
      window.location.reload();
    }
  }
}

export const updateService = UpdateService.getInstance();
