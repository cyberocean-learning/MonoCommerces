export function rulesValidator(field, rules){
	var pass = true;
	for(const validate of rules){
		pass = pass && (validate(field) == true);
	}
	return pass;
};

export function rulesPrinter(field, rules, rulesActivator){
	// console.log("rulesPrinter");
	// console.log(field);
	// console.log(rules);
	// console.log(rulesActivator);
	// console.log("+++++++++++++++++++++++");
	var pass = true;
	if(typeof rulesActivator == "boolean") pass = rulesActivator;
	if(!pass) return;
	for(const validate of rules){
		var res = validate(field);
		if(!(res == true)){
			console.log("res");
			console.log(res);
			return res;
		}
	}
	return "";
};

export function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

export function makeServerQuery(apiName, data){
	// console.log("data ++++++++++++++++++");
	// console.log(data);
	var url = "/api/"+apiName+"?";
	if(data.keyword)               url += "keyword=" + data.keyword + "&";
	if(data.sort_by_tag)           url += "sort_by=" + data.sort_by_tag + "-" + ((data.sort_by_direction == "desc") ? "descending" : "ascending") + "&";
	if(data.page)                  url += "page=" + data.page + "&";
	if(data.page_size)             url += "page_size=" + data.page_size + "&";
	if(data.min)                   url += "min_price=" + data.min + "&";
	if(data.max)                   url += "max_price=" + data.max + "&";
	if(data.collections_filters)   url += "collections_filters=" + (data.collections_filters || []).join("_-_") + "&";
	if(data.tags_filters)          url += "tags_filters=" + (data.tags_filters || []).join("_-_") + "&";
	return url;
}

export function getYoutubeEmbedded(url, width, height, options, forceHttps) {
	// console.log("+++++++++++++++++++++++++++++++++++url+++++++++++++++++++++++++++");
	
	// console.log("url:" , url);
	
	if(!url) return "";
	// console.log("second url log +++++++++++++++++++++++++++++++++++++++++++++++++:", url);
	
	const getId = (url) => {
		const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
		const match = url.match(regExp);
	
		return (match && match[2].length === 11) ? match[2] : null;
	}

	const videoId = getId(url);

	return '<iframe '+
		'width="'+(width || '560')+'" '+
		'height="'+(height || '315')+'" '+
		'src="'+(forceHttps ? 'https://' : '//')+'www.youtube.com/embed/' + videoId + '" '+
		'frameborder="0" allowfullscreen, '+options+'>'+
		'</iframe>';
}
