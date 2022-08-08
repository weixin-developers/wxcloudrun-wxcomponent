import {Button, Table, Tabs, Dialog, Input, Form, MessagePlugin, Popup, PopConfirm, Drawer} from 'tdesign-react'
import {useEffect, useMemo, useRef, useState} from "react";
import {PrimaryTableCol} from "tdesign-react/es/table/type";
import {request} from "../../utils/axios";
import {
    shareEnvRequest,
    getAuthorListRequest,
    getAppletRequest
    , getShareCloudbaseEnvRequest
} from "../utils/apis";


export default function extended() {

    const authMessageColumn: PrimaryTableCol[] = [{
        align: 'left',
        minWidth: 100,
        className: 'row',
        colKey: 'Env',
        title: '环境ID',
    },{
        align: 'left',
        minWidth: 100,
        className: 'row',
        colKey: 'Alias',
        title: '环境别名',
    },{
        align: 'left',
        minWidth: 100,
        className: 'row',
        colKey: 'Status',
        title: '环境状态',
    },{
        align: 'left',
        minWidth: 100,
        className: 'row',
        colKey: 'PackageName',
        title: '套餐中文名称',
    },{
        align: 'left',
        minWidth: 100,
        className: 'row',
        colKey: 'CreateTime',
        title: '创建时间',
    },{
        align: 'left',
        minWidth: 100,
        className: 'row',
        colKey: 'UpdateTime',
        title: '修改时间',
    },{
        align: 'center',
        minWidth: 100,
        className: 'row',
        colKey: 'id',
        title: '操作',
        render({row, rowIndex}) {
            return (
                <div>
                    <PopConfirm content={'确定分享环境吗'} onConfirm={() => handleShareEnv(rowIndex)}>
                        <a className="a">分享</a>
                    </PopConfirm>
                </div>
            );
        },
    }]

    const normalMessageColumn: PrimaryTableCol[] = [{
        align: 'left',
        minWidth: 100,
        className: 'row',
        colKey: 'appid',
        title: 'AppID',
    }, {
        align: 'center',
        minWidth: 100,
        className: 'row',
        colKey: 'nickname',
        title: '名称',
    }, {
        align: 'center',
        minWidth: 100,
        className: 'row',
        colKey: 'id',
        title: '操作',
        render({row, rowIndex}) {
            return (
                <div>
                    <a className="a" style={{marginRight: '15px'}}  onClick={() => handleLookEnv(rowIndex)}>查看</a>
                </div>
            );
        },
    }]

    const sharedEnvColumn: PrimaryTableCol[] = [{
        align: 'left',
        minWidth: 100,
        className: 'row',
        colKey: 'Env',
        title: '环境ID',
    }]

    const {TabPanel} = Tabs
    const {FormItem} = Form
    const form1Ref = useRef() as any

    const tabs = [{
        label: '环境',
        value: 'auth'
    }, {
        label: '小程序',
        value: 'normal'
    }]
    const [selectedTab, setSelectedTab] = useState<string | number>(tabs[0].value)
    const [isTableLoading, setIsTableLoading] = useState<boolean>(false)
    const [authData, setAuthData] = useState<any[]>([])
    const [sharedData, setSharedEnvData] = useState<any[]>([])
    const [normalData, setNormalData] = useState<any[]>([])
    const [showRuleModal, setShowRuleModal] = useState<boolean>(false)

    const handleCloseCreateModal = () => {
        setShowRuleModal(false)
    }

    useEffect(() => {
        handleAuthorList()
        getTableData()
    },[])

    //getAuthorListRequest
    const handleAuthorList = async () => {
        setIsTableLoading(true)
        switch (selectedTab) {
            case tabs[0].value: {
                const resp = await request({
                    request: getAuthorListRequest
                })

                if (resp.code === 0) {
                    setAuthData(resp.data.records.InfoList)
                }
                else
                {
                    //MessagePlugin.success('数据获取失败')
                }

                break
            }
        }
        setIsTableLoading(false)
    }

    //分享环境给小程序
    const handleShareEnv = async (index: number) => {
        const resp = await request({
            request: shareEnvRequest,
            data: {
                data:[{  env: authData[index].Env,
                    appids: ["wxad2ee6fa2df2c46d"],}],

            }
        })
        if (resp.code === 0) {
            MessagePlugin.success('分享成功')
        }
    }

    //handleLookEnv
    const handleLookEnv = async (index: number) => {
        const resp = await request({
            request: getShareCloudbaseEnvRequest,
            data: {
                appids: ["wxad2ee6fa2df2c46d"],
            }
        })
        if (resp.code === 0) {
            setSharedEnvData(resp.data.records)
            if(sharedData.length > 0)
            {
                setShowRuleModal(true)
            }

        }
    }

    const getTableData = async () => {
        setIsTableLoading(true)
        const resp = await request({
            request: getAppletRequest,
            data: {
                offset: 0,
                limit: 999
            }
        })
        if (resp.code === 0) {
            setNormalData(resp.data.rules)
        }
        setIsTableLoading(false)
    }

    const changeRuleOpen = async (index: number) => {
        let data: any = {}
        switch (selectedTab) {
            case tabs[0].value: {
                data = authData[index]
                break
            }
            case tabs[1].value: {
                data = normalData[index]
                break
            }
        }
    }

    return (
        <div>
            <Tabs value={selectedTab} placement={'top'} size="medium" theme="normal"
                  onChange={val => setSelectedTab(val)}>
                <TabPanel value={tabs[0].value} label={tabs[0].label}>
                    <div className="normal_flex" style={{margin: '10px 0'}}>
                        <Button style={{marginTop: '10px'}} onClick={() => handleAuthorList()}>获取环境列表</Button>
                    </div>
                    <Table
                        loading={isTableLoading}
                        data={authData}
                        columns={authMessageColumn}
                        rowKey="id"
                        tableLayout="auto"
                        verticalAlign="middle"
                        size="small"
                        hover
                    />
                </TabPanel>
                <TabPanel value={tabs[1].value} label={tabs[1].label}>
                    <div className="normal_flex" style={{margin: '10px 0'}}>
                        <Button style={{marginTop: '10px'}} onClick={() => getTableData()}>查询小程序</Button>
                    </div>
                    <Table
                        loading={isTableLoading}
                        data={normalData}
                        columns={normalMessageColumn}
                        rowKey="id"
                        tableLayout="auto"
                        verticalAlign="middle"
                        size="small"
                        hover
                    />
                </TabPanel>
            </Tabs>

            <Dialog visible={showRuleModal} onClose={handleCloseCreateModal} cancelBtn={false} confirmBtn={false}
                    header="环境列表">
                <div>
                    <TabPanel>
                        <Table
                            loading={isTableLoading}
                            data={sharedData}
                            columns={sharedEnvColumn}
                            rowKey="id"
                            tableLayout="auto"
                            verticalAlign="middle"
                            size="small"
                            hover
                        />
                    </TabPanel>
                </div>

            </Dialog>
        </div>
    )
}
