function showPdf(ele){

	var url = window.location.href.split('#');
	var scrollTarget;
	var path = url[1];

	checkType(path);

	ele.click(function(e){

		var userAgent = window.navigator.userAgent;

        var pdfUrl = this.dataset.resources;
        
		// if (/MicroMessenger/.test(userAgent) && /(?:MQQBrowser|QQ)/.test(userAgent)) {
		// 	window.location.href = pdfUrl;
		// 	return;
        // }
        
        if(/mobile/ig.test(userAgent)){
            // window.location.href = pdfUrl;
            window.open(pdfUrl, '_blank');
            return;
        }

		// if ($(e.target)[0] === $(this).find('.download-icon')[0]) return;

		scrollTarget = document.body.scrollTop;

		// console.log(pdfUrl);

		window.location.href = url[0] + '#' + pdfUrl;

		// showMask(pdfUrl,type);
		checkType(pdfUrl);
	});

	$('.mask').click(function(){

		window.location.href = url[0] + '#';

		document.body.scrollTop = scrollTarget;
		hideMask();
	});

}

function checkType(path){
	var type = /.pdf$/.test(path) ? 'pdf' : (/(.jpg|.gif|.png|.jpeg)$/.test(path)) ? 'image' : 'none';

	if (path && type !== 'none') {
		showMask(path,type);
	}
}


function validURL(sUrl) {
	return !!((/^(https?:\/\/)?[\w\-.]+\.(qq|tencent|myqcloud)\.com($|\/|\\)/i).test(sUrl) || (/^[\w][\w/.\-_%]+$/i).test(sUrl) || (/^[/\\][^/\\]/i).test(sUrl));
}

function showMask(src,type){

	var resources = document.getElementById('show-resources');

	if (type === 'pdf') {
		var scale = (window.innerWidth * 0.8)/16;
		var resrc = src + '#zoom=' + scale;
		if (validURL(src)) {
			resources.setAttribute('data', resrc);			
		}
	}else if (type === 'image'){
		var imgEle = document.getElementById('img-src');
		imgEle.setAttribute('src',src);
	}


	var children = Array.prototype.slice.call(document.body.children,null);
	var mask = document.querySelector('.mask');

	$('body').addClass('noscroll');

	mask.classList.add('show-mask');
	resources.classList.remove('tran-pdf');

	children.forEach(function(ele,index){

		if (ele !== resources && ele !== mask) {

			// console.log(ele.nodeName);

			ele.classList.add('mask-body');
		}
	});
}


function hideMask(){
	
	var children = Array.prototype.slice.call(document.body.children,null);
	var mask = document.querySelector('.mask');
	var resources = document.getElementById('show-resources');
	
	mask.classList.remove('show-mask');
	resources.classList.add('tran-pdf');

	$('body').removeClass('noscroll');

	children.forEach(function(ele,index){

		if (ele !== resources && ele !== mask) {

			// console.log(ele.nodeName);

			ele.classList.remove('mask-body');
		}
	});

}