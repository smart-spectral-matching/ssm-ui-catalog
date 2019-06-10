const uploadStyles = {
  upload: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    alignItems: 'flex-start',
    textAlign: 'left',
    overflow: 'hidden'
  },
  content: {
    display: 'flex',
    flexDirection: 'row',
    paddingTop: 16,
    boxSizing: 'border-box',
    width: 1
  },
  title: {
    marginBottom: 32,
    color: '#555'
  },
  files: {
    marginLeft: 32,
    alignItems: 'flex-start',
    justifyItems: 'flex-start',
    flex: 1
  }
}

export default uploadStyles;

/*
  files: {
    marginLeft: 32,
    alignItems: 'flex-start',
    justifyItems: 'flex-start',
    flex: 1,
    overflowY: 'auto'
  }



.Actions {
  display: flex;
  flex: 1;
  width: 100%;
  align-items: flex-end;
  flex-direction: column;
  margin-top: 32px;
}


.Filename {
  display: flex;
  flex-direction: row;
  flex: 1;
  margin-bottom: 0px;
  font-size: 24px;
  color: #555;
}

.Row {
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: space-between;
  height: 120px;
  padding: 8px;
  overflow: hidden;
  box-sizing: border-box;
}

.CheckIcon {
  opacity: 0.5;
  margin-left: 32px;
}

.ProgressWrapper {
  display: flex;
  flex: 1;
  flex-direction: row;
  align-items: center;
}

button {
  font-family: "Roboto medium", sans-serif;
  font-size: 14px;
  display: inline-block;
  height: 36px;
  min-width: 88px;
  padding: 6px 16px;
  line-height: 1.42857143;
  text-align: center;
  white-space: nowrap;
  vertical-align: middle;
  -ms-touch-action: manipulation;
  touch-action: manipulation;
  cursor: pointer;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  border: 0;
  border-radius: 2px;
  background: rgb(204, 39, 39);
  color: #fff;
  outline: 0;
}

button:disabled {
  background: rgb(189, 189, 189);
  cursor: default;
}
*/