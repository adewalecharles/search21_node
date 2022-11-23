const express = require("express");
const TodoController = require("../controllers/TodoController");
const router = express.Router();
const auth = require("../middleware/auth");


router.get('/', auth, TodoController.index);

router.get("/todo/:todoID", auth, TodoController.show);

router.post("/create", auth, TodoController.create);

router.put("/edit/:todoID", auth, TodoController.update);

router.delete("/delete/:todoID", auth, TodoController.destroy);

module.exports = router;