//  API Options
const options = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': 'b2d9004f4bmshf1e4e188d4bbc66p19b516jsndcb4807cf312',
		'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com'
	}
};

//  Variables
let couponItemsIDs = [];

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
const betHistoryToggleBtn = document.getElementById("bet-history");
const betHistoryList = document.getElementById("bet-history-list");

const couponDetailsToggleBtns = document.querySelectorAll(".coupon-details-button");

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

const betAmountArea = document.getElementById("bet-amount-area");

const footballData = document.getElementById("football");
const basketballData = document.getElementById("basketball");
const volleyballData = document.getElementById("volleyball");
const tennisData = document.getElementById("tennis");
const handballData = document.getElementById("handball");
const americanFootballData = document.getElementById("americanfootball");

// Functions & Event Listeners

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
});//  Checked


loginBtn.addEventListener("click", (e) => {
    e.preventDefault();
    loginCard.style.display = "block";
});//   Checked

loginForm.addEventListener('submit', async function(event) {
    event.preventDefault();
    try {
      const userCredential = await firebase.auth().signInWithEmailAndPassword(email.value, password.value);
      const user = userCredential.user;

      alert('Giriş başarılı!');

      // Get user information from realtime database
      const userRef = await firebase.database().ref('users/' + user.uid);
      userRef.once('value').then((snapshot) => {
        if (snapshot.exists()) {
          const userData = snapshot.val();
          const userActiveCoupons = userData.activeCoupons;
          let walletAddress = userData.wallet;

          loggedInNameSurname.innerHTML = userData.name + " " + userData.surname;
          loggedInWalletAddress.innerHTML = walletAddress.slice(0,7) + "..." + walletAddress.slice(-5);

          if(userActiveCoupons != undefined) {
              Object.keys(userActiveCoupons).forEach(key => {
                
                const couponItemIDs = userActiveCoupons[key].couponItemIDs;
                let betHistoryTemplate = `
                    <li class="bet-history-item">
                                                
                        <div class="coupon-top">
                            <div class="coupon-id">${key}</div>
                            <div class="coupon-details-button">
                                <i class="fa-solid fa-caret-down"></i>
                            </div>
                        </div>
                        
                        <div class="coupon-items">
                            <ul id="coupon-item-list-${key}">

                            </ul>
                        </div>
                        
                        <div class="bet-ratio-amount">
                            <div class="bet-amount">Amount: ${userActiveCoupons[key].betAmount}</div>
                            <div class="total-earn">Earn: ${((userActiveCoupons[key].betAmount) * (userActiveCoupons[key].ratioResult)).toFixed(2)}</div>
                            <div class="status active-bet">Active</div>
                        </div>
                    </li>
                `;

                betHistoryList.innerHTML += betHistoryTemplate;
                
                let couponItemList = document.getElementById(`coupon-item-list-${key}`);
                
                couponItemIDs.forEach(item => {
                    const betItemID = item.id;
                    const betItemSelection = item.betSelect;
                    const betItemHomeTeam = item.home;
                    const betItemAwayTeam = item.away;
                    
                    let innerBetHistoryTemplate = `
                        
                        <li class="coupon-item">
                            <div class="fixture-id">${betItemID}</div>
                            <div class="fixture-details">
                                <div class="home-team">${betItemHomeTeam}</div>
                                <div>-</div>
                                <div class="away-team">${betItemAwayTeam}</div>
                            </div>
                            <div class="fixture-bets">
                                <div class="user-bet-selection">${betItemSelection}</div>
                                <div class="user-bet-ratio">2.35</div>
                            </div>
                        </li>
                        
                    `;
                    
                    couponItemList.innerHTML += innerBetHistoryTemplate;
                    
                });

              });
            } 


          // Save user information to the session storage
          sessionStorage.setItem('user', JSON.stringify(userData));
          sessionStorage.setItem('uid', user.uid);
          sessionStorage.setItem('isLoggedIn', true);
          sessionStorage.setItem('coupon', "");

          mainSectionRightAside.style.display = "flex";
        } else {
          alert('The user has not found!');
          console.log("kullanıcı bulunamadı");
        }
      });
  
      loginCard.style.display = "none";
      loggedInCard.style.display = "flex";
      notLoggedInCard.style.display = "none";

      /* Blockchain start */
      await connectWallet(); // connectWallet fonksiyonunun çağrılmasını bekle
      console.log("connect wallet executed");
      /* Blockchain end */
    } catch (error) {
      alert('Wrong Login Information');
      console.log(error);
    }
});//   Checked
  
