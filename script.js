const info = {
    API_KEY: "RGkpWjhIy6gvbT7hNzAWpi46Le6zTIKAUqjdOXlC",
    ACCOUNT_ID: "cb241c79-b1fd-45dd-8067-36bdea054751" 
}

fetch(`https://api.nasa.gov/planetary/apod?api_key=${info.API_KEY}&count=3`)
    .then((response) => {
        return response.json()
     })
    .then((data) => {
        console.log(data);
        data.forEach((imageObj) => {
            let newDiv = document.createElement("div");
            let img = document.createElement("img");
            newDiv.appendChild(img);
            img.src = imageObj.url;
            document.getElementById("main").appendChild(newDiv);
        })
    })
    

