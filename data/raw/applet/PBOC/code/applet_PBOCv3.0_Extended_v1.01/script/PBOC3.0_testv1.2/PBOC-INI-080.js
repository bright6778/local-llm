include("_PBOC_COMMON.js");
//include("\\Images\\PBOC-PSO-001.js")

print('\n* Test Case : INI080');

print("\n* Power on the Card (ATR)");
reset();
select('315041592E5359532E4444463031');
send_GPO(TEST_PDOL_DATA);
assertSW('6D00');