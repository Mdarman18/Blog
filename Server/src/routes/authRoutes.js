import { Router } from "express";
import {
  register,
  login,
  getMe,
  logout,
} from "../controllers/authController.js";
import { registerValidation } from "../validators/Register_validation.js";
import { validate } from "../middlewares/validate.js";
import { optionalAuth } from "../middlewares/auth.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication related endpoints
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user (author by default, admin needs secret key)
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 minLength: 6
 *               role:
 *                 type: string
 *                 enum: [author, admin]
 *                 default: author
 *                 description: Optional. Defaults to author.
 *               adminKey:
 *                 type: string
 *                 description: Required only when role is admin. Must match ADMIN_SECRET_KEY on server.
 *           examples:
 *             author:
 *               summary: Register as author
 *               value:
 *                 name: Arman
 *                 email: author@test.com
 *                 password: "123456"
 *                 role: author
 *             admin:
 *               summary: Register as admin (key required)
 *               value:
 *                 name: Admin User
 *                 email: admin@test.com
 *                 password: "123456"
 *                 role: admin
 *                 adminKey: your_admin_secret_key
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Invalid input or email already exists
 *       403:
 *         description: Invalid admin key
 */
router.post("/register", registerValidation, validate, register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User logged in successfully
 *       401:
 *         description: Incorrect email or password
 */
router.post("/login", login);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Logout user
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Logout successful
 *       401:
 *         description: Authentication required
 *       500:
 *         description: Internal server error
 */
router.post("/logout", logout);

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Get current authenticated user
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current user returned
 *       401:
 *         description: Not authenticated
 */
router.get("/me", optionalAuth, getMe);

export default router;
