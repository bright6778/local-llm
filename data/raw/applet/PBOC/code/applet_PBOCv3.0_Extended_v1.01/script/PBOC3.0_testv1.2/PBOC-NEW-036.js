/*******************************************
 Test Name  : Read Other Application Data (NEW 036)
 Objective  : Verify for a new card, when If new card, transmit online in ADA is not
set, that the Card can approve the first transaction offline.
Verify for next two approved offline transactions, that the LOATC is '00 00'
and the Card sets New Card in the CVR.
Verify, for the fourth transaction 4, that the Card sets New Card in the CVR
as the LOATC register has not been updated. The Card shall request
transaction 4 to go online because the velocity checking counters have been
exceeded. (The LCOL is three).
*******************************************/

include("_PBOC_COMMON.js");

print('\n* Test Case : NEW 036');

print("\n* Transaction 1");
include("pboc_ApprovedOffline.js");

print("\n* Transaction 2");
include("pboc_ApprovedOffline.js");

print("\n* Transaction 3");
include("pboc_ApprovedOffline.js");

print("\n* Transaction 4");
print('\n* Power on the Card(ATR)');
reset();
select_PBOC();
assertSW('9000');
send_GPO(TEST_PDOL_DATA);
assertSW('9000');
send_Verify('80', TEST_PLAIN_PIN);
assertSW('9000');
send_GEN_AC_1(TC, TEST_CDOL1);
assertSW('9000');

check_CID("80");
check_CVR("03A43000");
