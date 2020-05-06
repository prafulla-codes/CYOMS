# Contribution Guidelines

CYOMS is a desktop application created using the **electron.js** framework.

Anyone with the basic knowledge of **HTML, CSS and JS** can make their contribution to this project.

## Start Contributing

1. Click here to [Fork](https://github.com/Pika1998/CYOMS/fork) the repository (This will create your own remote repository copy of CYOMS)

2. Clone your forked copy of the repository using `git clone https://github.com/${yourUsername}/CYOMS`

3. Go into your cloned repository and then into the app directory using terminal/cmd `cd CYOMS/app`.

4. Execute `npm install` command to install the required packages (Note that NodeJS is mandatory for this project to work)

5. `npm run dev` will get CYOMS up and running!

## Join Our Slack

Feel free to join our community on slack

[<img src="resources/images/join_slack.png" width=50% height=40%>](https://join.slack.com/t/cyomsdevelopers/shared_invite/zt-e730tphg-_IelnN26kcCGkbsZTjjVSQ)


## File Structure

The entire application is packaged in the **app** folder.
```js
-app
|-resources 
   | -icons // Contains all the icons
   | -images // Contains images
|-src
   | -css // CSS files required
   | -js  // Script files except the main.js script
   | -createVanillaWindow.html // HTML View for creating vanilla server.
   | -main.js // Main Flow of the application
   | -mainWindow.html // HTML View for the landing page of application. 
|-tests 
   | -test.spec.js // Write all tests here
|-build.js // To Create Windows Installer from Windows Build
|-debian.json // Required to create debian package
```
## Testing and Debugging

This application uses **mocha and chai** for a testing environment.

Tests are written in `app/tests`. You can run the tests using `npm run test`

Running the application the development environment using `npm run dev` will give you the **Dev Tools** to debug your applications output.


## Sending a Pull Request
- Create a branch in your forked repository with a relevant name (`e.g enhanced-styling`, `feature-autoreload`)
- Push your changes to the branch
- Create a pull request from your branch to `master` of my branch.

