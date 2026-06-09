/*******************************************
 Test Name  : GetDataEC-FundsLimit
 Card Image : PBOC-PSO-031
 Reference  : VCPS 2CC.006.00.00
 Card Conf  : [EC Funds Limit] personalized
 Condition  : N/A
*******************************************/

include("_PBOC_COMMON.js");

print('\n* TEST NO : qPBOC-GET-006');

print('\n* Power on the Card(ATR)');
reset();

select_PPSE();
assertSW('9000');

select_PBOC();
assertSW('9000');

print('**** GET DATA EC Funds Limit');
response = send_GetData('9F77');
assertSW('9000');

assertEquals(response.substr(4, 2), "06");
