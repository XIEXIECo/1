var newWin = null;
function popUp(postid, url ,strURL, strType, strHeight, strWidth, platform) {
	if (newWin != null && !newWin.closed)
		newWin.close();
	var strOptions = "";
	if (strType == "console")
		strOptions = "resizable,height=" + strHeight + ",width=" + strWidth;
	if (strType == "fixed")
		strOptions = "status,height=" + strHeight + ",width=" + strWidth;
	if (strType == "elastic")
		strOptions = "toolbar,menubar,scrollbars," + "resizable,location,height=" + strHeight + ",width=" + strWidth;
		
	
	newWin = window.open(strURL, 'newWin', strOptions);
	
	if (platform) {
		var para = {
			postid: postid,
			platform: platform
		};
		jQuery.post(url+"/api/count-share-ajax.php", para, function(data){
			//handle error here, but seem no need to do so.
			data = jQuery.parseJSON(data);
			if(data.success){
				var shareEle = jQuery(".statistics .share-count");
				shareEle.text(data.count);
			}
		});
	}
	return false;
}