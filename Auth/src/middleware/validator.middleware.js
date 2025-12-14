const { body , validationResult }=require('express-validator')

 
const respondValidationErrors= (req,res,next)=>{
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }
    next();
}


const registerUserValidations = [
    body("username")
        .isString()
        .withMessage("Username must be String")
        .isLength({min:3})
        .withMessage("Username must be at least 3 characters long "),
    body("email")
        .isEmail()
        .withMessage("Invalid Email ID"),
    body("password")
        .isLength({min:6})
        .withMessage("Password Should be minimum 6 charaters"),
    body("fullname")
        .isString()
        .withMessage("Fullname should be String")
        .notEmpty()
        .withMessage("Fullname is Required!"),
    body('role')
        .optional()
        .isIn(['user','seller'])
        .withMessage("Role must be either user or seller"),
    respondValidationErrors
]



const loginUserValidation = [
    body("email")
        .optional()
        .isEmail()
        .withMessage("Invalid Email-ID"),
    body("username")
        .optional()
        .isString()
        .withMessage("Invalid Username"),
    body("password")
        .isLength({min:6})
        .withMessage("Password should be minimum 6 characters"),
    body()
        .custom((value, { req }) => {
            const { email, username } = req.body;
            if (!email && !username) {
                throw new Error("Either email or username is required");
            }
            return true;
        }),
    respondValidationErrors
]

const addressValidation = [
    body("street")
        .isString()
        .withMessage("Street must be a string")
        .notEmpty()
        .withMessage("Street is Required"),
    body("city")
        .isString()
        .withMessage("City must be a string")
        .notEmpty()
        .withMessage("City is Required"),
    body("state")
        .isString()
        .withMessage("state must be a string")
        .notEmpty()
        .withMessage("state is Required"),
    body("zip")
        .isString()
        .withMessage("zip must be a string")
        .notEmpty()
        .withMessage("zip is Required"),
    body("pincode")
        .isString()
        .withMessage("pincode must be a string")
        .notEmpty()
        .withMessage("pincode is Required"),
    validationResult
]


module.exports={registerUserValidations,loginUserValidation,addressValidation}