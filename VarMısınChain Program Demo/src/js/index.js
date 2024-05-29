
//  API Options
const options = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': 'b2d9004f4bmshf1e4e188d4bbc66p19b516jsndcb4807cf312',
		'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com'
	}
};

//  Variables
const categories = document.querySelectorAll(".left-aside-menu-list-item");
const midContentMainItemList = document.querySelector(".mid-content-main-item-list");
const midContentMainItems = document.querySelectorAll(".mid-content-main-item");

const loginBtn = document.getElementById("login");
const signupBtn = document.getElementById("signup");
const loginForm = document.getElementById("login-form");
const loginCard = document.getElementById("login-card");
const loggedInCard = document.getElementById("logged-in-card");
const loggedInNameSurname = document.getElementById("logged-in-name-surname");
const loggedInWalletAddress = document.getElementById("logged-in-wallet-address");
const notLoggedInCard = document.getElementById("not-logged-in-card");
const signOutBtn = document.getElementById("sign-out");
const closeLoginTab = document.getElementById("close-login-tab");

const email = document.getElementById('username');
const password = document.getElementById('password');

const ratiosList = document.querySelectorAll(".ratios-list");
const addToCouponBtns = document.querySelectorAll(".add-to-coupon-btn");
const addToCouponText = document.querySelectorAll(".add-to-coupon-text");
const closeCouponBtn = document.getElementById("close-coupon-btn");
const submitCouponBtn = document.getElementById("submit-amount");
const mainSectionRightAside = document.getElementById("main-section-right-aside");
const mainSectionRightAsideContainer = document.getElementById("main-section-right-aside-container");
const mainSectionRightAsideContainerLittle = document.getElementById("main-section-right-aside-container-little");
const mainSectionRightAsideContainerLittleNotifications = document.getElementById("main-section-right-aside-container-little-notifications");

const rightAsideMenuList = document.getElementById("right-aside-menu-list");

const competitionDetails = document.getElementsByClassName("competition-details");

const footballData = document.getElementById("football");
const basketballData = document.getElementById("basketball");
const volleyballData = document.getElementById("volleyball");
const tennisData = document.getElementById("tennis");
const handballData = document.getElementById("handball");
const americanFootballData = document.getElementById("americanfootball");

var couponItemsIDs = [];

// Functions

