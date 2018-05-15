const expect = require('expect');

var {generateMessage, generateLocationMessage} = require('./message');

describe('generateMessage', () => {
  it('should generate correct message object', () => {
    var message = generateMessage('Robz', 'Hi bruh');
    expect(message.from).toBe('Robz');
    expect(message.text).toBe('Hi bruh');
    expect(typeof message.createdAt).toBe('number');
  });
});

describe('generateLocationMessage', () => {
  it('should generate correct location object', () => {
    var message = generateLocationMessage('Robz', 40.6185194, -3.9368538);
    expect(message.from).toBe('Robz');
    expect(message.url).toBe('https://www.google.com/maps?q=40.6185194,-3.9368538');
    expect(typeof message.createdAt).toBe('number');
  });
});
