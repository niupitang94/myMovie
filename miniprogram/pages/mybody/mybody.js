// pages/home/home.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: []
  },
  jumpComment(e) {
    //功能：用户点击详情按钮后跳转详情组件
    // wx.redirectTo({
    //   url:'/pages/comment/comment'
    // })
    //保留并且跳转
    var id = e.target.dataset.id;
    wx.navigateTo({
      url: "/pages/mybodys/mybodys?id=" + id
    });

    //练习：将电影id获取并且中转组件时传递comment组件，在comment获取id

  },



  loadMore() {

    //1:调用云函数movelist
    wx.cloud.callFunction({
      name: "movelist",
      data: {
        start: this.data.list.length,
        count: 10
      }
    }).then(res => {

      var obj = JSON.parse(res.result);
      //保存电影列表
      //功能：保存上一页电影列表
      //1.10保存电影列表数据
      var rows = obj.subjects;
      //1.11:将电影列表数组拼接操作
      this.data.list.concat(rows);
      //1.12:将拼接后结果保存起来
      this.setData({
        list: rows
      })
    }).catch(err => {
      console.log(err);
    })

  },




  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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
    console.log(123);
    //发送请求下载下一页数据
    this.loadMore();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})