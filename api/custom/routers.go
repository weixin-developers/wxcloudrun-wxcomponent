package custom

import (
	"github.com/WeixinCloud/wxcloudrun-wxcomponent/middleware"
	"github.com/gin-gonic/gin"
)

// Routers 路由
func Routers(e *gin.RouterGroup) {

	g := e.Group("/custom", middleware.JWTMiddleWare)
	// 获取环境列表
	g.POST("/pull-describeenvs-list", getDescribeenvsListHandler)

	// 分享环境
	g.POST("/share-describeenv", shareDescribeenvHandler)

	// 小程序
	g.GET("/applet-list", getAppletListHandler)

	//get-sharecloudbase-env
	g.POST("/get-sharecloudbase-env", getSharecloudbaseEnvHandler)

}
