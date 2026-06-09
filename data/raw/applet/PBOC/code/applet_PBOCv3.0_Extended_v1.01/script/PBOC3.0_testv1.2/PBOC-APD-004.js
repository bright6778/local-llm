/*******************************************
 Test Name  : Read Other Application Data (APD 004)
 Objective  :Verify the Application Discretionary Data returned in response to a READ
RECORD command.
*******************************************/

include("_PBOC_COMMON.js");

//include("\\Images\\PBOC-PSO-001.js");

print('\n* Test Case : APD004');

include("pboc_CLN001.js");

print('\n* Power on the Card(ATR)');
reset();
select_PBOC();
assertSW('9000');
send_GPO(TEST_PDOL_DATA);
assertSW('9000');

var application_Discretionary_data = '';
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
		application_Discretionary_data = lookup_BER_TLV(recordData, "9F05", RETURN_LENGTH); 
		print('** application_Discretionary_data : ' + application_Discretionary_data);

			if(application_Discretionary_data  != ''){	
				if(application_Discretionary_data  < parseInt('01',16) && application_Discretionary_data  > parseInt('20',16)) 
					error('length is missing');
		
		  }
		}
	}		
		
		
/* error 	
		if((application_Discretionary_data != ''&& application_Discretionary_data.substring(4,5),16) != '01' && (application_Discretionary_data.substring(4,5),16) != '20')
		error('data is missing');
	}
}
*/