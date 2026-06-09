reset();

select('a0');
auth();


var res = send("80F24000024F0000"); // card-info: instance AID
var len = 0;
var idx = 0;
var aid = new Array();
for(i = 0; i < res.length; i += len + 6){
	len = parseInt(res.substring(i, i + 2), 16) * 2;
	aid[idx++] = res.substring(i + 2, i + 2 + len);
}
	

var max = idx * 3;
var flg = true;
for(j = 0; flg && j < max ; j++){
	flg = false;
	for(i = idx - 1; i >= 0; i--){
		send('80E4 0000' + toHex(aid[i].length/2 + 2) + '4F' + toHex(aid[i].length/2) + aid[i]);
		if(getSW() == '6985'){
			flg = true;
			break;
		}
	}
}



print('------------------------------------------------');
print('             Delete All Instances !!!');
print('------------------------------------------------');



function getLen(data){
	return data.replace(/(\s*)/g,"").length/2;
}
