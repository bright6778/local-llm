/* 
 * author: Junghwan Kim
 * refernce: VCPS Perso V2.0.2
 * description: select_image() -> init_image() -> store_data()
 */




/* define infomation for install for install
 *	P60D040 v03.02 & P60D041 v01.01 &P60D080 v03.01 with PBOC2.0 and PBOC3.0 applets on the same card. 
	*	so define the PBOC3.0 Package AID:A00000033310 */
	
//original	
/*
var PBOC_PACKAGE_ID = 'A00000033301';
var PBOC_APP_ID = 'A0000003330101';
/**/
//chained AID - for PBOC2.0

var PBOC_PACKAGE_ID = 'A00000033310';
var PBOC_APP_ID = 'A0000003331010';
/**/
var PBOC_INSTANCE_ID = 'A0000003330101';

var PBOC_MULTI_INSTANCE_ID_1 = 'A000000333010101';
var PBOC_MULTI_INSTANCE_ID_2 = 'A000000333010102';

var INSTALL_PARAMETER_LONG_KEY	=	'01100BC909080300000001B0000000';
var INSTALL_PARAMETER_NORMAL	=	'01100BC909000000000001B0000000';

 
 



var CRYPTO_RSA_768 = 'crypto_rsa_768';
var CRYPTO_RSA_1024 = 'crypto_rsa_1024';
var CRYPTO_RSA_1152 = 'crypto_rsa_1152';
var CRYPTO_RSA_1280 = 'crypto_rsa_1280';
var CRYPTO_RSA_1408 = 'crypto_rsa_1408';
var CRYPTO_RSA_1976 = 'crypto_rsa_1976';
var CRYPTO_RSA_1984 = 'crypto_rsa_1984';

//var PBOC_PACKAGE_ID = 'A00000033301';
//var PBOC_APP_ID = 'A00000033301';
//var PBOC_INSTANCE_ID = 'A0000003330101';
//var PBOC_MULTI_INSTANCE_ID_1 = 'A000000333010101';
//var PBOC_MULTI_INSTANCE_ID_2 = 'A000000333010102';

var CVN_01 = 'cvn_01';
var CVN_17 = 'cvn_17';
var cvn = CVN_01;

var id = PBOC_INSTANCE_ID;
var multi_instance_flag = false;

