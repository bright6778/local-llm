/*******************************************
 Test Name  : PUT DATA on the Consecutive Transaction Limit (International) (PLI 003)
 Objective  : Perform a PUT DATA command on the Consecutive Transaction Limit
(International) with an invalid MAC after an online approval. Issuer
Authentication was successfully performed.
The Consecutive Transaction limit (International) is five.


*******************************************/

include("_PBOC_COMMON.js");
//include("\\Images\\PBOC-PSO-007.js");

print('\n* Test Case : PLI 003');

print("\n* Transaction 1");
include("pboc_CLN001.js");

print("\n* Transaction 2");
reset();
select_PBOC();
assertSW("9000");
send_GPO(TEST_PDOL_DATA);
assertSW("9000");
send_Verify('80', TEST_PLAIN_PIN);
assertSW("9000");
send_GEN_AC_1(ARQC, TEST_CDOL1);
assertSW('9000');
send_ExternalAuth();
assertSW('9000');
send_GEN_AC_2(TC, TEST_CDOL2);
assertSW("9000");
send_PutData_Invalid("9F53", "02");
assertSW("6988");

print("\n* Transaction 3");
include("pboc_CLN001.js");

print("\n* Transaction 4");
include("pboc_ApprovedOffline.js");

print("\n* Transaction 5");
include("pboc_ApprovedOffline.js");

print("\n* Transaction 6");
include("pboc_ApprovedOffline.js");

print("\n* Transaction 7");
include("pboc_ApprovedOffline.js");

check_CVR("03940000");
