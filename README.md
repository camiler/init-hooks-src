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
