



//var BlockingPBOC_capFilePath = 'C:\\eclipse_2.1.3\\workspace\\applet_BlockingPBOC\\bin\\com\\kebt\\BlockingPBOC\\javacard\\BlockingPBOC.cap';
//var PBOC_capFilePath = 'C:\\eclipse_2.1.3\\workspace\\applet_PBOC\\bin\\com\\kebt\\PBOC\\javacard\\PBOC.cap';
//var PSE_capFilePath = 'C:\\eclipse_2.1.3\\workspace\\applet_PBOC_PSE\\bin\\com\\kebt\\PSE\\javacard\\PSE.cap';
//var DC_MF_capFilePath = 'C:\\eclipse_2.1.3\\workspace\\applet_PBOC_DC_MF\\bin\\com\\kebt\\MF\\javacard\\MF.cap';

//var BlockingPBOC_capFilePath = 'D:\\greatk9322\\eclipse_2.1.3\\workspace\\applet_BlockingPBOC\\bin\\com\\kebt\\BlockingPBOC\\javacard\\BlockingPBOC.cap';
var PBOC_capFilePath = 'PBOC.cap';
var isRemoveInstance;
isRemoveInstance=true;
var  pboc_aid = 'A0000003330101';
var IPK_Certificate = 
		'229103A5E3120F2D2862091176AA2BD4'+
		'E24D69E7EEF7B9195C91EA0088AECFF4'+
		'7EDFA0BEEF7C391DF3B05F717DCC06FF'+
		'C8EEFF90BA14212B8A52AD48B33277B2'+
		'E230D40B3E76DC59778926F1D8739E10'+
		'6CD741DE06A7423DFBA25E02F12E543D'+
		'13D1B471806526024981B7D26B4BF6E5'+
		'558604CCC289F59E8A802F45FB3D9E67';

var SAD ='817B58E992D032B7F0C0B5E0AA146F53FDD20DE1B3BFD9BFD28D0D7B5D4B69A62E1442847EC0FCED37C41A653AC8AEFF680704607E7D6EDBB683FDF8AE3CBA63FD2FB93845D9DA06F5B6CC09E807A0B69D5CF6FAFFDEC65A3E00C560947E4822FD74D0A4994493C9D5E92F83634C1EE77BC805F838A9A79E114787B65F6B74B9';


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
	print('\n* Delete packages');
	send('80E4008007 4F05FFEEDDCCBB');    //delete MF
	send('80E40080074F05315041592E00');
	send('80E40080084F06A0000003330100');
	send('80E40080074F05554433221100');
	
	//load applet
	
	print('\n* Load PBOC');
	loadCAP(PBOC_capFilePath);
}
    // load MF


//print('////////////////////////////////////////////');
//print(' C91C에 실인증 보내기 위한 추가 코드          ');
//print(' EEPROM size를 C91A에 맞게 수정한다.         ');
//print('////////////////////////////////////////////');
//include("[1C v1.0] eep_patch_lib.js");
//
//reset();
//eep_patch_auth();
//
//eep_patch_write('080E5B','081590'+'006A50');
//
////select ISD
//reset();
//select('a0000000030000');
//auth();
//print('////////////////////////////////////////');

// 에플릿 크기 측정용
//pause();

//print('\n* Install MF');
///send('80E60C001B 05FFEEDDCCBB 06FFEEDDCCBBAA 07FFEEDDCCBBAA01 011402C90000');

//print('\n* Install PBOC');
//send('80E60C001E 06A00000033301 07A0000003330101 08A000000333010101 011002C9000000');
//assertSW('9000');

print('\n* Install PBOC');
//send('80E60C001D 06A00000033301 07A0000003330101 07A0000003330101 011002C9000000');
//send('80E60C0022 06A00000033301 07A0000003330101 07A0000003330101 0110 07 C9050000400000 0000');
send('80E60C0022 06A00000033301 07A0000003330101 07A0000003330101 0110 07 C905 2802 000000 0000');
assertSW('9000');

print('\n* Select PBOC');
select('A0000003330101');

print('\n* External Authenticate and Initialize Update');
auth();
