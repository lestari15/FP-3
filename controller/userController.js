const { user } = require("../models");
const { generateToken, verifyToken } = require("../helpers/jwt");
const { comparePassword } = require("../helpers/bcrypt");
const rupiahFormat = require('../utils/rupiahFormat')

class userController {
  static register(req, res) {
    console.log(req.body);
    user.create(req.body,)
      .then((result) => {
        res.status(201).json({
          user: {
            "id": result.id,
            "full_name": result.full_name,
            "email": result.email,
            "gender": result.gender,
            "balance": rupiahFormat(result.balance),
            "createdAt": result.createdAt
          }
        });
      })
      .catch((err => {
        console.log(err);
        res.status(500).json({
          message: "Terjadi kesalahan pada server"
        });
      }));
  }


  static login(req, res) {
    let email = req.body.email;
    user.findOne({
      where: { email: email },
      raw: true,
      nest: true,
    })
      .then(data => {
        if (!data) {
          res.status(401).json({ message: "Invalid Credentials" });
        } else {
          let compare = comparePassword(req.body.password, data.password);
          if (compare == true) {
            const token = generateToken(data);
            res.status(200).json({ token: token });
          } else {
            res.status(401).json({ message: "Invalid Credentials" });
          }
        }
      })
      .catch(err => {
        res.status(401).json(err);
      });
  }

  static update(req, res) {
    let id = req.params.id;
    user.update(
      req.body,
      {
        where: {
          id: id
        },
        returning: true
      }
    )
      .then(result => {
        res.status(200).json({
          user: {
            "id": result[1][0].id,
            "full_name": result[1][0].full_name,
            "email": result[1][0].email,
            "createdAt": result[1][0].createdAt,
            "updatedAt": result[1][0].updatedAt,
          }
        });
      })
      .catch((err) => {
        console.log(err)
        res.status(500).json({
          message: "Terjadi kesalahan pada server"
        });
      });
  }

  static delete(req, res) {
    let id = req.params.id;
    user.destroy({
      where: {
        id: id
      }
    })
      .then(result => {
        if (!result) {
          res.status(500).json({ message: "Account does not exist" });
        } else {
          res.status(200).json({ message: "Your account has been successfully deleted" });
        }

      })
      .catch(err => {
        res.status(500).json(err);
      });
  }

  static async topUp(req, res) {
    await user.findOne({
      where: {
        id: verifyToken(req.headers.token).id
      },
      returning: true,
      raw: true,
      nest: true,
    }).then(async (data) => {
      const bal = Number(req.body.balance) + Number(data.balance)
      await user.update({ balance: bal }, {
        where: {
          id: verifyToken(req.headers.token).id
        }
      }).then(() => {
        res.status(200).json({
          message: `Your balance has been succesfully updated to ${rupiahFormat(bal)}`
        })
      }).catch(err => {
        res.status(500).json({
          error: err.errors[0].message
        });
      })

    }).catch(err => {
      console.log(err)
      res.status(500).json(err);
    })
  }

}

module.exports = userController;