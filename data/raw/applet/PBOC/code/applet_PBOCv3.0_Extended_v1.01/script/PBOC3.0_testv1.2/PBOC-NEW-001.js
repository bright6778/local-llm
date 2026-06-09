/*******************************************
 Test Name  : Read Other Application Data (NEW 001)
 Objective  : Verify a new card approves the transaction offline when If new card,
transmit online in ADA is not set.
*******************************************/

include("_PBOC_COMMON.js");

print('\n* Test Case : NEW 001');

print("\n* Transaction 1");

include("pboc_ApprovedOffline.js");


if(CVR.substring(2,3) != "9" || CVR.substring(4,6) & 0x10 != 0x00)
	error("* Check CVR ... FAIL");
else
	print("* Check CVR ... PASS");

check_CID("40");
check_CVR("03941000");
