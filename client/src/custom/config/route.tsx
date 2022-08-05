import { IRoute } from "../../commonType";
import Extended from "../extended/c_index";

// 页面路由
export const customRoute: IRoute = {
    extended: {
        label: '环境管理',
        path: '/extended',
        element: <Extended />
    }
}
