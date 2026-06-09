/*
 * @Date : Apr 13, 2012
 * @auther: CYF
 * TODO To change the template for this generated file go to
 * Window - Preferences - Java - Code Style - Code Templates
 */
package com.konai.pboc;

import javacard.framework.ISO7816;
import javacard.framework.ISOException;
import javacard.framework.JCSystem;
import javacard.framework.Util;
import javacard.security.DESKey;

public class CyclicFixedFile extends RecordFile  {
	    // number of records
	    private short recordLength;     // record length
	    private short firstRecordIndex;      // most recently created record pointer (zero-based)
	    protected byte[] body;
	    byte[] updateKeyData;
	    byte[] getInitializeKeyData() {
			// TODO 자동 생성된 메소드 스텁
			if(updateKeyData==null){
				return this.initializeKeyData;
			}else{
				return updateKeyData;
			}
	    
		}

		short appendedNum;
	   
	    CyclicFixedFile(byte[] apduBuffer){
	    	
	    }
	    CyclicFixedFile(byte[] apduBuffer,short offset)  {
	       
	    	super();
	    	this.type =RecordFile.TYPE_CYCLIC;
	        maxRecordNumber = (short)(apduBuffer[(short)(offset +3)] & 0x00FF);
	        recordLength = (short)(apduBuffer[(short)(offset+ 4)] & 0x00FF);
	        firstRecordIndex = 0;
	        //body = new byte[(short)(maxRecordNumber * recordLength)];
	        //initializeKeyData = new byte[16];
	        //Util.arrayCopy(apduBuffer,(short)(offset +4), initializeKeyData, (short)0, (short)16);
	        
	    }
	    
	
	    /**
	     * append record
	     */
	    void append(byte[] src, short srcOff, short length) {
	    	
	    	if(updateKeyData==null){
	        	
	        	
	        	recordLength = (short)(length-16);
	        	body = new byte[(short)(maxRecordNumber * recordLength)];
	        	updateKeyData=new byte[16];
	            Util.arrayCopy(src, srcOff, updateKeyData,(short)0 , (short)16);
	        	
	        }
	        boolean inTransaction = false;
	        if (JCSystem.getTransactionDepth() == 0) {
	            inTransaction = true;
	            JCSystem.beginTransaction();
	        	
	        }
	   
	    
	        
	     
	        if ((short)(length-16) != recordLength) {
	            ISOException.throwIt((short)(ISO7816.SW_WRONG_LENGTH));
	        }
	        
	        
	        short bodyOffset = (short)(firstRecordIndex * recordLength);
	        Util.arrayCopy(src, (short)(srcOff+16), body, bodyOffset,(short)recordLength);
	  
	       
	        if(appendedNum<maxRecordNumber){
	        	 appendedNum++;
	        }
	       setCurrentRecord((short)1);
	        
	        if (inTransaction) {
	            JCSystem.commitTransaction();
	        }
	    }
	    
	    
	  short getMaxRecordNumber() {
			return appendedNum;
		}
	    /**
	     * read record
	     */
	    short read(byte number, byte[] dest, short destOff, short length) {
	        length &= 0x00FF;
	        if (length > recordLength) {
	            ISOException.throwIt(ISO7816.SW_WRONG_LENGTH);
	        }
	        if (length == 0) {
	            length = recordLength;
	        }
	        
//	        if (number == 0x00) {
//	        	number = (byte)getCurrentRecord();
//	        }
	        short recordIndexToRead = getRecordIndex(number);
//	        if (number == 0x00) {
//	        	recordIndexToRead = currentRecord;
//	        }
//	        else {
//	        	recordIndexToRead = (short)(firstRecordIndex - number);
//	        	if (recordIndexToRead < 0) {
//	                recordIndexToRead += maxRecordNumber;
//	            }
//	        }
	        
	        short bodyOffset = (short)(recordIndexToRead * recordLength);
	        
	        Util.arrayCopyNonAtomic(body, bodyOffset, dest, destOff, length);
	        
//	        setCurrentRecord(number);
	        
	        return length;
	    }

