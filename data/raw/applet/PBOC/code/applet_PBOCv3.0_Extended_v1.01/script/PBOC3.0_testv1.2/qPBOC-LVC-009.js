/*******************************************
 Test Name  : qVSDC Low Value Check - Offline approval
 Card Image : PBOC-PSO-037-(for qPBOC-LVC-004, 008)
 Reference  : VCPS 2CF.009.00.00
 Card Conf  : [Card Additional Process '9F68']
			 	- Byte 1 bit 8 = 1 'Low Value Check Support'
			 	- Byte 1 bit 1 = 1 'Return Available Offline Spending Amount'
			  [VLP Funds Limit '9F77']
			  [VLP Single Transaction Limit '9F78']
			  [VLP Available Funds '9F79'] 
			  [Available Offline Spending Amount '9F5D'] personalize
 Condition  : LT sends a SELECT command on PPSE and PBOC AID              
 *******************************************/


include("_PBOC_COMMON.js");

print('\n* Test Case : qPBOC-LVC-009');

print('\n* Power on the Card(ATR)');
reset();

select_PPSE();
assertSW('9000');
select_PBOC();
assertSW('9000');

VLP_prior = send_GetData('9F79');
assertSW('9000');

BIT_MASK(Terminal_Transaction_Qualifiers, 1, BIT_MASK_6);

response = send_GPO(CVN);
assertSW('9000');

print("[User Check] Verify that the MAC is not present in the Tag 9F10 - Issuer Application Data");
checkIAD("07010103900000010A01", "07011103900000010A01", 10);

validate_AC(AC);

