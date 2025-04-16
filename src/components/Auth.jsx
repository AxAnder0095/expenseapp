import './AuthStyles.sass'
import {FaCheckCircle} from 'react-icons/fa'
import {IoLogIn} from "react-icons/io5";
import {auth, db} from '../config/firebase-config.js'
import {doc, setDoc} from 'firebase/firestore'
import {useState} from "react";
import {useDispatch} from "react-redux";
import {setCurrentUser} from '../store/currentUserSlice.js';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    onAuthStateChanged,
} from 'firebase/auth'

function Auth() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');

    const dispatch = useDispatch();

    const switchToSignUp = () => {
        document.querySelector('.auth-sign-in').style.zIndex = -1;
        document.querySelector('.auth-sign-up').style.zIndex = 1;
    };

    const switchToSignIn = () => {
        document.querySelector('.auth-sign-in').style.zIndex = 1;
        document.querySelector('.auth-sign-up').style.zIndex = -1;
    };

    onAuthStateChanged(auth, (user) => {
        if (user) {
            dispatch(setCurrentUser(user.uid));
        } else {
            dispatch(setCurrentUser(null))
        }
    })

    const signUp = async () => {
        console.log('in sign up')
        try {
            await createUserWithEmailAndPassword(auth, email, password)
            await setDoc(doc(db, 'users', auth?.currentUser?.uid), {
                userID: auth?.currentUser?.uid,
                userEmail: email,
                userName: name
            })
        }catch(err) {
            console.log(err)
        }
    }

    const signIn = async () => {
        try {
            await signInWithEmailAndPassword(auth, email, password)
        } catch (error) {
            console.log(error)
        }
    };

    return (
        <div className={'auth-container'}>
            <div className={'auth-content-wrapper'}>
                <h2 className={'auth-title'}>Expense Tracker</h2>
                <div className={'auth-content'}>
                    <div className={'auth-sign-in'}>
                        <div className={'auth-sign-in-left'}>
                            <p className={'login-title'}>Login</p>
                            <input
                                type={'email'}
                                placeholder={'Email'}
                                className={'auth-sign-in-email'}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <br/>
                            <input
                                type={'password'}
                                placeholder={'Password'}
                                className={'auth-sign-in-password'}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <br/>
                            <button className={'auth-sign-in-submit'} onClick={signIn}>Sign In</button>
                        </div>
                        <div className={'auth-sign-in-right'}>
                            <div className={'auth-sign-in-right-content'}>
                                <div className={'auth-sign-in-icon'}>{<FaCheckCircle/>}</div>
                                <p className={'auth-sign-in-right-desc'}>Dont have an account? <br/> Click here to sign
                                    up!</p>
                                <button className={'auth-sign-in-redirect'} onClick={switchToSignUp}>Sign Up</button>
                            </div>
                        </div>
                    </div>
                    <div className={'auth-sign-up'}>
                        <div className={'auth-sign-up-left'}>
                            <p className={'sign-up-title'}>Sign Up</p>
                            <input
                                type={'email'}
                                placeholder={'Email'}
                                className={'auth-sign-up-email'}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <br/>
                            <input
                                type={'password'}
                                placeholder={'Password'}
                                className={'auth-sign-up-password'}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <br/>
                            <input
                                type={'text'}
                                placeholder={'Name'}
                                className={'auth-sign-up-name'}
                                onChange={(e) => setName(e.target.value)}
                            />
                            <br/>
                            <button type={'submit'} className={'auth-sign-up-submit'} onClick={signUp}>Sign Up
                            </button>
                        </div>
                        <div className={'auth-sign-up-right'}>
                            <div className={'auth-sign-up-right-content'}>
                                <div className={'auth-sign-up-icon'}>{<IoLogIn/>}</div>
                                <p className={'auth-sign-up-right-desc'}>Return to login screen</p>
                                <button className={'auth-sign-up-redirect'} onClick={switchToSignIn}>Sign In</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Auth;