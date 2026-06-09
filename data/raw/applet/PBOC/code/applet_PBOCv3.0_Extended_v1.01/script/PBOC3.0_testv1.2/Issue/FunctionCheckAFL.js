include("ConfAFL.js");


function send_ReadRecord(SFI, recordNumber)
{
	print('\n*******************************************');
	print('* Read Record');
	print('*******************************************');
	
	var p1 = toHex(recordNumber);
	var p2 = toHex( SFI << 3 | 0x04);
	response = send_Command_CorrectedLe('00 B2' + p1 + p2 + '00');
	
	return response; 
}

function send_Command_CorrectedLe(command)
{
	response = send(command);
	if(getSW().substring(0,2) == '6C') {
		response = send(command.substring(0, command.length - 2) + getSW().substring(2,4));
	}
	return response;

}



function lookup_BER_TLV(data, tag, kindOfReturn)
{
	var currentData = data;
	var currentTag;
	var currentLength;
	var nLength;

	while(currentData.length > 0)
	{
		currentTag = get_CurrentTag(currentData, RETURN_VALUE);
		currentLength = get_CurrentLength( currentData.substring(currentTag.length, currentData.length), 	RETURN_VALUE);
		nLength = get_CurrentLength(currentData.substring(currentTag.length, currentData.length), RETURN_LENGTH);
		
		if(tag == currentTag)
		{
			if(kindOfReturn == RETURN_LENGTH)
				return toHex(currentLength/2);
			else
				return currentData.substring(currentTag.length + nLength, currentTag.length + nLength + currentLength); 
		}
		else
		{
			currentData = skip_Current_BER_TLV(currentData);
		}
	}
	
	return "";
	
}


function lookup_BER_TL(data, tag, kindOfReturn)
{
	var currentData = data;
	var currentTag;
	var currentLength;
	var nLength;

	while(currentData.length > 0)
	{
		currentTag = get_CurrentTag(currentData, RETURN_VALUE);
		currentLength = get_CurrentLength( currentData.substring(currentTag.length, currentData.length), 	RETURN_VALUE);
		nLength = get_CurrentLength(currentData.substring(currentTag.length, currentData.length), RETURN_LENGTH);
		
		if(tag == currentTag)
		{
			if(kindOfReturn == RETURN_LENGTH)
				return toHex(currentLength/2);
			else
				return currentData.substring(currentTag.length + nLength, currentTag.length + nLength + currentLength); 
		}
		else
		{
			currentData = skip_Current_BER_TL(currentData);
		}
	}
	
	return "";
	
}

//data의 가장 앞부분 tag를 반환한다.
//이 함수는 data가 BER-TLV구조임을 가정한다.
//data : BER-TLV구조를 가지는 데이터
//kinOfReturn : 반환되는 값의 종류
//							: RETURN_LENGTH : tag의 길이를 반환
//							: RETURN_VALUE : tag의 값을 반환
//
//출력
//kinOfReturn == RETURN_LENGTH : tag의 길이 반환
//kinOfReturn == RETURN_VALUE : tag의 값 반환
function get_CurrentTag(data, kindOfReturn)
{
	var currentTag = data.substring(0, 2);
		
	//tag가 2바이트로 이루어져 있으면....
	if((parseInt(currentTag, 16) & 0x1F ) == 0x1F)
			currentTag = data.substring(0, 4);
			
	return kindOfReturn == RETURN_VALUE ? currentTag : currentTag.length;
}