document.addEventListener('DOMContentLoaded', async () => {
    checkUserLoggedIn();
    sessionStorage.removeItem('coupon');

    let liveMatchesUrl = 'https://api-football-v1.p.rapidapi.com/v3/fixtures?live=all';
    midContentMainItemList.innerHTML = "";

    try {
        const response = await fetch(liveMatchesUrl, options);
        const result = await response.text();
        const data = JSON.parse(result);

        // Verileri işlemek için gerekli bilgileri alalım
        const fixtures = data.response.map(match => {
            const fixture = match.fixture;
            const league = match.league;
            const teams = match.teams;
            const goals = match.goals;
            const score = match.score;
            const events = match.events;

            let currentTime = fixture.status.elapsed ? (fixture.status.elapsed + "'"):"FT";

            const dateTimeString = fixture.date;
            const [date, time] = dateTimeString.split('T');
            const [hours, minutes] = time.split(':');
            const formattedDateTime = `${date} ${hours}:${minutes}`;

            let template = `
                <li>
                    <div class="mid-content-main-item">
                        <div class="competition-code">
                            <div>
                                <img class="event-logo" alt="${league.name}" src="${league.logo}">
                            </div>
                            <div style="margin-left: 2px;">
                                ${fixture.id}
                            </div>
                        </div>
                        <div class="competition-teams">
                            <div class="competition-team competition-team-home"><div><img class="team-logo" src="${teams.home.logo}"></div><div style="text-align:right;">${teams.home.name}</div></div>
                            <div class="competition-score">${goals.home}-${goals.away}</div>
                            <div class="competition-team competition-team-away"><div style="text-align:left;">${teams.away.name}</div><div><img class="team-logo" src="${teams.away.logo}"></div></div>
                        </div>
                        <div class="competition-date ongoing">${currentTime}<span class="ongoing-fade"></span></div>
                    </div>

                    <div class="competition-details" style="display: none;">

                        <div class="competition-fixture-details">
                            <div class="fixture-referee">
                                <div class="fixture-referee-title">Referee:</div>
                                <div class="fixture-referee-name">${fixture.referee ? fixture.referee:"Unknown Referee"}</div>
                            </div>
                            <div class="fixture-league-name">
                                <div class="fixture-league-name-title">League Name:</div>
                                <div class="fixture-league-name-name">${league.name}</div>
                            </div>
                            <div class="fixture-league-country">
                                <div class="fixture-league-country-title">Country:</div>
                                <div class="fixture-league-country-name">${league.country}</div>
                            </div>
                            <div class="fixture-venue-stadium">
                                <div class="fixture-venue-stadium-title">Stadium:</div>
                                <div class="fixture-venue-stadium-name">${fixture.venue.name ? fixture.venue.name:"Unknown Stadium"}</div>
                            </div>
                            <div class="fixture-date">
                                <div class="fixture-date-title">Date:</div>
                                <div class="fixture-date-name">${formattedDateTime}</div>
                            </div>
                        </div>
                        <div class="live-events">
                            <ul id="${fixture.id}" class="events-list">
                                
                                

                            </ul>
                        </div>

                    </div>
                </li>
            `;


            midContentMainItemList.insertAdjacentHTML("beforeend",template);

            let currentLiveEventsContainer = document.getElementById(fixture.id);
            events.forEach(event => {
                
                let eventType = event.type;
                let eventLogoSrc;
                let eventOwner = (event.player.name ? event.player.name:"Unknown Player") + "(" + event.team.name + ")";

                if(eventType == "Card"){
                    if(event.detail == "Yellow Card"){
                        eventLogoSrc = "./img/event logos/yellow-card.png";
                    }else{
                        eventLogoSrc = "./img/event logos/red.png";
                    }
                }else if(eventType == "subst"){
                    eventLogoSrc = "./img/event logos/substitution.png";
                }else if(eventType == "Goal"){
                    if(event.detail == "Penalty"){
                        eventLogoSrc = "./img/event logos/penalty.png";
                    }else{
                        eventLogoSrc = "./img/event logos/goal-logo.png";
                    }
                }else if(eventType == "Var"){
                    eventLogoSrc = "./img/event logos/var.png";
                }else {
                    eventLogoSrc = "";
                }

                currentLiveEventsContainer.insertAdjacentHTML("beforeend",`
                    <li class="events-list-item">
                        <div class="events-list-item-inner">
                            <div class="events-list-item-inner-left"><img class="event-logo" src="${eventLogoSrc}"> ${event.type} (${event.detail})</div>
                            <div class="events-list-item-inner-mid">${eventOwner}</div>
                            <div class="events-list-item-inner-right">${event.time.elapsed}'</div>
                        </div>
                    </li>
                `);
            });
            

            return {
                "Fixture ID": fixture.id,
                "Fixture Referee": fixture.referee,
                "Fixture Date": fixture.date,
                "Venue Name": fixture.venue ? fixture.venue.name : null,
                "Venue City": fixture.venue ? fixture.venue.city : null,
                "Match Status": fixture.status ? fixture.status.long : null,
                "Elapsed Min": fixture.status.elapsed,
                "League ID": league.id,
                "League Country": league.country,
                "League Name": league.name,
                "Home Team Name": teams.home.name,
                "Away Team Name": teams.away.name,
                "Home Team Logo": teams.home.logo,
                "Away Team Logo": teams.away.logo,
                "Home Goals": goals.home,
                "Away Goals": goals.away,
                "Home Half Time Score": score.halftime.home,
                "Away Half Time Score": score.halftime.away,
                "Home Full Time Score": score.fulltime.home,
                "Away Full Time Score": score.fulltime.away,
                "Match Events": events
            };
        });

    } catch (error) {
        console.error(error);
    }
    // ratiosListEvents();
});


loginBtn.addEventListener("click", (e) => {
    e.preventDefault();
    loginCard.style.display = "block";
});

