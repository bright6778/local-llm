include("_PBOC_COMMON.js");
//include("\\Images\\PBOC-PSO-001.js")
include("pboc_AppBlk.js")

print('\n* Test Case : INI060');

print("\n* Power on the Card (ATR)");
reset();
select_PBOC();
assertSW('6283');

send_GPO(TEST_PDOL_DATA);
assertSW('9000');

include("PBOC-UTILITY-001-APPUNBLOCK.js")
