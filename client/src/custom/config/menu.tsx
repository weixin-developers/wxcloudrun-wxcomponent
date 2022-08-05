import {IMenuList} from "../../commonType";
import { customRoute as routes } from '../config/route'
import * as Icon from "tdesign-icons-react";

// 页面menu
export const customMenuList: IMenuList = [    {
    label: '扩展功能',
    icon: <Icon.AppIcon />,
    item: [routes.extended]
}]
