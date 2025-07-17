import {createContext} from "react";

// This context stores the registry for the components.
const ComponentRegistryContext = createContext({});
ComponentRegistryContext.displayName = 'ComponentRegistryContext';

export default ComponentRegistryContext;
