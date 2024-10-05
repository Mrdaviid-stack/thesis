import router from "@adonisjs/core/services/router";
import FilesController from "../Controllers/files_controller.js";

const FilesRouter = () => {
    router.group(() => {
        router.post('/upload', [FilesController, 'upload'])
    }).prefix('files')
}

export default FilesRouter