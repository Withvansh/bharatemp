// Network detection utility for mobile compatibility
export const isOnline = () => {
  return navigator.onLine;
};

export const isMobile = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

export const getDeviceType = () => {
  if (isMobile()) return 'mobile';
  if (window.innerWidth <= 768) return 'tablet';
  return 'desktop';
};

export const addNetworkListeners = (onOnline, onOffline) => {
  window.addEventListener('online', onOnline);
  window.addEventListener('offline', onOffline);
  
  return () => {
    window.removeEventListener('online', onOnline);
    window.removeEventListener('offline', onOffline);
  };
};

// Check if running on local network
export const isLocalNetwork = () => {
  const hostname = window.location.hostname;
  return hostname === 'localhost' || 
         hostname === '127.0.0.1' || 
         hostname.startsWith('192.168.') ||
         hostname.startsWith('10.') ||
         hostname.startsWith('172.');
};

// Get current network info
export const getNetworkInfo = () => {
  return {
    online: isOnline(),
    mobile: isMobile(),
    deviceType: getDeviceType(),
    localNetwork: isLocalNetwork(),
    hostname: window.location.hostname,
    port: window.location.port,
    protocol: window.location.protocol
  };
};