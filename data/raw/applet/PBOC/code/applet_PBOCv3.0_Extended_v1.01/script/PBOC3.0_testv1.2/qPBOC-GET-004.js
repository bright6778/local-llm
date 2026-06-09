/*******************************************
 Test Name  : GetDataCVMLimit
 Card Image : PBOC-PSO-031
 Reference  : VCPS 2CC.004.00.00
 Card Conf  : [Card CVM Limit] personalized
 Condition  : N/A
*******************************************/

include("_PBOC_COMMON.js");

print('\n* TEST NO : qPBOC-GET-004');

print('\n* Power on the Card(ATR)');
reset();

select_PPSE();
assertSW('9000');

select_PBOC();
assertSW('9000');

response = send_GetData('9F6B');
assertSW('9000');
assertEquals(response.substr(4, 2), "06");
