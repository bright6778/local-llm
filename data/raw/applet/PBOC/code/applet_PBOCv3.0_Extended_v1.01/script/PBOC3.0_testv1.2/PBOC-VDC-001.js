include("_PBOC_COMMON.js");

print('\n* Test Case : VDC001');

print("\n* Transaction 1");
include("pboc_CLN001.js");

print("\n* Transaction 2");
include("pboc_ApprovedOffline_AA50.js");

print("\n* Transaction 3");
include("pboc_ApprovedOffline_AA50.js");

print("\n* Transaction 4");
include("pboc_ApprovedOffline_AA50.js");
check_CID("40");
check_CVR("03940000");

