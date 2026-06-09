include('_PBOC_CONF.js');

function send_parse(cmd){
	res = send(cmd);
	if(res != ''){
		storeResponseTag(res);
	}
}

function send_select(cmd){
	print('*************************************************');
	print('* [CMD] Select');
	print('*************************************************');
	if(cmd == null){
		res = select(AID);
	}
	else{
		res = select(cmd);
	}
	reset_CARD_DATA();
	//if(getSW() == '9000'){
	if(true){
		storeResponseTag(res);
		if(CARD_DATA['9F4D'] != null){
			Log_SFI = CARD_DATA['9F4D'].substring(0, 2); //SFI of Log File
			Log_RecNum = CARD_DATA['9F4D'].substring(2, 4); //Records Number of Log File	
		}
	}
	else{
		set_Default_CARD_DATA();
	}
	return res;
}

function reset_CARD_DATA(){
	CARD_DATA = null;
	CARD_DATA = new Array();  
	RES_ARQC = '0000000000000000';
	is1st = true;
}

function set_Default_CARD_DATA(){
	CARD_DATA['9F38'] = CT_DEFAULT_PDOL;
}


function send_gpo(cmd){
	print('*************************************************');
	print('* [CMD] Get Processing Options');
	print('*************************************************');
	
	if(cmd == null){
		PDOL_Data = make_DOL_Data(CARD_DATA['9F38']);
		PDOL_Data = '83' + toHex(PDOL_Data.length/2) + PDOL_Data;
		cmd = '80A80000' + toHex(PDOL_Data.length/2) + PDOL_Data;
	}
	res = send(cmd);
	DOL_VALUE['PDOL'] = cmd.substring(14, 14 + (parseInt(cmd.substring(8, 10), 16) << 1));
	
	temp = storeResponseTag(res);
	if(temp != null){// template tag 80 (no TLV)
		CARD_DATA['82'] = temp.substring(0, 4); // AIP
		CARD_DATA['94'] = temp.substring(4, temp.length); // AIP
	}
	
	if(CARD_DATA['9F10'] != null){
		ATC = CARD_DATA['9F36'];
		parse_CVR(CARD_DATA['9F10'].substring(6, 14));
		validate_AC();
		
	}


	return res;
}


function send_read_record(sfi, rec){
	print('*************************************************');
	print('* [CMD] Read Record');
	print('*************************************************');
	print('* - SFI : ' + sfi + '  ' + 'Record Number : ' + rec);
	res = send('00 B2' + toHex(rec) + toHex( sfi << 3 | 0x04) + '00');
	storeResponseTag(res, false);
	return res;
}

function read_afl(){
	AFL = CARD_DATA['94'];
	if(AFL == null || AFL == ''){
		return;
	}
	print('* - AFL : ' + AFL);
	
	SAD = '';
	for(i = 0 ; i < AFL.length ; i += 8)
	{
		recordRange = AFL.substring(i, i + 8);
		SFI = parseInt(recordRange.substring(0,2), 16) >> 3;
		startRecordNumber = parseInt(recordRange.substring(2,4), 16);
		endRecordNumber = parseInt(recordRange.substring(4,6), 16);
		SADRecordNumber = parseInt(recordRange.substring(6,8), 16);
		cnt_SAD = 0;
		
		for(j = startRecordNumber; j <= endRecordNumber; j++)
		{
			send_read_record(SFI, j);
			if(SADRecordNumber != 0 && cnt_SAD < SADRecordNumber){
				SAD += CARD_DATA['70'];
				cnt_SAD++;
			}
		}
	}
}

function send_internal_auth(){
	print('*************************************************');
	print('* [CMD] Internal Authenticate');
	print('*************************************************');
	DDOL_Data = make_DOL_Data(CARD_DATA['9F49']);
	res = send('00880000' + toHex(DDOL_Data.length/2) + DDOL_Data);
	
	temp = storeResponseTag(res);
	if(temp != null){// template tag 80 (no TLV)
		CARD_DATA['9F4B'] = temp;
	}
	//validate_SDAD_for_DDA(ICC_PK_M, CARD_DATA[TAG_ICC_PK_E]); // DDA patail processing (only using ICC Public Key)
	parse_DDA(); // DDA full processing
}


function send_gen_ac(cmd){
	print('*************************************************');
	print('* [CMD] '+(is1st ? '1st':'2nd')+' Generate AC');
	print('*************************************************');
	if(cmd.length == 2){// only P2
		CDOL_Data = make_DOL_Data(CARD_DATA[(is1st ? '8C':'8D')]);
		cmd = '80AE'+cmd+'00' + toHex(CDOL_Data.length/2) + CDOL_Data + '00';
	}
	// command
	res = send(cmd); 
	RES_GENAC = res;
	DOL_VALUE[is1st ? 'CDOL1' : 'CDOL2'] = cmd.substring(10, 10 + (parseInt(cmd.substring(8, 10), 16) << 1));
	
	if(getSW() != '9000') return;

	temp = storeResponseTag(res);

	if(temp != null){// template tag 80 (no TLV)
		CARD_DATA['9F27'] = res.substring(4, 6); // CID
		CARD_DATA['9F36'] = res.substring(6, 10); // ATC
		CARD_DATA['9F26'] = res.substring(10, 26); // AC
		CARD_DATA['9F10'] = res.substring(26, res.length); // IAD
	}
	else{
		if(CARD_DATA['9F4B'] != null){
			isCDA = true;
			decrypted_SDAD = parse_DDA();
			validate_TXHash(decrypted_SDAD.substring(32, 72));

			if(DOL_DATA['DF69'] == '01'){
				CARD_DATA['9F27'] = decrypted_SDAD.substring(10, 12); // CID
				CARD_DATA['9F26'] = decrypted_SDAD.substring(12, 28); // AC
			}
			else{
				CARD_DATA['9F27'] = decrypted_SDAD.substring(14, 16); // CID
				CARD_DATA['9F26'] = decrypted_SDAD.substring(16, 32); // AC
			}			
		}
	}
	parse_CVR(CARD_DATA['9F10'].substring(6, 14));
	ATC = CARD_DATA['9F36'];
	validate_AC();
	if(is1st){
		RES_ARQC = CARD_DATA['9F26']; // to be used in computing ARPC
	}		
	is1st = false; // init at Select
	
	return res;	
}


function send_external_auth(ARC){
	
	print('*************************************************');
	print('* [CMD] External Authentication');
	print('*************************************************');
	DOL_DATA['8A'] = ARC;
		
	res = send('008200000A'+ getARPC(ARC) + ARC);
	return res;	

}


function send_get_data(tag)
{
	print('\n*******************************************');
	print("* [CMD] Get Data tag " + tag);
	print('*******************************************');
	res =  send("80 CA" + (tag.length == 2 ? '00' + tag : tag) + "00");
	storeResponseTag(res);
	if(tag == '9F36'){
		ATC = CARD_DATA['9F36'];
	}	
	return res;
}
function send_get_challenge()
{
	print('\n*******************************************');
	print('* [CMD] Get Challenge');
	print('*******************************************');
	
	CARD_RANDOM = send("0084000000");
	return CARD_RANDOM;	
}

