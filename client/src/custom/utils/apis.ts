import * as _apis from "../../utils/apis";

type IRequestMsg = {
    url: string
    method: "get" | "post" | "delete" | "put"
}

export const HOST = import.meta.env.DEV ? '/api/wxcomponent' : '/wxcomponent'

// 项目所有接口
export const apis = _apis

export const demoRequest: IRequestMsg =  {
    url: `${HOST}/test/demo`,
    method: 'post'
}
export const getAuthorListRequest: IRequestMsg = {
    url: `${HOST}/custom/pull-describeenvs-list`, // 获取环境列表
    method: "post"
}
export const shareEnvRequest: IRequestMsg = {
    url: `${HOST}/custom/share-describeenv`, // 分享环境
    method: "post"
}

//getAppletRequest
export const getAppletRequest: IRequestMsg = {
    url: `${HOST}/custom/applet-list`, // 获取小程序
    method: "get"
}
//getShareCloudbaseEnvRequest
export const getShareCloudbaseEnvRequest: IRequestMsg = {
    url: `${HOST}/custom/get-sharecloudbase-env`, // 获取分享的环境
    method: "post"
}
