import React, { createContext, useContext } from 'react';

export const SafeAreaFrameContext = createContext({
  x: 0,
  y: 0,
  width: window.innerWidth,
  height: window.innerHeight,
});

export const SafeAreaInsetsContext = createContext({
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
});

export const SafeAreaProvider = ({ children, initialMetrics }) => {
  return (
    <SafeAreaFrameContext.Provider value={initialMetrics?.frame || {
      x: 0,
      y: 0,
      width: window.innerWidth,
      height: window.innerHeight,
    }}>
      <SafeAreaInsetsContext.Provider value={initialMetrics?.insets || {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
      }}>
        {children}
      </SafeAreaInsetsContext.Provider>
    </SafeAreaFrameContext.Provider>
  );
};

export const SafeAreaView = ({ children, style, ...props }) => (
  <div style={{ ...style, padding: '0 env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left)' }} {...props}>
    {children}
  </div>
);

export const useSafeAreaInsets = () => useContext(SafeAreaInsetsContext);

export const useSafeAreaFrame = () => useContext(SafeAreaFrameContext);

export const initialWindowMetrics = {
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
}; 