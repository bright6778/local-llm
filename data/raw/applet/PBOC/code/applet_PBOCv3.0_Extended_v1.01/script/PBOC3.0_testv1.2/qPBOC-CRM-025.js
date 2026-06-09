/*******************************************
 Test Name  : Contactless application with multiple application instances
 Card Image : 
 Reference  : VCPS 2CE.025.00.00
 Card Conf  : MSD supported
 Condition  : LT sends a SELECT command on PPSE and PBOC AID
 *******************************************/

include("_PBOC_COMMON.js");

print('\n* Test Case : 2CE.025.00.00');

print('\n* Case 01: MSD transaction when online cryptogram is requested');
check_result_1_5();


print('\n* Case 02: MSD transaction for dCVV (online cryptogram is not requested)');
check_result_2_6();


print('\n* Case 03: qVSDC Low Value Check');
check_result_3_7();


print("***********************CAUTION!!!************************");
print("Please remove active card and insert contact card");
print("*********************************************************");
pause();
print('\n* Case 04: Block applications in contact VSDC mode');
print('\n* Power on the Card(ATR)');
reset();
select_PBOC();
assertSW('9000');
send_GPO(TEST_PDOL_DATA);
assertSW('9000');
send_Verify('80', TEST_PLAIN_PIN);
assertSW('9000');
send_GEN_AC_1(ARQC, TEST_CDOL1);
assertSW('9000');
check_CID('80');
check_CVR('03A40000');
send_ExternalAuth();
assertSW('9000');
send_GEN_AC_2(AAC, TEST_CDOL2);
assertSW('9000');
check_CID('00');
check_CVR('03240000');
send_AppBlock();
assertSW('9000');

select(pboc2_aid);
assertSW('6283');
select(pboc3_aid);
assertSW('6283');

print("***********************CAUTION!!!************************");
print("Please remove active card and insert contactless card");
print("*********************************************************");
pause();
print('\n* Case 05: MSD transaction when online cryptogram is requested');
check_result_1_5();


print('\n* Case 06: MSD transaction when online cryptogram is not requested');
check_result_2_6();

print('\n* Case 07: qVSDC Low Value Check ? Offline approval');
check_result_3_7();

include("PBOC-UTILITY-001-APPUNBLOCK.js");

function check_result_1_5(){

	print('\n* Power on the Card(ATR)');
	reset();
	select_PPSE();
	assertSW('9000');
	select_PBOC();
	assertSW('9000');

	BIT_MASK(Terminal_Transaction_Qualifiers, 1, BIT_MASK_8);
	BIT_MASK(Terminal_Transaction_Qualifiers, 2, BIT_MASK_8);

	response = send_GPO(CVN);
	assertSW('9000');

	ATC_gt = send_GetData('9F36');
	assertSW('9000');
	
	reponse = lookup_BER_TLV(response, "77", RETURN_VALUE);

	if(AIP == "") error("AIP doesn't exist");
	if(ATC == "") error("ATC doesn't exist");
	if(Track2_Equivalent_Data == "") error("Track 2 Equivalent Data doesn't exist");
	if(Issuer_Application_Data == "") error("Issuer Application Data doesn't exist");
	else{
		assertEquals(Issuer_Application_Data, "06011103A00000");
	}
	if(AC == "") error("Application Cryptogram doesn't exist");
	if(lookup_BER_TLV(response, "5F20", RETURN_VALUE) == "") 
			error("Cardholder Name doesn't exist");
	if(lookup_BER_TLV(response, "9F1F", RETURN_VALUE) == "") 
			error("Track 1 Discretionary Data doesn't exist");

	validate_AC(AC);
	
	assertEquals(ATC, ATC_gt);

	print("[User View] Verify the card response data for the tags '57' with the card image personalization data");

}
function check_result_2_6(){
	
	select_PBOC();
	assertSW('9000');

	Terminal_Transaction_Qualifiers = '00000000';
	BIT_MASK(Terminal_Transaction_Qualifiers, 1, BIT_MASK_8);

	var response = send_GPO(CVN);
	assertSW('9000');

	var track2 = "";
	for(i = 0 ; i < AFL.length ; i += 8)
	{
		recordRange = AFL.substring(i, i + 8);
		SFI = parseInt(recordRange.substring(0,2), 16) >> 3;
		startRecordNumber = parseInt(recordRange.substring(2,4), 16);
		endRecordNumber = parseInt(recordRange.substring(4,6), 16);
	
		print("READ RECORD");
		for(j = startRecordNumber; j <= endRecordNumber; j++)
		{
			print("SFI : " + SFI + "  " + "Record Number : " + j);
			recordData = send_ReadRecord(SFI, j);
			assertSW("9000");

			recordData = lookup_BER_TLV(recordData, "70", RETURN_VALUE);
			track2 = lookup_BER_TLV(recordData, "57", RETURN_VALUE);
		}
	}

	if(AIP == "") error("AIP doesn't exist");
	if(AFL == "") error("AFL doesn't exist");
	
	if(track2 == "") error("The AFL (Tag '94') returned in the GET PROCESSING OPTIONS response must point to record containing Track 2 Data");

	print("[User Check] Tag ¡®57¡¯ Track 2 Equivalent Data contains the Discretionary Data (Tag '9F20')");

	print("***********************CAUTION!!!************************");
	print("Perform the dCVV algorithm and confirm that it matches the dCVV value found in the Track 2 equivalent data");
	print("À§ ºÎºÐ ºüÁü ¤Ð¤Ð");
	print("*********************************************************");
	pause();
}

function check_result_3_7(){

	select_PBOC();
	assertSW('9000');

	VLP_Funds_prior = send_GetData('9F79');
	assertSW('9000');

	Terminal_Transaction_Qualifiers = '00000000';
	BIT_MASK(Terminal_Transaction_Qualifiers, 1, BIT_MASK_4);
	BIT_MASK(Terminal_Transaction_Qualifiers, 1, BIT_MASK_6);

	response = send_GPO(CVN);
	assertSW('9000');

	Read_Record();

	VLP_Funds_after = send_GetData('9F79');
	assertSW('9000');

	ATC_gt = send_GetData('9F36');
	assertSW('9000');

	reponse = lookup_BER_TLV(response, "77", RETURN_VALUE);

	if(AIP == "") error("AIP doesn't exist");
	if(ATC == "") error("ATC doesn't exist");
	if(Track2_Equivalent_Data == "") error("Track 2 Equivalent Data doesn't exist");
	if(Issuer_Application_Data == "") error("Issuer Application Data doesn't exist");
	else{
		assertEquals(Issuer_Application_Data, "06010103900000");
	}
	if(AC == "") error("Application Cryptogram doesn't exist");
	if(lookup_BER_TLV(response, "9F6C", RETURN_VALUE) == "") 
			error("Card Transaction Qualifier doesn't exist");
	if(lookup_BER_TLV(response, "9F4B", RETURN_VALUE) == "") 
			error("Signed Dynamic Application Data doesn't exist");
	if(AFL == "") error("AFL doesn't exist");

	validate_AC(AC);


	print("[User Check] Compare and verify the card response data for the tags '9F68', '82', '57' and '5F34' with the card image personalization data");

}





