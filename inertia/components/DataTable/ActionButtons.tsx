import React from "react"

interface IAbilitiesKey {
    canEdit: boolean,
    canDelete: boolean,
}

interface IActionButton {
    abilities: IAbilitiesKey
    handleUpdate: (data: any) => any
    handleDelete: () => void
}

export default function ActionButton({ abilities, handleUpdate, handleDelete }: IActionButton) {
    //const { hasAbility } = useStore()

    return (
        <>
            <div className="d-flex  gap-3">
                {   
                    abilities.canEdit &&
                        <button onClick={handleUpdate} className="btn btn-warning"><i className="fa-regular fa-pen-to-square"></i> Edit</button>
                }
                {
                    abilities.canDelete &&
                        <button onClick={handleDelete} className="btn btn-danger"><i className="fa-regular fa-trash"></i> Delete</button>
                }

            </div>
        </>
    )
}