loginForm.addEventListener('submit', async function(event) {
    event.preventDefault();
    try {
      // Kullanıcıyı Firebase Authentication ile giriş yaptı
      const userCredential = await firebase.auth().signInWithEmailAndPassword(email.value, password.value);
      const user = userCredential.user;
  
      console.log('Kullanıcı giriş yaptı:', user.uid);
      alert('Giriş başarılı!');

      // Realtime Database'den kullanıcı bilgilerini al
      const userRef = await firebase.database().ref('users/' + user.uid);
      userRef.once('value').then((snapshot) => {
        if (snapshot.exists()) {
          const userData = snapshot.val();
          let walletAddress = userData.wallet;

          loggedInNameSurname.innerHTML = userData.name + " " + userData.surname;
          loggedInWalletAddress.innerHTML = walletAddress.slice(0,7) + "..." + walletAddress.slice(-5);

          // Kullanıcı bilgilerini sessionStorage'a kaydet
          sessionStorage.setItem('user', JSON.stringify(userData));
          sessionStorage.setItem('isLoggedIn', true);
          sessionStorage.setItem('coupon', "");

          mainSectionRightAside.style.display = "flex";
          
        } else {
          console.log('Kullanıcı bilgisi bulunamadı');
          alert('Kullanıcı bilgisi bulunamadı!');
        }
      });
  
      loginCard.style.display = "none";
      loggedInCard.style.display = "flex";
      notLoggedInCard.style.display = "none";

    } catch (error) {
      console.error('Giriş hatası:', error.message);
      alert('Giriş bilgileri hatalı: ');
    }
});
  
signOutBtn.addEventListener("click", async() => {
    await firebase.auth().signOut().then(() => {
        console.log("Kullanıcı Çıkış Yaptı");
        alert("Çıkış Başarılı");

        sessionStorage.removeItem('user');
        sessionStorage.removeItem('isLoggedIn');
        sessionStorage.removeItem('coupon');

        console.log("Local Storage Temizlendi");

        loggedInCard.style.display = "none";
        notLoggedInCard.style.display = "block";  
        
        loggedInNameSurname.innerHTML = "";
        loggedInWalletAddress.innerHTML = "";
        rightAsideMenuList.innerHTML = `
            <h4 id="right-aside-menu-list-title" class="right-aside-menu-list-title" style="padding: 8px; display: block;">You haven't add any competition</h4>
        `;
        mainSectionRightAsideContainerLittleNotifications.textContent = 0;
        mainSectionRightAside.style.display = "none";
        

    }).catch((error) => {
        console.error("Çıkış yaparken hata oluştu: ",error);
        alert("Çıkış yaparken hata oluştu");
    });
});

closeLoginTab.addEventListener("click", (e) => {
    e.preventDefault();
    loginCard.style.display = "none";
});

closeCouponBtn.addEventListener("click", () => {
    mainSectionRightAsideContainer.style.display = "none";
    mainSectionRightAsideContainerLittle.style.display = "flex";
});

submitCouponBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    console.log("clicked");
    if(checkUserLoggedIn() && (rightAsideMenuList.childElementCount - 1) > 0){
        console.log("Session Open Coupon Submitted");
        // const user = userCredential.user;
        // console.log(user.uid);
        let couponItemIDs = [];
        document.querySelectorAll(".coupons-competition-code").forEach(elm => {
            couponItemIDs.push(elm.textContent.trim());
        });
        console.log(couponItemIDs);
        // await firebase.database().ref('users/' + user.uid);
    }
});

mainSectionRightAsideContainerLittle.addEventListener("click", () => {
    mainSectionRightAsideContainerLittle.style.display = "none";
    mainSectionRightAsideContainer.style.display = "flex";
});

midContentMainItemList.addEventListener("click",function(e){
    let selectedCompetition = e.target.closest("li");

    let detail = selectedCompetition.querySelector(".competition-details");

    if(!selectedCompetition.classList.contains("ratio")){
        if(detail.style.display == "none"){
            detail.style.display = "block";
        }else{
            detail.style.display = "none";
        }
    }
    
});

footballData.addEventListener("click", async function(){
    await LoadFootballData();
});

basketballData.addEventListener("click", function(){
    LoadBasketballData();
});

