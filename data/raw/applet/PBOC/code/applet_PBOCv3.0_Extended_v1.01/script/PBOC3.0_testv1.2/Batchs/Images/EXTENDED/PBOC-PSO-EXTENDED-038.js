include("..//_COMMON//_IMAGE_COMMON.js");



///////////////////////////////////////////////
//											///
// 1. The number of image					///
//											///
// 2. DC, EC, qPBOC or Extended				///
//	  (APP_DC_LEVEL, APP_EC_LEVEL,			///
//	   APP_qPBOC_LEVEL, APP_EXTENDED_LEVEL)	///
//											///
// 3. Single Currncy or Dual Currency		///
//	  (SINGLE_CURRENCY or DUAL_CURRENCY)	///
//											///
///////////////////////////////////////////////
var img_num = 38;
var app_level = APP_EXTENDED_LEVEL;
var currency = SINGLE_CURRENCY;		
///////////////////////////////////////////////
///////////////////////////////////////////////

var app_level_string; 
if (app_level == 1) app_level_string = 'DC'
else if (app_level == 2) app_level_string = 'EC'
else if (app_level == 3) app_level_string = 'qPBOC'
else if (app_level == 4) app_level_string = 'EXTENDED'

print('\n*****************************************************');
print('* Perso Start - Image ' + img_num + ' & ' + app_level_string + ' & ' + currency);
print('*****************************************************');

AIP_QPBOC = '7000';
QPBOC_CARD_ADDITIONAL_PROCESS = '81003000';
PIN_TRY_COUNTER = '00';
cvn = CVN_17;
PDOL_CL = '9F66049F02069F37045F2A02'
issuer_key = CRYPTO_RSA_1152;
ic_key = CRYPTO_RSA_1152;

// multi instance test
/*
if (img_num == 27) { 
	// instance 1
	select_image(img_num);
	init_image(DUAL);
	store_data(app_level, currency);
	
	// instance 2
	select_image(img_num);
	init_image(DUAL);
	store_data(app_level, currency);
	
} else if (img_num == 39) {
	select_image(img_num);
	init_image(DUAL);
	store_data(app_level, currency);
	
	select(PBOC_APP_ID);
	send('0020000000');
	send('0020000000');
	send('0020000000');	
} else { 
	select_image(img_num);
	*/
	init_crypto();
	init_image(DUAL);
	store_data(app_level, currency);
//}

print('\n*****************************************************');
print('* Perso Start - Image ' + img_num + ' & ' + app_level_string + ' & ' + currency);
print('*****************************************************');