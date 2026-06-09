include("_PBOC_COMMON.js");

print('\n* Test Case : SDA001');

// cleaning the card
print("\n* Transaction 1");
include("pboc_CLN001.js");

// verify all data to be signed in the signed record
print("\n* Transaction 2");
reset();
select_PBOC();
assertSW('9000');

send_GPO(TEST_PDOL_DATA);
assertSW('9000');

lookup_SAD();