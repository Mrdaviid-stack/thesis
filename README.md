# JSAPI V2 
REACTCMS is a robust and feature-rich Front and backend developed with AdonisJS v6,InertiaJS and ReactJS, a modern javascript framework renowned for its elegance and efficiency. This Application serves as the core of your application, providing a scalable and secure solution for managing and processing data. Designed with best practices in mind, it offers a comprehensive set of functionalities to support a wide range of applications, from web platforms to mobile services.


___

## Requirements
- **Node.js** (22.0.0 or above) & **npm**

___

## Installation & Setup
- Create `.env` file in the root folder of project then copy all variable inside `.env.example`
- Open a terminal with the current directory set to the folder of this project and install the dependencies by running the following command:
`npm i`
- on the same terminal run the migration command `node ace migration:run` and for the seeder command `node ace db:seed`.
- Update database variable value in `.env`.  
NOTE: the default sql client is `MYSQL` if you using different client delete `database.ts` inside `config` folder after that run the following command 
`node ace add @adonisjs/lucid` it will prompt a choices for sql client choose what you prefer and `yes` for the remaining prompt. 

___

## Development
- Start the app in development mode by running `npm run dev`
- Open `http://localhost:3333` in the browser or any api client. (the port can be changed in `.env`)

___

## Deployment
- As a first step, you must create the production build of your AdonisJS application by running `node ace build`.
this will generate build folder in the root of project.
- Copy `.env` file in the root folder, then paste it to build folder, after that change `NODE_ENV` value to `production`.
- To start production mode run this following command:
`cd build`,
`node bin/server.js`
- Open `http://localhost:3333` in the browser or any api client. (the port can be changed in `.env`)
- For much more instruction about deployment just visit the deployment guide. `https://docs.adonisjs.com/guides/getting-started/deployment`.

___

## CLI
- First run this command to show all available command built-in Adonis.js. `node ace list`
- To run custom CLI just follow this command `node ace make:[controller,model,migration] MODULE\SUB_MODULE\FILE`
`MODULE` refers to parent directory, `SUB_MODULE` refers to sub directory, and the FILE is the name of controller, model, migration, and routes. e.g `Websites/Controllers/posts`. For best practices always capitalcase and plural the `Module` and `SUB_MODULE`,

___

## Note from original dev
This project is open for enhancement.

for Adonis.js reference just visit the official documetation `https://docs.adonisjs.com/guides/preface/introduction`.

Regards,
Mark
