import Demo from '@/views/demo/Demo';
import { shallow } from '@vue/test-utils'

describe('Demo', () => {
    it ('get id', () => {
        const wrapper = shallow(Demo);
        expect(wrapper.find('div').text()).toMatch('2');
    });
});