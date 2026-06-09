/*******************************************
 Test Name  : GetDataEC-AvailableFunds
 Card Image : PBOC-PSO-031
 Reference  : VCPS 2CC.009.00.00
 Card Conf  : [EC Available Funds] personalized
 Condition  : N/A
*******************************************/

include("_PBOC_COMMON.js");

print('\n* TEST NO : qPBOC-GET-009');

print('\n* Power on the Card(ATR)');
reset();

select_PPSE();
assertSW('9000');

select_PBOC();
assertSW('9000');

print('**** GET DATA EC Available Funds');
response = send_GetData('9F79');
assertSW('9000');
assertEquals(response.substr(4, 2), "06");
assertEquals(response.substr(6,12), "000000018000");
