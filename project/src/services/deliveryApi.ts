export interface DeliveryAvailability {
  is_active: boolean;
  estimated_days?: number;
}

export const checkDeliveryState = async (stateName: string): Promise<DeliveryAvailability | null> => {
  if (!stateName) return null;

  try {
    const response = await fetch(`http://localhost:5000/api/v1/delivery/check-state?state=${encodeURIComponent(stateName)}`);
    
    if (!response.ok) {
      return { is_active: false };
    }

    const json = await response.json();
    if (json.success && json.data) {
      return json.data;
    }

    return { is_active: false };
  } catch (error) {
    console.error('Failed to check delivery state:', error);
    return { is_active: false };
  }
};
