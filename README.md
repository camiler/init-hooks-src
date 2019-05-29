## init-hooks-src

install using npm: 

`npm install --save-dev init-hooks-src`  

or yarn:   

`yarn add --dev init-hooks-src`   


Create a file with name is `menu.json` in the root directory of your project, like this: 
```
{
  "menu": ["example", "orderList", "dashboard", "home", "cashCar"]
}
```

then just: `init-hooks-src`

press enter to use default path './menu.json' and dist './src' or input dir to set path and dist

or 

`init-hooks-src --path ./menu1.json --dist ./src1`

Before run `init-hooks-src`, for example, your project structure may be like:
```
.
├── webpack.config.js
├── .gitignore
├── .babelrc
├── package.json
├── README.md
├── menu.json
```

After run `init-hooks-src`, it will help you make some containers and service api correspond to it, so the structure would be:
```
├── webpack.config.js
├── .gitignore
├── .babelrc
├── package.json
├── src
│   ├── container
│   │   ├── CashCar
│   │   │   ├── enum.js
│   │   │   └── index.js
│   │   ├── Dashboard
│   │   │   ├── enum.js
│   │   │   └── index.js
│   │   ├── Example
│   │   │   ├── enum.js
│   │   │   └── index.js
│   │   ├── Home
│   │   │   ├── enum.js
│   │   │   └── index.js
│   │   └── OrderList
│   │       ├── enum.js
│   │       └── index.js
│   ├── hooks
│   │   ├── useForceUpdate.js
│   │   └── useReactRouter.js
│   ├── index.js
│   ├── routes.js
│   ├── service
│   │   ├── api.js
│   │   ├── cashCar.js
│   │   ├── dashboard.js
│   │   ├── example.js
│   │   ├── home.js
│   │   └── orderList.js
│   └── store
│       └── index.js
├── README.md
├── menu.json
```

Now, you can delete menu.json, and start your code!
