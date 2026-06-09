/*******************************************
 Test Name  : Read Other Application Data (APD 013)
 Objective  : Verify the CDOL1 returned in response to a READ RECORD command.
*******************************************/

include("_PBOC_COMMON.js");
// include("\\Images\\PBOC-PSO-001.js"); vis 와 pboc 의 CDOL1 이미지 발급 다르므로  perso 해준 다음 테스트 

print('\n* Test Case : APD013');

include("pboc_CLN001.js");

print('\n* Power on the Card(ATR)');
reset();
select_PBOC();
assertSW('9000');
send_GPO(TEST_PDOL_DATA);
assertSW('9000');

print ("** Read Record **");
CDOL1_length = '';
CDOL1_List_value = '';

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
		CDOL1_length = lookup_BER_TLV(recordData, "8C", RETURN_LENGTH);
		CDOL1_List_value = lookup_BER_TLV(recordData, "8C", RETURN_VALUE);
		  

		if(CDOL1_List_value != ''){
			if(CDOL1_length != '18') error ('length is missing');
			if(CDOL1_List_value != '9F02069F03069F1A0295055F2A029A039F21039C019F3704') error ('data is missing');
			
				}						
		 	}
		}