function send_verify(pin, isEnc)
{
	print('\n******************************************************');
	print('* Verify with ' + (isEnc ? 'Enciphered PIN' : 'Plain Text'));
	print('******************************************************');
	
	// make PIN block
	pin = '2' + pin.length + pin;
	pin = pin + Fs.substring(0, 16 - pin.length); 

	if(isEnc)
	{
		CA_PK_Modulus = CA_PK_MOD[CARD_DATA[TAG_CA_PK_INDEX]];
		CA_PK_Exponent = CA_PK_EXP[CARD_DATA[TAG_CA_PK_INDEX]];
		// Retrive Isser Public Key Modulus
		var issuer_PK_M = retrieve_Issuer_PK_M(CA_PK_Modulus, CA_PK_Exponent);
	
		var ICC_PIN_Certificate = CARD_DATA['9F2D']; // ICC PIN Enc PK Cert
		//ICC PIN Certificate가 없는 경우 ICC PK Modulus, Exponent를 사용
		if(ICC_PIN_Certificate == undefined)
		{
			if(CARD_DATA['9F46'] == undefined){
				print('No ICC or PIN Cert!');
				return;
			}
			ICC_PIN_PK_E = CARD_DATA['9F47'];
			ICC_PIN_PK_M = retrieve_ICC_PK_M(issuer_PK_M, CARD_DATA[TAG_ISSUER_PK_E]);
		}
		else
		{
	 	 	ICC_PIN_PK_E = CARD_DATA['9F2E'];
		  	ICC_PIN_PK_M = retrieve_ICC_PIN_PK_M(issuer_PK_M, CARD_DATA[TAG_ISSUER_PK_E]);
		}
		if(CARD_RANDOM == null){
			printError('ICC UN did not set. Please send GET CHALLENGE first.');
		}
		print('* - PIN Block : ' + pin);
		print('* - ICC Unpredictable Number : ' + CARD_RANDOM);
		var block = '7F' + pin + CARD_RANDOM;
		block = block + random((ICC_PIN_PK_M.length - block.length)/2);
		pin = encRSAwithPublicKey(block ,ICC_PIN_PK_M, ICC_PIN_PK_E);

		print('\n* - ICC PIN Encipherment Public Key Modulus : ' + ICC_PIN_PK_M);
		print('* - ICC PIN Encipherment Public Key Exponent : ' + ICC_PIN_PK_E);
	
		print('* - PIN block to be enciphered : ' + block);
		print('* - Enciphered PIN block : ' + pin);
	}
	return send('002000' + (isEnc ? '88' : '80') + toHex(pin.length/2) + pin);
}

function send_app_block()
{
	print('\n*******************************************');
	print('* [CMD] Application Block');
	print('*******************************************');
	return send(add_MAC('841E000004'));
}


function send_card_block()
{
	print('\n*******************************************');
	print('* [CMD] Card Block');
	print('*******************************************');
	return send(add_MAC('8416000004'));
}



function send_app_unblock()
{
	print('\n*******************************************');
	print('* [CMD] Application Unblock');
	print('*******************************************');
	return send(add_MAC('8418000004'));
}

function send_update_record(sfi, rec, value)
{
	print('\n*******************************************');
	print('* [CMD] pdate Record');
	print('*******************************************');
	print('* - SFI : ' + sfi + '  ' + 'Record Number : ' + rec);
	return send(add_MAC('04DC' + toHex(rec) + toHex( sfi << 3 | 0x04) + toHex(value.length / 2 + 4) + value));
}

function send_put_data(tag, value)
{
	print('\n*******************************************');
	print('* [CMD] Put Data : tag ' + tag + ', value ' + value);
	print('*******************************************');
	return send(add_MAC('04DA' + (tag.length == 2 ? '00' + tag : tag) + toHex(value.length / 2 + 4) + value));
}

function send_pin_unblock()
{
	print('\n*******************************************');
	print('* [CMD] PIN Unblock');
	print('*******************************************');
	return send(add_MAC('8424000004'));
}

function send_pin_change(newPIN, currentPIN)
{
	print('\n*******************************************');
	print('* [CMD] PIN Change');
	print('*******************************************');
	encDeltaPIN = encryptPIN(newPIN, currentPIN);
	response = send(add_MAC('842400' + (currentPIN == null || currentPIN == undefined ? '02' : '01') + '14' + encDeltaPIN));
	
	return response;
	
}

function encryptPIN(newPIN, currentPIN)
{	
	D1 = '00000000' + ENC.substring(8, 16);
	print('* - D1 : ' + D1);
	D2 = '0' + newPIN.length.toString() + newPIN;
	D2 = D2 + Fs.substring(0, 16 - D2.length);
	print('* - D2 : ' + D2);
	D3 = xor(D1, D2);
	print('* - D3 : ' + D3);
	if (currentPIN != null) {
		currentPIN = currentPIN + zeros.substring(0, 16 - currentPIN.length);
		print('* - current PIN : ' + currentPIN);
		deltaPIN =  xor(D3, currentPIN);
	} 
	else {
		deltaPIN = D3;
	}
	print('* - Delta PIN : ' + deltaPIN);
	srcBlock = '08' + deltaPIN + '80000000000000';
	print('* - Source block : ' + srcBlock);
	if(DOL_DATA['DF69'] == '01'){
		newPIN = SM4_Enc(srcBlock, getSK_SM(ENC));
	}
	else{
		newPIN = tdes_ecb(srcBlock, getSK(ENC));
	}
	print('* - Enciphered Delta PIN : ' + newPIN);
	return newPIN;
}

function add_MAC(cmd)
{
	data = cmd.substring(0, 10) + ATC + RES_ARQC + cmd.substring(10, cmd.length) + '80';
	var len = data.length/2;
	if(DOL_DATA['DF69'] == '01'){ // SM4
		if(len % 16 != 0) data = data + zeros.substring(0, (16 - len % 16) * 2);
		mac = ftdesMAC_SM(data, getSK_SM(MAC));
	}
	else{
		if(len % 8 != 0) data = data + zeros.substring(0, (8 - len % 8) * 2);
		mac = create_mac(data, getSK(MAC));
	}


	print('* - Source : ' + data);
	print('* - MAC : ' + mac);
	
	return cmd + mac.substring(0, 8); 
}

//**********************************************//
// Extended Functions
//**********************************************//

function PBOC_MAC(macSource,Key_in,Ini_Value)
{ 
	print('\n*******************************************');
	print('* Compuate PBOC MAC');
	print('*******************************************');
	if (Ini_Value==''){
		Ini_Value="0000000000000000"; 
	}
	var xorresult=xor(Ini_Value,macSource.substr(0,16));
	macSource=xorresult + macSource.substr(16,macSource.length-16) + '80';
	var len = macSource.length/2;
	if(len % 8 != 0) macSource = macSource + zeros.substring(0, (8 - (len % 8)) * 2);
	print('* - Source: ' +macSource);
	print('* - Key: ' +Key_in);
	mac = create_mac(macSource,Key_in).substring(0,8);
	print('* - MAC: ' +mac);
	return mac;
}

