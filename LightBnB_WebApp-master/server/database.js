const properties = require('./json/properties.json');
const users = require('./json/users.json');
const {Pool} = require('pg');

const pool = new Pool({
  user: 'vagrant',
  password: '123',
  host: 'localhost',
  database: 'lightbnb'
});

/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */

const getUserWithEmail = function(email) {
  return pool.query(`
  SELECT * FROM users
  WHERE email = '${email}'`)
  .then(res => res.rows[0])
  .catch(err => null)
}
exports.getUserWithEmail = getUserWithEmail;

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function(id) {
  return pool.query(`
  SELECT * FROM users
  WHERE id = '${id}'`)
  .then(res => res.rows[0])
  .catch(err => null) 
}

exports.getUserWithId = getUserWithId;


/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser =  function(user) {
  const sqlQuery = `INSERT INTO users
  (name, email, password)
  VALUES ($1, $2, $3) RETURNING *;`
  const values = [`${user.name}`, `${user.email}`, `${user.password}`];
  return pool.query(sqlQuery, values)
  .then(res => res.rows[0])
  .catch(err => null) 
}
exports.addUser = addUser;

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function(guest_id, limit = 10) {
  const sqlQuery = `SELECT reservations.*, properties.*, avg(property_reviews.rating) AS average_rating
  FROM property_reviews
  JOIN reservations 
  ON property_reviews.property_id = reservations.property_id
  JOIN properties
  ON reservations.property_id = properties.id
  WHERE reservations.guest_id = $1
  AND reservations.end_date < now()::date
  GROUP BY reservations.id, properties.id
  ORDER BY reservations.start_date
  LIMIT $2;`
  const values = [`${guest_id}`, `${limit}`]
  return pool.query(sqlQuery, values)
  .then(res => res.rows)
  .catch(err => null)
}
exports.getAllReservations = getAllReservations;

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
const getAllProperties = function(options, limit = 10) {
  //Array to hold parameters for the query
  const sqlParams = [];

  //Query information before the WHERE clause
  let sqlQuery = `SELECT properties.*, avg(property_reviews.rating) AS average_rating
  FROM properties
  JOIN property_reviews ON properties.id = property_id
  `;

  //Checking if the options object has a city
  if (options.city) {
    sqlParams.push(`%${options.city}%`);
    sqlQuery += `WHERE city LIKE $${sqlParams.length}`;
  }

  //Checking if the options object has an owner
  if (options.owner_id) {
    if (sqlParams.length >= 1) {
      sqlParams.push(`${options.owner_id}`);
      sqlQuery += `AND owner_id = $${sqlParams.length}`;
    } else {
      sqlParams.push(`${options.owner_id}`);
      sqlQuery += `WHERE owner_id = $${sqlParams.length}`;
    }
  }

  //Properties within a price range
  if (options.minimum_price_per_night && options.maximum_price_per_night) {
    if (sqlParams.length >= 1) {
      sqlParams.push(`${options.minimum_price_per_night}`);
      sqlQuery += `AND cost_per_night >= $${sqlParams.length}`;
      sqlParams.push(`${options.maximum_price_per_night}`);
      sqlQuery += ` AND cost_per_night <= $${sqlParams.length}`;
    } else {
      sqlParams.push(`${options.minimum_price_per_night}`);
      sqlQuery += `WHERE cost_per_night >= $${sqlParams.length}`;
      sqlParams.push(`${options.maximum_price_per_night}`);
      sqlQuery += ` AND cost_per_night <= $${sqlParams.length}`;
    }
  }

  //Checking if the options object has a mimumum rating
  if (options.minimum_rating) {
    if (sqlParams.length >= 1) {
      sqlParams.push(`${options.minimum_rating}`);
      sqlQuery += `AND property_reviews.rating >= $${sqlParams.length}`;
    } else {
      sqlParams.push(`${options.minimum_rating}`);
      sqlQuery += `WHERE property_reviews.rating >= $${sqlParams.length}`;
    }
  }

  //Query information that comes after the WHERE clause
  sqlParams.push(limit);
  sqlQuery += `GROUP BY properties.id
  ORDER BY cost_per_night
  LIMIT $${sqlParams.length};`;

  //Check to ensure everything is correct
  // console.log(sqlQuery, sqlParams)

  //Run the query
  return pool.query(sqlQuery, sqlParams)
  .then(res => res.rows)
  .catch(err => null);
}

exports.getAllProperties = getAllProperties;


/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function(property) {
  const sqlQuery = `INSERT INTO properties
  (owner_id, title, description, thumbnail_photo_url, cover_photo_url, cost_per_night, street, city, provice, post_code, country, parking_spaces, number_of_bathrooms, number_of_bedrooms)
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING *;`
  const values = [`${property.owner_id}`, `${property.title}`, `${property.description}`, `${property.thumbnail_photo_url}`, `${property.cover_photo_url}`, `${property.cost_per_night}`, `${property.street}`, `${property.city}`, `${property.province}`, `${property.post_code}`, `${property.country}`, `${property.parking_spaces}`, `${property.number_of_bathrooms}`, `${property.number_of_bedrooms}`];

  return pool.query(sqlQuery, values)
  .then(res => res.rows[0])
  .catch(err => null) 
}
exports.addProperty = addProperty;
