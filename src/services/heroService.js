// services/heroService.js
import api from './api'

const BASE_URL = '/hero'

const handleSuccess = (response) => {
  if (response.data && response.data.success !== undefined) {
    return response.data
  }
  return {
    success: true,
    data: response.data?.data || response.data,
    message: response.data?.message || 'Operation successful',
    status: response.status
  }
}

const handleError = (error) => {
  if (!error.response) {
    return {
      success: false,
      message: 'Network error. Please check your internet connection.',
      status: 0,
      code: 'NETWORK_ERROR'
    }
  }
  const { status, data } = error.response
  return {
    success: false,
    message: data?.message || `Error ${status}`,
    status,
    code: data?.code || 'UNKNOWN_ERROR',
    data: data?.data || null
  }
}

const heroService = {
  async getSlides() {
    try {
      const response = await api.get(`${BASE_URL}/slides`)
      return handleSuccess(response)
    } catch (error) {
      return handleError(error)
    }
  },

  async saveSlide(index, slideData) {
    try {
      const response = await api.put(`${BASE_URL}/slides/${index}`, slideData)
      return handleSuccess(response)
    } catch (error) {
      return handleError(error)
    }
  },

  async saveAllSlides(slides) {
    try {
      const response = await api.post(`${BASE_URL}/slides`, { slides })
      return handleSuccess(response)
    } catch (error) {
      return handleError(error)
    }
  },

  async clearSlide(index) {
    try {
      const response = await api.delete(`${BASE_URL}/slides/${index}`)
      return handleSuccess(response)
    } catch (error) {
      return handleError(error)
    }
  },

  async resetAll() {
    try {
      const response = await api.post(`${BASE_URL}/slides/reset`)
      return handleSuccess(response)
    } catch (error) {
      return handleError(error)
    }
  }
}

export default heroService
