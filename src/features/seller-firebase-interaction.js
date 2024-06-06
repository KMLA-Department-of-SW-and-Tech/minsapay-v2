import { doc, getDoc } from "firebase/firestore";
import { database } from "../firebase";
import { auth } from "./login-feature";

const sellerFirebase = {
  userDocRef: undefined, // 해당하는 document reference
  userDoc: undefined, // 해당하는 document **중요** 자동으로 업데이트되지 않음
  userDocData: undefined, // 위의 userDoc.data()를 실행한 결과
  teamList: undefined,
  async init() {
    this.userDocRef = doc(database, "Students", auth.currentUser.userID);
    this.userDoc = await getDoc(this.userDocRef);
    this.userDocData = this.userDoc.data();
    this.teamList = this.userDocData.team_list;
  },
};

export { sellerFirebase };