//data의 가장 앞부분의 length를 반환한다.
//이 함수는 data의 가장 앞부분이 length임을 가정한다.
//
//입력
//data : length가 가장 앞부분에 위치한 데이터
//kinOfReturn : 반환되는 값의 종류
//							: RETURN_LENGTH : length의 길이를 반환
//							: RETURN_VALUE : length의 값을 반환
//
//출력
//kinOfReturn == RETURN_LENGTH : length의 길이 반환, length가 7F가 넘어갈 경우 포함되는 Length Indicator까지 포함되는 길이.
//kinOfReturn == RETURN_VALUE : length의 값 반환, length가 7F가 넘어가더라도 실제 길이를 나타내는 바이트만 반환.
function get_CurrentLength(data, kindOfReturn)
{
	var currentLength = parseInt(data.substring(0, 2), 16);
	var nByte_Length = 0;
	//length가 7F가 넘으면, length가 2바이트 이상으로 구성되어 있으면
	if((currentLength & TLV_LengthIndicator) == TLV_LengthIndicator)
	{
		nByte_Length = currentLength & TLV_LengthByteMask;
		currentLength = parseInt(data.substring(2, 2 + (nByte_Length * 2)), 16);
	}
	
	return kindOfReturn == RETURN_VALUE ? currentLength * 2 : nByte_Length * 2 + 2;
}

//현재의 BER-TLV를 스킵한다.
//이 함수는 data가 BER-TLV구조를 가진다고 가정한다.
//
//입력
//data : BER-TLV 구조를 가진 데이터
//
//출력 : 하나의 BER-TLV구조가 스킵된 BER-TLV구조를 가진 데이터 
function skip_Current_BER_TLV(data)
{
	var nextTagIndex = 0;
	var tagLength = get_CurrentTag(data, RETURN_LENGTH);
	var nLength = get_CurrentLength( data.substring(tagLength, data.length), RETURN_LENGTH);
	var length = get_CurrentLength( data.substring(tagLength, data.length), RETURN_VALUE);
	nextTagIndex = tagLength + nLength + length;
	
	return data.substring(nextTagIndex, data.length);
}


function skip_Current_BER_TL(data)
{
	var nextTagIndex = 0;
	var tagLength = get_CurrentTag(data, RETURN_LENGTH);
	var nLength = get_CurrentLength( data.substring(tagLength, data.length), RETURN_LENGTH);
	var length = get_CurrentLength( data.substring(tagLength, data.length), RETURN_VALUE);
	nextTagIndex = tagLength + nLength;
	
	return data.substring(nextTagIndex, data.length);
}