volleyballData.addEventListener("click", function(){
    LoadVolleyballData();
});

tennisData.addEventListener("click", function(){
    LoadTennisData();
});

handballData.addEventListener("click", function(){
    LoadHandballData();
});

americanFootballData.addEventListener("click", function(){
    LoadAmericanFootballData();
});


const LoadFootballData = async () => {
    let today = new Date();
    let tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    let day = tomorrow.getDate();
    let month = (tomorrow.getMonth() + 1) < 10 ? "0" + (tomorrow.getMonth() + 1) : (tomorrow.getMonth() + 1);

    let year = tomorrow.getFullYear();

    let formattedDate = `${year}-${month}-${day}`;

    let MatchesUrl = `https://api-football-v1.p.rapidapi.com/v3/odds?date=${formattedDate}`;
    // console.log(formattedDate);
    
    midContentMainItemList.innerHTML = "";

    await createBetDetails(MatchesUrl);

    // console.log(couponItemsIDs);

}

const createBetDetails = async (MatchesUrl) => {
    try {
        const response = await fetch(MatchesUrl, options);
        const result = await response.text();
 
        const data = JSON.parse(result);

        // Verileri işlemek için gerekli bilgileri alalım
        const fixtures = data.response.map(match => {

            const fixture = match.fixture;
            const league = match.league;
            const update = match.update;
            const bookmakers = match.bookmakers[0];

            const betsMatchWinner = bookmakers.bets[0];
            // const betsHomeAway = bookmakers.bets[1];
            const betsHalfTimeFullTime = bookmakers.bets[6];
            // console.log(betsHalfTimeFullTime);

            let currentFixture = getDataFromApi(fixture.id).then(fixtureData => {
                let currID = fixtureData["Fixture ID"];
                let currHome = fixtureData["Home Team Name"];
                let currAway = fixtureData["Away Team Name"];
                let currHomeLogo = fixtureData["Home Team Logo"];
                let currAwayLogo = fixtureData["Away Team Logo"];
            

                const dateTimeString = fixture.date;
                const [date, time] = dateTimeString.split('T');
                const [hours, minutes] = time.split(':');
                const formattedDateTime = `${date} ${hours}:${minutes}`;

                const updateTimeString = update;
                const [betDate, betTime] = updateTimeString.split('T');
                const [betHours, betMinutes] = betTime.split(':');
                const formattedBetDateTime = `${betDate} ${betHours}:${betMinutes}`;

                let template = `
                        <li>
                            <div class="mid-content-main-item mid-content-main-item-bet">
                                <div class="mid-content-main-item-bet-top">
                                    <div class="competition-code">${fixture.id}</div>
                                    <div class="competition-teams">
                                        <div class="competition-team" style="justify-content: flex-start;"><img class="team-logo" src="${currHomeLogo}"> ${currHome}</div>
                                        <div class="competition-score">vs</div>
                                        <div class="competition-team competition-team-bet">${currAway} <img class="team-logo" src="${currAwayLogo}"></div>
                                    </div>
                                    <div class="competition-date">${formattedDateTime}</div>
                                </div>
                            </div>
                            <div class="competition-details" style="display: none;">
                                <div class="competition-fixture-details">
                                    <div class="fixture-referee">
                                        <div class="fixture-referee-title">Referee:</div>
                                        <div class="fixture-referee-name">${fixture.id}</div>
                                    </div>
                                    <div class="fixture-league-name">
                                        <div class="fixture-league-name-title">League Name:</div>
                                        <div class="fixture-league-name-name">${league.name}</div>
                                    </div>
                                    <div class="fixture-league-country">
                                        <div class="fixture-league-country-title">Country:</div>
                                        <div class="fixture-league-country-name">${league.country}</div>
                                    </div>
                                    <div class="fixture-date">
                                        <div class="fixture-date-title">Date:</div>
                                        <div class="fixture-date-name">${formattedDateTime}</div>
                                    </div>
                                
                                <div class="ratios">
                                    <ul id="${fixture.id}" class="ratios-list wrap">
                                        <li class="ratio" data="0" value="${betsMatchWinner.values[0].odd}"><div class="ratio-inner">${betsMatchWinner.name}</div><div class="ratio-inner-value" style="font-size: 14px;">${betsMatchWinner.values[0].value} ${betsMatchWinner.values[0].odd}</div></li>
                                        <li class="ratio" data="1" value="${betsMatchWinner.values[1].odd}"><div class="ratio-inner">${betsMatchWinner.name}</div><div class="ratio-inner-value" style="font-size: 14px;">${betsMatchWinner.values[1].value} ${betsMatchWinner.values[1].odd}</div></li>
                                        <li class="ratio" data="2" value="${betsMatchWinner.values[2].odd}"><div class="ratio-inner">${betsMatchWinner.name}</div><div class="ratio-inner-value" style="font-size: 14px;">${betsMatchWinner.values[2].value} ${betsMatchWinner.values[2].odd}</div></li>
                                    </ul>
                                </div>
                                <div class="add-to-coupon">
                                    <input type="text" name="text" disabled class="add-to-coupon-text" value="Selection: ">
                                    <input type="button" class="add-to-coupon-btn" value="Add to Coupon">
                                </div>
                            </div>
                        </li>     
                `;

                midContentMainItemList.insertAdjacentHTML("beforeend",template);
                
                const currentElement = document.getElementById(currID);

                currentElement.addEventListener("click", function(e){

                    let selectedLi = e.target.closest("li");
                    let currentList = selectedLi.closest("ul");
            
                    // ul elemanının en yakın li ebeveynini buluyoruz
                    var parentLi = currentList.closest('li');
                    // parentLi içinde add-to-coupon sınıfına sahip div elemanını buluyoruz
                    var addToCouponDiv = parentLi.querySelector('.add-to-coupon');
                    // add-to-coupon sınıfına sahip div içinde add-to-coupon-text sınıfına sahip input elemanını buluyoruz
                    var addToCouponTextInput = addToCouponDiv.querySelector('.add-to-coupon-text');

                    const addToCouponBtn = addToCouponDiv.querySelector('.add-to-coupon-btn');
            
                    currentElement.querySelectorAll(".ratio").forEach(element => {
                        if(element.classList.contains("selected"))
                            element.classList.remove("selected");
                    });
                
                    selectedLi.classList.add("selected");
                
                    let ratio = selectedLi.getAttribute("value");

                    addToCouponTextInput.value = "Selection: " + ratio;

                    const selectedOddName = selectedLi.querySelector(".ratio-inner");
                    const selectedOddValue = selectedLi.querySelector(".ratio-inner-value");
                    const selectedOddValueText = selectedOddValue.textContent.split(" ");

                    addToCouponBtn.addEventListener("click", (e) => {
                        e.preventDefault();

                        if(!sessionStorage.getItem('isLoggedIn') || sessionStorage.getItem('user') == null){
                            alert("Please Login First!");
                            return;
                        }

                        if(sessionStorage.getItem('coupon')){
                            if(sessionStorage.getItem('coupon').includes(currID)){
                                alert("You have already add this match to your coupon.");
                                return;
                            }
                        }else {
                            sessionStorage.setItem('coupon',"");
                        }

                        if(document.getElementById("right-aside-menu-list-title")){
                            document.getElementById("right-aside-menu-list-title").style.display = "none";
                        }

                        let couponItemTemplate = `
                            <li class="right-aside-menu-list-item">
                                <div class="coupons-competition">
                                    <div class="coupons-competition-left">
                                        <div class="coupons-competition-category-icon">
                                            <i class="left-aside-menu-item-right fa-sharp fa-solid fa-futbol fa-2xs" style="color: #fff;"></i>
                                        </div>
                                        <div class="coupons-competition-code">
                                            ${currID}
                                        </div>
                                    </div>
                                    <div class="coupons-competition-mid">
                                        <div class="coupons-competition-mid-col-top">
                                            <div class="coupons-competition-home">
                                                <img src="${currHomeLogo}" class="event-logo"> ${currHome}
                                            </div>
                                            
                                            <div class="coupons-competition-away">
                                                <img src="${currAwayLogo}" class="event-logo"> ${currAway}
                                            </div>
                                        </div>
                                        <div class="coupons-competition-mid-col-mid">
                                            <div class="coupons-competition-date">
                                                Bugün
                                            </div>
                                            <div class="coupons-competition-hour">
                                                ${hours}:${minutes}
                                            </div>
                                        </div>
                                        <div class="coupons-competition-mid-col-bottom">
                                            <div class="coupons-competition-bet-type">
                                                ${selectedOddName.textContent}
                                            </div>
                                            <div class="coupons-competition-bet-result">
                                                ${selectedOddValueText[0]}
                                            </div>
                                        </div>
                                    </div>
                                    <div class="coupons-competition-right">
                                        <div id="${currID}-coupon" class="coupons-competition-delete-competition">
                                            <i class="fa-solid fa-trash"></i>
                                        </div>
                                        <div class="coupons-competition-bet-ratio">
                                        ${ratio}
                                        </div>
                                    </div>
                                </div>
                            </li>
                        `;

                        let tempDiv = document.createElement('div');
                        tempDiv.innerHTML = couponItemTemplate;

                        rightAsideMenuList.insertAdjacentElement("beforeend",tempDiv);

                        mainSectionRightAsideContainerLittleNotifications.textContent = rightAsideMenuList.childElementCount - 1;
                        couponItemsIDs.push(currID);
                        sessionStorage.setItem('coupon', couponItemsIDs);

                        const deleteCouponCompetition = document.getElementById(`${currID}-coupon`);

                        deleteCouponCompetition.addEventListener("click", () => {
                            deleteCouponCompetition.closest("li").parentElement.remove();
                            mainSectionRightAsideContainerLittleNotifications.textContent = rightAsideMenuList.childElementCount - 1;

                            couponItemsIDs = couponItemsIDs.filter(element => element !== currID);
                            sessionStorage.setItem('coupon', couponItemsIDs);

                            if(document.getElementById("right-aside-menu-list-title").style.display == "none" && rightAsideMenuList.childElementCount == 1){
                                document.getElementById("right-aside-menu-list-title").style.display = "block";
                            }

                        });
                        
                    })

                });
                
            });
            
        });

    } catch (error) {
        console.error(error);
    }
}

