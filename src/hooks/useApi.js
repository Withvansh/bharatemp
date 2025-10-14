import { useState, useEffect } from 'react';
import api from '../utils/axios';

export const useApi = (url, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await api.get(url, options);
        setData(response.data);
      } catch (err) {
        setError(err.message || 'An error occurred');
        console.error('API Error:', err);
      } finally {
        setLoading(false);
      }
    };

    if (url) {
      fetchData();
    }
  }, [url]);

  const refetch = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.get(url, options);
      setData(response.data);
    } catch (err) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, refetch };
};

export const useApiPost = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const post = async (url, data, options = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.post(url, data, options);
      return response.data;
    } catch (err) {
      setError(err.message || 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { post, loading, error };
};