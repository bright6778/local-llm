if (interfaceToggle)
	include("_IMAGE_COMMON_VSDC.js");
else  
	include("_IMAGE_COMMON_VCPS.js");

function perso_process(num, level, currency) {

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
	var img_num = num;
	var app_level = level;
	var currency = currency;		
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
	
	// multi instance test
	if (img_num == 24) { 
		// instance 1
		select_image(img_num);
		init_image(DUAL);
		store_data(app_level, currency);
			
		// instance 2
		select_image(img_num);
		init_image(DUAL);
		store_data(app_level, currency);
	} else if (img_num == 0) {
		select_image(img_num);
		init_image(null);
		store_data(app_level, currency);
	} else {
		select_image(img_num);
		init_image(DUAL);
		store_data(app_level, currency);
	}
	
	print('\n*****************************************************');
	print('* Perso End - Image ' + img_num + ' & ' + app_level_string + ' & ' + currency);
	print('*****************************************************');
}