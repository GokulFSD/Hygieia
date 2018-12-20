
//works in strict mode
'use strict'

//require the handler module.
//declaring a constant variable.
const { TransactionHandler } = require('sawtooth-sdk/processor/handler')


const {
  InvalidTransaction,
  InternalError
} = require('sawtooth-sdk/processor/exceptions')
const crypto = require('crypto')
const {TextEncoder, TextDecoder} = require('text-encoding/lib/encoding')

const _hash = (x) => crypto.createHash('sha512').update(x).digest('hex').toLowerCase().substring(0, 64)
var encoder = new TextEncoder('utf8')
var decoder = new TextDecoder('utf8')
const MIN_VALUE = 0
const CJ_FAMILY = 'hygieia'
const CJ_NAMESPACE = _hash(CJ_FAMILY).substring(0, 6)


class HygieiaHandler extends TransactionHandler{

    constructor(){
      super(CJ_FAMILY,['1.0'],[CJ_NAMESPACE])
    }

    decodepayload(payload){
  
        var  payloadDecoded= {
          bgroup:payload[0],
          part: payload[1]
        }
        return payloadDecoded
      }

    apply(transacationProcessRequest,context){
        
             //payload decoding*****
            let payload = transacationProcessRequest.payload.toString().split(',')
            console.log("HelloWorldlkfkhdkfshfgs!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
            let pl=this.decodepayload(payload);
            console.log(pl.bgroup+","+pl.part)

            //address generation*****************
            let signerPk=transacationProcessRequest.header.signerPublicKey;
            console.log(signerPk.toString())
            const publicKeyHash= _hash(signerPk)
            let address=_hash('hygieia').substring(0,6)+_hash(pl.part)+_hash(pl.bgroup)+publicKeyHash

            console.log(pl.bgroup+pl.part);


            return context.getState([address])
            .then((currentStateMap)=>{
              const myState = currentStateMap[address];
              var oldstate= decoder.decode(myState);

              if(myState == '' || myState == null) {  ///first time baking
                newTxnId="";
                newStatus="";

              } 
               else {
                 newStatus="Matched"
                    
              
              }


            })
          
    }

}
module.exports = HygieiaHandler;