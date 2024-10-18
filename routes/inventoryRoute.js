// Needed Resources
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const utilities = require("../utilities")
const classificationValidation = require("../utilities/classification-validation")
const vehicleValidation = require("../utilities/vehicle-validation")


// Route to build management view
router.get("/", utilities.handleErrors(invController.buildManagementView))
// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId))
// Route to build inventory item detail view
router.get("/detail/:inventoryId", utilities.handleErrors(invController.buildByInventoryId))
// Route to build add classification view
router.get("/add-classification", utilities.handleErrors(invController.buildAddClassificationView))
// Route to build add inventory view
router.get("/add-inventory", utilities.handleErrors(invController.buildAddInventoryView))
// Route to request inventory data
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))
// Route to build edit inventory view
router.get("/edit/:inventory_id", utilities.handleErrors(invController.buildEditInventoryView))
// Route to build delete confirmation view
router.get("/delete/:inventory_id", utilities.handleErrors(invController.buildDeleteConfirmationView))

// Route to process the new classification data
router.post("/add-classification",
    classificationValidation.classificationRules(),
    classificationValidation.checkClassificationData,
    utilities.handleErrors(invController.addClassification)
)
// Route to process the new vehicle data
router.post("/add-inventory", 
    vehicleValidation.vehicleRules(),
    vehicleValidation.checkVehicleData,
    utilities.handleErrors(invController.addVehicle)
)

// Route to process the update vehicle data
router.post("/update/",
    vehicleValidation.vehicleRules(),
    vehicleValidation.checkVehicleUpdateData,
    utilities.handleErrors(invController.updateVehicle))
// Route to process the update vehicle data
router.post("/delete/",
    // vehicleValidation.vehicleRules(),
    // vehicleValidation.checkVehicleUpdateData,
    utilities.handleErrors(invController.deleteVehicle))


module.exports = router;