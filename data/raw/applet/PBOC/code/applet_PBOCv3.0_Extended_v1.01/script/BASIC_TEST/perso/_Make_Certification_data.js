var ISSUER_PK_CERT_FORMAT = '02';
var ICC_PK_CERT_FORMAT = '04';
var RECOVERED_DATA_HEADER = '6A';
var RECOVERED_DATA_TRAILDER = 'BC';
//tag 9F47
var ICC_EXPONENT                = 'ICC_EXPONENT';                  
//TAG 92                                                        
var ISSUER_PUBLIC_KEY_REMAINDER = 'ISSUER_PUBLIC_KEY_REMAINDER';   
//TAG 9F32                                                      
var ISSUER_EXPONENT             = 'ISSUER_EXPONENT';          
//TAG 93                                                        
var SAD_9104                    = 'SAD_9104';                    
var SAD_9203                    = 'SAD_9203';                    
var SAD_9207                    = 'SAD_9207';                                                                               
//TAG 90                                                        
var ISSUER_CERT            			= 'ISSUER_CERT';               
//TAG 9F48                                                      
var ICC_PUBLIC_KEY_REMAINDER    = 'ICC_PUBLIC_KEY_REMAINDER';                                                                   
//TAG 9F46                                                      
var ICC_CERT_9104               = 'ICC_CERT_9104';               
var ICC_CERT_9203               = 'ICC_CERT_9203';               
var ICC_CERT_9207               = 'ICC_CERT_9207';    

var static_data = new Array();
var result = new Array(); 
var afl_value = new Array(); 
var DGI = new Array(); 
DGI[0] = '9104';//GPO Response Data for Contact
DGI[1] = '9203';//GPO Response Data (Low-value Payment Path)
DGI[2] = '9207';//GPO Response Data for Contactless
