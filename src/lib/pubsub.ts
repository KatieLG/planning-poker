type PubSubTypes = {
  error: string | null;
  toast: { type: 'success' | 'error' | 'info' | 'warning'; message: string };
  roomNotFound: string;
  roomFound: string;
};

const listeners = new Map<keyof PubSubTypes, Set<(data: PubSubTypes[keyof PubSubTypes]) => void>>();

export const pubsub = {
  on<K extends keyof PubSubTypes>(event: K, callback: (data: PubSubTypes[K]) => void) {
    if (!listeners.has(event)) {
      listeners.set(event, new Set());
    }
    listeners.get(event)!.add(callback as (data: PubSubTypes[keyof PubSubTypes]) => void);
    return () =>
      listeners.get(event)?.delete(callback as (data: PubSubTypes[keyof PubSubTypes]) => void);
  },

  emit<K extends keyof PubSubTypes>(event: K, data: PubSubTypes[K]) {
    listeners.get(event)?.forEach((callback) => callback(data));
  }
};
