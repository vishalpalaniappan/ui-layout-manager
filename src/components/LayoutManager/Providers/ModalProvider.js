import React, {
    createContext,
    useCallback,
    useContext,
    useMemo,
    useState,
} from "react";

import { createPortal } from "react-dom";

const ModalContext = createContext(null);

export function ModalProvider({ children }) {
    const [modal, setModal] = useState(null);

    const openModal = useCallback(({ args }) => {
        console.log("Opening modal with title:", args.title);
        const close = () => {
            setModal(null);
        };

        const id = `modal-${Date.now()}`;
        setModal({
            id: id,
            title: args.title,
            render: args.render,
            close: close,
        });

        return { id, close };
    }, []);

    const closeModal = useCallback(() => {
        setModal(null);
    }, []);

    const getPortal = () => {
        return createPortal(
            <>
                {modal && (
                    <React.Fragment key={modal.id}>
                        <div className="modal-backdrop" onClick={modal.close}>
                            <div
                                className="modal-content"
                                onClick={(e) => e.stopPropagation()}
                            >
                                {modal.title && <h2>{modal.title}</h2>}
                                {modal.render({ close: modal.close })}
                            </div>
                        </div>
                    </React.Fragment>
                )}
            </>,
            document.body,
        );
    };

    const api = useMemo(
        () => ({
            openModal,
            closeModal,
        }),
        [openModal, closeModal],
    );

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
export function useModalManager() {
    const value = useContext(ModalContext);
    if (!value) {
        throw new Error("useModalManager must be used inside ModalProvider");
    }
    return value;
}
