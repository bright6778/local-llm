/*******************************************
 Test Name  : Read Other Application Data (NEW 023)
 Objective  : Verify for a new card, when If new card, transmit online in ADA is not
set, and the transaction is declined offline, that the Card sets New Card in
the CVR.
*******************************************/

include("_PBOC_COMMON.js");

print('\n* Test Case : NEW 023');

print("\n* Transaction 1");
print('\n* Power on the Card(ATR)');
reset();
select_PBOC();
assertSW('9000');
send_GPO(TEST_PDOL_DATA);
assertSW('9000');
send_Verify('80', TEST_PLAIN_PIN);
assertSW('9000');
send_GEN_AC_1(AAC, TEST_CDOL1);
assertSW('9000');


check_CID("00");
check_CVR("03841000");