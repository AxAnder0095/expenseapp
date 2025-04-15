import './HomeStyles.sass'
import {signOut} from "firebase/auth";
import {auth} from "./config/firebase-config.js";
import {setCurrentUser} from "./store/currentUserSlice.js";
import {useDispatch} from "react-redux";

export const Home = () => {
    const dispatch = useDispatch();

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
                <h1>Expense Tracker App</h1>
                <div className={'home-main-area'}>
                    <div className={'info'}>
                        <h3>Enter your balance and budget</h3>
                        <input placeholder={'balance'}/>
                        <input placeholder={'budget'}/>
                    </div>
                    <div className={'balance'}>
                        balance
                        home page
                        <button onClick={logOut}>log out</button>
                    </div>
                    <div className={'expense-sum'}>
                        expenses
                    </div>
                    <div className={'expense-history'}>
                        expense history
                    </div>
                    <div className={'budget'}>
                        budget
                    </div>
                    <div className={'remaining-budget'}>
                        Remaining
                    </div>
                    <div className={'enter-expense'}>
                        enter expense
                    </div>
                    <div className={'graph'}>
                        graph
                    </div>
                </div>
            </div>
        </div>
    )
}