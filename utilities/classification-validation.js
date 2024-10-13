const utilities = require(".")
const { body, validationResult } = require("express-validator")
const invModel = require("../models/inventory-model")
const validate = {}

/*  **********************************
  *  Classification Data Validation Rules
  * ********************************* */
validate.classificationRules = () => {
    return [
        body("classification_name")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 1 })
            .withMessage("Please provide a classification name")
            .custom(classification_name => {
                if (classification_name.includes(" ")) {
                    throw new Error("Please provide a classification name with no spaces")
                }
                return true
            })
            .custom(async (classification_name) => {
                const classificationExist = await invModel.checkExistingClassification(classification_name)
                if (classificationExist) {
                    throw new Error(`${classification_name} already exist.`);
                }
                return true
            })
    ]
}

/* ******************************
 * Check data and return errors or continue to add classification
 * ***************************** */
validate.checkClassificationData = async function (req, res, next) {
    const {
        classification_name
    } = req.body
    let errors
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("inventory/add-classification", {
            errors,
            title: "Add New Classification",
            nav,
            classification_name
        })
        return
    }
    next()
}


module.exports = validate