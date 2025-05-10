# ICP-Developer Project 
Quick example of a certification project using the *Internet Computer Protocol* to develop a simple social network.

## Details:
* Fronted developed using React
* Backend implented in canister social writed in Motoko lenguage. Cointains the following callable methods:
    *  whoami () -> Principal : Returns the principal of the caller 
    *  createPost (Text, Text) -> () : inputs are a description if an image and the image URL, it appends the information to an account associed to callers principal
    *  getPosts () -> [(Text, Post)] : Post its a personalized type, it contains information of createPost and its principal account
    *  getPost (Text) -> ?Post : same case of above for an specific post selected by and id
    *  updatePost (Text, Text) -> Bool : Change the image description (also called message) selected by the post's id
    *  deletePost (Text) -> Bool : Delete the selected post
 
# Instructions to local deployment
To get started, run the following commands
* Install dependencies with: `npm install`
* Inicialize the ICP's network local replica: `dfx start --background --clean`
* Generate the .did files, **important** to connect backend with frontend. `dfx generate` This might cause an ignorable panic error, just go ahead with the next steps
* Deploy the canisters on local network: `dfx deploy`
* Inicialize and access to the frontend: `npm run serve`

# Functionality 
* To proceed an update image an fetch posts, users will need to login to internet identity first. 
* Once logged in, the users will be able to create a new post completing the descripction and image URL fields, you can proceed clicking "Create" button or pressing enter.
* You can edit post's description or delete any post.
* If posts dont refresh automatically please, click on "Refresh" button.