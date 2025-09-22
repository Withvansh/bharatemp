// Delivery Service Utility
export const calculateDeliveryTime = (city, state) => {
  const location = city?.toLowerCase() || '';
  const stateLocation = state?.toLowerCase() || '';
  
  if (location.includes('ghaziabad') || location.includes('noida')) {
    return 'Delivery in 24 hours';
  }
  if (location.includes('delhi') || location.includes('gurgaon') || stateLocation.includes('haryana')) {
    return 'Delivery in 72 hours';
  }
  return 'Delivery in 24 to 72 hours';
};