import React, {createContext, useContext} from "react";

const ModalContext = createContext(null);

export function ModalProvider ({children}) {

    return (
        <ModalContext.Provider value={{}}>
            {children}
        </ModalContext.Provider>
    );
};

export function useModalManager () {
    const api = useContext(ModalContext);
    if (!api) {
        throw new Error("useModalManager must be used inside ModalProvider");
    }
    return api;
}
