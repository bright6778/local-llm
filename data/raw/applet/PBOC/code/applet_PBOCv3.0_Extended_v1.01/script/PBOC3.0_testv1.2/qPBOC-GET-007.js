/*******************************************
 Test Name  : GetDataEC-ResetThreshold
 Card Image : PBOC-PSO-031
 Reference  : VCPS 2CC.007.00.00
 Card Conf  : [EC Reset Threshold] personalized
 Condition  : N/A
*******************************************/

include("_PBOC_COMMON.js");

print('\n* TEST NO : qPBOC-GET-007');

print('\n* Power on the Card(ATR)');
reset();

select_PPSE();
assertSW('9000');

select_PBOC();
assertSW('9000');

print('**** GET DATA EC Reset Threshold');
response = send_GetData('9F6D');
assertSW('9000');

assertEquals(response.substr(4, 2), "06");
