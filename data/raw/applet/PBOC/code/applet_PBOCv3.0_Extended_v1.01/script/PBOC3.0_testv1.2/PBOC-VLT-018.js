include("_PBOC_COMMON.js");

print('\n* Test Case : VLT018');

print("\n* Transaction 1");
include("pboc_CLN001.js");

print("\n* Transaction 2");
include("pboc_ApprovedOffline.js");

print("\n* Transaction 3");
include("pboc_ApprovedOffline.js");

print("\n* Transaction 4");
include("pboc_ApprovedOffline.js");

print("\n* Transaction 5");
include("pboc_DeclinedOffline.js");

check_CID("00");
check_CVR("03842000");
