const express = require("express")
const router = new express.Router()
const accountController = require("../controllers/accountController")
const utilities = require("../utilities")
const regValidate = require("../utilities/account-validation")

// Route to build account management view
router.get("/",
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildManagementView))
// Route to build login view
router.get("/login", utilities.handleErrors(accountController.buildLoginView))
// Route to build register view
router.get("/register", utilities.handleErrors(accountController.buildRegisterView))


// Route to process the registration data
router.post(
    "/register",
    regValidate.registationRules(),
    regValidate.checkRegData, 
    utilities.handleErrors(accountController.registerAccount))

// Process the login attempt
router.post(
    "/login",
    regValidate.loginRules(),
    regValidate.checkLoginData,
    utilities.handleErrors(accountController.accountLogin)
  )

module.exports = router