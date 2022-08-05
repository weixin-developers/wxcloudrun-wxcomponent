package wx

import (
	"fmt"
	"github.com/WeixinCloud/wxcloudrun-wxcomponent/comm/config"
	"github.com/WeixinCloud/wxcloudrun-wxcomponent/comm/log"
	"github.com/WeixinCloud/wxcloudrun-wxcomponent/comm/wx/cloudbasetoken"
)

// GetComponentWxApiUrl 拼接微信开放平台的url，带第三方token
func GetComponentWxApiUrlCustomer(path string, query string) (string, error) {

	var protocol string
	if config.WxApiConf.UseHttps {
		protocol = "https"
	} else {
		protocol = "http"
	}
	url := fmt.Sprintf("%s://api.weixin.qq.com%s", protocol, path)

	if config.WxApiConf.UseCloudBaseAccessToken {
		return fmt.Sprintf("%s?access_token=%s%s",
			url, cloudbasetoken.GetCloudBaseAccessToken(), query), nil
	}
	if config.WxApiConf.UseComponentAccessToken {
		token, err := GetComponentAccessToken()
		if err != nil {
			log.Error(err)
			return "", err
		}
		return fmt.Sprintf("%s?access_token=%s%s",
			url, token, query), nil
	}
	return fmt.Sprintf("%s?%s", url, query), nil
}

// PostWxJsonWithComponentToken 以第三方身份向微信开放平台发起post请求
func PostWxJsonWithComponentTokenCustomer(path string, query string, data interface{}) (*WxCommError, []byte, error) {
	url, err := GetComponentWxApiUrlCustomer(path, query)
	if err != nil {
		return nil, []byte{}, err
	}
	return postWxJson(url, data)
}
