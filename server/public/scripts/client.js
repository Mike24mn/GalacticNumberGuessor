function onReady() {
  console.log("JavaScript is loaded!");
  console.log("Greetings from client.js, Welcome to Galaxy Guesser!");
  console.log(document.getElementById("winDiv"));
  console.log(document.getElementById("undertBody"));

  axios({
    method: "GET",
    url: "/guess",
  })
    .then(function (response) {
      // Code that will run on successful response
      // from the server.

      console.log("Stuff we fetchin'", response.data); // return data we fetchin' from the server in response to request

      const itemFromServer = response.data; // set variable equal to what we fetchin'

      console.log("Full item data:", itemFromServer);

      let tableOne = document.querySelector("#tableOne");
      tableOne.innerHTML = "";

      for (let item of itemFromServer) {
        if (item.guessOne && item.guessTwo) {
          tableOne.innerHTML += `<tr>
        <td><strong>${item.guessOne}</strong>: "${item.guessTwo}"
        </td></tr>`;
        }
      }

      fetchRandInt(function (intFromServer) {
        console.log("received intFromServer through callback:", intFromServer);
        for (let item of itemFromServer) {

          let winDiv = document.getElementById("winDiv");

          let undertBody = document.getElementById("undertBody");

          let guessOne = parseInt(item.playerOnesGuesses)

          let guessTwo = parseInt(item.playerTwosGuesses)

          console.log("Within fetchRandint, item.guessOne value is: ", item.guessOne);

          console.log("Within fetchRandint, item.guessTwo value is: ", item.guessTwo);
          

          if (
            guessOne === intFromServer &&
            guessTwo === intFromServer
          ) {
            winDiv.innerHTML = `<b>Both players TIE with the correct guess!</b><br/>`;
          } else if (
            guessOne < intFromServer &&
            guessTwo < intFromServer
          ) {
            winDiv.innerHTML = `<b>Both guessses are lower than the number!</b><br/>`;
          } else if (
            guessOne > intFromServer &&
            guessTwo > intFromServer
          ) {
            winDiv.innerHTML = `<b>Both guesses are higher than the number!</b><br/>`;
          } else if (
            guessOne > intFromServer &&
            guessTwo < intFromServer
          ) {
            winDiv.innerHTML = `<b>Player One's guess is higher and Player Two's guess is lower than the number!</b><br/>`;
          } else if (
            guessOne < intFromServer &&
            guessTwo > intFromServer
          ) {
            winDiv.innerHTML = `<b>Player One's guess is lower and Player Two's guess is higher then the number!</b><br/>`;
          } else if (
            guessOne === intFromServer &&
            guessTwo !== intFromServer
          ) {
            winDiv.innerHTML = `<b>Player One WINS! Player Two's doess not match the number.</b><br/>`;
          } else if (
            guessTwo === intFromServer &&
            guessOne !== intFromServer
          ) {
            winDiv.innerHTML = `<b>Player Two WINS! Player One's does not match the number.</b><br/>`;
          } else if (
            guessOne === intFromServer &&
            guessTwo < intFromServer
          ) {
            winDiv.innerHTML = `<b>Player One WINS! Player Two's guess is lower.</b><br/>`;
          } else if (
            guessOne === intFromServer &&
            guessTwo > intFromServer
          ) {
            winDiv.innerHTML = `<b>Player One WINS! Player Two's guess is higher.</b><br/>`;
          } else if (
            guessTwo === intFromServer &&
            guessOne < intFromServer
          ) {
            winDiv.innerHTML = `<b>Player Two WINS! Player One's guess is lower.</b><br/>`;
          } else if (
            guessTwo === intFromServer &&
            guessOne > intFromServer
          ) {
            winDiv.innerHTML = `<b>Player Two WINS! Player One's guess is higher.</b><br/>`;
          }
        }
        fetchCounter();

      });
    })
    .catch(function (error) {
      // Code that will run on any errors from the server.
      console.log(error);
      alert("Something bad happened! Check the console for more details.");
    });
}

function fetchRandInt(callback) {
  axios
    .get("/randint")
    .then(function (response) {
      console.log(
        "The random int was sent from server and it is: ",
        response.data.randomInt
      );

      callback(response.data.randomInt)

      intFromServer = response.data.randomInt;
    })
    .catch(function (error) {
      console.log("didn't fetch random int!!!");
    });
}



function fetchCounter() {
  axios
    .get("/count")
    .then(function (response) {
      let totalElement = document.getElementById("totalVal");
      totalElement.textContent = response.data.count;
      console.log("current total:", response.data.count);
    })
    .catch(function (error) {
      console.log("didnt fetch counter", error);
    });
}

function handleSubmit(event) {
  console.log("handle submit works...");
  event.preventDefault();

  let messageOutput = document.getElementById("messages");

  const guessInputOne = document.getElementById("playerone").value;

  const guessInputTwo = document.getElementById("playertwo").value;

  console.log(`incoming information: ${guessInputOne} ${guessInputTwo}`);

  if (
    guessInputOne >= 0 &&
    guessInputTwo <= 25 &&
    guessInputTwo >= 0 &&
    guessInputOne <= 25 &&
    guessInputOne.length > 0 &&
    guessInputTwo > 0
  ) {
    axios({
      method: "POST",
      url: "/guess",
      data: {
        playerOnesGuesses: guessInputOne,
        playerTwosGuesses: guessInputTwo,
      },
    })
      .then(function (response) {
        console.log("Guesses Added:", response);
        document.getElementById("tableOne").innerHTML += `<tr>
        <td>Player One's Guess Is: ${guessInputOne} Player Two's Guess Is:${guessInputTwo}
        </td></tr>`;
        document.getElementById("playerone").value = "";
        document.getElementById("playertwo").value = "";
        fetchCounter();
      })

      .catch(function (error) {
        console.log(error);
        messageOutput.innerHTML = "Error, failed to process any guesses!";
      });
  } else {
    messageOutput.innerHTML =
      "* Missing information, please ensure Guess one and Guess two are filled out prior to submission and numbers are within the range 0-25!!!";
  }
}

onReady();