var sequence;
var issuer_key;
var ic_key;
var rsa_key;
var img_num;
function select_image(num) {
	include("//Images//_IMAGE_CONF.js");
	
	img_num = num;
	sequence = 0;
	id = PBOC_INSTANCE_ID;
	
	
	switch (num) {
		case 0:	// PSE and PPSE aren't installed
			AIP_DC = '5C00';
			ADA = '8240';
			ISSUER_AUTH_INDICATOR = '80';
			LCOL = '03';
			UCOL = '07';
			issuer_key = CRYPTO_RSA_1024;
			ic_key = CRYPTO_RSA_1024;
			break;
		
		case 1:	
			AIP_DC = '5C00';
			ADA = '8240';
			ISSUER_AUTH_INDICATOR = '80';
			LCOL = '03';
			UCOL = '07';
			issuer_key = CRYPTO_RSA_1024;
			ic_key = CRYPTO_RSA_1024;
			break;
			
		case 2:
			AIP_DC = '5800';
			ADA = '8240';
			ISSUER_AUTH_INDICATOR = '80';
			LCOL = '03';
			UCOL = '07';
			issuer_key = CRYPTO_RSA_1024;
			ic_key = CRYPTO_RSA_1024;
			break;
			
		case 3:
			AIP_DC = '5C00';
			ADA = '8240';
			ISSUER_AUTH_INDICATOR = '00';
			ISSUER_APP_DATA = '07010103000000010A02';
			LCOL = '03';
			UCOL = '07';
			issuer_key = CRYPTO_RSA_1024;
			ic_key = CRYPTO_RSA_1024;
			break;
				
		case 4:
			AIP_DC = '5C00';
			ADA = '1E40';
			ISSUER_AUTH_INDICATOR = '80';
			LCOL = '03';
			UCOL = '07';
			issuer_key = CRYPTO_RSA_1024;
			ic_key = CRYPTO_RSA_1024;
			break;
						
		case 6:
			AIP_DC = '5C00';
			ADA = '8240';
			ISSUER_AUTH_INDICATOR = '80';
			LCOL = '00';
			UCOL = '07';
			issuer_key = CRYPTO_RSA_1024;
			ic_key = CRYPTO_RSA_1024;
			break;
				
		case 7:
			AIP_DC = '5C00';
			ADA = '8240';
			ISSUER_AUTH_INDICATOR = '80';
			LCOL = '09';
			UCOL = '07';
			issuer_key = CRYPTO_RSA_1024;
			ic_key = CRYPTO_RSA_1024;
			break;
				
		case 8:
			AIP_DC = '5C00';
			ADA = '8040';
			ISSUER_AUTH_INDICATOR = '00';
			LCOL = '03';
			UCOL = '09';
			issuer_key = CRYPTO_RSA_1024;
			ic_key = CRYPTO_RSA_1024;
			break;
				
		case 9:
			AIP_DC = '5800';
			ADA = '8040';
			LCOL = '09';
			UCOL = '07';
			issuer_key = CRYPTO_RSA_1024;
			ic_key = CRYPTO_RSA_1024;
			break;
			
		case 10:
			AIP_DC = '5C00';
			ADA = '8000';
			ISSUER_AUTH_INDICATOR = '80';
			LCOL = '03';
			UCOL = '07';
			issuer_key = CRYPTO_RSA_1024;
			ic_key = CRYPTO_RSA_1024;
			break;
			
		case 11:
			AIP_DC = '1C00';
			ADA = '8240';
			ISSUER_AUTH_INDICATOR = '80';
			LCOL = '03';
			UCOL = '07';
			issuer_key = CRYPTO_RSA_1024;
			ic_key = CRYPTO_RSA_1024;
			break;
			
		case 12:
			AIP_DC = '5C00';
			ADA = 'C242';
			ISSUER_AUTH_INDICATOR = '80';
			LCOL = '09';
			UCOL = '07';
			issuer_key = CRYPTO_RSA_1024;
			ic_key = CRYPTO_RSA_1024;
			break;
			
		case 13:
			AIP_DC = '5C00';
			ADA = 'C640';
			ISSUER_AUTH_INDICATOR = '80';
			LCOL = '03';
			UCOL = '07';
			issuer_key = CRYPTO_RSA_1024;
			ic_key = CRYPTO_RSA_1024;
			break;
			
		case 14:
			AIP_DC = '5C00';
			ADA = '9240';
			ISSUER_AUTH_INDICATOR = '80';
			LCOL = '03';
			UCOL = '07';
			issuer_key = CRYPTO_RSA_1024;
			ic_key = CRYPTO_RSA_1024;
			break;
			
		case 15:
			AIP_DC = '5C00';
			ADA = '8240';
			ISSUER_AUTH_INDICATOR = '80';
			LCOL = '03';
			UCOL = '00';
			issuer_key = CRYPTO_RSA_1024;
			ic_key = CRYPTO_RSA_1024;
			break;
			
		case 16:
			AIP_DC = '5C00';
			ADA = '8340';
			ISSUER_AUTH_INDICATOR = '80';
			LCOL = '03';
			UCOL = '07';
			issuer_key = CRYPTO_RSA_1024;
			ic_key = CRYPTO_RSA_1024;
			break;
			
		case 17:
			AIP_DC = '5C00';
			ADA = '8230';
			ISSUER_AUTH_INDICATOR = '80';
			LCOL = '03';
			UCOL = '07';
			issuer_key = CRYPTO_RSA_1024;
			ic_key = CRYPTO_RSA_1024;
			break;
			
		case 18:
			AIP_DC = '5C00';
			ADA = '9340';
			ISSUER_AUTH_INDICATOR = '80';
			LCOL = '03';
			UCOL = '07';
			issuer_key = CRYPTO_RSA_1024;
			ic_key = CRYPTO_RSA_1024;
			break;
			
		case 19:
			AIP_DC = '5C00';
			ADA = '82C0';
			ISSUER_AUTH_INDICATOR = '80';
			LCOL = '03';
			UCOL = '07';
			issuer_key = CRYPTO_RSA_1024;
			ic_key = CRYPTO_RSA_1024;
			break;
			
		case 21:
			AIP_DC = '7C00';
			ADA = 'C000';
			ISSUER_AUTH_INDICATOR = '80';
			LCOL = '03';
			UCOL = '07';
			issuer_key = CRYPTO_RSA_1024;
			ic_key = CRYPTO_RSA_1024;
			break;
			
		case 22:
			AIP_DC = '7C00';
			ADA = '8200';
			ISSUER_AUTH_INDICATOR = '80';
			LCOL = '03';
			UCOL = '07';
			issuer_key = CRYPTO_RSA_1024;
			ic_key = CRYPTO_RSA_1024;
			break;
			
		case 23:
			AIP_DC = '7D00';
			ADA = 'C000';
			ISSUER_AUTH_INDICATOR = '80';
			issuer_key = CRYPTO_RSA_1024;
			ic_key = CRYPTO_RSA_1024;
			break;
			
		case 24:
			issuer_key = CRYPTO_RSA_1024;
			ic_key = CRYPTO_RSA_1024;
			break;
			
		case 27:
			AIP_DC = '5C00';
			ISSUER_AUTH_INDICATOR = '80'
			ADA = '8240';
			CONSECUTIVE_TRANSACTION_LIMIT_INTERNATIONAL_COUNTRY = '03';
			CUMULATIVE_TOTAL_TRANSACTION_AMOUNT_LIMIT_DUAL = '000000015000';
			SECOND_APP_CURRENCY_CODE = '0826';
			CONVERSION_FACTOR = '20000175';
			issuer_key = CRYPTO_RSA_1024;
			ic_key = CRYPTO_RSA_1024;
			break;
			
		case 29:
			AIP_DC = '5C00';
			ISSUER_AUTH_INDICATOR = '00'
			ADA = '8240';
			CONSECUTIVE_TRANSACTION_LIMIT_INTERNATIONAL_COUNTRY = '03';
			CUMULATIVE_TOTAL_TRANSACTION_AMOUNT_LIMIT_DUAL = '000000015000';
			SECOND_APP_CURRENCY_CODE = '0826';
			CONVERSION_FACTOR = '20000175';
			issuer_key = CRYPTO_RSA_1024;
			ic_key = CRYPTO_RSA_1024;
			break;
			
		case 32:
			AIP_DC = '5C00';
			ISSUER_AUTH_INDICATOR = '80'
			ADA = '8240';
			CONSECUTIVE_TRANSACTION_LIMIT_INTERNATIONAL_COUNTRY = '0F';
			CONSECUTIVE_TRANSACTION_LIMIT_INTERNATIONAL_CURRENCY = '0F';
			CUMULATIVE_TOTAL_TRANSACTION_AMOUNT_LIMIT_DUAL = '000000015000';
			CUMULATIVE_TOTAL_TRANSACTION_AMOUNT_LIMIT = '000099999999';
			SECOND_APP_CURRENCY_CODE = '0826';
			CONVERSION_FACTOR = '20000175';
			issuer_key = CRYPTO_RSA_1024;
			ic_key = CRYPTO_RSA_1024;
			break;
			
		case 35:
			AIP_DC = '5C00';
			AIP_EC = '5800';
			ADA = '82C8';
			ISSUER_AUTH_INDICATOR = '80';
			LCOL = '03';
			UCOL = '07';
			CUMULATIVE_TOTAL_TRANSACTION_AMOUNT_LIMIT = '000000010000';
			EC_BALANCE = '000000000000'; // 9F79
			EC_BALANCE_LIMIT = '000000000500'; // 9F77
			EC_TRANSACTION_LIMIT = '000000000300'; // 9F78
			EC_RESET_THRESHOLD = '000000001500'; // 9F6D
			issuer_key = CRYPTO_RSA_1024;
			ic_key = CRYPTO_RSA_1024;
			break;
			
		case 36:
			AIP_DC = '1800';
			ADA = '8241';
			ISSUER_AUTH_INDICATOR = '80';
			LCOL = '03';
			UCOL = '07';
			PDOL_CT = '9F1A029F7A019F02065F2A029F4E14';
			issuer_key = CRYPTO_RSA_1024;
			ic_key = CRYPTO_RSA_1024;
			break;
			
		case 38:
			AIP_DC = '5C00';
			ISSUER_AUTH_INDICATOR = '80'
			ADA = 'C248';
			CONSECUTIVE_TRANSACTION_LIMIT_INTERNATIONAL_COUNTRY = '05';
			CUMULATIVE_TOTAL_TRANSACTION_AMOUNT_UPPER_LIMIT = '000000005000';
			SECOND_APP_CURRENCY_CODE = '0826';
			CONVERSION_FACTOR = '20000175';
			issuer_key = CRYPTO_RSA_1024;
			ic_key = CRYPTO_RSA_1024;
			break;
			
		case 39:
			AIP_DC = '5C00';
			ISSUER_AUTH_INDICATOR = '80'
			ADA = '8240';
			LCOL = '03';
			UCOL = '07';
			issuer_key = CRYPTO_RSA_1024;
			ic_key = CRYPTO_RSA_1024;
			break;
			
		case 40:
			AIP_DC = '5C00';
			ADA = '8240';
			ISSUER_AUTH_INDICATOR = '80';
			LCOL = '03';
			UCOL = '07';
			ATC = 'FFFD';
			issuer_key = CRYPTO_RSA_1024;
			ic_key = CRYPTO_RSA_1024;
			break;
			
		case 41:
			AIP_DC = '5C00';
			ADA = '8240';
			ISSUER_AUTH_INDICATOR = '80';
			CONSECUTIVE_TRANSACTION_LIMIT_INTERNATIONAL_CURRENCY = '05';
			LCOL = '05';
			UCOL = '07';
			issuer_key = CRYPTO_RSA_1024;
			ic_key = CRYPTO_RSA_1024;
			break;
			
		case 42:
			AIP_DC = '5C00';
			ADA = '8240';
			ISSUER_AUTH_INDICATOR = '80';
			CONSECUTIVE_TRANSACTION_LIMIT_INTERNATIONAL_COUNTRY = '05';
			LCOL = '05';
			UCOL = '07';
			issuer_key = CRYPTO_RSA_1024;
			ic_key = CRYPTO_RSA_1024;
			break;
		
		case 43:
			AIP_DC = '5C00';
			ADA = '8240';
			ISSUER_AUTH_INDICATOR = '80';
			CONSECUTIVE_TRANSACTION_LIMIT_INTERNATIONAL_CURRENCY = '05';
			CONSECUTIVE_TRANSACTION_LIMIT_INTERNATIONAL_COUNTRY = '05';
			LCOL = '05';
			UCOL = '07';
			issuer_key = CRYPTO_RSA_1024;
			ic_key = CRYPTO_RSA_1024;
			break;
			
		// Image for EC(Dual Currency) 
		case 44:
			AIP_DC = '7C00';
			AIP_EC = '7800';
			ADA = '8241';
			ISSUER_AUTH_INDICATOR = '80';
			LCOL = '03';
			UCOL = '07';
			CUMULATIVE_TOTAL_TRANSACTION_AMOUNT_LIMIT = '000000010000';
			EC_BALANCE = '000000002000'; // 9F79
			EC_BALANCE_LIMIT = '000000010000'; // 9F77
			EC_TRANSACTION_LIMIT = '000000001000'; // 9F78
			EC_RESET_THRESHOLD = '000000001500'; // 9F6D
			issuer_key = CRYPTO_RSA_1024;
			ic_key = CRYPTO_RSA_1024;
			break;
				
		default:
			break;
	}
	
	// check key
	if (issuer_key == CRYPTO_RSA_1024) {
		CA_PK_INDEX = _CA_PK_INDEX_1024;
		ISSUER_PK_REMAINDER = _ISSUER_PK_REMAINDER_1024;
		ISSUER_PK_EXPONENT = _ISSUER_PK_EXPONENT_1024;
		ISSUER_PK_CERTIFICATE = _ISSUER_PK_CERTIFICATE_1024;
		IC_PK_CERTIFICATE = _IC_PK_CERTIFICATE_1024;
		SSAD = _SSAD_1024;
	} else if (issuer_key == CRYPTO_RSA_1408) {
		CA_PK_INDEX = _CA_PK_INDEX_1408;
		ISSUER_PK_REMAINDER = _ISSUER_PK_REMAINDER_1408;
		ISSUER_PK_EXPONENT = _ISSUER_PK_EXPONENT_1408;
		ISSUER_PK_CERTIFICATE = _ISSUER_PK_CERTIFICATE_1408;
		IC_PK_CERTIFICATE = _IC_PK_CERTIFICATE_1408;
		SSAD = _SSAD_1408;
	}
	if (ic_key == CRYPTO_RSA_1024) {
		IC_PK_EXPONENT = _IC_PK_EXPONENT_1024;
		IC_PK_REMAINDER = _IC_PK_REMAINDER_1024;
		ONE_DEVIDE_Q_MOD_P = _ONE_DEVIDE_Q_MOD_P_1024;
		D_MOD_Q_MINUS_ONE = _D_MOD_Q_MINUS_ONE_1024;
		D_MOD_P_MINUS_ONE = _D_MOD_P_MINUS_ONE_1024;
		Q = _Q_1024;
		P = _P_1024;
	} else if (ic_key == CRYPTO_RSA_1408) {
		IC_PK_EXPONENT = _IC_PK_EXPONENT_1408;
		IC_PK_REMAINDER = _IC_PK_REMAINDER_1408;
		ONE_DEVIDE_Q_MOD_P = _ONE_DEVIDE_Q_MOD_P_1408;
		D_MOD_Q_MINUS_ONE = _D_MOD_Q_MINUS_ONE_1408;
		D_MOD_P_MINUS_ONE = _D_MOD_P_MINUS_ONE_1408;
		Q = _Q_1408;
		P = _P_1408;
	} 
	return;
}

