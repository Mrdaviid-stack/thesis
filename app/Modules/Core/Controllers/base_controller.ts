import { cuid } from "@adonisjs/core/helpers";
import { HttpContext } from "@adonisjs/core/http";
import app from "@adonisjs/core/services/app";
import { LucidModel } from "@adonisjs/lucid/types/model";

interface BaseControllerConstructor {
    model: LucidModel
    files?: string[]
    path?: string
}
export default class BaseController {
    model
    files
    path
    constructor({model, files = [], path}: BaseControllerConstructor) {
        if (model)
            this.model = model

        if (path)
            this.path = path

        if (files.length > 0)
            this.files = files
    }

    async index({ inertia }: HttpContext) {
        return inertia.render(this.path!, {
            datatable: await this.model?.all()
        })
    }

    async form({ inertia, params }: HttpContext) {
        if (params.id) {
            return inertia.render(this.path + '_form', {
                record: await this.model?.findOrFail(params.id)
            })
        }
        return inertia.render(this.path + '_form')
    }

    async store({ request, response, params }: HttpContext) {
        let data = request.body()
        
        if (this.files) {
            await Promise.all(this.files.map(async (file) => {
                const docs = request.file(file) 
                const date = new Date()
                await docs!.move(app.makePath(`public/uploads/${date.getFullYear()}/${date.getDate()}/`), {
                    name: `${cuid()}.${docs!.extname}`
                })
                data[file] = docs?.filePath!.split('\\').slice(-4).join('\\')     
                
            }))
        }

        if (params.id) {
            const record = await this.model!.findOrFail(params.id)
            await record.merge(data).save()
            return response.status(201).json({
                success: true,
                message: `successfully updated.`,
            })
        }

        const record = await this.model!.create(data)
        return response.status(200).json({
            success: true,
            message: `successfully added.`,
            data: record
        })
    }


    async delete({ response, params }: HttpContext) {
        const record = await this.model?.findOrFail(params.id)
        await record?.delete()
        response.status(201).json({
            success: true,
            message: 'Successfully deleted.'
        })
    }


}