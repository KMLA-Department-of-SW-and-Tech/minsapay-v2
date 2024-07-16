import { doc, setDoc, query, collection, getDocs, where } from "firebase/firestore";
import { authentication, database } from "../firebase";
import cryptoJS from "crypto-js";
import { createUserWithEmailAndPassword } from "firebase/auth";

const developerFirebase = {
  userData: {},
  /* 
    {
      Students {
        231133 {
          documentSnapshot : <snapshot>
          documentData : {
            balance: <number>,
            order_history: <string (JSON.stringify(), needs to be parsed for usage)>,
            team_list: <array of team ids>,
            username: <string>,
          }
        }
        ...
      }
      Teams {
        kwagibu {
          documentSnapshot : <snapshot>
          documentData : {
            balance: <number>,
            kiosk_authentication_number: <string of number>,
            kiosk_image: <string of image storage path, given as default of 광어>,
            linked_buyer: <string of buyer id>,
            menu_list: <string (JSON.stringify(), needs to be parsed for usage)>,
            order_history: <string (JSON.stringify(), needs to be parsed for usage)>,
            student_list: <array of student ids>,
            username: <string>,
          }
        }
        ...
      }
    }
  */
  userSubData: {},
  /* 
    {
      Students {
        231133 {
          balance: <number>,
          username: <string>,
          password: <string>
        }
        ...
      }
      Teams {
        kwagibu {
          balance: <number>,
          username: <string>,
          password: <string>
        }
        ...
      }
    }
  */
  randomPassword() {
    return cryptoJS.SHA256(String(Math.random())).toString().substring(0, 6);
  },
  /* async init() {
    const studentQuery = query(collection(database, "Students"));
    const studentSnapshot = await getDocs(studentQuery);
    this.userData = {
      Students: {},
      Teams: {},
    };
    this.userSubData = {
      Students: {},
      Teams: {},
    };
    studentSnapshot.forEach((doc) => {
      this.userData.Students[doc.id] = {};
      this.userData.Students[doc.id].documentSnapshot = doc;
      this.userData.Students[doc.id].documentData = doc.data();

      this.userSubData.Students[doc.id] = {};
      this.userSubData.Students[doc.id].balance =
        this.userData.Students[doc.id].documentData.balance;
      this.userSubData.Students[doc.id].username =
        this.userData.Students[doc.id].documentData.username;
      this.userSubData.Students[doc.id].password = "";
    });
    const teamQuery = query(collection(database, "Teams"));
    const teamSnapshot = await getDocs(teamQuery);
    teamSnapshot.forEach((doc) => {
      this.userData.Teams[doc.id] = {};
      this.userData.Teams[doc.id].documentSnapshot = doc;
      this.userData.Teams[doc.id].documentData = doc.data();

      this.userSubData.Teams[doc.id] = {};
      this.userSubData.Teams[doc.id].balance =
        this.userData.Teams[doc.id].documentData.balance;
      this.userSubData.Teams[doc.id].username =
        this.userData.Teams[doc.id].documentData.username;
      this.userSubData.Teams[doc.id].password = "";
    });
  }, */
  standardizeSubData(xldata) {
    let resultData = { Students: {}, Teams: {} };
    xldata.Students.forEach((student) => {
      resultData.Students[student.user_id] = {};
      resultData.Students[student.user_id].username =
        typeof student.username === "number"
          ? String(student.username)
          : student.username;
    });
    xldata.Teams.forEach((team) => {
      resultData.Teams[team.user_id] = {};
      resultData.Teams[team.user_id].username =
        typeof team.username === "number"
          ? String(team.username)
          : team.username;
    });
    return resultData;
  },
  /* async writeDataToFirebase(subData) {
    let resultUserDocumentData = { Students: {}, Teams: {} };
    for (let student in subData.Students) {
      if (student in this.userData.Students) {
        // student already exists
        resultUserDocumentData.Students[student] =
          this.userData.Students[student].documentData;
        if (subData.Students[student].balance !== undefined)
          resultUserDocumentData.Students[student].balance =
            subData.Students[student].balance;
        if (subData.Students[student].username !== undefined)
          resultUserDocumentData.Students[student].username =
            subData.Students[student].username;
        // cannot change password
      } else {
        // student does not already exist
        resultUserDocumentData.Students[student] = {
          balance:
            subData.Students[student].balance === undefined
              ? 0
              : subData.Students[student].balance,
          order_history: "[]",
          team_list: [],
          username:
            subData.Students[student].username === undefined
              ? "no-name"
              : subData.Students[student].username,
        };
        await createUserWithEmailAndPassword(
          authentication,
          `${student}@student.com`,
          subData.Students[student].password,
        );
        // create account for user using `${student}@student.com` & subData.Students[student].password
      }
    }
    for (let team in subData.Teams) {
      if (team in this.userData.Teams) {
        // team already exists
        resultUserDocumentData.Teams[team] =
          this.userData.Teams[team].documentData;
        if (subData.Teams[team].balance !== undefined)
          resultUserDocumentData.Teams[team].balance =
            subData.Teams[team].balance;
        if (subData.Teams[team].username !== undefined)
          resultUserDocumentData.Teams[team].username =
            subData.Teams[team].username;
        // cannot change password
      } else {
        // team does not already exist
        resultUserDocumentData.Teams[team] = {
          balance:
            subData.Teams[team].balance === undefined
              ? 0
              : subData.Teams[team].balance,
          kiosk_authentication_number: "",
          kiosk_image: "defaultBooth/광어.jpg",
          linked_buyer: "",
          menu_list: "[]",
          order_history: "[]",
          student_list: [],
          username:
            subData.Teams[team].username === undefined
              ? "no-name"
              : subData.Teams[team].username,
        };
        await createUserWithEmailAndPassword(
          authentication,
          `${team}@team.com`,
          subData.Teams[team].password,
        );
        // create account for user using `${team}@team.com` & subData.Teams[team].password
      }
    }

    // console.log(resultUserDocumentData);
  }, */
  async submitStudentData(subData) {
    console.log(subData);
    let resultData = Object.assign({}, subData);
    for (let student of Object.keys(subData)) {
      const rpw = this.randomPassword();
      resultData[student].password = rpw;
      await setDoc(doc(database, "Students", student), {
        balance: 0,
        order_history: "[]",
        team_list: [],
        username: subData[student].username,
      });
      await createUserWithEmailAndPassword(
        authentication,
        `${student}@student.com`,
        rpw,
      );
    }
    return resultData;
  },
  async submitTeamData(subData) {
    console.log(subData);
    let resultData = Object.assign({}, subData);
    for (let team of Object.keys(subData)) {
      const pw = this.randomPassword();
      resultData[team].passowrd = pw;
      await setDoc(doc(database, "Teams", team), {
        balance: 0,
        kiosk_authentication_number: "",
        order_history: "[]",
        kiosk_image: "defaultBooth/광어.jpg",
        linked_buyer: "",
        menu_list: "[]",
        student_list: [],
        username: subData[team].username,
      });
      await createUserWithEmailAndPassword(
        authentication,
        `${team}@team.com`,
        pw,
      );
    }
    return resultData;
  },
  async submitData(subData) {
    const data1 = await this.submitStudentData(subData.Students);
    //const data2 = await this.submitTeamData(subData.Teams);
    return {
      Students: data1,
      Teams: {},
    };
  },
  /* async getLogData() {
    const logRef = doc(database, "Admin", "log");
    const logSnapshot = await getDoc(logRef);
    return logSnapshot.data().log;
  }, */
  async getTransactionData() {
    const teamInfo = {
/*       "빈즈니스": { teamID: "beansness", balance: 0, },
      "족보": { teamID: "jokbo", balance: 0, },
      "스피넬": { teamID: "spinel29", balance: 0, },
      "애플파이":  { teamID: "applepie", balance: 0, },
      "어벤처스": { teamID: "aventures", balance: 0, },
      "프시케": { teamID: "psyche", balance: 0, },
      "비이잉": { teamID: "beeing", balance: 0, },
      "Girlup HSSK": { teamID: "sooyun", balance: 0, },
      "일루전":  { teamID: "illusion", balance: 0, },
      "TTL":  { teamID: "ttl", balance: 0, },
      "경국지화": { teamID: "fuckingwallpainting", balance: 0, },
      "대취타": { teamID: "daechita", balance: 0, },
      "문기부": { teamID: "twninmoongi", balance: 0, },
      "맥두날두": { teamID: "dupjae", balance: 0, },
      "행정위": { teamID: "minsa", balance: 0, },
      "죄와벌": { teamID: "crimenp", balance: 0, }, */
      "beansness": { balance: 0 },
      "jokbo": { balance: 0 },
      "spinel29": { balance: 0 },
      "applepie": { balance: 0 },
      "aventures": { balance: 0 },
      "psyche": { balance: 0 },
      "beeing": { balance: 0 },
      "sooyun": { balance: 0 },
      "illusion": { balance: 0 },
      "ttl": { balance: 0 },
      "fuckingwallpainting": { balance: 0 },
      "daechita": { balance: 0 },
      "twninmoongi": { balance: 0 },
      "dupjae": { balance: 0 },
      "minsa": { balance: 0 },
      "crimenp": { balance: 0 },
      "kwagibu": { balance: 0 },
    }
    const q = query(collection(database, "Students"), where("order_history", "!=", "[]"));
    const querySnapshot = await getDocs(q);
    console.log(querySnapshot)
    querySnapshot.forEach(doc => {
      const docData = doc.data();
      const orderHistory = JSON.parse(docData.order_history);
      orderHistory.forEach(order => {
        console.log(order);
        if(order.refund_request !== 1) {
          teamInfo[order.team_id].balance += order.price;
        }
      })
    })

    return teamInfo;
  }
};

export { developerFirebase };
