import { useState } from "react"

export const useModal = () => {
    const [modal, setModal] = useState(false)

    const onShow = () => setModal(true)
    const onClose = () => setModal(false)
    const onCancel = () => onClose()

    return { modal, setModal, onShow, onClose, onCancel }
}