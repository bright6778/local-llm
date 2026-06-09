/* VERIFY command */
include("_PBOC_CONF.js");
include("_PBOC_COMMON.js");

print('\n* Test Case : VRY011');

include("pboc_CLN001.js");

reset();
select_PBOC();
assertSW('9000');
send_GPO(TEST_PDOL_DATA);
assertSW('9000');

send_Verify('80', TEST_PLAIN_PIN);
assertSW("9000");