function checking_AFL_related_record(AFL)
{
	var recordRange, nStaticDataRecord;
	
	
	print('\n*************************************************');
	print("* - check all record of returned AFL");	
	print('*************************************************');
	
	//모든 SFI 검사
	for(i = 0 ; i < AFL.length ; i += 8)
	{
		recordRange = AFL.substring(i, i + 8);
		nStaticDataRecord = parseInt(recordRange.substring(6,8), 16);
		
		
		SFI = parseInt(recordRange.substring(0,2), 16) >> 3;
		startRecordNumber = parseInt(recordRange.substring(2,4), 16);
		endRecordNumber = parseInt(recordRange.substring(4,6), 16);
				
	
		
		
		// send data and checking 
		for(j = startRecordNumber; j <= endRecordNumber; j++)
		{
			if(SFI >= 1 && SFI <= 10){
				
				resp=send_ReadRecord(SFI, j);				
				assertSW('9000');
				
				resp= lookup_BER_TLV(response, "70", RETURN_VALUE);				
				if(tag5F25	== '')tag5F25	=lookup_BER_TLV(resp,'5F25',RETURN_VALUE);
				if(tag5F24	== '')tag5F24	=lookup_BER_TLV(resp,'5F24',RETURN_VALUE);
				if(tag5A        == '')tag5A	=lookup_BER_TLV(resp,'5A',RETURN_VALUE);
				if(tag5F34	== '')tag5F34	=lookup_BER_TLV(resp,'5F34',RETURN_VALUE);
				if(tag9F07	== '')tag9F07	=lookup_BER_TLV(resp,'9F07',RETURN_VALUE);
				if(tag8E	== '')tag8E	=lookup_BER_TLV(resp,'8E',RETURN_VALUE);
				if(tag9F0D	== '')tag9F0D	=lookup_BER_TLV(resp,'9F0D',RETURN_VALUE);
				if(tag9F0E	== '')tag9F0E	=lookup_BER_TLV(resp,'9F0E',RETURN_VALUE);
				if(tag9F0F	== '')tag9F0F	=lookup_BER_TLV(resp,'9F0F',RETURN_VALUE);
				if(tag90	== '')tag90	=lookup_BER_TLV(resp,'90',RETURN_VALUE);
				if(tag9F32	== '')tag9F32	=lookup_BER_TLV(resp,'9F32',RETURN_VALUE);
				if(tag92	== '')tag92	=lookup_BER_TLV(resp,'92',RETURN_VALUE);
				if(tag8F	== '')tag8F	=lookup_BER_TLV(resp,'8F',RETURN_VALUE);
								
				if(tag93	== '')tag93	=lookup_BER_TLV(resp,'93',RETURN_VALUE);																																 		
																		
			}
				
		}
		
	}
	print('\n*************************************************');
	print("* - SAD Related DATA");	
	print('*************************************************');
	
	if(tag5F25	!= '')print('tag5F25	   = '+tag5F25	     );
	if(tag5F24	!= '')print('tag5F24	   = '+tag5F24	     );
	if(tag5A        != '')print('tag5A         = '+tag5A            );
	if(tag5F34	!= '')print('tag5F34	   = '+tag5F34	     );
	if(tag9F07	!= '')print('tag9F07	   = '+tag9F07	     );
	if(tag8E	!= '')print('tag8E	   = '+tag8E	     );
	if(tag9F0D	!= '')print('tag9F0D	   = '+tag9F0D	     );
	if(tag9F0E	!= '')print('tag9F0E	   = '+tag9F0E	     );
	if(tag9F0F	!= '')print('tag9F0F	   = '+tag9F0F	     );
	
	print('\n*************************************************');
	print("* - CA public Key Related DATA");	
	print('*************************************************');
	
	if(tag90	!= '')print('tag90	   = '+tag90	     );
	if(tag9F32	!= '')print('tag9F32	   = '+tag9F32	     );
	if(tag8F	!= '')print('tag8F	   = '+tag8F	     );
	if(tag92	!= '')print('tag92	   = '+tag92	     );
	
	print('\n*************************************************');
	print("* - SAD DATA");	
	print('*************************************************');
        if(tag93	!= '')print('tag93	   = '+tag93	     );
	
	
	
	
}


function make_SAD_data(tag, data){
	
	
	
}


