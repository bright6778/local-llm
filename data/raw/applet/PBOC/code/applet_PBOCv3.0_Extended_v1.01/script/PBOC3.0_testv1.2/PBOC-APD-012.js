/*******************************************
 Test Name  : Read Other Application Data (APD 012)
 Objective  : Verify the CVM List returned in response to a READ RECORD command.
*******************************************/

include("_PBOC_COMMON.js");
//include("\\Images\\PBOC-PSO-001.js");

print('\n* Test Case : APD012');

include("pboc_CLN001.js");

print('\n* Power on the Card(ATR)');
reset();
select_PBOC();
assertSW('9000');
send_GPO(TEST_PDOL_DATA);
assertSW('9000');

print ("** Read Record **");
var CVM_List_length = '';
var CVM_List_value = '';

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
		CVM_List_length = lookup_BER_TLV(recordData, "8E", RETURN_LENGTH);
		CVM_List_value = lookup_BER_TLV(recordData, "8E", RETURN_VALUE);
		  
		if(CVM_List_value != ''){
			if(CVM_List_length != '12') error ('length is missing');
			if(CVM_List_value != '0000000000000000410342035E0343031F00') error ('data is missing');
			
				}						
		 	}
		}
