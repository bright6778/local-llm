/*******************************************
 Test Name  : Read Other Application Data (APD 008)
 Objective  : Verify the Application PAN Sequence Number returned in response to a READ RECORD command.
*******************************************/

include("_PBOC_COMMON.js");
// include("\\Images\\PBOC-PSO-001.js");

print('\n* Test Case : APD008');

include("pboc_CLN001.js");

print('\n* Power on the Card(ATR)');
reset();
select_PBOC();
assertSW('9000');
send_GPO(TEST_PDOL_DATA);
assertSW('9000');

print ("** Read Record **");
var PAN_S_Number_length = '';
var PAN_S_Number_value = '';

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
		PAN_S_Number_length = lookup_BER_TLV(recordData, "5F34", RETURN_LENGTH);
		PAN_S_Number_value = lookup_BER_TLV(recordData, "5F34", RETURN_VALUE);
		  
		if(PAN_S_Number_value!= ''){
			if(PAN_S_Number_length != '01') error ('length is missing');
			if(PAN_S_Number_value != '01' ) error ('data is missing');
				}
								
		 	}
		}