function send_append_record(P2_IN,Record_VALUE,Ini_key,Update_key)
{
	print('\n*******************************************');
	print('* [CMD] Append Record ' + P2_IN);
	print('*******************************************');
	var Ini_key_En= tdes_ecb(Update_key, Ini_key);
	Record_VALUE=Ini_key_En + Record_VALUE;
	var Lc=toHex(Record_VALUE.length / 2 + 4)
	//P2_IN = toHex(parseInt(P2_IN, 16) << 3)	
	var mac=PBOC_MAC("04E200" + P2_IN + Lc + Record_VALUE,Ini_key,"000000000000"+ATC);
	response = send('04E200'+P2_IN+Lc+Record_VALUE+mac);
	return response
}

function send_update_capp(P2_IN,Record_VALUE,mac_key)
{
	print('\n*******************************************');
	print('* [CMD] Update Capp Data Cache ' + P2_IN);
	print('*******************************************');
 	var Lc=toHex(Record_VALUE.length / 2 + 4)
	//P2_IN = toHex(parseInt(P2_IN, 16) << 3)
	var mac=PBOC_MAC("84DE00" + P2_IN + Lc + Record_VALUE,mac_key,"000000000000"+ATC);
 	response = send('84DE00'+P2_IN+Lc+Record_VALUE+mac);
	return response;
}

function send_read_capp(P2_IN,ID_Number, addRand)
{
	print('\n*******************************************');
	print('* [CMD] Read Capp Data ' + P2_IN);
	print('*******************************************');
	//P2_IN = toHex(parseInt(P2_IN, 16) << 3)	
	if(addRand == true) ID_Number += random(8);
	response =send('80B400'+P2_IN+toHex(ID_Number.length/2)+ID_Number);
	return response;
}

//**********************************************//

function get_DOL_length(DOL, sTag){
	var tag, len = '';
	if(DOL == null || DOL == '') return len;
	
	var max = DOL.length;
	for(var i = 0; i < max; ) {
		tag = DOL.substring(i, i+=(((parseInt(DOL.substring(i, i + 2), 16) & 0x1F) == 0x1F) ? 4 : 2));
		len = DOL.substring(i, i += 2);
		if(tag == sTag){
			return len;
		}
	}
	return len;

}
function make_DOL_Data(DOL){
	var result = '';
	if(DOL == null || DOL == '') return result;
	print('* - DOL:' + DOL);
	
	var max = DOL.length;
	for(var i = 0; i < max; ) {
		var tag = DOL.substring(i, i+=(((parseInt(DOL.substring(i, i + 2), 16) & 0x1F) == 0x1F) ? 4 : 2));
		var len = DOL.substring(i, i += 2);
		var len_int = parseInt(len, 16);
		if(DOL_DATA[tag] == null){
			//printError('* - Value of tag '+ tag +' was not defined!!!');
			DOL_DATA[tag] = '';
			for(j = 0; j < len_int; j++) DOL_DATA[tag] += '00'; // pad 00
		}
		else if(len_int != DOL_DATA[tag].length/2) printError('* - Value of DOL is wrong!!! - Expected: ' + len_int);
		print('*   - ' + (tag.length == 2 ? tag + '  ' : tag) + ' '+len+' ' + DOL_DATA[tag]);
		result += DOL_DATA[tag];
	}
	return result;

}


function parse_SDA()
{		
	if(!validateSDA || CARD_DATA['93'] == undefined) return;
	print('\n*************************************************');
	print('* Validate SDA');
	print('*************************************************');
	
	if(DOL_DATA['DF69'] == '01'){
		// SM2 
		CA_SM2_PK_KEY = CA_PK_SM[CARD_DATA[TAG_CA_PK_INDEX]];
		// Retrive Isser Public Key 
		var issuer_PK = retrieve_Issuer_SM_PK(CA_SM2_PK_KEY);
		// Verify Singed Static Application Data
		return validate_SSAD_for_SDA_SM(issuer_PK);
	}
	else{
		CA_PK_Modulus = CA_PK_MOD[CARD_DATA[TAG_CA_PK_INDEX]];
		CA_PK_Exponent = CA_PK_EXP[CARD_DATA[TAG_CA_PK_INDEX]];
		// Retrive Isser Public Key Modulus
		var issuer_PK_M = retrieve_Issuer_PK_M(CA_PK_Modulus, CA_PK_Exponent);
		// Verify Singed Static Application Data
		return validate_SSAD_for_SDA(issuer_PK_M, CARD_DATA[TAG_ISSUER_PK_E]);
	}
}

function parse_DDA()
{		
	if(!validateDDA || CARD_DATA['9F4B'] == undefined) return;
	print('\n*************************************************');
	print('* Validate DDA');
	print('*************************************************');
	
	if(DOL_DATA['DF69'] == '01'){
		// SM2 
		CA_SM2_PK_KEY = CA_PK_SM[CARD_DATA[TAG_CA_PK_INDEX]];
		// Retrive Isser Public Key 
		var issuer_PK = retrieve_Issuer_SM_PK(CA_SM2_PK_KEY);
		// Retrive ICC Public Key 
		var ICC_PK = retrieve_ICC_SM_PK(issuer_PK);
		// Verify Singed Dynamic Application Data
		return validate_SDAD_for_DDA_SM(ICC_PK);
	}
	else{
		CA_PK_Modulus = CA_PK_MOD[CARD_DATA[TAG_CA_PK_INDEX]];
		CA_PK_Exponent = CA_PK_EXP[CARD_DATA[TAG_CA_PK_INDEX]];
		// Retrive Isser Public Key Modulus
		var issuer_PK_M = retrieve_Issuer_PK_M(CA_PK_Modulus, CA_PK_Exponent);
		// Retrive ICC Public Key Modulus
		var ICC_PK_M = retrieve_ICC_PK_M(issuer_PK_M, CARD_DATA[TAG_ISSUER_PK_E]);
		// Verify Singed Dynamic Application Data
		return validate_SDAD_for_DDA(ICC_PK_M, CARD_DATA[TAG_ICC_PK_E]);
	}
}


function parse_fDDA()
{		
	if(!validateDDA) return;
	if(CARD_DATA['9F4B'] == null){
		return;
	}
	
	print('\n*************************************************');
	print('* Validate fDDA');
	print('*************************************************');
	if(DOL_DATA['DF69'] == '01'){
		// SM2 TODO
		CA_SM2_PK_KEY = CA_PK_SM[CARD_DATA[TAG_CA_PK_INDEX]];
		// Retrive Isser Public Key 
		var issuer_PK = retrieve_Issuer_SM_PK(CA_SM2_PK_KEY);
		// Retrive ICC Public Key 
		var ICC_PK = retrieve_ICC_SM_PK(issuer_PK);
		// Verify Singed Dynamic Application Data
		return validate_SDAD_for_fDDA_SM(ICC_PK);
	}
	else{		
		CA_PK_Modulus = CA_PK_MOD[CARD_DATA[TAG_CA_PK_INDEX]];
		CA_PK_Exponent = CA_PK_EXP[CARD_DATA[TAG_CA_PK_INDEX]];
		// Retrive Isser Public Key Modulus
		var issuer_PK_M = retrieve_Issuer_PK_M(CA_PK_Modulus, CA_PK_Exponent);
		// Retrive ICC Public Key Modulus
		var ICC_PK_M = retrieve_ICC_PK_M(issuer_PK_M, CARD_DATA[TAG_ISSUER_PK_E]);
		// Verify Singed Dynamic Application Data
		validate_SDAD_for_fDDA(ICC_PK_M, CARD_DATA[TAG_ICC_PK_E]);
	}
}

