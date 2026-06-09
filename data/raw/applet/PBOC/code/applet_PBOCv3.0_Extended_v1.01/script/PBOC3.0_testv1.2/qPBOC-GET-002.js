/*******************************************
 Test Name  : GetDataAOSA
 Card Image : PBOC-PSO-031
 Reference  : VCPS 2CC.002.00.00
 Card Conf  : [Available Offline Spending Amount] personalized
 Condition  : N/A
*******************************************/
include("_PBOC_COMMON.js");

print('\n* TEST NO : qPBOC-GET-002');

print('\n* Power on the Card(ATR)');
reset();

print("\n* Transaction 1");
select_PPSE();
assertSW('9000');

select_PBOC();
assertSW('9000');

/* Get Data for Available Offline Spending Amount */
response = send_GetData('9F5D');
assertSW('9000');

assertEquals(response.substr(4, 2), "06");
