function reset() {
	$('.lazy').removeClass('lazy');
}
// lazyload
function lazy() {
	$('.lazy').lazyload({ container: $('.article-list'), threshold: 450, effect: false, update: true });
}
// 渲染结果
function renderArticles(data) {
	var tpl = document.getElementById('article-tpl').innerHTML;
	return $.tpl(tpl, {
		url: '/articles/' + (data.permalink || data.id) + '.html',
		monochrome: 'https://cdn-isux.qq.com/upload/covers/' + data.id + '_a.jpg', 	// TODO 
		colorful: 'https://cdn-isux.qq.com/upload/covers/' + data.id + '_a_src.jpg', 		// TODO 
		title: data.title.replace(/\n/g, '<br/>'),
		category: data.category_name,
		abstract: data.abstract
	});
}
// 加载更多
function more(e) {
	var me = this;
	if (!me.href) return;
	var ds = this.dataset,
		category = ds.category,
		categoryId = ds.categoryId || 1,
		subCategoryId = ds.subCategoryId || '',
		tagId = ds.tag || '',
		page = parseInt(ds.page, 10),
		limit = parseInt(ds.limit, 10) || 12;
		offset = parseInt( ds.offset, 10) || 0 ;

	if (subCategoryId) subCategoryId = parseInt(subCategoryId, 10);
	

	page += 1;
	ds.page = page;
	var params = {
		categoryId: categoryId,    	  // 可选，大类ID，默认为空
		subCategoryId: subCategoryId, // 可选，子类ID，默认为空
		tagId: tagId, 				  // 可选，标签ID，默认为空
		// page: page,        			  // 可选，默认为 1
		// pagesize: 2 * ( pagesize - 1 ),   	  // 可选，默认为 10。
		offset: offset,
		limit: limit,
		__CSRF__: G_csrf
	} ;

	ds.offset = offset + limit  ;
	
	

	$.ajax({
		url: '/list/',
		type: 'POST',
		data: params,
		success: function (json) {
			var result = json.data;
			if (result) {

				if (result.data) {
					reset();

					var html = [];

					result.data.forEach(function (item, i) {
						html.push(renderArticles(item));
					});
					emptyItem.insertAdjacentHTML('beforebegin', html.join('\n'));
					lazy();
				}

				$(window).trigger('moreLoaded');				   // 触发 moreLoaded 事件，用于马赛克离场效果
				document.dispatchEvent(scrollShowAnimation);	// 触发 showAnimation 事件，用于追加元素的 show animation
				
				if ( result.offset + result.limit >= result.count) {
					
					// if (result.currentPage == result.totalPages) {	// 加载到最后一页后执行

					me.classList.add('fade-out');
					me.addEventListener('animationend', function (e) {

						if (e.animationName === 'fadeOut') {
							me.classList.add('disappear');
						};

						if (e.animationName === 'disappear') {
							me.parentElement.removeChild(me);
						};
					});

				} else {
					me.href = '/articles/' + (tagId ? 'tagId/' + tagId + '/' : '') + (category ? 'category/' + category + '/' : '') + 'page/' + page;
				}
			}
		}
	});
	e.preventDefault();
}