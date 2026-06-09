/*******************************************
 Test Name  : Read Other Application Data (APD 019)
 Objective  : Verify the Issuer Country Code (for AUC) returned in response to a READ
RECORD command.
*******************************************/

include("_PBOC_COMMON.js");
// include("\\Images\\PBOC-PSO-001.js"); 이미지 발급 후 테스트 필요 

print('\n* Test Case : APD 019');

include("pboc_CLN001.js");

print('\n* Power on the Card(ATR)');
reset();
select_PBOC();
assertSW('9000');
send_GPO(TEST_PDOL_DATA);
assertSW('9000');

print ("** Read Record **");
ICC_length = '';
ICC_value = '';

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
		ICC_length = lookup_BER_TLV(recordData, "5F28", RETURN_LENGTH);
		ICC_value = lookup_BER_TLV(recordData, "5F28", RETURN_VALUE);
		  
		
		
		if(ICC_value != ''){
			if(ICC_length != '02') error ('length is missing');
			if(ICC_value != '0156') error ('data is missing');
			
				}						
		 	}
		}