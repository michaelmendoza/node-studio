# NodestudioJS - FrontEnd

The nodestudio frontend application is a react app

### Tech Stack

What frameworks were used?

- Built from stratch using ReactJS, D3, SASS, ThreeJS, and SocketIO
- Supports Create-React-App for development and production

### Frontend File Structure
```
/nodestudiojs/src
    /components - contains react application components
    /hooks - contains custom react hooks
    /libraries - contains  utility functions that don’t have side effects
    /models - contains javascript classes used as models in application state
    /services - contains functions that touch endpoints & communicate with APIs
    /state - contains app state and reducers (functions that modify state & have side-effects.)
    /styles -  scss styles
```