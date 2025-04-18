import { useState, useCallback } from 'react';

interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

type ApiFunction<T, P> = (params: P) => Promise<T>;

function useApi<T, P = void>(apiFunction: ApiFunction<T, P>) {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null
  });
  
  // Execute the API call
  const execute = useCallback(async (params: P) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const data = await apiFunction(params);
      setState({ data, loading: false, error: null });
      return { data, error: null };
    } catch (err) {
      const errorMessage = err instanceof Error 
        ? err.message 
        : 'An unexpected error occurred';
      setState({ data: null, loading: false, error: errorMessage });
      return { data: null, error: errorMessage };
    }
  }, [apiFunction]);
  
  // Reset the state
  const reset = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null
    });
  }, []);
  
  return {
    ...state,
    execute,
    reset
  };
}

export default useApi; 