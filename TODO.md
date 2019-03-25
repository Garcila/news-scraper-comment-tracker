Set mLab provision
[] - Create Heroku app in your project directory
[] - Run in terminal `heroku addons:create mongolab`
[] - When you go to connect your mongo database to mongoose, do so the following way: 

      ```js
      // If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
      var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

      mongoose.connect(MONGODB_URI);
      ```

The app should:
[x] - Scrape stories from a new outlet when visited and stories saved to db
[x] - Should scrape and save:
  [x] - Headline
  [x] - Summary
  [x] - URL
  [x] - optional photos
[] - Users should be able to leave comments. Modal??. These will be saved to the db and associated with their articles
[] - Users should be able to delete comments. Button besides the comment
[] - All comments are visible to every user
[] - Should not save duplicate entries.  Needs to be fixed.  Github Issue

[] - CSS it

[] - Deploy to Heroku

[] - Complete README
