import server from '../server';
const chai = require('chai');
const assert = chai.assert;
const chaiHttp = require('chai-http');
const signUpData = require('./signUpData.json');

chai.use(chaiHttp);

function generateRandomPassword() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+[]{}|;:,.<>?';
    const passwordLength = 8;
    let password = '';
  
    for (let i = 0; i < passwordLength; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      password += characters[randomIndex];
    }
  
    return password;
  }
  

console.log(signUpData.length);

describe('SignUpFlow Test', function() {
  let email = `testuser${Math.floor(Math.random() * 100000)}@mailtrap.io`;
  let password = generateRandomPassword();
  const otherData = signUpData[Math.floor(Math.random() * signUpData.length)];
  const userData = {
      email,
      password,
      ...otherData,
  };
  console.log(userData);

  describe('SignUp test', function() {
      this.timeout(50000); // Extend timeout if needed

      it('initiate SignUp', function(done) {
          chai
              .request(server)
              .keepOpen()
              .post('/users')
              .send({
                  email,
                  password,
              })
              .end(function(err, res) {
                  assert.equal(res.status, 200, 'status is 200');
                  assert.property(res.body, 'message', 'has a message in body');
                  assert.equal(res.body.message, 'Verify email to complete signUp', 'message has expected content');
                  done();
              });
      });

      it('finalize SignUp after delay', function(done) {
          setTimeout(() => {
              chai
                  .request(server)
                  .keepOpen()
                  .post('/users/finalize')
                  .send(userData)
                  .end(function(err, res) {
                      console.log(res.body);
                      assert.equal(res.status, 200, 'status is 200');
                      assert.property(res.body, 'message', 'has message');
                      done();
                  });
          }, 15000); // Delay of 3000ms (3 seconds)
      });
  });
});
