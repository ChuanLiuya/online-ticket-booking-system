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