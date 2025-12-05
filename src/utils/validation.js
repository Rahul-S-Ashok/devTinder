const validator = require("validator");

const validateSignUpData = (req) => {
  const { firstName, lastName, emailId, password } = req.body;

  if (!firstName || !lastName) {
    throw new Error("Name is not valid");
  }

  // ✅ Throw error when email is NOT valid
  if (!validator.isEmail(emailId)) {
    throw new Error("Email is not valid");
  }

  // ✅ Throw error when password is NOT strong
  if (!validator.isStrongPassword(password)) {
    throw new Error("Please enter a strong password (use uppercase, lowercase, number, and symbol)");
  }
};



const validateProfileEditData=(req)=>{
  const allowedEditFields=[
    "firstName",
    "lastName",
    "emailId",
    "photoUrl",
    "about",
    "gender",
    "age",
    "skills"
  ];

  const isEditAllowed=Object.keys(req.body).every(field=>
    allowedEditFields.includes(field)
  );

  return isEditAllowed;
}



module.exports = {
  validateSignUpData,
  validateProfileEditData,
};
