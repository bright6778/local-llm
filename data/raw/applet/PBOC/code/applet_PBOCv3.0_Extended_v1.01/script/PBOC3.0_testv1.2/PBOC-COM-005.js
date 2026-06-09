include("_PBOC_COMMON.js");

var COM005_Result;
var COM005_ATC;

print('\n* Test Case : COM005');

print("\n* Transaction 1");
include("pboc_CLN001.js");
COM005_ATC = ATC;

print("\n* Transaction 2");
reset();
select_PBOC();
assertSW('9000');
send_GPO(TEST_PDOL_DATA);
assertSW('9000');
send_Verify('80', TEST_PLAIN_PIN);
assertSW('9000');
COM005_Result = send_GEN_AC_1(AAC | CDA_sign_requested, TEST_CDOL1);
assertSW('9000');

assertEquals(CID, '00');
assertEquals(toHex(to_val(ATC)), toHex(to_val(COM005_ATC) + 1));
assertEquals(CVR, '03840000');