const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Deliver inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = await invModel.getClassificationById(classification_id)
  res.render("inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

/* ***************************
 *  Deliver inventory item detail view
 * ************************** */
invCont.buildByInventoryId = async function (req, res, next) {
  const inventory_id = req.params.inventoryId
  const data = await invModel.getItemByInventoryId(inventory_id)
  const grid = await utilities.buildItemGrid(data)
  let nav = await utilities.getNav()
  const className = `${data.inv_year} ${data.inv_make} ${data.inv_model}`
  const reviewsList = await utilities.buildReviews(inventory_id)
  res.render("inventory/item", {
    title: className,
    errors: null,
    nav,
    grid,
    reviewsList,
    inv_id: inventory_id
  })
}

/* ***************************
 *  Deliver management view
 * ************************** */
invCont.buildManagementView = async function (req, res, next) {
  let nav = await utilities.getNav()

  const classificationSelect = await utilities.buildClassificationList()

  res.render("inventory/management", {
    title: "Vehicle Management",
    nav,
    classificationSelect
  })
}

/* ***************************
 *  Deliver add classification view
 * ************************** */
invCont.buildAddClassificationView = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("inventory/add-classification", {
    title: "Add New Classification",
    nav,
    errors: null
  })
}

/* ***************************
 *  Deliver add inventory view
 * ************************** */
invCont.buildAddInventoryView = async function (req, res, next) {
  let nav = await utilities.getNav()
  let classificationList = await utilities.buildClassificationList()
  res.render("inventory/add-inventory", {
    title: "Add New Inventory",
    nav,
    classificationList,
    errors: null
  })
}

/* ***************************
 *  Deliver edit review view
 * ************************** */
invCont.buildUpdateReviewView = async function (req, res, next) {
  let nav = await utilities.getNav()
  const reviewData = await invModel.getReviewByReviewId(req.params.review_id)
  res.render("inventory/edit-review", {
    title: `Edit ${reviewData.inv_year} ${reviewData.inv_model} ${reviewData.inv_make} Review`,
    nav,
    errors: null,
    review_date: reviewData.review_date.toLocaleDateString("en-US", {month: "long", day: "numeric", year: "numeric"}),
    review_text: reviewData.review_text,
    review_id: reviewData.review_id
  })
}

/* ***************************
 *  Deliver delete review view
 * ************************** */
invCont.buildDeleteReviewView = async function (req, res, next) {
  let nav = await utilities.getNav()
  const reviewData = await invModel.getReviewByReviewId(req.params.review_id)
  res.render("inventory/delete-review", {
    title: `Delete ${reviewData.inv_year} ${reviewData.inv_model} ${reviewData.inv_make} Review`,
    nav,
    errors: null,
    review_date: reviewData.review_date.toLocaleDateString("en-US", {month: "long", day: "numeric", year: "numeric"}),
    review_text: reviewData.review_text,
    review_id: reviewData.review_id
  })
}

/* ****************************************
*  Process new classification
* *************************************** */
invCont.addClassification = async function (req, res, next) {
  const {
    classification_name
  } = req.body

  const classificationResult = await invModel.addClassification(classification_name)

  let nav = await utilities.getNav()

  let classificationSelect = await utilities.buildClassificationList()

  if (classificationResult) {
    req.flash("notice", `${classification_name} has been added.`)
    res.status(201).render("inventory/management", {
      title: "Vehicle Management",
      nav,
      classificationSelect
  })
  } else {
    req.flash("notice", `Sorry, ${classification_name} could not be added.`)
    res.status(501).render("inventory/add-classification", {
      nav, 
      title: "Add New Classsification",
      errors: null
    })
  }

}

/* ****************************************
*  Process new vehicle
* *************************************** */
invCont.addVehicle = async function(req, res, next) {
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
    classification_id
  } = req.body

  const vehicleResult = await invModel.addVehicle(
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
  )

  let nav = await utilities.getNav()

  let classificationSelect = await utilities.buildClassificationList()

  if (vehicleResult) {
    req.flash("notice", `${inv_make} ${inv_model} has been added.`)
    res.status(201).render("inventory/management", {
      title: "Vehicle Management",
      nav,
      classificationSelect
  })
  } else {
    let classificationList = await utilities.buildClassificationList()

    req.flash("notice", `Sorry, ${inv_make} ${inv_model} could not be added.`)
    res.status(501).render("inventory/add-inventory", {
      title: "Add New Vehicle",
      nav,
      classificationList,
      errors: null
    })
  }
}

