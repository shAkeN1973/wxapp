//index.js
//获取应用实例
const app = getApp()
import mqtt from '../../library/mqtt.js';

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    time: (new Date()).toString(),
    client:null
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../plan/plan'
    })
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
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
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  testName: function (testValue) {
    testValue = "test";
    console.log(this.testValue);
    console.log(testValue);
    this.setData(
      { time: 20 });
    wx.navigateTo({
      url: '../getUserInfo/getUserInfo',
    })
  },

  mqttTry:function(){
    var that = this;
    that.data.client = app.globalData.client;
    that.data.client.on('connect', e => {
      console.log("ok");
      that.data.client.subscribe('ask', function (err) {
        if (!err) {
            console.log("here")
            that.data.client.on('message', function (topic, message) {
              if(topic=='ask'){            console.log(message.toString());
            that.data.client.end();}
          })
        }
      },)
    });
  }
})
