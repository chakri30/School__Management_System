const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Admin = require('../models/adminSchema.js');
const Sclass = require('../models/sclassSchema.js');
const Student = require('../models/studentSchema.js');
const Teacher = require('../models/teacherSchema.js');
const Subject = require('../models/subjectSchema.js');
const Notice = require('../models/noticeSchema.js');
const Complain = require('../models/complainSchema.js');

const adminRegister = async (req, res) => {
    try {
        const existingAdminByEmail = await Admin.findOne({ email: req.body.email });
        const existingSchool = await Admin.findOne({ schoolName: req.body.schoolName });

        if (existingAdminByEmail) {
            return res.send({ message: 'Email already exists' });
        }
        if (existingSchool) {
            return res.send({ message: 'School name already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(req.body.password, salt);

        const admin = new Admin({
            ...req.body,
            password: hashedPass
        });

        let result = await admin.save();
        result.password = undefined;
        res.send(result);

    } catch (err) {
        res.status(500).json(err);
    }
};

const adminLogIn = async (req, res) => {
    try {
        if (!req.body.email || !req.body.password) {
            return res.send({ message: "Email and password are required" });
        }

        let admin = await Admin.findOne({ email: req.body.email });
        if (!admin) {
            return res.send({ message: "User not found" });
        }

        const validated = await bcrypt.compare(req.body.password, admin.password);
        if (!validated) {
            return res.send({ message: "Invalid password" });
        }

        const token = jwt.sign(
            { id: admin._id, role: "Admin" },
            process.env.SECRET_KEY,
            { expiresIn: "7d" }
        );

        admin.password = undefined;
        res.send({ ...admin._doc, token });

    } catch (err) {
        res.status(500).json(err);
    }
};

const getAdminDetail = async (req, res) => {
    try {
        let admin = await Admin.findById(req.params.id);
        if (admin) {
            admin.password = undefined;
            res.send(admin);
        } else {
            res.send({ message: "No admin found" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

module.exports = { adminRegister, adminLogIn, getAdminDetail };