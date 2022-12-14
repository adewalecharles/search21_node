const express = require("express");

const todoModel = require('../models/todo');

module.exports = {
  async index(req, res) { 
    try {
        const todos = await todoModel.find({owner: req.query.owner});
        return res.status(200).json({
          status: true,
          data: todos,
        });
      } catch (error) {
       return  res.status(500).json({
          status: false,
          message: error,
        });
      }
},

 async  show(req, res) {
   const todoID = req.params.todoID;
    try {
      const todo = await todoModel.findOne({ id: todoID});
      if (todo) {
        return res.status(200).json({
          status: true,
          data: todo,
        });
      } else {
         return res.status(400).json({
           status: false,
           message: "could not find todo",
         });
      }
    } catch (error) {
       return res.status(500).json({
          status: false,
          message: error,
        });
    }
},

 async create(req, res) {
    const {title,owner} = req.body

    try {
        const todo = await todoModel.create({
          title: title,
          owner:owner
        });

        return res.status(200).json({
          status: true,
          data: todo,
        });
    } catch (error) {
       return res.status(500).json({
            status: false,
            message: error
        })
    }
},

 async update(req, res) {


    try {
        const { title } = req.body;
        const todo = await todoModel.findOneAndUpdate(
          { id: req.params.todoID },

          {
            title: title,
          },
          { new: true }
        );

        return res.status(200).json({
          status: true,
          data: todo,
        });

    } catch (error) {
        return res.status(200).json({
          status: false,
          message: error,
        });
    }

},

 async destroy(req, res) {
try {
    const data = await todoModel.findOneAndDelete({
        id: req.params.todoID
    })

    if (data) {
        return res.status(200).json({
            status: true,
            data: {}
        })
    } else {
        return res.status(400).json({
          status: false,
          message: "Could not delete Todo",
        });
    }
} catch (error) {
   return res.status(500).json({
      status: false,
      message: error,
    });
}
}

}

