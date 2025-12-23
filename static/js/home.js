$(document).ready(function () {
  window.addEventListener("resize", updateImgSrc, false);

  var picItems = document.querySelectorAll(".js-pic-item");

  let time = new Date().getTime();

  function updateImgSrc() {
    /* 在替换图片之前，先判断，当前位置的图片尺寸比例是否正确。如果不正确再进行替换，可以减少js计算量，提高性能 */
    if (getDocumentWidth() <= 414) {
      [].slice.call(picItems).forEach(function (item, index) {
        var datasrc = item.getAttribute("data-src"),
          _idx = datasrc.indexOf("_");

        /* 如果不是 a 类图片（1x1） */
        if (index == 5) {
          var adIdx = item.getAttribute("data-AdIndex");
          /* 处理                                                         广告的视频 */
          // if( adIdx == '1' ){
          //     document.getElementById('featuredVideo').src = datasrc.substr(0,_idx) + '_a_src.mp4';
          //     item.setAttribute('data-src',datasrc.substr(0,_idx) + '_a_src.mp4');
          // }else if( adIdx == '2' ){
          //     /* 处理YCG广告图片 */
          //     item.src = datasrc.substr(0,_idx) + '_a_src.jpg';
          //     item.setAttribute('data-src',datasrc.substr(0,_idx) + '_a_src.jpg');
          // }

          item.src = datasrc.substr(0, _idx) + "_a_src.jpg";
          item.setAttribute("data-src", datasrc.substr(0, _idx) + "_a_src.jpg");
        } else {
          if (datasrc.indexOf("_a") == -1) {
            if (index == 0) {
              item.src = datasrc.substr(0, _idx) + "_a_src.jpg";
              item.setAttribute(
                "data-src",
                datasrc.substr(0, _idx) + "_a_src.jpg"
              );
            } else {
              if (index % 2 == 0) {
                item.src = datasrc.substr(0, _idx) + "_a.jpg";
                item.setAttribute(
                  "data-src",
                  datasrc.substr(0, _idx) + "_a.jpg"
                );
              } else {
                item.src = datasrc.substr(0, _idx) + "_a_src.jpg";
                item.setAttribute(
                  "data-src",
                  datasrc.substr(0, _idx) + "_a_src.jpg"
                );
              }
            }
          }
        }

        if (!/\?time/.test(item.getAttribute("data-src"))) {
          item.setAttribute(
            "data-src",
            item.getAttribute("data-src") + "?time=" + time
          );
        }
      }, this);
    } else if (getDocumentWidth() > 414) {
      [].slice.call(picItems).forEach(function (item, index) {
        var datasrc = item.getAttribute("data-src"),
          _idx = datasrc.indexOf("_");

        var basename = item.getAttribute("data-basename");

        switch (index) {
          case 0:
            item.src = datasrc.substr(0, _idx) + "_b_src.jpg";
            item.setAttribute(
              "data-src",
              datasrc.substr(0, _idx) + "_b_src.jpg"
            );
            break;
          case 8:
          case 20:
            item.src = datasrc.substr(0, _idx) + "_b.jpg";
            item.setAttribute("data-src", datasrc.substr(0, _idx) + "_b.jpg");
            break;
          case 1:
          case 9:
          case 21:
            item.src = datasrc.substr(0, _idx) + "_b_src.jpg";
            item.setAttribute(
              "data-src",
              datasrc.substr(0, _idx) + "_b_src.jpg"
            );
            break;
          /* 4,5是广告位 */
          case 4:
            item.src = datasrc.substr(0, _idx) + "_c.jpg";
            item.setAttribute("data-src", datasrc.substr(0, _idx) + "_c.jpg");
            break;
          case 5:
            /* 处理不同广告 */
            var adIdx = item.getAttribute("data-AdIndex");

            // if(adIdx == '1'){
            //     item.setAttribute('data-src',datasrc.substr(0,_idx) + '_c_src.jpg');
            //     document.getElementById('featuredVideo').src = datasrc.substr(0,_idx) + '_c_src.mp4';
            // }else if( adIdx == '2' ){
            //     item.setAttribute('data-src',datasrc.substr(0,_idx) + '_c_src.jpg');
            //     item.src = datasrc.substr(0,_idx) + '_c_src.jpg';
            // }

            item.setAttribute(
              "data-src",
              datasrc.substr(0, _idx) + "_c_src.jpg"
            );
            item.src = datasrc.substr(0, _idx) + "_c_src.jpg";
            break;
        }

        if (getDocumentWidth() > 1024) {
          /* 最右下角的图片，在 2 column 的时候，变成2x1形状的图片 */
          switch (index) {
            case 20:
              item.src = datasrc.substr(0, _idx) + "_a.jpg";
              item.setAttribute("data-src", datasrc.substr(0, _idx) + "_a.jpg");
              break;
            case 21:
              item.src = datasrc.substr(0, _idx) + "_a_src.jpg";
              item.setAttribute(
                "data-src",
                datasrc.substr(0, _idx) + "_a_src.jpg"
              );
              break;
          }
        }

        if (!/\?time/.test(item.getAttribute("data-src"))) {
          item.setAttribute(
            "data-src",
            item.getAttribute("data-src") + "?time=" + time
          );
        }

        // console.log(item.getAttribute('data-src'))
      }, this);
    }
  }

  function getDocumentWidth() {
    return document.documentElement.clientWidth;
  }

  updateImgSrc();

  //监听处理广告位视频播放 START
  function playFeaturedVideo() {
    featuredVideo.currentTime = 0;
    featuredVideo.play();
  }

  function pauseFeaturedVideo() {
    featuredVideo.pause();
  }

  var featuredVideo = document.getElementById("featuredVideo");
  if (featuredVideo) {
    document
      .getElementById("js-featured-item")
      .addEventListener("mouseenter", playFeaturedVideo, false);

    document
      .getElementById("js-featured-item")
      .addEventListener("touchstart", playFeaturedVideo, false);

    document
      .getElementById("js-featured-item")
      .addEventListener("mouseleave", pauseFeaturedVideo, false);

    document
      .getElementById("js-featured-item")
      .addEventListener("touchend", pauseFeaturedVideo, false);

    //监听处理广告位视频播放 END
  }
});

$(document).ready(function () {
  // hack safari , 控制文章的间隙
  function hackFeedDistance(params) {
    var userAgent = window.navigator.userAgent.toLowerCase();
    //  must not contain Chrome/xyz or Chromium/xyz
    if (
      userAgent.indexOf("safari") > 0 &&
      userAgent.indexOf("chrom") === -1 &&
      userAgent.indexOf("os x") > 0
    ) {
      document.body.classList.add("inPCSafari");
    }
  }
  hackFeedDistance();
});
