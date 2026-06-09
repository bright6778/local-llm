/* Application Block Success */
include("_PBOC_COMMON.js");

print("ABK082");

print("\n* Transaction 1");
include("pboc_CLN001.js");

send_AppBlock();
assertSW("9000");
