// @ts-nocheck
import React, {
    createContext,
    useCallback,
    useContext,
    useMemo,
    useState,
    useRef
} from "react";

import { createPortal } from "react-dom";

import {XLg} from "react-bootstrap-icons";

const ModalContext = createContext(null);

/**
 * Modal provider component to manage modals in the application
 * @returns {JSX} The modal provider component
 */
export function ModalProvider({ children }) {
    const [modal, setModal] = useState(null);
    const downOnContentRef = useRef(false);

    // Open a modal with the given content and title. Returns a function to close the modal.
    const openModal = useCallback(( args ) => {
        const close = () => {
            setModal(null);
        };

        const id = `modal-${Date.now()}`;
        setModal({
            id: id,
            title: args.title,
            args: args.args,
            render: args.render,
            close: close,
        });

        return { id, close };
    }, []);

    // Close the currently open modal
    const closeModal = useCallback(() => {
        setModal(null);
    }, []);


    // Prevent close when mouse first down on content
    // and then dragged onto backdrop
    const clickedBackdrop = (e) => {
        e.stopPropagation()
        if (!downOnContentRef.current) {
            closeModal();
        }
        downOnContentRef.current = false;
    }

    const downOnContent = (e) => {
        e.stopPropagation()
        downOnContentRef.current = true;
    }

    // Render the modal portal
    // TODO: Add support for different sizes
    const getPortal = () => {
        return createPortal(
            <>
                {modal && (
                    <React.Fragment key={modal.id}>
                        <div className="modal-backdrop" onClick={clickedBackdrop}>
                            <div className="modal-content"  onMouseDown={downOnContent}>
                                <div className="modal-header">
                                    <span className="title">{modal.title}</span>
                                    <XLg className="close-button" onClick={modal.close} />
                                </div>
                                <div className="modal-body">
                                    {modal.render({ close: modal.close , args: modal.args })}
                                </div>
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
