import router from "@adonisjs/core/services/router";
import GroupsController from "../Controllers/groups_controller.js";
import PermissionsController from "../Controllers/permissions_controller.js";
import UsersController from "../Controllers/users_controller.js";

const AdminRouter = () => {
    router.group(() => {
        router.get('/', [GroupsController, 'index'])
        //router.get('/records', [GroupsController, 'getAll'])
        router.post('/add/:id?', [GroupsController, 'store'])
        router.delete('/:id', [GroupsController, 'delete'])
    }).prefix('/admin/groups')
    
    router.group(() => {
        router.get('/', [PermissionsController, 'getAll'])
        router.get('/:id', [PermissionsController, 'getById'])
        router.post('/:id', [PermissionsController, 'updateGroupPermissions'])
    }).prefix('/admin/permissions')

    router.group(() => {
        router.get('/', [UsersController, 'index'])
        router.get('/form/:id?', [UsersController, 'form'])
        router.post('/add/:id?', [UsersController, 'store'])
        router.patch('/update/status/:id', [UsersController, 'updateUserStatus'])
        router.delete('delete/:id', [UsersController, 'delete'])
        router.get('/permissions', [UsersController, 'userGroupPermissions'])
    }).prefix('/admin/users')
}

export default AdminRouter