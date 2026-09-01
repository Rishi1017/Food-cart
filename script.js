// Replace with your keys from Firebase Console
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

document.addEventListener('DOMContentLoaded', () => {
    const userBtn = document.getElementById('user-btn');
    const userModal = document.getElementById('user-modal');
    const closeUserBtn = document.querySelector('.close-user-modal');
    
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const resetForm = document.getElementById('reset-form');

    // Monitor Auth State
    auth.onAuthStateChanged(async (user) => {
        if (user) {
            const doc = await db.collection('users').doc(user.uid).get();
            const userData = doc.exists ? doc.data() : { name: user.email };
            window.userProfile = userData;
            if (userBtn) userBtn.innerText = `Hi, ${userData.name.split(' ')[0]}`;
        } else {
            window.userProfile = null;
            if (userBtn) userBtn.innerText = "Login / Profile";
        }
    });

    // Registration Handler
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = document.getElementById('reg-name').value;
            const email = document.getElementById('reg-email').value;
            const phone = document.getElementById('reg-phone').value;
            const password = document.getElementById('reg-password').value;
            const address = document.getElementById('reg-address').value;

            try {
                const res = await auth.createUserWithEmailAndPassword(email, password);
                await db.collection('users').doc(res.user.uid).set({ name, email, phone, address });
                alert("Registration successful!");
                userModal.style.display = 'none';
            } catch (err) {
                alert(err.message);
            }
        });
    }

    // Login Handler
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;

            try {
                await auth.signInWithEmailAndPassword(email, password);
                alert("Logged in successfully!");
                userModal.style.display = 'none';
            } catch (err) {
                alert("Invalid email or password.");
            }
        });
    }

    // Password Reset Handler
    if (resetForm) {
        resetForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('reset-email').value;

            try {
                await auth.sendPasswordResetEmail(email);
                alert("Password reset link sent to your email!");
            } catch (err) {
                alert(err.message);
            }
        });
    }

    // Cart Protection: Guarding item selection
    document.querySelectorAll('.btn-add').forEach(btn => {
        btn.addEventListener('click', (e) => {
            if (!auth.currentUser) {
                e.preventDefault();
                alert("Please log in or register before adding items to your cart.");
                if (userModal) userModal.style.display = 'block';
            } else {
                alert("Item added to cart!");
            }
        });
    });

    if (userBtn) {
        userBtn.addEventListener('click', () => {
            if (userModal) userModal.style.display = 'block';
        });
    }

    if (closeUserBtn) {
        closeUserBtn.onclick = () => { userModal.style.display = 'none'; };
    }
});

