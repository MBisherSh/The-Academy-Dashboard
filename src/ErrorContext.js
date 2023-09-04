import { createContext } from 'react';

const ErrorContext = createContext({ error: { inError: false, errorMessage: '' }, setError: () => {} });

export default ErrorContext;
