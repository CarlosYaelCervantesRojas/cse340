const { body, validationResult} = require("express-validator")
const invModel = require("../models/inventory-model")
const utilities = require("./")
const invCont = require("../controllers/invController")
const validate = {}

validate.reviewRules = () => {
    return [
        body("review_text")
            .trim()
            .notEmpty()
            .isLength({ min: 5 })
            .withMessage("Please type a valid review")
    ]
}

validate.checkReviewData = async (req, res, next) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        const {
            review_text,
            account_id,
            inv_id
        } = req.body
    
        const data = await invModel.getItemByInventoryId(inv_id)
        const grid = await utilities.buildItemGrid(data)
        let nav = await utilities.getNav()
        const reviewsList = await utilities.buildReviews(inv_id)
        const className = `${data.inv_year} ${data.inv_make} ${data.inv_model}`

        return res.render("inventory/item", {
            title: className,
            errors,
            nav,
            grid,
            reviewsList,
            review_text,
            inv_id
        })
    }
    next()
}

validate.checkUpdatedReviewData = async (req, res, next) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()

        const {
            review_id,
            review_date,
            review_text
        } = req.body

        const reviewData = await invModel.getReviewByReviewId(review_id)

        return res.render("inventory/edit-review", {
        title: `Edit ${reviewData.inv_year} ${reviewData.inv_model} ${reviewData.inv_make} Review`,
        nav,
        errors,
        review_date,
        review_text,
        review_id: reviewData.review_id
        })
    }
    next()
}


module.exports = validate