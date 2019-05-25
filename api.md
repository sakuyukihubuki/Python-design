# 注册
接口地址：/api/register  
请求方式：POST   
参数：
| 参数名 | 含义 |
| --- | --- |
| username | 用户名 |
| pwd | 密码 |
返回值：
| 可能的值 | 类型 | 含义 |
| --- | --- |--- |
| 0 | 数值 | 用户名为空 |
| 1 | 数值 | 密码为空 |
| 2 | 数值 | 用户已存在 |  
| true | 布尔 | 注册成功 |
| false | 布尔 | 因服务器错误等原因注册失败 |

# 登录
接口地址：/api/login  
请求方式：POST  
参数：
| 参数名 | 类型 | 含义 |
| --- | --- | --- |
| username | 字符串 | 用户名 |
| pwd | 字符串 | 密码 |  
返回值：
| 可能的值 | 类型 | 含义 |
| --- | --- |--- |
| true | 布尔 | 登录成功 |
| false | 布尔 | 登录失败 |

# 试卷答案提交
接口地址：/api/commitPaper  
请求方式：POST  
参数：
| 参数名 | 类型 | 含义 |
| --- | --- | --- |
| paperId | 字符串 | 试卷ID |
| answers | 数组 | 答案 | 
返回值：  
| 可能的值 | 类型 | 含义 |
| --- | --- | --- |
| true | 布尔 | 登录成功 |
| false | 布尔 | 登录失败 |
> 补充：  
answers数组中的元素应该是`{"index": 0; "answer": ""}`的格式。而且应该按照答题顺序排序。

* 按类型按照提交
接口的地址：/api/commitAnswersByType
请求方式：POST
参数：
| 参数名 | 类型 | 含义 |
| --- | --- | --- |
| answers | 数组 | 答案 | 
返回值：  
| 可能的值 | 类型 | 含义 |
| --- | --- | --- |
| true | 布尔 | 登录成功 |
| false | 布尔 | 登录失败 |
> 补充：  
answers数组中的元素的格式应该是：
```js
{
    "paperId": "", // 题目所在试卷id
    "index": "", // 题号
    "answer": "", // 用户答案
}
```

# 获取试卷列表
接口地址：/api/paperList  
请求方式：GET  
参数：
| 参数名 | 类型 | 含义 |
| --- | --- | --- |
| count | 数值 | 每页显示count条信息 |
| page | 数值 | 当前页码 |
返回值：
```json
{
    "totalPage": , // 数值类型，页数
    // 数组类型，结果
    "result": [
        {
            "_id": "", // 字符串类型，试卷id
            "name": "", // 字符串类型，试卷名字
        },
        ......
    ]
}
```
# 获取试卷内容 
接口地址：/api/paperDetail  
请求方式：GET  
参数：  
| 参数名 | 类型 | 含义 |
| --- | --- | --- |
| paperId | 字符串 | 试卷ID |
返回值：   
```json
{
    "_id": "", // 字符串类型，试卷id
    // 数组类型，题目
    "questions" : [
        {
            "_id": "", // 字符串类型，试卷id
            "index": , // 数组类型，题目在试卷中的索引
            "content": "", // 字符串类型，题目内容
            "type": "", // 题目类型
            "answer": "", // 题目答案
            "explain": "" // 答案解释
        },
        ......
    ]
}
```
# 按题目类型获取题目
接口地址：/api/questionByType  
请求地址：GET  
参数：
| 参数名 | 类型 | 含义 |
| --- | --- | --- |  
| type | 字符串 | 题目类型 |
| count | 数值 | 每页显示count条信息 |
| page | 数值 | 当前页码 |
返回值：  
```json
{
    "totalPage": , // 数值类型，全部页数
    // 数组类型，题目结果
    "result": [
        {
            "_id": "", // 字符串类型，试卷id
            "index": , // 数组类型，题目在试卷中的索引
            "content": "", // 字符串类型，题目内容
            "type": "", // 题目类型
            "answer": "", // 题目答案
            "explain": "" // 答案解释
        },
        ......
    ]
}
```

# 提交用户评论（排好序的-->同一题目的评论放到一起）
接口地址：/api/discussForPaperOrderByQuestion
请求方式：get
参数：
| 参数名  | 类型 | 含义 |
| --- | --- | --- |
| paperId | string | 试卷id |
| isSort | string | 是否排序 | 置为'true' or 'false'
返回值
```json
// 未排序的
{
    "_id": "1234567891011",
    "totalCount": 3,
    "result": [
        {
            "discussId": "3543543543435",
            "index": 1,
            "username": "myl",
            "comment": "sdfsdf",
            "time": "2131231",
            "star": "12",
            "cai": "0"
        },
        {
            "discussId": "3543543543464",
            "index": 2,
            "username": "myl",
            "comment": "sdfsdf",
            "time": "2131231",
            "star": "12",
            "cai": "0"
        },
        {
            "discussId": "3543543543434",
            "index": 0,
            "username": "myl",
            "comment": "sdfsdf",
            "time": "2131231",
            "star": "12",
            "cai": "0"
        }
    ]
}
// 排序的
{
    "_id": "1234567891011",
    "totalCount": 3, // 评论总数
    "result": {
        // 第一题所有的评论
        "0": [
            {
                "discussId": "3543543543434",
                "index": 0,
                "username": "myl",
                "comment": "sdfsdf",
                "time": "2131231",
                "star": "12",
                "cai": "0"
            }
        ],
        // 第二题所有的评论
        "1": [
            {
                "discussId": "3543543543435",
                "index": 1,
                "username": "myl",
                "comment": "sdfsdf",
                "time": "2131231",
                "star": "12",
                "cai": "0"
            }
        ],
        "2": [
            {
                "discussId": "3543543543464",
                "index": 2,
                "username": "myl",
                "comment": "sdfsdf",
                "time": "2131231",
                "star": "12",
                "cai": "0"
            }
        ]
    }
}
```

# 获取特定题目的用户评论
接口地址：/api/discussForQuestion
请求方式：GET
参数：

| 参数名 | 类型 | 含义 |
| --- | --- | --- |
| paperId | string | 试卷id |
| index | number | 题目序号 |

返回值：
```json
[
    {
        "discussId": "",
        "username": "",
        "say": "",
        "time": "",
        "star": "",
        "cai": ""
    }
]
```

# 提交讨论
接口地址：/api/discuss/commit
请求方式：post
参数：
| 参数名 | 类型 | 含义 |
| --- | --- | --- |
| paperId | string | 试卷id |
| index | number | 题目序号 |
| comment | string | 用户评论 |
返回值：
true 或者 false

# 点赞
接口地址：/api/discuss/star
请求方式：post
参数：
| 参数名 | 类型 | 含义 |
| --- | --- | --- |
| discussId | string | 评论id |
返回值：
true 或者 false

# 踩
接口地址：/api/discuss/cai
请求方式：post
参数：
| 参数名 | 类型 | 含义 |
| --- | --- | --- |
| discussId | string | 评论id |
返回值：
true 或者 false


