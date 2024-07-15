import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
} from "firebase/firestore";
import { database } from "../firebase";
import { loginUtils } from "./login-feature";

// 실시간으로 바꾸기!!!!!

const buyerFirebase = {
  userDocRef: undefined, // 해당하는 document reference
  userDoc: undefined, // 해당하는 document **중요** 자동으로 업데이트되지 않음
  userDocData: undefined, // 위의 userDoc.data()를 실행한 결과
  orderHistory: undefined,

  async init() {
    this.userDocRef = doc(database, "Students", loginUtils.getUserID());
    this.userDoc = await getDoc(this.userDocRef);
    this.userDocData = this.userDoc.data();
    this.orderHistory = JSON.parse(this.userDocData.order_history);
  },
  async submitKioskAuthenticationNumber(submitNumber) {
    const teams = await getDocs(query(collection(database, "Teams")));
    let foundMatch = false;
    for (let i = 0; i < teams.docs.length; i++) {
      // 부스 목록의 kiosk authentication number 비교
      const document = teams.docs[i].data();
      if (submitNumber === document.kiosk_authentication_number) {
        // if (document.linked_buyer !== "") {
        //   alert("이미 누군가가 접속했습니다.");
        // } else {
        //   foundMatch = true;
        //   document.linked_buyer = this.userDoc.id;
        //   await setDoc(doc(database, "Teams", teams.docs[i].id), document);
        //   const tmp = this.userDocData;
        //   tmp.is_connected = true;
        //   await setDoc(this.userDocRef, tmp);
        // }
        foundMatch = true;
        document.linked_buyer = this.userDoc.id;
        await setDoc(doc(database, "Teams", teams.docs[i].id), document);
        const tmp = this.userDocData;
        tmp.is_connected = true;
        await setDoc(this.userDocRef, tmp);
        break;
      }
    }
    return foundMatch; // 대조 결과 존재할 시 true 반환 그 외 false 반환
  },
  async refundRequest(orderID) {
    const teamID = orderID.substring(
      orderID.indexOf("?") + 1,
      orderID.indexOf("/"),
    );
    const teamDocRef = doc(database, "Teams", teamID);
    const teamDoc = await getDoc(teamDocRef);
    const teamDocData = teamDoc.data();
    const teamOrderHistory = JSON.parse(teamDocData.order_history);
    for (let i = 0; i < teamOrderHistory.length; i++) {
      if (teamOrderHistory[i].order_id === orderID) {
        // teamOrderHistory[i].current_state = "환불요청";
        teamOrderHistory[i].refund_request = 1;
        teamDocData.order_history = JSON.stringify(teamOrderHistory);
        for (let i = 0; i < this.orderHistory.length; i++) {
          if (this.orderHistory[i].order_id === orderID) {
            // this.orderHistory[i].current_state = "환불요청";
            this.orderHistory[i].refund_request = 1;
            this.userDocData.order_history = JSON.stringify(this.orderHistory);
            break;
          }
        }
        break;
      }
    }
    await setDoc(teamDocRef, teamDocData);
    await setDoc(this.userDocRef, this.userDocData);
  },
};
export { buyerFirebase };
