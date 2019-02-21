# World map dashboard

### Run 
```
$ npm install
$ npm start
```
### Run on Daemon
```
$ cd server
$ pm2 start npm -- run start_server
$ cd ..
$ pm2 start npm -- start
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
