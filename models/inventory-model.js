const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications(){
    return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

/* ***************************
 *  Get all classification names by Id
 * ************************** */
async function getClassificationById(classification_id) {
  try {
    const sql = "SELECT * FROM classification WHERE classification_id = $1"
    const data = await pool.query(sql, [classification_id])
    return data.rows[0].classification_name
  } catch (error) {
    console.error("getclassificationbyid error" + error)
  }
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
    try {
      const data = await pool.query(
        `SELECT * FROM public.inventory AS i
        JOIN public.classification AS c 
        ON i.classification_id = c.classification_id 
        WHERE i.classification_id = $1`,
        [classification_id]
      )
      return data.rows
    } catch (error) {
      console.error("getclassificationsbyid error " + error)
    }
  }

/* ***************************
 *  Get a specific inventory item data
 * ************************** */
async function getItemByInventoryId(inventory_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory
      WHERE inv_id = $1`,
      [inventory_id]
    )
    return data.rows[0]
  } catch (error) {
    console.error("getitembyid error" + error)
  }
}

/* ***************************
 *  Get reviews by inventory id
 * ************************** */
async function getReviewsByInventoryId(inv_id) {
  try {
    const data = await pool.query(
      `SELECT account_firstname, account_lastname, review_text, review_date, r.inv_id, r.account_id
	      FROM public.review AS r
	      JOIN public.inventory AS i
	      ON r.inv_id = i.inv_id
        JOIN public.account as a
 	      ON r.account_id = a.account_id
        WHERE r.inv_id = $1
        ORDER BY review_date DESC;`,
      [inv_id]
    )
    return data.rows
  } catch (error) {
    console.error("get review error" + error)
  }
}

/* ***************************
 *  Get reviews by account id
 * ************************** */
async function getReviewsByAccountId(account_id) {
  try {
    const data = await pool.query(
      `SELECT review_id, review_text, review_date, r.inv_id, r.account_id, i.inv_year, i.inv_make, i.inv_model
 	      FROM public.review AS r
 	      JOIN public.inventory AS i
 	      ON r.inv_id = i.inv_id
 	      JOIN public.account as a
 	      ON r.account_id = a.account_id
      WHERE a.account_id = $1
      ORDER BY review_date DESC;`,
      [account_id]
    )
    return data.rows
  } catch (error) {
    console.error("get review error" + error)
  }
}

/* ***************************
 *  Get review by review id
 * ************************** */
async function getReviewByReviewId(review_id) {
  try {
    const data = await pool.query(
      `SELECT review_id, review_text, review_date, inv_make, inv_model, inv_year 
        FROM public.review AS r
 	        JOIN public.inventory AS i
 	        ON r.inv_id = i.inv_id
      WHERE r.review_id = $1;`,
      [review_id]
    )
    return data.rows[0]
  } catch (error) {
    console.error("get review error" + error)
  }
}

/* ***************************
 *  Check for existing classification
 * ************************** */
async function checkExistingClassification(classification_name) {
  try {
    const sql = "SELECT * FROM classification WHERE classification_name = $1"
    const classification = await pool.query(sql, [classification_name])
    return classification.rowCount
  } catch (error) {
    return error.message
  }
}

/* ***************************
 *  Add new classification data
 * ************************** */
async function addClassification(classification_name) {
  try {
    const sql = "INSERT INTO classification (classification_name) VALUES ($1) RETURNING *"    
    return await pool.query(sql, [classification_name])
  } catch (error) {
    console.error("addclassification" + error)
  }
}

/* ***************************
 *  Add new vehicle data
 * ************************** */
async function addVehicle(inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id) {
  try {
    const sql = "INSERT INTO inventory (inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *"
    return await pool.query(sql, [
      inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id
    ])
  } catch (error) {
    console.error("addvehicle" + error)
  }
}

/* ***************************
 *  Add new review data
 * ************************** */
async function addReview(review_text, account_id, inv_id) {
  try {
    const sql = "INSERT INTO review (review_text, account_id, inv_id) VALUES ($1, $2, $3) RETURNING *"    
    return await pool.query(sql, [review_text, account_id, inv_id])
  } catch (error) {
    console.error("addclassification" + error)
  }
}

/* ***************************
 *  Update existing vehicle data
 * ************************** */
async function updateVehicle(
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
  classification_id) {
  try {
    const sql = "UPDATE public.inventory SET inv_make = $1, inv_model = $2, inv_description = $3, inv_image = $4, inv_thumbnail = $5, inv_price = $6, inv_year = $7, inv_miles = $8, inv_color = $9, classification_id = $10 WHERE inv_id = $11 RETURNING *"
    const data = await pool.query(sql, [
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
      inv_id
    ])
    return data.rows[0]
  } catch (error) {
    console.error("model error: " + error)
  }
}

/* ***************************
 *  Update existing review data
 * ************************** */
async function updateReview(review_text, review_id) {
  try {
    const sql = "UPDATE public.review set review_text = $1 WHERE review_id = $2 RETURNING *"
    const result = await pool.query(sql, [review_text, review_id])
    return result.rowCount
  } catch (error) {
    console.log(error.message)
  }
}

/* ***************************
 *  Delete existing vehicle data
 * ************************** */
async function deleteVehicle(inv_id) {
  try {
    const sql = 'DELETE FROM inventory WHERE inv_id = $1'
    const data = await pool.query(sql, [inv_id])
    return data
  } catch (error) {
    console.error("Delete Vehicle Error " + error)
  }
}

/* ***************************
 *  Delete existing review data
 * ************************** */
async function deleteReview(review_id) {
  try {
    const sql = 'DELETE FROM review WHERE review_id = $1 RETURNING *'
    const data = await pool.query(sql, [review_id])
    return data.rowCount
  } catch (error) {
    console.error("Delete review Error " + error)
  }
}



module.exports = { getClassifications, getClassificationById, getInventoryByClassificationId, getItemByInventoryId, getReviewsByInventoryId, getReviewsByAccountId, getReviewByReviewId, checkExistingClassification, addClassification, addVehicle, addReview, updateVehicle, updateReview, deleteVehicle, deleteReview }