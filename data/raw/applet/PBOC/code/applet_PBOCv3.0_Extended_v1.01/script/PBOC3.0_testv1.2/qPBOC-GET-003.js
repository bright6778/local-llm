/*******************************************
 Test Name  : GetDataCAP
 Card Image : PBOC-PSO-031
 Reference  : VCPS 2CC.003.00.00
 Card Conf  : [Card Additional Process] personalized
 Condition  : N/A
*******************************************/

include("_PBOC_COMMON.js");

print('\n* TEST NO : qPBOC-GET-003');

print('\n* Power on the Card(ATR)');
reset();

select_PPSE();
assertSW('9000');

select_PBOC();
assertSW('9000');

response = send_GetData('9F68');
assertSW('9000');

assertEquals(response.substr(4, 2), "04");
