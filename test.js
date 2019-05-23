function merge(target, source) {
    for(key in source) {
        if(target[key]) {
            // 如果target存在和source一样的index（同一题目），在target中删除
            target[key].forEach((item, idx) => {
                if(source[key].some(value => value.index === item.index)) {
                    target[key].splice(idx, 1);
                }
            });
            target[key] = target[key].concat(source[key]);
            target[key].sort((firstEl, sencodeEl) => {
                return firstEl.index - sencodeEl.index;
            });
        }else {
            target[key] = source[key];
            target[key].sort((firstEl, sencodeEl) => {
                return firstEl.index - sencodeEl.index;
            });
        }
    }
    return target;
}

var target = {
    "0001": [
        {
            index: 0,
            answer: 'A'
        }
    ]
}
var source = {
    '0001': [
        {
            index: 0,
            answer: 'B'
        },
        {
            index: 1,
            answer: 'C'
        }
    ],
    '0002': [
        {
            index: 2,
            answer: 'D'
        },
        {
            index: 1,
            answer: 'D'
        }
    ]
};

console.log(merge(target, source));