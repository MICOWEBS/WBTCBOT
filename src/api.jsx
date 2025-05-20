import { createContext, useContext } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Create a context for the API
const ApiContext = createContext(null);

export function createApi(token) {
  const getHeaders = (contentType = 'application/json') => {
    const headers = {
      'Content-Type': contentType,
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  };

  const handleResponse = async (response) => {
    if (response.status === 401) {
      throw new Error('unauthorized');
    }
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.detail || 'Request failed');
    }
    return response.json();
  };

  const get = async (endpoint) => {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'GET',
      headers: getHeaders(),
      credentials: 'include',
    });
    return handleResponse(response);
  };

  const post = async (endpoint, data) => {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
      credentials: 'include',
    });
    return handleResponse(response);
  };

  const postForm = async (endpoint, formData) => {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers: getHeaders('application/x-www-form-urlencoded'),
      body: formData,
      credentials: 'include',
    });
    return handleResponse(response);
  };

  const put = async (endpoint, data) => {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data),
      credentials: 'include',
    });
    return handleResponse(response);
  };

  const del = async (endpoint) => {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'DELETE',
      headers: getHeaders(),
      credentials: 'include',
    });
    return handleResponse(response);
  };

  return {
    get,
    post,
    postForm,
    put,
    delete: del,
  };
}

// Create a provider component
export function ApiProvider({ children, token }) {
  const api = createApi(token);
  return (
    <ApiContext.Provider value={api}>
      {children}
    </ApiContext.Provider>
  );
}

// Create a hook to use the API
export function useApi() {
  const api = useContext(ApiContext);
  if (!api) {
    throw new Error('useApi must be used within an ApiProvider');
  }
  return api;
} 