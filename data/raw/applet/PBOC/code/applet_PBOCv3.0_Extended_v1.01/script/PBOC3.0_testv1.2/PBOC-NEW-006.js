/*******************************************
 Test Name  : Read Other Application Data (NEW 006)
 Objective  :Verify for a new card, when If new card, transmit online in ADA is not
set, and Issuer Authentication is not performed as it is not supported and
the transaction is declined online, that the Card updates the LOATC.
Verify the Card approves next transaction offline and set New card in the
CVR.
*******************************************/

include("_PBOC_COMMON.js");

print('\n* Test Case : NEW 006');

print("\n* Transaction 1");
print('\n* Power on the Card(ATR)');
reset();
select_PBOC();
assertSW('9000');
send_GPO(TEST_PDOL_DATA);
assertSW('9000');
send_Verify('80', TEST_PLAIN_PIN);
assertSW('9000');
send_GEN_AC_1(ARQC, TEST_CDOL1);
assertSW('9000');
send_GEN_AC_2(AAC, TEST_CDOL2);
assertSW("9000");



print("\n* Transaction 2");
include("pboc_ApprovedOffline.js");

check_CID("40");
check_CVR("03941000");