////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
var PSE = 'pse';
var PPSE = 'ppse';
var DUAL = 'dual';

function init_image(sel) {
	reset();
	
	print('\n* Select ISD & Auth');
	select('a0');
	auth();

	print('\n* Remove Instance');
	send('80E4000010 4F0E325041592E535953 2E444446303100');
	send('80E4000010 4F0E315041592E535953 2E444446303100');
	send('80E4000009 4F07A000000333010100');
	if (!multi_instance_flag) {
		send('80E400000A 4F08A00000033301010200');
		send('80E400000A 4F08A00000033301010100');
		send('80E4000009 4F07A000000333010100');
	}
	
/*	if (img_num == 24 && multi_instance_flag == false)
		multi_instance_flag = true;
	else if (img_num == 24 && multi_instance_flag == true)
		multi_instance_flag = false;
	
	print('\n* Install PBOC'); // package applet instance parameter
	var data = '06A00000033301 07A0000003330101' +  string_length(id.length/2) + id + '011002C9000000'
	send('80E60C00' + string_length(data.length/2) + data);
	//assertSW('9000');*/
	
	if (img_num == 27 && multi_instance_flag == false)
		multi_instance_flag = true;
	else if (img_num == 27 && multi_instance_flag == true)
		multi_instance_flag = false;
	
	if ((img_num== 37)||(img_num== 38)||(img_num== 39)||(img_num== 40)||(img_num== 41)||(img_num== 53)||(img_num== 48)||(img_num== 54)||(img_num== 51)||(img_num== 52))//youmeng 20131127
	{
		var data =	string_length(PBOC_PACKAGE_ID.length/2)+PBOC_PACKAGE_ID + string_length(PBOC_APP_ID.length/2)+ PBOC_APP_ID+ string_length(id.length/2) + id + INSTALL_PARAMETER_LONG_KEY;
	}
	else
	{
	  var data =	string_length(PBOC_PACKAGE_ID.length/2)+PBOC_PACKAGE_ID + string_length(PBOC_APP_ID.length/2)+ PBOC_APP_ID+ string_length(id.length/2) + id + INSTALL_PARAMETER_NORMAL;
  }
  print('\n* Install PBOC'); // package applet instance parameter
	send('80E60C00' + string_length(data.length/2) + data);
	//assertSW('9000');

	
	if (sel == PSE)
		include("//Images//_IMAGE_PSE.js");
	else if (sel == PPSE)
		include("//Images//_IMAGE_PPSE.js");
	else if (sel == DUAL) {
		include("//Images//_IMAGE_PSE.js");
		include("//Images//_IMAGE_PPSE.js");
	}	
		
	reset();	
	print('\n* Set SCP-02');
	set_var('scp02');
	
	print('\n* Select PBOC');
	select(id);

	print('\n* External Authenticate and Initialize Update');
	auth();
}

////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
var APP_DC_LEVEL = 1;
var APP_EC_LEVEL = 2;
var APP_QPBOC_LEVEL = 3;
var APP_EXTENDED_LEVEL = 4;

var data;
var DUAL_CURRENCY = 'DUAL CURRENCY';
var SINGLE_CURRENCY = 'SINGLE CURRENCY';

