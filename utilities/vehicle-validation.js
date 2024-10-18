const { body, validationResult } = require("express-validator")
const utilities = require(".")
const invModel = require("../models/inventory-model")
const validate = {}

/*  **********************************
  *  Vehicle Data Validation Rules
  * ********************************* */
validate.vehicleRules = () => {
    return [
        body("inv_make")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 3})
        .withMessage("Please provide a valid make."),

        body("inv_model")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 2})
        .withMessage("Please provide a valid model."),

        body("inv_year")
        .trim()
        .escape()
        .isNumeric()
        .notEmpty()
        .isLength({
            min: 4,
            max: 4
        })
        .withMessage("Please provide a valid year."),

        body("inv_description")
        .trim()
        .notEmpty()
        .isLength({ min: 3})
        .withMessage("Please provide a valid description."),

        body("inv_image")
        .trim()
        .notEmpty()
        .custom(inv_image => {
            if (inv_image !== "/images/vehicles/no-image.png") {
                throw new Error("Please provide a valid image path.")
            }
            return true
        }),

        body("inv_thumbnail")
        .trim()
        .notEmpty()
        .custom(inv_thumbnail => {
            if (inv_thumbnail !== "/images/vehicles/no-image.png") {
                throw new Error("Please provide a valid thumbnail path.")
            }
            return true
        }),

        body("inv_price")
        .trim()
        .escape()
        .isNumeric()
        .notEmpty()
        .withMessage("Please provide a valid price."),

        body("inv_miles")
        .trim()
        .escape()
        .isNumeric()
        .notEmpty()
        .isInt()
        .withMessage("Please provide valid miles."),

        body("inv_color")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 2})
        .withMessage("Please provide a valid color."),

        body("classification_id")
        .trim()
        .escape()
        .notEmpty()
        .withMessage("Please provide a classification.")
        .custom(async (classification_id) => {
            const classificationExistingList = await invModel.getClassifications()
            const classificationName = await invModel.getClassificationById(classification_id)

            const classificationExist = classificationExistingList.rows.find(classificationObj => classificationObj.classification_name == classificationName) 
            
            if (!(classificationExist != undefined && classificationExist.classification_name == classificationName)) {
                throw new Error("The classification must exist.")
            }
            return true
        })
    ]
}

/* ******************************
 * Check data and return errors or continue to add vehicle
 * ***************************** */
validate.checkVehicleData = async (req, res, next) => {
    const errors = validationResult(req)
    
    if (!errors.isEmpty()) {
        const {
            inv_make,
            inv_model,
            inv_year,
            inv_description,
            inv_image,
            inv_thumbnail,
            inv_price,
            inv_miles,
            inv_color,
            classification_id,
        } = req.body

        let nav = await utilities.getNav()
        let classificationList = await utilities.buildClassificationList(classification_id)

        res.render("inventory/add-inventory", {
            title: "Add New Vehicle",
            nav,
            classificationList,
            errors,
            inv_make,
            inv_model,
            inv_year,
            inv_description,
            inv_image,
            inv_thumbnail,
            inv_price,
            inv_miles,
            inv_color,
            classification_id
        })
        return
    }
    next()
}

/* ******************************
 * Check data and return errors to edit view or continue to update vehicle data
 * ***************************** */
validate.checkVehicleUpdateData = async (req, res, next) => {
    const errors = validationResult(req)
    
    if (!errors.isEmpty()) {
        const {
            inv_id,
            inv_make,
            inv_model,
            inv_year,
            inv_description,
            inv_image,
            inv_thumbnail,
            inv_price,
            inv_miles,
            inv_color,
            classification_id,
        } = req.body

        let nav = await utilities.getNav()
        const className = `${inv_make} ${inv_model}`
        let classificationSelect = await utilities.buildClassificationList(classification_id)

        res.render("inventory/edit-inventory", {
            title: "Edit " + className,
            nav,
            classificationSelect,
            errors,
            inv_id,
            inv_make,
            inv_model,
            inv_year,
            inv_description,
            inv_image,
            inv_thumbnail,
            inv_price,
            inv_miles,
            inv_color,
            classification_id
        })
        return
    }
    next()
}


module.exports = validate