function select_PBOC()
{
	print('\n*******************************************');
	print('* Select PBOC');
	print('*******************************************');
	response = select('A0000003330101');
    	
	if(response == '6283') {
		return response;
	}
	
	
	
	//if(response.substring(0,2) == '61') {
		//response = send('00c00000'+response.substring(2,4));
	//}
	
	//Get Template Value
	var value_6F = lookup_BER_TLV(response, "6F", RETURN_VALUE);
	var value_A5 = lookup_BER_TLV(value_6F, "A5", RETURN_VALUE);;
	var value_BF0C = lookup_BER_TLV(value_A5, "BF0C", RETURN_VALUE);;
	
	print("\n-- FCI Interpretation : " + response);
		
	print("\n Tag 6F : FCI Template, Len : " + lookup_BER_TLV(response, "6F", RETURN_LENGTH) + ", Value : " + value_6F);
	
	print("    Tag 84 : DF Name, Len : " + lookup_BER_TLV(value_6F, "84", RETURN_LENGTH) + ", Value : " + lookup_BER_TLV(value_6F, "84", RETURN_VALUE));
	print("    Tag A5 : FCI Proprietary Template, Len : " + lookup_BER_TLV(value_6F, "A5", RETURN_LENGTH) + ", Value : " + value_A5);
	
	print("       Tag 50 : Application Label, Len : " + lookup_BER_TLV(value_A5, "50", RETURN_LENGTH) + ", Value : " + lookup_BER_TLV(value_A5, "50", RETURN_VALUE));
	print("       Tag 87 : Application Priority Indicator, Len : " + lookup_BER_TLV(value_A5, "87", RETURN_LENGTH) + ", Value : " + lookup_BER_TLV(value_A5, "87", RETURN_VALUE));
	PDOL = lookup_BER_TLV(value_A5, "9F38", RETURN_VALUE);
	print("       Tag 9F38 : PDOL, Len : " + lookup_BER_TLV(value_A5, "9F38", RETURN_LENGTH) + ", Value : " + lookup_BER_TLV(value_A5, "9F38", RETURN_VALUE));
	print("       Tag 5F2D : Language Preference, Len : " + lookup_BER_TLV(value_A5, "5F2D", RETURN_LENGTH) + ", Value : " + lookup_BER_TLV(value_A5, "5F2D", RETURN_VALUE));
	print("       Tag 9F11 : Issuer Code Table Index, Len : " + lookup_BER_TLV(value_A5, "9F11", RETURN_LENGTH) + ", Value : " + lookup_BER_TLV(value_A5, "9F11", RETURN_VALUE));
	print("       Tag 9F12 : Application Preferred Name, Len : " + lookup_BER_TLV(value_A5, "9F12", RETURN_LENGTH) + ", Value : " + lookup_BER_TLV(value_A5, "9F12", RETURN_VALUE));
	print("       Tag BF0C : FCI Issuer Discretionary Data, Len : " + lookup_BER_TLV(value_A5, "BF0C", RETURN_LENGTH) + ", Value : " + value_BF0C);
	
	LogEntry = lookup_BER_TLV(value_BF0C, "9F4D", RETURN_VALUE);
	Log_SFI = LogEntry.substring(0, 2); //SFI of Log File
	Log_RecNum = LogEntry.substring(2, 4); //Records Number of Log File	
	print("          Tag 9F4D : Log Entry, Len : " + lookup_BER_TLV(value_BF0C, "9F4D", RETURN_LENGTH) + ", Value : " + LogEntry);

	if(lookup_BER_TL(PDOL, "9F03", RETURN_LENGTH) != "") CVN = '01';
	else CVN = '11';
	
	return response;
}




