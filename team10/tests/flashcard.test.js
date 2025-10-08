import { mount } from '@vue/test-utils';
import FlashcardApp from '../learning_mode.js';

describe('FlashcardApp', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(FlashcardApp);
  });

  it('renders the first flashcard by default', () => {
    expect(wrapper.find('.front').text()).toBe('Hej');
    expect(wrapper.find('.back').text()).toBe('Hello');
  });

  it('flips the flashcard when clicked', async () => {
    await wrapper.find('.flashcard').trigger('click');
    expect(wrapper.find('.flashcard-content').classes()).toContain('flipped');
  });

  it('navigates to the next flashcard', async () => {
    await wrapper.find('button:nth-child(2)').trigger('click');
    expect(wrapper.find('.front').text()).toBe('Tack');
    expect(wrapper.find('.back').text()).toBe('Thank you');
  });

  it('navigates to the previous flashcard', async () => {
    await wrapper.find('button:nth-child(1)').trigger('click');
    expect(wrapper.find('.front').text()).toBe('Nej');
    expect(wrapper.find('.back').text()).toBe('No');
  });
});