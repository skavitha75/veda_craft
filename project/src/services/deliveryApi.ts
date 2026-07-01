export interface DeliveryAvailability {
  is_active: boolean;
  estimated_days?: number;
}

export const checkDeliveryState = async (stateName: string): Promise<DeliveryAvailability | null> => {
  if (!stateName) return null;

  try {
    const response = await fetch(`http://localhost:5000/api/v1/delivery/check-state?state=${encodeURIComponent(stateName)}`);
    
    if (!response.ok) {
      return null; // Don't block checkout on API error
    }

    const json = await response.json();
    if (json.success && json.data) {
      return json.data;
    }

    return null; // Don't block checkout if unexpected response
  } catch (error) {
    console.error('Failed to check delivery state:', error);
    return null; // Don't block checkout when server is unreachable
  }
};
