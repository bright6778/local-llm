include("_PBOC_COMMON.js");

print('\n* Test Case : SDA004');

// cleaning the card
print("\n* Transaction 1");
include("pboc_CLN001.js");

// read record
print("\n* Transaction 2");
reset();
select_PBOC();
assertSW('9000');

send_GPO(TEST_PDOL_DATA);
assertSW('9000');

check_TLV('8F', 1, '51');