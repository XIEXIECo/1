(function(window,$,undefined){
	$(function(){
		//--------------------------------- 工具类 ---------------------------------------
		//基础工具
		var Util = {
			support : {
				touch: "ontouchend" in document ,
				localStorage : function(){ // 判断是否支持localStorage 
					var testKey = 'test', storage = window.sessionStorage;
				    try 
				    {
				        storage.setItem(testKey, '1');
				        storage.removeItem(testKey);
				        return localStorageName in win && win[localStorageName];
				    } 
				    catch (error) 
				    {
				        return false;
				    }
				}
			}
			//第三方插件加载器，loading为加载中的事件，loaded为加载完成后的callback，noAutoAppend为非自动加载
			, vendorLoader : function( url, loading, loaded , noAutoAppend ){
				var node = document.createElement('script');
				if('function' === typeof loading){
					loading();
				}
				node.setAttribute('type', 'text/javascript');
				node.setAttribute('src', url);
				node.setAttribute('async', true);
				node.onload = node.onreadystatechange = function() {
					if (!this.readyState || this.readyState === 'loaded' || this.readyState === 'complete') {
						if('function' === typeof loaded){
							loaded();
						}
						node.onload = node.onreadystatechange = null;
					}
				};
				if( !noAutoAppend ){
					(document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild( node );
				}
			}
			, alert:function(txt){
				alert(txt);
			}
			, isString : function(t){
				return Object.prototype.toString.call(t) === '[object String]' ? true : false;
			}
			, isDate : function(t){
				return Object.prototype.toString.call(t) === '[object Date]' ? true : false;
			}
			, fillWithZero :function(n){
				if( n<10 && n > 0){
					n = "0"+n;
				}
				return n;
			}
			, dateFormat: function(dateTime){
				dateTime = this.isDate(dateTime) ? dateTime : (this.isString(dateTime) ? new Date(dateTime): undefined );
				if(dateTime){
					return dateTime.getFullYear()+'.'+ this.fillWithZero(1+parseInt(dateTime.getMonth())) + '.' + this.fillWithZero(dateTime.getDate())+' '+ this.fillWithZero(dateTime.getHours())+':'+this.fillWithZero(dateTime.getMinutes());
				}
			}
			// 判断浏览器小于等于IE9
			, letIE9 : function(){
		        var UA = navigator.userAgent,
		            isIE = UA.indexOf('MSIE') > -1,
		            v = isIE ? /\d+/.exec(UA.split(';')[1]) : 10;
		        return v <= 9;
			}
		};
		//提供缓存机制，用于记录用户使用习惯，如字体大小，阅读背景模式等
		var cache = (function(u){
			var localSuport = u.support.localStorage(),
				_localSetValue = function(k,v){
					localStorage.setItem(k,v);
				}
				, _localGetValue = function(k){
					return localStorage.getItem(k);
				}
				, _cookieSetValue = function(k,v){
					//稍后兼容
				}
				, _cookieGetValue = function(k){
					//稍后兼容
				};
			return {
				get:function(k){
					return localSuport ? _localGetValue( k ) :_cookieGetValue( k );
				},
				set:function(k,v){
					if( k!== undefined && u.isString(k) ){
						localSuport ? _localSetValue( k, v ):_cookieSetValue( k, v );
					}
				}
			};
		})(Util);
		/*********************************** END ******************************************/

		//--------------------------------- header功能 ---------------------------------------

		var navHeader = $(".header");

		navHeader.on('touchmove', function(e){
			var me = $(this), cnt = me.find('#nav'), scrollHeight = cnt[0].scrollHeight;
			scrollHeight == cnt.height() && e.preventDefault();
		});

		var mouseOverOrTouch = (('ontouchstart' in window)) ? 'touchstart' : 'mouseover';
		var mouseOutOrTouch = (('ontouchstart' in window)) ? 'touchsend' : 'mouseout';

		var $navitem = $($('.navitem')[0]),
			removedItem = $('.navitem .current'),
			$normalItem = $(".navitem"),
			$moreItem = $(".hasmore"),
			$moreCate = $(".hascate");

		if(IsPC() == true) {
			$navitem.on('mouseover',function(){
				removedItem.removeClass('current');
			});
			$navitem.on('mouseout',function(){
				removedItem.addClass('current');
			});

			$normalItem.on('mouseover',function(){
				removedItem.removeClass('current');
				$(this).addClass('current');
			});

			$normalItem.on('mouseout',function(){
				$(this).removeClass('current');
				removedItem.addClass('current');
			});
		} else {
			$moreItem.on('touchstart',function(){
				$('.navlist-sub').css('display','none');
				$(this).find('.navlist-sub').css('display','block');
			})
		}

		
		/*********************************** END ******************************************/

		//--------------------------------- 首页功能 ---------------------------------------
		var $body = $("body"),
			$logoNormal = $(".logo .normal"),
			$logoScaled = $(".logo .scaled"),
			$popupFrame = $(window);

		//滚动缩小导航
		/*
		if(!Util.letIE9()){
			$(window).scroll(function(){
				if($(this).scrollTop()>0 && !$body.hasClass("scrolling")){
					$body.addClass("scrolling").removeClass("scrolltop");
					setTimeout(function(){
						$logoNormal.addClass("none");
						$logoScaled.removeClass("none");
					},500)
				}else if($(this).scrollTop()<=0 && $body.hasClass("scrolling")){
					$logoScaled.addClass("none");
					$logoNormal.removeClass("none");
					$body.addClass("scrolltop").removeClass("scrolling");
				}
			});
		}
		*/

		//添加加载中文章隐藏，最外层容器
		var $wrap = $("#wrap");

		var $mainContainer = $('#post-area');
		// masonry 布局 
		// $mainContainer.imagesLoaded( function() {
		// 	$wrap.addClass("masonry-loaded");
		// 	$mainContainer.masonry({
		// 	    columnWidth: '.grid-sizer',
		// 	  	gutter:30,
		// 	    itemSelector : '.masonry-post',
		// 	  	isAnimated: true,
		// 	  	resize: true,
		// 	  	percentPosition: true,
		// 	  	transitionDuration: '0.2s'
		// 	});
		// });
		
		//resizer
		var windowResize = function(){
			var windowWidth = $(window).width();
			if(windowWidth < 768){
				$body.addClass("mscreen");
			}else{
				$body.removeClass("mscreen");
			}
			popupFrameAdjust();
		}
		//popupframe reszier
		var popupFrameAdjust = function(){
			if(!$popupFrame.hasClass("none")){
				$popupFrame.css("height",$(window).height()+"px");
				$popupFrame.find(".popup-wrap").css("height",$(window).height()+"px");
			}
		}
		$(window).on("resize",windowResize);
		windowResize();

		//搜索框
		var $searchInput = $("#search-input"),
		 	$windowWidth = $(window).width(),
			$functionBar = $(".functionbar"),
			clickOrTouch = (('ontouchstart' in window)) ? 'touchstart' : 'click',
			$headerTop = $(".header");
		$(".functionbar .ico-search").on(clickOrTouch,function(event){
			event.stopPropagation(); 
			$functionBar.removeClass("search-disactive");
			$functionBar.addClass("search-active");
			$headerTop.addClass("search-status");

			if($windowWidth < 1149){
				if($functionBar.hasClass("search-active")) {
					$(".header").append('<div class="sidepanel-backdrop"></div>');
				};
			}

			$(".sidepanel-backdrop").on(clickOrTouch,function(event){
				canclaSearch();
				// event.stopPropagation(); 
	
			});

		});
		$searchInput.on("click",function(){
			return false;
		});

		$(".search-submit").on(clickOrTouch,function(){
			if($(".search-input").val() === '') {
				canclaSearch();
				return false;
			}
		});

		function canclaSearch() {
			if($functionBar.hasClass("search-active")) {
				$functionBar.addClass("search-disactive");
				$functionBar.removeClass("search-active");
				$headerTop.removeClass("search-status");

				$(".sidepanel-backdrop").fadeOut('400ms',function(){
					$(".sidepanel-backdrop").remove();
				});
			}
		}

		$("body").on("click",function(event){
			event.stopPropagation(); 
			canclaSearch();
		});
		// $searchInput.on("blur",function(){
		// 	$functionBar.addClass("search-disactive");
		// 	$functionBar.removeClass("search-active");
		// 	$headerTop.removeClass("search-status");
		// 	$(".sidepanel-backdrop").fadeOut('400ms',function(){
		// 		$(".sidepanel-backdrop").remove();
		// 	});
		// });



		//加载更多
		var page=0;
		var isZhT = window.location.search == '?variant=zh-hant'? true : false;
		var pathName = window.location.pathname;
		var loadMoreData = function(){
			page++;
			var loadingFlag = false,
				_url="?action=page_more&page="+page+(!isNaN(global_cat_id)?'&cat='+global_cat_id:'')+(isZhT?'&variant=zh-hant':''),
				$loadingJuhua = $("#juhua-loading"),
				$loadMoreBtn  = $("#loadmore");
				console.log ( _url) ;
			if(!loadingFlag){
				loadingFlag = true;
				$loadingJuhua.show();
				$loadMoreBtn.hide();
				$.ajax({
					url: _url,
					type: 'GET',
					dataType: 'text', 
					timeout: 20000,
					error: function(){  },
			        success:function(feedback){
			        	feedback = feedback.replace(/(^\s*)|(\s*$)/g, "");
				    	loadingFlag = false;
				    	var $doms = $(feedback);
				    	if($doms.length>0){
				    		var _doms = [];
				    		$doms.each(function(){
				    			_doms.push($(this)[0]);
				    		});
				    		$mainContainer.append( _doms );
				    	}
		                $loadingJuhua.hide();
		                if(feedback=="" || $doms.length<15){
		                	$loadMoreBtn.hide();
		                }else{
		                	$loadMoreBtn.show();
		                }
					}
				});
			}
			
		}
		$(".btn-loadmore").on("click",loadMoreData);
		
		//回到顶部
		$(".backtop").on("click",function(){
			$(window).scrollTop(10);
		  	$({scrollTop: 10}).stop().animate({scrollTop: 0}, {
		        duration: 500,
		        step: function(now) {
		            $(window).scrollTop(now);
		        }
		    });
		});


		//弹出框用iScroll控制滚动 
		// var myscroll;
		// myscroll = new IScroll(".popup-wrap",{
		// 	 mouseWheel: true,
		// 	 disableMouse: true
		// });
		//弹出框显示详细页
		var PopUpload = function(){
			this.loadedHref = '';
		};
		PopUpload.prototype = {
			_setPopupLoading:function(){
				$popupFrame.removeClass("none");
				$popupFrame.find(".popup-loading").removeClass("none");
			},
			_setPopupLoaded:function(){
				$popupFrame.find(".popup-main").fadeIn(500,function(){
					$popupFrame.find(".popup-loading").addClass("none");
				});
			},
			_clearOldDom:function(){
				myscroll.scrollTo(0,0);
				$popupFrame.find(".popup-main").hide().html("");
			},
			adjustPopHeight:function(){
				$popupFrame.find(".popup-main").css("height",$popupFrame.find(".post").height()+200+"px");
	 			myscroll.refresh();
			},
			scrollToElement:function($dom,duration){
				myscroll.scrollToElement($dom,duration);
			},
			loadByHref:function(href){
				var _self = this;
				_self._setPopupLoading();
				if(_self.loadedHref == href){
					_self._setPopupLoaded();
					return;
				}
				if(Util.isString(href) && href.indexOf("http://") < 0) return;
				_self._clearOldDom();
				_self.loadedHref = href;
				//隐藏功能按钮
				$popupFrame.find(".pagenation-pre-sigle,.pagenation-next-sigle").hide();
				$popupFrame.find(".side-functionbar .relative").fadeOut();
				$.ajax({
					type: "GET",
	        	 	url:href,
	             	dataType: "html",
	             	success: function(html){
	             		_self._setPopupLoaded();
	             		popupFrameAdjust();
	             		$popupFrame.find(".popup-main").html($(html).find(".single-content").html());
	             		$popupFrame.find(".side-functionbar .relative").html($popupFrame.find(".single-functionbar").html()).fadeIn();

	             		var prevHref = $popupFrame.find(".post-prev a")[0] && $popupFrame.find(".post-prev a").attr("href"),
	             		 	nextHref = $popupFrame.find(".post-next a")[0] && $popupFrame.find(".post-next a").attr("href");
	             		if(prevHref){
	             			$popupFrame.find(".pagenation-pre-sigle").attr("href",prevHref).show()
	             		}else{
	             			$popupFrame.find(".pagenation-pre-sigle").attr("href","javascript:;").hide();
	             		}
	             		if(nextHref){
	             			$popupFrame.find(".pagenation-next-sigle").attr("href",nextHref).show();
	             		}else{
	             			$popupFrame.find(".pagenation-next-sigle").attr("href","javascript:;").hide();
	             		}
	             		var contentHeight = $popupFrame.find(".post").height(),
	             			readingTime = caculatReadingTime(contentHeight);
	             		$popupFrame.find(".reading-time .timing").html(readingTime);
	             		$popupFrame.find(".popup-main").css("height",contentHeight+200+"px");
	             		$popupFrame.find(".commentmetadata a").attr("href","").on("click",function(event){
							event.preventDefault();
							return false;
	             		});
	             		myscroll.refresh();
	             		//每个图片加载完成后重新计算高度，确保高度正确
		             	$popupFrame.find("p").each(function(){
		             		$(this).imagesLoaded(function() {
		             			_self.adjustPopHeight();
		             		});
		             	});
		             	
					}
	         	});
			}
		}
		
		var popUpLoader = new PopUpload();
		//载入文章
		$("body").delegate(".open-single-frame,.pagenation-pre-sigle,.pagenation-next-sigle,.r-pic a","click",function(event){
			//去除Ajax加载文章
			/*
			var href = $(this).attr("href");
			event.preventDefault();
			popUpLoader.loadByHref(href);
			return false;
			*/
 		});
 		//文章载入状态时键盘左右按键载入前后文章
		window.document.onkeydown = function disableRefresh(evt){
			if($popupFrame.hasClass("none")){ return;}
			evt = (evt) ? evt : window.event
			if (evt.keyCode) {
			   if(evt.keyCode == 37 ){
			    	$(".pagenation-pre-sigle").click();
			   }else if(evt.keyCode == 39 ){
			    	$(".pagenation-next-sigle").click();
			   }
			}
		}


		$(".icon-share").click(function(){
			var $sharebtns = $(".sharebtns");
			if($sharebtns.hasClass("none")){
				$sharebtns.removeClass("none");
			}else{
				$sharebtns.addClass("none");
			}
		});

		// 汉堡菜单动画

		var $toggleNavIcon = $(".nav-toggle");

		var $navIcon = $("#nav");

		var clickOrTouch = (('ontouchstart' in window)) ? 'touchstart' : 'click';

		$toggleNavIcon.on(clickOrTouch,function(event){
			event.stopPropagation();
			$(this).toggleClass("toggle-animate");
			if($navIcon.hasClass("open-nav")) {
				$navIcon.removeClass("open-nav").addClass("close-nav");
			}else {
				$navIcon.addClass("open-nav").removeClass("close-nav");
				
			}
			$(".functionbar").toggleClass("show-lang");

			if($(this).hasClass("toggle-animate")) {
				$(".header").append('<div class="sidepanel-backdrop"></div>');
			} else {
				$(".sidepanel-backdrop").fadeOut('400ms',function(){
					$(".sidepanel-backdrop").remove();
				});
			}

			// var $maskDrop = $(".sidepanel-backdrop");

			// if($maskDrop.length > 0) {
			// 	$(".sidepanel-backdrop").remove();
			// };
			$(".sidepanel-backdrop").on(clickOrTouch,function() {
				$navIcon.removeClass("open-nav").addClass("close-nav");
				$toggleNavIcon.removeClass("toggle-animate")
				$(".sidepanel-backdrop").fadeOut('400ms',function(){
					$(".sidepanel-backdrop").remove();
				});
			});
			
		});	

		function IsPC(){    
		     var userAgentInfo = navigator.userAgent;  
		     var Agents = new Array("Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod");    
		     var flag = true;    
		     for (var v = 0; v < Agents.length; v++) {    
		         if (userAgentInfo.indexOf(Agents[v]) > 0) { flag = false; break; }    
		     }    
		     return flag;    
		}  

		if(IsPC() == true) {

			// 点击卡片波浪效果

			var ink, d, x, y;
			$(".open-single-frame").on(clickOrTouch,function(e){
			    if($(this).find(".ink").length === 0){
			        $(this).prepend("<span class='ink'></span>");
			    }
			         
			    ink = $(this).find(".ink");
			    ink.removeClass("animate");
			     
			    if(!ink.height() && !ink.width()){
			        d = Math.max($(this).outerWidth(), $(this).outerHeight());
			        ink.css({height: d, width: d});
			    }
			     
			    x = e.pageX - $(this).offset().left - ink.width()/2;
			    y = e.pageY - $(this).offset().top - ink.height()/2;
			     
			    ink.css({top: y+'px', left: x+'px'}).addClass("animate");

			});
		}
		
		//评论ajax方式提交
		var commentedCount = 0;
		var commiting = false;
		$("#commentSubmitByAjax").on("click",function(event){
			if(commiting)return;
			var $commentForm = $("#commentform"),
				$thisBtn = $(this),
			 	postData = {},
				author_default = $commentForm.find("#author").attr("default"),
				email_default = $commentForm.find("#email").attr("default"),
				comment_default = $commentForm.find("#comment").attr("default"),
				homePageUrl = $("#homepageurl").val();
			postData.author = $commentForm.find("#author").val();
			postData.email = $commentForm.find("#email").val();
			postData.url = $commentForm.find("#url").val();
			postData.comment = $commentForm.find("#comment").val();
			postData.comment_post_ID = $commentForm.find("#comment_post_ID").val();
			postData.comment_parent = $commentForm.find("#comment_parent").val();
			postData._wp_unfiltered_html_comment_disabled = $commentForm.find("#_wp_unfiltered_html_comment_disabled").val();
			for(var k in postData){
				if(postData[k] === undefined)delete postData[k];
			}
			if(postData.author && postData.author == author_default){Util.alert("请输入姓名");return;}
			if(postData.email && postData.email == email){Util.alert("请输入Email");return;}
			if(postData.comment && postData.comment == comment_default){Util.alert("请输入想说的话");return;}
			commiting = true;
			$thisBtn.addClass("commiting").html("发布中...");
			$.ajax({
				type: "POST",
        	 	url:homePageUrl+'/wp-comments-post.php',
        	 	data:postData,
             	dataType: "html",
             	error:function(error){
             		var errorTxt = '';
             		if(error.status == 500){
             			errorTxt = error.responseText.substring(error.responseText.indexOf("<p>")+3,error.responseText.indexOf("</p>"));
             		}
             		Util.alert(errorTxt);
             		commiting = false;
             		$thisBtn.removeClass("commiting").html("发布");
             	},
             	success: function(html){
             		commiting = false;
             		$commentForm.find("#comment").val("")
             		$thisBtn.removeClass("commiting").html("发布");
             		Util.alert('评论成功！请等待审核！');
             		if(html == 'done'){
             			commentedCount++;
             			html = '<li id="new-comment'+commentedCount+'" class="comment byuser comment-author-admin bypostauthor odd alt thread-odd thread-alt depth-1" >'+ 
	             			'<div class="comment-body"> '+ 
	             				'<div class="comment-author vcard"> '+ 
	             					'<img alt="" src="'+ $(".avatar-user img").attr("src") +'" class="avatar avatar-32 photo" height="32" width="32"> '+ 
	             					'<cite class="fn">'+(postData.author ? postData.author : $("#comment_author").val())+'</cite> '+ 
	             					'<span class="says">说道：</span>	'+ 	
	             				'</div> '+ 
	             				'<em class="comment-awaiting-moderation">您的评论正在等待审核。</em><br>'+
	         					'<div class="comment-meta commentmetadata"> '+ 
	         						'<a href="">'+ Util.dateFormat(new Date())+'</a>'+ 
	         					'</div> '+ 
	         					'<p>'+ postData.comment +'</p> '+ 
         					'</div> '+ 
             			'</li> ';


             			if(postData.comment_parent == 0){
             				$(".commentlist").append(html);
             				$(window).scrollTop($('#new-comment'+commentedCount).offset().top);
             			}else{
             				var $parentLi = $("#comment-"+postData.comment_parent);
             				if($parentLi.find(".children")[0]){
             					$parentLi.find(".children").append(html);
             				}else{
             					$parentLi.find("#respond").after('<ul class="children">'+html+'</ul>');
             				}
             			}
             			//popUpLoader.adjustPopHeight();
         				//popUpLoader.scrollToElement($popupFrame.find('#new-comment'+commentedCount)[0],200);
             		}
             	}
	        });
				
			event.preventDefault();
			return false;
		});
		//移动评论输入框到回复区域（从v1迁移代码）
		window.addComment = {
			moveForm : function(commId, parentId, respondId, postId) {
				var t = this, div, comm = t.I(commId), respond = t.I(respondId), cancel = t.I('cancel-comment-reply-link'), parent = t.I('comment_parent'), post = t.I('comment_post_ID');

				if ( ! comm || ! respond || ! cancel || ! parent )
					return;

				t.respondId = respondId;
				postId = postId || false;

				if ( ! t.I('wp-temp-form-div') ) {
					div = document.createElement('div');
					div.id = 'wp-temp-form-div';
					div.style.display = 'none';
					respond.parentNode.insertBefore(div, respond);
				}

				comm.parentNode.insertBefore(respond, comm.nextSibling);
				if ( post && postId )
					post.value = postId;
				parent.value = parentId;
				cancel.style.display = '';

				cancel.onclick = function() {
					var t = addComment, temp = t.I('wp-temp-form-div'), respond = t.I(t.respondId);

					if ( ! temp || ! respond )
						return;

					t.I('comment_parent').value = '0';
					temp.parentNode.insertBefore(respond, temp);
					temp.parentNode.removeChild(temp);
					this.style.display = 'none';
					this.onclick = null;
					return false;
				}

				try { t.I('comment').focus(); }
				catch(e) {}

				return false;
			},

			I : function(e) {
				return document.getElementById(e);
			}
		};
		$('.isux-like-btn').on('click', function(){
			var obj = $(this);
			
			var idPost = obj.find('.isuxlike-id').val();
			var idUser = obj.find('.isuxlike-user').val();
			var type = obj.find('.isuxlike-type').val();
			var action = obj.find('.isuxlike-action').val();
			var onlyUs = obj.find('.isuxlike-ou').val();
			
			//remove the "unlike" action
			if(action == "unlike"){
				// return false;
			}
			
			if(onlyUs == '1' && idUser == '0'){
				
        	 	return false;
			}
			
			var ajaxAction = (action == 'like')?'add_like':'add_like';
			
			var para = {
	            action 	: 	ajaxAction,
	            idPost	:	idPost,
	            idUser	:	idUser,
	            type	:	type
	        };
			//kkajax.ajaxurl源于插件输出的全局参数
			$.post(kkajax.ajaxurl,para,function(done){ 
	        	 
	        	 var done = $.parseJSON(done);

	        	 if(!done.hasError){
	        	 	$('.isux-like-box').find('.rate').text(done.rating);
	        	 	if(action == 'like'){
	        	 		$('.isux-like-box').find('.isux-like-btn').removeClass('isux-state-like').addClass('isux-state-unlike');
	        	 		$('.isux-like-box').find('.isuxlike-action').val('unlike');
	        	 	}else{
						$('.isux-like-box').find('.isux-like-btn').removeClass('isux-state-unlike').addClass('isux-state-like');
	        	 		$('.isux-like-box').find('.isuxlike-action').val('like');
	        	 	}
	        	 }
	        
	        });
			
			return false;
		});
		/*********************************** END ***********************************************/

		//--------------------------------- 文章详细页功能 ---------------------------------------
		//估算阅读需要的时间量
		var caculatReadingTime = function(contentHeight){
			return parseInt(contentHeight/1000)+1;
		}
		
		//PC端宽屏下，文章重定向到首页
		// var safeWidth = 1000,
		// 	isSinglePage = $("#isSinglePage")[0] && $("#isSinglePage").val() == 1 ? true: false,
		// 	isHomePage = $("#isHomePage")[0] && $("#isHomePage").val() == 1 ? true: false;
		// if($(window).width()>safeWidth && isSinglePage){
		// 	cache.set("openHref",location.href);
		// 	location.href = $("#homeurl").val();
		// }
		// if( cache.get("openHref") && cache.get("openHref")!="null" && isHomePage){
		// 	popUpLoader.loadByHref(cache.get("openHref"));
		// 	cache.set("openHref","null");
		// }
		//内页预加载下一篇文章
		var nextPostLink = $(".prev-post-link a").attr("href");
		if(nextPostLink){

			$.ajax({
				url: nextPostLink,
				type: 'GET',
				dataType: 'text', 
				timeout: 20000,
				error: function(){  },
		        success:function(prevPostHtml){
		        	var $prevContent = $(prevPostHtml).find(".post");
		        	if($prevContent[0]){
		        		$("#prevload .detail-hd").html($prevContent.find(".detail-hd").html());
		        		$("#prevload .artical-content").html($prevContent.find(".artical-content").html());
		        	}
		        	//页面载入时初始化文字大小
					changeFontSize(cache.get("fontSize"));
				}
			});
			$("#prevload").delegate(".detail-hd","click",function(){
				var $prevloaded = $("#prevload"),
					currentPostID = $prevloaded.attr("currentID"),
					$currentPost = $("#post-"+currentPostID),
					$currentPostFrame = $("#post-"+currentPostID+"-frame"),
					moveGap = $prevloaded.position().top - $(window).scrollTop();
				$prevloaded.find(".artical-content").show();
				$currentPost.addClass("up-fadeout");
				$prevloaded.css({
					"position":"fixed",
					"top":moveGap+"px",
					"-webkit-transition" : "-webkit-transform 0.5s 0.25s ease-out",
					"-webkit-transform" : "translateY(-"+moveGap+"px)"
				});

				setTimeout(function(){
					$currentPostFrame.css("height",0);
					$(window).scrollTop(0);
					window.location.href=nextPostLink;

				},500);
			});
		}

		//内页文章字体控制
		var changeFontSize = function( fontSize ){
			fontSize = fontSize === undefined ? 'm' :fontSize;
			switch(fontSize){
				case 's':
					//$content.addClass("artical-font-size-small").removeClass("artical-font-size-large");
					document.documentElement.style.fontSize = '80px';
					break;
				case 'm':
					//$content.removeClass("artical-font-size-small").removeClass("artical-font-size-large");
					document.documentElement.style.fontSize = '100px';
					break;
				case 'l':
					//$content.removeClass("artical-font-size-small").addClass("artical-font-size-large");
					document.documentElement.style.fontSize = '120px';
					break;
			}
			$('.change-fontsize').removeClass('on');
			$('.change-fontsize[fontsize="'+fontSize+'"]').addClass('on');
			cache.set("fontSize",fontSize);
		}
		//改变文字大小按钮
		$(".font-controller").on("click",".change-fontsize",function(){
			changeFontSize($(this).attr('fontsize'));
		});
		//页面载入时初始化文字大小
		var initSize = cache.get("fontSize");
		if(initSize!='s'&&initSize!='m'&&initSize!='l')
		{
			initSize = 'm';
		}
		changeFontSize(initSize);

		/*********************************** END ******************************************/


		//第三方插件加载  
		//加载jiathis插件
		// Util.vendorLoader('http://v3.jiathis.com/code/jia.js',undefined,function(){
		// 	Util.vendorLoader('http://v3.jiathis.com/code/jiathis_streak.js');
		// });

		// 判断副标题是否为空，为空隐藏

		// var $subTitleValue = $(".sub-title").html();

		// if($subTitleValue == '') {
		// 	$(".sub-title").css("display","none");
		// }

		
		// document.addEventListener('touchmove', function(e) {
		// 	console.log("aaa");
		//   e.preventDefault();
		// });
		
	});	



})(window,jQuery);

