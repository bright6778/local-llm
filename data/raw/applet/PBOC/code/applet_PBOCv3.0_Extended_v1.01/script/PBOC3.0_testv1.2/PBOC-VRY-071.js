/* VERIFY command */
include("_PBOC_CONF.js");
include("_PBOC_COMMON.js");

print('\n* Test Case : VRY071');

reset();
select_PBOC();
assertSW('9000');
send_GPO(TEST_PDOL_DATA);
assertSW('9000');

send_Verify('80', TEST_PLAIN_PIN_INVALID);
assertSW("63C2");