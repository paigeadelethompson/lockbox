import React from 'react';

// Mock for codegenNativeComponent
export function codegenNativeComponent(name) {
  console.warn(`Native component ${name} is not implemented for web`);
  return null;
}

// Mock for requireNativeComponent
export function requireNativeComponent(name) {
  console.warn(`Native component ${name} is not implemented for web`);
  return null;
}

// Mock for NativeModules
export const NativeModules = {
  RNCSafeAreaProvider: {
    getConstants: () => ({
      initialWindowMetrics: {
        frame: {
          x: 0,
          y: 0,
          width: window.innerWidth,
          height: window.innerHeight,
        },
        insets: {
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
        },
      },
    }),
  },
  RNCStatusBar: {
    getConstants: () => ({
      HEIGHT: 0,
    }),
  },
};

// Mock for Platform
export const Platform = {
  OS: 'web',
  select: (obj) => obj.web || obj.default,
};

// Mock for NativeEventEmitter
export class NativeEventEmitter {
  constructor() {
    this.listeners = new Map();
  }

  addListener(eventType, listener) {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, new Set());
    }
    this.listeners.get(eventType).add(listener);
  }

  removeListener(eventType, listener) {
    const listeners = this.listeners.get(eventType);
    if (listeners) {
      listeners.delete(listener);
    }
  }

  removeAllListeners(eventType) {
    if (eventType) {
      this.listeners.delete(eventType);
    } else {
      this.listeners.clear();
    }
  }

  emit(eventType, ...args) {
    const listeners = this.listeners.get(eventType);
    if (listeners) {
      listeners.forEach(listener => listener(...args));
    }
  }
}

// Create and export a singleton instance of NativeEventEmitter
export const DeviceEventEmitter = new NativeEventEmitter(); 