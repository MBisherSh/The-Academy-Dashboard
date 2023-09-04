import { createContext } from 'react';

const PermissionsContext = createContext({ permissions: {}, setPermissions: () => {} });

export default PermissionsContext;
