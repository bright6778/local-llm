/*******************************************
 Test Name  : Read Other Application Data (NEW 024)
 Objective  :Verify for a new card, when If new card, transmit online in ADA is set,
and the transaction is declined offline, that the Card sets New Card in the
CVR.
*******************************************/

include("_PBOC_COMMON.js");

print('\n* Test Case : NEW 024');

print("\n* Transaction 1");
include("pboc_DeclinedOffline.js");


check_CID("00");
check_CVR("03841000");