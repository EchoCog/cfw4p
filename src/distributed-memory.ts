/**
 * Distributed Memory System
 * Minimal implementation for distributed cognitive memory
 */

export interface DistributedMemorySystem {
  store(key: string, value: any): Promise<void>;
  retrieve(key: string): Promise<any>;
  delete(key: string): Promise<void>;
  sync(): Promise<void>;
  storeMemory(key: string, value: any): Promise<void>; // alias for store
  getMemoryStats(): any;
}

export class BasicDistributedMemorySystem implements DistributedMemorySystem {
  private memory: Map<string, any> = new Map();

  async store(key: string, value: any): Promise<void> {
    this.memory.set(key, value);
  }

  async storeMemory(key: string, value: any): Promise<void> {
    return this.store(key, value);
  }

  async retrieve(key: string): Promise<any> {
    return this.memory.get(key);
  }

  async delete(key: string): Promise<void> {
    this.memory.delete(key);
  }

  async sync(): Promise<void> {
    // Basic implementation - in real scenario would sync with distributed nodes
  }

  getMemoryStats(): any {
    return {
      size: this.memory.size,
      keys: Array.from(this.memory.keys()),
    };
  }
}

export const distributedMemory = new BasicDistributedMemorySystem();