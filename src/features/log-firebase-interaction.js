import { database } from "../firebase";
import { doc } from "firebase/firestore";
// import { auth } from "./login-feature";

const logFirebase = {
  logRef: null,
  logData: null,

  async init() {
    this.logRef = doc(database, "Admin", "log");
    
  },
};

export { logFirebase };
