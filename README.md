# ElectronWhiteboard
A whiteboard app with a group chat feature. It's created with React, Electron, and Chatkit.

You can read the tutorial at:

- [Create a Whiteboard app with React - Part 1: Adding the whiteboard](https://pusher.com/tutorials/whiteboard-electron-react-part-1)
- [Create a Whiteboard app with React - Part 2: Adding the group chat](https://pusher.com/tutorials/whiteboard-electron-react-part-2)

### Prerequisites

- [Node.js](https://nodejs.org/en/)
- [Yarn](https://yarnpkg.com/en/)
- [Pusher Channels app instance](https://pusher.com/channels)
- [Chatkit app instance](https://pusher.com/chatkit)

## Getting Started

1. Clone the repo:

```
git clone https://github.com/anchetaWern/ElectronWhiteboard.git
cd ElectronWhiteboard
```

2. Copy the `node_modules/react-sketch/dist/index.js` file somewhere else and delete the `node_modules` folder.

3. Install the dependencies:

```
yarn
```

4. Update `.env` and `server/.env` file with your credentials.

5. Paste the `node_modules/react-sketch/dist/index.js` file that you copied earlier to your project. 

6. Run the app:

```
yarn start
yarn electron-dev
```


## Built With

- [Electron](https://electronjs.org/)
- [React](https://reactjs.org/)
- [Pusher Channels](https://pusher.com/channels)
- [Pusher Chatkit](https://pusher.com/chatkit)
