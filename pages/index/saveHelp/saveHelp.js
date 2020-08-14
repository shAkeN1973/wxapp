const app = getApp();
var util = require('../../../utils/util.js');
var plugin = requirePlugin("WechatSI");

Page({
  data:{
    number:null,
    client:null,
    plan:null,
    showLoading:true,       //展示是否正在进行mqttt连接
    date:null,
    amount:null,            //药物数量
    success:false,          //是否存药成功
    voiceStart:false,       //是否开始语音辅助存药
    playHelpGif:false
  },

  onLoad:function(options){                 //获取从上个页面传过来的药仓数字
    var that=this;
    this.data.client=app.globalData.client;  //初始化
    var plan=wx.getStorageSync(options.number.toString());
    var today = util.formatTime(new Date());  //获得今天的日期
    today=today.substring(0,10);              //字符串截取
    this.setData({
        plan:plan,
        date:today
      })
    this.caluNumbers();
   if(app.globalData.CONNECT)                //测试mqtt是否已经连接，利用全局数据里的数据对此数据进行初始化
        that.setData({
          showLoading:false
    })
    this.setData({
      plan:plan,
      number:options.number
    })

    this.data.client.subscribe(this.subscribeTopicConnect(plan.name),function(err){
      if(!err){
        console.log('订阅成功')
      }
      that.data.client.on('message',function(message){
        console.log(message.toString())
        var exp=new RegExp('ok','g'); //设立正则表达式，匹配message中的ok字样
        if(exp.test(message.toString())){
          that.data.plan.start=true;
          that.setData({
            success:true,
            plan:plan
          })
          wx.setStorage({
            key: that.data.number.toString(),
            data: that.data.plan,
          });
        }  
      })
    })
    


  },

  subscribeTopicConnect:function(mName){                             //进行mqtt的topic的拼接
    return app.globalData.client_ID.toString()+'/plans/'+mName.toString()+'/save'
  },


  caluNumbers:function(){                   //进行药物数量的计算
    var that=this;
    console.log(this.data.plan);
    var Amount=that.data.plan.drugsInOneDay*that.data.plan.dateArray.length*that.data.plan.timer.length;
    
    this.setData({
      amount:Amount
    })
  },

  manual:function(){
    if(!this.data.success){
      this.data.plan.start=true;
      console.log(this.data.plan);
      wx.setStorage({
        key: this.data.number.toString(),
        data: this.data.plan,
      });
      this.backToCondition();
    }
  },

  backToCondition:function(){
    var urlNumber="../../plan/conditions/conditions?number="+this.data.number.toString();    //拼接url
    wx.redirectTo({
      url: urlNumber,
    }, success => {
      console.log('sucess')
    })
  },

  voiceHelp:function(){
    this.setData({
      voiceStart:true
    })
    var voice="请确认存入的药物是："+this.data.plan.name
    playVoice(voice);
  },


  playHelpGif:function(){
    this.setData({
      voiceStart:false,
      playHelpGif:true
    })
    var step1="请遵照图片指示将药物存放到相应位置"
    var step2="请按动图片所示位置的存药按钮"
    playVoice(step1);
    setTimeout(function(){
      playVoice(step2)
    },10000)

  }
})

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