function retrieve_Issuer_SM_PK(CA_PK)
{
	var issuer_PK;

	print('\n*************************************************');
	print('* Retrieve Issuer Public Key');	
	print('*************************************************');
	
	print('* - CA Public Key');
	print('*	- CA Public Key Index ' + CARD_DATA[TAG_CA_PK_INDEX]);
	print('*	- CA Public Key ' + CA_PK);

	//Retrieve Issuer Public Key Certificate
	issuer_PK_C = CARD_DATA[TAG_ISSUER_PK_C];
	print('* - Tag 90 Issuer Public Key Certificate');
	print('* - Len ' + getLen(issuer_PK_C));
	print('*	- Value ' + issuer_PK_C);

	var issuer_PK_Len = issuer_PK_C.substring(26, 28);
	var off = 28 + parseInt(issuer_PK_Len, 16)*2; // offset to be sigend (End of Public key)
	var issuer_PK = issuer_PK_C.substring(28, off);
	
	print('* - Issuer Public Key from the Issuer Public Key Certificate');
	print('* - Len ' + issuer_PK_Len);
	print('*	- Value ' + issuer_PK);

	var CA_R_S = issuer_PK_C.substring(off, issuer_PK_C.length);
	print('* - CA R || S from the Issuer Public Key Certificate');
	print('* - Len ' + getLen(CA_R_S));
	print('*	- Value ' + CA_R_S);

	validate_Recovered_SM_Data('12', issuer_PK_C.substring(0, off), CA_R_S, CA_PK);
	
	return issuer_PK;
}

function retrieve_ICC_SM_PK(issuer_PK)
{	
	print('\n*************************************************');
	print('* Retrieve ICC Public Key');	
	print('*************************************************');
	
	print('* - Issuer Public Key');
	print('*	- ' + issuer_PK);

	//Retrieve ICC Public Key Certificate
	ICC_PK_C = CARD_DATA[TAG_ICC_PK_C];
	print('* - Tag 9F46 ICC Public Key Certificate');
	print('* - Len ' + getLen(ICC_PK_C));
	print('*	- Value ' + ICC_PK_C);
	
	var ICC_PK_Len = ICC_PK_C.substring(38, 40);
	var off = 40 + parseInt(ICC_PK_Len, 16)*2; // offset to be sigend (End of Public key)
	var ICC_PK = ICC_PK_C.substring(40, off);
	
	print('* - ICC Public Key from the ICC Public Key Certificate');
	print('* - Len ' + ICC_PK_Len);
	print('*	- Value ' + ICC_PK);

	var issuer_R_S = ICC_PK_C.substring(off, ICC_PK_C.length);
	print('* - Issuer R || S from the ICC Public Key Certificate');
	print('* - Len ' + getLen(issuer_R_S));
	print('*	- Value ' + issuer_R_S);

	validate_Recovered_SM_Data('14', ICC_PK_C.substring(0, off) + SAD, issuer_R_S, issuer_PK);
	
	return ICC_PK;
}

function validate_SSAD_for_SDA_SM(issuer_PK)
{	
	print('\n*************************************************');
	print('* Retrieve Signed Static Application Data for SDA');
	print('*************************************************');
	
	print('* - Issuer Public Key');
	print('*	- ' + issuer_PK);

	//Retrieve ICC Public Key Certificate
	SSAD = CARD_DATA['93'];
	print('* - Tag 93 Signed Static Application Data');
	print('* - Len ' + getLen(SSAD));
	print('*	- Value ' + SSAD);
	
	// TODO
	/*
	var ICC_PK_Len = ICC_PK_C.substring(38, 40);
	var off = 40 + parseInt(ICC_PK_Len, 16)*2; // offset to be sigend (End of Public key)
	var ICC_PK = ICC_PK_C.substring(40, off);
	
	print('* - ICC Public Key from the ICC Public Key Certificate');
	print('* - Len ' + ICC_PK_Len);
	print('*	- Value ' + ICC_PK);

	var issuer_R_S = ICC_PK_C.substring(off, ICC_PK_C.length);
	print('* - Issuer R || S from the ICC Public Key Certificate');
	print('* - Len ' + getLen(issuer_R_S));
	print('*	- Value ' + issuer_R_S);

	validate_Recovered_SM_Data('14', ICC_PK_C.substring(0, off) + SAD, issuer_R_S, issuer_PK);
	*/
	return SSAD;
}

function validate_SDAD_for_DDA_SM(ICC_PK)
{
	var msg1, msg2, hash, hashResult;
	print('\n*************************************************');
	print('* Retrieve Signed Dynamic Application Data for DDA');
	print('*************************************************');

	print('* - ICC Public Key');
	print('*	- ' + ICC_PK);

	SDAD = CARD_DATA['9F4B'];
	print('* - Tag 9F4B Signed Dynamic Application Data');
	print('* - Len ' + getLen(SDAD));
	print('*	- Value ' + SDAD);
	
	var IDD_Len = SDAD.substring(2, 4);
	var off = 4 + parseInt(IDD_Len, 16)*2; // offset to be sigend (End of Public key)
	var IDD = SDAD.substring(4, off);
	
	print('* - ICC Dynamic Data from the SDAD');
	print('* - Len ' + IDD_Len);
	print('*	- Value ' + IDD);
	
	var msg = '';
	if(isCDA){ // CDA (Generate AC command)
		off += 8; // add length of Terminal UN
		msg = SDAD.substring(0, off);
		isCDA = false;
	}
	else{
		msg = SDAD.substring(0, off) + DOL_DATA['9F37'];
	}

	var ICC_R_S = SDAD.substring(off, SDAD.length);
	print('* - ICC R || S from the SDAD');
	print('* - Len ' + getLen(ICC_R_S));
	print('*	- Value ' + ICC_R_S);

	validate_Recovered_SM_Data('15', msg, ICC_R_S, ICC_PK);
	return SDAD;
}


function validate_SDAD_for_fDDA_SM(ICC_PK)
{
	if(CARD_DATA['9F4B'] == null) printError('SDAD is not present!!!');
	print('\n*************************************************');
	print('* Retrieve Signed Dynamic Application Data for DDA');
	print('*************************************************');

	print('* - ICC Public Key');
	print('*	- ' + ICC_PK);

	SDAD = CARD_DATA['9F4B'];
	print('* - Tag 9F4B Signed Dynamic Application Data');
	print('* - Len ' + getLen(SDAD));
	print('*	- Value ' + SDAD);
	
	var IDD_Len = SDAD.substring(2, 4);
	var off = 4 + parseInt(IDD_Len, 16)*2; // offset to be sigend (End of Public key)
	var IDD = SDAD.substring(4, off);
	
	print('* - ICC Dynamic Data from the SDAD');
	print('* - Len ' + IDD_Len);
	print('*	- Value ' + IDD);

	var ICC_R_S = SDAD.substring(off, SDAD.length);
	print('* - ICC R || S from the SDAD');
	print('* - Len ' + getLen(ICC_R_S));
	print('*	- Value ' + ICC_R_S);

	validate_Recovered_SM_Data('15', SDAD.substring(0, off) + DOL_DATA['9F37'], ICC_R_S, ICC_PK);

	var msg2 = '';
	if((parseInt(DOL_DATA['9F66'].substring(6, 8), 16) & 0x80) == 0x80 
					&& CARD_DATA['9F69'] != null && CARD_DATA['9F69'] != ""){
		print('* - fDDA01');
		msg2 = DOL_DATA['9F37'] + DOL_DATA['9F02'] + DOL_DATA['5F2A'] + CARD_DATA['9F69']; 
	}
	else{
		print('* - fDDA00');
		msg2 = DOL_DATA['9F37'];
	}
	validate_Recovered_SM_Data('15', SDAD.substring(0, off) + msg2, ICC_R_S, ICC_PK);	
}


