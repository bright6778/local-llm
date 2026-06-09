include("_PBOC_COMMON.js");

print('\n* Test Case : LOG017');

print("\n* Transaction 1");
include("pboc_CLN001.js");

print("\n* Transaction 2");
include("pboc_CLN001.js");

print("\n* Transaction 3");
include("pboc_CLN001.js");

print("\n* Transaction 4");
include("pboc_CLN001.js");

print("\n* Transaction 5");
include("pboc_CLN001.js");

print("\n* Transaction 6");
include("pboc_CLN001.js");

print("\n* Transaction 7");
include("pboc_CLN001.js");

print("\n* Transaction 8");
include("pboc_CLN001.js");

print("\n* Transaction 9");
include("pboc_CLN001.js");

print("\n* Transaction 10");
include("pboc_CLN001.js");

print("\n* Transaction 11");
reset();
select_PBOC();
assertSW('9000');
send_GetData('9F4F'); //Log Format
assertSW('9000');
for(i = 1; i <= parseInt(Log_RecNum, 16); i++) {
	send_ReadRecord(parseInt(Log_SFI, 16), i);
	//assertSW('9000');
}
	
print("\n* Transaction 12");
include("pboc_CLN001.js");

print("\n* Transaction 13");
reset();
select_PBOC();
assertSW('9000');
send_GetData('9F4F'); //Log Format
assertSW('9000');
for(i = 1; i <= parseInt(Log_RecNum, 16); i++) {
	send_ReadRecord(parseInt(Log_SFI, 16), i);
	//assertSW('9000');
}