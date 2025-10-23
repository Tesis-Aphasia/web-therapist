import { useFirebaseSubscription } from './useFirebaseSubscription';
import { getPatientsByTherapist } from '../services/therapistService';
import { useAuth } from './useAuth';

/**
 * Hook to get patients data for the current therapist
 * @returns {Object} { patients, loading, error, unsubscribe }
 */
export const usePatients = () => {
  const { getCurrentUserEmail } = useAuth();
  const therapistEmail = getCurrentUserEmail();

  const { data: patients, loading, error, unsubscribe } = useFirebaseSubscription(
    (callback) => {
      if (!therapistEmail) {
        callback([]);
        return () => {};
      }
      return getPatientsByTherapist(therapistEmail, callback);
    },
    [therapistEmail]
  );

  return {
    patients: patients || [],
    loading,
    error,
    unsubscribe,
  };
};
