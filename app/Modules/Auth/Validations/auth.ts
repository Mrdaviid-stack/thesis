import vine from '@vinejs/vine'

export const loginValidation = vine.compile(
    vine.object({
        identity: vine.string(),
        password: vine.string()
    })
)