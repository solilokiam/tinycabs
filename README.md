# TinyCab

This project is a simple dashboard that extracts data from a tinybird [API endpoint](https://api.tinybird.co/endpoint/t_f3b68895534049bf859f38a8e5ebc51a?token=p.eyJ1IjogIjdmOTIwMmMzLWM1ZjctNDU4Ni1hZDUxLTdmYzUzNTRlMTk5YSIsICJpZCI6ICJmZTRkNWFiZS05ZWIyLTRjMjYtYWZiZi0yYTdlMWJlNDQzOWEifQ.P67MfoqTixyasaMGH5RIjCrGc0bUKvBoKMwYjfqQN8c).

## Decisions
### Product
After reviewing the data from the endpoint it came clear that this endpoint returns information about cab rides.
My ideal dashboard would have been a map to place all rides but unfortunately origin and destination are quite available.
So the next important thing is get some numbers about revenue and rides. After displaying this information I decided to be able to filter in a timespan manner but also being able to filter by vendor.

### Tech
This project uses [serve](https://github.com/vercel/serve) as development server to make things easier.
I have also decided to not add any kind of 3rd party library for timepickers as I believe it's out of the scope.

## Design
The dashboard looks like:

![Dashboard Screenshot](/assets/screenshot.png?raw=true)

## How to start the project.
### Requirements
This project runs with:
- Node: v14
- yarn: v1.22

### How To Start
Install dependencies
```
yarn install
```
Start the server
```
yarn start
```
Open your browser on http://localhost:3000/

## Testing
Having that testing this app from a unit point of view can be tricky. I have decided to go to an End-2-End aproach using [cypress](https://www.cypress.io/). At the same time I've added a GH actions workflow to ease the automatic process when doing PR's.

If you want to run the tests on your local env there are 2 scripts available:

```
yarn test
```

Opens cypress suite

```
yarn test:ci
```

Runs cypress in command line.
