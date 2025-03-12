// Data
const API_BASE_URL = 'http://192.168.30.212:5001';
// Home
// const API_BASE_URL = 'http://192.168.100.14:5001';

const endpoints = {
    // User API
    REGISTER: `${API_BASE_URL}/users/register`,
    LOGIN: `${API_BASE_URL}/users/login-user`,
    USERDATA: `${API_BASE_URL}/users/userdata`,
    UPDATEUSER: `${API_BASE_URL}/users/update-user`,
    CHECKEMAIL: `${API_BASE_URL}/users/check-email`,
    UPDATETOKEN: `${API_BASE_URL}/users/update-token`,
    // Notification API
    GETNOTIFICATIONSSTATUS: `${API_BASE_URL}/users/notifications`,
    UPDATENOTIFICATIONSSTATUS: `${API_BASE_URL}/users/notifications/update`,
    // Weight API
    ADDWEIGHT: `${API_BASE_URL}/bmi/add`,
    GETWEIGHT: `${API_BASE_URL}/bmi`,
    DELETEWEIGHT: `${API_BASE_URL}/bmi/delete`,
    // Blood Test API
    ADDBLOODTEST: `${API_BASE_URL}/bloodtest/add`,
    GETBLOODTEST: `${API_BASE_URL}/bloodtest`,
    UPDATEBLOODTEST: `${API_BASE_URL}/bloodtest/update`,
    DELETEBLOODTEST: `${API_BASE_URL}/bloodtest/delete`,
    // Blood Pressure API
    ADDBLOODPRESSURE: `${API_BASE_URL}/bloodpressure/add_update`,
    GETBLOODPRESSURE: `${API_BASE_URL}/bloodpressure`,
    DELETEBLOODPRESSURE: `${API_BASE_URL}/bloodpressure/delete`,
    // Lifestyle API
    ADDUPDATELIFESTYLE: `${API_BASE_URL}/lifestyle/add_update`,
    GETLIFESTYLE: `${API_BASE_URL}/lifestyle`,
    // Reminder API
    ADDREMINDER: `${API_BASE_URL}/reminder/add`,
    GETREMINDER: `${API_BASE_URL}/reminder`,
    UPDATEREMINDER: `${API_BASE_URL}/reminder/update`,
    DELETEREMINDER: `${API_BASE_URL}/reminder/delete`,
    // Heart Disease API
    GETHEARTDISEASERECORD: `${API_BASE_URL}/heartdisease`,
    PREDICT: `${API_BASE_URL}/heartdisease/predict`,
};

export default endpoints