const LoadBasketballData = () => {

}

const LoadVolleyballData = () => {

}

const LoadTennisData = () => {

}

const LoadHandballData = () => {

}

const LoadAmericanFootballData = () =>{

}

const getUserFromsessionStorage = () => {
    const userData = sessionStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
    //   console.log('Kayıtlı Kullanıcı Bilgileri:', user);
      return user;
    } else {
      console.log('No user data found in sessionStorage');
      return null;
    }
}

const checkUserLoggedIn = () => {
    if(sessionStorage.getItem('isLoggedIn') && sessionStorage.getItem('user') != null){
        let userCred = JSON.parse(sessionStorage.getItem('user'));
        let walletAddress = userCred.wallet;

        loggedInNameSurname.innerHTML = userCred.name + " " + userCred.surname;
        loggedInWalletAddress.innerHTML = walletAddress.slice(0,7) + "..." + walletAddress.slice(-5);

        loggedInCard.style.display = "flex";
        notLoggedInCard.style.display = "none";

        mainSectionRightAside.style.display = "flex";

        return true;
    }else {
        return false;
    }
}

const getDataFromApi = async(fixtureID) => {

    // Assuming this code is inside an async function
    let fixtureIDUrl = `https://api-football-v1.p.rapidapi.com/v3/fixtures?id=${fixtureID}`;
    try {
        const fixtureResponse = await fetch(fixtureIDUrl, options);
        const fixtureResult = await fixtureResponse.json();

        const result = fixtureResult.response[0];

        return {
            "Fixture ID": result.fixture.id,
            "Venue Name": result.fixture.venue.name,
            "Match Status": result.fixture.status.long,
            "Home Team Name": result.teams.home.name,
            "Home Team Logo": result.teams.home.logo,
            "Away Team Name": result.teams.away.name,
            "Away Team Logo": result.teams.away.logo
        };

    } catch (error) {
        console.error('Error fetching fixture data:', error);
    }
}