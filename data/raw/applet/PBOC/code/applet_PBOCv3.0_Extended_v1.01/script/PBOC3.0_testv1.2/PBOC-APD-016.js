/*******************************************
 Test Name  : Read Other Application Data (APD 016)
 Objective  : Verify the Issuer Action Code-Default returned in response to a READ
RECORD command.
*******************************************/

include("_PBOC_COMMON.js");
// include("\\Images\\PBOC-PSO-001.js"); 이미지 발급 후 테스트 필요 

print('\n* Test Case : APD016');

include("pboc_CLN001.js");

print('\n* Power on the Card(ATR)');
reset();
select_PBOC();
assertSW('9000');
send_GPO(TEST_PDOL_DATA);
assertSW('9000');

print ("** Read Record **");
IACD_length = '';
IACD_value = '';

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
		IACD_length = lookup_BER_TLV(recordData, "9F0D", RETURN_LENGTH);
		IACD_value = lookup_BER_TLV(recordData, "9F0D", RETURN_VALUE);
		  
		
		
		if(IACD_value != ''){
			if(IACD_length != '05') error ('length is missing');
			if(IACD_value != 'F020040000') error ('data is missing');
			
				}						
		 	}
		}