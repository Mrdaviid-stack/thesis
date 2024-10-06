import router from "@adonisjs/core/services/router";
import ReportsController from "../Controllers/reports_controller.js";

export default function ReportsRoute() {
    router.group(() => {

        router.get('/sales', [ReportsController, 'sales'])
        router.get('/sales/generate', [ReportsController, 'generateSales'])

    }).prefix('reports')
}