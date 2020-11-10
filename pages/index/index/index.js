//index.js
//获取应用实例
//这项目必能进国赛
const app = getApp()
import mqtt from '../../../library/mqtt.js';
var plugin = requirePlugin("WechatSI")
let manager = plugin.getRecordRecognitionManager();
var wxChart = require('./../../../utils/wxcharts.js');   //这里引入折线图组件
var chart=null;



Page({
  data: {                    //page页面数据定义
    client: null,  
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    time:(new Date()).toString(),
    hidden:true,
    oColor:"#8dc63f",
    noColor:"#ff0000",
    pickNumber:"0",//选定的数字
    show:false,//m模态窗口显示
    numberArray:null,
    toolPlan:null,
    freeRoom:'',
    connectConfirm:false
  },


  drawCanvas:function(){  //进行画布的修改
    let draw = wx.createCanvasContext('tryCanvas');  //获得canvas实例
    draw.translate(100, 100);
    var numberArray = wx.getStorageSync('nmsl');//获得缓存中储存的数组元素
    this.setData({
      numberArray:numberArray
    })
    for(let i=0;i<8;i++){         //画圆
    draw.beginPath();
    draw.setLineWidth(4);
    draw.setStrokeStyle('white')
    draw.setLineJoin('round');
    draw.arc(0, 0, 90, Math.PI * 0.25*i+0.01,Math.PI*0.25*(i+1)-0.01);   //画圆
    if(numberArray[i]){
      draw.setFillStyle('orange');}
    else{
      draw.setFillStyle('#39b54a');
      this.data.freeRoom = this.data.freeRoom+(i+1).toString()+',';
    }
    draw.lineTo(0, 0);
    draw.closePath();           //闭合当前路径
    draw.stroke();
    draw.fill();
    if((i+1)==1){
    draw.draw()}
    else{
      draw.draw('true');
    }
    }
    this.setData({
      freeRoom: this.data.freeRoom.substr(0, this.data.freeRoom.length - 1)
    })
    // console.log(this.data.freeRoom);
    draw.beginPath(); //画内圆
    draw.arc(0,0,50,0,Math.PI*2);
    draw.setFillStyle('white');
    draw.fill();
    draw.draw('true');

  for(let i=0;i<8;i++){
    draw.beginPath();//添加文字
    // draw.rotate(0-0.5*Math.PI);
    draw.setFontSize(20);
    //draw.moveTo(70*Math.cos(0.125*Math.PI),70*Math.sin(0.125*Math.PI))
    draw.setFillStyle('black');
    draw.setTextAlign('center');
    draw.setTextBaseline('middle')
    draw.font = 'italic bold 20px 微软雅黑'
    draw.fillText((i+1).toString(), 70 * Math.cos(0.125 * Math.PI * (2*i+1)), 70 * Math.sin(0.125 * Math.PI*(2*i+1)));
    draw.draw('true');
  }
  },





  start(e) { //选定当前药仓
    var x=e.touches[0].x-100;
    var y=e.touches[0].y-100;
    var pickNumber=0; //选取的数字
    var angle =360 * Math.atan(y/x) / (2 * Math.PI); //计算选取的角度
    if(angle>0&&angle<45)
    {
      if(x>0)
      {
        pickNumber=1;
      }
      else
      {
        pickNumber=5;
      }
    }
    else if (angle > 45){
      if(x>0)
      {
        pickNumber=2;
      }
      else{
        pickNumber=6;
      }
    }
    if (angle<0 && angle<-45) {
      if (x > 0) {
        pickNumber = 7;
      }
      else {
        pickNumber = 3;
      }
    }
    else if (angle < 0 && angle >-45){
      if (x > 0) {
        pickNumber = 8;
      }
      else {
        pickNumber = 4;
      }
    }
    if(this.data.numberArray[pickNumber-1]){     
    this.setData({
      hidden: false,
      x: e.touches[0].x,
      y: e.touches[0].y,
      pickNumber:pickNumber,
      show:true
    })}
    this.getPlans(pickNumber);
  },




  hideModal(){   //隐藏模态框
    this.setData({
      show:false,
      pickNumber:0
    })
  },




  getPlans(number){  //获得药仓所对应的服药计划
    var toolPlan = wx.getStorageSync(number.toString());
    this.setData({
      toolPlan:toolPlan
    })
  },

  move(e) {
    this.setData({
      x: e.touches[0].x,
      y: e.touches[0].y
    })
  },
  end(e) {
    this.setData({
      hidden: true
    })
  },



  
 
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../plan/creatPlans'
    })
  },


  onLoad: function () {
    console.log('hello world')
    this.showTemperature();
    this.initialization();          //调用设置缓存函数，保证不用手动添加
    this.drawCanvas();              //调用画布函数
    if(app.globalData.client){
      this.setData({
        connectConfirm:true
      })
    }
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
  
  getUserInfo: function(e) {   //云函数开♂fa
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  

  getUserInfoCloud(){   //云函数能力获取
    var that=this;
    wx.cloud.callFunction({
      name:'getOpenID',
      success:res=>{
        console.log("获取的openID",res.result);
      }
    })
  },
  




scanCodeSelf(){   //扫码组件
  wx.scanCode({
    success:e=>{
      console.log(e);
    }
  })
},
  

initialization:function(){           //缓存数组编号
try{
  var value=wx.getStorageSync('nmsl')
  if(value)
  {
    console.log('not first')
  }
  else{
    var numberArray = new Array();
    for (let i = 0; i < 8; i++) {
      numberArray.push(null);
    }
    wx.setStorage({
      key: "nmsl",
      data: numberArray,
      success: function () {
        console.log("success");
      }
    })
  }
}catch(e){
    console.log(e);
  }
},

showTemperature:function(){
  var windowWidth=300;
  chart=new wxChart({
    canvasId:'test',
    type:'line',
    categories:['1','2','3','4','5','6','7','8','9','10','11','12'],
    animation: true,
    //background: '#f5f5f5',
    series:[{
      name:'1号药仓温度',
      data:[25,24,23,25,23,25,25,25,24,21,24,25],
      format:function (val,name){
        return val.toFixed(2)
      }
    },{
      name:'2号药仓温度',
      data:[24,24,23,23,23,22,23,25,24,25,24,22],
      format:function (val,name){
        return val.toFixed(2)
      }
    }
    ],
    xAxis:{
      disableGrid:true
    },
    yAxis:{
      title:'今天各药仓温度',
      formate:function(val){
        return val.toFixed(2);
      },
    max:30,
    min:10
    },
    width:windowWidth,
    height:200,
    dataLabel:false,
    dataPointShape:true,
    extra:{
      lineStyle:'curve'
    }
  })

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

function log(){
  console.log("ok");
}

function playVoice(text){
  plugin.textToSpeech({
    lang: "zh_CN",
    tts: true,
    content: text,
    success: function(res) {
        console.log("succ tts", res.filename);
        const innerAudioContext = wx.createInnerAudioContext();
        innerAudioContext.autoplay = true
        innerAudioContext.src = res.filename.toString()
          innerAudioContext.onPlay(() => {
            console.log('开始播放')
          })
          innerAudioContext.onError((res) => {
            console.log(res.errMsg)
            console.log(res.errCode)
          })
    },
    fail: function(res) {
        console.log("fail tts", res)
    }
})
}