function mergeStyles(args) {
    var result = {};
    for(var i=0; i < args.length; i++) {
        if(args[i]) {
            Object.assign(result, args[i]);
        }
    }
    return result;
}

export default mergeStyles;