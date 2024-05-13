import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { database } from "../firebase";
import cryptoJS from 'crypto-js'

function isStudent(userID) {
    switch(userID[0]) {
        case '0':
            return true;
        case '1':
            return true;
        case '2':
            return true;
        case '3':
            return true;
        case '4':
            return true;
        case '5':
            return true;
        case '6':
            return true;
        case '7':
            return true;
        case '8':
            return true;
        case '9':
            return true;
        default:
            return false;
    }
}

// 해시 함수를 통하여 비밀번호 암호화!!
export const auth = {
    currentUser: null,
    error: "No Error",
    async signIn(userID, password) {
        try 
        {
            if(isStudent(userID)) {
                // 학생 로그인
                const studentsQuery = query(
                    collection(database, "Students")
                );
                const students = await getDocs(studentsQuery)
                let documentIndex = -1;
                for(let i=0;i<students.docs.length;i++) {
                    if(userID === students.docs[i].id) {
                        documentIndex = i;
                        break;
                    }
                }
            if(documentIndex === -1) throw new Error("아이디가 존재하지 않습니다.");
            const user = students.docs[documentIndex].data();
            if(cryptoJS.SHA256(password).toString()  === user.password) {
                // approve
                console.log("approved");
            } else {
                const teamsQuery = query(
                    collection(database, "Teams")
                );
                const teams = await getDocs(teamsQuery)
                const encryptedPassword = cryptoJS.SHA256(password).toString()
                for(let i=0;i<teams.docs.length;i++) {
                    if(encryptedPassword === teams.docs[i].data().password) {
                        documentIndex = i;
                        break;
                    }
                }
                if (documentIndex === -1) throw new Error('비밀번호를 잘못 입력하셨습니다.')
            }
            //console.log(documentIndex);
            
            } 
            else {
                // 부스 로그인
                console.log("I am team");

            }
        } catch(e) {
            this.error = e;
        }

    },
}

/* 
const doc = await addDoc(collection(db, "tweets"), {
  tweet,
  createdAt: Date.now(),
  username: user.displayName || "Anonymous",
  userId: user.uid,
});
await updateDoc(doc, {
  photo: url,
});
const fetchTweets = async () => {
    const tweetsQuery = query(
        collection(db, "tweets"),
        orderBy("createdAt", "desc")
    );
    const snapshot = await getDocs(tweetsQuery);
    const tweets = snapshot.docs.map((doc) => {
        const {tweet, createdAt, userId, username, photo} = doc.data();
        return {
            tweet, createdAt, userId, username, photo,
            id: doc.id,
        }
    }); */