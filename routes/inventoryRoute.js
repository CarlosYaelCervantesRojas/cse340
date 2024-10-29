// Needed Resources
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const utilities = require("../utilities")
const classificationValidation = require("../utilities/classification-validation")
const vehicleValidation = require("../utilities/vehicle-validation")
const reviewValidation = require("../utilities/review-validation")


// Route to build management view
router.get("/", 
    utilities.checkAccountType,
    utilities.handleErrors(invController.buildManagementView))
// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId))
// Route to build inventory item detail view
router.get("/detail/:inventoryId", utilities.handleErrors(invController.buildByInventoryId))
// Route to build add classification view
router.get("/add-classification",
    utilities.checkAccountType,
    utilities.handleErrors(invController.buildAddClassificationView))
// Route to build add inventory view
router.get("/add-inventory",
    utilities.checkAccountType,
    utilities.handleErrors(invController.buildAddInventoryView))
// Route to request inventory data
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))
// Route to build edit inventory view
router.get("/edit/:inventory_id",
    utilities.checkAccountType,
    utilities.handleErrors(invController.buildEditInventoryView))
// Route to build delete confirmation view
router.get("/delete/:inventory_id",
    utilities.checkAccountType,
    utilities.handleErrors(invController.buildDeleteConfirmationView))
// Route to build edit review view
router.get("/edit-review/:review_id",
    utilities.checkLogin,
    utilities.handleErrors(invController.buildUpdateReviewView))
// Route to build delete review view
router.get("/delete-review/:review_id",
    utilities.checkLogin,
    utilities.handleErrors(invController.buildDeleteReviewView))


// Route to process the new classification data
router.post("/add-classification",
    utilities.checkAccountType,
    classificationValidation.classificationRules(),
    classificationValidation.checkClassificationData,
    utilities.handleErrors(invController.addClassification)
)
// Route to process the new vehicle data
router.post("/add-inventory", 
    utilities.checkAccountType,
    vehicleValidation.vehicleRules(),
    vehicleValidation.checkVehicleData,
    utilities.handleErrors(invController.addVehicle)
)
// Route to process the review data
router.post("/add-review", 
    utilities.checkLogin,
    reviewValidation.reviewRules(),
    reviewValidation.checkReviewData,
    utilities.handleErrors(invController.addReview)
)

// Route to process the update vehicle data
router.post("/update/",
    utilities.checkAccountType,
    vehicleValidation.vehicleRules(),
    vehicleValidation.checkVehicleUpdateData,
    utilities.handleErrors(invController.updateVehicle))
// Route to process the update review data
router.post("/edit-review",
    utilities.checkLogin,
    reviewValidation.reviewRules(),
    reviewValidation.checkUpdatedReviewData,
    utilities.handleErrors(invController.updateReview))
// Route to delete vehicle data
router.post("/delete/",
    utilities.checkAccountType,
    utilities.handleErrors(invController.deleteVehicle))
// Route to delete review data
router.post("/delete-review",
    utilities.checkLogin,
    utilities.handleErrors(invController.deleteReview))


module.exports = router;