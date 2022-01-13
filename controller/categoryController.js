const jwt = require('jsonwebtoken');
const { categorie, product } = require('../models');
const { verifyToken } = require('../helpers/jwt');

class categorieContoller {
  static createCategory = (req, res) => {
    const user = verifyToken(req.headers.token);
    type = req.body.type;
    categorie.create(type)
      .then(data => {
        res.status(201).send({ category : data.toJSON()})
      })
      .catch(err => {
        let errCode = 500;
        if (err.name.includes("DatabaseError")) {
          console.log(err);
          errCode = 400;
        }
        res.status(errCode).json(err);
      });
    }

    static getCatergories = (req, res) => {
      categorie.findAll({
        include: product
      })
      .then(data => {
        let status = 200;
        if (!data) {
          status = 404;
          res.status(status).send('Category not found');
        }
        res.status(status).send({ categories: data.toJSON()});
    })
    .catch(err => {
      let errCode = 500;
        if (err.name.includes("DatabaseError")) {
          console.log(err);
          errCode = 400;
        }
        res.status(errCode).json(err);
      })
    }

    static updateCategory = (req, res) => {
      categorie.update(
        {
          type: req.body.type
        },
        {
          where: {
            id: req.params.categoryId
          },
          returning: true
        }
      )
      .then(() => {
        return categorie.findByPk(req.params.categoryId)
      })
      .then(data => {
        if (data) {
          res.status(200).json(data);
        } else {
          res.status(404).json({ msg: "Category tidak ditemukan" });
        }
      })
      .catch(err => {
        let errCode = 500;
        if (err.name.includes("DatabaseError")) {
          console.log(err);
          errCode = 400;
        }
        res.status(errCode).json(err);
      })
    }

    static deleteCategory = (req, res) => {
      categorie.destroy({
        where: {
          id: req.params.categoryId
        }
      })
      .then(data => {
        if (data > 0) {
          res.status(200).json({msg: "Category has been successfully deleted"});
        } else {
          res.status(404).json({ msg: "Comment tidak ditemukan" });
        }
      })
      .catch(err => {
        res.status(500).json(err)
      })
    }
  }