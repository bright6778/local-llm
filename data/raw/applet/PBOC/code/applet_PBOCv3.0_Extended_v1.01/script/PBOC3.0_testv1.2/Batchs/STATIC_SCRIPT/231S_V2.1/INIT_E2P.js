/*
 * KONA231 v2.1(PBOC) script
 *
 * 					start date 		: 2012.05.09
 * 					revised date	: 
 * 					author by bgkim
 *
 * Description : make a blank card
 */



c = new ShellScript();

c.print("--------------카드 초기화 !!----------------");

c.reset();
c.include('INIT_E2P_lib.js');
patch_auth(0);

patch_load('080100', '70');

reset();
delayMilliSec(2000);
select('a0000000030000');