/*******************************************
 Test Name  : Read Other Application Data (APD 020)
 Objective  : Verify the Service Code returned in response to a READ RECORD
command.
*******************************************/

include("_PBOC_COMMON.js");
// include("\\Images\\PBOC-PSO-001.js"); 이미지 발급 후 테스트 필요 

print('\n* Test Case : APD 020');

include("pboc_CLN001.js");

print('\n* Power on the Card(ATR)');
reset();
select_PBOC();
assertSW('9000');
send_GPO(TEST_PDOL_DATA);
assertSW('9000');

print ("** Read Record **");
SC_length = '';
SC_value = '';

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
		SC_length = lookup_BER_TLV(recordData, "5F30", RETURN_LENGTH);
		SC_value = lookup_BER_TLV(recordData, "5F30", RETURN_VALUE);
		  
		
		
		if(SC_value != ''){
			if(SC_length != '02') error ('length is missing');
			if(SC_value != '0201') error ('data is missing');
			
				}						
		 	}
		}