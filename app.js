//app.js
import mqtt from './library/mqtt.js';

const host =
'wxs://www.xjtuzhijiysx.cn/mqtt';
const options = {
  protocolVersion: 4, //MQTT连接协议版本
  //clientId: randomString(10),
  clientId: "abcdefg",
  clean: true,
  //username: '1v1r5ep/zhihu_iamliubo',
  //password: 'tNVKODyl2chbm5yp',
  reconnectPeriod: 1000,
  connectTimeout: 30 * 1000,
  resubscribe: true
};
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    //get system information
    /*wx.getSystemInfo({
      success: e => {
        this.globalData.StatusBar = e.statusBarHeight;
        let custom = wx.getMenuButtonBoundingClientRect();
        this.globalData.Custom = custom;
        this.globalData.CustomBar = custom.bottom + custom.top - e.statusBarHeight;
      }
    })*/
  
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    }),
      wx.getSystemInfo({
        success: e => {
          this.globalData.StatusBar = e.statusBarHeight;
          let capsule = wx.getMenuButtonBoundingClientRect();
          if (capsule) {
            this.globalData.Custom = capsule;
            //this.globalData.CustomBar = capsule.bottom + capsule.top - e.statusBarHeight;
          } else {
            //this.globalData.CustomBar = e.statusBarHeight + 50;
          }
        }
      })
  },


  globalData: {
    userInfo: null,
    client_ID: randomString(10),
    client: mqtt.connect(host, options),
  }
})


function randomString(len) {
  len = len || 32;
  var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
  var maxPos = $chars.length;
  var pwd = '';
  for (let i = 0; i < len; i++) {
    pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return pwd;
}