function validate_Recovered_SM_Data(format, msg, R_S, PK)
{
	var key_name, pan_name, off_end, msg1, hash, hashResult;
	switch (format){
		case '12':
			key_name = 'Issuer Public Key';
			break;
		case '13':
			key_name = 'Signed Static Application Data';
			break;
		case '14':
			key_name = 'ICC Public Key';
			break;
		case '15':
			key_name = 'Signed Dynamic Application Data';
			break;
	}

	print('\n*************************************************');
	print('* Validate '+key_name+' Recovered');
	print('*************************************************');
	//validate Recovered Data Header and Certificate Format
	print('* - validate Recovered Data Header and Certificate Format');
	if(msg.substring(0, 2) != format)
		printError('* - Invalid Certificate Format');
	else
		print('* - Certificate Format Validation...PASS');

	
	//validate Hash Result
	print('* - Validate SM2 Result');
	var sigR = R_S.substring(0, 64);
	var sigS = R_S.substring(64, R_S.length);
	//var sigS = R_S.substring(64, 64 + 64);
	var affineX = PK.substring(0, 64);
	var affineY = PK.substring(64, PK.length);

	print('* - msg : ' + msg);
	print('* - uID : ' + uID);
	print('* - sigR : ' + sigR);
	print('* - sigS : ' + sigS);
	print('* - affineX : ' + affineX);
	print('* - affineY : ' + affineY);
	
	if(SM2_Verify(msg, uID, sigR, sigS, affineX, affineY)){
		print('* - Verify SM2...PASS');
	}
	else{
		printError('* - Verify SM2...FAIL');
	}
}


function retrieve_Issuer_PK_M(CA_PK_M, CA_PK_E)
{
	var issuer_PK_M_length;
	var CA_PK_M_length;
	var issuer_PK_C;
	var issuer_PK_M;
	var issuer_PK_R;
	var issuer_PK_E;

	print('\n*************************************************');
	print('* Retrieve Issuer Public Key');	
	print('*************************************************');
	
	print('* - CA Public Key');
	print('*	- CA Public Key Index ' + CARD_DATA[TAG_CA_PK_INDEX]);
	print('*	- Modulus ' + CA_PK_M);
	print('*	- Exponent ' + CA_PK_E);

	//Retrieve Issuer Public Key Certificate
	issuer_PK_C = CARD_DATA[TAG_ISSUER_PK_C];
	print('* - Tag 90 Issuer Public Key Certificate');
	print('* - Len ' + getLen(issuer_PK_C));
	print('*	- Value ' + issuer_PK_C);

	//Retrieve Issuer Public Key Remainder
	issuer_PK_R = CARD_DATA[TAG_ISSUER_PK_R];
	print('* - Tag 92 Issuer Public Key Remainder');
	print('* - Len ' + getLen(issuer_PK_R));
	print('*	- Value ' + issuer_PK_R);
	if(issuer_PK_R == undefined){
		issuer_PK_R = '';		
	}

	//Retrieve Isser Public Key Exponent
	issuer_PK_E = CARD_DATA[TAG_ISSUER_PK_E];
	print('* - Tag 9F32 Issuer Public Key Exponent');
	print('* - Len ' + getLen(issuer_PK_E));
	print('*	- Value ' + issuer_PK_E);
	
	var issuer_PK_Recovered = decRSAwithPublicKey(issuer_PK_C ,CA_PK_M , CA_PK_E);
	print('* - Data Recovered from the Issuer Public Key Certificate');
	print('* - Len ' + getLen(issuer_PK_Recovered));
	print('*	- Value ' + issuer_PK_Recovered);
	
	validate_Recovered_Data('02', issuer_PK_Recovered, issuer_PK_R + issuer_PK_E);
	issuer_PK_M_length = parseInt(issuer_PK_Recovered.substring(26, 28), 16);
	CA_PK_M_length = CA_PK_M.length/2;
	
	//print('* issuer_PK_M_length : ' + issuer_PK_M_length);
	//print('* CA_PK_M_length : ' + CA_PK_M_length);
	
	if(issuer_PK_M_length <= CA_PK_M_length - 36){
		issuer_PK_M = issuer_PK_Recovered.substring(30, issuer_PK_Recovered.length - 42);
		issuer_PK_M = issuer_PK_M.substring(0, (issuer_PK_M.length/2 - (CA_PK_M_length - 36 - issuer_PK_M_length)) * 2);
		
	}else{
		issuer_PK_M = issuer_PK_Recovered.substring(30, issuer_PK_Recovered.length - 42) + issuer_PK_R;
	}	
	
	print('* - Issuer Public Key Modulus');
	print('* - Len ' + getLen(issuer_PK_M));
	print('*	- Value ' + issuer_PK_M);
	
	return issuer_PK_M;
}

function retrieve_ICC_PK_M(issuer_PK_M, issuer_PK_E)
{
	var ICC_PK_C;
	var ICC_PK_M;
	var ICC_PK_R;
	var ICC_PK_E;
	
	print('\n*************************************************');
	print('* Retrieve ICC Public Key');	
	print('*************************************************');
	
	print('* - Issuer Public Key');
	print('*	- Modulus ' + issuer_PK_M);
	print('*	- Exponent ' + issuer_PK_E);

	//Retrieve ICC Public Key Certificate
	ICC_PK_C = CARD_DATA[TAG_ICC_PK_C];
	print('* - Tag 9F46 ICC Public Key Certificate');
	print('* - Len ' + getLen(ICC_PK_C));
	print('*	- Value ' + ICC_PK_C);
	
	//Retrieve ICC Public Key Remainder
	ICC_PK_R = CARD_DATA[TAG_ICC_PK_R];
	print('* - Tag 9F48 ICC Public Key Remainder');
	print('* - Len ' + getLen(ICC_PK_R));
	print('*	- Value ' + ICC_PK_R);
	
	if(ICC_PK_R == undefined){
		ICC_PK_R ='';
		}

	//Retrieve ICC Public Key Exponent
	ICC_PK_E = CARD_DATA[TAG_ICC_PK_E];
	print('* - Tag 9F47 ICC Public Key Exponent');
	print('* - Len ' + getLen(ICC_PK_E));
	print('*	- Value ' + ICC_PK_E);
	

	var ICC_PK_Recovered = decRSAwithPublicKey(ICC_PK_C, issuer_PK_M, issuer_PK_E);
	print('* - Data Recovered from the ICC Public Key Certificate');
	print('* - Len ' + getLen(ICC_PK_Recovered));
	print('*	- Value ' + ICC_PK_Recovered);
	
	var length_icc = parseInt(ICC_PK_Recovered.substring(38,40),16);
	
	msg2 = ICC_PK_R + ICC_PK_E + SAD;
	if(CARD_DATA['9F4A'] != null && CARD_DATA['9F4A'] != ''){ // SDA tag list
		msg2 += CARD_DATA['82']; // add AIP
	}
	validate_Recovered_Data('04', ICC_PK_Recovered, msg2);

	ICC_PK_M = ICC_PK_Recovered.substring(42, ICC_PK_Recovered.length - 42);	
	
	if(ICC_PK_M.length/2 > length_icc){
		ICC_PK_M = ICC_PK_M.substring(0, length_icc * 2);
	}
	
	ICC_PK_M += ICC_PK_R;
	
	print('* - ICC Public Key Modulus');
	print('* - Len ' + getLen(ICC_PK_M));
	print('*	- Value ' + ICC_PK_M);
	
	return ICC_PK_M;
}

