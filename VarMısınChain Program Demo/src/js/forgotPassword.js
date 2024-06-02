document.getElementById('forgot-password-form').addEventListener('submit', function(event) {
    event.preventDefault();

    var email = document.getElementById('email').value;
    console.log(email);

    firebase.auth().sendPasswordResetEmail(email)
        .then(function() {
            alert("Password reset email sent!");
            window.location.href = 'index.html';
        })
        .catch(function(error) {
            alert(error.message);
        });
});