signOutBtn.addEventListener("click", async() => {
    await firebase.auth().signOut().then(() => {
        console.log("Kullanıcı Çıkış Yaptı");
        alert("Çıkış Başarılı");

        sessionStorage.removeItem('user');
        sessionStorage.removeItem('isLoggedIn');
        sessionStorage.removeItem('coupon');
        sessionStorage.removeItem('uid');

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

        window.location.href = 'index.html';
        

    }).catch((error) => {
        console.error("Error occured while sign out: ",error);
        alert("Error occured while sign out:");
    });
});//   Checked

closeLoginTab.addEventListener("click", (e) => {
    e.preventDefault();
    loginCard.style.display = "none";
});//   Checked

closeCouponBtn.addEventListener("click", () => {
    mainSectionRightAsideContainer.style.display = "none";
    mainSectionRightAsideContainerLittle.style.display = "flex";
});//   Checked

betHistoryToggleBtn.addEventListener("click", (e) => {
    let historyBtn = document.getElementById("show-bet-history-button");
    let icon = historyBtn.querySelector(".fa-solid");
    let iconsClassList = icon.classList;
    
    if(iconsClassList.contains("fa-caret-down")){
        iconsClassList.remove("fa-caret-down");
        iconsClassList.add("fa-caret-up");

        betHistoryList.style.display = "none";
    }else {
        iconsClassList.remove("fa-caret-up");
        iconsClassList.add("fa-caret-down");

        betHistoryList.style.display = "flex";
    }

});//   Checked

const generateCouponID = () => {
    let first = Math.random().toString(36).substr(2, 16);
    let second = Math.random().toString(36).substr(2, 16);

    return first+second;
}//   Checked

submitCouponBtn.addEventListener("click", async (e) => {
    e.preventDefault();

    if(checkUserLoggedIn() && ((rightAsideMenuList.childElementCount - 1) > 0)){
        if(betAmountArea.value != "" && betAmountArea.value > 0){
            mainSectionRightAsideContainerLittleNotifications.textContent = 0;
            let currUID = sessionStorage.getItem("uid");
            let couponItemIDs = [];

            document.querySelectorAll(".coupons-competition-code").forEach(elm => {
                couponItemIDs.push({
                    id: elm.textContent.trim(),
                    betSelect: elm.parentElement.nextElementSibling.querySelector(".coupons-competition-bet-type").textContent.trim(),
                    home: elm.parentElement.nextElementSibling.querySelector(".coupons-competition-home").textContent.trim(),
                    away: elm.parentElement.nextElementSibling.querySelector(".coupons-competition-away").textContent.trim()
                });
            });

            const auth = firebase.auth();

            auth.onAuthStateChanged((user) => {
                if(user) {
                    const couponID = generateCouponID();
                    const userRef = firebase.database().ref('users/' + currUID + '/activeCoupons/' + couponID);
                    let multiplyRatios = 1.00;

                    calculateRatios(couponItemIDs, multiplyRatios, userRef, betAmountArea.value);
                }
            });

            betAmountArea.value = 0;
        }else {
            alert("Please enter a valid Bet Amount!");
        }
    }else {
        alert("Please Login First!");
    }
});//   Checked

