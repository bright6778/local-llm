include("_PBOC_COMMON.js");

print('\n* Test Case : GPO093');

print("\n* Transaction 1");
include("pboc_CLN001.js");
store_ATC();

print("\n* Transaction 2");
reset();
select_PBOC();
assertSW('9000');
send_GPO(TEST_PDOL_DATA_INTER2);
//assertSW('6700');
sw = getSW();
if(sw != '6700' && sw != '6A80'){
		error('SW is wrong!!!');
}

print("\n* Transaction 3");
include("pboc_CLN001.js");
check_CID('40');
check_CVR('03640000');
check_ATC();
