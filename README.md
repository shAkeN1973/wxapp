# 说明文档
# 微信小程序组成结构
  组成页面：
## 主页
显示药盒目前状态，即药仓哪个是占用的，哪个是没用的
## 存药页面
共三个页面
### conditions(显示药物的状况)
页面逻辑：
从planIndex页面获取所得的药仓编号用于从缓存中获取药仓数据，若值``` start ```为``` false ```则开始mqtt的连接。
topic：``` app.globalData.client_ID.toString()+'/plans/'+mName.toString()+'/save'```
本客户端mqtt的clientId为usershAkeN。