const calculateRatios = async (couponItemIDs, multiplyRatios, userRef, betAmount) => {//, userRef, betAmount
    /* Blockchain Start */
    let bigMultiplyRatios = new BigNumber(multiplyRatios); // BigNumber ile başlangıç oranı
    /* Blockchain End */
    
    for (const item of couponItemIDs) {
        const oddsFixtureID = `https://api-football-v1.p.rapidapi.com/v3/odds?fixture=${item.id}`;
        let ratio = await getRatiosForCouponItems(oddsFixtureID, item.betSelect);
        // multiplyRatios *= parseFloat(ratio); //Before Blockchain
        /* Blockchain Start */
        bigMultiplyRatios = bigMultiplyRatios.multipliedBy(new BigNumber(ratio));
        /* Blockchain End */
    }

    /* Blockchain Start */
    const scaledOdds = bigMultiplyRatios.multipliedBy(new BigNumber(100)).decimalPlaces(0, BigNumber.ROUND_DOWN); // Yuvarlama işlemi yapılıyor
    console.log("Scaled Odds:", scaledOdds.toString());
    /* Blockchain End */

    const newData = {
        couponItemIDs: couponItemIDs,
        ratioResult: scaledOdds.toString(),// multiplyRatios // Before Blockhain
        betAmount: betAmount,//betAmount
        betStatus: "Active"
    };

    /* Blockchain Start */
    try {
        
        const accounts = await web3.eth.getAccounts();
        console.log("Accounts:", accounts);

        // betAmount ve ratioResult'ı wei olarak işleyelim
        const weiBetAmount = web3.utils.toWei(betAmount.toString(), 'ether');//betAmount

        await bettingContract.methods.placeBet(scaledOdds.toString()).send({
            from: accounts[0],
            value: weiBetAmount
        });

        userRef.update(newData)
        .then(() => {
            alert("Coupon submitted successfully!");

            sessionStorage.removeItem('coupon');
            couponItemsIDs = [];

            rightAsideMenuList.innerHTML = `
                <h4 id="right-aside-menu-list-title" class="right-aside-menu-list-title" style="padding: 8px; display: block;">You haven't added any competition</h4>
            `;
        })
        .catch((error) => {
            console.error("An Error occured while updating:", error);
        });

    } catch (error) {
        console.error('Error placing bet', error);
        alert('Error placing bet: ' + error.message);
    }
    /* Blockchain End */

    // userRef.update(newData)  //  Before Blockchain
    // .then(() => {
    //     alert("Coupon submitted successfuly!");

    //     sessionStorage.removeItem('coupon');
    //     couponItemsIDs = [];
        
    //     rightAsideMenuList.innerHTML = `
    //         <h4 id="right-aside-menu-list-title" class="right-aside-menu-list-title" style="padding: 8px; display: block;">You haven't add any competition</h4>
    //     `;
    // })
    // .catch((error) => {
    //     console.error("An Error occured while updating:", error);
    // });    
}//   Checked

const getRatiosForCouponItems = async (oddsFixtureID, couponResultSelection) => {
    try{
        const response = await fetch(oddsFixtureID, options);
        const result = await response.text();
        const data = JSON.parse(result);

        const fixtureOdds = data.response.map(match => {
            let betSelection;

            if(couponResultSelection == "Home"){
                betSelection = 0;
            }else if(couponResultSelection == "Draw"){
                betSelection = 1;
            }else if(couponResultSelection == "Away"){
                betSelection = 2;
            }else {
                alert("An Error Occured. Please contact with support");
            }

            const bookmakers = match.bookmakers[0]; //Nordic Bet
            const fixtureid = match.fixture.id;
            return bookmakers.bets[0].values[betSelection].odd;
        });

        // return fixtureOdds; // Before Blockchain
        /* Blockchain Start */
        return fixtureOdds[0];
        /* Blockchain End */

    } catch (error) {
        console.error(error);
    }
}//   Checked ???return???

mainSectionRightAsideContainerLittle.addEventListener("click", () => {
    mainSectionRightAsideContainerLittle.style.display = "none";
    mainSectionRightAsideContainer.style.display = "flex";
});//   Checked

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
    
});//   Checked

