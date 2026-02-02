import { NetworkError, RateLimitError } from './types';

// ==================== Configuration ====================

const BASE_URL = 'https://api.mangadex.org';

const CORS_PROXIES = [
  'https://corsproxy.io/?',
  'https://api.allorigins.win/raw?url=',
] as const;

const CONFIG = {
  timeout: 10000,
  maxRetries: 3,
  retryDelay: 1000,
  cacheTTL: 60000, // 1 minute
  rateLimitDelay: 500, // Minimum ms between requests
} as const;

// ==================== Request Queue (Rate Limiting) ====================

class RequestQueue {
  private lastRequestTime = 0;
  private queue: Array<() => void> = [];
  private processing = false;

  async add<T>(fn: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push(async () => {
        try {
          const result = await fn();
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });
      this.process();
    });
  }

  private async process() {
    if (this.processing) return;
    this.processing = true;

    while (this.queue.length > 0) {
      const now = Date.now();
      const timeSinceLastRequest = now - this.lastRequestTime;
      
      if (timeSinceLastRequest < CONFIG.rateLimitDelay) {
        await this.sleep(CONFIG.rateLimitDelay - timeSinceLastRequest);
      }

      const task = this.queue.shift();
      if (task) {
        this.lastRequestTime = Date.now();
        await task();
      }
    }

    this.processing = false;
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

const requestQueue = new RequestQueue();

// ==================== Response Cache ====================

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

class ResponseCache {
  private cache = new Map<string, CacheEntry<unknown>>();

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    if (Date.now() - entry.timestamp > CONFIG.cacheTTL) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  set<T>(key: string, data: T): void {
    this.cache.set(key, { data, timestamp: Date.now() });
    
    // Clean old entries periodically
    if (this.cache.size > 100) {
      this.cleanup();
    }
  }

  private cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > CONFIG.cacheTTL) {
        this.cache.delete(key);
      }
    }
  }

  clear(): void {
    this.cache.clear();
  }
}

const responseCache = new ResponseCache();

// ==================== Request Deduplication ====================

const pendingRequests = new Map<string, Promise<unknown>>();

async function deduplicatedFetch<T>(url: string, fetchFn: () => Promise<T>): Promise<T> {
  const existing = pendingRequests.get(url);
  if (existing) {
    return existing as Promise<T>;
  }

  const promise = fetchFn().finally(() => {
    pendingRequests.delete(url);
  });

  pendingRequests.set(url, promise);
  return promise;
}

// ==================== Core Fetch with Retry ====================

async function fetchWithRetry(url: string, retryCount = 0): Promise<Response> {
  let lastError: Error | null = null;

  for (const proxy of CORS_PROXIES) {
    try {
      const proxyUrl = `${proxy}${encodeURIComponent(url)}`;
      const response = await fetch(proxyUrl, {
        signal: AbortSignal.timeout(CONFIG.timeout),
      });

      // Handle rate limiting
      if (response.status === 429) {
        const retryAfter = parseInt(response.headers.get('Retry-After') || '60', 10);
        throw new RateLimitError(retryAfter);
      }

      if (response.ok) {
        return response;
      }

      // Non-retryable errors
      if (response.status >= 400 && response.status < 500 && response.status !== 429) {
        throw new NetworkError(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      lastError = error as Error;
      
      // Don't retry rate limit errors immediately
      if (error instanceof RateLimitError) {
        throw error;
      }
      
      console.warn(`Proxy ${proxy} failed:`, error);
    }
  }

  // Retry logic with exponential backoff
  if (retryCount < CONFIG.maxRetries) {
    const delay = CONFIG.retryDelay * Math.pow(2, retryCount);
    await new Promise(resolve => setTimeout(resolve, delay));
    return fetchWithRetry(url, retryCount + 1);
  }

  throw lastError || new NetworkError('All CORS proxies failed');
}

// ==================== Public API Client ====================

export async function apiRequest<T>(
  endpoint: string,
  params?: URLSearchParams,
  options?: { skipCache?: boolean }
): Promise<T> {
  const url = params 
    ? `${BASE_URL}${endpoint}?${params.toString()}`
    : `${BASE_URL}${endpoint}`;

  // Check cache first
  if (!options?.skipCache) {
    const cached = responseCache.get<T>(url);
    if (cached) return cached;
  }

  // Deduplicate and queue the request
  const result = await requestQueue.add(() =>
    deduplicatedFetch(url, async () => {
      const response = await fetchWithRetry(url);
      const data = await response.json();
      
      // Cache successful responses
      responseCache.set(url, data);
      
      return data as T;
    })
  );

  return result;
}

// Export utilities
export { responseCache, BASE_URL };
