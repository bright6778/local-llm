/*******************************************
 Test Name  : Read Other Application Data (NEW 029)
 Objective  : Verify for a new card, regardless of If new card, transmit online in ADA is
set or not, when Issuer Authentication is not performed as it is not
supported, and the transaction is declined online, that Card updates the
LOATC.
Verify, as next transaction is declined offline, that the Card sets New card
in the CVR.
*******************************************/

include("_PBOC_COMMON.js");

print('\n* Test Case : NEW 029');

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
send_ExternalAuth_Invalid();
send_GEN_AC_2(TC, TEST_CDOL2);
assertSW("9000");

print("\n* Transaction 2");
include("pboc_DeclinedOffline.js");

check_CID("00");
check_CVR("03849800");