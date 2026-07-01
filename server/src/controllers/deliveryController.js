import * as deliveryService from '../services/deliveryService.js';

export const checkDeliveryAvailability = async (req, res) => {
  try {
    const { state } = req.query;
    
    if (!state) {
      return res.status(400).json({
        success: false,
        message: 'State name is required.',
      });
    }

    const availability = await deliveryService.checkStateAvailability(state);

    return res.status(200).json({
      success: true,
      data: availability,
    });
  } catch (error) {
    console.error('Error in checkDeliveryAvailability:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error while checking delivery availability.',
    });
  }
};
