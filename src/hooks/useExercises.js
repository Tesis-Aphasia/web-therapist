import { useFirebaseSubscription } from './useFirebaseSubscription';
import { getVisibleExercises } from '../services/exercisesService';
import { useAuth } from './useAuth';

/**
 * Hook to get exercises data visible to the current therapist
 * @returns {Object} { exercises, loading, error, unsubscribe }
 */
export const useExercises = () => {
  const { getCurrentUserEmail } = useAuth();
  const therapistEmail = getCurrentUserEmail();

  const { data: exercises, loading, error, unsubscribe } = useFirebaseSubscription(
    (callback) => {
      if (!therapistEmail) {
        callback([]);
        return () => {};
      }
      return getVisibleExercises(therapistEmail, callback);
    },
    [therapistEmail]
  );

  return {
    exercises: exercises || [],
    loading,
    error,
    unsubscribe,
  };
};
