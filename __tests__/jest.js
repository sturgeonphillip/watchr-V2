const { RSA_PKCS1_PSS_PADDING } = require('constants');
const fs = require('fs');
const path = require('path');
const db = require('../server/models/userModels');

//const testJsonFile = path.resolve(__dirname, '../server/db/markets.test.json');

/**
 * Like many testing frameworks, in Jest we use the "describe" function to
 * separate our tests into sections. They make your test outputs readable.
 *
 * You can place "beforeAll", "beforeEach", "afterAll", and "afterEach"
 * functions inside of "describe" blocks and they will only run for tests
 * inside that describe block. You can even nest describes within describes!
 */

// Verify signup & login
// Verify data in database

describe('sql database tests', () => {
  /**
   * Jest runs the "beforeAll" function once, before any tests are executed.
   * Here, we write to the file and then reset our database model. Then, we
   * invoke the "done" callback to tell Jest our async operations have
   * completed. This way, the tests won't start until the "database" has been
   * reset to an empty Array!
   */

//   beforeAll((done) => {
//     fs.writeFile(testJsonFile, JSON.stringify([]), () => {
//       // assigning marketList and converting the string into an object inside markets.dev.json
//       // this places a market card inside MegaMarket Loyalty Cards
//       db.reset();
//       done();
//     });
//   });

//   afterAll((done) => {
//     fs.writeFile(testJsonFile, JSON.stringify([]), done);
//   });

  describe('#signup', () => {
    it('inputs data into sql database', async () => {
      const testInput = { 
          amazon: false,
          email: 'ppps@gmail.com',
          hulu: false,
          netflix: false,
          password: 'ppps',
          username: 'PPPS',
      };
      let result = {};
      const query = `INSERT INTO users(amazon, email, hulu, netflix, password, username) VALUES ('${JSON.parse(testInput.amazon)}', '${testInput.email}', '${JSON.parse(testInput.hulu)}', '${JSON.parse(testInput.netflix)}', '${testInput.password}','${testInput.username}') RETURNING (amazon, email, hulu, netflix, password, username);`;
      await db.query(query)
          .then((data) => {
            result = data.rows[0].row;
            //console.log(result);
          })
        .catch((err) => {
          if (err) return next(err);
        });
        console.log(result);
        let expected = '';
        expected = Object.values(testInput)
        .map(element => {
          if (element === true) element = 't';
          if (element === false) element = 'f';
          return element;
        }).join(',');
        expected = `(${expected})`;
        console.log(expected);
        expect(result).toEqual(expected);
    });
  

    // TODO: Finish unit testing the sync function

    xit('overwrites previously existing markets', () => {
      // Declare test array of objects to to be overwritten
      // console.log(JSON.parse(fs.readFileSync(testJsonFile)));
      const marketList2 = [{ location: 'overwrite', cards: 9 }, { location: 'somewhere', cards: 2 }];
      // re-assigning through write method the empty array in testJsonFile // 
      const result = db.sync(marketList2);
      // testing if marketList2 is equal to marketList2
      expect(result).toEqual(JSON.parse(fs.readFileSync(testJsonFile)));
      // const table = JSON.parse(fs.readFileSync(testJsonFile));
      // // console.log('table :', table);
      // // expecting all properties inside marketList to be the same as table
      // expect(table).toEqual(marketList);
      // console.log(JSON.parse(fs.readFileSync(testJsonFile)));
      fs.writeFileSync(testJsonFile, JSON.stringify([]));
    });

      // an error when location and/or cards have empty key-value pairs
    xit('returns an error when location and/or cards fields are not provided', () => {
      // supposed to have an object with location key-value pair as well as cards key-value pair in same object
      const marketList3 = [{ location: 'overwrite'} , {cards: 2 }];
      const result = db.sync(marketList3);
      expect(result).toBeInstanceOf(Error);

    });

    /**
     *  TODO: Type validation is not yet correctly implemented! Follow the TDD
     *  (test driven development) approach:
     *    1. Write a test describing the desired feature (db.sync returns a
     *      TypeError when the types are wrong)
     *    2. Confirm that your tests fail
     *    3. Follow the errors to implement your new functionality
     */
    xit('returns an error when location value is not a string', () => {
      const marketList4 = [{ location: 9, cards: 2 }];
      const result = db.sync(marketList4);
      expect(result).toBeInstanceOf(Error);
    });

    xit('returns an error when cards value is not a number', () => {
      const marketList5 = [{ location: 'Las Vegas', cards: 'kangaroo' }];
      const result = db.sync(marketList5);
      expect(result).toBeInstanceOf(Error);

    });
  });

  // Extension TODO: Unit test the #find and #drop functions
  describe('#find', () => {
    xit('returns list of all markets from the json file', () => {
      fs.writeFileSync(testJsonFile, JSON.stringify([{ location: 'overwrite', cards: 9 }, { location: 'somewhere', cards: 2 }]));
      const result = db.find();
      expect(result).toEqual(JSON.parse(fs.readFileSync(testJsonFile)));
    });

    xit('works if the list of markets is empty', () => {
      fs.writeFileSync(testJsonFile, JSON.stringify([]));
      const result = db.find();
      expect(result).toEqual(JSON.parse(fs.readFileSync(testJsonFile)));
    });
  });

  describe('#drop', () => {
    xit('writes an empty array to the json file', () => {
      // overwrites the first arg directory path with second arg data 
      fs.writeFileSync(testJsonFile, JSON.stringify([{ location: 'overwrite', cards: 9 }, { location: 'somewhere', cards: 2 }]));
      db.drop();
      expect(JSON.parse(fs.readFileSync(testJsonFile))).toEqual([]);
    });
  });
});
