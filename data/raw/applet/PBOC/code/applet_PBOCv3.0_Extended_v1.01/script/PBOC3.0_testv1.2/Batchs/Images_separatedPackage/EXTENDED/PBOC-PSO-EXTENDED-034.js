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
img_num = 34;
app_level = APP_EXTENDED_LEVEL;
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
QPBOC_CARD_ADDITIONAL_PROCESS = '2100F000';
CUMULATIVE_TOTAL_TRANSACTION_AMOUNT_LIMIT = '000000005000';
CUMULATIVE_TOTAL_TRANSACTION_AMOUNT_UPPER_LIMIT = '000000010200';
cvn = CVN_01;
issuer_key = CRYPTO_RSA_1024;
ic_key = CRYPTO_RSA_1024;

init_crypto();
init_image(DUAL);
store_data(app_level, currency);

print('\n*****************************************************');
print('* Perso Start - Image ' + img_num + ' & ' + app_level_string + ' & ' + currency);
print('*****************************************************');