function retrieve_ICC_PIN_PK_M(issuer_PK_M, issuer_PK_E)
{
	var ICC_PK_C;
	var ICC_PK_M;
	var ICC_PK_R;
	var ICC_PK_E;
	
	print('\n*************************************************');
	print('* Retrieve ICC PIN Encipherment Public Key');	
	print('*************************************************');
	
	print('* - Issuer Public Key');
	print('*	- Modulus ' + issuer_PK_M);
	print('*	- Exponent ' + issuer_PK_E);

	//Retrieve ICC PIN Encipherment Public Key Certificate
	ICC_PK_C = CARD_DATA['9F2D'];
	print('* - Tag 9F2D ICC PIN Encipherment Public Key Certificate');
	print('* - Len ' + toHex(ICC_PK_C.length/2));
	print('* - Value ' + ICC_PK_C);
	
	//Retrieve ICC PIN Encipherment Public Key Remainder
	ICC_PK_R = CARD_DATA['9F2F'];
	print('* - Tag 9F2F ICC PIN Encipherment Public Key Remainder');
	print('* - Len ' + toHex(ICC_PK_R.length/2));
	print('* - Value ' + ICC_PK_R);

	//Retrieve ICC PIN Encipherment Public Key Exponent
	ICC_PK_E = CARD_DATA['9F2E'];
	print('* - Tag 9F2E ICC PIN Encipherment Public Key Exponent');
	print('* - Len ' + toHex(ICC_PK_E.length/2));
	print('* - Value ' + ICC_PK_E);
	

	var ICC_PK_Recovered = decRSAwithPublicKey(ICC_PK_C, issuer_PK_M, issuer_PK_E);
	print('* - Data Recovered from the ICC Public Key Certificate');
	print('* - Len ' + toHex(ICC_PK_Recovered.length/2));
	print('* - Value ' + ICC_PK_Recovered);
	
	validate_Recovered_Data('04', ICC_PK_Recovered, ICC_PK_R + ICC_PK_E);
	
	ICC_PK_M = ICC_PK_Recovered.substring(42, ICC_PK_Recovered.length - 42) + ICC_PK_R;
	print('* - ICC PIN Encipherment Public Key Modulus');
	print('* - Len ' + toHex(ICC_PK_M.length/2));
	print('* - Value ' + ICC_PK_M);
	
	return ICC_PK_M;
}


function validate_SSAD_for_SDA(issuer_PK_M, issuer_PK_E)
{
	var ICC_PK_C;
	var ICC_PK_M;
	var ICC_PK_R;
	var ICC_PK_E;
	
	print('\n*************************************************');
	print('* Retrieve Signed Static Application Data for SDA');
	print('*************************************************');
	
	print('* - Issuer Public Key');
	print('*	- Modulus ' + issuer_PK_M);
	print('*	- Exponent ' + issuer_PK_E);

	//Retrieve ICC Public Key Certificate
	SSAD = CARD_DATA['93'];
	print('* - Tag 93 Signed Static Application Data');
	print('* - Len ' + getLen(SSAD));
	print('*	- Value ' + SSAD);
	
	var SSAD_Recovered = decRSAwithPublicKey(SSAD, issuer_PK_M, issuer_PK_E);
	print('* - Data Recovered from the Signed Static Application Data');
	print('* - Len ' + getLen(SSAD_Recovered));
	print('*	- Value ' + SSAD_Recovered);
	
	msg2 = SAD;
	if(CARD_DATA['9F4A'] != null && CARD_DATA['9F4A'] != ''){ // SDA tag list
		msg2 += CARD_DATA['82']; // add AIP
	}
	validate_Recovered_Data('03', SSAD_Recovered, msg2);
	
	return SSAD_Recovered;
}

function validate_SDAD_for_DDA(ICC_PK_M, ICC_PK_E)
{
	var msg1, msg2, hash, hashResult;
	print('\n*************************************************');
	print('* Retrieve Signed Dynamic Application Data for DDA');
	print('*************************************************');

	print('* - ICC Public Key');
	print('*	- Modulus ' + ICC_PK_M);
	print('*	- Exponent ' + ICC_PK_E);

	//retrive ICC Public Key E and decrypt Signed Dynamic Application Data
	SDAD = CARD_DATA['9F4B'];
	decrypted_SDAD = decRSAwithPublicKey(SDAD ,ICC_PK_M , ICC_PK_E);
	print('* - Encrypted Signed Application Data : ' + SDAD);
	print('* - Decrypted Signed Application Data : ' + decrypted_SDAD);
		
	validate_Recovered_Data('05', decrypted_SDAD, DOL_DATA['9F37']);
	return decrypted_SDAD;
}


function validate_SDAD_for_fDDA(ICC_PK_M, ICC_PK_E)
{
	if(CARD_DATA['9F4B'] == null) printError('SDAD is not present!!!');
	var msg1, msg2, hash, hashResult;
	print('\n*************************************************');
	print('* Retrieve Signed Dynamic Application Data for DDA');
	print('*************************************************');

	print('* - ICC Public Key');
	print('*	- Modulus ' + ICC_PK_M);
	print('*	- Exponent ' + ICC_PK_E);

	//retrive ICC Public Key E and decrypt Signed Dynamic Application Data
	SDAD = CARD_DATA['9F4B'];
	decrypted_SDAD = decRSAwithPublicKey(SDAD ,ICC_PK_M , ICC_PK_E);
	print('* - Encrypted Signed Application Data : ' + SDAD);
	print('* - Decrypted Signed Application Data : ' + decrypted_SDAD);

	var msg2 = '';
	if((parseInt(DOL_DATA['9F66'].substring(6, 8), 16) & 0x80) == 0x80 
					&& CARD_DATA['9F69'] != null && CARD_DATA['9F69'] != ""){
		print('* - fDDA01');
		msg2 = DOL_DATA['9F37'] + DOL_DATA['9F02'] + DOL_DATA['5F2A'] + CARD_DATA['9F69']; 
	}
	else{
		print('* - fDDA00');
		msg2 = DOL_DATA['9F37'];
	}
		
	validate_Recovered_Data('05', decrypted_SDAD, msg2);
}


