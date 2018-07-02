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

    // context.updatePriority('notifier','notifier',5);
    // console.log(context.getRuntimeDefault());
  });

})
