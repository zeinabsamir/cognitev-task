const express = require('express');
const router = express.Router();
const jwt = require("jsonwebtoken");
const _ = require('lodash');
const { check, validationResult } = require('express-validator');

const User = require('../models').User;
const isoCountries = require('./CountriesCode');
const verfiyToken = require("./verify").verfiyToken;

router.get('/', (req, res, next) => {
   res.json("hello from users");
});

router.post('/add-user',[
        check('first_name')
        .exists().withMessage('should not be empty'),
        check('last_name')
        .exists().withMessage('should not be empty'),
        check('country_code')
           .exists().withMessage('should not be empty')
           .custom((value) => {
               if (!isoCountries.hasOwnProperty(value.toUpperCase())) {
                  throw new Error('Not a valid country code');
           } else {
              return true;
           }
       }),
        check('phone_number')
        .isLength({ min: 11 }).withMessage('too short')
        .isLength({ max: 15 }).withMessage('too long')
        .exists().withMessage('should not be empty')
        .isNumeric().withMessage('Not a number')
        .matches(/^\+?[1-9]\d{1,14}$/).withMessage('must be a valide phone number formate')
        .custom(value => {
            return User.findOne({where: {phone_number:value}}).then(user => {
              if (user) {
                 throw new Error('phone number already in use');
              }else {
               return true;
            }
            });
          }),
        check('gender')
        .exists().withMessage('should not be empty'),
        check('birthdate')
        .exists().withMessage('should not be empty')
        .custom((value, { req }) => {
            if(new Date(value) >= new Date()) {
                throw new Error ('Birth date must not be in the future');
            }
            return true;
        }).matches(/([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/).withMessage('must be in formate yyyy-mm-dd'),
        check('avatar')
        .exists().withMessage('should not be empty')
        .matches(/\.(gif|jpg|jpeg|png)$/).withMessage('Invalid content type'),
        check('email')
        .isEmail().withMessage('should be a valid E-mail formate')
        .custom(value => {
            return User.findOne({where: {email:value}}).then(user => {
              if (user) {
                 throw new Error('E-mail already in use');
              }
            });
          }),


    ], (req, res) => {
        const errors = validationResult(req);
        console.log(errors.array());
        let err = {}
        if (!errors.isEmpty()) {
            var grouped = _.groupBy(errors.array(), 'param')
            
            for (var prop in grouped) {
              let arr = grouped[prop] 
              let error = [];
              arr.forEach(element => {
                 if(prop === 'phone_number' && element.msg === 'too short' ) {
                    error.push({"error": element.msg, "count": 10});  
                 } else if (prop === 'phone_number' && element.msg === 'too long' ) {
                    error.push({"error": element.msg, "count": 15}); 
                 } else {
                 error.push({"error": element.msg}); 
                 }
              });
              err[prop] = error;
            }
          
          return res.status(422).json({ "errors": err });
        }
      
        User.create(req.body).then(user => res.status(201).json(user));
  });

router.post("/login", (req, res) => {
   const { phone_number, password } = req.body;
  
    
   User.findOne({where: {phone_number}})
   .then(user => {
      if(user) {
         let payload = { phone_number };
         let token = jwt.sign(payload, "secret"); 
         res.status(200).json({ token }); 
      } else {
         res.status(401).json({ msg: "user not registered please signup first" });
      }
    
   })

 });  

 /* For task 3 the route accept in the request body user phone and token and status and check for
   token to be authorized or not then decode token and get user phone to get the logged in user */
 router.post("/auth-token", (req, res) => {

   const user_phone = req.body.phone_number;
   const token = req.body.token;
   const status = req.body.status;

   if (!token) {
    return res.status(401).send("Unauthorized Request");
  }

  jwt.verify(token, "secret", function(err, decoded) {
    if (err) return res.status(401).send("Unauthorized Request");

   let decodedPhone = decoded.phone_number;

   User.findOne({where: {phone_number: decodedPhone}})
   .then(user => {
      if(user) {
         res.status(201).json({user, status})
      } else {
         res.status(401).json({msg: "You are not authorized"})
      }
   });

  });

 }); 
/* 
  auth-token will be send in the header along with status and bind phone_number
   to the request object that decoded from sended token  
*/
 router.post("/auth", verfiyToken, (req, res) => {

   const user_phone = req.phone_number;
   
   User.findOne({where: {phone_number: user_phone}})
   .then(user => {
      if(user) {
         res.status(201).json(user)
      } else {
         res.status(401).json({msg: "You are not authorized"})
      }
   });

 }); 

module.exports = router;