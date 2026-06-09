/*******************************************
 Test Name  : qVSDC Low Value Check - Online processing
 Card Image : PBOC-PSE-037-(LVC)
 Reference  : VCPS 2CF.006.00.00
 Card Conf  : [Card Additional Process '9F68']
			 	- Byte 1 bit 8 = 1 'Low Value Check Support'
			 	- Byte 1 bit 1 = 1 'Return Available Offline Spending Amount'
			  [VLP Funds Limit '9F77']
			  [VLP Single Transaction Limit '9F78']
			  [VLP Available Funds '9F79'] 
			  [VLP Reset Threshold '9F6D'] personalize	  	
 Condition  : LT sends a SELECT command on PPSE and PBOC AID              
 *******************************************/

include("_PBOC_COMMON.js");

print('\n* Test Case : qPBOC-LVC-006');

print('\n* Power on the Card(ATR)');
reset();
select_PPSE();
select_PBOC();
assertSW('9000');
send_GetData('9F68');
assertSW('9000');

VLP_Funds = lookup_BER_TLV(send_GetData('9F79'), "9F79", RETURN_VALUE);
assertSW('9000');

VLP_Reset_Threshold = lookup_BER_TLV(send_GetData('9F6D'), "9F6D", RETURN_VALUE);
assertSW('9000');

Amount_Authorised =  parseInt(VLP_Funds, 10) - parseInt(VLP_Reset_Threshold, 10) + 100 + "";
while(Amount_Authorised.length < 12) Amount_Authorised = "0" + Amount_Authorised;

BIT_MASK(Terminal_Transaction_Qualifiers, 1, BIT_MASK_6);

GPOresponse = send_GPO(CVN);
assertSW('9000');
value_77 = lookup_BER_TLV(GPOresponse , "77", RETURN_VALUE);

VLP_Funds = lookup_BER_TLV(send_GetData('9F79'), '9F79', RETURN_VALUE);
assertSW('9000');

if(AIP == "") error("AIP doesn't exist");
if(ATC == "") error("ATC doesn't exist");
if(AC == "")  error("Application Cryptogram doesn't exist");
if(Issuer_Application_Data == "") error("Issuer Application Data doesn't exist");

checkIAD("07010103A02000010A01", "07011103A02000010A01", 10);

if(lookup_BER_TLV(value_77, "5F34", RETURN_VALUE) == "") error("Application PAN Sequence Number doesn't exist");
if(lookup_BER_TLV(value_77, "9F6C", RETURN_VALUE) == "") error("Card Transaction Qualifier doesn't exist");
if(lookup_BER_TLV(value_77, "9F5D", RETURN_VALUE) == "") error("Available Offline Spending Amount doesn't exist");

Available_Offline_Spending_Amount = lookup_BER_TLV(value_77, "9F5D", RETURN_VALUE);

validate_AC(AC);
print("[User Check] Compare and verify the card response data for the tags '9F6C', '57' and '5F34' with the card image personalization data");
//pause();

assertEquals(Available_Offline_Spending_Amount, VLP_Funds);
