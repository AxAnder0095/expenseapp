import './HomeStyles.sass'
import {signOut} from "firebase/auth";
import {auth, db} from "./config/firebase-config.js";
import {doc, collection, addDoc, setDoc} from 'firebase/firestore'
import {setCurrentUser} from "./store/currentUserSlice.js";
import {useDispatch} from "react-redux";
import {useState} from "react";

export const Home = () => {
    const dispatch = useDispatch();
    const [budgetData, setBudgetData] = useState({
        balance: 0,
        budget: 0,
        expenseTotal: 0,
        remaining: 0
    });
    const [expenseHistory, setExpenseHistory] = useState([]);

    const addBudgetData = async () => {
        try {
            // user doc
            const getDoc = await doc(db, 'users', auth?.currentUser?.uid);

            // creating new collection with data inside user doc
            const newCollection = collection(getDoc, 'budget-data');

            // adding new collection to database
            await addDoc(newCollection, {
                budget: budgetData.budget,
                balance: budgetData.balance,
                expenseTotal: budgetData.expenseTotal,
                remaining: (budgetData.budget - budgetData.expenseTotal),

            });
        }catch (error) {
            console.log(error);
        }
    }

    //ToDo: figure out how to get last added doc to the budget data collection
    // so you can pull that data if a user resets their budget data



    const logOut = async () => {
        try {
            await signOut(auth)
            dispatch(setCurrentUser(null))
        } catch (err) {
            console.log(err)
        }
    }
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
                        <h1>${6000}</h1>
                    </div>
                    <div className={'expense-sum'}>
                        <h3>EXPENSES</h3>
                        <h1>${500}</h1>
                    </div>
                    <div className={'expense-history'}>
                        <h3>Expense History</h3>
                    </div>
                    <div className={'budget'}>
                        <h3>BUDGET</h3>
                        <h1>${1200}</h1>
                    </div>
                    <div className={'remaining-budget'}>
                        <h3>REMAINING</h3>
                        <h1>${700}</h1>
                    </div>
                    <div className={'enter-expense'}>
                        <h3>Enter Expense</h3>
                        <label>
                            <h5 className={'enter-expense-header'}>Expense Amount <span>(put error here if there is one)</span></h5>
                            <input placeholder={'amount'} className={'expense-expense-input'} type={'number'}/>
                        </label>

                        <h5>Expense Type</h5>
                        <div className={'enter-expense-choices'}>
                            <label htmlFor={'food'} className={'food-label'}>
                                <input type={'radio'} id={'food'} name={'expenses'} value={'food'}/>
                                <span>Food</span>
                            </label>
                            <label htmlFor={'bills'} className={'bills-label'}>
                                <input type={'radio'} id={'bills'} name={'expenses'} value={'bills'}/>
                                <span>Bills</span>
                            </label>
                            <label htmlFor={'entertain'} className={'entertain-label'}>
                                <input type={'radio'} id={'entertain'} name={'expenses'} value={'entertain'}/>
                                <span>Entertainment</span>
                            </label>
                            <label htmlFor={'savings'} className={'savings-label'}>
                                <input type={'radio'} id={'savings'} name={'expenses'} value={'savings'}/>
                                <span>Savings</span>
                            </label>
                        </div>
                        <button className={'add-expense'}>Add Expense</button>
                    </div>
                    <div className={'graph'}>
                        graph
                    </div>
                </main>
            </div>
        </div>
    )
}