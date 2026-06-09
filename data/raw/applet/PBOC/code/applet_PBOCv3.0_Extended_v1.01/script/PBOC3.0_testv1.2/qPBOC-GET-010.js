/*******************************************
 Test Name  : GetDataApplicationCurrencyCode
 Card Image : PBOC-PSO-031
 Reference  : VCPS 2CC.010.00.00
 Card Conf  : [Application Currency Code] personalized
 Condition  : N/A
*******************************************/

include("_PBOC_COMMON.js");

print('\n* TEST NO : qPBOC-GET-010');

print('\n* Power on the Card(ATR)');
reset();

select_PPSE();
assertSW('9000');

select_PBOC();
assertSW('9000');

print('**** GET DATA Application Currency Code');
response = send_GetData('9F51');
assertSW('9000');

assertEquals(response.substr(4, 2), "02");
assertEquals(response.substr(6, 4), "0156");