function send_GPO()
{
	print('\n*******************************************');
	print('* Get Processing Option');
	print('*******************************************');
	//return send('80A8000004'  83020840 00');
	
	if(PDOL!=''){
		make_PDOL_Data(false,true);	
	}else{
		PDOL_Data="8300";
	}
	
	
	response = send('80A80000' + toHex(PDOL_Data.length/2) + PDOL_Data + '00');
	
//	print('\n*************************************************');
//	print("* Get Processing Option Response Data Interpretation : -");
//	print('*************************************************');

	if(response.substr(0, 2) == "80"){
		AIP = response.substring(4,8);
		AFL = response.substring(8);
	} else {
		data = lookup_BER_TLV(response, "77", RETURN_VALUE);

		AIP = lookup_BER_TLV(data, "82", RETURN_VALUE);

		AFL = lookup_BER_TLV(data, "94", RETURN_VALUE);
		ATC = lookup_BER_TLV(data, "9F36", RETURN_VALUE);
		Track2_Equivalent_Data = lookup_BER_TLV(data, "57", RETURN_VALUE);
		Issuer_Application_Data =  lookup_BER_TLV(data, "9F10", RETURN_VALUE);
		if(Issuer_Application_Data != "")parse_IAD(Issuer_Application_Data);	
		AC  = lookup_BER_TLV(data, "9F26", RETURN_VALUE);

		reponse = lookup_BER_TLV(response, "77", RETURN_VALUE);

		print('\n-- mandatory data elements');
		print("    Tag 82 : AIP, Len : " + lookup_BER_TLV(response, "82", RETURN_LENGTH) + ", Value : " + AIP);
		print("    Tag 9F36 : ATC, Len : " + lookup_BER_TLV(response, "9F36", RETURN_LENGTH) + ", Value : " + ATC);
		print("    Tag 57 : Track 2 Equivalent Data, Len : " + lookup_BER_TLV(response, "57", RETURN_LENGTH) + ", Value : " + Track2_Equivalent_Data);
		print("    Tag 9F10 : Issuer Application Data, Len : " + lookup_BER_TLV(response, "9F10", RETURN_LENGTH) + ", Value : " + Issuer_Application_Data);
		print("    Tag 9F26 : Application Cryptogram, Len : " + lookup_BER_TLV(response, "9F26", RETURN_LENGTH) + ", Value : " + AC);

		print('\n-- conditional data elements');
		print("    Tag 5F34 : Application PAN Sequence Number, Len : " + lookup_BER_TLV(response, "5F34", RETURN_LENGTH) + ", Value : " + lookup_BER_TLV(response, "5F34", RETURN_VALUE));
		print("    Tag 9F6C : Card Transaction Qualifier, Len : " + lookup_BER_TLV(response, "9F6C", RETURN_LENGTH) + ", Value : " + lookup_BER_TLV(response, "9F6C", RETURN_VALUE));
		print("    Tag 9F5D : Available Offline Spending Amount, Len : " + lookup_BER_TLV(response, "9F5D", RETURN_LENGTH) + ", Value : " + lookup_BER_TLV(response, "9F5D", RETURN_VALUE));

		print('\n-- optional data element');
		print("    Tag 5F20 : Cardholder Name, Len : " + lookup_BER_TLV(response, "5F20", RETURN_LENGTH) + ", Value : " + lookup_BER_TLV(response, "5F20", RETURN_VALUE));

	}
	
	print("\n-- AIP Interpretation : " + AIP);
	var AIP_BYTE1 = parseInt(AIP.substring(0,2), 16);
	var AIP_BYTE2 = parseInt(AIP.substring(2,4), 16);
	
	if( (AIP_BYTE1 & BIT_MASK_8) == BIT_MASK_8)
		print(" Byte 1 Bit 8 = Initiate(not Supported)");
	if( (AIP_BYTE1 & BIT_MASK_7) == BIT_MASK_7)
		print(" Byte 1 Bit 7 = Offline static data authentication is supported");
	if( (AIP_BYTE1 & BIT_MASK_6) == BIT_MASK_6)
		print(" Byte 1 Bit 6 = Standard offline dynamic data authentication is supported");
	if( (AIP_BYTE1 & BIT_MASK_5) == BIT_MASK_5)
		print(" Byte 1 Bit 5 = Cardholder verification is supported");
	if( (AIP_BYTE1 & BIT_MASK_4) == BIT_MASK_4)
		print(" Byte 1 Bit 4 = Terminal Risk Management is to be performed");
	if( (AIP_BYTE1 & BIT_MASK_3) == BIT_MASK_3)
		print(" Byte 1 Bit 3 = Issuer Authentication is supported");
	if( (AIP_BYTE1 & BIT_MASK_2) == BIT_MASK_2)
		print(" Byte 1 Bit 2 = Combined DDA/AC generation is supported");
	if( (AIP_BYTE1 & BIT_MASK_1) == BIT_MASK_1)
		print(" Byte 1 Bit 1 = RFU(0)");
	
	print("\n-- AFL Interpretation : " + AFL);
	var AFL_TEMP = AFL;
	while(AFL_TEMP.length > 0) {
		print(" SFI : " + (parseInt(AFL_TEMP.substring(0,2), 16) >> 3));
		print(" First Record Number: " + AFL_TEMP.substring(2,4));
		print(" Last Record Number: " + AFL_TEMP.substring(4,6));
		print(" Number of records involved in static data authentication : " + AFL_TEMP.substring(6,8));
		
		AFL_TEMP = AFL_TEMP.substring(8);
	}
	
	return response;
}







  


