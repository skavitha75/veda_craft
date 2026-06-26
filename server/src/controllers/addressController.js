import * as addressService from '../services/addressService.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';

export const getAddresses = async (req, res, next) => {
  try {
    const addresses = await addressService.getAddresses(req.user.id, req.accessToken);
    return sendSuccess(res, addresses, 'Addresses retrieved successfully');
  } catch (err) {
    return next(err);
  }
};

export const getAddressById = async (req, res, next) => {
  try {
    const address = await addressService.getAddressById(req.user.id, req.params.id, req.accessToken);
    if (!address) {
      return sendError(res, 404, 'Address not found');
    }
    return sendSuccess(res, address, 'Address retrieved successfully');
  } catch (err) {
    return next(err);
  }
};

export const addAddress = async (req, res, next) => {
  try {
    const addressData = req.body;
    
    // Simple validation
    if (!addressData.fullName || !addressData.phoneNumber || !addressData.address || !addressData.city || !addressData.state || !addressData.pincode || !addressData.addressType) {
      return sendError(res, 400, 'All required fields must be provided');
    }

    const newAddress = await addressService.addAddress(req.user.id, addressData, req.accessToken);
    return sendSuccess(res, newAddress, 'Address added successfully', 201);
  } catch (err) {
    return next(err);
  }
};

export const updateAddress = async (req, res, next) => {
  try {
    const addressData = req.body;

    // Simple validation
    if (!addressData.fullName || !addressData.phoneNumber || !addressData.address || !addressData.city || !addressData.state || !addressData.pincode || !addressData.addressType) {
      return sendError(res, 400, 'All required fields must be provided');
    }

    const updatedAddress = await addressService.updateAddress(req.user.id, req.params.id, addressData, req.accessToken);
    return sendSuccess(res, updatedAddress, 'Address updated successfully');
  } catch (err) {
    return next(err);
  }
};

export const deleteAddress = async (req, res, next) => {
  try {
    await addressService.deleteAddress(req.user.id, req.params.id, req.accessToken);
    return sendSuccess(res, null, 'Address deleted successfully');
  } catch (err) {
    return next(err);
  }
};

export const setDefaultAddress = async (req, res, next) => {
  try {
    const updatedAddress = await addressService.setDefaultAddress(req.user.id, req.params.id, req.accessToken);
    return sendSuccess(res, updatedAddress, 'Default address set successfully');
  } catch (err) {
    return next(err);
  }
};
