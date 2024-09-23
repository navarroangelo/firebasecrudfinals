// Students Collection
// student collection has the following fields:
//     std_id
//     first_name
//     last_name
//     department
//     course
//     year_level

// expected output:
// {
// std_id: 1001
// name: Christian Pradilla (first and last name merged)
// course: School of Computing - Computer Science (department and course merged)
// year: 1st Year
// }
// {
// std_id: 1002
// name: Carisma Caro (first and last name merged)
// course: School of Business and Accountancy - Accountancy (department and course merged)
// year: 2nd Year
// }
// {
// std_id: 1003
// name: Chris Almocera (first and last name merged)
// course: School of Nursing and Allied Medical Sciences - Nursing (department and course merged)
// year: 3rd Year
// }

var express = require('express');
var router = express.Router();
const db = require('../config');
const fireStore = require('firebase/firestore');

const collectionRef = fireStore.collection(db, 'students');

// GET: GET ALL STUDENTS FROM THE STUDENTS COLLECTION IN THE DB
router.get('/', async (req, res) => {
    const students = await fireStore.getDocs(collectionRef);
    const studentsList = students.docs.map(doc => doc.data());
    const formattedStudents = studentsList.map(student => {
        const { std_id, first_name, last_name, department, course, year_level } = student;
        const name = `${first_name} ${last_name}`;
        const courseFormatted = `${department} - ${course}`;
        const year = `${year_level} Year`;

        return {
            std_id,
            name,
            course: courseFormatted,
            year
        };
    });

    res.json(formattedStudents);
});

// GET: GET STUDENT BY std_id ATTRIB FROM THE STUDENTS COLLECTION IN THE DB
router.get('/:std_id', async (req, res) => {
    const query = fireStore.query(collectionRef, fireStore.where('std_id', '==', req.params.std_id));
    const snapshot = await fireStore.getDocs(query);
    if (snapshot.empty) {
        res.status(404).json({ error: 'Student not found' });
    } else {
        const student = snapshot.docs[0].data();
        const formattedStudent = {
            std_id: student.std_id,
            name: `${student.first_name} ${student.last_name}`,
            course: `${student.department} - ${student.course}`,
            year: `${student.year_level}`
        };
        res.json(formattedStudent);
    }
});

// UPDATE: UPDATE STUDENT IN THE STUDENTS COLLECTION IN THE DB
router.put('/:std_id', async (req, res) => {
    const student = await fireStore.updateDoc(collectionRef, req.params.id, req.body);
    res.json(student.data());
});

// POST: ADD NEW STUDENT TO THE STUDENTS COLLECTION IN THE DB
router.post('/add', async (req, res) => {
    const student = await fireStore.addDoc(collectionRef, req.body);
    res.json("Student Added Successfully!");
});

// DELETE: DELETE STUDENT FROM THE STUDENTS COLLECTION IN THE DB
router.delete('/:id', async (req, res) => {
    const student = await fireStore.deleteDoc(collectionRef, req.params.id);
    res.json(student.data());
});

module.exports = router;