function store_data(level, currency) {

	// DGI 9104
	if (level >= APP_DC_LEVEL) {
		print('\n* GPO response data (DC)');
		data = '82' + string_length(AIP_DC.length/2) + AIP_DC 
				+ '94' + string_length(AFL_DC.length/2) + AFL_DC
		send_command('00', '9104', data, null, '00');
	}
		
	// DGI 9203
	if (level >= APP_EC_LEVEL) {
		print('\n* GPO response data (EC)');
		data = '82' + string_length(AIP_EC.length/2) + AIP_EC 
				+ '94' + string_length(AFL_EC.length/2) + AFL_EC
		send_command('00', '9203', data, null, '00');
	}
		
	// DGI 9207
	if (level >= APP_QPBOC_LEVEL) {
		print('\n* GPO response data (qPBOC)');
		
		data = '82' + string_length(AIP_QPBOC.length/2) + AIP_QPBOC 
			
		if (cvn == CVN_01)
			data += '9F10' + string_length(QPBOC_ISSUER_APP_DATA_CVN01.length/2) + QPBOC_ISSUER_APP_DATA_CVN01;
		else if (cvn == CVN_17)
			data += '9F10' + string_length(QPBOC_ISSUER_APP_DATA_CVN17.length/2) + QPBOC_ISSUER_APP_DATA_CVN17;
		//sunsw modified by requirements for ABC bank
		data += '94' + string_length(AFL_QPBOC.length/2) + AFL_QPBOC; 
		/*		
		if (ic_key == null || ic_key == CRYPTO_RSA_768 || ic_key == CRYPTO_RSA_1024)
			data += '94' + string_length(AFL_QPBOC.length/2) + AFL_QPBOC
			
		// 9F4B, 9F5D auto perso in applet 
		else data += '94' + string_length(AFL_QPBOC.length/2) + AFL_QPBOC_LONG_KEY
		*/
		send_command('00', '9207', data, null, '00');
	}
	
	// DGI 0101
	if (level >= APP_DC_LEVEL) {
		print('\n* DGI 0101 (AFL: DC ~ EC)');
				
		data = '57' + string_length(TRACK2_EQUIVALENT_DATA.length/2) + TRACK2_EQUIVALENT_DATA
				+ '9F1F' + string_length(TRACK1_DISCRETIONARY_DATA.length/2) + TRACK1_DISCRETIONARY_DATA
				+ '5F20' + string_length(CARDHOLDER_NAME.length/2) + CARDHOLDER_NAME
				+ '9F63' + string_length(PRODUCT_IDENTIFICATION_INFORMATION.length/2) + PRODUCT_IDENTIFICATION_INFORMATION
				+ '9F74' + string_length(EC_ISSUER_AUTH_CODE.length/2) + EC_ISSUER_AUTH_CODE
						
		send_command('00', '0101', data, '70', '00');
	}
	
	// DGI 0102
	if (level >= APP_QPBOC_LEVEL) {
		print('\n* DGI 0102 (AFL: QPBOC ~ EXTENDED)');
		
		data = '57' + string_length(TRACK2_EQUIVALENT_DATA.length/2) + TRACK2_EQUIVALENT_DATA
				+ '9F1F' + string_length(TRACK1_DISCRETIONARY_DATA.length/2) + TRACK1_DISCRETIONARY_DATA
				+ '5F20' + string_length(CARDHOLDER_NAME.length/2) + CARDHOLDER_NAME
				+ '8F' + string_length(CA_PK_INDEX.length/2) + CA_PK_INDEX
				+ '9F32' + string_length(ISSUER_PK_EXPONENT.length/2) + ISSUER_PK_EXPONENT
				+ '92' + string_length(ISSUER_PK_REMAINDER.length/2) + ISSUER_PK_REMAINDER
				+ '9F42' + string_length(APP_CURRENCY_CODE.length/2) + APP_CURRENCY_CODE
				+ '5F30' + string_length(SEVICE_CODE.length/2) + SEVICE_CODE
				+ '5A' + string_length(PAN.length/2) + PAN
				+ '5F24' + string_length(APP_EXPIRATION_DATE.length/2) + APP_EXPIRATION_DATE
		        + '5F25' + string_length(APP_EFFECTIVE_DATE.length/2) + APP_EFFECTIVE_DATE
		        + '9F08' + string_length(APP_VERSION_NUMBER.length/2) + APP_VERSION_NUMBER
		        + '9F07' + string_length(APP_USAGE_CONTROL.length/2) + APP_USAGE_CONTROL
				+ '8E' + string_length(EC_CVM_LIMIT.length/2) + EC_CVM_LIMIT
				+ '9F0D' + string_length(EC_IAC_DEFAULT.length/2) + EC_IAC_DEFAULT
				+ '9F0E' + string_length(EC_IAC_DENIAL.length/2) + EC_IAC_DENIAL
				+ '9F0F' + string_length(EC_IAC_ONLINE.length/2) + EC_IAC_ONLINE
				+ '5F28' + string_length(ISSUER_COUNTRY_CODE.length/2) + ISSUER_COUNTRY_CODE
				
		if (ic_key != null) {
			data += '9F47' + string_length(IC_PK_EXPONENT.length/2) + IC_PK_EXPONENT
					+ '9F48' + string_length(IC_PK_REMAINDER.length/2) + IC_PK_REMAINDER
		}
		
		send_command('00', '0102', data, '70', '00');
	}
		
	// DGI 0201
	if (level >= APP_DC_LEVEL) {
		print('\n* DGI 0201 (AFL: DC)');
			
		data = '8E' + string_length(CVM_LIMIT.length/2) + CVM_LIMIT
				+ '9F0D' + string_length(IAC_DEFAULT.length/2) + IAC_DEFAULT
				+ '9F0E' + string_length(IAC_DENIAL.length/2) + IAC_DENIAL
				+ '9F0F' + string_length(IAC_ONLINE.length/2) + IAC_ONLINE
				+ '5F34'+ string_length(PAN_SEQUENCE_NUMBER.length/2) + PAN_SEQUENCE_NUMBER

		send_command('00', '0201', data, '70', '00');
	}
		
	// DGI 0202
	if (level >= APP_DC_LEVEL) {
		print('\n* DGI 0202 (AFL: DC ~ EC)');
			
		data = '5F30' + string_length(SEVICE_CODE.length/2) + SEVICE_CODE
				+ '9F07' + string_length(APP_USAGE_CONTROL.length/2) + APP_USAGE_CONTROL
				+ '9F08' + string_length(APP_VERSION_NUMBER.length/2) + APP_VERSION_NUMBER
				+ '9F42' + string_length(APP_CURRENCY_CODE.length/2) + APP_CURRENCY_CODE
				+ '5F28' + string_length(ISSUER_COUNTRY_CODE.length/2) + ISSUER_COUNTRY_CODE
				+ '8C' + string_length(CDOL1.length/2) + CDOL1
				+ '8D' + string_length(CDOL2.length/2) + CDOL2
				+ '9F49' + string_length(DDOL.length/2) + DDOL
				+ '8F' + string_length(CA_PK_INDEX.length/2) + CA_PK_INDEX
				+ '9F32' + string_length(ISSUER_PK_EXPONENT.length/2) + ISSUER_PK_EXPONENT
				+ '92' + string_length(ISSUER_PK_REMAINDER.length/2) + ISSUER_PK_REMAINDER
				
		if (ic_key != null) {
			data += '9F47' + string_length(IC_PK_EXPONENT.length/2) + IC_PK_EXPONENT
					+ '9F48' + string_length(IC_PK_REMAINDER.length/2) + IC_PK_REMAINDER
		}
				
		send_command('00', '0202', data, '70', '00');
	}
		
	// DGI 0203
	if (level >= APP_DC_LEVEL) {
		print('\n* DGI 0203 (AFL: DC ~ EXTENDED)');
		
		data = '90' + string_length(ISSUER_PK_CERTIFICATE.length/2) + ISSUER_PK_CERTIFICATE
				
		send_command('00', '0203', data, '70', '00');
	}
		
	// DGI 0204
	if (level >= APP_DC_LEVEL) {
		print('\n* DGI 0204 (AFL: DC ~ EXTENDED)');
		
		data = '9F46' + string_length(IC_PK_CERTIFICATE.length/2) + IC_PK_CERTIFICATE
						
		send_command('00', '0204', data, '70', '00');
	}
		
	// DGI 0205
	if (level >= APP_DC_LEVEL) {
		print('\n* DGI 0205 (AFL: DC ~ EXTENDED)');
			
		data = '93' + string_length(SSAD.length/2) + SSAD
						
		send_command('00', '0205', data, '70', '00');
	}
		
	// DGI 0301
	if (level >= APP_DC_LEVEL) {
		print('\n* DGI 0301 (AFL: DC => SAD)');
		
		data = '5A' + string_length(PAN.length/2) + PAN
				+ '5F24' + string_length(APP_EXPIRATION_DATE.length/2) + APP_EXPIRATION_DATE
		        + '5F25' + string_length(APP_EFFECTIVE_DATE.length/2) + APP_EFFECTIVE_DATE
		        + '9F08' + string_length(APP_VERSION_NUMBER.length/2) + APP_VERSION_NUMBER
					
		send_command('00', '0301', data, '70', '00');
	}
	
	// DGI 0302
	if (level >= APP_EC_LEVEL) {
		print('\n* DGI 0302 (AFL: EC => SAD)');
		
		data = '5A' + string_length(PAN.length/2) + PAN
				+ '5F24' + string_length(APP_EXPIRATION_DATE.length/2) + APP_EXPIRATION_DATE
				+ '9F07' + string_length(APP_USAGE_CONTROL.length/2) + APP_USAGE_CONTROL
				+ '8E' + string_length(EC_CVM_LIMIT.length/2) + EC_CVM_LIMIT
				+ '9F0D' + string_length(EC_IAC_DEFAULT.length/2) + EC_IAC_DEFAULT
				+ '9F0E' + string_length(EC_IAC_DENIAL.length/2) + EC_IAC_DENIAL
				+ '9F0F' + string_length(EC_IAC_ONLINE.length/2) + EC_IAC_ONLINE
				+ '5F28' + string_length(ISSUER_COUNTRY_CODE.length/2) + ISSUER_COUNTRY_CODE
					
		send_command('00', '0302', data, '70', '00');
	}
	
	// DGI 0303
	if (level >= APP_QPBOC_LEVEL) {
		print('\n* DGI 0303 (AFL: qPBOC ~ EXTENDED)');
				
		data = '9F74' + string_length(EC_ISSUER_AUTH_CODE.length/2) + EC_ISSUER_AUTH_CODE
				+ '9F69' + string_length(QPBOC_RANDOM_DATA.length/2) + QPBOC_RANDOM_DATA
									
		send_command('00', '0303', data, '70', '00');
	}
	
	// DGI 0401
	if (level >= APP_DC_LEVEL) {
		print('\n* Terminal management data (AFL: DC)');
		
		data = '9F14' + string_length(LCOL.length/2) + LCOL
				+ '9F23' + string_length(UCOL.length/2) + UCOL
				
		send_command('00', '0401', data, '70', '00');
	}
	
	if (level >= APP_DC_LEVEL) {
		// DGI 8000
		print('\n* Symmetric key');
		
		var ENCRYPT_AC_KEY = encrypt_data(AC_KEY);
		var ENCRYPT_SI_KEY = encrypt_data(SI_KEY);
		var ENCRYPT_SM_KEY = encrypt_data(SM_KEY);
		data = ENCRYPT_AC_KEY + ENCRYPT_SI_KEY + ENCRYPT_SM_KEY;
		
		send_command('60', '8000', data, null, null);
		
		// DGI 8010
		print('\n* Offline PIN');
			
		var ENCRYPT_PIN_BLOCK = encrypt_data(PIN_BLOCK);
		data = ENCRYPT_PIN_BLOCK;
		
		send_command('60', '8010', data, null, null);
		
		// DGI 9000
		print('\n* Symmetric key checksum value');
		
		var CHECKSUM_AC_KEY = get_kcv(AC_KEY);
		var CHECKSUM_SI_KEY = get_kcv(SI_KEY);
		var CHECKSUM_SM_KEY = get_kcv(SM_KEY);
		data = CHECKSUM_AC_KEY + CHECKSUM_SI_KEY + CHECKSUM_SM_KEY;
			
		send_command('60', '9000', data, null, null);
		
		// DGI 9010
		print('\n* Pin data');
		data = PIN_TRY_COUNTER + PIN_TRY_LIMIT;
		send_command('00', '9010', data, null, '00');
		
		if (ic_key != null) {
			
			var padding = '8000000000000000';
			
			if (ic_key == CRYPTO_RSA_1984) 		padding = padding.substring(0, 8); // padding 4 bytes
		
			// DGI 8201
			print('\n* Private - Qinv');
			data = encrypt_data(ONE_DEVIDE_Q_MOD_P + padding);
			send_command('60', '8201', data, null, null);
				
			// DGI 8202
			print('\n* Private - Dq');
			data = encrypt_data(D_MOD_Q_MINUS_ONE + padding);
			send_command('60', '8202', data, null, null);
					
			// DGI 8203
			print('\n* Private - Dp');
			data = encrypt_data(D_MOD_P_MINUS_ONE + padding);
			send_command('60', '8203', data, null, null);
					
			// DGI 8204
			print('\n* Private - Q');
			data = encrypt_data(Q + padding);
			send_command('60', '8204', data, null, null);
					
			// DGI 8205
			print('\n* Private - P');
			data = encrypt_data(P + padding);
			send_command('60', '8205', data, null, null);
		}
	}
	
	if (level == APP_EXTENDED_LEVEL) {
		// DGI A001
		print('\n* CAPP Data (A001)');
		
		data = '';
		if (EXTENDED_OPENING_KEY_0X15 != null)	data += '15010000FF0400';
		if (EXTENDED_OPENING_KEY_0X16 != null)	data += '16010000FF0400';
		if (EXTENDED_OPENING_KEY_0X17 != null)	data += '17010000FF0400';
		if (EXTENDED_OPENING_KEY_0X18 != null)	data += '18010000FF0400';
		if (EXTENDED_OPENING_KEY_0X19 != null)	data += '19010000FF0400';
		if (EXTENDED_OPENING_KEY_0X1A != null)	data += '1A010000FF0400';
		if (EXTENDED_OPENING_KEY_0X1B != null)	data += '1B010000FF0400';
		if (EXTENDED_OPENING_KEY_0X1C != null)	data += '1C010000FF0400';
		if (EXTENDED_OPENING_KEY_0X1D != null)	data += '1D010000FF0400';
		if (EXTENDED_OPENING_KEY_0X1E != null)	data += '1E020000800A80';
				
		send_command('60', 'A001', data, null, null);
		
		// DGI 8020
		print('\n* The opening of the application file extension key checksum value (8020)');
		
		data = '';
		if (EXTENDED_OPENING_KEY_0X15 != null)	{
			var ENCRYPT_EXTENDED_OPENING_KEY_0X15 = encrypt_data(EXTENDED_OPENING_KEY_0X15);
			data += ENCRYPT_EXTENDED_OPENING_KEY_0X15
		}		
		if (EXTENDED_OPENING_KEY_0X16 != null)	{
			var ENCRYPT_EXTENDED_OPENING_KEY_0X16 = encrypt_data(EXTENDED_OPENING_KEY_0X16);	
			data += ENCRYPT_EXTENDED_OPENING_KEY_0X16
		}
		if (EXTENDED_OPENING_KEY_0X17 != null)	{
			var ENCRYPT_EXTENDED_OPENING_KEY_0X17 = encrypt_data(EXTENDED_OPENING_KEY_0X17);
			data += ENCRYPT_EXTENDED_OPENING_KEY_0X17
		}	
		if (EXTENDED_OPENING_KEY_0X18 != null)	{
			var ENCRYPT_EXTENDED_OPENING_KEY_0X18 = encrypt_data(EXTENDED_OPENING_KEY_0X18);	
			data += ENCRYPT_EXTENDED_OPENING_KEY_0X18
		}	
		if (EXTENDED_OPENING_KEY_0X19 != null)	{
			var ENCRYPT_EXTENDED_OPENING_KEY_0X19 = encrypt_data(EXTENDED_OPENING_KEY_0X19);	
			data += ENCRYPT_EXTENDED_OPENING_KEY_0X19
		}	
		if (EXTENDED_OPENING_KEY_0X1A != null)	{
			var ENCRYPT_EXTENDED_OPENING_KEY_0X1A = encrypt_data(EXTENDED_OPENING_KEY_0X1A);	
			data += ENCRYPT_EXTENDED_OPENING_KEY_0X1A
		}
		if (EXTENDED_OPENING_KEY_0X1B != null)	{
			var ENCRYPT_EXTENDED_OPENING_KEY_0X1B = encrypt_data(EXTENDED_OPENING_KEY_0X1B);	
			data += ENCRYPT_EXTENDED_OPENING_KEY_0X1B
		}
		if (EXTENDED_OPENING_KEY_0X1C != null)	{
			var ENCRYPT_EXTENDED_OPENING_KEY_0X1C = encrypt_data(EXTENDED_OPENING_KEY_0X1C);	
			data += ENCRYPT_EXTENDED_OPENING_KEY_0X1C
		}	
		if (EXTENDED_OPENING_KEY_0X1D != null)	{
			var ENCRYPT_EXTENDED_OPENING_KEY_0X1D = encrypt_data(EXTENDED_OPENING_KEY_0X1D);	
			data += ENCRYPT_EXTENDED_OPENING_KEY_0X1D
		}	
		if (EXTENDED_OPENING_KEY_0X1E != null)	{
			var ENCRYPT_EXTENDED_OPENING_KEY_0X1E = encrypt_data(EXTENDED_OPENING_KEY_0X1E);
			data += ENCRYPT_EXTENDED_OPENING_KEY_0X1E
		}
		
		send_command('60', '8020', data, null, null);
			
		// DGI 9020
		print('\n* The opening of the application file extension key (9020)');
		
		data = '';
		if (EXTENDED_OPENING_KEY_0X15 != null)	{
			var CHECKSUM_EXTENDED_OPENING_KEY_0X15 = get_kcv(EXTENDED_OPENING_KEY_0X15);
			data += CHECKSUM_EXTENDED_OPENING_KEY_0X15
		}		
		if (EXTENDED_OPENING_KEY_0X16 != null)	{
			var CHECKSUM_EXTENDED_OPENING_KEY_0X16 = get_kcv(EXTENDED_OPENING_KEY_0X16);	
			data += CHECKSUM_EXTENDED_OPENING_KEY_0X16
		}
		if (EXTENDED_OPENING_KEY_0X17 != null)	{
			var CHECKSUM_EXTENDED_OPENING_KEY_0X17 = get_kcv(EXTENDED_OPENING_KEY_0X17);
			data += CHECKSUM_EXTENDED_OPENING_KEY_0X17
		}	
		if (EXTENDED_OPENING_KEY_0X18 != null)	{
			var CHECKSUM_EXTENDED_OPENING_KEY_0X18 = get_kcv(EXTENDED_OPENING_KEY_0X18);	
			data += CHECKSUM_EXTENDED_OPENING_KEY_0X18
		}	
		if (EXTENDED_OPENING_KEY_0X19 != null)	{
			var CHECKSUM_EXTENDED_OPENING_KEY_0X19 = get_kcv(EXTENDED_OPENING_KEY_0X19);	
			data += CHECKSUM_EXTENDED_OPENING_KEY_0X19
		}	
		if (EXTENDED_OPENING_KEY_0X1A != null)	{
			var CHECKSUM_EXTENDED_OPENING_KEY_0X1A = get_kcv(EXTENDED_OPENING_KEY_0X1A);	
			data += CHECKSUM_EXTENDED_OPENING_KEY_0X1A
		}
		if (EXTENDED_OPENING_KEY_0X1B != null)	{
			var CHECKSUM_EXTENDED_OPENING_KEY_0X1B = get_kcv(EXTENDED_OPENING_KEY_0X1B);	
			data += CHECKSUM_EXTENDED_OPENING_KEY_0X1B
		}
		if (EXTENDED_OPENING_KEY_0X1C != null)	{
			var CHECKSUM_EXTENDED_OPENING_KEY_0X1C = get_kcv(EXTENDED_OPENING_KEY_0X1C);	
			data += CHECKSUM_EXTENDED_OPENING_KEY_0X1C
		}	
		if (EXTENDED_OPENING_KEY_0X1D != null)	{
			var CHECKSUM_EXTENDED_OPENING_KEY_0X1D = get_kcv(EXTENDED_OPENING_KEY_0X1D);	
			data += CHECKSUM_EXTENDED_OPENING_KEY_0X1D
		}	
		if (EXTENDED_OPENING_KEY_0X1E != null)	{
			var CHECKSUM_EXTENDED_OPENING_KEY_0X1E = get_kcv(EXTENDED_OPENING_KEY_0X1E);
			data += CHECKSUM_EXTENDED_OPENING_KEY_0X1E
		}
		
		send_command('60', '9020', data, null, null);
	}
	
	// DGI 0D01
	data = '9F58' + string_length(LCOL.length/2) + LCOL
			+ '9F59' + string_length(UCOL.length/2) + UCOL
			+ '9F73' + string_length(CONVERSION_FACTOR.length/2) + CONVERSION_FACTOR
			+ '9F4F' + string_length(LOG_FORMAT.length/2) + LOG_FORMAT	
	if (CUMULATIVE_TOTAL_TRANSACTION_AMOUNT_LIMIT != null)
		data += '9F54' + string_length(CUMULATIVE_TOTAL_TRANSACTION_AMOUNT_LIMIT.length/2) + CUMULATIVE_TOTAL_TRANSACTION_AMOUNT_LIMIT;
	if (CUMULATIVE_TOTAL_TRANSACTION_AMOUNT_UPPER_LIMIT != null)
		data += '9F5C' + string_length(CUMULATIVE_TOTAL_TRANSACTION_AMOUNT_UPPER_LIMIT.length/2) + CUMULATIVE_TOTAL_TRANSACTION_AMOUNT_UPPER_LIMIT;
	if (CUMULATIVE_TOTAL_TRANSACTION_AMOUNT_LIMIT_DUAL != null)
		data += '9F75' + string_length(CUMULATIVE_TOTAL_TRANSACTION_AMOUNT_LIMIT_DUAL.length/2) + CUMULATIVE_TOTAL_TRANSACTION_AMOUNT_LIMIT_DUAL
		
	if (level == APP_DC_LEVEL) {
		data += '9F53' + string_length(CONSECUTIVE_TRANSACTION_LIMIT_INTERNATIONAL_CURRENCY.length/2) + CONSECUTIVE_TRANSACTION_LIMIT_INTERNATIONAL_CURRENCY
				+ '9F72' + string_length(CONSECUTIVE_TRANSACTION_LIMIT_INTERNATIONAL_COUNTRY.length/2) + CONSECUTIVE_TRANSACTION_LIMIT_INTERNATIONAL_COUNTRY
	}
	if (level == APP_EC_LEVEL) {
		data += 'DF4F' + string_length(EC_LOG_FORMAT.length/2) + EC_LOG_FORMAT
				+ '9F77' + string_length(EC_BALANCE_LIMIT.length/2) + EC_BALANCE_LIMIT
				+ '9F78' + string_length(EC_TRANSACTION_LIMIT.length/2) + EC_TRANSACTION_LIMIT
				+ '9F79' + string_length(EC_BALANCE.length/2) + EC_BALANCE
				+ '9F6D' + string_length(EC_RESET_THRESHOLD.length/2) + EC_RESET_THRESHOLD
				+ '9F6B' + string_length(EC_CVM_LIMIT.length/2) + EC_CVM_LIMIT
				+ '9F53' + string_length(EC_CONSECUTIVE_TRANSACTION_LIMIT_INTERNATIONAL_CURRENCY.length/2) + EC_CONSECUTIVE_TRANSACTION_LIMIT_INTERNATIONAL_CURRENCY
				+ '9F72' + string_length(EC_CONSECUTIVE_TRANSACTION_LIMIT_INTERNATIONAL_COUNTRY.length/2) + EC_CONSECUTIVE_TRANSACTION_LIMIT_INTERNATIONAL_COUNTRY
	} else if (level >= APP_QPBOC_LEVEL) {
		data += 'DF4F' + string_length(EC_LOG_FORMAT.length/2) + EC_LOG_FORMAT
				+ '9F77' + string_length(QPBOC_EC_BALANCE_LIMIT.length/2) + QPBOC_EC_BALANCE_LIMIT
				+ '9F78' + string_length(QPBOC_EC_TRANSACTION_LIMIT.length/2) + QPBOC_EC_TRANSACTION_LIMIT
				+ '9F79' + string_length(QPBOC_EC_BALANCE.length/2) + QPBOC_EC_BALANCE
				+ '9F6D' + string_length(QPBOC_EC_RESET_THRESHOLD.length/2) + QPBOC_EC_RESET_THRESHOLD
				+ '9F6B' + string_length(QPBOC_CVM_LIMIT.length/2) + QPBOC_CVM_LIMIT
				+ '9F6C' + string_length(QPBOC_TRANSACTION_PROPERTY.length/2) + QPBOC_TRANSACTION_PROPERTY
				+ '9F53' + string_length(QPBOC_CONSECUTIVE_TRANSACTION_LIMIT_INTERNATIONAL_CURRENCY.length/2) + QPBOC_CONSECUTIVE_TRANSACTION_LIMIT_INTERNATIONAL_CURRENCY
				+ '9F72' + string_length(QPBOC_CONSECUTIVE_TRANSACTION_LIMIT_INTERNATIONAL_COUNTRY.length/2) + QPBOC_CONSECUTIVE_TRANSACTION_LIMIT_INTERNATIONAL_COUNTRY
				+ '9F5D' + string_length(QPBOC_AVAILABLE_OFFLINE_BALANCE.length/2) + QPBOC_AVAILABLE_OFFLINE_BALANCE
				
		if (currency == DUAL_CURRENCY || level == APP_EXTENDED_LEVEL) {
			if (img_num != 36) {
				if ( (parseInt('0x' + QPBOC_CARD_ADDITIONAL_PROCESS.substring(0,1)) % 2) == 0 )
					QPBOC_CARD_ADDITIONAL_PROCESS = '8' + QPBOC_CARD_ADDITIONAL_PROCESS.substring(1, QPBOC_CARD_ADDITIONAL_PROCESS.length);	
				else if ( (parseInt('0x' + QPBOC_CARD_ADDITIONAL_PROCESS.substring(0,1)) % 2) == 1 )
					QPBOC_CARD_ADDITIONAL_PROCESS = '9' + QPBOC_CARD_ADDITIONAL_PROCESS.substring(1, QPBOC_CARD_ADDITIONAL_PROCESS.length);
			}
		}	
		
		data += '9F68' + string_length(QPBOC_CARD_ADDITIONAL_PROCESS.length/2) + QPBOC_CARD_ADDITIONAL_PROCESS;
	}

	print('\n* Internal risk management data in card(0D01)');
	send_command('00', '0D01', data, null, '00');
	
	// DGI 0E01
	data = '9F51' + string_length(APP_CURRENCY_CODE.length/2) + APP_CURRENCY_CODE
			+ '9F52' + string_length(ADA.length/2) + ADA
			+ '9F56' + string_length(ISSUER_AUTH_INDICATOR.length/2) + ISSUER_AUTH_INDICATOR
			+ '9F57' + string_length(ISSUER_COUNTRY_CODE.length/2) + ISSUER_COUNTRY_CODE
			+ '9F36'+ string_length(ATC.length/2) + ATC
			+ '9F13'+ string_length(LAST_ONLINE_ATC.length/2) + LAST_ONLINE_ATC
			+ '5F34'+ string_length(PAN_SEQUENCE_NUMBER.length/2) + PAN_SEQUENCE_NUMBER
			+ '9F76' + string_length(SECOND_APP_CURRENCY_CODE.length/2) + SECOND_APP_CURRENCY_CODE
	
	if (currency == DUAL_CURRENCY && level != APP_EXTENDED_LEVEL) {
		if (level == APP_EC_LEVEL) {
			data += 'DF71'+ string_length(EC_SECOND_CURRENCY_CODE.length/2) + EC_SECOND_CURRENCY_CODE
					+ 'DF79'+ string_length(EC_SECOND_BALANCE.length/2) + EC_SECOND_BALANCE
					+ 'DF77'+ string_length(EC_SECOND_BALANCE_LIMIT.length/2) + EC_SECOND_BALANCE_LIMIT
					+ 'DF78'+ string_length(EC_SECOND_TRANSACTION_LIMIT.length/2) + EC_SECOND_TRANSACTION_LIMIT
					+ 'DF76'+ string_length(EC_SECOND_RESET_THRESHOLD.length/2) + EC_SECOND_RESET_THRESHOLD
		} else if (level >= APP_QPBOC_LEVEL) {
			data += 'DF71'+ string_length(QPBOC_EC_SECOND_CURRENCY_CODE.length/2) + QPBOC_EC_SECOND_CURRENCY_CODE
					+ 'DF79'+ string_length(QPBOC_EC_SECOND_BALANCE.length/2) + QPBOC_EC_SECOND_BALANCE
					+ 'DF77'+ string_length(QPBOC_EC_SECOND_BALANCE_LIMIT.length/2) + QPBOC_EC_SECOND_BALANCE_LIMIT
					+ 'DF78'+ string_length(QPBOC_EC_SECOND_TRANSACTION_LIMIT.length/2) + QPBOC_EC_SECOND_TRANSACTION_LIMIT
					+ 'DF76'+ string_length(QPBOC_EC_SECOND_RESET_THRESHOLD.length/2) + QPBOC_EC_SECOND_RESET_THRESHOLD
					+ 'DF72'+ string_length(QPBOC_EC_SECOND_CVM_LIMIT.length/2) + QPBOC_EC_SECOND_CVM_LIMIT
		} 
	}
	
	if (level == APP_EXTENDED_LEVEL) {
		if (EXTENDED_STEP_BY_STEP_REDUCTION_LIMIT != null)
			data += 'DF62' + string_length(EXTENDED_STEP_BY_STEP_REDUCTION_LIMIT.length/2) + EXTENDED_STEP_BY_STEP_REDUCTION_LIMIT;
		if (EXTENDED_STEP_BY_STEP_REDUCTION_AMOUT != null)
			data += 'DF63' + string_length(EXTENDED_STEP_BY_STEP_REDUCTION_AMOUT.length/2) + EXTENDED_STEP_BY_STEP_REDUCTION_AMOUT;
	}
	
	print('\n* Internal risk management data in card(0E01)');
	send_command('00', '0E01', data, null, '00');
	
	// DGI 9102
	if (PDOL_CT == null) {
		if (level == APP_DC_LEVEL)		PDOL_CT = _DC_PDOL_CT;
		else if (level >= APP_EC_LEVEL)	PDOL_CT = _EC_PDOL_CT;
	}
	
	print('\n* CT - Select the application response data');
		
	data = '50' + string_length(APP_LABEL.length/2) + APP_LABEL 
			+ '87' + string_length(APP_PRIORITY_INDICATOR.length/2) + APP_PRIORITY_INDICATOR
			+ '5F2D' + string_length(LAUNGUAGE_PREFERENCE.length/2) + LAUNGUAGE_PREFERENCE
			+ '9F11' + string_length(ISSUER_CODE_TABLE_INDEX.length/2) + ISSUER_CODE_TABLE_INDEX
			+ '9F12' + string_length(APP_PREFERRED_NAME.length/2) + APP_PREFERRED_NAME
			+ '9F38' + string_length(PDOL_CT.length/2) + PDOL_CT
			
	var FCI_IDD_DATA = '9F4D' + string_length(LOG_ENTRY.length/2) + LOG_ENTRY 
	if (level >= APP_EC_LEVEL)
		FCI_IDD_DATA += 'DF4D' + string_length(EC_LOG_ENTRY.length/2) + EC_LOG_ENTRY;
	var FCI_IDD = 'BF0C' + string_length(FCI_IDD_DATA.length/2) + FCI_IDD_DATA;
	data += FCI_IDD;
	data = 'A5' + String(toHex(data.length/2)) + data;
					
	send_command('00', '9102', data, null, '00');
	
	// DGI 9103		
	if (PDOL_CL == null) {
		if (level == APP_DC_LEVEL)			PDOL_CL = _DC_PDOL_CL;
		else if (level == APP_EC_LEVEL)		PDOL_CL = _EC_PDOL_CL;
		else if (level == APP_QPBOC_LEVEL)	PDOL_CL = _QPBOC_PDOL_CL;
	}
	if (level == APP_EXTENDED_LEVEL) {
		if (cvn == CVN_01)			PDOL_CL = _EXTENDED_PDOL_CVN01;
		else if (cvn == CVN_17)		PDOL_CL = _EXTENDED_PDOL_CVN17;
	}
	
	print('\n* CL - Select the application response data');
		
	data = '50' + string_length(APP_LABEL.length/2) + APP_LABEL 
			+ '87' + string_length(APP_PRIORITY_INDICATOR.length/2) + APP_PRIORITY_INDICATOR
			+ '5F2D' + string_length(LAUNGUAGE_PREFERENCE.length/2) + LAUNGUAGE_PREFERENCE
			+ '9F11' + string_length(ISSUER_CODE_TABLE_INDEX.length/2) + ISSUER_CODE_TABLE_INDEX
			+ '9F12' + string_length(APP_PREFERRED_NAME.length/2) + APP_PREFERRED_NAME
			+ '9F38' + string_length(PDOL_CL.length/2) + PDOL_CL
			
	var FCI_IDD_DATA = '9F4D' + string_length(LOG_ENTRY.length/2) + LOG_ENTRY
	
	if (level >= APP_EC_LEVEL)
		FCI_IDD_DATA += 'DF4D' + string_length(EC_LOG_ENTRY.length/2) + EC_LOG_ENTRY;
	if (level == APP_EXTENDED_LEVEL) 
		FCI_IDD_DATA += 'DF61' + string_length(EXTENDED_SEGMENTATION_REDUCTION_APP_ID.length/2) + EXTENDED_SEGMENTATION_REDUCTION_APP_ID;
		
	var FCI_IDD = 'BF0C' + string_length(FCI_IDD_DATA.length/2) + FCI_IDD_DATA;
	data += FCI_IDD;
	data = 'A5' + String(toHex(data.length/2)) + data;
					
	send_command('00', '9103', data, null, '00');	
	
	// DGI 9200
	print('\n* Issuer application data');
	
	if (level == APP_DC_LEVEL)
		data = '9F10' + string_length(ISSUER_APP_DATA.length/2) + ISSUER_APP_DATA;		
	else if (level >= APP_EC_LEVEL)
		data = '9F10' + string_length(EC_ISSUER_APP_DATA.length/2) + EC_ISSUER_APP_DATA;		
		
	send_command('80', '9200', data, null, '00');
}

