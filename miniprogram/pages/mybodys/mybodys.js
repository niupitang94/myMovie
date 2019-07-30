// pages/mybodys/mybodys.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    moviesId:"",
    detail:{},
    value:"",
    score:"",
    images:[],
  },
  //功能：提交图片和评论
  //上传到云函数
  Upload(){
    wx.showLoading({
      title: '正在提交中....',
    });
    var promiseAll=[];
    //循环遍历图片
    for(var i=0;i<this.data.images.length;i++){
      promiseAll.push(new Promise((resolve,reject)=>{
        //获取当前图片
        var item=this.data.images[i];
        var newFile=new Date().getTime()+Math.floor(Math.random()*9999)+".jpg";
        wx.cloud.uploadFile({
          filePath:this.data.images[i],
          cloudPath:newFile
        }).then(res=>{
          console.log(res);
          wx.hideLoading();
        }).catch(err=>{
          console.log(err);
        })

      }))//promiseAll 结束
    }//for end
  },

  //功能：上传图片
  onSelectImage(){
    wx.chooseImage({
      count:9,
      success:(res)=>{
        var file=res.tempFilePaths;
        this.setData({
          images:file
        });
        console.log(this.data.images);
      },
    })
  },

  //功能：获取输入框的内容
  onContentChange(e){
    this.setData({
      value:e.detail
    });
    console.log(this.data.value);
  },


  //功能：获取评分
  onScore(e){
    this.setData({
      score:e.detail
    });
    console.log(this.data.score);
  },



  //功能：加载
  loadMore(){
    wx.cloud.callFunction({//调用云函数
      name:"comment",
      data:{
        id:this.data.moviesId
      }
    }).then(res=>{//调用成功
      var obj=JSON.parse(res.result);
      this.setData({
        detail:obj
      })
      console.log(this.data.detail);
    })
    .catch(err=>{//调用失败
      console.log(err);
    })
  },



  /**
   * 生命周期函数--监听页面加载
   */
  //获取传递过来的ID
  onLoad: function (options) {
    var id=options.id;
    this.setData({
      moviesId:id
    })
    console.log(this.data.moviesId);
    //功能：调用加载
    this.loadMore();
  },
  
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})