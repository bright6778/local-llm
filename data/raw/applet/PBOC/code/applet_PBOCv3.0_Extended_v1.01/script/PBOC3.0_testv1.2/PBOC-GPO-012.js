include("_PBOC_COMMON.js");

print('\n* Test Case : GPO012');

print("\n* Transaction 1");
reset();
select_PBOC();
assertSW('9000');
send_GPO(TEST_PDOL_DATA);
assertSW('9000');
