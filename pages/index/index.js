//index.js
//获取应用实例
const app = getApp()
import mqtt from '../../library/mqtt.js';
//const aliyunOpt = require('../../utils/aliyun/aliyun_connect.js')
const host =
  'wxs://www.xjtuzhijiysx.cn/mqtt';
const options = {
  protocolVersion: 4, //MQTT连接协议版本
  clientId: randomString(10),
  clean: true,
  //username: '1v1r5ep',
  //password: 'tNVKODyl2chbm5yp',
  reconnectPeriod: 1000,
  connectTimeout: 30 * 1000,
  resubscribe: true
};
Page({
  data: {
    client: null,  //
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    time:(new Date()).toString()
  },
  
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../plan/plan'
    })
  },
  onLoad: function () {
    
    
    //验证网络请求，getUserInfo
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  
  testName: function(testValue){
    testValue="test";
    console.log(this.testValue);
    console.log(testValue);
    const client = mqtt.connect(host, options);
    console.log(options.clientId);
    
    
    this.setData(
      {time:20});
  wx.navigateTo({
      url: '../getUserInfo/getUserInfo',
    })
//old ends here

    var that = this;
    that.data.client=app.globalData.client;
    that.data.client.on('connect',e=>{
      console.log("ok");
      that.data.client.subscribe('presence',function(err){
        if(!err)
        {
          that.data.client.publish('presence','my first mqtt connection')
        }
      })
    });
    that.data.client.on('message',function(topic,message){
      console.log(message.toString());
      that.data.client.end();
      
    })
  
  },
 
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

function log(){
  console.log("ok");
}