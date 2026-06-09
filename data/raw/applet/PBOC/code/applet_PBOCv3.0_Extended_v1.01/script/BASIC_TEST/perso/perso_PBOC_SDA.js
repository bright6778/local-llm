include('pboc_reset.js');

var seq = 0;
// DGI 9104 : GPO Response Data for Contact
data = TLV("82",   "5C00") // Application Interchange Profile
	 + TLV("94",   "08010100 10010400 18010101 20010100"); // Application File Locator
store("00", "9104", data);

// DGI 0101
data = TLV("70",   
		   TLV("57",   "6228000100001117D30122010123456789") // Track 2 Equivalent Data
		 + TLV("9F1F", "30313032303330343035303630373038303930413042") // Track 1 Discretionary Data
		 + TLV("5F20", "46554C4C2046554E4354494F4E414C") // Cardholder Name
		 + TLV("9F63", "11223344556677880000000000000000") // Offline Counter Initial Value
		);
store("00", "0101", data);

// DGI 0201
data = TLV("70",   
		   TLV("8E",   "0000000000000000410342035E0343031F00") // CVM List
		 + TLV("9F0D", "F020040000") // Issuer Action Code - Default
		 + TLV("9F0E", "0050880000") // Issuer Action Code - Denial
		 + TLV("9F0F", "F020049800") // Issuer Action Code - Online
		 + TLV("5F34", "01") // PAN Sequence Number
		);
store("00", "0201", data);

// DGI 0202
data = TLV("70",   
		   TLV("5F30", "0201") // Service Code
		 + TLV("9F07", "FFC0") // Application Usage Controle
		 + TLV("9F08", "0030") // Application Version Number
		 + TLV("9F42", "0156") // Application Currency Code
		 + TLV("5F28", "0156") // Issuer Country Code
		 + TLV("8C",   "9F02069F03069F1A0295055F2A029A039F21039C019F3704") // CDOL1
		 + TLV("8D",   "8A029F02069F03069F1A0295055F2A029A039F21039C019F3704") // CDOL2
		);
store("00", "0202", data);

// DGI 0203
data = TLV("70",   
		   TLV("90",   "229103A5E3120F2D2862091176AA2BD4E24D69E7EEF7B9195C91EA0088AECFF47EDFA0BEEF7C391DF3B05F717DCC06FFC8EEFF90BA14212B8A52AD48B33277B2E230D40B3E76DC59778926F1D8739E106CD741DE06A7423DFBA25E02F12E543D13D1B471806526024981B7D26B4BF6E5558604CCC289F59E8A802F45FB3D9E67") // Issuer Public Key Certificate
		 + TLV("8F",   "80") // Certification Authority Public Key Index
		 + TLV("9F32", "03") // Issuer Public Key Exponent
		 + TLV("92",   "8B643D1EAF2EA784AC205303C90E745EA2EFA5CBF02CC47D47833BB7B27ECC6962385A4B") // Issuer Public Key Remainder
		);
store("00", "0203", data);


// DGI 0205
data = TLV("70",   
		   TLV("93",   "04520EAA68D912ED24DA2A000B0837E51FB76E53A7715C20AFFE8FE1ED2D6D6B5E82BDC27A3031EEB42A768F30AD68C33CB40F8AF1716D49507C764A2215F6CE0B36D0E4B1FACFF912610E8C876AA0AF8464A733A3C854608FF46E22CD5F21DB1E8E831DB19D959ACF2225CBB71A8D63A0F9E4CB1E6B18E9EE43B437DE405289") // Signed Static Application Data
		);
store("00", "0204", data);

// DGI 0301
data = TLV("70",   
		   TLV("5A",   "6228000100001117") // Application Primary Account Number
		 + TLV("5F24", "301231") // Application Expiration Date
		 + TLV("5F25", "950701") // Application Effective Date
		 + TLV("9F08", "0030") // Application Version Number
		);
store("00", "0301", data);

// DGI 0401
data = TLV("70",   
		   TLV("9F14", "03") // Lower Consecutive Offline Limit
		 + TLV("9F23", "07") // Upper Consecutive Offline Limit
		);
store("00", "0401", data);

// DGI 8000 : DES key(s)
data = "112233440066778811223344550077888B4F854F0831FBF2635A212E4DDDB92A11220044556677881122330055667788";
store("60", "8000", data);

// DGI 8010 : Offline PIN Block
data = "241234FFFFFFFFFF";
store("60", "8010", data);

// DGI 9000 : DES key check values
data = "97DCB0CE4E2CB37DF3";
store("60", "9000", data);

// DGI 9010 : PIN Related Data
data = "0303";
store("00", "9010", data);


// DGI 0D01
data = TLV("9F58", "03") // Consecutive Transaction Counter Limit (CTCL)
	 + TLV("9F59", "07") // Consecutive Transaction Counter Upper Limit (CTCUL)
	 + TLV("9F73", "20000175") // Currency Conversion Parameters
	 + TLV("9F4F", "9A039F21039F02069F03069F1A025F2A029F4E149C019F3602") // Log Format
	 + TLV("9F75", "000000010000") // CTTA Limit (Dual Currency)
	 + TLV("9F53", "05") // Consecutive Transaction Counter International Limit (CTCIL)
	 + TLV("9F72", "00"); // Consecutive Transaction Counter International Country Limit (CTCICL)
store("00", "0D01", data);

// DGI 0E01
data = TLV("9F51", "0156") // Application Currency Code
	 + TLV("9F52", "8240") // Application Default Action (ADA)
	 + TLV("9F56", "80") // Issuer Authentication Indicator
	 + TLV("9F57", "0156") // Issuer Country Code
	 + TLV("9F36", "0000")
	 + TLV("9F13", "0000")
	 + TLV("5F34", "01") // PAN Sequence Number
	 + TLV("9F76", "0000");
store("00", "0E01", data);

// DGI 9102 : SELECT Response (Common)
data = TLV("A5",   
		   TLV("50",   "50424F4320437265646974") // Application Label
		 + TLV("87",   "01") // Application Priority Indicator
		 + TLV("5F2D", "7A68656E66726465") // Laguage Preference
		 + TLV("9F11", "01") // Issuer Code Table Index
		 + TLV("9F12", "4341524420494D4147452030303031")
		 + TLV("9F38", "9F33039F4E14") // PDOL
		 + TLV("BF0C",  // FCI Issuer Discretionary Data
			   TLV("9F4D", "0B0A") // Log Entry
			)
		);
store("00", "9102", data);

// DGI 9103 : SELECT Response (Contactless)
data = TLV("A5",   
		   TLV("50",   "50424F4320437265646974") // Application Label
		 + TLV("87",   "01") // Application Priority Indicator
		 + TLV("5F2D", "7A68656E66726465") // Laguage Preference
		 + TLV("9F11", "01") // Issuer Code Table Index
		 + TLV("9F12", "4341524420494D4147452030303031")
		 + TLV("9F38", "9F66049F02069F03069F1A0295055F2A029A039C019F37049F33039F4E149F7A01") // PDOL
		 + TLV("BF0C",  // FCI Issuer Discretionary Data
			   TLV("9F4D", "0B0A") // Log Entry
			)
		);
store("00", "9103", data);

// DGI 9200
data = TLV("9F10", "0701010300000001"); // Issuer Application Data (IAD)
store("80", "9200", data);

include('PSE_perso.js');
