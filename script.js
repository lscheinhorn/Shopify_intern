//this object stores important info
const info = {
    API_KEY: "RGkpWjhIy6gvbT7hNzAWpi46Le6zTIKAUqjdOXlC",
    ACCOUNT_ID: "cb241c79-b1fd-45dd-8067-36bdea054751" 
}

//http request for image data from apoc api
fetch(`https://api.nasa.gov/planetary/apod?api_key=${info.API_KEY}&count=3`)
    .then((response) => {
       //parsing JSON file to javascript object
        return response.json()
     })
    .then((data) => {
        console.log(data);
        //iterating through image objects to capture data
        data.forEach((imageObj) => {
            //create a div for image
            let newDiv = document.createElement("div");
            //create and append the image to parent div
            let img = document.createElement("img");
            img.src = imageObj.url;
            newDiv.appendChild(img);
            //create and append the title to parent div
            let title = document.createElement("h4");
            title.innerText = imageObj.title;
            newDiv.appendChild(title);
            //create and append the date to parent div
            let date = document.createElement("p");
            date.innerText = `Posted: ${imageObj.date}`;
            newDiv.appendChild(date);
            //create and append the description to parent div
            let description = document.createElement("p");
            description.innerText = imageObj.explanation;
            newDiv.appendChild(description);
            //append the new div to the 'main' section
            document.getElementById("main").appendChild(newDiv);
        })
    })
    

