console.log("this is a PostMaster clone app");

// utility function to get DOM Element form the string
function getElementFormString(string) {
  let div = document.createElement("div");
  div.innerHTML = string;
  return div.firstElementChild;
}

// initialize no of parameters
let addedParamsCount = 0;

// hide the parameter box initaially
let parametersBox = document.getElementById("parametersBox");
parametersBox.style.display = "none";

// if the user clicks on params, hide the json box

let paramsRadio = document.getElementById("paramsRadio");
paramsRadio.addEventListener("click", () => {
  document.getElementById("requestJsonBox").style.display = "none";
  document.getElementById("parametersBox").style.display = "block";
});

// if the user clicks on json, hide the params box
let jsonRadio = document.getElementById("jsonRadio");
jsonRadio.addEventListener("click", () => {
  document.getElementById("parametersBox").style.display = "none";
  document.getElementById("requestJsonBox").style.display = "block";
});

// if user clicks on + button add more parameters
let addParam = document.getElementById("addParam");
addParam.addEventListener("click", (e) => {
  e.preventDefault();

  let params = document.getElementById("params");
  let string = `<form class="row g-2 my-2">
          <label for="url" class="col-sm-2 col-form-label"
            ><b>Parameter ${addedParamsCount + 2}</b></label
          >
          <div class="col-md-3">
            <input
              type="text"
              class="form-control"
              id="parameterKey${addedParamsCount + 2}"
              placeholder="Enter Parameter ${addedParamsCount + 2} key"
            />
          </div>
          <div class="col-md-3">
            <input
              type="text"
              class="form-control"
              id="parameterValue${addedParamsCount + 2}"
              placeholder="Enter Parameter ${addedParamsCount + 2} value"
            />
          </div>
          <!--button-->
          <button  class="btn btn-primary deleteParam col-sm-1">-</button>
        </form>`;
  // convert the string element to DOM node
  let paramElement = getElementFormString(string);
  console.log(paramElement);
  params.appendChild(paramElement);

  // Add a event listener to remove the parameter on clicking delete button
  let deleteParam = document.getElementsByClassName("deleteParam");
  for (item of deleteParam) {
    item.addEventListener("click", (e) => {
      e.preventDefault();
      e.target.parentElement.remove();
    });
  }

  addedParamsCount++;
});

// if user clicks on the submit button
let submit = document.getElementById("submit");
submit.addEventListener("click", () => {
  // show Please wait in the response box

  // document.getElementById("responseJson").value =
  //   "Please Wait... We are Fetching Your Response..";
  document.getElementById("responsePrism").innerHTML =
    "Please Wait... We are Fetching Your Response..";
  Prism.highlightAll();

  // fetch all the values user entered
  let url = document.getElementById("url").value;
  let requestType = document.querySelector(
    'input[name = "requestType"]:checked'
  ).value;
  let contentType = document.querySelector(
    'input[name = "contentType"]:checked'
  ).value;

  // if user has params option instead of json, collect all teh parameters in an object
  if (contentType == "params") {
    // creat a blank object
    data = {};
    for (i = 0; i < addedParamsCount + 1; i++) {
      if (document.getElementById("parameterKey" + (i + 1)) != undefined) {
        let key = document.getElementById("parameterKey" + (i + 1)).value;
        let value = document.getElementById("parameterValue" + (i + 1)).value;
        data[key] = value;
      }
    }
    data = JSON.stringify(data);
  } else {
    data = document.getElementById("requestJsonText").value;
  }
  // log all the value for debugging
  console.log("URL is ", url);
  console.log("requestType  is ", requestType);
  console.log("contentType  is ", contentType);
  console.log("data  is ", data);

  // if request type is get use the fetch API, we can also use XHR request

  if (requestType == "GET") {
    fetch(url, {
      method: "GET",
    })
      .then((response) => response.text())
      .then((text) => {
        // let response = (document.getElementById("responseJson").value =
        //   text);
        let response = (document.getElementById("responsePrism").innerHTML =
          text);
        Prism.highlightAll();
      });
  } else {
    fetch(url, {
      method: "POST",
      body: data,
      headers: {
        "Content-type": "application/json",
      },
    })
      .then((response) => response.text())
      .then((text) => {
        // let response = (document.getElementById("responseJsonText").value =
        let response = (document.getElementById("responsePrism").innerHTML =
          text);
        Prism.highlightAll();
      });
  }
});
