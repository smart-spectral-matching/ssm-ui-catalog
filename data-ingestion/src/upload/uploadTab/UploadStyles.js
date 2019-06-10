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
    width: 100
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
  },
  filename: {
    display: 'flex',
    flexDirection: 'row',
    flex: 1,
    marginBottom: 0,
    fontSize: 24,
    color: '#555'
  },
  row: {
    display: 'flex',
    flex: 5,
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: 120,
    width: 600,
    padding: 8,
    overflow: 'hidden',
    boxSizing: 'border-box'
  },
  progressWrapper: {
    alignItems: 'center'
  },
  checkIcon: {
    opacity: 0.5,
    marginLeft: 32
  },
  actions: {
    display: 'flex',
    flex: 1,
    width: 100,
    alignContent: 'right',
    flexDirection: 'column',
    marginTop: 32
  },
  button: {
    fontFamily: '"Roboto medium", sans-serif',
    fontSize: 14,
    display: 'inline-block',
    height: 36,
    minWidth: 88,
    padding: '6px 16px',
    lineHeight: 1.42857143,
    textAlign: 'center',
    whiteSpace: 'nowrap',
    verticalAlign: 'middle',
    msTouchAction: 'manipulation',
    touchAction: 'manipulation',
    cursor: 'pointer',
    WebkitUserSelect: 'none',
    MozUserSelect: 'none',
    msUserSelect: 'none',
    userSelect: 'none',
    border: 0,
    borderRadius: 2,
    background: 'rgb(204, 39, 39)',
    color: '#fff',
    outline: 0
  },
  buttonDisabled: {
    background: 'rgb(189, 189, 189)',
    cursor: 'default'
  }
}

export default uploadStyles;
