import express from "express";
import { booksCount } from '../controllers/bookController.js';
import {dialogflowWebhook} from '../controllers/buyerController.js';
import {
    signupSeller,
    loginSeller,
    getDetails,
    getSellers,
    getCountSellers,
    subscribePlan, 
    getSellerDetailsById,
    updateSellerDetailsById,
    editUserProfile,
    deleteSellerById,
    uploadBook,
    logout,
    deleteBook
} from "../controllers/sellerController.js"; 
import { 
    signupBuyer, 
    loginBuyer, 
    postRequest, 
    exploreBuyer, 
    getBuyers, 
    updateBuyer, 
    editBuyerProfile,
    deleteBuyer, 
    countBuyers, 
    getBookStatus,
} from "../controllers/buyerController.js";
import { 
    getRequestsBySellerId, 
    approveRequest, 
    rejectRequest 
} from "../controllers/requestControllers.js"; 
import { 
    getSubscriptions 
} from "../controllers/subscriptionController.js"; 
import { adminStatus } from "../controllers/adminController.js";
import multer from 'multer'; // Middleware for handling file uploads

const upload = multer(); 
const router = express.Router();

// Sellers
router.post("/signupSeller", signupSeller);
router.post("/loginSeller", loginSeller);
router.get("/details", getDetails);
router.get("/sellers", getSellers); // admin
router.post("/Edituserprofile",editUserProfile)
router.get("/countSellers", getCountSellers); // admin
router.get("/sellerdetails/:id", getSellerDetailsById);
router.put("/sellers/:id", updateSellerDetailsById);
router.delete("/sellers/:id", deleteSellerById); // admin
router.delete("/deleteBook/:id",deleteBook);
router.post("/logout", logout);

// Buyers
router.post("/signupBuyer", signupBuyer);
router.post("/loginBuyer", loginBuyer);
router.post("/Editbuyerprofile",editBuyerProfile)
router.get("/explore", exploreBuyer);
router.get("/buyers", getBuyers); // admin
router.put("/buyers/:id", updateBuyer);
router.delete("/buyers/:id", deleteBuyer); // admin
router.get("/countBuyers", countBuyers); // admin
router.get("/status", getBookStatus);

// Requests
router.post("/request", postRequest);
router.get("/requests/:sellerId", getRequestsBySellerId);
router.put("/requests/:bookId/approve", approveRequest);
router.put("/requests/:bookId/reject", rejectRequest);

// Subscriptions
router.post("/subscribe/:selectedPlan", subscribePlan);
router.get("/subscriptions", getSubscriptions);
router.post("/adminStatus", adminStatus);

// Books 

router.get('/books/count', booksCount);  // admin
router.post('/uploadBook', upload.single('image'), uploadBook);

// Chatbot

router.post("/webhook", dialogflowWebhook);

export default router;
