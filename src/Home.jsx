import './HomeStyles.sass'
import {signOut} from "firebase/auth";
import {auth, db} from "./config/firebase-config.js";
import {doc, collection, addDoc, updateDoc, getDoc, getDocs, deleteDoc} from 'firebase/firestore'
import {setCurrentUser} from "./store/currentUserSlice.js";
import {useDispatch} from "react-redux";
import {useEffect, useState} from "react";
import BarChartEA from "./components/BarChartEA.jsx";


// Broken file with infinite loop, keeping as a
// reference to when I run into another problem like this
export const Home = () => {
    const dispatch = useDispatch();
    const [budgetData, setBudgetData] = useState({
        balance: 0,
        budget: 0,
        expenseTotal: 0,
        remaining: 0
    });

    const [expenseAmount, setExpenseAmount] = useState(0);
    const [expenseType, setExpenseType] = useState('');

    const [fetchBudgetData, setFetchBudgetData] = useState({})

    const [expenseHistory, setExpenseHistory] = useState([]);


    const getBudgetData = async () => {
        try {
            const docRef = doc(db, 'users', auth?.currentUser?.uid, 'budget-data', 'userBudget');
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()){
                setFetchBudgetData({id: docSnap.id, ...docSnap.data()});
            }
        }
        catch (error) {
            console.log(error);
        }
    };

    const getExpenseHistory = async () => {
        try {
            const collectionRef = collection(db, 'users', auth?.currentUser?.uid, 'expense-history');
            const docSnap = await getDocs(collectionRef);
            const data = docSnap.docs.map((doc) => ({...doc.data(), id: doc.id}));
            setExpenseHistory(data);

        }catch (error) {
            console.log(error);
        }
    };


    useEffect(() => {
        getBudgetData();
    }, [fetchBudgetData])


    useEffect(() => {
        getExpenseHistory();
    }, [expenseHistory])

    const addBudgetData = async () => {
        try {
            // user doc
            const getDoc = await doc(db, 'users', auth?.currentUser?.uid);

            // creating new collection with data inside user doc
            const budgetCollection = collection(getDoc, 'budget-data');
            const budgetDoc = doc(budgetCollection, 'userBudget')

            // adding new collection to database
            await updateDoc(budgetDoc, {
                budget: budgetData.budget,
                balance: budgetData.balance,
                expenseTotal: budgetData.expenseTotal,
                remaining: (budgetData.budget - budgetData.expenseTotal),

            });
            // getBudgetData();
        }catch (error) {
            console.log(error);
        }
    }

    const getExpenseType = (e) => {
        e.preventDefault();
        setExpenseType(e.target.value);
    }

    const addExpense = async () => {
        try {
            const docRef = await doc(db, 'users', auth?.currentUser?.uid, 'budget-data', 'userBudget');
            await updateDoc(docRef, {
                expenseTotal: fetchBudgetData.expenseTotal + expenseAmount,
                remaining: fetchBudgetData.remaining - expenseAmount
            });

            // create new collection expense-history
            const expenseHistoryCollection = collection(db, 'users', auth?.currentUser?.uid, 'expense-history');

            // add a new doc with auto generated name since we are using addDoc and not setDoc.
            // setDoc will let you choose the name of the doc you're creating.
            await addDoc(expenseHistoryCollection, {
                expenseType: expenseType,
                expenseAmount: expenseAmount,
            });

        }catch (error) {
            console.log(error);
        }
    };

    const deleteExpense = async (id) => {
        const docRef = doc(db, 'users', auth?.currentUser?.uid, 'expense-history', id);
        await deleteDoc(docRef);
    }


    const logOut = async () => {
        try {
            await signOut(auth)
            dispatch(setCurrentUser(null))
            setExpenseAmount(0);
            setBudgetData(null);
            setFetchBudgetData(null);
        } catch (err) {
            console.log(err)
        }
    };

    return (
        <div className={'home-container'}>
            <div className={'home-container-wrapper'}>
                <header className={'home-header'}>
                    <h1>Expense Tracker App</h1>
                    <div className={'header-logout'}>
                        <button onClick={logOut} className={'logout-button'}>log out</button>
                    </div>
                </header>
                <main className={'home-main-area'}>
                    <div className={'info'}>
                        <h3>Enter your balance and budget</h3>
                        <label>
                            <h5 className={'info-header'}>Enter Balance</h5>
                            <input placeholder={'balance'} className={'info-input'} type={'number'} onChange={(e) => setBudgetData(pre => ({...pre, balance: Number(e.target.value)}))}/>
                        </label>
                        <label>
                            <h5 className={'info-header'}>Enter Budget</h5>
                            <input placeholder={'budget'} className={'info-input'} type={'number'} onChange={(e) => setBudgetData(pre => ({...pre, budget: Number(e.target.value)}))}/>
                        </label>
                        <button className={'info-submit'} onClick={addBudgetData}>Submit</button>
                    </div>
                    <div className={'balance'}>
                        <h3>BALANCE</h3>
                        <h1>${fetchBudgetData ? fetchBudgetData.balance : 0}</h1>
                    </div>
                    <div className={'expense-sum'}>
                        <h3>EXPENSES</h3>
                        <h1>${fetchBudgetData ? fetchBudgetData.expenseTotal : 0}</h1>
                    </div>
                    <div className={'expense-history'}>
                        <h3>Expense History</h3>
                        <div className={'expense-history-data-container'}>
                            {expenseHistory ? expenseHistory.map((e) => (
                                <div key={e.id} className={'expense-history-item'}>
                                    <div className={'expense-history-item-content'}>
                                        <p className={'expense-history-type'}>{e.expenseType}</p>
                                        <p className={'expense-history-amount'}>${e.expenseAmount}</p>
                                    </div>
                                    <button key={e.id} className={'delete-button'} onClick={() => deleteExpense(e.id)}>Delete</button>
                                </div>
                            )) : null}
                        </div>
                    </div>
                    <div className={'budget'}>
                        <h3>BUDGET</h3>
                        <h1>${fetchBudgetData ? fetchBudgetData.budget : 0}</h1>
                    </div>
                    <div className={'remaining-budget'}>
                        <h3>REMAINING</h3>
                        <h1>${fetchBudgetData ? fetchBudgetData.remaining : 0}</h1>
                    </div>
                    <div className={'enter-expense'}>
                        <h3>Enter Expense</h3>
                        <label>
                            <h5 className={'enter-expense-header'}>Expense Amount</h5>
                            <input placeholder={'amount'} className={'expense-expense-input'} type={'number'} onChange={(e) => setExpenseAmount(Number(e.target.value))}/>
                        </label>

                        <h5>Expense Type</h5>
                        <div className={'enter-expense-choices'}>
                            <label htmlFor={'food'} className={'food-label'}>
                                <input type={'radio'} id={'food'} name={'expenses'} value={'Food'} onChange={getExpenseType}/>
                                <span>Food</span>
                            </label>
                            <label htmlFor={'bills'} className={'bills-label'}>
                                <input type={'radio'} id={'bills'} name={'expenses'} value={'Bills'} onChange={getExpenseType}/>
                                <span>Bills</span>
                            </label>
                            <label htmlFor={'entertain'} className={'entertain-label'}>
                                <input type={'radio'} id={'entertain'} name={'expenses'} value={'Entertainment'} onChange={getExpenseType}/>
                                <span>Entertainment</span>
                            </label>
                            <label htmlFor={'savings'} className={'savings-label'}>
                                <input type={'radio'} id={'savings'} name={'expenses'} value={'Savings'} onChange={getExpenseType}/>
                                <span>Savings</span>
                            </label>
                        </div>
                        <button className={'add-expense'} onClick={addExpense}>Add Expense</button>
                    </div>
                    <div className={'graph'}>
                        <BarChartEA/>
                    </div>
                </main>
            </div>
        </div>
    )
}