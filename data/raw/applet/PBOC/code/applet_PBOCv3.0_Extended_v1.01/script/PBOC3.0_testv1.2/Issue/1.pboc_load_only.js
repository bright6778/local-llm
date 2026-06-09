



//var BlockingPBOC_capFilePath = 'C:\\eclipse_2.1.3\\workspace\\applet_BlockingPBOC\\bin\\com\\kebt\\BlockingPBOC\\javacard\\BlockingPBOC.cap';
//var PBOC_capFilePath = 'C:\\eclipse_2.1.3\\workspace\\applet_PBOC\\bin\\com\\kebt\\PBOC\\javacard\\PBOC.cap';
//var PSE_capFilePath = 'C:\\eclipse_2.1.3\\workspace\\applet_PBOC_PSE\\bin\\com\\kebt\\PSE\\javacard\\PSE.cap';
//var DC_MF_capFilePath = 'C:\\eclipse_2.1.3\\workspace\\applet_PBOC_DC_MF\\bin\\com\\kebt\\MF\\javacard\\MF.cap';

//var BlockingPBOC_capFilePath = 'D:\\greatk9322\\eclipse_2.1.3\\workspace\\applet_BlockingPBOC\\bin\\com\\kebt\\BlockingPBOC\\javacard\\BlockingPBOC.cap';
var PBOC_capFilePath = 'PBOC_DC_v2.23.cap';
var isRemoveInstance;
isRemoveInstance=false;


//select ISD
reset();
select('a0000000030000');
auth();

if(isRemoveInstance){
	
	//remove instance
	send('80E40000094F07A000000333010100');
	send('80E40000094F07A000000333010200');
	send('80E40000104F0E315041592E535953 2E444446303100');
	send('80E40000104F0E325041592E535953 2E444446303100');
	
}else{

	//delete package

	send('80E40080084F06A0000003330100');
	
	
	//load applet
	
	print('\n* Load PBOC');
	loadCAP(PBOC_capFilePath);
}
  