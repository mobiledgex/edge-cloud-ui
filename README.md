# World map dashboard

### Run /server

##### You should run the express.js server to goto directory '/server' and fallow the README.MD
```
$ cd server
$ npm -- run start_server

```
### Run 
```
$ cd ..
$ npm install
$ HTTPS=true npm start
$ 
```
### Style Guid

| page Name | component  | css           | Description                  |
|-----------|------------|---------------|------------------------------|
| main      | main       | main.css      | All Main(color, layout etc.) |
|           | worldMap   | worldMap.css  | Color of map                 |
|           | line Chart | lineChart.css | Style of linechart           |


### External Library

    * map
    : react simpleMap
    
    * calendar
     http://adphorus.github.io/react-date-range/


### Using HTTPS

    * link : https://facebook.github.io/create-react-app/docs/using-https-in-development
    $ HTTPS=true npm start