	    /**
	     * update record
	     */
	    void update(byte number, byte[] src, short srcOff, short length) {
	        //length &= 0x00FF;
	        if (length !=recordLength) {
	            ISOException.throwIt((short)(ISO7816.SW_WRONG_LENGTH));
	        }
	        
//	        short recordIndexToUpdate = (short)(firstRecordIndex - number);
//	        if (recordIndexToUpdate < 0) {
//	            recordIndexToUpdate += maxRecordNumber;
//	        }
//	        if (number == 0x00) {
//	        	number = (byte)getCurrentRecord();
//	        }
	        short recordIndexToUpdate = getRecordIndex(number);
	        short bodyOffset = (short)(recordIndexToUpdate * recordLength);
	        
	        boolean inTransaction = false;
	        if (JCSystem.getTransactionDepth() == 0) {
	            inTransaction = true;
	            JCSystem.beginTransaction();
	        }
	        
	        Util.arrayCopy(src, srcOff, body, bodyOffset, length);        
	        
	        firstRecordIndex++;
	        if ((short)(firstRecordIndex) >= maxRecordNumber) {
	            firstRecordIndex = 0;
	        }
	        if(appendedNum<maxRecordNumber){
	        	 appendedNum++;
	        }
	       setCurrentRecord(number);
	        
	        if (inTransaction) {
	            JCSystem.commitTransaction();
	        }
	    }

/*	    byte getFirstRecord() {
	        //return (byte)0x01;
	    	return (byte)getCurrentRecord();
	    }
	    
	    byte getLastRecord() {
	        //return (byte)(firstRecordIndex + 1);
	    	return (byte)getCurrentRecord();
	    }
	    
	    byte getNextRecord() {
	        //if (currentRecord == maxRecordNumber) {
//	        if (currentRecord == (short)(firstRecordIndex + 1)) {
//	            return (byte)0x01;
//	        }
//	        short recordIndexToUpdate = (short)(firstRecordIndex - (currentRecord - 1));
//	        if (recordIndexToUpdate < 0) {
//	            recordIndexToUpdate += maxRecordNumber;
//	        }
//	        return (byte)(currentRecord - 1);
	    	return (byte)getCurrentRecord();
	    }
	    
	    byte getPreviousRecord() {-
	        // XXX : for cyclic file, previous record access for 
	        //       Update Record command is as Append Record.
	        //       So, this method will not be invoked for cyclic file update.
//	        return (byte)0x00;
	    	// compatible with Tianyu
	    	return (byte)getCurrentRecord();
	    }*/
	    
	    short getRecordLength(byte number) {
	        return recordLength;
	    }
	    
	    short getRecordIndex(short recordNumber) {
	    	short index = (short)((firstRecordIndex + maxRecordNumber) - recordNumber);
	    	if (index >= maxRecordNumber) {
	    		index -= maxRecordNumber;
	    	}
	    	return index;
	    }

	
		byte getFirstRecord() {
			// TODO 자동 생성된 메소드 스텁
			return 0;
		}

	
		byte getLastRecord() {
			// TODO 자동 생성된 메소드 스텁
			return 0;
		}

	
		byte getNextRecord() {
			// TODO 자동 생성된 메소드 스텁
			return 0;
		}

		
		byte getPreviousRecord() {
			// TODO 자동 생성된 메소드 스텁
			return 0;
		}
		
		short searchReccordByID(short id, boolean isFisrt, short length) {
			
			short recordIndex = 0;
		    short bodyOffset = 0;
		    short id_temp = 0;
		    boolean isFirstFound = false;
		    
	/*	
	        for (;(recordLengthList[recordIndex] != 0&&recordIndex<maxRecordNumber); recordIndex++) {
	        	bodyOffset += (short)(recordLengthList[recordIndex] & 0x00FF);
	        	Util.setShort(body,bodyOffset,id_temp);
	        	if(id==id_temp){
	        		if(isFisrt){
	        			return ++recordIndex;
	        		}else{
	        			if(isFirstFound){
	        				isFirstFound=true;
	        			}else{
	        				return ++recordIndex;
	        			}
	        		}
	        	}
	        }*/
	        
		     
		        
		        
		        
				return 0;
		}
		
		void setKeyData(short num,DESKey key) {
			// TODO 자동 생성된 메소드 스텁
			key.setKey( updateKeyData,(short)0);
		}
}
