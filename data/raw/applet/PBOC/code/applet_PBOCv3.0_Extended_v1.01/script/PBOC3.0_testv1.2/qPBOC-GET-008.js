/*******************************************
 Test Name  : GetDataEC-SingleTransactionLimit
 Card Image : PBOC-PSO-031
 Reference  : VCPS 2CC.008.00.00
 Card Conf  : [EC Single Transaction Limit] personalized
 Condition  : N/A
*******************************************/

include("_PBOC_COMMON.js");

print('\n* TEST NO : qPBOC-GET-008');

print('\n* Power on the Card(ATR)');
reset();

select_PPSE();
assertSW('9000');

select_PBOC();
assertSW('9000');

print('**** GET DATA EC Single Transaction Limit');
response = send_GetData('9F78');
assertSW('9000');
assertEquals(response.substr(4, 2), "06");
assertEquals(response.substr(6,12), "000000001000");
