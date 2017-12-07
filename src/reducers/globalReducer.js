const initState = {};

const global = (state = initState, action) => {
    switch (action.type) {
        case 'a': {
            return {};
        }
        case 'b': {
            return {};
        }
    }
    return state;
};

export default global;
