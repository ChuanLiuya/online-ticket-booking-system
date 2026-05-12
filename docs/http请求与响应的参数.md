# http请求与响应的参数

## 参数对应关系

|        | 路径参数 | 查询参数 | 请求体 |
| ------ | -------- | -------- | ------ |
| axios  | url拼入  | params   | data   |
| nestjs | params   | query    | body   |

## 示例代码

### axios 示例
```javascript
// 路径参数
axios.get(`/api/users/${userId}`);

// 查询参数
axios.get('/api/users', {
  params: { page: 1, limit: 10 }
});

// 请求体
axios.post('/api/users', {
  name: 'John',
  email: 'john@example.com'
});
```
### nestjs 示例
```typescript 
// 路径参数
@Get('/users/:id')
getUser(@Param('id') id: string) {
  // 处理逻辑
}

// 查询参数
@Get('/users')
getUsers(@Query() query: { page: number; limit: number }) {
  // 处理逻辑
}

// 请求体
@Post('/users')
createUser(@Body() user: CreateUserDto) {
  // 处理逻辑
}
```

## axios 示例
```javascript
{
  // `data` 由服务器提供的响应
  data: {},

  // `status` 来自服务器响应的 HTTP 状态码
  status: 200,

  // `statusText` 来自服务器响应的 HTTP 状态信息
  statusText: 'OK',

  // `headers` 是服务器响应头
  // 所有的 header 名称都是小写，而且可以使用方括号语法访问
  // 例如: `response.headers['content-type']`
  headers: {},

  // `config` 是 `axios` 请求的配置信息
  config: {},

  // `request` 是生成此响应的请求
  // 在node.js中它是最后一个ClientRequest实例 (in redirects)，
  // 在浏览器中则是 XMLHttpRequest 实例
  request: {}
}
```