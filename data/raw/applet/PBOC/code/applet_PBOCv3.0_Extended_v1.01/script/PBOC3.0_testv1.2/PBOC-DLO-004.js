include("_PBOC_COMMON.js");

print('\n* Test Case : DLO004');

print("\n* Transaction 1");
include("pboc_CLN001.js");

print("\n* Transaction 2");
include ("pboc_DeclinedOffline_forDDA.js");

print("\n* Transaction 3");
include ("pboc_ApprovedOffline_forDDA.js");
check_CID("40");
check_CVR("03940002");