function validate_Recovered_Data(format, Recovered_C, msg2)
{
	var key_name, pan_name, off_end, msg1, hash, hashResult;
	if(format == '02'){
		key_name = 'Issuer Public Key';
		pan_name = 'Issuer Identifier';
		off_end = 12;

	}
	else if(format == '03'){
		key_name = 'Signed Static Application Data';
		off_end = 0;
	}
	else if(format == '04'){
		key_name = 'ICC Public Key';
		pan_name = 'Application PAN';
		len_PAN = 24;
	}
	else if(format == '05'){
		key_name = 'Signed Dynamic Application Data';
		off_end = 0;
	}

	print('\n*************************************************');
	print('* Validate '+key_name+' Recovered');
	print('*************************************************');
	//validate Recovered Data Header and Certificate Format
	print('* - validate Recovered Data Header and Certificate Format');
	if(Recovered_C.substring(0,2) != '6A')
		printError('* - Invalid Recovered Data Header');
	else 
		print('* - Recovered Data Validation...PASS');
	if(Recovered_C.substring(2,4) != format){
		if(format == '05' 
			&& Recovered_C.substring(2,4) != '95'){
				printError('* - Invalid Certificate Format : ' + format);
		}
		
	}
	else
		print('* - Certificate Format Validation...PASS');

	if(Recovered_C.substring(Recovered_C.length -2 ) != "BC")
		printError("* - Invalid Recovered Data Tailer");
	else
		print("* - Recovered Data Tailer Validation...PASS");
	
	//validate Hash Result
	print('* - Validate Hash Result');
	hashResult = Recovered_C.substring(Recovered_C.length - 42, Recovered_C.length - 2); 
	msg1 = Recovered_C.substring(2, Recovered_C.length - 42);
	print('* - Data to be hashed : ' + msg1 + msg2);	
	hash = messageDigest_SHA1(msg1 + msg2).toUpperCase();
	print('* - Calculated Hash : ' + hash);
	print('* - Hash Result     : ' + hashResult); 
	if(hash != hashResult){
		print('* - Hash Result Validation...FAIL');	
	}
	else{ 
		print('* - Hash Result Validation...PASS');
	}
	
	if(off_end> 0){
		//validate Issuer Identifier or Application PAN
		print('* - Validate '+pan_name);
		print('* - '+pan_name+' : ' + Recovered_C.substring(4, off_end));
		print('* - PAN : ' + CARD_DATA['5A']);
		var temp = CARD_DATA['5A'].substring(3,9) + 'FF';
		if(compare_PAN(Recovered_C.substring(4, off_end), temp) == -1)
			print('* - Invalid '+pan_name);
		else
			print('* - '+pan_name+' validation...PASS');
	}
}

function validate_TXHash(hashResult){
	print('\n*************************************************');
	print('* Validate Transaction Data Hash Code');
	print('*************************************************');
	var data = getTag(RES_GENAC, '77');
	data = data.substring(0, data.indexOf('9F4B')) + data.substring(data.indexOf('9F10'));
	data_PDOL = DOL_VALUE['PDOL'] == undefined ? '' : DOL_VALUE['PDOL'];
	data_CDOL1 = DOL_VALUE['CDOL1'] == undefined ? '' : DOL_VALUE['CDOL1'];
	data_CDOL2 = DOL_VALUE['CDOL2'] == undefined ? '' : DOL_VALUE['CDOL2'];
	print('* - PDOL : ' + data_PDOL);
	print('* - CDOL1 : ' + data_CDOL1);
	print('* - CDOL2 : ' + data_CDOL2);
	
	print('* - Response of Gen AC without SDAD : ' + data);
	data = data_PDOL + data_CDOL1 + data_CDOL2 + data;
	print('* - Data to be hashed : ' + data);
	data = messageDigest_SHA1(data).toUpperCase();
	print('* - Calculated Hash : ' + data);
	print('* - Hash Result     : ' + hashResult); 
	if(data != hashResult){
		printError('* - Hash Result Validation...FAIL');	
	}
	else{ 
		print('* - Hash Result Validation...PASS');
	}
}

function compare_PAN(str1, str2)
{
	if(str1.length > str2.length)
	{
		var tmp = str1;
		str1 = str2;
		str2 = tmp;
	}
	for(i = 0 ; i < str1.length ; i++)
		if(str1[i] != 'F' && str2[i] != 'F' && str1[i] != str2[i])
			return -1;
	return 0;
}

function getLen(data){
	return data == null ? '' : toHex(data.length/2);
}

var depth = 0;
var blank = '\t\t\t\t\t\t\t\t\t\t';
function storeResponseTag(res, flg){
	var max = res.length;
	depth++;
	var tab = blank.substring(0, depth);
	for(var i = 0; i < max; ) {
		var tag = res.substring(i, i+=(((parseInt(res.substring(i, i + 2), 16) & 0x1F) == 0x1F) ? 4 : 2));
		var len = res.substring(i, i += 2);
		if(len == '81'){
			len = res.substring(i, i += 2);
		}
		var value = res.substring(i, i += parseInt(len, 16) * 2);
		var err = false;
		if(flg && CARD_DATA[tag] != null && CARD_DATA[tag] != ''){ // duplicate chec (only Read Record command)
			err = true;			
		}
		CARD_DATA[tag] = value;
		
		if((parseInt(tag.substring(0, 2), 16) & 0x20) == 0x20){//template tag
			print('*' + tab + tag + ' ' + len);
			storeResponseTag(value, flg);
		}
		else{
			print('*' + tab + (tag.length == 2 ? tag + '  ' : tag) + ' ' + len + ' ' + value);
			if(tag == '80'){
					depth--;
					return value;
			}else if(err){
				printError('Tag ' + tag + ' has already received!!! : ' + CARD_DATA[tag]);
			}
		}
	}
	depth--;
}


function getTag(res, sTag){
	var max = res.length;
	for(var i = 0; i < max; ) {
		var tag = res.substring(i, i+=(((parseInt(res.substring(i, i + 2), 16) & 0x1F) == 0x1F) ? 4 : 2));
	
		var len = res.substring(i, i += 2);
		if(len == '81'){
			len = res.substring(i, i += 2);
		}
		var value = res.substring(i, i += parseInt(len, 16) * 2);
		if(tag == sTag) return value;
		if((parseInt(tag.substring(0, 2), 16) & 0x20) == 0x20){//template tag
			return getTag(value, sTag);
		}
	}
	return null;
}

function getARPC(){
	print('\n*************************************************');
	print('* Get ARPC');
	print('*************************************************');
	
	var ARC = DOL_DATA['8A'];
	print('* - ARQC : ' + RES_ARQC);
	print('* - ARC  : ' + ARC);
	print('* - ATC  : ' + ATC);
	print('* - UDK : ' + UDK);
	
	Y = xor(RES_ARQC, ARC + '000000000000');
	if(DOL_DATA['DF69'] == '01'){
		ARPC = SM4_Enc(Y + '0000000000000000', getSK_SM(UDK)).toUpperCase();
		ARPC =  ARPC.substring(0, 16);
	}else{
		ARPC = tdes_cbc(Y, getSK(UDK)).toUpperCase();
	}
		
	print('* - ARPC : ' + ARPC);

	return ARPC;
}

