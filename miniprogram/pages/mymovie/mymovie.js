const db=wx.cloud.database();
// pages/mymovie/mymovie.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    content:"",
    list:[],
  },
  myupload(){
    //功能：选择一张图片
    wx.chooseImage({
      success:(res)=>{
        console.log(res);
        var file=res.tempFilePaths[0];
        console.log(file);
        this.setData({
          list:file
        })
      },
    })
  },
  mysubmit(){
    //功能二：上传图片并且将图片保存云函数
    //1:获取上传图片
    var list=this.data.list;
    //2：截取文件后缀后名称
    var suffix=/\.\w+$/.exec(list)[0];
    //3:创建新文件名称
    var newFile = new Date().getTime() + suffix;
    console.log(suffix);
    console.log(newFile);
    console.log(this.data.list);
    //4:获取用户评论内容
    var c=this.data.content;
    wx.cloud.uploadFile({
      filePath:list,
      cloudPath:newFile,
      success:res=>{
        var fid=res.fileID;
        db.collection("mymovie").add({
          data:{
            fileId:fid,
            content:c
          }
        })
        .then(res=>{
          console.log(res);
          wx.showToast({
            title: '发表成功',
          })
        })
        .catch(err=>{
          console.log(err);
          wx.showToast({
            title: '发表失败',
          })
        })
      }//上传图片成功
    })//上传图片结束
  },


  onContextChange(e){
    //功能：获取用户输入留言内容
     this.setData({
       content:e.detail
     })
    console.log(this.data.content);
  },


  onSelectImage(){
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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