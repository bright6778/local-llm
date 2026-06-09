/*
 * TEST NO: CRM111
 * Objective: Verify the CVR in response to the first GENERATE AC for an offline decline transaction.
 */

include("_PBOC_COMMON.js");

print('\n* Test Case : CRM111');
reset();
select_PBOC();
assertSW('9000');
send_GPO(TEST_PDOL_DATA);
assertSW('9000');
send_Verify('80', TEST_PLAIN_PIN);
assertSW('9000');
send_GEN_AC_1(AAC, TEST_CDOL1);
assertSW('9000');

assertEquals(CVR.substring(2,3), "8");