function getSK(MK){
	print("* DES Session Key");
	print('* - ATC : ' + ATC);
	print('* - MK : ' + MK);
	var SK = tdes_ecb('000000000000' + ATC + '000000000000' + xor(ATC, 'FFFF'), MK).toUpperCase();
	print('* - SK : ' + SK);
	return SK;
}


function getSK_SM(MK){
	print("* SM4 Session Key");
	print('* - ATC : ' + ATC);
	print('* - MK : ' + MK);
	var SK = SM4_Enc('000000000000' + ATC + '000000000000' + xor(ATC, 'FFFF'), MK).toUpperCase();
	print('* - SK : ' + SK);
	return SK;
}


function ftdesMAC_SM(data, key){	
	var src = SM4_Enc(data.substring(0, 32), key);
	for(i = 32; i < data.length; i += 32){	
		src = xor(src, data.substring(i, i + 32));
		src = SM4_Enc(src, key);
	}
	return src.substring(0, 16);
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
	print("* containing secure messaging processed on last transaction : " + toHex(CVR_Byte_4 & 0xE0));
	if( (CVR_Byte_4 & BIT_MASK_4) == BIT_MASK_4)
		print("* Byte 4 Bit 4 Issuer Scripting processing failed on last transaction");
	if( (CVR_Byte_4 & BIT_MASK_3) == BIT_MASK_3)
		print("* Byte 4 Bit 3 Offline dynamic data authentication failed on last transaction and transaction declined offline");
	if( (CVR_Byte_4 & BIT_MASK_2) == BIT_MASK_2)
		print("* Byte 4 Bit 2 Offline dynamic data authentication performed");
		
	//assign Values
	CVR = data;

}

function BIT_MASK(src, off, BIT_MASK){
	off = (off - 1) * 2;
	return src.substring(0, off) + toHex(parseInt(src.substring(off, off + 2), 16) | BIT_MASK) + src.substring(off + 2, src.length);
}
validateAC = false;
function validate_AC()
{
	if(!validateAC) return;
	if (CARD_DATA['9F10'] == "" || CARD_DATA['9F10'] == null || CARD_DATA['9F26'] == "" || CARD_DATA['9F26'] == null) return;
	var CVN = CARD_DATA['9F10'].substring(4, 6);
	var sourceData ,calculated_AC;
		
	
	switch(CVN){
		case '01' :
			sourceData = DOL_DATA['9F02'] + DOL_DATA['9F03'] + DOL_DATA['9F1A'] + DOL_DATA['95'] +
						 DOL_DATA['5F2A'] + DOL_DATA['9A'] + DOL_DATA['9C'] + 
						 DOL_DATA['9F37'] + CARD_DATA['82'] + ATC + CARD_DATA['9F10'].substring(6, 14);	
			break;
		case '11' :
			sourceData = DOL_DATA['9F02'] + DOL_DATA['9F37'] + ATC + CARD_DATA['9F10'].substring(8, 10);
			break;			
	}	
	
  	
	if(DOL_DATA['DF69'] == '01'){
		// SM4 TODO
		sourceData = PAD_00(sourceData + '8000000000000000'); // 16의 배수
		SK = getSK_SM(UDK);
  		calculated_AC = ftdesMAC_SM(sourceData, SK);
	}
	else{
		// DES
		sourceData = PAD_00(sourceData + '80');
		SK = getSK(UDK);
  		calculated_AC = ftdesMAC(sourceData, SK);
	}
	print("\n***********************************************");
	print("* Application Cryptogram Validation");
	print("***********************************************");
	print("* - CVN : " + CVN);
	print("* - Source : " + sourceData);
	print("* - ATC : " + ATC);
	print("* - Unique DEA Key : " + UDK.toUpperCase());
	print("* - Session Key : " + SK);
	print("* - Calculated Application Cryptogram : " + calculated_AC.toUpperCase());
	print("* - Application Cryptogram in Generate AC response : " + CARD_DATA['9F26']);
	
	if(calculated_AC.toUpperCase() != CARD_DATA['9F26'])
		printError("* Applcation Cryptogram Validation.....FAIL");
	else
		print("* Applcation Cryptogram Validation.....PASS");
	
}

function validate_IAD_MAC()
{
	if (CARD_DATA['9F10'] == "" || CARD_DATA['9F10'] == null) return;
	var data = CARD_DATA['9F10'];
	var sourceData ,calculated_AC;
	sourceData = data.substring(0, data.length - 8);
	ID = data.substring(18, 20);
	IDD_MAC = data.substring(data.length - 8, data.length);
	var PAD = '';
	switch (ID){
		case '01':
				EC_BALANCE = send("80 CA" + '9F79' + "00");
				sourceData = ATC + EC_BALANCE.substring(EC_BALANCE.length - 10, EC_BALANCE.length) + '00';
				PAD = '8000000000000000';
				break;
		case '02':
				CTTA = '0000000000';
				sourceData = ATC + CTTA.substring(CTTA.length - 10, CTTA.length) + '00';
				PAD = '8000000000000000';
				break;
		case '03':
				EC_BALANCE = send("80 CA" + '9F79' + "00");
				CTTA = '0000000000';
				sourceData = ATC + EC_BALANCE.substring(EC_BALANCE.length - 10, EC_BALANCE.length) + CTTA.substring(CTTA.length - 10, CTTA.length) + '00000000';
				break;
		case '04':
				CTTA = '0000000000';
				CTTAL = send("80 CA" + '9F54' + "00");
				sourceData = ATC + CTTA.substring(CTTA.length - 10, CTTA.length) + CTTAL.substring(CTTAL.length - 10, CTTAL.length) + '00000000';
				break;
		case '05':
				AVAILABLE_OFFLINE_BALANCE = send("80 CA" + '9F5D' + "00");
				sourceData = ATC + AVAILABLE_OFFLINE_BALANCE.substring(AVAILABLE_OFFLINE_BALANCE.length - 10, AVAILABLE_OFFLINE_BALANCE.length) + '00';
				PAD = '8000000000000000';
				break;

	}
	
	var SK = getSK(MAC);
	print('* - Source: ' + sourceData);
	print('* - SK: ' + SK);
	calculated_MAC = ftdesMAC(sourceData + PAD, SK);
	
	print("\n***********************************************");
	print("*  MAC returned in the Tag 9F10 Validation");
	print("***********************************************");
	print("* - IAD : " + data)
	print("* - ID : " + ID);
	print("* - Source : " + sourceData);
	print("* - ATC : " + ATC);
	print("* - Unique DEA Key : " + MAC);
	print("* - Session Key : " + SK);
	print("***********************************************");
	print("* - Received MAC : " + IDD_MAC);
	print("* - Computed MAC : " + calculated_MAC.toUpperCase().substring(0, 8));
	    
	if(calculated_MAC.toUpperCase().substring(0, 8) != IDD_MAC)
		printError("* MAC returned in the Tag 9F10 Validation.....FAIL");
	else
		print("* MAC returned in the Tag 9F10 Validation.....PASS"); 
}



function PAD_00(data){
	var len = data.length/2;
	if(len % 8 != 0) data = data + zeros.substring(0, (8 - len % 8) * 2);
	return data; 
}



function printError(str){
	if(debug){
		print('!!ERROR!! '+ str);
	}else{
		error(str);
	}
}