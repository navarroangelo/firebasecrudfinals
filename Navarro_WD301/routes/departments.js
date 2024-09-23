// Departments Collection
// department collection has the following fields
//     dpt_id
//     name
//     courses
//     description

// expected output:
// {
// dpt_id:
// name: "school of computing"
// courses: ["networking", "computer-science", .....]
// description: "lorem lorem"
// }

var express = require('express');
var router = express.Router();
const db = require('../config');
const fireStore = require('firebase/firestore');

const collectionRef = fireStore.collection(db, 'departments');

// GET: GET ALL DEPARTMENTS FROM THE DEPARTMENTS COLLECTION
router.get('/', async (req, res) => {
    const departments = await fireStore.getDocs(collectionRef);
    const departmentsList = departments.docs.map(doc => doc.data());
    res.json(departmentsList);
});

// GET: GET DEPARTMENT BY ID FROM THE DEPARTMENTS COLLECTION
router.get('/:id', async (req, res) => {
    const department = await fireStore.getDoc(collectionRef, req.params.id);
    res.json(department.data());
});

// UPDATE: UPDATE DEPARTMENT IN THE DEPARTMENTS COLLECTION
router.put('/:id', async (req, res) => {
    const department = await fireStore.updateDoc(collectionRef, req.params.id, req.body);
    res.json(department.data());
});

// POST: ADD NEW DEPARTMENT TO THE DEPARTMENTS COLLECTION
router.post('/add', async (req, res) => {
    const department = await fireStore.addDoc(collectionRef, req.body);
    res.json("Department Added Successfully!");
});

// DELETE: DELETE DEPARTMENT FROM THE DEPARTMENTS COLLECTION
router.delete('/:id', async (req, res) => {
    const department = await fireStore.deleteDoc(collectionRef, req.params.id);
    res.json(department.data());
});

module.exports = router;