// import {useEffect, useState} from "react";
// import {collection, getDocs, query, limit} from "firebase/firestore";
// import {auth, db} from "../config/firebase-config.js";
//
// const useFetch = () => {
//     const [expenseHistory, setExpenseHistory] = useState([]);
//
//     const getExpenseHistory = async () => {
//         try {
//             const collectionRef = await query(collection(db, 'users', auth?.currentUser?.uid, 'expense-history'), limit(7));
//             const docSnap = await getDocs(collectionRef);
//             const docSize = docSnap.size;
//             // const data = docSnap.docs.map((doc) => ({...doc.data(), id: doc.id}));
//             // setExpenseHistory(data);
//         }catch (error) {
//             console.log(error);
//         }
//     };
//
//
//     useEffect(() => {
//         getExpenseHistory();
//     }, [expenseHistory])
//
//
// }
