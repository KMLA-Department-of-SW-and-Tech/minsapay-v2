import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  arrayRemove,
  arrayUnion,
} from "firebase/firestore";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import { database, storage } from "../firebase";
import { loginUtils } from "./login-feature";
import { logger } from "./log-feature";

const CPUFirebase = {
  userDocRef: undefined,
  userDoc: undefined,
  userDocData: undefined,
  kioskImageDownloadUrl: undefined,
  menuList: undefined,
  orderHistory: [],
  async init() {
    this.userDocRef = doc(database, "Teams", loginUtils.getUserID());
    this.userDoc = await getDoc(this.userDocRef);
    this.userDocData = this.userDoc.data();
    console.log(this.userDocData, loginUtils.getUserID())
    this.menuList = JSON.parse(this.userDocData.menu_list);
    this.orderHistory = JSON.parse(this.userDocData.order_history);
  },
  async kioskImageInit() {
    if (this.userDocData.kiosk_image !== "")
      this.kioskImageDownloadUrl = await getDownloadURL(
        ref(storage, this.userDocData.kiosk_image),
      );
  },
  async changeKioskImage(file) {
    if (
      this.userDocData.kiosk_image !== "" &&
      this.userDocData.kiosk_image !== "defaultBooth/광어.jpg"
    )
      await deleteObject(ref(storage, this.userDocData.kiosk_image));
    const locationRef = ref(
      storage,
      `booths/${loginUtils.getUserID()}/kiosk_image/${file.name}`,
    );
    const result = await uploadBytes(locationRef, file);
    this.kioskImageDownloadUrl = await getDownloadURL(result.ref);
    this.userDocData.kiosk_image = result.ref._location.path_;
    await setDoc(this.userDocRef, this.userDocData);
    this.userDoc = await getDoc(this.userDocRef);
  },
  async deleteMenuImage(index) {
    const menuItem = this.menuList[index];
    if (menuItem && menuItem.imagePath) {
      const imageRef = ref(storage, menuItem.imagePath);
      await deleteObject(imageRef);
    }
    this.menuList.splice(index, 1);
  },
  async uploadMenuImage(boothId, id, file) {
    const storageRef = ref(
      storage,
      `booths/${boothId}/menuImages/${id}_${file.name}`,
    );
    const snapshot = await uploadBytes(storageRef, file);
    const imageDownloadUrl = await getDownloadURL(snapshot.ref);

    return {
      imageDownloadUrl,
      imagePath: storageRef.fullPath,
    };
  },
  async updateFirebaseMenuList() {
    this.userDocData.menu_list = JSON.stringify(this.menuList);
    await setDoc(this.userDocRef, this.userDocData);
    this.userDoc = await getDoc(this.userDocRef);
  },
  async refundOrder(orderID) {
    // console.log(orderID);
    let buyerID = undefined;
    let buyerUsername = undefined;
    for (let i = 0; i < this.orderHistory.length; i++) {
      if (this.orderHistory[i].order_id === orderID) {
        // console.log(i);
        this.orderHistory[i].refund_request = 1;
        this.userDocData.order_history = JSON.stringify(this.orderHistory);
        this.userDocData.balance -= this.orderHistory[i].price;
        buyerID = this.orderHistory[i].buyer_id;
        buyerUsername = this.orderHistory[i].buyer_name;
        const buyerDocRef = doc(database, "Students", buyerID);
        const buyerDoc = await getDoc(buyerDocRef);
        const buyerDocData = buyerDoc.data();
        const buyerOrderHistory = JSON.parse(buyerDocData.order_history);
        for (let j = 0; j < buyerOrderHistory.length; j++) {
          if (buyerOrderHistory[j].order_id === orderID) {
            buyerOrderHistory[j].refund_request = 1;
            buyerDocData.order_history = JSON.stringify(buyerOrderHistory);
            buyerDocData.balance += this.orderHistory[i].price;
            break;
          }
        }
        // console.log(this.userDocData.order_history);
        await logger.log({
          type: "transaction",
          sender: this.userDocData.username,
          reciever: buyerUsername,
          amount: this.orderHistory[i].price,
        });
        // await setDoc(buyerDocRef, buyerDocData);
        // await setDoc(this.userDocRef, this.userDocData);

        await setDoc(buyerDocRef, buyerDocData);
        await setDoc(this.userDocRef, this.userDocData);

        break;
      }
    }
  },
  async addStudent(studentNumber) {
    const studentDocRef = doc(database, "Students", studentNumber);
    const studentDoc = await getDoc(studentDocRef);
    if (studentDoc.exists()) {
      // Add student to the team's student_list
      this.userDocData.student_list = this.userDocData.student_list || [];
      this.userDocData.student_list.push(studentNumber);
      await setDoc(this.userDocRef, this.userDocData);

      // Add team to the student's team_list
      const studentData = studentDoc.data();
      const teamList = studentData.team_list || [];
      if (!teamList.includes(loginUtils.getUserID())) {
        await updateDoc(studentDocRef, {
          team_list: arrayUnion(loginUtils.getUserID()),
        });
      }
      return {
        studentNumber,
        username: studentData.username,
      };
    } else {
      throw new Error("Student not found");
    }
  },
  async removeStudent(studentNumber) {
    // Remove student from the team's student_list
    this.userDocData.student_list = this.userDocData.student_list.filter(
      (sn) => sn !== studentNumber,
    );
    await setDoc(this.userDocRef, this.userDocData);

    // Remove team from the student's team_list
    const studentDocRef = doc(database, "Students", studentNumber);
    const studentDoc = await getDoc(studentDocRef);
    if (studentDoc.exists()) {
      await updateDoc(studentDocRef, {
        team_list: arrayRemove(loginUtils.getUserID()),
      });
    } else {
      throw new Error("Student not found");
    }
  },
  async fetchStudentList() {
    const studentList = this.userDocData.student_list || [];
    const studentDetails = [];

    for (const studentNumber of studentList) {
      const studentDocRef = doc(database, "Students", studentNumber);
      const studentDoc = await getDoc(studentDocRef);
      if (studentDoc.exists()) {
        const studentData = studentDoc.data();
        studentDetails.push({
          studentNumber,
          username: studentData.username,
        });
      }
    }

    return studentDetails;
  },
};

export { CPUFirebase };
