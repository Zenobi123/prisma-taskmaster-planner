
// Mock implementation of storage service
// In a real application, this would connect to a backend storage service

class StorageService {
  async uploadFile(file: File, path: string): Promise<string> {
    // Simulate file upload with a delay
    
    // Mock implementation - in a real app this would upload to a server
    return new Promise((resolve) => {
      setTimeout(() => {
        // Return a mock URL to the "uploaded" file
        const mockUrl = `https://mock-storage.example.com/${path}/${file.name}`;
        resolve(mockUrl);
      }, 1000);
    });
  }
  
  async deleteFile(path: string): Promise<boolean> {
    
    // Mock implementation
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, 500);
    });
  }
  
  getPublicUrl(path: string): string {
    return `https://mock-storage.example.com/${path}`;
  }
}

export const storageService = new StorageService();
