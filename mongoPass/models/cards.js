const joi = require("joi");
const mongoose = require("mongoose");
const _ = require("lodash");
const { User } = require("./users");
const Joi = require("joi");

const cardSchema = new mongoose.Schema({
  bizName: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 255,
  },
  bizDescription: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 1024,
  },
  bizAddress: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 500,
  },
  bizPhone: {
    type: String,
    required: true,
    minlength: 9,
    maxlength: 15,
  },
  bizImage: {
    type: String,
    required: true,
    minlength: 11,
    maxlength: 1024,
  },
  bizNumber: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 9_999_999_999,
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

const Card = mongoose.model("card", cardSchema);

const cardjoiSchema = joi.object({
  bizName: joi.string().min(2).max(255).required(),
  bizDescription: joi.string().min(2).max(1024).required(),
  bizAddress: joi.string().min(2).max(500).required(),
  bizPhone: joi
    .string()
    .min(2)
    .max(15)
    .required()
    .regex(/^0[2-9][-]?\d{7,9}$|^05[0-9][-]?\d{7,9}$|^07[7,3][-]?\d{7,9}$/),
  bizImage: Joi.string().uri().min(20).optional(),
});

const generateBizNumber = async () => {
  while (true) {
    let randomNumber = _.random(100, 9_999_999_999);
    let card = await Card.findOne({ bizNumber: randomNumber });
    if (!card) {
      return String(randomNumber);
    }
  } //uuid
};

const validateCard = (card) => cardjoiSchema.validate(card);

module.exports = {
  Card,
  validateCard,
  generateBizNumber,
};
