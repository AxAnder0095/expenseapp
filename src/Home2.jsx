import './HomeStyles.sass'
import {signOut} from "firebase/auth";
import {auth, db} from "./config/firebase-config.js";
import {doc, collection, addDoc, updateDoc, getDoc, getDocs, deleteDoc} from 'firebase/firestore'
import {useEffect, useState} from "react";
import BarChartEA from "./components/BarChartEA.jsx";

export const Home2 = () => {
    const [budget, setBudget] = useState({
        data: {
            balance: 0,
            budget: 0,
            expenseTotal: 0,
            remaining: 0
        },
        expenses: [],
    });

    const [expenseAmount, setExpenseAmount] = useState(0);
    const [expenseType, setExpenseType] = useState('');
    const [fetchBudgetData, setFetchBudgetData] = useState({})


    // Fetch operations here
    const getBudgetData = async () => {
        try {
            const userDoc = auth?.currentUser?.uid;
            const docRef = doc(db, 'users', userDoc, 'budget-data', 'userBudget');
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setFetchBudgetData({id: docSnap.id, ...docSnap.data()});
            }
        } catch (error) {
            console.log(error);
        }
    };

    const getExpenseHistory = async () => {
        try {
            const userDoc = auth?.currentUser?.uid;
            const collectionRef = collection(db, 'users', userDoc, 'expense-history');
            const docSnap = await getDocs(collectionRef);
            const data = docSnap.docs.map((doc) => ({...doc.data(), id: doc.id}));
            setBudget(pre => ({
                ...pre,
                expenses: data
            }));

        } catch (error) {
            console.log(error);
        }
    };

    // CRUD operations here
    const addBudgetData = async () => {
        try {
            // user doc
            const userDoc = auth?.currentUser?.uid;
            const getDoc = await doc(db, 'users', userDoc);

            // creating new collection with data inside user doc
            const budgetCollection = collection(getDoc, 'budget-data');
            const budgetDoc = doc(budgetCollection, 'userBudget')

            await updateDoc(budgetDoc, {
                budget: budget.data.budget,
                balance: budget.data.balance,
                expenseTotal: budget.data.expenseTotal,
                remaining: (budget.data.budget - budget.data.expenseTotal),
            });

            await refreshData();

        } catch (error) {
            console.log(error);
        }
    };

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

            await refreshData();

        } catch (error) {
            console.log(error);
        }
    };

    const deleteExpense = async (id) => {
        const docRef = doc(db, 'users', auth?.currentUser?.uid, 'expense-history', id);
        await deleteDoc(docRef);
        await refreshData();
    };

    // Get relevant data here
    // getBudgetData is first line that is executed in this file
    useEffect(() => {
        getBudgetData();
        getExpenseHistory();
    }, [])

    // Manual refresh for updated or deleted data
    const refreshData = async () => {
        await getBudgetData();
        await getExpenseHistory();
    }

    // onClick handlers here
    const getExpenseType = (e) => {
        e.preventDefault();
        setExpenseType(e.target.value);
    };

    const handleBalanceChange = (e) => {
        e.preventDefault();
        const newBalance = Number(e.target.value);
        setBudget(prev => ({
            ...prev,
            data: {
                ...prev.data,
                balance: newBalance
            }
        }));
    };

    const handleBudgetChange = (e) => {
        e.preventDefault();
        const newBudget = Number(e.target.value);
        setBudget(prev => ({
            ...prev,
            data: {
                ...prev.data,
                budget: newBudget
            }
        }));
    };

    //logout function here
    const logOut = async () => {
        try {
            await signOut(auth)
            setBudget(null)
            setExpenseAmount(0);
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
                            <input placeholder={'balance'} className={'info-input'} type={'number'} onChange={handleBalanceChange}/>
                        </label>
                        <label>
                            <h5 className={'info-header'}>Enter Budget</h5>
                            <input placeholder={'budget'} className={'info-input'} type={'number'} onChange={handleBudgetChange}/>
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
                            {budget.expenses ? budget.expenses.map((e) => (
                                <div key={e.id} className={'expense-history-item'}>
                                    <div className={'expense-history-item-content'}>
                                        <p className={'expense-history-type'}>{e.expenseType}</p>
                                        <p className={'expense-history-amount'}>${e.expenseAmount}</p>
                                    </div>
                                    <button key={e.id} className={'delete-button'}
                                            onClick={() => deleteExpense(e.id)}>Delete
                                    </button>
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
                            <input placeholder={'amount'} className={'expense-expense-input'} type={'number'}
                                   onChange={(e) => setExpenseAmount(Number(e.target.value))}/>
                        </label>

                        <h5>Expense Type</h5>
                        <div className={'enter-expense-choices'}>
                            <label htmlFor={'food'} className={'food-label'}>
                                <input type={'radio'} id={'food'} name={'expenses'} value={'Food'}
                                       onChange={getExpenseType}/>
                                <span>Food</span>
                            </label>
                            <label htmlFor={'bills'} className={'bills-label'}>
                                <input type={'radio'} id={'bills'} name={'expenses'} value={'Bills'}
                                       onChange={getExpenseType}/>
                                <span>Bills</span>
                            </label>
                            <label htmlFor={'entertain'} className={'entertain-label'}>
                                <input type={'radio'} id={'entertain'} name={'expenses'} value={'Entertainment'}
                                       onChange={getExpenseType}/>
                                <span>Entertainment</span>
                            </label>
                            <label htmlFor={'savings'} className={'savings-label'}>
                                <input type={'radio'} id={'savings'} name={'expenses'} value={'Savings'}
                                       onChange={getExpenseType}/>
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