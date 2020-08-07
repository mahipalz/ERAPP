//for ios only
export const K_IOS_APP_VERSION = "Version 1.0_build_1.53(stage)";
//for android only
export const K_ANDROID_APP_VERSION = "Version 1.0_build_1.53(stage)";

export const env = "test";
// export const env = "local";
export const domain = "https://stage.easyrecognition.com";
// export const domain = "https://www.easyrecognition.com";

//API root url for concatination
export const API_ROOT_URL = domain + "/erwebapi/api";

export const API_CONNECT_URL =
  domain + "/erwebapi/api/Login/GetOrganizationListByEmail";

export const TERMS_URL = domain + "/Content/Terms/terms_conditions.pdf";

//DO NOT DELETE
export const MSG_SERVER_ERROR =
  "A server error stopped your order from being placed";

//export const API_CONNECT_URL = domain + "/erwebapi/api/Login/GetTextMessage";

//messages
export const MSG_EMAIL_INVALID =
  "Entered email address is invalid. Please try again";
export const MSG_MOBILE_INVALID =
  "Entered mobile number is invalid. Please try again";
export const MSG_PWD_EMPTY = "Please enter your password";
export const MSG_INVALID_USER = "Invalid login credentials";
export const MSG_EMAIL_EMPTY =
  "Please enter your registered Email ID or Mobile Number";
export const MSG_REDEEM_NO_PRODUCTS = "No products found";
export const MSG_REDEEM_NO_POINTS =
  "You do not have sufficient points to redeem this product";
export const MSG_REDEEM_EMPTY_CART =
  "You do not have any products in your cart";
export const MSG_REDEEM_DELETE_CART =
  "Do you want to delete this product from your cart?";
export const MSG_NO_AWARD_WALL = "No awards found";
export const MSG_NO_RECOGNITIONS = "No recognitions found";
export const MSG_COMMENT_EMPTY = "Please enter your comments";
export const MSG_LIKE_SUCCESS = "Like successfully submitted";
export const MSG_LIKE_ERROR = "Unable to submit your LIKE. Please try again";
export const MSG_COMMENT_SUCCESS = "Your comments successfully submitted";
export const MSG_COMMENT_ERROR =
  "Unable to submit your comments. Please try again";
export const MSG_NO_PENDING_APPROVAL = "No awards found pending your approval";
export const MSG_NO_ACCESS =
  "Please contact your HR admin to access this feature";
export const MSG_REJECTION_REASON = "Please enter reason for rejection";
export const MSG_POINTS_EMPTY = "Please enter award points";
export const MSG_POINTS_INVALID = "Please enter points within the range";
export const MSG_LOGOUT = "Are you sure you want to Log out of application?";
export const MSG_OTP_EMPTY = "Please enter your OTP";
export const MSG_OTP_EXPIRED = "OTP is expired. Please tap on resend OTP";
export const MSG_OTP_INVALID = "The OTP entered is incorrect";
export const MSG_CITATION_EMPTY = "Please enter citation text";
export const MSG_OTP_RESEND =
  "OTP has been re-sent to your registered mobile number";
export const MSG_RECIPIENT_EMPTY = "Please select a recipient";
export const MSG_DT_TIME_EMPTY = "Please select a date";
export const MSG_NO_CERTIFICATE = "Certificate is not available";

export const MSG_CERTIFICATE_SENT =
  "Certificate has been successfully sent to your email";

export const MSG_SESSION_OUT =
  "As you logged in from another device, your session is lost. Please login again";
