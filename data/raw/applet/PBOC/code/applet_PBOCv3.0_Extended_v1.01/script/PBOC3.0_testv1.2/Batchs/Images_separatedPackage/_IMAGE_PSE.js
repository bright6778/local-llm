 var isd_aid = 'A0'; 
 var pse_aid = '315041592E5359532E4444463031';
 
 var pse_package_aid = '315041592E';
var pse_instance_aid = '315041592E5359532E4444463031';

        

reset();
set_var('scp02');
select(isd_aid);
auth();

print('\n* delete PSE');
send('80E4000010 4F0E315041592E5359532E444446303100');

// Installation using the PSE Applet

var cdata = toHex(pse_package_aid.length/ 2) + pse_package_aid+
              toHex(pse_instance_aid.length/ 2) + pse_instance_aid+
              toHex(pse_aid.length/ 2) + pse_aid+
              '0100'+ 
              '02C900'+ 
              '00';
              
print('\n* Install PSE');
send('80E60C00'+ toHex(cdata.length/ 2) + cdata);


print('\n* Select PSE');
select(pse_aid);

print('\n* External Authenticate and Initialize Update');
auth();

print('\n* Data Elements Stored in Records');
// SFI 1 Record 1
send('80E200004D 0101 4A'+
            '70 48'+
               '61 16'+
                  '4F 07 A0000003330101'+ /* Application Identifier AID */			
                  '50 0B 50424F4320437265646974'+ /* Application Label */		
               '61 16'+
                  '4F 07 A0000003330102'+ /* Application Identifier AID */			
                  '50 0B 50424F4320437265646974'+ /* Application Label */		
               '61 16'+
                  '4F 07 A0000003330103'+ /* Application Identifier AID */			
                  '50 0B 50424F4320437265646974'+ /* Application Label */		
                  '00');
                  
                  
// SFI 1 Record 1
/*send('80E200001E 0101 1B'+
            '70 19'+
               '61 17'+
                  '4F 08 A0000003330101'+ /* Application Identifier AID */			
                  '50 0B 50424F4320437265646974'+ /* Application Label */		
       /*           '00');*/

/* Besides, Directory Discretionary Template (tag '73') can be 
 * contained in DGI '0101'. */

print('\n* Data Elements Not Stored in Records');
// DGI ¡®9102¡¯
send('80E2800108 9102 05'+
              'A5 03'+ /* FCI Proprietary Template */
                '88 01 01'+ /* SFI of the directory elementary file */
                '00'); 
/* Besides, FCI Issuer Discretionary Data (tag 'BF0C') can be 
 * contained in DGI '9102'. */  
