import React, {createContext, useCallback, useContext, useMemo, useState} from "react";

import {createPortal} from "react-dom";

const ModalContext = createContext(null);

export function ModalProvider ({children}) {
    const [modal, setModal] = useState(null);

    const openModal = useCallback((render) => {
        const close = () => {
            setModal(null);
        };
        
        const id = `modal-${Date.now()}`;
        setModal({id, render, close});

        return {id, close};
    }, []);

    const closeModal = useCallback(() => {
        setModal(null);
    }, []);


    const getPortal = () => {
        return createPortal(
            <>
                {modal && (
                    <React.Fragment key={modal.id}>
                        {modal.render({close: modal.close})}
                    </React.Fragment>
                )}
            </>,
            document.body
        );
    };

    const api = useMemo(() => ({
        openModal,
        closeModal,
    }), [openModal, closeModal]);

    return (
        <ModalContext.Provider value={api}>
            {children}
            {getPortal()}
        </ModalContext.Provider>
    );
}

/**
 * Modal manager hook to access the modal API
 * @return {Object} The modal manager API
 */
export function useModalManager () {
    const value = useContext(ModalContext);
    if (!value) {
        throw new Error("useModalManager must be used inside ModalProvider");
    }
    return value;
}
