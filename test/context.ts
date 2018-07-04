import {expect} from 'chai';
import m from 'mocha';
import {RpsContext} from '../src/context';
import { EventEmitter } from 'events';
import ConfigStore from 'configstore';

m.describe('Context', () => {

  m.it('should have a minimal set of default attributes', function () {
    let context = new RpsContext();
    expect(context.event).to.be.instanceof(EventEmitter);
    expect(context.$RESULT).to.be.equals("");
    expect(context.variables).to.be.instanceof(Object);
  });

  m.it('runtime config should be same as original config', function () {
    let context = new RpsContext();

    let rtStore = context.getRuntimeDefault();
    let rpsStore = new ConfigStore('rpscript').get('$DEFAULT');

    expect(rtStore).to.be.deep.equals(rpsStore);
  });

  m.it('should select top priority action', function () {
    let ctx:RpsContext = new RpsContext;
    ctx.configStore = new ConfigStore('rps-test-rpscontext');
    ctx.configStore.set(UPDATED_CONFIG_OVERLAP);

    expect(ctx.configStore.all).to.be.deep.equals(UPDATED_CONFIG_OVERLAP);

    ctx.updatePriority('fakeTestOverlap','fakeAction1',5);

    expect(ctx.configStore.all).to.be.deep.equals(PRIORITY_SET_CONFIG_OVERLAP);
  });

  m.it('should add module context', function () {
    let ctx:RpsContext = new RpsContext;
    
    ctx.addModuleContext('test1',{});
    ctx.addModuleContext('test2',{item:'item'});

    let test1 = ctx.getModuleContext('test1');
    let test2 = ctx.getModuleContext('test2');

    expect(test1).to.be.deep.equals({});
    expect(test2).to.be.deep.equals({item:'item'});

  });

})


let UPDATED_CONFIG_OVERLAP = {
  "$DEFAULT": {
    "fakeAction1": [
      {
        "enabled": true,
        "priority": 3,
        "verbName": "fakeAction1",
        "methodName": "fakeAction1",
        "params": [
          {
            "name": "first",
            "pattern": "$^"
          }
        ],
        "moduleName": "fakeTest"
      },
      {
        "enabled": true,
        "priority": 1,
        "verbName": "fakeAction1",
        "methodName": "fakeAction1",
        "params": [
          {
            "name": "first",
            "pattern": "$^"
          },
          {
            "name": "second",
            "pattern": "$^"
          }
        ],
        "moduleName": "fakeTestOverlap"
      }
    ],
  }
}

let PRIORITY_SET_CONFIG_OVERLAP = {
  "$DEFAULT": {
    "fakeAction1": [
      {
        "enabled": true,
        "priority": 3,
        "verbName": "fakeAction1",
        "methodName": "fakeAction1",
        "params": [
          {
            "name": "first",
            "pattern": "$^"
          }
        ],
        "moduleName": "fakeTest"
      },
      {
        "enabled": true,
        "priority": 5,
        "verbName": "fakeAction1",
        "methodName": "fakeAction1",
        "params": [
          {
            "name": "first",
            "pattern": "$^"
          },
          {
            "name": "second",
            "pattern": "$^"
          }
        ],
        "moduleName": "fakeTestOverlap"
      }
    ],
  }
}