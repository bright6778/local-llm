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
img_num = 43;
app_level = APP_QPBOC_LEVEL;
currency = SINGLE_CURRENCY;		
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
QPBOC_CARD_ADDITIONAL_PROCESS = '8D003000';
PDOL_CL = '9F66049F02069F03069F1A0295055F2A029A039C019F3704';
issuer_key = CRYPTO_RSA_1024;
ic_key = CRYPTO_RSA_1024;

init_crypto();
init_image(DUAL);
store_data(app_level, currency);

print('\n*****************************************************');
print('* Perso Start - Image ' + img_num + ' & ' + app_level_string + ' & ' + currency);
print('*****************************************************');