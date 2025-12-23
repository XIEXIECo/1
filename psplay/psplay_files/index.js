jQuery.noConflict();
(function( $ ) {
	var isMobile = {
		Android: function() {
			return navigator.userAgent.match(/Android/i);
		},
		iPhone: function() {
			return navigator.userAgent.match(/iPhone|iPod/i);
		},
		iPad: function() {
			return navigator.userAgent.match(/iPad/i);
		}
	};
	var bannerMacLimitX,bannerMacLimitY,bannerPhoneLimitX,bannerPhoneLimitY;
	
	function configMoveBanner(){
		if($(document).width()<640){
			bannerMacLimitX = 20;
			bannerMacLimitY = 4;
			bannerPhoneLimitX = 5;
			bannerPhoneLimitY = 0;
		}
		else if($(document).width()<960){
			bannerMacLimitX = 40;
			bannerMacLimitY = 8;
			bannerPhoneLimitX = 10;
			bannerPhoneLimitY = 0;
		}
		else{
			bannerMacLimitX = 40;
			bannerMacLimitY = 0;
			bannerPhoneLimitX = 6;
			bannerPhoneLimitY = 0;
		}
	}
	
	$(document).ready(function() {
		var langBtn = $("#app-lang-box ."+lang);
		langBtn.prop("href","#");
		langBtn.addClass("current");
		
		if(isMobile.Android()){
			$("#android-dl").show();
		}
		else if(isMobile.iPhone()){
			$("#iphone-dl").show();
		}
		else if(isMobile.iPad()){
			$("#ipad-dl").show();
		}
		else{
			$("#iphone-dl").show();
			$("#ipad-dl").show();
			$("#android-dl").show();
		}
		
		//If width smaller than 640, content img scale 50%
		if($(document).width()<640){
			$(".app-main-inner .intro img").each(function(){
				if($(this).width() != 0){
					scaleHalfImage($(this));
				}
				else{
					$(this).load(function(){
						scaleHalfImage($(this));
					});
				}
			});
		}
		
		configMoveBanner();
		
		$(window).resize(function() {
			if($(document).width()<640 && !isImageHalf){
				$(".app-main-inner .intro img").each(function(){
					if($(this).width() != 0){
						scaleHalfImage($(this));
					}
					else{
						$(this).one("load",function(){
							scaleHalfImage($(this));
						});
					}
				});
			}
			else if($(document).width()>=640 && isImageHalf){
				$(".app-main-inner .intro img").each(function(){
					if($(this).width() != 0){
						scaleDoubleImage($(this));
					}
					else{
						$(this).one("load",function(){
							scaleDoubleImage($(this));
						});
					}
				});
			}
			configMoveBanner();
		});
		
		/*fade in button and banner*/
		var delayTime = 0;
		$(".button-wrap .btn-fade").each(function(index, element) {
			$(this).delay(delayTime).animate({
				marginLeft:0,
				opacity:1
			},700);
			delayTime += 200;
		});
		delayTime = 0;
		
		var bannerFadeCount = 0;
		$(".banner-fade").each(function(index, element) {
			$(this).delay(delayTime).animate({
					marginLeft:0,
					opacity:1
				},
				1000,
				"swing",
				function(){
					bannerFadeCount++;
					if(bannerFadeCount == 2){
						console.log("yameta");
						if(isMobile.iPad() || isMobile.iPhone() || isMobile.Android()){
							initMobileBanner();
						}
						else{
							initWebBanner();
						}
					}
				}
			);
			delayTime += 400;
		});
		startBannerSwap();
		
		if(isMobile.iPad() || isMobile.iPhone() || isMobile.Android()){
			initVideoLink();
		}
		else{
			initVideoPopup();
		}
		
		$(".btn-qr").click(function(){
			var id = $(this).attr("id");
			$("#qr-popup .qr-content").hide();
			$("#"+id+"-code").show();
			$("#qr-popup").fadeIn();
			return false;
		});
		$("#qr-popup .masker").click(function(){
			$("#qr-popup").fadeOut();
		});
		$("#qr-close").click(function(){
			$("#qr-popup").fadeOut();
		});
	});
	
	//video
	function initVideoLink(){
		$("#video-btn").attr("href","http://v.qq.com/cover/x/x258ecmnxtmxo2m.html?vid=v00122czt71");
	}
	
	function initVideoPopup(){
		$("#video-btn").click(function(){
			$("#video-popup").fadeIn();
			return false;
		});
		$("#video-close").click(function(){
			$("#video-popup").fadeOut();
			$("#jquery_jplayer_1").jPlayer("pause");
		});
	}
	
	var isImageHalf = false;
	function scaleHalfImage(img){
		var the_width = img.width(),
		new_width = Math.round(the_width/2);
		img.width(new_width);
		isImageHalf = true;
	};
	function scaleDoubleImage(img){
		var the_width = img.width(),
		new_width = Math.round(the_width*2);
		img.width(new_width);
		isImageHalf = false;
	};
	
	var bannerIdx = 1;
	function startBannerSwap(){
		setInterval(function(){
			bannerIdx++;
			bannerIdx %= 2;
			var macIcon = $(".top-area .icon-mac .img");
			macIcon.eq(bannerIdx).fadeIn(800);
			macIcon.eq(bannerIdx).siblings().fadeOut(800);
			var phoneIcon = $(".top-area .icon-iphone .img");
			phoneIcon.eq(bannerIdx).fadeIn(800);
			phoneIcon.eq(bannerIdx).siblings().fadeOut(800);
		}, 6000);
	};
	
	//banner moving
	var targetMacX=0,targetMacY=0,targetPhoneX=0,targetPhoneY=0;
	var loopInterval=50,stepFactor=8;
	function initWebBanner(){
		var bannerW = $("#banner-area").width();
		var bannerH = $("#banner-area").height();
		var bannerOffset = $("#banner-area").offset();
		var bannerX = bannerOffset.left, bannerY=bannerOffset.top;
		$("#banner-area").mousemove(function(e) {
			var normalX = ((e.pageX-bannerX) -(bannerW/2))/(bannerW/2);
			var normalY = ((e.pageY-bannerY) -(bannerH/2))/(bannerH/2);
			//console.log("X="+normalX+"  Y="+normalY);
			setBannerTarget(-normalX,-normalY);
		});
		setInterval(movingBannerLoop,loopInterval);
	}
	function initMobileBanner(){
		var xDegreeLimit = 30;
		var yDegreeLimit = 30;
		gyro.frequency = 20;
		gyro.startTracking(function(o) {
			var normalX,normalY;
			if(window.orientation == 0 || window.orientation == 180){
				normalX = Math.max(-1, Math.min(1,(o.gamma/xDegreeLimit)));
				normalY = Math.max(-1, Math.min(1,((o.beta-45)/yDegreeLimit)));
			}
			else{
				normalX = Math.max(-1, Math.min(1,(o.beta/xDegreeLimit)));
				normalY = Math.max(-1, Math.min(1,((o.gamma+((window.orientation == 90)?45:-45))/yDegreeLimit)));
			}
			//console.log(window.orientation+" "+o.gamma+"  "+o.beta);
			setBannerTarget(-normalX,-normalY);
		});
		setInterval(movingBannerLoop,loopInterval);
	}
	function setBannerTarget(offX,offY){
		targetMacX = Math.round(bannerMacLimitX*offX);
		targetMacY = Math.round(bannerMacLimitY*offY);
		targetPhoneX = Math.round(bannerPhoneLimitX*offX);
		//targetPhoneY = Math.round(bannerPhoneLimitY*offY);
	}
	function movingBannerLoop(){	
		checkMove("banner-mac","margin-left",targetMacX);
		checkMove("banner-mac","margin-top",targetMacY);
		checkMove("banner-iphone","margin-left",targetPhoneX);
		//checkMove("banner-iphone","margin-top",targetPhoneY);
	}
	function checkMove(eleId,prop,targetPost){
		var ele = $("#"+eleId);
		var curOffset = parseFloat(ele.css(prop));
		var diff = (targetPost-curOffset)/stepFactor;
		if(targetPost == curOffset ||  Math.abs(diff)<0.05){
			return;
		}
		curOffset += diff;
		ele.css(prop,curOffset+"px");
	}
	
})( jQuery );