/* ****************************************
*  Process new review
* *************************************** */
invCont.addReview = async function (req, res, next) {
  const {
    review_text,
    account_id,
    inv_id
  } = req.body

  const reviewResult = await invModel.addReview(review_text, account_id, inv_id)

  const data = await invModel.getItemByInventoryId(inv_id)
  const grid = await utilities.buildItemGrid(data)
  const className = `${data.inv_year} ${data.inv_make} ${data.inv_model}`
  let nav = await utilities.getNav()
  const reviewsList = await utilities.buildReviews(inv_id)

  if (reviewResult) {
    req.flash("notice", `Your review has been added.`)
    res.status(201).render("inventory/item", {
      title: className,
      errors: null,
      nav,
      grid,
      reviewsList,
      inv_id
    })
    return
  } else {
    req.flash("notice", `Sorry, your review could not be processed.`)
    res.status(501).render("inventory/item", {
      title: className,
      errors: null,
      nav,
      grid,
      reviewsList,
      inv_id
    })
    return
}

}

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}

/* ***************************
 *  Deliver edit inventory view
 * ************************** */
invCont.buildEditInventoryView = async function (req, res, next) {
  const inventory_id = parseInt(req.params.inventory_id)
  let nav = await utilities.getNav()
  const data = await invModel.getItemByInventoryId(inventory_id)
  const className = `${data.inv_make} ${data.inv_model}`
  let classificationSelect = await utilities.buildClassificationList(data.classification_id)
  res.render("inventory/edit-inventory", {
    title: "Edit " + className,
    nav,
    classificationSelect,
    errors: null,
    inv_id: data.inv_id,
    inv_make: data.inv_make,
    inv_model: data.inv_model,
    inv_year: data.inv_year,
    inv_description: data.inv_description,
    inv_image: data.inv_image,
    inv_thumbnail: data.inv_thumbnail,
    inv_price: data.inv_price,
    inv_miles: data.inv_miles,
    inv_color: data.inv_color,
    classification_id: data.classification_id
  })
}

/* ***************************
 *  Update Inventory Data
 * ************************** */
invCont.updateVehicle = async function (req, res, next) {
  let nav = await utilities.getNav()
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body
  const updateResult = await invModel.updateVehicle(
    inv_id,  
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  )

  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model
    req.flash("notice", `The ${itemName} was successfully updated.`)
    res.redirect("/inv/")
  } else {
    const classificationSelect = await utilities.buildClassificationList(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the insert failed.")
    res.status(501).render("inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationSelect,
    errors: null,
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
  }
}

/* ***************************
 *  Update Review Data
 * ************************** */
invCont.updateReview = async function (req, res, next) {
  const {
    review_id,
    review_text,
  } = req.body

  const updateResult = await invModel.updateReview(review_text, review_id)

  let nav = await utilities.getNav()
  let userReviews = await utilities.buildReviewsByAccountId(res.locals.accountData.account_id)

  if (updateResult) {
    req.flash("notice", "Your review has been updated.")
    res.render("account/management", {
        title: "Account Management",
        nav,
        errors: null,
        userReviews
    })
  } else {
    req.flash("notice", "Your review could not been updated.")
    res.render("account/management", {
        title: "Account Management",
        nav,
        errors: null,
        userReviews
    })
  }

}


/* ***************************
 *  Deliver delete confirmation view
 * ************************** */
invCont.buildDeleteConfirmationView = async function (req, res, next) {
  const inventory_id = parseInt(req.params.inventory_id)
  let nav = await utilities.getNav()
  const data = await invModel.getItemByInventoryId(inventory_id)
  const className = `${data.inv_make} ${data.inv_model}`
  res.render("inventory/delete-confirm", {
    title: "Delete " + className,
    nav,
    errors: null,
    inv_id: data.inv_id,
    inv_make: data.inv_make,
    inv_model: data.inv_model,
    inv_year: data.inv_year,
    inv_price: data.inv_price,
  })
}

/* ***************************
 *  Delete Inventory Data
 * ************************** */
invCont.deleteVehicle = async function (req, res, next) {
  let nav = await utilities.getNav()
  let {
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_price
  } = req.body
  inv_id = parseInt(inv_id)
  const deleteResult = await invModel.deleteVehicle(inv_id)

  if (deleteResult) {
    const itemName = inv_make + " " + inv_model
    req.flash("notice", `The ${itemName} was successfully deleted.`)
    res.redirect("/inv/")
  } else {
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the delete operation failed.")
    res.status(501).render("inventory/delete-confirm", {
    title: "Delete " + itemName,
    nav,
    errors: null,
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_price,
    })
  }
}

/* ***************************
 *  Delete Review Data
 * ************************** */
invCont.deleteReview = async function (req, res, next) {
  const {
    review_id,
  } = req.body

  const deleteResult = await invModel.deleteReview(review_id)

  let nav = await utilities.getNav()
  let userReviews = await utilities.buildReviewsByAccountId(res.locals.accountData.account_id)

  if (deleteResult) {
    req.flash("notice", "Your review has been deleted.")
    res.render("account/management", {
        title: "Account Management",
        nav,
        errors: null,
        userReviews
    })
  } else {
    req.flash("notice", "Your review could not been deleted.")
    res.render("account/management", {
        title: "Account Management",
        nav,
        errors: null,
        userReviews
    })
  }

}



module.exports = invCont