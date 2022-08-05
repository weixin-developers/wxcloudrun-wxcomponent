package custom

import (
	"net/http"

	"github.com/WeixinCloud/wxcloudrun-wxcomponent/comm/errno"
	"github.com/WeixinCloud/wxcloudrun-wxcomponent/comm/log"
	"github.com/WeixinCloud/wxcloudrun-wxcomponent/comm/wx"
	wxbase "github.com/WeixinCloud/wxcloudrun-wxcomponent/comm/wx/base"
	"github.com/WeixinCloud/wxcloudrun-wxcomponent/db/dao"
	"github.com/gin-gonic/gin"
)

type appletEnvResp struct {
	ID  int    `json:"id"`
	Env string `wx:"env"`
}

type shareCloudbaseEnvReq struct {
	Appids []string `wx:"appids"`
}

type shareCloudbaseResp struct {
	ErrCode      int            `wx:"errcode"`
	ErrMsg       string         `wx:"errmsg"`
	RelationData []relationData `wx:"relation_data"`
}

type relationData struct {
	Appid   string   `wx:"appid"`
	EnvList []string `wx:"env_list"`
}

type getListReq struct {
	Offset int `form:"offset"`
	Limit  int `form:"limit"`
}

type appletInfo struct {
	ID       int    `json:"id"`
	AppId    string `json:"appid"`
	NickName string `json:"nickname"`
}

type shareEnvReq struct {
	Data []envInfo `wx:"data"`
}

type shareDescribeEnvReq struct {
	EnvInfo []envInfo `wx:"envInfo"`
}

type envInfo struct {
	Env    string   `wx:"env"`
	Appids []string `wx:"appids"`
}

type getDescribeenvsListReq struct {
	ComponentAppid string `wx:"component_appid"`
}

type describeenvsListResp struct {
	ErrCode  int                `wx:"errcode"`
	ErrMsg   string             `wx:"errmsg"`
	InfoList []describeenvsInfo `wx:"info_list"`
}

type describeenvsInfo struct {
	Env          string `wx:"env"`
	Alias        string `wx:"alias"`
	CreateTime   string `wx:"create_time"`
	UpdateTime   string `wx:"update_time"`
	Status       string `wx:"status"`
	PackageId    string `wx:"package_id"`
	PackageName  string `wx:"package_name"`
	DbinstanceId string `wx:"dbinstance_id"`
	BucketId     string `wx:"bucket_id"`
}

func getDescribeenvsListHandler(c *gin.Context) {

	req := getDescribeenvsListReq{
		ComponentAppid: wxbase.GetAppid(),
	}
	token, err := wx.GetComponentAccessToken()
	_, body, err := wx.PostWxJsonWithComponentTokenCustomer("/componenttcb/describeenvs", token, req)
	if err != nil {
		log.Info(err)
		c.JSON(http.StatusOK, errno.ErrSystemError.WithData(err.Error()))
		return
	}

	var resp describeenvsListResp
	if err := wx.WxJson.Unmarshal(body, &resp); err != nil {
		log.Errorf("Unmarshal err, %v", err)
	}

	c.JSON(http.StatusOK, errno.OK.WithData(gin.H{"records": resp}))
}

//shareDescribeenvHandler
func shareDescribeenvHandler(c *gin.Context) {

	log.Info("分享环境ID")
	var req shareEnvReq
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusOK, errno.ErrInvalidParam.WithData(err.Error()))
		return
	}
	token, err := wx.GetComponentAccessToken()
	if err != nil {
		log.Info(err)
	}
	_, body, err := wx.PostWxJsonWithComponentTokenCustomer("/componenttcb/batchshareenv", token, req)
	log.Info("body")
	log.Info(string(body))
	if err != nil {
		log.Info(err)
	}

	c.JSON(http.StatusOK, errno.OK.WithData(gin.H{"total": 1}))
}

//getAppletListHandler
func getAppletListHandler(c *gin.Context) {

	log.Info("获取小程序")
	var req getListReq
	if err := c.ShouldBindQuery(&req); err != nil {
		c.JSON(http.StatusOK, errno.ErrInvalidParam.WithData(err.Error()))
		return
	}
	dbValue, total, err := dao.GetAppletList(req.Offset, req.Limit)
	if err != nil {
		c.JSON(http.StatusOK, errno.ErrSystemError.WithData(err.Error()))
		return
	}
	res := make([]appletInfo, 0, 10)
	for _, v := range dbValue {
		if err != nil {
			log.Errorf("Unmarshal err, %v", err)
		} else {
			res = append(res, appletInfo{
				ID:       v.ID,
				NickName: v.NickName,
				AppId:    v.Appid,
			})
		}
	}

	c.JSON(http.StatusOK, errno.OK.WithData(gin.H{
		"total": total,
		"rules": res,
	}))
}

//根据小程序ID获取已分享的环境
func getSharecloudbaseEnvHandler(c *gin.Context) {

	log.Info("根据小程序ID获取环境列表")
	var req shareCloudbaseEnvReq
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusOK, errno.ErrInvalidParam.WithData(err.Error()))
		return
	}
	token, err := wx.GetComponentAccessToken()
	if err != nil {
		log.Info(err)
	}
	_, body, err := wx.PostWxJsonWithComponentTokenCustomer("/componenttcb/batchgetenvid", token, req)
	var resp shareCloudbaseResp
	if err := wx.WxJson.Unmarshal(body, &resp); err != nil {
		log.Errorf("Unmarshal err, %v", err)
	}
	env := make([]appletEnvResp, 0, 10)
	for i, info := range resp.RelationData[0].EnvList {
		env = append(env, appletEnvResp{
			ID:  i,
			Env: info,
		})
	}

	c.JSON(http.StatusOK, errno.OK.WithData(gin.H{"records": env}))
}
