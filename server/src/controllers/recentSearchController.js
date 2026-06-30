import * as recentSearchService from '../services/recentSearchService.js';
import { sendSuccess } from '../utils/apiResponse.js';

export const getRecentSearches = async (req, res, next) => {
  try {
    const data = await recentSearchService.getRecentSearches(req.user.id, req.accessToken);
    return sendSuccess(res, data);
  } catch (err) {
    return next(err);
  }
};

export const saveRecentSearch = async (req, res, next) => {
  try {
    const { query } = req.body;
    if (!query?.trim()) {
      return res.status(400).json({ success: false, message: 'query is required' });
    }
    await recentSearchService.saveRecentSearch(req.user.id, query, req.accessToken);
    return sendSuccess(res, null, 'Saved');
  } catch (err) {
    return next(err);
  }
};

export const deleteRecentSearch = async (req, res, next) => {
  try {
    const { query } = req.body;
    if (!query?.trim()) {
      return res.status(400).json({ success: false, message: 'query is required' });
    }
    await recentSearchService.deleteRecentSearch(req.user.id, query, req.accessToken);
    return sendSuccess(res, null, 'Deleted');
  } catch (err) {
    return next(err);
  }
};

export const clearRecentSearches = async (req, res, next) => {
  try {
    await recentSearchService.clearRecentSearches(req.user.id, req.accessToken);
    return sendSuccess(res, null, 'Cleared');
  } catch (err) {
    return next(err);
  }
};
