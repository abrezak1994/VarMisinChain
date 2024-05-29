// const url = 'https://api-football-v1.p.rapidapi.com/v3/odds/bets';
// const options = {
// 	method: 'GET',
// 	headers: {
// 		'X-RapidAPI-Key': 'b2d9004f4bmshf1e4e188d4bbc66p19b516jsndcb4807cf312',
// 		'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com'
// 	}
// };

// testFootballApi = async () => {
//     try {
//         const response = await fetch(url, options);
//         const result = await response.text();
//         console.log(result);
//     } catch (error) {
//         console.error(error);
//     }
// }

// testFootballApi();

// document.addEventListener('DOMContentLoaded', function() {
//   if (typeof ethers !== 'undefined') {
//       console.log('Ethers.js kütüphanesi yüklendi.');
//   } else {
//       console.error('Ethers.js kütüphanesi yüklenemedi.');
//   }
// });


const submitRegisBtn = document.getElementById("submit-regis-button");

document.getElementById('signupForm').addEventListener('submit', async function(event) {
  event.preventDefault(); // Formun varsayılan gönderme davranışını engelle

  const formData = {
    name: document.getElementById('name').value,
    surname: document.getElementById('surname').value,
    wallet: document.getElementById('wallet').value,
    contact: document.getElementById('contact').value,
    email: document.getElementById('email').value,
    password : document.getElementById('password').value,
    address: document.getElementById('address').value,
  };

  try {
    await checkWallet();

    // Kullanıcıyı Firebase Authentication ile kaydet
    const userCredential = await firebase.auth().createUserWithEmailAndPassword(formData.email, formData.password);
    const user = userCredential.user;
    
    // Kullanıcı bilgilerini Realtime Database'e kaydet
    await firebase.database().ref('users/' + user.uid).set({
      name: formData.name,
      surname: formData.surname,
      wallet: formData.wallet,
      contact: formData.contact,
      email: formData.email,
      address: formData.address,
      activeCoupons: {},
      couponHistory: {}
    });

    console.log('Kullanıcı kaydedildi:', user.uid);
    alert('Kayıt başarılı!');
    window.location.href = 'index.html';
  } catch (error) {
    console.error('Hata:', error.message);
    alert('Kayıt başarısız: ' + error.message);
  }

});

async function checkWallet() {
  const addressInput = document.getElementById('wallet');
  const address = addressInput.value;

  if (!ethers.utils.isAddress(address)) {
      alert('Geçersiz Ethereum adresi.');
      return error;
  } 
}
