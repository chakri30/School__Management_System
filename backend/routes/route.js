const router = require('express').Router();
const { body, validationResult } = require('express-validator');

const { adminRegister, adminLogIn, getAdminDetail } = require('../controllers/admin-controller.js');
const { sclassCreate, sclassList, deleteSclass, deleteSclasses, getSclassDetail, getSclassStudents } = require('../controllers/class-controller.js');
const { complainCreate, complainList } = require('../controllers/complain-controller.js');
const { noticeCreate, noticeList, deleteNotices, deleteNotice, updateNotice } = require('../controllers/notice-controller.js');
const {
    studentRegister,
    studentLogIn,
    getStudents,
    getStudentDetail,
    deleteStudents,
    deleteStudent,
    updateStudent,
    studentAttendance,
    deleteStudentsByClass,
    updateExamResult,
    clearAllStudentsAttendanceBySubject,
    clearAllStudentsAttendance,
    removeStudentAttendanceBySubject,
    removeStudentAttendance
} = require('../controllers/student_controller.js');
const { subjectCreate, classSubjects, deleteSubjectsByClass, getSubjectDetail, deleteSubject, freeSubjectList, allSubjects, deleteSubjects } = require('../controllers/subject-controller.js');
const { teacherRegister, teacherLogIn, getTeachers, getTeacherDetail, deleteTeachers, deleteTeachersByClass, deleteTeacher, updateTeacherSubject, teacherAttendance } = require('../controllers/teacher-controller.js');

// ── Validation middleware helper ──────────────────────────────
const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

// ── Admin ─────────────────────────────────────────────────────

router.post('/AdminReg', [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('schoolName').notEmpty().withMessage('School name is required'),
    body('name').notEmpty().withMessage('Name is required'),
], validate, adminRegister);

router.post('/AdminLogin', [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
], validate, adminLogIn);

router.get('/Admin/:id', getAdminDetail);

// ── Student ───────────────────────────────────────────────────

router.post('/StudentReg', [
    body('name').notEmpty().withMessage('Name is required'),
    body('rollNum').notEmpty().withMessage('Roll number is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
], validate, studentRegister);

router.post('/StudentLogin', [
    body('rollNum').notEmpty().withMessage('Roll number is required'),
    body('studentName').notEmpty().withMessage('Student name is required'),
    body('password').notEmpty().withMessage('Password is required'),
], validate, studentLogIn);

router.get('/Students/:id', getStudents);
router.get('/Student/:id', getStudentDetail);

router.delete('/Students/:id', deleteStudents);
router.delete('/StudentsClass/:id', deleteStudentsByClass);
router.delete('/Student/:id', deleteStudent);

router.put('/Student/:id', updateStudent);
router.put('/UpdateExamResult/:id', updateExamResult);
router.put('/StudentAttendance/:id', studentAttendance);
router.put('/RemoveAllStudentsSubAtten/:id', clearAllStudentsAttendanceBySubject);
router.put('/RemoveAllStudentsAtten/:id', clearAllStudentsAttendance);
router.put('/RemoveStudentSubAtten/:id', removeStudentAttendanceBySubject);
router.put('/RemoveStudentAtten/:id', removeStudentAttendance);


// ── Teacher ───────────────────────────────────────────────────

router.post('/TeacherReg', [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
], validate, teacherRegister);

router.post('/TeacherLogin', [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
], validate, teacherLogIn);

router.get('/Teachers/:id', getTeachers);
router.get('/Teacher/:id', getTeacherDetail);

router.delete('/Teachers/:id', deleteTeachers);
router.delete('/TeachersClass/:id', deleteTeachersByClass);
router.delete('/Teacher/:id', deleteTeacher);

router.put('/TeacherSubject', updateTeacherSubject);
router.post('/TeacherAttendance/:id', teacherAttendance);

// ── Notice ────────────────────────────────────────────────────

router.post('/NoticeCreate', [
    body('title').notEmpty().withMessage('Title is required'),
    body('details').notEmpty().withMessage('Details are required'),
], validate, noticeCreate);

router.get('/NoticeList/:id', noticeList);
router.delete('/Notices/:id', deleteNotices);
router.delete('/Notice/:id', deleteNotice);
router.put('/Notice/:id', updateNotice);

// ── Complain ──────────────────────────────────────────────────

router.post('/ComplainCreate', [
    body('complaint').notEmpty().withMessage('Complaint text is required'),
], validate, complainCreate);

router.get('/ComplainList/:id', complainList);

// ── Sclass ────────────────────────────────────────────────────

router.post('/SclassCreate', [
    body('sclassName').notEmpty().withMessage('Class name is required'),
], validate, sclassCreate);

router.get('/SclassList/:id', sclassList);
router.get('/Sclass/:id', getSclassDetail);
router.get('/Sclass/Students/:id', getSclassStudents);
router.delete('/Sclasses/:id', deleteSclasses);
router.delete('/Sclass/:id', deleteSclass);

// ── Subject ───────────────────────────────────────────────────

router.post('/SubjectCreate', [
    body('subjects').isArray({ min: 1 }).withMessage('At least one subject is required'),
    body('subjects.*.subName').notEmpty().withMessage('Subject name is required'),
    body('subjects.*.subCode').notEmpty().withMessage('Subject code is required'),
], validate, subjectCreate);

router.get('/AllSubjects/:id', allSubjects);
router.get('/ClassSubjects/:id', classSubjects);
router.get('/FreeSubjectList/:id', freeSubjectList);
router.get('/Subject/:id', getSubjectDetail);
router.delete('/Subject/:id', deleteSubject);
router.delete('/Subjects/:id', deleteSubjects);
router.delete('/SubjectsClass/:id', deleteSubjectsByClass);

module.exports = router;