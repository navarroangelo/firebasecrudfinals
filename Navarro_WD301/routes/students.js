var express = require("express");
var router = express.Router();
const db = require("../config");
const fireStore = require("firebase/firestore");

const collectionRef = fireStore.collection(db, "students");

// GET: GET ALL STUDENTS FROM THE STUDENTS COLLECTION IN THE DB
router.get("/", async (req, res) => {
  const students = await fireStore.getDocs(collectionRef);
  const studentsList = students.docs.map((doc) => doc.data());
  const formattedStudents = studentsList.map((student) => {
    const { std_id, first_name, last_name, department, course, year_level } =
      student;
    const name = `${first_name} ${last_name}`;
    const courseFormatted = `${department} - ${course}`;
    const year = `${year_level}`;

    return {
      std_id,
      name,
      course: courseFormatted,
      year,
    };
  });

  res.json(formattedStudents);
});

// GET: GET STUDENT BY std_id ATTRIB FROM THE STUDENTS COLLECTION IN THE DB
router.get("/:std_id", async (req, res) => {
  const query = fireStore.query(
    collectionRef,
    fireStore.where("std_id", "==", req.params.std_id)
  );
  const snapshot = await fireStore.getDocs(query);
  if (snapshot.empty) {
    res.status(404).json({ error: "Student Not Found" });
  } else {
    const student = snapshot.docs[0].data();
    const formattedStudent = {
      std_id: student.std_id,
      name: `${student.first_name} ${student.last_name}`,
      course: `${student.department} - ${student.course}`,
      year: `${student.year_level}`,
    };
    res.json(formattedStudent);
  }
});

// UPDATE: UPDATE STUDENT IN THE STUDENTS COLLECTION IN THE DB
router.put("/:std_id", async (req, res) => {
  const query = fireStore.query(
    collectionRef,
    fireStore.where("std_id", "==", req.params.std_id)
  );
  const snapshot = await fireStore.getDocs(query);

  if (snapshot.empty) {
    res.status(404).json({ error: "Student Not Found" });
  } else {
    const docRef = snapshot.docs[0].ref;
    const student = snapshot.docs[0].data();

    const allFields = [
      "std_id",
      "first_name",
      "last_name",
      "department",
      "course",
      "year_level",
    ];

    if (Object.keys(req.body).length === allFields.length) {
      await fireStore.setDoc(docRef, req.body);
      res.json({ message: "Student Fully Updated Successfully" });
    } else {
      const updatedStudent = { ...student, ...req.body };
      await fireStore.updateDoc(docRef, updatedStudent);
      res.json({ message: "Student Fields Updated Successfully" });
    }
  }
});

// POST: ADD NEW STUDENT TO THE STUDENTS COLLECTION IN THE DB
router.post("/add", async (req, res) => {
  const student = await fireStore.addDoc(collectionRef, req.body);
  res.json("Student Added Successfully!");
});

// DELETE: DELETE STUDENT FROM THE STUDENTS COLLECTION IN THE DB
router.delete("/:std_id", async (req, res) => {
  const query = fireStore.query(
    collectionRef,
    fireStore.where("std_id", "==", req.params.std_id)
  );
  const snapshot = await fireStore.getDocs(query);
  if (snapshot.empty) {
    res.status(404).json({ error: "Student Not Found" });
  } else {
    const docId = snapshot.docs[0].id;
    await fireStore.deleteDoc(fireStore.doc(collectionRef, docId));
    res.json({ message: "Student Deleted Successfully" });
  }
});

module.exports = router;
