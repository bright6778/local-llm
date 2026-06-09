/*******************************************
 Test Name  : Read Other Application Data (NEW 009)
 Objective  : Verify for a new card, when If new card, transmit online in ADA is set,
and Issuer Authentication is successful and the transaction is declined
online, that the Card does not update the LOATC.
Verify the Card requests next transaction to go online and sets New card in
the CVR.
*******************************************/

include("_PBOC_COMMON.js");

print('\n* Test Case : NEW 009');

print("\n* Transaction 1");
print('\n* Power on the Card(ATR)');
reset();
select_PBOC();
send_GPO(TEST_PDOL_DATA);
send_Verify('80', TEST_PLAIN_PIN);
send_GEN_AC_1(TC, TEST_CDOL1);
send_ExternalAuth();
send_GEN_AC_2(AAC, TEST_CDOL2);

print("\n* Transaction 2");
print('\n* Power on the Card(ATR)');
reset();
select_PBOC();
send_GPO(TEST_PDOL_DATA);
send_Verify('80', TEST_PLAIN_PIN);
send_GEN_AC_1(TC, TEST_CDOL1);

assertSW('9000');
check_CID("80");
check_CVR("03A41000");