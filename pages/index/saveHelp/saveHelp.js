const app = getApp()




Page({
  data:{
    number:null,
    client:null,
    plan:null,
    showLoading:true,

  },

  onLoad:function(options){                 //获取从上个页面传过来的药仓数字
    var that=this;
    that.data.client=app.globalData.client;  //初始化
    var plan=wx.getStorageSync(options.number.toString());
    this.setData({
      plan:plan
    })


    that.data.client.on('connect',function(err){       //测试是否连接上
      if(!err)
      {
        that.setData({
          showLoading:false
        })
      }
    })
    setTimeout(function(){                        //若大于30s连接失败
      if(that.data.showLoading){
        wx.showToast({
          title: '连接失败',
          icon: 'loading',
          duration: 300})
        
      }
      wx.navigateBack({
        delta: 2
      })
    },30000)





    this.setData({
      plan:plan,
      number:options.number
    })
    


  },




  subscribeTopicConnect:function(mName){                             //进行mqtt的topic的拼接
    return app.globalData.client_ID.toString()+'/plans/'+mName.toString()+'/save'
  },
  
  


})