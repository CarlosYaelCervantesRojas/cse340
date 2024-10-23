const express = require("express")
const router = new express.Router()
const accountController = require("../controllers/accountController")
const utilities = require("../utilities")
const regValidate = require("../utilities/account-validation")

// Route to build account management view
router.get("/",
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildManagementView))
// Route to build edit account view
router.get("/update/:account_id",
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildEditAccountView))
// Route to build login view
router.get("/login", utilities.handleErrors(accountController.buildLoginView))
// Route to build register view
router.get("/register", utilities.handleErrors(accountController.buildRegisterView))


// Route to process the registration data
router.post("/register",
    regValidate.registationRules(),
    regValidate.checkRegData, 
    utilities.handleErrors(accountController.registerAccount))
// Route to process the login request
router.post("/login",
    regValidate.loginRules(),
    regValidate.checkLoginData,
    utilities.handleErrors(accountController.accountLogin))
// Route to process update account data
router.post("/update-account",
  utilities.checkLogin,
  regValidate.updateAccountDataRules(),
  regValidate.checkUpdatedAccountData,
  utilities.handleErrors(accountController.updateAccount)
)
// Route to process update password
router.post("/update-password",
  utilities.checkLogin,
  regValidate.updatePasswordRules(),
  regValidate.checkUpdatedPassword,
  utilities.handleErrors(accountController.updatePassword)
)
// Route to logout
router.post("/logout",
  utilities.handleErrors(accountController.logout)
)


module.exports = router