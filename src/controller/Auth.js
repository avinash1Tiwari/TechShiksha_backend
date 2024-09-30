// otpsender
// signUp
// login
const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const Otp = require("../models/Otp");
const mailsender = require("../utils/common/mailSender");
const otpGenerator = require("otp-generator");
const { response } = require("express");
const { StatusCodes } = require("http-status-codes");
const { accountType } = require("../utils/common/Enum");

const sendOTP = async (req, res) => {
  try {
    // find email
    const { email } = req.body;

    // check if email already exists
    const checkUserPresent = await User.find({ email: email });

    if (checkUserPresent) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "User already exist",
      });
    }

    // generate otp
    var otp = otpGenerator(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    console.log("Generated otp : ", otp);

    // checking whether generated otp is unique otp or not

    let result = Otp.findOne({ otp: otp });

    // 41-52 -> this code part can be optimising by other library, but for now i am using it.
    while (result) {
      otp = otpGenerator(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      });

      result = Otp.findOne({ otp: otp });
    }

    const otpPayLoad = { email, otp };

    // cretate entry of otp in Otp-model
    const otpBody = await Otp.create(otpPayLoad);
    console.log(otpBody);

    res.status(StatusCodes.OK).json({
      success: true,
      message: "OTP sent successfully",
      otp: otp,
    });
  } catch (error) {
    console.log("error occured during sending otp : ", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "something went wrong while sending otp",
      error: error.message,
    });
  }
};

const signUp = async (req, res) => {
  try {
    const {
      firstname,
      lastname,
      email,
      phoneNumber,
      accountType,
      password,
      confirmPassword,
      otp,
      additionalDetails,
    } = req.body;

    if (
      !firstname ||
      !lastname ||
      !email ||
      !phoneNumber ||
      !password ||
      !confirmPassword ||
      !otp ||
      !additionalDetails
    ) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "All fields are required",
      });
    }
    // above I am not checking for accountType => as there is definetely an accounttype wiil be from
    // frontend either student or instructor from button toggle

    if (password !== confirmPassword) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Password and confirmPassword did not match, try again",
      });
    }

    let existingUser;

    try {
      existingUser = await User.findOne({ email: email });
    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "somehting went wrong while checking user-details",
      });
    }

    if (existingUser) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "user already exist",
      });
    }

    // as during the creation of unique-otp, multiple otps gets saved corresponding to same user => find the OTP which is most recently stored.

    const recentOtp = await Otp.find({ email })
      .sort({ createdAt: -1 })
      .limit(1);

    if (recentOtp.length == 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Otp not found, please try again",
      });
    }

    if (recentOtp !== otp) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Otp not matched, please try again",
      });
    }

    const profileDetails = await Profile.create({
      gender: null,
      dateOfBirth: null,
      about: null,
    });

    const user = await User.create({
      firstname,
      lastname,
      email,
      phoneNumber,
      password,
      accountType,
      additionalDetails: profileDetails._id,
      image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstname} ${lastname}`,
    });

    return res.status(StatusCodes.OK).json({
      success: true,
      message: "successfully registerd",
      user,
    });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "something went wrong",
    });
  }
};

const Login = (req, res) => {
  const { email, password } = req.body;

  if(!email || !password){
    return res.status(StatusCodes.BAD_REQUEST).json({
      success : false,
      message : 'all fields are required'
    })
  }

  let existingUser;

  try {
    existingUser = User.findOne({ email }).populate("additionalDetails");
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      data: "something went wrong",
      message: error.message,
    });
  }

  if (!existingUser) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      data: "User not found . Please SignUp !!",
      message: "",
    });
  }

  const isPasswordMatch = bcrypt.compareSync(password, existingUser.password);
  if (!isPasswordMatch) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      data: "Invalid Email/password",
      message: "",
    });
  }

const payLoad =  { id: existingUser._id,
   email: existingUser.email,
   accountType : existingUser.accountType 
  }

  const token = jwt.sign(
   payLoad,
    ServerConfig.SECRETE_KEY,
    { expiresIn: ServerConfig.JWT_EXPIRE_TIME }
  );
  
  existingUser.token = token;
  existingUser.password = undefined;

  // if cookie already present => then remove cookie first then set cookie again(this concept is added b/c as we refresh our cookie agai and agin every after 30-seconds)
  if (req.cookies[`${existingUser._id}`]) {
    req.cookies[`${existingUser._id}`] = "";
  }

  const options = {
    expires:new Date(Date.now() + 3*24*60*60*1000),
    httpOnly:true,
    sameSite: "lax",
    path: "/",
  }
  // cookie generation from backend
  res.cookie(("token", token,options).status(200).json({
  
    success:true,
    token,
    existingUser,
    message : "Logged in successfully"

  }))
   
};

const changePassword = async (req, res) => {
  try {
    const { email, oldPassword, newPassword } = req.body;

    if (!email || !oldPassword || !newPassword) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "All field are required",
      });
    }

    let existingUser;
    try {
      existingUser = User.findOne({ email }).populate("additionalDetails");
    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        data: "something went wrong",
        message: error.message,
      });
    }

    if (!existingUser) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        data: "User not found . Please SignUp !!",
        message: "",
      });
    }
    const saltRounds = parseInt(ServerConfig.SALT_ROUND, 10);
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
    existingUser.password = hashedPassword;

    mailsender(
      existingUser.email,
      "Change password",
      "Successfully updated the password"
    );

    return res.status(StatusCodes.OK).json({
      success: true,
      message: "Successfully updated the password",
      existingUser,
    });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Something went wrong",
    });
  }
};