function make_PDOL_Data(isEC, isSameCurrency )
{
	var currentData = PDOL;
	var currentTag;
	var currentLength;
	var nLength;
	PDOL_Data='';
	while(currentData.length > 0)
	{
		currentTag = get_CurrentTag(currentData, RETURN_VALUE);
		currentLength = get_CurrentLength( currentData.substring(currentTag.length, currentData.length), 	RETURN_VALUE);
		
		if(currentTag=='9F7A'){
			if(isEC){
				EC_Indicator_EC = '01';
			}else{
				EC_Indicator_EC = '00';
				
			}
			PDOL_Data=PDOL_Data+EC_Indicator_DC
		}
		
		
		if(currentTag=='9F66'){
			PDOL_Data=PDOL_Data+Terminal_Transaction_Qualifiers;
		}
		
		if(currentTag=='9F02'){
			PDOL_Data=PDOL_Data+Amount_Authorised;
		}
		if(currentTag=='9F03'){
			PDOL_Data=PDOL_Data+Amount_Other;
		}
		
		if(currentTag=='9F1A'){
			PDOL_Data=PDOL_Data+Terminal_Country_Code;
		}
		
		if(currentTag=='95'){
			PDOL_Data=PDOL_Data+TVR;
		}
		
		
		if(currentTag=='5F2A'){
			if(isSameCurrency){
				PDOL_Data=PDOL_Data+Terminal_Country_Code;
			}else{
				PDOL_Data=PDOL_Data+Terminal_Country_Code_Diff;
			
			}
		}
		
		if(currentTag=='9A'){
			PDOL_Data=PDOL_Data+Transaction_Date;
			
		}
		
		if(currentTag=='9C'){
			PDOL_Data=PDOL_Data+Transaction_Type;
			
		}
		if(currentTag=='9F37'){
			PDOL_Data=PDOL_Data+Unpredictable_Number;
			
		}
		if(currentTag=='9F4E'){
			PDOL_Data=PDOL_Data+TAG_9F4E;
			
		}
		TAG_9F4E
		currentData = skip_Current_BER_TL(currentData);
		
	}
	PDOL_Data= '83' + toHex(PDOL_Data.length/2) + PDOL_Data;
	
	print('PDOL_Data= '+PDOL_Data);
	
	
}

