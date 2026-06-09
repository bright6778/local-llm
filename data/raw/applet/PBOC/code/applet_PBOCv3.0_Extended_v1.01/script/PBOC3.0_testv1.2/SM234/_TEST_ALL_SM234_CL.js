var support_JAVA = true;
// qPBOC Native
include('perso_qPBOC_035_SM_Native.js');
include('test_transaction_qPBOC_offline_fDDA00.js');
include('test_transaction_qPBOC_offline_fDDA01.js');
include('test_transaction_qPBOC_offline_fDDA01_SM.js');

// qPBOC JAVA
if(support_JAVA){
include('perso_qPBOC_035_SM_JAVA.js');
include('test_transaction_qPBOC_offline_fDDA00.js');
include('test_transaction_qPBOC_offline_fDDA01.js');
include('test_transaction_qPBOC_offline_fDDA01_SM.js');
}

// qPBOC Extended Native
include('perso_qPBOC_Extedned_046_SM_Native.js');
include('test_qPBOC_Extended_Speed_SM.js');


// qPBOC Extended Native
if(support_JAVA){
include('perso_qPBOC_Extedned_046_SM_JAVA.js');
include('test_qPBOC_Extended_Speed_SM.js');
}