footballData.addEventListener("click", async function(){
    await LoadFootballData();
});//   Checked

basketballData.addEventListener("click", function(){
    LoadBasketballData();
});//   Checked

volleyballData.addEventListener("click", function(){
    LoadVolleyballData();
});//   Checked

tennisData.addEventListener("click", function(){
    LoadTennisData();
});//   Checked

handballData.addEventListener("click", function(){
    LoadHandballData();
});//   Checked

americanFootballData.addEventListener("click", function(){
    LoadAmericanFootballData();
});//   Checked


const LoadFootballData = async () => {
    let today = new Date();
    let tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    let day = tomorrow.getDate() < 10 ? "0" + tomorrow.getDate() : tomorrow.getDate();
    let month = (tomorrow.getMonth() + 1) < 10 ? "0" + (tomorrow.getMonth() + 1) : (tomorrow.getMonth() + 1);
    let year = tomorrow.getFullYear();

    let formattedDate = `${year}-${month}-${day}`;

    let MatchesUrl = `https://api-football-v1.p.rapidapi.com/v3/odds?date=${formattedDate}`;
    
    midContentMainItemList.innerHTML = "";

    await createBetDetails(MatchesUrl);

}//   Checked

const createBetDetails = async (MatchesUrl) => {
    try {
        const response = await fetch(MatchesUrl, options);
        const result = await response.text();
        const data = JSON.parse(result);

        const fixtures = data.response.map(match => {
            const fixture = match.fixture;
            const league = match.league;
            const update = match.update;
            const bookmakers = match.bookmakers[0]; //Nordic Bet

            const betsMatchWinner = bookmakers.bets[0];

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
                                        <li class="ratio" data="0" value="${betsMatchWinner.values[0].odd *100}"><div class="ratio-inner">${betsMatchWinner.name}</div><div class="ratio-inner-value" style="font-size: 14px;">${betsMatchWinner.values[0].value} ${betsMatchWinner.values[0].odd}</div></li>
                                        <li class="ratio" data="1" value="${betsMatchWinner.values[1].odd *100}"><div class="ratio-inner">${betsMatchWinner.name}</div><div class="ratio-inner-value" style="font-size: 14px;">${betsMatchWinner.values[1].value} ${betsMatchWinner.values[1].odd}</div></li>
                                        <li class="ratio" data="2" value="${betsMatchWinner.values[2].odd *100}"><div class="ratio-inner">${betsMatchWinner.name}</div><div class="ratio-inner-value" style="font-size: 14px;">${betsMatchWinner.values[2].value} ${betsMatchWinner.values[2].odd}</div></li>
                                    </ul>
                                </div>
                                <div class="add-to-coupon">
                                    <input type="text" name="text" disabled class="add-to-coupon-text" value="Selection: ">
                                    <input type="button" id="${fixture.id}-add-to-coupon-btn" class="add-to-coupon-btn" value="Add to Coupon">
                                </div>
                            </div>
                        </li>     
                `;

                midContentMainItemList.insertAdjacentHTML("beforeend",template);

                // Get Selected Target li Element
                document.getElementById(`${fixture.id}`).addEventListener("click", (e) => {

                    e.target.closest("ul").querySelectorAll(".ratio").forEach(element => {
                        if(element.classList.contains("selected"))
                            element.classList.remove("selected");
                    });

                    if(!e.target.closest("li").classList.contains("selected")){
                        e.target.closest("li").classList.add("selected");
                    }
                    
                });

                // Add to Coupon Btns Event Listener
                document.getElementById(`${fixture.id}-add-to-coupon-btn`).addEventListener("click", (e) => {
                    e.preventDefault();
                    // console.log("add to coupon button");
                    if(!sessionStorage.getItem('isLoggedIn') || sessionStorage.getItem('user') == null){
                        alert("Please Login First!");
                        return;
                    }

                    if(sessionStorage.getItem('coupon') != null) {
                        if(sessionStorage.getItem('coupon').includes(fixture.id)){
                            alert("You have already add this match to your coupon.");
                            return;
                        }
                    }

                    mainSectionRightAsideContainerLittleNotifications.textContent = rightAsideMenuList.childElementCount;
                    couponItemsIDs.push(fixture.id);
                    sessionStorage.setItem('coupon', couponItemsIDs);

                    console.log("anasısikikpiyuade");
                    if(document.getElementById("right-aside-menu-list-title"))
                        document.getElementById("right-aside-menu-list-title").style.display = "none";

                    var parentUl = document.getElementById(`${fixture.id}`);
                    var selectedLi;
                    var selectedBetText;
                    
                    parentUl.querySelectorAll(".ratio").forEach(element => {
                        if(element.classList.contains("selected")){
                            console.log(element.getAttribute("data"));
                            selectedLi = element;
                        } 
                    });

                    if(selectedLi.getAttribute("data") == 0){
                        selectedBetText = "Home";
                    }else if(selectedLi.getAttribute("data") == 1) {
                        selectedBetText = "Draw";
                    }else {
                        selectedBetText = "Away";
                    }

                    let couponItemTemplate = `
                        <li id="${fixture.id}-coupon-container" class="right-aside-menu-list-item">
                            <div class="coupons-competition">
                                <div class="coupons-competition-left">
                                    <div class="coupons-competition-category-icon">
                                        <i class="left-aside-menu-item-right fa-sharp fa-solid fa-futbol fa-2xs" style="color: #fff;"></i>
                                    </div>
                                    <div class="coupons-competition-code">
                                        ${fixture.id}
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
                                            ${selectedBetText}
                                        </div>
                                        <div class="coupons-competition-bet-result">
                                            
                                        </div>
                                    </div>
                                </div>
                                <div class="coupons-competition-right">
                                    <div id="${fixture.id}-coupon-delete-btn" class="coupons-competition-delete-competition">
                                        <i class="fa-solid fa-trash"></i>
                                    </div>
                                    <div class="coupons-competition-bet-ratio">
                                        ${betsMatchWinner.values[selectedLi.getAttribute("data")].odd}
                                    </div>
                                </div>
                            </div>
                        </li>
                    `;

                    rightAsideMenuList.innerHTML += couponItemTemplate;

                });
            });
        });

        //  Delete Competition From Coupon Btns
        document.getElementById("right-aside-menu-list").addEventListener("click", (e) => {
            if (e.target && e.target.closest(".coupons-competition-delete-competition")) {
                const couponContainer = e.target.closest(".right-aside-menu-list-item");
                const couponId = couponContainer.id.split("-")[0];
                console.log(couponId);
                console.log(couponItemsIDs);
                couponContainer.remove();

                mainSectionRightAsideContainerLittleNotifications.textContent = rightAsideMenuList.childElementCount -1;

                couponItemsIDs = couponItemsIDs.filter(element => element !== parseInt(couponId,10));
                sessionStorage.setItem('coupon', couponItemsIDs);
                console.log(couponItemsIDs);

                if (document.getElementById("right-aside-menu-list").childElementCount === 1) {
                    document.getElementById("right-aside-menu-list-title").style.display = "block";
                }
            }
        });

    } catch (error) {
        console.error(error);
    }
}//   Checked ***x100 added***

const LoadBasketballData = () => {

}//   Checked

const LoadVolleyballData = () => {

}//   Checked

const LoadTennisData = () => {

}//   Checked

const LoadHandballData = () => {

}//   Checked

const LoadAmericanFootballData = () =>{

}//   Checked

const getUserFromsessionStorage = () => {
    const userData = sessionStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);

      return user;
    } else {
      console.log('No user data found in sessionStorage');

      return null;
    }
}//   Checked

const checkUserLoggedIn = () => {
    if(sessionStorage.getItem('isLoggedIn') && sessionStorage.getItem('user') != null){
        let userCred = JSON.parse(sessionStorage.getItem('user'));
        let walletAddress = userCred.wallet;

        let userActiveCoupons = userCred.activeCoupons;

        loggedInNameSurname.innerHTML = userCred.name + " " + userCred.surname;
        loggedInWalletAddress.innerHTML = walletAddress.slice(0,7) + "..." + walletAddress.slice(-5);

        if(userActiveCoupons != undefined) {
            betHistoryList.innerHTML = "";
            Object.keys(userActiveCoupons).forEach(key => {
              
              console.log(`Key: ${key}`);
              const couponItemIDs = userActiveCoupons[key].couponItemIDs;
              let betHistoryTemplate = `
                  <li class="bet-history-item">
                                              
                      <div class="coupon-top">
                          <div class="coupon-id">${key}</div>
                          <div class="coupon-details-button">
                              <i class="fa-solid fa-caret-down"></i>
                          </div>
                      </div>
                      
                      <div class="coupon-items">
                          <ul id="coupon-item-list-${key}">

                          </ul>
                      </div>
                      
                      <div class="bet-ratio-amount">
                          <div class="bet-amount">Amount: ${userActiveCoupons[key].betAmount}</div>
                          <div class="total-earn">Earn: ${((userActiveCoupons[key].betAmount) * (userActiveCoupons[key].ratioResult)).toFixed(2)}</div>
                          <div class="status active-bet">Active</div>
                      </div>
                  </li>
              `;

              
              betHistoryList.innerHTML += betHistoryTemplate;
              
              let couponItemList = document.getElementById(`coupon-item-list-${key}`);
              
              couponItemIDs.forEach(item => {
                  // console.log(`Bet Select: ${item.betSelect}, ID: ${item.id}`);
                  const betItemID = item.id;
                  const betItemSelection = item.betSelect;
                  const betItemHomeTeam = item.home;
                  const betItemAwayTeam = item.away;
                  
                  let innerBetHistoryTemplate = `
                      
                      <li class="coupon-item">
                          <div class="fixture-id">${betItemID}</div>
                          <div class="fixture-details">
                              <div class="home-team">${betItemHomeTeam}</div>
                              <div>-</div>
                              <div class="away-team">${betItemAwayTeam}</div>
                          </div>
                          <div class="fixture-bets">
                              <div class="user-bet-selection">${betItemSelection}</div>
                              <div class="user-bet-ratio">2.35</div>
                          </div>
                      </li>
                      
                  `;
                  
                  couponItemList.innerHTML += innerBetHistoryTemplate;
                  
              });

            });
          } 

        loggedInCard.style.display = "flex";
        notLoggedInCard.style.display = "none";

        mainSectionRightAside.style.display = "flex";

        return true;
    }else {
        return false;
    }
}//   Checked

const getDataFromApi = async(fixtureID) => {

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
}//   Checked

/* Blockchain Start */
async function connectWallet() {
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        console.log("Web3 instance created");
        try{
            await window.ethereum.request({ method: "eth_requestAccounts", });
            console.log("Ethereum enabled and accounts retrieved:");

            bettingContract = new web3.eth.Contract(contractABI, contractAddress);
            console.log("Contract instance created:", bettingContract);
        }catch (error) {
            if (error.code === -32002) {
                alert("Already pending request. Please wait.");
            } else {
                alert(`Error: ${error.message}`);
                console.error("Error:", error);
            }
        }
        
    } else {
        alert("MetaMask not detected. Please install MetaMask to use this feature.");
        console.error("MetaMask not detected");
    }
}//   Checked

window.onload = async () => {
    if (sessionStorage.getItem("isLoggedIn") === "true") {
        try {
            await connectWallet();
            console.log("Metamask reconnected on page load");
        } catch (error) {
            console.error("Error reconnecting Metamask on page load:", error);
        }
    }
};//   Checked
/* Blockchain End */

