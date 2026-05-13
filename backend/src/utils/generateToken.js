const { v4: uuidv4 } = require('uuid');

/**
 * generateToken — generates a universally unique identifier (UUID v4)
 * UUIDv4 uses random numbers, making it essentially unguessable.
 * This satisfies the security requirement for unique download links.
 */
const generateToken = () => {
  return uuidv4();
};

module.exports = generateToken;
