include("_PBOC_COMMON.js");

print('\n* Power on the Card(ATR)');
reset();

select_PPSE();
assertSW('9000');
select_PBOC();
assertSW('9000');

var VLP_proir = send_GetData('9F79');
assertSW('9000');

BIT_MASK(Terminal_Transaction_Qualifiers, 1, BIT_MASK_4);
BIT_MASK(Terminal_Transaction_Qualifiers, 1, BIT_MASK_6);

GPOresponse = send_GPO(CVN);
assertSW('9000');

var VLP_after = send_GetData('9F79');

assertSW('9000');

Read_Record();

//reset();