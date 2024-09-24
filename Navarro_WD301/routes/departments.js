var express = require("express");
var router = express.Router();
const db = require("../config");
const fireStore = require("firebase/firestore");

const collectionRef = fireStore.collection(db, "departments");

// GET: GET ALL DEPARTMENTS FROM THE DEPARTMENTS COLLECTION
router.get("/", async (req, res) => {
  const departments = await fireStore.getDocs(collectionRef);
  const departmentsList = departments.docs.map((doc) => {
    const data = doc.data();
    return {
      dpt_id: data.dpt_id,
      name: data.name,
      courses: data.courses,
      description: data.description,
    };
  });
  res.json(departmentsList);
});

// GET: GET DEPARTMENT BY DPT_ID FROM THE DEPARTMENTS COLLECTION AND DISPLAY DEPARTMENT DATA
router.get("/:dpt_id", async (req, res) => {
  try {
    const departments = await fireStore.getDocs(collectionRef);
    const department = departments.docs.find(
      (doc) => doc.data().dpt_id === req.params.dpt_id
    );

    if (department) {
      const data = department.data();
      res.json({
        dpt_id: data.dpt_id,
        name: data.name,
        courses: data.courses,
        description: data.description,
      });
    } else {
      res.status(404).json({ error: "Department Not Found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// UPDATE: UPDATE DEPARTMENT IN THE DEPARTMENTS COLLECTION
router.put("/:dpt_id", async (req, res) => {
  try {
    const query = fireStore.query(
      collectionRef,
      fireStore.where("dpt_id", "==", req.params.dpt_id)
    );
    const snapshot = await fireStore.getDocs(query);

    if (snapshot.empty) {
      res.status(404).json({ error: "Department Not Found" });
    } else {
      const docRef = snapshot.docs[0].ref;
      const department = snapshot.docs[0].data();

      const allFields = ["dpt_id", "name", "courses", "description"];

      if (Object.keys(req.body).length === allFields.length) {
        await fireStore.setDoc(docRef, req.body);
        res.json({ message: "Department Fully Updated Successfully" });
      } else {
        const updatedDepartment = { ...department, ...req.body };
        await fireStore.updateDoc(docRef, updatedDepartment);
        res.json({ message: "Department Fields Updated Successfully" });
      }
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST: ADD NEW DEPARTMENT TO THE DEPARTMENTS COLLECTION
router.post("/add", async (req, res) => {
  const department = await fireStore.addDoc(collectionRef, req.body);
  res.json("Department Added Successfully!");
});

// DELETE: DELETE DEPARTMENT FROM THE DEPARTMENTS COLLECTION
router.delete("/:dpt_id", async (req, res) => {
  try {
    const departments = await fireStore.getDocs(collectionRef);
    const department = departments.docs.find(
      (doc) => doc.data().dpt_id === req.params.dpt_id
    );

    if (department) {
      await fireStore.deleteDoc(department.ref);
      res.json({ message: "Department Deleted Successfully" });
    } else {
      res.status(404).json({ error: "Department Not Found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
