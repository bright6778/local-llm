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
img_num = 47;
app_level = APP_EXTENDED_LEVEL;
currency = DUAL_CURRENCY;		
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
QPBOC_CARD_ADDITIONAL_PROCESS = '81100000';
EC_BALANCE = '000000100000';
EC_BALANCE_LIMIT = '000000500000';
EC_TRANSACTION_LIMIT = '000000100000';
EC_RESET_THRESHOLD = '000000000000';
QPBOC_EC_BALANCE = EC_BALANCE;
QPBOC_EC_BALANCE_LIMIT = EC_BALANCE_LIMIT;
QPBOC_EC_TRANSACTION_LIMIT = EC_TRANSACTION_LIMIT;
QPBOC_EC_RESET_THRESHOLD = EC_RESET_THRESHOLD;
QPBOC_TRANSACTION_PROPERTY = '0000';
QPBOC_CVM_LIMIT = '000000100000';
QPBOC_EC_SECOND_CVM_LIMIT = QPBOC_CVM_LIMIT;
QPBOC_EC_SECOND_BALANCE = EC_BALANCE;
QPBOC_EC_SECOND_BALANCE_LIMIT = EC_BALANCE_LIMIT;
QPBOC_EC_SECOND_TRANSACTION_LIMIT = EC_TRANSACTION_LIMIT;
QPBOC_EC_SECOND_RESET_THRESHOLD = EC_RESET_THRESHOLD;
QPBOC_CONSECUTIVE_TRANSACTION_LIMIT_INTERNATIONAL_CURRENCY = '00';
QPBOC_AVAILABLE_OFFLINE_BALANCE = '000000000001';
EXTENDED_OPENING_KEY_0X15 = '15A912A5F029C6001DF2539A00137049';
EXTENDED_OPENING_KEY_0X16 = '167312850029B6001DC2539A0013E049';
EXTENDED_OPENING_KEY_0X17 = '191A5F026001DF259A03019C37049F11';
EXTENDED_STEP_BY_STEP_REDUCTION_LIMIT = '000000100000'; 
EXTENDED_STEP_BY_STEP_REDUCTION_AMOUT = '000000000000';
EXTENDED_STEP_BY_STEP_REDUCTION_LIMIT_SA = EXTENDED_STEP_BY_STEP_REDUCTION_LIMIT; 
EXTENDED_STEP_BY_STEP_REDUCTION_AMOUT_SA = EXTENDED_STEP_BY_STEP_REDUCTION_AMOUT;
issuer_key = CRYPTO_RSA_1024;
ic_key = CRYPTO_RSA_1024;

init_crypto();
init_image(DUAL);
store_data(app_level, currency);

print('\n*****************************************************');
print('* Perso Start - Image ' + img_num + ' & ' + app_level_string + ' & ' + currency);
print('*****************************************************');