function do_SDA_Auth(CA_Modulus_Length){
	
	var issuer_PK_Certificate=tag90;
	var static_SAD =tag93;
	var CA_PK_Modulus;
	var CA_PK_Exponent='03';
	var issuer_PK_Exponent=tag9F32;
	var issuer_PK_Reminder=tag92;
	
        
        
        
        if( CA_Modulus_Length == 1024){
        	CA_PK_Modulus=CA_Modulus_1024;
        }else if(CA_Modulus_Length == 1152){
        	CA_PK_Modulus=CA_Modulus_1152;
        }else if(CA_Modulus_Length == 1408){
        	CA_PK_Modulus=CA_Modulus_1408;
        }else if(CA_Modulus_Length == 1984){
        	CA_PK_Modulus=CA_Modulus_1984;
        }
	

	var issuer_PK_Recovered = decRSAwithPublicKey(issuer_PK_Certificate ,CA_PK_Modulus , CA_PK_Exponent);
	print(issuer_PK_Recovered);
	
	
	

	issuer_PK_Modulus = issuer_PK_Recovered.substring(30, issuer_PK_Recovered.length - 42) + issuer_PK_Reminder;

	


	 static_SAD_Recovered = decRSAwithPublicKey(static_SAD, issuer_PK_Modulus, issuer_PK_Exponent);
	 print(static_SAD_Recovered);



	//validate Hash Result
	print("* - Validate Issuer_PK_Certificate Hash Result");
	hashResult = issuer_PK_Recovered.substring(issuer_PK_Recovered.length - 42, issuer_PK_Recovered.length - 2); 
	msg1 = issuer_PK_Recovered.substring(2, issuer_PK_Recovered.length - 42);
	msg2 = issuer_PK_Reminder + issuer_PK_Exponent;
	print("* - Data to be hashed : " + msg1 + msg2);	
	hash = messageDigest_SHA1(msg1 + msg2).toUpperCase();
	print("* - Calculated Hash : " + hash);
	print("* - Hash Result : " + hashResult); 
	if(hash != hashResult)
		print("* - Invalid Hash Result");
	else 
		print("* - Hash Result Validation...PASS");
	
	
	//validate SAD Hash Result
	print("* - Validate SAD Hash Result");
	hashResult = static_SAD_Recovered.substring(static_SAD_Recovered.length - 42, static_SAD_Recovered.length - 2); 
	msg1 = static_SAD_Recovered.substring(2, static_SAD_Recovered.length - 42);
	msg2 = '5F25030701015F24033012315A0862250000000000145F3401009F0702FF008E0C000000000000000002031F009F0D05D0609CA8009F0E0500100000009F0F05D0689CF8005F28020156';
	print("* - Data to be hashed : " + msg1 + msg2);	
	hash = messageDigest_SHA1(msg1 + msg2).toUpperCase();
	print("* - Calculated Hash : " + hash);
	print("* - Hash Result : " + hashResult); 
	if(hash != hashResult)
		print("* - Invalid Hash Result");
	else 
		print("* - Hash Result Validation...PASS");
        
	
	
	
}
function parse_IAD(data)
{
	print('\n*************************************************');
	print("* Tag 9F10 Issuer Application Data");
	print('*************************************************');
	print("*	- Len " + toHex(data.length / 2));
	
	print("* Length Indicator");
	print("*	- Len 01" );
	print("*	- Value " + data.substring(0,2));

	print("* Derivation Key Index");
	print("*	- Len 01" );
	print("*	- Value " + data.substring(2,4));
		
	print("* Cryptogram Version Number");
	print("*	- Len 01");
	print("*	- Value " + data.substring(4,6));
	
	parse_CVR(data.substring(6, 14));	
		
	print("* 계산법표식");
	print("*	- Len 01" );
	print("*	- Value " + data.substring(14,16));
	
	if(data.length > 16)
	{
		print("* Issuer discretionary data");
		print("*	- Len " + toHex((data.length - 16) / 2));
		print("*	- Value " + data.substring(16));
	}
	
	//assign values
	LI = data.substring(0,2);
	DKI = data.substring(2,4);
	CVN = data.substring(4,6);
	CM = data.substring(14,16);
	IDD = data.substring(16);
	
}