function string_length(len) {
	var result;
	if (len >= 128)
		result = '81' + String(toHex(len));
	else
		result = String(toHex(len));
	return result;
}

function send_command(P1, DGI, data, templet, le) {
	var command;
	
	// check data length(1984 bits)
	if (data.length >= 496) { 
		command = '80E2' + P1 + String(toHex(sequence)) + 'C8' + DGI;
		
		if (templet == null) {
			command += String(toHex(data.length/2))
					+ data.substring(0, 388);
		} else {
			if (data.length/2 >= 128) {
				command += String(toHex(data.length/2 + 3)) // '81' + length
						+ '70' 
						+ string_length(data.length/2)
						+ data.substring(0, 388);
			} else {
				command += String(toHex(data.length/2 + 2))
						+ '70' 
						+ string_length(data.length/2)
						+ data.substring(0, 388);
			}
		}
		
		if (le != null)
		command += le;
		
		send(command);
		assertSW('9000');
	
		sequence = sequence + 1;
		
		//////////////////////////////////////////////////////////////////
		command = '80E2' + P1 + String(toHex(sequence)) 
					+ string_length(data.substring(388, data.length).length/2) 
					+ data.substring(388, data.length)
		
		if (le != null)
		command += le;
		
		send(command);
		assertSW('9000');
	
		sequence = sequence + 1;
		
		return;
	}
	
	//////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////
	
	command = '80E2' + P1;
	
	if (templet == null) {
		command += String(toHex(sequence))
				+ String(toHex(data.length/2 + 3))
				+ DGI 
				+ String(toHex(data.length/2))
				+ data;
	} else {
		if (data.length/2 >= 128) {
			command += String(toHex(sequence))
					+ String(toHex(data.length/2 + 6))
					+ DGI 
					+ String(toHex(data.length/2 + 3)) // '81' + length
					+ '70' 
					+ string_length(data.length/2)
					+ data;
		} else {
			command += String(toHex(sequence))
					+ String(toHex(data.length/2 + 5))
					+ DGI 
					+ String(toHex(data.length/2 + 2))
					+ '70' 
					+ string_length(data.length/2)
					+ data;
		}
	}
	
	if (le != null)
		command += le;
		
	send(command);
	assertSW('9000');
	
	sequence = sequence + 1;
}
