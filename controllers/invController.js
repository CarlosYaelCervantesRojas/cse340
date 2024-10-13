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
  res.render("inventory/item", {
    title: className,
    nav,
    grid
  })
}

/* ***************************
 *  Deliver management view
 * ************************** */
invCont.buildManagementView = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("inventory/management", {
    title: "Vehicle Management",
    nav,
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

/* ****************************************
*  Process new classification
* *************************************** */
invCont.addClassification = async function (req, res, next) {
  const {
    classification_name
  } = req.body

  const classificationResult = await invModel.addClassification(classification_name)

  let nav = await utilities.getNav()

  if (classificationResult) {
    req.flash("notice", `${classification_name} has been added.`)
    res.status(201).render("inventory/management", {
      title: "Vehicle Management",
      nav
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

  if (vehicleResult) {
    req.flash("notice", `${inv_make} ${inv_model} has been added.`)
    res.status(201).render("inventory/management", {
      title: "Vehicle Management",
      nav,
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

module.exports = invCont