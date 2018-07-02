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

    let actA = CorrectClazz.prototype['actA']['rpsActionConfig'];
    expect(actA).to.deep.equals(
      { enabled: false,
        priority: 3,
        methodName: 'actA',
        params: 
         [ { name: 'title', pattern: '$^' },
           { name: 'message', pattern: '$^' } ] });

    let actB = CorrectClazz.prototype['actB']['rpsActionConfig'];
    expect(actB).to.deep.equals(
      { enabled: true,
        priority: 3,
        verbName: 'defActB',
        methodName: 'actB',
        params: 
         [ { name: 'title', pattern: '$^' },
           { name: 'message', pattern: '$^' } ] }
      );

    let actC = CorrectClazz.prototype['actC']['rpsActionConfig'];
    expect(actC).to.deep.equals(
      { enabled: true,
        priority: 3,
        verbName: 'defActC',
        description: 'action C desc',
        methodName: 'actC',
        params: 
         [ { name: 'title', pattern: '$^' },
           { name: 'message', pattern: '$^' } ] });

    let actD = CorrectClazz.prototype['actD']['rpsActionConfig'];
    expect(actD).to.deep.equals(
      { enabled: true,
        priority: 4,
        verbName: 'actD',
        description: 'action D desc',
        methodName: 'actD',
        params: 
         [ { name: 'title', pattern: '$^' },
           { name: 'message', pattern: '$^' } ] });

    let actE = CorrectClazz.prototype['actE']['rpsActionConfig'];
    expect(actE).to.deep.equals(
      { enabled: false,
        priority: 1,
        verbName: 'actE',
        description: 'action E desc',
        params: 
         [ { name: 'title', pattern: '.*' },
           { name: 'message', pattern: '$^' } ],
        methodName: 'actE' });

  });

  m.it('should call a correct clazz function', async function () {
    let corClazz =  new CorrectClazz;
    let ctx = new RpsContext

    ctx.event.on('action', (...p) => {
      expect(p[0]).to.be.equals('Correct');
      expect(p[1]).to.be.equals('actA');
      
      if(p[2]==='start'){
        expect(p[3]).to.be.deep.equals([ 'title', 'message' ]);
      }else {
        expect(p[3]).to.be.equals(true);
      }
    });

    corClazz.actA(ctx,{},'title','message');

  });
})


class WrongClazz {
  calling(){}
}

@RpsModule("Correct")
class CorrectClazz {

  @rpsAction()
  actA (ctx:RpsContext,opts:{}, title:string, message?:string) : Promise<boolean>{return Promise.resolve(true);}

  @rpsAction({verbName:'defActB'})
  actB (ctx:RpsContext,opts:{}, title:string, message?:string) : Promise<boolean>{return Promise.resolve(true);}

  @rpsAction({verbName:'defActC',description:'action C desc'})
  actC (ctx:RpsContext,opts:{}, title:string, message?:string) : Promise<boolean>{return Promise.resolve(true);}

  @rpsAction({verbName:'actD',description:'action D desc',priority:4})
  actD (ctx:RpsContext,opts:{}, title:string, message?:string) : Promise<boolean>{return Promise.resolve(true);}

  @rpsAction({verbName:'actE',description:'action E desc',
  enabled:false,priority:1,params:[{name:'title',pattern:/.*/}] })
  actE (ctx:RpsContext,opts:{}, title:string, message?:string) : Promise<boolean>{return Promise.resolve(true);}
}