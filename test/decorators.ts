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
      { defaultEnabled: false,
        defaultPriority: 3,
        actionName: 'actA',
        params: 
         [ { name: 'title', defaultPattern: '$^' },
           { name: 'message', defaultPattern: '$^' } ] });

    let actB = CorrectClazz.prototype['actB']['rpsActionConfig'];
    expect(actB).to.deep.equals(
      { defaultEnabled: true,
        defaultPriority: 3,
        defaultName: 'defActB',
        actionName: 'actB',
        params: 
         [ { name: 'title', defaultPattern: '$^' },
           { name: 'message', defaultPattern: '$^' } ] }
      );

    let actC = CorrectClazz.prototype['actC']['rpsActionConfig'];
    expect(actC).to.deep.equals(
      { defaultEnabled: true,
        defaultPriority: 3,
        defaultName: 'defActC',
        description: 'action C desc',
        actionName: 'actC',
        params: 
         [ { name: 'title', defaultPattern: '$^' },
           { name: 'message', defaultPattern: '$^' } ] });

    let actD = CorrectClazz.prototype['actD']['rpsActionConfig'];
    expect(actD).to.deep.equals(
      { defaultEnabled: true,
        defaultPriority: 4,
        defaultName: 'actD',
        description: 'action D desc',
        actionName: 'actD',
        params: 
         [ { name: 'title', defaultPattern: '$^' },
           { name: 'message', defaultPattern: '$^' } ] });

    let actE = CorrectClazz.prototype['actE']['rpsActionConfig'];
    expect(actE).to.deep.equals(
      { defaultEnabled: false,
        defaultPriority: 1,
        defaultName: 'actE',
        description: 'action E desc',
        params: 
         [ { name: 'title', defaultPattern: '.*' },
           { name: 'message', defaultPattern: '$^' } ],
        actionName: 'actE' });

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

  @rpsAction({defaultName:'defActB'})
  actB (ctx:RpsContext,opts:{}, title:string, message?:string) : Promise<boolean>{return Promise.resolve(true);}

  @rpsAction({defaultName:'defActC',description:'action C desc'})
  actC (ctx:RpsContext,opts:{}, title:string, message?:string) : Promise<boolean>{return Promise.resolve(true);}

  @rpsAction({defaultName:'actD',description:'action D desc',defaultPriority:4})
  actD (ctx:RpsContext,opts:{}, title:string, message?:string) : Promise<boolean>{return Promise.resolve(true);}

  @rpsAction({defaultName:'actE',description:'action E desc',
  defaultEnabled:false,defaultPriority:1,params:[{name:'title',defaultPattern:/.*/}] })
  actE (ctx:RpsContext,opts:{}, title:string, message?:string) : Promise<boolean>{return Promise.resolve(true);}
}