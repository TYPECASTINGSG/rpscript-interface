import {expect} from 'chai';
import m from 'mocha';
import {RpsContext} from '../src/context';
import { EventEmitter } from 'events';

m.describe('Context', () => {

  m.it('should have a minimal set of default attributes', function () {
    let context = new RpsContext();
    expect(context.event).to.be.instanceof(EventEmitter);
    expect(context.$RESULT).to.be.equals("");
    expect(context.variables).to.be.instanceof(Object);
  });

  m.it('should update priority', function () {
    let context = new RpsContext();

    console.log(context.getRuntimeDefault());
  });

})