function parse_CVR(data)
{
	  print('\n*************************************************');
		print("* Card Verification Results(CVR)");
		print('*************************************************');
		print("*	- Len 04" );
		print("*	- Value " + data);
		
		var CVR_Byte_2 = parseInt(data.substring(2,4),16); 
		var CVR_Byte_3 = parseInt(data.substring(4,6),16);
		var CVR_Byte_4 = parseInt(data.substring(6,8),16);
		
		if( (CVR_Byte_2 & BIT_MASK_8) == 0x00 & (CVR_Byte_2 & BIT_MASK_7) == 0x00)
			print("* Byte 2 Bit 8-7 ACC returned in second GENERATE AC");
		else if( (CVR_Byte_2 & BIT_MASK_8) == 0x00 & (CVR_Byte_2 & BIT_MASK_7) == BIT_MASK_7)
			print("* Byte 2 Bit 8-7 TC returned in second GENERATE AC");
		else if( (CVR_Byte_2 & BIT_MASK_8) == BIT_MASK_8 & (CVR_Byte_2 & BIT_MASK_7) == 0x00)
			print("* Byte 2 Bit 8-7 Second GENERATE AC not requested");
		if( (CVR_Byte_2 & BIT_MASK_6) == 0x00 & (CVR_Byte_2 & BIT_MASK_5) == 0x00)
			print("* Byte 2 Bit 6-5 AAC returned in first GENERATE AC");
		else if( (CVR_Byte_2 & BIT_MASK_6) == 0x00 & (CVR_Byte_2 & BIT_MASK_5) == BIT_MASK_5)
			print("* Byte 2 Bit 6-5 TC returned in first GENERATE AC");
		else if( (CVR_Byte_2 & BIT_MASK_6) == BIT_MASK_6 & (CVR_Byte_2 & BIT_MASK_5) == 0x00)
			print("* Byte 2 Bit 6-5 ARQC returned in first GENERATE AC");
		else if( (CVR_Byte_2 & BIT_MASK_6) == BIT_MASK_6 & (CVR_Byte_2 & BIT_MASK_5) == BIT_MASK_5)
			print("* Byte 2 Bit 6-5 AAR returned in first GENERATE AC");
		if( (CVR_Byte_2 & BIT_MASK_4) == BIT_MASK_4)
			print("* Byte 2 Bit 4 Issuer Authentication performed and failed");
		if( (CVR_Byte_2 & BIT_MASK_3) == BIT_MASK_3)
			print("* Byte 2 Bit 3 Offline PIN performed");
		if( (CVR_Byte_2 & BIT_MASK_2) == BIT_MASK_2)
			print("* Byte 2 Bit 2 Offline PIN verification");
		if( (CVR_Byte_2 & BIT_MASK_1) == BIT_MASK_1)
			print("* Byte 2 Bit 1 Unable to go online");
		
		if( (CVR_Byte_3 & BIT_MASK_8) == BIT_MASK_8)
			print("* Byte 3 Bit 8 Last online transaction not completed");
		if( (CVR_Byte_3 & BIT_MASK_7) == BIT_MASK_7)
			print("* Byte 3 Bit 7 PIN Try Limit exceeded");
		if( (CVR_Byte_3 & BIT_MASK_6) == BIT_MASK_6)
			print("* Byte 3 Bit 6 Exceeded velocity checking counters");
		if( (CVR_Byte_3 & BIT_MASK_5) == BIT_MASK_5)
			print("* Byte 3 Bit 5 New card");
		if( (CVR_Byte_3 & BIT_MASK_4) == BIT_MASK_4)
			print("* Byte 3 Bit 4 Issuer Authentication failure on last online transaction");
		if( (CVR_Byte_3 & BIT_MASK_3) == BIT_MASK_3)
			print("* Byte 3 Bit 3 Issuer Authentication not performed after online authorization");
		if( (CVR_Byte_3 & BIT_MASK_2) == BIT_MASK_2)
			print("* Byte 3 Bit 2 Application blocked by card because PIN Try Limit exceeded");
		if( (CVR_Byte_3 & BIT_MASK_1) == BIT_MASK_1)
			print("* Byte 3 Bit 1 Offline static data authentication failed on last transaction and transaction declined offline");


		print("* Byte 4 Bit 8-5 Number of Issuer Script Commands received after the second GENERATE AC command");
		print("* 								containing secure messaging processed on last transaction : " + toHex(CVR_Byte_4 & 0xE0));
		if( (CVR_Byte_4 & BIT_MASK_4) == BIT_MASK_4)
			print("* Byte 4 Bit 4 Issuer Scripting processing failed on last transaction");
		if( (CVR_Byte_4 & BIT_MASK_3) == BIT_MASK_3)
			print("* Byte 4 Bit 3 Offline dynamic data authentication failed on last transaction and transaction declined offline");
		if( (CVR_Byte_4 & BIT_MASK_2) == BIT_MASK_2)
			print("* Byte 4 Bit 2 Offline dynamic data authentication performed");
			
		//assign Values
		CVR = data;

}