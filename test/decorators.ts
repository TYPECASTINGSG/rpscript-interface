import {expect} from 'chai';
import m from 'mocha';
import { RpsModule,rpsAction } from '../src/decorators';
import { RpsContext } from '../src/context';

let $CONTEXT;


m.describe('Decorators', () => {

  m.it('module class to give appropriate module and action info', async function () {   
    expect(CorrectClazz['rpsModuleName']).to.be.equals("Correct");
    expect(WrongClazz['rpsModuleName']).to.be.undefined;
    
    let methods = Object.getOwnPropertyNames(CorrectClazz.prototype);

    for(var i in methods){
      let availConfig = CorrectClazz.prototype[methods[i]]['rpsActionConfig'];
      if(availConfig) {
        expect(availConfig).to.deep.equals(
          { defaultName: 'call',
            defaultParamPatterns: { title: "/.*/" ,message: "/$^/"},
            actionName: 'calling' });
      }
    }
  });

})


class WrongClazz {
  calling(){}
}

@RpsModule("Correct")
class CorrectClazz {

  @rpsAction({
    defaultName:'call',
    defaultParamPatterns:{
    title:/.*/
  }})
  calling (ctx:RpsContext,opts:{}, title:string, message?:string) : Promise<boolean>{
    
    return Promise.resolve(true);
  }
}