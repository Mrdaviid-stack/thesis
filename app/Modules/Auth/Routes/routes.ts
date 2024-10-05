import router from "@adonisjs/core/services/router";
import AuthController from "../Controllers/auth_controller.js";

const AuthRouter = () => {
    router.get('/login', [AuthController, 'index'])
    router.post('/login', [AuthController, 'login'])
    router.get('/logout', [AuthController, 'logout'])
}

export default AuthRouter