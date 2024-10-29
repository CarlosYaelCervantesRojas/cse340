const utilities = require("../utilities")
const accountModel = require("../models/account-model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const env = require("dotenv").config()


/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLoginView(req, res, next) {
    let nav = await utilities.getNav()
    res.render("./account/login", {
        title: "Login",
        nav,
        errors: null,
    })
}

/* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegisterView(req, res, next) {
    let nav = await utilities.getNav()
    res.render("./account/register", {
        title: "Register",
        nav,
        errors: null
    })
}

/* ****************************************
*  Deliver account management view
* *************************************** */
async function buildManagementView(req, res, next) {
    let nav = await utilities.getNav()
    let userReviews = await utilities.buildReviewsByAccountId(res.locals.accountData.account_id)
    res.render("account/management", {
        title: "Account Management",
        nav,
        errors: null,
        userReviews
    })
}

/* ****************************************
*  Deliver update account view
* *************************************** */
async function buildEditAccountView(req, res, next) {
    let nav = await utilities.getNav()

    if (req.params.account_id == res.locals.accountData.account_id) {
        const data = await accountModel.getAccountById(req.params.account_id)
        const {
            account_firstname,
            account_lastname,
            account_email,
            account_id
        }  = data

        res.render("account/edit-account", {
            title: "Edit Account",
            nav,
            errors: null,
            account_firstname,
            account_lastname,
            account_email,
            account_id
        })
    } else {
        req.flash("message notice", "Please check your credentials and try again.")      
        res.status(400).render("account/login", {        
            title: "Login",        
            nav,        
            errors: null,      
        })  
    }
}

/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
    let nav = await utilities.getNav()
    const { 
        account_firstname,
        account_lastname, 
        account_email, 
        account_password
    } = req.body
    
    // Hash the password before storing
    let hashedPassword
    try {
      // regular password and cost (salt is generated automatically)
      hashedPassword = await bcrypt.hashSync(account_password, 10)
    } catch (error) {
      req.flash("notice", 'Sorry, there was an error processing the registration.')
      res.status(500).render("account/register", {
        title: "Registration",
        nav,
        errors: null,
      })
    }

    const registerResult = await accountModel.registerAccount(
        account_firstname,
        account_lastname, 
        account_email, 
        hashedPassword
    )

    if (registerResult) {
        req.flash(
            "notice",
            `Congratulations, you\'re registered ${account_firstname}. Please log in.`
        )
        res.status(201).render("account/login", {
            title: "Login",
            nav,
            errors: null,
        })
    } else {
        req.flas("notice", "Sorry, the registration failed.")
        res.status(501).render("account/register", {
            title: "Registration",
            nav,
            errors: null,
        })
    }
}

/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {  
    let nav = await utilities.getNav()  
    const { account_email, account_password } = req.body  
    const accountData = await accountModel.getAccountByEmail(account_email)

    try {    
        if (await bcrypt.compare(account_password, accountData.account_password)) {      
            delete accountData.account_password      
            const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 })      
            
            if (process.env.NODE_ENV == "development") {
                res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
            } else {
                res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
            }
            return res.redirect("/account/")    
        }    
        else {      
            req.flash("message notice", "Please check your credentials and try again.")      
            res.status(400).render("account/login", {        
                title: "Login",        
                nav,        
                errors: null,        
                account_email,      
            })    
        }  
    } catch (error) {    
        return new Error('Access Forbidden')  
    }}

/* ****************************************
 *  Process new account data
 * ************************************ */
async function updateAccount(req, res) {

    const {
        account_firstname,
        account_lastname,
        account_email,
        account_id
    } = req.body

    const updateResult = await accountModel.updateAccountData(
        account_firstname,
        account_lastname,
        account_email,
        account_id
    )

    let nav = await utilities.getNav()
    let userReviews = await utilities.buildReviewsByAccountId(res.locals.accountData.account_id)

    if (updateResult) {
        // Could be updated the authentication cookie,
        // so that payload contains the new updated data,
        // if not, the accountData variable stored in "locals" will only be updated
        // when the user logs out and logs in again.
        res.clearCookie("jwt")
        delete res.locals.accountData
        delete res.locals.loggedin

        const accountData = await accountModel.getAccountByEmail(account_email)
        delete accountData.account_password 
        const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 })
        if (process.env.NODE_ENV == "development") {
            res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
        } else {
            res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
        }

        res.locals.accountData = accountData
        res.locals.loggedin = 1

        req.flash("notice", "Acounnt succesfully udpated.")
        res.status(201).render("account/management", {
            title: "Account Management",
            nav,
            errors: null,
            userReviews
        })
    } else {
        req.flash("notice", "Sorry, something went wrong.")
        res.status(501).render("account/management", {
            title: "Account Management",
            nav,
            errors: null,
            userReviews
        })
    }
}

/* ****************************************
 *  Process new password
 * ************************************ */
async function updatePassword(req, res) {
    let nav = utilities.getNav()
    let userReviews = await utilities.buildReviewsByAccountId(res.locals.accountData.account_id)
    const {
        account_password,
        account_id
    } = req.body

    try {
        newHashedPassword = await bcrypt.hashSync(account_password, 10)
    } catch (error) {
        req.flash("notice", 'Sorry, there was an error processing new password.')
        res.status(500).render("account/edit-account", {
          title: "Edit Account",
          nav,
          errors: null,
          userReviews
        })
    }

    const updateResult = await accountModel.updatePassword(newHashedPassword, account_id)   
    
    if (updateResult) {
        req.flash("notice", "Password succesfully udpated.")
        res.status(201).render("account/management", {
            title: "Account Management",
            nav,
            errors: null,
            userReviews
        })
    } else {
        req.flash("notice", "Sorry, something went wrong.")
        res.status(501).render("account/management", {
            title: "Account Management",
            nav,
            errors: null,
            userReviews
        })
    }
}

/* ****************************************
 *  Process logout
 * ************************************ */
async function logout(req, res) {
    let nav = await utilities.getNav()

    delete res.locals.accountData
    delete res.locals.loggedin

    res.clearCookie("jwt")

    req.flash("notice", "Come back soon.")
    res.status(200).render("index", {
        title: "Home",
        nav
    })
    
}


module.exports = {  buildLoginView, buildRegisterView, buildManagementView, buildEditAccountView, registerAccount, accountLogin, updateAccount, updatePassword, logout  }