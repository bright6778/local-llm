include("_PBOC_COMMON.js");

print('\n* Test Case : GPO081');

print("\n* Transaction 1");
reset();
select_PBOC();
assertSW('9000');
send_GPO('8500');
//assertSW('6700');
sw = getSW();
if(sw != '6700' && sw != '6A80'){
		error('SW is wrong!!!');
}

