import { FC, ReactNode, useEffect, useRef } from "react";
import { createPortal } from "react-dom"
import { Modal as BSModal } from 'bootstrap'

interface IModal {
    size?: 'modal-md' | 'modal-lg' | 'modal-xl'
    show: boolean;
    handleClose: () => void;
    title: string;
    children: ReactNode;
    position?: 'modal-dialog-centered'
}

export const Modal: FC<IModal> = ({
    size,
    show,
    handleClose,
    title,
    children,
    position,
}) => {
    const modalRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (show) {        
            const modalElement = modalRef.current
            if (modalElement) {
                const modal =new BSModal(modalElement, {
                    backdrop: 'static', 
                    keyboard: false,
                })
                modal.show()
                return () => {
                    modal.hide()
                }
            }  
        }
    }, [show])

    return createPortal(
        <div
            className={`modal fade ${show ? 'show' : ''} ${size}`}
            tabIndex={-1}
            aria-labelledby="modal"
            aria-hidden={!show}
            style={{ display: show ? 'block' : 'none' }}
            ref={modalRef}

        >
            <div className={`modal-dialog ${position}`}>
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLabel">{title}</h5>
                        <button type="button" className="btn-close" onClick={handleClose}><i className="fa-solid fa-x text-dark"></i></button>
                    </div>
                    <div className="modal-body">
                        {children}
                    </div>
                </div>
            </div>
        </div>,
        document.body
    )
}
