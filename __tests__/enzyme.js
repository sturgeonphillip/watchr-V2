import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { shallow } from 'enzyme';
import React from 'react';
import StreamsDisplay from '../client/components/StreamsDisplay.jsx';
//import '../client/components/styles/StreamsDisplay.css';

Enzyme.configure({ adapter: new Adapter() });

describe('React unit tests', () => {
  describe('StreamsDisplay', () => {
    let wrapper;
    const streams = [true, false, true];
    // console.log([...props])
    beforeAll(() => {
      wrapper = shallow(<StreamsDisplay streams={streams} />);
    });
    
    it('Renders an <img> tag for for each selected streaming service', () => {
      const testArray = [];
      const labeledText = wrapper.find("img").map(node => testArray.push(node.props()));
      
      expect(testArray[0].alt).toEqual("amazon");
      expect(testArray[1].alt).toEqual("netflix");
      
      // expect(logo.find("img").prop("src")).toEqual("https://i.pinimg.com/originals/01/ca/da/01cada77a0a7d326d85b7969fe26a728.jpg").AND.expect(logo.prop("alt")).toEqual("amazon");
      // expect(logo.find("img").prop("src")).toEqual("https://cdn.vox-cdn.com/thumbor/QuS2QKQys3HhosKiV-2IuKhphbo=/39x0:3111x2048/1400x1050/filters:focal(39x0:3111x2048):format(png)/cdn.vox-cdn.com/uploads/chorus_image/image/49901753/netflixlogo.0.0.png");
      // expect(wrapper.text()).toEqual('Mega: Markets');
      // expect(wrapper.find('strong').text()).toMatch('Mega');
    });
    
  });
});
