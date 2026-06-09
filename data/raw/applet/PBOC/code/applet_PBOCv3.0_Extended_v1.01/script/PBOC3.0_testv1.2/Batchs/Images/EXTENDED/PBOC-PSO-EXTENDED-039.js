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
img_num = 39;
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
QPBOC_CARD_ADDITIONAL_PROCESS = '2C00F000';
ATC = 'FFE0';
PIN_TRY_COUNTER = '00';
CUMULATIVE_TOTAL_TRANSACTION_AMOUNT_LIMIT = '000000005000';
issuer_key = CRYPTO_RSA_1408;
ic_key = CRYPTO_RSA_1280;

init_crypto();
init_image(DUAL);
store_data(app_level, currency);
	
select(PBOC_APP_ID);
send('0020000000');
send('0020000000');
send('0020000000');	

print('\n*****************************************************');
print('* Perso Start - Image ' + img_num + ' & ' + app_level_string + ' & ' + currency);
print('*****************************************************');