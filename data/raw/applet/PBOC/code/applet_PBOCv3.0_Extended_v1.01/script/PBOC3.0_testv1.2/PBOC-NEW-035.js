/*******************************************
 Test Name  : Read Other Application Data (NEW 035)
 Objective  : Verify for a new card, when If new card, transmit online in ADA is not
set, that the Card can approve first transaction offline.
Verify in next transaction, that the LOATC is '00 00' and the Card sets New
Card in the CVR. (The LCOL is three).
*******************************************/

include("_PBOC_COMMON.js");

print('\n* Test Case : NEW 034');

print("\n* Transaction 1");
include("pboc_ApprovedOffline.js");

print("\n* Transaction 2");
include("pboc_ApprovedOffline.js");


check_CID("40");
check_CVR("03941000");
