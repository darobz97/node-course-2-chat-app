const expect = require('expect');

const {Users} = require('./users');

describe('Users', () => {
  var users;
  beforeEach(() => {
    users = new Users();
    users.users = [{
      id: '1',
      name: 'Mike',
      room: 'Node Course'
    }, {
      id: '2',
      name: 'Jen',
      room: 'React Course'
    }, {
      id: '3',
      name: 'Julie',
      room: 'Node Course'
    }];
  })

  it('should add new user', () => {
    var users = new Users();
    var user = {
      id: '123',
      name: 'Juan',
      room: 'Hello'
    };
    var resUser = users.addUser(user.id, user.name, user.room);

    expect(users.users).toEqual([user]);
  });

  it('should return names for node course', () => {
    var userList = users.getUserList('Node Course');
    expect(userList).toEqual(['Mike', 'Julie']);
  });

  it('should remove a user', () => {
    var removedUser = users.removeUser('2');
    expect(removedUser).toEqual({
      id: '2',
      name: 'Jen',
      room: 'React Course'
    });
  });

  it('should return a chosen user', () => {
    var user = users.getUser('3');
    expect(user).toEqual({
      id: '3',
      name: 'Julie',
      room: 'Node Course'
    });
  });
})
