import { useState, useEffect, useRef } from 'react';

/**
 * Generic hook for Firebase subscriptions
 * @param {Function} subscribeFn - Function that returns unsubscribe function
 * @param {Array} dependencies - Dependencies array for useEffect
 * @returns {Object} { data, loading, error, unsubscribe }
 */
export const useFirebaseSubscription = (subscribeFn, dependencies = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const unsubscribeRef = useRef(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    try {
      const unsubscribe = subscribeFn((newData) => {
        setData(newData);
        setLoading(false);
      });

      unsubscribeRef.current = unsubscribe;

      return () => {
        if (unsubscribeRef.current) {
          unsubscribeRef.current();
        }
      };
    } catch (err) {
      setError(err);
      setLoading(false);
    }
  }, dependencies);

  const unsubscribe = () => {
    if (unsubscribeRef.current) {
      unsubscribeRef.current();
      unsubscribeRef.current = null;
    }
  };

  return {
    data,
    loading,
    error,
    unsubscribe,
  };
};
