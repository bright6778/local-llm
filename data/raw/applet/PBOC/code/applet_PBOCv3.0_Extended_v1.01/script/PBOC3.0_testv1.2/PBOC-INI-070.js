include("_PBOC_COMMON.js");
// include("\\Images\\PBOC-PSO-001.js")
include("pboc_CardBlockTest.js")

print('\n* Test Case : INI070');

print("\n* Power on the Card (ATR)");
reset();
select(pse_aid);
assertSW('6A81');
//select_PBOC();
//assertSW('6A81');
send_GPO(TEST_PDOL_DATA);
assertSW('6A81');