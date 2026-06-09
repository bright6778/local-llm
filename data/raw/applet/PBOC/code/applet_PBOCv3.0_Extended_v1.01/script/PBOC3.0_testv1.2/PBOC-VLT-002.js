include("_PBOC_COMMON.js");

print('\n* Test Case : VLT002');

print("\n* Transaction 1");
include("pboc_CLN001.js");

print("\n* Transaction 2");
include("pboc_ApprovedOffline.js");

print("\n* Transaction 3");
include("pboc_ApprovedOffline.js");

print("\n* Transaction 4");
include("pboc_ApprovedOffline.js");

check_CID("40");
check_CVR("03940000");
