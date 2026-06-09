/*******************************************
 Test Name  : qVSDC Low Value Check - Online Processing (ARQC)
 Card Image : PBOC-PSE-037-(for LVC)
 Reference  : VCPS 2CF.001.00.00
 Card Conf  : [Card Additional Process]
			 	- Byte 1 bit 8 = 1 'Low Value Check Support'
			  [VLP Funds Limit '9F77']
			  [VLP Single Transaction Limit '9F78']
			  [VLP Available Funds '9F79'];			  	
 Condition  : LT sends a SELECT command on PPSE and PBOC AID              
 *******************************************/

include("_PBOC_COMMON.js");

print('\n* Test Case : qPBOC-LVC-001');

print('\n* Power on the Card(ATR)');
reset();
select_PPSE();
assertSW('9000');
select_PBOC();
assertSW('9000');

VLP_Funds_1 = lookup_BER_TLV(send_GetData('9F79'), '9F79', RETURN_VALUE);
assertSW('9000');

VLP_Single_TX_Limit = lookup_BER_TLV(send_GetData('9F78'), '9F78', RETURN_VALUE);
assertSW('9000');

Amount_Authorised =  parseInt(VLP_Single_TX_Limit, 10) + 100 + "";
while(Amount_Authorised.length < 12) Amount_Authorised = "0" + Amount_Authorised;

BIT_MASK(Terminal_Transaction_Qualifiers, 1, BIT_MASK_6);

GPOresponse = send_GPO(CVN);
assertSW('9000');

VLP_Funds_2 = lookup_BER_TLV(send_GetData('9F79'), '9F79', RETURN_VALUE);
assertSW('9000');

value_77 = lookup_BER_TLV(GPOresponse, "77", RETURN_VALUE);
if(AIP == "") error("AIP doesn't exist");
if(ATC == "") error("ATC doesn't exist");
if(Issuer_Application_Data == "") error("Issuer Application Data doesn't exist");	  
if(AC == "") error("Application Cryptogram doesn't exist");
checkIAD("07010103A0200001", "07011103A0200001", 8);
 
if(lookup_BER_TLV(value_77, "5F34", RETURN_VALUE) == "") error("Application PAN Sequence Number doesn't exist");
if(lookup_BER_TLV(value_77, "9F6C", RETURN_VALUE) == "") error("Card Transaction Qualifier doesn't exist");
assertEquals(lookup_BER_TLV(value_77, "5F34", RETURN_VALUE), "01")

if(VLP_Funds_1 != VLP_Funds_2) error("failed verify VLP Available Funds remains the same");
print("[User Check] Compare and verify the card response data for the tags '9F6C', '82', '57' and '5F34' with the card image personalization data");

validate_AC(AC);
