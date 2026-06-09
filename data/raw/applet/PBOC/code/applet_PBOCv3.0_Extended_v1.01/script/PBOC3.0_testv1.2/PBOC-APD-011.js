/*******************************************
 Test Name  : Read Other Application Data (APD 011)
 Objective  : Verify the Cardholder Name Extended returned in response to a READ
RECORD command.
*******************************************/

include("_PBOC_COMMON.js");
// include("\\Images\\PBOC-PSO-001.js");

print('\n* Test Case : APD011');

include("pboc_CLN001.js");

print('\n* Power on the Card(ATR)');
reset();
select_PBOC();
assertSW('9000');
send_GPO(TEST_PDOL_DATA);
assertSW('9000');

print ("** Read Record **");
var CNE_length = '';
var CNE_value = '';

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
		CNE_length = parseInt(lookup_BER_TLV(recordData, "9F0B", RETURN_LENGTH),16);
		CNE_value = lookup_BER_TLV(recordData, "9F0B", RETURN_VALUE);
		  


			if(CNE_value != ''){	
				if(CNE_length < parseInt('1B',16) && CNE_length > parseInt('2D',16)) 
					error('length is missing');
				print('**CNE_value alphanumeric '+ CNE_value ); // view∑Œ »Æ¿Œ 
		  }		
		
			}						
	 	}
		
